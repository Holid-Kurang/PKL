const pnbpModel = require('../../models/pengabdian/pnbp');

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
        res.render('dashboard/pengabdian/dash-pnbp', {
            data,
            searchQuery,
            title: 'Pengabdian PNBP',
            currentPage: page,
            totalPages,
            limit // Kirim limit ke view agar bisa digunakan di link pagination
        });

    } catch (error) {
        console.error('Error fetching pengabdian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createData = async (req, res) => {
    try {
        // Replace empty fields with '-'
        const {
            Judul = '-', SKEMA = '-', Ketua = '-',
            Anggota1 = '-', Anggota2 = '-', Anggota3 = '-', Anggota4 = '-',
            NilaiRataRata = 0, BiayaDisetujui = 0, Prodi = '-', Tahun = 0
        } = req.body;

        const newData = new pnbpModel({
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            NilaiRataRata: NilaiRataRata || 0,
            BiayaDisetujui: BiayaDisetujui || 0,
            Prodi: Prodi || '-',
            Tahun: Tahun || 0
        });

        await newData.save();
        res.redirect('/dashboard/pengabdian/pnbp');
    } catch (error) {
        console.error('Error creating pengabdian pnbp data:', error);
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
        res.redirect('/dashboard/pengabdian/pnbp');
    } catch (error) {
        console.error('Error deleting pengabdian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            Judul, SKEMA, Ketua,
            Anggota1, Anggota2, Anggota3, Anggota4,
            NilaiRataRata, BiayaDisetujui, Prodi, Tahun
        } = req.body;

        const updatedData = {
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            NilaiRataRata: NilaiRataRata || 0,
            BiayaDisetujui: BiayaDisetujui || 0,
            Prodi: Prodi || '-',
            Tahun: Tahun || 0
        };

        await pnbpModel.findByIdAndUpdate(id, updatedData);
        res.redirect('/dashboard/pengabdian/pnbp');
    } catch (error) {
        console.error('Error updating pengabdian pnbp data:', error);
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
            'BiayaDisetujui', 'Tahun', 'NilaiRataRata'
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
            item.BiayaDisetujui,
            item.Tahun,
            item.NilaiRataRata
            ].join(','));
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=pengabdian_pnbp.csv');
        res.status(200).send(csvRows.join('\n'));
    } catch (error) {
        console.error('Error exporting pengabdian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        const csv = require('csv-parser');
        const streamifier = require('streamifier');

        const results = [];

        streamifier.createReadStream(file.buffer)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    const dataToInsert = results.map(item => ({
                        Judul: item.Judul || '-',
                        SKEMA: item.SKEMA || '-',
                        Prodi: item.Prodi || '-',
                        Ketua: item.Ketua || '-',
                        Anggota1: item.Anggota1 || '-',
                        Anggota2: item.Anggota2 || '-',
                        Anggota3: item.Anggota3 || '-',
                        Anggota4: item.Anggota4 || '-',
                        BiayaDisetujui: parseFloat(item.BiayaDisetujui) || 0,
                        Tahun: parseInt(item.Tahun) || 0,
                        NilaiRataRata: parseFloat(item.NilaiRataRata) || 0
                    }));

                    if (dataToInsert.length > 0) {
                        await pnbpModel.insertMany(dataToInsert);
                    }
                    
                    res.redirect('/dashboard/pengabdian/pnbp');
                } catch (err) {
                    console.error('Error saving imported data:', err);
                    res.status(500).send('Error saving imported data. Pastikan kolom di file CSV sesuai dengan format yang dibutuhkan.');
                }
            })
            .on('error', (err) => {
                console.error('Error reading CSV stream:', err);
                res.status(500).send('Error reading CSV file');
            });

    } catch (error) {
        console.error('Error importing pengabdian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};
