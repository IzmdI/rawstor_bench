function createSafeClassName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

function createChart(config) {
    const { 
        container, title, yLabel, data, accessor, id, groupBy, 
        timeRangeDays, legendType, metricType, 
        visibleOperations = ['read'], availableGroups = [],
        // Новый параметр: указывает, что данные уже отфильтрованы
        dataAlreadyFiltered = false
    } = config;

    console.log(`📊 Creating chart: ${id} with timeRangeDays: ${timeRangeDays}`);
    console.log(`📈 Initial data points: ${data.length}`);
    console.log(`🔍 Data already filtered: ${dataAlreadyFiltered}`);

    if (!data || data.length === 0) {
        console.warn(`❌ No data for chart: ${id}`);
        container.html('<p class="no-data">No data available</p>');
        return null;
    }

    // Очищаем контейнер
    container.html('');

    // Адаптивные размеры
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

    // Обрабатываем данные - объединяем read и write
    let processedData = [];

    if (metricType === 'iops') {
        // Объединяем IOPS read и write
        const iopsReadData = data.filter(d => d.metric === 'iops_read' || d.dataKey?.includes('iops_read'));
        const iopsWriteData = data.filter(d => d.metric === 'iops_write' || d.dataKey?.includes('iops_write'));

        processedData = [
            ...iopsReadData.map(d => ({
                ...d,
                timestamp: d.timestamp === "Unknown date" ? null : new Date(d.timestamp),
                value: d.value,
                safeGroup: createSafeClassName(d.group),
                operation: 'read',
                fullGroup: `${d.group} - read`
            })),
            ...iopsWriteData.map(d => ({
                ...d,
                timestamp: d.timestamp === "Unknown date" ? null : new Date(d.timestamp),
                value: d.value,
                safeGroup: createSafeClassName(d.group),
                operation: 'write',
                fullGroup: `${d.group} - write`
            }))
        ];
    } else if (metricType === 'latency') {
        // Объединяем Latency read и write
        const latencyReadData = data.filter(d => d.metric === 'latency_read' || d.dataKey?.includes('latency_read'));
        const latencyWriteData = data.filter(d => d.metric === 'latency_write' || d.dataKey?.includes('latency_write'));

        processedData = [
            ...latencyReadData.map(d => ({
                ...d,
                timestamp: d.timestamp === "Unknown date" ? null : new Date(d.timestamp),
                value: d.value,
                safeGroup: createSafeClassName(d.group),
                operation: 'read',
                fullGroup: `${d.group} - read`
            })),
            ...latencyWriteData.map(d => ({
                ...d,
                timestamp: d.timestamp === "Unknown date" ? null : new Date(d.timestamp),
                value: d.value,
                safeGroup: createSafeClassName(d.group),
                operation: 'write',
                fullGroup: `${d.group} - write`
            }))
        ];
    }

    // Фильтруем некорректные данные
    processedData = processedData.filter(d => d.value !== null && d.value !== undefined && !isNaN(d.value) && d.timestamp);

    // ВАЖНО: НЕ применяем дополнительную фильтрацию, если данные уже отфильтрованы в app.js
    if (!dataAlreadyFiltered && timeRangeDays > 0) {
        // Только если данные не отфильтрованы, применяем фильтрацию
        console.log(`🔍 Applying time filter in chart.js for ${timeRangeDays} days`);
        processedData = filterChartData(processedData, timeRangeDays);
    } else {
        console.log(`✅ Using pre-filtered data, skipping chart-level time filter`);
    }

    if (processedData.length === 0) {
        console.warn(`❌ No valid data points after filtering for chart: ${id}`);
        container.html('<p class="no-data">No data available for selected time range</p>');
        return null;
    }

    console.log(`📈 Chart ${id}: ${processedData.length} data points after processing`);

    // Группируем данные по полной группе (group + operation)
    const dataByFullGroup = d3.group(processedData, d => d.fullGroup);
    const fullGroups = Array.from(dataByFullGroup.keys());
    
    // Используем availableGroups если переданы, иначе берем из данных
    const baseGroups = availableGroups.length > 0 
        ? availableGroups 
        : Array.from(new Set(processedData.map(d => d.group)));

    // Создаем шкалы
    const xScale = d3.scaleTime()
        .domain(d3.extent(processedData, d => d.timestamp))
        .range([0, width])
        .nice();

    const yMin = d3.min(processedData, d => d.value);
    const yMax = d3.max(processedData, d => d.value);
    const yPadding = (yMax - yMin) * 0.1;

    const yScale = d3.scaleLinear()
        .domain([Math.max(0, yMin - yPadding), yMax + yPadding])
        .range([height, 0])
        .nice();

    console.log(`📅 X-axis domain: ${xScale.domain().map(d => d.toISOString().split('T')[0])}`);
    console.log(`📊 Y-axis domain: [${yScale.domain()[0].toFixed(2)}, ${yScale.domain()[1].toFixed(2)}]`);

    // НАСТРОЙКИ ТИПОГРАФИКИ ДЛЯ ОСЕЙ
    const axisFontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
    const axisFontSize = '13px';
    const axisFontWeight = '500';
    const axisColor = '#444';
    const gridColor = '#f0f0f0';
    const axisLineColor = '#ddd';

    // Настраиваем формат оси X
    const xAxisFormat = timeRangeDays < 15 ? 
        d3.timeFormat('%H:%M %d.%m') :
        d3.timeFormat('%d.%m');

    console.log(`📅 Using X-axis format for ${timeRangeDays} days: ${timeRangeDays < 15 ? 'detailed' : 'daily'}`);

    const xAxis = d3.axisBottom(xScale)
        .ticks(timeRangeDays < 15 ? 10 : 8)
        .tickFormat(xAxisFormat);

    // Настраиваем формат оси Y
    const formatYAxis = (value) => {
        if (metricType === 'iops') {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
            return value.toFixed(0);
        } else {
            return value >= 1 ? value.toFixed(1) : value.toFixed(3);
        }
    };

    const yAxis = d3.axisLeft(yScale)
        .ticks(8)
        .tickFormat(formatYAxis);

    // РИСУЕМ ОСЬ X С УЛУЧШЕННОЙ ТИПОГРАФИКОЙ
    const xAxisGroup = svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .call(g => g.select('.domain')
            .attr('stroke', axisLineColor)
            .attr('stroke-width', 1.5))
        .call(g => g.selectAll('.tick line')
            .attr('stroke', axisLineColor)
            .attr('stroke-width', 1))
        .call(g => g.selectAll('.tick text')
            .attr('fill', axisColor)
            .attr('font-family', axisFontFamily)
            .attr('font-size', axisFontSize)
            .attr('font-weight', axisFontWeight)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em'));

    // РИСУЕМ ОСЬ Y С УЛУЧШЕННОЙ ТИПОГРАФИКОЙ
    const yAxisGroup = svg.append('g')
        .call(yAxis)
        .call(g => g.select('.domain')
            .attr('stroke', axisLineColor)
            .attr('stroke-width', 1.5))
        .call(g => g.selectAll('.tick line')
            .attr('stroke', axisLineColor)
            .attr('stroke-width', 1))
        .call(g => g.selectAll('.tick text')
            .attr('fill', axisColor)
            .attr('font-family', axisFontFamily)
            .attr('font-size', axisFontSize)
            .attr('font-weight', axisFontWeight)
            .attr('text-anchor', 'end')
            .attr('dx', '-0.5em'));

    // Добавляем заголовок оси Y
    const yAxisLabel = svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -70)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', axisColor)
        .attr('font-family', axisFontFamily)
        .attr('font-size', '15px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.5px');

    // Устанавливаем текст в зависимости от типа метрики
    if (metricType === 'iops') {
        yAxisLabel.text('IOPS');
    } else if (metricType === 'latency') {
        yAxisLabel.text('Latency (ms)');
    } else {
        yAxisLabel.text(yLabel);
    }

    // УЛУЧШЕННАЯ СЕТКА
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .tickSize(-height)
            .tickFormat('')
        )
        .call(g => g.selectAll('.tick line')
            .attr('stroke', gridColor)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3'));

    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat('')
        )
        .call(g => g.selectAll('.tick line')
            .attr('stroke', gridColor)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3'));

    // ДОБАВЛЯЕМ ЗАГОЛОВОК ГРАФИКА
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#2c3e50')
        .attr('font-family', "'Segoe UI', 'Helvetica Neue', Arial, sans-serif")
        .attr('font-size', '16px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.5px')
        .text(title);

    // Создаем line generator
    const line = d3.line()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    // ОПРЕДЕЛЯЕМ НАЧАЛЬНУЮ ВИДИМОСТЬ НА ОСНОВЕ visibleOperations
    const chartState = {
        groups: baseGroups,
        fullGroups: fullGroups,
        lines: new Map(),
        dots: new Map(),
        visibleFullGroups: new Set(
            fullGroups.filter(fullGroup => {
                const operation = fullGroup.split(' - ')[1];
                return visibleOperations.includes(operation);
            })
        )
    };

    console.log(`👁️  Initial visibility: ${Array.from(chartState.visibleFullGroups).join(', ')}`);

    // Рисуем линии и точки
    fullGroups.forEach((fullGroup, groupIndex) => {
        const groupData = dataByFullGroup.get(fullGroup)
            .sort((a, b) => a.timestamp - b.timestamp);

        if (groupData.length === 0) return;

        const operation = groupData[0].operation;
        const baseGroup = groupData[0].group;
        
        // Находим индекс группы в baseGroups для правильного цвета
        const baseGroupIndex = baseGroups.indexOf(baseGroup);
        if (baseGroupIndex === -1) {
            console.warn(`Group "${baseGroup}" not found in available groups, skipping`);
            return;
        }

        // Определяем начальную видимость
        const isInitiallyVisible = chartState.visibleFullGroups.has(fullGroup);

        console.log(`🎨 Drawing ${fullGroup}: ${groupData.length} points, visible: ${isInitiallyVisible}`);

        // Рисуем линию с стилем операции (один цвет для группы)
        const linePath = svg.append('path')
            .datum(groupData)
            .attr('class', `line line-${createSafeClassName(fullGroup)}`)
            .attr('d', line)
            .style('stroke', getColor(baseGroupIndex))
            .style('stroke-width', getOperationStyle(operation).strokeWidth)
            .style('stroke-dasharray', getOperationStyle(operation).strokeDasharray)
            .style('fill', 'none')
            .style('stroke-linecap', 'round')
            .style('opacity', isInitiallyVisible ? 1 : 0);

        chartState.lines.set(fullGroup, linePath);

        // ВСЕГДА РИСУЕМ ТОЧКИ
        const dots = svg.selectAll(`.dot-${createSafeClassName(fullGroup)}`)
            .data(groupData)
            .enter()
            .append('circle')
            .attr('class', `dot dot-${createSafeClassName(fullGroup)}`)
            .attr('cx', d => xScale(d.timestamp))
            .attr('cy', d => yScale(d.value))
            .attr('r', 4)
            .style('fill', getColor(baseGroupIndex))
            .style('stroke', '#fff')
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .style('transition', 'all 0.3s ease')
            .style('opacity', isInitiallyVisible ? 1 : 0)
            .style('pointer-events', 'all');

        chartState.dots.set(fullGroup, dots);

        // Добавляем взаимодействие для точек
        dots.on('mouseover', function(event, d) {
                if (chartState.visibleFullGroups.has(fullGroup)) {
                    d3.select(this)
                        .attr('r', 6)
                        .style('stroke-width', 3);
                    showTooltip(event, d, title, accessor, groupBy, timeRangeDays);
                }
            })
            .on('mouseout', function(event, d) {
                if (chartState.visibleFullGroups.has(fullGroup)) {
                    d3.select(this)
                        .attr('r', 4)
                        .style('stroke-width', 2);
                    hideTooltip();
                }
            })
            .on('click', function(event, d) {
                if (chartState.visibleFullGroups.has(fullGroup) && d.commit_sha) {
                    // Формируем URL для перехода к результатам теста
                    const testUrl = buildTestUrl(d.config, d.commit_sha);
                    console.log('Opening test URL:', testUrl);
                    window.open(testUrl, '_blank');
                }
            });
    });

    // Функция для обновления видимости
    chartState.updateVisibility = function(visibleFullGroups) {
        chartState.visibleFullGroups = visibleFullGroups;
        console.log(`👁️  Updating visibility: ${Array.from(visibleFullGroups).join(', ')}`);
        
        fullGroups.forEach(fullGroup => {
            const isVisible = visibleFullGroups.has(fullGroup);
            const line = chartState.lines.get(fullGroup);
            const dots = chartState.dots.get(fullGroup);
            
            if (line) {
                line.style('opacity', isVisible ? 1 : 0);
            }
            if (dots) {
                dots.style('opacity', isVisible ? 1 : 0);
            }
        });
    };

    console.log(`✅ Chart ${id} created successfully with ${fullGroups.length} groups`);
    return chartState;
}

