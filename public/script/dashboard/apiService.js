/**
 * API Service Module
 * Handles all API communications
 */

class ApiService {
    constructor(config) {
        this.config = config;
        this.baseUrl = `/api/dashboard/${config.fullCategory}`;
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
            headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async deleteData(id) {
        const response = await fetch(`${this.baseUrl}/delete/${id}`, {
            method: 'DELETE'
        }); if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    getExportUrl() {
        return `${this.baseUrl}/export`;
    }

    async importData(formData) {
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
