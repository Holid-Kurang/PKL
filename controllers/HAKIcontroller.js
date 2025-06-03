const HAKI = require('../models/HAKIModel');

// get total HAKI
const getTotalHAKI = async (req, res) => {
    try {
        const totalHAKI = await HAKI.countDocuments();
        res.status(200).json({ totalHAKI });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTotalHAKI
};
