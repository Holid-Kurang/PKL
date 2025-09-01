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
        fetch('/logout', {
            method: 'POST',  // Menggunakan metode POST untuk logout
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin' // Pastikan session dikirim dalam permintaan
        })
            .then(response => {
                if (response.ok) {
                    // alert('Successfully logged out!');
                    window.location.href = '/';  // Arahkan ke halaman utama atau login
                } else {
                    alert('Logout failed!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Logout failed!');
            });
    });
});

