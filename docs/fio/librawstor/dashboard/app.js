class BenchmarkDashboard {
    constructor() {
        this.dataLoader = new BenchmarkDataLoader();
        this.charts = new BenchmarkCharts();
        this.data = null;

        this.iopsConfigChart = null;
        this.latencyConfigChart = null;
        this.iopsBranchChart = null;
        this.latencyBranchChart = null;

        this.filters = {
            config: {
                iops: { configs: new Set(), metrics: new Set(['read_iops', 'write_iops']) },
                latency: { configs: new Set(), metrics: new Set(['read_latency', 'write_latency']) }
            },
            branch: {
                iops: { branches: new Set(), metrics: new Set(['read_iops', 'write_iops']) },
                latency: { branches: new Set(), metrics: new Set(['read_latency', 'write_latency']) }
            }
        };

        this.init();
    }

    async init() {
        console.log('📊 Инициализация dashboard...');
        this.showLoading();

        try {
            this.data = await this.dataLoader.loadAllData();
            this.hideLoading();
            this.createCharts();
            this.createFilters();
            this.updateDataInfo();
            this.setupEventListeners();

            console.log('✅ Dashboard готов!');
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            this.showError('Ошибка загрузки данных');
        }
    }

    createCharts() {
        if (!this.data || this.data.allData.length === 0) {
            this.showError('Нет данных для отображения');
            return;
        }

        const validData = this.data.allData.filter(item =>
            item.date instanceof Date &&
            !isNaN(item.date.getTime()) &&
            !isNaN(item.read_iops) &&
            !isNaN(item.write_iops) &&
            !isNaN(item.read_latency) &&
            !isNaN(item.write_latency)
        );

        if (validData.length === 0) {
            this.showError('Все данные содержат ошибки');
            return;
        }

        const iopsConfigContainer = d3.select('#iops-by-config-chart .chart-content');
        const latencyConfigContainer = d3.select('#latency-by-config-chart .chart-content');
        const iopsBranchContainer = d3.select('#iops-by-branch-chart .chart-content');
        const latencyBranchContainer = d3.select('#latency-by-branch-chart .chart-content');

        this.iopsConfigChart = this.charts.createIOPSChart(iopsConfigContainer, validData, 'config');
        this.latencyConfigChart = this.charts.createLatencyChart(latencyConfigContainer, validData, 'config');
        this.iopsBranchChart = this.charts.createIOPSChart(iopsBranchContainer, validData, 'branch');
        this.latencyBranchChart = this.charts.createLatencyChart(latencyBranchContainer, validData, 'branch');
    }

    createFilters() {
        this.clearFilters();
        this.createConfigFilters();
        this.createBranchFilters();
    }

    clearFilters() {
        const filterContainers = [
            '#iops-config-filters', '#iops-metric-filters',
            '#latency-config-filters', '#latency-metric-filters',
            '#iops-branch-filters', '#iops-branch-metric-filters',
            '#latency-branch-filters', '#latency-branch-metric-filters'
        ];

        filterContainers.forEach(selector => {
            d3.select(selector).html('');
        });
    }

    createConfigFilters() {
        const configs = this.dataLoader.getUniqueConfigs(this.data.allData);

        const iopsConfigContainer = d3.select('#iops-config-filters');
        const latencyConfigContainer = d3.select('#latency-config-filters');

        configs.forEach(config => {
            const color = this.getConfigColor(config);

            this.createFilterCheckboxWithColor(
                iopsConfigContainer,
                config,
                'configs',
                'config',
                'iops',
                DataUtils.getConfigDisplayName(config),
                color
            );

            this.createFilterCheckboxWithColor(
                latencyConfigContainer,
                config,
                'configs',
                'config',
                'latency',
                DataUtils.getConfigDisplayName(config),
                color
            );
        });

        this.createMetricFilters('config');
    }

    createBranchFilters() {
        const branches = this.dataLoader.getUniqueBranches(this.data.allData);

        const iopsBranchContainer = d3.select('#iops-branch-filters');
        const latencyBranchContainer = d3.select('#latency-branch-filters');

        branches.forEach(branch => {
            this.createFilterCheckbox(
                iopsBranchContainer,
                branch,
                'branches',
                'branch',
                'iops',
                branch
            );

            this.createFilterCheckbox(
                latencyBranchContainer,
                branch,
                'branches',
                'branch',
                'latency',
                branch
            );
        });

        this.createMetricFilters('branch');
    }

    createMetricFilters(groupType) {
        const iopsMetrics = [
            { id: 'read_iops', label: 'Read IOPS', color: '#1f77b4' },
            { id: 'write_iops', label: 'Write IOPS', color: '#d62728' }
        ];

        const latencyMetrics = [
            { id: 'read_latency', label: 'Read Latency', color: '#2ca02c' },
            { id: 'write_latency', label: 'Write Latency', color: '#ff7f0e' }
        ];

        const iopsMetricContainer = d3.select(groupType === 'config' ? '#iops-metric-filters' : '#iops-branch-metric-filters');
        const latencyMetricContainer = d3.select(groupType === 'config' ? '#latency-metric-filters' : '#latency-branch-metric-filters');

        iopsMetrics.forEach(metric => {
            this.createFilterCheckboxWithColor(
                iopsMetricContainer,
                metric.id,
                'metrics',
                groupType,
                'iops',
                metric.label,
                metric.color
            );
        });

        latencyMetrics.forEach(metric => {
            this.createFilterCheckboxWithColor(
                latencyMetricContainer,
                metric.id,
                'metrics',
                groupType,
                'latency',
                metric.label,
                metric.color
            );
        });
    }

    createFilterCheckboxWithColor(container, value, filterType, groupType, chartType, label, color) {
        const filterItem = container.append('div')
            .attr('class', 'filter-item')
            .attr('data-value', value)
            .attr('data-type', filterType)
            .attr('data-group', groupType)
            .attr('data-chart', chartType);

        filterItem.append('div')
            .attr('class', 'filter-color')
            .style('background', color);

        const labelElement = filterItem.append('label');

        labelElement.append('input')
            .attr('type', 'checkbox')
            .attr('name', `${groupType}-${chartType}-${filterType}`)
            .attr('value', value)
            .attr('checked', true)
            .on('change', (event) => {
                this.handleFilterChange(filterType, value, event.target.checked, groupType, chartType);
            });

        labelElement.append('span').text(label);
    }

    createFilterCheckbox(container, value, filterType, groupType, chartType, label) {
        const filterItem = container.append('div')
            .attr('class', 'filter-item')
            .attr('data-value', value)
            .attr('data-type', filterType)
            .attr('data-group', groupType)
            .attr('data-chart', chartType);

        const labelElement = filterItem.append('label');

        labelElement.append('input')
            .attr('type', 'checkbox')
            .attr('name', `${groupType}-${chartType}-${filterType}`)
            .attr('value', value)
            .attr('checked', true)
            .on('change', (event) => {
                this.handleFilterChange(filterType, value, event.target.checked, groupType, chartType);
            });

        labelElement.append('span').text(label);
    }

    handleFilterChange(filterType, value, isChecked, groupType, chartType) {
        if (isChecked) {
            this.filters[groupType][chartType][filterType].add(value);
        } else {
            this.filters[groupType][chartType][filterType].delete(value);
        }

        this.updateChartVisibility(groupType, chartType);
    }

    updateChartVisibility(groupType, chartType) {
        const chart = this.getChart(groupType, chartType);
        const filters = this.filters[groupType][chartType];

        if (!chart || !chart.lineData) return;

        chart.lineData.forEach(line => {
            let isVisible = true;

            if (groupType === 'config') {
                const isConfigVisible = filters.configs.has(line.group);
                const isMetricVisible = filters.metrics.has(`${line.type}_${chartType}`);
                isVisible = isConfigVisible && isMetricVisible;
            } else {
                const isBranchVisible = filters.branches.has(line.group);
                const isMetricVisible = filters.metrics.has(`${line.type}_${chartType}`);
                isVisible = isBranchVisible && isMetricVisible;
            }

            this.charts.updateLineVisibility(chart, line.id, isVisible);
        });
    }

    getChart(groupType, chartType) {
        const chartsMap = {
            'config_iops': this.iopsConfigChart,
            'config_latency': this.latencyConfigChart,
            'branch_iops': this.iopsBranchChart,
            'branch_latency': this.latencyBranchChart
        };
        return chartsMap[`${groupType}_${chartType}`];
    }

    getConfigColor(config) {
        const colors = [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
            '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
            '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
            '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
        ];

        let hash = 0;
        for (let i = 0; i < config.length; i++) {
            hash = config.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    }

    async refreshData() {
        console.log('🔄 Обновление данных...');
        this.showLoading();

        try {
            if (this.dataLoader.clearCache) {
                this.dataLoader.clearCache();
            }

            this.data = await this.dataLoader.loadAllData();
            this.hideLoading();

            this.createCharts();
            this.createFilters();
            this.updateDataInfo();

            console.log('✅ Данные обновлены!');
        } catch (error) {
            console.error('❌ Ошибка обновления:', error);
            this.hideLoading();
            alert('Ошибка при обновлении данных');
        }
    }

    showLoading() {
        d3.selectAll('.chart-content').html('<div class="loading">Загрузка данных...</div>');
    }

    hideLoading() {
        d3.selectAll('.loading').remove();
    }

    updateDataInfo() {
        if (!this.data || this.data.allData.length === 0) {
            d3.select('#last-update').text('нет данных');
            d3.select('#data-info').text('0');
            return;
        }

        const lastUpdate = this.data.allData[this.data.allData.length - 1].date.toLocaleDateString('ru-RU');
        const totalTests = this.data.allData.length;

        d3.select('#last-update').text(`Последнее обновление: ${lastUpdate}`);
        d3.select('#data-info').text(totalTests);
    }

    showError(message) {
        d3.selectAll('.chart-content').html(`
            <div style="color: #e74c3c; text-align: center; padding: 50px;">
                ${message}
                <br><br>
                <button onclick="location.reload()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Попробовать снова
                </button>
            </div>
        `);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            if (this.data && this.data.allData.length > 0) {
                this.createCharts();
                this.createFilters();
            }
        });

        d3.select('#refresh-data').on('click', () => {
            this.refreshData();
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new BenchmarkDashboard();
});