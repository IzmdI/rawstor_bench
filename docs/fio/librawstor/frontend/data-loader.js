class BenchmarkDataLoader {
    constructor() {
        this.baseUrl = 'https://raw.githubusercontent.com/rawstor/rawstor_bench/main/data/fio/librawstor';
        this.configs = [
            'perftest--disable-ost-4k-1-1',
            'perftest--disable-ost-4k-1-4',
            'perftest--disable-ost-4k-4-1',
            'perftest--disable-ost-4k-4-4',
            'perftest--enable-ost-4k-1-1',
            'perftest--enable-ost-4k-1-4',
            'perftest--enable-ost-4k-4-1',
            'perftest--enable-ost-4k-4-4'
        ];
    }

    async loadAllData() {
        const allData = [];
        const loadedData = {};
        
        console.log('🚀 Загрузка данных benchmark...');
        
        // Для демо - используем несколько тестовых файлов
        const testFiles = [
            'perftest--disable-ost-4k-1-1/022a761e45112d161bd24e5399e06dcdd83d9e00.json',
            'perftest--enable-ost-4k-1-1/8173024b13c30ae735733876cab701b34b4973fc.json'
        ];

        for (const filePath of testFiles) {
            try {
                const data = await this.loadJsonFile(filePath);
                if (data) {
                    const processed = this.processData(data, filePath);
                    allData.push(processed);
                    
                    // Сохраняем для группировки
                    const key = `${processed.config}-${processed.branch}`;
                    if (!loadedData[key]) loadedData[key] = [];
                    loadedData[key].push(processed);
                }
            } catch (error) {
                console.warn(`Ошибка загрузки ${filePath}:`, error);
            }
        }

        console.log(`✅ Загружено ${allData.length} тестов`);
        return {
            allData: allData.sort((a, b) => new Date(a.date) - new Date(b.date)),
            groupedData: loadedData
        };
    }

    async loadJsonFile(filePath) {
        const response = await fetch(`${this.baseUrl}/${filePath}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    }

    processData(rawData, filePath) {
        const config = filePath.split('/')[0];
        const commit = filePath.split('/')[1].replace('.json', '');
        
        return {
            date: new Date(rawData.date),
            dateLabel: new Date(rawData.date).toLocaleDateString('ru-RU'),
            branch: rawData.branch.replace('refs/heads/', ''),
            commit: commit,
            config: config,
            read_iops: Math.round(rawData.read_iops),
            write_iops: Math.round(rawData.write_iops),
            read_latency: Math.round(rawData.read_latency_ns),
            write_latency: Math.round(rawData.write_latency_ns),
            testUrl: `https://rawstor.github.io/rawstor_bench/fio/librawstor/${config}/${commit}.html`
        };
    }

    getUniqueBranches(data) {
        return [...new Set(data.map(item => item.branch))].sort();
    }

    getUniqueConfigs(data) {
        return [...new Set(data.map(item => item.config))].sort();
    }
}