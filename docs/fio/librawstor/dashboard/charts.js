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

    // Шаг 5: Создать шкалы
    const xScale = d3.scaleTime()
        .domain(d3.extent(transformedData, d => d.timestamp))
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

    // РИСУЕМ ОСЬ X
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

    // Добавляем заголовок оси X
    svg.append('text')
        .attr('transform', `translate(${width / 2},${height + 45})`)
        .attr('text-anchor', 'middle')
        .attr('fill', axisColor)
        .attr('font-family', axisFontFamily)
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.5px')
        .text('Time');

    // РИСУЕМ ОСЬ Y
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

    // Группируем данные по полной группе
    const dataByFullGroup = d3.group(transformedData, d => d.fullGroup);
    const fullGroups = Array.from(dataByFullGroup.keys());

    // Используем availableGroups если переданы, иначе берем из данных
    const baseGroups = availableGroups.length > 0
        ? availableGroups
        : Array.from(new Set(transformedData.map(d => d.group)));

    // ОПРЕДЕЛЯЕМ НАЧАЛЬНУЮ ВИДИМОСТЬ
    const visibleFullGroups = new Set(
        fullGroups.filter(fullGroup => {
            const operation = fullGroup.split(' - ')[1];
            return visibleOperations.includes(operation);
        })
    );

    console.log(`👁️  Initial visibility: ${Array.from(visibleFullGroups).join(', ')}`);

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
        const isInitiallyVisible = visibleFullGroups.has(fullGroup);

        console.log(`🎨 Drawing ${fullGroup}: ${groupData.length} points, visible: ${isInitiallyVisible}`);

        // Рисуем линию с стилем операции
        svg.append('path')
            .datum(groupData)
            .attr('class', `line line-${createSafeClassName(fullGroup)}`)
            .attr('d', line)
            .style('stroke', getColor(baseGroupIndex))
            .style('stroke-width', getOperationStyle(operation).strokeWidth)
            .style('stroke-dasharray', getOperationStyle(operation).strokeDasharray)
            .style('fill', 'none')
            .style('stroke-linecap', 'round')
            .style('opacity', isInitiallyVisible ? 1 : 0);

        // Рисуем точки
        svg.selectAll(`.dot-${createSafeClassName(fullGroup)}`)
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
            .style('pointer-events', 'all')
            .on('mouseover', function(event, d) {
                if (visibleFullGroups.has(fullGroup)) {
                    d3.select(this)
                        .attr('r', 6)
                        .style('stroke-width', 3);
                    showTooltip(event, d, title, accessor, groupBy, timeRangeDays);
                }
            })
            .on('mouseout', function(event, d) {
                if (visibleFullGroups.has(fullGroup)) {
                    d3.select(this)
                        .attr('r', 4)
                        .style('stroke-width', 2);
                    hideTooltip();
                }
            })
            .on('click', function(event, d) {
                if (visibleFullGroups.has(fullGroup) && d.commit_sha) {
                    const testUrl = buildTestUrl(d.config, d.commit_sha);
                    console.log('Opening test URL:', testUrl);
                    window.open(testUrl, '_blank');
                }
            });
    });

    // Создаем объект chart
    const chartObj = {
        id: id,
        fullGroups: Array.isArray(fullGroups) ? fullGroups : [],
        updateVisibility: function(newVisibleFullGroups) {
            console.log(`👁️  Updating visibility for ${this.id}`);

            if (!Array.isArray(this.fullGroups)) {
                console.error('❌ fullGroups is not an array:', this.fullGroups);
                return;
            }

            this.fullGroups.forEach(fullGroup => {
                const isVisible = newVisibleFullGroups.has(fullGroup);
                const line = svg.select(`.line-${createSafeClassName(fullGroup)}`);
                const dots = svg.selectAll(`.dot-${createSafeClassName(fullGroup)}`);

                if (!line.empty()) {
                    line.style('opacity', isVisible ? 1 : 0);
                }
                if (!dots.empty()) {
                    dots.style('opacity', isVisible ? 1 : 0);
                }
            });
        }
    };

    console.log(`✅ Chart ${id} created successfully with ${fullGroups.length} groups`);
    console.log(`📋 Chart object:`, chartObj);

    return chartObj;
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