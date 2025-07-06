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
            Nilai = 0, Dana = 0, Prodi = '-', Tahun = 0
        } = req.body;

        const newData = new pnbpModel({
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            Nilai: Nilai || 0,
            Dana: Dana || 0,
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
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/pengabdian/pnbp';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
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
            Nilai, Dana, Prodi, Tahun
        } = req.body;

        const updatedData = {
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            Nilai: Nilai || 0,
            Dana: Dana || 0,
            Prodi: Prodi || '-',
            Tahun: Tahun || 0
        };

        await pnbpModel.findByIdAndUpdate(id, updatedData);
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/pengabdian/pnbp';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating pengabdian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await pnbpModel.find({});
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PengabdianPNBP');

        // Define columns
        worksheet.columns = [
            { header: 'Judul', key: 'Judul', width: 30 },
            { header: 'SKEMA', key: 'SKEMA', width: 20 },
            { header: 'Prodi', key: 'Prodi', width: 20 },
            { header: 'Ketua', key: 'Ketua', width: 25 },
            { header: 'Anggota1', key: 'Anggota1', width: 25 },
            { header: 'Anggota2', key: 'Anggota2', width: 25 },
            { header: 'Anggota3', key: 'Anggota3', width: 25 },
            { header: 'Anggota4', key: 'Anggota4', width: 25 },
            { header: 'Dana', key: 'Dana', width: 15 },
            { header: 'Tahun', key: 'Tahun', width: 10 },
            { header: 'Nilai', key: 'Nilai', width: 10 }
        ];

        // Add rows
        data.forEach(item => {
            worksheet.addRow({
                Judul: item.Judul,
                SKEMA: item.SKEMA,
                Prodi: item.Prodi,
                Ketua: item.Ketua,
                Anggota1: item.Anggota1,
                Anggota2: item.Anggota2,
                Anggota3: item.Anggota3,
                Anggota4: item.Anggota4,
                Dana: item.Dana,
                Tahun: item.Tahun,
                Nilai: item.Nilai
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=pengabdian_pnbp.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting pengabdian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        console.log('File uploaded:', file);
        if (!file) {
            return res.send("<script>alert('No file uploaded'); window.location.href='/dashboard/pengabdian/pnbp';</script>");
        }
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return res.send("<script>alert('Worksheet tidak ditemukan'); window.location.href='/dashboard/pengabdian/pnbp';</script>");
        }

        // Ambil header kolom dari baris pertama
        const headerRow = worksheet.getRow(1);
        const headers = headerRow.values.slice(1); // values[0] is null
        const expectedHeaders = [
            'Judul', 'SKEMA', 'Prodi', 'Ketua',
            'Anggota1', 'Anggota2', 'Anggota3', 'Anggota4',
            'Dana', 'Tahun', 'Nilai'
        ];

        // Cek apakah header sesuai urutan dan nama
        const isHeaderValid = expectedHeaders.every((h, i) => h === headers[i]);
        if (!isHeaderValid) {
            return res.send("<script>alert('Format kolom tidak sesuai. Kolom harus: " + expectedHeaders.join(', ') + "'); window.location.href='/dashboard/pengabdian/pnbp';</script>");
        }

        // Baca data mulai dari baris kedua
        const dataToInsert = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            const [
                Judul, SKEMA, Prodi, Ketua,
                Anggota1, Anggota2, Anggota3, Anggota4,
                Dana, Tahun, Nilai
            ] = row.values.slice(1); // values[0] is null

            dataToInsert.push({
                Judul: Judul || '-',
                SKEMA: SKEMA || '-',
                Prodi: Prodi || '-',
                Ketua: Ketua || '-',
                Anggota1: Anggota1 || '-',
                Anggota2: Anggota2 || '-',
                Anggota3: Anggota3 || '-',
                Anggota4: Anggota4 || '-',
                Dana: parseFloat(Dana) || 0,
                Tahun: parseInt(Tahun) || 0,
                Nilai: parseFloat(Nilai) || 0
            });
        });

        if (dataToInsert.length > 0) {
            await pnbpModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/pengabdian/pnbp');
    } catch (error) {
        console.error('Error importing pengabdian pnbp data:', error);
        res.status(500).send('Internal Server Error. Pastikan file XLSX sesuai format.');
    }
};
