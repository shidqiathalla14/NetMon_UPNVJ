import React, { useState, useEffect } from 'react';

const Devices = () => {
  const [activeTab, setActiveTab] = useState('inventaris'); 
  const [devices, setDevices] = useState([]);
  const [rogueAps, setRogueAps] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE UNTUK FILTER & SORTING ---
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // asc atau desc

  const [deviceModal, setDeviceModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [formData, setFormData] = useState({ id: '', name: '', type: 'Router', location: '', ip: '', gateway: '' });

  const fetchZabbixDevices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/perangkat');
      const data = await res.json();

      const mappedDevices = data.map(host => {
        const isOnline = host.status === "0";
        const hostNameUp = (host.host + " " + (host.name || "")).toUpperCase();
        
        // 1. Logika Cerdas Deteksi Tipe Perangkat
        let typeStr = 'Lainnya';
        if(hostNameUp.includes('AP-') || hostNameUp.includes('ACCESS POINT')) typeStr = 'Access Point';
        else if(hostNameUp.includes('RT-') || hostNameUp.includes('ROUTER')) typeStr = 'Router';
        else if(hostNameUp.includes('SW-') || hostNameUp.includes('SWITCH')) typeStr = 'Switch';
        else if(hostNameUp.includes('FW-') || hostNameUp.includes('FIREWALL')) typeStr = 'Firewall';

        // 2. Logika Cerdas Deteksi Lokasi Kampus UPNVJ
        let locStr = 'Area Kampus UPNVJ';
        if(hostNameUp.includes('FIK')) locStr = 'Fakultas Ilmu Komputer (FIK)';
        else if(hostNameUp.includes('FEB')) locStr = 'Fakultas Ekonomi Bisnis (FEB)';
        else if(hostNameUp.includes('REK')) locStr = 'Gedung Rektorat';
        else if(hostNameUp.includes('FK')) locStr = 'Fakultas Kedokteran (FK)';
        else if(hostNameUp.includes('FISIP')) locStr = 'FISIP UPNVJ';

        return {
          zabbixId: host.hostid,
          id: host.host, 
          name: host.name || host.host,
          type: typeStr,
          location: locStr, // Lokasi udah otomatis sesuai nama gedung
          ip: host.interfaces && host.interfaces.length > 0 ? host.interfaces[0].ip : 'No IP',
          gateway: 'Auto (DHCP)', 
          status: isOnline ? 'Online' : 'Offline',
          ping: isOnline ? Math.floor(Math.random() * 15) + 2 : 0, 
          cpu: isOnline ? Math.floor(Math.random() * 30) + 10 : 0 
        };
      });
      setDevices(mappedDevices);
    } catch (err) {
      console.error("Gagal narik data Zabbix ke Inventaris:", err);
    }
  };

  useEffect(() => {
    const loadRogueData = () => {
      let savedRogue = JSON.parse(localStorage.getItem('netmon_rogue_aps')) || [
        { id: 'ROGUE-01', ssid: 'UPNVJ-Free-Wifi', mac: 'AA:BB:CC:DD:EE:11', location: 'Area Kantin', detectedAt: '10 Menit lalu', threat: 'Tinggi', warningActive: false }
      ];
      setRogueAps(savedRogue);
    };
    fetchZabbixDevices();
    loadRogueData();
    setTimeout(() => setLoading(false), 800); 
  }, []);

  // Logika Animasi Real-time
  useEffect(() => {
    if (loading || devices.length === 0) return;
    const interval = setInterval(() => {
      setDevices(prev => prev.map(dev => {
        if (dev.status === 'Offline') return dev;
        return {
          ...dev,
          ping: Math.max(1, dev.ping + (Math.floor(Math.random() * 5) - 2)),
          cpu: Math.min(100, Math.max(5, dev.cpu + (Math.floor(Math.random() * 9) - 4)))
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [loading, devices.length]);

  const openModal = (isEdit = false, dev = null) => {
    setDeviceModal({ isOpen: true, isEdit, data: dev });
    setFormData(isEdit ? { id: dev.id, name: dev.name, type: dev.type, location: dev.location, ip: dev.ip, gateway: dev.gateway } : { id: '', name: '', type: 'Router', location: '', ip: '', gateway: '' });
  };

  const handleFormSave = async (e) => {
    e.preventDefault();
    if (deviceModal.isEdit) {
      setDevices(devices.map(d => d.id === deviceModal.data.id ? { ...d, ...formData } : d));
      setDeviceModal({ isOpen: false, isEdit: false, data: null });
    } else {
      try {
        const res = await fetch('http://localhost:5000/api/perangkat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Kita gabungin lokasi ke nama biar bisa dibaca pas Fetch
          body: JSON.stringify({ hostname: formData.id, name: `${formData.name} - ${formData.location}`, ip: formData.ip, type: formData.type })
        });
        const result = await res.json();
        if (result.success) { fetchZabbixDevices(); setDeviceModal({ isOpen: false, isEdit: false, data: null }); } 
        else alert(`Gagal: ${result.error}`);
      } catch (err) { console.error(err); }
    }
  };

  const handleDelete = async (zabbixId, localId) => {
    if (!zabbixId) return setDevices(devices.filter(d => d.id !== localId));
    if(window.confirm('Yakin ingin menghapus perangkat ini dari Zabbix?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/perangkat/${zabbixId}`, { method: 'DELETE' });
        if ((await res.json()).success) fetchZabbixDevices();
      } catch (err) { console.error(err); }
    }
  };

  // --- PROSES FILTER & SORTING DATA ---
  const processedDevices = devices
    .filter(dev => filterType === 'All' ? true : dev.type === filterType)
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.id.localeCompare(b.id);
      if (sortOrder === 'desc') return b.id.localeCompare(a.id);
      return 0;
    });

  if (loading) return <div className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Menyinkronkan Zabbix...</div></div>;

  return (
    <div className="page active">
      <div className="page-title">Inventaris & Keamanan Jaringan</div>
      <div className="page-sub">Kelola perangkat NOC dan pantau WiFi ilegal.</div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setActiveTab('inventaris')} style={{ padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === 'inventaris' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'inventaris' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer' }}>Inventaris Perangkat Resmi</button>
        <button onClick={() => setActiveTab('rogue')} style={{ padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === 'rogue' ? '3px solid var(--red)' : '3px solid transparent', color: activeTab === 'rogue' ? 'var(--red)' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer' }}>Keamanan (Rogue AP)</button>
      </div>

      {activeTab === 'inventaris' && (
        <div className="panel" style={{ marginTop: '20px' }}>
          
          {/* BARIS KONTROL FILTER & SORTING */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="All">Semua Tipe Perangkat</option>
                <option value="Access Point">Access Point</option>
                <option value="Router">Router</option>
                <option value="Switch">Switch</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="asc">A - Z (Ascending)</option>
                <option value="desc">Z - A (Descending)</option>
              </select>
            </div>
            <button onClick={() => openModal(false)} style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Tambah Perangkat</button>
          </div>

          <div className="table-wrap">
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 10px', fontSize: '12px' }}>Hostname / ID</th>
                  <th style={{ padding: '12px 10px', fontSize: '12px' }}>IP & Gateway</th>
                  <th style={{ padding: '12px 10px', fontSize: '12px' }}>Tipe & Lokasi</th>
                  <th style={{ padding: '12px 10px', fontSize: '12px' }}>Status & Beban</th>
                  <th style={{ padding: '12px 10px', fontSize: '12px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {processedDevices.length === 0 ? (
                   <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Tidak ada perangkat ditemukan.</td></tr>
                ) : (
                  processedDevices.map((dev) => (
                    <tr key={dev.zabbixId || dev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--primary-light)' }}>{dev.id}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{dev.name.split(' - ')[0]}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>IP: {dev.ip}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>GW: {dev.gateway}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{dev.type}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{dev.location}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className={`status-dot ${dev.status === 'Online' ? 'online' : 'offline'}`} style={{ width: '6px', height: '6px' }}></span>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: dev.status === 'Online' ? 'var(--green)' : 'var(--red)' }}>{dev.status} ({dev.ping}ms)</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>CPU Load: {dev.cpu}%</div>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <button onClick={() => handleDelete(dev.zabbixId, dev.id)} style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '4px', border: 'none', background: 'var(--red)', color: 'white', cursor: 'pointer' }}>Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;