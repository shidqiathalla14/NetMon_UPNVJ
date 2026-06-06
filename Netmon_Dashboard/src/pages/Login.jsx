import React, { useState, useEffect } from 'react';

const Login = ({ onLogin, onBack, isDark }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const savedUsers = localStorage.getItem('netmon_users');
    if (!savedUsers) {
      const defaultUsers = [
        { username: 'admin@upnvj.ac.id', password: 'admin123', role: 'admin' },
        { username: 'mahasiswa', password: 'mhs123', role: 'mahasiswa' }
      ];
      localStorage.setItem('netmon_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const users = JSON.parse(localStorage.getItem('netmon_users')) || [];
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      localStorage.setItem('netmon_active_session', JSON.stringify(foundUser));
      onLogin(foundUser.role);
    } else {
      setErrorMsg('Username atau Password salah!');
    }
  };

  return (
    <div className={`app-container ${isDark ? 'dark' : 'light'}`} style={{ height: '100vh', width: '100vw', background: 'var(--bg-dark)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-primary)' }}>
      <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
          <img src="https://www.upnvj.ac.id/en/files/download/d8be74d9d9ca67272c943c8d5dd739b5" alt="Logo UPNVJ" style={{ width: '80px', height: '80px'}} />
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>NetMon UPNVJ</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Authentication System</p>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>Selamat Datang</h1>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', fontWeight: 'bold', border: '1px solid rgba(239,68,68,0.3)' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Username / NIM</label>
            <input 
              type="text" required placeholder="Masukkan username/email..."
              value={username} onChange={(e) => setUsername(e.target.value)} 
              style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Password</label>
            <input 
              type="password" required placeholder="Masukkan password..."
              value={password} onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} 
            />
          </div>
          <button 
            type="submit" 
            style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '10px', transition: 'background 0.2s' }}
          >
            Masuk 
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
           <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             Kembali ke Guest Dashboard
           </button>
        </div>
      </div>
    </div>
  );
};

export default Login;