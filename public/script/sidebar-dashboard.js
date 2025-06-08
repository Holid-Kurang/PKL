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

// Fungsi untuk membuka modal (ganti 'addDataModal' dengan ID modal yang sesuai)
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Buka menu "Penelitian" secara default saat halaman dimuat
window.onload = function () {
    toggleMenu('penelitianMenu');
};