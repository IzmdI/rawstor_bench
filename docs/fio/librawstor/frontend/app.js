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
                                    config.replace('perftest--', ''));
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
                                    config.replace('perftest--', ''));
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
        
        chart.lineData.forEach(line => {
            const isConfigVisible = filters.configs.has(line.config);
            const isBranchVisible = filters.branches.has(line.branch);
            const metricType = chartType === 'iops' ? 'iops' : 'latency';
            const isMetricVisible = filters.metrics.has(`${line.type}_${metricType}`);
            
            const isVisible = isConfigVisible && isBranchVisible && isMetricVisible;
            this.charts.updateLineVisibility(chart, line.id, isVisible);
        });
    }

    updateDataInfo() {
        const lastUpdate = this.data.allData.length > 0 ? 
            this.data.allData[this.data.allData.length - 1].date.toLocaleDateString('ru-RU') : 
            'нет данных';
        
        d3.select('#last-update').text(`Последнее обновление: ${lastUpdate}`);
        d3.select('#data-info').text(this.data.allData.length);
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    new BenchmarkDashboard();
});