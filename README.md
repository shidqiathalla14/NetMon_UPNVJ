<div align="center">
  <img src="https://www.upnvj.ac.id/id/files/large/89f8a80e388ced3704b091e21f510755" alt="Logo UPNVJ" width="120" />

  # NetMon UPNVJ
  **Sistem Monitoring Jaringan & Infrastruktur | Network Operations Center**

  <p>Dikembangkan untuk memantau lalu lintas jaringan, status perangkat, dan manajemen pelaporan gangguan di lingkungan kampus UPN Veteran Jakarta secara <i>real-time</i>.</p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
  ![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
  ![Zabbix](https://img.shields.io/badge/Zabbix-CC0000?style=for-the-badge&logo=zabbix&logoColor=white)
</div>

---

> [!WARNING]
> **Perhatian Keamanan:** Akun Administrator NOC menggunakan password statis `admin123` secara *default*. Segera ganti kredensial ini sebelum digunakan di lingkungan *production* untuk mencegah akses tidak sah.

---

## Daftar Isi

- [Struktur Proyek](#struktur-proyek)
- [Alat & Teknologi](#alat--teknologi-yang-digunakan)
- [Prinsip Desain](#prinsip-desain)
- [Panduan Instalasi](#panduan-instalasi)
- [Kredensial Akses](#kredensial-akses)
- [Cara Penggunaan](#cara-penggunaan)
- [Panduan Maintenance](#panduan-maintenance)

---

## Struktur Proyek

Sistem ini menggunakan arsitektur *microservices* yang terbagi menjadi tiga modul utama:

```text
NETMON_PROJECT_UPNVJ/
├── Netmon_API/                   # 1. Backend API Bridge (Node.js & Express)
│   ├── node_modules/             # Folder dependensi server API
│   ├── package-lock.json
│   ├── package.json              # Daftar library backend (express, cors, mysql)
│   └── server.js                 # Entry point & endpoint utama (Zabbix & MySQL)
│
├── Netmon_Dashboard/             # 2. Frontend React (Vite)
│   ├── dist/                     # Hasil build production-ready
│   ├── node_modules/             # Folder dependensi frontend
│   ├── src/
│   │   ├── assets/               # Aset statis UI
│   │   │   └── upnvj-logo.webp
│   │   ├── components/           # Komponen UI modular & reusable
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── SystemAlert.jsx
│   │   ├── hooks/                # Custom React Hooks
│   │   │   └── useIsMobile.jsx
│   │   ├── pages/                # Halaman antarmuka utama
│   │   │   ├── AccessPoint.jsx
│   │   │   ├── DaftarLaporan.jsx # Halaman Admin: Tabel tiket masuk
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DashboardDesktop.jsx
│   │   │   ├── DashboardMobile.jsx
│   │   │   ├── Devices.jsx       # Halaman Inventaris & Integrasi Zabbix
│   │   │   ├── ExtraPages.jsx
│   │   │   ├── Guest.jsx         # Dashboard publik (tanpa login)
│   │   │   ├── LaporGangguan.jsx # Halaman Mahasiswa: Form komplain
│   │   │   ├── Login.jsx
│   │   │   ├── Pengaturan.jsx
│   │   │   └── Traffic.jsx       # Integrasi Iframe Grafana Kiosk
│   │   ├── services/
│   │   │   └── api.js            # Modul helper untuk call API (Fetch/Axios)
│   │   ├── styles/
│   │   │   └── index.css         # Styling global CSS (Light/Dark mode)
│   │   ├── App.jsx               # Router utama aplikasi
│   │   └── main.jsx              # Entry point React
│   ├── .gitignore
│   ├── eslint.config.js          # Konfigurasi linter kode
│   ├── index.html                # Template dasar HTML
│   ├── package-lock.json
│   ├── package.json              # Daftar library frontend
│   └── vite.config.js            # Konfigurasi Vite bundler
│
└── Netmon_Server/                # 3. Backend Infrastructure (Docker)
    ├── db_data/                  # Volume persisten database Zabbix
    ├── grafana_data/             # Volume persisten konfigurasi Grafana
    └── docker-compose.yml        # Orkestrasi container (Zabbix, Grafana, DB)
```

---

## Alat & Teknologi yang Digunakan

Proyek ini dibangun menggunakan kombinasi perangkat lunak modern untuk memastikan skalabilitas, keamanan, dan sinkronisasi data *real-time*.

### 1. Frontend (UI/UX)

- **React.js & Vite** — Membangun antarmuka pengguna yang reaktif dengan pengalaman development super cepat.
- **Vanilla CSS** — Pendekatan styling murni untuk mendukung tema Light/Dark Mode.

### 2. Backend API (Middleware)

- **Node.js & Express.js** — Bertindak sebagai jembatan (*API Bridge*) untuk menghubungkan Frontend React dengan Zabbix Server dan Database MySQL secara aman.
- **Axios & Cors** — Menangani request HTTP lintas port dengan lancar.

### 3. Database & Infrastruktur Server

- **MySQL (XAMPP)** — Sistem manajemen basis data relasional (RDBMS) untuk menyimpan data sistem ticketing / laporan gangguan jaringan.
- **Docker & Docker Compose** — Platform containerization untuk menjalankan Zabbix dan Grafana secara bersamaan.
- **Zabbix Server** — Engine utama tingkat enterprise untuk melakukan polling data jaringan (SNMP).
- **Grafana** — Platform analitik visual (terintegrasi via Iframe Mode Kiosk).

---

## Prinsip Desain

NetMon UPNVJ dibangun di atas tiga prinsip utama:

### 1. Pemisahan Konteks *(Separation of Concerns)*

Frontend (UI/UX), Backend API, dan Database/Server berjalan di lingkungan yang sepenuhnya terisolasi.

### 2. Transparansi Berbasis Role

Pengguna umum (mahasiswa) dapat memantau traffic jaringan tanpa login dan membuat laporan gangguan. Aksi manipulasi data perangkat dan eksekusi tiket khusus untuk Administrator NOC.

### 3. Integrasi Data *Real-Time*

Inventaris perangkat tidak lagi statis, melainkan ditarik langsung dari engine Zabbix melalui API. Laporan pengguna langsung tersimpan di MySQL dan termuat secara instan di sisi Administrator.

---

## Panduan Instalasi

Pastikan perangkat Anda sudah menginstal **Node.js**, **XAMPP**, dan **Docker Desktop**. Siapkan 3 tab terminal terpisah untuk menjalankan sistem ini.

### Tahap 1 | Persiapan Database MySQL (XAMPP)

1. Buka **XAMPP Control Panel**.
2. Ubah port MySQL menjadi `3307` (melalui menu **Config > my.ini**) untuk menghindari tabrakan dengan kontainer Docker.
3. *Start* **Apache** dan **MySQL**.
4. Buka `http://localhost/phpmyadmin`, buat database baru bernama `netmon_upnvj`, lalu eksekusi query pembuatan tabel laporan.

### Tahap 2 | Jalankan Infrastruktur (Zabbix & Grafana)

Buka **Tab Terminal 1:**

```bash
cd Netmon_Server
docker-compose up -d
```

> Grafana berjalan di `localhost:3000` (mode Anonymous Viewer), Zabbix Web di `localhost:8080`.

### Tahap 3 | Jalankan Backend API Bridge (Express.js)

Buka **Tab Terminal 2:**

```bash
cd Netmon_API
npm install
node server.js
```

> Server API akan berjalan di `http://localhost:5000`.

### Tahap 4 | Jalankan Frontend Dashboard (React)

Buka **Tab Terminal 3:**

```bash
cd Netmon_Dashboard
npm install
npm run dev
```

> Akses antarmuka pengguna di `http://localhost:5173`.

---

## Kredensial Akses

Sistem otentikasi menggunakan Local Storage dengan role terpisah. Gunakan kredensial berikut:

| Role | Username / NIM | Password | Akses |
|---|---|---|---|
| Administrator NOC | `admin@upnvj.ac.id` | `admin123` | Kontrol penuh inventaris Zabbix, aktivasi Rogue AP, update status tiket MySQL |
| Mahasiswa / Pengguna | `mahasiswa` | `mhs123` | Membuat laporan gangguan ke MySQL, upload bukti foto, pantau riwayat tiket |

---

## Cara Penggunaan

- **Memantau Traffic Jaringan** — Buka menu **Traffic**. Data ditampilkan dalam mode Kiosk dari Grafana.
- **Manajemen Inventaris** — Buka menu **Perangkat**. Data ditarik secara *live* dari Zabbix API.
- **Deteksi Rogue AP** — Tab **Keamanan** memungkinkan Admin menyebarkan notifikasi darurat terkait WiFi ilegal ke seluruh pengguna.
- **Sistem Ticketing** — Pengguna melaporkan masalah di menu **Lapor Gangguan**. Admin dapat mengeksekusi dan memberi catatan teknisi melalui menu **Laporan Masuk**, tersinkronisasi 100% via MySQL.

---

## Panduan Maintenance

- **Pembersihan Docker** — Jalankan perintah berikut untuk menghapus cache kontainer yang menumpuk:
  ```bash
  docker system prune -a --volumes
  ```
- **Housekeeping Zabbix** — Sesuaikan retensi History & Trends di menu **Administration > Housekeeping** pada panel Zabbix agar ruang penyimpanan tetap aman.
