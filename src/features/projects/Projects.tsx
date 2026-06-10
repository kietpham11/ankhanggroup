import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Building2, Package, Bookmark,
  ChevronDown, LayoutGrid, List, ArrowRight,
  Maximize, Building, Home as HomeIcon
} from 'lucide-react';
import LoanCalculator from '../../components/shared/LoanCalculator';
import { projectsAPI } from '../../lib/api';
import './Projects.css';

export default function Projects({ onViewDetail, banner }: { onViewDetail?: (slug: string) => void, banner?: string }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    projectsAPI.getAll()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, location, category, status]);

  const formatProjectLocation = (project: any) => {
    const parts = [project.ward, project.province].filter(Boolean);
    return parts.length ? parts.join(', ') : (project.location || 'Đang cập nhật');
  };

  const filteredProjects = projects.filter(project => {
    const displayLocation = formatProjectLocation(project);
    const matchSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        displayLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation = location === 'all' || displayLocation.includes(location);
    const matchCategory = category === 'all' || project.category === category;
    const matchStatus = status === 'all' || project.status === status;

    return matchSearch && matchLocation && matchCategory && matchStatus;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalProjects = projects.length;
  
  const totalLocations = new Set(projects.map(p => {
    if (!p.location) return '';
    const parts = p.location.split(',');
    return parts[parts.length - 1].trim();
  }).filter(Boolean)).size;


  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return (
      <div className="pagination">
        <button 
          className="page-btn nav" 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {pages.map((p, idx) => (
          <button 
            key={idx}
            className={`page-btn ${p === currentPage ? 'active' : ''}`}
            onClick={() => typeof p === 'number' && setCurrentPage(p)}
            style={{ cursor: p === '...' ? 'default' : 'pointer' }}
          >
            {p}
          </button>
        ))}
        <button 
          className="page-btn nav"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="projects-page">
      <div className="projects-header-bg" style={banner ? { backgroundImage: `url(${banner})` } : {}}>
        <div className="projects-container">
          {/* Breadcrumb & Title */}
          <div className="projects-top-info">
            <div className="projects-title-area">
              <div className="breadcrumb">Trang chủ <span className="mx-2">&gt;</span> <span className="text-gold">Dự án</span></div>
              <h1 className="page-title">Dự án bất động sản</h1>
              <p className="page-subtitle">Khám phá các dự án tiềm năng và quy mô lớn trên toàn quốc</p>
            </div>

            <div className="projects-stats">
              <div className="stat-box">
                <Building2 className="stat-icon" />
                <div className="stat-text">
                  <strong>{totalProjects}+</strong>
                  <span>Dự án</span>
                </div>
              </div>
              <div className="stat-box">
                <Bookmark className="stat-icon" />
                <div className="stat-text">
                  <strong>{totalLocations}</strong>
                  <span>Tỉnh thành</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Search Filter */}
          <div className="top-search-filter">
            <div className="filter-input-group">
              <label>Tìm kiếm dự án</label>
              <div className="input-wrapper">
                <Search size={18} className="text-muted" />
                <input 
                  type="text" 
                  placeholder="Nhập tên dự án, khu vực..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-input-group">
              <label>Khu vực</label>
              <div className="input-wrapper">
                <MapPin size={18} className="text-gold" />
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="all">Tất cả khu vực</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Vũng Tàu">Vũng Tàu</option>
                </select>
                <ChevronDown size={16} className="select-arrow" />
              </div>
            </div>

            <div className="filter-input-group">
              <label>Danh mục</label>
              <div className="input-wrapper">
                <HomeIcon size={18} className="text-gold" />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="all">Tất cả loại hình</option>
                  <option value="Đất nền">Đất nền</option>
                  <option value="Căn hộ">Căn hộ</option>
                  <option value="Nhà lầu trệt">Nhà lầu trệt</option>
                  <option value="Nhà cấp 4">Nhà cấp 4</option>
                  <option value="Nhà cấp 4 gác lửng">Nhà cấp 4 gác lửng</option>
                  <option value="Biệt thự mini">Biệt thự mini</option>
                  <option value="Biệt thự sân vườn">Biệt thự sân vườn</option>
                  <option value="Cấp 4 sân vườn">Cấp 4 sân vườn</option>
                </select>
                <ChevronDown size={16} className="select-arrow" />
              </div>
            </div>

            <div className="filter-input-group">
              <label>Trạng thái</label>
              <div className="input-wrapper">
                <Bookmark size={18} className="text-gold" />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Đang mở bán">Đang mở bán</option>
                  <option value="Sắp mở bán">Sắp mở bán</option>
                  <option value="Đã bàn giao">Đã bàn giao</option>
                </select>
                <ChevronDown size={16} className="select-arrow" />
              </div>
            </div>

            <button className="btn-search-main">Tìm kiếm</button>
          </div>
        </div>
      </div>

      <div className="projects-container main-content-area">

        {/* Project Grid */}
        <main className="project-results">
          <div className="results-header">
            <h2>Tất cả dự án ({filteredProjects.length})</h2>
            <div className="results-actions">
              <div className="view-toggles">
                <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={16} /></button>
                <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={16} /></button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-main)' }}>Đang tải dự án...</div>
          ) : (
            <div className={`projects-grid ${viewMode}`}>
              {paginatedProjects.map(project => (
                <div 
                  className="proj-card" 
                  key={project.id}
                  onClick={() => onViewDetail && onViewDetail(project.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="proj-image-container">
                    <img src={project.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop'} alt={project.name} />
                    <span className="proj-badge">{project.category || 'Dự án'}</span>
                  </div>
                  <div className="proj-content">
                    <h3 className="proj-title">{project.name}</h3>
                    <div className="proj-location">
                      <MapPin size={14} className="text-gold" /> {formatProjectLocation(project)}
                    </div>

                    <div className="proj-details">
                      {project.area && (
                        <div className="detail-item">
                          <Maximize size={14} /> {project.area}
                        </div>
                      )}
                      {project.roomCount && (
                        <div className="detail-item">
                          <Building size={14} /> {project.roomCount} phòng
                        </div>
                      )}
                      {project.totalUnits && (
                        <div className="detail-item">
                          <Package size={14} /> {project.totalUnits} SP
                        </div>
                      )}
                      {project.status && (
                        <div className="detail-item">
                          <Bookmark size={14} /> {project.status}
                        </div>
                      )}
                    </div>

                    <div className="proj-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '12px' }}>
                      <div className="proj-price" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d89f2a' }}>
                        {project.price && Number(project.price) > 0 
                          ? `Từ ${Number(project.price) >= 1000000000 
                              ? (Number(project.price) / 1000000000).toFixed(1).replace('.0', '') + ' tỷ' 
                              : Number(project.price) >= 1000000 
                                ? (Number(project.price) / 1000000).toFixed(0) + ' triệu'
                                : Number(project.price).toLocaleString('vi-VN')
                            } VNĐ`
                          : 'Liên hệ báo giá'}
                      </div>
                      <button className="proj-details-btn" onClick={() => onViewDetail && onViewDetail(project.slug)}>
                        Chi tiết <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {renderPagination()}
        </main>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <LoanCalculator />
      </div>
    </div>
  );
}
