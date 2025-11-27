const KategoriOption = require('../models/kategoriOptionModel');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../middlewares/errorHandler');

// Get all kategori
const getAllKategori = catchAsync(async (req, res, next) => {
    const kategori = await KategoriOption.find({});
    res.json({
        success: true,
        data: kategori
    });
});

// Add new kategori
const addKategori = catchAsync(async (req, res, next) => {
    const { kategori, firstOption } = req.body;

    // Check if kategori already exists
    const existingKategori = await KategoriOption.findOne({ kategori: kategori });
    if (existingKategori) {
        return next(new AppError('Kategori sudah ada', 400));
    }

    // Create new kategori
    const newKategori = new KategoriOption({
        kategori: kategori,
        option: firstOption ? [firstOption] : []
    });

    await newKategori.save();

    res.json({
        success: true,
        message: 'Kategori berhasil ditambahkan',
        data: newKategori
    });
});

// Update kategori name
const updateKategori = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { kategori } = req.body;

    const updatedKategori = await KategoriOption.findByIdAndUpdate(
        id,
        { kategori },
        { new: true }
    );

    if (!updatedKategori) {
        return next(new AppError('Kategori tidak ditemukan', 404));
    }

    res.json({
        success: true,
        message: 'Kategori berhasil diupdate',
        data: updatedKategori
    });
});


// Add option to kategori
const addOption = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { option } = req.body;

    const kategori = await KategoriOption.findById(id);
    if (!kategori) {
        return next(new AppError('Kategori tidak ditemukan', 404));
    }

    // Check if option already exists
    if (kategori.option.includes(option)) {
        return next(new AppError('Option sudah ada', 400));
    }

    kategori.option.push(option);
    await kategori.save();

    res.json({
        success: true,
        message: 'Option berhasil ditambahkan',
        data: kategori
    });
});

// Remove option from kategori
const removeOption = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { option } = req.body;

    const kategori = await KategoriOption.findById(id);
    if (!kategori) {
        return next(new AppError('Kategori tidak ditemukan', 404));
    }

    kategori.option = kategori.option.filter(opt => opt !== option);
    await kategori.save();

    res.json({
        success: true,
        message: 'Option berhasil dihapus',
        data: kategori
    });
});

module.exports = {
    getAllKategori,
    addKategori,
    updateKategori,
    addOption,
    removeOption
};
