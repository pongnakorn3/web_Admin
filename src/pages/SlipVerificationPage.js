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
      fetchPendingBookings();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูลสลิป...</div>;

  return (
    <div style={{ padding: '10px 40px', fontFamily: 'Sarabun, sans-serif', color: '#333' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>ตรวจสอบสลิป</h1>
      <p style={{ fontSize: '20px', color: '#555', marginBottom: '30px' }}>
        รายการตรวจสอบ: <span style={{ fontWeight: 'bold', color: '#000' }}>{bookings.length} รายการ</span>
      </p>

      <div style={{ 
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
          <div key={b.id} style={{
            width: '420px',
            backgroundColor: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* User Details Header */}
            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6', marginBottom: '16px' }}>
              <img 
                src={b.renter_profile_img ? (b.renter_profile_img.startsWith('http') ? b.renter_profile_img : `https://finalrental.onrender.com${b.renter_profile_img}`) : 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + b.renter_name} 
                alt="Profile"
                style={{ width: '56px', height: '56px', borderRadius: '50%', marginRight: '16px', objectFit: 'cover', border: '1px solid #EEE' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{b.renter_name}</div>
                <div style={{ fontSize: '14px', color: '#2563EB', textDecoration: 'underline' }}>{b.renter_email}</div>
              </div>
            </div>

            {/* Transaction Amount */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                backgroundColor: '#111827', 
                borderRadius: '50%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginRight: '12px'
              }}>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>$</span>
              </div>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>ยอดเงินโอน {parseFloat(b.total_price).toLocaleString()} บาท</span>
            </div>

            {/* Slip Preview */}
            <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden' }}>
              <img 
                src={b.slip_image?.startsWith('http') ? b.slip_image : `https://finalrental.onrender.com/${b.slip_image}`} 
                alt="Payment Slip"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => handleVerify(b.id, true)}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#10B981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10B981'}
              >
                อนุมัติ
              </button>
              <button 
                onClick={() => handleVerify(b.id, false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#EF4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#DC2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#EF4444'}
              >
                ปฏิเสธ
              </button>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div style={{ width: '100%', textAlign: 'center', paddingTop: '100px', color: '#9CA3AF' }}>
             <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
             <p style={{ fontSize: '20px' }}>ไม่มีรายการรอตรวจสอบสลิป</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlipVerificationPage;
