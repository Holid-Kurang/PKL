// Import chart configurations
import { getPusatChartConfigs } from './charts/pengabdian/pusatCharts.js';
import { getPNBPChartConfigs } from './charts/pengabdian/pnbpCharts.js';

document.getElementById('jenispenelitian').addEventListener('change', function () {
    const selectedValue = this.value;
    const sections = document.querySelectorAll('.chart-section');

    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const selectedSection = document.getElementById(selectedValue + '-section');
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua data yang sudah disiapkan di EJS
    const pusatData = window.pusatData || {};
    const pnbpData = window.pnbpData || {};
    const translations = window.pageTranslations || {};

    // Objek untuk menyimpan instance chart yang sudah dirender
    const chartInstances = {};

    // Get chart configurations from imported modules
    const pusatConfigs = getPusatChartConfigs(pusatData, translations);
    const pnbpConfigs = getPNBPChartConfigs(pnbpData, translations);

    // Combine all chart configurations
    const chartConfigurations = [
        ...pusatConfigs,
        ...pnbpConfigs
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
