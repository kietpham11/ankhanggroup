import React, { useState } from 'react';
import { 
  Users, Clock, UserCheck, CheckCircle, XCircle,
  Search, ChevronDown, RefreshCw, Eye, MoreHorizontal,
  Phone, Mail, FileText, Download, Check
} from 'lucide-react';
import './Candidates.css';
import { candidatesAPI, getFullImgUrl } from '../../../lib/api';
const parseDateToTime = (dateStr: string) => {
  if (!dateStr) return 0;
  return new Date(dateStr).getTime();
};

export default function Candidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewCandidate, setViewCandidate] = useState<any>(null);
  const [updateCandidate, setUpdateCandidate] = useState<any>(null);
  const itemsPerPage = 10;

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      const data = await candidatesAPI.getAll();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      alert('Không thể tải danh sách ứng viên');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadCandidates();
  }, []);

  // Derived values for select filters
  const positions = Array.from(new Set(candidates.map(c => c.job?.title).filter(Boolean)));
  const sources = ['Website', 'Facebook', 'LinkedIn', 'Khác']; // Mock sources

  // Filter Logic
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cand.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cand.phone.includes(searchTerm) ||
                          cand.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'all' || cand.job?.title === positionFilter;
    const matchesStatus = statusFilter === 'all' || cand.status === statusFilter;
    const matchesSource = sourceFilter === 'all'; // Ignore source filtering since not in DB

    
    let matchesDate = true;
    if (dateFrom || dateTo) {
      const candTime = new Date(cand.createdAt).getTime();
      if (candTime > 0) {
        const effectiveDateFrom = dateFrom || dateTo;
        const effectiveDateTo = dateTo || dateFrom;
        if (effectiveDateFrom && candTime < new Date(effectiveDateFrom).getTime()) matchesDate = false;
        if (effectiveDateTo && candTime > new Date(effectiveDateTo).getTime() + 86399999) matchesDate = false;
      }
    }
    
    return matchesSearch && matchesPosition && matchesStatus && matchesSource && matchesDate;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const currentItems = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getInitials = (name: string) => {
    const parts = (name || '').trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]?.[0] || ''}${parts[parts.length - 1]?.[0] || ''}`.toUpperCase();
    }
    return (name || 'U').substring(0, 2).toUpperCase();
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Mới ứng tuyển': return 'status-new';
      case 'Đang xem xét': return 'status-reviewing';
      case 'Đã phỏng vấn': return 'status-interviewed';
      case 'Không phù hợp': return 'status-rejected';
      default: return '';
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const updated = await candidatesAPI.updateStatus(id, newStatus);
      setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
      setUpdateCandidate(null);
    } catch (err) {
      alert('Lỗi cập nhật trạng thái');
    }
  };

  return (
    <div className="acand-container">
      {/* Header section (if needed, but usually handled by Admin.tsx wrapper) */}

      {/* Stats Row */}
      <div className="acand-stats-row">
        <div className="acand-stat-card">
          <div className="acand-stat-icon acand-icon-blue">
            <Users size={24} />
          </div>
          <div className="acand-stat-info">
            <p className="acand-stat-title">Tổng ứng viên</p>
            <h3>{candidates.length}</h3>
            <p className="acand-stat-desc">Tất cả</p>
          </div>
        </div>

        <div className="acand-stat-card">
          <div className="acand-stat-icon acand-icon-yellow">
            <Clock size={24} />
          </div>
          <div className="acand-stat-info">
            <p className="acand-stat-title">Mới ứng tuyển</p>
            <h3>{candidates.filter(c => c.status === 'Mới ứng tuyển').length}</h3>
            <p className="acand-stat-desc">Ứng viên mới</p>
          </div>
        </div>

        <div className="acand-stat-card">
          <div className="acand-stat-icon acand-icon-green">
            <UserCheck size={24} />
          </div>
          <div className="acand-stat-info">
            <p className="acand-stat-title">Đang xem xét</p>
            <h3>{candidates.filter(c => c.status === 'Đang xem xét').length}</h3>
            <p className="acand-stat-desc">Đang xử lý</p>
          </div>
        </div>

        <div className="acand-stat-card">
          <div className="acand-stat-icon acand-icon-purple">
            <CheckCircle size={24} />
          </div>
          <div className="acand-stat-info">
            <p className="acand-stat-title">Đã phỏng vấn</p>
            <h3>{candidates.filter(c => c.status === 'Đã phỏng vấn').length}</h3>
            <p className="acand-stat-desc">Đã phỏng vấn</p>
          </div>
        </div>

        <div className="acand-stat-card">
          <div className="acand-stat-icon acand-icon-red">
            <XCircle size={24} />
          </div>
          <div className="acand-stat-info">
            <p className="acand-stat-title">Không phù hợp</p>
            <h3>{candidates.filter(c => c.status === 'Không phù hợp').length}</h3>
            <p className="acand-stat-desc">Đã từ chối</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="acand-main-card">
        <div className="acand-toolbar">
          <div className="acand-toolbar-left">
            <div className="acand-search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm ứng viên, vị trí ứng tuyển..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="acand-filters">
              <div className="acand-select-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'transparent', border: 'none', padding: 0 }}>
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }} className="acand-date-input" title="Từ ngày" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-white)', color: 'var(--text-color)' }} />
                <span>-</span>
                <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }} className="acand-date-input" title="Đến ngày" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-white)', color: 'var(--text-color)' }} />
              </div>
              <div className="acand-select-wrapper">
                <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
                  <option value="all">Tất cả vị trí</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </div>

              <div className="acand-select-wrapper">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Mới ứng tuyển">Mới ứng tuyển</option>
                  <option value="Đang xem xét">Đang xem xét</option>
                  <option value="Đã phỏng vấn">Đã phỏng vấn</option>
                  <option value="Không phù hợp">Không phù hợp</option>
                </select>
                <ChevronDown size={16} />
              </div>

              <div className="acand-select-wrapper">
                <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                  <option value="all">Tất cả nguồn</option>
                  {sources.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          
          <div className="acand-toolbar-right">
            <button className="acand-btn-outline refresh" onClick={() => {
              setSearchTerm('');
              setPositionFilter('all');
              setStatusFilter('all');
              setSourceFilter('all');
              setDateFrom('');
              setDateTo('');
              setCurrentPage(1);
            }}>
              <RefreshCw size={16} /> Làm mới
            </button>
          </div>
        </div>

        <div className="acand-table-container">
          <table className="acand-table">
            <thead>
              <tr>
                <th>ỨNG VIÊN</th>
                <th>VỊ TRÍ ỨNG TUYỂN</th>
                <th>NGUỒN</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY ỨNG TUYỂN</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Không tìm thấy ứng viên nào phù hợp.
                  </td>
                </tr>
              ) : currentItems.map((cand, index) => (
                <tr key={cand.id}>
                  <td>
                    <div className="acand-candidate-cell">
                      <div className={`acand-avatar ${!cand.avatarImg ? 'color-' + (cand.id % 6) : ''}`}>
                        {cand.avatarImg ? (
                          <img src={cand.avatarImg} alt={cand.name} />
                        ) : (
                          getInitials(cand.name)
                        )}
                      </div>
                      <div className="acand-candidate-info">
                        <div className="acand-name">{cand.name}</div>
                        <div className="acand-contact">
                          <Phone size={12} /> {cand.phone}
                        </div>
                        <div className="acand-contact">
                          <Mail size={12} /> {cand.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><span className="acand-job-position">{cand.job?.title || 'Không rõ'}</span></td>
                  <td><span className="acand-source">Website</span></td>
                  <td>
                    <span className={`acand-badge ${getStatusClass(cand.status)}`}>
                      {cand.status}
                    </span>
                  </td>
                  <td>
                    <div className="acand-date">
                      <span>{new Date(cand.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="acand-time">{new Date(cand.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                  </td>
                  <td>
                    <div className="acand-row-actions">
                      <button className="acand-btn-action" title="Xem chi tiết" onClick={() => setViewCandidate(cand)}>
                        <Eye size={14} />
                      </button>
                      <button className="acand-btn-action" title="Cập nhật trạng thái" onClick={() => setUpdateCandidate(cand)}>
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="acand-pagination-footer">
          <div className="acand-pagination-info">
            Hiển thị {currentItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} đến {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} trong {filteredCandidates.length} ứng viên
          </div>
          <div className="acand-pagination-controls">
            <div className="acand-page-list">
              <button 
                className="acand-page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  className={`acand-page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button 
                className="acand-page-btn"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                &gt;
              </button>
            </div>
            <div className="acand-page-select">
              <select disabled>
                <option>5 / trang</option>
              </select>
              <ChevronDown size={14} style={{ marginLeft: '-1.5rem', pointerEvents: 'none', color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* View Candidate Modal */}
      {viewCandidate && (
        <div className="acand-modal-overlay" onClick={() => setViewCandidate(null)}>
          <div className="acand-modal-content" onClick={e => e.stopPropagation()}>
            <div className="acand-modal-header">
              <h3>Thông tin ứng viên</h3>
              <button className="acand-close-btn" onClick={() => setViewCandidate(null)}>×</button>
            </div>
            <div className="acand-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div className={`acand-avatar ${!viewCandidate.avatarImg ? 'color-' + (viewCandidate.id % 6) : ''}`} style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                  {viewCandidate.avatarImg ? (
                    <img src={viewCandidate.avatarImg} alt={viewCandidate.name} />
                  ) : (
                    getInitials(viewCandidate.name)
                  )}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem 0', color: 'var(--navy-primary)', fontSize: '1.2rem' }}>{viewCandidate.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>{viewCandidate.position}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Số điện thoại</label>
                  <p style={{ margin: '0.35rem 0 0 0', fontWeight: 600, color: 'var(--navy-primary)' }}>{viewCandidate.phone}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</label>
                  <p style={{ margin: '0.35rem 0 0 0', fontWeight: 600, color: 'var(--navy-primary)' }}>{viewCandidate.email}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nguồn ứng tuyển</label>
                  <p style={{ margin: '0.35rem 0 0 0', fontWeight: 600 }}>{viewCandidate.source}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ngày ứng tuyển</label>
                  <p style={{ margin: '0.35rem 0 0 0', fontWeight: 600 }}>{viewCandidate.date} - {viewCandidate.time}</p>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trạng thái hiện tại</label>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className={`acand-badge ${getStatusClass(viewCandidate.status)}`}>{viewCandidate.status}</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hồ sơ đính kèm (CV)</label>
                <div className="acand-cv-doc">
                  <div className="acand-cv-icon">
                    <FileText size={20} />
                  </div>
                  <div className="acand-cv-info">
                    <div className="acand-cv-name">CV_{viewCandidate.name.replace(/\s+/g, '')}.pdf</div>
                    <div className="acand-cv-size">1.2 MB</div>
                  </div>
                  <button className="acand-cv-download" title="Tải xuống CV" onClick={() => {
                    if (!viewCandidate.cvUrl) {
                      alert('Ứng viên này chưa cập nhật CV.');
                      return;
                    }
                    window.open(getFullImgUrl(viewCandidate.cvUrl), '_blank');
                  }}>
                    <Download size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="acand-modal-footer">
              <button className="acand-btn-cancel" onClick={() => setViewCandidate(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {updateCandidate && (
        <div className="acand-modal-overlay" onClick={() => setUpdateCandidate(null)}>
          <div className="acand-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="acand-modal-header">
              <h3 style={{ color: 'var(--navy-primary)' }}>Cập nhật trạng thái</h3>
              <button className="acand-close-btn" onClick={() => setUpdateCandidate(null)}>×</button>
            </div>
            <div className="acand-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-color)', fontSize: '0.95rem' }}>
                Cập nhật trạng thái cho ứng viên <strong style={{ color: 'var(--navy-primary)' }}>{updateCandidate.name}</strong>:
              </p>
              {['Mới ứng tuyển', 'Đang xem xét', 'Đã phỏng vấn', 'Không phù hợp'].map(status => (
                <button 
                  key={status}
                  className={`acand-status-btn ${updateCandidate.status === status ? 'active' : ''}`}
                  onClick={() => handleUpdateStatus(updateCandidate.id, status)}
                >
                  <span>{status}</span>
                  {updateCandidate.status === status && <Check size={18} />}
                </button>
              ))}
            </div>
            <div className="acand-modal-footer">
              <button className="acand-btn-cancel" onClick={() => setUpdateCandidate(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
