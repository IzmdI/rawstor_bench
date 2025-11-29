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
        
        const params = this.getUrlParams();
        if (params.days !== '7') {
            d3.select('#timeRange').property('value', params.days);
        }

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
                groupBy: 'config',
                timeRangeDays: timeRangeDays
            },
            {
                id: 'chart-iops-write-config',
                title: 'IOPS Write',
                yLabel: 'IOPS',
                dataKey: 'iops_write_by_config',
                groupBy: 'config',
                timeRangeDays: timeRangeDays
            },
            {
                id: 'chart-latency-read-config',
                title: 'Latency Read',
                yLabel: 'ms',
                dataKey: 'latency_read_by_config',
                groupBy: 'config',
                timeRangeDays: timeRangeDays
            },
            {
                id: 'chart-latency-write-config',
                title: 'Latency Write',
                yLabel: 'ms',
                dataKey: 'latency_write_by_config',
                groupBy: 'config',
                timeRangeDays: timeRangeDays
            },
            {
                id: 'chart-iops-read-branch',
                title: 'IOPS Read',
                yLabel: 'IOPS',
                dataKey: 'iops_read_by_branch',
                groupBy: 'branch',
                timeRangeDays: timeRangeDays
            },
            {
                id: 'chart-iops-write-branch',
                title: 'IOPS Write',
                yLabel: 'IOPS',
                dataKey: 'iops_write_by_branch',
                groupBy: 'branch',
                timeRangeDays: timeRangeDays
            },
            {
                id: 'chart-latency-read-branch',
                title: 'Latency Read',
                yLabel: 'ms',
                dataKey: 'latency_read_by_branch',
                groupBy: 'branch',
                timeRangeDays: timeRangeDays
            },
            {
                id: 'chart-latency-write-branch',
                title: 'Latency Write',
                yLabel: 'ms',
                dataKey: 'latency_write_by_branch',
                groupBy: 'branch',
                timeRangeDays: timeRangeDays
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
                    groupBy: config.groupBy,
                    timeRangeDays: timeRangeDays // ← Передаем информацию о временном диапазоне
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

        const defaultDays = 7;
        const filter = this.currentData.filter || { applied: false, days: defaultDays };

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

    async handleTimeRangeChange(days) {
        const currentDays = this.currentData?.filter?.days || 7;

        if (days === 'all') {
            days = 0;
        }

        if (parseInt(days) === currentDays) {
            console.log('Time range unchanged');
            return;
        }

        if (confirm(`Change time range to ${days === '0' ? 'all time' : `last ${days} days`}? This will reload the dashboard.`)) {
            await this.reprocessData(days);
        } else {
            // Восстанавливаем предыдущее значение
            d3.select('#timeRange').property('value', currentDays === 0 ? 'all' : currentDays.toString());
        }
    }

    async reprocessData(days) {
        try {
            this.showLoading(true);

            // Здесь будет вызов API для переобработки данных
            // Пока просто перезагружаем страницу с параметром
            const url = new URL(window.location.href);
            if (days === '0') {
                url.searchParams.delete('days');
            } else {
                url.searchParams.set('days', days);
            }

            window.location.href = url.toString();

        } catch (error) {
            console.error('Failed to reprocess data:', error);
            this.showNotification('Error changing time range', 'error');
            this.showLoading(false);
        }
    }

    showLoading(show) {
        const loading = d3.select('#loading');
        const button = d3.select('#refreshBtn');

        if (show) {
            loading.style('display', 'flex');
            button.attr('disabled', true);
            button.text('Processing...');
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

    // Добавляем метод для чтения параметров URL
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            days: urlParams.get('days') || '7'
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