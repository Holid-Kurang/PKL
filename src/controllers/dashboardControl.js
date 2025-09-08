const models = {
    'penelitian-pnbp': require('../models/penelitian/pnbp'),
    'penelitian-pusat': require('../models/penelitian/pusat'),
    'penelitian-mandiri': require('../models/penelitian/mandiri'),
    'pengabdian-pnbp': require('../models/pengabdian/pnbp'),
    'pengabdian-pusat': require('../models/pengabdian/pusat'),
    'publikasi-buku': require('../models/publikasi/bukuModel'),
    'publikasi-haki': require('../models/publikasi/HAKIModel'),
    'publikasi-jupeng': require('../models/publikasi/jupengModel')
};

const kategoriModel = require('../models/kategoriOptionModel');

exports.getAllData = async (req, res) => {
    try {
        let category = req.params.category;

        // ✅ Validasi category dengan whitelist
        if (!models[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category',
                validCategories: Object.keys(models)
            });
        }

        const data = await models[category].find({})
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            message: 'Data retrieved successfully',
            data
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            message: 'Failed to retrieve data',
            error: 'Internal Server Error'
        });
    }
}

exports.createData = async (req, res) => {
    try {
        let category = req.params.category;

        // ✅ Validasi category dengan whitelist
        if (!models[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category',
                validCategories: Object.keys(models)
            });
        }
        console.log('Request body:', req.body); // Debug: log the request body
        // Buat instance model baru dengan data dari req.body
        const newData = new models[category](req.body);
        await newData.save();

        res.status(201)
    } catch (error) {
        console.error('Error creating data:', error);
        res.status(500).json({
            message: 'Failed to create data',
            error: 'Internal Server Error'
        });
    }
}

exports.deleteData = async (req, res) => {
    try {
        let category = req.params.category;
        let id = req.params.id;

        // ✅ Validasi category dengan whitelist
        if (!models[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category',
                validCategories: Object.keys(models)
            });
        }

        const deletedData = await models[category].findByIdAndDelete(id);
        if (!deletedData) {
            return res.status(404).json({
                success: false,
                message: 'Data not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data deleted successfully',
            data: deletedData
        });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({
            message: 'Failed to delete data',
            error: 'Internal Server Error'
        });
    }
}

exports.updateData = async (req, res) => {
    try {
        let category = req.params.category;
        let id = req.params.id;

        // ✅ Validasi category dengan whitelist
        if (!models[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category',
                validCategories: Object.keys(models)
            });
        }

        const updatedData = await models[category].findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedData) {
            return res.status(404).json({
                success: false,
                message: 'Data not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data updated successfully',
            data: updatedData
        });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({
            message: 'Failed to update data',
            error: 'Internal Server Error'
        });
    }
}

exports.exportDataToExcel = async (req, res) => {
    try {
        let category = req.params.category;
        // ✅ Validasi category dengan whitelist
        if (!models[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category',
                validCategories: Object.keys(models)
            });
        }

        const data = await models[category].find({});
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No data found'
            });
        }

        // Konversi data ke format Excel
        const excelData = data.map(item => {
            return {
                ...item._doc,
                createdAt: item.createdAt.toISOString(),
                updatedAt: item.updatedAt.toISOString()
            };
        });

        // Kirim file Excel sebagai response
        const filePath = await createExcelFile(excelData);
        res.download(filePath, 'data.xlsx', err => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({
                    message: 'Failed to download file',
                    error: 'Internal Server Error'
                });
            }
        });
    } catch (error) {
        console.error('Error exporting data to Excel:', error);
        res.status(500).json({
            message: 'Failed to export data',
            error: 'Internal Server Error'
        });
    }
}

exports.importDataFromExcel = async (req, res) => {
    try {
        let category = req.params.category;
        // ✅ Validasi category dengan whitelist
        if (!models[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category',
                validCategories: Object.keys(models)
            });
        }

        // Proses upload file Excel
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Baca dan proses file Excel
        const data = await readExcelFile(file);
        if (!data || data.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Excel file'
            });
        }

        // Simpan data ke database
        const savedData = await models[category].insertMany(data);
        res.status(201).json({
            success: true,
            message: 'Data imported successfully',
            data: savedData
        });
    } catch (error) {
        console.error('Error importing data from Excel:', error);
        res.status(500).json({
            message: 'Failed to import data',
            error: 'Internal Server Error'
        });
    }
}

exports.renderDashboard = async (req, res) => {
    try {
        // Get prodi options for the modal
        let prodiOptions = await kategoriModel.find({ kategori: 'Program Studi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : [];
        let hakiOptions = await kategoriModel.find({ kategori: 'Jenis HAKI' });
        hakiOptions = hakiOptions.length > 0 ? hakiOptions[0].option : []; // Ambil opsi haki dari kategori

        res.render('dashboard', {
            title: 'Dashboard',
            prodiOptions: JSON.stringify(prodiOptions),
            hakiOptions: JSON.stringify(hakiOptions)
        });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).render('404page', {
            title: 'Error',
            message: 'Failed to load dashboard'
        });
    }
};