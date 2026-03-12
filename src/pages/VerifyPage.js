import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VerifyPage.css';

const VerifyPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [displayMode] = useState('all'); // 'all', 'waiting', or 'history'

  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
    type: '',
    id: null
  });

  const BASE_URL = "https://finalrental.onrender.com";
  const API_URL = `${BASE_URL}/api/admin/kyc`;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate Loading logic
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchData = async () => {
    try {
      if (isFirstLoad) setLoading(true);
      const token = localStorage.getItem('token');
      
      const tryEndpoints = [
        `${API_URL}/all`,
        `${BASE_URL}/api/admin/users`,
        `${API_URL}/pending`
      ];

      let combinedData = [];
      for (const url of tryEndpoints) {
        try {
          const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
          if (res.data.success) {
            const list = res.data.data || res.data.users || res.data.pending_users || [];
            combinedData = [...combinedData, ...list];
          }
        } catch (e) {}
      }

      const uniqueMap = new Map();
      combinedData.forEach(u => {
        if (u.id) {
          const status = (u.kyc_status || '').toLowerCase();
          if (status !== 'not_submitted' && status !== '') {
            // Merge data so we don't lose images if one endpoint has more info than another
            const existing = uniqueMap.get(u.id) || {};
            uniqueMap.set(u.id, { ...existing, ...u });
          }
        }
      });

      const statusPriority = { 'pending': 1, 'approved': 2, 'rejected': 3 };
      const sorted = Array.from(uniqueMap.values()).sort((a, b) => {
        const pA = statusPriority[(a.kyc_status || '').toLowerCase()] || 4;
        const pB = statusPriority[(b.kyc_status || '').toLowerCase()] || 4;
        if (pA !== pB) return pA - pB;
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });

      setAllUsers(sorted);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400x250?text=No+Image';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const openConfirmModal = (id, decision) => {
    setModal({
      isOpen: true,
      message: `ยืนยันการ${decision === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}`,
      type: decision,
      id: id
    });
  };

  const handleConfirmDecision = async () => {
    const { id, type } = modal;
    setModal({ ...modal, isOpen: false });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/${id}`, { status: type }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        alert(res.data.message);
        setSelectedUser(null);
        fetchData();
      }
    } catch (err) {
      alert("ไม่สำเร็จ: " + (err.response?.data?.message || err.message));
    }
  };

  const ConfirmationModalComp = () => (
    <div className={`modal-overlay ${modal.isOpen ? 'active' : ''}`}>
      <div className="modal-content">
        <h3>แจ้งเตือน</h3>
        <p>{modal.message}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setModal({ ...modal, isOpen: false })}>ยกเลิก</button>
          <button className="btn-confirm" onClick={handleConfirmDecision}>ยืนยัน</button>
        </div>
      </div>
    </div>
  );

  if (loading && isFirstLoad && !selectedUser) return <div className="loading-state">กำลังดึงข้อมูล...</div>;

  if (selectedUser) {
    const idCardImg = selectedUser.id_card_image;
    const faceImg = selectedUser.face_image;
    return (
      <div className="verify-container">
        <ConfirmationModalComp />
        <div className="detail-card">
          <button className="back-btn" onClick={() => setSelectedUser(null)}>‹</button>
          <div className="detail-images">
            <div className="image-box">
              <img src={getImageUrl(idCardImg)} alt="ID" onError={(e) => {
                if (!e.target.src.includes('via.placeholder')) {
                  e.target.src = 'https://via.placeholder.com/400x250?text=ID+Not+Found';
                }
              }} />
            </div>
            <div className="image-box">
              <img src={getImageUrl(faceImg)} alt="Face" onError={(e) => {
                if (!e.target.src.includes('via.placeholder')) {
                  e.target.src = 'https://via.placeholder.com/400x250?text=Face+Not+Found';
                }
              }} />
            </div>
          </div>
          <div className="detail-info">
            <h2>ชื่อ {selectedUser.full_name}</h2>
            <p>เลขบัตร {selectedUser.id_card_number || '-'}</p>
            <p>สถานะปัจจุบัน: <span style={{ color: selectedUser.kyc_status === 'approved' ? '#1e9a74' : selectedUser.kyc_status === 'rejected' ? '#d14545' : '#38bdf8' }}>{selectedUser.kyc_status}</span></p>
          </div>
          {selectedUser.kyc_status === 'pending' && (
            <div className="detail-actions">
              <button className="btn-detail-approve" onClick={() => openConfirmModal(selectedUser.id, 'approved')}>อนุมัติ</button>
              <button className="btn-detail-reject" onClick={() => openConfirmModal(selectedUser.id, 'rejected')}>ปฏิเสธ</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const waitingList = allUsers.filter(u => (u.kyc_status || '').toLowerCase() === 'pending');
  const historyList = allUsers.filter(u => (u.kyc_status || '').toLowerCase() === 'approved' || (u.kyc_status || '').toLowerCase() === 'rejected');

  let currentList = allUsers;
  if (displayMode === 'waiting') currentList = waitingList;
  else if (displayMode === 'history') currentList = historyList;

  return (
    <div className="verify-container">
      <div className="table-card">
        <table className="verify-table" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '150px' }}>รูปภาพ</th>
              <th style={{ width: '30%' }}>ชื่อ</th>
              <th style={{ width: '30%' }}>เลขบัตร</th>
              <th style={{ textAlign: 'right', width: '25%' }}>การจัดการ</th>
            </tr>
          </thead>
        </table>
        <div className="table-content-area">
          <table className="verify-table" style={{ tableLayout: 'fixed' }}>
            <tbody>
              {currentList.length > 0 ? currentList.map((user) => (
                <tr key={user.id}>
                  <td style={{ width: '150px' }}>
                    <img src={getImageUrl(user.id_card_image)} alt="ID" className="id-card-img" onError={(e) => {
                      if (!e.target.src.includes('via.placeholder')) {
                        e.target.src = 'https://via.placeholder.com/110x70?text=No+Img';
                      }
                    }} />
                  </td>
                  <td style={{ width: '30%' }}><strong>{user.full_name || '-'}</strong></td>
                  <td style={{ width: '30%' }}>{user.id_card_number || '-'}</td>
                  <td style={{ textAlign: 'right', width: '25%' }}>
                    <div className="action-buttons" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button className={`btn-action ${(user.kyc_status || '').toLowerCase() === 'rejected' ? 'btn-reject' : 'btn-view'}`} onClick={() => setSelectedUser(user)}>
                        {(user.kyc_status || '').toLowerCase() === 'pending' ? 'เข้าดู' : (user.kyc_status || '').toLowerCase() === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                        <span className="arrow-icon">›</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="no-data">ไม่มีข้อมูลในส่วนนี้</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;







