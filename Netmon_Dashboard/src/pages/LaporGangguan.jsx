import React, { useState, useEffect } from 'react';

const LaporGangguan = () => {
  const [activeTab, setActiveTab] = useState('lapor');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [riwayat, setRiwayat] = useState([]);
  
  const [formData, setFormData] = useState({
    lokasi: '', lantai: '', kategori: '', deskripsi: ''
  });
  const [fileName, setFileName] = useState('Tidak ada file yang dipilih');
  
  // STATE BARU: Buat nyimpen data asli fotonya (Base64)
  const [fileBase64, setFileBase64] = useState(null);

  useEffect(() => {
    if (activeTab === 'riwayat') {
      const saved = JSON.parse(localStorage.getItem('netmon_tickets')) || [];
      const myTickets = saved.filter(t => t.nama === 'Shidqi Athalla');
      setRiwayat(myTickets);
    }
  }, [activeTab]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATE: Convert gambar ke Base64 biar bisa disimpen di Local Storage
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result); // Simpen hasil convert-nya
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('Tidak ada file yang dipilih');
      setFileBase64(null);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({ lokasi: '', lantai: '', kategori: '', deskripsi: '' });
    setFileName('Tidak ada file yang dipilih');
    setFileBase64(null); // Reset fotonya juga
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const newTicket = {
        id: `TKT-${Math.floor(Math.random() * 900) + 100}`,
        nama: 'Shidqi Athalla',
        role: 'Mahasiswa',
        lokasi: `${formData.lokasi} - ${formData.lantai}`,
        masalah: formData.kategori,
        deskripsi: formData.deskripsi,
        status: 'pending',
        waktu: new Date().toLocaleString('id-ID'),
        catatan: '',
        foto: fileBase64 // Masukin data Base64 fotonya ke sini
      };

      const existingTickets = JSON.parse(localStorage.getItem('netmon_tickets')) || [];
      localStorage.setItem('netmon_tickets', JSON.stringify([newTicket, ...existingTickets]));

      setLoading(false);
      setIsSubmitted(true);
      setFileBase64(null); // Kosongin memori pas udah kekirim
    }, 1000);
  };

  const DropdownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  if (isSubmitted) {
    return (
      <div className="page active" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2 className="page-title" style={{ color: 'var(--green)' }}>Laporan Berhasil Terkirim!</h2>
        <p className="page-sub">Terima kasih. Tim NOC UPNVJ akan segera mengecek laporan kamu.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
          <button onClick={() => { setIsSubmitted(false); handleReset({preventDefault:()=>{}}); }} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}>Buat Laporan Baru</button>
          <button onClick={() => { setIsSubmitted(false); setActiveTab('riwayat'); }} style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cek Status Laporan</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page active">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('lapor')}
          style={{ padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === 'lapor' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'lapor' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
        >Formulir Pelaporan</button>
        <button 
          onClick={() => setActiveTab('riwayat')}
          style={{ padding: '10px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === 'riwayat' ? '3px solid var(--primary)' : '3px solid transparent', color: activeTab === 'riwayat' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
        >Riwayat & Notifikasi</button>
      </div>

      {activeTab === 'lapor' && (
        <div style={{ maxWidth: '900px' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '14px 20px', borderRadius: '10px 10px 0 0', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '14px' }}>
            Laporkan Kendala Anda
          </div>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Nama Lengkap</label>
                <input type="text" value="Shidqi Athalla" readOnly style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-muted)', outline: 'none', cursor: 'not-allowed' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Lokasi Gedung</label>
                <div style={{ position: 'relative' }}>
                  <select name="lokasi" value={formData.lokasi} onChange={handleChange} required style={{ width: '100%', padding: '12px 36px 12px 14px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}>
                    <option value="">Pilih Gedung...</option><option value="Rektorat">Rektorat</option><option value="FISIP">FISIP</option><option value="FEB">FEB</option><option value="FIK">FIK</option>
                  </select>
                  <DropdownIcon />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Lantai</label>
                <div style={{ position: 'relative' }}>
                  <select name="lantai" value={formData.lantai} onChange={handleChange} required style={{ width: '100%', padding: '12px 36px 12px 14px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}>
                    <option value="">Pilih Lantai...</option><option value="Lantai 1">Lantai 1</option><option value="Lantai 2">Lantai 2</option><option value="Lantai 3">Lantai 3</option>
                  </select>
                  <DropdownIcon />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Kategori Gangguan</label>
                <div style={{ position: 'relative' }}>
                  <select name="kategori" value={formData.kategori} onChange={handleChange} required style={{ width: '100%', padding: '12px 36px 12px 14px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', appearance: 'none' }}>
                    <option value="">Pilih Kategori...</option><option value="Koneksi Terputus">Koneksi Terputus</option><option value="Sinyal Lemah">Sinyal Lemah</option><option value="Perangkat Rusak">Perangkat Rusak</option>
                  </select>
                  <DropdownIcon />
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Deskripsi Tambahan</label>
              <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3" required style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ marginBottom: '30px', background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Lampiran Foto/Screenshot (Opsional)
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                <label style={{ background: 'var(--bg-card)', padding: '10px 16px', borderRight: '1px solid var(--border)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  Pilih File
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
                <div style={{ padding: '10px 16px', fontSize: '13px', color: fileName === 'Tidak ada file yang dipilih' ? 'var(--text-muted)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {fileName}
                </div>
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>*Upload foto indikator router mati, pesan error, atau letak kabel yang putus.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <button type="button" onClick={handleReset} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Reset Form</button>
              <button type="submit" disabled={loading} style={{ padding: '10px 24px', background: loading ? '#555' : 'var(--primary)', border: 'none', color: 'white', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                {loading ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div style={{ maxWidth: '900px' }}>
          {riwayat.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-secondary)' }}>
              Belum ada laporan yang kamu buat.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {riwayat.map((tiket) => (
                <div key={tiket.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--primary-light)' }}>{tiket.id}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{tiket.waktu}</div>
                    </div>
                    <span className={`badge ${tiket.status === 'selesai' ? 'online' : tiket.status === 'proses' ? 'info' : 'warning'}`}>
                      {tiket.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '8px' }}><strong>Masalah:</strong> {tiket.masalah} di {tiket.lokasi}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '16px' }}><strong>Detail:</strong> {tiket.deskripsi}</div>
                  
                  <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>Tanggapan Admin NOC:</div>
                    <div style={{ fontSize: '12px', color: tiket.catatan ? 'var(--text-primary)' : 'var(--text-secondary)', fontStyle: tiket.catatan ? 'normal' : 'italic' }}>
                      {tiket.catatan ? tiket.catatan : 'Belum ada tanggapan, laporan masih dalam antrean.'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LaporGangguan;