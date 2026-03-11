import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LuCircleUser, LuSquareUser } from "react-icons/lu";
import { BsTerminal, BsBank2, BsReceipt, BsBoxArrowLeft } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import './Sidebar.css';

const Sidebar = () => {

  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <>
      <div className="sidebar">

        <div className="profile-section">
          <div className="avatar">
            <LuCircleUser className="profile-icon" />
          </div>
          <h2 className="admin-name">Admin</h2>
        </div>

        <nav className="menu-list">

          <NavLink
            to="/admin/verify"
            className={({isActive}) => isActive ? "menu-item active" : "menu-item"}
          >
            <LuSquareUser className="menu-icon" />
            <span>การอนุมัติยืนยันตัวตน</span>
          </NavLink>

          <NavLink
            to="/admin/members"
            className={({isActive}) => isActive ? "menu-item active" : "menu-item"}
          >
            <BsTerminal className="menu-icon" />
            <span>จัดการสมาชิก</span>
          </NavLink>

          <NavLink
            to="/admin/disputes"
            className={({isActive}) => isActive ? "menu-item active" : "menu-item"}
          >
            <IoChatbubbleEllipsesOutline className="menu-icon" />
            <span>จัดการข้อพิพาท</span>
          </NavLink>

          <NavLink
            to="/admin/slips"
            className={({isActive}) => isActive ? "menu-item active" : "menu-item"}
          >
            <BsBank2 className="menu-icon" />
            <span>ตรวจสอบสลิป</span>
          </NavLink>

          <NavLink
            to="/admin/withdraw"
            className={({isActive}) => isActive ? "menu-item active" : "menu-item"}
          >
            <BsReceipt className="menu-icon" />
            <span>คำร้องขอถอนเงิน</span>
          </NavLink>

          <button
            className="menu-item logout-btn"
            onClick={handleLogoutClick}
          >
            <BsBoxArrowLeft className="menu-icon" />
            <span>ออกจากระบบ</span>
          </button>

        </nav>
      </div>

      {showLogoutModal && (
        <div className="logout-modal-overlay">

          <div className="logout-modal-box">

            <h3 className="logout-modal-title">
              แจ้งเตือน
            </h3>

            <p className="logout-modal-desc">
              คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?
            </p>

            <div className="logout-modal-actions">

              <button
                className="logout-modal-btn cancel"
                onClick={handleCancelLogout}
              >
                ยกเลิก
              </button>

              <button
                className="logout-modal-btn confirm"
                onClick={confirmLogout}
              >
                ยืนยัน
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};


export default Sidebar;