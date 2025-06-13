const jupengModel = require('../../models/publikasi/jupengModel');

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
                    { jurnal_judul: regex },
                    { _pengguna_nama: regex },
                    { _prodi_nama: regex }, // Pastikan nama field di model adalah 'PRODI'
                ]
            };
        }

        // --- Mengambil Data dari Database ---
        // 1. Menghitung total dokumen yang cocok dengan filter untuk pagination
        const totalData = await jupengModel.countDocuments(filter);
        const totalPages = Math.ceil(totalData / limit) || 1; // Pastikan totalPages minimal 1
        // 2. Mengambil data untuk halaman saat ini dengan limit dan skip
        const data = await jupengModel.find(filter)
            .sort({ jurnal_tahun: -1 }) // Mengurutkan berdasarkan tahun terbaru
            .skip(skip)
            .limit(limit);
        // --- Merender Halaman ---
        res.render('dashboard/publikasi/dash-jupeng', {
            data,
            searchQuery,
            title: 'Publikasi Jurnal Pengabdian',
            currentPage: page,
            totalPages,
            limit // Kirim limit ke view agar bisa digunakan di link pagination
        });

    } catch (error) {
        console.error('Error fetching publikasi jurnal pengabdian data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createData = async (req, res) => {
    try {
        // Replace empty fields with '-'
        const {
            jurnal_judul = '-',
            jurnal_url = '-',
            jurnal_file = '-',
            jurnal_tahun = 0,
            jurnal_bulan = '-',
            pengguna_kode = '-',
            _pengguna_jenis = '-',
            _pengguna_nama = '-',
            _prodi_nama = '-',
            _personil_data_ketua = '-',
            _personil_data_ketua_kode = '-',
            _personil_data_ketua_jenis = '-'
        } = req.body;

        const newData = new jupengModel({
            jurnal_judul: jurnal_judul || '-',
            jurnal_url: jurnal_url || '-',
            jurnal_file: jurnal_file || '-',
            jurnal_tahun: jurnal_tahun || 0,
            jurnal_bulan: jurnal_bulan || '-',
            pengguna_kode: pengguna_kode || '-',
            _pengguna_jenis: _pengguna_jenis || '-',
            _pengguna_nama: _pengguna_nama || '-',
            _prodi_nama: _prodi_nama || '-',
            _personil_data_ketua: _personil_data_ketua || '-',
            _personil_data_ketua_kode: _personil_data_ketua_kode || '-',
            _personil_data_ketua_jenis: _personil_data_ketua_jenis || '-'
        });

        await newData.save();
        res.redirect('/dashboard/publikasi/jupeng');
    } catch (error) {
        console.error('Error creating publikasi jurnal pengabdian data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await jupengModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).send('Data not found');
        }
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/publikasi/jupeng';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error deleting publikasi jurnal pengabdian data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            jurnal_judul = '-',
            jurnal_url = '-',
            jurnal_file = '-',
            jurnal_tahun = 0,
            jurnal_bulan = '-',
            pengguna_kode = '-',
            _pengguna_jenis = '-',
            _pengguna_nama = '-',
            _prodi_nama = '-',
            _personil_data_ketua = '-',
            _personil_data_ketua_kode = '-',
            _personil_data_ketua_jenis = '-'
        } = req.body;

        const updatedData = {
            jurnal_judul: jurnal_judul || '-',
            jurnal_url: jurnal_url || '-',
            jurnal_file: jurnal_file || '-',
            jurnal_tahun: jurnal_tahun || 0,
            jurnal_bulan: jurnal_bulan || '-',
            pengguna_kode: pengguna_kode || '-',
            _pengguna_jenis: _pengguna_jenis || '-',
            _pengguna_nama: _pengguna_nama || '-',
            _prodi_nama: _prodi_nama || '-',
            _personil_data_ketua: _personil_data_ketua || '-',
            _personil_data_ketua_kode: _personil_data_ketua_kode || '-',
            _personil_data_ketua_jenis: _personil_data_ketua_jenis || '-'
        };

        await jupengModel.findByIdAndUpdate(id, updatedData);
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/publikasi/jupeng';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating publikasi jurnal pengabdian data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await jupengModel.find({});
        // Prepare data for worksheet
        const worksheetData = [
            [
            'Judul', 'URL', 'File', 'Tahun', 'Bulan', 'Pengguna Kode', 'Jenis Pengguna', 'Nama Pengguna', 'Nama Prodi',
            'Personil Ketua', 'Kode Ketua', 'Jenis Ketua'
            ],
            ...data.map(item => [
            item.jurnal_judul || '-',
            item.jurnal_url || '-',
            item.jurnal_file || '-',
            item.jurnal_tahun || 0,
            item.jurnal_bulan || '-',
            item.pengguna_kode || '-',
            item._pengguna_jenis || '-',
            item._pengguna_nama || '-',
            item._prodi_nama || '-',
            item._personil_data_ketua || '-',
            item._personil_data_ketua_kode || '-',
            item._personil_data_ketua_jenis || '-'
            ])
        ];
        const XLSX = require('xlsx');
        // Create worksheet and workbook
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'JurnalPengabdian');

        // Write workbook to XLSX buffer
        const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=publikasi_jupeng.xlsx');
        res.status(200).send(xlsxBuffer);
    } catch (error) {
        console.error('Error exporting publikasi jurnal pengabdian data:', error);
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
                    // Mapping kolom sesuai dengan model jupengModel
                    const dataToInsert = results.map(item => ({
                        jurnal_judul: item.jurnal_judul || '-',
                        jurnal_url: item.jurnal_url || '-',
                        jurnal_file: item.jurnal_file || '-',
                        jurnal_tahun: parseInt(item.jurnal_tahun) || 0,
                        jurnal_bulan: item.jurnal_bulan || '-',
                        pengguna_kode: item.pengguna_kode || '-',
                        _pengguna_jenis: item._pengguna_jenis || '-',
                        _pengguna_nama: item._pengguna_nama || '-',
                        _prodi_nama: item._prodi_nama || '-',
                        _personil_data_ketua: item._personil_data_ketua || '-',
                        _personil_data_ketua_kode: item._personil_data_ketua_kode || '-',
                        _personil_data_ketua_jenis: item._personil_data_ketua_jenis || '-'
                    }));

                    if (dataToInsert.length > 0) {
                        await jupengModel.insertMany(dataToInsert);
                    }

                    res.redirect('/dashboard/publikasi/jupeng');
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
        console.error('Error importing publikasi jurnal pengabdian data:', error);
        res.status(500).send('Internal Server Error');
    }
};