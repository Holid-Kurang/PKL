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
    // Cari semua tombol dengan class sidebar-toggle
    const toggleButtons = document.querySelectorAll('.sidebar-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Ambil target menu dari atribut data-target
            const menuId = this.getAttribute('data-target');
            const menu = document.getElementById(menuId);
            const iconId = menuId.replace('Menu', 'Icon');
            const icon = document.getElementById(iconId);

            if (menu && icon) {
                // Toggle kelas hidden Tailwind
                menu.classList.toggle('hidden');

                // Ganti logika transform dengan class Tailwind agar lebih bersih
                // Atau ubah transform style secara programatik
                if (menu.classList.contains('hidden')) {
                    icon.classList.toggle('rotate-180');
                } else {
                    icon.classList.toggle('rotate-0');
                }
            }
        });
    });

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

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            // Ambil token CSRF dari meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
            // Show loading state
            const originalText = logoutBtn.textContent;
            logoutBtn.textContent = 'Logging out...';
            logoutBtn.disabled = true;

            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken 
                },
                credentials: 'same-origin'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success toast
                        showToast('Logout berhasil', 'success');
                        setTimeout(() => {
                            window.location.href = data.redirect || '/';
                        }, 500);
                    } else {
                        showToast(data.message || 'Logout gagal. Silakan coba lagi.', 'error');
                        logoutBtn.textContent = originalText;
                        logoutBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
                    logoutBtn.textContent = originalText;
                    logoutBtn.disabled = false;
                });
        });
    }

    // Toast notification function
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
                'bg-blue-500'
            } text-white font-semibold`;
        toast.style.transform = 'translateX(400px)';
        toast.textContent = message;

        document.body.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Slide out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
});
