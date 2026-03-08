// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* แก้ไขบรรทัดนี้: เพิ่ม /* เพื่อให้เข้าถึงหน้าย่อยใน AdminDashboard ได้ */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;