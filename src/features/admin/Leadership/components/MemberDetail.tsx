import React, { useState } from 'react';
import { 
  ArrowLeft, Edit2, ExternalLink, Trash2, 
  Mail, Phone, MessageCircle,
  Plus, CheckCircle, Camera, X
} from 'lucide-react';

const FacebookIcon = ({ size = 18, style = {} }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TiktokIcon = ({ size = 18, style = {} }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);

interface MemberDetailProps {
  member: any;
  mode: 'view' | 'edit';
  onBack: () => void;
  onDeleteClick?: () => void;
  onUpdate?: (updatedData: any) => void;
}

export default function MemberDetail({ member, mode: initialMode, onBack, onDeleteClick, onUpdate }: MemberDetailProps) {
  const [activeTab, setActiveTab] = useState('bio');
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);

  // Form State
  const [formData, setFormData] = useState({
    name: member.name,
    avatar: member.avatar,
    position: member.position,
    status: member.status,
    description: member.description || 'Chuyên gia tư vấn và phát triển thị trường với mạng lưới đối tác rộng khắp. Bà đóng vai trò chủ chốt trong việc xây dựng chiến lược bán hàng, quản lý mạng lưới đại lý và đào tạo đội ngũ chuyên viên tư vấn chuyên nghiệp.',
    email: member.email || '',
    phone: member.phone || '0909 123 456',
    facebook: member.facebook || '',
    zalo: member.zalo || '',
    tiktok: member.tiktok || '',
    bio1: `Chuyên gia tư vấn và phát triển thị trường với mạng lưới đối tác rộng khắp. Bà đóng vai trò chủ chốt trong việc xây dựng chiến lược bán hàng, quản lý mạng lưới đại lý và đào tạo đội ngũ chuyên viên tư vấn chuyên nghiệp.`,
    bio2: `Trước khi gia nhập An Khang Group, đã có nhiều năm kinh nghiệm làm việc trong lĩnh vực chuyên môn, góp phần xây dựng nền tảng vững chắc và định hướng sự phát triển cho nhiều dự án và chiến lược quan trọng.`,
    bio3: `Với tầm nhìn chiến lược và tinh thần nhiệt huyết, không ngừng nỗ lực cùng Ban lãnh đạo An Khang Group kiến tạo những giá trị bền vững cho khách hàng và cộng đồng.`
  });

  // Dynamic Lists State
  const [educations, setEducations] = useState([
    { id: 1, year: '2005 - 2007', title: 'Thạc sĩ Quản trị Kinh doanh (MBA)', desc: 'Đại học Kinh tế TP. Hồ Chí Minh' },
    { id: 2, year: '2001 - 2005', title: 'Cử nhân Quản trị Kinh doanh', desc: 'Đại học Kinh tế TP. Hồ Chí Minh' }
  ]);

  const [expertises, setExpertises] = useState([
    { id: 1, text: 'Chiến lược phát triển doanh nghiệp' },
    { id: 2, text: 'Đầu tư và phát triển bất động sản' },
    { id: 3, text: 'Quản trị vận hành và tài chính' },
    { id: 4, text: 'Phát triển quan hệ đối tác' },
    { id: 5, text: 'Quản trị rủi ro và tuân thủ' }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, year: '2024', title: 'Top 10 Lãnh đạo Bất động sản xuất sắc', desc: 'Được vinh danh tại lễ trao giải Bất động sản Châu Á' },
    { id: 2, year: '2022', title: 'Kỷ lục doanh số dự án Masteri', desc: 'Dẫn dắt đội ngũ bán sạch 100% giỏ hàng trong 1 tuần' }
  ]);

  const [projects, setProjects] = useState([
    { id: 1, img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop', title: 'An Khang Riverside', loc: 'Quận 2, TP. Thủ Đức', role: 'Giám đốc kinh doanh', status: 'Đã hoàn thành (2023)', color: '#16a34a' },
    { id: 2, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop', title: 'An Khang City', loc: 'Thuận An, Bình Dương', role: 'Giám đốc kinh doanh', status: 'Đang triển khai (2024 - 2026)', color: '#d97706' },
    { id: 3, img: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=300&h=200&fit=crop', title: 'An Khang Central', loc: 'Quận 7, TP. Hồ Chí Minh', role: 'Giám đốc kinh doanh', status: 'Đang triển khai (2025)', color: '#d97706' },
    { id: 4, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop', title: 'Vinhomes Grand Park', loc: 'Quận 9, TP. Thủ Đức', role: 'Cố vấn chiến lược', status: 'Đã hoàn thành (2022)', color: '#16a34a' }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...formData,
        isLeader: formData.position.includes('Chủ tịch') || formData.position.includes('Giám đốc')
      });
    }
    alert('Đã lưu thông tin thành công!');
    setMode('view');
  };

  // Generic Update Array Function
  const updateArrayItem = (setter: any, id: number, field: string, value: string) => {
    setter((prev: any) => prev.map((item: any) => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeArrayItem = (setter: any, id: number) => {
    setter((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  return (
    <div className="al-detail-container">
      {/* Header */}
      <div className="al-detail-header">
        <div className="al-breadcrumb">
          Dashboard &gt; Đội ngũ lãnh đạo &gt; Quản lý lãnh đạo &gt; <span style={{ fontWeight: 600 }}>{member.name}</span>
        </div>
        <div className="al-header-actions">
          <button className="al-btn-outline" onClick={onBack}>
            <ArrowLeft size={16} /> Quay lại danh sách
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="al-profile-card">
        <div className="al-profile-left" style={{ position: 'relative' }}>
          <img src={formData.avatar} alt={formData.name} className="al-profile-img" />
          {mode === 'edit' && (
            <label className="al-img-overlay" style={{ cursor: 'pointer' }}>
              <Camera size={24} />
              <span>Thay đổi ảnh</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData({ ...formData, avatar: URL.createObjectURL(e.target.files[0]) });
                  }
                }} 
              />
            </label>
          )}
        </div>
        <div className="al-profile-right">
          <div className="al-profile-header-top">
            <div className="al-profile-title">
              {mode === 'edit' ? (
                <input name="name" value={formData.name} onChange={handleChange} className="al-edit-input title-input" />
              ) : (
                <h2>{formData.name}</h2>
              )}
              <span className="al-status-badge active">• {formData.status}</span>
            </div>
            <div className="al-profile-actions">
              {mode === 'edit' ? (
                <button className="al-btn-primary" onClick={handleSave}><CheckCircle size={14} /> Lưu thay đổi</button>
              ) : (
                <button className="al-btn-outline" onClick={() => setMode('edit')}><Edit2 size={14} /> Chỉnh sửa</button>
              )}
              <button className="al-btn-outline danger" onClick={onDeleteClick}><Trash2 size={14} /> Xóa</button>
            </div>
          </div>
          
          <div className="al-profile-role">
            {mode === 'edit' ? (
              <select 
                name="position"
                value={formData.position} 
                onChange={handleChange as any} 
                className="al-edit-input"
              >
                <option value="Chủ tịch HĐQT">Chủ tịch HĐQT</option>
                <option value="Phó Chủ tịch HĐQT">Phó Chủ tịch HĐQT</option>
                <option value="Tổng Giám đốc">Tổng Giám đốc</option>
                <option value="Phó Tổng Giám đốc">Phó Tổng Giám đốc</option>
                <option value="Giám đốc Phát triển Dự án">Giám đốc Phát triển Dự án</option>
                <option value="Giám đốc Kinh doanh">Giám đốc Kinh doanh</option>
                <option value="Giám đốc Marketing">Giám đốc Marketing</option>
                <option value="Giám đốc Tài chính">Giám đốc Tài chính</option>
                <option value="Giám đốc Nhân sự">Giám đốc Nhân sự</option>
                <option value="Cố vấn cấp cao">Cố vấn cấp cao</option>
              </select>
            ) : (
              formData.position
            )}
          </div>
          
          {mode === 'edit' ? (
            <textarea name="description" value={formData.description} onChange={handleChange} className="al-edit-textarea" rows={3} />
          ) : (
            <p className="al-profile-desc">{formData.description}</p>
          )}

          <div className="al-profile-contacts">
            <div className="al-contact-item">
              <Mail size={16} /> 
              {mode === 'edit' ? <input name="email" value={formData.email} onChange={handleChange} className="al-edit-input" /> : formData.email}
            </div>
            <div className="al-contact-item">
              <Phone size={16} /> 
              {mode === 'edit' ? <input name="phone" value={formData.phone} onChange={handleChange} className="al-edit-input" /> : formData.phone}
            </div>
            <div className="al-contact-item">
              <FacebookIcon size={16} /> {mode === 'edit' ? <input name="facebook" value={formData.facebook} onChange={handleChange} className="al-edit-input" /> : formData.facebook}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="al-tabs">
        <button 
          className={`al-tab ${activeTab === 'bio' ? 'active' : ''}`}
          onClick={() => setActiveTab('bio')}
        >
          Tiểu sử
        </button>
        <button 
          className={`al-tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Thành tựu
        </button>
        <button 
          className={`al-tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Dự án tiêu biểu
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bio' && (
        <div className="al-tab-content">
          <div className="al-bio-grid">
            {/* Column 1: Biography */}
            <div className="al-bio-col">
              <h3 className="al-col-title">TIỂU SỬ</h3>
              <div className="al-bio-text">
                {mode === 'edit' ? (
                  <>
                    <textarea name="bio1" value={formData.bio1} onChange={handleChange} className="al-edit-textarea" rows={3} style={{ marginBottom: '1rem' }} />
                    <textarea name="bio2" value={formData.bio2} onChange={handleChange} className="al-edit-textarea" rows={3} style={{ marginBottom: '1rem' }} />
                    <textarea name="bio3" value={formData.bio3} onChange={handleChange} className="al-edit-textarea" rows={3} />
                  </>
                ) : (
                  <>
                    <p>{formData.bio1}</p>
                    <p>{formData.bio2}</p>
                    <p>{formData.bio3}</p>
                  </>
                )}
              </div>
              
              <h3 className="al-col-title" style={{ marginTop: '2rem' }}>MẠNG XÃ HỘI</h3>
              <div className="al-social-links">
                {mode === 'edit' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FacebookIcon size={18} style={{ color: 'var(--text-muted)' }} /> 
                      <input name="facebook" value={formData.facebook} onChange={handleChange} className="al-edit-input" placeholder="Facebook..." />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageCircle size={18} style={{ color: 'var(--text-muted)' }} /> 
                      <input name="zalo" value={formData.zalo} onChange={handleChange} className="al-edit-input" placeholder="Zalo / Messenger..." />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <TiktokIcon size={18} style={{ color: 'var(--text-muted)' }} /> 
                      <input name="tiktok" value={formData.tiktok} onChange={handleChange} className="al-edit-input" placeholder="TikTok..." />
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="al-social-btn"><FacebookIcon size={18} /></button>
                    <button className="al-social-btn"><MessageCircle size={18} /></button>
                    <button className="al-social-btn"><TiktokIcon size={18} /></button>
                  </>
                )}
              </div>
            </div>

            {/* Column 2: Education */}
            <div className="al-bio-col al-card-col">
              <h3 className="al-col-title">HỌC VẤN</h3>
              <div className="al-timeline">
                {educations.map((edu) => (
                  <div className="al-timeline-item" key={edu.id}>
                    <div className="al-timeline-dot"></div>
                    <div className="al-timeline-content" style={{ position: 'relative' }}>
                      {mode === 'edit' && (
                        <button 
                          className="al-btn-icon delete" 
                          style={{ position: 'absolute', right: -10, top: 0, width: 24, height: 24 }}
                          onClick={() => removeArrayItem(setEducations, edu.id)}
                        >
                          <X size={12} />
                        </button>
                      )}
                      <div className="al-timeline-year">
                        {mode === 'edit' ? <input value={edu.year} onChange={(e) => updateArrayItem(setEducations, edu.id, 'year', e.target.value)} className="al-edit-input" style={{ padding: '0.2rem' }} /> : edu.year}
                      </div>
                      <div className="al-timeline-title">
                        {mode === 'edit' ? <input value={edu.title} onChange={(e) => updateArrayItem(setEducations, edu.id, 'title', e.target.value)} className="al-edit-input" style={{ padding: '0.2rem', fontWeight: 600 }} /> : edu.title}
                      </div>
                      <div className="al-timeline-desc">
                        {mode === 'edit' ? <input value={edu.desc} onChange={(e) => updateArrayItem(setEducations, edu.id, 'desc', e.target.value)} className="al-edit-input" style={{ padding: '0.2rem' }} /> : edu.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {mode === 'edit' && (
                <button 
                  className="al-btn-outline full-width" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => setEducations([...educations, { id: Date.now(), year: 'Năm...', title: 'Bằng cấp...', desc: 'Nơi đào tạo...' }])}
                >
                  <Plus size={16} /> Thêm học vấn
                </button>
              )}
            </div>

            {/* Column 3: Expertise */}
            <div className="al-bio-col al-card-col">
              <h3 className="al-col-title">LĨNH VỰC CHUYÊN MÔN</h3>
              <div className="al-expertise-list">
                {expertises.map((exp) => (
                  <div className="al-expertise-item" key={exp.id} style={{ position: 'relative', paddingRight: mode === 'edit' ? '2.5rem' : '1rem' }}>
                    <CheckCircle size={18} className="al-expertise-icon" /> 
                    {mode === 'edit' ? (
                      <input value={exp.text} onChange={(e) => updateArrayItem(setExpertises, exp.id, 'text', e.target.value)} className="al-edit-input" style={{ background: 'transparent', padding: 0, border: 'none' }} />
                    ) : (
                      exp.text
                    )}
                    {mode === 'edit' && (
                      <button 
                        className="al-btn-icon delete" 
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 24, height: 24 }}
                        onClick={() => removeArrayItem(setExpertises, exp.id)}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {mode === 'edit' && (
                <button 
                  className="al-btn-outline full-width" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => setExpertises([...expertises, { id: Date.now(), text: 'Lĩnh vực mới...' }])}
                >
                  <Plus size={16} /> Thêm lĩnh vực
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="al-tab-content al-achievements-tab">
          <div className="al-bio-col" style={{ gridColumn: '1 / -1' }}>
            <h3 className="al-col-title">THÀNH TỰU NỔI BẬT</h3>
            <div className="al-timeline" style={{ marginTop: '2rem' }}>
              {achievements.map((ach) => (
                <div className="al-timeline-item" key={ach.id}>
                  <div className="al-timeline-dot"></div>
                  <div className="al-timeline-content" style={{ position: 'relative' }}>
                    {mode === 'edit' && (
                      <button 
                        className="al-btn-icon delete" 
                        style={{ position: 'absolute', right: -10, top: 0, width: 24, height: 24 }}
                        onClick={() => removeArrayItem(setAchievements, ach.id)}
                      >
                        <X size={12} />
                      </button>
                    )}
                    <div className="al-timeline-year">
                      {mode === 'edit' ? <input value={ach.year} onChange={(e) => updateArrayItem(setAchievements, ach.id, 'year', e.target.value)} className="al-edit-input" style={{ padding: '0.2rem', width: '100px' }} /> : ach.year}
                    </div>
                    <div className="al-timeline-title">
                      {mode === 'edit' ? <input value={ach.title} onChange={(e) => updateArrayItem(setAchievements, ach.id, 'title', e.target.value)} className="al-edit-input" style={{ fontWeight: 'bold' }} /> : ach.title}
                    </div>
                    <div className="al-timeline-desc">
                      {mode === 'edit' ? <textarea value={ach.desc} onChange={(e) => updateArrayItem(setAchievements, ach.id, 'desc', e.target.value)} className="al-edit-textarea" rows={2} /> : ach.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {mode === 'edit' && (
              <button 
                className="al-btn-outline full-width" 
                style={{ marginTop: '2rem' }}
                onClick={() => setAchievements([...achievements, { id: Date.now(), year: 'Năm...', title: 'Thành tựu...', desc: 'Mô tả...' }])}
              >
                <Plus size={16} /> Thêm thành tựu
              </button>
            )}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="al-tab-content">
          <div className="al-bio-col" style={{ gridColumn: '1 / -1', background: 'transparent', border: 'none', padding: 0 }}>
            <div className="al-projects-grid">
              {projects.map((proj) => (
                <div className="al-project-card" key={proj.id} style={{ position: 'relative' }}>
                  {mode === 'edit' && (
                    <button 
                      className="al-btn-icon delete" 
                      style={{ position: 'absolute', right: 8, top: 8, zIndex: 10, background: '#fff' }}
                      onClick={() => removeArrayItem(setProjects, proj.id)}
                    >
                      <X size={14} />
                    </button>
                  )}
                  {mode === 'edit' ? (
                    <div style={{ position: 'relative' }}>
                      <img src={proj.img} alt={proj.title} />
                      <label className="al-img-overlay" style={{ cursor: 'pointer' }}>
                        <Camera size={24} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              updateArrayItem(setProjects, proj.id, 'img', URL.createObjectURL(e.target.files[0]));
                            }
                          }} 
                        />
                      </label>
                    </div>
                  ) : (
                    <img src={proj.img} alt={proj.title} />
                  )}
                  <div className="al-project-info">
                    <h4>
                      {mode === 'edit' ? <input value={proj.title} onChange={(e) => updateArrayItem(setProjects, proj.id, 'title', e.target.value)} className="al-edit-input" style={{ padding: '0.2rem' }} /> : proj.title}
                    </h4>
                    <p className="al-project-loc" style={{ margin: mode === 'edit' ? '0.25rem 0' : '0 0 0.5rem 0' }}>
                      {mode === 'edit' ? <input value={proj.loc} onChange={(e) => updateArrayItem(setProjects, proj.id, 'loc', e.target.value)} className="al-edit-input" style={{ padding: '0.2rem' }} /> : proj.loc}
                    </p>
                    <p className="al-project-role">
                      {mode === 'edit' ? <input value={proj.role} onChange={(e) => updateArrayItem(setProjects, proj.id, 'role', e.target.value)} className="al-edit-input" style={{ padding: '0.2rem' }} /> : proj.role}
                    </p>
                    <div className="al-project-status" style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: proj.color, fontWeight: 500 }}>
                      {mode === 'edit' ? <input value={proj.status} onChange={(e) => updateArrayItem(setProjects, proj.id, 'status', e.target.value)} className="al-edit-input" style={{ padding: '0.2rem' }} /> : `• ${proj.status}`}
                    </div>
                  </div>
                </div>
              ))}
              
              {mode === 'edit' && (
                <div 
                  className="al-project-card add-new"
                  onClick={() => setProjects([...projects, { id: Date.now(), img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop', title: 'Tên dự án mới', loc: 'Địa điểm', role: 'Vai trò', status: 'Trạng thái', color: '#16a34a' }])}
                >
                  <Plus size={24} color="var(--gold-accent)" />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Thêm dự án tham gia</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
