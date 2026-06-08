import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, ShieldCheck, PieChart, Phone, Image as ImageIcon, Settings as SettingsIcon,
  Calendar, Bell, ArrowRight, Plus, Trash2, Upload, Save
} from 'lucide-react';
import './Settings.css';
import { settingsAPI, getFullImgUrl } from '../../../lib/api';

export default function Settings({ onNavigate }: { onNavigate?: (page: any) => void }) {
  const [activeTab, setActiveTab] = useState('contact');

  // Liên hệ
  const [contactData, setContactData] = useState({
    phone: '0123 456 789',
    email: 'contact@ankhanggroup.vn',
    address: '123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh',
    hours: 'Thứ 2 - Thứ 6: 8h00 - 17h30\nThứ 7: 8h00 - 12h00',
    facebook: 'https://www.facebook.com/profile.php?id=61586613410937',
    tiktok: 'https://www.tiktok.com/@bds.ankhanggroup',
    zalo: 'https://zalo.me/0985943567'
  });

  // Banners
  const [bannersData, setBannersData] = useState<{
    home: string[];
    news: string;
    projects: string;
    recruitment: string;
    about: string;
    contact: string;
    [key: string]: any;
  }>({
    home: [''],
    news: '',
    projects: '',
    recruitment: '',
    about: '',
    contact: ''
  });
  const [isLoadingBanners, setIsLoadingBanners] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{field: string, index?: number} | null>(null);

  useEffect(() => {
    if (activeTab === 'banners') {
      loadBanners();
    } else if (activeTab === 'contact') {
      loadContact();
    }
  }, [activeTab]);

  const loadContact = async () => {
    try {
      const res = await settingsAPI.get('CONTACT');
      if (res && res.value) {
        setContactData(res.value);
      }
    } catch (e) {
      console.error('Lỗi khi tải thông tin liên hệ:', e);
    }
  };

  const loadBanners = async () => {
    setIsLoadingBanners(true);
    try {
      const res = await settingsAPI.get('BANNERS');
      if (res && res.value) {
        setBannersData({
          home: res.value.home || [''],
          news: res.value.news || '',
          projects: res.value.projects || '',
          recruitment: res.value.recruitment || '',
          about: res.value.about || '',
          contact: res.value.contact || ''
        });
      }
    } catch (e) {
      console.error('Lỗi khi tải banners:', e);
    } finally {
      setIsLoadingBanners(false);
    }
  };

  const handleSaveBanners = async () => {
    setIsSaving(true);
    try {
      await settingsAPI.update('BANNERS', bannersData);
      alert('Đã lưu cấu hình banner thành công!');
    } catch (e) {
      alert('Lỗi khi lưu banner');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !uploadTarget) return;
    const file = e.target.files[0];
    const { field, index } = uploadTarget;
    
    try {
      const res = await settingsAPI.uploadBanner(file);
      let newData = { ...bannersData };
      if (field === 'home' && typeof index === 'number') {
        newData.home = [...newData.home];
        newData.home[index] = res.url;
      } else {
        newData[field] = res.url;
      }
      setBannersData(newData);
      
      // Auto-save
      await settingsAPI.update('BANNERS', newData);
    } catch (error: any) {
      alert(error.message || 'Lỗi upload ảnh');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadTarget(null);
    }
  };

  const triggerUpload = (field: string, index?: number) => {
    setUploadTarget({ field, index });
    fileInputRef.current?.click();
  };

  const handleInputChange = (field: string, value: string) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveContact = async () => {
    try {
      await settingsAPI.update('CONTACT', contactData);
      alert('Đã lưu cấu hình thông tin liên hệ thành công!');
    } catch (e) {
      alert('Lỗi khi lưu thông tin liên hệ');
    }
  };

  return (
    <div className="as-container">
      {/* Ẩn file input dùng cho upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleBannerUpload}
      />

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
                e.stopPropagation();
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

            <div className="as-form-group as-form-full">
              <label>Link Facebook</label>
              <input 
                type="url" 
                value={contactData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                placeholder="https://www.facebook.com/..."
              />
            </div>

            <div className="as-form-group">
              <label>Link TikTok</label>
              <input 
                type="url" 
                value={contactData.tiktok}
                onChange={(e) => handleInputChange('tiktok', e.target.value)}
                placeholder="https://www.tiktok.com/@..."
              />
            </div>

            <div className="as-form-group">
              <label>Link Zalo</label>
              <input 
                type="url" 
                value={contactData.zalo}
                onChange={(e) => handleInputChange('zalo', e.target.value)}
                placeholder="https://zalo.me/..."
              />
            </div>
          </div>

          <div className="as-form-actions">
            <button className="as-btn-save" onClick={handleSaveContact}>Lưu thay đổi</button>
          </div>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="as-form-section">
          <div className="as-form-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Quản lý Banner</h3>
              <p>Cập nhật banner cho các trang trên hệ thống</p>
            </div>
          </div>
          
          {isLoadingBanners ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Đang tải cấu hình...</div>
          ) : (
            <div className="as-form-grid" style={{ gap: '2rem' }}>
              
              <div className="as-form-group as-form-full">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy-primary)' }}>Slideshow Trang chủ</label>
                  <button 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
                    onClick={() => setBannersData(prev => ({ ...prev, home: [...prev.home, ''] }))}
                  >
                    <Plus size={16} /> Thêm ảnh
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {bannersData.home.map((url, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
                      <button 
                        style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                        onClick={() => {
                          const newHome = [...bannersData.home];
                          newHome.splice(idx, 1);
                          setBannersData(prev => ({ ...prev, home: newHome }));
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      {url ? (
                        <div style={{ width: '100%', height: '160px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem', background: '#e2e8f0' }}>
                          <img src={getFullImgUrl(url)} alt={`Slide ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '160px', borderRadius: '6px', marginBottom: '1rem', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <ImageIcon size={40} />
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="text" 
                          value={url} 
                          onChange={e => {
                            const newHome = [...bannersData.home];
                            newHome[idx] = e.target.value;
                            setBannersData(prev => ({ ...prev, home: newHome }));
                          }}
                          placeholder="URL ảnh..."
                          style={{ flex: 1, padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem' }}
                        />
                        <button 
                          style={{ padding: '0.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
                          onClick={() => triggerUpload('home', idx)}
                          title="Tải ảnh lên"
                        >
                          <Upload size={18} color="#64748b" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr style={{ gridColumn: '1 / -1', border: 'none', borderTop: '1px dashed #cbd5e1', margin: '1rem 0' }} />

              {[
                { id: 'projects', label: 'Banner Dự án' },
                { id: 'news', label: 'Banner Tin tức' },
                { id: 'recruitment', label: 'Banner Tuyển dụng' },
                { id: 'about', label: 'Banner Giới thiệu' },
                { id: 'contact', label: 'Banner Liên hệ' },
              ].map(page => (
                <div key={page.id} className="as-form-group">
                  <label style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy-primary)' }}>{page.label}</label>
                  
                  {bannersData[page.id] && (
                    <div style={{ width: '100%', height: '120px', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem', background: '#e2e8f0', marginTop: '0.5rem' }}>
                      <img src={getFullImgUrl(bannersData[page.id])} alt={page.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: bannersData[page.id] ? 0 : '0.5rem' }}>
                    <input 
                      type="text" 
                      value={bannersData[page.id]} 
                      onChange={e => setBannersData(prev => ({ ...prev, [page.id]: e.target.value }))}
                      placeholder="URL ảnh..."
                      style={{ flex: 1 }}
                    />
                    <button 
                      style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      onClick={() => triggerUpload(page.id)}
                    >
                      <Upload size={16} /> Tải lên
                    </button>
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: '2rem', textAlign: 'right', gridColumn: '1 / -1' }}>
                <button 
                  className="btn-save-as" 
                  onClick={handleSaveBanners} 
                  disabled={isSaving}
                  style={{ background: 'var(--gold-accent, #d4af37)', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Save size={18} /> {isSaving ? 'Đang lưu...' : 'Lưu tất cả thay đổi Banner'}
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {activeTab !== 'contact' && activeTab !== 'banners' && (
        <div className="as-form-section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <SettingsIcon size={48} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-muted)' }}>Tính năng đang phát triển</h3>
          <p style={{ color: 'var(--text-muted)' }}>Vui lòng quay lại sau.</p>
        </div>
      )}
    </div>
  );
}
