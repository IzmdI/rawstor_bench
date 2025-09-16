function createChart(config) {
    const { container, title, yLabel, data, accessor, id } = config;

    if (!data || data.length === 0) {
        console.warn(`No data available for chart: ${title}`);
        return;
    }

    // Создаем контейнер для графика
    const chartContainer = container.append('div')
        .attr('class', 'chart')
        .attr('id', id);

    // Добавляем заголовок
    chartContainer.append('h3')
        .text(title);

    // Создаем SVG элемент
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = chartContainer.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Преобразуем timestamp в Date объекты
    const processedData = data.map(d => ({
        ...d,
        timestamp: new Date(d.timestamp)
    }));

    // Создаем шкалы
    const xScale = d3.scaleTime()
        .domain(d3.extent(processedData, d => d.timestamp))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => accessor(d)) * 1.1])
        .range([height, 0]);

    // Создаем оси
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    svg.append('g')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .attr('dy', '0.71em')
        .attr('fill', '#000')
        .text(yLabel);

    // Группируем данные по конфигурациям
    const dataByConfig = d3.group(processedData, d => d.config);

    // Создаем line generator
    const line = d3.line()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(accessor(d)))
        .curve(d3.curveMonotoneX);

    // Рисуем линии для каждой конфигурации
    dataByConfig.forEach((configData, configName) => {
        const sortedData = configData.sort((a, b) => a.timestamp - b.timestamp);

        svg.append('path')
            .datum(sortedData)
            .attr('class', `line line-${configName.replace(/\s+/g, '-')}`)
            .attr('d', line)
            .style('stroke', (d, i) => getColor(Array.from(dataByConfig.keys()).indexOf(configName)))
            .style('stroke-width', 2)
            .style('fill', 'none');

        // Добавляем точки
        svg.selectAll(`.dot-${configName.replace(/\s+/g, '-')}`)
            .data(sortedData)
            .enter()
            .append('circle')
            .attr('class', `dot dot-${configName.replace(/\s+/g, '-')}`)
            .attr('cx', d => xScale(d.timestamp))
            .attr('cy', d => yScale(accessor(d)))
            .attr('r', 4)
            .style('fill', (d, i) => getColor(Array.from(dataByConfig.keys()).indexOf(configName)))
            .on('mouseover', function(event, d) {
                showTooltip(event, d, title, accessor);
            })
            .on('mouseout', hideTooltip)
            .on('click', function(event, d) {
                if (d.test_url) {
                    window.open(d.test_url, '_blank');
                }
            });
    });

    // Добавляем сетку
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''));

    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));
}