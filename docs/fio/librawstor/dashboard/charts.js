function createSafeClassName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

function createChart(config) {
    const { container, title, yLabel, data, accessor, id, groupBy, timeRangeDays } = config;

    if (!data || data.length === 0) {
        container.html('<p class="no-data">No data available</p>');
        return null;
    }

    // Очищаем контейнер
    container.html('');

    // Адаптивные размеры
    const containerWidth = container.node().getBoundingClientRect().width || 800;
    const margin = { top: 30, right: 60, bottom: 50, left: 80 };
    const width = Math.max(400, containerWidth - margin.left - margin.right);
    const height = 400 - margin.top - margin.bottom;

    const svg = container.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Обрабатываем данные
    let processedData = data
        .map(d => ({
            ...d,
            timestamp: d.timestamp === "Unknown date" ? null : new Date(d.timestamp),
            value: accessor(d),
            safeGroup: createSafeClassName(d.group),
            dateKey: d.timestamp ? new Date(d.timestamp).toDateString() : 'unknown'
        }))
        .filter(d => d.value !== null && d.value !== undefined && !isNaN(d.value) && d.timestamp);

    // Фильтруем данные для больших временных диапазонов (15+ дней)
    if (timeRangeDays >= 15 && processedData.length > 0) {
        processedData = filterDataForLargeTimeRange(processedData);
    }

    if (processedData.length === 0) {
        container.html('<p class="no-data">No valid data points</p>');
        return null;
    }

    // Группируем данные
    const dataByGroup = d3.group(processedData, d => d.group);
    const groups = Array.from(dataByGroup.keys());

    // Создаем шкалы с увеличенным масштабом
    const xScale = d3.scaleTime()
        .domain(d3.extent(processedData, d => d.timestamp))
        .range([0, width])
        .nice();

    // Увеличиваем масштаб Y шкалы для лучшей видимости
    const yMin = d3.min(processedData, d => d.value);
    const yMax = d3.max(processedData, d => d.value);
    const yPadding = (yMax - yMin) * 0.1; // 10% padding

    const yScale = d3.scaleLinear()
        .domain([Math.max(0, yMin - yPadding), yMax + yPadding])
        .range([height, 0])
        .nice();

    // Настраиваем формат оси X в зависимости от временного диапазона
    const xAxisFormat = timeRangeDays < 15 ?
        d3.timeFormat('%H:%M %d.%m') : // Для коротких диапазонов: часы:минуты день.месяц
        d3.timeFormat('%d.%m');        // Для длинных диапазонов: день.месяц

    const xAxis = d3.axisBottom(xScale)
        .ticks(timeRangeDays < 15 ? 10 : 8) // Больше тиков для коротких диапазонов
        .tickFormat(xAxisFormat);

    // Настраиваем формат оси Y для IOPS
    const formatYAxis = (value) => {
        if (title.toLowerCase().includes('iops')) {
            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
            if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
            return value.toFixed(0);
        } else {
            // Для latency оставляем обычный формат
            return value >= 1 ? value.toFixed(1) : value.toFixed(3);
        }
    };

    const yAxis = d3.axisLeft(yScale)
        .ticks(8)
        .tickFormat(formatYAxis);

    // Рисуем оси с улучшенным стилем
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .call(g => g.select('.domain').attr('stroke', '#ccc'))
        .call(g => g.selectAll('.tick line').attr('stroke', '#e0e0e0'))
        .call(g => g.selectAll('.tick text').attr('fill', '#666').attr('font-size', '11px'));

    svg.append('g')
        .call(yAxis)
        .call(g => g.select('.domain').attr('stroke', '#ccc'))
        .call(g => g.selectAll('.tick line').attr('stroke', '#e0e0e0'))
        .call(g => g.selectAll('.tick text').attr('fill', '#666').attr('font-size', '11px'))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -height / 2)
        .attr('dy', '0.71em')
        .attr('fill', '#333')
        .attr('font-weight', 'bold')
        .attr('font-size', '12px')
        .text(title.toLowerCase().includes('iops') ? 'kIOPS' : yLabel);

    // Улучшенная сетка
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .tickSize(-height)
            .tickFormat('')
        )
        .call(g => g.selectAll('.tick line').attr('stroke', '#f0f0f0').attr('stroke-dasharray', '2,2'));

    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat('')
        )
        .call(g => g.selectAll('.tick line').attr('stroke', '#f0f0f0').attr('stroke-dasharray', '2,2'));

    // Создаем line generator с плавными кривыми
    const line = d3.line()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    // Рисуем линии и точки для каждой группы
    const chartState = {
        groups: groups,
        lines: new Map(),
        dots: new Map(),
        visibleGroups: new Set(groups)
    };

    groups.forEach((groupName, groupIndex) => {
        const safeGroupName = createSafeClassName(groupName);
        const groupData = dataByGroup.get(groupName)
            .sort((a, b) => a.timestamp - b.timestamp);

        if (groupData.length === 0) return;

        // Рисуем линию с тенью для лучшей видимости
        const linePath = svg.append('path')
            .datum(groupData)
            .attr('class', `line line-${safeGroupName}`)
            .attr('d', line)
            .style('stroke', getColor(groupIndex))
            .style('stroke-width', 3) // Более толстые линии
            .style('fill', 'none')
            .style('stroke-linecap', 'round');

        chartState.lines.set(groupName, linePath);

        // Рисуем точки только если мало данных или короткий диапазон
        const showDots = processedData.length < 50 || timeRangeDays < 15;

        if (showDots) {
            const dots = svg.selectAll(`.dot-${safeGroupName}`)
                .data(groupData)
                .enter()
                .append('circle')
                .attr('class', `dot dot-${safeGroupName}`)
                .attr('cx', d => xScale(d.timestamp))
                .attr('cy', d => yScale(d.value))
                .attr('r', 4) // Увеличиваем точки
                .style('fill', getColor(groupIndex))
                .style('stroke', '#fff')
                .style('stroke-width', 2)
                .style('cursor', 'pointer')
                .style('transition', 'r 0.2s');

            chartState.dots.set(groupName, dots);

            // Добавляем взаимодействие
            dots.on('mouseover', function(event, d) {
                    d3.select(this).attr('r', 6);
                    showTooltip(event, d, title, accessor, groupBy, timeRangeDays);
                })
                .on('mouseout', function(event, d) {
                    d3.select(this).attr('r', 4);
                    hideTooltip();
                })
                .on('click', function(event, d) {
                    if (d.test_url) {
                        window.open(d.test_url, '_blank');
                    }
                });
        }
    });

    // Функция для обновления видимости
    chartState.updateVisibility = function(visibleGroups) {
        groups.forEach(groupName => {
            const isVisible = visibleGroups.has(groupName);
            const safeGroupName = createSafeClassName(groupName);
            const line = chartState.lines.get(groupName);
            const dots = chartState.dots.get(groupName);

            if (line) {
                line.style('opacity', isVisible ? 1 : 0.3)
                    .style('stroke-width', isVisible ? 3 : 2);
            }
            if (dots) {
                dots.style('opacity', isVisible ? 1 : 0.3);
            }
        });
    };

    return chartState;
}

// Функция для фильтрации данных при больших временных диапазонах
function filterDataForLargeTimeRange(data) {
    const filteredData = [];
    const groupsData = d3.group(data, d => d.group);

    groupsData.forEach((groupData, groupName) => {
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