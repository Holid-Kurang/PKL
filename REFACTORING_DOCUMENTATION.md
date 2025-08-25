# Refactoring Documentation

## Overview
Proyek ini telah direfactor untuk mengurangi duplikasi kode dan meningkatkan maintainability. Model tetap dibiarkan apa adanya sesuai permintaan, namun controller, routes, dan JavaScript telah diperbaiki.

## Perubahan yang Dilakukan

### 1. Base Controller (`controllers/baseController.js`)
- **Fungsi**: Controller generic yang dapat digunakan untuk semua entitas
- **Fitur**:
  - CRUD operations (Create, Read, Update, Delete)
  - Pagination dan search
  - Export/Import Excel
  - Download template
- **Keuntungan**: Mengurangi duplikasi kode dari ~300 baris per controller menjadi 1 file controller yang dapat digunakan berulang

### 2. Controller Factory (`controllers/controllerFactory.js`)
- **Fungsi**: Factory pattern untuk membuat controller dengan konfigurasi yang berbeda
- **Konfigurasi**: Mendefinisikan model, view path, title, search fields, dan excel fields untuk setiap entitas
- **Keuntungan**: Centralized configuration untuk semua controller

### 3. Route Generator (`helpers/routeGenerator.js`)
- **Fungsi**: Generator untuk membuat routes secara dinamis
- **Fitur**:
  - Generate routes untuk single controller
  - Generate multiple routes sekaligus
  - Automatic multer configuration untuk file upload
- **Keuntungan**: Mengurangi duplikasi routes dari 8 file terpisah menjadi 1 generator

### 4. Unified Dashboard Routes (`routes/dashboardUnified.js`)
- **Fungsi**: File routes tunggal yang menggantikan semua dashboard routes individual
- **Konfigurasi**: Array konfigurasi untuk semua dashboard routes
- **Keuntungan**: Satu tempat untuk mengelola semua dashboard routes

### 5. Common Dashboard JavaScript (`public/script/dashboard-common.js`)
- **Fungsi**: JavaScript yang dapat digunakan di semua halaman dashboard
- **Fitur**:
  - Modal management
  - Dynamic form fields
  - Generic edit modal handler
  - Form validation
  - Table sorting (optional)
- **Keuntungan**: Mengurangi duplikasi JavaScript dari ~200 baris per file menjadi 1 file shared

## Cara Menggunakan Refactored Code

### Menambah Entitas Baru
1. **Buat Model** (tetap seperti sebelumnya)
2. **Tambah Konfigurasi** di `controllers/controllerFactory.js`:
   ```javascript
   'kategori-jenis': {
       model: namaModel,
       viewPath: 'path/ke/view',
       title: 'Judul Entitas',
       searchFields: ['field1', 'field2'],
       excelFields: [
           { key: 'field1', header: 'Header 1' },
           { key: 'field2', header: 'Header 2' }
       ]
   }
   ```
3. **Tambah Route Config** di `routes/dashboardUnified.js`:
   ```javascript
   {
       basePath: "/dashboard/kategori/jenis",
       controllerType: "kategori-jenis"
   }
   ```

### Modifikasi Existing View
View tetap menggunakan struktur yang sama, namun untuk JavaScript:
1. **Include common script**:
   ```html
   <script src="/script/dashboard-common.js"></script>
   ```
2. **Definisikan form config** untuk modal edit:
   ```javascript
   const formConfig = {
       fieldName: { type: 'text' },
       Anggota: { type: 'array', containerId: 'editAnggotaContainer' }
   };
   ```
3. **Gunakan fungsi generic**:
   ```html
   <button onclick="openEditModal('${JSON.stringify(item)}', formConfig)">Edit</button>
   ```

## File yang Dapat Dihapus (Setelah Testing)
Setelah memastikan semua berfungsi dengan baik, file-file berikut dapat dihapus:

### Controllers
- `controllers/penelitian/mandiriControl.js`
- `controllers/penelitian/pnbpControl.js`
- `controllers/penelitian/pusatControl.js`
- `controllers/pengabdian/pnbpControl.js`
- `controllers/pengabdian/pusatControl.js`
- `controllers/publikasi/bukuControl.js`
- `controllers/publikasi/hakiControl.js`
- `controllers/publikasi/jupengControl.js`

### Routes
- `routes/dashboardRoute/penelitian/mandiri.js`
- `routes/dashboardRoute/penelitian/pnbp.js`
- `routes/dashboardRoute/penelitian/pusat.js`
- `routes/dashboardRoute/pengabdian/pnbp.js`
- `routes/dashboardRoute/pengabdian/pusat.js`
- `routes/dashboardRoute/publikasi/buku.js`
- `routes/dashboardRoute/publikasi/haki.js`
- `routes/dashboardRoute/publikasi/jupeng.js`

### JavaScript Files
- `public/script/penelitian/dash-mandiri.js`
- `public/script/penelitian/dash-pnbp.js`
- `public/script/penelitian/dash-pusat.js`
- `public/script/pengabdian/dash-pnbp.js`
- `public/script/pengabdian/dash-pusat.js`
- `public/script/publikasi/dash-buku.js`
- `public/script/publikasi/dash-haki.js`
- `public/script/publikasi/dash-jupeng.js`

## Keuntungan Refactoring

1. **Mengurangi Duplikasi**: Dari ~2400 baris kode duplikat menjadi ~500 baris kode reusable
2. **Maintainability**: Perubahan fitur cukup dilakukan di 1 tempat
3. **Consistency**: Semua dashboard memiliki behavior yang konsisten
4. **Scalability**: Mudah menambah entitas baru
5. **DRY Principle**: Don't Repeat Yourself - kode lebih clean dan maintainable

## Testing
Untuk memastikan refactoring berhasil:
1. Test semua CRUD operations
2. Test pagination dan search
3. Test export/import Excel
4. Test modal functionality
5. Test form validation

## Rollback Plan
Jika ada masalah, untuk rollback:
1. Kembalikan `routes/routes.js` ke versi sebelumnya
2. Comment out import `dashboardUnified.js`
3. Uncomment individual route imports
4. Ganti script references di views dari `dashboard-common.js` ke script individual
