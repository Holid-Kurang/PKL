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
    form.action = `/dashboard/pengabdian/pnbp/update/${item._id}`;

    // Isi setiap field dalam form edit dengan data dari item
    document.getElementById('edit_Judul').value = item.Judul || '';
    document.getElementById('edit_SKEMA').value = item.SKEMA || '';
    document.getElementById('edit_Ketua').value = item.Ketua || '';
    document.getElementById('edit_Anggota1').value = item.Anggota1 || '';
    document.getElementById('edit_Anggota2').value = item.Anggota2 || '';
    document.getElementById('edit_Anggota3').value = item.Anggota3 || '';
    document.getElementById('edit_Anggota4').value = item.Anggota4 || '';
    document.getElementById('edit_NilaiRataRata').value = item.NilaiRataRata || '';
    document.getElementById('edit_BiayaDisetujui').value = item.BiayaDisetujui || '';
    document.getElementById('edit_Prodi').value = item.Prodi || '';
    document.getElementById('edit_Tahun').value = item.Tahun || '';

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
    ['BiayaDisetujui', 'Tahun'].forEach(function (field) {
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

    // Nilai harus angka (jika memang harus angka, jika tidak hapus bagian ini)
    const nilaiInput = document.getElementById('NilaiRataRata');
    const nilaiTypeError = document.getElementById('type-error-NilaiRataRata');
    if (nilaiInput && nilaiTypeError) {
        nilaiInput.addEventListener('input', function () {
            if (nilaiInput.value && isNaN(Number(nilaiInput.value))) {
                nilaiTypeError.classList.remove('hidden');
            } else {
                nilaiTypeError.classList.add('hidden');
            }
        });
    }

    // Pindahkan validasi tombol Simpan ke event submit form
    const addDataForm = document.getElementById('addDataForm');
    if (addDataForm) {
        addDataForm.addEventListener('submit', function (event) {
            // Nilai harus angka
            const nilaiInput = document.getElementById('NilaiRataRata');
            const nilaiTypeError = document.getElementById('type-error-NilaiRataRata');
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
    // Field wajib diisi pada modal edit, sesuai id input dan id error-nya
    const requiredFields = [
        'Judul',
        'SKEMA',
        'Ketua',
        'Anggota1',
        'Prodi',
        'Tahun',
        'NilaiRataRata',
        'edit_Judul',
        'edit_SKEMA',
        'edit_Ketua',
        'edit_Anggota1',
        'edit_Prodi',
        'edit_Tahun',
        'edit_NilaiRataRata',
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

// --- LOGIKA UNTUK MODAL IMPORT FILE ---
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileNameDisplay');

// Mencegah perilaku default browser
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Menambahkan highlight saat file diseret di atas drop zone
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('bg-gray-200'), false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('bg-gray-200'), false);
});

// Menangani file yang dijatuhkan (drop)
dropZone.addEventListener('drop', handleDrop, false);
function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}

// Menangani file yang dipilih melalui tombol
fileInput.addEventListener('change', function () {
    handleFiles(this.files);
});

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        fileNameDisplay.textContent = `File terpilih: ${file.name}`;
        // Anda bisa menambahkan validasi tipe file atau ukuran di sini
    }
}