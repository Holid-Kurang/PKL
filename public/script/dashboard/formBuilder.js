/**
 * Form Builder Module
 * Dynamically generates and manages forms
 */

class FormBuilder {
    constructor(config) {
        this.config = config;
    }

    generateFields(data = null) {
        const formFields = document.getElementById('form-fields');
        let html = '';

        this.config.fields.forEach(field => {
            html += this._generateFieldHTML(field, data);
        });

        formFields.innerHTML = html;
    }

    _generateFieldHTML(field, data) {
        const fieldType = this.config.getFieldType(field);
        const label = this.config.getFieldLabel(field);
        const value = data ? data[field] : '';

        switch (fieldType) {
            case 'array':
                return this._generateArrayField(field, label, value);
            case 'select-prodi':
                return this._generateSelectField(field, label, value, this.config.prodiOptions);
            case 'select-haki':
                return this._generateSelectField(field, label, value, this.config.hakiOptions);
            case 'number':
                return this._generateInputField(field, label, value, 'number');
            default:
                return this._generateInputField(field, label, value, 'text');
        }
    }

    _generateInputField(field, label, value, type) {
        return `
            <div class="mb-4">
                <label class="block mb-2 text-sm font-medium text-gray-700">${label}</label>
                <input type="${type}" 
                       name="${field}" 
                       value="${value || ''}" 
                       class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo"
                       required>
            </div>
        `;
    }

    _generateSelectField(field, label, value, options) {
        const optionsHTML = options.map(opt =>
            `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`
        ).join('');

        return `
            <div class="mb-4">
                <label class="block mb-2 text-sm font-medium text-gray-700">${label}</label>
                <select name="${field}" 
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo"
                        required>
                    <option value="">Pilih ${label}</option>
                    ${optionsHTML}
                </select>
            </div>
        `;
    }

    _generateArrayField(field, label, value) {
        const values = Array.isArray(value) ? value : (value ? [value] : ['']);

        let itemsHTML = '';
        values.forEach((val, index) => {
            itemsHTML += this._generateArrayItem(val, index === 0);
        });

        return `
            <div class="mb-4">
                <label class="block mb-2 text-sm font-medium text-gray-700">${label}</label>
                <div id="array-container-${field}" class="space-y-2">
                    ${itemsHTML}
                </div>
                <button type="button" 
                        data-action="add-array-item"
                        data-field="${field}"
                        data-label="${label}"
                        class="mt-2 px-3 py-1 text-sm text-indigo border border-indigo rounded hover:bg-indigo hover:text-white transition-colors">
                    + Tambah ${label}
                </button>
            </div>
        `;
    }

    _generateArrayItem(value = '', isFirst = false) {
        const removeButton = !isFirst ? `
            <button type="button" 
                    data-action="remove-array-item"
                    class="px-3 py-2 text-white transition-colors bg-red-600 rounded hover:bg-red-700">
                <span class="material-icons-outlined text-sm">remove</span>
            </button>
        ` : '';

        return `
            <div class="flex gap-2 array-item">
                <input type="text" 
                       value="${value || ''}"
                       class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo" 
                       placeholder="Masukkan nilai">
                ${removeButton}
            </div>
        `;
    }

    collectFormData(formElement) {
        const formData = new FormData(formElement);
        const data = {};

        // Group array fields
        const arrayFields = {};

        formData.forEach((value, key) => {
            const fieldType = this.config.getFieldType(key);

            if (fieldType === 'array') {
                if (!arrayFields[key]) {
                    arrayFields[key] = [];
                }
                if (value.trim()) {
                    arrayFields[key].push(value.trim());
                }
            } else if (fieldType === 'number') {
                data[key] = Number(value);
            } else {
                data[key] = value;
            }
        });

        // Collect array values from DOM
        this.config.fields.forEach(field => {
            if (this.config.getFieldType(field) === 'array') {
                const container = document.getElementById(`array-container-${field}`);
                if (container) {
                    const inputs = container.querySelectorAll('input');
                    data[field] = Array.from(inputs)
                        .map(input => input.value.trim())
                        .filter(val => val !== '');
                }
            }
        });

        return data;
    }
}
