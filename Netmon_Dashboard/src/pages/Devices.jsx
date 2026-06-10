import React, { useState, useEffect } from 'react';

const Devices = () => {
  const [activeTab, setActiveTab] = useState('inventaris'); 
  const [devices, setDevices] = useState([]);
  const [rogueAps, setRogueAps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deviceModal, setDeviceModal] = useState({ isOpen: false, isEdit: false, data: null });
  const [formData, setFormData] = useState({ id: '', name: '', type: 'Router', location: '', ip: '', gateway: '' });

  useEffect(() => {
    // 1. FUNGSI NARIK DATA ZABBIX BUAT INVENTARIS
    const fetchZabbixDevices = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/perangkat');
        const data = await res.json();

        // Menerjemahkan data Zabbix ke format UI Web Lu
        const mappedDevices = data.map(host => {
          const isOnline = host.status === "0";
          
          // Deteksi otomatis tipe perangkat dari namanya
          let typeStr = 'Lainnya';
          const hostNameUp = host.host.toUpperCase();
          if(hostNameUp.includes('RT-')) typeStr = 'Router';
          else if(hostNameUp.includes('SW-')) typeStr = 'Switch';
          else if(hostNameUp.includes('FW-')) typeStr = 'Firewall';
          else if(hostNameUp.includes('AP-')) typeStr = 'Access Point';

          return {
            zabbixId: host.hostid,
            id: host.host, // Misal: RT-CORE-01
            name: host.name || host.host,
            type: typeStr,
            location: 'Terdeteksi di Jaringan', // Placeholder lokasi
            ip: host.interfaces && host.interfaces.length > 0 ? host.interfaces[0].ip : 'No IP',
            gateway: 'Auto (DHCP)', 
            status: isOnline ? 'Online' : 'Offline',
            ping: isOnline ? Math.floor(Math.random() * 15) + 2 : 0, // Animasi awal
            cpu: isOnline ? Math.floor(Math.random() * 30) + 10 : 0 // Animasi awal
          };
        });

        setDevices(mappedDevices);
      } catch (err) {
        console.error("Gagal narik data Zabbix ke Inventaris:", err);
      }
    };

    // 2. FUNGSI NARIK DATA ROGUE AP (Keamanan)
    const loadRogueData = () => {
      let savedRogue = JSON.parse(localStorage.getItem('netmon_rogue_aps'));
      if (!savedRogue || savedRogue.length === 0) {
        savedRogue = [
          { id: 'ROGUE-01', ssid: 'UPNVJ-Free-Wifi', mac: 'AA:BB:CC:DD:EE:11', location: 'Area Kantin', detectedAt: '10 Menit lalu', threat: 'Tinggi (Cloned SSID)', warningActive: false },
          { id: 'ROGUE-02', ssid: 'NetMon-Admin-Test', mac: 'FF:EE:DD:CC:BB:22', location: 'Parkiran FIK', detectedAt: '1 Jam lalu', threat: 'Sedang (Unknown AP)', warningActive: false }
        ];
        localStorage.setItem('netmon_rogue_aps', JSON.stringify(savedRogue));
      }
      setRogueAps(savedRogue);
    };
    
    fetchZabbixDevices();
    loadRogueData();
    
    setTimeout(() => setLoading(false), 800); 
  }, []);

  // EFEK ANIMASI: Bikin angka ping & CPU gerak-gerak tiap 3 detik biar terlihat live
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
    if (isEdit && dev) {
      setFormData({ id: dev.id, name: dev.name, type: dev.type, location: dev.location, ip: dev.ip, gateway: dev.gateway });
    } else {
      setFormData({ id: '', name: '', type: 'Router', location: '', ip: '', gateway: '' });
    }
  };

  const handleFormSave = (e) => {
    e.preventDefault();
    let updatedDevices;
    
    if (deviceModal.isEdit) {
      updatedDevices = devices.map(d => d.id === deviceModal.data.id ? { ...d, ...formData } : d);
    } else {
      const newDevice = { ...formData, status: 'Online', ping: 5, cpu: 10 };
      updatedDevices = [...devices, newDevice];
    }
    
    setDevices(updatedDevices);
    setDeviceModal({ isOpen: false, isEdit: false, data: null });
  };

  const handleDelete = (id) => {
    if(window.confirm('Yakin ingin menghapus perangkat ini dari inventaris dashboard? (Data asli di Zabbix tidak terhapus)')) {
      const updatedDevices = devices.filter(d => d.id !== id);
      setDevices(updatedDevices);
    }
  };

  // LOGIKA PERINGATAN ROGUE AP (TIDAK BERUBAH)
  const toggleWarningRogue = (id, currentStatus) => {
    const updatedRogue = rogueAps.map(r => r.id === id ? { ...r, warningActive: !currentStatus } : r);
    setRogueAps(updatedRogue);
    localStorage.setItem('netmon_rogue_aps', JSON.stringify(updatedRogue));

    if (!currentStatus) {
      const targetAP = rogueAps.find(r => r.id === id);
      const newAlert = {
        id: targetAP.id,
        severity: 'critical',
        title: `Rogue AP Detected`, 
        desc: `Harap berhati-hati terhadap jaringan WiFi bernama <strong>"${targetAP.ssid}"</strong> di sekitar <strong>${targetAP.location}</strong>. Ini adalah WiFi ilegal/palsu yang bisa mencuri data Anda!`,
        status: 'unread'
      };

      const existingAlerts = JSON.parse(localStorage.getItem('netmon_alerts')) || [];
      localStorage.setItem('netmon_alerts', JSON.stringify([...existingAlerts, newAlert]));
    } else {
      const existingAlerts = JSON.parse(localStorage.getItem('netmon_alerts')) || [];
      const filteredAlerts = existingAlerts.filter(alert => alert.id !== id);
      localStorage.setItem('netmon_alerts', JSON.stringify(filteredAlerts));
    }
  };

  if (loading) {
    return (
      <div className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Menyinkronkan data dengan Zabbix Server...</div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="page-title">Inventaris & Keamanan Jaringan</div>
      <div className="page-sub">Kelola perangkat NOC dan pantau WiFi ilegal.</div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('inventaris')}
          style={{ padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === 'inventaris' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'inventaris' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
        >
        Inventaris Perangkat Resmi
        </button>
        <button 
          onClick={() => setActiveTab('rogue')}
          style={{ padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === 'rogue' ? '3px solid var(--red)' : '3px solid transparent', color: activeTab === 'rogue' ? 'var(--red)' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
        >
        Keamanan (Rogue AP)
        </button>
      </div>

      {activeTab === 'inventaris' && (
        <div className="panel" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Daftar Perangkat Terdaftar</div>
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
                {devices.length === 0 ? (
                   <tr>
                     <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Belum ada perangkat terdaftar di Zabbix.</td>
                   </tr>
                ) : (
                  devices.map((dev) => (
                    <tr key={dev.zabbixId || dev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--primary-light)' }}>{dev.id}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{dev.name}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>IP: {dev.ip}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>GW: {dev.gateway}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{dev.type}</div>
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
                        <button onClick={() => openModal(true, dev)} style={{ fontSize: '11px', padding: '6px 10px', marginRight: '6px', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete(dev.id)} style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '4px', border: 'none', background: 'var(--red)', color: 'white', cursor: 'pointer' }}>Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB ROGUE AP */}
      {activeTab === 'rogue' && (
        <div className="panel" style={{ marginTop: '20px', border: '1px solid rgba(234,179,8,0.3)' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--yellow)' }}>Peringatan: AP Ilegal / Kriminal Terdeteksi</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Beri peringatan agar informasi ancaman ini muncul di Dashboard Publik.</div>
          </div>
          <div className="table-wrap">
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 10px', fontSize: '11px' }}>SSID CLONE</th>
                  <th style={{ padding: '12px 10px', fontSize: '11px' }}>MAC ADDRESS</th>
                  <th style={{ padding: '12px 10px', fontSize: '11px' }}>ESTIMASI LOKASI</th>
                  <th style={{ padding: '12px 10px', fontSize: '11px' }}>TINGKAT BAHAYA</th>
                  <th style={{ padding: '12px 10px', fontSize: '11px', textAlign: 'right' }}>TINDAKAN</th>
                </tr>
              </thead>
              <tbody>
                {rogueAps.map((rogue) => (
                  <tr key={rogue.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: rogue.warningActive ? 'rgba(234,179,8,0.05)' : 'transparent' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 'bold', color: rogue.warningActive ? 'var(--yellow)' : 'var(--text-secondary)' }}>
                      {rogue.ssid} <br/><span style={{fontSize:'9px', color:'var(--text-muted)'}}>{rogue.id}</span>
                    </td>
                    <td style={{ padding: '12px 10px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-primary)' }}>{rogue.mac}</td>
                    <td style={{ padding: '12px 10px', fontSize: '12px', color: 'var(--text-primary)' }}>{rogue.location} <br/><span style={{fontSize:'10px', color:'var(--text-secondary)'}}>{rogue.detectedAt}</span></td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge critical" style={{ fontSize: '10px' }}>{rogue.threat}</span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      {rogue.warningActive ? (
                        <button onClick={() => toggleWarningRogue(rogue.id, rogue.warningActive)} style={{ fontSize: '11px', padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--text-muted)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>Batalkan Warning</button>
                      ) : (
                        <button onClick={() => toggleWarningRogue(rogue.id, rogue.warningActive)} style={{ fontSize: '11px', padding: '6px 14px', borderRadius: '6px', border: 'none', background: 'var(--yellow)', color: '#000', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 10px rgba(234,179,8,0.3)' }}>Beri Peringatan Publik</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form Inventaris */}
      {deviceModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '600px', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{deviceModal.isEdit ? 'Edit Perangkat' : 'Tambah Perangkat Baru'}</h3>
            <form onSubmit={handleFormSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Hostname / ID</label>
                  <input required value={formData.id} onChange={e=>setFormData({...formData, id: e.target.value})} disabled={deviceModal.isEdit} placeholder="Contoh: RT-FEB-01" style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Nama Perangkat</label>
                  <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="Contoh: Router Utama FEB" style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Tipe Perangkat</label>
                  <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', outline: 'none' }}>
                    <option value="Router">Router</option><option value="Switch">Switch</option><option value="Access Point">Access Point</option><option value="Firewall">Firewall</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Lokasi Gedung</label>
                  <input required value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="Contoh: Gedung FEB Lt 1" style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>IP Address Management</label>
                  <input required value={formData.ip} onChange={e=>setFormData({...formData, ip: e.target.value})} placeholder="10.10.x.x" style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', outline: 'none', fontFamily: 'monospace' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>IP Gateway</label>
                  <input required value={formData.gateway} onChange={e=>setFormData({...formData, gateway: e.target.value})} placeholder="10.10.x.254" style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', outline: 'none', fontFamily: 'monospace' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={() => setDeviceModal({isOpen:false, isEdit:false, data:null})} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ padding: '10px 16px', background: 'var(--primary)', border: 'none', color: 'white', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{deviceModal.isEdit ? 'Simpan Perubahan' : 'Tambah ke Inventaris'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;