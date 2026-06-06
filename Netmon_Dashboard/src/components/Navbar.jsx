import React, { useState, useEffect } from 'react';
import logoUPNVJ from '../assets/upnvj-logo.webp';

const Navbar = ({ activePage, setActivePage, isDark, toggleTheme, isGuest }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const n = new Date();
      const pad = v => String(v).padStart(2, '0');
      setTime(`${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())} | ${pad(n.getDate())}/${pad(n.getMonth() + 1)}/${n.getFullYear()}`);
    };
    const timerId = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(timerId);
  }, []);

  const pageNames = { 'dashboard': 'Dashboard', 'devices': 'Perangkat', 'access-point': 'Access Point', 'traffic': 'Traffic', 'alert': 'Alert System', 'daftar-laporan': 'Laporan Masuk', 'pengaturan': 'Pengaturan', 'lapor': 'Buat Laporan' };

  return (
    <div className="navbar">
      <style>
        {`
          .theme-switch-btn {
            width: 44px; height: 24px; border-radius: 99px; border: none; cursor: pointer; position: relative; transition: background 0.3s;
          }
          .theme-switch-btn::after {
            content: ''; position: absolute; width: 18px; height: 18px; background: #fff; border-radius: 50%; top: 3px; left: 3px; transition: transform 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .theme-switch-btn.dark-active { background: var(--primary); }
          .theme-switch-btn.dark-active::after { transform: translateX(20px); }
          .theme-switch-btn.light-active { background: var(--text-muted); }
          .theme-switch-btn.light-active::after { transform: translateX(0); }
        `}
      </style>

      <div className="breadcrumb">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        <span>NOC Dashboard</span><span>/</span>
        <span className="current" style={{ textTransform: 'capitalize' }}>{pageNames[activePage] || activePage}</span>
      </div>
      
      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span className="clock">{time}</span>
        <div className="theme-toggle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={!isDark ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="2" style={{ transition: 'stroke 0.3s' }}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <button className={`theme-switch-btn ${isDark ? 'dark-active' : 'light-active'}`} onClick={toggleTheme}></button>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="2" style={{ transition: 'stroke 0.3s' }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </div>
        
        {/* LOGIKA BARU: Kalo isGuest TRUE, lonceng gak bakal pernah dirender */}
        {!isGuest && activePage !== 'lapor' && (
          <button className="icon-btn" onClick={() => setActivePage('alert')} style={{ cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="notif-dot"></span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;