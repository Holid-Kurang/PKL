/**
 * Client-side error handling utilities
 */

(function() {
    // Function to get translation from window.pageTranslations
    function getTranslation(key) {
        if (!window.pageTranslations) return key;

        const keys = key.split('.');
        let value = window.pageTranslations;

        for (const k of keys) {
            value = value ? value[k] : undefined;
        }

        return value || key;
    }

    /**
     * Handle network/API errors gracefully
     * @param {Error|Response} error - The error object or fetch response
     * @returns {string} Human-friendly error message
     */
    window.handleClientError = function(error) {
        console.error('Error caught:', error);

        // Network Error (Offline or DNS failure)
        if (!navigator.onLine) {
            return getTranslation('errors.network');
        }

        if (error instanceof Response) {
            const status = error.status;
            if (getTranslation(`errors.${status}`) !== `errors.${status}`) {
                return getTranslation(`errors.${status}`);
            }
        }

        if (error.status) {
            const status = error.status;
             if (getTranslation(`errors.${status}`) !== `errors.${status}`) {
                return getTranslation(`errors.${status}`);
            }
        }

        // Generic error
        return getTranslation('errors.generic');
    };

    /**
     * Show a global notification/toast
     * @param {string} message - Message to show
     * @param {string} type - 'error', 'success', 'warning'
     */
    window.showNotification = function(message, type = 'error') {
        const container = document.getElementById('notification-container') || createNotificationContainer();

        const toast = document.createElement('div');
        toast.className = `flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm border-l-4 ${
            type === 'error' ? 'border-red-500' : type === 'success' ? 'border-green-500' : 'border-yellow-500'
        }`;

        const iconClass = type === 'error' ? 'text-red-500' : type === 'success' ? 'text-green-500' : 'text-yellow-500';
        const icon = type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'warning';

        toast.innerHTML = `
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${iconClass}">
                <span class="material-icons-outlined">${icon}</span>
            </div>
            <div class="ms-3 text-sm font-normal">${message}</div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8" aria-label="Close">
                <span class="sr-only">Close</span>
                <span class="material-icons-outlined text-sm">close</span>
            </button>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => toast.remove(), 500);
        }, 5000);

        // Manual close
        toast.querySelector('button').onclick = () => toast.remove();
    };

    function createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
        return container;
    }

    // Monitor online/offline status
    window.addEventListener('online', () => {
        window.showNotification('Koneksi terhubung kembali', 'success');
    });

    window.addEventListener('offline', () => {
        window.showNotification(getTranslation('errors.network'), 'error');
    });

})();
