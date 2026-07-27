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

        // Filter dropdowns
        const filterTahun = document.getElementById('filter-tahun');
        const filterProdi = document.getElementById('filter-prodi');
        const btnResetFilter = document.getElementById('btn-reset-filter');

        if (filterTahun) {
            filterTahun.addEventListener('change', () => this.handleFilter());
        }
        if (filterProdi) {
            filterProdi.addEventListener('change', () => this.handleFilter());
        }
        if (btnResetFilter) {
            btnResetFilter.addEventListener('click', () => this.handleResetFilter());
        }

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

        // Event delegation for dynamic elements
        document.getElementById('table-header').addEventListener('click', (e) => this.handleTableSort(e));
        document.getElementById('table-body').addEventListener('click', (e) => this.handleTableAction(e));
        document.getElementById('pagination-controls').addEventListener('click', (e) => this.handlePaginationClick(e));
        document.getElementById('modal-form').addEventListener('click', (e) => this.handleFormActions(e));
        document.getElementById('modal-import').addEventListener('click', (e) => this.handleImportActions(e));
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

    // ========== Event Handlers for Delegation ==========
    handleTableSort(e) {
        const header = e.target.closest('th[data-sort-field]');
        if (header) {
            const field = header.dataset.sortField;
            this.handleSort(field);
        }
    }

    handleTableAction(e) {
        const button = e.target.closest('button[data-id]');
        if (!button) return;

        const action = button.dataset.action;
        const id = button.dataset.id;

        if (action === 'edit') {
            this.handleEdit(id);
        } else if (action === 'delete') {
            this.handleDeleteModal(id);
        }
    }

    handlePaginationClick(e) {
        const button = e.target.closest('button[data-page]');
        if (button && !button.disabled) {
            const page = parseInt(button.dataset.page, 10);
            this.handlePageChange(page);
        }
    }

    handleFormActions(e) {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;

        if (action === 'add-array-item') {
            this.addArrayItem(button);
        } else if (action === 'remove-array-item') {
            this.removeArrayItem(button);
        }
    }

    handleImportActions(e) {
        const button = e.target.closest('button[data-action="close-warning-reload"]');
        if (button) {
            this.closeWarningAndReload();
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
        const filterParams = {
            tahun: this.state.filterTahun,
            prodi: this.state.filterProdi,
            search: this.state.searchTerm
        };
        window.location.href = this.api.getExportUrl(filterParams);
    }

    handleFilter() {
        const tahun = document.getElementById('filter-tahun')?.value || '';
        const prodi = document.getElementById('filter-prodi')?.value || '';
        this.state.setFilter(tahun, prodi);
        this._updateResetFilterButton();
        this.loadData();
    }

    handleResetFilter() {
        const filterTahun = document.getElementById('filter-tahun');
        const filterProdi = document.getElementById('filter-prodi');
        if (filterTahun) filterTahun.value = '';
        if (filterProdi) filterProdi.value = '';
        this.state.resetFilter();
        this._updateResetFilterButton();
        this.loadData();
    }

    _updateResetFilterButton() {
        const resetBtn = document.getElementById('btn-reset-filter');
        const exportBtn = document.getElementById('btn-export');
        const hasFilter = this.state.filterTahun || this.state.filterProdi;

        // Toggle reset button visibility
        if (resetBtn) {
            resetBtn.classList.toggle('hidden', !hasFilter);
        }

        // Toggle export button: active (green) when filter is set, disabled (gray) otherwise
        if (exportBtn) {
            if (hasFilter) {
                exportBtn.disabled = false;
                exportBtn.title = 'Export data sesuai filter yang aktif';
                exportBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded transition-all duration-200 text-white bg-green-600 hover:bg-green-700 cursor-pointer';
            } else {
                exportBtn.disabled = true;
                exportBtn.title = 'Pilih filter Tahun atau Prodi untuk mengaktifkan export';
                exportBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded transition-all duration-200 text-gray-400 bg-gray-200 cursor-not-allowed opacity-60';
            }
        }
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
                this.showToast('Data berhasil disimpan', 'success');
                this.modalManager.closeFormModal();
                this.loadData();
            } else {
                this.showToast('Gagal menyimpan data: ' + (result.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showToast('Terjadi kesalahan saat menyimpan data', 'error');
        }
    }

    async handleDelete() {
        if (!this.state.deleteId) return;

        try {
            const result = await this.api.deleteData(this.state.deleteId);

            if (result.success) {
                this.showToast('Data berhasil dihapus', 'success');
                this.modalManager.closeDeleteModal();
                this.state.deleteId = null;
                this.loadData();
            } else {
                this.showToast('Gagal menghapus data: ' + (result.message || 'Unknown error'), 'error');
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            this.showToast('Terjadi kesalahan saat menghapus data', 'error');
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
        warningHtml += '<button type="button" data-action="close-warning-reload" class="mt-3 px-3 py-1.5 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700">Tutup & Refresh</button>';
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

    // ========== Toast Notification ==========
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500';

        toast.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${bgColor} text-white font-semibold flex items-center gap-2`;
        toast.style.transform = 'translateX(400px)';

        // Add icon based on type
        const icon = type === 'success' ? '✓' :
            type === 'error' ? '✕' :
                type === 'warning' ? '⚠' :
                    'ℹ';

        toast.innerHTML = `<span class="text-xl">${icon}</span><span>${message}</span>`;

        document.body.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Slide out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // ========== Array Field Helpers ==========
    addArrayItem(button) {
        const field = button.dataset.field;
        const label = button.dataset.label;
        const container = document.getElementById(`array-container-${field}`);
        const newItem = document.createElement('div');
        newItem.className = 'flex gap-2 array-item';
        newItem.innerHTML = `
            <input type="text" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo" 
                placeholder="Masukkan ${label.toLowerCase()}">
            <button type="button" 
                data-action="remove-array-item"
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
