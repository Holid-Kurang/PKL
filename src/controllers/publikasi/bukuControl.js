const bukuModel = require('../../models/publikasi/bukuModel');
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
                    { Judul: regex },
                    { Prodi: regex },
                ]
            };
        }

        let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : []; // Ambil opsi prodi dari kategori

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
            prodiOptions,
            totalPages,
            totalData,
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
            Judul = '-',
            buku_isbn = '-',
            buku_jumlah_halaman = 0,
            buku_penerbit = '-',
            buku_file = '-',
            buku_tahun = 0,
            pengguna_kode = '-',
            _pengguna_jenis = '-',
            _pengguna_nama = '-',
            Prodi = '-'
        } = req.body;
        const newData = new bukuModel({
            Judul: Judul || '-',
            buku_isbn: buku_isbn || '-',
            buku_jumlah_halaman: buku_jumlah_halaman || 0,
            buku_penerbit: buku_penerbit || '-',
            buku_file: buku_file || '-',
            buku_tahun: buku_tahun || 0,
            pengguna_kode: pengguna_kode || '-',
            _pengguna_jenis: _pengguna_jenis || '-',
            _pengguna_nama: _pengguna_nama || '-',
            Prodi: Prodi || '-'
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
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/publikasi/buku';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error deleting publikasi buku data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            Judul = '-',
            buku_isbn = '-',
            buku_jumlah_halaman = 0,
            buku_penerbit = '-',
            buku_file = '-',
            buku_tahun = 0,
            pengguna_kode = '-',
            _pengguna_jenis = '-',
            _pengguna_nama = '-',
            Prodi = '-'
        } = req.body;
        const updatedData = {
            Judul: Judul || '-',
            buku_isbn: buku_isbn || '-',
            buku_jumlah_halaman: buku_jumlah_halaman || 0,
            buku_penerbit: buku_penerbit || '-',
            buku_file: buku_file || '-',
            buku_tahun: buku_tahun || 0,
            pengguna_kode: pengguna_kode || '-',
            _pengguna_jenis: _pengguna_jenis || '-',
            _pengguna_nama: _pengguna_nama || '-',
            Prodi: Prodi || '-'
        };
        await bukuModel.findByIdAndUpdate(id, updatedData);
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/publikasi/buku';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating publikasi buku data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await bukuModel.find({});
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PublikasiBuku');

        // Add header row
        worksheet.addRow([
            'Judul', 'ISBN', 'Jumlah Halaman', 'Penerbit', 'File', 'Tahun', 'Pengguna Kode', 'Jenis Pengguna', 'Nama Pengguna', 'Nama Prodi'
        ]);

        // Add data rows
        data.forEach(item => {
            worksheet.addRow([
                item.Judul || '-',
                item.buku_isbn || '-',
                item.buku_jumlah_halaman || 0,
                item.buku_penerbit || '-',
                item.buku_file || '-',
                item.buku_tahun || 0,
                item.pengguna_kode || '-',
                item._pengguna_jenis || '-',
                item._pengguna_nama || '-',
                item.Prodi || '-'
            ]);
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=publikasi_buku.xlsx');

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting publikasi buku data:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.send("<script>alert('No file uploaded'); window.location.href='/dashboard/publikasi/buku';</script>");
        }
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        // Ambil header kolom dari baris pertama
        const headerRow = worksheet.getRow(1);
        const headers = headerRow.values.slice(1); // values[0] is null

        const expectedHeaders = [
            'Judul', 'buku_isbn', 'buku_jumlah_halaman', 'buku_penerbit', 'buku_file',
            'buku_tahun', 'pengguna_kode', '_pengguna_jenis', '_pengguna_nama', 'Prodi'
        ];

        // Cek apakah header sesuai urutan dan nama
        const isHeaderValid = expectedHeaders.every((h, i) => h === headers[i]);
        if (!isHeaderValid) {
            return res.send("<script>alert('Format kolom tidak sesuai. Kolom harus: " + expectedHeaders.join(', ') + "'); window.location.href='/dashboard/publikasi/buku';</script>");
        }

        // Baca data mulai dari baris kedua
        const dataToInsert = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            const [
                Judul, buku_isbn, buku_jumlah_halaman, buku_penerbit, buku_file,
                buku_tahun, pengguna_kode, _pengguna_jenis, _pengguna_nama, Prodi
            ] = row.values.slice(1); // values[0] is null

            dataToInsert.push({
                Judul: Judul || '-',
                buku_isbn: buku_isbn || '-',
                buku_jumlah_halaman: parseInt(buku_jumlah_halaman) || 0,
                buku_penerbit: buku_penerbit || '-',
                buku_file: buku_file || '-',
                buku_tahun: parseInt(buku_tahun) || 0,
                pengguna_kode: pengguna_kode || '-',
                _pengguna_jenis: _pengguna_jenis || '-',
                _pengguna_nama: _pengguna_nama || '-',
                Prodi: Prodi || '-'
            });
        });

        if (dataToInsert.length > 0) {
            await bukuModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/publikasi/buku');
    } catch (error) {
        console.error('Error importing publikasi buku data:', error);
        res.status(500).send('Internal Server Error. Pastikan file XLSX sesuai format.');
    }
};
