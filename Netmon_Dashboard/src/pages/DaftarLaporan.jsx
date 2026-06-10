import React, { useState, useEffect } from 'react';

const DaftarLaporan = () => {
  const [tiket, setTiket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ isOpen: false, data: null });
  const [statusUpdate, setStatusUpdate] = useState('');
  const [catatanUpdate, setCatatanUpdate] = useState('');
  
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // FETCH DATA DARI MYSQL
  useEffect(() => {
    fetch('http://localhost:5000/api/laporan')
      .then(res => res.json())
      .then(data => {
        setTiket(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal narik data", err);
        setLoading(false);
      });
  }, []);

  const openActionModal = (t) => {
    setActionModal({ isOpen: true, data: t });
    setStatusUpdate(t.status === 'terbuka' ? 'proses' : 'selesai'); // Default dari DB
    setCatatanUpdate(t.catatan || '');
  };

  // UPDATE DATA KE MYSQL (PUT REQUEST)
  const saveAction = async (e) => {
    e.preventDefault();
    
    try {
      await fetch(`http://localhost:5000/api/laporan/${actionModal.data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusUpdate, catatan: catatanUpdate })
      });

      // Update UI lokal biar ga perlu refresh web
      const updatedTiket = tiket.map(t => {
        if (t.id === actionModal.data.id) {
          return { ...t, status: statusUpdate, catatan: catatanUpdate };
        }
        return t;
      });
      setTiket(updatedTiket);
      setActionModal({ isOpen: false, data: null });

    } catch (err) {
      alert("Gagal update status tiket!");
    }
  };

  if (loading) {
    return (
      <div className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Menarik data tiket dari server...</div>
      </div>
    );
  }

  return (
    <div className="page active" style={{ position: 'relative' }}>
      <div className="page-title">Tiket Laporan Masuk</div>
      <div className="page-sub">Kelola laporan gangguan dari pengguna jaringan.</div>

      <div className="panel" style={{ marginTop: '20px' }}>
        <div className="table-wrap">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 10px', fontSize: '11px' }}>ID & PELAPOR</th>
                <th style={{ padding: '12px 10px', fontSize: '11px' }}>DETAIL MASALAH & LOKASI</th>
                <th style={{ padding: '12px 10px', fontSize: '11px' }}>CATATAN TEKNISI</th>
                <th style={{ padding: '12px 10px', fontSize: '11px' }}>BUKTI</th>
                <th style={{ padding: '12px 10px', fontSize: '11px' }}>STATUS</th>
                <th style={{ padding: '12px 10px', fontSize: '11px', textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {tiket.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Belum ada laporan masuk dari MySQL.</td>
                </tr>
              ) : (
                tiket.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ color: 'var(--primary-light)', fontSize: '12px', fontWeight: 'bold' }}>TKT-{t.id}</div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{t.nama_pelapor}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>NIM: {t.nim_nip}</div>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{t.kategori}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t.lokasi}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-primary)', maxWidth: '250px' }}>
                        {t.deskripsi ? `"${t.deskripsi}"` : '-'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px', maxWidth: '200px' }}>
                      <div style={{ fontSize: '11px', color: t.catatan ? 'var(--yellow)' : 'var(--text-muted)', fontStyle: t.catatan ? 'normal' : 'italic' }}>
                        {t.catatan ? `"${t.catatan}"` : 'Belum ada tindakan.'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      {t.foto ? (
                        <span onClick={() => setSelectedPhoto(t.foto)} style={{ fontSize: '12px', color: 'var(--blue)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}>Lihat Foto</span>
                      ) : ( <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>-</span> )}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={`badge ${t.status === 'selesai' ? 'online' : t.status === 'proses' ? 'info' : 'warning'}`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button 
                        onClick={() => openActionModal(t)} disabled={t.status === 'selesai'}
                        style={{ fontSize: '11px', padding: '8px 14px', borderRadius: '6px', border: 'none', background: t.status === 'selesai' ? 'var(--bg-dark)' : 'var(--primary)', color: t.status === 'selesai' ? 'var(--text-muted)' : 'white', cursor: t.status === 'selesai' ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
                      >
                        {t.status === 'selesai' ? 'Tuntas' : 'Tindak Lanjuti'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tindak Lanjut */}
      {actionModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '450px', border: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Tindak Lanjuti Tiket: <span style={{color:'var(--primary-light)'}}>TKT-{actionModal.data.id}</span></h3>
            <form onSubmit={saveAction}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Ubah Status Laporan</label>
                <select value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', outline: 'none' }}>
                  <option value="terbuka">TERBUKA (Menunggu)</option>
                  <option value="proses">PROSES (Sedang Diperbaiki)</option>
                  <option value="selesai">SELESAI (Masalah Tuntas)</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Catatan Untuk Pelapor</label>
                <textarea rows="3" value={catatanUpdate} onChange={e => setCatatanUpdate(e.target.value)} placeholder="Misal: Router sedang di-restart oleh teknisi..." style={{ width: '100%', padding: '10px', background: 'var(--bg-dark)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', outline: 'none', resize: 'vertical' }}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setActionModal({isOpen:false, data:null})} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ padding: '10px 16px', background: 'var(--primary)', border: 'none', color: 'white', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Simpan & Kirim Notifikasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pop up Foto dari Pelapor */}
      {selectedPhoto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }} onClick={() => setSelectedPhoto(null)}>
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto} alt="Bukti Laporan" style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: '12px' }} />
            <button onClick={() => setSelectedPhoto(null)} style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'var(--red)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarLaporan;