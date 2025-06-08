const publikasiCounts = window.publikasiCounts;
const penelitianCounts = window.penelitianCounts;
const pengabdianCounts = window.pengabdianCounts;


const centerTextPlugin = {
    id: 'centerText',
    afterDraw: function (chart) {
        // Plugin ini akan dieksekusi setelah chart selesai digambar
        if (chart.config.type !== 'doughnut') {
            return; // Hanya jalankan untuk doughnut chart
        }

        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        // Hitung total dari semua data
        const total = chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0);

        // Pengaturan Font untuk teks "Total"
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#6B7280'; // Warna abu-abu
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Gambar teks "Total" sedikit di atas tengah
        ctx.fillText('Total', centerX, centerY - 15);

        // Pengaturan Font untuk Angka Total
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#111827'; // Warna hitam keabu-abuan
        // Gambar angka total sedikit di bawah tengah
        ctx.fillText(total, centerX, centerY + 15);
    }
};
const chartConfigs = [
    {
        id: 'penelitianChart',
        config: {
            type: 'doughnut',
            data: {
                labels: ['PNBP', 'Pusat', 'Mandiri'],
                datasets: [{
                    data: [
                        penelitianCounts["PNBP"],
                        penelitianCounts["Pusat"],
                        penelitianCounts["Mandiri"]
                    ],
                    hoverOffset: 50,
                    backgroundColor: [
                        '#9342DA',
                        '#FF1B1C',
                        '#FFD700'
                    ],
                    borderColor: [
                        '#232F58',
                        '#232F58',
                        '#232F58'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, // <-- UBAH INI
                // <-- TAMBAHKAN INI
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
                        text: 'Penelitian',
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
            plugins: [centerTextPlugin] // <-- TAMBAHKAN PLUGIN DI SINI
        }
    },
    {
        id: 'pengabdianChart',
        config: {
            type: 'doughnut',
            data: {
                labels: ['PNBP', 'Pusat'],
                datasets: [{
                    data: [
                        pengabdianCounts["PNBP"],
                        pengabdianCounts["Pusat"]
                    ],
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
                responsive: true, // <-- UBAH INI
                maintainAspectRatio: false, // <-- TAMBAHKAN INI
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
                        text: 'Pengabdian',
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
            plugins: [centerTextPlugin] // <-- TAMBAHKAN PLUGIN DI SINI
        }
    },
    {
        id: 'publikasiChart',
        config: {
            type: 'doughnut',
            data: {
                labels: ['HAKI', 'Buku', 'Jurnal Pengabdian'],
                datasets: [{
                    data: [
                        publikasiCounts["HAKI"],
                        publikasiCounts["Buku"],
                        publikasiCounts["Jurnal Pengabdian"]
                    ],
                    hoverOffset: 50,
                    backgroundColor: [
                        '#9342DA',
                        '#FF1B1C',
                        '#FFD700'
                    ],
                    borderColor: [
                        '#232F58',
                        '#232F58',
                        '#232F58'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, // <-- UBAH INI
                maintainAspectRatio: false, // <-- TAMBAHKAN INI
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
                        text: 'Publikasi',
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
            plugins: [centerTextPlugin] // <-- TAMBAHKAN PLUGIN DI SINI
        }
    }
];

const renderedCharts = {};
// 
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Render Chart jika desktop dan belum dirender
            const chartConfig = chartConfigs.find(c => c.id === entry.target.querySelector('canvas')?.id);
            if (chartConfig && !renderedCharts[chartConfig.id]) {
                const ctx = entry.target.querySelector('canvas').getContext('2d');
                renderedCharts[chartConfig.id] = new Chart(ctx, chartConfig.config);
            }
        } else {
            entry.target.classList.remove('active');
            // Destroy chart jika ada dan sudah dirender
            const chartConfig = chartConfigs.find(c => c.id === entry.target.querySelector('canvas')?.id);
            if (chartConfig && renderedCharts[chartConfig.id]) {
                renderedCharts[chartConfig.id].destroy();
                delete renderedCharts[chartConfig.id];
            }
        }
    });
});

document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));