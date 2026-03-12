import axios from 'axios';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../configs/api';
import './AdminTransactionPage.css';


const AdminTransactionPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ดึงประวัติธุรกรรมทั้งหมดของทุกคนมาดู
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
          setError('ไม่พบโทเค็น กรุณาเข้าสู่ระบบใหม่');
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/admin/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setLogs(res.data || []);
      } catch (err) {
        console.error('ข้อผิดพลาด:', err);
        setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลธุรกรรมได้ (Backend อาจพังหรือไม่มีสิทธิ์)');
      } finally {
        setLoading(false);
      }
    };
    fetchAllTransactions();
  }, []);

  return (
    <div className="admin-transaction-container">
      <div className="transaction-header">
        <h2>📊 บันทึกธุรกรรมการเงินทั้งระบบ</h2>
        <p className="subtitle">ดูประวัติธุรกรรมทั้งหมดและจัดการการชำระเงิน</p>
      </div>

      {/* แสดงข้อผิดพลาด */}
      {error && (
        <div className="error-box">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* แสดงสถานะการโหลด */}
      {loading && !error && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      )}

      {/* แสดงตารางเมื่อโหลดสำเร็จ */}
      {!loading && logs.length > 0 && (
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>#</th>
                <th>วันที่</th>
                <th>ประเภท</th>
                <th>จำนวนเงิน</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={log.id} className={log.transaction_type === 'income' ? 'income-row' : 'expense-row'}>
                  <td className="row-num">{idx + 1}</td>
                  <td className="date-col">{new Date(log.created_at).toLocaleString('th-TH')}</td>
                  <td className="type-col">
                    <span className={`badge badge-${log.transaction_type}`}>
                      {log.transaction_type === 'income' ? '🔼 รับเงิน' : '🔽 จ่ายเงิน'}
                    </span>
                  </td>
                  <td className={`amount-col ${log.transaction_type === 'income' ? 'income' : 'expense'}`}>
                    {log.transaction_type === 'income' ? '+' : '-'}฿{parseFloat(log.amount).toLocaleString('th-TH')}
                  </td>
                  <td className="desc-col">{log.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* แสดงเมื่อไม่มีข้อมูล */}
      {!loading && logs.length === 0 && !error && (
        <div className="empty-box">
          <p>📭 ไม่มีธุรกรรมในระบบ</p>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionPage;