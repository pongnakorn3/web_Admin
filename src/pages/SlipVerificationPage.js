import axios from 'axios';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../configs/api';
import './SlipVerificationPage.css'; // อย่าลืมนำเข้า CSS นะครับ

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
      const res = await axios.get(`${API_URL}/admin/pending-verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success && Array.isArray(res.data.data)) {
        setBookings(res.data.data);
      } else if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("ไม่สามารถดึงข้อมูลได้: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, isApprove) => {
    const action = isApprove ? "อนุมัติ" : "ปฏิเสธ";
    if (!window.confirm(`ยืนยันการ ${action} รายการจองนี้?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/${id}/admin-verify`, 
        { approve: isApprove },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      fetchPendingBookings(); // รีโหลดข้อมูล
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading-state">กำลังโหลดข้อมูลสลิป...</div>;

  return (
    <div className="slip-page-container">
      <div className="main-content-card">
        <h2 className="page-title">ตรวจสอบสลิป</h2>
        <p className="item-count">รายการตรวจสอบ: <strong>{bookings.length} รายการ</strong></p>

        <div className="slip-grid">
          {bookings.length > 0 ? bookings.map(b => (
            <div className="slip-card" key={b.id}>
              
              {/* ส่วนข้อมูลผู้ใช้ */}
              <div className="user-info-section">
                <img 
                  src="https://ui-avatars.com/api/?name=User&background=random" 
                  alt="avatar" 
                  className="user-avatar" 
                />
                <div className="user-details">
                  {/* ถ้า API มีชื่อ/อีเมลส่งมาด้วย ให้แก้ b.user_name เป็นชื่อฟิลด์จริงได้เลยครับ */}
                  <span className="user-name">{b.user_name || `Booking ID: #${b.id}`}</span>
                  <span className="user-email">{b.user_email || `สถานะ: ${b.status}`}</span>
                </div>
              </div>

              {/* ส่วนยอดเงิน */}
              <div className="amount-section">
                <div className="amount-icon-bg">
                  <span className="baht-icon">฿</span>
                </div>
                {/* ถ้า API มียอดเงินส่งมาด้วย ให้แก้ b.amount ได้เลย */}
                <span className="amount-text">ยอดเงินโอน <strong>{b.amount || '---'}</strong> บาท</span>
              </div>

              {/* ส่วนรูปสลิป */}
              <div className="slip-image-wrapper">
                <a href={`https://finalrental.onrender.com/${b.slip_image}`} target="_blank" rel="noreferrer">
                  <img 
                    src={`https://finalrental.onrender.com/${b.slip_image}`} 
                    alt="Payment Slip" 
                    className="slip-image"
                  />
                </a>
              </div>

              {/* ส่วนปุ่มดำเนินการ */}
              <div className="action-buttons">
                <button 
                  className="btn-approve" 
                  onClick={() => handleVerify(b.id, true)}
                >
                  อนุมัติ
                </button>
                <button 
                  className="btn-reject" 
                  onClick={() => handleVerify(b.id, false)}
                >
                  ปฏิเสธ
                </button>
              </div>

            </div>
          )) : (
            <div className="empty-state">ไม่มีรายการรอตรวจสอบสลิป</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlipVerificationPage;