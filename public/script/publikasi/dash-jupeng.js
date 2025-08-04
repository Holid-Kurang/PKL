// Buka menu "publikasi" secara default saat halaman dimuat
window.onload = function () {
    toggleMenu('publikasiMenu');
};

// Fungsi untuk membuka modal (ganti 'addDataModal' dengan ID modal yang sesuai)
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function openDeleteModal(action) {
    const deleteForm = document.getElementById('deleteForm');
    deleteForm.action = action;

    // Tampilkan modal konfirmasi
    openModal('deleteDataModal');
}


// Fungsi BARU untuk membuka dan mengisi modal edit
function openEditModal(itemString) {
    // Parse string JSON yang dikirim dari tombol
    const item = JSON.parse(itemString);

    // Pilih form dan atur actionnya ke route update yang benar
    const form = document.getElementById('editDataForm');
    form.action = `/dashboard/publikasi/jupeng/update/${item._id}`;

    // Isi setiap field dalam form edit dengan data dari item
    document.getElementById('edit_jurnal_judul').value = item.jurnal_judul || '';
    document.getElementById('edit_jurnal_url').value = item.jurnal_url || '';
    document.getElementById('edit_jurnal_file').value = item.jurnal_file || '';
    document.getElementById('edit_jurnal_tahun').value = item.jurnal_tahun || '';
    document.getElementById('edit_jurnal_bulan').value = item.jurnal_bulan || '';
    document.getElementById('edit_pengguna_kode').value = item.pengguna_kode || '';
    document.getElementById('edit__pengguna_jenis').value = item._pengguna_jenis || '';
    document.getElementById('edit__pengguna_nama').value = item._pengguna_nama || '';
    document.getElementById('edit__prodi_nama').value = item._prodi_nama || '';
    document.getElementById('edit__personil_data_ketua').value = item._personil_data_ketua || '';
    document.getElementById('edit__personil_data_ketua_kode').value = item._personil_data_ketua_kode || '';
    document.getElementById('edit__personil_data_ketua_jenis').value = item._personil_data_ketua_jenis || '';

    // Tampilkan modal edit
    openModal('editDataModal');
}

// Tipe data warning
document.addEventListener('DOMContentLoaded', function () {
    // Biaya dan Tahun harus angka
    ['jurnal_tahun'].forEach(function (field) {
        const input = document.getElementById(field);
        const typeError = document.getElementById('type-error-' + field);
        if (input && typeError) {
            input.addEventListener('input', function () {
                if (input.value && isNaN(Number(input.value))) {
                    typeError.classList.remove('hidden');
                } else {
                    typeError.classList.add('hidden');
                }
            });
        }
    });
});

function validateForm(event) {
    let valid = true;
    const requiredFields = [
        'jurnal_judul',
        'jurnal_tahun',
        '_prodi_nama'
    ];
    requiredFields.forEach(function (field) {
        const input = document.getElementById(field);
        const error = document.getElementById('error-' + field);
        if (input && error) {
            if (!input.value || (input.tagName === 'SELECT' && input.value === "")) {
                error.classList.remove('hidden');
                valid = false;
            } else {
                error.classList.add('hidden');
            }
        }
    });
    if (!valid) event.preventDefault();
    return valid;
}

// General keyboard event handler for all modals
document.addEventListener('keydown', function(event) {
    // Check if any modal is open
    const modals = ['addDataModal', 'editDataModal', 'deleteDataModal', 'importDataModal'];
    const openModal = modals.find(modalId => {
        const modal = document.getElementById(modalId);
        return modal && !modal.classList.contains('hidden');
    });
    
    if (openModal) {
        if (event.key === 'Escape') {
            closeModal(openModal);
            event.preventDefault();
        } else if (event.key === 'Enter') {
            // Find submit button in the open modal and click it
            const modal = document.getElementById(openModal);
            const submitButton = modal.querySelector('button[type="submit"], input[type="submit"]');
            if (submitButton) {
                submitButton.click();
                event.preventDefault();
            }
        }
    }
});

// Variables untuk tracking sorting
let currentSortColumn = '';
let currentSortDirection = 'asc';

// Fungsi untuk sorting tabel
function sortTable(column) {
    const table = document.querySelector('table tbody');
    const rows = Array.from(table.querySelectorAll('tr')).filter(row => 
        !row.querySelector('td[colspan]') // Exclude "no data" row
    );
    
    // Reset semua ikon sort
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.textContent = 'unfold_more';
        icon.classList.remove('text-blue-600');
    });
    
    // Determine sort direction
    if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortDirection = 'asc';
        currentSortColumn = column;
    }
    
    // Update sort icon
    const sortIcon = document.getElementById(`sort-${column}`);
    if (sortIcon) {
        sortIcon.textContent = currentSortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
        sortIcon.classList.add('text-blue-600');
    }
    
    // Get column index for sorting (adjusted for publikasi Jupeng table structure)
    const columnMap = {
        'jurnal_judul': 1,
        'jurnal_tahun': 4,
        'jurnal_bulan': 5,
        'pengguna_kode': 6,
        '_pengguna_jenis': 7,
        '_pengguna_nama': 8,
        '_prodi_nama': 9,
        '_personil_data_ketua': 10,
        '_personil_data_ketua_kode': 11,
        '_personil_data_ketua_jenis': 12
    };
    
    const columnIndex = columnMap[column];
    
    // Sort rows
    rows.sort((a, b) => {
        let aValue = a.cells[columnIndex].textContent.trim();
        let bValue = b.cells[columnIndex].textContent.trim();
        
        // Handle numeric columns
        if (column === 'jurnal_tahun') {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
        } else {
            // String comparison - case insensitive
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        let comparison = 0;
        if (aValue > bValue) {
            comparison = 1;
        } else if (aValue < bValue) {
            comparison = -1;
        }
        
        return currentSortDirection === 'asc' ? comparison : -comparison;
    });
    
    // Update row numbers and reappend sorted rows
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1; // Update row number
        table.appendChild(row);
    });
}