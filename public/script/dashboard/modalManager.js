/**
 * Modal Manager Module
 * Handles all modal operations
 */

class ModalManager {
    constructor() {
        this.modals = {
            form: document.getElementById('modal-form'),
            delete: document.getElementById('modal-delete'),
            import: document.getElementById('modal-import')
        };
    }

    openFormModal(title) {
        document.getElementById('modal-title').textContent = title;
        this.modals.form.classList.add('active');
    }

    closeFormModal() {
        this.modals.form.classList.remove('active');
        document.getElementById('data-form').reset();
    }

    openDeleteModal() {
        this.modals.delete.classList.add('active');
    }

    closeDeleteModal() {
        this.modals.delete.classList.remove('active');
    }

    openImportModal() {
        this.modals.import.classList.add('active');
    }

    closeImportModal() {
        this.modals.import.classList.remove('active');
        document.getElementById('import-form').reset();
        // Clear warnings
        const warningContainer = document.getElementById('import-warning');
        if (warningContainer) {
            warningContainer.innerHTML = '';
            warningContainer.classList.add('hidden');
        }
    }

    closeAll() {
        Object.values(this.modals).forEach(modal => {
            modal.classList.remove('active');
        });
    }
}
