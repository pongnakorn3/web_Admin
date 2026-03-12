import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LuCircleUser, LuSquareUser } from "react-icons/lu";
import { BsTerminal, BsBank2, BsReceipt, BsBoxArrowLeft } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Logic การ Logout แบบมี Modal ยืนยัน
  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleCancelLogout = () => setShowLogoutModal(false);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      navigate('/login');
    } catch (error) {
      console.error('ข้อผิดพลาดในการออกจากระบบ:', error);
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  // รวมไอคอนและเมนูให้เป็นระเบียบ (ใช้ตามเพื่อนแต่เปลี่ยนเป็น Icon สวยๆ ของคุณ)
  const menuItems = [
    { path: "/admin/verify", label: "การอนุมัติยืนยันตัวตน", icon: <LuSquareUser /> },
    { path: "/admin/members", label: "จัดการสมาชิก", icon: <BsTerminal /> },
    { path: "/admin/disputes", label: "จัดการข้อพิพาท", icon: <IoChatbubbleEllipsesOutline /> },
    { path: "/admin/slips", label: "ตรวจสอบสลิป", icon: <BsBank2 /> },
    { path: "/admin/withdraw", label: "คำร้องขอถอนเงิน", icon: <BsReceipt /> },
  ];

  return (
    <>
      <div className="sidebar" style={{ fontFamily: 'Sarabun, sans-serif' }}>
        <div className="profile-section">
          <div className="avatar">
            <LuCircleUser className="profile-icon" style={{ fontSize: '40px' }} />
          </div>
          <h2 className="admin-name">Admin</h2>
        </div>

        <nav className="menu-list" style={{ padding: '20px 0' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
              style={{ display: 'flex', alignItems: 'center', padding: '12px 25px', gap: '12px', textDecoration: 'none' }}
            >
              <span className="menu-icon" style={{ display: 'flex', fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '16px' }}>{item.label}</span>
            </NavLink>
          ))}

          <button
            className="menu-item logout-btn"
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              padding: '12px 25px',
              gap: '12px',
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            <BsBoxArrowLeft className="menu-icon" style={{ fontSize: '20px' }} />
            <span style={{ fontSize: '16px' }}>{isLoggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}</span>
          </button>
        </nav>
      </div>

      {/* Logout Modal - ของคุณ (เก็บไว้เพราะมันดี!) */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-box">
            <h3 className="logout-modal-title">แจ้งเตือน</h3>
            <p className="logout-modal-desc">คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?</p>
            <div className="logout-modal-actions">
              <button className="logout-modal-btn cancel" onClick={handleCancelLogout}>ยกเลิก</button>
              <button className="logout-modal-btn confirm" onClick={confirmLogout}>ยืนยัน</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;