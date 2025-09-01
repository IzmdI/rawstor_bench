class DataUtils {
    static formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        return new Intl.NumberFormat('ru-RU').format(num);
    }

    static formatDate(date) {
        if (!(date instanceof Date)) return 'Нет даты';
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static getMetricDisplayName(metric) {
        const names = {
            'read_iops': 'Read IOPS',
            'write_iops': 'Write IOPS',
            'read_latency': 'Read Latency',
            'write_latency': 'Write Latency'
        };
        return names[metric] || metric;
    }

    static getConfigDisplayName(config) {
        if (typeof config !== 'string') return 'Unknown';
        
        return config
            .replace('perftest--', '')
            .replace('without-liburing', 'no liburing')
            .replace('disable-ost', 'no OST')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    static getShortCommit(commit) {
        if (typeof commit !== 'string') return 'unknown';
        return commit.substring(0, 8);
    }

    static getBranchDisplayName(branch) {
        if (typeof branch !== 'string') return 'main';
        return branch.replace('refs/heads/', '').replace('heads/', '');
    }
}

// Глобальная доступность для отладки
window.DataUtils = DataUtils;