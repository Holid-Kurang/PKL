// Chart configurations for Penelitian Mandiri
export function getMandiriChartConfigs(mandiriData, translations) {
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
            id: 'mandiriPerTahun',
            init: () => new Chart(document.getElementById('mandiriPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: mandiriData.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.mandiri.mandiriPerTahun,
                        data: mandiriData.jumlahPerTahun.map(item => item.total),
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
                            text: translations.penelitianPage.charts.mandiri.mandiriPerTahun,
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
            id: 'mandiriPerProdi',
            init: () => new Chart(document.getElementById('mandiriPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: mandiriData.jumlahPerProdi.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.mandiri.mandiriPerProdi,
                        data: mandiriData.jumlahPerProdi.map(item => item.total),
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
                            text: translations.penelitianPage.charts.mandiri.mandiriPerProdi,
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
            id: 'mandiriDanaPerTahun',
            init: () => new Chart(document.getElementById('mandiriDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: mandiriData.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.mandiri.mandiriDanaPerTahun,
                        data: mandiriData.jumlahDanaPerTahun.map(item => item.total),
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
                            text: translations.penelitianPage.charts.mandiri.mandiriDanaPerTahun,
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
            id: 'mandiriDanaPerProdi',
            init: () => new Chart(document.getElementById('mandiriDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: mandiriData.jumlahDanaPerProdi.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.mandiri.mandiriDanaPerProdi,
                        data: mandiriData.jumlahDanaPerProdi.map(item => item.total),
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
                            text: translations.penelitianPage.charts.mandiri.mandiriDanaPerProdi,
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
            id: 'mandiriAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('mandiriAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: mandiriData.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.mandiri.mandiriAvgDanaPerTahun,
                        data: mandiriData.avgDanaPerTahun.map(item => item.avg),
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
                            text: translations.penelitianPage.charts.mandiri.mandiriAvgDanaPerTahun,
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
            id: 'mandiriAvgDanaPerProdi',
            init: () => new Chart(document.getElementById('mandiriAvgDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: mandiriData.avgDanaPerProdi.map(item => item._id),
                    datasets: [{
                        label: translations.penelitianPage.charts.mandiri.mandiriAvgDanaPerProdi,
                        data: mandiriData.avgDanaPerProdi.map(item => item.avg),
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
                            text: translations.penelitianPage.charts.mandiri.mandiriAvgDanaPerProdi,
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
