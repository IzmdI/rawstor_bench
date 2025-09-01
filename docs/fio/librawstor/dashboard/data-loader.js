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
            const allData = [];

            for (const config of this.configs) {
                try {
                    const configData = await this.loadConfigData(config);
                    const validData = configData.filter(item => item !== null);
                    console.log(`📦 ${config}: ${validData.length}/${configData.length} valid тестов`);
                    allData.push(...validData);
                } catch (error) {
                    console.warn(`⚠️ ${config}:`, error.message);
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
        try {
            const config = filePath.split('/')[0];
            const fileName = filePath.split('/')[1];
            const commit = fileName.replace('.json', '');

            let read_iops, write_iops, read_latency, write_latency, date, branch;

            // Способ 1: Новая структура (jobs array)
            if (rawData.jobs && Array.isArray(rawData.jobs) && rawData.jobs.length > 0) {
                const job = rawData.jobs[0];
                read_iops = Math.round(Number(job.read?.iops_mean) || 0);
                write_iops = Math.round(Number(job.write?.iops_mean) || 0);
                read_latency = Math.round(Number(job.read?.lat_ns?.mean) || 0);
                write_latency = Math.round(Number(job.write?.lat_ns?.mean) || 0);
            }
            // Способ 2: Старая структура (прямые поля)
            else {
                read_iops = Math.round(Number(rawData.read_iops) || 0);
                write_iops = Math.round(Number(rawData.write_iops) || 0);
                read_latency = Math.round(Number(rawData.read_latency_ns) || 0);
                write_latency = Math.round(Number(rawData.write_latency_ns) || 0);
            }

            // Дата из timestamp или time
            if (rawData.timestamp) {
                date = new Date(rawData.timestamp * 1000);
            } else if (rawData.time) {
                date = new Date(rawData.time);
            } else {
                date = new Date();
            }

            // Ветка из разных возможных мест
            branch = 'main';
            if (rawData.branch) {
                branch = String(rawData.branch).replace(/refs\/heads\/|heads\//g, '');
            } else if (rawData.global_options?.branch) {
                branch = String(rawData.global_options.branch).replace(/refs\/heads\/|heads\//g, '');
            }

            // Валидация
            if (isNaN(date.getTime()) || isNaN(read_iops) || isNaN(write_iops) ||
                isNaN(read_latency) || isNaN(write_latency)) {
                console.warn('Invalid data values:', { date, read_iops, write_iops, read_latency, write_latency });
                return null;
            }

            return {
                id: `${config}-${commit}-${Date.now()}`,
                date: date,
                dateLabel: date.toLocaleDateString('ru-RU'),
                branch: branch,
                commit: commit,
                config: config,
                read_iops: read_iops,
                write_iops: write_iops,
                read_latency: read_latency,
                write_latency: write_latency,
                testUrl: `../${config}/${commit}.html`
            };
        } catch (error) {
            console.warn('Error processing data:', error);
            return null;
        }
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