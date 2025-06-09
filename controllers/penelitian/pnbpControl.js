const pnbpModel = require('../../models/penelitian/pnbp');

// Read dan Search
exports.getAllData = async (req, res) => {
    try {
        // --- Menangani Parameter untuk Pencarian dan Pagination ---
        const searchQuery = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        
        // Mengambil limit dari query, dengan nilai default 50 jika tidak ada
        const limit = parseInt(req.query.limit) || 50; 
        
        const skip = (page - 1) * limit;

        // --- Membuat Filter Pencarian (jika ada) ---
        let filter = {};
        if (searchQuery) {
            const regex = new RegExp(searchQuery, 'i'); // 'i' untuk case-insensitive
            filter = {
                $or: [
                    { Judul: regex },
                    { Ketua: regex },
                    { Prodi: regex }, // Pastikan nama field di model adalah 'PRODI'
                    { SKEMA: regex }
                ]
            };
        }

        // --- Mengambil Data dari Database ---
        // 1. Menghitung total dokumen yang cocok dengan filter untuk pagination
        const totalData = await pnbpModel.countDocuments(filter);
        const totalPages = Math.ceil(totalData / limit) || 1; // Pastikan totalPages minimal 1
        // 2. Mengambil data untuk halaman saat ini dengan limit dan skip
        const data = await pnbpModel.find(filter)
            .sort({ TAHUN: -1 }) // Mengurutkan berdasarkan tahun terbaru
            .skip(skip)
            .limit(limit);
        // --- Merender Halaman ---
        res.render('dashboard/penelitian/dash-pnbp', {
            data,
            searchQuery,
            title: 'Penelitian PNBP',
            currentPage: page,
            totalPages,
            limit // Kirim limit ke view agar bisa digunakan di link pagination
        });

    } catch (error) {
        console.error('Error fetching penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createData = async (req, res) => {
    try {
        // Replace empty fields with '-'
        const {
            Judul = '-', SKEMA = '-', Prodi = '-', Ketua = '-',
            Anggota1 = '-', Anggota2 = '-', Anggota3 = '-', Anggota4 = '-',
            Biaya = 0, Tahun = 0, Nilai = 0
        } = req.body;

        const newData = new pnbpModel({
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Prodi: Prodi || '-',
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            Biaya: Biaya || 0,
            Tahun: Tahun || 0,
            Nilai: Nilai || 0
        });

        await newData.save();
        res.redirect('/dashboard/penelitian/pnbp');
    } catch (error) {
        console.error('Error creating penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await pnbpModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).send('Data not found');
        }
        res.redirect('/dashboard/penelitian/pnbp');
    } catch (error) {
        console.error('Error deleting penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            Judul, SKEMA, Prodi, Ketua,
            Anggota1, Anggota2, Anggota3, Anggota4,
            Biaya, Tahun, Nilai
        } = req.body;

        const updatedData = {
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Prodi: Prodi || '-',
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            Biaya: Biaya || 0,
            Tahun: Tahun || 0,
            Nilai: Nilai || 0
        };

        await pnbpModel.findByIdAndUpdate(id, updatedData);
        res.redirect('/dashboard/penelitian/pnbp');
    } catch (error) {
        console.error('Error updating penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await pnbpModel.find({});
        const csvRows = [];
        // Add header row
        const headers = [
            'Judul', 'SKEMA', 'Prodi', 'Ketua',
            'Anggota1', 'Anggota2', 'Anggota3', 'Anggota4',
            'Biaya', 'Tahun', 'Nilai'
        ];
        csvRows.push(headers.join(','));

        // Add data rows
        data.forEach(item => {
            csvRows.push([
            item.Judul,
            item.SKEMA,
            item.Prodi,
            item.Ketua,
            item.Anggota1,
            item.Anggota2,
            item.Anggota3,
            item.Anggota4,
            item.Biaya,
            item.Tahun,
            item.Nilai
            ].join(','));
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=penelitian_pnbp.csv');
        res.status(200).send(csvRows.join('\n'));
    } catch (error) {
        console.error('Error exporting penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
}