function createChart(config) {
    const { 
        container, title, yLabel, data, accessor, id, groupBy, 
        timeRangeDays, legendType, metricType, 
        visibleOperations = ['read'], availableGroups = [],
        dataAlreadyFiltered = false
    } = config;

    console.log(`📊 Creating chart: ${id}`);
    console.log(`📈 Input data points: ${data.length}`);
    console.log(`👁️ Visible operations:`, visibleOperations);

    // Очищаем контейнер
    container.html('');

    if (!data || data.length === 0) {
        console.warn(`❌ No data for chart: ${id}`);
        container.html('<p class="no-data">No data available</p>');
        return null;
    }

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

    // 1. Обрабатываем данные
    let processedData = [];

    if (metricType === 'iops') {
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

    // 2. Применяем фильтрацию по времени (если не применена)
    if (!dataAlreadyFiltered && timeRangeDays > 0) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeRangeDays);
        cutoffDate.setHours(0, 0, 0, 0);

        const beforeCount = processedData.length;
        processedData = processedData.filter(d => {
            if (!d.timestamp) return false;
            const pointDate = new Date(d.timestamp);
            return pointDate >= cutoffDate;
        });
        console.log(`⏰ Time filter: ${beforeCount} -> ${processedData.length} points`);
    }

    // 3. Фильтруем по видимым операциям
    const beforeOpFilter = processedData.length;
    processedData = processedData.filter(d => {
        return visibleOperations.includes(d.operation);
    });
    console.log(`👁️ Operation filter: ${beforeOpFilter} -> ${processedData.length} points`);

    // 4. Фильтруем по доступным группам
    if (availableGroups.length > 0) {
        const beforeGroupFilter = processedData.length;
        processedData = processedData.filter(d => availableGroups.includes(d.group));
        console.log(`👥 Group filter: ${beforeGroupFilter} -> ${processedData.length} points`);
    }

    if (processedData.length === 0) {
        console.warn(`❌ No data after filtering for chart: ${id}`);
        container.html('<p class="no-data">No data matches the current filters</p>');
        return null;
    }

    console.log(`📈 Chart ${id}: ${processedData.length} data points`);

    // 5. Группируем данные
    const dataByFullGroup = d3.group(processedData, d => d.fullGroup);
    const fullGroups = Array.from(dataByFullGroup.keys());
    const baseGroups = Array.from(new Set(processedData.map(d => d.group)));

    // 6. Создаем шкалы
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

    // 7. Настраиваем оси
    const axisFontFamily = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
    const axisFontSize = '13px';
    const axisFontWeight = '500';
    const axisColor = '#444';
    const gridColor = '#f0f0f0';
    const axisLineColor = '#ddd';

    const xAxisFormat = timeRangeDays < 15 ? 
        d3.timeFormat('%H:%M %d.%m') :
        d3.timeFormat('%d.%m');

    const xAxis = d3.axisBottom(xScale)
        .ticks(timeRangeDays < 15 ? 10 : 8)
        .tickFormat(xAxisFormat);

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

    // 8. Рисуем ось X
    svg.append('g')
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

    svg.append('text')
        .attr('transform', `translate(${width / 2},${height + 45})`)
        .attr('text-anchor', 'middle')
        .attr('fill', axisColor)
        .attr('font-family', axisFontFamily)
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.5px')
        .text('Time');

    // 9. Рисуем ось Y
    svg.append('g')
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

    if (metricType === 'iops') {
        yAxisLabel.text('IOPS');
    } else if (metricType === 'latency') {
        yAxisLabel.text('Latency (ms)');
    } else {
        yAxisLabel.text(yLabel);
    }

    // 10. Сетка
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

    // 11. Заголовок
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

    // 12. Линия
    const line = d3.line()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    // 13. Определяем начальную видимость
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

    // 14. Рисуем линии и точки
    fullGroups.forEach((fullGroup, groupIndex) => {
        const groupData = dataByFullGroup.get(fullGroup)
            .sort((a, b) => a.timestamp - b.timestamp);

        if (groupData.length === 0) return;

        const operation = groupData[0].operation;
        const baseGroup = groupData[0].group;
        
        const baseGroupIndex = baseGroups.indexOf(baseGroup);
        if (baseGroupIndex === -1) {
            console.warn(`Group "${baseGroup}" not found in available groups, skipping`);
            return;
        }

        const isInitiallyVisible = chartState.visibleFullGroups.has(fullGroup);

        // Линия
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

        // Точки
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

        // Взаимодействие
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
                    const testUrl = buildTestUrl(d.config, d.commit_sha);
                    window.open(testUrl, '_blank');
                }
            });
    });

    // 15. Функция обновления видимости
    chartState.updateVisibility = function(visibleFullGroups) {
        console.log(`👁️  Updating visibility for ${id}`);
        console.log(`   Visible groups:`, Array.from(visibleFullGroups));
        
        chartState.visibleFullGroups = visibleFullGroups;
        
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

    console.log(`✅ Chart ${id} created successfully`);
    return chartState;
}

function buildTestUrl(config, commitSha) {
    const baseUrl = window.location.origin + window.location.pathname;
    const dashboardPath = '/fio/librawstor/dashboard/';
    
    if (baseUrl.includes(dashboardPath)) {
        return baseUrl.replace(dashboardPath, `/fio/librawstor/${config}/${commitSha}.html`);
    }
    
    return `https://izmdi.github.io/rawstor_bench/fio/librawstor/${config}/${commitSha}.html`;
}