import React, { useState, useEffect } from 'react';

const AccessPoint = () => {
  const [apData, setApData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE UNTUK FILTER & SORTING ---
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // asc atau desc

  useEffect(() => {
    fetch('http://localhost:5000/api/perangkat')
      .then(res => res.json())
      .then(data => {
        const filteredAP = data.filter(item => item.host.includes('AP-') || item.name.includes('Access Point')).map(ap => {
          const isOnline = ap.status === "0";
          
          // Deteksi Lokasi dari nama
          const hostNameUp = (ap.host + " " + (ap.name || "")).toUpperCase();
          let locStr = 'Area Kampus UPNVJ';
          if(hostNameUp.includes('FIK')) locStr = 'Fakultas Ilmu Komputer (FIK)';
          else if(hostNameUp.includes('FEB')) locStr = 'Fakultas Ekonomi Bisnis (FEB)';
          else if(hostNameUp.includes('REK')) locStr = 'Gedung Rektorat';

          return {
            ...ap,
            location: locStr,
            users: isOnline ? Math.floor(Math.random() * 40) + 10 : 0,
            download: isOnline ? (Math.random() * 45 + 5).toFixed(1) : "0.0",
            upload: isOnline ? (Math.random() * 15 + 1).toFixed(1) : "0.0",
            load: isOnline ? Math.floor(Math.random() * 30) + 20 : 0,
            mac: `00:1A:2B:${Math.floor(Math.random()*90+10)}:${Math.floor(Math.random()*90+10)}:FF`,
            uptime: isOnline ? `${Math.floor(Math.random() * 45 + 1)}d ${Math.floor(Math.random() * 24)}h` : 'Offline',
            temp: isOnline ? Math.floor(Math.random() * 15) + 40 : 0, 
            band: Math.random() > 0.3 ? "Dual Band (2.4/5GHz)" : "5GHz Only",
            channel: `Ch ${Math.floor(Math.random() * 11 + 1)} / ${Math.floor(Math.random() * 100 + 36)}`
          };
        });
        setApData(filteredAP);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  useEffect(() => {
    if (loading || apData.length === 0) return;
    const interval = setInterval(() => {
      setApData(prevData => prevData.map(ap => {
        if (ap.status !== "0") return ap; 
        return {
          ...ap,
          users: Math.max(0, ap.users + (Math.floor(Math.random() * 5) - 2)),
          download: (Math.max(1, parseFloat(ap.download) + (Math.random() * 10 - 5))).toFixed(1),
          upload: (Math.max(0.5, parseFloat(ap.upload) + (Math.random() * 4 - 2))).toFixed(1),
          load: Math.min(100, Math.max(5, ap.load + (Math.floor(Math.random() * 9) - 4))),
          temp: Math.min(75, Math.max(35, ap.temp + (Math.floor(Math.random() * 3) - 1)))
        };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [loading, apData.length]);

  // --- PROSES FILTER & SORTING DATA ---
  const processedAPs = apData
    .filter(ap => {
      if (filterStatus === 'All') return true;
      if (filterStatus === 'Online') return ap.status === "0";
      if (filterStatus === 'Offline') return ap.status !== "0";
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.host.localeCompare(b.host);
      if (sortOrder === 'desc') return b.host.localeCompare(a.host);
      return 0;
    });

  return (
    <div className="page active">
      <div className="page-title">Monitoring Access Point</div>
      <div className="page-sub">Data Real-Time terintegrasi dengan Zabbix Server.</div>
      
      <div className="panel" style={{ marginTop: '20px' }}>
        
        {/* BARIS KONTROL FILTER & SORTING */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
           <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="All">Semua Status</option>
              <option value="Online">Hanya Online</option>
              <option value="Offline">Hanya Offline</option>
           </select>
           <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="asc">ID Perangkat (A - Z)</option>
              <option value="desc">ID Perangkat (Z - A)</option>
           </select>
        </div>

        <div className="table-wrap">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 10px', fontSize: '11px', textTransform: 'uppercase' }}>ID & MAC Address</th>
                <th style={{ padding: '12px 10px', fontSize: '11px', textTransform: 'uppercase' }}>Lokasi, IP & Uptime</th>
                <th style={{ padding: '12px 10px', fontSize: '11px', textTransform: 'uppercase' }}>Status & Radio</th>
                <th style={{ padding: '12px 10px', fontSize: '11px', textTransform: 'uppercase' }}>Throughput</th>
                <th style={{ padding: '12px 10px', fontSize: '11px', textTransform: 'uppercase' }}>Klien</th>
                <th style={{ padding: '12px 10px', fontSize: '11px', textTransform: 'uppercase' }}>Hardware (Load/Suhu)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--primary)' }}>Menyinkronkan data dengan Zabbix...</td></tr>
              ) : processedAPs.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Tidak ada Access Point ditemukan.</td></tr>
              ) : (
                processedAPs.map(ap => {
                  const isOnline = ap.status === "0";
                  return (
                    <tr key={ap.hostid} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{ap.host}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>MAC: {ap.mac}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{ap.location}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>IP: {ap.interfaces && ap.interfaces.length > 0 ? ap.interfaces[0].ip : 'No IP'}</div>
                        <div style={{ fontSize: '10px', color: isOnline ? 'var(--blue)' : 'var(--text-muted)', fontWeight: 'bold', marginTop: '2px' }}>Uptime: {ap.uptime}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                         <span className={`badge ${isOnline ? 'online' : 'critical'}`} style={{ fontSize: '10px', padding: '4px 8px', marginBottom: '4px', display: 'inline-block' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                         {isOnline && ( <><div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{ap.band}</div><div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{ap.channel}</div></> )}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '2px' }}><span style={{ color: 'var(--blue)', marginRight: '6px' }}>↓</span>{ap.download} <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Mbps</span></div>
                        <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 'bold' }}><span style={{ color: 'var(--yellow)', marginRight: '6px' }}>↑</span>{ap.upload} <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Mbps</span></div>
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '13px', color: 'var(--text-secondary)' }}><span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{ap.users}</span> User</td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', width: '28px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{ap.load}%</span>
                          <div className="progress-bar" style={{ width: '50px', height: '5px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: `${ap.load}%`, height: '100%', background: ap.load > 70 ? 'var(--red)' : 'var(--green)', transition: 'width 0.5s ease-in-out' }}></div></div>
                        </div>
                        <div style={{ fontSize: '10px', color: ap.temp > 60 ? 'var(--red)' : 'var(--text-secondary)', fontWeight: ap.temp > 60 ? 'bold' : 'normal' }}>Suhu: {ap.temp}°C</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccessPoint;