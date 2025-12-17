document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settingMenu').addEventListener('click', function () {
        const setting = document.getElementById('settingMenu').nextElementSibling;
        setting.classList.toggle('hidden');
    });
    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        const toggle = document.getElementById('settingMenu');
        const dropdown = toggle.nextElementSibling;
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
    document.getElementById('logoutBtn').addEventListener('click', function () {
        // Show loading state
        const logoutBtn = this;
        const originalText = logoutBtn.textContent;
        logoutBtn.textContent = 'Logging out...';
        logoutBtn.disabled = true;

        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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

