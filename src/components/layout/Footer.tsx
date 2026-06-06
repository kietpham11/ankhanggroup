import React from 'react';
import { Building2, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="global-footer">
      <div className="footer-container">
        <div className="footer-top-grid">

          {/* COLUMN 1 */}
          <div className="footer-col brand-col">
            <div className="footer-logo" style={{ marginBottom: '1.5rem' }}>
              <img src="/images/logo-final.png" alt="An Khang Group" style={{ height: '150px', width: 'auto', objectFit: 'contain', transform: 'scale(1.2)' }} />
            </div>
            <p className="brand-desc">
              An Khang Group - Đối tác tin cậy trong hành trình tìm kiếm tổ ấm và đầu tư bất động sản của bạn.
            </p>
            <div className="footer-socials">
              <a href="https://www.facebook.com/profile.php?id=61586613410937" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>

              <a href="https://www.tiktok.com/@bds.ankhanggroup" target="_blank" rel="noopener noreferrer" className="tiktok-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.34 6.32 6.32 0 0 0 6.27-6.34V11.5a8.21 8.21 0 0 0 2.05.26z" /></svg>
              </a>
              <a href="#" className="zalo-text">Zalo</a>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">VỀ CHÚNG TÔI</h4>
            <ul className="footer-links">
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Tầm nhìn - Sứ mệnh</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Tin tức</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">HỖ TRỢ KHÁCH HÀNG</h4>
            <ul className="footer-links">
              <li><a href="#">Hướng dẫn mua nhà</a></li>
              <li><a href="#">Hướng dẫn đầu tư</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          {/* COLUMN 4 */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">LIÊN HỆ</h4>
            <ul className="footer-contact-info">
              <li>
                <MapPin size={16} className="text-gold" />
                <span>460 Đường Đồng Khởi, phường, Tam Hiệp, Đồng Nai .</span>
              </li>
              <li>
                <Phone size={16} className="text-gold" />
                <span>0985 943 567</span>
              </li>
              <li>
                <Mail size={16} className="text-gold" />
                <span>ankhanggroup.realestate@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2025 An Khang Group. All rights reserved.</p>
          <button className="btn-scroll-top" onClick={scrollToTop}>
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
}
