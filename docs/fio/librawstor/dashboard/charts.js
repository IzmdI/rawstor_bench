class BenchmarkCharts {
    constructor() {
        this.margin = { top: 60, right: 80, bottom: 100, left: 80 };
        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    }

    createIOPSChart(container, data, groupType) {
        return this.createChart(container, data, groupType, 'iops');
    }

    createLatencyChart(container, data, groupType) {
        return this.createChart(container, data, groupType, 'latency');
    }

    createChart(container, data, groupType, metricType) {
        const width = container.node().offsetWidth;
        const height = 400;
        const innerWidth = width - this.margin.left - this.margin.right;
        const innerHeight = height - this.margin.top - this.margin.bottom;

        container.html('');

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Группируем данные
        const lineData = this.prepareLineData(data, metricType, groupType);

        if (lineData.length === 0) {
            g.append('text')
                .attr('x', innerWidth / 2)
                .attr('y', innerHeight / 2)
                .attr('text-anchor', 'middle')
                .text('Нет данных для отображения');
            return { svg, g, width, height, lineData };
        }

        // Scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, innerWidth]);

        const maxValue = metricType === 'iops' ?
            d3.max(data, d => Math.max(d.read_iops, d.write_iops)) :
            d3.max(data, d => Math.max(d.read_latency, d.write_latency));

        const yScale = d3.scaleLinear()
            .domain([0, maxValue * 1.1])
            .range([innerHeight, 0]);

        // Оси
        this.addAxes(g, xScale, yScale, innerWidth, innerHeight, metricType);

        // Рисуем линии
        this.drawLines(g, lineData, xScale, yScale, metricType);

        return {
            svg, g, xScale, yScale, width, height,
            innerWidth, innerHeight, lineData
        };
    }

    prepareLineData(data, metricType, groupType) {
        const lines = [];
        const groups = {};

        const validData = data.filter(item =>
            item.date instanceof Date &&
            !isNaN(item.date.getTime()) &&
            !isNaN(item.read_iops) &&
            !isNaN(item.write_iops) &&
            !isNaN(item.read_latency) &&
            !isNaN(item.write_latency)
        );

        validData.forEach(item => {
            const groupKey = groupType === 'config' ? item.config : item.branch;

            // Read metrics
            const readId = this.getLineId(groupKey, 'read', groupType);
            if (!groups[readId]) {
                groups[readId] = {
                    id: readId,
                    type: 'read',
                    group: groupKey,
                    groupType: groupType,
                    points: [],
                    color: this.getLineColor(groupKey, 'read', metricType, groupType),
                    visible: true
                };
            }
            groups[readId].points.push({
                date: item.date,
                value: metricType === 'iops' ? item.read_iops : item.read_latency,
                commit: item.commit,
                testUrl: item.testUrl,
                rawData: item
            });

            // Write metrics
            const writeId = this.getLineId(groupKey, 'write', groupType);
            if (!groups[writeId]) {
                groups[writeId] = {
                    id: writeId,
                    type: 'write',
                    group: groupKey,
                    groupType: groupType,
                    points: [],
                    color: this.getLineColor(groupKey, 'write', metricType, groupType),
                    visible: true
                };
            }
            groups[writeId].points.push({
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

    getLineId(group, metricType, groupType) {
        return `${groupType}-${group}-${metricType}`;
    }

    getLineColor(group, lineType, metricType, groupType) {
        if (groupType === 'config') {
            // Для конфигураций: один цвет на всю конфигурацию
            return this.configColors(group);
        } else {
            // Для веток: цвет зависит от типа линии (read/write)
            return lineType === 'read' ?
                (metricType === 'iops' ? '#1f77b4' : '#2ca02c') :
                (metricType === 'iops' ? '#d62728' : '#ff7f0e');
        }
    }

    addAxes(g, xScale, yScale, width, height, metricType) {
        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat('%d.%m.%Y')));

        // Y Axis
        g.append('g')
            .call(d3.axisLeft(yScale).ticks(8));

        // Y Label
        const yLabel = metricType === 'iops' ? 'IOPS' : 'Latency (ns)';
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

    drawLines(g, lineData, xScale, yScale, metricType) {
        // Line generator
        const line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value))
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
                .attr('opacity', lineInfo.visible ? 1 : 0)
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
                    .attr('opacity', lineInfo.visible ? 1 : 0)
                    .style('cursor', 'pointer')
                    .on('mouseover', (event, d) => this.showTooltip(event, d, lineInfo, metricType))
                    .on('mouseout', () => this.hideTooltip())
                    .on('click', (event, d) => {
                        window.open(d.testUrl, '_blank');
                    });
            });
        });
    }

    updateLineVisibility(chart, lineId, isVisible) {
        if (!chart || !chart.g) return;

        chart.g.selectAll(`.line.${lineId}`)
            .transition().duration(300)
            .attr('opacity', isVisible ? 1 : 0)
            .style('display', isVisible ? null : 'none');

        chart.g.selectAll(`.point.${lineId}`)
            .transition().duration(300)
            .attr('opacity', isVisible ? 1 : 0)
            .style('display', isVisible ? null : 'none');
    }

    showTooltip(event, pointData, lineInfo, metricType) {
        const tooltip = d3.select('#tooltip');
        const metricName = metricType === 'iops' ? 'IOPS' : 'Latency (ns)';
        const typeName = lineInfo.type === 'read' ? 'Чтение' : 'Запись';
        const groupTypeName = lineInfo.groupType === 'config' ? 'Конфигурация' : 'Ветка';

        tooltip.html(`
            <h3>${pointData.rawData.dateLabel}</h3>
            <p><strong>${groupTypeName}:</strong> ${lineInfo.group}</p>
            <p><strong>Тип:</strong> ${typeName}</p>
            <p><strong>${metricName}:</strong> ${DataUtils.formatNumber(pointData.value)}</p>
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
}