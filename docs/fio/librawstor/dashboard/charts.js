class BenchmarkCharts {
    constructor() {
        this.margin = { top: 60, right: 80, bottom: 100, left: 80 };
        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
        this.zoomBehavior = null;
    }

    createIOPSChart(container, data, groupType) {
        // Фильтруем данные перед созданием scales
        const validData = data.filter(item =>
            !isNaN(item.date.getTime()) &&
            !isNaN(item.read_iops) &&
            !isNaN(item.write_iops)
        );

        if (validData.length === 0) {
            container.html('<div class="error">Нет valid данных для графика</div>');
            return null;
        }

        const width = container.node().offsetWidth;
        const height = 400;
        const innerWidth = width - this.margin.left - this.margin.right;
        const innerHeight = height - this.margin.top - this.margin.bottom;

        container.html('');

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('cursor', 'default');

        const g = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(validData, d => d.date))
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(validData, d => Math.max(d.read_iops, d.write_iops)) * 1.1])
            .range([innerHeight, 0]);

        // Оси
        this.addAxes(g, xScale, yScale, innerWidth, innerHeight, 'IOPS');

        // Группируем данные для линий
        const lineData = this.prepareLineData(data, 'iops', groupType);

        // Создаем линии
        this.drawLines(g, lineData, xScale, yScale, 'iops');

        return {
            svg, g, xScale, yScale, width, height,
            innerWidth, innerHeight, lineData
        };
    }

    createLatencyChart(container, data) {
        const width = container.node().offsetWidth;
        const height = 400;
        const innerWidth = width - this.margin.left - this.margin.right;
        const innerHeight = height - this.margin.top - this.margin.bottom;

        container.html('');

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('cursor', 'default');

        const g = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.read_latency, d.write_latency)) * 1.1])
            .range([innerHeight, 0]);

        // Оси
        this.addAxes(g, xScale, yScale, innerWidth, innerHeight, 'Latency (ns)');

        // Группируем данные для линий
        const lineData = this.prepareLineData(data, 'latency');

        // Создаем линии
        this.drawLines(g, lineData, xScale, yScale, 'latency');

        return { 
            svg, g, xScale, yScale, width, height, 
            innerWidth, innerHeight, lineData 
        };
    }

    prepareLineData(data, metricType, groupType) {
        const lines = [];
        const groups = {};

        const validData = data.filter(item =>
            !isNaN(item.date.getTime()) &&
            !isNaN(item.read_iops) &&
            !isNaN(item.write_iops) &&
            !isNaN(item.read_latency) &&
            !isNaN(item.write_latency)
        );

        validData.forEach(item => {
            // Ключ группировки зависит от типа
            const groupKey = groupType === 'config' ? item.config : item.branch;

            // Read metrics
            const readKey = `${groupKey}-read`;
            if (!groups[readKey]) {
                groups[readKey] = {
                    id: readKey,
                    type: 'read',
                    group: groupKey,
                    groupType: groupType,
                    points: [],
                    color: groupType === 'config' ? this.colors(groupKey) : this.colors(readKey),
                    visible: true
                };
            }
            groups[readKey].points.push({
                date: item.date,
                value: metricType === 'iops' ? item.read_iops : item.read_latency,
                commit: item.commit,
                testUrl: item.testUrl,
                rawData: item
            });

            // Write metrics
            const writeKey = `${groupKey}-write`;
            if (!groups[writeKey]) {
                groups[writeKey] = {
                    id: writeKey,
                    type: 'write',
                    group: groupKey,
                    groupType: groupType,
                    points: [],
                    color: groupType === 'config' ? this.colors(groupKey) : this.colors(writeKey),
                    visible: true
                };
            }
            groups[writeKey].points.push({
                date: item.date,
                value: metricType === 'iops' ? item.write_iops : item.write_latency,
                commit: item.commit,
                testUrl: item.testUrl,
                rawData: item
            });
        });

        for (const key in groups) {
            groups[key].points.sort((a, b) => a.date - b.date);
            lines.push(groups[key]);
        }

        return lines;
    }

    drawLines(g, lineData, xScale, yScale, metricType) {
        // Line generator
        const line = d3.line()
            .x(d => {
                const value = xScale(d.date);
                return isNaN(value) ? 0 : value; // ← Защита от NaN
            })
            .y(d => {
                const value = yScale(d.value);
                return isNaN(value) ? 0 : value; // ← Защита от NaN
            })
            .curve(d3.curveMonotoneX);

        // Рисуем линии
        lineData.forEach(lineInfo => {
            if (lineInfo.points.length < 2) return;

            const path = g.append('path')
                .datum(lineInfo.points)
                .attr('class', `line ${lineInfo.id}`)
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', lineInfo.color)
                .attr('stroke-width', 2)
                .attr('opacity', lineInfo.visible ? 1 : 0.3)
                .style('pointer-events', 'none');

            // Добавляем точки
            lineInfo.points.forEach(point => {
                const circle = g.append('circle')
                    .datum(point)
                    .attr('class', `point ${lineInfo.id}`)
                    .attr('cx', xScale(point.date))
                    .attr('cy', yScale(point.value))
                    .attr('r', 4)
                    .attr('fill', lineInfo.color)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 1)
                    .attr('opacity', lineInfo.visible ? 1 : 0.3)
                    .style('cursor', 'pointer')
                    .on('mouseover', (event, d) => this.showTooltip(event, d, lineInfo, metricType))
                    .on('mouseout', () => this.hideTooltip())
                    .on('click', (event, d) => {
                        window.open(d.testUrl, '_blank');
                    });
            });
        });
    }

    addAxes(g, xScale, yScale, width, height, yLabel) {
        // X Axis
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat('%d.%m.%Y')));

        // Y Axis
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale).ticks(8));

        // Y Label
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - this.margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text(yLabel);

        // Grid
        g.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));
    }

    showTooltip(event, pointData, lineInfo, metricType) {
        const tooltip = d3.select('#tooltip');
        const metricName = metricType === 'iops' ? 'IOPS' : 'Latency';
        const value = metricType === 'iops' ? 
            `${DataUtils.formatNumber(pointData.value)} IOPS` : 
            `${DataUtils.formatNumber(pointData.value)} ns`;

        tooltip.html(`
            <h3>${pointData.rawData.dateLabel}</h3>
            <p><strong>Конфигурация:</strong> ${DataUtils.getConfigDisplayName(lineInfo.config)}</p>
            <p><strong>Ветка:</strong> ${lineInfo.branch}</p>
            <p><strong>Тип:</strong> ${lineInfo.type === 'read' ? 'Чтение' : 'Запись'}</p>
            <p><strong>${metricName}:</strong> ${value}</p>
            <p><strong>Коммит:</strong> ${DataUtils.getShortCommit(pointData.commit)}</p>
            <p><em>Кликните для деталей теста</em></p>
        `)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 15) + 'px')
        .style('display', 'block');
    }

    hideTooltip() {
        d3.select('#tooltip').style('display', 'none');
    }

    updateLineVisibility(chart, lineId, isVisible) {
        if (!chart || !chart.g) return;

        chart.g.selectAll(`.line.${lineId}`)
            .transition().duration(300)
            .attr('opacity', isVisible ? 1 : 0.3);

        chart.g.selectAll(`.point.${lineId}`)
            .transition().duration(300)
            .attr('opacity', isVisible ? 1 : 0.3);
    }
}