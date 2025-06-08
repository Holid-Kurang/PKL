document.addEventListener('DOMContentLoaded', () => {
    const pusatData = window.pusatData || {};
    const pnbpData = window.pnbpData || {};
    const mandiriData = window.mandiriData || {};
    // Tambahkan pnbpData, mandiriData jika ingin sekaligus

    const chartInstances = {};

    const chartConfigurations = [
        // Pusat
        {
            id: 'pusatPerTahun',
            init: () => new Chart(document.getElementById('pusatPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pusatData.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Publikasi per Tahun',
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y + ' penelitian'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Penelitian Pusat per Tahun',
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
        }, {
            id: 'pusatPerProdi',
            init: () => new Chart(document.getElementById('pusatPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pusatData.jumlahPerProdi.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Publikasi per Program Studi',
                        data: pusatData.jumlahPerProdi.map(item => item.total),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed + ' publikasi'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Penelitian Pusat per Program Studi',
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
        }, {
            id: 'pusatDanaPerTahun',
            init: () => new Chart(document.getElementById('pusatDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pusatData.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian Pusat per Tahun',
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Dana Penelitian Pusat per Tahun',
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
                                callback(value) { return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }); }
                            },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        }, {
            id: 'pusatDanaPerProdi',
            init: () => new Chart(document.getElementById('pusatDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pusatData.jumlahDanaPerProdi.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian Pusat per Program Studi',
                        data: pusatData.jumlahDanaPerProdi.map(item => item.total),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Dana Penelitian Pusat per Program Studi',
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
        }, {
            id: 'pusatAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('pusatAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pusatData.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana Penelitian Pusat per Tahun',
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Dana Penelitian Pusat per Tahun',
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
                                callback(value) { return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }); }
                            },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        }, {
            id: 'pusatAvgDanaPerProdi',
            init: () => new Chart(document.getElementById('pusatAvgDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pusatData.avgDanaPerProdi.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana Penelitian Pusat per Program Studi',
                        data: pusatData.avgDanaPerProdi.map(item => item.avg),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Dana Penelitian Pusat per Program Studi',
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
        }, {
            id: 'pusatAvgNilaiPerTahun',
            init: () => new Chart(document.getElementById('pusatAvgNilaiPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pusatData.avgNilaiPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Nilai Pusat per Tahun',
                        data: pusatData.avgNilaiPerTahun.map(item => item.avg),
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y.toFixed(2)
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Nilai Pusat per Tahun',
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 0.5 },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        }, {
            id: 'pusatAvgNilaiPerProdi',
            init: () => new Chart(document.getElementById('pusatAvgNilaiPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pusatData.avgNilaiPerProdi.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Nilai Pusat per Program Studi',
                        data: pusatData.avgNilaiPerProdi.map(item => item.avg),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed.toFixed(2)
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Nilai Pusat per Program Studi',
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
        // PNBP
        {
            id: 'pnbpPerTahun',
            init: () => new Chart(document.getElementById('pnbpPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pnbpData.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Penelitian PNBP per Tahun',
                        data: pnbpData.jumlahPerTahun.map(item => item.total),
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y + ' penelitian'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Penelitian PNBP per Tahun',
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
        }, {
            id: 'pnbpPerProdi',
            init: () => new Chart(document.getElementById('pnbpPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pnbpData.jumlahPerProdi.slice(1).map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Penelitian PNBP per Program Studi',
                        data: pnbpData.jumlahPerProdi.slice(1).map(item => item.total),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed + ' publikasi'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Penelitian PNBP per Program Studi',
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
        }, {
            id: 'pnbpDanaPerTahun',
            init: () => new Chart(document.getElementById('pnbpDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pnbpData.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian PNBP per Tahun',
                        data: pnbpData.jumlahDanaPerTahun.map(item => item.total),
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Dana Penelitian PNBP per Tahun',
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
                            },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        }, {
            id: 'pnbpDanaPerProdi',
            init: () => new Chart(document.getElementById('pnbpDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pnbpData.jumlahDanaPerProdi.slice(1).map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian PNBP per Program Studi',
                        data: pnbpData.jumlahDanaPerProdi.slice(1).map(item => item.total),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Dana Penelitian PNBP per Program Studi',
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
        }, {
            id: 'pnbpAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('pnbpAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pnbpData.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana Penelitian PNBP per Tahun',
                        data: pnbpData.avgDanaPerTahun.map(item => item.avg),
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Dana Penelitian PNBP per Tahun',
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
                            },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        }, {
            id: 'pnbpAvgDanaPerProdi',
            init: () => new Chart(document.getElementById('pnbpAvgDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pnbpData.avgDanaPerProdi.slice(1).map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana Penelitian PNBP per Program Studi',
                        data: pnbpData.avgDanaPerProdi.slice(1).map(item => item.avg),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Dana Penelitian PNBP per Program Studi',
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
        }, {
            id: 'pnbpAvgNilaiPerTahun',
            init: () => new Chart(document.getElementById('pnbpAvgNilaiPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pnbpData.avgNilaiPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Nilai Penelitian PNBP per Tahun',
                        data: pnbpData.avgNilaiPerTahun.map(item => item.avg),
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => Number(context.parsed.y).toFixed(2)
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Nilai Penelitian PNBP per Tahun',
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
                                callback: value => Number(value).toFixed(2)
                            },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        }, {
            id: 'pnbpAvgNilaiPerProdi',
            init: () => new Chart(document.getElementById('pnbpAvgNilaiPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: pnbpData.avgNilaiPerProdi.slice(1).map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Nilai Penelitian PNBP per Program Studi',
                        data: pnbpData.avgNilaiPerProdi.slice(1).map(item => item.avg),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => Number(context.parsed).toFixed(2)
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Nilai Penelitian PNBP per Program Studi',
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
        // Mandiri
        {
            id: 'mandiriPerTahun',
            init: () => new Chart(document.getElementById('mandiriPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: mandiriData.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Penelitian Mandiri per Tahun',
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y + ' penelitian'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Penelitian Mandiri per Tahun',
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
        }, {
            id: 'mandiriPerProdi',
            init: () => new Chart(document.getElementById('mandiriPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: mandiriData.jumlahPerProdi.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Penelitian Mandiri per Program Studi',
                        data: mandiriData.jumlahPerProdi.map(item => item.total),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed + ' publikasi'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Penelitian Mandiri per Program Studi',
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
        }, {
            id: 'mandiriDanaPerTahun',
            init: () => new Chart(document.getElementById('mandiriDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: mandiriData.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian Mandiri per Tahun',
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Dana Penelitian Mandiri per Tahun',
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks:{
                                stepSize: 1,
                            },
                            grid:{ display:false }
                        },
                        x:{ grid:{ display:false } }
                    }
                }
            })
        }, {
            id: 'mandiriDanaPerProdi',
            init: () => new Chart(document.getElementById('mandiriDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: mandiriData.jumlahDanaPerProdi.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian Mandiri per Program Studi',
                        data: mandiriData.jumlahDanaPerProdi.map(item => item.total),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Dana Penelitian Mandiri per Program Studi',
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
        },{
            id: 'mandiriAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('mandiriAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: mandiriData.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana Penelitian Mandiri per Tahun',
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
                                title: tooltipItems => 'Tahun ' + tooltipItems[0].label,
                                label: context => context.parsed.y.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Dana Penelitian Mandiri per Tahun',
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales:{
                        y:{
                            beginAtZero:true,
                            ticks:{
                                stepSize : 1,
                            },
                            grid:{ display:false }
                        },
                        x:{ grid:{ display:false } }
                    }
                }
            })
        }, {
            id: 'mandiriAvgDanaPerProdi',
            init: () => new Chart(document.getElementById('mandiriAvgDanaPerProdi').getContext('2d'), {
                type: 'doughnut',
                data:{
                    labels : mandiriData.avgDanaPerProdi.map(item => item._id),
                    datasets:[{
                        label: 'Rata-rata Dana Penelitian Mandiri per Program Studi',
                        data: mandiriData.avgDanaPerProdi.map(item => item.avg),
                        backgroundColor: [
                            '#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'
                        ],
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
                                label: context => context.parsed.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Dana Penelitian Mandiri per Program Studi',
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

    // Intersection Observer untuk lazy rendering
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const canvasId = entry.target.id;
            if (entry.isIntersecting) {
                if (!chartInstances[canvasId]) {
                    const chartConfig = chartConfigurations.find(c => c.id === canvasId);
                    if (chartConfig) {
                        chartInstances[canvasId] = chartConfig.init();
                    }
                }
            } else {
                if (chartInstances[canvasId]) {
                    chartInstances[canvasId].destroy();
                    delete chartInstances[canvasId];
                }
            }
        });
    }, { rootMargin: '0px', threshold: 0.1 });

    chartConfigurations.forEach(config => {
        const element = document.getElementById(config.id);
        if (element) observer.observe(element);
    });
});


const mandiriPerTahun = document.getElementById("mandiriPerTahun").getContext('2d');
const mandiriPerProdi = document.getElementById("mandiriPerProdi").getContext('2d');
const mandiriDanaPerTahun = document.getElementById("mandiriDanaPerTahun").getContext('2d');
const mandiriDanaPerProdi = document.getElementById("mandiriDanaPerProdi").getContext('2d');
const mandiriAvgDanaPerTahun = document.getElementById("mandiriAvgDanaPerTahun").getContext('2d');
const mandiriAvgDanaPerProdi = document.getElementById("mandiriAvgDanaPerProdi").getContext('2d');
