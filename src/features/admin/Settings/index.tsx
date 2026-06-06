import React, { useState } from 'react';
import { 
  Users, ShieldCheck, PieChart, Phone, Image as ImageIcon, Settings as SettingsIcon,
  Calendar, Bell, ArrowRight
} from 'lucide-react';
import './Settings.css';

export default function Settings({ onNavigate }: { onNavigate?: (page: any) => void }) {
  const [activeTab, setActiveTab] = useState('contact');

  const [contactData, setContactData] = useState({
    phone: '0123 456 789',
    email: 'contact@ankhanggroup.vn',
    address: '123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh',
    hours: 'Thứ 2 - Thứ 6: 8h00 - 17h30\nThứ 7: 8h00 - 12h00'
  });

  const handleInputChange = (field: string, value: string) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Đã lưu cấu hình thông tin liên hệ thành công!');
  };

  return (
    <div className="as-container">
      {/* Cards Grid */}
      <div className="as-cards-grid">
        <div 
          className={`as-card ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <div className="as-card-icon as-icon-blue"><Users size={24} /></div>
          <div className="as-card-info">
            <h4>Đội ngũ lãnh đạo</h4>
            <p>Quản lý thông tin và hình ảnh đội ngũ lãnh đạo công ty</p>
            <span 
              className="as-card-link" 
              onClick={(e) => {
                e.stopPropagation(); // Ngăn không trigger onClick của thẻ
                if (onNavigate) onNavigate('leadership');
              }}
            >
              Quản lý <ArrowRight size={14} />
            </span>
          </div>
        </div>

        <div 
          className={`as-card ${activeTab === 'partners' ? 'active' : ''}`}
          onClick={() => setActiveTab('partners')}
        >
          <div className="as-card-icon as-icon-cyan"><ShieldCheck size={24} /></div>
          <div className="as-card-info">
            <h4>Đối tác</h4>
            <p>Quản lý danh sách logo đối tác hiển thị trên website</p>
            <span className="as-card-link">Quản lý <ArrowRight size={14} /></span>
          </div>
        </div>

        <div 
          className={`as-card ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <div className="as-card-icon as-icon-green"><PieChart size={24} /></div>
          <div className="as-card-info">
            <h4>Thống kê trang chủ</h4>
            <p>Cập nhật các con số thống kê hiển thị ở trang chủ</p>
            <span className="as-card-link">Quản lý <ArrowRight size={14} /></span>
          </div>
        </div>

        <div 
          className={`as-card ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <div className="as-card-icon as-icon-yellow"><Phone size={24} /></div>
          <div className="as-card-info">
            <h4>Thông tin liên hệ</h4>
            <p>Cấu hình hotline, email và thông tin liên hệ hiển thị dưới footer</p>
            <span className="as-card-link">Quản lý <ArrowRight size={14} /></span>
          </div>
        </div>

        <div 
          className={`as-card ${activeTab === 'banners' ? 'active' : ''}`}
          onClick={() => setActiveTab('banners')}
        >
          <div className="as-card-icon as-icon-blue"><ImageIcon size={24} /></div>
          <div className="as-card-info">
            <h4>Banner trang chủ</h4>
            <p>Quản lý banner, slideshow hiển thị ở trang chủ</p>
            <span className="as-card-link">Quản lý <ArrowRight size={14} /></span>
          </div>
        </div>

        <div 
          className={`as-card ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <div className="as-card-icon as-icon-gray"><SettingsIcon size={24} /></div>
          <div className="as-card-info">
            <h4>Cài đặt chung</h4>
            <p>Các cài đặt chung khác của website</p>
            <span className="as-card-link">Quản lý <ArrowRight size={14} /></span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      {activeTab === 'contact' && (
        <div className="as-form-section">
          <div className="as-form-header">
            <h3>Thông tin liên hệ (Footer)</h3>
            <p>Thông tin này sẽ hiển thị ở phần footer của website</p>
          </div>
          
          <div className="as-form-grid">
            <div className="as-form-group">
              <label>Số điện thoại (Hotline)</label>
              <input 
                type="text" 
                value={contactData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            
            <div className="as-form-group">
              <label>Email liên hệ</label>
              <input 
                type="email" 
                value={contactData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="as-form-group as-form-full">
              <label>Địa chỉ</label>
              <input 
                type="text" 
                value={contactData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            <div className="as-form-group as-form-full">
              <label>Giờ làm việc</label>
              <textarea 
                rows={3}
                value={contactData.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
              />
            </div>
          </div>

          <div className="as-form-actions">
            <button className="as-btn-save" onClick={handleSave}>Lưu thay đổi</button>
          </div>
        </div>
      )}

      {activeTab !== 'contact' && (
        <div className="as-form-section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <SettingsIcon size={48} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-muted)' }}>Tính năng đang phát triển</h3>
          <p style={{ color: 'var(--text-muted)' }}>Vui lòng quay lại sau.</p>
        </div>
      )}
    </div>
  );
}
