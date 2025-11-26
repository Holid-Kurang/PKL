// Dashboard Table CRUD Script
// Handles all CRUD operations with AJAX for dynamic data management

// Global state
let currentData = [];
let filteredData = [];
let currentPage = 1;
let itemsPerPage = 50;
let editingId = null;
let deleteId = null;

// Config from server-side
const { section, category, fullCategory, fields, prodiOptions, hakiOptions, translations } = window.dashboardConfig;

// Field type mapping for form generation
const fieldTypeMap = {
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

// Field labels for display
const fieldLabels = {
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeEventListeners();
    loadData();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Action buttons
    document.getElementById('btn-add').addEventListener('click', openAddModal);
    document.getElementById('btn-export').addEventListener('click', exportData);
    document.getElementById('btn-import').addEventListener('click', openImportModal);
    document.getElementById('btn-search').addEventListener('click', handleSearch);

    // Search on Enter key
    document.getElementById('search-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Modal controls
    document.getElementById('close-form-modal').addEventListener('click', closeFormModal);
    document.getElementById('btn-cancel-form').addEventListener('click', closeFormModal);
    document.getElementById('data-form').addEventListener('submit', handleFormSubmit);

    document.getElementById('close-delete-modal').addEventListener('click', closeDeleteModal);
    document.getElementById('btn-cancel-delete').addEventListener('click', closeDeleteModal);
    document.getElementById('btn-confirm-delete').addEventListener('click', handleDelete);

    document.getElementById('close-import-modal').addEventListener('click', closeImportModal);
    document.getElementById('btn-cancel-import').addEventListener('click', closeImportModal);
    document.getElementById('import-form').addEventListener('submit', handleImport);

    // Close modal on outside click
    window.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// Load data from API
async function loadData() {
    try {
        showLoading();
        const response = await fetch(`/api/dashboard/${fullCategory}`);
        const result = await response.json();

        if (response.ok && result.data) {
            currentData = result.data;
            filteredData = [...currentData];
            renderTable();
            renderPagination();
        } else {
            showError('Gagal memuat data');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Terjadi kesalahan saat memuat data');
    }
}

// Show loading state
function showLoading() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = `
        <tr>
            <td colspan="100" class="px-6 py-8 text-center text-gray-500">
                <span class="material-icons-outlined animate-spin" style="font-size: 48px;">hourglass_empty</span>
                <p class="mt-2">${translations.loading}</p>
            </td>
        </tr>
    `;
}

// Show error state
function showError(message) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = `
        <tr>
            <td colspan="100" class="px-6 py-8 text-center text-red-500">
                <span class="material-icons-outlined" style="font-size: 48px;">error_outline</span>
                <p class="mt-2">${message}</p>
            </td>
        </tr>
    `;
}

// Render table with data
function renderTable() {
    // Render header
    const thead = document.getElementById('table-header');
    let headerHTML = '<th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">No</th>';

    fields.forEach(field => {
        headerHTML += `<th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">${fieldLabels[field] || field}</th>`;
    });

    headerHTML += '<th class="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase">Aksi</th>';
    thead.innerHTML = headerHTML;

    // Render body
    const tbody = document.getElementById('table-body');

    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="100" class="px-6 py-8 text-center text-gray-500">
                    <span class="material-icons-outlined" style="font-size: 48px;">inbox</span>
                    <p class="mt-2">${translations.noData}</p>
                </td>
            </tr>
        `;
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    let bodyHTML = '';
    pageData.forEach((item, index) => {
        bodyHTML += `<tr class="hover:bg-gray-50">`;
        bodyHTML += `<td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">${start + index + 1}</td>`;

        fields.forEach(field => {
            let value = item[field];

            // Format array fields
            if (Array.isArray(value)) {
                value = value.join(', ');
            }

            // Format number fields
            if (typeof value === 'number' && (field.includes('Biaya') || field.includes('Dana'))) {
                value = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
            }

            // Truncate long text
            if (typeof value === 'string' && value.length > 50) {
                value = value.substring(0, 50) + '...';
            }

            bodyHTML += `<td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">${value || '-'}</td>`;
        });

        bodyHTML += `
            <td class="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                <button onclick="editData('${item._id}')" class="text-indigo hover:text-indigo/80 mr-3">
                    <span class="material-icons-outlined">edit</span>
                </button>
                <button onclick="openDeleteModal('${item._id}')" class="text-red-600 hover:text-red-800">
                    <span class="material-icons-outlined">delete</span>
                </button>
            </td>
        `;
        bodyHTML += `</tr>`;
    });

    tbody.innerHTML = bodyHTML;
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginationControls = document.getElementById('pagination-controls');

    // Update pagination info
    const start = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredData.length);
    document.getElementById('page-start').textContent = start;
    document.getElementById('page-end').textContent = end;
    document.getElementById('total-records').textContent = filteredData.length;

    // Generate pagination buttons
    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''} 
                class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            &laquo; Prev
        </button>
    `;

    // Page numbers (show max 5 pages)
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" 
                    class="px-3 py-1 text-sm border rounded ${i === currentPage ? 'bg-indigo text-white border-indigo' : 'border-gray-300 hover:bg-gray-100'}">
                ${i}
            </button>
        `;
    }

    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''} 
                class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            Next &raquo;
        </button>
    `;

    paginationControls.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderTable();
    renderPagination();
}

// Handle search
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();

    if (searchTerm === '') {
        filteredData = [...currentData];
    } else {
        filteredData = currentData.filter(item => {
            return fields.some(field => {
                const value = item[field];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(searchTerm);
                }
                if (Array.isArray(value)) {
                    return value.some(v => v.toLowerCase().includes(searchTerm));
                }
                return false;
            });
        });
    }

    currentPage = 1;
    renderTable();
    renderPagination();
}

// Generate form fields dynamically
function generateFormFields(data = null) {
    const formFields = document.getElementById('form-fields');
    let formHTML = '';

    fields.forEach(field => {
        const fieldType = fieldTypeMap[field] || 'text';
        const label = fieldLabels[field] || field;
        const value = data ? (data[field] || '') : '';

        formHTML += `<div class="form-group">`;
        formHTML += `<label class="block mb-2 text-sm font-medium text-gray-700">${label}</label>`;

        if (fieldType === 'array') {
            const arrayValue = Array.isArray(value) ? value.join(', ') : '';
            formHTML += `<input type="text" name="${field}" value="${arrayValue}" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo" placeholder="Pisahkan dengan koma">`;
            formHTML += `<p class="mt-1 text-xs text-gray-500">Pisahkan dengan koma untuk multiple values</p>`;
        } else if (fieldType === 'select-prodi') {
            formHTML += `<select name="${field}" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo" required>`;
            formHTML += `<option value="">Pilih Program Studi</option>`;
            prodiOptions.forEach(option => {
                const selected = value === option ? 'selected' : '';
                formHTML += `<option value="${option}" ${selected}>${option}</option>`;
            });
            formHTML += `</select>`;
        } else if (fieldType === 'select-haki') {
            formHTML += `<select name="${field}" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo" required>`;
            formHTML += `<option value="">Pilih Jenis HAKI</option>`;
            hakiOptions.forEach(option => {
                const selected = value === option ? 'selected' : '';
                formHTML += `<option value="${option}" ${selected}>${option}</option>`;
            });
            formHTML += `</select>`;
        } else if (fieldType === 'number') {
            formHTML += `<input type="number" name="${field}" value="${value}" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo" required>`;
        } else {
            formHTML += `<input type="text" name="${field}" value="${value}" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo" required>`;
        }

        formHTML += `</div>`;
    });

    formFields.innerHTML = formHTML;
}

