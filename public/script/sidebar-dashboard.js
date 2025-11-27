// Sidebar Dashboard Toggle Functionality

// Toggle menu function
function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    const iconId = menuId.replace('Menu', 'Icon');
    const icon = document.getElementById(iconId);

    if (menu && icon) {
        // Toggle hidden class
        menu.classList.toggle('hidden');

        // Rotate icon
        if (menu.classList.contains('hidden')) {
            icon.style.transform = 'rotate(0deg)';
        } else {
            icon.style.transform = 'rotate(180deg)';
        }
    }
}

// Auto-open menu if current page is within that menu
document.addEventListener('DOMContentLoaded', function () {
    const currentPath = window.location.pathname;

    // Check if current path matches any menu item
    const menus = ['penelitianMenu', 'pengabdianMenu', 'publikasiMenu'];

    menus.forEach(menuId => {
        const menu = document.getElementById(menuId);
        if (!menu) return;

        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            if (currentPath === link.getAttribute('href')) {
                // Open this menu
                menu.classList.remove('hidden');

                // Rotate icon
                const iconId = menuId.replace('Menu', 'Icon');
                const icon = document.getElementById(iconId);
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }

                // Highlight active link
                link.classList.add('bg-white/20', 'font-semibold');
            }
        });
    });
});
