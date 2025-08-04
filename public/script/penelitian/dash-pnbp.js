// Buka menu "Penelitian" secara default saat halaman dimuat
window.onload = function () {
    toggleMenu('penelitianMenu');
};

// Fungsi untuk membuka modal (ganti 'addDataModal' dengan ID modal yang sesuai)
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Fungsi BARU untuk membuka dan mengisi modal edit
function openEditModal(itemString) {
    // Parse string JSON yang dikirim dari tombol
    const item = JSON.parse(itemString);

    // Pilih form dan atur actionnya ke route update yang benar
    const form = document.getElementById('editDataForm');
    form.action = `/dashboard/penelitian/pnbp/update/${item._id}?_method=PUT`;

    // Isi setiap field dalam form edit dengan data dari item
    document.getElementById('edit_Judul').value = item.Judul || '';
    document.getElementById('edit_SKEMA').value = item.SKEMA || '';
    document.getElementById('edit_Prodi').value = item.Prodi || '';
    document.getElementById('edit_Ketua').value = item.Ketua || '';
    document.getElementById('edit_Biaya').value = item.Biaya || '';
    document.getElementById('edit_Tahun').value = item.Tahun || '';
    document.getElementById('edit_Nilai').value = item.Nilai || '';

    // Handle dynamic anggota fields
    const anggotaArray = item.Anggota || [];
    populateEditAnggotaFields(anggotaArray);

    // Tampilkan modal edit
    openModal('editDataModal');
}

function openDeleteModal(action) {
    const deleteForm = document.getElementById('deleteForm');
    deleteForm.action = action;

    // Tampilkan modal konfirmasi
    openModal('deleteDataModal');
}

// Tipe data warning
document.addEventListener('DOMContentLoaded', function () {
    // Biaya dan Tahun harus angka
    ['Biaya', 'Tahun'].forEach(function (field) {
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
        'Judul', 'SKEMA', 'Prodi', 'Ketua', 'Biaya', 'Tahun', 'Nilai'
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
    
    // Get column index for sorting
    const columnMap = {
        'Judul': 1,
        'SKEMA': 2,
        'Prodi': 3,
        'Ketua': 4,
        'Biaya': 6,
        'Tahun': 7,
        'Nilai': 8
    };
    
    const columnIndex = columnMap[column];
    
    // Sort rows
    rows.sort((a, b) => {
        let aValue = a.cells[columnIndex].textContent.trim();
        let bValue = b.cells[columnIndex].textContent.trim();
        
        // Handle numeric columns
        if (column === 'Biaya') {
            // Remove currency formatting and convert to number
            aValue = parseFloat(aValue.replace(/[^\d.-]/g, '')) || 0;
            bValue = parseFloat(bValue.replace(/[^\d.-]/g, '')) || 0;
        } else if (column === 'Tahun' || column === 'Nilai') {
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
