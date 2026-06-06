import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [rogueAlert, setRogueAlert] = useState([]);

  useEffect(() => {
    const checkRogueAP = () => {
      try {
        const rawData = localStorage.getItem('netmon_alerts');
        const parsedData = rawData ? JSON.parse(rawData) : [];
        const allAlerts = Array.isArray(parsedData) ? parsedData : [];
        
        const isRogueExist = allAlerts.filter(alert => 
          alert?.title?.toLowerCase().includes('rogue')
        );
        setRogueAlert(isRogueExist);
      } catch (error) {
        console.error("Data alert corrupt, reset ke aman.");
        setRogueAlert([]);
      }
    };

    checkRogueAP();
    const interval = setInterval(checkRogueAP, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '20px', gap: '20px' }}>

      {/* 1. SECTION NOTIFIKASI KHUSUS ROGUE AP */}
      {rogueAlert.length > 0 ? (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444', 
          borderRadius: '8px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', 
            width: '35px', height: '35px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0
          }}>
            !
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#ef4444', fontSize: '1.05rem', fontWeight: '600' }}>
              PERINGATAN KEAMANAN: WiFi Ilegal Terdeteksi!
            </h4>
            
            {/* LOGIKA PINTAR: Warna pakai var(--text-secondary) biar support Light/Dark Mode */}
            {rogueAlert.length === 1 ? (
              <p 
                style={{ margin: '4px 0 0 0', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                // dangerouslySetInnerHTML ini fungsinya buat ngerubah tag <strong> jadi Bold beneran
                dangerouslySetInnerHTML={{ __html: rogueAlert[0]?.desc }}
              />
            ) : (
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {rogueAlert.map((alert, index) => (
                  <li 
                    key={index} 
                    style={{ marginBottom: '4px' }}
                    dangerouslySetInnerHTML={{ __html: alert.desc }}
                  />
                ))}
              </ul>
            )}
            
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid #10b981', 
          borderRadius: '8px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            backgroundColor: '#10b981', color: 'white', borderRadius: '50%', 
            width: '35px', height: '35px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0
          }}>
            ✓
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#10b981', fontSize: '1.05rem', fontWeight: '600' }}>
              System Status: All Clear
            </h4>
            <p style={{ margin: '4px 0 0 0', color: '#--text-muted', fontSize: '0.9rem' }}>
              Jaringan WiFi UPNVJ dalam kondisi aman.
            </p>
          </div>
        </div>
      )}

      {/* 2. IFRAME GRAFANA */}
      <div style={{ flex: 1, minHeight: '70vh', width: '100%' }}>
        <iframe 
          src="http://localhost:3000/d/adh4jzz/netmon-upnvj?orgId=1&from=now-5m&to=now&timezone=browser&refresh=5s&kiosk" 
          style={{ width: '100%', height: '160%', border: 'none', borderRadius: '8px' }}
          title="Network Monitoring Dashboard"
        ></iframe>
      </div>

    </div>
  );
};

export default Dashboard;