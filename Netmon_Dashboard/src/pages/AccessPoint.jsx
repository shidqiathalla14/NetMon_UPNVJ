import React from 'react';

const AccessPoint = () => {
  const apData = [
    { id: 'AP-REK-01', loc: 'Rektorat Lobby', ip: '10.10.20.5', clients: 45, load: 65, status: 'online' },
    { id: 'AP-FEB-01', loc: 'Gedung FEB Lt.1', ip: '10.10.21.12', clients: 0, load: 0, status: 'offline' },
    { id: 'AP-FEB-02', loc: 'Gedung FEB Lt.2', ip: '10.10.21.13', clients: 88, load: 92, status: 'warning' },
    { id: 'AP-FIK-01', loc: 'Gedung FIK Lab', ip: '10.10.22.5', clients: 112, load: 78, status: 'online' },
    { id: 'AP-LIB-01', loc: 'Perpustakaan Pusat', ip: '10.10.23.8', clients: 64, load: 45, status: 'online' },
    { id: 'AP-FISIP-01', loc: 'Gedung FISIP', ip: '10.10.24.2', clients: 41, load: 35, status: 'online' },
  ];

  return (
    <div className="page active">
      <div className="page-title">Monitoring Access Point</div>
      <div className="page-sub"></div>
      
      <div className="panel" style={{ marginTop: '20px' }}>
        <div className="table-wrap">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>ID Perangkat</th>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>Lokasi & IP</th>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>Status</th>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>User Terhubung</th>
                <th style={{ padding: '12px 10px', fontSize: '12px' }}>Beban AP (Load)</th>
              </tr>
            </thead>
            <tbody>
              {apData.map(ap => (
                <tr key={ap.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{ap.id}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{ap.loc}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{ap.ip}</div>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                     <span className={`badge ${ap.status === 'online' ? 'online' : ap.status === 'offline' ? 'critical' : 'warning'}`} style={{ fontSize: '10px', padding: '4px 8px' }}>
                       {ap.status.toUpperCase()}
                     </span>
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: '13px', color: 'var(--text-primary)' }}>{ap.clients} Mahasiswa</td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', width: '28px', color: 'var(--text-secondary)' }}>{ap.load}%</span>
                      <div className="progress-bar" style={{ width: '60px', height: '4px', background: 'var(--bg-dark)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${ap.load}%`, height: '100%', background: ap.load > 80 ? 'var(--red)' : ap.load > 60 ? 'var(--yellow)' : 'var(--green)' }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccessPoint;