const pusatModel = require('../../models/penelitian/pusat');
const ExcelJS = require('exceljs');
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

        // --- Mengambil Data dari Database ---
        // 1. Menghitung total dokumen yang cocok dengan filter untuk pagination
        const totalData = await pusatModel.countDocuments(filter);
        const totalPages = Math.ceil(totalData / limit) || 1; // Pastikan totalPages minimal 1
        // 2. Mengambil data untuk halaman saat ini dengan limit dan skip
        const data = await pusatModel.find(filter)
            .skip(skip)
            .limit(limit);

        let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : []; // Ambil opsi prodi dari kategori

        // --- Merender Halaman ---
        res.render('dashboard/penelitian/dash-pusat', {
            data,
            searchQuery,
            title: 'Penelitian Pusat',
            prodiOptions,
            currentPage: page,
            totalPages,
            totalData, // Tambahkan totalData untuk informasi "Menampilkan X-Y of Z"
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
            NIP = '-',
            NIDN = '-',
            Prodi = '-',
            Judul = '-',
            BIAYA = 0
        } = req.body;

        // Handle Anggota array from form data
        let Anggota = req.body['Anggota[]'] || [];
        // Ensure Anggota is always an array, even if it contains only one element
        if (!Array.isArray(Anggota)) {
            Anggota = [Anggota];
        }

        const newData = new pusatModel({
            TAHUN: TAHUN || 0,
            SKEMA: SKEMA || '-',
            NAMA: NAMA || '-',
            Anggota: Array.isArray(Anggota) ? Anggota.filter(item => item && item.trim() !== '') : [],
            NIP: NIP || '-',
            NIDN: NIDN || '-',
            Prodi: Prodi || '-',
            Judul: Judul || '-',
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
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/penelitian/pusat';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        res.redirect(currentUrl + searchQuery);
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
            NIP,
            NIDN,
            Prodi,
            Judul,
            BIAYA
        } = req.body;

        // Handle Anggota array from form data
        let Anggota = req.body['Anggota[]'] || [];
        // Ensure Anggota is always an array, even if it contains only one element
        if (!Array.isArray(Anggota)) {
            Anggota = [Anggota];
        }

        const updatedData = {
            TAHUN: TAHUN || 0,
            SKEMA: SKEMA || '-',
            NAMA: NAMA || '-',
            Anggota: Array.isArray(Anggota) ? Anggota.filter(item => item && item.trim() !== '') : [],
            NIP: NIP || '-',
            NIDN: NIDN || '-',
            Prodi: Prodi || '-',
            Judul: Judul || '-',
            BIAYA: BIAYA || 0
        };

        await pusatModel.findByIdAndUpdate(id, updatedData);
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/penelitian/pusat';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating penelitian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await pusatModel.find({});
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PenelitianPusat');

        // Define header row
        worksheet.addRow([
            'TAHUN', 'SKEMA', 'NAMA', 'Anggota',
            'NIP', 'NIDN', 'Prodi', 'Judul', 'BIAYA'
        ]);

        // Add data rows
        data.forEach(item => {
            worksheet.addRow([
                item.TAHUN,
                item.SKEMA,
                item.NAMA,
                item.Anggota ? item.Anggota.join(', ') : '-',
                item.NIP,
                item.NIDN,
                item.Prodi,
                item.Judul,
                item.BIAYA
            ]);
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=penelitian_pusat.xlsx');

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting penelitian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        console.log('File uploaded:', file);
        if (!file) {
            return res.send("<script>alert('No file uploaded'); window.location.href='/dashboard/penelitian/pusat';</script>");
        }
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);

        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return res.send("<script>alert('Worksheet tidak ditemukan'); window.location.href='/dashboard/penelitian/pusat';</script>");
        }

        // Ambil header kolom dari baris pertama
        const expectedHeaders = [
            'TAHUN', 'SKEMA', 'NAMA', 'Anggota',
            'NIP', 'NIDN', 'Prodi', 'Judul', 'BIAYA'
        ];
        const headers = [];
        worksheet.getRow(1).eachCell(cell => headers.push(cell.value));

        // Cek apakah header sesuai urutan dan nama
        const isHeaderValid = expectedHeaders.every((h, i) => h === headers[i]);
        if (!isHeaderValid) {
            return res.send("<script>alert('Format kolom tidak sesuai. Kolom harus: " + expectedHeaders.join(', ') + "'); window.location.href='/dashboard/penelitian/pusat';</script>");
        }

        // Baca data mulai dari baris ke-2
        const dataToInsert = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            const [
                TAHUN, SKEMA, NAMA, Anggota,
                NIP, NIDN, Prodi, Judul, BIAYA
            ] = row.values.slice(1); // slice(1) karena row.values[0] undefined

            // Parse anggota string menjadi array, handling titles with commas
            let anggotaArray = [];
            if (Anggota && typeof Anggota === 'string') {
                // Split by comma followed by space and a title (Dr., Prof., Ir.) or capital letter
                const parts = Anggota.split(/,\s+(?=(?:Dr\.|Prof\.|Ir\.|\b[A-Z][a-z]+\s+[A-Z]))/);
                anggotaArray = parts.map(item => item.trim()).filter(item => item !== '');
            }

            dataToInsert.push({
                TAHUN: parseInt(TAHUN) || 0,
                SKEMA: SKEMA || '-',
                NAMA: NAMA || '-',
                Anggota: anggotaArray,
                NIP: NIP || '-',
                NIDN: NIDN || '-',
                Prodi: Prodi || '-',
                Judul: Judul || '-',
                BIAYA: parseFloat(BIAYA) || 0
            });
        });

        if (dataToInsert.length > 0) {
            await pusatModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/penelitian/pusat');
    } catch (error) {
        console.error('Error importing penelitian pusat data:', error);
        res.status(500).send('Internal Server Error. Pastikan file XLSX sesuai format.');
    }
};

exports.downloadTemplate = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Penelitian Pusat');

        // Define header row
        worksheet.addRow([
            'TAHUN', 'SKEMA', 'NAMA', 'Anggota',
            'NIP', 'NIDN', 'Prodi', 'Judul', 'BIAYA'
        ]);

        // Add example data row
        worksheet.addRow([
            2024,
            'Penelitian Fundamental',
            'Dr. John Doe, M.T.',
            'Dr. Jane Smith, S.T., M.T., Prof. Dr. Bob Johnson, M.T., Ir. Alice Brown, M.T.',
            '197001011998021001',
            '0001017001',
            'S1 Teknik Informatika',
            'Contoh Judul Penelitian Pusat',
            75000000
        ]);

        // Set column widths
        worksheet.columns = [
            { width: 10 }, // TAHUN
            { width: 30 }, // SKEMA
            { width: 25 }, // NAMA
            { width: 40 }, // Anggota
            { width: 20 }, // NIP
            { width: 15 }, // NIDN
            { width: 25 }, // Prodi
            { width: 50 }, // Judul
            { width: 15 }  // BIAYA
        ];

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=template_penelitian_pusat.xlsx');

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).send('Internal Server Error');
    }
};