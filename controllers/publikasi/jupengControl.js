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
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('JurnalPengabdian');

        // Add header row
        worksheet.addRow([
            'Judul', 'URL', 'File', 'Tahun', 'Bulan', 'Pengguna Kode', 'Jenis Pengguna', 'Nama Pengguna', 'Nama Prodi',
            'Personil Ketua', 'Kode Ketua', 'Jenis Ketua'
        ]);

        // Add data rows
        data.forEach(item => {
            worksheet.addRow([
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
            ]);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=publikasi_jupeng.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting publikasi jurnal pengabdian data:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.send("<script>alert('No file uploaded'); window.location.href='/dashboard/publikasi/jupeng';</script>");
        }
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        // Ambil header kolom dari baris pertama
        const headerRow = worksheet.getRow(1);
        const headers = headerRow.values.slice(1); // values[0] is null

        const expectedHeaders = [
            'jurnal_judul', 'jurnal_url', 'jurnal_file', 'jurnal_tahun', 'jurnal_bulan',
            'pengguna_kode', '_pengguna_jenis', '_pengguna_nama', '_prodi_nama',
            '_personil_data_ketua', '_personil_data_ketua_kode', '_personil_data_ketua_jenis'
        ];

        // Cek apakah header sesuai urutan dan nama
        const isHeaderValid = expectedHeaders.every((h, i) => h === headers[i]);
        if (!isHeaderValid) {
            return res.send("<script>alert('Format kolom tidak sesuai. Kolom harus: " + expectedHeaders.join(', ') + "'); window.location.href='/dashboard/publikasi/jupeng';</script>");
        }

        // Ambil data mulai dari baris kedua
        const dataToInsert = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            const rowValues = row.values.slice(1); // values[0] is null
            const item = {};
            expectedHeaders.forEach((header, idx) => {
                item[header] = rowValues[idx] !== undefined ? rowValues[idx] : '-';
            });
            item.jurnal_tahun = parseInt(item.jurnal_tahun) || 0;
            dataToInsert.push(item);
        });

        if (dataToInsert.length > 0) {
            await jupengModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/publikasi/jupeng');
    } catch (error) {
        console.error('Error importing publikasi jurnal pengabdian data:', error);
        res.status(500).send('Internal Server Error. Pastikan file XLSX sesuai format.');
    }
};