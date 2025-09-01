class BenchmarkDataLoader {
    constructor() {
        // Путь к данным относительно dashboard
        this.baseUrl = 'https://raw.githubusercontent.com/rawstor/rawstor_bench/frontend/data/fio/librawstor';
        
        // Все конфигурации из структуры репозитория
        this.configs = [
            'perftest--disable-ost-4k-1-1',
            'perftest--disable-ost-4k-2-1',
            'perftest--without-liburing--disable-ost-4k-1-1',
            'perftest--without-liburing--disable-ost-4k-2-1',
            'perftest--without-liburing-4k-1-1',
            'perftest--without-liburing-4k-2-1',
            'perftest-4k-1-1',
            'perftest-4k-2-1'
        ];
    }

    async loadAllData() {
        console.log('🚀 Загрузка данных benchmark...');
        
        try {
            // Загружаем данные для всех конфигураций
            const allData = [];
            
            for (const config of this.configs) {
                try {
                    const configData = await this.loadConfigData(config);
                    allData.push(...configData);
                    console.log(`📦 ${config}: ${configData.length} тестов`);
                } catch (error) {
                    console.warn(`⚠️  Ошибка загрузки ${config}:`, error.message);
                }
            }
            
            if (allData.length === 0) {
                throw new Error('Не удалось загрузить ни одного теста');
            }
            
            console.log(`✅ Итого загружено: ${allData.length} тестов`);
            
            // Сортируем по дате
            const sortedData = allData.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            return {
                allData: sortedData,
                groupedData: this.groupDataByConfigAndBranch(sortedData)
            };
            
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
            throw error;
        }
    }

    async loadConfigData(config) {
        try {
            // Получаем список JSON файлов в директории конфигурации
            const files = await this.getConfigFiles(config);
            const configData = [];
            
            // Загружаем все файлы параллельно
            const filePromises = files.map(file => 
                this.loadJsonFile(`${config}/${file}`).catch(error => {
                    console.warn(`Ошибка файла ${config}/${file}:`, error.message);
                    return null;
                })
            );
            
            const fileResults = await Promise.all(filePromises);
            
            // Обрабатываем успешные результаты
            fileResults.filter(Boolean).forEach(rawData => {
                const processed = this.processData(rawData, `${config}/${rawData.commit}.json`);
                configData.push(processed);
            });
            
            return configData;
            
        } catch (error) {
            console.warn(`Ошибка загрузки конфигурации ${config}:`, error.message);
            return [];
        }
    }

    async getConfigFiles(config) {
        try {
            // Используем GitHub API для получения списка файлов
            const apiUrl = `https://api.github.com/repos/rawstor/rawstor_bench/contents/data/fio/librawstor/${config}?ref=frontend`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`GitHub API: ${response.status}`);
            }
            
            const contents = await response.json();
            
            // Фильтруем только JSON файлы
            return contents
                .filter(item => item.type === 'file' && item.name.endsWith('.json'))
                .map(item => item.name);
                
        } catch (error) {
            console.warn(`Не удалось получить список файлов для ${config}:`, error.message);
            return [];
        }
    }

    async loadJsonFile(filePath) {
        const response = await fetch(`${this.baseUrl}/${filePath}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    }

    processData(rawData, filePath) {
        const config = filePath.split('/')[0];
        const commit = filePath.split('/')[1].replace('.json', '');
        
        // Извлекаем название ветки
        let branch = rawData.branch || 'main';
        if (branch.includes('refs/heads/')) {
            branch = branch.replace('refs/heads/', '');
        }
        if (branch.includes('heads/')) {
            branch = branch.replace('heads/', '');
        }

        return {
            id: `${config}-${commit}`,
            date: new Date(rawData.date),
            dateLabel: new Date(rawData.date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            branch: branch,
            commit: commit,
            config: config,
            read_iops: Math.round(Number(rawData.read_iops) || 0),
            write_iops: Math.round(Number(rawData.write_iops) || 0),
            read_latency: Math.round(Number(rawData.read_latency_ns) || 0),
            write_latency: Math.round(Number(rawData.write_latency_ns) || 0),
            testUrl: `../${config}/${commit}.html`
        };
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

    getUniqueBranches(data) {
        return [...new Set(data.map(item => item.branch))].sort();
    }

    getUniqueConfigs(data) {
        return [...new Set(data.map(item => item.config))].sort();
    }
}