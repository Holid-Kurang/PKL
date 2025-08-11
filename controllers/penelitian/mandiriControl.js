const mandiriModel = require('../../models/penelitian/mandiri');
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
            .skip(skip)
            .limit(limit);

        let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : []; // Ambil opsi prodi dari kategori
            
        // --- Merender Halaman ---
        res.render('dashboard/penelitian/dash-mandiri', {
            data,
            searchQuery,
            title: 'Penelitian Pusat',
            prodiOptions,
            currentPage: page,
            totalPages,
            totalData,
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
            Skema = '-',
            Judul = '-',
            Prodi = '-',
            Dana = 0
        } = req.body;

        // Handle Anggota array from form data
        let Anggota = req.body['Anggota[]'] || [];
        // Ensure Anggota is always an array, even if it contains only one element
        if (!Array.isArray(Anggota)) {
            Anggota = [Anggota];
        }

        const newData = new mandiriModel({
            tahun: tahun || 0,
            Ketua: Ketua || '-',
            Anggota: Array.isArray(Anggota) ? Anggota.filter(item => item && item.trim() !== '') : [], 
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
        // get the current search query url from the request then redirect to the same page after update
        const currentUrl = req.headers.referer || '/dashboard/penelitian/mandiri';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        res.redirect(currentUrl + searchQuery);
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
            Skema,
            Judul,
            Prodi,
            Dana
        } = req.body;

        // Handle Anggota array from form data
        let Anggota = req.body['Anggota[]'] || [];
        // Ensure Anggota is always an array, even if it contains only one element
        if (!Array.isArray(Anggota)) {
            Anggota = [Anggota];
        }

        const updatedData = {
            tahun: tahun || 0,
            Ketua: Ketua || '-',
            Anggota: Array.isArray(Anggota) ? Anggota.filter(item => item && item.trim() !== '') : [],
            Skema: Skema || '-',
            Judul: Judul || '-',
            Prodi: Prodi || '-',
            Dana: Dana || 0
        };

        await mandiriModel.findByIdAndUpdate(id, updatedData);
        // get the current search query url from the request then redirect to the same page after update
        const currentUrl = req.headers.referer || '/dashboard/penelitian/mandiri';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating penelitian mandiri data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await mandiriModel.find({});
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PenelitianMandiri');

        // Define header row
        worksheet.addRow([
            'Judul', 'Skema', 'Prodi', 'Ketua', 'Anggota',
            'Dana', 'tahun'
        ]);

        // Add data rows
        data.forEach(item => {
            worksheet.addRow([
                item.Judul,
                item.Skema,
                item.Prodi,
                item.Ketua,
                item.Anggota ? item.Anggota.join(', ') : '-',
                item.Dana,
                item.tahun
            ]);
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=penelitian_mandiri.xlsx');

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting penelitian mandiri data:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        // Kolom yang wajib ada
        const requiredColumns = [
            'Judul', 'Skema', 'Prodi', 'Ketua',
            'Anggota', 'Dana', 'tahun'
        ];

        // Ambil header dari baris pertama
        const headerRow = worksheet.getRow(1);
        const fileColumns = headerRow.values.slice(1); // values[0] is null
        const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));
        if (missingColumns.length > 0) {
            return res.status(400).send(
                `Kolom berikut wajib ada di file: ${missingColumns.join(', ')}`
            );
        }

        // Mapping data dari worksheet ke array of objects
        const dataToInsert = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            const [
                Judul, Skema, Prodi, Ketua,
                Anggota, Dana, tahun
            ] = row.values.slice(1); // slice(1) karena row.values[0] undefined

            // Parse anggota string menjadi array, handling titles with commas
            let anggotaArray = [];
            if (Anggota && typeof Anggota === 'string') {
                // Split by comma followed by space and a title (Dr., Prof., Ir.) or capital letter
                const parts = Anggota.split(/,\s+(?=(?:Dr\.|Prof\.|Ir\.|\b[A-Z][a-z]+\s+[A-Z]))/);
                anggotaArray = parts.map(item => item.trim()).filter(item => item !== '');
            }

            dataToInsert.push({
                Judul: Judul || '-',
                Skema: Skema || '-',
                Prodi: Prodi || '-',
                Ketua: Ketua || '-',
                Anggota: anggotaArray,
                Dana: parseFloat(Dana) || 0,
                tahun: parseInt(tahun) || 0
            });
        });

        if (dataToInsert.length > 0) {
            await mandiriModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/penelitian/mandiri');
    } catch (error) {
        console.error('Error importing penelitian mandiri data:', error);
        res.status(500).send('Internal Server Error. Pastikan kolom di file XLSX sesuai dengan format yang dibutuhkan.');
    }
};

exports.downloadTemplate = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Penelitian Mandiri');

        // Define header row
        worksheet.addRow([
            'Judul', 'Skema', 'Prodi', 'Ketua', 'Anggota',
            'Dana', 'tahun'
        ]);

        // Add example data row
        worksheet.addRow([
            'Contoh Judul Penelitian Mandiri',
            'Penelitian Dosen Pemula',
            'S1 Teknik Informatika',
            'Dr. John Doe, M.T.',
            'Dr. Jane Smith, S.T., M.T., Prof. Dr. Bob Johnson, M.T., Ir. Alice Brown, M.T.',
            25000000,
            2024
        ]);

        // Set column widths
        worksheet.columns = [
            { width: 50 }, // Judul
            { width: 30 }, // Skema
            { width: 25 }, // Prodi
            { width: 25 }, // Ketua
            { width: 40 }, // Anggota
            { width: 15 }, // Dana
            { width: 10 }  // tahun
        ];

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=template_penelitian_mandiri.xlsx');

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).send('Internal Server Error');
    }
};
