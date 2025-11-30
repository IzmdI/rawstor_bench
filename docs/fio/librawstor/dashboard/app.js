function createSafeClassName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

class DashboardApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.currentData = null;
        this.charts = new Map();
        
        // Управление видимостью операций
        this.visibleConfigOperations = new Set(['read']);
        this.visibleBranchOperations = new Set(['read']);
        
        // Управление видимостью групп
        this.visibleConfigGroups = new Set();
        this.visibleBranchGroups = new Set();
        
        this.configGroups = new Set();
        this.branchGroups = new Set();
        
        // Текущий масштаб времени
        this.currentTimeRange = 30; // по умолчанию 30 дней
    }

    async init() {
        console.log('Initializing dashboard...');
        
        const params = this.getUrlParams();
        this.currentTimeRange = params.days ? parseInt(params.days) : 30;
        d3.select('#timeRange').property('value', this.currentTimeRange.toString());
        
        try {
            await this.loadData();
            this.collectGroups();
            this.createLegends();
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
    }

    // Собираем группы отдельно для конфигураций и веток
    collectGroups() {
        this.configGroups.clear();
        this.branchGroups.clear();
        
        console.log('🔄 Collecting groups from data...');
        
        // Собираем группы из отфильтрованных данных графиков
        if (this.currentData?.charts) {
            // Временные наборы для сбора групп
            const tempConfigGroups = new Set();
            const tempBranchGroups = new Set();
            
            // Собираем группы из всех доступных данных
            const configCharts = ['iops_read_by_config', 'iops_write_by_config', 'latency_read_by_config', 'latency_write_by_config'];
            const branchCharts = ['iops_read_by_branch', 'iops_write_by_branch', 'latency_read_by_branch', 'latency_write_by_branch'];
            
            configCharts.forEach(chartKey => {
                const chartData = this.currentData.charts[chartKey] || [];
                chartData.forEach(point => {
                    if (point.group) {
                        tempConfigGroups.add(point.group);
                    }
                });
            });
            
            branchCharts.forEach(chartKey => {
                const chartData = this.currentData.charts[chartKey] || [];
                chartData.forEach(point => {
                    if (point.group) {
                        tempBranchGroups.add(point.group);
                    }
                });
            });
            
            console.log('📊 Raw config groups:', Array.from(tempConfigGroups));
            console.log('📊 Raw branch groups:', Array.from(tempBranchGroups));
            
            // Теперь фильтруем группы - оставляем только те, у которых есть данные в 2+ днях
            this.configGroups = this.filterGroupsWithEnoughData(tempConfigGroups, 'config');
            
            // ФИЛЬТРУЕМ ВЕТКИ: исключаем теги и оставляем только 8 самых актуальных
            this.branchGroups = this.filterBranches(tempBranchGroups);
        }
        
        // Показываем все отфильтрованные группы по умолчанию
        this.configGroups.forEach(group => this.visibleConfigGroups.add(group));
        this.branchGroups.forEach(group => this.visibleBranchGroups.add(group));
        
        console.log('✅ Filtered Config groups:', Array.from(this.configGroups));
        console.log('✅ Filtered Branch groups:', Array.from(this.branchGroups));
    }

    // Метод для фильтрации веток
    filterBranches(allBranches) {
        const filteredBranches = new Set();
        
        // Шаг 1: Исключаем ветки с тегами (теги обычно содержат '/' или начинаются с цифр/спецсимволов)
        const branchesWithoutTags = Array.from(allBranches).filter(branch => {
            // Исключаем теги (предполагаем, что теги содержат '/' или начинаются с цифр/спецсимволов)
            const isTag = branch.includes('/') && 
                         (branch.includes('tags/') || 
                          /^refs\/tags\//.test(branch) ||
                          branch.includes('refs/tags/'));
            
            if (isTag) {
                console.log(`🏷️  Excluding tag: ${branch}`);
                return false;
            }
            
            // Оставляем только ветки (обычно начинаются с refs/heads/)
            return branch.startsWith('refs/heads/');
        });
        
        console.log(`📋 Branches without tags: ${branchesWithoutTags.length}`, branchesWithoutTags);
        
        // Если после фильтрации тегов веток меньше или равно 8, возвращаем все
        if (branchesWithoutTags.length <= 8) {
            branchesWithoutTags.forEach(branch => filteredBranches.add(branch));
            console.log(`🎯 Using all ${branchesWithoutTags.length} branches (less than 8)`);
            return filteredBranches;
        }
        
        // Шаг 2: Получаем информацию о последних изменениях для каждой ветки
        const branchesWithLastActivity = this.getBranchesLastActivity(branchesWithoutTags);
        
        // Если не удалось получить информацию о активности, возвращаем первые 8 веток
        if (branchesWithLastActivity.length === 0) {
            console.log('⚠️  No activity data available, using first 8 branches');
            branchesWithoutTags.slice(0, 8).forEach(branch => filteredBranches.add(branch));
            return filteredBranches;
        }
        
        // Шаг 3: Сортируем по времени последнего изменения (новые первыми)
        const sortedBranches = branchesWithLastActivity.sort((a, b) => {
            return new Date(b.lastActivity) - new Date(a.lastActivity);
        });
        
        console.log('📊 Branches sorted by last activity:');
        sortedBranches.forEach((branch, index) => {
            console.log(`  ${index + 1}. ${branch.name} - ${new Date(branch.lastActivity).toLocaleDateString()}`);
        });
        
        // Шаг 4: Берем только 8 самых актуальных веток
        const topBranches = sortedBranches.slice(0, 8);
        
        topBranches.forEach(branch => {
            filteredBranches.add(branch.name);
        });
        
        console.log(`🎯 Selected top ${topBranches.length} branches from ${sortedBranches.length} available`);
        
        return filteredBranches;
    }

    // Метод для получения времени последней активности ветки
    getBranchesLastActivity(branches) {
        const branchesWithActivity = [];
        
        branches.forEach(branch => {
            // Ищем последний тест для этой ветки во всех данных
            let lastActivity = null;
            
            // Проверяем все типы графиков для этой ветки
            const chartKeys = ['iops_read_by_branch', 'iops_write_by_branch', 'latency_read_by_branch', 'latency_write_by_branch'];
            
            chartKeys.forEach(chartKey => {
                const chartData = this.currentData.charts[chartKey] || [];
                chartData.forEach(point => {
                    if (point.group === branch && point.timestamp && point.timestamp !== "Unknown date") {
                        const pointDate = new Date(point.timestamp);
                        if (!lastActivity || pointDate > lastActivity) {
                            lastActivity = pointDate;
                        }
                    }
                });
            });
            
            if (lastActivity) {
                branchesWithActivity.push({
                    name: branch,
                    lastActivity: lastActivity
                });
            } else {
                console.log(`⚠️  No activity data for branch: ${branch}`);
            }
        });
        
        return branchesWithActivity;
    }

    // Метод для фильтрации групп
    filterGroupsWithEnoughData(groups, groupType) {
        const filteredGroups = new Set();
        const timeRangeDays = 365; // Всегда используем полный набор данных
        
        groups.forEach(group => {
            // Проверяем, есть ли у группы данные минимум в 2 разных днях
            if (this.hasGroupEnoughData(group, groupType, timeRangeDays)) {
                filteredGroups.add(group);
            } else {
                console.log(`⚠️ Filtered out ${groupType} group "${group}" - insufficient data across days`);
            }
        });
        
        return filteredGroups;
    }

    // Метод для проверки, есть ли у группы данные в 2+ днях
    hasGroupEnoughData(group, groupType, timeRangeDays) {
        if (!this.currentData?.charts) return false;
        
        // Для веток проверяем только если ветка есть в отфильтрованном списке
        if (groupType === 'branch' && !this.branchGroups.has(group)) {
            return false;
        }
        
        // Определяем какие chart keys использовать в зависимости от типа группы
        const chartKeys = groupType === 'config' 
            ? ['iops_read_by_config', 'iops_write_by_config', 'latency_read_by_config', 'latency_write_by_config']
            : ['iops_read_by_branch', 'iops_write_by_branch', 'latency_read_by_branch', 'latency_write_by_branch'];
        
        const uniqueDays = new Set();
        
        // Собираем все уникальные дни для этой группы
        chartKeys.forEach(chartKey => {
            const chartData = this.currentData.charts[chartKey] || [];
            chartData.forEach(point => {
                if (point.group === group && point.timestamp && point.timestamp !== "Unknown date") {
                    const date = new Date(point.timestamp);
                    const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                    uniqueDays.add(dayKey);
                }
            });
        });
        
        const hasEnoughData = uniqueDays.size >= 2;
        console.log(`📅 Group "${group}" (${groupType}): ${uniqueDays.size} unique days - ${hasEnoughData ? 'KEEP' : 'FILTER OUT'}`);
        
        return hasEnoughData;
    }

    createCharts() {
        if (!this.currentData?.charts) {
            throw new Error('No chart data available');
        }

        console.log(`🎨 Creating charts with time range: ${this.currentTimeRange} days`);

        const chartsConfig = [
            {
                id: 'chart-iops-config',
                title: 'IOPS (by Config)',
                yLabel: 'kIOPS',
                dataKey: 'iops',
                groupBy: 'config',
                timeRangeDays: this.currentTimeRange,
                legendType: 'config',
                metricType: 'iops',
                visibleOperations: Array.from(this.visibleConfigOperations),
                availableGroups: Array.from(this.configGroups)
            },
            {
                id: 'chart-latency-config',
                title: 'Latency (by Config)',
                yLabel: 'ms',
                dataKey: 'latency',
                groupBy: 'config',
                timeRangeDays: this.currentTimeRange,
                legendType: 'config',
                metricType: 'latency',
                visibleOperations: Array.from(this.visibleConfigOperations),
                availableGroups: Array.from(this.configGroups)
            },
            {
                id: 'chart-iops-branch',
                title: 'IOPS (by Branch)',
                yLabel: 'kIOPS',
                dataKey: 'iops',
                groupBy: 'branch',
                timeRangeDays: this.currentTimeRange,
                legendType: 'branch',
                metricType: 'iops',
                visibleOperations: Array.from(this.visibleBranchOperations),
                availableGroups: Array.from(this.branchGroups)
            },
            {
                id: 'chart-latency-branch',
                title: 'Latency (by Branch)',
                yLabel: 'ms',
                dataKey: 'latency',
                groupBy: 'branch',
                timeRangeDays: this.currentTimeRange,
                legendType: 'branch',
                metricType: 'latency',
                visibleOperations: Array.from(this.visibleBranchOperations),
                availableGroups: Array.from(this.branchGroups)
            }
        ];

        chartsConfig.forEach(config => {
            let chartData = [];
            
            if (config.metricType === 'iops') {
                const iopsReadData = this.currentData.charts[`iops_read_by_${config.groupBy}`] || [];
                const iopsWriteData = this.currentData.charts[`iops_write_by_${config.groupBy}`] || [];
                
                chartData = [
                    ...iopsReadData.map(d => ({ ...d, metric: 'iops_read', dataKey: `iops_read_by_${config.groupBy}` })),
                    ...iopsWriteData.map(d => ({ ...d, metric: 'iops_write', dataKey: `iops_write_by_${config.groupBy}` }))
                ];
            } else if (config.metricType === 'latency') {
                const latencyReadData = this.currentData.charts[`latency_read_by_${config.groupBy}`] || [];
                const latencyWriteData = this.currentData.charts[`latency_write_by_${config.groupBy}`] || [];
                
                chartData = [
                    ...latencyReadData.map(d => ({ ...d, metric: 'latency_read', dataKey: `latency_read_by_${config.groupBy}` })),
                    ...latencyWriteData.map(d => ({ ...d, metric: 'latency_write', dataKey: `latency_write_by_${config.groupBy}` }))
                ];
            }

            console.log(`Chart ${config.id} data points:`, chartData.length);

            if (chartData && chartData.length > 0) {
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
                    availableGroups: config.availableGroups
                });
                this.charts.set(config.id, chart);
            } else {
                console.warn(`No data for chart: ${config.id}`);
                d3.select(`#${config.id}`).html('<p class="no-data">No data available</p>');
            }
        });
    }

    createLegends() {
        this.createConfigLegend();
        this.createBranchLegend();
    }

    createConfigLegend() {
        const legendContainer = d3.select('#legend-config');
        legendContainer.html('');
        
        if (this.configGroups.size === 0) {
            legendContainer.html('<p style="color: #6c757d; font-style: italic;">No configuration data</p>');
            return;
        }

        console.log('Creating config legend with groups:', Array.from(this.configGroups));

        // Добавляем переключатель операций
        const operationToggle = legendContainer.append('div')
            .attr('class', 'operation-toggle');
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleConfigOperations.has('read') && !this.visibleConfigOperations.has('write') ? 'active' : ''}`)
            .text('Read Only')
            .on('click', () => {
                this.setConfigOperations(['read']);
            });
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleConfigOperations.has('write') && !this.visibleConfigOperations.has('read') ? 'active' : ''}`)
            .text('Write Only')
            .on('click', () => {
                this.setConfigOperations(['write']);
            });
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleConfigOperations.has('read') && this.visibleConfigOperations.has('write') ? 'active' : ''}`)
            .text('Both')
            .on('click', () => {
                this.setConfigOperations(['read', 'write']);
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

            // Легенда для группы (один цвет)
            const legendItem = groupContainer.append('div')
                .attr('class', `legend-item ${this.visibleConfigGroups.has(config) ? '' : 'disabled'}`)
                .on('click', (event) => {
                    event.stopPropagation(); // Предотвращаем всплытие
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

    createBranchLegend() {
        const legendContainer = d3.select('#legend-branch');
        legendContainer.html('');
        
        console.log('🔄 Creating branch legend...');
        console.log('📊 Branch groups:', Array.from(this.branchGroups));
        console.log('📊 Visible branch groups:', Array.from(this.visibleBranchGroups));
        
        if (this.branchGroups.size === 0) {
            console.log('⚠️ No branch groups available');
            legendContainer.html('<p style="color: #6c757d; font-style: italic;">No branch data available</p>');
            return;
        }

        console.log('✅ Creating branch legend with groups:', Array.from(this.branchGroups));

        // Добавляем переключатель операций
        const operationToggle = legendContainer.append('div')
            .attr('class', 'operation-toggle');
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleBranchOperations.has('read') && !this.visibleBranchOperations.has('write') ? 'active' : ''}`)
            .text('Read Only')
            .on('click', () => {
                this.setBranchOperations(['read']);
            });
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleBranchOperations.has('write') && !this.visibleBranchOperations.has('read') ? 'active' : ''}`)
            .text('Write Only')
            .on('click', () => {
                this.setBranchOperations(['write']);
            });
            
        operationToggle.append('button')
            .attr('class', `operation-toggle-btn ${this.visibleBranchOperations.has('read') && this.visibleBranchOperations.has('write') ? 'active' : ''}`)
            .text('Both')
            .on('click', () => {
                this.setBranchOperations(['read', 'write']);
            });

        // Создаем группы для каждой ветки с красивыми названиями
        const branchesArray = Array.from(this.branchGroups);
        
        console.log(`🎨 Rendering ${branchesArray.length} branch legends`);
        
        branchesArray.forEach((branch, branchIndex) => {
            const groupContainer = legendContainer.append('div').attr('class', 'legend-group');
            
            // Красивое отображение названия ветки (убираем refs/heads/)
            const displayName = branch.replace('refs/heads/', '');
            
            console.log(`   📍 Adding branch: ${displayName} (original: ${branch})`);
            
            // Заголовок группы (кликабельный)
            groupContainer.append('div')
                .attr('class', 'legend-group-title')
                .style('cursor', 'pointer')
                .text(displayName)
                .on('click', () => {
                    this.toggleBranchGroup(branch);
                });

            // Легенда для группы (один цвет)
            const legendItem = groupContainer.append('div')
                .attr('class', `legend-item ${this.visibleBranchGroups.has(branch) ? '' : 'disabled'}`)
                .on('click', (event) => {
                    event.stopPropagation(); // Предотвращаем всплытие
                    this.toggleBranchGroup(branch);
                });

            legendItem.append('span')
                .attr('class', 'legend-color')
                .style('background-color', getColor(branchIndex));

            legendItem.append('span')
                .attr('class', 'legend-label')
                .text('Read/Write');
        });
        
        console.log('✅ Branch legend created successfully');
    }

    setConfigOperations(operations) {
        this.visibleConfigOperations = new Set(operations);
        this.updateConfigChartsVisibility();
        this.updateConfigLegendAppearance();
    }

    setBranchOperations(operations) {
        this.visibleBranchOperations = new Set(operations);
        this.updateBranchChartsVisibility();
        this.updateBranchLegendAppearance();
    }

    toggleConfigGroup(group) {
        if (this.visibleConfigGroups.has(group)) {
            this.visibleConfigGroups.delete(group);
        } else {
            this.visibleConfigGroups.add(group);
        }
        this.updateConfigChartsVisibility();
        this.updateConfigLegendAppearance();
    }

    toggleBranchGroup(group) {
        if (this.visibleBranchGroups.has(group)) {
            this.visibleBranchGroups.delete(group);
        } else {
            this.visibleBranchGroups.add(group);
        }
        this.updateBranchChartsVisibility();
        this.updateBranchLegendAppearance();
    }

    updateConfigChartsVisibility() {
        const configCharts = ['chart-iops-config', 'chart-latency-config'];
        
        configCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart && chart.updateVisibility) {
                // Создаем Set видимых fullGroups на основе выбранных операций И групп
                const visibleFullGroups = new Set();
                chart.fullGroups.forEach(fullGroup => {
                    const [group, operation] = fullGroup.split(' - ');
                    if (this.visibleConfigGroups.has(group) && this.visibleConfigOperations.has(operation)) {
                        visibleFullGroups.add(fullGroup);
                    }
                });
                chart.updateVisibility(visibleFullGroups);
            }
        });
    }

    updateBranchChartsVisibility() {
        const branchCharts = ['chart-iops-branch', 'chart-latency-branch'];
        
        branchCharts.forEach(chartId => {
            const chart = this.charts.get(chartId);
            if (chart && chart.updateVisibility) {
                // Создаем Set видимых fullGroups на основе выбранных операций И групп
                const visibleFullGroups = new Set();
                chart.fullGroups.forEach(fullGroup => {
                    const [group, operation] = fullGroup.split(' - ');
                    if (this.visibleBranchGroups.has(group) && this.visibleBranchOperations.has(operation)) {
                        visibleFullGroups.add(fullGroup);
                    }
                });
                chart.updateVisibility(visibleFullGroups);
            }
        });
    }

    updateConfigLegendAppearance() {
        // Обновляем кнопки переключателя
        d3.selectAll('#legend-config .operation-toggle-btn')
            .classed('active', (d, i, nodes) => {
                const button = d3.select(nodes[i]);
                const text = button.text();
                if (text === 'Read Only') return this.visibleConfigOperations.has('read') && !this.visibleConfigOperations.has('write');
                if (text === 'Write Only') return this.visibleConfigOperations.has('write') && !this.visibleConfigOperations.has('read');
                if (text === 'Both') return this.visibleConfigOperations.has('read') && this.visibleConfigOperations.has('write');
                return false;
            });

        // Обновляем видимость групп
        d3.selectAll('#legend-config .legend-group').each(function() {
            const groupTitle = d3.select(this).select('.legend-group-title').text();
            const legendItem = d3.select(this).select('.legend-item');
            legendItem.classed('disabled', !this.visibleConfigGroups.has(groupTitle));
        }.bind(this));
    }

    updateBranchLegendAppearance() {
        // Обновляем кнопки переключателя
        d3.selectAll('#legend-branch .operation-toggle-btn')
            .classed('active', (d, i, nodes) => {
                const button = d3.select(nodes[i]);
                const text = button.text();
                if (text === 'Read Only') return this.visibleBranchOperations.has('read') && !this.visibleBranchOperations.has('write');
                if (text === 'Write Only') return this.visibleBranchOperations.has('write') && !this.visibleBranchOperations.has('read');
                if (text === 'Both') return this.visibleBranchOperations.has('read') && this.visibleBranchOperations.has('write');
                return false;
            });

        // Обновляем видимость групп
        d3.selectAll('#legend-branch .legend-group').each(function() {
            const groupTitle = d3.select(this).select('.legend-group-title').text();
            const legendItem = d3.select(this).select('.legend-item');
            legendItem.classed('disabled', !this.visibleBranchGroups.has(groupTitle));
        }.bind(this));
    }

    updateDataInfo() {
        if (!this.currentData) return;

        const infoHtml = `
            <p><strong>Generated:</strong> ${new Date(this.currentData.generated_at).toLocaleString()}</p>
            <p><strong>Total tests:</strong> ${this.currentData.summary?.total_tests || 0}</p>
            <p><strong>Configurations:</strong> ${this.currentData.summary?.configurations?.join(', ') || 'N/A'}</p>
            <p><strong>Branches:</strong> ${Array.from(this.branchGroups).map(b => b.replace('refs/heads/', '')).join(', ') || 'N/A'}</p>
            <p><strong>Time range:</strong> ${this.currentTimeRange === 0 ? 'All data' : `Last ${this.currentTimeRange} days`}</p>
            <p><strong>Data coverage:</strong> Last 365 days (full dataset)</p>
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
            this.showLoading(true);
            await this.loadData();
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
        
        if (newTimeRange === this.currentTimeRange) {
            console.log('Time range unchanged');
            return;
        }
        
        this.currentTimeRange = newTimeRange;
        this.updateTimeRange();
    }

    updateTimeRange() {
        // Обновляем URL без перезагрузки страницы
        const url = new URL(window.location.href);
        if (this.currentTimeRange === 0) {
            url.searchParams.delete('days');
        } else {
            url.searchParams.set('days', this.currentTimeRange.toString());
        }
        window.history.pushState({}, '', url.toString());
        
        console.log(`🔄 Updating time range to: ${this.currentTimeRange} days`);
        
        // Пересоздаем графики с новым масштабом
        this.recreateCharts();
        this.updateDataInfo();
        
        this.showNotification(`Time range updated to ${this.currentTimeRange === 0 ? 'all time' : `last ${this.currentTimeRange} days`}`, 'success');
    }

    recreateCharts() {
        console.log('🔄 Recreating charts with time range:', this.currentTimeRange);
        
        // Полностью очищаем все контейнеры графиков
        const chartContainers = [
            '#chart-iops-config',
            '#chart-latency-config',
            '#chart-iops-branch', 
            '#chart-latency-branch'
        ];
        
        chartContainers.forEach(selector => {
            const container = d3.select(selector);
            // Полностью очищаем контейнер
            container.selectAll('*').remove();
            console.log(`✅ Cleared container: ${selector}`);
        });
        
        // Очищаем карту графиков
        this.charts.clear();
        console.log('✅ Cleared charts map');
        
        // Пересоздаем графики с новым time range
        this.createCharts();
        console.log('✅ Charts recreated with new time range');
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
            days: urlParams.get('days') || '30'
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