/**
 * Configuration Module
 * Centralized configuration for dashboard table
 */

class DashboardConfig {
    constructor(config) {
        this.section = config.section;
        this.category = config.category;
        this.fullCategory = config.fullCategory;
        this.fields = config.fields;
        this.prodiOptions = config.prodiOptions;
        this.hakiOptions = config.hakiOptions;
        this.translations = config.translations;

        this.fieldTypeMap = this._initFieldTypeMap();
        this.fieldLabels = this._initFieldLabels();
    }

    _initFieldTypeMap() {
        return {
            // ─── Penelitian & Pengabdian ─────────────────────
            'Judul': 'text',
            'Skema': 'text',
            'Ketua': 'text',
            'Nama': 'text',
            'Anggota': 'array',
            'Biaya': 'number',
            'Dana': 'number',
            'Tahun': 'number',
            'Prodi': 'select-prodi',
            'Nilai': 'number',
            'NIDN': 'text',
            'NIP': 'text',
            'NomorKontrakLPPM': 'text',
            'JumlahAnggota': 'number',
            'JumlahMshTerlibat': 'number',
            // ─── Publikasi Buku ──────────────────────────────
            'BukuIsbn': 'text',
            'BukuJumlahHalaman': 'number',
            'BukuPenerbit': 'text',
            'BukuFile': 'text',
            'PenggunaKode': 'text',
            'PenggunaJenis': 'text',
            'PenggunaNama': 'text',
            // ─── Publikasi HAKI ──────────────────────────────
            'HkiJenis': 'select-haki',
            'HkiFile': 'text',
            'HkiBulan': 'text',
            // ─── Publikasi Jupeng ────────────────────────────
            'JurnalUrl': 'text',
            'JurnalFile': 'text',
            'JurnalBulan': 'text',
            'PersonilDataKetua': 'text',
            'PersonilDataKetuaKode': 'text',
            'PersonilDataKetuaJenis': 'text'
        };
    }

    _initFieldLabels() {
        return {
            // ─── Penelitian & Pengabdian ─────────────────────
            'Judul': 'Judul',
            'Skema': 'Skema',
            'Ketua': 'Ketua',
            'Nama': 'Nama',
            'Anggota': 'Anggota',
            'Biaya': 'Biaya',
            'Dana': 'Dana',
            'Tahun': 'Tahun',
            'Prodi': 'Program Studi',
            'Nilai': 'Nilai',
            'NIDN': 'NIDN',
            'NIP': 'NIP',
            'NomorKontrakLPPM': 'Nomor Kontrak LPPM',
            'JumlahAnggota': 'Jumlah Anggota',
            'JumlahMshTerlibat': 'Jumlah Mahasiswa Terlibat',
            // ─── Publikasi Buku ──────────────────────────────
            'BukuIsbn': 'ISBN',
            'BukuJumlahHalaman': 'Jumlah Halaman',
            'BukuPenerbit': 'Penerbit',
            'BukuFile': 'File',
            'PenggunaKode': 'Kode Pengguna',
            'PenggunaJenis': 'Jenis Pengguna',
            'PenggunaNama': 'Nama Pengguna',
            // ─── Publikasi HAKI ──────────────────────────────
            'HkiJenis': 'Jenis HAKI',
            'HkiFile': 'File',
            'HkiBulan': 'Bulan',
            // ─── Publikasi Jupeng ────────────────────────────
            'JurnalUrl': 'URL Jurnal',
            'JurnalFile': 'File',
            'JurnalBulan': 'Bulan',
            'PersonilDataKetua': 'Ketua',
            'PersonilDataKetuaKode': 'Kode Ketua',
            'PersonilDataKetuaJenis': 'Jenis Ketua'
        };
    }

    getFieldType(fieldName) {
        return this.fieldTypeMap[fieldName] || 'text';
    }

    getFieldLabel(fieldName) {
        return this.fieldLabels[fieldName] || fieldName;
    }
}
