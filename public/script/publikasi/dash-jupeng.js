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