// ФУНКЦИЯ ДЛЯ ФИЛЬТРАЦИИ ДАННЫХ ГРАФИКА
function filterChartData(data, timeRangeDays) {
    if (!data || data.length === 0) return [];
    
    console.log(`📊 Initial data points: ${data.length}, time range: ${timeRangeDays} days`);
    
    // Если timeRangeDays = 0 (all), возвращаем все данные без фильтрации
    if (timeRangeDays === 0) {
        console.log('📅 Using all data (no time filter)');
        return data;
    }
    
    // Рассчитываем дату отсечения
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRangeDays);
    
    console.log(`📅 Filtering data since: ${cutoffDate.toISOString().split('T')[0]}`);
    
    // Шаг 1: Группируем по fullGroup (группа + операция)
    const dataByFullGroup = d3.group(data, d => d.fullGroup);
    const filteredData = [];
    
    dataByFullGroup.forEach((groupData, fullGroup) => {
        // Шаг 2: Фильтруем данные по времени
        const timeFilteredData = groupData.filter(d => {
            if (!d.timestamp || d.timestamp === "Unknown date") return false;
            const pointDate = new Date(d.timestamp);
            return pointDate >= cutoffDate;
        });
        
        if (timeFilteredData.length === 0) {
            console.log(`❌ ${fullGroup}: no data in the last ${timeRangeDays} days`);
            return;
        }
        
        // Шаг 3: Для каждой группы - берем только последний тест в каждый день
        const dailyGroups = d3.group(timeFilteredData, d => {
            const date = new Date(d.timestamp);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        });
        
        const uniqueDailyData = [];
        dailyGroups.forEach((dayTests, day) => {
            if (dayTests.length > 0) {
                // Сортируем по времени и берем последний тест дня
                const lastTest = dayTests.sort((a, b) => 
                    new Date(b.timestamp) - new Date(a.timestamp)
                )[0];
                uniqueDailyData.push(lastTest);
            }
        });
        
        // Шаг 4: Проверяем, есть ли данные минимум в 2 разных дня
        const uniqueDays = new Set(uniqueDailyData.map(d => {
            const date = new Date(d.timestamp);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }));
        
        if (uniqueDays.size >= 2) {
            // Добавляем данные только если есть минимум 2 дня
            filteredData.push(...uniqueDailyData);
            console.log(`✅ ${fullGroup}: ${uniqueDailyData.length} points across ${uniqueDays.size} days (last ${timeRangeDays} days)`);
        } else {
            console.log(`❌ ${fullGroup}: skipped - only ${uniqueDays.size} day(s) of data in last ${timeRangeDays} days`);
        }
    });
    
    console.log(`📊 Filtered data points: ${filteredData.length} (removed ${data.length - filteredData.length})`);
    return filteredData;
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