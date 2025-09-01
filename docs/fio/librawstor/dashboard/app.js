class BenchmarkDashboard {
    constructor() {
        this.dataLoader = new BenchmarkDataLoader();
        this.charts = new BenchmarkCharts();
        this.data = null;
        this.iopsChart = null;
        this.latencyChart = null;
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
            this.createLegend();
            this.addExportButtons();
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

        // Фильтруем данные с NaN
        const validData = this.data.allData.filter(item =>
            item.date instanceof Date &&
            !isNaN(item.date.getTime()) &&
            !isNaN(item.read_iops) &&
            !isNaN(item.write_iops) &&
            !isNaN(item.read_latency) &&
            !isNaN(item.write_latency)
        );

        if (validData.length === 0) {
            this.showError('Все данные содержат ошибки (NaN значения)');
            return;
        }

        console.log(`📊 Valid данных: ${validData.length}/${this.data.allData.length}`);

        const iopsContainer = d3.select('#iops-chart .chart-content');
        const latencyContainer = d3.select('#latency-chart .chart-content');
        
        this.iopsChart = this.charts.createIOPSChart(iopsContainer, this.data.allData);
        this.latencyChart = this.charts.createLatencyChart(latencyContainer, this.data.allData);
    }

    createFilters() {
        this.createIOPSFilters();
        this.createLatencyFilters();
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

    updateChartVisibility(chartType) {
        const chart = chartType === 'iops' ? this.iopsChart : this.latencyChart;
        const filters = this.filters[chartType];
        
        if (!chart || !chart.lineData) return;

        chart.lineData.forEach(line => {
            const isConfigVisible = filters.configs.has(line.config);
            const isBranchVisible = filters.branches.has(line.branch);
            const metricType = chartType === 'iops' ? 'iops' : 'latency';
            const isMetricVisible = filters.metrics.has(`${line.type}_${metricType}`);
            
            const isVisible = isConfigVisible && isBranchVisible && isMetricVisible;
            this.charts.updateLineVisibility(chart, line.id, isVisible);
        });
    }

    addExportButtons() {
        const header = d3.select('header');
        
        // Кнопка экспорта IOPS
        header.append('button')
            .attr('class', 'export-btn')
            .text('📥 Экспорт IOPS')
            .style('margin', '10px 5px')
            .on('click', () => this.exportChart('iops'));
        
        // Кнопка экспорта Latency
        header.append('button')
            .attr('class', 'export-btn')
            .text('📥 Экспорт Latency')
            .style('margin', '10px 5px')
            .on('click', () => this.exportChart('latency'));
        
        // Кнопка обновления данных
        header.append('button')
            .attr('class', 'export-btn')
            .text('🔄 Обновить данные')
            .style('margin', '10px 5px')
            .on('click', () => this.refreshData());
    }

    exportChart(chartType) {
        const chart = chartType === 'iops' ? this.iopsChart : this.latencyChart;
        if (!chart || !chart.svg) {
            alert('График не доступен для экспорта');
            return;
        }

        try {
            const svgString = new XMLSerializer().serializeToString(chart.svg.node());
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `rawstor-${chartType}-${new Date().toISOString().split('T')[0]}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка экспорта:', error);
            alert('Ошибка при экспорте графика');
        }
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
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new BenchmarkDashboard();
    dashboard.setupEventListeners();
    
    // Глобальная ссылка для отладки
    window.benchmarkDashboard = dashboard;
});