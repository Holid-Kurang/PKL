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
    console.log(item);
    // Pilih form dan atur actionnya ke route update yang benar
    const form = document.getElementById('editDataForm');
    form.action = `/dashboard/publikasi/buku/update/${item._id}`;

    // Isi setiap field dalam form edit dengan data dari item
    document.getElementById('edit_Judul').value = item.Judul || '';
    document.getElementById('edit_buku_isbn').value = item.buku_isbn || '';
    document.getElementById('edit_buku_jumlah_halaman').value = item.buku_jumlah_halaman || '';
    document.getElementById('edit_buku_penerbit').value = item.buku_penerbit || '';
    document.getElementById('edit_buku_file').value = item.buku_file || '';
    document.getElementById('edit_buku_tahun').value = item.buku_tahun || '';
    document.getElementById('edit_pengguna_kode').value = item.pengguna_kode || '';
    document.getElementById('edit__pengguna_jenis').value = item._pengguna_jenis || '';
    document.getElementById('edit__pengguna_nama').value = item._pengguna_nama || '';
    document.getElementById('edit_Prodi').value = item.Prodi || '';

    // Tampilkan modal edit
    openModal('editDataModal');
}

// Tipe data warning
document.addEventListener('DOMContentLoaded', function () {
    // Biaya dan Tahun harus angka
    ['buku_tahun', 'buku_jumlah_halaman'].forEach(function (field) {
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
        'Judul',
        'buku_isbn',
        'buku_jumlah_halaman',
        'buku_penerbit',
        // 'buku_file', // Tidak wajib, tapi ada warning jika format salah
        'buku_tahun',
        'pengguna_kode',
        '_pengguna_jenis',
        '_pengguna_nama',
        'Prodi'
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
document.addEventListener('keydown', function (event) {
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

    // Get column index for sorting (adjusted for publikasi Buku table structure)
    const columnMap = {
        'Judul': 1,
        'buku_isbn': 2,
        'buku_jumlah_halaman': 3,
        'buku_penerbit': 4,
        'buku_tahun': 6,
        'pengguna_kode': 7,
        '_pengguna_jenis': 8,
        '_pengguna_nama': 9,
        'Prodi': 10
    };

    const columnIndex = columnMap[column];

    // Sort rows
    rows.sort((a, b) => {
        let aValue = a.cells[columnIndex].textContent.trim();
        let bValue = b.cells[columnIndex].textContent.trim();

        // Handle numeric columns
        if (column === 'buku_jumlah_halaman' || column === 'buku_tahun') {
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
