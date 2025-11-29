function createSafeClassName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

class DashboardApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.currentData = null;
        this.charts = new Map();
        
        // Управление видимостью для конфигураций
        this.visibleConfigGroups = new Set();
        this.visibleConfigOperations = new Set(['read', 'write']);
        this.configGroups = new Set();
        this.configFullGroups = new Set();
        
        // Управление видимостью для веток
        this.visibleBranchGroups = new Set();
        this.visibleBranchOperations = new Set(['read', 'write']);
        this.branchGroups = new Set();
        this.branchFullGroups = new Set();
    }

    async init() {
        console.log('Initializing dashboard...');
        
        const params = this.getUrlParams();
        if (params.days !== '30') {
            d3.select('#timeRange').property('value', params.days);
        }
        
        try {
            await this.loadData();
            this.createCharts();
            this.collectGroups();
            this.createLegends();
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
        this.configFullGroups.clear();
        this.branchGroups.clear();
        this.branchFullGroups.clear();
        
        // Собираем группы из графиков с конфигурациями
        const configCharts = ['chart-iops-config', 'chart-latency-config'];
        const branchCharts = ['chart-iops-branch', 'chart-latency-branch'];
        
        configCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart) {
                if (chart.groups) {
                    chart.groups.forEach(group => this.configGroups.add(group));
                }
                if (chart.fullGroups) {
                    chart.fullGroups.forEach(fullGroup => this.configFullGroups.add(fullGroup));
                }
            }
        });
        
        branchCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart) {
                if (chart.groups) {
                    chart.groups.forEach(group => this.branchGroups.add(group));
                }
                if (chart.fullGroups) {
                    chart.fullGroups.forEach(fullGroup => this.branchFullGroups.add(fullGroup));
                }
            }
        });
        
        // Показываем все группы и операции по умолчанию
        this.configFullGroups.forEach(fullGroup => this.visibleConfigGroups.add(fullGroup));
        this.branchFullGroups.forEach(fullGroup => this.visibleBranchGroups.add(fullGroup));
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
                dataKey: 'iops', // Будем комбинировать read и write
                groupBy: 'config',
                timeRangeDays: timeRangeDays,
                legendType: 'config',
                metricType: 'iops'
            },
            {
                id: 'chart-latency-config',
                title: 'Latency (by Config)',
                yLabel: 'ms',
                dataKey: 'latency', // Будем комбинировать read и write
                groupBy: 'config',
                timeRangeDays: timeRangeDays,
                legendType: 'config',
                metricType: 'latency'
            },
            {
                id: 'chart-iops-branch',
                title: 'IOPS (by Branch)',
                yLabel: 'kIOPS',
                dataKey: 'iops', // Будем комбинировать read и write
                groupBy: 'branch',
                timeRangeDays: timeRangeDays,
                legendType: 'branch',
                metricType: 'iops'
            },
            {
                id: 'chart-latency-branch',
                title: 'Latency (by Branch)',
                yLabel: 'ms',
                dataKey: 'latency', // Будем комбинировать read и write
                groupBy: 'branch',
                timeRangeDays: timeRangeDays,
                legendType: 'branch',
                metricType: 'latency'
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
                    metricType: config.metricType
                });
                this.charts.set(config.id, chart);
            } else {
                console.warn(`No data for chart: ${config.id}`);
                d3.select(`#${config.id}`).html('<p class="no-data">No data available</p>');
            }
        });
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

        // Создаем группы для каждой конфигурации
        const configsArray = Array.from(this.configGroups);
        
        configsArray.forEach((config, configIndex) => {
            const groupContainer = legendContainer.append('div').attr('class', 'legend-group');
            
            groupContainer.append('div')
                .attr('class', 'legend-group-title')
                .text(config);
            
            // Read операция
            const readFullGroup = `${config} - read`;
            const readItem = groupContainer.append('div')
                .attr('class', `legend-item ${this.visibleConfigGroups.has(readFullGroup) ? '' : 'disabled'}`)
                .on('click', () => {
                    this.toggleConfigOperation(config, 'read');
                });

            readItem.append('span')
                .attr('class', 'legend-color')
                .style('background-color', getColor(configIndex));

            readItem.append('span')
                .attr('class', 'legend-label')
                .text('Read');

            // Write операция
            const writeFullGroup = `${config} - write`;
            const writeItem = groupContainer.append('div')
                .attr('class', `legend-item ${this.visibleConfigGroups.has(writeFullGroup) ? '' : 'disabled'}`)
                .on('click', () => {
                    this.toggleConfigOperation(config, 'write');
                });

            writeItem.append('span')
                .attr('class', 'legend-color')
                .style('background-color', getColor(configIndex))
                .style('opacity', 0.7);

            writeItem.append('span')
                .attr('class', 'legend-label')
                .text('Write');
        });
    }

    createBranchLegend() {
        const legendContainer = d3.select('#legend-branch');
        legendContainer.html('');
        
        if (this.branchGroups.size === 0) {
            legendContainer.html('<p style="color: #6c757d; font-style: italic;">No branch data</p>');
            return;
        }

        // Создаем группы для каждой ветки
        const branchesArray = Array.from(this.branchGroups);
        
        branchesArray.forEach((branch, branchIndex) => {
            const groupContainer = legendContainer.append('div').attr('class', 'legend-group');
            
            groupContainer.append('div')
                .attr('class', 'legend-group-title')
                .text(branch);
            
            // Read операция
            const readFullGroup = `${branch} - read`;
            const readItem = groupContainer.append('div')
                .attr('class', `legend-item ${this.visibleBranchGroups.has(readFullGroup) ? '' : 'disabled'}`)
                .on('click', () => {
                    this.toggleBranchOperation(branch, 'read');
                });

            readItem.append('span')
                .attr('class', 'legend-color')
                .style('background-color', getColor(branchIndex));

            readItem.append('span')
                .attr('class', 'legend-label')
                .text('Read');

            // Write операция
            const writeFullGroup = `${branch} - write`;
            const writeItem = groupContainer.append('div')
                .attr('class', `legend-item ${this.visibleBranchGroups.has(writeFullGroup) ? '' : 'disabled'}`)
                .on('click', () => {
                    this.toggleBranchOperation(branch, 'write');
                });

            writeItem.append('span')
                .attr('class', 'legend-color')
                .style('background-color', getColor(branchIndex))
                .style('opacity', 0.7);

            writeItem.append('span')
                .attr('class', 'legend-label')
                .text('Write');
        });
    }

    toggleConfigOperation(group, operation) {
        const fullGroup = `${group} - ${operation}`;
        
        if (this.visibleConfigGroups.has(fullGroup)) {
            this.visibleConfigGroups.delete(fullGroup);
        } else {
            this.visibleConfigGroups.add(fullGroup);
        }
        
        this.updateConfigChartsVisibility();
        this.updateConfigLegendAppearance();
    }

    toggleBranchOperation(group, operation) {
        const fullGroup = `${group} - ${operation}`;
        
        if (this.visibleBranchGroups.has(fullGroup)) {
            this.visibleBranchGroups.delete(fullGroup);
        } else {
            this.visibleBranchGroups.add(fullGroup);
        }
        
        this.updateBranchChartsVisibility();
        this.updateBranchLegendAppearance();
    }

    updateConfigChartsVisibility() {
        const configCharts = ['chart-iops-config', 'chart-latency-config'];
        
        configCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart && chart.updateVisibility) {
                chart.updateVisibility(this.visibleConfigGroups);
            }
        });
    }

    updateBranchChartsVisibility() {
        const branchCharts = ['chart-iops-branch', 'chart-latency-branch'];
        
        branchCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart && chart.updateVisibility) {
                chart.updateVisibility(this.visibleBranchGroups);
            }
        });
    }

    updateConfigLegendAppearance() {
        this.configGroups.forEach(config => {
            const readFullGroup = `${config} - read`;
            const writeFullGroup = `${config} - write`;
            
            d3.select(`#legend-config .legend-item:has(.legend-label:contains("Read"))`)
                .filter((d, i, nodes) => d3.select(nodes[i].parentNode).select('.legend-group-title').text() === config)
                .classed('disabled', !this.visibleConfigGroups.has(readFullGroup));
            
            d3.select(`#legend-config .legend-item:has(.legend-label:contains("Write"))`)
                .filter((d, i, nodes) => d3.select(nodes[i].parentNode).select('.legend-group-title').text() === config)
                .classed('disabled', !this.visibleConfigGroups.has(writeFullGroup));
        });
    }

    updateBranchLegendAppearance() {
        this.branchGroups.forEach(branch => {
            const readFullGroup = `${branch} - read`;
            const writeFullGroup = `${branch} - write`;
            
            d3.select(`#legend-branch .legend-item:has(.legend-label:contains("Read"))`)
                .filter((d, i, nodes) => d3.select(nodes[i].parentNode).select('.legend-group-title').text() === branch)
                .classed('disabled', !this.visibleBranchGroups.has(readFullGroup));
            
            d3.select(`#legend-branch .legend-item:has(.legend-label:contains("Write"))`)
                .filter((d, i, nodes) => d3.select(nodes[i].parentNode).select('.legend-group-title').text() === branch)
                .classed('disabled', !this.visibleBranchGroups.has(writeFullGroup));
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
            this.configGroups.clear();
            this.configFullGroups.clear();
            this.branchGroups.clear();
            this.branchFullGroups.clear();
            
            this.createCharts();
            this.collectGroups();
            this.createLegends();
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