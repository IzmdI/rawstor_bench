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
        this.cache = new Map();
    }

    async loadAllData() {
        console.log('🚀 Загрузка данных benchmark...');
        
        try {
            // Параллельная загрузка данных для всех конфигураций
            const configPromises = this.configs.map(config => 
                this.loadConfigData(config).catch(error => {
                    console.warn(`Ошибка загрузки ${config}:`, error);
                    return [];
                })
            );

            const allConfigData = await Promise.all(configPromises);
            const allData = allConfigData.flat();
            
            console.log(`✅ Загружено ${allData.length} тестов из ${this.configs.length} конфигураций`);
            
            return {
                allData: allData.sort((a, b) => new Date(a.date) - new Date(b.date)),
                groupedData: this.groupDataByConfigAndBranch(allData)
            };
            
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
            throw error;
        }
    }

    async loadConfigData(config) {
        // Кэширование для избежания повторных загрузок
        if (this.cache.has(config)) {
            return this.cache.get(config);
        }

        try {
            // Получаем список файлов для конфигурации через GitHub API
            const files = await this.getConfigFiles(config);
            const configData = [];
            
            // Ограничиваем количество одновременно загружаемых файлов
            const BATCH_SIZE = 10;
            for (let i = 0; i < files.length; i += BATCH_SIZE) {
                const batch = files.slice(i, i + BATCH_SIZE);
                const batchPromises = batch.map(file => 
                    this.loadJsonFile(`${config}/${file}`).catch(error => {
                        console.warn(`Ошибка загрузки ${config}/${file}:`, error);
                        return null;
                    })
                );
                
                const batchResults = await Promise.all(batchPromises);
                const validResults = batchResults.filter(Boolean);
                
                validResults.forEach(rawData => {
                    const processed = this.processData(rawData, `${config}/${rawData.commit}.json`);
                    configData.push(processed);
                });
                
                // Небольшая задержка между батчами
                if (i + BATCH_SIZE < files.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            this.cache.set(config, configData);
            return configData;
            
        } catch (error) {
            console.error(`Ошибка загрузки конфигурации ${config}:`, error);
            return [];
        }
    }

    async getConfigFiles(config) {
        // Для демо - используем статический список файлов
        // В реальности можно использовать GitHub API для получения списка файлов
        return [
            '022a761e45112d161bd24e5399e06dcdd83d9e00.json',
            '8173024b13c30ae735733876cab701b34b4973fc.json'
        ];
    }

    groupDataByConfigAndBranch(data) {
        const grouped = {};
        data.forEach(item => {
            const key = `${item.config}-${item.branch}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(item);
        });
        return grouped;
    }

    // ... остальные методы без изменений ...
}