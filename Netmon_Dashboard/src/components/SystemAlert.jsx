import React, { useState, useEffect } from 'react';

const SystemAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('unread');

  useEffect(() => {
    // Tarik data dari kardus localStorage
    const savedAlerts = JSON.parse(localStorage.getItem('netmon_alerts'));
    
    if (savedAlerts && savedAlerts.length > 0) {
      setAlerts(savedAlerts);
    } else {
      // Data dummy kalau kosong
      const defaultAlerts = [
        { id: 'AL-001', level: 'CRITICAL', text: 'FEB Access Point Down', desc: 'Tidak ada respon ping dari perangkat.', status: 'unread', time: '10 Menit lalu' },
        { id: 'AL-002', level: 'CRITICAL', text: 'Latency Spike > 300ms di Perpustakaan', desc: 'Indikasi bottleneck pada switch distribusi.', status: 'unread', time: '15 Menit lalu' },
        { id: 'AL-003', level: 'WARNING', text: 'CPU Usage Core Switch A 85%', desc: 'Beban prosesor tinggi terdeteksi.', status: 'unread', time: '1 Jam lalu' },
        { id: 'AL-004', level: 'WARNING', text: 'BGP Session Flapping (ISP 2)', desc: 'Koneksi ke ISP cadangan tidak stabil.', status: 'read', time: 'Kemarin' }
      ];
      localStorage.setItem('netmon_alerts', JSON.stringify(defaultAlerts));
      setAlerts(defaultAlerts);
    }
  }, []);

  const markAsRead = (id) => {
    const updatedAlerts = alerts.map(a => a.id === id ? { ...a, status: 'read' } : a);
    setAlerts(updatedAlerts);
    localStorage.setItem('netmon_alerts', JSON.stringify(updatedAlerts));
  };

  const markAsUnread = (id) => {
    const updatedAlerts = alerts.map(a => a.id === id ? { ...a, status: 'unread' } : a);
    setAlerts(updatedAlerts);
    localStorage.setItem('netmon_alerts', JSON.stringify(updatedAlerts));
  };

  const unreadAlerts = alerts.filter(a => a.status === 'unread');
  const readAlerts = alerts.filter(a => a.status === 'read');

  return (
    <div className="page active">
      <div className="page-title">System Alerts</div>
      <div className="page-sub">Pantau peringatan dan anomali pada jaringan.</div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('unread')}
          style={{ padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === 'unread' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'unread' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
        >
          Menunggu Pengecekan ({unreadAlerts.length})
        </button>
        <button 
          onClick={() => setActiveTab('read')}
          style={{ padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === 'read' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'read' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
        >
          Sudah Terbaca
        </button>
      </div>

      <div className="panel" style={{ marginTop: '20px' }}>
        {activeTab === 'unread' && (
          <div>
            {unreadAlerts.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                Semua sistem normal. Tidak ada peringatan baru.
              </div>
            ) : (
              unreadAlerts.map(alert => (
                <div key={alert.id} className="alert-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      {/* Logika pintar ngebaca 'level' (dummy) atau 'severity' (rogue AP) */}
                      <span className={`badge ${alert.level === 'CRITICAL' || alert.severity === 'critical' ? 'critical' : 'warning'}`}>
                        {alert.level || alert.severity?.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.time || 'Baru saja'}</span>
                    </div>
                    {/* Logika pintar ngebaca 'text' (dummy) atau 'title' (rogue AP) */}
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {alert.text || alert.title}
                    </div>
                    {/* Render HTML biar efek Bold <strong> dari Rogue AP tetep jalan di sini */}
                    <div 
                      style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }} 
                      dangerouslySetInnerHTML={{ __html: alert.desc }}
                    />
                  </div>
                  <button 
                    onClick={() => markAsRead(alert.id)}
                    style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                    onMouseOver={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'; }}
                    onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--primary)'; }}
                  >
                    Tandai Sudah Dicek
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'read' && (
          <div>
            {readAlerts.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                Belum ada riwayat peringatan yang dibaca.
              </div>
            ) : (
              readAlerts.map(alert => (
                <div key={alert.id} className="alert-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '14px', opacity: 0.7, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>TERBACA</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.time || 'Baru saja'}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                      {alert.text || alert.title}
                    </div>
                    <div 
                      style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }} 
                      dangerouslySetInnerHTML={{ __html: alert.desc }}
                    />
                  </div>
                  <button 
                    onClick={() => markAsUnread(alert.id)}
                    style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                    onMouseOver={(e) => { e.target.style.background = 'var(--bg-dark)'; e.target.style.color = 'var(--text-primary)'; e.target.style.borderColor = 'var(--text-secondary)'; }}
                    onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--text-muted)'; }}
                  >
                    Batal Cek
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAlert;