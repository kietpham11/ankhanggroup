import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Calendar, User, 
  Edit, Box, FileText, RefreshCw, Trash, X, Plus
} from 'lucide-react';
import './PropertyDetail.css';

interface PropertyDetailProps {
  property: any;
  onBack: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

export default function PropertyDetail({ property, onBack, onEdit, onDelete }: PropertyDetailProps) {
  const [activeTab, setActiveTab] = useState('info');


  return (
    <div className="apd-container">
      {/* Sub Header (Inside Main Area) */}
      <div className="apd-header-actions">
        <button className="apd-btn-back" onClick={onBack}>
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>
      </div>

      {/* Top Card */}
      <div className="apd-top-card">
        <img src={property.image} alt={property.name} className="apd-thumbnail" />
        <div className="apd-top-info">
          <div className="apd-title-row">
            <h2>{property.name}</h2>
            <span className={`ap-badge ${property.statusClass}`}>{property.status}</span>
          </div>
          <div className="apd-code">Mã bất động sản: {property.code}</div>
          
          <div className="apd-stats-row">
            <div className="apd-stat-item">
              <div className="apd-stat-item-label"><BuildingIcon /> Loại bất động sản</div>
              <div className="apd-stat-item-value">{property.type}</div>
            </div>
            <div className="apd-stat-item">
              <div className="apd-stat-item-label"><MapPin size={16} /> Vị trí bất động sản</div>
              <div className="apd-stat-item-value">{property.location}</div>
            </div>
            <div className="apd-stat-item">
              <div className="apd-stat-item-label"><Calendar size={16} /> Ngày tạo</div>
              <div className="apd-stat-item-value">{property.createdAt}</div>
            </div>
            <div className="apd-stat-item">
              <div className="apd-stat-item-label"><User size={16} /> Người tạo</div>
              <div className="apd-stat-item-value">{property.creator}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="apd-tabs">
        <div className={`apd-tab-item ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
          Thông tin bất động sản
        </div>
        <div className={`apd-tab-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>
          Tiến độ
        </div>
        <div className={`apd-tab-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          Sản phẩm
        </div>
        <div className={`apd-tab-item ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>
          Tài liệu
        </div>
        <div className={`apd-tab-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          Lịch sử hoạt động
        </div>
      </div>

      {/* Content Grid */}
      {activeTab === 'info' && (
        <div className="apd-content-grid">
          {/* Left Column */}
          <div className="apd-content-left">
            {/* Main Info */}
            <div className="apd-main-info-card">
              <h3 className="apd-card-title">Thông tin cơ bản</h3>
              
              <div className="apd-info-grid">
                <div className="apd-info-label">Tên bất động sản</div>
                <div className="apd-info-value">{property.name}</div>
                
                <div className="apd-info-label">Mã bất động sản</div>
                <div className="apd-info-value">{property.code}</div>
                
                <div className="apd-info-label">Loại bất động sản</div>
                <div className="apd-info-value">{property.type}</div>
                
                <div className="apd-info-label">Vị trí bất động sản</div>
                <div className="apd-info-value">{property.location}</div>
                
                <div className="apd-info-label">Chủ đầu tư</div>
                <div className="apd-info-value">{property.developer}</div>
                
                <div className="apd-info-label">Đơn vị phát triển</div>
                <div className="apd-info-value">{property.partner}</div>
                
                <div className="apd-info-label">Quy mô bất động sản</div>
                <div className="apd-info-value">{property.area}</div>
                
                <div className="apd-info-label">Tổng số sản phẩm</div>
                <div className="apd-info-value">{property.totalUnits}</div>
                
                <div className="apd-info-label">Mô tả bất động sản</div>
                <div className="apd-info-value desc">{property.description}</div>
              </div>

              <h3 className="apd-gallery-title">Hình ảnh bất động sản</h3>
              <div className="apd-gallery-grid">
                {property.gallery.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="Gallery" className="apd-gallery-img" />
                ))}
                <div className="apd-gallery-add" onClick={() => alert('Thêm hình ảnh')}>
                  <Plus size={24} />
                  Thêm hình ảnh
                </div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="apd-meta-card">
              <h3 className="apd-card-title">Thông tin khác</h3>
              <div className="apd-info-grid">
                <div className="apd-info-label">Trạng thái</div>
                <div><span className={`ap-badge ${property.statusClass}`}>{property.status}</span></div>
                
                <div className="apd-info-label">Ngày tạo</div>
                <div className="apd-info-value desc">{property.createdAt}</div>
                
                <div className="apd-info-label">Ngày cập nhật</div>
                <div className="apd-info-value desc">{property.updatedAt}</div>
                
                <div className="apd-info-label">Người tạo</div>
                <div className="apd-info-value desc">{property.creator}</div>
                
                <div className="apd-info-label">Người cập nhật</div>
                <div className="apd-info-value desc">{property.updater}</div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar Actions) */}
          <div className="apd-sidebar-card">
            <h3 className="apd-card-title" style={{ marginBottom: '0.5rem' }}>Thao tác</h3>
            
            <button className="apd-action-btn edit" onClick={onEdit}>
              <div className="apd-action-icon"><Edit size={16} /></div>
              <div className="apd-action-text">
                <strong>Chỉnh sửa thông tin</strong>
                <span>Cập nhật thông tin bất động sản</span>
              </div>
            </button>
            
            <button className="apd-action-btn">
              <div className="apd-action-icon"><Box size={16} /></div>
              <div className="apd-action-text">
                <strong>Quản lý sản phẩm</strong>
                <span>Quản lý các sản phẩm trong bất động sản</span>
              </div>
            </button>
            
            <button className="apd-action-btn">
              <div className="apd-action-icon"><FileText size={16} /></div>
              <div className="apd-action-text">
                <strong>Quản lý tài liệu</strong>
                <span>Xem và quản lý tài liệu bất động sản</span>
              </div>
            </button>
            
            <button className="apd-action-btn">
              <div className="apd-action-icon"><RefreshCw size={16} /></div>
              <div className="apd-action-text">
                <strong>Quản lý tiến độ</strong>
                <span>Cập nhật tiến độ bất động sản</span>
              </div>
            </button>
            
            <button className="apd-action-btn delete" onClick={onDelete}>
              <div className="apd-action-icon"><Trash size={18} /></div>
              <div className="apd-action-text">
                <strong>Xóa bất động sản</strong>
                <span>Xóa bất động sản khỏi hệ thống</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple building icon component to match design
function BuildingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <path d="M9 22v-4h6v4"></path>
      <path d="M8 6h.01"></path>
      <path d="M16 6h.01"></path>
      <path d="M12 6h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 10h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 10h.01"></path>
      <path d="M8 14h.01"></path>
    </svg>
  );
}
