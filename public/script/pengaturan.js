// Global variables
let currentKategoriId = null;
let deleteAction = null;
let deleteData = null;

// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
    loadKategori();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add kategori button and form
    document.getElementById('btn-add-kategori').addEventListener('click', openAddKategoriModal);
    document.getElementById('form-add-kategori').addEventListener('submit', handleAddKategori);
    document.getElementById('btn-cancel-add-kategori').addEventListener('click', () => closeModal('modal-add-kategori'));
    document.getElementById('close-add-kategori').addEventListener('click', () => closeModal('modal-add-kategori'));

    // Edit kategori form
    document.getElementById('form-edit-kategori').addEventListener('submit', handleEditKategori);
    document.getElementById('btn-cancel-edit-kategori').addEventListener('click', () => closeModal('modal-edit-kategori'));
    document.getElementById('close-edit-kategori').addEventListener('click', () => closeModal('modal-edit-kategori'));

    // Add option form
    document.getElementById('form-add-option').addEventListener('submit', handleAddOption);
    document.getElementById('btn-cancel-add-option').addEventListener('click', () => closeModal('modal-add-option'));
    document.getElementById('close-add-option').addEventListener('click', () => closeModal('modal-add-option'));

    // Delete modal
    document.getElementById('btn-cancel-delete').addEventListener('click', () => closeModal('modal-delete'));
    document.getElementById('close-delete').addEventListener('click', () => closeModal('modal-delete'));
    document.getElementById('btn-confirm-delete').addEventListener('click', handleDelete);

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
            showMessage('error', 'Gagal memuat data kategori');
        }
    } catch (error) {
        console.error('Error loading kategori:', error);
        showMessage('error', 'Terjadi kesalahan saat memuat data');
    }
}

// Display kategori cards
function displayKategori(kategoriList) {
    const container = document.getElementById('kategori-container');

    if (kategoriList.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500">Belum ada kategori yang dibuat</p>
            </div>
        `;
        return;
    }

    container.innerHTML = kategoriList.map(kategori => `
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-gray-800">${kategori.kategori}</h3>
                <div class="flex gap-2">
                    <button onclick="openEditKategoriModal('${kategori._id}', '${kategori.kategori}')" 
                            class="text-indigo hover:text-indigo/80 transition-colors">
                        <span class="material-icons-outlined text-sm">edit</span>
                    </button>
                    <button onclick="openDeleteKategoriModal('${kategori._id}', '${kategori.kategori}')" 
                            class="text-red-600 hover:text-red-800 transition-colors">
                        <span class="material-icons-outlined text-sm">delete</span>
                    </button>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-600">Options (${kategori.option.length}):</span>
                    <button onclick="openAddOptionModal('${kategori._id}', '${kategori.kategori}')" 
                            class="text-green-600 hover:text-green-800 transition-colors">
                        <span class="material-icons-outlined text-sm">add_circle</span>
                    </button>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${kategori.option.length === 0
            ? '<span class="text-gray-400 text-sm italic">Belum ada opsi</span>'
            : kategori.option.map(opt => `
                            <span class="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                                ${opt}
                                <button onclick="openDeleteOptionModal('${kategori._id}', '${opt}')" 
                                        class="ml-1 text-blue-700 hover:text-blue-900 font-bold">
                                    ×
                                </button>
                            </span>
                        `).join('')
        }
                </div>
            </div>
        </div>
    `).join('');
}

// Open add kategori modal
function openAddKategoriModal() {
    document.getElementById('kategori-name').value = '';
    document.getElementById('first-option').value = '';
    openModal('modal-add-kategori');
}

// Handle add kategori
async function handleAddKategori(event) {
    event.preventDefault();

    const data = {
        kategori: document.getElementById('kategori-name').value,
        firstOption: document.getElementById('first-option').value
    };

    try {
        const response = await fetch('/api/kategori', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showToast('success', result.message);
            closeModal('modal-add-kategori');
            document.getElementById('form-add-kategori').reset();
            loadKategori();
        } else {
            showToast('error', result.message);
        }
    } catch (error) {
        console.error('Error adding kategori:', error);
        showToast('error', 'Terjadi kesalahan saat menambah kategori');
    }
}

// Open edit kategori modal
function openEditKategoriModal(id, nama) {
    document.getElementById('edit-kategori-id').value = id;
    document.getElementById('edit-kategori-name').value = nama;
    openModal('modal-edit-kategori');
}

// Handle edit kategori
async function handleEditKategori(event) {
    event.preventDefault();

    const id = document.getElementById('edit-kategori-id').value;
    const kategori = document.getElementById('edit-kategori-name').value;

    try {
        const response = await fetch(`/api/kategori/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ kategori })
        });

        const result = await response.json();

        if (result.success) {
            showToast('success', result.message);
            closeModal('modal-edit-kategori');
            loadKategori();
        } else {
            showToast('error', result.message);
        }
    } catch (error) {
        console.error('Error editing kategori:', error);
        showToast('error', 'Terjadi kesalahan saat mengupdate kategori');
    }
}

// Open delete kategori modal
function openDeleteKategoriModal(id, nama) {
    deleteAction = 'kategori';
    deleteData = { id, nama };
    document.getElementById('delete-message').textContent = `Apakah Anda yakin ingin menghapus kategori "${nama}"? Semua opsi di dalamnya juga akan terhapus.`;
    openModal('modal-delete');
}

// Open add option modal
function openAddOptionModal(id, kategoriNama) {
    document.getElementById('add-option-kategori-id').value = id;
    document.getElementById('add-option-kategori-name').value = kategoriNama;
    document.getElementById('new-option').value = '';
    openModal('modal-add-option');
}

// Handle add option
async function handleAddOption(event) {
    event.preventDefault();

    const id = document.getElementById('add-option-kategori-id').value;
    const option = document.getElementById('new-option').value;

    try {
        const response = await fetch(`/api/kategori/${id}/option`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
                method: 'DELETE'
            });
        } else if (deleteAction === 'option') {
            response = await fetch(`/api/kategori/${deleteData.id}/option`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
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
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    // Add to body
    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Make functions globally accessible
window.openAddKategoriModal = openAddKategoriModal;
window.openEditKategoriModal = openEditKategoriModal;
window.openDeleteKategoriModal = openDeleteKategoriModal;
window.openAddOptionModal = openAddOptionModal;
window.openDeleteOptionModal = openDeleteOptionModal;
