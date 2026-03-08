import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // ลบ token จาก localStorage
      localStorage.removeItem('token');
      // เคลียร์ข้อมูลอื่น ๆ ถ้ามี
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      // redirect ไปที่หน้า login
      navigate('/login');
    } catch (error) {
      console.error('ข้อผิดพลาดในการออกจากระบบ:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="profile-section">
        <div className="avatar">👤</div>
        <h2>Admin</h2>
      </div>
      
      <nav className="menu-list">
        <NavLink to="/admin/verify" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          การอนุมัติยืนยันตัวตน
        </NavLink>
        <NavLink to="/admin/members" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          จัดการสมาชิก
        </NavLink>
        <NavLink to="/admin/disputes" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          จัดการข้อพิพาท
        </NavLink>
        <NavLink to="/admin/slips" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          ตรวจสอบสลิป
        </NavLink>
        <NavLink to="/admin/withdraw" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          คำร้องขอถอนเงิน
        </NavLink>
      </nav>
      
      <button 
        className="logout-btn" 
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? '⏳ กำลังออกจากระบบ...' : '🚪 ออกจากระบบ'}
      </button>
    </div>
  );
};

export default Sidebar;