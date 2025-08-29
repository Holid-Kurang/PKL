const express = require("express");
const { generateMultipleRoutes } = require("../helpers/routeGenerator");

// Konfigurasi semua routes dashboard
const dashboardRouteConfigs = [
    // Penelitian routes
    {
        basePath: "/dashboard/penelitian/mandiri",
        controllerType: "penelitian-mandiri"
    },
    {
        basePath: "/dashboard/penelitian/pnbp",
        controllerType: "penelitian-pnbp"
    },
    {
        basePath: "/dashboard/penelitian/pusat",
        controllerType: "penelitian-pusat"
    },
    
    // Pengabdian routes
    {
        basePath: "/dashboard/pengabdian/pnbp",
        controllerType: "pengabdian-pnbp"
    },
    {
        basePath: "/dashboard/pengabdian/pusat",
        controllerType: "pengabdian-pusat"
    },
    
    // Publikasi routes
    {
        basePath: "/dashboard/publikasi/buku",
        controllerType: "publikasi-buku"
    },
    {
        basePath: "/dashboard/publikasi/haki",
        controllerType: "publikasi-haki"
    },
    {
        basePath: "/dashboard/publikasi/jupeng",
        controllerType: "publikasi-jupeng"
    }
];

// Generate semua routes dashboard
const dashboardRoutes = generateMultipleRoutes(dashboardRouteConfigs);

module.exports = dashboardRoutes;
