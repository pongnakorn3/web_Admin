import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DisputePage from './DisputePage';
import MemberPage from './MemberPage';
import SlipVerificationPage from './SlipVerificationPage';
import VerifyPage from './VerifyPage';
import WithdrawRequestPage from './WithdrawRequestPage';

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
          <Route path="disputes" element={<DisputePage />} />

        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;