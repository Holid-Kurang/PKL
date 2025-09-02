module.exports = {
    // Welcome section
    welcome: {
        title: "Welcome",
        description: "This website is designed to provide information related to academic activities at the Faculty of Engineering, University of Mataram, particularly in the fields of research, community service, and scientific publications. Through this website, users can easily access research data that has been conducted, community service programs that have been implemented, and scientific publications published by lecturers at the Faculty of Engineering, University of Mataram.",
        summaryTitle: "Summary of Research, Community Service, and Publication Data"
    },

    // Navbar
    navbar: {
        title: "PERFORMANCE INDEX",
        subtitle1: "RESEARCH, COMMUNITY SERVICE AND PUBLICATION",
        subtitle2: "Faculty of Engineering, University of Mataram",
        penelitian: "Research",
        pengabdian: "Community Service",
        publikasi: "Publication",
        programStudi: "Study Program",
        dashboard: "Dashboard",
        pengaturan: "Settings"
    },

    // Dashboard
    dashboard: {
        title: "Dashboard",
        loading: "Loading data...",
        noData: "No data available",
        error: "An error occurred",
        refresh: "Try Again",
        seeDetail: "See details",
        total: "Total",

        // Statistics Text
        penelitianText: {
            prefix: "Out of",
            middle: "research projects, the majority of funding comes from",
            suffix: "which covers",
            percent: "of the total."
        },
        pengabdianText: {
            prefix: "A total of",
            middle: "community service activities have been carried out, with the largest contribution coming from",
            suffix: "at"
        },
        publikasiText: {
            prefix: "A total of",
            middle: "works have been published. The most common type of publication is",
            suffix: "reaching",
            percent: "of the total."
        },

        // Chart titles
        charts: {
            penelitian: "Research",
            pengabdian: "Community Service",
            publikasi: "Publication"
        },

        // Table headers
        table: {
            title: "Data Per Study Program",
            programStudi: "Study Program",
            penelitianPusat: "Central Research",
            penelitianPNBP: "PNBP Research",
            penelitianMandiri: "Independent Research",
            pengabdianPNBP: "PNBP Community Service",
            pengabdianPusat: "Central Community Service",
            publikasiHAKI: "Intellectual Property",
            publikasiBuku: "Book",
            publikasiJupeng: "Service Journal",
            total: "Total"
        }
    },

    // Footer
    footer: {
        title: "PERFORMANCE INDEX",
        subtitle: "FACULTY OF ENGINEERING, UNIVERSITY OF MATARAM",
        description: "Information system to display data and performance analysis of research, community service, and publications at the Faculty of Engineering, University of Mataram.",
        quickLinks: "Quick Links",
        contact: "Contact Us",
        home: "Home",
        email: "Email",
        phone: "Phone",
        address: "Address",
        addressText: "Jl. Majapahit No.62, Gomong, Kec. Selaparang, Kota Mataram, Nusa Tenggara Bar. 83125",
        copyright: "Faculty of Engineering, University of Mataram. All Rights Reserved."
    },

    // Categories
    categories: {
        pusat: "Central",
        pnbp: "PNBP",
        mandiri: "Independent",
        haki: "IP",
        buku: "Book",
        jupeng: "Community Service Journal"
    },

    auth: {
        user: "Username",
        password: "Password",
        button: "Login",
        forgotPassword: "Forgot Password?",
        login: "Login",
        logout: "Logout",
        kembali: "Back"
    },

    // Research page
    penelitianPage: {
        title: "Research this year",
        subtitle: "Select Research",
        noData: "No data available",
        totalPenelitian: "TOTAL RESEARCH",
        proditerakhir: "MOST ACTIVE STUDY PROGRAM",
        rataBiaya: "AVERAGE COST",
        totalBiaya: "TOTAL COST",
        tahun: "YEAR",
        penelitianCount: "research",

        charts: {
            pusat: {
                pusatPerTahun: "Central Research Count per Year",
                pusatPerProdi: "Central Research Count per Study Program",
                pusatDanaPerTahun: "Central Research Funding per Year",
                pusatDanaPerProdi: "Central Research Funding per Study Program",
                pusatAvgDanaPerTahun: "Average Central Research Funding per Year",
                pusatAvgDanaPerProdi: "Average Central Research Funding per Study Program",
            },
            pnbp: {
                pnbpPerTahun: "PNBP Research Count per Year",
                pnbpPerProdi: "PNBP Research Count per Study Program",
                pnbpDanaPerTahun: "PNBP Research Funding per Year",
                pnbpDanaPerProdi: "PNBP Research Funding per Study Program",
                pnbpAvgDanaPerTahun: "Average PNBP Research Funding per Year",
                pnbpAvgDanaPerProdi: "Average PNBP Research Funding per Study Program",
                pnbpAvgNilaiPerTahun: "Average PNBP Research Value per Year",
                pnbpAvgNilaiPerProdi: "Average PNBP Research Value per Study Program",
            },
            mandiri: {
                mandiriPerTahun: "Independent Research Count per Year",
                mandiriPerProdi: "Independent Research Count per Study Program",
                mandiriDanaPerTahun: "Independent Research Funding per Year",
                mandiriDanaPerProdi: "Independent Research Funding per Study Program",
                mandiriAvgDanaPerTahun: "Average Independent Research Funding per Year",
                mandiriAvgDanaPerProdi: "Average Independent Research Funding per Study Program"
            }
        }
    },

    // Community Service page
    pengabdianPage: {
        title: "Community service this year",
        subtitle: "Select Community Service",
        noData: "No data available",
        totalPengabdian: "TOTAL COMMUNITY SERVICE",
        proditerakhir: "MOST ACTIVE STUDY PROGRAM",
        rataBiaya: "AVERAGE COST",
        totalBiaya: "TOTAL COST",
        tahun: "YEAR",
        pengabdianCount: "community service",
        charts: {
            pusat: {
                pusatPerTahun: "Central Community Service Count per Year",
                pusatDanaPerTahun: "Central Community Service Funding per Year",
                pusatAvgDanaPerTahun: "Average Central Community Service Funding per Year"
            },
            pnbp: {
                pnbpPerTahun: "PNBP Community Service Count per Year",
                pnbpPerProdi: "PNBP Community Service Count per Study Program",
                pnbpDanaPerTahun: "PNBP Community Service Funding per Year",
                pnbpDanaPerProdi: "PNBP Community Service Funding per Study Program",
                pnbpAvgDanaPerTahun: "Average PNBP Community Service Funding per Year",
                pnbpAvgDanaPerProdi: "Average PNBP Community Service Funding per Study Program",
                pnbpAvgNilaiPerTahun: "Average PNBP Community Service Value per Year",
                pnbpAvgNilaiPerProdi: "Average PNBP Community Service Value per Study Program"
            }
        }
    },

    // Publication page
    publikasiPage: {
        title: "Publications this year",
        subtitle: "Select Publication",
        noData: "No data available",
        totalPublikasi: "TOTAL PUBLICATIONS THIS YEAR",
        proditerakhir: "MOST ACTIVE STUDY PROGRAM",
        jenisPublikasiTerpopuler: "MOST POPULAR PUBLICATION TYPE",
        totalPublikasiKeseluruhan: "TOTAL OVERALL PUBLICATIONS",
        tahun: "YEAR",
        publikasiCount: "publications",
        semuaTahun: "ALL YEARS",

        charts: {
            buku: {
                bukuPerTahun: "Book Count per Year",
                bukuPerProdi: "Book Count per Study Program"
            },
            haki: {
                hakiPerJenis: "Intellectual Property Count per Type",
                hakiPerProdi: "Intellectual Property Count per Study Program",
                hakiPerTahun: "Intellectual Property Count per Year"
            },
            jupeng: {
                jupengPerTahun: "Community Service Journal Count per Year",
                jupengPerProdi: "Community Service Journal Count per Study Program"
            }
        }
    }
};
