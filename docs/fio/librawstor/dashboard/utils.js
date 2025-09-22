// Цветовая палитра для групп
const colorPalette = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
    '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
    '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
];

function getColor(index) {
    return colorPalette[index % colorPalette.length];
}

function formatDate(date) {
    if (!date) return 'Unknown date';
    if (typeof date === 'string' && date === "Unknown date") return date;
    
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

function formatNumber(value) {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    } else if (value >= 1) {
        return value.toFixed(1);
    } else {
        return value.toFixed(3);
    }
}

function formatMetricValue(value, metricType) {
    const formatted = formatNumber(value);
    return metricType.includes('iops') ? `${formatted} IOPS` : `${formatted} ms`;
}

function showTooltip(event, data, chartTitle, accessor, groupBy) {
    const tooltip = d3.select('#tooltip');
    const value = accessor(data);
    
    const tooltipHtml = `
        <strong>${data.group}</strong><br/>
        <strong>${chartTitle}:</strong> ${formatMetricValue(value, chartTitle.toLowerCase())}<br/>
        <strong>Date:</strong> ${formatDate(data.timestamp)}<br/>
        ${groupBy === 'config' && data.branch ? `<strong>Branch:</strong> ${data.branch}<br/>` : ''}
        ${groupBy === 'branch' && data.config ? `<strong>Config:</strong> ${data.config}<br/>` : ''}
        ${data.commit_sha ? `<strong>Commit:</strong> ${data.commit_sha.substring(0, 8)}<br/>` : ''}
        <em>Click to view test details</em>
    `;
    
    tooltip
        .style('opacity', 1)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px')
        .html(tooltipHtml);
}

function hideTooltip() {
    d3.select('#tooltip')
        .style('opacity', 0);
}

// Добавляем CSS для отсутствующих данных
const style = document.createElement('style');
style.textContent = `
    .no-data {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 40px;
    }
    .error {
        background-color: #ffeeee;
        border: 1px solid #ffcccc;
        border-radius: 5px;
        padding: 20px;
        margin: 20px;
        text-align: center;
    }
`;
document.head.appendChild(style);