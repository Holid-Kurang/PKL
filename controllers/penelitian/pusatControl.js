const pusatModel = require('../../models/penelitian/pusat');

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
                    { JUDUL: regex },
                    { NAMA: regex },
                    { PRODI: regex }, // Pastikan nama field di model adalah 'PRODI'
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
        res.render('dashboard/penelitian/dash-pusat', {
            data,
            searchQuery,
            title: 'Penelitian Pusat',
            currentPage: page,
            totalPages,
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
            Anggota1 = '-',
            Anggota2 = '-',
            Anggota3 = '-',
            Anggota4 = '-',
            NIP = '-',
            NIDN = '-',
            PRODI = '-',
            JUDUL = '-',
            BIAYA = 0
        } = req.body;

        const newData = new pusatModel({
            TAHUN: TAHUN || 0,
            SKEMA: SKEMA || '-',
            NAMA: NAMA || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            NIP: NIP || '-',
            NIDN: NIDN || '-',
            PRODI: PRODI || '-',
            JUDUL: JUDUL || '-',
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
        console.log(currentUrl + searchQuery);
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
            Anggota1,
            Anggota2,
            Anggota3,
            Anggota4,
            NIP,
            NIDN,
            PRODI,
            JUDUL,
            BIAYA
        } = req.body;

        const updatedData = {
            TAHUN: TAHUN || 0,
            SKEMA: SKEMA || '-',
            NAMA: NAMA || '-',
            Anggota1: Anggota1 || '-',
            Anggota2: Anggota2 || '-',
            Anggota3: Anggota3 || '-',
            Anggota4: Anggota4 || '-',
            NIP: NIP || '-',
            NIDN: NIDN || '-',
            PRODI: PRODI || '-',
            JUDUL: JUDUL || '-',
            BIAYA: BIAYA || 0
        };

        await pusatModel.findByIdAndUpdate(id, updatedData);
        // get the current search query url from the request then redirect to the same page after update 
        const currentUrl = req.headers.referer || '/dashboard/penelitian/pusat';
        // If the current URL contains a search query, append it to the redirect
        const searchQuery = req.query.search ? `?search=${req.query.search}` : '';
        // Redirect to the same page with the search query
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating penelitian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await pusatModel.find({});
        // Prepare data for worksheet
        const worksheetData = [
            [
            'TAHUN', 'SKEMA', 'NAMA', 'Anggota1', 'Anggota2', 'Anggota3', 'Anggota4',
            'NIP', 'NIDN', 'PRODI', 'JUDUL', 'BIAYA'
            ],
            ...data.map(item => [
            item.TAHUN,
            item.SKEMA,
            item.NAMA,
            item.Anggota1,
            item.Anggota2,
            item.Anggota3,
            item.Anggota4,
            item.NIP,
            item.NIDN,
            item.PRODI,
            item.JUDUL,
            item.BIAYA
            ])
        ];
        const XLSX = require('xlsx');
        // Create worksheet and workbook
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PenelitianPusat');

        // Write workbook to XLSX buffer
        const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=penelitian_pusat.xlsx');
        res.status(200).send(xlsxBuffer);
    } catch (error) {
        console.error('Error exporting penelitian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        console.log('File uploaded:', file);
        if (!file) {
            return res.send("<script>alert('No file uploaded'); window.location.href='/dashboard/penelitian/pusat';</script>");
        }
        const XLSX = require('xlsx');

        // Baca buffer file xlsx
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Ambil header kolom dari file
        const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || [];
        const expectedHeaders = [
            'TAHUN', 'SKEMA', 'NAMA', 'Anggota1', 'Anggota2', 'Anggota3', 'Anggota4',
            'NIP', 'NIDN', 'PRODI', 'JUDUL', 'BIAYA'
        ];

        // Cek apakah header sesuai urutan dan nama
        const isHeaderValid = expectedHeaders.every((h, i) => h === headers[i]);
        if (!isHeaderValid) {
            return res.send("<script>alert('Format kolom tidak sesuai. Kolom harus: " + expectedHeaders.join(', ') + "'); window.location.href='/dashboard/penelitian/pusat';</script>");
        }

        // Konversi worksheet ke array of objects
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: '-' });

        // Map data ke format yang sesuai dengan model
        const dataToInsert = data.map(item => ({
            TAHUN: parseInt(item.TAHUN) || 0,
            SKEMA: item.SKEMA || '-',
            NAMA: item.NAMA || '-',
            Anggota1: item.Anggota1 || '-',
            Anggota2: item.Anggota2 || '-',
            Anggota3: item.Anggota3 || '-',
            Anggota4: item.Anggota4 || '-',
            NIP: item.NIP || '-',
            NIDN: item.NIDN || '-',
            PRODI: item.PRODI || '-',
            JUDUL: item.JUDUL || '-',
            BIAYA: parseFloat(item.BIAYA) || 0
        }));

        if (dataToInsert.length > 0) {
            await pusatModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/penelitian/pusat');
    } catch (error) {
        console.error('Error importing penelitian pusat data:', error);
        res.status(500).send('Internal Server Error. Pastikan file XLSX sesuai format.');
    }
};