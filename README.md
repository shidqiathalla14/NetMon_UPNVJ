<div align="center">
  <img src="https://www.upnvj.ac.id/en/files/download/d8be74d9d9ca67272c943c8d5dd739b5" alt="Logo UPNVJ" width="120" />
  
  # NetMon UPNVJ
  **Sistem Monitoring Jaringan & Infrastruktur (Network Operations Center)**
  <br />
  <p>Dikembangkan untuk memantau lalu lintas jaringan, status perangkat, dan manajemen pelaporan gangguan di lingkungan kampus UPN Veteran Jakarta.</p>
</div>

---

## 📑 Daftar Isi
1. [Deskripsi Proyek](#-deskripsi-proyek)
2. [Arsitektur & Teknologi](#-arsitektur--teknologi)
3. [Panduan Instalasi & Eksekusi](#-panduan-instalasi--eksekusi)
4. [Kredensial Akses (Login)](#-kredensial-akses-login)
5. [Guidebook (Cara Penggunaan)](#-guidebook-cara-penggunaan)
6. [Panduan Maintenance](#-panduan-maintenance)
7. [Panduan Untuk Pengembang Lanjutan (Handover)](#-panduan-untuk-pengembang-lanjutan-handover)

---

## 🚀 Deskripsi Proyek
**NetMon UPNVJ** adalah *dashboard* monitoring jaringan berbasis antarmuka web modern. Sistem ini memisahkan secara tegas antara *Frontend* (UI/UX untuk pengguna dan admin NOC) dengan *Backend* (Infrastruktur server dan metrik data). 

Sistem ini memfasilitasi dua sisi pengguna:
* **Akses Publik (Guest):** Melihat status jaringan secara *live* dan transparansi *traffic*.
* **Akses NOC (Admin):** Melakukan manajemen perangkat (*Router, Switch, AP*), mendeteksi sinyal WiFi ilegal (*Rogue AP*), dan merespons tiket pelaporan gangguan dari mahasiswa.

---

## 🛠 Arsitektur & Teknologi
Proyek ini mengadopsi standar industri dengan memisahkan *Client-Server* menjadi dua lingkungan independen.

### 1. Frontend (Netmon_Dashboard)
* **Framework:** React.js (menggunakan *Vite* untuk *build-tool* yang sangat cepat).
* **Styling:** Vanilla CSS (CSS Variables untuk dukungan *Light/Dark Theme*).
* **State Management:** React Hooks (`useState`, `useEffect`) & Local Storage.

### 2. Backend Server & Engine (Netmon_Server)
* **Environment:** Docker & Docker Compose (Containerization).
* **Database:** MariaDB (Relational Database).
* **Monitoring Engine:** Zabbix Server (SNMP/Agen pemantau jaringan).
* **Data Visualization:** Grafana (Terintegrasi via *Iframe* tanpa *header* menu).

---

## 💻 Panduan Instalasi & Eksekusi
Pastikan perangkat Anda sudah terinstal **Node.js**, **Git**, dan **Docker Desktop**.

### Tahap 1: Menjalankan Backend Server (Zabbix & Grafana)
1. Buka terminal dan masuk ke direktori server:
   ```bash
   cd Netmon_Server
Jalankan semua container di latar belakang:

Bash
docker-compose up -d
Pastikan tidak ada port yang bentrok (Grafana berjalan di localhost:3000, Zabbix Web di localhost:8080).

Tahap 2: Menjalankan Frontend Dashboard (React)
Buka terminal baru dan masuk ke direktori dashboard:

Bash
cd Netmon_Dashboard
Instal semua dependensi pustaka:

Bash
npm install
Jalankan development server:

Bash
npm run dev
Buka browser dan akses URL yang diberikan oleh Vite (biasanya http://localhost:5173).

🔑 Kredensial Akses (Login)
Untuk mengakses mode Administrator NOC dan melakukan perubahan data perangkat, gunakan detail login berikut pada halaman otentikasi:

Username / NIM: admin@upnvj.ac.id

Password: admin123

Catatan Keamanan: Pada tahap production mendatang, sangat disarankan untuk mengganti password default ini melalui menu Pengaturan Akun.

📖 Guidebook (Cara Penggunaan)
Memantau Traffic Grafana: Masuk ke halaman Traffic. Data yang ditampilkan sudah dikunci dalam mode Kiosk agar tidak dapat diubah oleh sembarang orang dari tampilan web.

Manajemen Inventaris:
Masuk ke halaman Perangkat. Admin dapat menambah, mengubah (Edit), atau menghapus (Hapus) perangkat seperti Router, Switch, dan Firewall.

Sistem Deteksi Keamanan (Rogue AP):
Pada halaman Perangkat, pilih tab Keamanan (Rogue AP). Jika ada WiFi ilegal terdeteksi, klik "Beri Peringatan Publik" untuk memunculkan notifikasi merah di Dashboard utama pengguna.

Tindak Lanjut Tiket Gangguan:
Buka halaman Laporan Masuk. Klik "Tindak Lanjuti" pada status tiket yang berstatus Pending, berication catatan perbaikan, lalu ubah statusnya menjadi Selesai.

⚙️ Panduan Maintenance (Pemeliharaan Rutin)
Untuk menjaga performa aplikasi tetap stabil dan mencegah memori server penuh, lakukan langkah-langkah berikut secara berkala (direkomendasikan setiap 3-6 bulan):

Pembersihan Log Docker & Ruang Penyimpanan:
Terminal Docker akan terus merekam log. Bersihkan sistem kontainer yang tidak terpakai dengan:

Bash
docker system prune -a --volumes
Pembalasan Modul NPM (Frontend):

Bash
cd Netmon_Dashboard
npm update
Manajemen Database Grafana/Zabbix:
Jika ruang disk membengkak akibat pencatatan metrik, masuk ke dalam konfigurasi antarmuka Zabbix (localhost:8080) dan kurangi rentang waktu penyimpanan History & Trends pada menu Administration -> Housekeeping.

🤝 Panduan Untuk Pengembang Lanjutan (Handover)
Bagi mahasiswa atau tim developer kampus selanjutnya yang akan meneruskan proyek ini, perhatikan tata letak arsitektur dan tata cara pengembangan berikut:

1. Struktur Folder Standar Industri
Sistem frontend telah dirapikan menggunakan arsitektur modular:

src/pages/: Berisi logika dan tampilan halaman utama (Dashboard, Traffic, Login, dll).

src/components/: Berisi potongan UI yang dapat dipakai berulang (Navbar, Sidebar).

src/assets/: Tempat penyimpanan file statis ringan berbasis vektor/webp (misal: upnvj-logo.webp).

src/styles/: Pemisahan file CSS global.

2. Modifikasi Visual Grafana
Jika ingin mengubah desain grafik pada halaman Traffic:

Akses langsung http://localhost:3000 di browser.

Lakukan login (Username: admin, Password: admin atau sesuai setelan awal Anda).

Cari dashboard yang bersangkutan dan masuk ke mode Edit.

Perubahan akan otomatis tercermin di frontend React berkat sistem Iframe.

3. Alur Kontribusi (Git Workflow)
Dimohon untuk tidak melakukan perubahan langsung pada branch main saat menambah fitur baru. Gunakan protokol ini:

Tarik pembaruan terbaru: git pull origin main

Buat branch fitur baru: git checkout -b fitur-baru-anda

Lakukan modifikasi dan commit.

Kirim branch: git push origin fitur-baru-anda

Lakukan Pull Request di GitHub untuk direview.
