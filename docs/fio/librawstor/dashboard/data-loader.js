class DataLoader {
    constructor(dataPath = './data.json') {
        this.dataPath = dataPath;
        this.data = null;
    }

    async loadData() {
        try {
            console.log('Loading data from:', this.dataPath);
            this.data = await d3.json(this.dataPath);
            console.log('Data loaded successfully:', this.data);
            return this.data;
        } catch (error) {
            console.error('Failed to load precomputed data from', this.dataPath, ':', error);
            throw error;
        }
    }

    getChartData(chartType) {
        if (!this.data || !this.data.charts) return [];
        return this.data.charts[chartType] || [];
    }

    getSummary() {
        if (!this.data) return null;
        return this.data.summary;
    }

    getGeneratedTime() {
        if (!this.data) return null;
        return this.data.generated_at;
    }

    // Новый метод для получения всех конфигураций
    getConfigurations() {
        if (!this.data || !this.data.charts) return [];

        const configs = new Set();
        Object.values(this.data.charts).forEach(chartData => {
            chartData.forEach(point => {
                if (point.config) {
                    configs.add(point.config);
                }
            });
        });

        return Array.from(configs);
    }

    // Метод для получения данных по конкретной конфигурации
    getDataByConfig(configName) {
        if (!this.data || !this.data.charts) return [];

        const result = {};
        Object.entries(this.data.charts).forEach(([chartType, chartData]) => {
            result[chartType] = chartData.filter(point => point.config === configName);
        });

        return result;
    }
}