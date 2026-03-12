import axios from 'axios';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../configs/api';
import { LuMessageCircle } from "react-icons/lu";
import { BsChevronLeft } from "react-icons/bs";
import './DisputePage.css';

const DisputePage = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDispute, setSelectedDispute] = useState(null);
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    decision: '',
    actionText: '' 
  });

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

  const handleDecide = async () => {
    if (!selectedDispute) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_URL}/${selectedDispute.id}/decide`, 
        { decision: modalState.decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("ตัดสินเรียบร้อย!");
        setModalState({ isOpen: false, decision: '', actionText: '' });
        setSelectedDispute(null);
        fetchDisputes(); 
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
    }
  };

  const openConfirmModal = (decision, actionText) => {
    setModalState({
      isOpen: true,
      decision: decision,
      actionText: actionText
    });
  };

  if (loading) return <div className="loading-state">กำลังโหลดข้อพิพาท...</div>;

  return (
    <div className="dispute-page-container">
      <h2 className="page-title">จัดการข้อพิพาท</h2>

      {!selectedDispute && (
        <div className="chat-list-card">
          <div className="chat-list-header">
            <h3>รายการข้อพิพาท</h3>
            <LuMessageCircle className="chat-icon" />
          </div>
          
          <div className="chat-list-body">
            {disputes.length > 0 ? disputes.map(d => (
              <div key={d.id} className="chat-list-item" onClick={() => setSelectedDispute(d)}>
                <div className="chat-avatar">
                  <img src="https://ui-avatars.com/api/?name=User&background=random" alt="avatar" />
                </div>
                <div className="chat-preview">
                  <div className="chat-preview-header">
                    <span className="chat-name">รายการที่ #{d.id}</span>
                    <span className="chat-time">สถานะ: {d.status}</span>
                  </div>
                  <div className="chat-preview-text">
                    เหตุผล: {d.reason}
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-state">ไม่มีรายการข้อพิพาท</div>
            )}
          </div>
        </div>
      )}

      {selectedDispute && (
        <div className="dispute-detail-container">
          
          <div className="chat-detail-card">
            <div className="chat-detail-header">
              <BsChevronLeft className="back-icon" onClick={() => setSelectedDispute(null)} />
              <div className="chat-avatar small">
                 <img src="https://ui-avatars.com/api/?name=User&background=random" alt="avatar" />
              </div>
              <span className="chat-header-name">รายละเอียดรายการ #{selectedDispute.id}</span>
            </div>
            
            <div className="chat-messages-area">
              <div className="message-row receiver">
                <div className="message-bubble">
                  <strong>เหตุผลการแจ้งข้อพิพาท:</strong><br/>
                  {selectedDispute.reason}
                </div>
              </div>
            </div>
          </div>

          <div className="decision-panel">
            <div className="decision-card">
              <h4 className="role-title">การตัดสินใจ</h4>
              <p className="desc-text">กรุณาเลือกดำเนินการสำหรับข้อพิพาทนี้ สถานะปัจจุบัน: <strong>{selectedDispute.status}</strong></p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  className="action-btn blue"
                  style={{ backgroundColor: '#199474' }} // สีเขียว
                  onClick={() => openConfirmModal('refund', 'คืนเงิน (Refund)')}
                >
                  Refund (คืนเงิน)
                </button>
                
                <button 
                  className="action-btn blue"
                  style={{ backgroundColor: '#CA3A3A' }} // สีแดง
                  onClick={() => openConfirmModal('reject', 'ปฏิเสธ (Reject)')}
                >
                  Reject (ปฏิเสธ)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalState.isOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">ยืนยันการดำเนินการ</h3>
            <p className="modal-desc">คุณต้องการยืนยันการ <strong>{modalState.actionText}</strong> สำหรับรายการ #{selectedDispute?.id} ใช่หรือไม่?</p>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel" 
                onClick={() => setModalState({ isOpen: false, decision: '', actionText: '' })}
              >
                ยกเลิก
              </button>
              <button 
                className="modal-btn confirm" 
                onClick={handleDecide}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DisputePage;