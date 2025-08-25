const ExcelJS = require('exceljs');
const kategoriOptionModel = require('../models/kategoriOptionModel');

class BaseController {
    constructor(model, viewPath, title, searchFields = [], excelFields = []) {
        this.model = model;
        this.viewPath = viewPath;
        this.title = title;
        this.searchFields = searchFields;
        this.excelFields = excelFields;
    }

    // Read dan Search
    getAllData = async (req, res) => {
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
                    $or: this.searchFields.map(field => ({ [field]: regex }))
                };
            }

            // --- Mengambil Data dari Database ---
            // 1. Menghitung total dokumen yang cocok dengan filter untuk pagination
            const totalData = await this.model.countDocuments(filter);
            const totalPages = Math.ceil(totalData / limit) || 1; // Pastikan totalPages minimal 1
            // 2. Mengambil data untuk halaman saat ini dengan limit dan skip
            const data = await this.model.find(filter)
                .skip(skip)
                .limit(limit);

            let prodiOptions = await kategoriOptionModel.find({ kategori: 'Program Studi' });
            prodiOptions = prodiOptions.length > 0 ? prodiOptions[0].option : []; // Ambil opsi prodi dari kategori
                
            // --- Merender Halaman ---
            res.render(this.viewPath, {
                data,
                searchQuery,
                title: this.title,
                prodiOptions,
                currentPage: page,
                totalPages,
                limit,
                totalData,
                isLogin: req.session.isLogin || false
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Terjadi kesalahan server');
        }
    };

    // Create Data
    createData = async (req, res) => {
        try {
            // Membuat data baru berdasarkan body request
            const newData = new this.model(req.body);
            await newData.save();
            
            // Redirect kembali ke halaman utama setelah berhasil menyimpan
            res.redirect(req.get('Referer') || '/');
        } catch (error) {
            console.error('Error creating data:', error);
            res.status(500).send('Terjadi kesalahan saat menyimpan data');
        }
    };

    // Update Data
    updateData = async (req, res) => {
        try {
            const { id } = req.params;
            
            // Update data berdasarkan ID
            await this.model.findByIdAndUpdate(id, req.body);
            
            // Redirect kembali ke halaman utama setelah berhasil update
            res.redirect(req.get('Referer') || '/');
        } catch (error) {
            console.error('Error updating data:', error);
            res.status(500).send('Terjadi kesalahan saat mengupdate data');
        }
    };

    // Delete Data
    deleteData = async (req, res) => {
        try {
            const { id } = req.params;
            
            // Hapus data berdasarkan ID
            await this.model.findByIdAndDelete(id);
            
            // Redirect kembali ke halaman utama setelah berhasil menghapus
            res.redirect(req.get('Referer') || '/');
        } catch (error) {
            console.error('Error deleting data:', error);
            res.status(500).send('Terjadi kesalahan saat menghapus data');
        }
    };

    // Export Data ke Excel
    exportData = async (req, res) => {
        try {
            // Ambil semua data dari database
            const data = await this.model.find({});

            // Buat workbook baru
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(this.title);

            // Definisikan header kolom
            const headers = this.excelFields.map(field => field.header);
            worksheet.addRow(headers);

            // Tambahkan data ke worksheet
            data.forEach(item => {
                const row = this.excelFields.map(field => {
                    if (field.key === 'Anggota' && Array.isArray(item[field.key])) {
                        return item[field.key].join(', ');
                    }
                    return item[field.key] || '';
                });
                worksheet.addRow(row);
            });

            // Set header response untuk download file
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${this.title.replace(/\s+/g, '_')}.xlsx"`);

            // Kirim file Excel ke client
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error exporting data:', error);
            res.status(500).send('Terjadi kesalahan saat mengekspor data');
        }
    };

    // Import Data dari Excel
    importData = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).send('File tidak ditemukan');
            }

            // Baca file Excel dari buffer
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(req.file.buffer);
            const worksheet = workbook.getWorksheet(1);

            // Array untuk menyimpan data yang akan diimport
            const importedData = [];

            // Iterasi melalui setiap baris (mulai dari baris ke-2, karena baris pertama adalah header)
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber > 1) { // Skip header row
                    const rowData = {};
                    
                    // Map setiap kolom ke field yang sesuai
                    this.excelFields.forEach((field, index) => {
                        const cellValue = row.getCell(index + 1).value;
                        
                        if (field.key === 'Anggota' && cellValue) {
                            // Split string anggota menjadi array
                            rowData[field.key] = cellValue.split(',').map(name => name.trim()).filter(name => name);
                        } else {
                            rowData[field.key] = cellValue;
                        }
                    });

                    importedData.push(rowData);
                }
            });

            // Simpan semua data ke database
            await this.model.insertMany(importedData);

            // Redirect kembali ke halaman utama setelah berhasil import
            res.redirect(req.get('Referer') || '/');
        } catch (error) {
            console.error('Error importing data:', error);
            res.status(500).send('Terjadi kesalahan saat mengimport data');
        }
    };

    // Download Template Excel
    downloadTemplate = async (req, res) => {
        try {
            // Buat workbook baru
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Template');

            // Definisikan header kolom
            const headers = this.excelFields.map(field => field.header);
            worksheet.addRow(headers);

            // Set header response untuk download file
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="Template_${this.title.replace(/\s+/g, '_')}.xlsx"`);

            // Kirim file template ke client
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error downloading template:', error);
            res.status(500).send('Terjadi kesalahan saat mendownload template');
        }
    };
}

module.exports = BaseController;
