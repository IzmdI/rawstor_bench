function createSafeClassName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

class DashboardApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.currentData = null;
        this.charts = new Map();
        
        // Храним полные нефильтрованные данные
        this.fullChartData = null;
        
        // Управление видимостью операций
        this.visibleOperations = new Set(['read']);

        // Управление видимостью групп
        this.visibleConfigGroups = new Set();
        this.configGroups = new Set();

        // Текущий масштаб времени и выбранная ветка
        this.currentTimeRange = 30; // по умолчанию 30 дней
        this.currentConfigBranch = 'refs/heads/main'; // по умолчанию main ветка

        // Все доступные ветки для селектора
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

            // Тестовый вывод для отладки
            this.debugDataInfo();
            
        } catch (error) {
            console.error('❌ Failed to initialize dashboard:', error);
            this.displayError(error);
        }
    }

    async loadData() {
        console.log('📥 Loading data...');
        this.currentData = await this.dataLoader.loadData();

        // Сохраняем полные данные для фильтрации на клиенте
        this.fullChartData = { ...this.currentData };

        console.log('✅ Data loaded successfully');
        console.log(`📊 Full dataset has ${this.fullChartData.summary?.total_tests || 0} tests`);
        
        // Проверим диапазон дат в данных
        if (this.fullChartData.summary?.time_range) {
            console.log(`📅 Data time range in summary: ${this.fullChartData.summary.time_range.start} to ${this.fullChartData.summary.time_range.end}`);
        }
        
        // Проверим фактические даты в данных
        this.debugDataDates();
    }

    // Метод для отладки дат в данных
    debugDataDates() {
        if (!this.fullChartData?.charts) return;
        
        const testChartKey = 'iops_read_by_config';
        const testData = this.fullChartData.charts[testChartKey] || [];
        
        if (testData.length > 0) {
            const dates = testData
                .map(p => p.timestamp)
                .filter(ts => ts && ts !== "Unknown date")
                .map(ts => new Date(ts).toISOString().split('T')[0]);
            
            const uniqueDates = [...new Set(dates)].sort();
            console.log(`📅 Debug: ${testChartKey} has ${testData.length} points, ${uniqueDates.length} unique dates`);
            console.log(`📅 Date range: ${uniqueDates[0]} to ${uniqueDates[uniqueDates.length - 1]}`);
            
            // Покажем распределение по месяцам
            const months = dates.map(d => d.substring(0, 7));
            const monthCounts = {};
            months.forEach(m => monthCounts[m] = (monthCounts[m] || 0) + 1);
            console.log(`📅 Monthly distribution:`, monthCounts);
        }
    }

    // Метод для общей отладки
    debugDataInfo() {
        console.log('🔍 DEBUG INFO:');
        console.log(`   Current time range: ${this.currentTimeRange} days`);
        console.log(`   Current branch: ${this.currentConfigBranch}`);
        console.log(`   Config groups: ${Array.from(this.configGroups).length}`);
        console.log(`   Full data available: ${!!this.fullChartData}`);
        
        if (this.fullChartData?.summary) {
            console.log(`   Total tests: ${this.fullChartData.summary.total_tests}`);
            console.log(`   Configurations: ${this.fullChartData.summary.configurations?.length || 0}`);
        }
    }

    // Метод для сбора всех доступных веток из данных
    collectAllBranches() {
        this.allAvailableBranches.clear();

        if (this.fullChartData?.charts) {
            // Собираем ветки из всех конфигурационных графиков
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

    // Метод для заполнения селектора веток
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

    // Метод для фильтрации данных на клиенте по временному диапазону
    filterDataByTimeRange(chartData, timeRangeDays) {
        console.log(`⏰ filterDataByTimeRange: timeRangeDays=${timeRangeDays}, input points=${chartData?.length || 0}`);

        if (!chartData || !Array.isArray(chartData)) {
            console.log('⏰ No data to filter');
            return [];
        }

        if (timeRangeDays === 0) {
            console.log(`⏰ Returning all ${chartData.length} points (timeRangeDays=0)`);
            return chartData;
        }

        const now = new Date();
        const cutoffDate = new Date(now.getTime() - timeRangeDays * 24 * 60 * 60 * 1000);
        
        // Устанавливаем время на начало дня для точной фильтрации
        cutoffDate.setHours(0, 0, 0, 0);

        console.log(`⏰ Now: ${now.toISOString().split('T')[0]}`);
        console.log(`⏰ Cutoff date: ${cutoffDate.toISOString().split('T')[0]} (${timeRangeDays} days ago)`);

        const filteredData = [];
        let skippedCount = 0;

        chartData.forEach(point => {
            if (!point.timestamp || point.timestamp === "Unknown date") {
                skippedCount++;
                return;
            }

            try {
                const pointDate = new Date(point.timestamp);
                
                // Для отладки: покажем несколько точек у границы
                if (filteredData.length < 3 && pointDate >= cutoffDate) {
                    console.log(`   ✅ Sample kept point: ${pointDate.toISOString().split('T')[0]} (group: ${point.group})`);
                }
                if (skippedCount < 3 && pointDate < cutoffDate) {
                    console.log(`   ❌ Sample skipped point: ${pointDate.toISOString().split('T')[0]} (group: ${point.group})`);
                }
                
                if (pointDate >= cutoffDate) {
                    filteredData.push(point);
                } else {
                    skippedCount++;
                }
            } catch (e) {
                console.warn(`⏰ Error parsing date: ${point.timestamp}`, e);
                skippedCount++;
            }
        });

        console.log(`⏰ Filter result: ${filteredData.length} points kept, ${skippedCount} points removed`);
        
        // Проверим диапазон дат в отфильтрованных данных
        if (filteredData.length > 0) {
            const dates = filteredData.map(p => new Date(p.timestamp).toISOString().split('T')[0]);
            const uniqueDates = [...new Set(dates)].sort();
            console.log(`⏰ Filtered data range: ${uniqueDates[0]} to ${uniqueDates[uniqueDates.length - 1]} (${uniqueDates.length} unique days)`);
        }

        return filteredData;
    }

    // Собираем группы конфигураций
    collectGroups() {
        this.configGroups.clear();

        console.log(`🔄 collectGroups: timeRange=${this.currentTimeRange} days, branch=${this.currentConfigBranch}`);

        if (this.fullChartData?.charts) {
            const tempConfigGroups = new Set();

            const configChartKeys = ['iops_read_by_config', 'iops_write_by_config', 'latency_read_by_config', 'latency_write_by_config'];

            configChartKeys.forEach(chartKey => {
                const fullData = this.fullChartData.charts[chartKey] || [];
                console.log(`  📊 ${chartKey}: ${fullData.length} points in full dataset`);

                // ИСПРАВЛЕНИЕ: Используем ту же логику фильтрации, что и в charts.js
                const timeFilteredData = this.filterDataForChart(fullData, this.currentTimeRange);
                console.log(`  📊 ${chartKey}: ${timeFilteredData.length} points after time filter`);

                timeFilteredData.forEach(point => {
                    if (point.group) {
                        // Если выбрана конкретная ветка - фильтруем
                        if (this.currentConfigBranch !== 'all' && point.branch !== this.currentConfigBranch) {
                            return;
                        }
                        tempConfigGroups.add(point.group);
                    }
                });
            });

            console.log('📊 Raw config groups after time filter:', Array.from(tempConfigGroups));

            // Фильтруем группы с учетом выбранной ветки
            const branchFilterForConfigs = this.currentConfigBranch === 'all' ? null : this.currentConfigBranch;
            this.configGroups = this.filterGroupsWithEnoughData(tempConfigGroups, branchFilterForConfigs);
        }

        // Показываем все отфильтрованные группы по умолчанию
        this.visibleConfigGroups.clear();
        this.configGroups.forEach(group => this.visibleConfigGroups.add(group));

        console.log('✅ Filtered Config groups:', Array.from(this.configGroups));
        console.log('✅ Visible Config groups:', Array.from(this.visibleConfigGroups));
    }

    // Новая функция для фильтрации данных для графиков
    filterDataForChart(data, timeRangeDays) {
        if (!data || data.length === 0 || timeRangeDays === 0) {
            return data;
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeRangeDays);
        cutoffDate.setHours(0, 0, 0, 0);

        return data.filter(point => {
            if (!point.timestamp || point.timestamp === "Unknown date") return false;
            const pointDate = new Date(point.timestamp);
            return pointDate >= cutoffDate;
        });
    }

    // Метод для фильтрации групп
    filterGroupsWithEnoughData(groups, branchFilter = null) {
        const filteredGroups = new Set();
        const timeRangeDays = this.currentTimeRange === 0 ? 365 : this.currentTimeRange;

        console.log(`🔍 filterGroupsWithEnoughData: checking ${groups.size} groups for ${timeRangeDays} days`);

        groups.forEach(group => {
            if (this.hasGroupEnoughData(group, timeRangeDays, branchFilter)) {
                filteredGroups.add(group);
            } else {
                console.log(`⚠️ Filtered out config group "${group}" - insufficient data across days`);
            }
        });

        return filteredGroups;
    }

    // Метод для проверки, есть ли у группы данные в 2+ днях
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
        console.log(`📅 Config group "${group}"${branchFilter ? ` [branch: ${branchFilter}]` : ''} in last ${timeRangeDays} days: ${uniqueDays.size} unique days - ${hasEnoughData ? 'KEEP' : 'FILTER OUT'}`);

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
                dataAlreadyFiltered: false  // ИСПРАВЛЕНИЕ: передаем false для применения фильтрации в charts.js
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
                dataAlreadyFiltered: false  // ИСПРАВЛЕНИЕ
            }
        ];

        chartsConfig.forEach(config => {
            console.log(`\n📈 Processing chart: ${config.id}`);
            console.log(`   Time range: ${config.timeRangeDays} days`);
            console.log(`   Branch filter: ${config.branchFilter || 'none'}`);
            console.log(`   Data already filtered: ${config.dataAlreadyFiltered}`);

            let chartData = [];

            config.sourceChartKeys.forEach(chartKey => {
                console.log(`  📊 Loading from ${chartKey}`);
                const fullData = this.fullChartData.charts[chartKey] || [];
                console.log(`  📊 Full data points: ${fullData.length}`);

                // ВАЖНО: Не фильтруем здесь! Пусть charts.js делает это
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

            console.log(`📊 ${config.id}: Total data points before filters: ${chartData.length}`);

            // Только branch фильтр применяем здесь
            if (config.branchFilter) {
                console.log(`🔍 Applying branch filter: ${config.branchFilter}`);
                const originalCount = chartData.length;
                chartData = chartData.filter(d => d.branch === config.branchFilter);
                console.log(`📊 After branch filter: ${chartData.length} points (removed ${originalCount - chartData.length})`);
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
                        dataAlreadyFiltered: config.dataAlreadyFiltered  // Теперь false
                    });
                    this.charts.set(config.id, chart);
                    console.log(`✅ Chart ${config.id} created successfully`);
                } catch (error) {
                    console.error(`❌ Error creating chart ${config.id}:`, error);
                    d3.select(`#${config.id}`).html(`<p class="error">Error creating chart: ${error.message}</p>`);
                }
            } else {
                console.warn(`⚠️ No data for chart: ${config.id}`);
                const noDataMessage = config.branchFilter
                    ? `<p class="no-data">No data available for ${this.formatBranchDisplayName(config.branchFilter)} branch in last ${this.currentTimeRange} days</p>`
                    : `<p class="no-data">No data available in last ${this.currentTimeRange} days</p>`;
                d3.select(`#${config.id}`).html(noDataMessage);
            }
        });

        console.log('✅ All charts processed');
    }

    // Метод для заголовка графиков
    getChartTitle(metric) {
        if (this.currentConfigBranch === 'all') {
            return `${metric} (All Branches)`;
        } else {
            const branchDisplayName = this.formatBranchDisplayName(this.currentConfigBranch);
            return `${metric} - ${branchDisplayName} Branch`;
        }
    }

    // Создаем легенду
    createLegend() {
        const legendContainer = d3.select('#legend-config');
        legendContainer.html('');

        if (this.configGroups.size === 0) {
            const branchName = this.currentConfigBranch === 'all'
                ? 'any branch'
                : this.formatBranchDisplayName(this.currentConfigBranch);
            legendContainer.html(`<p style="color: #6c757d; font-style: italic;">No configuration data for ${branchName} in last ${this.currentTimeRange} days</p>`);
            return;
        }

        console.log('Creating legend with groups:', Array.from(this.configGroups));

        // Добавляем переключатель операций
        const operationToggle = legendContainer.append('div')
            .attr('class', 'operation-toggle');

        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleOperations.has('read') && !this.visibleOperations.has('write') ? 'active' : ''}`)
            .text('Read Only')
            .on('click', () => {
                this.setOperations(['read']);
            });

        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleOperations.has('write') && !this.visibleOperations.has('read') ? 'active' : ''}`)
            .text('Write Only')
            .on('click', () => {
                this.setOperations(['write']);
            });

        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleOperations.has('read') && this.visibleOperations.has('write') ? 'active' : ''}`)
            .text('Both')
            .on('click', () => {
                this.setOperations(['read', 'write']);
            });

        // Создаем группы для каждой конфигурации
        const configsArray = Array.from(this.configGroups);

        configsArray.forEach((config, configIndex) => {
            const groupContainer = legendContainer.append('div').attr('class', 'legend-group');

            // Заголовок группы (кликабельный)
            groupContainer.append('div')
                .attr('class', 'legend-group-title')
                .style('cursor', 'pointer')
                .text(config)
                .on('click', () => {
                    this.toggleConfigGroup(config);
                });

            // Легенда для группы
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
        console.log('🔄 setOperations called');
        console.log(`   Previous: ${Array.from(this.visibleOperations)}`);
        console.log(`   New: ${operations}`);

        this.visibleOperations = new Set(operations);

        // Просто обновляем видимость
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
        console.log(`👁️ Charts in cache: ${this.charts.size}`);

        const chartIds = ['chart-iops-config', 'chart-latency-config'];

        chartIds.forEach(chartId => {
            const chart = this.charts.get(chartId);

            if (chart && chart.updateVisibility && chart.fullGroups) {
                console.log(`👁️ Updating visibility for ${chartId}`);

                const visibleFullGroups = new Set();
                chart.fullGroups.forEach(fullGroup => {
                    const [group, operation] = fullGroup.split(' - ');
                    if (this.visibleConfigGroups.has(group) && this.visibleOperations.has(operation)) {
                        visibleFullGroups.add(fullGroup);
                    }
                });

                console.log(`👁️ Visible full groups: ${Array.from(visibleFullGroups).join(', ')}`);
                chart.updateVisibility(visibleFullGroups);
            } else {
                console.warn(`⚠️ Cannot update chart ${chartId}:`, {
                    hasChart: !!chart,
                    hasUpdateVisibility: !!(chart && chart.updateVisibility),
                    hasFullGroups: !!(chart && chart.fullGroups)
                });
            }
        });
    }

    updateLegendAppearance() {
        console.log('🔄 Updating legend appearance...');

        // ИСПРАВЛЕНИЕ 1: Правильный выбор кнопок переключателя операций
        const operationButtons = d3.select('#legend-config')
            .selectAll('.operation-toggle-btn')
            .nodes(); // Получаем массив DOM элементов

        operationButtons.forEach((buttonNode, i) => {
            const button = d3.select(buttonNode);
            const text = button.text();

            let isActive = false;
            if (text === 'Read Only') {
                isActive = this.visibleOperations.has('read') && !this.visibleOperations.has('write');
            } else if (text === 'Write Only') {
                isActive = this.visibleOperations.has('write') && !this.visibleOperations.has('read');
            } else if (text === 'Both') {
                isActive = this.visibleOperations.has('read') && this.visibleOperations.has('write');
            }

            button.classed('active', isActive);
            console.log(`   ${text}: ${isActive ? 'active' : 'inactive'}`);
        });

        // ИСПРАВЛЕНИЕ 2: Правильный выбор групп легенды
        const legendGroups = d3.select('#legend-config')
            .selectAll('.legend-group')
            .nodes();

        legendGroups.forEach((groupNode, i) => {
            const group = d3.select(groupNode);
            const groupTitle = group.select('.legend-group-title').text();
            const legendItem = group.select('.legend-item');

            const isGroupVisible = this.visibleConfigGroups.has(groupTitle);
            legendItem.classed('disabled', !isGroupVisible);

            console.log(`   Legend group "${groupTitle}": ${isGroupVisible ? 'visible' : 'disabled'}`);
        });

        console.log('✅ Legend appearance updated');
    }

    updateDataInfo() {
        if (!this.currentData) return;

        const configBranchDisplay = this.currentConfigBranch === 'all'
            ? 'All Branches'
            : this.formatBranchDisplayName(this.currentConfigBranch);

        const timeRangeDisplay = this.currentTimeRange === 0
            ? 'All time (full dataset)'
            : `Last ${this.currentTimeRange} days`;

        const infoHtml = `
            <p><strong>Generated:</strong> ${new Date(this.currentData.generated_at).toLocaleString()}</p>
            <p><strong>Total tests in dataset:</strong> ${this.currentData.summary?.total_tests || 0}</p>
            <p><strong>Showing data for:</strong> ${timeRangeDisplay}</p>
            <p><strong>Branch:</strong> ${configBranchDisplay}</p>
            <p><strong>Configurations shown:</strong> ${Array.from(this.configGroups).join(', ') || 'N/A'}</p>
            <p><strong>Full dataset coverage:</strong> Last 365 days</p>
        `;

        d3.select('#data-info').html(infoHtml);
    }

    setupEventListeners() {
        d3.select('#refreshBtn').on('click', () => {
            this.refreshData();
        });

        d3.select('#timeRange').on('change', (event) => {
            this.handleTimeRangeChange(event.target.value);
        });

        d3.select('#configBranch').on('change', (event) => {
            this.handleConfigBranchChange(event.target.value);
        });
    }

    handleConfigBranchChange(branchValue) {
        console.log(`🌿 Branch change: ${this.currentConfigBranch} -> ${branchValue}`);
        
        if (branchValue === this.currentConfigBranch) {
            console.log('🌿 Branch unchanged');
            return;
        }

        this.currentConfigBranch = branchValue;
        this.updateConfigBranch();
    }

    updateConfigBranch() {
        // Обновляем URL без перезагрузки страницы
        const url = new URL(window.location.href);
        if (this.currentConfigBranch === 'refs/heads/main') {
            url.searchParams.delete('configBranch');
        } else {
            url.searchParams.set('configBranch', this.currentConfigBranch);
        }
        window.history.pushState({}, '', url.toString());

        console.log(`🌿 Updating config branch to: ${this.currentConfigBranch}`);
        console.log(`🌿 Time range remains: ${this.currentTimeRange} days`);

        this.collectGroups();
        this.recreateCharts();
        this.updateDataInfo();

        const branchDisplayName = this.currentConfigBranch === 'all'
            ? 'all branches'
            : this.formatBranchDisplayName(this.currentConfigBranch);

        this.showNotification(`Branch updated to ${branchDisplayName}`, 'success');
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
            this.showNotification('Data refreshed successfully', 'success');
        } catch (error) {
            console.error('Failed to refresh data:', error);
            this.showNotification('Error refreshing data', 'error');
            this.showLoading(false);
        }
    }

    handleTimeRangeChange(days) {
        const newTimeRange = days === 'all' ? 0 : parseInt(days);
        
        console.log(`⏰ Time range change: ${this.currentTimeRange} -> ${newTimeRange} days`);

        if (newTimeRange === this.currentTimeRange) {
            console.log('⏰ Time range unchanged');
            return;
        }

        this.currentTimeRange = newTimeRange;
        this.updateTimeRange();
    }

    updateTimeRange() {
        const newTimeRange = parseInt(d3.select('#timeRange').property('value'));

        if (newTimeRange === this.currentTimeRange) {
            console.log('⏰ Time range unchanged');
            return;
        }

        console.log(`🔄 Time range change: ${this.currentTimeRange} -> ${newTimeRange} days`);
        this.currentTimeRange = newTimeRange;

        // Обновляем URL
        const url = new URL(window.location.href);
        if (this.currentTimeRange === 0) {
            url.searchParams.delete('days');
        } else {
            url.searchParams.set('days', this.currentTimeRange.toString());
        }
        window.history.pushState({}, '', url.toString());

        console.log(`🔄 Time range updated to: ${this.currentTimeRange} days`);

        // Пересоздаем графики
        this.destroyCharts();
        this.collectGroups();
        this.createCharts(); // Используем старый createCharts, а не renderCharts
        this.createLegend();
        this.updateDataInfo();

        this.showNotification(`Time range updated to ${this.currentTimeRange === 0 ? 'all time' : `last ${this.currentTimeRange} days`}`, 'success');
    }

    destroyCharts() {
        console.log('🔥 Destroying all charts...');

        // Полностью очищаем контейнеры
        d3.select('#chart-iops-config').html('');
        d3.select('#chart-latency-config').html('');

        // Очищаем кэш
        this.charts.clear();

        // Очищаем SVG элементы
        d3.selectAll('#chart-iops-config svg').remove();
        d3.selectAll('#chart-latency-config svg').remove();

        console.log('✅ Charts destroyed');
    }

    recreateCharts() {
        console.log('🔄 recreateCharts called');

        const chartContainers = [
            '#chart-iops-config',
            '#chart-latency-config'
        ];

        chartContainers.forEach(selector => {
            const container = d3.select(selector);
            container.selectAll('*').remove(); // Очистка SVG
            console.log(`   ✅ Cleared container: ${selector}`);
        });

        this.charts.clear(); // Очистка кэша

        this.createCharts(); // ПЕРЕСОЗДАНИЕ графиков
        this.createLegend();
    }

    showLoading(show) {
        const loading = d3.select('#loading');
        const button = d3.select('#refreshBtn');

        if (show) {
            loading.style('display', 'flex');
            button.attr('disabled', true);
            button.text('Refreshing...');
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
                <p>Please check the console for details.</p>
            </div>
        `;
        d3.select('body').html(errorHtml);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new DashboardApp();
    app.init();
});