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
        console.log(currentUrl + searchQuery);
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
        console.log(currentUrl + searchQuery);
        res.redirect(currentUrl + searchQuery);
    } catch (error) {
        console.error('Error updating penelitian mandiri data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.exportData = async (req, res) => {
    try {
        const data = await mandiriModel.find({});
        // Prepare data for worksheet
        const worksheetData = [
            [
            'Judul', 'Skema', 'Prodi', 'Ketua',
            'Anggota1', 'Anggota2', 'Anggota3', 'Anggota4',
            'Dana', 'Tahun'
            ],
            ...data.map(item => [
            item.Judul,
            item.Skema,
            item.Prodi,
            item.Ketua,
            item.Anggota1,
            item.Anggota2,
            item.Anggota3,
            item.Anggota4,
            item.Dana,
            item.tahun
            ])
        ];
        const XLSX = require('xlsx');
        // Create worksheet and workbook
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PenelitianMandiri');

        // Write workbook to XLSX buffer
        const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=penelitian_mandiri.xlsx');
        res.status(200).send(xlsxBuffer);
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
        const csv = require('csv-parser');
        const streamifier = require('streamifier');

        const results = [];

        streamifier.createReadStream(file.buffer)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    // Mapping sesuai field mandiriModel
                    const dataToInsert = results.map(item => ({
                        Judul: item.Judul || '-',
                        Skema: item.Skema || '-',
                        Prodi: item.Prodi || '-',
                        Ketua: item.Ketua || '-',
                        Anggota1: item.Anggota1 || '-',
                        Anggota2: item.Anggota2 || '-',
                        Anggota3: item.Anggota3 || '-',
                        Anggota4: item.Anggota4 || '-',
                        Dana: parseFloat(item.Dana) || 0,
                        tahun: parseInt(item.tahun) || 0
                    }));

                    if (dataToInsert.length > 0) {
                        await mandiriModel.insertMany(dataToInsert);
                    }

                    res.redirect('/dashboard/penelitian/mandiri');
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
        console.error('Error importing penelitian mandiri data:', error);
        res.status(500).send('Internal Server Error');
    }
};
