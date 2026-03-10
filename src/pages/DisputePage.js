import axios from 'axios';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../configs/api';

const DisputePage = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${API_BASE_URL}/admin/disputes`;


  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDisputes(res.data.disputes);
      }
    } catch (err) {
      console.error("Fetch Dispute Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecide = async (id, decision) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_URL}/${id}/decide`, 
        { decision: decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("ตัดสินเรียบร้อย!");
        fetchDisputes();
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อพิพาท...</div>;

  return (
    <div className="withdraw-container">
      <h2>จัดการข้อพิพาท</h2>
      <div className="table-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <table width="100%" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th>เหตุผล</th>
              <th>สถานะ</th>
              <th>ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {disputes.length > 0 ? disputes.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>#{d.id}</td>
                <td>{d.reason}</td>
                <td>{d.status}</td>
                <td>
                  <button 
                    onClick={() => handleDecide(d.id, 'refund')}
                    style={{ background: '#22c55e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer' }}
                  >
                    Refund
                  </button>
                  <button 
                    onClick={() => handleDecide(d.id, 'reject')}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>ไม่มีรายการข้อพิพาท</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisputePage;
