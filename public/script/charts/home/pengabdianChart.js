// Konfigurasi chart untuk Pengabdian di halaman home
import { centerTextPlugin } from './centerTextPlugin.js';

export function getPengabdianChartConfig(translations) {
    return {
        id: 'pengabdianChart',
        type: 'pengabdian',
        config: {
            type: 'doughnut',
            data: {
                labels: [translations.categories.pnbp, translations.categories.pusat],
                datasets: [{
                    data: [],  // Will be filled dynamically
                    hoverOffset: 50,
                    backgroundColor: [
                        '#9342DA',
                        '#FF1B1C'
                    ],
                    borderColor: [
                        '#232F58',
                        '#232F58'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#232F58',
                        }
                    },
                    title: {
                        display: true,
                        text: translations.home.charts.pengabdian,
                        font: {
                            size: 30,
                            weight: 'lighter'
                        },
                        color: '#232F58',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const data = context.dataset.data;
                                const total = data.reduce((sum, val) => sum + val, 0);
                                const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                layout: {
                    padding: 10
                },
            },
            plugins: [centerTextPlugin]
        }
    };
}
