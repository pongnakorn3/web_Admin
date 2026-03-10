import axios from 'axios';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../configs/api';

const SlipVerificationPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = `${API_BASE_URL}/payments`; 


  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      // ดึงรายการที่ status = 'waiting_admin_verify'
      // ** อย่าลืมสร้าง Route GET ใน Backend สำหรับดึงเฉพาะสถานะนี้ด้วยนะครับ **
      const res = await axios.get(`${API_URL}/admin/pending-verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, isApprove) => {
    const action = isApprove ? "อนุมัติ" : "ปฏิเสธ";
    if (!window.confirm(`ยืนยันการ ${action} รายการจองนี้?`)) return;

    try {
      const token = localStorage.getItem('token');
      // เรียกใช้ adminVerifyPayment: router.put('/:id/admin-verify', ...)
      const res = await axios.put(`${API_URL}/${id}/admin-verify`, 
        { approve: isApprove }, // ส่งค่าเป็น boolean ตาม Controller
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      fetchPendingBookings(); // รีโหลดข้อมูล
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูลสลิป...</div>;

  return (
    <div className="admin-page">
      <h1>ตรวจสอบสลิปการชำระเงิน</h1>
      <div className="table-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ padding: '12px' }}>หลักฐาน (Slip)</th>
              <th>Booking ID</th>
              <th>สถานะปัจจุบัน</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? bookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>
                  <a href={`https://finalrental.onrender.com/${b.slip_image}`} target="_blank" rel="noreferrer">
                    <img 
                      src={`https://finalrental.onrender.com/${b.slip_image}`} 
                      alt="Payment Slip" 
                      style={{ width: '100px', height: 'auto', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                  </a>
                </td>
                <td><strong>#{b.id}</strong></td>
                <td>
                   <span style={{ color: '#f39c12', fontWeight: 'bold' }}>{b.status}</span>
                </td>
                <td>
                  <button 
                    onClick={() => handleVerify(b.id, true)}
                    style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' }}
                  >
                    อนุมัติ (Paid)
                  </button>
                  <button 
                    onClick={() => handleVerify(b.id, false)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    ปฏิเสธ
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>ไม่มีรายการรอตรวจสอบสลิป</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SlipVerificationPage;