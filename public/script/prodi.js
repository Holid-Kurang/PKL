document.addEventListener('DOMContentLoaded', () => {
    const penelitian = window.penelitian || {};
    const pengabdian = window.pengabdian || {};
    const publikasi = window.publikasi || {};
    // Tambahkan pnbpData, mandiriData jika ingin sekaligus

    const chartInstances = {};

    const chartConfigurations = [
        // Penelitian Pusat
        {
            id: 'pusatPerTahun',
            init: () => new Chart(document.getElementById('pusatPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.pusat.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Publikasi per Tahun',
                        data: penelitian.pusat.jumlahPerTahun.map(item => item.total),
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
            id: 'pusatDanaPerTahun',
            init: () => new Chart(document.getElementById('pusatDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.pusat.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian Pusat per Tahun',
                        data: penelitian.pusat.jumlahDanaPerTahun.map(item => item.total),
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
            id: 'pusatAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('pusatAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.pusat.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana Penelitian Pusat per Tahun',
                        data: penelitian.pusat.avgDanaPerTahun.map(item => item.avg),
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
        }, 
        // Penelitian PNBP
        {
            id: 'pnbpPerTahun',
            init: () => new Chart(document.getElementById('pnbpPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.pnbp.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Penelitian PNBP per Tahun',
                        data: penelitian.pnbp.jumlahPerTahun.map(item => item.total),
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
            id: 'pnbpDanaPerTahun',
            init: () => new Chart(document.getElementById('pnbpDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.pnbp.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian PNBP per Tahun',
                        data: penelitian.pnbp.jumlahDanaPerTahun.map(item => item.total),
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
                                callback(value) { return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }); }
                            },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        }, {
            id: 'pnbpAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('pnbpAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.pnbp.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana Penelitian PNBP per Tahun',
                        data: penelitian.pnbp.avgDanaPerTahun.map(item => item.avg),
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
                                callback(value) { return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }); }
                            },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        }, {
            id: 'pnbpAvgNilaiPerTahun',
            init: () => new Chart(document.getElementById('pnbpAvgNilaiPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.pnbp.avgNilaiPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Nilai Penelitian PNBP per Tahun',
                        data: penelitian.pnbp.avgNilaiPerTahun.map(item => item.avg),
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
        },
        // Penelitian Mandiri
        {
            id: 'mandiriPerTahun',
            init: () => new Chart(document.getElementById('mandiriPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.mandiri.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Penelitian Mandiri per Tahun',
                        data: penelitian.mandiri.jumlahPerTahun.map(item => item.total),
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
            id: 'mandiriDanaPerTahun',
            init: () => new Chart(document.getElementById('mandiriDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.mandiri.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian Mandiri per Tahun',
                        data: penelitian.mandiri.jumlahDanaPerTahun.map(item => item.total),
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
            id: 'mandiriAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('mandiriAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: penelitian.mandiri.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana Penelitian Mandiri per Tahun',
                        data: penelitian.mandiri.avgDanaPerTahun.map(item => item.avg),
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
        },
        // Pengabdian PNBP
        {
            id: 'pengabdianPNBPPerTahun',
            init: () => new Chart(document.getElementById('pengabdianPNBPPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pengabdian.pnbp.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Penelitian PNBP per Tahun',
                        data: pengabdian.pnbp.jumlahPerTahun.map(item => item.total),
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
            id: 'pengabdianPNBPDanaPerTahun',
            init: () => new Chart(document.getElementById('pengabdianPNBPDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pengabdian.pnbp.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana Penelitian PNBP per Tahun',
                        data: pengabdian.pnbp.jumlahDanaPerTahun.map(item => item.total),
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
            id: 'pengabdianPNBPAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('pengabdianPNBPAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pengabdian.pnbp.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana Penelitian PNBP per Tahun',
                        data: pengabdian.pnbp.avgDanaPerTahun.map(item => item.avg),
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
            id: 'pengabdianPNBPAvgNilaiPerTahun',
            init: () => new Chart(document.getElementById('pengabdianPNBPAvgNilaiPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pengabdian.pnbp.avgNilaiPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Nilai Penelitian PNBP per Tahun',
                        data: pengabdian.pnbp.avgNilaiPerTahun.map(item => item.avg),
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
        },
        // Publikasi Buku
        {
            id: 'bukuPerTahun',
            init: () => new Chart(document.getElementById('bukuPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: publikasi.buku.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Buku per Tahun', data: publikasi.buku.jumlahPerTahun.map(item => item.jumlahBuku),
                        backgroundColor: '#9342DA', borderColor: '#232F58', borderWidth: 1,
                        hoverBackgroundColor: '#ff1b1c', hoverBorderColor: '#232F58', hoverBorderWidth: 2, borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                    plugins: {
                        tooltip: { backgroundColor: '#232F58', titleFont: { size: 16 }, bodyFont: { size: 14 }, footerFont: { weight: 'normal' }, callbacks: { title: (tooltipItems) => 'Tahun ' + tooltipItems[0].label, label: (context) => context.parsed.y + ' Buku' } },
                        title: { display: true, text: 'Jumlah Buku per Tahun', font: { size: 20, weight: 'lighter' }, color: '#232F58' }, legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 15 }, grid: { display: false } }, x: { grid: { display: false } } }
                }
            })
        },
        // Publikasi HAKI
        {
            id: 'hakiPerJenis',
            init: () => new Chart(document.getElementById('hakiPerJenis').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: publikasi.haki.jumlahPerJenis.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah HAKI per Jenis', data: publikasi.haki.jumlahPerJenis.map(item => item.jumlahHKI),
                        backgroundColor: ['#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'],
                        borderColor: '#232F58', borderWidth: 1, hoverOffset: 50
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        tooltip: { backgroundColor: '#232F58', titleFont: { size: 16 }, bodyFont: { size: 14 }, footerFont: { weight: 'normal' }, callbacks: { title: (tooltipItems) => tooltipItems[0].label, label: (context) => context.parsed + ' HAKI' } },
                        title: { display: true, text: 'Jumlah HAKI per Jenis', font: { size: 20, weight: 'lighter' }, color: '#232F58' },
                        legend: { display: true, position: 'left', labels: { font: { size: 12 } } }
                    },
                    layout: { padding: 20 }
                }
            })
        },{
            id: 'hakiPerTahun',
            init: () => new Chart(document.getElementById('hakiPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: publikasi.haki.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah HAKI per Tahun', data: publikasi.haki.jumlahPerTahun.map(item => item.jumlahHKI),
                        backgroundColor: '#9342DA', borderColor: '#232F58', borderWidth: 1,
                        hoverBackgroundColor: '#ff1b1c', hoverBorderColor: '#232F58', hoverBorderWidth: 2, borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                    plugins: {
                        tooltip: { backgroundColor: '#232F58', titleFont: { size: 16 }, bodyFont: { size: 14 }, footerFont: { weight: 'normal' }, callbacks: { title: (tooltipItems) => 'Tahun ' + tooltipItems[0].label, label: (context) => context.parsed.y + ' HAKI' } },
                        title: { display: true, text: 'Tren HAKI per Tahun', font: { size: 20, weight: 'lighter' }, color: '#232F58' }, legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 25 }, grid: { display: false } }, x: { grid: { display: false } } }
                }
            })
        },
        // Publikasi Jupeng
        {
            id: 'jupengPerTahun',
            init: () => new Chart(document.getElementById('jupengPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: publikasi.jupeng.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Publikasi per Tahun', data: publikasi.jupeng.jumlahPerTahun.map(item => item.totalPublikasi),
                        backgroundColor: '#9342DA', borderColor: '#232F58', borderWidth: 1,
                        hoverBackgroundColor: '#ff1b1c', hoverBorderColor: '#232F58', hoverBorderWidth: 2, borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                    plugins: {
                        tooltip: { backgroundColor: '#232F58', titleFont: { size: 16 }, bodyFont: { size: 14 }, footerFont: { weight: 'normal' }, callbacks: { title: (tooltipItems) => 'Tahun ' + tooltipItems[0].label, label: (context) => context.parsed.y + ' publikasi' } },
                        title: { display: true, text: 'Jumlah Jurnal Pengabdian per Tahun', font: { size: 20, weight: 'lighter' }, color: '#232F58' }, legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 25 }, grid: { display: false } }, x: { grid: { display: false } } }
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