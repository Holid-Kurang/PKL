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
    form.action = `/dashboard/publikasi/haki/update/${item._id}`;

    // Isi setiap field dalam form edit dengan data dari item
    document.getElementById('edit_hki_judul').value = item.hki_judul || '';
    document.getElementById('edit_hki_jenis').value = item.hki_jenis || '';
    document.getElementById('edit_hki_bulan').value = item.hki_bulan || '';
    document.getElementById('edit_hki_tahun').value = item.hki_tahun || '';
    document.getElementById('edit_pengguna_kode').value = item.pengguna_kode || '';
    document.getElementById('edit__pengguna_nama').value = item._pengguna_nama || '';
    document.getElementById('edit__prodi_nama').value = item._prodi_nama || '';

    // Untuk file, tampilkan link jika ada file lama
    const fileLinkDiv = document.getElementById('edit_hki_file');
    if (item.hki_file) {
        fileLinkDiv.innerHTML = `<a href="${item.hki_file}" target="_blank" class="text-blue-600 underline">Lihat file saat ini</a>`;
    } else {
        fileLinkDiv.innerHTML = '';
    }
    // Reset input file (tidak bisa set value karena alasan keamanan)
    document.getElementById('edit_hki_file').value = '';

    // Tampilkan modal edit
    openModal('editDataModal');
}

// Tipe data warning
document.addEventListener('DOMContentLoaded', function () {
    // Biaya dan Tahun harus angka
    ['hki_tahun',].forEach(function (field) {
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
        'hki_judul',
        'hki_jenis',
        'hki_bulan',
        'hki_tahun',
        'pengguna_kode',
        '_pengguna_nama',
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
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            fileNameDisplay.textContent = `File terpilih: ${file.name}`;
            // Anda bisa menambahkan validasi tipe file atau ukuran di sini
        }
    }