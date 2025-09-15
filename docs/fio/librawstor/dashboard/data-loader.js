class BenchmarkDataLoader {
    constructor() {
        this.baseUrl = 'https://raw.githubusercontent.com/izmdi/rawstor_bench/main/data/fio/librawstor';
        this.configs = [
            'perftest-4k-1-1',
            'perftest-4k-2-1',
            'perftest--disable-ost-4k-1-1',
            'perftest--disable-ost-4k-2-1',
            'perftest--without-liburing-4k-1-1',
            'perftest--without-liburing-4k-2-1',
            'perftest--without-liburing--disable-ost-4k-1-1',
            'perftest--without-liburing--disable-ost-4k-2-1'
        ];
        this.cache = new Map();
    }

    async loadAllData() {
        console.log('🚀 Загрузка тестов за последний месяц...');
        const startTime = Date.now();

        try {
            const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const recentTests = await this.getTestsSince(oneMonthAgo);

            if (recentTests.length === 0) {
                console.warn('⚠️ Не найдено тестов за последний месяц, загружаем все тесты');
                const allTests = await this.getAllTests();
                const result = await this.processAllTests(allTests);
                console.log(`⏱️ Загрузка заняла: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
                return result;
            }

            console.log(`✅ Найдено ${recentTests.length} тестов за последний месяц`);
            const result = await this.processAllTests(recentTests);
            console.log(`⏱️ Загрузка заняла: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
            return result;

        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
            throw error;
        }
    }

    async getTestsSince(timestamp) {
        const allTests = [];
        const monthAgo = new Date(timestamp);

        console.log(`📅 Ищем тесты с ${monthAgo.toLocaleDateString('ru-RU')}`);

        for (const config of this.configs) {
            try {
                const configTests = await this.getTestsForConfigSince(config, timestamp);
                allTests.push(...configTests);
            } catch (error) {
                console.warn(`⚠️ Ошибка получения тестов для ${config}:`, error.message);
            }
        }

        return allTests;
    }

    async getTestsForConfigSince(config, timestamp) {
        try {
            const metaFiles = await this.getMetaFiles(config);
            const recentTests = [];

            const jsonFiles = await this.getJsonFiles(config);
            const jsonFileSet = new Set(jsonFiles);

            const validMetaFiles = metaFiles.filter(metaFile => {
                const jsonFile = metaFile.replace('.meta', '.json');
                return jsonFileSet.has(jsonFile);
            });

            console.log(`📁 ${config}: ${validMetaFiles.length} valid meta files`);

            for (const metaFile of validMetaFiles) {
                try {
                    const metaData = await this.loadJsonFile(`${config}/${metaFile}`);
                    const testTimestamp = metaData.timestamp || metaData.time;

                    if (testTimestamp && testTimestamp * 1000 >= timestamp) {
                        recentTests.push({
                            config,
                            metaFile,
                            jsonFile: metaFile.replace('.meta', '.json'),
                            timestamp: testTimestamp
                        });
                    }
                } catch (error) {
                    console.warn(`❌ Ошибка meta файла ${config}/${metaFile}:`, error.message);
                }
            }

            return recentTests;

        } catch (error) {
            console.warn(`❌ Ошибка конфигурации ${config}:`, error.message);
            return [];
        }
    }

    async getAllTests() {
        const allTests = [];

        for (const config of this.configs) {
            try {
                const metaFiles = await this.getMetaFiles(config);
                const configTests = metaFiles.map(metaFile => ({
                    config,
                    metaFile,
                    jsonFile: metaFile.replace('.meta', '.json')
                }));

                allTests.push(...configTests);
            } catch (error) {
                console.warn(`⚠️ Ошибка получения всех тестов для ${config}:`, error.message);
            }
        }

        return allTests;
    }

    async processAllTests(tests) {
        tests.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        console.log(`📊 Обрабатываем ${tests.length} тестов...`);

        const testData = [];
        const loadedTests = new Set();

        for (const test of tests) {
            try {
                const testKey = `${test.config}/${test.jsonFile}`;
                if (loadedTests.has(testKey)) continue;

                let jsonData, metaData;

                try {
                    jsonData = await this.loadJsonFile(`${test.config}/${test.jsonFile}`);
                } catch (error) {
                    console.warn(`❌ JSON файл не найден: ${test.config}/${test.jsonFile}`);
                    continue;
                }

                try {
                    metaData = await this.loadJsonFile(`${test.config}/${test.metaFile}`);
                } catch (error) {
                    console.warn(`⚠️ Meta файл не найден: ${test.config}/${test.metaFile}`);
                    metaData = {};
                }

                const processed = this.processData(jsonData, metaData, test.config, test.jsonFile);
                if (processed) {
                    testData.push(processed);
                    loadedTests.add(testKey);
                }

                await new Promise(resolve => setTimeout(resolve, 30));

            } catch (error) {
                console.warn(`❌ Ошибка обработки теста ${test.config}/${test.jsonFile}:`, error.message);
            }
        }

        console.log(`✅ Успешно обработано ${testData.length} тестов`);

        return {
            allData: testData.sort((a, b) => b.date - a.date),
            groupedData: this.groupDataByConfigAndBranch(testData)
        };
    }

    async getMetaFiles(config) {
        try {
            const apiUrl = `https://api.github.com/repos/izmdi/rawstor_bench/contents/data/fio/librawstor/${config}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                if (response.status === 404) {
                    return [];
                }
                throw new Error(`GitHub API: ${response.status}`);
            }

            const contents = await response.json();

            return contents
                .filter(item => item.type === 'file' && item.name.endsWith('.meta'))
                .map(item => item.name);

        } catch (error) {
            console.warn(`GitHub API недоступно для ${config}:`, error.message);
            return [];
        }
    }

    async getJsonFiles(config) {
        try {
            const apiUrl = `https://api.github.com/repos/izmdi/rawstor_bench/contents/data/fio/librawstor/${config}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return [];
            }

            const contents = await response.json();

            return contents
                .filter(item => item.type === 'file' && item.name.endsWith('.json'))
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

    processData(jsonData, metaData, config, fileName) {
        try {
            const commit = fileName.replace('.json', '');

            if (!jsonData.jobs || !Array.isArray(jsonData.jobs) || jsonData.jobs.length === 0) {
                return null;
            }

            const job = jsonData.jobs[0];
            const read_iops = Math.round(Number(job.read?.iops_mean) || 0);
            const write_iops = Math.round(Number(job.write?.iops_mean) || 0);
            const read_latency = Math.round(Number(job.read?.lat_ns?.mean) || 0);
            const write_latency = Math.round(Number(job.write?.lat_ns?.mean) || 0);

            let date;
            if (metaData && metaData.timestamp) {
                date = new Date(metaData.timestamp * 1000);
            } else if (jsonData.timestamp) {
                date = new Date(jsonData.timestamp * 1000);
            } else if (metaData && metaData.time) {
                date = new Date(metaData.time);
            } else {
                date = new Date();
            }

            let branch = 'main';
            if (metaData && metaData.branch) {
                branch = String(metaData.branch).replace(/refs\/heads\/|heads\//g, '');
            } else if (jsonData.branch) {
                branch = String(jsonData.branch).replace(/refs\/heads\/|heads\//g, '');
            }

            if (isNaN(date.getTime()) || isNaN(read_iops) || isNaN(write_iops) ||
                isNaN(read_latency) || isNaN(write_latency)) {
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

    clearCache() {
        this.cache.clear();
        console.log('🧹 Кэш данных очищен');
    }
}