class DataLoader {
    constructor(dataPath = './data.json') {
        this.dataPath = dataPath;
        this.data = null;
    }

    async loadData() {
        try {
            console.log('Loading data from:', this.dataPath);
            
            const response = await fetch(this.dataPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.data = await response.json();
            
            if (!this.data) {
                throw new Error('No data received from server');
            }
            
            console.log('Data loaded successfully');
            console.log('Summary:', this.data.summary);
            console.log('Available charts:', Object.keys(this.data.charts || {}));
            
            return this.data;
            
        } catch (error) {
            console.error('Failed to load precomputed data:', error);
            
            if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
                console.warn('data.json not found. Creating sample data for debugging.');
                return this.createSampleData();
            }
            
            throw error;
        }
    }

    // Метод для получения данных конкретного графика
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

    // Метод для получения summary информации
    getSummary() {
        if (!this.data) return null;
        return this.data.summary || {};
    }

    // Метод для получения информации о фильтрации
    getFilterInfo() {
        if (!this.data) return null;
        return this.data.filter || { applied: false, days: 30 };
    }

    // Метод для получения времени генерации данных
    getGeneratedTime() {
        if (!this.data) return null;
        return this.data.generated_at;
    }

    // Метод для получения всех доступных типов графиков
    getAvailableChartTypes() {
        if (!this.data || !this.data.charts) return [];
        return Object.keys(this.data.charts);
    }

    // Метод для получения всех уникальных групп (конфигураций и веток)
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

    // Метод для проверки наличия данных
    hasData() {
        return this.data && this.data.charts && Object.keys(this.data.charts).length > 0;
    }

    // Метод для получения статистики по данным
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

    // Fallback метод для создания sample данных при отладке
    createSampleData() {
        console.log('Creating sample data for debugging...');
        
        const now = new Date();
        const sampleData = {
            generated_at: now.toISOString(),
            filter: {
                days: 365,
                cutoff_date: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(),
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

        this.data = sampleData;
        return sampleData;
    }

    // Метод для валидации структуры данных
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

    // Метод для получения временного диапазона данных
    getTimeRange() {
        if (!this.data || !this.data.summary || !this.data.summary.time_range) {
            return null;
        }
        
        return this.data.summary.time_range;
    }

    // Метод для проверки свежести данных
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