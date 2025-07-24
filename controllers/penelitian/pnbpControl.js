const pnbpModel = require('../../models/penelitian/pnbp');
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
            .skip(skip)
            .limit(limit);

        let prodiOptions = await kategoriOptionModel.find({ kategori: 'prodi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : []; // Ambil opsi prodi dari kategori

        // --- Merender Halaman ---
        res.render('dashboard/penelitian/dash-pnbp', {
            data,
            searchQuery,
            title: 'Penelitian PNBP',
            prodiOptions,
            currentPage: page,
            totalPages,
            limit // Kirim limit ke view agar bisa digunakan di link pagination
        });

    } catch (error) {
        console.error('Error fetching penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createData = async (req, res) => {
    try {
        const {
            Judul = '-', SKEMA = '-', Prodi = '-', Ketua = '-',
            Biaya = 0, Tahun = 0, Nilai = 0
        } = req.body;
        
        // Handle Anggota array from form data
        let Anggota = req.body['Anggota[]'] || [];
        // Ensure Anggota is always an array, even if it contains only one element
        if (!Array.isArray(Anggota)) {
            Anggota = [Anggota];
        }

        const newData = new pnbpModel({
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Prodi: Prodi || '-',
            Ketua: Ketua || '-',
            Anggota: Array.isArray(Anggota) ? Anggota.filter(item => item && item.trim() !== '') : [], 
            Biaya: Biaya || 0,
            Tahun: Tahun || 0,
            Nilai: Nilai || 0
        });

        await newData.save();
        res.redirect('/dashboard/penelitian/pnbp');
    } catch (error) {
        console.error('Error creating penelitian pnbp data:', error);
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
        const currentUrl = req.headers.referer || '/dashboard/penelitian/pnbp';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error deleting penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            Judul, SKEMA, Prodi, Ketua,
            Biaya, Tahun, Nilai
        } = req.body;

        // Handle Anggota array from form data
        let Anggota = req.body['Anggota[]'] || [];
        // Ensure Anggota is always an array, even if it contains only one element
        if (!Array.isArray(Anggota)) {
            Anggota = [Anggota];
        }
        
        const updatedData = {
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Prodi: Prodi || '-',
            Ketua: Ketua || '-',
            Anggota: Array.isArray(Anggota) ? Anggota.filter(item => item && item.trim() !== '') : [],
            Biaya: Biaya || 0,
            Tahun: Tahun || 0,
            Nilai: Nilai || 0
        };

        await pnbpModel.findByIdAndUpdate(id, updatedData);
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/penelitian/pnbp';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await pnbpModel.find({});
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PenelitianPNBP');

        // Define header row
        worksheet.addRow([
            'Judul', 'SKEMA', 'Prodi', 'Ketua',
            'Anggota',
            'Biaya', 'Tahun', 'Nilai'
        ]);

        // Add data rows
        data.forEach(item => {
            worksheet.addRow([
                item.Judul,
                item.SKEMA,
                item.Prodi,
                item.Ketua,
                item.Anggota ? item.Anggota.join(', ') : '-',
                item.Biaya,
                item.Tahun,
                item.Nilai
            ]);
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=penelitian_pnbp.xlsx');

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        console.log('File uploaded:', file);
        if (!file) {
            return res.send("<script>alert('No file uploaded'); window.location.href='/dashboard/penelitian/pnbp';</script>");
        }
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        // Ambil header kolom dari file
        const headers = [];
        worksheet.getRow(1).eachCell(cell => headers.push(cell.value));
        const expectedHeaders = [
            'Judul', 'SKEMA', 'Prodi', 'Ketua',
            'Anggota', // Menggunakan kolom tunggal untuk anggota
            'Biaya', 'Tahun', 'Nilai'
        ];

        // Cek apakah header sesuai urutan dan nama
        const isHeaderValid = expectedHeaders.every((h, i) => h === headers[i]);
        if (!isHeaderValid) {
            return res.send("<script>alert('Format kolom tidak sesuai. Kolom harus: " + expectedHeaders.join(', ') + "'); window.location.href='/dashboard/penelitian/pnbp';</script>");
        }

        // Baca data mulai baris ke-2
        const dataToInsert = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            const [
                Judul, SKEMA, Prodi, Ketua,
                Anggota,
                Biaya, Tahun, Nilai
            ] = row.values.slice(1); // slice(1) karena row.values[0] undefined

            // Parse anggota string menjadi array, handling titles with commas
            let anggotaArray = [];
            if (Anggota && typeof Anggota === 'string') {
                // Split by comma followed by space and a title (Dr., Prof., Ir.) or capital letter
                // This regex looks for comma + space + (title or capital letter) to identify person boundaries
                const parts = Anggota.split(/,\s+(?=(?:Dr\.|Prof\.|Ir\.|\b[A-Z][a-z]+\s+[A-Z]))/);
                anggotaArray = parts.map(item => item.trim()).filter(item => item !== '');
            }

            dataToInsert.push({
                Judul: Judul || '-',
                SKEMA: SKEMA || '-',
                Prodi: Prodi || '-',
                Ketua: Ketua || '-',
                Anggota: anggotaArray,
                Biaya: parseFloat(Biaya) || 0,
                Tahun: parseInt(Tahun) || 0,
                Nilai: parseFloat(Nilai) || 0
            });
        });

        if (dataToInsert.length > 0) {
            await pnbpModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/penelitian/pnbp');
    } catch (error) {
        console.error('Error importing penelitian pnbp data:', error);
        res.status(500).send('Internal Server Error. Pastikan file XLSX sesuai format.');
    }
};

exports.downloadTemplate = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Penelitian PNBP');

        // Define header row
        worksheet.addRow([
            'Judul', 'SKEMA', 'Prodi', 'Ketua',
            'Anggota',
            'Biaya', 'Tahun', 'Nilai'
        ]);

        // Add example data row
        worksheet.addRow([
            'Contoh Judul Penelitian',
            'Penelitian Dosen Pemula',
            'S1 Teknik Informatika',
            'Dr. John Doe, M.T.',
            'Dr. Jane Smith, S.T., M.T., Prof. Dr. Bob Johnson, M.T., Ir. Alice Brown, M.T.',
            50000000,
            2024,
            85.5
        ]);

        // Set column widths
        worksheet.columns = [
            { width: 50 }, // Judul
            { width: 30 }, // SKEMA
            { width: 25 }, // Prodi
            { width: 25 }, // Ketua
            { width: 40 }, // Anggota
            { width: 15 }, // Biaya
            { width: 10 }, // Tahun
            { width: 10 }  // Nilai
        ];

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=template_penelitian_pnbp.xlsx');

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).send('Internal Server Error');
    }
};
