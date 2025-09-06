const ExcelJS = require('exceljs');

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

        const newData = new models[category](req.body);
        await newData.save();

        res.status(201).json({
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

exports.renderDashboard = (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard',
    });
};