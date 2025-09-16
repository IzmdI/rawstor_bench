// Цветовая палитра для конфигураций
const colorPalette = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

function getColor(index) {
    return colorPalette[index % colorPalette.length];
}

function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function formatNumber(value) {
    if (value >= 1000) {
        return d3.format('.3s')(value);
    }
    return d3.format(',.0f')(value);
}

function showTooltip(event, data, chartTitle, accessor) {
    const tooltip = d3.select('#tooltip');
    
    const value = accessor(data);
    const valueText = chartTitle.includes('IOPS') ? 
        formatNumber(value) + ' IOPS' : 
        formatNumber(value) + ' ms';
    
    tooltip
        .style('opacity', 1)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px')
        .html(`
            <strong>${data.config}</strong><br/>
            ${chartTitle}: ${valueText}<br/>
            Date: ${formatDate(data.timestamp)}<br/>
            ${data.branch ? `Branch: ${data.branch}<br/>` : ''}
            ${data.commit_sha ? `Commit: ${data.commit_sha.substring(0, 8)}<br/>` : ''}
            <em>Click to view test details</em>
        `);
}

function hideTooltip() {
    d3.select('#tooltip')
        .style('opacity', 0);
}

// Экспортируем функции для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getColor, formatDate, formatNumber, showTooltip, hideTooltip };
}