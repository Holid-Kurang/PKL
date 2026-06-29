// Import chart configurations
import { getPenelitianChartConfig } from './charts/home/penelitianChart.js';
import { getPengabdianChartConfig } from './charts/home/pengabdianChart.js';
import { getPublikasiChartConfig } from './charts/home/publikasiChart.js';

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

// Make getTranslation available globally for plugins
window.getTranslation = getTranslation;

// Function to fetch dashboard data from API
async function fetchDashboardData() {
    try {
        const response = await fetch('/api/dashboard/summary');

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
        ${getTranslation('home.penelitianText.prefix')} <strong>${penelitianStats.total}</strong> ${getTranslation('home.penelitianText.middle')} 
        <strong>${penelitianStats.topCategory}</strong> ${getTranslation('home.penelitianText.suffix')} <strong>${penelitianStats.topPercentage.toFixed(1)}%</strong> ${getTranslation('home.penelitianText.percent')}
        <a href="/penelitian" class="text-blue-600 hover:underline">${getTranslation('home.seeDetail')}.</a>
    `;

    // Update pengabdian text
    document.getElementById('pengabdianText').innerHTML = `
        ${getTranslation('home.pengabdianText.prefix')} <strong>${pengabdianStats.total}</strong> ${getTranslation('home.pengabdianText.middle')} 
        <strong>${pengabdianStats.topCategory}</strong> 
        ${getTranslation('home.pengabdianText.suffix')} <strong>${pengabdianStats.topPercentage.toFixed(1)}%</strong>.
        <a href="/pengabdian" class="text-blue-600 hover:underline">${getTranslation('home.seeDetail')}.</a>
    `;

    // Update publikasi text
    document.getElementById('publikasiText').innerHTML = `
        ${getTranslation('home.publikasiText.prefix')} <strong>${publikasiStats.total}</strong> ${getTranslation('home.publikasiText.middle')} <strong>${publikasiStats.topCategory}</strong>, 
        ${getTranslation('home.publikasiText.suffix')} <strong>${publikasiStats.topPercentage.toFixed(1)}%</strong> ${getTranslation('home.publikasiText.percent')}
        <a href="/publikasi" class="text-blue-600 hover:underline">${getTranslation('home.seeDetail')}.</a>
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
            <td class="px-4 py-3 border border-gray-300">${getTranslation('home.table.total')}</td>
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
                ${getTranslation('home.noData')}
            </td>
        `;
        tbody.appendChild(noDataRow);
    }
}

// Function to show error message
function showError(message) {
    document.getElementById('loadingState').innerHTML = `
        <div class="text-center text-red-600">
            <p class="text-lg font-semibold">${getTranslation('home.error')}</p>
            <p>${message}</p>
            <button onclick="window.location.reload()" class="mt-2 px-4 py-2 bg-veronica text-white rounded hover:bg-veronica-dark">
                ${getTranslation('home.refresh')}
            </button>
        </div>
    `;

    document.getElementById('tableLoadingState').innerHTML = `
        <div class="text-center text-red-600">
            <p>${getTranslation('home.error')}</p>
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
                // Render Chart hanya jika belum dirender
                const canvas = entry.target.querySelector('canvas');
                if (canvas) {
                    const chartConfig = chartConfigs.find(c => c.id === canvas.id);
                    if (chartConfig && !renderedCharts[chartConfig.id]) {
                        const ctx = canvas.getContext('2d');
                        renderedCharts[chartConfig.id] = new Chart(ctx, chartConfig.config);
                    }
                }
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.1, // Trigger ketika 10% chart terlihat
        rootMargin: '50px' // Mulai render 50px sebelum masuk viewport
    });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
}


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

// Get chart configurations from imported modules
const chartConfigs = [
    getPenelitianChartConfig(translations),
    getPengabdianChartConfig(translations),
    getPublikasiChartConfig(translations)
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    fetchDashboardData();
});