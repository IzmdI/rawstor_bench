class DashboardApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.currentData = null;
        this.charts = new Map();
        this.fullChartData = null;
        this.visibleOperations = new Set(['read']);
        this.visibleConfigGroups = new Set();
        this.configGroups = new Set();
        this.currentTimeRange = 30;
        this.currentConfigBranch = 'refs/heads/main';
        this.allAvailableBranches = new Set();
    }

    async init() {
        console.log('🚀 Initializing dashboard...');

        const params = this.getUrlParams();
        this.currentTimeRange = params.days ? parseInt(params.days) : 30;
        this.currentConfigBranch = params.configBranch || 'refs/heads/main';

        console.log(`🔧 Initial params: timeRange=${this.currentTimeRange} days, branch=${this.currentConfigBranch}`);

        d3.select('#timeRange').property('value', this.currentTimeRange.toString());

        try {
            await this.loadData();
            this.collectAllBranches();
            this.populateBranchSelector();
            this.collectGroups();
            this.createLegend();
            this.createCharts();
            this.setupEventListeners();
            this.updateDataInfo();
            
        } catch (error) {
            console.error('❌ Failed to initialize dashboard:', error);
            this.displayError(error);
        }
    }

    async loadData() {
        console.log('📥 Loading data...');
        this.currentData = await this.dataLoader.loadData();
        this.fullChartData = { ...this.currentData };
        console.log('✅ Data loaded successfully');
    }

    collectAllBranches() {
        this.allAvailableBranches.clear();

        if (this.fullChartData?.charts) {
            const configChartKeys = [
                'iops_read_by_config', 'iops_write_by_config',
                'latency_read_by_config', 'latency_write_by_config'
            ];

            configChartKeys.forEach(chartKey => {
                const chartData = this.fullChartData.charts[chartKey] || [];
                chartData.forEach(point => {
                    if (point.branch && point.branch !== "unknown") {
                        this.allAvailableBranches.add(point.branch);
                    }
                });
            });
        }

        console.log('🌿 All available branches:', Array.from(this.allAvailableBranches));
    }

    populateBranchSelector() {
        const branchSelect = d3.select('#configBranch');
        branchSelect.html('');

        branchSelect.append('option')
            .attr('value', 'all')
            .text('All Branches')
            .property('selected', this.currentConfigBranch === 'all');

        const sortedBranches = Array.from(this.allAvailableBranches)
            .sort((a, b) => {
                if (a.includes('main')) return -1;
                if (b.includes('main')) return 1;
                if (a.includes('develop')) return -1;
                if (b.includes('develop')) return 1;
                return a.localeCompare(b);
            });

        sortedBranches.forEach(branch => {
            const displayName = this.formatBranchDisplayName(branch);
            branchSelect.append('option')
                .attr('value', branch)
                .property('selected', branch === this.currentConfigBranch)
                .text(displayName);
        });

        console.log(`✅ Populated branch selector with ${sortedBranches.length + 1} options`);
    }

    formatBranchDisplayName(branch) {
        if (!branch) return 'Unknown';

        let displayName = branch;

        if (branch.startsWith('refs/heads/')) {
            displayName = branch.replace('refs/heads/', '');
        } else if (branch.startsWith('refs/tags/')) {
            displayName = 'Tag: ' + branch.replace('refs/tags/', '');
        }

        if (displayName === 'main' || displayName === 'master') {
            return `⭐ ${displayName}`;
        } else if (displayName === 'develop') {
            return `🌿 ${displayName}`;
        }

        return displayName;
    }

    collectGroups() {
        this.configGroups.clear();

        console.log(`🔄 collectGroups: timeRange=${this.currentTimeRange} days, branch=${this.currentConfigBranch}`);

        if (this.fullChartData?.charts) {
            const tempConfigGroups = new Set();

            const configChartKeys = ['iops_read_by_config', 'iops_write_by_config', 'latency_read_by_config', 'latency_write_by_config'];

            configChartKeys.forEach(chartKey => {
                const fullData = this.fullChartData.charts[chartKey] || [];
                const timeFilteredData = this.filterDataByTimeRange(fullData, this.currentTimeRange);

                timeFilteredData.forEach(point => {
                    if (point.group) {
                        if (this.currentConfigBranch !== 'all' && point.branch !== this.currentConfigBranch) {
                            return;
                        }
                        tempConfigGroups.add(point.group);
                    }
                });
            });

            console.log('📊 Raw config groups:', Array.from(tempConfigGroups));

            const branchFilterForConfigs = this.currentConfigBranch === 'all' ? null : this.currentConfigBranch;
            this.configGroups = this.filterGroupsWithEnoughData(tempConfigGroups, branchFilterForConfigs);
        }

        this.visibleConfigGroups.clear();
        this.configGroups.forEach(group => this.visibleConfigGroups.add(group));

        console.log('✅ Filtered Config groups:', Array.from(this.configGroups));
    }

    filterDataByTimeRange(chartData, timeRangeDays) {
        console.log(`⏰ filterDataByTimeRange: ${timeRangeDays} days, input points=${chartData?.length || 0}`);

        if (!chartData || !Array.isArray(chartData) || timeRangeDays === 0) {
            return chartData;
        }

        const now = new Date();
        const cutoffDate = new Date(now.getTime() - timeRangeDays * 24 * 60 * 60 * 1000);
        cutoffDate.setHours(0, 0, 0, 0);

        const filteredData = chartData.filter(point => {
            if (!point.timestamp || point.timestamp === "Unknown date") {
                return false;
            }

            try {
                const pointDate = new Date(point.timestamp);
                return pointDate >= cutoffDate;
            } catch (e) {
                return false;
            }
        });

        console.log(`⏰ Filter result: ${chartData.length} -> ${filteredData.length} points`);
        return filteredData;
    }

    filterGroupsWithEnoughData(groups, branchFilter = null) {
        const filteredGroups = new Set();
        const timeRangeDays = this.currentTimeRange === 0 ? 365 : this.currentTimeRange;

        groups.forEach(group => {
            if (this.hasGroupEnoughData(group, timeRangeDays, branchFilter)) {
                filteredGroups.add(group);
            } else {
                console.log(`⚠️ Filtered out config group "${group}" - insufficient data`);
            }
        });

        return filteredGroups;
    }

    hasGroupEnoughData(group, timeRangeDays, branchFilter = null) {
        if (!this.fullChartData?.charts) return false;

        const chartKeys = ['iops_read_by_config', 'iops_write_by_config', 'latency_read_by_config', 'latency_write_by_config'];
        const uniqueDays = new Set();

        chartKeys.forEach(chartKey => {
            const fullData = this.fullChartData.charts[chartKey] || [];
            const timeFilteredData = this.filterDataByTimeRange(fullData, timeRangeDays);

            timeFilteredData.forEach(point => {
                if (branchFilter && point.branch !== branchFilter) {
                    return;
                }

                if (point.group === group && point.timestamp && point.timestamp !== "Unknown date") {
                    const date = new Date(point.timestamp);
                    const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                    uniqueDays.add(dayKey);
                }
            });
        });

        const hasEnoughData = uniqueDays.size >= 2;
        console.log(`📅 Config group "${group}": ${uniqueDays.size} unique days - ${hasEnoughData ? 'KEEP' : 'FILTER OUT'}`);
        return hasEnoughData;
    }

    createCharts() {
        if (!this.currentData?.charts || !this.fullChartData?.charts) {
            throw new Error('No chart data available');
        }

        console.log(`🎨 createCharts: timeRange=${this.currentTimeRange} days, branch=${this.currentConfigBranch}`);
        console.log(`🎨 Available config groups: ${Array.from(this.configGroups).length}`);

        const chartsConfig = [
            {
                id: 'chart-iops-config',
                title: this.getChartTitle('IOPS'),
                yLabel: 'kIOPS',
                dataKey: 'iops',
                groupBy: 'config',
                timeRangeDays: this.currentTimeRange,
                legendType: 'config',
                metricType: 'iops',
                visibleOperations: Array.from(this.visibleOperations),
                availableGroups: Array.from(this.configGroups),
                branchFilter: this.currentConfigBranch === 'all' ? null : this.currentConfigBranch,
                sourceChartKeys: ['iops_read_by_config', 'iops_write_by_config'],
                dataAlreadyFiltered: false
            },
            {
                id: 'chart-latency-config',
                title: this.getChartTitle('Latency'),
                yLabel: 'ms',
                dataKey: 'latency',
                groupBy: 'config',
                timeRangeDays: this.currentTimeRange,
                legendType: 'config',
                metricType: 'latency',
                visibleOperations: Array.from(this.visibleOperations),
                availableGroups: Array.from(this.configGroups),
                branchFilter: this.currentConfigBranch === 'all' ? null : this.currentConfigBranch,
                sourceChartKeys: ['latency_read_by_config', 'latency_write_by_config'],
                dataAlreadyFiltered: false
            }
        ];

        chartsConfig.forEach(config => {
            console.log(`\n📈 Processing chart: ${config.id}`);
            
            let chartData = [];

            config.sourceChartKeys.forEach(chartKey => {
                const fullData = this.fullChartData.charts[chartKey] || [];
                const metric = chartKey.includes('iops_read') ? 'iops_read' :
                              chartKey.includes('iops_write') ? 'iops_write' :
                              chartKey.includes('latency_read') ? 'latency_read' : 'latency_write';

                fullData.forEach(d => {
                    chartData.push({
                        ...d,
                        metric: metric,
                        dataKey: chartKey
                    });
                });
            });

            console.log(`📊 ${config.id}: Total data points: ${chartData.length}`);

            if (config.branchFilter) {
                const originalCount = chartData.length;
                chartData = chartData.filter(d => d.branch === config.branchFilter);
                console.log(`📊 After branch filter: ${chartData.length} points`);
            }

            console.log(`✅ ${config.id}: Final data points for chart: ${chartData.length}`);

            if (chartData && chartData.length > 0) {
                try {
                    const chart = createChart({
                        container: d3.select(`#${config.id}`),
                        title: config.title,
                        yLabel: config.yLabel,
                        data: chartData,
                        accessor: d => d.value,
                        id: config.id,
                        groupBy: config.groupBy,
                        timeRangeDays: this.currentTimeRange,
                        legendType: config.legendType,
                        metricType: config.metricType,
                        visibleOperations: config.visibleOperations,
                        availableGroups: config.availableGroups,
                        dataAlreadyFiltered: false
                    });
                    
                    if (chart) {
                        this.charts.set(config.id, chart);
                        console.log(`✅ Chart ${config.id} created successfully`);
                    }
                } catch (error) {
                    console.error(`❌ Error creating chart ${config.id}:`, error);
                    d3.select(`#${config.id}`).html(`<p class="error">Error: ${error.message}</p>`);
                }
            } else {
                const noDataMessage = config.branchFilter
                    ? `<p class="no-data">No data for ${this.formatBranchDisplayName(config.branchFilter)} branch</p>`
                    : `<p class="no-data">No data available</p>`;
                d3.select(`#${config.id}`).html(noDataMessage);
            }
        });
    }

    getChartTitle(metric) {
        if (this.currentConfigBranch === 'all') {
            return `${metric} (All Branches)`;
        } else {
            const branchDisplayName = this.formatBranchDisplayName(this.currentConfigBranch);
            return `${metric} - ${branchDisplayName} Branch`;
        }
    }

    createLegend() {
        const legendContainer = d3.select('#legend-config');
        legendContainer.html('');

        if (this.configGroups.size === 0) {
            const branchName = this.currentConfigBranch === 'all'
                ? 'any branch'
                : this.formatBranchDisplayName(this.currentConfigBranch);
            legendContainer.html(`<p style="color: #6c757d; font-style: italic;">No data for ${branchName}</p>`);
            return;
        }

        // Операции
        const operationToggle = legendContainer.append('div')
            .attr('class', 'operation-toggle');

        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleOperations.has('read') && !this.visibleOperations.has('write') ? 'active' : ''}`)
            .text('Read Only')
            .on('click', () => this.setOperations(['read']));

        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleOperations.has('write') && !this.visibleOperations.has('read') ? 'active' : ''}`)
            .text('Write Only')
            .on('click', () => this.setOperations(['write']));

        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleOperations.has('read') && this.visibleOperations.has('write') ? 'active' : ''}`)
            .text('Both')
            .on('click', () => this.setOperations(['read', 'write']));

        // Группы
        const configsArray = Array.from(this.configGroups);

        configsArray.forEach((config, configIndex) => {
            const groupContainer = legendContainer.append('div').attr('class', 'legend-group');

            groupContainer.append('div')
                .attr('class', 'legend-group-title')
                .style('cursor', 'pointer')
                .text(config)
                .on('click', () => this.toggleConfigGroup(config));

            const legendItem = groupContainer.append('div')
                .attr('class', `legend-item ${this.visibleConfigGroups.has(config) ? '' : 'disabled'}`)
                .on('click', (event) => {
                    event.stopPropagation();
                    this.toggleConfigGroup(config);
                });

            legendItem.append('span')
                .attr('class', 'legend-color')
                .style('background-color', getColor(configIndex));

            legendItem.append('span')
                .attr('class', 'legend-label')
                .text('Read/Write');
        });
    }

    setOperations(operations) {
        console.log(`🔄 setOperations: ${Array.from(operations)}`);
        this.visibleOperations = new Set(operations);
        this.updateChartsVisibility();
        this.updateLegendAppearance();
    }

    toggleConfigGroup(group) {
        if (this.visibleConfigGroups.has(group)) {
            this.visibleConfigGroups.delete(group);
        } else {
            this.visibleConfigGroups.add(group);
        }
        this.updateChartsVisibility();
        this.updateLegendAppearance();
    }

    updateChartsVisibility() {
        console.log('👁️ Updating charts visibility...');
        console.log(`   Visible operations: ${Array.from(this.visibleOperations)}`);
        console.log(`   Visible groups: ${Array.from(this.visibleConfigGroups)}`);

        const chartIds = ['chart-iops-config', 'chart-latency-config'];

        chartIds.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart && chart.updateVisibility && chart.fullGroups) {
                const visibleFullGroups = new Set();
                
                chart.fullGroups.forEach(fullGroup => {
                    const [group, operation] = fullGroup.split(' - ');
                    if (this.visibleConfigGroups.has(group) && this.visibleOperations.has(operation)) {
                        visibleFullGroups.add(fullGroup);
                    }
                });
                
                console.log(`   ${chartId}: ${visibleFullGroups.size} visible groups`);
                chart.updateVisibility(visibleFullGroups);
            }
        });
    }

    updateLegendAppearance() {
        try {
            // Обновляем кнопки операций
            const operationButtons = document.querySelectorAll('#legend-config .operation-toggle-btn');
            operationButtons.forEach(button => {
                const text = button.textContent.trim();
                let isActive = false;
                
                if (text === 'Read Only') {
                    isActive = this.visibleOperations.has('read') && !this.visibleOperations.has('write');
                } else if (text === 'Write Only') {
                    isActive = this.visibleOperations.has('write') && !this.visibleOperations.has('read');
                } else if (text === 'Both') {
                    isActive = this.visibleOperations.has('read') && this.visibleOperations.has('write');
                }
                
                button.classList.toggle('active', isActive);
            });

            // Обновляем группы
            const legendGroups = document.querySelectorAll('#legend-config .legend-group');
            legendGroups.forEach(group => {
                const titleElement = group.querySelector('.legend-group-title');
                const legendItem = group.querySelector('.legend-item');
                
                if (titleElement && legendItem) {
                    const groupTitle = titleElement.textContent.trim();
                    legendItem.classList.toggle('disabled', !this.visibleConfigGroups.has(groupTitle));
                }
            });
        } catch (error) {
            console.error('Error updating legend appearance:', error);
        }
    }

    updateDataInfo() {
        if (!this.currentData) return;

        const configBranchDisplay = this.currentConfigBranch === 'all'
            ? 'All Branches'
            : this.formatBranchDisplayName(this.currentConfigBranch);

        const timeRangeDisplay = this.currentTimeRange === 0
            ? 'All time'
            : `Last ${this.currentTimeRange} days`;

        const infoHtml = `
            <p><strong>Generated:</strong> ${new Date(this.currentData.generated_at).toLocaleString()}</p>
            <p><strong>Total tests:</strong> ${this.currentData.summary?.total_tests || 0}</p>
            <p><strong>Time range:</strong> ${timeRangeDisplay}</p>
            <p><strong>Branch:</strong> ${configBranchDisplay}</p>
            <p><strong>Configurations:</strong> ${Array.from(this.configGroups).join(', ') || 'N/A'}</p>
        `;

        d3.select('#data-info').html(infoHtml);
    }

    setupEventListeners() {
        d3.select('#refreshBtn').on('click', () => this.refreshData());
        d3.select('#timeRange').on('change', (event) => this.handleTimeRangeChange(event.target.value));
        d3.select('#configBranch').on('change', (event) => this.handleConfigBranchChange(event.target.value));
    }

    handleConfigBranchChange(branchValue) {
        if (branchValue === this.currentConfigBranch) return;
        
        this.currentConfigBranch = branchValue;
        
        const url = new URL(window.location.href);
        if (this.currentConfigBranch === 'refs/heads/main') {
            url.searchParams.delete('configBranch');
        } else {
            url.searchParams.set('configBranch', this.currentConfigBranch);
        }
        window.history.pushState({}, '', url.toString());

        console.log(`🌿 Branch updated to: ${this.currentConfigBranch}`);
        
        this.collectGroups();
        this.recreateCharts();
        this.updateDataInfo();
    }

    async refreshData() {
        try {
            this.showLoading(true);
            await this.loadData();
            this.collectAllBranches();
            this.populateBranchSelector();
            this.collectGroups();
            this.recreateCharts();
            this.showLoading(false);
            this.showNotification('Data refreshed', 'success');
        } catch (error) {
            console.error('Refresh failed:', error);
            this.showNotification('Refresh failed', 'error');
            this.showLoading(false);
        }
    }

    handleTimeRangeChange(days) {
        const newTimeRange = days === 'all' ? 0 : parseInt(days);
        
        if (newTimeRange === this.currentTimeRange) return;
        
        this.currentTimeRange = newTimeRange;
        this.updateTimeRange();
    }

    updateTimeRange() {
        const url = new URL(window.location.href);
        if (this.currentTimeRange === 0) {
            url.searchParams.delete('days');
        } else {
            url.searchParams.set('days', this.currentTimeRange.toString());
        }
        window.history.pushState({}, '', url.toString());

        console.log(`🔄 Time range updated to: ${this.currentTimeRange} days`);
        
        this.collectGroups();
        this.recreateCharts();
        this.updateDataInfo();
        
        this.showNotification(`Time range: ${this.currentTimeRange === 0 ? 'all time' : `${this.currentTimeRange} days`}`, 'success');
    }

    recreateCharts() {
        console.log('🔄 Recreating charts...');
        
        ['#chart-iops-config', '#chart-latency-config'].forEach(selector => {
            d3.select(selector).html('');
        });
        
        this.charts.clear();
        this.createCharts();
        this.createLegend();
    }

    showLoading(show) {
        const loading = d3.select('#loading');
        const button = d3.select('#refreshBtn');
        
        if (show) {
            loading.style('display', 'flex');
            button.attr('disabled', true).text('Refreshing...');
        } else {
            loading.style('display', 'none');
            button.attr('disabled', null).text('Refresh Data');
        }
    }

    showNotification(message, type = 'success') {
        const notification = d3.select('body')
            .append('div')
            .attr('class', `notification ${type}`)
            .text(message);

        setTimeout(() => notification.remove(), 3000);
    }

    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            days: urlParams.get('days') || '30',
            configBranch: urlParams.get('configBranch') || 'refs/heads/main'
        };
    }

    displayError(error) {
        const errorHtml = `
            <div class="error">
                <h3>Error Loading Dashboard</h3>
                <p>${error.message}</p>
                <p>Please check the console.</p>
            </div>
        `;
        d3.select('body').html(errorHtml);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new DashboardApp();
    app.init();
});