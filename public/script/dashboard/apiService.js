/**
 * API Service Module
 * Handles all API communications
 */

class ApiService {
    constructor(config) {
        this.config = config;
        this.baseUrl = `/api/dashboard/${config.fullCategory}`;
        this.csrfToken = this.getCsrfToken();
    }

    getCsrfToken() {
        // Try to get CSRF token from hidden input in forms
        const tokenInput = document.querySelector('input[name="_csrf"]');
        if (tokenInput) {
            return tokenInput.value;
        }
        // Fallback: try to get from meta tag or window object
        return document.querySelector('meta[name="csrf-token"]')?.content ||
            window._csrfToken || '';
    }

    getHeaders(customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
        };

        // Add CSRF token to headers for state-changing requests
        if (this.csrfToken) {
            headers['X-CSRF-Token'] = this.csrfToken;
        }

        return headers;
    }

    async fetchData(params) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${this.baseUrl}?${queryString}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async createData(data) {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async updateData(id, data) {
        const response = await fetch(`${this.baseUrl}/update/${id}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async deleteData(id) {
        const response = await fetch(`${this.baseUrl}/delete/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    getExportUrl(filterParams = {}) {
        const params = new URLSearchParams();
        if (filterParams.tahun) params.set('tahun', filterParams.tahun);
        if (filterParams.prodi) params.set('prodi', filterParams.prodi);
        if (filterParams.search) params.set('search', filterParams.search);
        const qs = params.toString();
        return `${this.baseUrl}/export${qs ? '?' + qs : ''}`;
    }

    getTemplateUrl() {
        return `${this.baseUrl}/template`;
    }

    async importData(formData) {
        // For multipart/form-data, add CSRF token if not already present
        if (!formData.has('_csrf') && this.csrfToken) {
            formData.append('_csrf', this.csrfToken);
        }

        const response = await fetch(`${this.baseUrl}/import`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}
