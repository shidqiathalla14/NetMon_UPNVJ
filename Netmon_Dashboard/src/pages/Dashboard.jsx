import React from 'react';
import useIsMobile from '../hooks/useIsMobile'; 
import DashboardDesktop from './DashboardDesktop';
import DashboardMobile from './DashboardMobile';

const Dashboard = () => {
  // Panggil sensor layar
  const isMobile = useIsMobile();

  // Kalau isMobile itu true (Layar HP), render versi Mobile
  // Kalau isMobile itu false (Layar Gede), render versi Desktop
  return isMobile ? <DashboardMobile /> : <DashboardDesktop />;
};

export default Dashboard;