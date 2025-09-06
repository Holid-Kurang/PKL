// Fungsi untuk toggle submenu di sidebar
function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    const icon = document.getElementById(menuId.replace('Menu', 'Icon'));

    if (menu.style.maxHeight) {
        menu.style.maxHeight = null;
        icon.style.transform = 'rotate(0deg)';
    } else {
        // Tutup semua submenu lain terlebih dahulu
        document.querySelectorAll('.submenu').forEach(item => {
            if (item.id !== menuId) {
                item.style.maxHeight = null;
                const otherIcon = document.getElementById(item.id.replace('Menu', 'Icon'));
                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            }
        });
        // Buka submenu yang diklik
        menu.style.maxHeight = menu.scrollHeight + "px";
        icon.style.transform = 'rotate(180deg)';
    }
}

// Sistem callback untuk perubahan data
window.dataChangeCallbacks = window.dataChangeCallbacks || {};

// Fungsi untuk mendaftarkan callback
window.registerDataChangeCallback = function (name, callback) {
    window.dataChangeCallbacks[name] = callback;
};

// Fungsi untuk memanggil semua callback
function triggerDataChangeCallbacks() {
    Object.keys(window.dataChangeCallbacks).forEach(name => {
        if (typeof window.dataChangeCallbacks[name] === 'function') {
            try {
                window.dataChangeCallbacks[name]();
            } catch (error) {
                console.error(`Error in callback ${name}:`, error);
            }
        }
    });
}

// Setup property observer untuk dashboardData (hanya sekali)
if (!window.hasOwnProperty('_dashboardDataObserverSetup')) {
    let originalData = undefined;

    Object.defineProperty(window, 'dashboardData', {
        get: function () {
            return originalData;
        },
        set: function (newData) {
            originalData = newData;
            triggerDataChangeCallbacks();
        },
        configurable: true
    });
    window._dashboardDataObserverSetup = true;
}

async function loadDashboardCategory(category) {
    try {
        const response = await fetch(`/api/dashboard/${category}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // Set data global (akan trigger semua callback)
        window.dashboardData = data.data || [];

    } catch (error) {
        console.error('Error fetching dashboard category:', error);
        // Set data kosong jika terjadi error
        window.dashboardData = [];
    }
}

// Load data awal saat script dimuat
document.addEventListener('DOMContentLoaded', function () {
    loadDashboardCategory('penelitian-pnbp');
});