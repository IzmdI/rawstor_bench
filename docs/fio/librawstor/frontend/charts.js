class BenchmarkCharts {
    constructor() {
        this.margin = { top: 40, right: 80, bottom: 60, left: 80 };
        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
        this.visibleLines = new Set();
    }

    createIOPSChart(container, data) {
        const width = container.node().offsetWidth;
        const height = 400;
        const innerWidth = width - this.margin.left - this.margin.right;
        const innerHeight = height - this.margin.top - this.margin.bottom;

        // Очищаем контейнер
        container.html('');

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.read_iops, d.write_iops)) * 1.1])
            .range([innerHeight, 0]);

        // Добавляем оси
        this.addAxes(g, xScale, yScale, innerWidth, innerHeight, 'IOPS');

        // Пока просто заглушка - линии добавим после
        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight / 2)
            .attr('text-anchor', 'middle')
            .text('Данные загружаются...');

        return { svg, g, xScale, yScale, width, height };
    }

    createLatencyChart(container, data) {
        // Аналогично createIOPSChart, но для latency
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

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.read_latency, d.write_latency)) * 1.1])
            .range([innerHeight, 0]);

        this.addAxes(g, xScale, yScale, innerWidth, innerHeight, 'Latency (ns)');

        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight / 2)
            .attr('text-anchor', 'middle')
            .text('Данные загружаются...');

        return { svg, g, xScale, yScale, width, height };
    }

    addAxes(g, xScale, yScale, width, height, yLabel) {
        // X Axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(5));

        // Y Axis
        g.append('g')
            .call(d3.axisLeft(yScale).ticks(8));

        // Y Label
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - this.margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text(yLabel);
    }
}