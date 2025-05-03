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

document.getElementById('menuButton').addEventListener('click', function () {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
});
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    const button = dropdown.previousElementSibling.querySelector('button img');
    dropdown.classList.toggle('hidden');
    button.classList.toggle('-rotate-90');
}