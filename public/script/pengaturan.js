// Global variables
let currentKategoriId = null;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    loadKategori();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Add kategori button
    document.getElementById('addKategoriBtn').addEventListener('click', function() {
        openModal('addKategoriModal');
    });

    // Add kategori form
    document.getElementById('addKategoriForm').addEventListener('submit', handleAddKategori);
    
    // Add option form
    document.getElementById('addOptionForm').addEventListener('submit', handleAddOption);
    
    // Edit kategori form
    document.getElementById('editKategoriForm').addEventListener('submit', handleEditKategori);
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
    const container = document.getElementById('kategoriContainer');
    
    if (kategoriList.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500">Belum ada kategori yang dibuat</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = kategoriList.map(kategori => `
        <div class="kategori-card bg-white rounded-lg p-6 shadow-sm">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-semibold text-gray-800">${kategori.kategori}</h3>
                <div class="flex gap-2">
                    <button onclick="editKategori('${kategori._id}', '${kategori.kategori}')" 
                            class="text-blue-500 hover:text-blue-700">
                        <span class="material-icons-outlined text-sm">edit</span>
                    </button>
                    <button onclick="deleteKategori('${kategori._id}')" 
                            class="text-red-500 hover:text-red-700">
                        <span class="material-icons-outlined text-sm">delete</span>
                    </button>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-600">Options:</span>
                    <button onclick="addOption('${kategori._id}')" 
                            class="text-green-500 hover:text-green-700 text-sm">
                        <span class="material-icons-outlined text-xs">add</span>
                    </button>
                </div>
                <div class="flex flex-wrap gap-1">
                    ${kategori.option.map(opt => `
                        <span class="option-tag">
                            ${opt}
                            <button onclick="removeOption('${kategori._id}', '${opt}')">×</button>
                        </span>
                    `).join('')}
                    ${kategori.option.length === 0 ? '<span class="text-gray-400 text-sm">Belum ada option</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Handle add kategori
async function handleAddKategori(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        kategori: document.getElementById('kategoriName').value,
        firstOption: document.getElementById('firstOption').value
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
            showMessage('success', result.message);
            closeModal('addKategoriModal');
            document.getElementById('addKategoriForm').reset();
            loadKategori();
        } else {
            showMessage('error', result.message);
        }
    } catch (error) {
        console.error('Error adding kategori:', error);
        showMessage('error', 'Terjadi kesalahan saat menambah kategori');
    }
}

// Handle edit kategori
async function handleEditKategori(event) {
    event.preventDefault();
    
    const id = document.getElementById('editKategoriId').value;
    const kategori = document.getElementById('editKategoriName').value;
    
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
            showMessage('success', result.message);
            closeModal('editKategoriModal');
            loadKategori();
        } else {
            showMessage('error', result.message);
        }
    } catch (error) {
        console.error('Error editing kategori:', error);
        showMessage('error', 'Terjadi kesalahan saat mengupdate kategori');
    }
}

// Handle add option
async function handleAddOption(event) {
    event.preventDefault();
    
    const id = document.getElementById('optionKategoriId').value;
    const option = document.getElementById('optionName').value;
    
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
            showMessage('success', result.message);
            closeModal('addOptionModal');
            document.getElementById('addOptionForm').reset();
            loadKategori();
        } else {
            showMessage('error', result.message);
        }
    } catch (error) {
        console.error('Error adding option:', error);
        showMessage('error', 'Terjadi kesalahan saat menambah option');
    }
}

// Edit kategori
function editKategori(id, nama) {
    document.getElementById('editKategoriId').value = id;
    document.getElementById('editKategoriName').value = nama;
    openModal('editKategoriModal');
}

// Delete kategori
async function deleteKategori(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/kategori/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('success', result.message);
            loadKategori();
        } else {
            showMessage('error', result.message);
        }
    } catch (error) {
        console.error('Error deleting kategori:', error);
        showMessage('error', 'Terjadi kesalahan saat menghapus kategori');
    }
}

// Add option
function addOption(id) {
    document.getElementById('optionKategoriId').value = id;
    openModal('addOptionModal');
}

// Remove option
async function removeOption(id, option) {
    if (!confirm(`Apakah Anda yakin ingin menghapus option "${option}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/kategori/${id}/option`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ option })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('success', result.message);
            loadKategori();
        } else {
            showMessage('error', result.message);
        }
    } catch (error) {
        console.error('Error removing option:', error);
        showMessage('error', 'Terjadi kesalahan saat menghapus option');
    }
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Show message
function showMessage(type, message) {
    const container = document.getElementById('messageContainer');
    const alertClass = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
    
    container.innerHTML = `
        <div class="${alertClass} px-4 py-3 mb-6 rounded border" role="alert">
            <span class="block sm:inline">${message}</span>
        </div>
    `;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}
