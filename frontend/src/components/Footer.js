import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center' }}>
      &copy; {new Date().getFullYear()} JDSfr - Projet Efrei
    </AntFooter>
  );
}

export default Footer;
