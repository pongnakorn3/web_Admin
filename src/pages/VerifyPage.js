import axios from 'axios';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../configs/api';

const VerifyPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${API_BASE_URL}/admin/kyc`;


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      // เรียกใช้ viewPendingKYC (GET /kyc/pending)
      const res = await axios.get(`${API_URL}/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // ใน Controller คุณส่ง success: true, pending_users: [...]
      if (res.data.success) {
        setPendingUsers(res.data.pending_users);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, decision) => {
    const confirmText = decision === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ';
    if (!window.confirm(`ยืนยันการ${confirmText}?`)) return;

    try {
      const token = localStorage.getItem('token');
      // เรียกใช้ approveRejectKYC (PUT /kyc/:id)
      const res = await axios.put(`${API_URL}/${id}`, 
        { status: decision }, // Controller รับ status จาก req.body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchData(); // รีโหลดตาราง
      }
    } catch (err) {
      alert("ดำเนินการไม่สำเร็จ: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังดึงข้อมูล...</div>;

  return (
    <div className="verify-container">
      <h1>การอนุมัติยืนยันตัวตน</h1>
      <div className="table-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ padding: '12px' }}>รูปบัตรประชาชน</th>
              <th>ชื่อ-นามสกุล</th>
              <th>เลขบัตร</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length > 0 ? pendingUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>
                  <img 
                    src={user.id_card_image} 
                    alt="ID Card" 
                    style={{ width: '100px', height: '60px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #ddd' }}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/100x60?text=No+Image'}
                  />
                </td>
                <td><strong>{user.full_name}</strong><br/><small>{user.email}</small></td>
                <td>{user.id_card_number}</td>
                <td>
                  <button 
                    onClick={() => handleDecision(user.id, 'approved')}
                    style={{ background: '#199474', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' }}
                  >
                    อนุมัติ
                  </button>
                  <button 
                    onClick={() => handleDecision(user.id, 'rejected')}
                    style={{ background: '#CA3A3A', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    ปฏิเสธ
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>ไม่มีผู้ใช้งานที่รอการตรวจสอบ (Pending)</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerifyPage;