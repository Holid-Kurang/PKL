/**
 * Dashboard Application Main Module
 * Orchestrates all dashboard functionality
 */

class DashboardApp {
    constructor(configData) {
        // Initialize modules
        this.config = new DashboardConfig(configData);
        this.state = new DashboardState();
        this.api = new ApiService(this.config);
        this.tableRenderer = new TableRenderer(this.config, this.state);
        this.paginationRenderer = new PaginationRenderer(this.config, this.state);
        this.formBuilder = new FormBuilder(this.config);
        this.modalManager = new ModalManager();

        // Initialize event listeners
        this._initEventListeners();

        // Load initial data
        this.loadData();
    }

    // ========== Event Listeners ==========
    _initEventListeners() {
        // Action buttons
        document.getElementById('btn-add').addEventListener('click', () => this.handleAdd());
        document.getElementById('btn-export').addEventListener('click', () => this.handleExport());
        document.getElementById('btn-import').addEventListener('click', () => this.handleImportModal());

        // Search with debouncing
        document.getElementById('search-input').addEventListener('input', () => {
            clearTimeout(this.state.searchDebounceTimer);
            this.state.searchDebounceTimer = setTimeout(() => this.handleSearch(), 300);
        });

        // Search on Enter
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(this.state.searchDebounceTimer);
                this.handleSearch();
            }
        });

        // Search button
        document.getElementById('btn-search').addEventListener('click', () => {
            clearTimeout(this.state.searchDebounceTimer);
            this.handleSearch();
        });

        // Form modal controls
        document.getElementById('close-form-modal').addEventListener('click', () => this.modalManager.closeFormModal());
        document.getElementById('btn-cancel-form').addEventListener('click', () => this.modalManager.closeFormModal());
        document.getElementById('data-form').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Delete modal controls
        document.getElementById('close-delete-modal').addEventListener('click', () => this.modalManager.closeDeleteModal());
        document.getElementById('btn-cancel-delete').addEventListener('click', () => this.modalManager.closeDeleteModal());
        document.getElementById('btn-confirm-delete').addEventListener('click', () => this.handleDelete());

        // Import modal controls
        document.getElementById('close-import-modal').addEventListener('click', () => this.modalManager.closeImportModal());
        document.getElementById('btn-cancel-import').addEventListener('click', () => this.modalManager.closeImportModal());
        document.getElementById('btn-download-template').addEventListener('click', () => this.handleDownloadTemplate());
        document.getElementById('import-form').addEventListener('submit', (e) => this.handleImport(e));

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.modalManager.closeAll();
            }
        });
    }

    // ========== Data Operations ==========
    async loadData() {
        try {
            this.tableRenderer.renderLoading();

            const params = this.state.getQueryParams();
            const result = await this.api.fetchData(params);

            if (result.success) {
                this.state.setData(result.data);
                this.state.setPagination(result.pagination);
                this.tableRenderer.render();
                this.paginationRenderer.render();
            } else {
                this.tableRenderer.renderError('Gagal memuat data');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.tableRenderer.renderError('Terjadi kesalahan saat memuat data');
        }
    }

    // ========== Action Handlers ==========
    handleAdd() {
        this.state.editingId = null;
        this.formBuilder.generateFields();
        this.modalManager.openFormModal('Tambah Data');
    }

    handleEdit(id) {
        const item = this.state.currentData.find(d => d._id === id);
        if (!item) return;

        this.state.editingId = id;
        this.formBuilder.generateFields(item);
        this.modalManager.openFormModal('Edit Data');
    }

    handleDeleteModal(id) {
        this.state.deleteId = id;
        this.modalManager.openDeleteModal();
    }

    handleImportModal() {
        this.modalManager.openImportModal();
    }

    handleDownloadTemplate() {
        window.location.href = this.api.getTemplateUrl();
    }

    handleExport() {
        window.location.href = this.api.getExportUrl();
    }

    handlePageChange(page) {
        if (this.state.setPage(page)) {
            this.loadData();
        }
    }

    handleSearch() {
        const searchTerm = document.getElementById('search-input').value.trim();
        this.state.setSearch(searchTerm);
        this.loadData();
    }

    handleSort(field) {
        this.state.setSort(field);
        this.loadData();
    }

    // ========== Form Handlers ==========
    async handleFormSubmit(e) {
        e.preventDefault();

        const data = this.formBuilder.collectFormData(e.target);

        try {
            let result;
            if (this.state.editingId) {
                result = await this.api.updateData(this.state.editingId, data);
            } else {
                result = await this.api.createData(data);
            }

            if (result.success) {
                this.modalManager.closeFormModal();
                this.loadData();
            } else {
                alert('Gagal menyimpan data: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Terjadi kesalahan saat menyimpan data');
        }
    }

    async handleDelete() {
        if (!this.state.deleteId) return;

        try {
            const result = await this.api.deleteData(this.state.deleteId);

            if (result.success) {
                this.modalManager.closeDeleteModal();
                this.state.deleteId = null;
                this.loadData();
            } else {
                alert('Gagal menghapus data: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Terjadi kesalahan saat menghapus data');
        }
    }

    async handleImport(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const warningContainer = document.getElementById('import-warning');

        // Clear previous warnings
        warningContainer.innerHTML = '';
        warningContainer.classList.add('hidden');

        try {
            const result = await this.api.importData(formData);

            if (result.success) {
                // Check for warnings
                if (result.warnings && (result.warnings.unmatchedHeaders || result.warnings.missingHeaders)) {
                    this.showImportWarnings(result.warnings, result.data);
                } else {
                    this.modalManager.closeImportModal();
                    this.loadData();
                }
            } else {
                this.showImportError('Gagal mengimpor data: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error importing data:', error);
            this.showImportError('Terjadi kesalahan saat mengimpor data');
        }
    }

    showImportWarnings(warnings, data) {
        const warningContainer = document.getElementById('import-warning');
        let warningHtml = '<div class="bg-yellow-50 border-yellow-300">';
        warningHtml += '<div class="flex items-start gap-3">';
        warningHtml += '<span class="material-icons-outlined text-yellow-600">warning</span>';
        warningHtml += '<div class="flex-1">';
        warningHtml += '<h4 class="text-sm font-semibold text-yellow-900 mb-2">Peringatan Header Excel</h4>';
        warningHtml += `<p class="text-xs text-yellow-800 mb-2">Data berhasil diimport (${data.inserted} dari ${data.total} records), namun ditemukan masalah pada header:</p>`;

        if (warnings.unmatchedHeaders && warnings.unmatchedHeaders.length > 0) {
            warningHtml += '<div class="mb-2">';
            warningHtml += '<p class="text-xs font-medium text-yellow-900">Header tidak dikenali:</p>';
            warningHtml += '<ul class="list-disc list-inside text-xs text-yellow-800 ml-2">';
            warnings.unmatchedHeaders.forEach(header => {
                warningHtml += `<li>${header}</li>`;
            });
            warningHtml += '</ul></div>';
        }

        if (warnings.missingHeaders && warnings.missingHeaders.length > 0) {
            warningHtml += '<div class="mb-2">';
            warningHtml += '<p class="text-xs font-medium text-yellow-900">Header yang hilang:</p>';
            warningHtml += '<ul class="list-disc list-inside text-xs text-yellow-800 ml-2">';
            warnings.missingHeaders.forEach(header => {
                warningHtml += `<li>${header}</li>`;
            });
            warningHtml += '</ul></div>';
        }

        warningHtml += '<p class="text-xs text-yellow-800 mt-2">Gunakan template yang disediakan untuk menghindari masalah ini.</p>';
        warningHtml += '<button type="button" onclick="dashboardApp.closeWarningAndReload()" class="mt-3 px-3 py-1.5 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700">Tutup & Refresh</button>';
        warningHtml += '</div></div></div>';

        warningContainer.innerHTML = warningHtml;
        warningContainer.classList.remove('hidden');
    }

    showImportError(message) {
        const warningContainer = document.getElementById('import-warning');
        let errorHtml = '<div class="bg-red-50 border-red-300">';
        errorHtml += '<div class="flex items-start gap-3">';
        errorHtml += '<span class="material-icons-outlined text-red-600">error</span>';
        errorHtml += '<div class="flex-1">';
        errorHtml += '<h4 class="text-sm font-semibold text-red-900 mb-2">Error Import</h4>';
        errorHtml += `<p class="text-xs text-red-800">${message}</p>`;
        errorHtml += '</div></div></div>';

        warningContainer.innerHTML = errorHtml;
        warningContainer.classList.remove('hidden');
    }

    closeWarningAndReload() {
        const warningContainer = document.getElementById('import-warning');
        warningContainer.innerHTML = '';
        warningContainer.classList.add('hidden');
        this.modalManager.closeImportModal();
        this.loadData();
    }

    // ========== Array Field Helpers ==========
    addArrayItem(field, label) {
        const container = document.getElementById(`array-container-${field}`);
        const newItem = document.createElement('div');
        newItem.className = 'flex gap-2 array-item';
        newItem.innerHTML = `
            <input type="text" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo" 
                placeholder="Masukkan ${label.toLowerCase()}">
            <button type="button" 
                onclick="dashboardApp.removeArrayItem(this)" 
                class="px-3 py-2 text-white transition-colors bg-red-600 rounded hover:bg-red-700">
                <span class="material-icons-outlined text-sm">remove</span>
            </button>
        `;
        container.appendChild(newItem);
    }

    removeArrayItem(button) {
        const container = button.closest('.array-item').parentElement;
        const item = button.closest('.array-item');

        if (container.querySelectorAll('.array-item').length > 1) {
            item.remove();
        } else {
            item.querySelector('input').value = '';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardApp = new DashboardApp(window.dashboardConfig);
});
