import React, { useState } from 'react';
import { 
  Briefcase, Send, Clock, Ban, Users,
  Search, ChevronDown, RefreshCw, Plus,
  Eye, Edit, Trash2, Calendar, X
} from 'lucide-react';
import AddRecruitment from './AddRecruitment';
import EditRecruitment from './EditRecruitment';
import './Recruitment.css';
import '../Projects/components/DeleteProjectModal.css';
import { jobsAPI } from '../../../lib/api';

const parseDateToTime = (dateStr: string) => {
  if (!dateStr) return 0;
  return new Date(dateStr).getTime();
};

export default function Recruitment() {
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingJob, setEditingJob] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: number, title: string} | null>(null);
  const itemsPerPage = 10;

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const data = await jobsAPI.getAll();
      setRecruitments(data);
    } catch (err) {
      console.error(err);
      alert('Không thể tải danh sách tin tuyển dụng');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadJobs();
  }, []);

  // Filter Logic
  const filteredRecruitments = recruitments.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || job.department === deptFilter;
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const jobTime = parseDateToTime(job.deadline);
      if (jobTime > 0) {
        const effectiveDateFrom = dateFrom || dateTo;
        const effectiveDateTo = dateTo || dateFrom;
        if (effectiveDateFrom && jobTime < new Date(effectiveDateFrom).getTime()) matchesDate = false;
        if (effectiveDateTo && jobTime > new Date(effectiveDateTo).getTime() + 86399999) matchesDate = false;
      }
    }
    
    return matchesSearch && matchesDept && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredRecruitments.length / itemsPerPage);
  const currentItems = filteredRecruitments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalCandidates = recruitments.reduce((sum, job) => sum + (job.candidatesCount || 0), 0);

  const handleDelete = (id: number, title: string) => {
    setDeleteConfirm({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await jobsAPI.delete(deleteConfirm.id);
        setRecruitments(recruitments.filter(r => r.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      } catch (err) {
        alert('Lỗi khi xóa tin tuyển dụng');
      }
    }
  };

  const handleSave = async (newJob: any) => {
    try {
      const createdJob = await jobsAPI.create(newJob);
      setRecruitments([createdJob, ...recruitments]);
      setViewMode('list');
      alert('Thêm tin tuyển dụng thành công!');
    } catch (err) {
      alert('Lỗi khi thêm tin tuyển dụng');
    }
  };

  const handleUpdate = async (updatedJob: any) => {
    try {
      const savedJob = await jobsAPI.update(updatedJob.id, updatedJob);
      setRecruitments(recruitments.map(r => r.id === savedJob.id ? savedJob : r));
      setViewMode('list');
      setEditingJob(null);
      alert('Cập nhật tin tuyển dụng thành công!');
    } catch (err) {
      alert('Lỗi khi cập nhật tin tuyển dụng');
    }
  };

  const handleEditClick = (job: any) => {
    setEditingJob(job);
    setViewMode('edit');
  };

  const handleToggleStatus = async (job: any) => {
    try {
      const newStatus = job.status === 'Đang mở' ? 'Đã đóng' : 'Đang mở';
      const updated = await jobsAPI.update(job.id, { ...job, status: newStatus });
      setRecruitments(recruitments.map(r => r.id === updated.id ? updated : r));
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const departments = Array.from(new Set(recruitments.map(r => r.department).filter(Boolean)));

  if (viewMode === 'add') {
    return (
      <AddRecruitment 
        onBack={() => setViewMode('list')} 
        onSave={handleSave} 
      />
    );
  }

  if (viewMode === 'edit' && editingJob) {
    return (
      <EditRecruitment 
        jobId={editingJob.id}
        jobData={editingJob}
        onBack={() => {
          setViewMode('list');
          setEditingJob(null);
        }}
        onSave={handleUpdate}
      />
    );
  }

  return (
    <div className="ar-container">
      {/* Stats Row */}
      <div className="ar-stats-row">
        <div className="ar-stat-card">
          <div className="ar-stat-icon ar-icon-orange">
            <Briefcase size={24} />
          </div>
          <div className="ar-stat-info">
            <p className="ar-stat-title">Tổng tin tuyển dụng</p>
            <h3>{recruitments.length}</h3>
            <p className="ar-stat-desc">Tất cả tin đăng</p>
          </div>
        </div>

        <div className="ar-stat-card">
          <div className="ar-stat-icon ar-icon-green">
            <Send size={24} />
          </div>
          <div className="ar-stat-info">
            <p className="ar-stat-title">Đang hiển thị</p>
            <h3>{recruitments.filter(r => r.status === 'Đang tuyển').length + 2}</h3>
            <p className="ar-stat-desc">Đang hiển thị trên website</p>
          </div>
        </div>

        <div className="ar-stat-card">
          <div className="ar-stat-icon ar-icon-yellow">
            <Clock size={24} />
          </div>
          <div className="ar-stat-info">
            <p className="ar-stat-title">Đang tuyển</p>
            <h3>{recruitments.filter(r => r.status === 'Đang tuyển').length}</h3>
            <p className="ar-stat-desc">Còn hạn tuyển dụng</p>
          </div>
        </div>

        <div className="ar-stat-card">
          <div className="ar-stat-icon ar-icon-red">
            <Ban size={24} />
          </div>
          <div className="ar-stat-info">
            <p className="ar-stat-title">Đã đóng</p>
            <h3>{recruitments.filter(r => r.status === 'Đã đóng').length}</h3>
            <p className="ar-stat-desc">Hết hạn tuyển dụng</p>
          </div>
        </div>

        <div className="ar-stat-card">
          <div className="ar-stat-icon ar-icon-blue">
            <Users size={24} />
          </div>
          <div className="ar-stat-info">
            <p className="ar-stat-title">Tổng ứng viên</p>
            <h3>{totalCandidates}</h3>
            <p className="ar-stat-desc">Tất cả vị trí</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="ar-main-card">
        <div className="ar-toolbar">
          <div className="ar-toolbar-left">
            <div className="ar-search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm tin tuyển dụng..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="ar-filters">
              <div className="ar-select-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'transparent', border: 'none', padding: 0 }}>
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }} className="ar-date-input" title="Từ ngày" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-white)', color: 'var(--text-color)' }} />
                <span>-</span>
                <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }} className="ar-date-input" title="Đến ngày" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-white)', color: 'var(--text-color)' }} />
              </div>
              <div className="ar-select-wrapper">
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                  <option value="all">Tất cả phòng ban</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </div>

              <div className="ar-select-wrapper">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Đang tuyển">Đang tuyển</option>
                  <option value="Đã đóng">Đã đóng</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          
          <div className="ar-toolbar-right">
            <button className="ar-btn-outline refresh" onClick={() => {
              setSearchTerm('');
              setDeptFilter('all');
              setStatusFilter('all');
              setDateFrom('');
              setDateTo('');
              setCurrentPage(1);
            }}>
              <RefreshCw size={16} /> Làm mới
            </button>
            <button className="ar-btn-primary" onClick={() => setViewMode('add')}>
              <Plus size={18} /> Thêm tin tuyển dụng
            </button>
          </div>
        </div>

        <div className="ar-table-container">
          <table className="ar-table">
            <thead>
              <tr>
                <th className="ar-col-id">#</th>
                <th>VỊ TRÍ TUYỂN DỤNG</th>
                <th>PHÒNG BAN</th>
                <th>LOẠI HÌNH</th>
                <th>ĐỊA ĐIỂM</th>
                <th>HẠN NỘP HỒ SƠ</th>
                <th>TRẠNG THÁI</th>
                <th>ỨNG VIÊN</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Không tìm thấy tin tuyển dụng nào phù hợp.
                  </td>
                </tr>
              ) : currentItems.map((job, index) => (
                <tr key={job.id}>
                  <td className="ar-col-id">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <div className="ar-job-title">{job.title}</div>
                    <div className="ar-job-code">Mã: {job.slug}</div>
                  </td>
                  <td>{job.department}</td>
                  <td>{job.type}</td>
                  <td>{job.location}</td>
                  <td>
                    <div className={`ar-date-cell ${job.status === 'Đã đóng' ? 'expired' : ''}`}>
                      <Calendar size={14} /> {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không thời hạn'}
                    </div>
                  </td>
                  <td>
                    <span className={`ar-badge ${job.status === 'Đang tuyển' ? 'active' : 'closed'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <span className="ar-candidates-count" style={{ color: job.status === 'Đang mở' ? 'var(--navy-primary)' : 'var(--text-muted)'}}>
                      {job.candidatesCount || 0}
                    </span>
                  </td>
                  <td>
                    <div className="ar-row-actions">
                      <button className="ar-btn-action" title={job.status === 'Đang mở' ? 'Đóng tin' : 'Mở tin'} onClick={() => handleToggleStatus(job)}>
                        {job.status === 'Đang mở' ? <Ban size={14} /> : <Eye size={14} />}
                      </button>
                      <button className="ar-btn-action" title="Sửa" onClick={() => handleEditClick(job)}>
                        <Edit size={14} />
                      </button>
                      <button className="ar-btn-action delete" title="Xóa" onClick={() => handleDelete(job.id, job.title)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ar-pagination-footer">
          <div className="ar-pagination-info">
            Hiển thị {filteredRecruitments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredRecruitments.length)} trong {filteredRecruitments.length} tin tuyển dụng
          </div>
          <div className="ar-pagination-controls">
            <div className="ar-page-list">
              <button 
                className="ar-page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  className={`ar-page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button 
                className="ar-page-btn"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                &gt;
              </button>
            </div>
            <div className="ar-page-select">
              <select disabled>
                <option>{itemsPerPage} / trang</option>
              </select>
              <ChevronDown size={14} style={{ marginLeft: '-1.5rem', pointerEvents: 'none', color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="dpm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="dpm-modal" onClick={e => e.stopPropagation()}>
            <button className="dpm-close-btn" onClick={() => setDeleteConfirm(null)}>
              <X size={20} />
            </button>
            
            <div className="dpm-icon-wrapper">
              <Trash2 size={32} />
            </div>
            
            <h3 className="dpm-title">Xóa tin tuyển dụng</h3>
            
            <p className="dpm-desc">
              Bạn có chắc chắn muốn xóa tin tuyển dụng <span className="dpm-desc-highlight">"{deleteConfirm.title}"</span>?
            </p>
            
            <p className="dpm-subdesc">
              Hành động này không thể hoàn tác.
            </p>
            
            <div className="dpm-actions">
              <button className="dpm-btn-cancel" onClick={() => setDeleteConfirm(null)}>Hủy bỏ</button>
              <button className="dpm-btn-delete" onClick={handleConfirmDelete}>Xóa tin tuyển dụng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
