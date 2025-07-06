const mandiriModel = require('../../models/penelitian/mandiri');

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
            .sort({ tahun: -1 }) // Mengurutkan berdasarkan tahun terbaru
            .skip(skip)
            .limit(limit);
        // --- Merender Halaman ---
        res.render('dashboard/penelitian/dash-mandiri', {
            data,
            searchQuery,
            title: 'Penelitian Pusat',
            currentPage: page,
            totalPages,
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
            Anggota1 = '-',
            Anggota2 = '-',
            Anggota3 = '-',
            Anggota4 = '-',
            Skema = '-',
            Judul = '-',
            Prodi = '-',
            Dana = 0
        } = req.body;

        const newData = new mandiriModel({
            tahun: tahun || 0,
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
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
            Anggota1,
            Anggota2,
            Anggota3,
            Anggota4,
            Skema,
            Judul,
            Prodi,
            Dana
        } = req.body;

        const updatedData = {
            tahun: tahun || 0,
            Ketua: Ketua || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
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

        // Define columns
        worksheet.columns = [
            { header: 'Judul', key: 'Judul', width: 30 },
            { header: 'Skema', key: 'Skema', width: 20 },
            { header: 'Prodi', key: 'Prodi', width: 20 },
            { header: 'Ketua', key: 'Ketua', width: 20 },
            { header: 'Anggota1', key: 'Anggota1', width: 20 },
            { header: 'Anggota2', key: 'Anggota2', width: 20 },
            { header: 'Anggota3', key: 'Anggota3', width: 20 },
            { header: 'Anggota4', key: 'Anggota4', width: 20 },
            { header: 'Dana', key: 'Dana', width: 15 },
            { header: 'tahun', key: 'tahun', width: 10 }
        ];

        // Add rows
        data.forEach(item => {
            worksheet.addRow({
                Judul: item.Judul,
                Skema: item.Skema,
                Prodi: item.Prodi,
                Ketua: item.Ketua,
                Anggota1: item.Anggota1,
                Anggota2: item.Anggota2,
                Anggota3: item.Anggota3,
                Anggota4: item.Anggota4,
                Dana: item.Dana,
                tahun: item.tahun
            });
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
            'Anggota1', 'Anggota2', 'Anggota3', 'Anggota4',
            'Dana', 'tahun'
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
            const rowData = {};
            fileColumns.forEach((col, idx) => {
                rowData[col] = row.getCell(idx + 1).value || '-';
            });
            dataToInsert.push({
                Judul: rowData.Judul || '-',
                Skema: rowData.Skema || '-',
                Prodi: rowData.Prodi || '-',
                Ketua: rowData.Ketua || '-',
                Anggota1: rowData.Anggota1 || '-',
                Anggota2: rowData.Anggota2 || '-',
                Anggota3: rowData.Anggota3 || '-',
                Anggota4: rowData.Anggota4 || '-',
                Dana: parseFloat(rowData.Dana) || 0,
                tahun: parseInt(rowData.tahun) || 0
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
