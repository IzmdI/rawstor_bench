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
            // Для конфигураций: каждая линия управляется отдельно
            config: {
                iops: new Set(),    // Будет хранить ID линий: 'config-[configName]-read', 'config-[configName]-write'
                latency: new Set()   // Аналогично для latency
            },
            // Для веток: каждая линия управляется отдельно
            branch: {
                iops: new Set(),    // 'branch-[branchName]-read', 'branch-[branchName]-write'
                latency: new Set()   // Аналогично для latency
            } // test
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

        // Все графики создаются одинаково
        const iopsConfigContainer = d3.select('#iops-by-config-chart .chart-content');
        const latencyConfigContainer = d3.select('#latency-by-config-chart .chart-content');
        const iopsBranchContainer = d3.select('#iops-by-branch-chart .chart-content');
        const latencyBranchContainer = d3.select('#latency-by-branch-chart .chart-content');

        this.iopsConfigChart = this.charts.createChart(iopsConfigContainer, validData, 'config', 'iops');
        this.latencyConfigChart = this.charts.createChart(latencyConfigContainer, validData, 'config', 'latency');
        this.iopsBranchChart = this.charts.createChart(iopsBranchContainer, validData, 'branch', 'iops');
        this.latencyBranchChart = this.charts.createChart(latencyBranchContainer, validData, 'branch', 'latency');
    }

    get configColors() {
        // Кэшируем цвета для консистентности
        if (!this._configColors) {
            this._configColors = d3.scaleOrdinal(d3.schemeCategory10);
        }
        return this._configColors;
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
            const color = this.configColors(config);

            // IOPS - Read
            this.createFilterCheckboxWithColor(
                iopsConfigContainer,
                `config-${config}-read`,
                'config',
                'iops',
                `${DataUtils.getConfigDisplayName(config)} - Read`,
                color
            );

            // IOPS - Write
            this.createFilterCheckboxWithColor(
                iopsConfigContainer,
                `config-${config}-write`,
                'config',
                'iops',
                `${DataUtils.getConfigDisplayName(config)} - Write`,
                color
            );

            // Latency - Read
            this.createFilterCheckboxWithColor(
                latencyConfigContainer,
                `config-${config}-read`,
                'config',
                'latency',
                `${DataUtils.getConfigDisplayName(config)} - Read`,
                color
            );

            // Latency - Write
            this.createFilterCheckboxWithColor(
                latencyConfigContainer,
                `config-${config}-write`,
                'config',
                'latency',
                `${DataUtils.getConfigDisplayName(config)} - Write`,
                color
            );
        });
    }

    createBranchFilters() {
        const branches = this.dataLoader.getUniqueBranches(this.data.allData);

        const iopsBranchContainer = d3.select('#iops-branch-filters');
        const latencyBranchContainer = d3.select('#latency-branch-filters');

        branches.forEach(branch => {
            const colorRead = this.charts.getLineColor(branch, 'read', 'iops', 'branch');
            const colorWrite = this.charts.getLineColor(branch, 'write', 'iops', 'branch');

            // Read IOPS
            this.createFilterCheckboxWithColor(
                iopsBranchContainer,
                `branch-${branch}-read`, // Уникальный ID линии
                'branch',
                'iops',
                `${branch} - Read`,
                colorRead
            );

            // Write IOPS
            this.createFilterCheckboxWithColor(
                iopsBranchContainer,
                `branch-${branch}-write`, // Уникальный ID линии
                'branch',
                'iops',
                `${branch} - Write`,
                colorWrite
            );

            // Read Latency
            this.createFilterCheckboxWithColor(
                latencyBranchContainer,
                `branch-${branch}-read`, // Уникальный ID линии
                'branch',
                'latency',
                `${branch} - Read`,
                colorRead
            );

            // Write Latency
            this.createFilterCheckboxWithColor(
                latencyBranchContainer,
                `branch-${branch}-write`, // Уникальный ID линии
                'branch',
                'latency',
                `${branch} - Write`,
                colorWrite
            );
        });
    }

    createFilterCheckboxWithColor(container, lineId, groupType, chartType, label, color) {
        const filterItem = container.append('div')
            .attr('class', 'filter-item')
            .attr('data-line', lineId)
            .attr('data-group', groupType)
            .attr('data-chart', chartType);

        filterItem.append('div')
            .attr('class', 'filter-color')
            .style('background', color);

        const labelElement = filterItem.append('label');

        labelElement.append('input')
            .attr('type', 'checkbox')
            .attr('name', `${groupType}-${chartType}`)
            .attr('value', lineId)
            .attr('checked', true)
            .on('change', (event) => {
                this.handleLineVisibility(lineId, event.target.checked, groupType, chartType);
            });

        labelElement.append('span').text(label);

        // Добавляем линию в фильтры по умолчанию
        this.filters[groupType][chartType].add(lineId);
    }

    handleLineVisibility(lineId, isVisible, groupType, chartType) {
        if (isVisible) {
            this.filters[groupType][chartType].add(lineId);
        } else {
            this.filters[groupType][chartType].delete(lineId);
        }

        this.updateChartVisibility(groupType, chartType);
    }

    updateChartVisibility(groupType, chartType) {
        const chart = this.getChart(groupType, chartType);
        const visibleLines = this.filters[groupType][chartType];

        if (!chart || !chart.lineData) return;

        chart.lineData.forEach(line => {
            const isVisible = visibleLines.has(line.id);
            this.charts.updateLineVisibility(chart, line.id, isVisible);
            line.visible = isVisible;
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