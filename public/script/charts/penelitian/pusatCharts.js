// Chart configurations for Penelitian Pusat
export function getPusatChartConfigs(pusatData, translations) {
    const commonColors = ['#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'];

    const currencyFormatter = (value) => {
        return value.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        });
    };

    return [
        {
            id: 'pusatPerTahun',
            init: () => new Chart(document.getElementById('pusatPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pusatData.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.pusat.pusatPerTahun,
                        data: pusatData.jumlahPerTahun.map(item => item.total),
                        backgroundColor: '#9342DA',
                        borderColor: '#232F58',
                        borderWidth: 1,
                        hoverBackgroundColor: '#ff1b1c',
                        hoverBorderColor: '#232F58',
                        hoverBorderWidth: 2,
                        borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        tooltip: {
                            backgroundColor: '#232F58',
                            titleFont: { size: 16 },
                            bodyFont: { size: 14 },
                            footerFont: { weight: 'normal' },
                            callbacks: {
                                title: tooltipItems => translations.penelitianPage.tahun + " " + tooltipItems[0].label,
                                label: context => context.parsed.y + " " + translations.home.charts.penelitian
                            }
                        },
                        title: {
                            display: true,
                            text: translations.penelitianPage.charts.pusat.pusatPerTahun,
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        },
        {
            id: 'pusatPerProdi',
            init: () => new Chart(document.getElementById('pusatPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pusatData.jumlahPerProdi.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.pusat.pusatPerProdi,
                        data: pusatData.jumlahPerProdi.map(item => item.total),
                        backgroundColor: commonColors,
                        borderColor: '#232F58',
                        borderWidth: 1,
                        hoverOffset: 50
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            backgroundColor: '#232F58',
                            titleFont: { size: 16 },
                            bodyFont: { size: 14 },
                            footerFont: { weight: 'normal' },
                            callbacks: {
                                title: tooltipItems => tooltipItems[0].label,
                                label: context => context.parsed + " " + translations.home.charts.penelitian
                            }
                        },
                        title: {
                            display: true,
                            text: translations.penelitianPage.charts.pusat.pusatPerProdi,
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: {
                            display: true,
                            position: 'right',
                            labels: { color: '#232F58' }
                        }
                    },
                    layout: { padding: 20 }
                }
            })
        },
        {
            id: 'pusatDanaPerTahun',
            init: () => new Chart(document.getElementById('pusatDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pusatData.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.pusat.pusatDanaPerTahun,
                        data: pusatData.jumlahDanaPerTahun.map(item => item.total),
                        backgroundColor: '#9342DA',
                        borderColor: '#232F58',
                        borderWidth: 1,
                        hoverBackgroundColor: '#ff1b1c',
                        hoverBorderColor: '#232F58',
                        hoverBorderWidth: 2,
                        borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        tooltip: {
                            backgroundColor: '#232F58',
                            titleFont: { size: 16 },
                            bodyFont: { size: 14 },
                            footerFont: { weight: 'normal' },
                            callbacks: {
                                title: tooltipItems => translations.penelitianPage.tahun + " " + tooltipItems[0].label,
                                label: context => currencyFormatter(context.parsed.y)
                            }
                        },
                        title: {
                            display: true,
                            text: translations.penelitianPage.charts.pusat.pusatDanaPerTahun,
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                callback: value => currencyFormatter(value)
                            },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        },
        {
            id: 'pusatDanaPerProdi',
            init: () => new Chart(document.getElementById('pusatDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pusatData.jumlahDanaPerProdi.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.pusat.pusatDanaPerProdi,
                        data: pusatData.jumlahDanaPerProdi.map(item => item.total),
                        backgroundColor: commonColors,
                        borderColor: '#232F58',
                        borderWidth: 1,
                        hoverOffset: 50
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            backgroundColor: '#232F58',
                            titleFont: { size: 16 },
                            bodyFont: { size: 14 },
                            footerFont: { weight: 'normal' },
                            callbacks: {
                                title: tooltipItems => tooltipItems[0].label,
                                label: context => currencyFormatter(context.parsed)
                            }
                        },
                        title: {
                            display: true,
                            text: translations.penelitianPage.charts.pusat.pusatDanaPerProdi,
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: {
                            display: true,
                            position: 'right',
                            labels: { color: '#232F58' }
                        }
                    },
                    layout: { padding: 20 }
                }
            })
        },
        {
            id: 'pusatAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('pusatAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pusatData.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.pusat.pusatAvgDanaPerTahun,
                        data: pusatData.avgDanaPerTahun.map(item => item.avg),
                        backgroundColor: '#9342DA',
                        borderColor: '#232F58',
                        borderWidth: 1,
                        hoverBackgroundColor: '#ff1b1c',
                        hoverBorderColor: '#232F58',
                        hoverBorderWidth: 2,
                        borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        tooltip: {
                            backgroundColor: '#232F58',
                            titleFont: { size: 16 },
                            bodyFont: { size: 14 },
                            footerFont: { weight: 'normal' },
                            callbacks: {
                                title: tooltipItems => translations.penelitianPage.tahun + " " + tooltipItems[0].label,
                                label: context => currencyFormatter(context.parsed.y)
                            }
                        },
                        title: {
                            display: true,
                            text: translations.penelitianPage.charts.pusat.pusatAvgDanaPerTahun,
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                callback: value => currencyFormatter(value)
                            },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        },
        {
            id: 'pusatAvgDanaPerProdi',
            init: () => new Chart(document.getElementById('pusatAvgDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pusatData.avgDanaPerProdi.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.pusat.pusatAvgDanaPerProdi,
                        data: pusatData.avgDanaPerProdi.map(item => item.avg),
                        backgroundColor: commonColors,
                        borderColor: '#232F58',
                        borderWidth: 1,
                        hoverOffset: 50
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            backgroundColor: '#232F58',
                            titleFont: { size: 16 },
                            bodyFont: { size: 14 },
                            footerFont: { weight: 'normal' },
                            callbacks: {
                                title: tooltipItems => tooltipItems[0].label,
                                label: context => currencyFormatter(context.parsed)
                            }
                        },
                        title: {
                            display: true,
                            text: translations.penelitianPage.charts.pusat.pusatAvgDanaPerProdi,
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: {
                            display: true,
                            position: 'right',
                            labels: { color: '#232F58' }
                        }
                    },
                    layout: { padding: 20 }
                }
            })
        }
    ];
}
