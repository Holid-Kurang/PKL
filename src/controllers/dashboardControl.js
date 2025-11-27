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
const AppError = require('../utils/AppError');
const { catchAsync } = require('../middlewares/errorHandler');

// Import utilities
const { transformMongoLongToString } = require('../utils/mongoUtils');
const { buildSearchQuery, buildSortObject } = require('../utils/queryBuilder');
const { parsePaginationParams, validatePaginationParams, calculateSkip, buildPaginationObject } = require('../utils/paginationUtils');
const { validateCategory, validateRequestBody } = require('../utils/validationUtils');

exports.getAllData = catchAsync(async (req, res, next) => {
    let category = req.params.category;

    // ✅ Validasi category dengan whitelist menggunakan utility
    const categoryValidation = validateCategory(category, models);
    if (!categoryValidation.isValid) {
        return next(new AppError(categoryValidation.error, 400));
    }

    // Parse dan validasi pagination parameters
    const { page, limit } = parsePaginationParams(req.query);
    const paginationValidation = validatePaginationParams(page, limit);
    if (!paginationValidation.isValid) {
        return next(new AppError(paginationValidation.error, 400));
    }

    // Extract query parameters
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    const search = req.query.search || '';

    // Calculate skip menggunakan utility
    const skip = calculateSkip(page, limit);

    // Build search query menggunakan utility
    const modelSchema = models[category].schema.obj;
    const searchQuery = buildSearchQuery(search, modelSchema);

    // Build sort object menggunakan utility
    const sortObject = buildSortObject(sortBy, sortOrder);

    // Execute query with pagination
    const [data, totalRecords] = await Promise.all([
        models[category]
            .find(searchQuery)
            .sort(sortObject)
            .skip(skip)
            .limit(limit)
            .lean(), // Use lean() for better performance
        models[category].countDocuments(searchQuery)
    ]);

    // Transform data menggunakan utility
    const transformedData = transformMongoLongToString(data);

    // Build pagination object menggunakan utility
    const pagination = buildPaginationObject(page, limit, totalRecords);

    res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: transformedData,
        pagination
    });
});

exports.createData = catchAsync(async (req, res, next) => {
    let category = req.params.category;

    // ✅ Validasi category dengan utility
    const categoryValidation = validateCategory(category, models);
    if (!categoryValidation.isValid) {
        return next(new AppError(categoryValidation.error, 400));
    }

    // Validasi request body menggunakan utility
    const bodyValidation = validateRequestBody(req.body);
    if (!bodyValidation.isValid) {
        return next(new AppError(bodyValidation.error, 400));
    }

    // Buat instance model baru dengan data dari req.body
    const newData = new models[category](req.body);
    await newData.save();

    res.status(201).json({
        success: true,
        message: 'Data berhasil ditambahkan',
        data: newData
    });
});

exports.deleteData = catchAsync(async (req, res, next) => {
    let category = req.params.category;
    let id = req.params.id;

    // ✅ Validasi category dengan utility
    const categoryValidation = validateCategory(category, models);
    if (!categoryValidation.isValid) {
        return next(new AppError(categoryValidation.error, 400));
    }

    const deletedData = await models[category].findByIdAndDelete(id);
    if (!deletedData) {
        return next(new AppError('Data tidak ditemukan', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Data berhasil dihapus',
        data: deletedData
    });
});

exports.updateData = catchAsync(async (req, res, next) => {
    let category = req.params.category;
    let id = req.params.id;

    // ✅ Validasi category dengan utility
    const categoryValidation = validateCategory(category, models);
    if (!categoryValidation.isValid) {
        return next(new AppError(categoryValidation.error, 400));
    }

    // Validasi request body menggunakan utility
    const bodyValidation = validateRequestBody(req.body);
    if (!bodyValidation.isValid) {
        return next(new AppError(bodyValidation.error, 400));
    }

    const updatedData = await models[category].findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedData) {
        return next(new AppError('Data tidak ditemukan', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Data berhasil diperbarui',
        data: updatedData
    });
});

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