import React, { useState, useEffect } from 'react';

const AccessPoint = () => {
  const [apData, setApData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi buat nyedot data dari Backend Express (Zabbix)
  useEffect(() => {
    fetch('http://localhost:5000/api/perangkat')
      .then(res => res.json())
      .then(data => {
        // Filter: Biar yang masuk ke tabel Access Point cuma perangkat yang namanya "AP-"
        const filteredAP = data.filter(item => item.host.includes('AP-'));
        setApData(filteredAP);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal narik data Zabbix:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page active">
      <div className="page-title">Monitoring Access Point</div>
      <div className="page-sub">Data Real-Time terintegrasi dengan Zabbix Server.</div>
      
      <div className="panel" style={{ marginTop: '20px' }}>
        <div className="table-wrap">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>ID Perangkat</th>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>Lokasi & IP</th>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>Status Zabbix</th>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>User Terhubung</th>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>Beban AP (Load)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--primary)' }}>
                    Menyinkronkan data dengan Zabbix...
                  </td>
                </tr>
              ) : apData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                    Belum ada data perangkat Access Point di Zabbix.
                  </td>
                </tr>
              ) : (
                apData.map(ap => {
                  // Zabbix status: "0" itu Online/Monitored, "1" itu Offline/Disabled
                  const isOnline = ap.status === "0";
                  
                  return (
                    <tr key={ap.hostid} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {ap.host}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{ap.name || 'Lokasi Belum Diset'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {ap.interfaces && ap.interfaces.length > 0 ? ap.interfaces[0].ip : 'No IP'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                         <span className={`badge ${isOnline ? 'online' : 'critical'}`} style={{ fontSize: '10px', padding: '4px 8px' }}>
                           {isOnline ? 'ONLINE' : 'OFFLINE'}
                         </span>
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                         {/* Data Dummy Sementara, nunggu konfigurasi Zabbix Items */}
                         {isOnline ? Math.floor(Math.random() * 50) + 10 : 0} Mahasiswa
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', width: '28px', color: 'var(--text-secondary)' }}>
                            {isOnline ? '45%' : '0%'}
                          </span>
                          <div className="progress-bar" style={{ width: '60px', height: '4px', background: 'var(--bg-dark)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: isOnline ? '45%' : '0%', height: '100%', background: 'var(--green)' }}></div>
                          </div>
                        </div>
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