const express = require("express");
const route = express.Router();

const homeRoutes = require("./homeRoute");
const loginRoutes = require("./loginRoute");
const pengabdianRoutes = require("./pengabdianRoute");
const penelitianRoutes = require("./penelitianRoute");
const publikasiRoutes = require("./publikasiRoute");

// Dashboard routes for penelitian
const dashboardPenelitianPNBPRoutes = require("./dashboardRoute/penelitian/pnbp");
const dashboardPenelitianPusatRoutes = require("./dashboardRoute/penelitian/pusat");
const dashboardPenelitianMandiriRoutes = require("./dashboardRoute/penelitian/mandiri");
// Dashboard routes for pengabdian
const dashboardPengabdianPNBPRoutes = require("./dashboardRoute/pengabdian/pnbp");
const dashboardPengabdianPusatRoutes = require("./dashboardRoute/pengabdian/pusat");
// dashboard routes for publikasi
const dashboardPublikasiBukuRoutes = require("./dashboardRoute/publikasi/buku");
const dashboardPublikasiJupengRoutes = require("./dashboardRoute/publikasi/jupeng");
const dashboardPublikasiHAKIRoutes = require("./dashboardRoute/publikasi/haki");
// dashboard for download template
const dashboardDownloadTemplateRoutes = require("./dashboardRoute/downloadTemplateRoute");
// dashboard for prodi
const prodiRoutes = require("./prodiRoute");


// Gunakan route yang sudah dibuat
route.use("/", homeRoutes);
route.use("/", loginRoutes);
route.use("/", pengabdianRoutes);
route.use("/", penelitianRoutes);
route.use("/", publikasiRoutes);
route.use("/", dashboardPenelitianPNBPRoutes);
route.use("/", dashboardPenelitianPusatRoutes);
route.use("/", dashboardPenelitianMandiriRoutes);
route.use("/", dashboardPengabdianPNBPRoutes);
route.use("/", dashboardPengabdianPusatRoutes);
route.use("/", dashboardPublikasiBukuRoutes);
route.use("/", dashboardPublikasiJupengRoutes);
route.use("/", dashboardPublikasiHAKIRoutes);
route.use("/", dashboardDownloadTemplateRoutes);
route.use("/", prodiRoutes);

module.exports = route;