/**
 * Table Renderer Module
 * Handles all table rendering operations
 */

class TableRenderer {
    constructor(config, state) {
        this.config = config;
        this.state = state;
    }

    renderHeader() {
        const thead = document.getElementById('table-header');
        let headerHTML = '<th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">No</th>';

        this.config.fields.forEach(field => {
            const isSorted = this.state.sortColumn === field;
            const sortIcon = isSorted
                ? (this.state.sortDirection === 'asc' ? '▲' : '▼')
                : '⇅';

            headerHTML += `
                <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase cursor-pointer hover:bg-gray-200 transition-colors select-none" 
                    data-sort-field="${field}"
                    title="Klik untuk mengurutkan">
                    <div class="flex items-center gap-2">
                        <span>${this.config.getFieldLabel(field)}</span>
                        <span class="text-xs ${isSorted ? 'text-indigo font-bold' : 'text-gray-400'}">${sortIcon}</span>
                    </div>
                </th>`;
        });

        headerHTML += '<th class="sticky-col-header px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-700 uppercase">Aksi</th>';
        thead.innerHTML = headerHTML;
    }

    renderBody() {
        const tbody = document.getElementById('table-body');

        if (this.state.filteredData.length === 0) {
            tbody.innerHTML = this._renderEmptyState();
            return;
        }

        const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
        let bodyHTML = '';

        this.state.filteredData.forEach((item, index) => {
            bodyHTML += this._renderRow(item, start + index + 1);
        });

        tbody.innerHTML = bodyHTML;
    }

    _renderRow(item, rowNumber) {
        let html = `<tr class="hover:bg-gray-50">`;
        html += `<td class="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">${rowNumber}</td>`;

        this.config.fields.forEach(field => {
            const value = DataFormatter.formatValue(item[field], field);
            const widthClass = DataFormatter.isConstrainedWidth(field)
                ? 'max-w-[80px] w-[80px]'
                : '';

            html += `<td class="px-6 py-4 text-sm text-gray-900 ${widthClass}">${value}</td>`;
        });

        html += `
            <td class="sticky-col px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                <button data-action="edit" data-id="${item._id}"
                        class="text-indigo hover:text-indigo/80 mr-3">
                    <span class="material-icons-outlined">edit</span>
                </button>
                <button data-action="delete" data-id="${item._id}"
                        class="text-red-600 hover:text-red-800">
                    <span class="material-icons-outlined">delete</span>
                </button>
            </td>
        </tr>`;

        return html;
    }

    _renderEmptyState() {
        return `
            <tr>
                <td colspan="100" class="px-6 py-8 text-center text-gray-500">
                    <span class="material-icons-outlined text-5xl">inbox</span>
                    <p class="mt-2">${this.config.translations.noData}</p>
                </td>
            </tr>
        `;
    }

    renderLoading() {
        const tbody = document.getElementById('table-body');
        tbody.innerHTML = `
            <tr>
                <td colspan="100" class="px-6 py-8 text-center text-gray-500">
                    <span class="material-icons-outlined animate-spin text-5xl">hourglass_empty</span>
                    <p class="mt-2">${this.config.translations.loading}</p>
                </td>
            </tr>
        `;
    }

    renderError(message) {
        const tbody = document.getElementById('table-body');
        tbody.innerHTML = `
            <tr>
                <td colspan="100" class="px-6 py-8 text-center text-red-500">
                    <span class="material-icons-outlined text-5xl">error_outline</span>
                    <p class="mt-2">${message}</p>
                </td>
            </tr>
        `;
    }

    render() {
        this.renderHeader();
        this.renderBody();
    }
}
