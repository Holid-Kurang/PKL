/**
 * Pagination Renderer Module
 * Handles pagination UI rendering
 */

class PaginationRenderer {
    constructor(config, state) {
        this.config = config;
        this.state = state;
    }

    render() {
        this._updateInfo();
        this._renderControls();
    }

    _updateInfo() {
        const start = this.state.totalRecords === 0 ? 0 : (this.state.currentPage - 1) * this.state.itemsPerPage + 1;
        const end = Math.min(this.state.currentPage * this.state.itemsPerPage, this.state.totalRecords);

        document.getElementById('page-start').textContent = start;
        document.getElementById('page-end').textContent = end;
        document.getElementById('total-records').textContent = this.state.totalRecords;
    }

    _renderControls() {
        const paginationControls = document.getElementById('pagination-controls');
        let html = '';

        // Previous button
        html += this._renderPrevButton();

        // Page numbers
        html += this._renderPageNumbers();

        // Next button
        html += this._renderNextButton();

        paginationControls.innerHTML = html;
    }

    _renderPrevButton() {
        const disabled = this.state.currentPage === 1;
        return `
            <button data-page="${this.state.currentPage - 1}" 
                    ${disabled ? 'disabled' : ''} 
                    class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                &laquo; Prev
            </button>
        `;
    }

    _renderNextButton() {
        const disabled = this.state.currentPage === this.state.totalPages || this.state.totalPages === 0;
        return `
            <button data-page="${this.state.currentPage + 1}" 
                    ${disabled ? 'disabled' : ''} 
                    class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Next &raquo;
            </button>
        `;
    }

    _renderPageNumbers() {
        const maxPages = 5;
        let startPage = Math.max(1, this.state.currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(this.state.totalPages, startPage + maxPages - 1);

        if (endPage - startPage < maxPages - 1) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        let html = '';
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === this.state.currentPage
                ? 'bg-indigo text-white border-indigo'
                : 'border-gray-300 hover:bg-gray-100';

            html += `
                <button data-page="${i}" 
                        class="px-3 py-1 text-sm border rounded ${activeClass}">
                    ${i}
                </button>
            `;
        }

        return html;
    }
}
