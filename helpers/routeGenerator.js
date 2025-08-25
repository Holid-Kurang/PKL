const express = require("express");
const multer = require("multer");
const isLogin = require("../middlewares/isLogin");
const { createController } = require("../controllers/controllerFactory");

// Konfigurasi Multer untuk menyimpan file di memori sementara
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Generate routes untuk controller tertentu
 * @param {string} basePath - Path dasar untuk routes (misal: "/dashboard/penelitian/mandiri")
 * @param {string} controllerType - Tipe controller (misal: "penelitian-mandiri")
 * @returns {express.Router} Router dengan semua routes yang sudah dikonfigurasi
 */
function generateRoutes(basePath, controllerType) {
    const router = express.Router();
    const controller = createController(controllerType);

    // Routes untuk CRUD operations
    router.get(basePath, isLogin, controller.getAllData);
    router.post(`${basePath}/create`, isLogin, controller.createData);
    router.put(`${basePath}/update/:id`, isLogin, controller.updateData);
    router.delete(`${basePath}/delete/:id`, isLogin, controller.deleteData);
    
    // Routes untuk Excel operations
    router.get(`${basePath}/export`, isLogin, controller.exportData);
    router.post(`${basePath}/import`, isLogin, upload.single("file"), controller.importData);
    router.get(`${basePath}/template`, isLogin, controller.downloadTemplate);

    return router;
}

/**
 * Generate multiple routes berdasarkan konfigurasi
 * @param {Array} routeConfigs - Array konfigurasi routes
 * @returns {express.Router} Router dengan semua routes yang sudah dikonfigurasi
 */
function generateMultipleRoutes(routeConfigs) {
    const router = express.Router();

    routeConfigs.forEach(config => {
        const subRouter = generateRoutes(config.basePath, config.controllerType);
        router.use(subRouter);
    });

    return router;
}

module.exports = {
    generateRoutes,
    generateMultipleRoutes
};
