import { useState, useEffect } from 'react';

export default function useIsMobile() {
  // Cek apakah lebar layar di bawah 768px (ukuran standar Tablet/HP)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Pasang kuping buat dengerin kalau ukuran browser diubah
    window.addEventListener('resize', handleResize);
    
    // Bersihin memori pas komponen ditutup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}