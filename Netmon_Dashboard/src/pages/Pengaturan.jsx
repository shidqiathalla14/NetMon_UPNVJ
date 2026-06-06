import React, { useState, useEffect } from 'react';

const Pengaturan = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('mahasiswa');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Tarik data session yang lagi aktif
    const activeSession = JSON.parse(localStorage.getItem('netmon_active_session'));
    if (activeSession) {
      setUserEmail(activeSession.username || '');
      setUserPassword(activeSession.password || '');
      setUserRole(activeSession.role || 'mahasiswa');
      setUserName(activeSession.role === 'admin' ? 'Admin NOC' : 'Shidqi Athalla');
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Logika simpan perubahan ke database (localStorage)
    const activeSession = JSON.parse(localStorage.getItem('netmon_active_session'));
    
    // Update data session di browser
    localStorage.setItem('netmon_active_session', JSON.stringify({ 
      ...activeSession, 
      username: userEmail, 
      password: userPassword 
    }));

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="page active">
      <div className="page-title">Pengaturan Akun</div>
      <div className="page-sub">Kelola kredensial dan preferensi akun {userRole === 'admin' ? 'NOC' : 'mahasiswa'} kamu.</div>
      
      <div className="panel" style={{ maxWidth: '500px', marginTop: '20px' }}>
         <div style={{ marginBottom: '15px' }}>
           <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '5px' }}>Nama Tampilan</label>
           <input type="text" value={userName} disabled style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '6px', outline: 'none', cursor: 'not-allowed' }} />
         </div>
         
         <div style={{ marginBottom: '15px' }}>
           <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '5px' }}>Username Login</label>
           <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none' }} />
         </div>
         
         <div style={{ marginBottom: '15px' }}>
           <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '5px' }}>Password</label>
           <div style={{ position: 'relative' }}>
             <input 
               type={showPassword ? "text" : "password"} 
               value={userPassword} 
               onChange={(e) => setUserPassword(e.target.value)} 
               placeholder="Ganti password..." 
               style={{ width: '100%', padding: '10px 40px 10px 10px', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none' }} 
             />
             <button 
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
             >
               {/* Icon mata buat show/hide password */}
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
             </button>
           </div>
         </div>

         <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '25px' }}>
           <button 
             onClick={handleSave} disabled={isSaving}
             style={{ padding: '10px 20px', background: isSaving ? '#555' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
           >
             {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
           </button>
           <div style={{ color: 'var(--green)', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', opacity: saveSuccess ? 1 : 0, transition: 'all 0.3s ease' }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
             Berhasil disimpan!
           </div>
         </div>
      </div>
    </div>
  );
};

export default Pengaturan;