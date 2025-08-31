class BenchmarkDashboard {
    constructor() {
        this.dataLoader = new BenchmarkDataLoader();
        this.charts = new BenchmarkCharts();
        this.data = null;
        this.iopsChart = null;
        this.latencyChart = null;
        
        this.init();
    }

    async init() {
        console.log('📊 Инициализация dashboard...');
        
        try {
            this.data = await this.dataLoader.loadAllData();
            this.createCharts();
            this.createFilters();
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
        // Заглушка - фильтры добавим в следующей итерации
        console.log('Фильтры будут добавлены');
    }

    updateDataInfo() {
        const lastUpdate = this.data.allData.length > 0 ? 
            this.data.allData[this.data.allData.length - 1].date.toLocaleDateString('ru-RU') : 
            'нет данных';
        
        d3.select('#last-update').text(`Последнее обновление: ${lastUpdate}`);
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