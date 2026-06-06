import React, { useState, useEffect } from 'react';
import Guest from './pages/Guest';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import LaporGangguan from './pages/LaporGangguan';
import DaftarLaporan from './pages/DaftarLaporan';
import ExtraPages from './pages/ExtraPages';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false); 
  const [showLoginPage, setShowLoginPage] = useState(false);

  // STATE BARU: Buat ngatur dynamic bubble
  const [alertCount, setAlertCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);

  // EFFECT BARU: Radar buat ngitung bubble tiap detik
  useEffect(() => {
    const updateCounts = () => {
      // Itung alert yang statusnya unread
      const alerts = JSON.parse(localStorage.getItem('netmon_alerts')) || [];
      setAlertCount(alerts.filter(a => a.status === 'unread').length);

      // Itung tiket yang statusnya BUKAN selesai
      const tickets = JSON.parse(localStorage.getItem('netmon_tickets')) || [];
      setTicketCount(tickets.filter(t => t.status !== 'selesai').length);
    };

    updateCounts(); // Panggil pertama kali
    const interval = setInterval(updateCounts, 1000); // Terus ulangi tiap 1 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isDark) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [isDark]);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setShowLoginPage(false); 
    setActivePage(role === 'admin' ? 'dashboard' : 'lapor');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const toggleTheme = () => setIsDark(!isDark);

  if (!isLoggedIn && showLoginPage) {
    return <Login onLogin={handleLogin} onBack={() => setShowLoginPage(false)} isDark={isDark} />;
  }

  if (!isLoggedIn && !showLoginPage) {
    return <Guest onNavigateLogin={() => setShowLoginPage(true)} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  return (
    <div className={`app-container ${isDark ? 'dark' : 'light'}`} style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        activePage={activePage} 
        setActivePage={setActivePage} 
        userRole={userRole}
        onLogout={handleLogout}
        // OPER DATA BUBBLE KE SIDEBAR
        alertCount={alertCount}
        ticketCount={ticketCount}
      />
      
      <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar activePage={activePage} setActivePage={setActivePage} isDark={isDark} toggleTheme={toggleTheme} />
        
        <div className="content">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'devices' && <Devices />}
          {activePage === 'daftar-laporan' && <DaftarLaporan />}
          {activePage === 'lapor' && <LaporGangguan />}
          
          {['access-point', 'traffic', 'alert', 'pengaturan'].includes(activePage) && (
            <ExtraPages type={activePage} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;