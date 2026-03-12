import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsChevronRight } from "react-icons/bs"; 
import API_BASE_URL from '../configs/api';
import './MemberPage.css'; 

const MemberPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${API_BASE_URL}/admin/users`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">กำลังดึงข้อมูลสมาชิก...</div>;

  return (
    <div className="member-page-container">
      
      <div className="search-section">
        <input 
          type="text" 
          placeholder="ค้นหาชื่อผู้ใช้" 
          className="search-input"
        />
        <button className="search-btn">ค้นหา</button>
      </div>

      <div className="table-card">
        <table className="member-table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>หมายเหตุ (สถานะ)</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info-cell">
                    <div className="user-avatar-placeholder"></div>
                    <span>{user.full_name}</span>
                  </div>
                </td>
                <td>
                  <span className="email-text">{user.email}</span>
                </td>
                <td className="note-text">
                  {user.kyc_status} ({user.role})
                </td>
                <td>
                  <button className="suspend-btn">
                    ถูกระงับ <BsChevronRight className="chevron-icon" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="empty-state">ไม่พบข้อมูลสมาชิก</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberPage;