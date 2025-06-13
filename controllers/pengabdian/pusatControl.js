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
        // Prepare data for worksheet
        const worksheetData = [
            [
            'Judul', 'SKEMA', 'Nama', 'Anggota1', 'Anggota2', 'Anggota3', 'Anggota4',
            'Dana', 'Tahun', 'NomorKontrakLPPM', 'NIP', 'JumlahAnggota', 'JumlahMshTerlibat'
            ],
            ...data.map(item => [
            item.Judul,
            item.SKEMA,
            item.Nama,
            item.Anggota1,
            item.Anggota2,
            item.Anggota3,
            item.Anggota4,
            item.Dana,
            item.Tahun,
            item.NomorKontrakLPPM,
            item.NIP,
            item.JumlahAnggota,
            item.JumlahMshTerlibat
            ])
        ];
        const XLSX = require('xlsx');
        // Create worksheet and workbook
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PengabdianPusat');

        // Write workbook to XLSX buffer
        const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=pengabdian_pusat.xlsx');
        res.status(200).send(xlsxBuffer);
    } catch (error) {
        console.error('Error exporting pengabdian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
}

exports.importData = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        const csv = require('csv-parser');
        const streamifier = require('streamifier');

        const results = [];

        streamifier.createReadStream(file.buffer)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    const dataToInsert = results.map(item => ({
                        Judul: item.Judul || '-',
                        SKEMA: item.SKEMA || '-',
                        Nama: item.Nama || '-',
                        Anggota1: item.Anggota1 || '-',
                        Anggota2: item.Anggota2 || '-',
                        Anggota3: item.Anggota3 || '-',
                        Anggota4: item.Anggota4 || '-',
                        Dana: parseFloat(item.Dana) || 0,
                        Tahun: parseInt(item.Tahun) || 0,
                        NomorKontrakLPPM: item.NomorKontrakLPPM || '-',
                        NIP: item.NIP || '-',
                        JumlahAnggota: parseInt(item.JumlahAnggota) || 0,
                        JumlahMshTerlibat: parseInt(item.JumlahMshTerlibat) || 0
                    }));

                    if (dataToInsert.length > 0) {
                        await pusatModel.insertMany(dataToInsert);
                    }

                    res.redirect('/dashboard/pengabdian/pusat');
                } catch (err) {
                    console.error('Error saving imported data:', err);
                    res.status(500).send('Error saving imported data. Pastikan kolom di file CSV sesuai dengan format yang dibutuhkan.');
                }
            })
            .on('error', (err) => {
                console.error('Error reading CSV stream:', err);
                res.status(500).send('Error reading CSV file');
            });

    } catch (error) {
        console.error('Error importing pengabdian pusat data:', error);
        res.status(500).send('Internal Server Error');
    }
};