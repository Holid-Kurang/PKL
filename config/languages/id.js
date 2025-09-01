module.exports = {
    // Welcome section
    welcome: {
        title: "Selamat Datang",
        description: "Website ini dirancang untuk memberikan informasi terkait kegiatan akademik di Fakultas Teknik Universitas Mataram, khususnya dalam bidang penelitian, pengabdian kepada masyarakat, dan publikasi ilmiah. Melalui website ini, pengguna dapat dengan mudah mengakses data penelitian yang telah dilaksanakan, program pengabdian yang pernah dilaksanakan, serta publikasi ilmiah yang diterbitkan oleh dosen di Fakultas Teknik Universitas Mataram.",
        summaryTitle: "Rangkuman Data Penelitian, Pengabdian, dan Publikasi"
    },

    // Navbar
    navbar: {
        title: "INDEX KINERJA",
        subtitle1: "PENELITIAN, PENGABDIAN DAN PUBLIKASI",
        subtitle2: "Fakultas Teknik, Universitas Mataram",
        penelitian: "Penelitian",
        pengabdian: "Pengabdian",
        publikasi: "Publikasi",
        programStudi: "Program Studi",
        login: "Masuk",
        dashboard: "Dashboard",
        logout: "Keluar"
    },

    // Dashboard
    dashboard: {
        title: "Dashboard",
        loading: "Memuat data...",
        noData: "Data tidak tersedia",
        error: "Terjadi kesalahan",
        refresh: "Coba Lagi",
        seeDetail: "Lihat detail",
        total: "Total",

        // Statistics Text
        penelitianText: {
            prefix: "Dari total",
            middle: "penelitian, sumber pendanaan mayoritas berasal dari",
            suffix: "yang mencakup",
            percent: "dari keseluruhan."
        },
        pengabdianText: {
            prefix: "Sebanyak",
            middle: "kegiatan pengabdian telah dilaksanakan, dengan kontribusi terbesar datang dari sumber",
            suffix: "sebesar"
        },
        publikasiText: {
            prefix: "Total",
            middle: "karya telah dipublikasikan. Jenis publikasi terbanyak adalah",
            suffix: "mencapai",
            percent: "dari total."
        },

        // Chart titles
        charts: {
            penelitian: "Penelitian",
            pengabdian: "Pengabdian",
            publikasi: "Publikasi"
        },

        // Table headers
        table: {
            title: "Data Per Program Studi",
            programStudi: "Program Studi",
            penelitianPusat: "Penelitian Pusat",
            penelitianPNBP: "Penelitian PNBP",
            penelitianMandiri: "Penelitian Mandiri",
            pengabdianPNBP: "Pengabdian PNBP",
            pengabdianPusat: "Pengabdian Pusat",
            publikasiHAKI: "HAKI",
            publikasiBuku: "Buku",
            publikasiJupeng: "Jurnal Pengabdian",
            total: "Total"
        }
    },

    // Footer
    footer: {
        title: "INDEKS KINERJA",
        subtitle: "FAKULTAS TEKNIK, UNIVERSITAS MATARAM",
        description: "Sistem informasi untuk menampilkan data dan analisis kinerja penelitian, pengabdian, dan publikasi di Fakultas Teknik, Universitas Mataram.",
        quickLinks: "Tautan Cepat",
        contact: "Hubungi Kami",
        home: "Beranda",
        email: "Email",
        phone: "Telepon",
        address: "Alamat",
        addressText: "Jl. Majapahit No.62, Gomong, Kec. Selaparang, Kota Mataram, Nusa Tenggara Bar. 83125",
        copyright: "Fakultas Teknik, Universitas Mataram. Semua Hak Cipta Dilindungi."
    },

    // Categories
    categories: {
        pusat: "Pusat",
        pnbp: "PNBP",
        mandiri: "Mandiri",
        haki: "HAKI",
        buku: "Buku",
        jupeng: "Jurnal Pengabdian"
    },

    // Penelitian page
    penelitianPage: {
        title: "Penelitian tahun ini",
        subtitle: "Pilih Penelitian",
        noData: "Tidak ada data",
        totalPenelitian: "TOTAL PENELITIAN",
        proditerakhir: "PRODI TERAKTIF TAHUN",
        rataBiaya: "RATA-RATA BIAYA",
        totalBiaya: "TOTAL BIAYA",
        tahun: "TAHUN",
        penelitianCount: "penelitian",

        charts: {
            pusat: {
                pusatPerTahun: "Jumlah Penelitian per Tahun",
                pusatPerProdi: "Jumlah Penelitian per Program Studi",
                pusatDanaPerTahun: "Jumlah Dana Penelitian Pusat per Tahun",
                pusatDanaPerProdi: "Jumlah Dana Penelitian Pusat per Prodi",
                pusatAvgDanaPerTahun: "Rata-Rata Dana Penelitian Pusat per Tahun",
                pusatAvgDanaPerProdi: "Rata-Rata Dana Penelitian Pusat per Prodi",
            },
            pnbp: {
                pnbpPerTahun: "Jumlah Penelitian PNBP per Tahun",
                pnbpPerProdi: "Jumlah Penelitian PNBP per Prodi",
                pnbpDanaPerTahun: "Jumlah Dana Penelitian PNBP per Tahun",
                pnbpDanaPerProdi: "Jumlah Dana Penelitian PNBP per Prodi",
                pnbpAvgDanaPerTahun: "Rata-Rata Dana Penelitian PNBP per Tahun",
                pnbpAvgDanaPerProdi: "Rata-Rata Dana Penelitian PNBP per Prodi",
                pnbpAvgNilaiPerTahun: "Rata-Rata Nilai Penelitian PNBP per Tahun",
                pnbpAvgNilaiPerProdi: "Rata-Rata Nilai Penelitian PNBP per Prodi",
            },
            mandiri: {
                mandiriPerTahun: "Jumlah Penelitian Mandiri per Tahun",
                mandiriPerProdi: "Jumlah Penelitian Mandiri per Prodi",
                mandiriDanaPerTahun: "Jumlah Dana Penelitian Mandiri per Tahun",
                mandiriDanaPerProdi: "Jumlah Dana Penelitian Mandiri per Prodi",
                mandiriAvgDanaPerTahun: "Rata-Rata Dana Penelitian Mandiri per Tahun",
                mandiriAvgDanaPerProdi: "Rata-Rata Dana Penelitian Mandiri per Prodi"
            }
        }
    },

    // Pengabdian page
    pengabdianPage: {
        title: "Pengabdian tahun ini",
        subtitle: "Pilih Pengabdian",
        noData: "Tidak ada data",
        totalPengabdian: "TOTAL PENGABDIAAN",
        proditerakhir: "PRODI TERAKTIF TAHUN",
        rataBiaya: "RATA-RATA BIAYA",
        totalBiaya: "TOTAL BIAYA",
        tahun: "TAHUN",
        pengabdianCount: "pengabdian",

        charts: {
            pusat: {
                pusatPerTahun: "Jumlah Pengabdian Pusat per Tahun",
                pusatDanaPerTahun: "Jumlah Dana Pengabdian Pusat per Tahun",
                pusatAvgDanaPerTahun: "Rata-Rata Dana Pengabdian Pusat per Tahun"
            },
            pnbp: {
                pnbpPerTahun: "Jumlah Pengabdian PNBP per Tahun",
                pnbpPerProdi: "Jumlah Pengabdian PNBP per Prodi",
                pnbpDanaPerTahun: "Jumlah Dana Pengabdian PNBP per Tahun",
                pnbpDanaPerProdi: "Jumlah Dana Pengabdian PNBP per Prodi",
                pnbpAvgDanaPerTahun: "Rata-Rata Dana Pengabdian PNBP per Tahun",
                pnbpAvgDanaPerProdi: "Rata-Rata Dana Pengabdian PNBP per Prodi",
                pnbpAvgNilaiPerTahun: "Rata-Rata Nilai Pengabdian PNBP per Tahun",
                pnbpAvgNilaiPerProdi: "Rata-Rata Nilai Pengabdian PNBP per Prodi"
            }
        }
    },

    // Publikasi page
    publikasiPage: {
        title: "Publikasi tahun ini",
        subtitle: "Pilih Publikasi",
        noData: "Tidak ada data",
        totalPublikasi: "TOTAL PUBLIKASI TAHUN INI",
        prodiPalingProduktif: "PRODI PALING PRODUKTIF",
        jenisPublikasiTerpopuler: "JENIS PUBLIKASI TERPOPULER",
        totalPublikasiKeseluruhan: "TOTAL PUBLIKASI KESELURUHAN",
        tahun: "TAHUN",
        publikasiCount: "publikasi",
        semuaTahun: "SEMUA TAHUN",
        
        charts: {
            buku: {
                bukuPerTahun: "Jumlah Buku per Tahun",
                bukuPerProdi: "Jumlah Buku per Program Studi"
            },
            haki: {
                hakiPerJenis: "Jumlah HAKI per Jenis",
                hakiPerProdi: "Jumlah HAKI per Program Studi",
                hakiPerTahun: "Jumlah HAKI per Tahun"
            },
            jupeng: {
                jupengPerTahun: "Jumlah Jurnal Pengabdian per Tahun",
                jupengPerProdi: "Jumlah Jurnal Pengabdian per Program Studi"
            }
        }
    }
};
