import React, { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle2, Clock, XCircle, 
  Search, ChevronDown, RefreshCw, MapPin, 
  Edit, Trash2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import ProjectDetail from './ProjectDetail';
import ProjectEdit from './ProjectEdit';
import DeleteProjectModal from './components/DeleteProjectModal';
import { projectsAPI } from '../../../lib/api';
import './Projects.css';

const parseDateToTime = (dateStr: string) => {
  if (!dateStr) return 0;
  const parts = dateStr.split(' ')[0].split('/');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
  }
  return 0;
};

const normalizeProjectStatus = (status?: string) => {
  if (status === 'Đang mở bán') return 'selling';
  if (status === 'Sắp mở bán' || status === 'Sắp triển khai') return 'upcoming';
  if (status === 'Đã bàn giao' || status === 'Đã hoàn thành') return 'completed';
  return status || '';
};

const normalizeProjectType = (category?: string) => {
  if (category === 'Đất nền') return 'land';
  if (category === 'Căn hộ') return 'apartment';
  if (category === 'Nhà lầu trệt') return 'nha-lau-tret';
  if (category === 'Nhà cấp 4') return 'nha-cap-4';
  if (category === 'Nhà cấp 4 gác lửng') return 'nha-cap-4-gac-lung';
  if (category === 'Biệt thự mini') return 'biet-thu-mini';
  if (category === 'Biệt thự sân vườn') return 'biet-thu-san-vuon';
  if (category === 'Cấp 4 sân vườn') return 'cap-4-san-vuon';
  return category || '';
};

const formatProjectLocation = (project: any) => {
  const parts = [project.ward, project.province].filter(Boolean);
  return parts.length ? parts.join(', ') : (project.location || 'Đang cập nhật');
};

