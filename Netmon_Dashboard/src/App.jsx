import React, { useState, useEffect } from 'react';
import Guest from './pages/Guest';
import Login from './pages/Login';
import Dashboard from './pages/DashboardDesktop';
import Devices from './pages/Devices';
import LaporGangguan from './pages/LaporGangguan';
import DaftarLaporan from './pages/DaftarLaporan';
import ExtraPages from './pages/ExtraPages';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
  // ========================================================
  // REVISI: INHERIT STATE LOGIN DARI LOCALSTORAGE (ANTI KEDIP)
  // ========================================================
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem('active_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const timeNow = new Date().getTime();
      // Jika waktu sekarang belum melewati batas kedaluwarsa sesi
      if (timeNow < userData.expireTime) {
        return true;
      } else {
        localStorage.removeItem('active_user'); // Sesi habis, hapus data
      }
    }
    return false;
  });

  const [userRole, setUserRole] = useState(() => {
    const savedUser = localStorage.getItem('active_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const timeNow = new Date().getTime();
      if (timeNow < userData.expireTime) {
        return userData.role;
      }
    }
    return null;
  });

  const [activePage, setActivePage] = useState(() => {
    const savedUser = localStorage.getItem('active_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const timeNow = new Date().getTime();
      if (timeNow < userData.expireTime) {
        return userData.role === 'admin' ? 'dashboard' : 'lapor';
      }
    }
    return 'dashboard';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false); 
  const [showLoginPage, setShowLoginPage] = useState(false);

  // STATE BARU: Buat ngatur dynamic bubble
  const [alertCount, setAlertCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);

  // ========================================================
  // EFFECT BARU: SENSOR INTERAKSI UNTUK RESET SESI 10 MENIT
  // ========================================================
  useEffect(() => {
    if (!isLoggedIn) return;

    const resetSesi = () => {
      const savedUser = localStorage.getItem('active_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        // Perpanjang masa aktif sesi: Waktu Sekarang + 10 Menit
        userData.expireTime = new Date().getTime() + 10 * 60 * 1000;
        localStorage.setItem('active_user', JSON.stringify(userData));
      }
    };

    // Pasang sensor aktivitas pengguna pada window browser
    window.addEventListener('click', resetSesi);
    window.addEventListener('keypress', resetSesi);
    window.addEventListener('scroll', resetSesi);
    window.addEventListener('mousemove', resetSesi);

    // Detektor otomatis setiap 5 detik untuk cek apakah sesi sudah kedaluwarsa di latar belakang
    const autoLogoutCheck = setInterval(() => {
      const savedUser = localStorage.getItem('active_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (new Date().getTime() > userData.expireTime) {
          handleLogout();
          alert("Sesi Anda telah habis karena tidak ada aktivitas selama 10 menit.");
        }
      }
    }, 5000);

    // Bersihkan listener dan interval saat komponen dilepas
    return () => {
      window.removeEventListener('click', resetSesi);
      window.removeEventListener('keypress', resetSesi);
      window.removeEventListener('scroll', resetSesi);
      window.removeEventListener('mousemove', resetSesi);
      clearInterval(autoLogoutCheck);
    };
  }, [isLoggedIn]);

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
    // Set stempel kedaluwarsa di local storage saat tombol login ditekan (Waktu sekarang + 10 menit)
    const expireTime = new Date().getTime() + 10 * 60 * 1000;
    const loginData = {
      role: role,
      expireTime: expireTime
    };
    localStorage.setItem('active_user', JSON.stringify(loginData));

    setUserRole(role);
    setIsLoggedIn(true);
    setShowLoginPage(false); 
    setActivePage(role === 'admin' ? 'dashboard' : 'lapor');
  };

  const handleLogout = () => {
    localStorage.removeItem('active_user'); // Hapus jejak login dari brankas browser
    setIsLoggedIn(false);
    setUserRole(null);
    setShowLoginPage(false);
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