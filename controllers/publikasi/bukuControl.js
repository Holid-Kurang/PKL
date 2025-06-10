const bukuModel = require('../../models/publikasi/bukuModel');

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
                    { buku_judul: regex },
                    { _pengguna_nama: regex },
                    { _prodi_nama: regex },
                ]
            };
        }

        // --- Mengambil Data dari Database ---
        // 1. Menghitung total dokumen yang cocok dengan filter untuk pagination
        const totalData = await bukuModel.countDocuments(filter);
        const totalPages = Math.ceil(totalData / limit) || 1; // Pastikan totalPages minimal 1
        // 2. Mengambil data untuk halaman saat ini dengan limit dan skip
        const data = await bukuModel.find(filter)
            .sort({ buku_tahun: -1 }) // Mengurutkan berdasarkan tahun terbaru
            .skip(skip)
            .limit(limit);
        // --- Merender Halaman ---
        res.render('dashboard/publikasi/dash-buku', {
            data,
            searchQuery,
            title: 'Publikasi Buku',
            currentPage: page,
            totalPages,
            limit // Kirim limit ke view agar bisa digunakan di link pagination
        });

    } catch (error) {
        console.error('Error fetching publikasi buku data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createData = async (req, res) => {
    try {
        // Replace empty fields with '-'
        const {
            buku_judul = '-',
            buku_isbn = '-',
            buku_jumlah_halaman = 0,
            buku_penerbit = '-',
            buku_file = '-',
            buku_tahun = 0,
            pengguna_kode = '-',
            _pengguna_jenis = '-',
            _pengguna_nama = '-',
            _prodi_nama = '-'
        } = req.body;
        console.log(req.body);
        const newData = new bukuModel({
            buku_judul: buku_judul || '-',
            buku_isbn: buku_isbn || '-',
            buku_jumlah_halaman: buku_jumlah_halaman || 0,
            buku_penerbit: buku_penerbit || '-',
            buku_file: buku_file || '-',
            buku_tahun: buku_tahun || 0,
            pengguna_kode: pengguna_kode || '-',
            _pengguna_jenis: _pengguna_jenis || '-',
            _pengguna_nama: _pengguna_nama || '-',
            _prodi_nama: _prodi_nama || '-'
        });
        await newData.save();
        res.redirect('/dashboard/publikasi/buku');
    } catch (error) {
        console.error('Error creating publikasi buku data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await bukuModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).send('Data not found');
        }
        res.redirect('/dashboard/publikasi/buku');
    } catch (error) {
        console.error('Error deleting publikasi buku data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            buku_judul = '-',
            buku_isbn = '-',
            buku_jumlah_halaman = 0,
            buku_penerbit = '-',
            buku_file = '-',
            buku_tahun = 0,
            pengguna_kode = '-',
            _pengguna_jenis = '-',
            _pengguna_nama = '-',
            _prodi_nama = '-'
        } = req.body;
        console.log(req.body);
        const updatedData = {
            buku_judul: buku_judul || '-',
            buku_isbn: buku_isbn || '-',
            buku_jumlah_halaman: buku_jumlah_halaman || 0,
            buku_penerbit: buku_penerbit || '-',
            buku_file: buku_file || '-',
            buku_tahun: buku_tahun || 0,
            pengguna_kode: pengguna_kode || '-',
            _pengguna_jenis: _pengguna_jenis || '-',
            _pengguna_nama: _pengguna_nama || '-',
            _prodi_nama: _prodi_nama || '-'
        };
        await bukuModel.findByIdAndUpdate(id, updatedData);
        res.redirect('/dashboard/publikasi/buku');
    } catch (error) {
        console.error('Error updating publikasi buku data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await bukuModel.find({});
        const csvRows = [];
        // Add header row
        const headers = [
            'Judul', 'ISBN', 'Jumlah Halaman', 'Penerbit', 'File', 'Tahun', 'Pengguna Kode', 'Jenis Pengguna', 'Nama Pengguna', 'Nama Prodi'
        ];
        csvRows.push(headers.join(','));

        // Add data rows
        data.forEach(item => {
            csvRows.push([
            item.buku_judul || '-',
            item.buku_isbn || '-',
            item.buku_jumlah_halaman || 0,
            item.buku_penerbit || '-',
            item.buku_file || '-',
            item.buku_tahun || 0,
            item.pengguna_kode || '-',
            item._pengguna_jenis || '-',
            item._pengguna_nama || '-',
            item._prodi_nama || '-'
            ].join(','));
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=publikasi_buku.csv');
        res.status(200).send(csvRows.join('\n'));
    } catch (error) {
        console.error('Error exporting publikasi buku data:', error);
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
                    // Mapping kolom sesuai dengan model bukuModel
                    const dataToInsert = results.map(item => ({
                        buku_judul: item.buku_judul || '-',
                        buku_isbn: item.buku_isbn || '-',
                        buku_jumlah_halaman: parseInt(item.buku_jumlah_halaman) || 0,
                        buku_penerbit: item.buku_penerbit || '-',
                        buku_file: item.buku_file || '-',
                        buku_tahun: parseInt(item.buku_tahun) || 0,
                        pengguna_kode: item.pengguna_kode || '-',
                        _pengguna_jenis: item._pengguna_jenis || '-',
                        _pengguna_nama: item._pengguna_nama || '-',
                        _prodi_nama: item._prodi_nama || '-'
                    }));

                    if (dataToInsert.length > 0) {
                        await bukuModel.insertMany(dataToInsert);
                    }

                    res.redirect('/dashboard/publikasi/buku');
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
        console.error('Error importing publikasi buku data:', error);
        res.status(500).send('Internal Server Error');
    }
};
