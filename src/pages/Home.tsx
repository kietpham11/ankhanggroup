import React, { useState, useEffect } from 'react';
import {
  Building2, Search, MapPin, BadgeDollarSign, Maximize,
  ShieldCheck, Map, Clock, Heart, BedDouble, Bath, ChevronRight, ChevronLeft,
  LayoutDashboard, Briefcase, ArrowRight
} from 'lucide-react';
import { projectsAPI } from '../lib/api';

const bannerImages = [
  "/images/banner1.png",
  "/images/banner2.png",
  "/images/banner3.png"
];

interface HomeProps {
  onViewDetail?: (slug: string) => void;
  onViewAllProjects?: () => void;
  banners?: string[];
}

export default function Home({ onViewDetail, onViewAllProjects, banners = [] }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    projectsAPI.getAll({ showOnHome: 'true' })
      .then((data: any[]) => {
        // Chỉ hiển thị dự án đã được admin bật "Hiển thị trang chủ" hoặc "Nổi bật"
        setProjects(data.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const getImgUrl = (path: string) => {
    if (!path) return 'https://placehold.co/600x400?text=No+Image';
    if (path.startsWith('http')) return path;
    return `${BASE_URL.replace('/api', '')}${path}`;
  };

  const formatProjectLocation = (project: any) => {
    const parts = [project.ward, project.province].filter(Boolean);
    return parts.length ? parts.join(', ') : (project.location || 'Đang cập nhật');
  };

  const displayBanners = banners && banners.length > 0 ? banners : bannerImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % displayBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [displayBanners]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % displayBanners.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + displayBanners.length) % displayBanners.length);

  const formatPrice = (price: string | number | null | undefined) => {
    if (!price) return null;
    const num = Number(price);
    if (isNaN(num) || num === 0) return null;
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1).replace('.0', '')} tỷ`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)} triệu`;
    }
    return num.toLocaleString('vi-VN');
  };

  return (
    <>
      {/* HERO SLIDER */}
      <section className="hero-slider">
        {displayBanners.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="slider-overlay"></div>

        <button className="slider-btn prev-btn" onClick={prevSlide}>
          <ChevronLeft size={32} />
        </button>
        <button className="slider-btn next-btn" onClick={nextSlide}>
          <ChevronRight size={32} />
        </button>

        <div className="slider-dots">
          {displayBanners.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* FEATURES ROW */}
      <section className="features-row">
        {[
          { icon: <ShieldCheck size={32} />, title: 'Bất động sản chất lượng', sub: 'Pháp lý minh bạch' },
          { icon: <Map size={32} />, title: 'Vị trí đắc địa', sub: 'Kết nối thuận tiện' },
          { icon: <BadgeDollarSign size={32} />, title: 'An toàn & uy tín', sub: 'Nhiều ưu đãi hấp dẫn' },
          { icon: <Clock size={32} />, title: 'Hỗ trợ tận tâm', sub: 'Tư vấn 24/7' },
        ].map((f, i) => (
          <div key={i} className="feature-item">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-text"><h4>{f.title}</h4><p>{f.sub}</p></div>
          </div>
        ))}
      </section>

      {/* DỰ ÁN NỔI BẬT */}
      {(!isLoading && projects.length === 0) ? null : (
        <section className="featured-section" id="projects">
        <div className="section-header">
          <h3 className="section-title">Dự Án Nổi Bật</h3>
          <a 
            href="#projects" 
            className="view-all" 
            onClick={(e) => {
              e.preventDefault();
              if (onViewAllProjects) onViewAllProjects();
            }}
          >
            Xem tất cả <ChevronRight size={16} />
          </a>
        </div>

        {isLoading ? (
          <div className="loading-state">Đang tải dự án...</div>
        ) : (
          <div className="property-grid">
            {projects.map(project => (
              <div 
                className="property-card" 
                key={project.id}
                onClick={() => onViewDetail && onViewDetail(project.slug)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-image-wrapper">
                  <span className="card-badge">{project.category || 'Dự án'}</span>
                  <img
                    src={getImgUrl(project.images?.[0]?.url)}
                    alt={project.name}
                    className="card-image"
                  />
                </div>
                <div className="card-content">
                  <h4 className="card-title">{project.name}</h4>
                  <p className="card-address"><MapPin size={14} /> {formatProjectLocation(project)}</p>
                  <div className="card-stats">
                    {project.area && (
                      <div className="stat-item"><Maximize className="stat-icon" size={14} /> {project.area}</div>
                    )}
                    {project.roomCount && (
                      <div className="stat-item"><Building2 className="stat-icon" size={14} /> {project.roomCount} phòng</div>
                    )}
                    {project.totalUnits && (
                      <div className="stat-item"><Building2 className="stat-icon" size={14} /> {project.totalUnits} SP</div>
                    )}
                  </div>
                  <div className="card-footer">
                    <div className="card-price">
                      {formatPrice(project.price) ? `Từ ${formatPrice(project.price)} VNĐ` : 'Liên hệ'}
                    </div>
                    <div className="card-status">{project.status || 'Đang mở bán'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      )}

      {/* LĨNH VỰC HOẠT ĐỘNG */}
      <section className="business-areas-section">
        <div className="section-header text-center">
          <h3 className="section-title">Lĩnh Vực Hoạt Động</h3>
          <p className="section-subtitle text-muted mt-2">Hệ sinh thái dịch vụ toàn diện của An Khang Group</p>
        </div>

        <div className="areas-grid">
          {[
            {
              img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
              title: 'Dịch vụ',
              desc: 'Mọi dịch vụ chúng tôi cung cấp đều hướng đến phục vụ và giải quyết những vướng mắc một cách nhanh chóng và thỏa mãn tối đa nhu cầu của khách hàng. An Khang Group không chỉ cung cấp sản phẩm bất động sản mà còn mang đến giải pháp toàn diện.'
            },
            {
              img: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&auto=format&fit=crop',
              title: 'Đầu tư',
              desc: 'Thị trường bất động sản rất tiềm năng, nhu cầu nhà ở của người dân ngày càng tăng cao, nắm bắt được nhu cầu ấy, An Khang Group không ngừng nỗ lực phát triển vững mạnh về năng lực để kiến tạo những giá trị đầu tư đích thực.'
            },
            {
              img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop',
              title: 'Xây dựng',
              desc: 'Đầu tư phát triển dự án là một trong những mục tiêu mũi nhọn của An Khang Group. Chúng tôi đang nỗ lực phát triển mở rộng thị trường, vững mạnh về năng lực tài chính để tiến tới triển khai xây dựng những dự án mang tầm vóc quốc tế.'
            }
          ].map((area, i) => (
            <div key={i} className="area-card">
              <div className="area-image">
                <img src={area.img} alt={area.title} />
              </div>
              <div className="area-content">
                <h4 className="area-title">{area.title}</h4>
                <p className="area-desc">{area.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
