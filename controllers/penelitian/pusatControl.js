const pusatModel = require('../../models/penelitian/pusat');

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
                    { JUDUL: regex },
                    { NAMA: regex },
                    { PRODI: regex }, // Pastikan nama field di model adalah 'PRODI'
                    { SKEMA: regex }
                ]
            };
        }

        // --- Mengambil Data dari Database ---
        // 1. Menghitung total dokumen yang cocok dengan filter untuk pagination
        const totalData = await pusatModel.countDocuments(filter);
        const totalPages = Math.ceil(totalData / limit) || 1; // Pastikan totalPages minimal 1
        // 2. Mengambil data untuk halaman saat ini dengan limit dan skip
        const data = await pusatModel.find(filter)
            .sort({ TAHUN: -1 }) // Mengurutkan berdasarkan tahun terbaru
            .skip(skip)
            .limit(limit);
        // --- Merender Halaman ---
        res.render('dashboard/penelitian/dash-pusat', {
            data,
            searchQuery,
            title: 'Penelitian Pusat',
            currentPage: page,
            totalPages,
            limit // Kirim limit ke view agar bisa digunakan di link pagination
        });

    } catch (error) {
        console.error('Error fetching penelitian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createData = async (req, res) => {
    try {
        // Replace empty fields with '-'
        const {
            TAHUN = 0,
            SKEMA = '-',
            NAMA = '-',
            Anggota1 = '-',
            Anggota2 = '-',
            Anggota3 = '-',
            Anggota4 = '-',
            NIP = '-',
            NIDN = '-',
            PRODI = '-',
            JUDUL = '-',
            BIAYA = 0
        } = req.body;

        const newData = new pusatModel({
            TAHUN: TAHUN || 0,
            SKEMA: SKEMA || '-',
            NAMA: NAMA || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            NIP: NIP || '-',
            NIDN: NIDN || '-',
            PRODI: PRODI || '-',
            JUDUL: JUDUL || '-',
            BIAYA: BIAYA || 0
        });

        await newData.save();
        res.redirect('/dashboard/penelitian/pusat');
    } catch (error) {
        console.error('Error creating penelitian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await pusatModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).send('Data not found');
        }
        res.redirect('/dashboard/penelitian/pusat');
    } catch (error) {
        console.error('Error deleting penelitian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            TAHUN,
            SKEMA,
            NAMA,
            Anggota1,
            Anggota2,
            Anggota3,
            Anggota4,
            NIP,
            NIDN,
            PRODI,
            JUDUL,
            BIAYA
        } = req.body;

        const updatedData = {
            TAHUN: TAHUN || 0,
            SKEMA: SKEMA || '-',
            NAMA: NAMA || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            NIP: NIP || '-',
            NIDN: NIDN || '-',
            PRODI: PRODI || '-',
            JUDUL: JUDUL || '-',
            BIAYA: BIAYA || 0
        };

        await pusatModel.findByIdAndUpdate(id, updatedData);
        res.redirect('/dashboard/penelitian/pusat');
    } catch (error) {
        console.error('Error updating penelitian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};