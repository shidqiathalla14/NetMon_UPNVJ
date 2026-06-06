import React from 'react';
import logoUPNVJ from '../assets/upnvj-logo.webp'; 

const Sidebar = ({ isCollapsed, toggleSidebar, activePage, setActivePage, userRole, onLogout, alertCount, ticketCount }) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      
      <div className="sidebar-logo" onClick={() => setActivePage(userRole === 'admin' ? 'dashboard' : 'lapor')} style={{ cursor: 'pointer', paddingLeft: '12px' }}>
        <img 
          src={logoUPNVJ} 
          alt="Logo UPNVJ" 
          style={{ width: '50px', height: '50px', flexShrink: 0 }} 
        />
        <div className="logo-text">
          <h2>NetMon UPNVJ</h2>
          <p>{userRole === 'admin' ? 'Network Operations Center' : 'Layanan Mahasiswa'}</p>
        </div>
      </div>

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      {/* MENU KHUSUS ADMIN */}
      {userRole === 'admin' && (
        <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 180px)' }}>
          <div className="nav-group-title">OVERVIEW</div>
          <a className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <span className="nav-label">Dashboard</span>
          </a>

          <div className="nav-group-title">MONITORING</div>
          <a className={`nav-item ${activePage === 'devices' ? 'active' : ''}`} onClick={() => setActivePage('devices')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            <span className="nav-label">Perangkat</span>
          </a>
          <a className={`nav-item ${activePage === 'access-point' ? 'active' : ''}`} onClick={() => setActivePage('access-point')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
            <span className="nav-label">Access Point</span>
          </a>
          <a className={`nav-item ${activePage === 'traffic' ? 'active' : ''}`} onClick={() => setActivePage('traffic')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span className="nav-label">Traffic</span>
          </a>
          <a className={`nav-item ${activePage === 'alert' ? 'active' : ''}`} onClick={() => setActivePage('alert')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="nav-label">Alert</span>
            {/* LOGIKA BUBBLE ALERT DINAMIS */}
            {alertCount > 0 && <span className="nav-badge" style={{ background: '#EF4444', color: 'white' }}>{alertCount}</span>}
          </a>

          <div className="nav-group-title">TICKETING</div>
          <a className={`nav-item ${activePage === 'daftar-laporan' ? 'active' : ''}`} onClick={() => setActivePage('daftar-laporan')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span className="nav-label">Laporan Masuk</span>
            {/* LOGIKA BUBBLE TIKET DINAMIS */}
            {ticketCount > 0 && <span className="nav-badge" style={{ background: '#2563EB', color: 'white' }}>{ticketCount}</span>}
          </a>

          <div className="nav-group-title">SYSTEM</div>
          <a className={`nav-item ${activePage === 'pengaturan' ? 'active' : ''}`} onClick={() => setActivePage('pengaturan')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span className="nav-label">Pengaturan</span>
          </a>
        </div>
      )}

      {/* MENU KHUSUS MAHASISWA */}
      {userRole === 'mahasiswa' && (
        <>
          <div className="nav-group-title">LAYANAN</div>
          <a className={`nav-item ${activePage === 'lapor' ? 'active' : ''}`} onClick={() => setActivePage('lapor')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <span className="nav-label">Buat Laporan</span>
          </a>
          
          <div className="nav-group-title">SYSTEM</div>
          <a className={`nav-item ${activePage === 'pengaturan' ? 'active' : ''}`} onClick={() => setActivePage('pengaturan')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span className="nav-label">Pengaturan Akun</span>
          </a>
        </>
      )}

      <div className="sidebar-footer">
        <div className="profile-card">
          <div className="avatar" style={{ boxShadow: '0 0 10px var(--primary-glow)' }}>{userRole === 'admin' ? 'AD' : 'SA'}</div>
          <div className="nav-label" style={{ overflow: 'hidden' }}>
            <div className="profile-name" style={{ fontSize: '13px', fontWeight: 600 }}>{userRole === 'admin' ? 'Admin NOC' : 'Shidqi Athalla'}</div>
            <div className="profile-role" style={{ fontSize: '10px' }}>{userRole === 'admin' ? 'Network Administrator' : 'Mahasiswa UPNVJ'}</div>
          </div>
        </div>
        
        <button onClick={onLogout} className="logout-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;