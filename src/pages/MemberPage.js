import axios from 'axios';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../configs/api';

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

  if (loading) return <div style={{ padding: '20px' }}>กำลังดึงข้อมูลสมาชิก...</div>;

  return (
    <div className="verify-container">
      <h1>จัดการสมาชิกทั้งหมด</h1>
      <div className="table-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th>ชื่อ-นามสกุล</th>
              <th>อีเมล</th>
              <th>สถานะ KYC</th>
              <th>บทบาท</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>{user.id}</td>
                <td><strong>{user.full_name}</strong></td>
                <td>{user.email}</td>
                <td>{user.kyc_status}</td>
                <td>{user.role}</td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>ไม่พบข้อมูลสมาชิก</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberPage;
