import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Maximize, Building, ShieldCheck, 
  ChevronLeft, ChevronRight, CheckCircle2, Package
} from 'lucide-react';
import LoanCalculator from '../../components/shared/LoanCalculator';
import { contactsAPI, projectsAPI } from '../../lib/api';
import './ProjectDetail.css';

interface ProjectDetailProps {
  onBack: () => void;
  projectSlug?: string;
}

export default function ProjectDetail({ onBack, projectSlug }: ProjectDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectSlug) {
      setIsLoading(false);
      return;
    }
    projectsAPI.getBySlug(projectSlug)
      .then(setProject)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [projectSlug]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    setIsSubmitting(true);
    try {
      await contactsAPI.send({
        name: contactName,
        phone: contactPhone,
        email: '',
        message: `Đăng ký nhận thông tin dự án: ${project?.name}`,
      });
      alert('Cảm ơn bạn đã quan tâm. Chúng tôi sẽ liên hệ lại sớm nhất!');
      setContactName('');
      setContactPhone('');
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const getImgUrl = (path: string) => {
    if (!path) return 'https://placehold.co/1200x600?text=No+Image';
    if (path.startsWith('http')) return path;
    return `${BASE_URL.replace('/api', '')}${path}`;
  };

  const defaultImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop"
  ];
  const images = project?.images?.length > 0 
    ? project.images.map((img: any) => getImgUrl(img.url)) 
    : defaultImages;

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);

  if (isLoading) {
    return (
      <div className="project-detail-page" style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--text-main)' }}>
        <h2>Đang tải thông tin dự án...</h2>
      </div>
    );
  }

  if (!project) {
    setTimeout(onBack, 0);
    return null;
  }

  const amenitiesList = project.amenities ? JSON.parse(project.amenities) : [];
  const projectLocation = [project.ward, project.province].filter(Boolean).join(', ') || project.location || 'Đang cập nhật';

  return (
    <div className="project-detail-page">
      <div className="pd-container">
        {/* Back Button */}
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} /> Quay lại danh sách dự án
        </button>

        <div className="pd-main-layout">
          {/* LEFT COLUMN */}
          <div className="pd-left-col">
            {/* Gallery */}
            <div className="pd-gallery">
              <div className="pd-main-image-wrapper">
                <span className="pd-badge">{project.category || 'Dự án'}</span>
                <img src={images[currentImageIndex]} alt="Project main" className="pd-main-image" />
                <button className="pd-nav-btn prev" onClick={prevImage}><ChevronLeft size={24} /></button>
                <button className="pd-nav-btn next" onClick={nextImage}><ChevronRight size={24} /></button>
                <div className="pd-image-counter">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
              <div className="pd-thumbnails">
                {images.map((img: string, idx: number) => (
                  <div 
                    key={idx} 
                    className={`pd-thumb ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img src={img} alt={`Thumb ${idx}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Overview Content */}
            <div className="pd-overview-row" style={{ display: 'block', marginTop: '2rem' }}>
              <div className="pd-overview-content" style={{ width: '100%', paddingRight: 0 }}>
                <h3 className="pd-section-title">Tổng quan dự án</h3>
                {project.content ? (
                  <div className="pd-desc custom-html-content" dangerouslySetInnerHTML={{ __html: project.content }}></div>
                ) : (
                  <div className="pd-desc" style={{ whiteSpace: 'pre-line' }}>
                    {project.description || 'Đang cập nhật thông tin tổng quan...'}
                  </div>
                )}

                {/* Amenities */}
                {amenitiesList.length > 0 && (
                  <div style={{ marginTop: '2rem' }}>
                    <h3 className="pd-section-title">Tiện ích nổi bật</h3>
                    <ul className="pd-features-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      {amenitiesList.map((am: string, i: number) => (
                        <li key={i}><CheckCircle2 size={16} className="text-gold" /> {am}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>


          </div>

          {/* RIGHT COLUMN */}
          <div className="pd-right-col">
            <h1 className="pd-title">{project.name}</h1>
            <p className="pd-address">
              <MapPin size={16} /> {projectLocation}
            </p>

            <div className="pd-stats-grid">
              <div className="pd-stat-item highlight">
                <div className="stat-val"><span className="text-gold">{project.status || 'Đang mở bán'}</span></div>
                <div className="stat-label">Trạng thái</div>
              </div>
              <div className="pd-stat-item">
                <Maximize size={20} className="stat-icon" />
                <div>
                  <div className="stat-val">{project.area || '-'}</div>
                  <div className="stat-label">Diện tích</div>
                </div>
              </div>
              <div className="pd-stat-item">
                <Package size={20} className="stat-icon" />
                <div>
                  <div className="stat-val">{project.totalUnits || '-'}</div>
                  <div className="stat-label">Số lượng SP</div>
                </div>
              </div>
              <div className="pd-stat-item">
                <Building size={20} className="stat-icon" />
                <div>
                  <div className="stat-val">{project.roomCount || '-'}</div>
                  <div className="stat-label">Số phòng</div>
                </div>
              </div>
            </div>

            <div className="pd-highlights">
              <h4 className="pd-highlights-title">Tổng quan</h4>
              <div className="pd-highlights-grid">
                <span><MapPin size={14} className="text-gold" /> Vị trí đắc địa</span>
                <span><ShieldCheck size={14} className="text-gold" /> Tiện ích đẳng cấp</span>
                <span><ShieldCheck size={14} className="text-gold" /> Pháp lý minh bạch</span>
                <span><ShieldCheck size={14} className="text-gold" /> Chủ đầu tư uy tín</span>
              </div>
            </div>

            <div className="pd-info-table">
              <div className="pd-info-row">
                <span className="pd-info-label">Chủ đầu tư</span>
                <span className="pd-info-val">{project.developer || 'Đang cập nhật'}</span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Đơn vị phát triển</span>
                <span className="pd-info-val">{project.partner || 'Đang cập nhật'}</span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Khu vực</span>
                <span className="pd-info-val">{projectLocation}</span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Hình thức sở hữu</span>
                <span className="pd-info-val">{project.ownership || 'Đang cập nhật'}</span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Pháp lý</span>
                <span className="pd-info-val">{project.legal || 'Đang cập nhật'}</span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Thời gian bàn giao</span>
                <span className="pd-info-val">{project.handoverDate || 'Đang cập nhật'}</span>
              </div>
            </div>

            <div className="pd-action-btns">
              <button 
                className="btn-solid-gold" 
                onClick={() => window.open('https://www.facebook.com/profile.php?id=61586613410937', '_blank')}
                style={{ width: '100%', padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Liên hệ tư vấn
              </button>
            </div>

            {/* Properties List within Project could go here later */}
          </div>
        </div>

        {/* Location image + contact form (Full Width) */}
        {(project.mapImage || project.mapAddress) && (
          <div className="pd-location-contact-section">
            <div className="pd-location-image-panel">
              <h3 className="pd-section-title">Vị trí dự án</h3>
              {project.mapAddress && (
                <p className="pd-location-caption">
                  <MapPin size={16} className="text-gold" /> {project.mapAddress}
                </p>
              )}
              <div className="pd-map-image-box">
                {project.mapImage ? (
                  <img src={getImgUrl(project.mapImage)} alt={`Vị trí dự án ${project.name}`} />
                ) : (
                  <div className="pd-map-image-empty">Chưa có ảnh vị trí</div>
                )}
              </div>
            </div>

            <div className="pd-contact-card">
              <h4 className="pd-contact-title">Đăng ký nhận thông tin</h4>
              <p className="pd-contact-desc">Nhận tư vấn chi tiết về dự án và bảng giá mới nhất.</p>
              <form className="pd-contact-form" onSubmit={handleContactSubmit}>
                <input 
                  type="text" 
                  placeholder="Họ và tên của bạn" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required 
                />
                <input 
                  type="tel" 
                  placeholder="Số điện thoại liên hệ" 
                  value={contactPhone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setContactPhone(val);
                  }}
                  required 
                />
                <button 
                  type="submit" 
                  className="btn-solid-gold" 
                  disabled={isSubmitting}
                  style={{ cursor: isSubmitting ? 'wait' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
      
      {/* Loan Calculator Section */}
      <div className="pd-container" style={{ marginTop: '4rem' }}>
        <LoanCalculator />
      </div>
    </div>
  );
}
