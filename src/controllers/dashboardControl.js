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

        // Extract query parameters for pagination, sorting, and filtering
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const search = req.query.search || '';

        const skip = (page - 1) * limit;

        // Build search query
        let searchQuery = {};
        if (search) {
            // Get model schema fields
            const modelSchema = models[category].schema.obj;
            const searchableFields = Object.keys(modelSchema).filter(key =>
                !['createdAt', 'updatedAt', '__v', '_id'].includes(key)
            );

            // Create OR query for all searchable fields
            searchQuery.$or = searchableFields.map(field => {
                const fieldType = modelSchema[field].type || modelSchema[field];

                // For string fields, use regex search
                if (fieldType === String || (Array.isArray(fieldType) && fieldType[0] === String)) {
                    return { [field]: { $regex: search, $options: 'i' } };
                }

                // For number fields, try exact match if search is a number
                if (fieldType === Number && !isNaN(search)) {
                    return { [field]: Number(search) };
                }

                return null;
            }).filter(query => query !== null);
        }

        // Execute query with pagination
        const [data, totalRecords] = await Promise.all([
            models[category]
                .find(searchQuery)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(), // Use lean() for better performance
            models[category].countDocuments(searchQuery)
        ]);

        const totalPages = Math.ceil(totalRecords / limit);

        res.status(200).json({
            success: true,
            message: 'Data retrieved successfully',
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            success: false,
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

        res.status(201).json({
            success: true,
            message: 'Data created successfully',
            data: newData
        });
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
        // Get statistics from all categories
        const stats = {};
        for (const [category, model] of Object.entries(models)) {
            stats[category] = await model.countDocuments({});
        }

        res.render('dashboard/homeDashboard', {
            title: 'Dashboard',
            stats
        });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).render('404page', {
            title: 'Error',
            message: 'Failed to load dashboard'
        });
    }
};

exports.renderDashboardTable = async (req, res) => {
    try {
        const { section, category } = req.params;
        const fullCategory = `${section}-${category}`;

        // Validate category
        if (!models[fullCategory]) {
            return res.status(404).render('404page', {
                title: 'Error',
                message: 'Invalid category'
            });
        }

        // Get prodi options for the modal
        let prodiOptions = await kategoriModel.find({ kategori: 'Program Studi' });
        prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : [];

        // Get HAKI options if needed
        let hakiOptions = await kategoriModel.find({ kategori: 'Jenis HAKI' });
        hakiOptions = hakiOptions.length > 0 ? hakiOptions[0].option : [];

        // Get model schema to determine fields
        const modelSchema = models[fullCategory].schema.obj;
        const fields = Object.keys(modelSchema).filter(key => !['createdAt', 'updatedAt', '__v', '_id'].includes(key));

        res.render('dashboard/tabelDashboard', {
            title: `Dashboard - ${section} ${category}`,
            section,
            category,
            fullCategory,
            fields,
            prodiOptions: JSON.stringify(prodiOptions),
            hakiOptions: JSON.stringify(hakiOptions)
        });
    } catch (error) {
        console.error('Error rendering dashboard table:', error);
        res.status(500).render('404page', {
            title: 'Error',
            message: 'Failed to load dashboard'
        });
    }
};