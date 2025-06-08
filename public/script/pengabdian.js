document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua data yang sudah disiapkan di EJS
    const pusatData = window.pusatData || {};
    const pnbpData = window.pnbpData || {};

    // Objek untuk menyimpan instance chart yang sudah dirender
    const chartInstances = {};

    // Konfigurasi chart untuk Pusat
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
                                label: context => context.parsed.y + ' pengabdian'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Pengabdian Pusat per Tahun',
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
        },{
            id: 'pusatDanaPerTahun',
            init: () => new Chart(document.getElementById('pusatDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pusatData.jumlahDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Dana per Tahun',
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
                                label: context => 'Rp. ' + context.parsed.y.toLocaleString()
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah Dana Pengabdian Pusat per Tahun',
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 20, callback(value) { return 'Rp. ' + value.toLocaleString(); } },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        },{
            id: 'pusatAvgDanaPerTahun',
            init: () => new Chart(document.getElementById('pusatAvgDanaPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: pusatData.avgDanaPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Rata-rata Dana per Tahun',
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
                                label: context => 'Rp. ' + context.parsed.y.toLocaleString()
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rata-rata Dana Pengabdian Pusat per Tahun',
                            font: { size: 20, weight: 'lighter' },
                            color: '#232F58',
                        },
                        legend: { display: false }
                    },
                    layout: { padding: 20 },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 20, callback(value) { return 'Rp. ' + value.toLocaleString(); } },
                            grid: { display: false }
                        },
                        x: { grid: { display: false } }
                    }
                }
            })
        },
        // PNBP
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
    ];

    // =================================================================
    // SETUP INTERSECTION OBSERVER UNTUK LAZY RENDERING
    // =================================================================
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Jika elemen canvas terlihat di layar
            if (entry.isIntersecting) {
                const canvasId = entry.target.id;
                // Jika chart untuk canvas ini belum dirender
                if (!chartInstances[canvasId]) {
                    const chartConfig = chartConfigurations.find(c => c.id === canvasId);
                    if (chartConfig) {
                        // Inisialisasi chart dan simpan instance-nya
                        chartInstances[canvasId] = chartConfig.init();
                    }
                }
            } else {
                // Opsional: Jika ingin menghancurkan chart saat keluar layar untuk hemat memori
                const canvasId = entry.target.id;
                if (chartInstances[canvasId]) {
                    chartInstances[canvasId].destroy();
                    delete chartInstances[canvasId];
                }
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 // Mulai render saat 10% dari chart terlihat
    });

    // Mulai mengobservasi semua elemen canvas yang didefinisikan
    chartConfigurations.forEach(config => {
        const element = document.getElementById(config.id);
        if (element) {
            observer.observe(element);
        }
    });
});