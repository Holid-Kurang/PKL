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
        // Prepare data for worksheet
        const worksheetData = [
            [
            'Judul', 'SKEMA', 'Prodi', 'Ketua',
            'Anggota1', 'Anggota2', 'Anggota3', 'Anggota4',
            'Dana', 'Tahun', 'Nilai'
            ],
            ...data.map(item => [
            item.Judul,
            item.SKEMA,
            item.Prodi,
            item.Ketua,
            item.Anggota1,
            item.Anggota2,
            item.Anggota3,
            item.Anggota4,
            item.Dana,
            item.Tahun,
            item.Nilai
            ])
        ];
        const XLSX = require('xlsx');
        // Create worksheet and workbook
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PengabdianPNBP');

        // Write workbook to XLSX buffer
        const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=pengabdian_pnbp.xlsx');
        res.status(200).send(xlsxBuffer);
    } catch (error) {
        console.error('Error exporting pengabdian pnbp data:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        console.log('File uploaded:', file);
        if (!file) {
            return res.send("<script>alert('No file uploaded'); window.location.href='/dashboard/pengabdian/pnbp';</script>");
        }
        const XLSX = require('xlsx');

        // Baca buffer file xlsx
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Ambil header kolom dari file
        const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || [];
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

        // Konversi worksheet ke array of objects
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: '-' });

        // Map data ke format yang sesuai dengan model
        const dataToInsert = data.map(item => ({
            Judul: item.Judul || '-',
            SKEMA: item.SKEMA || '-',
            Prodi: item.Prodi || '-',
            Ketua: item.Ketua || '-',
            Anggota1: item.Anggota1 || '-',
            Anggota2: item.Anggota2 || '-',
            Anggota3: item.Anggota3 || '-',
            Anggota4: item.Anggota4 || '-',
            Dana: parseFloat(item.Dana) || 0,
            Tahun: parseInt(item.Tahun) || 0,
            Nilai: parseFloat(item.Nilai) || 0
        }));

        if (dataToInsert.length > 0) {
            await pnbpModel.insertMany(dataToInsert);
        }

        res.redirect('/dashboard/pengabdian/pnbp');
    } catch (error) {
        console.error('Error importing pengabdian pnbp data:', error);
        res.status(500).send('Internal Server Error. Pastikan file XLSX sesuai format.');
    }
};
