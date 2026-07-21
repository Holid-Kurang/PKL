// Global variables
let currentKategoriId = null;
let deleteAction = null;
let deleteData = null;

// Helper function to get CSRF token
function getCsrfToken() {
    const tokenInput = document.querySelector('input[name="_csrf"]');
    if (tokenInput) {
        return tokenInput.value;
    }
    return document.querySelector('meta[name="csrf-token"]')?.content || '';
}

// Helper function to get headers with CSRF token
function getHeaders(customHeaders = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...customHeaders
    };

    const csrfToken = getCsrfToken();
    if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
    }

    return headers;
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
    loadKategori();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add option form
    document.getElementById('form-add-option').addEventListener('submit', handleAddOption);
    document.getElementById('btn-cancel-add-option').addEventListener('click', () => closeModal('modal-add-option'));
    document.getElementById('close-add-option').addEventListener('click', () => closeModal('modal-add-option'));

    // Delete modal
    document.getElementById('btn-cancel-delete').addEventListener('click', () => closeModal('modal-delete'));
    document.getElementById('close-delete').addEventListener('click', () => closeModal('modal-delete'));
    document.getElementById('btn-confirm-delete').addEventListener('click', handleDelete);

    const container = document.getElementById('kategori-container');
    if (container) {
        container.addEventListener('click', function (event) {
            // Cari elemen tombol terdekat berdasarkan class-nya
            const addOptBtn = event.target.closest('.btn-add-option');
            const delOptBtn = event.target.closest('.btn-delete-option');
            
            if (addOptBtn) {
                const id = addOptBtn.getAttribute('data-id');
                const name = addOptBtn.getAttribute('data-name');
                openAddOptionModal(id, name);
            } else if (delOptBtn) {
                const id = delOptBtn.getAttribute('data-id');
                const option = delOptBtn.getAttribute('data-option');
                openDeleteOptionModal(id, option);
            }
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Load all kategori
async function loadKategori() {
    try {
        const response = await fetch('/api/kategori');
        const result = await response.json();

        if (result.success) {
            displayKategori(result.data);
        } else {
            showToast('error', 'Gagal memuat data kategori');
        }
    } catch (error) {
        console.error('Error loading kategori:', error);
        showToast('error', 'Terjadi kesalahan saat memuat data');
    }
}

function displayKategori(kategoriList) {
    const container = document.getElementById('kategori-container');

    if (kategoriList.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <span class="material-icons-outlined text-6xl text-gray-300 mb-3 block">settings_suggest</span>
                <p class="text-gray-500 text-lg font-medium">Belum ada kategori yang dibuat</p>
                <p class="text-gray-400 text-sm mt-1">Kategori akan muncul di sini setelah ditambahkan</p>
            </div>
        `;
        return;
    }

    container.innerHTML = kategoriList.map(kategori => `
        <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div class="flex justify-between items-center mb-5">
                <div class="flex items-center gap-3">
                    <h3 class="text-lg font-semibold text-gray-800">${kategori.kategori}</h3>
                </div>
            </div>
            
            <div>
                <div class="flex justify-between items-center mb-3">
                    <span class="text-sm font-medium text-gray-500">Opsi tersedia (${kategori.option.length})</span>
                    <button data-id="${kategori._id}" data-name="${kategori.kategori}" 
                            class="btn-add-option inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-900/40 rounded-lg hover:bg-indigo-900/60 transition-colors duration-200"
                            title="Tambah opsi baru">
                        <span class="material-icons-outlined text-base">add</span>
                        Tambah
                    </button>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${kategori.option.length === 0
                        ? `<div class="w-full text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                               <span class="material-icons-outlined text-3xl text-gray-300 block mb-1">playlist_add</span>
                               <span class="text-gray-400 text-sm">Belum ada opsi</span>
                           </div>`
                        : kategori.option.map(opt => `
                            <span class="group inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-900/40 text-indigo-700 rounded-lg transition-all duration-200 hover:bg-indigo-900/60">
                                ${opt}
                                <button data-id="${kategori._id}" data-option="${opt}" 
                                        class="btn-delete-option opacity-60 hover:opacity-100 transition-opacity duration-200"
                                        title="Hapus opsi ${opt}">
                                    <span class="material-icons-outlined text-base leading-none">close</span>
                                </button>
                            </span>
                        `).join('')
                    }
                </div>
            </div>
        </div>
    `).join('');
}


// Open add option modal
function openAddOptionModal(id, kategoriNama) {
    document.getElementById('add-option-kategori-id').value = id;
    document.getElementById('new-option').value = '';
    document.getElementById('new-option').placeholder = 'Tambah Opsi ' + kategoriNama + '...';

    // Show strata dropdown only for Program Studi
    const strataContainer = document.getElementById('strata-container');
    if (kategoriNama === 'Program Studi') {
        strataContainer.classList.remove('hidden');
        strataContainer.classList.add('block');
        document.getElementById('strata-select').value = 'S1';
    } else {
        strataContainer.classList.remove('block');
        strataContainer.classList.add('hidden');
    }

    openModal('modal-add-option');
}

// Handle add option
async function handleAddOption(event) {
    event.preventDefault();

    const id = document.getElementById('add-option-kategori-id').value;
    let option = document.getElementById('new-option').value;
    // title case
    option = option.toLowerCase().split(/\s+/).map(word => word[0]?.toUpperCase() + word.slice(1)).join(" ");

    // Prepend strata prefix if strata dropdown is visible (Program Studi)
    const strataContainer = document.getElementById('strata-container');
    if (strataContainer.style.display !== 'none') {
        let strata = document.getElementById('strata-select').value;
        strata = strata.split(" ")[0]; // mengambil kata pertama
        option = strata + " " + option;
    }

    try {
        const response = await fetch(`/api/kategori/${id}/option`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ option })
        });

        const result = await response.json();

        if (result.success) {
            showToast('success', result.message);
            closeModal('modal-add-option');
            document.getElementById('form-add-option').reset();
            loadKategori();
        } else {
            showToast('error', result.message);
        }
    } catch (error) {
        console.error('Error adding option:', error);
        showToast('error', 'Terjadi kesalahan saat menambah opsi');
    }
}

// Open delete option modal
function openDeleteOptionModal(id, option) {
    deleteAction = 'option';
    deleteData = { id, option };
    document.getElementById('delete-message').textContent = `Apakah Anda yakin ingin menghapus opsi "${option}"?`;
    openModal('modal-delete');
}

// Handle delete (kategori or option)
async function handleDelete() {
    if (!deleteAction || !deleteData) return;

    try {
        let response;

        if (deleteAction === 'kategori') {
            response = await fetch(`/api/kategori/${deleteData.id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
        } else if (deleteAction === 'option') {
            response = await fetch(`/api/kategori/${deleteData.id}/option`, {
                method: 'DELETE',
                headers: getHeaders(),
                body: JSON.stringify({ option: deleteData.option })
            });
        }

        const result = await response.json();

        if (result.success) {
            showToast('success', result.message);
            closeModal('modal-delete');
            loadKategori();
        } else {
            showToast('error', result.message);
        }
    } catch (error) {
        console.error('Error deleting:', error);
        showToast('error', 'Terjadi kesalahan saat menghapus');
    } finally {
        deleteAction = null;
        deleteData = null;
    }
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Show toast notification
function showToast(type, message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}