function createSafeClassName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

function createChart(config) {
    const { container, title, yLabel, data, accessor, id, groupBy, timeRangeDays, legendType, metricType } = config;
    
    if (!data || data.length === 0) {
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

    // Фильтруем данные для больших временных диапазонов (15+ дней)
    if (timeRangeDays >= 15 && processedData.length > 0) {
        processedData = filterDataForLargeTimeRange(processedData);
    }

    if (processedData.length === 0) {
        container.html('<p class="no-data">No valid data points</p>');
        return null;
    }

    // Группируем данные по полной группе (group + operation)
    const dataByFullGroup = d3.group(processedData, d => d.fullGroup);
    const fullGroups = Array.from(dataByFullGroup.keys());
    const baseGroups = Array.from(new Set(processedData.map(d => d.group)));

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
        yAxisLabel.text('Performance (kIOPS)');
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

    // Рисуем линии и точки
    const chartState = {
        groups: baseGroups, // Только базовые группы
        fullGroups: fullGroups, // Полные группы с операциями
        lines: new Map(),
        dots: new Map(),
        visibleFullGroups: new Set(fullGroups.filter(fg => fg.includes('read'))) // По умолчанию только read
    };

    fullGroups.forEach((fullGroup, groupIndex) => {
        const groupData = dataByFullGroup.get(fullGroup)
            .sort((a, b) => a.timestamp - b.timestamp);

        if (groupData.length === 0) return;

        const operation = groupData[0].operation;
        const baseGroup = groupData[0].group;
        const baseGroupIndex = baseGroups.indexOf(baseGroup);

        const isVisibleByDefault = config.visibleOperations ?
        config.visibleOperations.includes(operation) :
        operation === 'read';

        // Рисуем линию с стилем операции (один цвет для группы)
        const linePath = svg.append('path')
            .datum(groupData)
            .attr('class', `line line-${createSafeClassName(fullGroup)}`)
            .attr('d', line)
            .style('stroke', getColor(baseGroupIndex)) // Один цвет для всей группы
            .style('stroke-width', getOperationStyle(operation).strokeWidth)
            .style('stroke-dasharray', getOperationStyle(operation).strokeDasharray)
            .style('fill', 'none')
            .style('stroke-linecap', 'round')
            .style('opacity', isVisibleByDefault ? 1 : 0); // НАЧАЛЬНАЯ ВИДИМОСТЬ

        chartState.lines.set(fullGroup, linePath);

        // Рисуем точки только если мало данных или короткий диапазон
        const showDots = processedData.length < 50 || timeRangeDays < 15;
        
        if (showDots) {
            const dots = svg.selectAll(`.dot-${createSafeClassName(fullGroup)}`)
                .data(groupData)
                .enter()
                .append('circle')
                .attr('class', `dot dot-${createSafeClassName(fullGroup)}`)
                .attr('cx', d => xScale(d.timestamp))
                .attr('cy', d => yScale(d.value))
                .attr('r', 3)
                .style('fill', getColor(baseGroupIndex)) // Один цвет для всей группы
                .style('stroke', '#fff')
                .style('stroke-width', 1.5)
                .style('cursor', 'pointer')
                .style('transition', 'all 0.3s ease')
                .style('opacity', isVisibleByDefault ? 1 : 0); // НАЧАЛЬНАЯ ВИДИМОСТЬ

            chartState.dots.set(fullGroup, dots);

            // Добавляем взаимодействие
            dots.on('mouseover', function(event, d) {
                    if (chartState.visibleFullGroups.has(fullGroup)) {
                        d3.select(this)
                            .attr('r', 5)
                            .style('stroke-width', 2);
                        showTooltip(event, d, title, accessor, groupBy, timeRangeDays);
                    }
                })
                .on('mouseout', function(event, d) {
                    if (chartState.visibleFullGroups.has(fullGroup)) {
                        d3.select(this)
                            .attr('r', 3)
                            .style('stroke-width', 1.5);
                        hideTooltip();
                    }
                })
                .on('click', function(event, d) {
                    if (chartState.visibleFullGroups.has(fullGroup) && d.test_url) {
                        window.open(d.test_url, '_blank');
                    }
                });
        }
    });

    // Обновляем chartState для начальной видимости
    chartState.visibleFullGroups = new Set(
        fullGroups.filter(fullGroup => {
            const operation = fullGroup.split(' - ')[1];
            return config.visibleOperations ?
                config.visibleOperations.includes(operation) :
                operation === 'read';
        })
    );

    // Функция для обновления видимости
    chartState.updateVisibility = function(visibleFullGroups) {
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

    return chartState;
}

// Функция для фильтрации данных при больших временных диапазонах
function filterDataForLargeTimeRange(data) {
    const filteredData = [];
    const groupsData = d3.group(data, d => d.fullGroup);
    
    groupsData.forEach((groupData, fullGroup) => {
        // Группируем по дням
        const dailyGroups = d3.group(groupData, d => 
            new Date(d.timestamp).toDateString()
        );
        
        // Для каждого дня берем только последний тест
        dailyGroups.forEach((dayTests, day) => {
            if (dayTests.length > 0) {
                // Сортируем по времени и берем последний
                const lastTest = dayTests.sort((a, b) => 
                    new Date(b.timestamp) - new Date(a.timestamp)
                )[0];
                filteredData.push(lastTest);
            }
        });
    });
    
    console.log(`📊 Filtered data: ${data.length} → ${filteredData.length} points`);
    return filteredData;
}