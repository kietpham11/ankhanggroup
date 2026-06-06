import React, { useState, useEffect } from 'react';
import {
  Building2, ShieldCheck, Users, Handshake, Heart, Lightbulb,
  Award, TrendingUp, MapPin, ChevronRight, Mail,
  Briefcase
} from 'lucide-react';

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);
const ZaloIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21.54 11.02c0-3.64-3.51-6.6-7.85-6.6s-7.85 2.96-7.85 6.6c0 1.99 1.05 3.76 2.71 4.96.18.96-.34 2.45-1.04 3.42-.09.13-.15.28-.15.43 0 .44.36.8.8.8.2 0 .4-.07.56-.2.61-.47 1.83-1.63 2.76-2.5 1 .37 2.13.58 3.32.58 4.34 0 7.85-2.96 7.85-6.6zm-11.83 1.25h-1.61v-3.32h4.08v1.17h-2.47v.4h2.18v1.12h-2.18v.63zm5.07-.64c0 .48-.39.87-.87.87h-1.6c-.48 0-.87-.39-.87-.87v-1.6c0-.48.39-.87.87-.87h1.6c.48 0 .87.39.87.87v1.6z"/></svg>
);
const TiktokIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.51.3-5.26 2.34-6.9 1.04-.84 2.39-1.35 3.75-1.42v4.26c-.72.03-1.45.2-2.03.66-.75.59-1.21 1.55-1.12 2.53.07 1.06.75 2.11 1.74 2.51.89.36 1.97.24 2.75-.32.61-.44 1.02-1.12 1.16-1.85.12-.66.1-1.35.1-2.03-.01-4.47-.02-8.94-.03-13.41h4.08z"/></svg>
);
import './About.css';
import { membersAPI } from '../lib/api';

const stats = [
  { icon: <Award size={24} />, number: '10+', label: 'Năm kinh nghiệm\ntrên thị trường' },
  { icon: <TrendingUp size={24} />, number: '1.250+', label: 'Giao dịch thành công\ntrên toàn quốc' },
  { icon: <Users size={24} />, number: '5.000+', label: 'Khách hàng\nđã tin tưởng' },
  { icon: <MapPin size={24} />, number: '20+', label: 'Tỉnh thành\nđã triển khai dự án' },
];

const coreValues = [
  {
    icon: <ShieldCheck size={26} />,
    title: 'Chính trực',
    desc: 'Minh bạch, trung thực trong mọi thông tin và giao dịch.',
  },
  {
    icon: <Lightbulb size={26} />,
    title: 'Sáng tạo',
    desc: 'Không ngừng đổi mới để mang đến giải pháp tối ưu cho khách hàng.',
  },
  {
    icon: <Handshake size={26} />,
    title: 'Hợp tác',
    desc: 'Xây dựng mối quan hệ bền vững cùng đối tác và khách hàng.',
  },
  {
    icon: <Heart size={26} />,
    title: 'Tận tâm',
    desc: 'Luôn đặt lợi ích của khách hàng làm trung tâm trong mọi hoạt động.',
  },
];

// Removed static teamMembers

