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
            const files = await this.getConfigFiles(config);
            const configData = [];

            console.log(`🔍 Загрузка ${config}, файлов: ${files.length}`);

            for (const file of files.slice(0, 10)) {
                try {
                    const jsonFile = file;
                    const metaFile = file.replace('.json', '.meta');

                    // Загружаем оба файла параллельно
                    const [jsonData, metaData] = await Promise.all([
                        this.loadJsonFile(`${config}/${jsonFile}`),
                        this.loadJsonFile(`${config}/${metaFile}`).catch(error => {
                            console.warn(`⚠️ Meta файл не найден: ${config}/${metaFile}`);
                            return null; // Продолжаем без meta файла
                        })
                    ]);

                    console.log(`📄 ${file}:`, {
                        hasJson: !!jsonData,
                        hasMeta: !!metaData,
                        branchFromMeta: metaData?.branch
                    });

                    const processed = this.processData(jsonData, metaData, `${config}/${jsonFile}`);
                    if (processed) {
                        configData.push(processed);
                    }
                } catch (error) {
                    console.warn(`❌ Ошибка ${config}/${file}:`, error.message);
                }
            }

            console.log(`✅ ${config}: обработано ${configData.length} файлов`);
            return configData;
        } catch (error) {
            console.warn(`❌ Ошибка конфигурации ${config}:`, error.message);
            return [];
        }
    }

    async getConfigFiles(config) {
        try {
            const apiUrl = `https://api.github.com/repos/rawstor/rawstor_bench/contents/data/fio/librawstor/${config}?ref=frontend`;
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error(`API: ${response.status}`);

            const contents = await response.json();

            // Фильтруем только JSON файлы (исключаем .meta)
            return contents
                .filter(item => item.type === 'file' && item.name.endsWith('.json') && !item.name.endsWith('.meta'))
                .map(item => item.name);

        } catch (error) {
            console.warn(`GitHub API недоступно для ${config}:`, error.message);
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

    processData(jsonData, metaData, filePath) {
        try {
            const config = filePath.split('/')[0];
            const fileName = filePath.split('/')[1];
            const commit = fileName.replace('.json', '');
            
            // Извлекаем данные из JSON
            if (!jsonData.jobs || !Array.isArray(jsonData.jobs) || jsonData.jobs.length === 0) {
                console.warn('No jobs data in:', jsonData);
                return null;
            }

            let read_iops, write_iops, read_latency, write_latency, date;

            // Способ 1: Новая структура (jobs array)
            if (jsonData.jobs && Array.isArray(jsonData.jobs) && jsonData.jobs.length > 0) {
                const job = jsonData.jobs[0];
                read_iops = Math.round(Number(job.read?.iops_mean) || 0);
                write_iops = Math.round(Number(job.write?.iops_mean) || 0);
                read_latency = Math.round(Number(job.read?.lat_ns?.mean) || 0);
                write_latency = Math.round(Number(job.write?.lat_ns?.mean) || 0);
            }
            // Способ 2: Старая структура (прямые поля)
            else {
                read_iops = Math.round(Number(jsonData.read_iops) || 0);
                write_iops = Math.round(Number(jsonData.write_iops) || 0);
                read_latency = Math.round(Number(jsonData.read_latency_ns) || 0);
                write_latency = Math.round(Number(jsonData.write_latency_ns) || 0);
            }

            // Дата из timestamp или time
            if (jsonData.timestamp) {
                date = new Date(jsonData.timestamp * 1000);
            } else if (jsonData.time) {
                date = new Date(jsonData.time);
            } else {
                date = new Date();
            }

            // ВЕТКА: сначала пробуем из meta файла, потом из JSON как fallback
            let branch = 'main';
            if (metaData && metaData.branch) {
                branch = String(metaData.branch).replace(/refs\/heads\/|heads\//g, '');
            } else if (jsonData.branch) {
                branch = String(jsonData.branch).replace(/refs\/heads\/|heads\//g, '');
            } else if (jsonData.global_options?.branch) {
                branch = String(jsonData.global_options.branch).replace(/refs\/heads\/|heads\//g, '');
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
                dateLabel: date.toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                branch: branch,
                commit: commit,
                config: config,
                read_iops: read_iops,
                write_iops: write_iops,
                read_latency: read_latency,
                write_latency: write_latency,
                testUrl: `../${config}/${commit}.html`,
                hasMeta: !!metaData // Флаг что meta файл был найден
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