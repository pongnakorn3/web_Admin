import React, { useState } from 'react';
import './Login.css';

const Login = () => { // 1. ต้องมีการประกาศตัวแปร Component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // ข้อความแสดงความผิดพลาดจาก API

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://finalrental.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // ดักข้อผิดพลาดของ HTTP
        const errText = await response.text();
        throw new Error(errText || 'Network response was not ok');
      }

      const data = await response.json();
      
      // 2. ตรวจสอบเงื่อนไขความสำเร็จตาม API ของคุณ
      if (data.success || data.token) {
        localStorage.setItem('token', data.token);
        setError('');
        // อาจใช้ react-router ในอนาคต แต่สำหรับตอนนี้ใช้ redirect ธรรมดา
        window.location.href = '/admin';
      } else {
        // แสดงข้อความผิดพลาดบนหน้า
        setError(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
      
    } catch (error) {
      console.error("มีข้อผิดพลาด:", error);
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (Backend อาจจะกำลังเริ่มทำงาน กรุณารอสักครู่)");
    }
  };

  // 3. return ต้องอยู่ภายในฟังก์ชัน Login
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>เข้าสู่ระบบ</h2>
        <form onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          <div className="input-group">
            <input 
              type="email" 
              placeholder="อีเมล" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="รหัสผ่าน" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="login-btn">เข้าสู่ระบบ</button>
        </form>
        <div className="forgot-password">ลืมรหัสผ่าน</div>
      </div>
    </div>
  );
}; // 4. ปิดฟังก์ชัน Login ตรงนี้

export default Login;