export default function About({ onViewTeamMember }: { onViewTeamMember?: (id: number) => void }) {
  const [bgIndex, setBgIndex] = useState(0);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  const bgImages = [
    "/images/banner1.png",
    "/images/banner2.png",
    "/images/banner3.png"
  ];

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await membersAPI.getAll();
        // Filter out members that are not set to display
        setTeamMembers(data.filter((m: any) => m.status === 'Đang hiển thị'));
      } catch (error) {
        console.error('Failed to fetch leadership team:', error);
      }
    };
    
    fetchMembers();
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="about-page">
      <div className="about-top-bg">
        {bgImages.map((img, idx) => (
          <div 
            key={idx}
            className={`about-bg-slide ${idx === bgIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        <div className="about-bg-overlay"></div>
        
        <div className="about-top-content">
          {/* Breadcrumb */}
        <div className="about-breadcrumb">
          <a href="#home">Trang chủ</a>
          <span className="breadcrumb-sep">&gt;</span>
          <span className="breadcrumb-current">Về chúng tôi</span>
        </div>

        {/* Hero */}
        <section className="about-hero about-animate">
          <h1>
            <span>An Khang Group</span>
          </h1>
          <p className="about-hero-desc">
            An Khang Group – Đối tác tin cậy trong hành trình
            tìm kiếm tổ ấm và đầu tư bất động sản của bạn.
          </p>

          <div className="about-highlights">
            <div className="about-highlight-item about-animate about-animate-delay-1">
              <div className="about-highlight-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="about-highlight-text">
                <h4>Uy tín</h4>
                <p>Đặt chữ tín lên hàng đầu trong mọi cam kết với khách hàng.</p>
              </div>
            </div>
            <div className="about-highlight-item about-animate about-animate-delay-2">
              <div className="about-highlight-icon">
                <Briefcase size={20} />
              </div>
              <div className="about-highlight-text">
                <h4>Chuyên nghiệp</h4>
                <p>Đội ngũ giàu kinh nghiệm, hiểu thị trường và tận tâm.</p>
              </div>
            </div>
            <div className="about-highlight-item about-animate about-animate-delay-3">
              <div className="about-highlight-icon">
                <Heart size={20} />
              </div>
              <div className="about-highlight-text">
                <h4>Đồng hành</h4>
                <p>Luôn đồng hành cùng khách hàng trong suốt quá trình giao dịch.</p>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>

      {/* Stats */}
      <section className="about-stats">
        {stats.map((s, i) => (
          <div className="about-stat-item about-animate" style={{ animationDelay: `${i * 0.15}s` }} key={i}>
            <div className="about-stat-icon">{s.icon}</div>
            <div>
              <div className="about-stat-number">{s.number}</div>
              <div className="about-stat-label">{s.label.split('\n').map((line, li) => (
                <span key={li}>{line}{li === 0 && <br />}</span>
              ))}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Company Intro */}
      <section className="about-intro about-animate">
        <div className="about-intro-image">
          <img src="/images/about-hero.png" alt="Golden Land Office" />
          <div className="about-intro-logo-overlay" style={{ padding: '0.4rem 0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src="/images/logo-final.png" 
              alt="An Khang Group" 
              style={{ height: '56px', width: 'auto', objectFit: 'contain', transform: 'scale(1.15)' }} 
            />
          </div>
        </div>
        <div className="about-intro-content">
          <div className="about-intro-label">Về chúng tôi</div>
          <h2 className="about-intro-title">Kiến tạo giá trị bền vững</h2>
          <p className="about-intro-text">
            An Khang Group được thành lập với sứ mệnh mang đến những sản phẩm
            bất động sản chất lượng, pháp lý minh bạch và giá trị bền vững cho khách hàng.
          </p>
          <p className="about-intro-text">
            Chúng tôi không ngừng nỗ lực để trở thành thương hiệu bất động sản hàng đầu,
            dựa trên nền tảng uy tín, chuyên nghiệp và sự tận tâm.
          </p>
          <button className="about-intro-btn">
            Tìm hiểu thêm <ChevronRight size={16} />
          </button>
        </div>
      </section>



      {/* Leadership Team */}
      <section className="about-team">
        <div className="about-team-header">
          <div className="about-team-label">Đội ngũ lãnh đạo</div>
          <button className="about-team-viewall">
            Xem tất cả <ChevronRight size={14} />
          </button>
        </div>
        <div className="about-team-grid">
          {teamMembers.map((m, i) => (
            <div className="about-team-card about-animate" style={{ animationDelay: `${i * 0.12}s`, cursor: 'pointer' }} key={m.id || i} onClick={() => onViewTeamMember && onViewTeamMember(m.id)}>
              <div className="about-team-img">
                <img src={m.avatar || 'https://placehold.co/400x500?text=No+Image'} alt={m.name} />
              </div>
              <div className="about-team-info">
                <h4>{m.name}</h4>
                <span className="about-team-role">{m.position}</span>
                <p className="about-team-desc">{m.description}</p>
                <div className="about-team-socials">
                  <a href={m.facebook || '#'} target="_blank" rel="noreferrer" aria-label="Facebook" onClick={(e) => { e.stopPropagation(); if (!m.facebook) e.preventDefault(); }}><FacebookIcon /></a>
                  <a href={m.zalo || '#'} target="_blank" rel="noreferrer" aria-label="Zalo" onClick={(e) => { e.stopPropagation(); if (!m.zalo) e.preventDefault(); }}><ZaloIcon /></a>
                  <a href={m.tiktok || '#'} target="_blank" rel="noreferrer" aria-label="Tiktok" onClick={(e) => { e.stopPropagation(); if (!m.tiktok) e.preventDefault(); }}><TiktokIcon /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
