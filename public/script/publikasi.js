document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua data yang sudah disiapkan di EJS
    const jupengData = window.jupengData || {};
    const hakiData = window.hakiData || {};
    const bukuData = window.bukuData || {};

    // Objek untuk menyimpan instance chart yang sudah dirender
    const chartInstances = {};

    const chartConfigurations = [
        // --- Konfigurasi Chart BUKU ---
        {
            id: 'bukuPerTahun',
            init: () => new Chart(document.getElementById('bukuPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: bukuData.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Buku per Tahun', data: bukuData.jumlahPerTahun.map(item => item.jumlahBuku),
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
        {
            id: 'bukuPerProdi',
            init: () => new Chart(document.getElementById('bukuPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: bukuData.jumlahPerProdi.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Buku per Program Studi', data: bukuData.jumlahPerProdi.map(item => item.jumlahBuku),
                        backgroundColor: ['#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'],
                        borderColor: '#232F58', borderWidth: 1, hoverOffset: 50
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        tooltip: { backgroundColor: '#232F58', titleFont: { size: 16 }, bodyFont: { size: 14 }, footerFont: { weight: 'normal' }, callbacks: { title: (tooltipItems) => tooltipItems[0].label, label: (context) => context.parsed + ' Buku' } },
                        title: { display: true, text: 'Jumlah Buku per Program Studi', font: { size: 20, weight: 'lighter' }, color: '#232F58' },
                        legend: { display: true, position: 'bottom', labels: { font: { size: 12 } } }
                    },
                    layout: { padding: 20 }
                }
            })
        },
        // --- Konfigurasi Chart HAKI ---
        {
            id: 'hakiPerJenis',
            init: () => new Chart(document.getElementById('hakiPerJenis').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: hakiData.jumlahPerJenis.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah HAKI per Jenis', data: hakiData.jumlahPerJenis.map(item => item.jumlahHKI),
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
        },
        {
            id: 'hakiPerProdi',
            init: () => new Chart(document.getElementById('hakiPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: hakiData.jumlahPerProdi.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah HAKI per Program Studi', data: hakiData.jumlahPerProdi.map(item => item.jumlahHKI),
                        backgroundColor: ['#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'],
                        borderColor: '#232F58', borderWidth: 1, hoverOffset: 50
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        tooltip: { backgroundColor: '#232F58', titleFont: { size: 16 }, bodyFont: { size: 14 }, footerFont: { weight: 'normal' }, callbacks: { title: (tooltipItems) => tooltipItems[0].label, label: (context) => context.parsed + ' HAKI' } },
                        title: { display: true, text: 'Jumlah HAKI per Program Studi', font: { size: 20, weight: 'lighter' }, color: '#232F58' },
                        legend: { display: true, position: 'right', labels: { font: { size: 12 } } }
                    },
                    layout: { padding: 20 }
                }
            })
        },
        {
            id: 'hakiPerTahun',
            init: () => new Chart(document.getElementById('hakiPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: hakiData.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah HAKI per Tahun', data: hakiData.jumlahPerTahun.map(item => item.jumlahHKI),
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
        // --- Konfigurasi Chart JUPENG ---
        {
            id: 'jupengPerTahun',
            init: () => new Chart(document.getElementById('jupengPerTahun').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: jupengData.jumlahPerTahun.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Publikasi per Tahun', data: jupengData.jumlahPerTahun.map(item => item.totalPublikasi),
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
        },
        {
            id: 'jupengPerProdi',
            init: () => new Chart(document.getElementById('jupengPerProdi').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: jupengData.jumlahPerProdi.map(item => item._id),
                    datasets: [{
                        label: 'Jumlah Publikasi per Program Studi', data: jupengData.jumlahPerProdi.map(item => item.count),
                        backgroundColor: ['#9342DA', '#ffd700', '#ff1b1c', '#41e2ba', '#00bfff', '#0000ff', '#00ff7f'],
                        borderColor: '#232F58', borderWidth: 1, hoverOffset: 50
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        tooltip: { backgroundColor: '#232F58', titleFont: { size: 16 }, bodyFont: { size: 14 }, footerFont: { weight: 'normal' }, callbacks: { title: (tooltipItems) => tooltipItems[0].label, label: (context) => context.parsed + ' publikasi' } },
                        title: { display: true, text: 'Jumlah Jurnal Pengabdian per Program Studi', font: { size: 20, weight: 'lighter' }, color: '#232F58' },
                        legend: { display: true, position: 'bottom', labels: { font: { size: 12 } } }
                    },
                    layout: { padding: 20 }
                }
            })
        }
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
