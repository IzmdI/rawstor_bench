class BenchmarkDashboard {
    constructor() {
        this.dataLoader = new BenchmarkDataLoader();
        this.charts = new BenchmarkCharts();
        this.data = null;
        // Отдельные графики для каждой группировки
        this.iopsConfigChart = null;
        this.latencyConfigChart = null;
        this.iopsBranchChart = null;
        this.latencyBranchChart = null;
        // Раздельные фильтры
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

        // Графики с группировкой по конфигурациям
        const iopsConfigContainer = d3.select('#iops-by-config-chart .chart-content');
        const latencyConfigContainer = d3.select('#latency-by-config-chart .chart-content');

        // Графики с группировкой по веткам
        const iopsBranchContainer = d3.select('#iops-by-branch-chart .chart-content');
        const latencyBranchContainer = d3.select('#latency-by-branch-chart .chart-content');

        this.iopsConfigChart = this.charts.createIOPSChart(iopsConfigContainer, this.data.allData, 'config');
        this.latencyConfigChart = this.charts.createLatencyChart(latencyConfigContainer, this.data.allData, 'config');
        this.iopsBranchChart = this.charts.createIOPSChart(iopsBranchContainer, this.data.allData, 'branch');
        this.latencyBranchChart = this.charts.createLatencyChart(latencyBranchContainer, this.data.allData, 'branch');
    }

    createFilters() {
        this.createIOPSFilters();
        this.createLatencyFilters();
    }

    createConfigFilters() {
        const configs = this.dataLoader.getUniqueConfigs(this.data.allData);

        // Конфигурации для IOPS
        const iopsConfigContainer = d3.select('#iops-config-filters');
        configs.forEach(config => {
            this.createFilterCheckboxWithColor(
                iopsConfigContainer,
                config,
                'configs',
                'config',
                'iops',
                DataUtils.getConfigDisplayName(config),
                this.getConfigColor(config)
            );
        });

        // Конфигурации для Latency
        const latencyConfigContainer = d3.select('#latency-config-filters');
        configs.forEach(config => {
            this.createFilterCheckboxWithColor(
                latencyConfigContainer,
                config,
                'configs',
                'config',
                'latency',
                DataUtils.getConfigDisplayName(config),
                this.getConfigColor(config)
            );
        });

        // Метрики для конфигурационных графиков
        this.createMetricFilters('config');
    }

    createBranchFilters() {
        const branches = this.dataLoader.getUniqueBranches(this.data.allData);

        // Ветки для IOPS
        const iopsBranchContainer = d3.select('#iops-branch-filters');
        branches.forEach(branch => {
            this.createFilterCheckbox(
                iopsBranchContainer,
                branch,
                'branches',
                'branch',
                'iops',
                branch
            );
        });

        // Ветки для Latency
        const latencyBranchContainer = d3.select('#latency-branch-filters');
        branches.forEach(branch => {
            this.createFilterCheckbox(
                latencyBranchContainer,
                branch,
                'branches',
                'branch',
                'latency',
                branch
            );
        });

        // Метрики для branch графиков
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

        // Метрики для IOPS
        const iopsMetricContainer = d3.select(groupType === 'config' ? '#iops-metric-filters' : '#iops-branch-metric-filters');
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

        // Метрики для Latency
        const latencyMetricContainer = d3.select(groupType === 'config' ? '#latency-metric-filters' : '#latency-branch-metric-filters');
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

    createIOPSFilters() {
        const configs = this.dataLoader.getUniqueConfigs(this.data.allData);
        const branches = this.dataLoader.getUniqueBranches(this.data.allData);

        // Очищаем контейнеры
        d3.select('#iops-config-filters').html('');
        d3.select('#iops-branch-filters').html('');
        d3.select('#iops-metric-filters').html('');

        // Получаем цвета для конфигураций
        const configColors = this.getConfigColors();

        // Конфигурации для IOPS с цветами
        const configContainer = d3.select('#iops-config-filters');
        configs.forEach(config => {
            this.createFilterCheckboxWithColor(
                configContainer,
                config,
                'configs',
                'iops',
                DataUtils.getConfigDisplayName(config),
                configColors[config]
            );
        });

        // Ветки для IOPS
        const branchContainer = d3.select('#iops-branch-filters');
        branches.forEach(branch => {
            this.createFilterCheckbox(
                branchContainer,
                branch,
                'branches',
                'iops',
                branch
            );
        });

        // Метрики для IOPS
        const metricContainer = d3.select('#iops-metric-filters');
        const iopsMetrics = [
            { id: 'read_iops', label: 'Read IOPS', color: '#1f77b4' },
            { id: 'write_iops', label: 'Write IOPS', color: '#d62728' }
        ];
        iopsMetrics.forEach(metric => {
            this.createFilterCheckboxWithColor(
                metricContainer,
                metric.id,
                'metrics',
                'iops',
                metric.label,
                metric.color
            );
        });
    }

    createLatencyFilters() {
        const configs = this.dataLoader.getUniqueConfigs(this.data.allData);
        const branches = this.dataLoader.getUniqueBranches(this.data.allData);

        // Очищаем контейнеры
        d3.select('#latency-config-filters').html('');
        d3.select('#latency-branch-filters').html('');
        d3.select('#latency-metric-filters').html('');

        // Получаем цвета для конфигураций
        const configColors = this.getConfigColors();

        // Конфигурации для Latency с цветами
        const configContainer = d3.select('#latency-config-filters');
        configs.forEach(config => {
            this.createFilterCheckboxWithColor(
                configContainer,
                config,
                'configs',
                'latency',
                DataUtils.getConfigDisplayName(config),
                configColors[config]
            );
        });

        // Ветки для Latency
        const branchContainer = d3.select('#latency-branch-filters');
        branches.forEach(branch => {
            this.createFilterCheckbox(
                branchContainer,
                branch,
                'branches',
                'latency',
                branch
            );
        });

        // Метрики для Latency
        const metricContainer = d3.select('#latency-metric-filters');
        const latencyMetrics = [
            { id: 'read_latency', label: 'Read Latency', color: '#2ca02c' },
            { id: 'write_latency', label: 'Write Latency', color: '#ff7f0e' }
        ];
        latencyMetrics.forEach(metric => {
            this.createFilterCheckboxWithColor(
                metricContainer,
                metric.id,
                'metrics',
                'latency',
                metric.label,
                metric.color
            );
        });
    }

    // Новый метод для создания чекбоксов с цветами
    createFilterCheckboxWithColor(container, value, filterType, chartType, label, color) {
        const filterItem = container.append('div')
            .attr('class', 'filter-item')
            .attr('data-value', value)
            .attr('data-type', filterType)
            .attr('data-chart', chartType)
            .style('opacity', 1);

        // Цветовой индикатор
        filterItem.append('div')
            .attr('class', 'filter-color')
            .style('background', color);

        // Чекбокс
        const labelElement = filterItem.append('label');

        labelElement.append('input')
            .attr('type', 'checkbox')
            .attr('name', `${chartType}-${filterType}`)
            .attr('value', value)
            .attr('checked', true)
            .on('change', (event) => {
                this.handleFilterChange(filterType, value, event.target.checked, chartType);
                this.updateFilterItemVisibility(filterItem, event.target.checked);
            });

        labelElement.append('span')
            .text(label);
    }

    // Старый метод для чекбоксов без цвета (для веток)
    createFilterCheckbox(container, value, filterType, chartType, label) {
        const filterItem = container.append('div')
            .attr('class', 'filter-item')
            .attr('data-value', value)
            .attr('data-type', filterType)
            .attr('data-chart', chartType)
            .style('opacity', 1);

        const labelElement = filterItem.append('label');

        labelElement.append('input')
            .attr('type', 'checkbox')
            .attr('name', `${chartType}-${filterType}`)
            .attr('value', value)
            .attr('checked', true)
            .on('change', (event) => {
                this.handleFilterChange(filterType, value, event.target.checked, chartType);
                this.updateFilterItemVisibility(filterItem, event.target.checked);
            });

        labelElement.append('span')
            .text(label);
    }

    // Метод для обновления видимости элементов фильтра
    updateFilterItemVisibility(filterItem, isVisible) {
        filterItem.style('opacity', isVisible ? 1 : 0.3);
    }

    // Метод для получения цветов конфигураций
    getConfigColors() {
        const colors = d3.scaleOrdinal(d3.schemeCategory10);
        const configs = this.dataLoader.getUniqueConfigs(this.data.allData);
        const colorMap = {};

        configs.forEach((config, index) => {
            colorMap[config] = colors(config);
        });

        return colorMap;
    }

    // Убираем старый метод createLegend() так как он больше не нужен
    createLegend() {
        // Легенда теперь встроена в фильтры, поэтому этот метод можно оставить пустым
        d3.select('#legend').html('');
    }

    handleFilterChange(filterType, value, isChecked, chartType) {
        if (isChecked) {
            this.filters[chartType][filterType].add(value);
        } else {
            this.filters[chartType][filterType].delete(value);
        }

        this.updateChartVisibility(chartType);

        // Обновляем видимость элементов фильтра
        const filterItem = d3.select(`.filter-item[data-value="${value}"][data-type="${filterType}"][data-chart="${chartType}"]`);
        if (!filterItem.empty()) {
            this.updateFilterItemVisibility(filterItem, isChecked);
        }
    }

    updateChartVisibility(groupType, chartType) {
        const chart = this.getChart(groupType, chartType);
        const filters = this.filters[groupType][chartType];

        if (!chart || !chart.lineData) return;

        chart.lineData.forEach(line => {
            let isVisible = true;

            if (groupType === 'config') {
                const isConfigVisible = filters.configs.has(line.config);
                const isMetricVisible = filters.metrics.has(`${line.type}_${chartType}`);
                isVisible = isConfigVisible && isMetricVisible;
            } else {
                const isBranchVisible = filters.branches.has(line.branch);
                const isMetricVisible = filters.metrics.has(`${line.type}_${chartType}`);
                isVisible = isBranchVisible && isMetricVisible;
            }

            this.charts.updateLineVisibility(chart, line.id, isVisible);
        });
    }

    getChart(groupType, chartType) {
        const charts = {
            'config_iops': this.iopsConfigChart,
            'config_latency': this.latencyConfigChart,
            'branch_iops': this.iopsBranchChart,
            'branch_latency': this.latencyBranchChart
        };
        return charts[`${groupType}_${chartType}`];
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

            // Статистика по meta файлам
            const withMeta = this.data.allData.filter(item => item.hasMeta).length;
            console.log(`📊 Meta файлов: ${withMeta}/${this.data.allData.length}`);

            this.clearFilters();
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

    clearFilters() {
        // Очищаем все контейнеры фильтров
        const filterContainers = [
            '#iops-config-filters',
            '#iops-branch-filters',
            '#iops-metric-filters',
            '#latency-config-filters',
            '#latency-branch-filters',
            '#latency-metric-filters'
        ];

        filterContainers.forEach(selector => {
            d3.select(selector).html('');
        });

        // Сбрасываем состояния фильтров
        this.filters = {
            iops: {
                configs: new Set(),
                branches: new Set(),
                metrics: new Set(['read_iops', 'write_iops'])
            },
            latency: {
                configs: new Set(),
                branches: new Set(),
                metrics: new Set(['read_latency', 'write_latency'])
            }
        };
    }

    showLoading() {
        const containers = d3.selectAll('.chart-content');
        containers.html('<div class="loading">Загрузка данных...</div>');
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
        const containers = d3.selectAll('.chart-content');
        containers.html(`
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
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            if (this.data && this.data.allData.length > 0) {
                this.createCharts();
                this.createFilters();
            }
        });

        // Кнопка обновления данных
        d3.select('#refresh-data').on('click', () => {
            this.refreshData();
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new BenchmarkDashboard();
    dashboard.setupEventListeners();

    // Глобальная ссылка для отладки
    window.benchmarkDashboard = dashboard;
});