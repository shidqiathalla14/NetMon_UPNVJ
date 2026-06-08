<div align="center">
  <img src="https://www.upnvj.ac.id/id/files/large/89f8a80e388ced3704b091e21f510755" alt="Logo UPNVJ" width="120" />

  # NetMon UPNVJ
  **Sistem Monitoring Jaringan & Infrastruktur | Network Operations Center**

  <p>Dikembangkan untuk memantau lalu lintas jaringan, status perangkat, dan manajemen pelaporan gangguan di lingkungan kampus UPN Veteran Jakarta.</p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
  ![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
  ![Zabbix](https://img.shields.io/badge/Zabbix-CC0000?style=for-the-badge&logo=zabbix&logoColor=white)
  ![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
</div>

---

> [!WARNING]
> **Perhatian Keamanan:** Akun Administrator NOC menggunakan password statis `admin123` secara *default*. Segera ganti kredensial ini sebelum digunakan di lingkungan *production* untuk mencegah akses tidak sah.

---

## Daftar Isi

- [Struktur Proyek](#struktur-proyek)
- [Prinsip Desain](#prinsip-desain)
- [Panduan Instalasi](#panduan-instalasi)
- [Kredensial Akses](#kredensial-akses)
- [Cara Penggunaan](#cara-penggunaan)
- [Panduan Maintenance](#panduan-maintenance)

---

## Struktur Proyek

```text
Netmon_Project_UPNVJ/
├── Netmon_Dashboard/             # Frontend React (Vite)
│   ├── src/
│   │   ├── assets/               # Aset statis (WebP, SVG)
│   │   ├── components/           # Komponen UI modular (Navbar, Sidebar)
│   │   ├── pages/                # Halaman utama (Dashboard, Traffic, Laporan)
│   │   ├── styles/               # CSS global & token desain (Light/Dark mode)
│   │   ├── App.jsx               # Router utama aplikasi
│   │   └── main.jsx              # Entry point React
│   ├── package.json              # Dependensi NPM frontend
│   └── vite.config.js            # Konfigurasi Vite
│
└── Netmon_Server/                # Backend Infrastructure (Docker)
    ├── db_data/                  # Volume persisten MariaDB (di-ignore via .gitignore)
    └── docker-compose.yml        # Orkestrasi container (Zabbix, Grafana, MariaDB)
```

---

## Prinsip Desain

NetMon UPNVJ dibangun di atas tiga prinsip utama yang diterapkan di seluruh lapisan sistemnya:

**1. Pemisahan Konteks (Separation of Concerns)**
Frontend (UI/UX) dan Backend (Server/Engine) berjalan di lingkungan yang sepenuhnya terisolasi. Kendala pada salah satu sisi tidak akan langsung melumpuhkan sisi lainnya.

**2. Transparansi Berbasis Role**
Pengguna umum (mahasiswa) dapat memantau traffic jaringan secara langsung tanpa perlu login. Sementara itu, aksi seperti manipulasi data perangkat dan penyelesaian tiket gangguan dikunci khusus untuk Administrator NOC.

**3. Performa & Responsivitas Tinggi**
Aset lokal berbasis WebP, integrasi Iframe Kiosk, dan arsitektur Virtual DOM dari React memastikan transisi antar-halaman berjalan cepat tanpa perlu *reload* berulang.

---

## Panduan Instalasi

Pastikan perangkat Anda sudah menginstal **Node.js**, **Git**, dan **Docker Desktop** sebelum memulai.

### Tahap 1 | Jalankan Backend (Zabbix & Grafana)

```bash
cd Netmon_Server
docker-compose up -d
```

> Pastikan tidak ada konflik port. Grafana berjalan di `localhost:3000`, Zabbix Web di `localhost:8080`.

### Tahap 2 | Jalankan Frontend Dashboard (React)

```bash
cd Netmon_Dashboard
npm install
npm run dev
```

Buka browser dan akses URL yang ditampilkan Vite (umumnya `http://localhost:5173`).

---

## Kredensial Akses

Sistem menggunakan Local Storage untuk inisialisasi akun *default*. Gunakan kredensial berikut untuk menguji masing-masing level akses:

| Role | Username / NIM | Password | Akses |
|---|---|---|---|
| **Administrator NOC** | `admin@upnvj.ac.id` | `admin123` | Kontrol penuh inventaris perangkat (CRUD), aktivasi peringatan Rogue AP, eksekusi tiket gangguan |
| **Mahasiswa / Pengguna Umum** | `mahasiswa` | `mhs123` | Membuat laporan gangguan, mengunggah bukti foto, memantau status tiket |

> [!NOTE]
> Jika cache/cookies browser dibersihkan atau menggunakan mode Incognito, data akun akan ter-reset ke dua akun *default* di atas secara otomatis.

---

## Cara Penggunaan

**Memantau Traffic Jaringan**
Buka menu **Traffic**. Data ditampilkan dalam mode Kiosk agar tampilan Grafana tidak tumpang tindih dengan navigasi utama.

**Manajemen Inventaris Perangkat**
Buka menu **Perangkat**. Administrator memiliki akses penuh (CRUD) untuk mengelola perangkat jaringan seperti Router, Switch, dan Firewall.

**Deteksi Keamanan | Rogue AP**
Pada menu **Perangkat**, buka tab **Keamanan (Rogue AP)**. Jika terdeteksi sinyal ilegal, klik tombol peringatan untuk menyebarkan notifikasi darurat ke seluruh pengguna dashboard secara global.

**Penanganan Tiket Gangguan**
Buka menu **Laporan Masuk**. Klik *Tindak Lanjuti* pada tiket berstatus **Pending**, tambahkan catatan teknisi, lalu konfirmasi perubahan status menjadi **Selesai**.

---

## Panduan Maintenance

Disarankan untuk melakukan pemeliharaan berikut setiap **3-6 bulan** guna menjaga performa sistem tetap optimal.

**Pembersihan Log & Cache Docker**

Hapus container yang tidak aktif atau sudah membengkak:

```bash
docker system prune -a --volumes
```

**Manajemen Penyimpanan Metrik Zabbix**

Akses panel Zabbix di `localhost:8080`, lalu navigasi ke **Administration > Housekeeping**. Sesuaikan rentang hari penyimpanan **History & Trends** agar database tidak kehabisan kapasitas penyimpanan.
