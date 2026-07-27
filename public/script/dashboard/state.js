/**
 * State Management Module
 * Manages global state for dashboard table
 */

class DashboardState {
    constructor() {
        this.currentData = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.itemsPerPage = 50;
        this.editingId = null;
        this.deleteId = null;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.totalRecords = 0;
        this.totalPages = 0;
        this.searchTerm = '';
        this.searchDebounceTimer = null;
        this.filterTahun = '';
        this.filterProdi = '';
    }

    setData(data) {
        this.currentData = data;
        this.filteredData = [...data];
    }

    setPagination(pagination) {
        this.totalRecords = pagination.totalRecords;
        this.totalPages = pagination.totalPages;
        this.currentPage = pagination.currentPage;
    }

    setPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }

    setSearch(term) {
        this.searchTerm = term;
        this.currentPage = 1;
    }

    setSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.currentPage = 1;
    }

    resetSearch() {
        this.searchTerm = '';
        this.currentPage = 1;
    }

    setFilter(tahun, prodi) {
        this.filterTahun = tahun || '';
        this.filterProdi = prodi || '';
        this.currentPage = 1;
    }

    resetFilter() {
        this.filterTahun = '';
        this.filterProdi = '';
        this.currentPage = 1;
    }

    getQueryParams() {
        const params = {
            page: this.currentPage,
            limit: this.itemsPerPage,
            sortBy: this.sortColumn || 'createdAt',
            sortOrder: this.sortDirection,
            search: this.searchTerm
        };
        if (this.filterTahun) params.tahun = this.filterTahun;
        if (this.filterProdi) params.prodi = this.filterProdi;
        return params;
    }
}
