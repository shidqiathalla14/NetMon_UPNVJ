import React from 'react';

const Traffic = () => {
  // Ini URL lu yang udah gue tambahin "&kiosk" di paling belakang
  // Kiosk ini yang bakal ngilangin semua tombol edit dan menu navigasi Grafana
  const grafanaUrl = "http://localhost:3000/d/adbfxxl/traffic-upnvj?orgId=1&from=now-6h&to=now&timezone=browser&kiosk";

  return (
    <div className="page active" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-title">Traffic Analysis</div>
      <div className="page-sub">Pantau alur dan beban lalu lintas jaringan secara real-time.</div>
      
      {/* Wadah Iframe untuk nampilin Grafana */}
      <div className="panel" style={{ marginTop: '20px', padding: 0, flex: 1, minHeight: '850px', overflow: 'hidden', borderRadius: '12px' }}>
        <iframe 
          src={grafanaUrl} 
          width="100%" 
          height="100%" 
          frameBorder="0"
          style={{ display: 'block', width: '100%', height: '100%' }}
          title="Grafana Traffic Dashboard"
        ></iframe>
      </div>
    </div>
  );
};

export default Traffic;