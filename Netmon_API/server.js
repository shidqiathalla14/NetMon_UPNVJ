const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql'); // 👈 Import library MySQL

const app = express();

// Biar React lu (Port 5173) diizinin ngambil data dari sini (Port 5000)
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ==========================================
// KONFIGURASI DATABASE MYSQL (XAMPP PORT 3307)
// ==========================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'netmon_upnvj', // Nama database baru kita
    port: 3307                // Port baru XAMPP biar ga tabrakan
});

// Koneksikan ke MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ Koneksi ke MySQL gagal, Qi! Cek XAMPP lu:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke database netmon_upnvj di port 3307!');
    }
});

// ==========================================
// KONFIGURASI ZABBIX (Ubah ke akun Super Admin)
// ==========================================
const ZABBIX_URL = 'http://localhost:8080/api_jsonrpc.php';
const ZABBIX_USER = 'Admin'; // Pake A besar ya kalau bawaan default!
const ZABBIX_PASS = 'zabbix'; // Ganti pakai password login web Zabbix lu

// ==========================================
// ENDPOINT ZABBIX: Tarik Data Perangkat
// ==========================================
app.get('/api/perangkat', async (req, res) => {
    try {
        // 1. Ketuk Pintu Zabbix (Minta Token Akses)
        const authResponse = await axios.post(ZABBIX_URL, {
            jsonrpc: "2.0",
            method: "user.login",
            params: {
                username: ZABBIX_USER,
                password: ZABBIX_PASS
            },
            id: 1,
            auth: null
        });

        const authToken = authResponse.data.result;

        if (!authToken) {
            return res.status(401).json({ error: "Gagal login ke Zabbix. Cek username/password lu, Qi!" });
        }

        // 2. Sedot Data Perangkat dari Zabbix pakai Token tadi
        const hostResponse = await axios.post(ZABBIX_URL, {
            jsonrpc: "2.0",
            method: "host.get",
            params: {
                output: ["hostid", "host", "name", "status"], // 0 = Monitored/Online, 1 = Unmonitored/Offline
                selectInterfaces: ["ip"], // Minta IP address-nya sekalian
            },
            id: 2,
            auth: authToken
        });

        // 3. Kirim datanya ke React lu dalam bentuk JSON yang bersih
        res.json(hostResponse.data.result);

    } catch (error) {
        console.error("Waduh, Zabbix API Error:", error.message);
        res.status(500).json({ error: 'Gagal komunikasi dengan server Zabbix' });
    }
});

// ==========================================
// ENDPOINT MYSQL: Mahasiswa Kirim Laporan Gangguan
// ==========================================
app.post('/api/laporan', (req, res) => {
    const { nama_pelapor, nim_nip, lokasi, kategori, deskripsi, foto } = req.body;
    
    const query = `INSERT INTO laporan (nama_pelapor, nim_nip, lokasi, kategori, deskripsi, foto) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [nama_pelapor, nim_nip, lokasi, kategori, deskripsi, foto], (err, result) => {
        if (err) {
            console.error("Gagal nyimpen laporan:", err);
            return res.status(500).json({ error: "Gagal mengirim laporan" });
        }
        res.json({ success: true, message: "Laporan masuk!" });
    });
});

// ==========================================
// ENDPOINT MYSQL: Admin Tarik Semua Laporan
// ==========================================
app.get('/api/laporan', (req, res) => {
    const query = `SELECT * FROM laporan ORDER BY created_at DESC`;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Gagal narik data" });
        res.json(results);
    });
});

// ==========================================
// ENDPOINT MYSQL: Admin Update Status & Catatan
// ==========================================
app.put('/api/laporan/:id', (req, res) => {
    const { id } = req.params;
    const { status, catatan } = req.body;
    
    const query = `UPDATE laporan SET status = ?, catatan = ? WHERE id = ?`;
    
    db.query(query, [status, catatan, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal update" });
        res.json({ success: true });
    });
});

// ==========================================
// NYALAKAN MESIN SERVER
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 NetMon API Bridge udah jalan mulus di http://localhost:${PORT}`);
    console.log(`👉 Cek data Zabbix di: http://localhost:${PORT}/api/perangkat`);
    console.log(`👉 Cek data Laporan di: http://localhost:${PORT}/api/laporan`);
});