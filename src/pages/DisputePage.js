import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WithdrawRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  // URL หลังบ้านของคุณ
  const API_URL = "https://finalrental.onrender.com/api/money";

  useEffect(() => {
    fetchWithdrawRequests();
  }, []);

  const fetchWithdrawRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      // หมายเหตุ: คุณต้องเช็คว่าหลังบ้านมี Route สำหรับดึงรายการที่ status = 'pending' หรือยัง
      const res = await axios.get(`${API_URL}/admin/withdrawals/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // สมมติว่า res.data ส่งกลับมาเป็น array ของรายการถอน
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch Withdraw Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (wid) => {
    const adminNote = window.prompt("ระบุหมายเหตุการโอน (เช่น โอนเรียบร้อย):");
    const slipUrl = window.prompt("วาง URL รูปหลักฐานการโอน (Transfer Slip URL):");

    if (!slipUrl) {
      alert("กรุณาใส่ URL รูปสลิปเพื่อยืนยันการโอน");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // เรียกใช้ approveWithdraw: router.put('/admin/approve', ...)
      const res = await axios.put(`${API_URL}/admin/approve`, 
        { 
          withdrawal_id: wid,     // ตรงตาม Controller
          admin_note: adminNote,   // ตรงตาม Controller
          transfer_slip_url: slipUrl // ตรงตาม Controller
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("อนุมัติการถอนเงินเรียบร้อย!");
        fetchWithdrawRequests(); // รีโหลดข้อมูลในตาราง
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดคำร้องขอถอนเงิน...</div>;

  return (
    <div className="withdraw-container">
      <h2>รายการคำร้องขอถอนเงิน</h2>
      <div className="table-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th>จำนวนเงิน</th>
              <th>สถานะ</th>
              <th>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? requests.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>#{req.id}</td>
                <td style={{ color: '#2ecc71', fontWeight: 'bold' }}>฿{parseFloat(req.amount).toLocaleString()}</td>
                <td>
                  <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {req.status}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleApprove(req.id)}
                    style={{ background: '#22c55e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    ยืนยันการโอนเงิน
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>ไม่มีรายการถอนเงินที่ค้างอยู่</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawRequestPage;