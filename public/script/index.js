// Global variables to store data
let publikasiCounts = {};
let penelitianCounts = {};
let pengabdianCounts = {};
let dashboardData = null;
let translations = {};
translations = window.pageTranslations;

// Function to get translation
function getTranslation(key) {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
        value = value ? value[k] : undefined;
    }
    
    return value || key;
}

// Function to fetch dashboard data from API
async function fetchDashboardData() {
    try {
        const response = await fetch('/api/dashboard-data');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            // Store data globally
            dashboardData = result.data;
            publikasiCounts = result.data.publikasiCounts;
            penelitianCounts = result.data.penelitianCounts;
            pengabdianCounts = result.data.pengabdianCounts;

            // Update UI
            updateStatisticsText();
            updateProdiTable();
            initializeCharts();

            // Hide loading states and show content
            document.getElementById('loadingState').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
            document.getElementById('tableLoadingState').classList.add('hidden');
            document.getElementById('tableContent').classList.remove('hidden');

        } else {
            throw new Error(result.message || 'Failed to fetch data');
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showError('Gagal memuat data. Silakan refresh halaman.');
    }
}

// Function to update statistics text
function updateStatisticsText() {
    const { penelitianStats, pengabdianStats, publikasiStats } = dashboardData;

    // Update penelitian text
    document.getElementById('penelitianText').innerHTML = `
        ${getTranslation('dashboard.penelitianText.prefix')} <strong>${penelitianStats.total}</strong> ${getTranslation('dashboard.penelitianText.middle')} 
        <strong>${penelitianStats.topCategory}</strong> ${getTranslation('dashboard.penelitianText.suffix')} <strong>${penelitianStats.topPercentage.toFixed(1)}%</strong> ${getTranslation('dashboard.penelitianText.percent')}
        <a href="/penelitian" class="text-blue-600" style="text-decoration: none;" 
           onmouseover="this.style.textDecoration='underline'" 
           onmouseout="this.style.textDecoration='none'">${getTranslation('dashboard.seeDetail')}.</a>
    `;

    // Update pengabdian text
    document.getElementById('pengabdianText').innerHTML = `
        ${getTranslation('dashboard.pengabdianText.prefix')} <strong>${pengabdianStats.total}</strong> ${getTranslation('dashboard.pengabdianText.middle')} 
        <strong>${pengabdianStats.topCategory}</strong> 
        ${getTranslation('dashboard.pengabdianText.suffix')} <strong>${pengabdianStats.topPercentage.toFixed(1)}%</strong>.
        <a href="/pengabdian" class="text-blue-600" style="text-decoration: none;" 
           onmouseover="this.style.textDecoration='underline'" 
           onmouseout="this.style.textDecoration='none'">${getTranslation('dashboard.seeDetail')}.</a>
    `;

    // Update publikasi text
    document.getElementById('publikasiText').innerHTML = `
        ${getTranslation('dashboard.publikasiText.prefix')} <strong>${publikasiStats.total}</strong> ${getTranslation('dashboard.publikasiText.middle')} <strong>${publikasiStats.topCategory}</strong>, 
        ${getTranslation('dashboard.publikasiText.suffix')} <strong>${publikasiStats.topPercentage.toFixed(1)}%</strong> ${getTranslation('dashboard.publikasiText.percent')}
        <a href="/publikasi" class="text-blue-600" style="text-decoration: none;" 
           onmouseover="this.style.textDecoration='underline'" 
           onmouseout="this.style.textDecoration='none'">${getTranslation('dashboard.seeDetail')}.</a>
    `;
}

// Function to update prodi table
function updateProdiTable() {
    const { prodiData } = dashboardData;
    const tbody = document.getElementById('prodiTableBody');

    // Clear existing content
    tbody.innerHTML = '';

    if (prodiData && prodiData.length > 0) {
        // Add data rows
        prodiData.forEach(prodi => {
            const row = document.createElement('tr');
            row.classList.add('hover:bg-white');
            row.innerHTML = `
                <td class="px-4 py-3 font-medium border border-gray-300">${prodi.name}</td>
                <td class="px-3 py-2 text-center border border-gray-300">${prodi.penelitian?.pusat || 0}</td>
                <td class="px-3 py-2 text-center border border-gray-300">${prodi.penelitian?.pnbp || 0}</td>
                <td class="px-3 py-2 text-center border border-gray-300">${prodi.penelitian?.mandiri || 0}</td>
                <td class="px-3 py-2 text-center border border-gray-300">${prodi.pengabdian?.pnbp || 0}</td>
                <td class="px-3 py-2 text-center border border-gray-300">${prodi.pengabdian?.pusat || 0}</td>
                <td class="px-3 py-2 text-center border border-gray-300">${prodi.publikasi?.haki || 0}</td>
                <td class="px-3 py-2 text-center border border-gray-300">${prodi.publikasi?.buku || 0}</td>
                <td class="px-3 py-2 text-center border border-gray-300">${prodi.publikasi?.jupeng || 0}</td>
            `;
            tbody.appendChild(row);
        });

        // Add total row
        const totalRow = document.createElement('tr');
        totalRow.className = 'font-semibold bg-white';
        totalRow.innerHTML = `
            <td class="px-4 py-3 border border-gray-300">${getTranslation('dashboard.table.total')}</td>
            <td class="px-3 py-2 text-center border border-gray-300">${prodiData.reduce((sum, p) => sum + (p.penelitian?.pusat || 0), 0)}</td>
            <td class="px-3 py-2 text-center border border-gray-300">${prodiData.reduce((sum, p) => sum + (p.penelitian?.pnbp || 0), 0)}</td>
            <td class="px-3 py-2 text-center border border-gray-300">${prodiData.reduce((sum, p) => sum + (p.penelitian?.mandiri || 0), 0)}</td>
            <td class="px-3 py-2 text-center border border-gray-300">${prodiData.reduce((sum, p) => sum + (p.pengabdian?.pnbp || 0), 0)}</td>
            <td class="px-3 py-2 text-center border border-gray-300">${prodiData.reduce((sum, p) => sum + (p.pengabdian?.pusat || 0), 0)}</td>
            <td class="px-3 py-2 text-center border border-gray-300">${prodiData.reduce((sum, p) => sum + (p.publikasi?.haki || 0), 0)}</td>
            <td class="px-3 py-2 text-center border border-gray-300">${prodiData.reduce((sum, p) => sum + (p.publikasi?.buku || 0), 0)}</td>
            <td class="px-3 py-2 text-center border border-gray-300">${prodiData.reduce((sum, p) => sum + (p.publikasi?.jupeng || 0), 0)}</td>
        `;
        tbody.appendChild(totalRow);
    } else {
        // Show no data message
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = `
            <td colspan="9" class="px-4 py-8 text-center text-gray-500 border border-gray-300">
                ${getTranslation('dashboard.noData')}
            </td>
        `;
        tbody.appendChild(noDataRow);
    }
}

// Function to show error message
function showError(message) {
    document.getElementById('loadingState').innerHTML = `
        <div class="text-center text-red-600">
            <p class="text-lg font-semibold">${getTranslation('dashboard.error')}</p>
            <p>${message}</p>
            <button onclick="window.location.reload()" class="mt-2 px-4 py-2 bg-veronica text-white rounded hover:bg-veronica-dark">
                ${getTranslation('dashboard.refresh')}
            </button>
        </div>
    `;

    document.getElementById('tableLoadingState').innerHTML = `
        <div class="text-center text-red-600">
            <p>${getTranslation('dashboard.error')}</p>
        </div>
    `;
}

// Function to initialize charts after data is loaded
function initializeCharts() {
    // Fill chart data with actual values
    chartConfigs.forEach(chartConfig => {
        const data = getChartData(chartConfig.type);
        chartConfig.config.data.datasets[0].data = data;
    });

    // Initialize charts with loaded data
    const renderedCharts = {};

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
}


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
        ctx.fillText(getTranslation('dashboard.total'), centerX, centerY - 15);

        // Pengaturan Font untuk Angka Total
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#111827'; // Warna hitam keabu-abuan
        // Gambar angka total sedikit di bawah tengah
        ctx.fillText(total, centerX, centerY + 15);
    }
};
// Function to get chart data dynamically
function getChartData(chartType) {
    switch (chartType) {
        case 'penelitian':
            return [
                penelitianCounts["PNBP"] || 0,
                penelitianCounts["Pusat"] || 0,
                penelitianCounts["Mandiri"] || 0
            ];
        case 'pengabdian':
            return [
                pengabdianCounts["PNBP"] || 0,
                pengabdianCounts["Pusat"] || 0
            ];
        case 'publikasi':
            return [
                publikasiCounts["HAKI"] || 0,
                publikasiCounts["Buku"] || 0,
                publikasiCounts["Jurnal Pengabdian"] || 0
            ];
        default:
            return [];
    }
}

const chartConfigs = [
    {
        id: 'penelitianChart',
        type: 'penelitian',
        config: {
            type: 'doughnut',
            data: {
                labels: [translations.categories.pnbp, translations.categories.pusat, translations.categories.mandiri],
                datasets: [{
                    data: [],  // Will be filled dynamically
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
                responsive: true,
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
                        text: translations.dashboard.charts.penelitian,
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
    },
    {
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
                        text: translations.dashboard.charts.pengabdian,
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
    },
    {
        id: 'publikasiChart',
        type: 'publikasi',
        config: {
            type: 'doughnut',
            data: {
                labels: [translations.categories.haki, translations.categories.buku, translations.categories.jupeng],
                datasets: [{
                    data: [],  // Will be filled dynamically
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
                        text: translations.dashboard.charts.publikasi,
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
    }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    fetchDashboardData();
});