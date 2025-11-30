class DataLoader {
    constructor(dataPath = './data.json') {
        this.dataPath = dataPath;
        this.data = null;
        this.rawData = null; // Сохраняем сырые данные
    }

    async loadData() {
        try {
            console.log('Loading data from:', this.dataPath);
            
            // Загружаем данные
            const response = await fetch(this.dataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.rawData = await response.json();
            
            if (!this.rawData) {
                throw new Error('No data received from server');
            }
            
            // Применяем фильтр по времени из URL параметров
            this.data = this.applyTimeFilter(this.rawData);
            
            console.log('Data loaded successfully');
            console.log('Summary:', this.data.summary);
            console.log('Available charts:', Object.keys(this.data.charts || {}));
            
            return this.data;
            
        } catch (error) {
            console.error('Failed to load precomputed data:', error);
            
            // Создаем fallback данные для отладки
            if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
                console.warn('data.json not found. Creating sample data for debugging.');
                return this.createSampleData();
            }
            
            throw error;
        }
    }

    // Метод для применения фильтра по времени
    applyTimeFilter(rawData) {
        const urlParams = new URLSearchParams(window.location.search);
        const daysParam = urlParams.get('days');
        const days = daysParam ? parseInt(daysParam) : 30;
        
        if (days === 0) {
            // Если days=0 (all), возвращаем все данные без фильтрации
            return rawData;
        }
        
        console.log(`Applying time filter: last ${days} days`);
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        // Фильтруем данные графиков
        const filteredCharts = {};
        
        Object.entries(rawData.charts || {}).forEach(([chartKey, chartData]) => {
            filteredCharts[chartKey] = chartData.filter(point => {
                if (!point.timestamp || point.timestamp === "Unknown date") {
                    return false; // Исключаем точки без даты
                }
                
                const pointDate = new Date(point.timestamp);
                return pointDate >= cutoffDate;
            });
        });
        
        // Обновляем summary
        const filteredData = {
            ...rawData,
            charts: filteredCharts,
            filter: {
                days: days,
                cutoff_date: cutoffDate.toISOString(),
                applied: true
            }
        };
        
        // Пересчитываем summary
        filteredData.summary = this.calculateSummary(filteredData);
        
        console.log(`Time filter applied: ${Object.values(filteredCharts).flat().length} data points after filtering`);
        
        return filteredData;
    }

    // Метод для пересчета summary после фильтрации
    calculateSummary(data) {
        const allResults = Object.values(data.charts).flat();
        const configs = new Set();
        const branches = new Set();
        const timestamps = [];
        
        allResults.forEach(result => {
            if (result.config) configs.add(result.config);
            if (result.branch) branches.add(result.branch);
            if (result.timestamp && result.timestamp !== "Unknown date") {
                timestamps.push(new Date(result.timestamp));
            }
        });
        
        const timeRange = {
            start: timestamps.length > 0 ? new Date(Math.min(...timestamps)).toISOString() : null,
            end: timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null
        };
        
        return {
            total_tests: allResults.length,
            tests_without_date: allResults.filter(r => !r.timestamp || r.timestamp === "Unknown date").length,
            total_configurations: configs.size,
            total_branches: branches.size,
            configurations: Array.from(configs).sort(),
            branches: Array.from(branches).sort(),
            time_range: timeRange
        };
    }

    // Метод для принудительного обновления данных с новым фильтром
    async reloadWithFilter(days) {
        // Обновляем URL
        const url = new URL(window.location.href);
        if (days === 0) {
            url.searchParams.delete('days');
        } else {
            url.searchParams.set('days', days);
        }
        window.history.pushState({}, '', url.toString());
        
        // Применяем фильтр к уже загруженным данным
        if (this.rawData) {
            this.data = this.applyTimeFilter(this.rawData);
            return this.data;
        } else {
            // Если сырых данных нет, перезагружаем
            return await this.loadData();
        }
    }

    // ... остальные методы остаются без изменений ...
    getChartData(chartType) {
        if (!this.data || !this.data.charts) {
            console.warn('No chart data available');
            return [];
        }
        
        const chartData = this.data.charts[chartType];
        if (!chartData) {
            console.warn(`Chart data not found for: ${chartType}`);
            return [];
        }
        
        return chartData;
    }

    getSummary() {
        if (!this.data) return null;
        return this.data.summary || {};
    }

    getFilterInfo() {
        if (!this.data) return null;
        return this.data.filter || { applied: false, days: 30 };
    }

    getGeneratedTime() {
        if (!this.data) return null;
        return this.data.generated_at;
    }

    getAvailableChartTypes() {
        if (!this.data || !this.data.charts) return [];
        return Object.keys(this.data.charts);
    }

    getAllGroups() {
        if (!this.data || !this.data.charts) return new Set();
        
        const groups = new Set();
        Object.values(this.data.charts).forEach(chartData => {
            chartData.forEach(point => {
                if (point.group) {
                    groups.add(point.group);
                }
            });
        });
        
        return groups;
    }

    hasData() {
        return this.data && this.data.charts && Object.keys(this.data.charts).length > 0;
    }

    getDataStats() {
        if (!this.data || !this.data.charts) return null;
        
        const stats = {
            totalCharts: Object.keys(this.data.charts).length,
            totalDataPoints: 0,
            charts: {}
        };
        
        Object.entries(this.data.charts).forEach(([chartName, chartData]) => {
            const chartStats = {
                dataPoints: chartData.length,
                groups: new Set(),
                timeRange: { start: null, end: null }
            };
            
            chartData.forEach(point => {
                chartStats.groups.add(point.group);
                
                if (point.timestamp && point.timestamp !== "Unknown date") {
                    const date = new Date(point.timestamp);
                    if (!chartStats.timeRange.start || date < chartStats.timeRange.start) {
                        chartStats.timeRange.start = date;
                    }
                    if (!chartStats.timeRange.end || date > chartStats.timeRange.end) {
                        chartStats.timeRange.end = date;
                    }
                }
            });
            
            chartStats.groups = Array.from(chartStats.groups);
            stats.charts[chartName] = chartStats;
            stats.totalDataPoints += chartData.length;
        });
        
        return stats;
    }

    createSampleData() {
        console.log('Creating sample data for debugging...');
        
        const now = new Date();
        const sampleData = {
            generated_at: now.toISOString(),
            filter: {
                days: 30,
                cutoff_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                applied: true
            },
            summary: {
                total_tests: 24,
                tests_without_date: 0,
                total_configurations: 3,
                total_branches: 2,
                configurations: ['config1', 'config2', 'config3'],
                branches: ['main', 'develop'],
                time_range: {
                    start: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    end: now.toISOString()
                }
            },
            charts: {}
        };

        // Создаем sample данные для каждого типа графика
        const chartTypes = [
            'iops_read_by_config', 'iops_write_by_config', 'latency_read_by_config', 'latency_write_by_config',
            'iops_read_by_branch', 'iops_write_by_branch', 'latency_read_by_branch', 'latency_write_by_branch'
        ];

        chartTypes.forEach(chartType => {
            const isByConfig = chartType.includes('_by_config');
            const groups = isByConfig ? ['config1', 'config2', 'config3'] : ['main', 'develop'];
            const metric = chartType.includes('iops') ? 'iops' : 'latency';
            const operation = chartType.includes('read') ? 'read' : 'write';
            
            sampleData.charts[chartType] = [];
            
            groups.forEach((group, groupIndex) => {
                for (let i = 0; i < 5; i++) {
                    const daysAgo = 2 + i * 3;
                    const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
                    
                    let value;
                    if (metric === 'iops') {
                        value = 10000 + (groupIndex * 5000) + (i * 1000) + Math.random() * 2000;
                    } else {
                        value = 0.5 + (groupIndex * 0.3) + (i * 0.1) + Math.random() * 0.2;
                    }
                    
                    sampleData.charts[chartType].push({
                        group: group,
                        timestamp: timestamp.toISOString(),
                        value: value,
                        commit_sha: 'abc123def456',
                        branch: isByConfig ? (groupIndex === 0 ? 'main' : 'develop') : group,
                        config: isByConfig ? group : `config${groupIndex + 1}`,
                        test_url: `../${isByConfig ? group : `config${groupIndex + 1}`}/abc123def456`
                    });
                }
            });
        });

        this.rawData = sampleData;
        this.data = sampleData;
        return sampleData;
    }

    validateDataStructure() {
        if (!this.data) {
            return { isValid: false, errors: ['No data loaded'] };
        }
        
        const errors = [];
        
        if (!this.data.charts) {
            errors.push('Missing charts object');
        } else {
            const requiredCharts = [
                'iops_read_by_config', 'iops_write_by_config', 'latency_read_by_config', 'latency_write_by_config',
                'iops_read_by_branch', 'iops_write_by_branch', 'latency_read_by_branch', 'latency_write_by_branch'
            ];
            
            requiredCharts.forEach(chart => {
                if (!this.data.charts[chart]) {
                    errors.push(`Missing chart: ${chart}`);
                } else if (!Array.isArray(this.data.charts[chart])) {
                    errors.push(`Chart ${chart} is not an array`);
                }
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    getTimeRange() {
        if (!this.data || !this.data.summary || !this.data.summary.time_range) {
            return null;
        }
        
        return this.data.summary.time_range;
    }

    isDataFresh(hours = 24) {
        if (!this.data || !this.data.generated_at) {
            return false;
        }
        
        const generatedTime = new Date(this.data.generated_at);
        const now = new Date();
        const hoursDiff = (now - generatedTime) / (1000 * 60 * 60);
        
        return hoursDiff <= hours;
    }
}