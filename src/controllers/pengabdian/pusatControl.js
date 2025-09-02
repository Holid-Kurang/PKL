const pusatModel = require('../../models/pengabdian/pusat');
const ExcelJS = require('exceljs');

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
                    { Nama: regex },
                    { SKEMA: regex }
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
        // --- Merender Halaman ---
        res.render('dashboard/pengabdian/dash-pusat', {
            data,
            searchQuery,
            title: 'Pengabdian Pusat',
            currentPage: page,
            totalPages,
            totalData,
            limit // Kirim limit ke view agar bisa digunakan di link pagination
        });

    } catch (error) {
        console.error('Error fetching pengabdian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createData = async (req, res) => {
    try {
        // Replace empty fields with '-'
        const {
            Judul = '-',
            SKEMA = '-',
            Nama = '-',
            Dana = 0,
            Tahun = 0,
            NomorKontrakLPPM = '-',
            NIP = '-',
            JumlahAnggota = 0,
            JumlahMshTerlibat = 0
        } = req.body;

        // Handle Anggota array from form data
        let Anggota = req.body['Anggota[]'] || [];
        // Ensure Anggota is always an array, even if it contains only one element
        if (!Array.isArray(Anggota)) {
            Anggota = [Anggota];
        }

        const newData = new pusatModel({
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Nama: Nama || '-',
            Anggota: Array.isArray(Anggota) ? Anggota.filter(item => item && item.trim() !== '') : [], 
            Dana: Dana || 0,
            Tahun: Tahun || 0,
            NomorKontrakLPPM: NomorKontrakLPPM || '-',
            NIP: NIP || '-',
            JumlahAnggota: JumlahAnggota || 0,
            JumlahMshTerlibat: JumlahMshTerlibat || 0
        });

        await newData.save();
        res.redirect('/dashboard/pengabdian/pusat');
    } catch (error) {
        console.error('Error creating pengabdian pusat data:', error);
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
        const currentUrl = req.headers.referer || '/dashboard/pengabdian/pusat';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error deleting pengabdian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateData = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            Judul = '-',
            SKEMA = '-',
            Nama = '-',
            Dana = 0,
            Tahun = 0,
            NomorKontrakLPPM = '-',
            NIP = '-',
            JumlahAnggota = 0,
            JumlahMshTerlibat = 0
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
            Nama: Nama || '-',
            Anggota: Array.isArray(Anggota) ? Anggota.filter(item => item && item.trim() !== '') : [],
            Dana: Dana || 0,
            Tahun: Tahun || 0,
            NomorKontrakLPPM: NomorKontrakLPPM || '-',
            NIP: NIP || '-',
            JumlahAnggota: JumlahAnggota || 0,
            JumlahMshTerlibat: JumlahMshTerlibat || 0
        };

        await pusatModel.findByIdAndUpdate(id, updatedData);
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/pengabdian/pusat';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating pengabdian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await pusatModel.find({});
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PengabdianPusat');

        // Define header row
        worksheet.addRow([
            'Judul', 'SKEMA', 'Nama', 'Anggota',
            'Dana', 'Tahun', 'NomorKontrakLPPM', 'NIP',
            'JumlahAnggota', 'JumlahMshTerlibat'
        ]);

        // Add data rows
        data.forEach(item => {
            worksheet.addRow([
                item.Judul,
                item.SKEMA,
                item.Nama,
                item.Anggota ? item.Anggota.join(', ') : '-',
                item.Dana,
                item.Tahun,
                item.NomorKontrakLPPM,
                item.NIP,
                item.JumlahAnggota,
                item.JumlahMshTerlibat
            ]);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=pengabdian_pusat.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting pengabdian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        console.log('File uploaded:', file);
        if (!file) {
            return res.send("<script>alert('No file uploaded'); window.location.href='/dashboard/pengabdian/pusat';</script>");
        }
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        // Ambil header kolom dari file
        const expectedHeaders = [
            'Judul', 'SKEMA', 'Nama', 'Anggota',
            'Dana', 'Tahun', 'NomorKontrakLPPM', 'NIP',
            'JumlahAnggota', 'JumlahMshTerlibat'
        ];
        const headers = worksheet.getRow(1).values.slice(1); // slice(1) to skip first empty cell

        // Cek apakah header sesuai urutan dan nama
        const isHeaderValid = expectedHeaders.every((h, i) => h === headers[i]);
        if (!isHeaderValid) {
            return res.send("<script>alert('Format kolom tidak sesuai. Kolom harus: " + expectedHeaders.join(', ') + "'); window.location.href='/dashboard/pengabdian/pusat';</script>");
        }

        // Baca data dari baris ke-2 sampai akhir
        const dataToInsert = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // skip header
            const [
                Judul, SKEMA, Nama, Anggota,
                Dana, Tahun, NomorKontrakLPPM, NIP,
                JumlahAnggota, JumlahMshTerlibat
            ] = row.values.slice(1); // slice(1) to skip first empty cell

            // Parse anggota string menjadi array, handling titles with commas
            let anggotaArray = [];
            if (Anggota && typeof Anggota === 'string') {
                // Split by comma followed by space and a title (Dr., Prof., Ir.) or capital letter
                const parts = Anggota.split(/,\s+(?=(?:Dr\.|Prof\.|Ir\.|\b[A-Z][a-z]+\s+[A-Z]))/);
                anggotaArray = parts.map(item => item.trim()).filter(item => item !== '');
            }

            dataToInsert.push({
                Judul: Judul || '-',
                SKEMA: SKEMA || '-',
                Nama: Nama || '-',
                Anggota: anggotaArray,
                Dana: parseFloat(Dana) || 0,
                Tahun: parseInt(Tahun) || 0,
                NomorKontrakLPPM: NomorKontrakLPPM || '-',
                NIP: NIP || '-',
                JumlahAnggota: parseInt(JumlahAnggota) || 0,
                JumlahMshTerlibat: parseInt(JumlahMshTerlibat) || 0
            });
        });

        if (dataToInsert.length > 0) {
            await pusatModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/pengabdian/pusat');
    } catch (error) {
        console.error('Error importing pengabdian pusat data:', error);
        res.status(500).send('Internal Server Error. Pastikan file XLSX sesuai format.');
    }
};

exports.downloadTemplate = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Template Pengabdian Pusat');

        // Define header row
        worksheet.addRow([
            'Judul', 'SKEMA', 'Nama', 'Anggota',
            'Dana', 'Tahun', 'NomorKontrakLPPM', 'NIP',
            'JumlahAnggota', 'JumlahMshTerlibat'
        ]);

        // Add example data row
        worksheet.addRow([
            'Contoh Judul Pengabdian Pusat',
            'Pengabdian Dosen Pemula',
            'Dr. John Doe, M.T.',
            'Dr. Jane Smith, S.T., M.T., Prof. Dr. Bob Johnson, M.T., Ir. Alice Brown, M.T.',
            35000000,
            2024,
            'LPPM-001/2024',
            '197001011998021001',
            3,
            2
        ]);

        // Set column widths
        worksheet.columns = [
            { width: 50 }, // Judul
            { width: 30 }, // SKEMA
            { width: 25 }, // Nama
            { width: 40 }, // Anggota
            { width: 15 }, // Dana
            { width: 10 }, // Tahun
            { width: 20 }, // NomorKontrakLPPM
            { width: 20 }, // NIP
            { width: 15 }, // JumlahAnggota
            { width: 18 }  // JumlahMshTerlibat
        ];

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=template_pengabdian_pusat.xlsx');

        // Write workbook to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).send('Internal Server Error');
    }
};