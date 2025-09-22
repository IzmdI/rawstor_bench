function createChart(config) {
    const { container, title, yLabel, data, accessor, id, groupBy } = config;
    
    if (!data || data.length === 0) {
        container.html('<p class="no-data">No data available</p>');
        return null;
    }

    // Очищаем контейнер
    container.html('');

    // Создаем SVG элемент
    const margin = { top: 20, right: 30, bottom: 40, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Преобразуем timestamp в Date объекты и фильтруем некорректные данные
    const processedData = data
        .map(d => ({
            ...d,
            timestamp: d.timestamp === "Unknown date" ? null : new Date(d.timestamp),
            value: accessor(d)
        }))
        .filter(d => d.value !== null && d.value !== undefined && !isNaN(d.value));

    if (processedData.length === 0) {
        container.html('<p class="no-data">No valid data points</p>');
        return null;
    }

    // Группируем данные
    const dataByGroup = d3.group(processedData, d => d.group);
    const groups = Array.from(dataByGroup.keys());

    // Создаем шкалы
    const xScale = d3.scaleTime()
        .domain(d3.extent(processedData, d => d.timestamp).filter(d => d))
        .range([0, width])
        .nice();

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.value) * 1.1])
        .range([height, 0])
        .nice();

    // Создаем оси
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%b %d'));
    
    const yAxis = d3.axisLeft(yScale);

    // Рисуем оси
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .append('text')
        .attr('x', width / 2)
        .attr('y', 35)
        .attr('fill', 'currentColor')
        .text('Date');

    svg.append('g')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -height / 2)
        .attr('dy', '0.71em')
        .attr('fill', 'currentColor')
        .text(yLabel);

    // Рисуем сетку
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''));

    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

    // Создаем line generator
    const line = d3.line()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    // Рисуем линии и точки для каждой группы
    const chartState = {
        groups: groups,
        lines: new Map(),
        dots: new Map(),
        visibleGroups: new Set(groups) // Показываем все по умолчанию
    };

    groups.forEach((groupName, groupIndex) => {
        const groupData = dataByGroup.get(groupName)
            .filter(d => d.timestamp) // Фильтруем данные с валидной датой
            .sort((a, b) => a.timestamp - b.timestamp);

        if (groupData.length === 0) return;

        // Рисуем линию
        const linePath = svg.append('path')
            .datum(groupData)
            .attr('class', `line line-${groupName.replace(/\s+/g, '-')}`)
            .attr('d', line)
            .style('stroke', getColor(groupIndex))
            .style('stroke-width', 2)
            .style('fill', 'none');

        chartState.lines.set(groupName, linePath);

        // Рисуем точки
        const dots = svg.selectAll(`.dot-${groupName.replace(/\s+/g, '-')}`)
            .data(groupData)
            .enter()
            .append('circle')
            .attr('class', `dot dot-${groupName.replace(/\s+/g, '-')}`)
            .attr('cx', d => xScale(d.timestamp))
            .attr('cy', d => yScale(d.value))
            .attr('r', 3)
            .style('fill', getColor(groupIndex))
            .style('stroke', '#fff')
            .style('stroke-width', 1.5);

        chartState.dots.set(groupName, dots);

        // Добавляем взаимодействие
        dots.on('mouseover', function(event, d) {
                showTooltip(event, d, title, accessor, groupBy);
            })
            .on('mouseout', hideTooltip)
            .on('click', function(event, d) {
                if (d.test_url) {
                    window.open(d.test_url, '_blank');
                }
            });
    });

    // Функция для обновления видимости
    chartState.updateVisibility = function(visibleGroups) {
        groups.forEach(groupName => {
            const isVisible = visibleGroups.has(groupName);
            const line = chartState.lines.get(groupName);
            const dots = chartState.dots.get(groupName);
            
            if (line) {
                line.style('opacity', isVisible ? 1 : 0.2);
            }
            if (dots) {
                dots.style('opacity', isVisible ? 1 : 0.2);
            }
        });
    };

    return chartState;
}