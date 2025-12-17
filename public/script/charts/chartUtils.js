// Utility functions for creating chart configurations
export const commonColors = ['#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'];

export const currencyFormatter = (value) => {
    return value.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });
};

export const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 20 }
};

export const commonTooltipStyle = {
    backgroundColor: '#232F58',
    titleFont: { size: 16 },
    bodyFont: { size: 14 },
    footerFont: { weight: 'normal' }
};

export const commonTitleStyle = {
    display: true,
    font: { size: 20, weight: 'lighter' },
    color: '#232F58'
};

export const commonLegendStyle = {
    display: true,
    position: 'right',
    labels: { color: '#232F58' }
};

export const commonBarStyle = {
    backgroundColor: '#9342DA',
    borderColor: '#232F58',
    borderWidth: 1,
    hoverBackgroundColor: '#ff1b1c',
    hoverBorderColor: '#232F58',
    hoverBorderWidth: 2,
    borderRadius: 5
};

export const commonDoughnutStyle = {
    backgroundColor: commonColors,
    borderColor: '#232F58',
    borderWidth: 1,
    hoverOffset: 50
};

export const commonScaleOptions = {
    y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { display: false }
    },
    x: { grid: { display: false } }
};

// Helper function to create bar chart config
export function createBarChartConfig(id, data, translations, options = {}) {
    const {
        dataKey = 'total',
        labelCallback = (context) => context.parsed.y,
        titleCallback = (tooltipItems) => tooltipItems[0].label,
        yAxisCallback = null
    } = options;

    return {
        id,
        init: () => new Chart(document.getElementById(id).getContext('2d'), {
            type: 'bar',
            data: {
                labels: data.map(item => item._id),
                datasets: [{
                    label: translations,
                    data: data.map(item => item[dataKey]),
                    ...commonBarStyle
                }]
            },
            options: {
                ...commonChartOptions,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    tooltip: {
                        ...commonTooltipStyle,
                        callbacks: {
                            title: titleCallback,
                            label: labelCallback
                        }
                    },
                    title: {
                        ...commonTitleStyle,
                        text: translations
                    },
                    legend: { display: false }
                },
                scales: yAxisCallback ? {
                    y: {
                        ...commonScaleOptions.y,
                        ticks: {
                            ...commonScaleOptions.y.ticks,
                            callback: yAxisCallback
                        }
                    },
                    x: commonScaleOptions.x
                } : commonScaleOptions
            }
        })
    };
}

// Helper function to create doughnut chart config
export function createDoughnutChartConfig(id, data, translations, options = {}) {
    const {
        dataKey = 'total',
        labelCallback = (context) => context.parsed,
        legendPosition = 'right'
    } = options;

    return {
        id,
        init: () => new Chart(document.getElementById(id).getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: data.map(item => item._id),
                datasets: [{
                    label: translations,
                    data: data.map(item => item[dataKey]),
                    ...commonDoughnutStyle
                }]
            },
            options: {
                ...commonChartOptions,
                plugins: {
                    tooltip: {
                        ...commonTooltipStyle,
                        callbacks: {
                            title: tooltipItems => tooltipItems[0].label,
                            label: labelCallback
                        }
                    },
                    title: {
                        ...commonTitleStyle,
                        text: translations
                    },
                    legend: {
                        ...commonLegendStyle,
                        position: legendPosition
                    }
                }
            }
        })
    };
}
