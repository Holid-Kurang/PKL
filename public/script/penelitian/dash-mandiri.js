        // Fungsi untuk membuka modal (ganti 'addDataModal' dengan ID modal yang sesuai)
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// // Buka menu "Penelitian" secara default saat halaman dimuat
// window.onload = function () {
//     toggleMenu('penelitianMenu');
// };

// Fungsi BARU untuk membuka dan mengisi modal edit
function openEditModal(itemString) {
    // Parse string JSON yang dikirim dari tombol
    const item = JSON.parse(itemString);

    // Pilih form dan atur actionnya ke route update yang benar
    const form = document.getElementById('editDataForm');
    form.action = `/dashboard/penelitian/mandiri/update/${item._id}`;

    // Isi setiap field dalam form edit dengan data dari item
    document.getElementById('edit_Judul').value = item.Judul || '';
    document.getElementById('edit_Skema').value = item.Skema || '';
    document.getElementById('edit_Prodi').value = item.Prodi || '';
    document.getElementById('edit_Ketua').value = item.Ketua || '';
    document.getElementById('edit_Anggota1').value = item.Anggota1 || '';
    document.getElementById('edit_Anggota2').value = item.Anggota2 || '';
    document.getElementById('edit_Anggota3').value = item.Anggota3 || '';
    document.getElementById('edit_Anggota4').value = item.Anggota4 || '';
    document.getElementById('edit_Dana').value = item.Dana || '';
    document.getElementById('edit_tahun').value = item.tahun || '';

    // Tampilkan modal edit
    openModal('editDataModal');
}

// Tipe data warning
document.addEventListener('DOMContentLoaded', function () {
    // Biaya dan Tahun harus angka
    ['Dana', 'tahun'].forEach(function (field) {
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

    // Pindahkan validasi tombol Simpan ke event submit form
    const addDataForm = document.getElementById('addDataForm');
    if (addDataForm) {
        addDataForm.addEventListener('submit', function (event) {
            // Nilai harus angka
            const nilaiInput = document.getElementById('Nilai');
            const nilaiTypeError = document.getElementById('type-error-Nilai');
            if (nilaiInput && (nilaiInput.value === '' || isNaN(Number(nilaiInput.value)))) {
                if (nilaiTypeError) nilaiTypeError.classList.remove('hidden');
                event.preventDefault();
                return false;
            }
            if (!validateForm(event)) {
                event.preventDefault();
                return false;
            }
        });
    }
});

function validateForm(event) {
    let valid = true;
    const requiredFields = [
        'JUDUL', 'SKEMA', 'PRODI', 'NAMA', 'Anggota1', 'BIAYA', 'TAHUN'
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