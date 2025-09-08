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

        // Set kategori saat ini TERLEBIH DAHULU
        window.currentDashboardCategory = category;

        // Set data global (akan trigger semua callback)
        window.dashboardData = data.data || [];

        // Trigger semua callback secara eksplisit untuk memastikan modal dan komponen lain terupdate
        triggerDataChangeCallbacks();

        // Update dashboard title dan informasi lainnya
        if (typeof window.updateDashboardInfo === 'function') {
            window.updateDashboardInfo(category);
        }

        // Explicitly refresh modal for new category
        if (typeof window.refreshModalForCategory === 'function') {
            window.refreshModalForCategory(category);
        }

        console.log('Dashboard category loaded:', category);

    } catch (error) {
        console.error('Error fetching dashboard category:', error);
        // Set kategori saat ini terlebih dahulu
        window.currentDashboardCategory = category;

        // Set data kosong jika terjadi error
        window.dashboardData = [];

        // Trigger callback meskipun error
        triggerDataChangeCallbacks();

        if (typeof window.updateDashboardInfo === 'function') {
            window.updateDashboardInfo(category);
        }

        // Explicitly refresh modal for new category even on error
        if (typeof window.refreshModalForCategory === 'function') {
            window.refreshModalForCategory(category);
        }
    }
}
// Load data awal saat script dimuat
document.addEventListener('DOMContentLoaded', function () {
    // Cek apakah ada kategori yang disimpan di localStorage
    let selectedCategory = 'penelitian-pnbp';

    if (typeof (Storage) !== "undefined") {
        const storedCategory = localStorage.getItem('selectedCategory');
        if (storedCategory) {
            selectedCategory = storedCategory;
            // Hapus dari localStorage setelah digunakan
            localStorage.removeItem('selectedCategory');
        }
    }

    // Set kategori default
    window.currentDashboardCategory = selectedCategory;

    // Load data dan update dashboard
    loadDashboardCategory(selectedCategory);
});