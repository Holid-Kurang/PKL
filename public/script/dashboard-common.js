/**
 * Dashboard Common JavaScript
 * File ini berisi fungsi-fungsi umum yang digunakan di semua halaman dashboard
 */

// Buka menu berdasarkan kategori saat halaman dimuat
window.onload = function () {
    // Deteksi kategori dari URL
    const path = window.location.pathname;
    if (path.includes('/penelitian/')) {
        toggleMenu('penelitianMenu');
    } else if (path.includes('/pengabdian/')) {
        toggleMenu('pengabdianMenu');
    } else if (path.includes('/publikasi/')) {
        toggleMenu('publikasiMenu');
    }
};

// Fungsi untuk membuka modal
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Fungsi untuk membuka modal delete dengan action yang dinamis
function openDeleteModal(action) {
    const deleteForm = document.getElementById('deleteForm');
    deleteForm.action = action;
    openModal('deleteDataModal');
}

// Fungsi generic untuk membuka modal edit
function openEditModal(itemString, formConfig) {
    try {
        // Parse string JSON yang dikirim dari tombol
        const item = JSON.parse(itemString);

        // Pilih form dan atur actionnya
        const form = document.getElementById('editDataForm');
        const basePath = getBasePath();
        form.action = `${basePath}/update/${item._id}?_method=PUT`;

        // Isi setiap field dalam form edit dengan data dari item
        Object.keys(formConfig).forEach(fieldKey => {
            const fieldConfig = formConfig[fieldKey];
            const element = document.getElementById(`edit_${fieldKey}`);
            
            if (element) {
                if (fieldConfig.type === 'array') {
                    // Handle array fields (seperti Anggota)
                    populateArrayFields(fieldKey, item[fieldKey] || [], fieldConfig.containerId);
                } else {
                    // Handle regular fields
                    element.value = item[fieldKey] || '';
                }
            }
        });

        // Tampilkan modal edit
        openModal('editDataModal');
    } catch (error) {
        console.error('Error opening edit modal:', error);
        alert('Terjadi kesalahan saat membuka form edit');
    }
}

// Fungsi untuk mendapatkan base path dari URL
function getBasePath() {
    const path = window.location.pathname;
    // Ambil path tanpa parameter tambahan
    const segments = path.split('/').filter(segment => segment);
    if (segments.length >= 3) {
        return `/${segments[0]}/${segments[1]}/${segments[2]}`;
    }
    return path;
}

// Fungsi untuk menambah field dinamis (seperti anggota)
function addDynamicField(containerId, fieldName, placeholder = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const fieldCount = container.children.length;
    const newFieldHtml = `
        <div class="flex items-center space-x-2 mb-2">
            <input type="text" 
                   name="${fieldName}" 
                   placeholder="${placeholder}"
                   class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button type="button" 
                    onclick="removeDynamicField(this)" 
                    class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Hapus
            </button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', newFieldHtml);
}

// Fungsi untuk menghapus field dinamis
function removeDynamicField(button) {
    button.parentElement.remove();
}

// Fungsi untuk populate array fields pada modal edit
function populateArrayFields(fieldName, dataArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Hapus field yang sudah ada
    container.innerHTML = '';

    // Tambahkan field untuk setiap item dalam array
    dataArray.forEach(item => {
        const fieldHtml = `
            <div class="flex items-center space-x-2 mb-2">
                <input type="text" 
                       name="${fieldName}" 
                       value="${item}"
                       class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button type="button" 
                        onclick="removeDynamicField(this)" 
                        class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                    Hapus
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', fieldHtml);
    });

    // Jika array kosong, tambahkan satu field kosong
    if (dataArray.length === 0) {
        addDynamicField(containerId, fieldName, 'Masukkan nama anggota');
    }
}

// Event listener untuk mencegah submit form kosong
document.addEventListener('DOMContentLoaded', function () {
    // Validasi form sebelum submit
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Mohon lengkapi semua field yang wajib diisi!');
            }
        });
    });
});

// Fungsi untuk sort table (opsional)
function sortTable(columnIndex, tableId = 'dataTable') {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Tentukan arah sort (asc/desc)
    const isAscending = !table.dataset.sortDirection || table.dataset.sortDirection === 'desc';
    table.dataset.sortDirection = isAscending ? 'asc' : 'desc';
    
    // Sort rows
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        // Coba parse sebagai number
        const aNum = parseFloat(aText);
        const bNum = parseFloat(bText);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        } else {
            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        }
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}
