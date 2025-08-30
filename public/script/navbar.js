document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('settingMenu').addEventListener('click', function () {
        const setting = document.getElementById('settingMenu').nextElementSibling;
        setting.classList.toggle('hidden');
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

