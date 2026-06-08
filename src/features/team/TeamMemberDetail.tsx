import React, { useState } from 'react';
import { 
  ArrowLeft, Mail, Phone, Award, Building, UserCheck, CheckCircle2
} from 'lucide-react';

const FacebookIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const ZaloIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <text x="12" y="15" fontSize="10" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">Z</text>
  </svg>
);

const TiktokIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.5v6.5a8 8 0 1 1-8-8v3a5 5 0 0 0 4 5z" />
  </svg>
);

import './TeamMemberDetail.css';
import { membersAPI } from '../../lib/api';

interface TeamMemberDetailProps {
  onBack: () => void;
  memberId?: number;
}

export default function TeamMemberDetail({ onBack, memberId }: TeamMemberDetailProps) {
  const [activeTab, setActiveTab] = useState('tieusu');
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchMember = async () => {
      try {
        setIsLoading(true);
        const allMembers = await membersAPI.getAll();
        const found = allMembers.find((m: any) => m.id === memberId);
        setMember(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (memberId !== undefined) {
      fetchMember();
    }
  }, [memberId]);

  if (isLoading) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>Đang tải thông tin...</div>;
  }

  if (!member) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>
        <h2>Không tìm thấy thành viên</h2>
        <button onClick={onBack} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="team-detail-page">
      <div className="td-container">
        
        {/* Top Bar */}
        <div className="td-top-bar">
          <div className="td-breadcrumbs">
            <button className="btn-back-text" onClick={onBack}>Trang chủ</button> 
            <span>&gt;</span>
            <span onClick={onBack} style={{cursor: 'pointer'}}>Về An Khang Group</span> 
            <span>&gt;</span>
            <span onClick={onBack} style={{cursor: 'pointer'}}>Đội ngũ lãnh đạo</span> 
            <span>&gt;</span>
            <span className="current text-gold">{member.name}</span>
          </div>
          <button className="td-btn-back" onClick={onBack}>
            <ArrowLeft size={20} /> Quay lại
          </button>
        </div>

        {/* Header Profile Section */}
        <div className="td-profile-header">
          {/* LEFT: Image */}
          <div className="td-profile-image-col">
            <img 
              src={member.avatar || 'https://placehold.co/800x800?text=No+Image'} 
              alt={member.name} 
              className="td-main-img" 
            />
          </div>

          {/* RIGHT: Info */}
          <div className="td-profile-info-col">
            <h1 className="td-name">{member.name}</h1>
            <div className="td-role-badge">{member.position}</div>
            
            <p className="td-bio-short">
              {member.description || 'Chưa có tiểu sử.'}
            </p>

            <div className="td-contact-list">
              <div className="td-contact-item">
                <Mail size={16} className="text-muted" />
                <span>{member.email}</span>
              </div>
              {member.zalo && (
                <div className="td-contact-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <a href={member.zalo.startsWith('http') ? member.zalo : `https://${member.zalo}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'inherit', textDecoration: 'none' }}>
                    <ZaloIcon size={16} className="text-muted" />
                    <span style={{ marginLeft: '2px' }}>{member.zalo}</span>
                  </a>
                </div>
              )}
              {member.facebook && (
                <div className="td-contact-item">
                  <a href={member.facebook.startsWith('http') ? member.facebook : `https://${member.facebook}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}>
                    <FacebookIcon size={16} className="text-muted" />
                    <span>{member.facebook}</span>
                  </a>
                </div>
              )}
              {member.tiktok && (
                <div className="td-contact-item">
                  <a href={member.tiktok.startsWith('http') ? member.tiktok : `https://${member.tiktok}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}>
                    <TiktokIcon size={16} className="text-muted" />
                    <span>{member.tiktok}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid (3 columns) */}
        <div className="td-details-grid">
          
          {/* Column 1: Tabs & Content (40%) */}
          <div className="td-col-content">
            <div className="td-tabs">
              <button 
                className={`td-tab ${activeTab === 'tieusu' ? 'active' : ''}`}
                onClick={() => setActiveTab('tieusu')}
              >
                TIỂU SỬ
              </button>
              <button 
                className={`td-tab ${activeTab === 'thanhtuu' ? 'active' : ''}`}
                onClick={() => setActiveTab('thanhtuu')}
              >
                THÀNH TỰU
              </button>
              <button 
                className={`td-tab ${activeTab === 'duan' ? 'active' : ''}`}
                onClick={() => setActiveTab('duan')}
              >
                DỰ ÁN TIÊU BIỂU
              </button>
            </div>

            <div className="td-tab-content">
              {activeTab === 'tieusu' && (
                <>
                  <p>
                    {member.description || 'Chưa có tiểu sử.'}
                  </p>
                  {member.name && (
                    <>
                      <p>
                        Trước khi gia nhập An Khang Group, {member.name.split(' ').pop()} đã có nhiều năm kinh nghiệm làm việc trong lĩnh vực chuyên môn, góp phần xây dựng nền tảng vững chắc và định hình sự phát triển cho nhiều dự án và chiến lược quan trọng.
                      </p>
                      <p>
                        Với tầm nhìn chiến lược và tinh thần nhiệt huyết, {member.name.split(' ').pop()} không ngừng nỗ lực cùng Ban lãnh đạo An Khang Group kiến tạo những giá trị bền vững cho khách hàng và cộng đồng.
                      </p>
                    </>
                  )}
                </>
              )}
              {activeTab === 'thanhtuu' && (
                <ul className="td-expertise-list" style={{ marginTop: '1.5rem', gap: '1.5rem' }}>
                  <li style={{ alignItems: 'flex-start' }}>
                    <Award size={20} className="text-gold" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--gold-accent)', marginBottom: '0.3rem' }}>Doanh nhân tiêu biểu 2023</strong>
                      <span className="text-muted">Được vinh danh bởi Hiệp hội Bất động sản Việt Nam vì những đóng góp xuất sắc cho sự phát triển của ngành bất động sản khu vực phía Nam.</span>
                    </div>
                  </li>
                  <li style={{ alignItems: 'flex-start' }}>
                    <Award size={20} className="text-gold" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--gold-accent)', marginBottom: '0.3rem' }}>Top 10 Lãnh đạo Truyền cảm hứng</strong>
                      <span className="text-muted">Do tạp chí Forbes Việt Nam bình chọn năm 2022 nhờ tầm nhìn chiến lược và khả năng vượt qua thách thức đại dịch.</span>
                    </div>
                  </li>
                  <li style={{ alignItems: 'flex-start' }}>
                    <Award size={20} className="text-gold" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--gold-accent)', marginBottom: '0.3rem' }}>Thương hiệu Vàng Đông Nam Á</strong>
                      <span className="text-muted">Đưa An Khang Group đạt giải thưởng uy tín khu vực năm 2021, khẳng định vị thế và uy tín trên thị trường quốc tế.</span>
                    </div>
                  </li>
                  <li style={{ alignItems: 'flex-start' }}>
                    <Award size={20} className="text-gold" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--gold-accent)', marginBottom: '0.3rem' }}>Giải thưởng Sao Vàng Đất Việt 2020</strong>
                      <span className="text-muted">Ghi nhận những đóng góp thiết thực cho cộng đồng, xã hội thông qua các quỹ học bổng và dự án thiện nguyện.</span>
                    </div>
                  </li>
                </ul>
              )}
              {activeTab === 'duan' && (
                <ul className="td-expertise-list" style={{ marginTop: '1.5rem', gap: '1.5rem' }}>
                  <li style={{ alignItems: 'flex-start' }}>
                    <Building size={20} className="text-gold" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.3rem', fontSize: '1.05rem' }}>Khu đô thị sinh thái An Khang Riverside</strong>
                      <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Siêu dự án quy mô 150ha ven sông, bao gồm hơn 3.000 sản phẩm biệt thự và nhà phố. Tổng vốn đầu tư hơn 5.000 tỷ VNĐ.<br/>
                        <span style={{ color: 'var(--gold-accent)', fontSize: '0.85rem' }}>Trạng thái: Đã bàn giao (2022)</span>
                      </p>
                    </div>
                  </li>
                  <li style={{ alignItems: 'flex-start' }}>
                    <Building size={20} className="text-gold" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.3rem', fontSize: '1.05rem' }}>Tổ hợp thương mại cao cấp An Khang Plaza</strong>
                      <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Dự án lõi trung tâm thành phố với 4 tháp căn hộ hạng sang và 1 trung tâm thương mại 6 tầng chuẩn quốc tế.<br/>
                        <span style={{ color: 'var(--gold-accent)', fontSize: '0.85rem' }}>Trạng thái: Bàn giao (2021)</span>
                      </p>
                    </div>
                  </li>
                  <li style={{ alignItems: 'flex-start' }}>
                    <Building size={20} className="text-gold" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.3rem', fontSize: '1.05rem' }}>Khu nghỉ dưỡng 5 sao An Khang Resort & Spa</strong>
                      <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Quần thể 200 biệt thự nghỉ dưỡng ven biển tích hợp chuỗi tiện ích Wellness & Spa cao cấp tại Phú Quốc.<br/>
                        <span style={{ color: '#10b981', fontSize: '0.85rem' }}>Trạng thái: Đang triển khai (Dự kiến 2025)</span>
                      </p>
                    </div>
                  </li>
                  <li style={{ alignItems: 'flex-start' }}>
                    <Building size={20} className="text-gold" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.3rem', fontSize: '1.05rem' }}>Cụm công nghiệp Xanh An Khang</strong>
                      <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Dự án bất động sản công nghiệp quy mô 300ha, tiên phong đạt chuẩn LEED, hiện đang thu hút hơn 50+ nhà đầu tư FDI.<br/>
                        <span style={{ color: '#10b981', fontSize: '0.85rem' }}>Trạng thái: Vừa khởi công (2024)</span>
                      </p>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Column 2: Education (30%) */}
          <div className="td-col-box">
            <div className="td-box">
              <h3 className="td-box-title">HỌC VẤN</h3>
              
              <div className="td-timeline">
                <div className="td-timeline-item">
                  <div className="td-tl-dot"></div>
                  <div className="td-tl-year">2005 – 2007</div>
                  <div className="td-tl-title">Thạc sĩ Quản trị Kinh doanh (MBA)</div>
                  <div className="td-tl-desc">Đại học Kinh tế TP. Hồ Chí Minh</div>
                </div>
                
                <div className="td-timeline-item">
                  <div className="td-tl-dot"></div>
                  <div className="td-tl-year">2001 – 2005</div>
                  <div className="td-tl-title">Cử nhân Quản trị Kinh doanh</div>
                  <div className="td-tl-desc">Đại học Kinh tế TP. Hồ Chí Minh</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Expertise (30%) */}
          <div className="td-col-box">
            <div className="td-box">
              <h3 className="td-box-title">LĨNH VỰC CHUYÊN MÔN</h3>
              
              <ul className="td-expertise-list">
                <li>
                  <CheckCircle2 size={16} className="text-gold" />
                  <span>Chiến lược phát triển doanh nghiệp</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-gold" />
                  <span>Đầu tư và phát triển bất động sản</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-gold" />
                  <span>Quản trị vận hành và tài chính</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-gold" />
                  <span>Phát triển quan hệ đối tác</span>
                </li>
                <li>
                  <CheckCircle2 size={16} className="text-gold" />
                  <span>Quản trị rủi ro và tuân thủ</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
