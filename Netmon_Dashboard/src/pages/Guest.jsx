import React, { useState } from 'react';
import Dashboard from './Dashboard';
import ExtraPages from './ExtraPages';
import Navbar from '../components/Navbar';

const Guest = ({ onNavigateLogin, isDark, toggleTheme }) => {
  const [activeGuestPage, setActiveGuestPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={`app-container ${isDark ? 'dark' : 'light'}`} style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
       
       <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} style={{ width: isSidebarCollapsed ? '70px' : '280px', display: 'flex', flexDirection: 'column', background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)', zIndex: 100, flexShrink: 0, transition: 'width 0.3s ease', position: 'relative' }}>
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{ position: 'absolute', right: '-13px', top: '78px', width: '26px', height: '26px', background: 'var(--primary)', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'transform 0.3s', zIndex: 101, transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div className="sidebar-logo" style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)', minHeight: '70px', overflow: 'hidden' }}>
            <img src="https://www.upnvj.ac.id/en/files/download/d8be74d9d9ca67272c943c8d5dd739b5" alt="Logo UPNVJ" style={{ width: '38px', height: '38px', objectFit: 'contain', flexShrink: 0 }} />
            {!isSidebarCollapsed && (
              <div className="logo-text" style={{ whiteSpace: 'nowrap' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>NetMon UPNVJ</h2>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>Public Network Status</p>
              </div>
            )}
          </div>

          <div style={{ padding: '10px 0', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
             {!isSidebarCollapsed && <div className="nav-group-title" style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', padding: '20px 20px 6px' }}>PUBLIC ACCESS</div>}
             
             <a className={`nav-item ${activeGuestPage === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveGuestPage('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', margin: '2px 10px', borderRadius: '8px', cursor: 'pointer', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
               {!isSidebarCollapsed && <span className="nav-label" style={{ fontSize: '13.5px', fontWeight: 500, whiteSpace: 'nowrap' }}>Dashboard (Live)</span>}
             </a>
             <a className={`nav-item ${activeGuestPage === 'traffic' ? 'active' : ''}`} onClick={() => setActiveGuestPage('traffic')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', margin: '2px 10px', borderRadius: '8px', cursor: 'pointer', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
               {!isSidebarCollapsed && <span className="nav-label" style={{ fontSize: '13.5px', fontWeight: 500, whiteSpace: 'nowrap' }}>Traffic Monitoring</span>}
             </a>
             
             {!isSidebarCollapsed && (
               <div style={{ padding: '16px 20px', marginTop: '10px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    <strong>Akses Tamu (Guest View)</strong><br/><br/>
                    Menampilkan pantauan status jaringan UPNVJ secara transparan.
                  </div>
               </div>
             )}
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
             <button 
                onClick={onNavigateLogin}
                style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
             >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                {!isSidebarCollapsed && <span>Login Sistem</span>}
             </button>
          </div>
       </div>

       <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
         {/* PROP ISGUEST DI SINI BIAR LONCENG ILANG */}
         <Navbar isGuest={true} activePage={activeGuestPage} isDark={isDark} toggleTheme={toggleTheme} />
         
         <div className="content">
           {activeGuestPage === 'dashboard' && <Dashboard />}
           {activeGuestPage === 'traffic' && <ExtraPages type="traffic" />}
         </div>
       </div>
    </div>
  );
};

export default Guest;