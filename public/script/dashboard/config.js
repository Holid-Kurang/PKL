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
            'Judul': 'text',
            'SKEMA': 'text',
            'Skema': 'text',
            'Ketua': 'text',
            'NAMA': 'text',
            'Nama': 'text',
            'Anggota': 'array',
            'Biaya': 'number',
            'BIAYA': 'number',
            'Dana': 'number',
            'Tahun': 'number',
            'TAHUN': 'number',
            'tahun': 'number',
            'Prodi': 'select-prodi',
            'Nilai': 'number',
            'NIDN': 'text',
            'NIP': 'text',
            'NomorKontrakLPPM': 'text',
            'JumlahAnggota': 'number',
            'JumlahMshTerlibat': 'number',
            'buku_isbn': 'text',
            'buku_jumlah_halaman': 'number',
            'buku_penerbit': 'text',
            'buku_file': 'text',
            'buku_tahun': 'number',
            'pengguna_kode': 'text',
            '_pengguna_jenis': 'text',
            '_pengguna_nama': 'text',
            'hki_jenis': 'select-haki',
            'hki_file': 'text',
            'hki_bulan': 'text',
            'hki_tahun': 'number',
            'jurnal_url': 'text',
            'jurnal_file': 'text',
            'jurnal_tahun': 'number',
            'jurnal_bulan': 'text',
            '_personil_data_ketua': 'text',
            '_personil_data_ketua_kode': 'text',
            '_personil_data_ketua_jenis': 'text'
        };
    }

    _initFieldLabels() {
        return {
            'Judul': 'Judul',
            'SKEMA': 'Skema',
            'Skema': 'Skema',
            'Ketua': 'Ketua',
            'NAMA': 'Nama',
            'Nama': 'Nama',
            'Anggota': 'Anggota',
            'Biaya': 'Biaya',
            'BIAYA': 'Biaya',
            'Dana': 'Dana',
            'Tahun': 'Tahun',
            'TAHUN': 'Tahun',
            'tahun': 'Tahun',
            'Prodi': 'Program Studi',
            'Nilai': 'Nilai',
            'NIDN': 'NIDN',
            'NIP': 'NIP',
            'NomorKontrakLPPM': 'Nomor Kontrak LPPM',
            'JumlahAnggota': 'Jumlah Anggota',
            'JumlahMshTerlibat': 'Jumlah Mahasiswa Terlibat',
            'buku_isbn': 'ISBN',
            'buku_jumlah_halaman': 'Jumlah Halaman',
            'buku_penerbit': 'Penerbit',
            'buku_file': 'File',
            'buku_tahun': 'Tahun',
            'pengguna_kode': 'Kode Pengguna',
            '_pengguna_jenis': 'Jenis Pengguna',
            '_pengguna_nama': 'Nama Pengguna',
            'hki_jenis': 'Jenis HAKI',
            'hki_file': 'File',
            'hki_bulan': 'Bulan',
            'hki_tahun': 'Tahun',
            'jurnal_url': 'URL Jurnal',
            'jurnal_file': 'File',
            'jurnal_tahun': 'Tahun',
            'jurnal_bulan': 'Bulan',
            '_personil_data_ketua': 'Ketua',
            '_personil_data_ketua_kode': 'Kode Ketua',
            '_personil_data_ketua_jenis': 'Jenis Ketua'
        };
    }

    getFieldType(fieldName) {
        return this.fieldTypeMap[fieldName] || 'text';
    }

    getFieldLabel(fieldName) {
        return this.fieldLabels[fieldName] || fieldName;
    }
}
