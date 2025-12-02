function createSafeClassName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

function createChart(config) {
    const { 
        container, title, yLabel, data, accessor, id, groupBy, 
        timeRangeDays, legendType, metricType, 
        visibleOperations = ['read'], availableGroups = [],
        dataAlreadyFiltered = false
    } = config;

    console.log(`📊 Creating chart: ${id}`);
    console.log(`📈 Input data points: ${data.length}`);
    console.log(`⏰ Time range: ${timeRangeDays} days`);
    console.log(`🔍 Data already filtered: ${dataAlreadyFiltered}`);

    // Очищаем контейнер ПОЛНОСТЬЮ
    container.html('');

    if (!data || data.length === 0) {
        container.html('<p class="no-data">No data available</p>');
        return null;
    }

    // Шаг 1: ПРИМЕНИТЬ ФИЛЬТРАЦИЮ ПО ВРЕМЕНИ (если не применена)
    let processedData = [...data];

    if (!dataAlreadyFiltered && timeRangeDays > 0) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeRangeDays);
        cutoffDate.setHours(0, 0, 0, 0);

        console.log(`⏰ Applying time filter: ${cutoffDate.toISOString()}`);

        const beforeCount = processedData.length;
        processedData = processedData.filter(d => {
            if (!d.timestamp || d.timestamp === "Unknown date") return false;
            const pointDate = new Date(d.timestamp);
            return pointDate >= cutoffDate;
        });

        console.log(`⏰ Time filter result: ${beforeCount} -> ${processedData.length} points`);
    }

    // Шаг 2: Фильтровать по видимым операциям и группам
    processedData = processedData.filter(d => {
        const operation = d.operation || (d.metric && d.metric.includes('read') ? 'read' : 'write');
        const group = d.group;

        const isOperationVisible = visibleOperations.includes(operation);
        const isGroupVisible = availableGroups.length === 0 || availableGroups.includes(group);

        return isOperationVisible && isGroupVisible;
    });

    if (processedData.length === 0) {
        container.html('<p class="no-data">No data matches the current filters</p>');
        return null;
    }

    console.log(`📈 Chart ${id}: ${processedData.length} points after all filters`);

    // Шаг 3: Создать SVG и оси
    const containerWidth = container.node().getBoundingClientRect().width || 800;
    const margin = { top: 50, right: 80, bottom: 70, left: 90 };
    const width = Math.max(400, containerWidth - margin.left - margin.right);
    const height = 450 - margin.top - margin.bottom;

    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Шаг 4: Преобразовать данные для D3
    const transformedData = processedData.map(d => ({
        ...d,
        timestamp: d.timestamp === "Unknown date" ? null : new Date(d.timestamp),
        value: d.value,
        safeGroup: createSafeClassName(d.group),
        operation: d.operation || (d.metric && d.metric.includes('read') ? 'read' : 'write'),
        fullGroup: `${d.group} - ${d.operation || (d.metric && d.metric.includes('read') ? 'read' : 'write')}`
    })).filter(d => d.timestamp && !isNaN(d.value));

    if (transformedData.length === 0) {
        container.html('<p class="no-data">No valid data points after processing</p>');
        return null;
    }

    // Шаг 5: Создать шкалы (основная проблема была здесь!)
    const xScale = d3.scaleTime()
        .domain(d3.extent(transformedData, d => d.timestamp)) // ВАЖНО: используем ОТФИЛЬТРОВАННЫЕ данные
        .range([0, width])
        .nice();

    const yMin = d3.min(transformedData, d => d.value);
    const yMax = d3.max(transformedData, d => d.value);
    const yPadding = (yMax - yMin) * 0.1 || 1;

    const yScale = d3.scaleLinear()
        .domain([Math.max(0, yMin - yPadding), yMax + yPadding])
        .range([height, 0])
        .nice();

    console.log(`📅 X-axis domain: ${xScale.domain().map(d => d.toISOString().split('T')[0])}`);
    console.log(`📊 Y-axis domain: [${yScale.domain()[0].toFixed(2)}, ${yScale.domain()[1].toFixed(2)}]`);

    // ... остальной код создания осей, линий, точек ...

    // ВОЗВРАЩАЕМ ПРОСТОЙ ОБЪЕКТ, а не сложный state
    return {
        id: id,
        data: transformedData,
        updateVisibility: function(visibleFullGroups) {
            // Простая реализация обновления видимости
            fullGroups.forEach(fullGroup => {
                const isVisible = visibleFullGroups.has(fullGroup);
                const line = svg.select(`.line-${createSafeClassName(fullGroup)}`);
                const dots = svg.selectAll(`.dot-${createSafeClassName(fullGroup)}`);

                if (!line.empty()) line.style('opacity', isVisible ? 1 : 0);
                if (!dots.empty()) dots.style('opacity', isVisible ? 1 : 0);
            });
        }
    };
}

