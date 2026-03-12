import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import API_BASE_URL from '../configs/api';
import './SlipVerificationPage.css'; 

const SlipVerificationPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = `${API_BASE_URL}/payments`; 

  const fetchPendingBookings = useCallback(async () => {
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
      if (err.response?.status === 401 || err.response?.status === 403) {
        setBookings([]); 
        alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้ หรือ Token หมดอายุ กรุณาเข้าสู่ระบบใหม่");
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPendingBookings();
  }, [fetchPendingBookings]);

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
      fetchPendingBookings();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading-state">กำลังโหลดข้อมูลสลิป...</div>;

  return (
    <div className="slip-page-container" style={{ padding: '10px 40px', fontFamily: 'Sarabun, sans-serif' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>ตรวจสอบสลิป</h1>
      <p style={{ fontSize: '20px', color: '#555', marginBottom: '30px' }}>
        รายการตรวจสอบ: <span style={{ fontWeight: 'bold', color: '#000' }}>{bookings.length} รายการ</span>
      </p>

      <div className="main-content-card" style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '40px', 
        minHeight: '75vh',
        boxShadow: '0 4px 30px rgba(0,0,0,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        alignContent: 'flex-start'
      }}>
        {bookings.map(b => (
          <div className="slip-card" key={b.id} style={{
            width: '420px',
            backgroundColor: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* User Details */}
            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6', marginBottom: '16px' }}>
              <img 
                src={b.renter_profile_img ? (b.renter_profile_img.startsWith('http') ? b.renter_profile_img : `https://finalrental.onrender.com${b.renter_profile_img}`) : 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + b.renter_name} 
                alt="Profile"
                style={{ width: '56px', height: '56px', borderRadius: '50%', marginRight: '16px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>{b.renter_name}</div>
                <div style={{ fontSize: '14px', color: '#2563EB' }}>{b.renter_email}</div>
              </div>
            </div>

            {/* Amount */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#111827', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '12px' }}>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>฿</span>
              </div>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>
                ยอดเงินโอน {b.total_price ? parseFloat(b.total_price).toLocaleString() : '0'} บาท
              </span>
            </div>

            {/* Slip Image */}
            <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
              <a href={b.slip_image?.startsWith('http') ? b.slip_image : `https://finalrental.onrender.com/${b.slip_image}`} target="_blank" rel="noreferrer">
                <img 
                  src={b.slip_image?.startsWith('http') ? b.slip_image : `https://finalrental.onrender.com/${b.slip_image}`} 
                  alt="Payment Slip"
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#F9FAFB' }}
                />
              </a>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleVerify(b.id, true)} style={{ flex: 1, padding: '14px', backgroundColor: '#10B981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                อนุมัติ
              </button>
              <button onClick={() => handleVerify(b.id, false)} style={{ flex: 1, padding: '14px', backgroundColor: '#EF4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
                ปฏิเสธ
              </button>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div style={{ width: '100%', textAlign: 'center', paddingTop: '100px', color: '#9CA3AF' }}>
            <p style={{ fontSize: '20px' }}>ไม่มีรายการรอตรวจสอบสลิป</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlipVerificationPage;