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
        
        // Конфигурации для IOPS
        const configContainer = d3.select('#iops-config-filters');
        configs.forEach(config => {
            this.createFilterCheckbox(configContainer, config, 'configs', 'iops', 
                                    DataUtils.getConfigDisplayName(config));
        });

        // Ветки для IOPS
        const branchContainer = d3.select('#iops-branch-filters');
        branches.forEach(branch => {
            this.createFilterCheckbox(branchContainer, branch, 'branches', 'iops', branch);
        });

        // Метрики для IOPS
        const metricContainer = d3.select('#iops-metric-filters');
        const iopsMetrics = [
            { id: 'read_iops', label: 'Read IOPS' },
            { id: 'write_iops', label: 'Write IOPS' }
        ];
        iopsMetrics.forEach(metric => {
            this.createFilterCheckbox(metricContainer, metric.id, 'metrics', 'iops', metric.label);
        });
    }

    createLatencyFilters() {
        const configs = this.dataLoader.getUniqueConfigs(this.data.allData);
        const branches = this.dataLoader.getUniqueBranches(this.data.allData);
        
        // Конфигурации для Latency
        const configContainer = d3.select('#latency-config-filters');
        configs.forEach(config => {
            this.createFilterCheckbox(configContainer, config, 'configs', 'latency', 
                                    DataUtils.getConfigDisplayName(config));
        });

        // Ветки для Latency
        const branchContainer = d3.select('#latency-branch-filters');
        branches.forEach(branch => {
            this.createFilterCheckbox(branchContainer, branch, 'branches', 'latency', branch);
        });

        // Метрики для Latency
        const metricContainer = d3.select('#latency-metric-filters');
        const latencyMetrics = [
            { id: 'read_latency', label: 'Read Latency' },
            { id: 'write_latency', label: 'Write Latency' }
        ];
        latencyMetrics.forEach(metric => {
            this.createFilterCheckbox(metricContainer, metric.id, 'metrics', 'latency', metric.label);
        });
    }

    createFilterCheckbox(container, value, filterType, chartType, label) {
        const checkbox = container.append('label')
            .style('display', 'block')
            .style('margin', '3px 0');
            
        checkbox.append('input')
            .attr('type', 'checkbox')
            .attr('name', `${chartType}-${filterType}`)
            .attr('value', value)
            .attr('checked', true)
            .on('change', (event) => {
                this.handleFilterChange(filterType, value, event.target.checked, chartType);
            });
            
        checkbox.append('span')
            .text(label)
            .style('font-size', '11px');
    }

    handleFilterChange(filterType, value, isChecked, chartType) {
        if (isChecked) {
            this.filters[chartType][filterType].add(value);
        } else {
            this.filters[chartType][filterType].delete(value);
        }
        
        this.updateChartVisibility(chartType);
        this.updateLegend();
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

    createLegend() {
        const legend = d3.select('#legend');
        legend.html('');
        
        if (!this.iopsChart || !this.iopsChart.lineData) return;

        const allLines = [...this.iopsChart.lineData, ...(this.latencyChart?.lineData || [])];
        const uniqueLines = [...new Set(allLines.map(line => line.id))];
        
        uniqueLines.forEach(lineId => {
            const line = allLines.find(l => l.id === lineId);
            if (!line) return;
            
            const legendItem = legend.append('div')
                .attr('class', 'legend-item')
                .attr('data-line', lineId)
                .style('opacity', line.visible ? 1 : 0.3)
                .on('click', () => {
                    const isCurrentlyVisible = line.visible;
                    line.visible = !isCurrentlyVisible;
                    this.toggleLineVisibility(lineId, !isCurrentlyVisible);
                });
            
            legendItem.append('div')
                .attr('class', 'legend-color')
                .style('background', line.color);
            
            const displayName = `${DataUtils.getConfigDisplayName(line.config)} - ${line.branch} - ${line.type}`;
            legendItem.append('span')
                .text(displayName)
                .style('font-size', '11px');
        });
    }

    toggleLineVisibility(lineId, isVisible) {
        if (this.iopsChart) {
            this.charts.updateLineVisibility(this.iopsChart, lineId, isVisible);
        }
        if (this.latencyChart) {
            this.charts.updateLineVisibility(this.latencyChart, lineId, isVisible);
        }
        
        d3.selectAll(`.legend-item[data-line="${lineId}"]`)
            .style('opacity', isVisible ? 1 : 0.3);
    }

    updateLegend() {
        this.createLegend();
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
            // Очищаем кэш загрузчика
            if (this.dataLoader.clearCache) {
                this.dataLoader.clearCache();
            }
            
            // Перезагружаем данные
            this.data = await this.dataLoader.loadAllData();
            this.hideLoading();
            
            // Пересоздаем графики
            this.createCharts();
            this.createFilters();
            this.createLegend();
            this.updateDataInfo();
            
            console.log('✅ Данные обновлены!');
        } catch (error) {
            console.error('❌ Ошибка обновления:', error);
            this.hideLoading();
            alert('Ошибка при обновлении данных');
        }
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