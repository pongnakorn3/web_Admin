import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WithdrawRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://finalrental.onrender.com/api/money"; // อ้างอิงจาก router

  useEffect(() => {
    fetchWithdrawRequests();
  }, []);

  const fetchWithdrawRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      // สมมติว่ามี Route GET /admin/withdraw-pending เพื่อดูรายการที่ค้างอยู่
      const res = await axios.get(`${API_URL}/admin/withdraw-pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch Withdraw Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId, status) => {
    const comment = window.prompt("ระบุหมายเหตุ (ถ้ามี):");
    if (!window.confirm(`ยืนยันการ ${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}?`)) return;

    try {
      const token = localStorage.getItem('token');
      // เรียกใช้ approveWithdraw (PUT /admin/approve)
      await axios.put(`${API_URL}/admin/approve`, 
        { 
          requestId: requestId, 
          status: status, // 'approved' หรือ 'rejected'
          comment: comment 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("ดำเนินการเรียบร้อย!");
      fetchWithdrawRequests();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดรายการถอนเงิน...</div>;

  return (
    <div className="withdraw-container">
      <h1>คำร้องขอถอนเงิน</h1>
      <div className="table-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ padding: '12px' }}>วันที่ขอ</th>
              <th>ชื่อสมาชิก</th>
              <th>ธนาคาร/เลขบัญชี</th>
              <th>จำนวนเงิน</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? requests.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>{new Date(req.created_at).toLocaleDateString()}</td>
                <td>{req.full_name}</td>
                <td>
                  <strong>{req.bank_name}</strong><br/>
                  <small>{req.account_number}</small>
                </td>
                <td style={{ color: '#2ecc71', fontWeight: 'bold' }}>฿{req.amount}</td>
                <td>
                  <button 
                    onClick={() => handleApprove(req.id, 'approved')}
                    style={{ background: '#22c55e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' }}
                  >
                    อนุมัติโอน
                  </button>
                  <button 
                    onClick={() => handleApprove(req.id, 'rejected')}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    ปฏิเสธ
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>ไม่มีคำร้องขอถอนเงิน</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawRequestPage;