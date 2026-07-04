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
const { getDocumentCount } = require('../services/statsService');
const { invalidateStatsCache } = require('../services/cacheService');

// Import utilities
const { transformMongoLongToString } = require('../utils/mongoUtils');
const { buildSearchQuery, buildSortObject } = require('../utils/queryBuilder');
const { parsePaginationParams, validatePaginationParams, calculateSkip, buildPaginationObject } = require('../utils/paginationUtils');
const { validateCategory, validateRequestBody } = require('../utils/validationUtils');
const { createExcelFile, readExcelFile, deleteTempFile } = require('../utils/excelUtils');

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

    // Invalidate stats cache after adding new data
    invalidateStatsCache();

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

    // Invalidate stats cache after deleting data
    invalidateStatsCache();

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

    // Invalidate stats cache after updating data
    invalidateStatsCache();

    res.status(200).json({
        success: true,
        message: 'Data berhasil diperbarui',
        data: updatedData
    });
});

exports.exportDataToExcel = catchAsync(async (req, res, next) => {
    let category = req.params.category;

    // ✅ Validasi category dengan utility
    const categoryValidation = validateCategory(category, models);
    if (!categoryValidation.isValid) {
        return next(new AppError(categoryValidation.error, 400));
    }

    // Get all data without pagination for export
    const data = await models[category].find({}).lean();

    if (!data || data.length === 0) {
        return next(new AppError('Tidak ada data untuk diekspor', 404));
    }

    // Transform MongoDB Long to String
    const transformedData = transformMongoLongToString(data);

    // Konversi data ke format Excel-friendly
    const excelData = transformedData.map(item => {
        const cleanItem = { ...item };

        // Convert ObjectId to string
        if (cleanItem._id) {
            cleanItem._id = cleanItem._id.toString();
        }

        // Format dates to readable format
        if (cleanItem.createdAt) {
            cleanItem.createdAt = new Date(cleanItem.createdAt);
        }
        if (cleanItem.updatedAt) {
            cleanItem.updatedAt = new Date(cleanItem.updatedAt);
        }

        // Remove __v field
        delete cleanItem.__v;

        return cleanItem;
    });

    // Create Excel file
    const filePath = await createExcelFile(excelData, category);
    const filename = `${category}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Send file as download
    res.download(filePath, filename, async (err) => {
        // Delete temp file after download (success or error)
        await deleteTempFile(filePath);

        if (err && !res.headersSent) {
            return next(new AppError('Gagal mendownload file', 500));
        }
    });
});

exports.downloadTemplate = catchAsync(async (req, res, next) => {
    let category = req.params.category;

    // ✅ Validasi category dengan utility
    const categoryValidation = validateCategory(category, models);
    if (!categoryValidation.isValid) {
        return next(new AppError(categoryValidation.error, 400));
    }

    // Get model schema to create template
    const modelSchema = models[category].schema.obj;
    const fields = Object.keys(modelSchema).filter(key =>
        !['createdAt', 'updatedAt', '__v', '_id'].includes(key)
    );

    // Create empty template data with one example row
    const templateData = [{}];

    // Add field names as keys with empty values and example descriptions
    fields.forEach(field => {
        const fieldType = modelSchema[field].type || modelSchema[field];

        // Add example value based on field type
        if (fieldType === String) {
            templateData[0][field] = 'Contoh text';
        } else if (fieldType === Number) {
            templateData[0][field] = 0;
        } else if (fieldType === Date) {
            templateData[0][field] = new Date();
        } else if (Array.isArray(fieldType)) {
            if (fieldType[0] === String) {
                templateData[0][field] = ['Contoh1', 'Contoh2'];
            } else if (fieldType[0] === Number) {
                templateData[0][field] = [1, 2];
            } else {
                templateData[0][field] = [];
            }
        } else {
            templateData[0][field] = '';
        }
    });

    // Create Excel file
    const filePath = await createExcelFile(templateData, `Template ${category}`);
    const filename = `Template_${category}.xlsx`;

    // Send file as download
    res.download(filePath, filename, async (err) => {
        // Delete temp file after download (success or error)
        await deleteTempFile(filePath);

        if (err && !res.headersSent) {
            return next(new AppError('Gagal mendownload template', 500));
        }
    });
});

exports.importDataFromExcel = catchAsync(async (req, res, next) => {
    let category = req.params.category;

    // ✅ Validasi category dengan utility
    const categoryValidation = validateCategory(category, models);
    if (!categoryValidation.isValid) {
        return next(new AppError(categoryValidation.error, 400));
    }

    // Validasi file upload
    const file = req.file;
    if (!file) {
        return next(new AppError('File tidak ditemukan. Silakan upload file Excel', 400));
    }

    // Baca dan parse file Excel
    const data = await readExcelFile(file);

    if (!data || data.length === 0) {
        return next(new AppError('File Excel kosong atau format tidak valid', 400));
    }

    // Get model schema fields
    const modelSchema = models[category].schema.obj;
    const schemaFields = Object.keys(modelSchema).filter(key =>
        !['createdAt', 'updatedAt', '__v', '_id'].includes(key)
    );

    // Get Excel headers
    const excelHeaders = data.length > 0 ? Object.keys(data[0]) : [];

    // Create case-insensitive mapping between Excel headers and schema fields
    const headerMapping = {};
    const unmatchedHeaders = [];
    const missingHeaders = [];

    excelHeaders.forEach(excelHeader => {
        const matchingField = schemaFields.find(schemaField =>
            schemaField.toLowerCase() === excelHeader.toLowerCase()
        );
        if (matchingField) {
            headerMapping[excelHeader] = matchingField;
        } else {
            unmatchedHeaders.push(excelHeader);
        }
    });

    // Check for missing required headers
    schemaFields.forEach(schemaField => {
        const found = Object.values(headerMapping).includes(schemaField);
        if (!found) {
            missingHeaders.push(schemaField);
        }
    });

    // Validate and clean data before inserting
    const cleanedData = data.map(item => {
        const cleaned = {};

        // Map Excel headers to schema fields using case-insensitive mapping
        Object.keys(item).forEach(excelHeader => {
            const schemaField = headerMapping[excelHeader];
            if (schemaField && item[excelHeader] !== null && item[excelHeader] !== undefined) {
                cleaned[schemaField] = item[excelHeader];
            }
        });

        return cleaned;
    });

    // Insert data to database
    const savedData = await models[category].insertMany(cleanedData, {
        ordered: false, // Continue on error
        rawResult: true
    });

    // Delete uploaded file after processing
    await deleteTempFile(file.path);

    // Invalidate stats cache after importing data
    invalidateStatsCache();

    res.status(201).json({
        success: true,
        message: `Berhasil mengimport ${savedData.insertedCount || cleanedData.length} data`,
        data: {
            inserted: savedData.insertedCount || cleanedData.length,
            total: cleanedData.length
        },
        warnings: {
            unmatchedHeaders: unmatchedHeaders.length > 0 ? unmatchedHeaders : null,
            missingHeaders: missingHeaders.length > 0 ? missingHeaders : null
        }
    });
});

exports.renderDashboard = catchAsync(async (req, res, next) => {
    // Get statistics from all categories in parallel
    const categories = Object.keys(models);
    const countPromises = categories.map(category => getDocumentCount(category));
    const counts = await Promise.all(countPromises);

    const stats = {};
    categories.forEach((category, index) => {
        stats[category] = counts[index];
    });

    res.render('dashboard/homeDashboard', {
        title: 'Dashboard',
        stats
    });
});

exports.renderDashboardTable = catchAsync(async (req, res, next) => {
    const { section, category } = req.params;
    const fullCategory = `${section}-${category}`;

    // Validate category
    const categoryValidation = validateCategory(fullCategory, models);
    if (!categoryValidation.isValid) {
        return next(new AppError('Kategori tidak valid', 404));
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
});