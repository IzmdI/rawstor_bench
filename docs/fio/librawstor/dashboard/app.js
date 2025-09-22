function createSafeClassName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}


class DashboardApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.currentData = null;
        this.charts = new Map();
        this.visibleGroups = new Set();
    }

    async init() {
        console.log('Initializing dashboard...');
        
        try {
            await this.loadData();
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
        
        // Показываем все группы по умолчанию
        this.updateVisibleGroups();
    }

    createCharts() {
        if (!this.currentData?.charts) {
            throw new Error('No chart data available');
        }

        const chartsConfig = [
            {
                id: 'chart-iops-read-config',
                title: 'IOPS Read',
                yLabel: 'IOPS',
                dataKey: 'iops_read_by_config',
                groupBy: 'config'
            },
            {
                id: 'chart-iops-write-config', 
                title: 'IOPS Write',
                yLabel: 'IOPS',
                dataKey: 'iops_write_by_config',
                groupBy: 'config'
            },
            {
                id: 'chart-latency-read-config',
                title: 'Latency Read',
                yLabel: 'ms',
                dataKey: 'latency_read_by_config',
                groupBy: 'config'
            },
            {
                id: 'chart-latency-write-config',
                title: 'Latency Write', 
                yLabel: 'ms',
                dataKey: 'latency_write_by_config',
                groupBy: 'config'
            },
            {
                id: 'chart-iops-read-branch',
                title: 'IOPS Read',
                yLabel: 'IOPS', 
                dataKey: 'iops_read_by_branch',
                groupBy: 'branch'
            },
            {
                id: 'chart-iops-write-branch',
                title: 'IOPS Write',
                yLabel: 'IOPS',
                dataKey: 'iops_write_by_branch',
                groupBy: 'branch'
            },
            {
                id: 'chart-latency-read-branch',
                title: 'Latency Read',
                yLabel: 'ms',
                dataKey: 'latency_read_by_branch',
                groupBy: 'branch'
            },
            {
                id: 'chart-latency-write-branch',
                title: 'Latency Write',
                yLabel: 'ms',
                dataKey: 'latency_write_by_branch',
                groupBy: 'branch'
            }
        ];

        chartsConfig.forEach(config => {
            const chartData = this.currentData.charts[config.dataKey];
            if (chartData && chartData.length > 0) {
                const chart = createChart({
                    container: d3.select(`#${config.id}`),
                    title: config.title,
                    yLabel: config.yLabel,
                    data: chartData,
                    accessor: d => d.value,
                    id: config.id,
                    groupBy: config.groupBy
                });
                this.charts.set(config.id, chart);
            } else {
                console.warn(`No data for chart: ${config.id}`);
                d3.select(`#${config.id}`).html('<p class="no-data">No data available</p>');
            }
        });

        this.createLegend();
    }

    createLegend() {
        const legendContainer = d3.select('#legend-container');
        legendContainer.html('<h4>Legend (Click to toggle)</h4>');

        // Собираем все уникальные группы из всех графиков
        const allGroups = new Set();
        this.charts.forEach((chart, chartId) => {
            if (chart.groups) {
                chart.groups.forEach(group => allGroups.add(group));
            }
        });

        const legend = legendContainer.selectAll('.legend-item')
            .data(Array.from(allGroups))
            .enter()
            .append('div')
            .attr('class', d => `legend-item legend-${createSafeClassName(d)}`) // Используем безопасное имя
            .style('opacity', 1)
            .on('click', (event, groupName) => {
                this.toggleGroupVisibility(groupName);
            });

        legend.append('span')
            .attr('class', 'legend-color')
            .style('background-color', (d, i) => getColor(i));

        legend.append('span')
            .attr('class', 'legend-label')
            .text(d => d);

        // Показываем все группы по умолчанию
        allGroups.forEach(group => this.visibleGroups.add(group));
    }

    toggleGroupVisibility(groupName) {
        if (this.visibleGroups.has(groupName)) {
            this.visibleGroups.delete(groupName);
        } else {
            this.visibleGroups.add(groupName);
        }
        
        this.updateChartVisibility();
        this.updateLegendAppearance();
    }

    updateChartVisibility() {
        this.charts.forEach((chart, chartId) => {
            if (chart.updateVisibility) {
                chart.updateVisibility(this.visibleGroups);
            }
        });
    }

    updateLegendAppearance() {
        d3.selectAll('.legend-item')
            .classed('hidden', d => !this.visibleGroups.has(d))
            .style('opacity', d => this.visibleGroups.has(d) ? 1 : 0.6);
    }

    updateVisibleGroups() {
        // Автоматически показываем группы которые есть в данных
        this.visibleGroups.clear();
        this.charts.forEach((chart, chartId) => {
            if (chart.groups) {
                chart.groups.forEach(group => this.visibleGroups.add(group));
            }
        });
        this.updateChartVisibility();
        this.updateLegendAppearance();
        // test
    }

    updateDataInfo() {
        if (!this.currentData) return;

        const infoHtml = `
            <p><strong>Generated:</strong> ${new Date(this.currentData.generated_at).toLocaleString()}</p>
            <p><strong>Total tests:</strong> ${this.currentData.summary?.total_tests || 0}</p>
            <p><strong>Configurations:</strong> ${this.currentData.summary?.configurations?.join(', ') || 'N/A'}</p>
            <p><strong>Branches:</strong> ${this.currentData.summary?.branches?.join(', ') || 'N/A'}</p>
            ${this.currentData.filter?.applied ? 
                `<p><strong>Time filter:</strong> Last ${this.currentData.filter.days} days</p>` : 
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
            d3.select('#refreshBtn').text('Refreshing...').attr('disabled', true);
            await this.loadData();
            this.charts.clear();
            this.createCharts();
            this.updateDataInfo();
            d3.select('#refreshBtn').text('Refresh Data').attr('disabled', false);
        } catch (error) {
            console.error('Failed to refresh data:', error);
            d3.select('#refreshBtn').text('Refresh Data').attr('disabled', false);
        }
    }

    handleTimeRangeChange(days) {
        // Здесь можно реализовать изменение временного диапазона
        console.log('Time range changed to:', days);
        // Пока просто перезагружаем страницу для простоты
        if (days !== '30') { // 30 дней - это настройка по умолчанию
            alert('Changing time range requires reprocessing data. This feature will be implemented soon.');
        }
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