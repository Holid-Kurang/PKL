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
    form.action = `/dashboard/penelitian/pusat/update/${item._id}`;

    // Isi setiap field dalam form edit dengan data dari item
    document.getElementById('edit_TAHUN').value = item.TAHUN || '';
    document.getElementById('edit_SKEMA').value = item.SKEMA || '';
    document.getElementById('edit_NAMA').value = item.NAMA || '';
    document.getElementById('edit_Anggota1').value = item.Anggota1 || '';
    document.getElementById('edit_Anggota2').value = item.Anggota2 || '';
    document.getElementById('edit_Anggota3').value = item.Anggota3 || '';
    document.getElementById('edit_Anggota4').value = item.Anggota4 || '';
    document.getElementById('edit_NIP').value = item.NIP || '';
    document.getElementById('edit_NIDN').value = item.NIDN || '';
    document.getElementById('edit_PRODI').value = item.PRODI || '';
    document.getElementById('edit_JUDUL').value = item.JUDUL || '';
    document.getElementById('edit_BIAYA').value = item.BIAYA || '';

    // Tampilkan modal edit
    openModal('editDataModal');
}

// Tipe data warning
document.addEventListener('DOMContentLoaded', function () {
    // Biaya dan Tahun harus angka
    ['BIAYA', 'TAHUN'].forEach(function (field) {
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
        'TAHUN', 'SKEMA', 'NAMA', 'Anggota1', 'NIP', 'NIDN', 'PRODI', 'JUDUL', 'BIAYA'
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