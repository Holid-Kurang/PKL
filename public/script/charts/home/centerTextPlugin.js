// Plugin untuk menampilkan text di tengah doughnut chart
export const centerTextPlugin = {
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

        // Get translation function from window
        const getTranslation = window.getTranslation || ((key) => key);

        // Pengaturan Font untuk teks "Total"
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#6B7280'; // Warna abu-abu
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Gambar teks "Total" sedikit di atas tengah
        ctx.fillText(getTranslation('home.total'), centerX, centerY - 15);

        // Pengaturan Font untuk Angka Total
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#111827'; // Warna hitam keabu-abuan
        // Gambar angka total sedikit di bawah tengah
        ctx.fillText(total, centerX, centerY + 15);
    }
};