const getStatusClass = (statusValue: string) => {
  if (statusValue === 'selling') return 'selling';
  if (statusValue === 'upcoming') return 'upcoming';
  if (statusValue === 'completed') return 'completed';
  return '';
};

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'edit' | 'add'>('list');
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);

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
      const data = await projectsAPI.getAll();
      const mapped = data.map((p: any) => ({
        ...p,
        code: p.slug,
        type: p.category || 'Dự án',
        typeValue: normalizeProjectType(p.category),
        statusValue: normalizeProjectStatus(p.status),
        statusClass: getStatusClass(normalizeProjectStatus(p.status)),
        createdAt: new Date(p.createdAt).toLocaleDateString('en-GB'),
        image: p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=150&q=80',
        images: p.images?.map((i: any) => i.url) || [],
        gallery: p.images?.map((i: any) => i.url) || [],
        creator: p.creator || 'Admin',
        updater: p.updater || 'Admin',
      }));
      setProjects(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);
  
  const filteredProjects = projects.filter(proj => {
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

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = (e: React.MouseEvent, action: string, id: number) => {
    e.stopPropagation();
    if (action === 'Sửa') {
      setSelectedProjectId(id);
      setViewMode('edit');
    } else if (action === 'Xoá') {
      const proj = projects.find(p => p.id === id);
      if (proj) setProjectToDelete(proj);
    } else {
      alert(`${action} dự án có ID: ${id}`);
    }
  };

  const handleRowClick = (id: number) => {
    setSelectedProjectId(id);
    setViewMode('detail');
  };

  const handleSaveProject = async (updatedProject: any) => {
    try {
      if (viewMode === 'add') {
        await projectsAPI.create(updatedProject);
        alert('Đã thêm dự án thành công!');
      } else {
        await projectsAPI.update(updatedProject.id, updatedProject);
        alert('Đã cập nhật dự án thành công!');
      }
      await fetchProperties();
      setViewMode('list');
    } catch (err: any) {
      alert('Lỗi cập nhật: ' + err.message);
    }
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await projectsAPI.delete(projectToDelete.id);
        setProjects(projects.filter(p => p.id !== projectToDelete.id));
        setProjectToDelete(null);
        if (selectedProjectId === projectToDelete.id) {
          setSelectedProjectId(null);
          setViewMode('list');
        }
      } catch (err) {
        alert('Lỗi khi xoá: ' + err);
      }
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  if (viewMode === 'add') {
    return (
      <ProjectEdit 
        project={{}}
        onBack={() => setViewMode('list')}
        onSave={handleSaveProject}
      />
    );
  }

  if (selectedProject && viewMode === 'edit') {
    return (
      <>
        <ProjectEdit 
          project={selectedProject}
          onBack={() => setViewMode('detail')}
          onSave={handleSaveProject}
        />
        {projectToDelete && (
          <DeleteProjectModal 
            projectName={projectToDelete.name}
            onClose={() => setProjectToDelete(null)}
            onConfirm={confirmDelete}
          />
        )}
      </>
    );
  }

  if (selectedProject && viewMode === 'detail') {
    return (
      <>
        <ProjectDetail 
          project={selectedProject} 
          onBack={() => {
            setSelectedProjectId(null);
            setViewMode('list');
          }} 
          onEdit={() => setViewMode('edit')}
          onDelete={() => setProjectToDelete(selectedProject)}
        />
        {projectToDelete && (
          <DeleteProjectModal 
            projectName={projectToDelete.name}
            onClose={() => setProjectToDelete(null)}
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
            <h3>{projects.length}</h3>
            <p className="ap-stat-title">Tổng dự án</p>
            <p className="ap-stat-desc">Tất cả dự án</p>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-icon ap-icon-blue">
            <CheckCircle2 />
          </div>
          <div className="ap-stat-info">
            <h3>{projects.filter(p => p.statusValue === 'selling').length}</h3>
            <p className="ap-stat-title">Đang mở bán</p>
            <p className="ap-stat-desc">Dự án đang hoạt động</p>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-icon ap-icon-yellow">
            <Clock />
          </div>
          <div className="ap-stat-info">
            <h3>{projects.filter(p => p.statusValue === 'upcoming').length}</h3>
            <p className="ap-stat-title">Sắp triển khai</p>
            <p className="ap-stat-desc">Dự án chuẩn bị mở bán</p>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-icon ap-icon-blue">
            <XCircle />
          </div>
          <div className="ap-stat-info">
            <h3>{projects.filter(p => p.statusValue === 'completed').length}</h3>
            <p className="ap-stat-title">Đã hoàn thành</p>
            <p className="ap-stat-desc">Dự án đã bàn giao</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="ap-main-card">
        {/* Header & Toolbar */}
        <div className="ap-main-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h2>Danh sách dự án</h2>
            <button style={{ 
              background: '#d89f2a', color: '#fff', border: 'none', 
              padding: '0.5rem 1rem', borderRadius: '4px', 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem'
            }} onClick={() => setViewMode('add')}>
              <Building2 size={16} /> Thêm dự án mới
            </button>
          </div>
          <div className="ap-toolbar" style={{ marginTop: '1rem' }}>
            <div className="ap-search-box">
              <Search size={18} />
              <input type="text" placeholder="Tìm kiếm dự án..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
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
                  <option value="all">Tất cả loại dự án</option>
                  <option value="land">Đất nền</option>
                  <option value="apartment">Căn hộ</option>
                  <option value="nha-lau-tret">Nhà lầu trệt</option>
                  <option value="nha-cap-4">Nhà cấp 4</option>
                  <option value="nha-cap-4-gac-lung">Nhà cấp 4 gác lửng</option>
                  <option value="biet-thu-mini">Biệt thự mini</option>
                  <option value="biet-thu-san-vuon">Biệt thự sân vườn</option>
                  <option value="cap-4-san-vuon">Cấp 4 sân vườn</option>
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
                <th>DỰ ÁN</th>
                <th>LOẠI DỰ ÁN</th>
                <th>VỊ TRÍ</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY TẠO</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((proj, index) => (
                <tr key={proj.id} onClick={() => handleRowClick(proj.id)} style={{ cursor: 'pointer' }}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <div className="ap-project-cell">
                      <img src={proj.image} alt={proj.name} />
                      <div className="ap-project-info">
                        <span className="ap-project-name">{proj.name}</span>
                        <span className="ap-project-code">Mã dự án: {proj.code}</span>
                      </div>
                    </div>
                  </td>
                  <td>{proj.type}</td>
                  <td>
                    <div className="ap-location">
                      <MapPin size={14} /> {formatProjectLocation(proj)}
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
          <div>Hiển thị {filteredProjects.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredProjects.length)} trong {filteredProjects.length} dự án</div>
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
      
      {projectToDelete && (
        <DeleteProjectModal 
          projectName={projectToDelete.name}
          onClose={() => setProjectToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
