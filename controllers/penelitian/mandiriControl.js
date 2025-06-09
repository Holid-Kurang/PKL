const mandiriModel = require('../../models/penelitian/mandiri');

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
                    { Skema: regex }
                ]
            };
        }

        // --- Mengambil Data dari Database ---
        // 1. Menghitung total dokumen yang cocok dengan filter untuk pagination
        const totalData = await mandiriModel.countDocuments(filter);
        const totalPages = Math.ceil(totalData / limit) || 1; // Pastikan totalPages minimal 1
        // 2. Mengambil data untuk halaman saat ini dengan limit dan skip
        const data = await mandiriModel.find(filter)
            .sort({ tahun: -1 }) // Mengurutkan berdasarkan tahun terbaru
            .skip(skip)
            .limit(limit);
        // --- Merender Halaman ---
        res.render('dashboard/penelitian/dash-mandiri', {
            data,
            searchQuery,
            title: 'Penelitian Pusat',
            currentPage: page,
            totalPages,
            limit // Kirim limit ke view agar bisa digunakan di link pagination
        });

    } catch (error) {
        console.error('Error fetching penelitian mandiri data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createData = async (req, res) => {
    try {
        // Replace empty fields with '-'
        const {
            tahun = 0,
            Ketua = '-',
            Anggota1 = '-',
            Anggota2 = '-',
            Anggota3 = '-',
            Anggota4 = '-',
            Skema = '-',
            Judul = '-',
            Prodi = '-',
            Dana = 0
        } = req.body;

        const newData = new mandiriModel({
            tahun: tahun || 0,
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            Skema: Skema || '-',
            Judul: Judul || '-',
            Prodi: Prodi || '-',
            Dana: Dana || 0
        });

        await newData.save();
        res.redirect('/dashboard/penelitian/mandiri');
    } catch (error) {
        console.error('Error creating penelitian mandiri data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await mandiriModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).send('Data not found');
        }
        res.redirect('/dashboard/penelitian/mandiri');
    } catch (error) {
        console.error('Error deleting penelitian mandiri data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            tahun,
            Ketua,
            Anggota1,
            Anggota2,
            Anggota3,
            Anggota4,
            Skema,
            Judul,
            Prodi,
            Dana
        } = req.body;

        const updatedData = {
            tahun: tahun || 0,
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            Skema: Skema || '-',
            Judul: Judul || '-',
            Prodi: Prodi || '-',
            Dana: Dana || 0
        };

        await mandiriModel.findByIdAndUpdate(id, updatedData);
        res.redirect('/dashboard/penelitian/mandiri');
    } catch (error) {
        console.error('Error updating penelitian mandiri data:', error);
        res.status(500).send('Internal Server Error');
    }
};