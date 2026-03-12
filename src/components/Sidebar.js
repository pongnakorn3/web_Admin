import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      navigate('/login');
    } catch (error) {
      console.error('ข้อผิดพลาดในการออกจากระบบ:', error);
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { 
      path: "/admin/verify", 
      label: "การอนุมัติยืนยันตัวตน", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
      )
    },
    { 
      path: "/admin/members", 
      label: "จัดการสมาชิก", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      )
    },
    { 
      path: "/admin/disputes", 
      label: "จัดการข้อพิพาท", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      )
    },
    { 
      path: "/admin/slips", 
      label: "ตรวจสอบสลิป", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
      )
    },
    { 
      path: "/admin/withdraw", 
      label: "คำร้องขอถอนเงิน", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      )
    },
  ];

  return (
    <div className="sidebar" style={{ fontFamily: 'Sarabun, sans-serif' }}>
      <div className="profile-section">
        <div className="avatar-container" style={{ marginBottom: '15px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            backgroundColor: '#fff', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            margin: '0 auto',
            fontSize: '30px',
            color: '#344154',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>👤</div>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>Admin</h2>
      </div>
      
      <nav className="menu-list" style={{ padding: '20px 0' }}>
        {menuItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path} 
            className={({isActive}) => isActive ? "menu-item active" : "menu-item"}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px 25px',
              gap: '12px'
            }}
          >
            <span className="menu-icon" style={{ display: 'flex' }}>{item.icon}</span>
            <span style={{ fontSize: '16px' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '20px' }}>
        <button 
          className="logout-btn-custom" 
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
            background: 'transparent',
            border: 'none',
            color: '#adb5bd',
            padding: '12px 15px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'white'}
          onMouseOut={(e) => e.currentTarget.style.color = '#adb5bd'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {isLoggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
