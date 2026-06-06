import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@ankhang.com');
  const [password, setPassword] = useState('Ankhang@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  
  const { login, user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate('/ak-management');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/ak-management');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  if (isLoading) return <div className="al-loading">Đang tải...</div>;

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        
        {/* Left Side: Image Banner */}
        <div className="al-left-banner">
          <div className="al-banner-overlay"></div>
          <div className="al-banner-content">
            <h2>KIẾN TẠO GIÁ TRỊ<br/>VỮNG BỀN CÙNG THỜI GIAN</h2>
            <div className="al-banner-divider"></div>
            <p className="al-company-name">AN KHANG GROUP</p>
            <p className="al-company-desc">Hệ thống quản trị bất động sản</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="al-right-form">
          <div className="al-version-badge">
            <ShieldCheck size={14} /> Admin Panel v1.0
          </div>
          
          <div className="al-logo-container">
            <h1 className="al-logo-text"><span>A</span>K</h1>
            <p className="al-logo-sub">AN KHANG GROUP</p>
          </div>

          <div className="al-form-header">
            <h3>ĐĂNG NHẬP QUẢN TRỊ</h3>
            <div className="al-header-divider"></div>
          </div>

          {error && <div className="al-error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="al-input-group">
              <label>Email quản trị</label>
              <div className="al-input-wrapper">
                <Mail size={18} className="al-input-icon" />
                <input 
                  type="email" 
                  placeholder="Nhập email quản trị"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="al-input-group">
              <label>Mật khẩu</label>
              <div className="al-input-wrapper">
                <Lock size={18} className="al-input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="al-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="al-form-options">
              <label className="al-checkbox-label">
                <div className={`al-checkbox ${rememberMe ? 'checked' : ''}`}>
                  {rememberMe && <Check size={12} />}
                </div>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  hidden
                />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="al-forgot-link">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="al-submit-btn">
              <Lock size={16} /> ĐĂNG NHẬP HỆ THỐNG
            </button>
          </form>

          <div className="al-divider-text">
            <span>Hoặc đăng nhập bằng</span>
          </div>

          <button type="button" className="al-sso-btn">
            <ShieldCheck size={16} /> SSO / Single Sign-On
          </button>

          <div className="al-footer-info">
            <ShieldCheck size={14} /> © 2026 An Khang Group
            <p>Hệ thống quản trị bất động sản</p>
          </div>
        </div>
      </div>
    </div>
  );
}
