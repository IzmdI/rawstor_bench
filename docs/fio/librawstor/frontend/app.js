class BenchmarkDashboard {
    constructor() {
        this.dataLoader = new BenchmarkDataLoader();
        this.charts = new BenchmarkCharts();
        this.data = null;
        this.iopsChart = null;
        this.latencyChart = null;
        this.filters = {
            configs: new Set(),
            branches: new Set(),
            metrics: new Set(['read_iops', 'write_iops', 'read_latency', 'write_latency'])
        };
        
        this.init();
    }

    async init() {
        console.log('📊 Инициализация dashboard...');
        
        try {
            this.data = await this.dataLoader.loadAllData();
            this.createCharts();
            this.createFilters();
            this.createLegend();
            this.updateDataInfo();
            
            console.log('✅ Dashboard готов!');
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            this.showError('Ошибка загрузки данных');
        }
    }

    createCharts() {
        const iopsContainer = d3.select('#iops-chart .chart-content');
        const latencyContainer = d3.select('#latency-chart .chart-content');
        
        this.iopsChart = this.charts.createIOPSChart(iopsContainer, this.data.allData);
        this.latencyChart = this.charts.createLatencyChart(latencyContainer, this.data.allData);
    }

    createFilters() {
        this.createConfigFilters();
        this.createBranchFilters();
        this.createMetricFilters();
    }

    createConfigFilters() {
        const configs = this.dataLoader.getUniqueConfigs(this.data.allData);
        const container = d3.select('#config-filters');
        
        configs.forEach(config => {
            const checkbox = container.append('label')
                .style('display', 'block')
                .style('margin', '5px 0');
                
            checkbox.append('input')
                .attr('type', 'checkbox')
                .attr('name', 'config')
                .attr('value', config)
                .attr('checked', true)
                .on('change', (event) => {
                    this.handleFilterChange('configs', config, event.target.checked);
                });
                
            checkbox.append('span')
                .text(config.replace('perftest--', ''));
        });
    }

    createBranchFilters() {
        const branches = this.dataLoader.getUniqueBranches(this.data.allData);
        const container = d3.select('#branch-filters');
        
        branches.forEach(branch => {
            const checkbox = container.append('label')
                .style('display', 'block')
                .style('margin', '5px 0');
                
            checkbox.append('input')
                .attr('type', 'checkbox')
                .attr('name', 'branch')
                .attr('value', branch)
                .attr('checked', true)
                .on('change', (event) => {
                    this.handleFilterChange('branches', branch, event.target.checked);
                });
                
            checkbox.append('span').text(branch);
        });
    }

    createMetricFilters() {
        const metrics = [
            { id: 'read_iops', label: 'Read IOPS' },
            { id: 'write_iops', label: 'Write IOPS' },
            { id: 'read_latency', label: 'Read Latency' },
            { id: 'write_latency', label: 'Write Latency' }
        ];
        
        const container = d3.select('#metric-filters');
        
        metrics.forEach(metric => {
            const checkbox = container.append('label')
                .style('display', 'block')
                .style('margin', '5px 0');
                
            checkbox.append('input')
                .attr('type', 'checkbox')
                .attr('name', 'metric')
                .attr('value', metric.id)
                .attr('checked', true)
                .on('change', (event) => {
                    this.handleFilterChange('metrics', metric.id, event.target.checked);
                });
                
            checkbox.append('span').text(metric.label);
        });
    }

    handleFilterChange(filterType, value, isChecked) {
        if (isChecked) {
            this.filters[filterType].add(value);
        } else {
            this.filters[filterType].delete(value);
        }
        
        this.updateChartVisibility();
        this.updateLegend();
    }

    updateChartVisibility() {
        // Обновляем видимость линий на основе фильтров
        this.iopsChart.lineData.forEach(line => {
            const isConfigVisible = this.filters.configs.has(line.config);
            const isBranchVisible = this.filters.branches.has(line.branch);
            const isMetricVisible = this.filters.metrics.has(`${line.type}_${line.id.includes('iops') ? 'iops' : 'latency'}`);
            
            const isVisible = isConfigVisible && isBranchVisible && isMetricVisible;
            this.charts.updateLineVisibility(this.iopsChart, line.id, isVisible);
        });

        this.latencyChart.lineData.forEach(line => {
            const isConfigVisible = this.filters.configs.has(line.config);
            const isBranchVisible = this.filters.branches.has(line.branch);
            const isMetricVisible = this.filters.metrics.has(`${line.type}_latency`);
            
            const isVisible = isConfigVisible && isBranchVisible && isMetricVisible;
            this.charts.updateLineVisibility(this.latencyChart, line.id, isVisible);
        });
    }

    createLegend() {
        const legend = d3.select('#legend');
        legend.html('');
        
        const allLines = [...this.iopsChart.lineData, ...this.latencyChart.lineData];
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
            
            legendItem.append('span')
                .text(`${line.config.replace('perftest--', '')} - ${line.branch} - ${line.type}`);
        });
    }

    toggleLineVisibility(lineId, isVisible) {
        this.charts.updateLineVisibility(this.iopsChart, lineId, isVisible);
        this.charts.updateLineVisibility(this.latencyChart, lineId, isVisible);
        
        d3.selectAll(`.legend-item[data-line="${lineId}"]`)
            .style('opacity', isVisible ? 1 : 0.3);
    }

    updateLegend() {
        this.createLegend();
    }

    updateDataInfo() {
        const lastUpdate = this.data.allData.length > 0 ? 
            this.data.allData[this.data.allData.length - 1].date.toLocaleDateString('ru-RU') : 
            'нет данных';
        
        d3.select('#last-update').text(`Последнее обновление: ${lastUpdate}`);
        d3.select('#data-info').text(`Загружено тестов: ${this.data.allData.length}`);
    }

    showError(message) {
        const containers = d3.selectAll('.chart-content');
        containers.html(`<div style="color: #e74c3c; text-align: center; padding: 50px;">${message}</div>`);
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    new BenchmarkDashboard();
});