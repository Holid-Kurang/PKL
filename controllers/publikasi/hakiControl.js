const hakiModel = require('../../models/publikasi/HAKIModel');
const kategoriOptionModel = require('../../models/kategoriOptionModel');

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
                    { hki_judul: regex },
                    { _pengguna_nama: regex },
                    { _prodi_nama: regex }, // Pastikan nama field di model adalah 'PRODI'
                    { hki_jenis: regex }
                ]
            };
        }

        // --- Mengambil Data dari Database ---
        // 1. Menghitung total dokumen yang cocok dengan filter untuk pagination
        const totalData = await hakiModel.countDocuments(filter);
        const totalPages = Math.ceil(totalData / limit) || 1; // Pastikan totalPages minimal 1
        // 2. Mengambil data untuk halaman saat ini dengan limit dan skip
        const data = await hakiModel.find(filter)
            // .sort({ hki_tahun: -1 }) // Mengurutkan berdasarkan tahun terbaru
            .skip(skip)
            .limit(limit);

        let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : []; // Ambil opsi prodi dari kategori

        let hakiOptions = await kategoriOptionModel.find({ kategori: 'Jenis HAKI' });
        hakiOptions = hakiOptions.length > 0 ? hakiOptions[0].option : []; // Ambil opsi haki dari kategori

        // --- Merender Halaman ---
        res.render('dashboard/publikasi/dash-haki', {
            data,
            searchQuery,
            title: 'Publikasi HAKI',
            currentPage: page,
            prodiOptions,
            hakiOptions,
            totalPages,
            totalData,
            limit // Kirim limit ke view agar bisa digunakan di link pagination
        });

    } catch (error) {
        console.error('Error fetching publikasi haki data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createData = async (req, res) => {
    try {
        // Replace empty fields with '-'
        const {
            hki_judul = '-',
            hki_jenis = '-',
            hki_file = '-',
            hki_bulan = '-',
            hki_tahun = 0,
            pengguna_kode = '-',
            _pengguna_nama = '-',
            _prodi_nama = '-'
        } = req.body;
        console.log(req.body);
        const newData = new hakiModel({
            hki_judul: hki_judul || '-',
            hki_jenis: hki_jenis || '-',
            hki_file: hki_file || '-',
            hki_bulan: hki_bulan || '-',
            hki_tahun: hki_tahun || 0,
            pengguna_kode: pengguna_kode || '-',
            _pengguna_nama: _pengguna_nama || '-',
            _prodi_nama: _prodi_nama || '-'
        });

        await newData.save();
        res.redirect('/dashboard/publikasi/haki');
    } catch (error) {
        console.error('Error creating publikasi haki data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await hakiModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).send('Data not found');
        }
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/publikasi/haki';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error deleting publikasi haki data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            hki_judul = '-',
            hki_jenis = '-',
            hki_file = '-',
            hki_bulan = '-',
            hki_tahun = 0,
            pengguna_kode = '-',
            _pengguna_nama = '-',
            _prodi_nama = '-'
        } = req.body;
        console.log(req.body);
        const updatedData = {
            hki_judul: hki_judul || '-',
            hki_jenis: hki_jenis || '-',
            hki_file: hki_file || '-',
            hki_bulan: hki_bulan || '-',
            hki_tahun: hki_tahun || 0,
            pengguna_kode: pengguna_kode || '-',
            _pengguna_nama: _pengguna_nama || '-',
            _prodi_nama: _prodi_nama || '-'
        };

        await hakiModel.findByIdAndUpdate(id, updatedData);
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/publikasi/haki';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating publikasi haki data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await hakiModel.find({});
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PublikasiHAKI');

        // Add header row
        worksheet.addRow([
            'Judul', 'Jenis', 'File', 'Bulan', 'Tahun', 'Pengguna Kode', 'Nama Pengguna', 'Nama Prodi'
        ]);

        // Add data rows
        data.forEach(item => {
            worksheet.addRow([
                item.hki_judul || '-',
                item.hki_jenis || '-',
                item.hki_file || '-',
                item.hki_bulan || '-',
                item.hki_tahun || 0,
                item.pengguna_kode || '-',
                item._pengguna_nama || '-',
                item._prodi_nama || '-'
            ]);
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=publikasi_haki.xlsx');

        // Write to buffer and send
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting publikasi haki data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.send("<script>alert('No file uploaded'); window.location.href='/dashboard/publikasi/haki';</script>");
        }
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return res.send("<script>alert('Worksheet tidak ditemukan'); window.location.href='/dashboard/publikasi/haki';</script>");
        }

        // Ambil header kolom dari baris pertama
        const headerRow = worksheet.getRow(1);
        const headers = headerRow.values.slice(1); // values[0] is null

        const expectedHeaders = [
            'hki_judul', 'hki_jenis', 'hki_file', 'hki_bulan', 'hki_tahun',
            'pengguna_kode', '_pengguna_nama', '_prodi_nama'
        ];

        // Cek apakah header sesuai urutan dan nama
        const isHeaderValid = expectedHeaders.every((h, i) => h === headers[i]);
        if (!isHeaderValid) {
            return res.send("<script>alert('Format kolom tidak sesuai. Kolom harus: " + expectedHeaders.join(', ') + "'); window.location.href='/dashboard/publikasi/haki';</script>");
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
            item.hki_tahun = parseInt(item.hki_tahun) || 0;
            dataToInsert.push(item);
        });

        if (dataToInsert.length > 0) {
            await hakiModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/publikasi/haki');
    } catch (error) {
        console.error('Error importing publikasi haki data:', error);
        res.status(500).send('Internal Server Error. Pastikan file XLSX sesuai format.');
    }
};
