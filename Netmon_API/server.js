const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ==========================================
// KONFIGURASI DATABASE MYSQL
// ==========================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'netmon_upnvj', 
    port: 3307                
});

db.connect((err) => {
    if (err) {
        console.error('❌ Koneksi ke MySQL gagal, Qi! Cek XAMPP lu:', err.message);
    } else {
        console.log('✅ Berhasil terhubung ke database netmon_upnvj di port 3307!');
    }
});

// ==========================================
// KONFIGURASI ZABBIX 
// ==========================================
const ZABBIX_URL = 'http://localhost:8080/api_jsonrpc.php';
const ZABBIX_USER = 'Admin'; 
const ZABBIX_PASS = 'zabbix'; 

// Fungsi Helper untuk dapetin Token Zabbix
const getZabbixToken = async () => {
    const authResponse = await axios.post(ZABBIX_URL, {
        jsonrpc: "2.0", method: "user.login",
        params: { username: ZABBIX_USER, password: ZABBIX_PASS },
        id: 1, auth: null
    });
    return authResponse.data.result;
};

// ==========================================
// ENDPOINT ZABBIX: 1. Tarik Data Perangkat (GET)
// ==========================================
app.get('/api/perangkat', async (req, res) => {
    try {
        const authToken = await getZabbixToken();
        if (!authToken) return res.status(401).json({ error: "Gagal login ke Zabbix" });

        const hostResponse = await axios.post(ZABBIX_URL, {
            jsonrpc: "2.0", method: "host.get",
            params: {
                output: ["hostid", "host", "name", "status"], 
                selectInterfaces: ["ip"], 
            },
            id: 2, auth: authToken
        });

        res.json(hostResponse.data.result);
    } catch (error) {
        console.error("Zabbix API Error:", error.message);
        res.status(500).json({ error: 'Gagal komunikasi dengan server Zabbix' });
    }
});

// ==========================================
// ENDPOINT ZABBIX: 2. Tambah Perangkat (POST)
// ==========================================
app.post('/api/perangkat', async (req, res) => {
    const { hostname, name, ip, type } = req.body;
    
    // Tentukan Group ID Zabbix berdasarkan tipe perangkat
    // PENTING: ID 2 = Linux servers (default). Sesuaikan dengan ID Group di Zabbix lu.
    const groupId = type === 'Access Point' ? "5" : "2"; 

    try {
        const authToken = await getZabbixToken();
        
        const createResponse = await axios.post(ZABBIX_URL, {
            jsonrpc: "2.0",
            method: "host.create",
            params: {
                host: hostname,
                name: name,
                interfaces: [{
                    type: 1, // 1 = Zabbix Agent
                    main: 1,
                    useip: 1,
                    ip: ip,
                    dns: "",
                    port: "10050"
                }],
                groups: [{ groupid: groupId }] 
            },
            id: 3,
            auth: authToken
        });

        if (createResponse.data.error) {
            return res.status(400).json({ success: false, error: createResponse.data.error.data });
        }
        res.json({ success: true, data: createResponse.data.result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// ENDPOINT ZABBIX: 3. Hapus Perangkat (DELETE)
// ==========================================
app.delete('/api/perangkat/:hostid', async (req, res) => {
    const { hostid } = req.params;
    try {
        const authToken = await getZabbixToken();
        
        const delResponse = await axios.post(ZABBIX_URL, {
            jsonrpc: "2.0",
            method: "host.delete",
            params: [hostid],
            id: 4,
            auth: authToken
        });

        res.json({ success: true, data: delResponse.data.result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// ENDPOINT MYSQL: Laporan
// ==========================================
app.post('/api/laporan', (req, res) => {
    const { nama_pelapor, nim_nip, lokasi, kategori, deskripsi, foto } = req.body;
    const query = `INSERT INTO laporan (nama_pelapor, nim_nip, lokasi, kategori, deskripsi, foto) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [nama_pelapor, nim_nip, lokasi, kategori, deskripsi, foto], (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal mengirim laporan" });
        res.json({ success: true, message: "Laporan masuk!" });
    });
});

app.get('/api/laporan', (req, res) => {
    const query = `SELECT * FROM laporan ORDER BY created_at DESC`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Gagal narik data" });
        res.json(results);
    });
});

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