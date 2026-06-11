import React, { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle2, Clock, XCircle, 
  Search, ChevronDown, RefreshCw, MapPin, 
  Edit, Trash2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import PropertyDetail from './PropertyDetail';
import PropertyEdit from './PropertyEdit';
import DeletePropertyModal from './components/DeletePropertyModal';
import { getFullImgUrl, propertiesAPI } from '../../../lib/api';
import './Properties.css';

const parseDateToTime = (dateStr: string) => {
  if (!dateStr) return 0;
  const parts = dateStr.split(' ')[0].split('/');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
  }
  return 0;
};

export default function Propertys() {
  const [propertys, setPropertys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'edit'>('list');
  const [propertyToDelete, setPropertyToDelete] = useState<any | null>(null);

  // Pagination and Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const data = await propertiesAPI.getAll();
      const mapped = data.map((p: any) => ({
        id: p.id,
        name: p.title,
        code: p.slug,
        type: p.type === 'LAND' ? 'Đất nền' : (p.type === 'HOUSE' ? 'Nhà phố' : p.type),
        typeValue: p.type?.toLowerCase() || 'townhouse',
        location: p.address,
        status: p.status === 'AVAILABLE' ? 'Đang mở bán' : 'Đã hoàn thành',
        statusClass: p.status === 'AVAILABLE' ? 'selling' : 'completed',
        statusValue: p.status === 'AVAILABLE' ? 'selling' : 'completed',
        createdAt: new Date(p.createdAt).toLocaleDateString('en-GB'),
        image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=150&q=80',
        gallery: p.images?.map((i: any) => i.url) || [],
        description: p.description,
        area: p.area,
        price: p.price,
        legal: p.legal,
        propertyId: p.propertyId,
        isFeatured: p.isFeatured,
        showOnHome: p.showOnHome,
        displayOrder: p.displayOrder,
      }));
      setPropertys(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);
  
  const filteredPropertys = propertys.filter(proj => {
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      if (!proj.name.toLowerCase().includes(lowerTerm) && !proj.location.toLowerCase().includes(lowerTerm)) {
        return false;
      }
    }
    if (statusFilter !== 'all' && proj.statusValue !== statusFilter) return false;
    if (typeFilter !== 'all' && proj.typeValue !== typeFilter) return false;
    
    if (dateFrom || dateTo) {
      const projTime = parseDateToTime(proj.createdAt);
      if (projTime > 0) {
        const effectiveDateFrom = dateFrom || dateTo;
        const effectiveDateTo = dateTo || dateFrom;
        if (effectiveDateFrom && projTime < new Date(effectiveDateFrom).getTime()) return false;
        if (effectiveDateTo && projTime > new Date(effectiveDateTo).getTime() + 86399999) return false;
      }
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredPropertys.length / itemsPerPage);
  const currentPropertys = filteredPropertys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = (e: React.MouseEvent, action: string, id: number) => {
    e.stopPropagation();
    if (action === 'Sửa') {
      setSelectedPropertyId(id);
      setViewMode('edit');
    } else if (action === 'Xoá') {
      const proj = propertys.find(p => p.id === id);
      if (proj) setPropertyToDelete(proj);
    } else {
      alert(`${action} bất động sản có ID: ${id}`);
    }
  };

  const handleRowClick = (id: number) => {
    setSelectedPropertyId(id);
    setViewMode('detail');
  };

  const handleSaveProperty = async (updatedProperty: any) => {
    try {
      await propertiesAPI.update(updatedProperty.id, updatedProperty);
      await fetchProperties();
      setViewMode('detail');
      alert('Đã cập nhật bất động sản thành công!');
    } catch (err: any) {
      alert('Lỗi cập nhật: ' + err.message);
    }
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      try {
        await propertiesAPI.delete(propertyToDelete.id);
        setPropertys(propertys.filter(p => p.id !== propertyToDelete.id));
        setPropertyToDelete(null);
        if (selectedPropertyId === propertyToDelete.id) {
          setSelectedPropertyId(null);
          setViewMode('list');
        }
      } catch (err) {
        alert('Lỗi khi xoá: ' + err);
      }
    }
  };

  const selectedProperty = propertys.find(p => p.id === selectedPropertyId);

  if (selectedProperty && viewMode === 'edit') {
    return (
      <>
        <PropertyEdit 
          property={selectedProperty}
          onBack={() => setViewMode('detail')}
          onSave={handleSaveProperty}
        />
        {propertyToDelete && (
          <DeletePropertyModal 
            propertyName={propertyToDelete.name}
            onClose={() => setPropertyToDelete(null)}
            onConfirm={confirmDelete}
          />
        )}
      </>
    );
  }

  if (selectedProperty && viewMode === 'detail') {
    return (
      <>
        <PropertyDetail 
          property={selectedProperty} 
          onBack={() => {
            setSelectedPropertyId(null);
            setViewMode('list');
          }} 
          onEdit={() => setViewMode('edit')}
          onDelete={() => setPropertyToDelete(selectedProperty)}
        />
        {propertyToDelete && (
          <DeletePropertyModal 
            propertyName={propertyToDelete.name}
            onClose={() => setPropertyToDelete(null)}
            onConfirm={confirmDelete}
          />
        )}
      </>
    );
  }

  return (
    <div className="ap-container">
      {/* Stats Row */}
      <div className="ap-stats-row">
        <div className="ap-stat-card">
          <div className="ap-stat-icon ap-icon-yellow">
            <Building2 />
          </div>
          <div className="ap-stat-info">
            <h3>{propertys.length}</h3>
            <p className="ap-stat-title">Tổng bất động sản</p>
            <p className="ap-stat-desc">Tất cả bất động sản</p>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-icon ap-icon-blue">
            <CheckCircle2 />
          </div>
          <div className="ap-stat-info">
            <h3>{propertys.filter(p => p.statusValue === 'selling').length}</h3>
            <p className="ap-stat-title">Đang mở bán</p>
            <p className="ap-stat-desc">Bất động sản đang hoạt động</p>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-icon ap-icon-yellow">
            <Clock />
          </div>
          <div className="ap-stat-info">
            <h3>{propertys.filter(p => p.statusValue === 'upcoming').length}</h3>
            <p className="ap-stat-title">Sắp triển khai</p>
            <p className="ap-stat-desc">Bất động sản chuẩn bị mở bán</p>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-icon ap-icon-blue">
            <XCircle />
          </div>
          <div className="ap-stat-info">
            <h3>{propertys.filter(p => p.statusValue === 'completed').length}</h3>
            <p className="ap-stat-title">Đã hoàn thành</p>
            <p className="ap-stat-desc">Bất động sản đã bàn giao</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="ap-main-card">
        {/* Header & Toolbar */}
        <div className="ap-main-header">
          <h2>Danh sách bất động sản</h2>
          <div className="ap-toolbar">
            <div className="ap-search-box">
              <Search size={18} />
              <input type="text" placeholder="Tìm kiếm bất động sản..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
            
            <div className="ap-filters">
              <div className="ap-select-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }} className="ap-date-input" title="Từ ngày" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }} />
                <span>-</span>
                <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }} className="ap-date-input" title="Đến ngày" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div className="ap-select-wrapper">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="selling">Đang mở bán</option>
                  <option value="upcoming">Sắp triển khai</option>
                  <option value="completed">Đã hoàn thành</option>
                </select>
                <ChevronDown size={16} />
              </div>
              <div className="ap-select-wrapper">
                <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="all">Tất cả loại bất động sản</option>
                  <option value="townhouse">Nhà phố</option>
                  <option value="land">Đất nền</option>
                </select>
                <ChevronDown size={16} />
              </div>
              <button className="ap-btn-refresh" onClick={() => {
                setStatusFilter('all');
                setTypeFilter('all');
                setDateFrom('');
                setDateTo('');
                setSearchTerm('');
                setCurrentPage(1);
              }}>
                <RefreshCw size={16} /> Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="ap-table-container">
          <table className="ap-table">
            <thead>
              <tr>
                <th>#</th>
                <th>BẤT ĐỘNG SẢN</th>
                <th>LOẠI BẤT ĐỘNG SẢN</th>
                <th>VỊ TRÍ</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY TẠO</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {currentPropertys.map((proj, index) => (
                <tr key={proj.id} onClick={() => handleRowClick(proj.id)} style={{ cursor: 'pointer' }}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <div className="ap-property-cell">
                      <img src={getFullImgUrl(proj.image)} alt={proj.name} />
                      <div className="ap-property-info">
                        <span className="ap-property-name">{proj.name}</span>
                        <span className="ap-property-code">Mã bất động sản: {proj.code}</span>
                      </div>
                    </div>
                  </td>
                  <td>{proj.type}</td>
                  <td>
                    <div className="ap-location">
                      <MapPin size={14} /> {proj.location}
                    </div>
                  </td>
                  <td>
                    <span className={`ap-badge ${proj.statusClass}`}>
                      {proj.status}
                    </span>
                  </td>
                  <td>{proj.createdAt}</td>
                  <td>
                    <div className="ap-actions">
                      <button className="ap-btn-action ap-btn-edit" onClick={(e) => handleAction(e, 'Sửa', proj.id)}>
                        <Edit size={14} />
                      </button>
                      <button className="ap-btn-action ap-btn-delete" onClick={(e) => handleAction(e, 'Xoá', proj.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="ap-pagination-footer">
          <div>Hiển thị {filteredPropertys.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredPropertys.length)} trong {filteredPropertys.length} bất động sản</div>
          <div className="ap-pagination-controls">
            <button 
              className="ap-page-btn" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                className={`ap-page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button 
              className="ap-page-btn" 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {propertyToDelete && (
        <DeletePropertyModal 
          propertyName={propertyToDelete.name}
          onClose={() => setPropertyToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