// ФУНКЦИЯ ДЛЯ ФИЛЬТРАЦИИ И ОБРАБОТКИ ДАННЫХ ГРАФИКА
function filterChartData(data, timeRangeDays, skipTimeFilter = false) {
    if (!data || data.length === 0) return [];
    
    console.log(`📊 filterChartData called: ${data.length} points, timeRangeDays=${timeRangeDays}, skipTimeFilter=${skipTimeFilter}`);
    
    // ИСПРАВЛЕНИЕ: Всегда начинаем с исходных данных
    let timeFilteredData = data;

    // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Правильная логика применения фильтра
    if (timeRangeDays > 0) {
        // ВАЖНО: Фильтруем даже если skipTimeFilter=true, но учитываем параметр
        if (!skipTimeFilter) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - timeRangeDays);
            cutoffDate.setHours(0, 0, 0, 0);

            console.log(`📅 Time filtering since: ${cutoffDate.toISOString().split('T')[0]} (${timeRangeDays} days ago)`);

            const beforeCount = timeFilteredData.length;
            timeFilteredData = timeFilteredData.filter(d => {
                if (!d.timestamp || d.timestamp === "Unknown date") return false;
                const pointDate = new Date(d.timestamp);
                return pointDate >= cutoffDate;
            });

            console.log(`📅 Time filter: ${beforeCount} -> ${timeFilteredData.length} points`);
        } else {
            console.log(`⏰ Skipping time filter (data already filtered elsewhere)`);
        }
    } else if (timeRangeDays === 0) {
        console.log(`🌍 Time range: all time (no filtering)`);
    }

    if (timeFilteredData.length === 0) {
        console.log(`❌ No data after time filtering`);
        return [];
    }

    // Дедупликация (оставляем как есть)
    const dataByFullGroup = d3.group(timeFilteredData, d => d.fullGroup);
    const finalData = [];

    console.log(`📊 Processing ${dataByFullGroup.size} groups for deduplication`);

    dataByFullGroup.forEach((groupData, fullGroup) => {
        // Берем только последний тест каждого дня
        const dailyGroups = d3.group(groupData, d => {
            const date = new Date(d.timestamp);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        });

        const uniqueDailyData = [];
        dailyGroups.forEach((dayTests, day) => {
            if (dayTests.length > 0) {
                const lastTest = dayTests.sort((a, b) =>
                    new Date(b.timestamp) - new Date(a.timestamp)
                )[0];
                uniqueDailyData.push(lastTest);
            }
        });

        // Проверяем, есть ли данные минимум в 2 разных дня
        const uniqueDays = new Set(uniqueDailyData.map(d => {
            const date = new Date(d.timestamp);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }));

        if (uniqueDays.size >= 2) {
            finalData.push(...uniqueDailyData);
            console.log(`✅ ${fullGroup}: ${uniqueDailyData.length} points across ${uniqueDays.size} days`);
        } else {
            console.log(`❌ ${fullGroup}: skipped - only ${uniqueDays.size} day(s) of data`);
        }
    });
    
    console.log(`📊 Final result: ${finalData.length} points (from ${data.length} input)`);
    
    // Проверим диапазон дат
    if (finalData.length > 0) {
        const dates = finalData.map(d => new Date(d.timestamp).toISOString().split('T')[0]);
        const uniqueDates = [...new Set(dates)].sort();
        console.log(`📅 Date range in final data: ${uniqueDates[0]} to ${uniqueDates[uniqueDates.length - 1]} (${uniqueDates.length} unique days)`);
    }
    
    return finalData;
}

// Функция для построения URL теста
function buildTestUrl(config, commitSha) {
    // Базовый URL дашборда: https://izmdi.github.io/rawstor_bench/fio/librawstor/dashboard/
    // URL теста: https://izmdi.github.io/rawstor_bench/fio/librawstor/perftest--without-liburing-file-4k-1-1/2ab396e2ce718be5c9f52d5d3d8b987e232c01d2.html
    
    // Получаем текущий базовый URL
    const baseUrl = window.location.origin + window.location.pathname;
    const dashboardPath = '/fio/librawstor/dashboard/';
    
    // Если мы на дашборде, строим относительный путь
    if (baseUrl.includes(dashboardPath)) {
        const testPath = baseUrl.replace(dashboardPath, `/fio/librawstor/${config}/${commitSha}.html`);
        return testPath;
    }
    
    // Иначе строим абсолютный путь
    return `https://izmdi.github.io/rawstor_bench/fio/librawstor/${config}/${commitSha}.html`;
}

// Функция для фильтрации данных при больших временных диапазонах (старая - оставляем для совместимости)
function filterDataForLargeTimeRange(data) {
    return filterChartData(data, 15); // Используем новую функцию
}