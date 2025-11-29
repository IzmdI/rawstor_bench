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

function formatDate(date, timeRangeDays = 30) {
    if (!date) return 'Unknown date';
    if (typeof date === 'string' && date === "Unknown date") return date;

    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid date';

    // Разные форматы в зависимости от временного диапазона
    if (timeRangeDays < 15) {
        // Для коротких диапазонов: часы:минуты день.месяц
        return d.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }) + ' ' + d.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
        });
    } else {
        // Для длинных диапазонов: день.месяц год
        return d.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    }
}

function formatMetricValue(value, metricType) {
    if (metricType.toLowerCase().includes('iops')) {
        // Форматируем IOPS в kIOPS/MIOPS
        if (value >= 1000000) {
            return (value / 1000000).toFixed(2) + ' MIOPS';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + ' kIOPS';
        } else {
            return value.toFixed(0) + ' IOPS';
        }
    } else {
        // Для latency
        if (value >= 1000) {
            return (value / 1000).toFixed(2) + ' s';
        } else if (value >= 1) {
            return value.toFixed(2) + ' ms';
        } else {
            return value.toFixed(3) + ' ms';
        }
    }
}

function showTooltip(event, data, chartTitle, accessor, groupBy, timeRangeDays = 30) {
    const tooltip = d3.select('#tooltip');
    const value = accessor(data);

    const tooltipHtml = `
        <div class="tooltip-content">
            <div class="tooltip-header">
                <strong>${data.group}</strong>
            </div>
            <div class="tooltip-metric">
                <strong>${chartTitle}:</strong> ${formatMetricValue(value, chartTitle)}
            </div>
            <div class="tooltip-date">
                <strong>Date:</strong> ${formatDate(data.timestamp, timeRangeDays)}
            </div>
            ${groupBy === 'config' && data.branch ? `
            <div class="tooltip-branch">
                <strong>Branch:</strong> ${data.branch}
            </div>` : ''}
            ${groupBy === 'branch' && data.config ? `
            <div class="tooltip-config">
                <strong>Config:</strong> ${data.config}
            </div>` : ''}
            ${data.commit_sha ? `
            <div class="tooltip-commit">
                <strong>Commit:</strong> ${data.commit_sha.substring(0, 8)}
            </div>` : ''}
            <div class="tooltip-hint">
                <em>Click to view test details</em>
            </div>
        </div>
    `;

    tooltip
        .style('opacity', 1)
        .style('left', (event.pageX + 15) + 'px')
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