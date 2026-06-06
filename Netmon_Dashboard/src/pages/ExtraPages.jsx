import React from 'react';
import AccessPoint from './AccessPoint';
import Traffic from './Traffic';
import SystemAlert from '../components/SystemAlert';
import Pengaturan from './Pengaturan';

const ExtraPages = ({ type }) => {
  if (type === 'access-point') return <AccessPoint />;
  if (type === 'traffic') return <Traffic />;
  if (type === 'alert') return <SystemAlert />;
  if (type === 'pengaturan') return <Pengaturan />;
  
  return null;
};

export default ExtraPages;