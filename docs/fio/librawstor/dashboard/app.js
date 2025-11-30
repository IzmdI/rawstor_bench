function createSafeClassName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

class DashboardApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.currentData = null;
        this.charts = new Map();
        
        // Управление видимостью операций
        this.visibleConfigOperations = new Set(['read']); // По умолчанию только read
        this.visibleBranchOperations = new Set(['read']); // По умолчанию только read

        // Управление видимостью групп
        this.visibleConfigGroups = new Set();
        this.visibleBranchGroups = new Set();
        
        this.configGroups = new Set();
        this.branchGroups = new Set();
    }

    async init() {
        console.log('Initializing dashboard...');
        
        const params = this.getUrlParams();
        if (params.days !== '30') {
            d3.select('#timeRange').property('value', params.days);
        }
        
        try {
            await this.loadData();
            this.collectGroups();
            this.createLegends();
            this.createCharts();
            this.setupEventListeners();
            this.updateDataInfo();
            
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.displayError(error);
        }
    }

    async loadData() {
        this.currentData = await this.dataLoader.loadData();
        console.log('Data loaded successfully');
    }

    // Собираем группы отдельно для конфигураций и веток
    collectGroups() {
        this.configGroups.clear();
        this.branchGroups.clear();
        
        // Собираем группы из графиков с конфигурациями
        const configCharts = ['chart-iops-config', 'chart-latency-config'];
        const branchCharts = ['chart-iops-branch', 'chart-latency-branch'];
        
        configCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart && chart.groups) {
                chart.groups.forEach(group => this.configGroups.add(group));
            }
        });
        
        branchCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart && chart.groups) {
                chart.groups.forEach(group => this.branchGroups.add(group));
            }
        });
        
        // Показываем все группы по умолчанию
        this.configGroups.forEach(group => this.visibleConfigGroups.add(group));
        this.branchGroups.forEach(group => this.visibleBranchGroups.add(group));
    }

    createCharts() {
        if (!this.currentData?.charts) {
            throw new Error('No chart data available');
        }

        const timeRangeDays = this.currentData.filter?.days || 30;

        const chartsConfig = [
            {
                id: 'chart-iops-config',
                title: 'IOPS (by Config)',
                yLabel: 'kIOPS',
                dataKey: 'iops',
                groupBy: 'config',
                timeRangeDays: timeRangeDays,
                legendType: 'config',
                metricType: 'iops',
                visibleOperations: Array.from(this.visibleConfigOperations)
            },
            {
                id: 'chart-latency-config',
                title: 'Latency (by Config)',
                yLabel: 'ms',
                dataKey: 'latency',
                groupBy: 'config',
                timeRangeDays: timeRangeDays,
                legendType: 'config',
                metricType: 'latency',
                visibleOperations: Array.from(this.visibleConfigOperations)
            },
            {
                id: 'chart-iops-branch',
                title: 'IOPS (by Branch)',
                yLabel: 'kIOPS',
                dataKey: 'iops',
                groupBy: 'branch',
                timeRangeDays: timeRangeDays,
                legendType: 'branch',
                metricType: 'iops',
                visibleOperations: Array.from(this.visibleBranchOperations)
            },
            {
                id: 'chart-latency-branch',
                title: 'Latency (by Branch)',
                yLabel: 'ms',
                dataKey: 'latency',
                groupBy: 'branch',
                timeRangeDays: timeRangeDays,
                legendType: 'branch',
                metricType: 'latency',
                visibleOperations: Array.from(this.visibleBranchOperations)
            }
        ];

        chartsConfig.forEach(config => {
            let chartData = [];
            
            if (config.metricType === 'iops') {
                // Комбинируем IOPS read и write данные
                const iopsReadData = this.currentData.charts[`iops_read_by_${config.groupBy}`] || [];
                const iopsWriteData = this.currentData.charts[`iops_write_by_${config.groupBy}`] || [];
                
                chartData = [
                    ...iopsReadData.map(d => ({ ...d, metric: 'iops_read', dataKey: `iops_read_by_${config.groupBy}` })),
                    ...iopsWriteData.map(d => ({ ...d, metric: 'iops_write', dataKey: `iops_write_by_${config.groupBy}` }))
                ];
            } else if (config.metricType === 'latency') {
                // Комбинируем Latency read и write данные
                const latencyReadData = this.currentData.charts[`latency_read_by_${config.groupBy}`] || [];
                const latencyWriteData = this.currentData.charts[`latency_write_by_${config.groupBy}`] || [];
                
                chartData = [
                    ...latencyReadData.map(d => ({ ...d, metric: 'latency_read', dataKey: `latency_read_by_${config.groupBy}` })),
                    ...latencyWriteData.map(d => ({ ...d, metric: 'latency_write', dataKey: `latency_write_by_${config.groupBy}` }))
                ];
            }

            if (chartData && chartData.length > 0) {
                const chart = createChart({
                    container: d3.select(`#${config.id}`),
                    title: config.title,
                    yLabel: config.yLabel,
                    data: chartData,
                    accessor: d => d.value,
                    id: config.id,
                    groupBy: config.groupBy,
                    timeRangeDays: timeRangeDays,
                    legendType: config.legendType,
                    metricType: config.metricType,
                    visibleOperations: config.visibleOperations
                });
                this.charts.set(config.id, chart);
            } else {
                console.warn(`No data for chart: ${config.id}`);
                d3.select(`#${config.id}`).html('<p class="no-data">No data available</p>');
            }
        });

        // Применяем фильтрацию по умолчанию (только read)
        this.updateAllChartsVisibility();
    }

    createLegends() {
        this.createConfigLegend();
        this.createBranchLegend();
    }

    createConfigLegend() {
        const legendContainer = d3.select('#legend-config');
        legendContainer.html('');
        
        if (this.configGroups.size === 0) {
            legendContainer.html('<p style="color: #6c757d; font-style: italic;">No configuration data</p>');
            return;
        }

        // Добавляем переключатель операций
        const operationToggle = legendContainer.append('div')
            .attr('class', 'operation-toggle');
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleConfigOperations.has('read') && !this.visibleConfigOperations.has('write') ? 'active' : ''}`)
            .text('Read Only')
            .on('click', () => {
                this.setConfigOperations(['read']);
            });
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleConfigOperations.has('write') && !this.visibleConfigOperations.has('read') ? 'active' : ''}`)
            .text('Write Only')
            .on('click', () => {
                this.setConfigOperations(['write']);
            });
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleConfigOperations.has('read') && this.visibleConfigOperations.has('write') ? 'active' : ''}`)
            .text('Both')
            .on('click', () => {
                this.setConfigOperations(['read', 'write']);
            });

        // Создаем группы для каждой конфигурации
        const configsArray = Array.from(this.configGroups);
        
        configsArray.forEach((config, configIndex) => {
            const groupContainer = legendContainer.append('div').attr('class', 'legend-group');
            
            // Заголовок группы (кликабельный)
            groupContainer.append('div')
                .attr('class', 'legend-group-title')
                .style('cursor', 'pointer')
                .text(config)
                .on('click', () => {
                    this.toggleConfigGroup(config);
                });

            // Легенда для группы (один цвет)
            const legendItem = groupContainer.append('div')
                .attr('class', `legend-item ${this.visibleConfigGroups.has(config) ? '' : 'disabled'}`)
                .on('click', (event) => {
                    event.stopPropagation(); // Предотвращаем всплытие
                    this.toggleConfigGroup(config);
                });

            legendItem.append('span')
                .attr('class', 'legend-color')
                .style('background-color', getColor(configIndex));

            legendItem.append('span')
                .attr('class', 'legend-label')
                .text('Read/Write');
        });
    }

    createBranchLegend() {
        const legendContainer = d3.select('#legend-branch');
        legendContainer.html('');
        
        if (this.branchGroups.size === 0) {
            legendContainer.html('<p style="color: #6c757d; font-style: italic;">No branch data</p>');
            return;
        }

        // Добавляем переключатель операций
        const operationToggle = legendContainer.append('div')
            .attr('class', 'operation-toggle');
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleBranchOperations.has('read') && !this.visibleBranchOperations.has('write') ? 'active' : ''}`)
            .text('Read Only')
            .on('click', () => {
                this.setBranchOperations(['read']);
            });
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleBranchOperations.has('write') && !this.visibleBranchOperations.has('read') ? 'active' : ''}`)
            .text('Write Only')
            .on('click', () => {
                this.setBranchOperations(['write']);
            });
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleBranchOperations.has('read') && this.visibleBranchOperations.has('write') ? 'active' : ''}`)
            .text('Both')
            .on('click', () => {
                this.setBranchOperations(['read', 'write']);
            });

        // Создаем группы для каждой ветки
        const branchesArray = Array.from(this.branchGroups);
        
        branchesArray.forEach((branch, branchIndex) => {
            const groupContainer = legendContainer.append('div').attr('class', 'legend-group');
            
            // Заголовок группы (кликабельный)
            groupContainer.append('div')
                .attr('class', 'legend-group-title')
                .style('cursor', 'pointer')
                .text(branch)
                .on('click', () => {
                    this.toggleBranchGroup(branch);
                });

            // Легенда для группы (один цвет)
            const legendItem = groupContainer.append('div')
                .attr('class', `legend-item ${this.visibleBranchGroups.has(branch) ? '' : 'disabled'}`)
                .on('click', (event) => {
                    event.stopPropagation(); // Предотвращаем всплытие
                    this.toggleBranchGroup(branch);
                });

            legendItem.append('span')
                .attr('class', 'legend-color')
                .style('background-color', getColor(branchIndex));

            legendItem.append('span')
                .attr('class', 'legend-label')
                .text('Read/Write');
        });
    }

    setConfigOperations(operations) {
        this.visibleConfigOperations = new Set(operations);
        this.updateConfigChartsVisibility();
        this.updateConfigLegendAppearance();
    }

    setBranchOperations(operations) {
        this.visibleBranchOperations = new Set(operations);
        this.updateBranchChartsVisibility();
        this.updateBranchLegendAppearance();
    }

    toggleConfigGroup(group) {
        if (this.visibleConfigGroups.has(group)) {
            this.visibleConfigGroups.delete(group);
        } else {
            this.visibleConfigGroups.add(group);
        }
        this.updateConfigChartsVisibility();
        this.updateConfigLegendAppearance();
    }

    toggleBranchGroup(group) {
        if (this.visibleBranchGroups.has(group)) {
            this.visibleBranchGroups.delete(group);
        } else {
            this.visibleBranchGroups.add(group);
        }
        this.updateBranchChartsVisibility();
        this.updateBranchLegendAppearance();
    }

    updateAllChartsVisibility() {
        this.updateConfigChartsVisibility();
        this.updateBranchChartsVisibility();
    }

    updateConfigChartsVisibility() {
        const configCharts = ['chart-iops-config', 'chart-latency-config'];
        
        configCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart && chart.updateVisibility) {
                // Создаем Set видимых fullGroups на основе выбранных операций И групп
                const visibleFullGroups = new Set();
                chart.fullGroups.forEach(fullGroup => {
                    const [group, operation] = fullGroup.split(' - ');
                    if (this.visibleConfigGroups.has(group) && this.visibleConfigOperations.has(operation)) {
                        visibleFullGroups.add(fullGroup);
                    }
                });
                chart.updateVisibility(visibleFullGroups);
            }
        });
    }

    updateBranchChartsVisibility() {
        const branchCharts = ['chart-iops-branch', 'chart-latency-branch'];
        
        branchCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart && chart.updateVisibility) {
                // Создаем Set видимых fullGroups на основе выбранных операций И групп
                const visibleFullGroups = new Set();
                chart.fullGroups.forEach(fullGroup => {
                    const [group, operation] = fullGroup.split(' - ');
                    if (this.visibleBranchGroups.has(group) && this.visibleBranchOperations.has(operation)) {
                        visibleFullGroups.add(fullGroup);
                    }
                });
                chart.updateVisibility(visibleFullGroups);
            }
        });
    }

    updateConfigLegendAppearance() {
        // Обновляем кнопки переключателя
        d3.selectAll('#legend-config .operation-toggle-btn')
            .classed('active', (d, i, nodes) => {
                const button = d3.select(nodes[i]);
                const text = button.text();
                if (text === 'Read Only') return this.visibleConfigOperations.has('read') && !this.visibleConfigOperations.has('write');
                if (text === 'Write Only') return this.visibleConfigOperations.has('write') && !this.visibleConfigOperations.has('read');
                if (text === 'Both') return this.visibleConfigOperations.has('read') && this.visibleConfigOperations.has('write');
                return false;
            });

        // Обновляем видимость групп
        this.configGroups.forEach(group => {
            d3.selectAll('#legend-config .legend-group-title')
                .filter(d => d === group)
                .parent()
                .select('.legend-item')
                .classed('disabled', !this.visibleConfigGroups.has(group));
        });
    }

    updateBranchLegendAppearance() {
        // Обновляем кнопки переключателя
        d3.selectAll('#legend-branch .operation-toggle-btn')
            .classed('active', (d, i, nodes) => {
                const button = d3.select(nodes[i]);
                const text = button.text();
                if (text === 'Read Only') return this.visibleBranchOperations.has('read') && !this.visibleBranchOperations.has('write');
                if (text === 'Write Only') return this.visibleBranchOperations.has('write') && !this.visibleBranchOperations.has('read');
                if (text === 'Both') return this.visibleBranchOperations.has('read') && this.visibleBranchOperations.has('write');
                return false;
            });

        // Обновляем видимость групп
        this.branchGroups.forEach(group => {
            d3.selectAll('#legend-branch .legend-group-title')
                .filter(d => d === group)
                .parent()
                .select('.legend-item')
                .classed('disabled', !this.visibleBranchGroups.has(group));
        });
    }

    updateDataInfo() {
        if (!this.currentData) return;

        const filter = this.currentData.filter || { applied: false, days: 30 };
        
        const infoHtml = `
            <p><strong>Generated:</strong> ${new Date(this.currentData.generated_at).toLocaleString()}</p>
            <p><strong>Total tests:</strong> ${this.currentData.summary?.total_tests || 0}</p>
            <p><strong>Configurations:</strong> ${this.currentData.summary?.configurations?.join(', ') || 'N/A'}</p>
            <p><strong>Branches:</strong> ${this.currentData.summary?.branches?.join(', ') || 'N/A'}</p>
            ${filter.applied ? 
                `<p><strong>Time filter:</strong> Last ${filter.days} days</p>` : 
                '<p><strong>Time filter:</strong> All data</p>'
            }
        `;

        d3.select('#data-info').html(infoHtml);
    }

    setupEventListeners() {
        // Refresh button
        d3.select('#refreshBtn').on('click', () => {
            this.refreshData();
        });

        // Time range selector
        d3.select('#timeRange').on('change', (event) => {
            this.handleTimeRangeChange(event.target.value);
        });
    }

    async refreshData() {
        try {
            this.showLoading(true);
            await this.loadData();
            this.charts.clear();
            this.visibleConfigGroups.clear();
            this.visibleBranchGroups.clear();
            this.visibleConfigOperations.clear().add('read');
            this.visibleBranchOperations.clear().add('read');
            this.configGroups.clear();
            this.branchGroups.clear();
            
            this.collectGroups();
            this.createLegends();
            this.createCharts();
            this.updateDataInfo();
            this.showLoading(false);
        } catch (error) {
            console.error('Failed to refresh data:', error);
            this.showNotification('Error refreshing data', 'error');
            this.showLoading(false);
        }
    }

    handleTimeRangeChange(days) {
        const currentDays = this.currentData?.filter?.days || 30;
        
        if (days === 'all') {
            days = 0;
        }
        
        if (parseInt(days) === currentDays) {
            console.log('Time range unchanged');
            return;
        }
        
        if (confirm(`Change time range to ${days === '0' ? 'all time' : `last ${days} days`}? This will reload the dashboard.`)) {
            this.reprocessData(days);
        } else {
            // Восстанавливаем предыдущее значение
            d3.select('#timeRange').property('value', currentDays === 0 ? 'all' : currentDays.toString());
        }
    }

    reprocessData(days) {
        // Пока просто перезагружаем страницу с параметром
        const url = new URL(window.location.href);
        if (days === '0') {
            url.searchParams.delete('days');
        } else {
            url.searchParams.set('days', days);
        }
        
        window.location.href = url.toString();
    }

    showLoading(show) {
        const loading = d3.select('#loading');
        const button = d3.select('#refreshBtn');
        
        if (show) {
            loading.style('display', 'flex');
            button.attr('disabled', true);
            button.text('Refreshing...');
        } else {
            loading.style('display', 'none');
            button.attr('disabled', null);
            button.text('Refresh Data');
        }
    }

    showNotification(message, type = 'success') {
        const notification = d3.select('body')
            .append('div')
            .attr('class', `notification ${type}`)
            .text(message);
        
        setTimeout(() => {
            notification.transition()
                .duration(300)
                .style('opacity', 0)
                .remove();
        }, 3000);
    }

    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            days: urlParams.get('days') || '30'
        };
    }

    displayError(error) {
        const errorHtml = `
            <div class="error">
                <h3>Error Loading Dashboard</h3>
                <p>${error.message}</p>
                <p>Please check the console for details.</p>
            </div>
        `;
        d3.select('body').html(errorHtml);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const app = new DashboardApp();
    app.init();
});