/**
 * Data Formatter Module
 * Handles all data formatting and transformation
 */

class DataFormatter {
    static formatArrayField(value) {
        if (!Array.isArray(value) || value.length === 0) {
            return '-';
        }

        let html = '<div class="flex flex-col gap-1">';
        value.forEach(v => {
            html += `<span class="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded w-fit">${v}</span>`;
        });
        html += '</div>';
        return html;
    }

    static formatCurrencyField(value, field) {
        if (typeof value !== 'number') return value || '-';
        if (!field.includes('Biaya') && !field.includes('Dana')) return value;

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(value);
    }

    static formatFileField(value, field) {
        const fileFields = ['JurnalFile', 'HkiFile', 'BukuFile'];
        if (!fileFields.includes(field) || !value) return null;

        return `<a href="${value}" target="_blank" rel="noopener noreferrer" 
                   class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline">
                    <span class="material-icons-outlined text-sm">description</span>
                </a>`;
    }

    static formatUrlField(value, field) {
        if (field !== 'JurnalUrl' || !value) return null;

        const url = value.startsWith('http://') || value.startsWith('https://')
            ? value
            : `https://${value}`;

        return `<a href="${url}" target="_blank" rel="noopener noreferrer" 
                   class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline">
                    <span class="material-icons-outlined text-sm">link</span>
                </a>`;
    }

    static formatValue(value, field) {
        // Array fields
        if (Array.isArray(value)) {
            return this.formatArrayField(value);
        }

        // Currency fields
        const currency = this.formatCurrencyField(value, field);
        if (currency !== value) return currency;

        // File fields
        const file = this.formatFileField(value, field);
        if (file) return file;

        // URL fields
        const url = this.formatUrlField(value, field);
        if (url) return url;

        // Default
        return value || '-';
    }

    static isConstrainedWidth(field) {
        return ['JurnalFile', 'HkiFile', 'BukuFile', 'JurnalUrl'].includes(field);
    }
}
