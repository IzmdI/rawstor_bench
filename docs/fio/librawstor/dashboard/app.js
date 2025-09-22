async function initApp() {
    console.log('Initializing dashboard...');
    const dataLoader = new DataLoader();

    try {
        // Загружаем готовые данные
        const precomputedData = await dataLoader.loadData();

        // Показываем информацию о данных
        displayDataInfo(precomputedData.summary, precomputedData.generated_at);

        // Создаем графики из готовых данных
        createChartsFromPrecomputedData(precomputedData.charts);

        // Инициализируем легенду
        initializeLegend(precomputedData.charts);

    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        displayError(error);
        console.log('Current URL:', window.location.href);
        console.log('Trying to load from:', window.location.href + 'data.json');
    }
}

function createChartsFromPrecomputedData(chartsData) {
    // Создаем контейнер для графиков
    const container = d3.select('#charts-container');

    // IOPS Read
    createChart({
        container: container,
        title: 'IOPS Read',
        yLabel: 'IOPS',
        data: chartsData.iops_read,
        accessor: d => d.value,
        id: 'chart-iops-read'
    });

    // IOPS Write
    createChart({
        container: container,
        title: 'IOPS Write',
        yLabel: 'IOPS',
        data: chartsData.iops_write,
        accessor: d => d.value,
        id: 'chart-iops-write'
    });

    // Latency Read
    createChart({
        container: container,
        title: 'Latency Read',
        yLabel: 'ms',
        data: chartsData.latency_read,
        accessor: d => d.value,
        id: 'chart-latency-read'
    });

    // Latency Write
    createChart({
        container: container,
        title: 'Latency Write',
        yLabel: 'ms',
        data: chartsData.latency_write,
        accessor: d => d.value,
        id: 'chart-latency-write'
    });
}

function displayDataInfo(summary, generatedTime) {
    if (!summary) return;

    const infoHtml = `
        <div class="data-info">
            <h3>Dashboard Information</h3>
            <p><strong>Total configurations:</strong> ${summary.total_configurations || 0}</p>
            <p><strong>Total tests:</strong> ${summary.total_tests || 0}</p>
            <p><strong>Time range:</strong> ${summary.time_range?.start ? new Date(summary.time_range.start).toLocaleDateString() : 'N/A'} - ${summary.time_range?.end ? new Date(summary.time_range.end).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Data generated:</strong> ${generatedTime ? new Date(generatedTime).toLocaleString() : 'N/A'}</p>
            ${summary.configurations ? `<p><strong>Configurations:</strong> ${summary.configurations.join(', ')}</p>` : ''}
        </div>
    `;

    // Добавляем информационный блок в начало страницы
    d3.select('body').insert('div', ':first-child')
        .html(infoHtml)
        .attr('class', 'data-info-container');
}

function initializeLegend(chartsData) {
    if (!chartsData) return;

    // Получаем все уникальные конфигурации
    const configs = new Set();
    Object.values(chartsData).forEach(chartData => {
        chartData.forEach(point => {
            if (point.config) {
                configs.add(point.config);
            }
        });
    });

    // Создаем легенду
    const legendContainer = d3.select('#legend-container');
    const legend = legendContainer.selectAll('.legend-item')
        .data(Array.from(configs))
        .enter()
        .append('div')
        .attr('class', 'legend-item')
        .style('cursor', 'pointer')
        .on('click', function(event, configName) {
            toggleConfigVisibility(configName);
        });

    legend.append('span')
        .attr('class', 'legend-color')
        .style('background-color', (d, i) => getColor(i));

    legend.append('span')
        .attr('class', 'legend-label')
        .text(d => d);
}

function toggleConfigVisibility(configName) {
    // Реализация переключения видимости конфигураций
    d3.selectAll(`.line-${configName.replace(/\s+/g, '-')}`)
        .style('opacity', current => current === 1 ? 0.3 : 1);
}

function displayError(error) {
    const errorHtml = `
        <div class="error-container">
            <h3>Error Loading Dashboard</h3>
            <p>${error.message || 'Unknown error occurred'}</p>
            <p>Please check if data.json exists and has valid format.</p>
        </div>
    `;

    d3.select('body').html(errorHtml);
}

// Запускаем приложение при загрузке страницы
document.addEventListener('DOMContentLoaded', initApp);