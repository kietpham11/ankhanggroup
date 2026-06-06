import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Building2, Package, Bookmark,
  ChevronDown, Heart, LayoutGrid, List, ArrowRight,
  Maximize, Building, Home as HomeIcon
} from 'lucide-react';
import LoanCalculator from '../../components/shared/LoanCalculator';
import { propertiesAPI } from '../../lib/api';
import './Projects.css';
const TYPE_LABELS: Record<string, string> = {
  LAND: 'Đất nền', HOUSE: 'Nhà phố', APARTMENT: 'Căn hộ'
};

export default function Projects({ onViewDetail }: { onViewDetail?: (id: number) => void }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');
  const [type, setType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    propertiesAPI.getAll()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, location, type, priceRange, sortOrder]);

  const filteredProjects = projects.filter(project => {
    const matchSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        project.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation = location === 'all' || project.address?.includes(location);
    const matchType = type === 'all' || TYPE_LABELS[project.type] === type || project.type === type;
    
    let matchPrice = true;
    const priceVal = project.price || 0;
    if (priceRange === 'under2') matchPrice = priceVal < 2;
    else if (priceRange === '2to10') matchPrice = priceVal >= 2 && priceVal <= 10;
    else if (priceRange === 'over10') matchPrice = priceVal > 10;

    return matchSearch && matchLocation && matchType && matchPrice;
  }).sort((a, b) => {
    if (sortOrder === 'priceAsc') return (a.price || 0) - (b.price || 0);
    if (sortOrder === 'priceDesc') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic stats calculation
  const totalProjects = projects.length;
  
  const totalUnits = projects.reduce((acc, p) => {
    return acc + (p.bedrooms || 0);
  }, 0);
  const formattedUnits = totalUnits > 0 ? new Intl.NumberFormat('vi-VN').format(totalUnits) + '+' : '0';

  const uniqueLocations = new Set(projects.map(p => {
    if (!p.address) return '';
    const parts = p.address.split(',');
    return parts[parts.length - 1].trim();
  }).filter(Boolean));
  const totalLocations = uniqueLocations.size;

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
      <div className="projects-header-bg">
        <div className="projects-container">
          {/* Breadcrumb & Title */}
          <div className="projects-top-info">
            <div className="projects-title-area">
              <div className="breadcrumb">Trang chủ <span className="mx-2">&gt;</span> <span className="text-gold">Dự án</span></div>
              <h1 className="page-title">Dự án nổi bật</h1>
              <p className="page-subtitle">Khám phá các dự án bất động sản tiềm năng trên toàn quốc</p>
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
                <Package className="stat-icon" />
                <div className="stat-text">
                  <strong>{formattedUnits}</strong>
                  <span>Sản phẩm</span>
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
                  <option value="TP. HCM">TP. Hồ Chí Minh</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Vũng Tàu">Vũng Tàu</option>
                </select>
                <ChevronDown size={16} className="select-arrow" />
              </div>
            </div>

            <div className="filter-input-group">
              <label>Loại hình dự án</label>
              <div className="input-wrapper">
                <HomeIcon size={18} className="text-gold" />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="all">Tất cả loại hình</option>
                  <option value="Nhà phố">Nhà phố</option>
                  <option value="Đất nền">Đất nền</option>
                </select>
                <ChevronDown size={16} className="select-arrow" />
              </div>
            </div>

            <div className="filter-input-group">
              <label>Khoảng giá</label>
              <div className="input-wrapper">
                <span className="text-gold font-bold">฿</span>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                  <option value="all">Tất cả mức giá</option>
                  <option value="under2">Dưới 2 tỷ</option>
                  <option value="2to10">Từ 2 - 10 tỷ</option>
                  <option value="over10">Trên 10 tỷ</option>
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
              <div className="sort-by">
                <span>Sắp xếp:</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    style={{ 
                      appearance: 'none', 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--text-main)', 
                      paddingRight: '20px', 
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: 'inherit'
                    }}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="priceAsc">Giá: Thấp đến cao</option>
                    <option value="priceDesc">Giá: Cao đến thấp</option>
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 0, pointerEvents: 'none', color: 'var(--text-main)' }} />
                </div>
              </div>
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
                  onClick={() => onViewDetail && onViewDetail(project.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="proj-image-container">
                    <img src={project.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop'} alt={project.title} />
                    <span className="proj-badge">{TYPE_LABELS[project.type] || project.type}</span>
                  </div>
                  <div className="proj-content">
                    <h3 className="proj-title">{project.title}</h3>
                    <div className="proj-location">
                      <MapPin size={14} className="text-gold" /> {project.address}
                    </div>

                    <div className="proj-details">
                      {project.area && (
                        <div className="detail-item">
                          <Maximize size={14} /> {project.area} m²
                        </div>
                      )}
                      {project.bedrooms && (
                        <div className="detail-item">
                          <Building size={14} /> {project.bedrooms} PN
                        </div>
                      )}
                      {project.bathrooms && (
                        <div className="detail-item">
                          <HomeIcon size={14} /> {project.bathrooms} WC
                        </div>
                      )}
                    </div>

                    <div className="proj-footer">
                      <div className="proj-price">Từ {(Number(project.price) || 0).toLocaleString('vi-VN')} VNĐ</div>
                      <button className="proj-details-btn" onClick={() => onViewDetail && onViewDetail(project.id)}>Xem chi tiết <ArrowRight size={14} /></button>
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
