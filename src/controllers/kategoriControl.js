const KategoriOption = require('../models/kategoriOptionModel');

// Get all kategori
const getAllKategori = async (req, res) => {
    try {
        const kategori = await KategoriOption.find({});
        res.json({
            success: true,
            data: kategori
        });
    } catch (error) {
        console.error('Error getting kategori:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kategori'
        });
    }
};

// Add new kategori
const addKategori = async (req, res) => {
    try {
        const { kategori, firstOption } = req.body;

        // Check if kategori already exists
        const existingKategori = await KategoriOption.findOne({ kategori: kategori });
        if (existingKategori) {
            return res.status(400).json({
                success: false,
                message: 'Kategori sudah ada'
            });
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
    } catch (error) {
        console.error('Error adding kategori:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan kategori'
        });
    }
};

// Update kategori name
const updateKategori = async (req, res) => {
    try {
        const { id } = req.params;
        const { kategori } = req.body;

        const updatedKategori = await KategoriOption.findByIdAndUpdate(
            id,
            { kategori },
            { new: true }
        );

        if (!updatedKategori) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Kategori berhasil diupdate',
            data: updatedKategori
        });
    } catch (error) {
        console.error('Error updating kategori:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate kategori'
        });
    }
};

// Delete kategori
const deleteKategori = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedKategori = await KategoriOption.findByIdAndDelete(id);

        if (!deletedKategori) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Kategori berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting kategori:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus kategori'
        });
    }
};

// Add option to kategori
const addOption = async (req, res) => {
    try {
        const { id } = req.params;
        const { option } = req.body;

        const kategori = await KategoriOption.findById(id);
        if (!kategori) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        // Check if option already exists
        if (kategori.option.includes(option)) {
            return res.status(400).json({
                success: false,
                message: 'Option sudah ada'
            });
        }

        kategori.option.push(option);
        await kategori.save();

        res.json({
            success: true,
            message: 'Option berhasil ditambahkan',
            data: kategori
        });
    } catch (error) {
        console.error('Error adding option:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan option'
        });
    }
};

// Remove option from kategori
const removeOption = async (req, res) => {
    try {
        const { id } = req.params;
        const { option } = req.body;

        const kategori = await KategoriOption.findById(id);
        if (!kategori) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan'
            });
        }

        kategori.option = kategori.option.filter(opt => opt !== option);
        await kategori.save();

        res.json({
            success: true,
            message: 'Option berhasil dihapus',
            data: kategori
        });
    } catch (error) {
        console.error('Error removing option:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus option'
        });
    }
};

module.exports = {
    getAllKategori,
    addKategori,
    updateKategori,
    deleteKategori,
    addOption,
    removeOption
};
