# Sistem Informasi Indeks Kinerja Universitas

Aplikasi web ini dirancang untuk menampilkan indeks kinerja penelitian, pengabdian, dan publikasi universitas dalam bentuk visual interaktif. Sistem ini menyediakan fitur login, import/export data, serta visualisasi grafik yang dilengkapi penjelasan.

## Fitur Utama

- 🔒 Login untuk pengguna
- 📥 Import dan export data dalam format CSV/Excel
- 📊 Visualisasi grafik interaktif (kinerja penelitian, pengabdian, publikasi)
- 🧾 Penjelasan mendalam terkait grafik
- ⚙️ Desain responsif menggunakan Tailwind CSS

## Teknologi yang Digunakan

- Node.js
- Express.js
- MongoDB
- Tailwind CSS
- Chart.js
- HTML/CSS/JS

```

## Cara Menjalankan

1. **Clone repositori ini:**
   ```bash
   git clone <repo-url>
   cd nama-folder-proyek
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Setup MongoDB:**
   - Pastikan MongoDB sudah terinstal dan berjalan di komputer Anda, atau gunakan layanan MongoDB Atlas.
   - Buat database baru sesuai kebutuhan proyek.
   - Tambahkan URI koneksi MongoDB ke file `.env`, misal:
     ```
     MONGODB_URI=mongodb://localhost:27017/nama-database
     ```
     atau untuk MongoDB Atlas:
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster-url/nama-database
     ```

4. **Jalankan server:**
   ```bash
   npm run dev
   ```

5. **Akses aplikasi di browser:**
   ```
   http://localhost:3000
   ```

## Catatan

- Pastikan Node.js versi terbaru telah terinstal.
- Tambahkan file `.env` jika proyek ini membutuhkan konfigurasi lingkungan.
- Pastikan MongoDB sudah berjalan sebelum menjalankan aplikasi.

