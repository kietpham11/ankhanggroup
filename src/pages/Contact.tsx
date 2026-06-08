import React, { useState, useEffect } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send,
  ChevronDown, Navigation, ShieldCheck
} from 'lucide-react';
import './Contact.css';
import FAQ from '../components/shared/FAQ';
import { contactsAPI, settingsAPI } from '../lib/api';

export default function Contact({ banner }: { banner?: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contactData, setContactData] = useState({
    phone: '0985 943 567',
    email: 'ankhanggroup.realestate@gmail.com',
    address: '460 Đường Đồng Khởi, phường, Tam Hiệp, Đồng Nai .',
    hours: 'Thứ 2 - Thứ 6: 08:00 - 17:30\nThứ 7 : 09:00 - 12:00',
    facebook: 'https://www.facebook.com/profile.php?id=61586613410937',
    tiktok: 'https://www.tiktok.com/@bds.ankhanggroup',
    zalo: 'https://zalo.me/0985943567'
  });

  useEffect(() => {
    settingsAPI.get('CONTACT')
      .then(res => {
        if (res && res.value) {
          setContactData(res.value);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);
    try {
      await contactsAPI.send({
        name,
        phone,
        email: '', // Not required by our updated API
        message,
      });
      alert('Đã gửi yêu cầu thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      setName('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      alert(err.message || 'Lỗi gửi yêu cầu, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* HEADER HERO */}
      <div className="contact-header-bg" style={banner ? { backgroundImage: `url(${banner})` } : {}}>
        <div className="contact-container">
          <div className="breadcrumb">Trang chủ <span className="mx-2">&gt;</span> <span className="text-gold">Liên hệ</span></div>
          <h1 className="page-title">Liên hệ với chúng tôi</h1>
          <p className="page-subtitle">An Khang Group luôn sẵn sàng lắng nghe và hỗ trợ bạn tìm kiếm<br />bất động sản phù hợp nhất.</p>
        </div>
      </div>

      <div className="contact-container">

        {/* MAIN CONTACT AREA */}
        <div className="contact-main-grid">

          {/* LEFT: FORM */}
          <div className="contact-form-card">
            <h3 className="card-title text-gold">GỬI YÊU CẦU TƯ VẤN</h3>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ và tên <span className="text-red">*</span></label>
                <input 
                  type="text" 
                  placeholder="Nhập họ và tên của bạn" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại <span className="text-red">*</span></label>
                <input 
                  type="tel" 
                  placeholder="Nhập số điện thoại" 
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setPhone(val);
                  }}
                  required 
                />
              </div>


              <div className="form-group">
                <label>Nội dung tin nhắn</label>
                <textarea 
                  rows={4} 
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="privacy-assurance">
                <ShieldCheck size={16} className="text-gold" />
                <span>Chúng tôi cam kết bảo mật thông tin của bạn</span>
              </div>

              <button 
                type="submit" 
                className="btn-submit-contact"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'} <Send size={16} />
              </button>
            </form>
          </div>

          {/* RIGHT: INFO */}
          <div className="contact-info-card">
            <h3 className="card-title text-gold">THÔNG TIN LIÊN HỆ</h3>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-text">
                  <h4>Địa chỉ</h4>
                  <p>{contactData.address}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Phone size={20} />
                </div>
                <div className="info-text">
                  <h4>Hotline</h4>
                  <p className="highlight">{contactData.phone}</p>
                  <span className="sub-text">(08:00 - 17:30 tất cả các ngày trong tuần)</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Mail size={20} />
                </div>
                <div className="info-text">
                  <h4>Email</h4>
                  <p>{contactData.email}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Clock size={20} />
                </div>
                <div className="info-text">
                  <h4>Giờ làm việc</h4>
                  {contactData.hours.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="social-connect">
              <h4>Kết nối với chúng tôi</h4>
              <div className="social-icons">
                <a href={contactData.facebook} target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href={contactData.zalo} target="_blank" rel="noopener noreferrer" className="social-icon zalo">Zalo</a>

                <a href={contactData.tiktok} target="_blank" rel="noopener noreferrer" className="social-icon tiktok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.34 6.32 6.32 0 0 0 6.27-6.34V11.5a8.21 8.21 0 0 0 2.05.26z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="map-section">
          <div className="map-iframe-wrapper" style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.0785999027185!2d106.8573159748076!3d10.957435289202586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dd00658c1907%3A0xc09d80dd5e6f5bb3!2zQuG6pXQgxJDhu5luZyBT4bqjbiBBbiBLaGFuZyBHcm91cA!5e0!3m2!1svi!2s!4v1780473565713!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map An Khang Group"
            ></iframe>
          </div>
        </div>

      </div>

      {/* FAQ SECTION */}
      <FAQ />

    </div>
  );
}
