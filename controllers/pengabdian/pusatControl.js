const pusatModel = require('../../models/pengabdian/pusat');

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
            .sort({ TAHUN: -1 }) // Mengurutkan berdasarkan tahun terbaru
            .skip(skip)
            .limit(limit);
        // --- Merender Halaman ---
        res.render('dashboard/pengabdian/dash-pusat', {
            data,
            searchQuery,
            title: 'Pengabdian Pusat',
            currentPage: page,
            totalPages,
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
            Anggota1 = '-',
            Anggota2 = '-',
            Anggota3 = '-',
            Anggota4 = '-',
            Dana = 0,
            Tahun = 0,
            NomorKontrakLPPM = '-',
            NIP = '-',
            JumlahAnggota = 0,
            JumlahMshTerlibat = 0
        } = req.body;

        const newData = new pusatModel({
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Nama: Nama || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
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
        console.log(currentUrl + searchQuery);
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
            Anggota1 = '-',
            Anggota2 = '-',
            Anggota3 = '-',
            Anggota4 = '-',
            Dana = 0,
            Tahun = 0,
            NomorKontrakLPPM = '-',
            NIP = '-',
            JumlahAnggota = 0,
            JumlahMshTerlibat = 0
        } = req.body;

        const updatedData = {
            Judul: Judul || '-',
            SKEMA: SKEMA || '-',
            Nama: Nama || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
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
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating pengabdian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await pusatModel.find({});
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PengabdianPusat');

        // Define columns
        worksheet.columns = [
            { header: 'Judul', key: 'Judul', width: 30 },
            { header: 'SKEMA', key: 'SKEMA', width: 20 },
            { header: 'Nama', key: 'Nama', width: 25 },
            { header: 'Anggota1', key: 'Anggota1', width: 20 },
            { header: 'Anggota2', key: 'Anggota2', width: 20 },
            { header: 'Anggota3', key: 'Anggota3', width: 20 },
            { header: 'Anggota4', key: 'Anggota4', width: 20 },
            { header: 'Dana', key: 'Dana', width: 15 },
            { header: 'Tahun', key: 'Tahun', width: 10 },
            { header: 'NomorKontrakLPPM', key: 'NomorKontrakLPPM', width: 25 },
            { header: 'NIP', key: 'NIP', width: 20 },
            { header: 'JumlahAnggota', key: 'JumlahAnggota', width: 15 },
            { header: 'JumlahMshTerlibat', key: 'JumlahMshTerlibat', width: 18 }
        ];

        // Add rows
        data.forEach(item => {
            worksheet.addRow({
                Judul: item.Judul,
                SKEMA: item.SKEMA,
                Nama: item.Nama,
                Anggota1: item.Anggota1,
                Anggota2: item.Anggota2,
                Anggota3: item.Anggota3,
                Anggota4: item.Anggota4,
                Dana: item.Dana,
                Tahun: item.Tahun,
                NomorKontrakLPPM: item.NomorKontrakLPPM,
                NIP: item.NIP,
                JumlahAnggota: item.JumlahAnggota,
                JumlahMshTerlibat: item.JumlahMshTerlibat
            });
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
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.worksheets[0];

        // Ambil header kolom dari file
        const expectedHeaders = [
            'Judul', 'SKEMA', 'Nama', 'Anggota1', 'Anggota2', 'Anggota3', 'Anggota4',
            'Dana', 'Tahun', 'NomorKontrakLPPM', 'NIP', 'JumlahAnggota', 'JumlahMshTerlibat'
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
                Judul, SKEMA, Nama, Anggota1, Anggota2, Anggota3, Anggota4,
                Dana, Tahun, NomorKontrakLPPM, NIP, JumlahAnggota, JumlahMshTerlibat
            ] = row.values.slice(1); // slice(1) to skip first empty cell

            dataToInsert.push({
                Judul: Judul || '-',
                SKEMA: SKEMA || '-',
                Nama: Nama || '-',
                Anggota1: Anggota1 || '-',
                Anggota2: Anggota2 || '-',
                Anggota3: Anggota3 || '-',
                Anggota4: Anggota4 || '-',
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