// Open add modal
function openAddModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Tambah Data';
    generateFormFields();
    document.getElementById('modal-form').classList.add('active');
}

// Open edit modal
function editData(id) {
    const item = currentData.find(d => d._id === id);
    if (!item) return;

    editingId = id;
    document.getElementById('modal-title').textContent = 'Edit Data';
    generateFormFields(item);
    document.getElementById('modal-form').classList.add('active');
}

// Close form modal
function closeFormModal() {
    document.getElementById('modal-form').classList.remove('active');
    document.getElementById('data-form').reset();
    editingId = null;
}

// Handle form submit
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};

    // Process form data
    formData.forEach((value, key) => {
        const fieldType = fieldTypeMap[key];

        if (fieldType === 'array') {
            // Split by comma and trim
            data[key] = value.split(',').map(v => v.trim()).filter(v => v !== '');
        } else if (fieldType === 'number') {
            data[key] = Number(value);
        } else {
            data[key] = value;
        }
    });

    try {
        let response;
        if (editingId) {
            // Update existing data
            response = await fetch(`/api/dashboard/${fullCategory}/update/${editingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } else {
            // Create new data
            response = await fetch(`/api/dashboard/${fullCategory}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();

        if (response.ok && result.success) {
            // alert(editingId ? 'Data berhasil diupdate!' : 'Data berhasil ditambahkan!');
            closeFormModal();
            loadData();
        } else {
            alert('Gagal menyimpan data: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Terjadi kesalahan saat menyimpan data');
    }
}

// Open delete modal
function openDeleteModal(id) {
    deleteId = id;
    document.getElementById('modal-delete').classList.add('active');
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('modal-delete').classList.remove('active');
    deleteId = null;
}

// Handle delete
async function handleDelete() {
    if (!deleteId) return;

    try {
        const response = await fetch(`/api/dashboard/${fullCategory}/delete/${deleteId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // alert('Data berhasil dihapus!');
            closeDeleteModal();
            loadData();
        } else {
            alert('Gagal menghapus data: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        alert('Terjadi kesalahan saat menghapus data');
    }
}

// Export data
function exportData() {
    window.location.href = `/api/dashboard/${fullCategory}/export`;
}

// Open import modal
function openImportModal() {
    document.getElementById('modal-import').classList.add('active');
}

// Close import modal
function closeImportModal() {
    document.getElementById('modal-import').classList.remove('active');
    document.getElementById('import-form').reset();
}

// Handle import
async function handleImport(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch(`/api/dashboard/${fullCategory}/import`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // alert('Data berhasil diimport!');
            closeImportModal();
            loadData();
        } else {
            alert('Gagal mengimport data: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error importing data:', error);
        alert('Terjadi kesalahan saat mengimport data');
    }
}

// Close all modals
function closeAllModals() {
    closeFormModal();
    closeDeleteModal();
    closeImportModal();
}

// Make functions globally accessible
window.changePage = changePage;
window.editData = editData;
window.openDeleteModal = openDeleteModal;
