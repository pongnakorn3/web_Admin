import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import VerifyPage from './VerifyPage';
import DisputePage from './DisputePage';
import SlipVerificationPage from './SlipVerificationPage';
import WithdrawRequestPage from './WithdrawRequestPage';
import MemberPage from './MemberPage';

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <Sidebar />
      <div className="admin-content" style={{ flex: 1, padding: '40px' }}>
        <Routes>
          {/* Default หน้าแรกของ Admin ให้ไปที่ VerifyPage */}
          <Route path="/" element={<VerifyPage />} /> 
          <Route path="verify" element={<VerifyPage />} />
          <Route path="members" element={<MemberPage />} />
          <Route path="slips" element={<SlipVerificationPage />} />
          <Route path="withdraw" element={<WithdrawRequestPage />} />
          {/* ถ้ามีหน้าอื่นๆ เพิ่มเติม ใส่ Route ตรงนี้ได้เลย */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;