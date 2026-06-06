import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Maximize, BedDouble, ShieldCheck, 
  Map, Download, PhoneCall, ChevronLeft, ChevronRight, CheckCircle2
} from 'lucide-react';
import LoanCalculator from '../../components/shared/LoanCalculator';
import { contactsAPI, propertiesAPI } from '../../lib/api';
import './ProjectDetail.css';

interface ProjectDetailProps {
  onBack: () => void;
  projectId?: number;
}

export default function ProjectDetail({ onBack, projectId }: ProjectDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }
    propertiesAPI.getById(projectId)
      .then(setProperty)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [projectId]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    setIsSubmitting(true);
    try {
      await contactsAPI.send({
        name: contactName,
        phone: contactPhone,
        email: '',
        message: 'Đăng ký nhận thông tin dự án từ trang Chi tiết dự án.',
        propertyId: projectId
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

  const defaultImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop"
  ];
  const images = property?.images?.length > 0 
    ? property.images.map((img: any) => img.url) 
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

  if (!property) {
    // Automatically go back if project not found
    setTimeout(onBack, 0);
    return null;
  }

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
                <span className="pd-badge">{property.type === 'LAND' ? 'Đất nền' : (property.type === 'HOUSE' ? 'Nhà phố' : property.type)}</span>
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

            {/* Overview & Map */}
            <div className="pd-overview-row">
              <div className="pd-overview-content">
                <h3 className="pd-section-title">Tổng quan dự án</h3>
                <div className="pd-desc" style={{ whiteSpace: 'pre-line' }}>
                  {property.description || 'Đang cập nhật thông tin tổng quan...'}
                </div>
                <ul className="pd-features-list">
                  <li><CheckCircle2 size={16} className="text-gold" /> Công viên 36ha - lớn nhất Đông Nam Á</li>
                  <li><CheckCircle2 size={16} className="text-gold" /> Hệ thống trường học Vinschool, bệnh viện Vinmec</li>
                  <li><CheckCircle2 size={16} className="text-gold" /> Trung tâm thương mại Vincom Mega Mall</li>
                  <li><CheckCircle2 size={16} className="text-gold" /> Hệ thống an ninh 24/7, quản lý thông minh</li>
                </ul>
              </div>
              
              <div className="pd-map-box">
                {property.mapImage ? (
                  <img src={property.mapImage} alt="Map" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '300px', borderRadius: '8px' }} />
                ) : (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.0785999027185!2d106.8573159748076!3d10.957435289202586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dd00658c1907%3A0xc09d80dd5e6f5bb3!2zQuG6pXQgxJDhu5luZyBT4bqjbiBBbiBLaGFuZyBHcm91cA!5e0!3m2!1svi!2s!4v1780473565713!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map An Khang Group"
                  ></iframe>
                )}
              </div>
            </div>
            


          </div>

          {/* RIGHT COLUMN */}
          <div className="pd-right-col">
            <h1 className="pd-title">{property.title}</h1>
            <p className="pd-address">
              <MapPin size={16} /> {property.address}
            </p>

            <div className="pd-stats-grid">
              <div className="pd-stat-item highlight">
                <div className="stat-val"><span className="text-gold">{(Number(property.price) || 0).toLocaleString('vi-VN')}</span> VNĐ/căn</div>
                <div className="stat-label">Giá bán</div>
              </div>
              <div className="pd-stat-item">
                <Maximize size={20} className="stat-icon" />
                <div>
                  <div className="stat-val">{property.area} m²</div>
                  <div className="stat-label">Diện tích</div>
                </div>
              </div>
              <div className="pd-stat-item">
                <BedDouble size={20} className="stat-icon" />
                <div>
                  <div className="stat-val">{property.bedrooms || '-'}</div>
                  <div className="stat-label">Phòng ngủ</div>
                </div>
              </div>
            </div>

            <div className="pd-highlights">
              <h4 className="pd-highlights-title">Điểm nổi bật</h4>
              <div className="pd-highlights-grid">
                <span><MapPin size={14} className="text-gold" /> Vị trí đắc địa</span>
                <span><ShieldCheck size={14} className="text-gold" /> Tiện ích đẳng cấp</span>
                <span><ShieldCheck size={14} className="text-gold" /> Pháp lý minh bạch</span>
                <span><ShieldCheck size={14} className="text-gold" /> Chủ đầu tư uy tín</span>
              </div>
            </div>

            <div className="pd-info-table">
              <div className="pd-info-row">
                <span className="pd-info-label">Loại hình</span>
                <span className="pd-info-val">
                  {property.type === 'APARTMENT' ? 'Căn hộ' : property.type === 'HOUSE' ? 'Nhà phố' : property.type === 'LAND' ? 'Đất nền' : property.type}
                </span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Dự án khu vực</span>
                <span className="pd-info-val">{property.project?.name || 'Đang cập nhật'}</span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Pháp lý</span>
                <span className="pd-info-val">{property.legal || 'Đang cập nhật'}</span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Hướng</span>
                <span className="pd-info-val">{property.direction || 'Đang cập nhật'}</span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Số phòng tắm</span>
                <span className="pd-info-val">{property.bathrooms ? `${property.bathrooms} phòng` : 'Đang cập nhật'}</span>
              </div>
              <div className="pd-info-row">
                <span className="pd-info-label">Trạng thái</span>
                <span className="pd-info-val">{property.status === 'AVAILABLE' ? 'Đang mở bán' : property.status}</span>
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
          </div>
        </div>

        {/* Slim Horizontal Contact Form */}
        <div className="pd-contact-slim">
          <h4 className="pd-contact-slim-title">
            Đăng ký nhận thông tin
          </h4>
          <form className="pd-contact-slim-form" onSubmit={handleContactSubmit}>
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
      
      {/* Loan Calculator Section */}
      <div className="pd-container">
        <LoanCalculator />
      </div>
    </div>
  );
}
