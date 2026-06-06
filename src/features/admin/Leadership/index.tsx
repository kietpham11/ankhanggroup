import React, { useState } from 'react';
import { 
  Users, CheckCircle, EyeOff, Trash2, Search, 
  ChevronDown, RefreshCw, Edit2, Eye, ShieldCheck,
  ChevronLeft, ChevronRight, Plus
} from 'lucide-react';
import MemberDetail from './components/MemberDetail';
import DeleteMemberModal from './components/DeleteMemberModal';
import AddMemberModal from './components/AddMemberModal';
import './Leadership.css';

import { membersAPI } from '../../../lib/api';

export default function Leadership() {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [detailMode, setDetailMode] = useState<'view' | 'edit'>('view');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const [members, setMembers] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  React.useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const data = await membersAPI.getAll();
      setMembers(data);
    } catch (err) {
      console.error(err);
      alert('Không thể tải danh sách thành viên');
    } finally {
      setIsLoading(false);
    }
  };

  // Derive unique positions for filter
  const positions = Array.from(new Set(members.map(m => m.position)));

  // Filtering
  const filteredMembers = members.filter(m => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      if (!m.name.toLowerCase().includes(lower) && !m.email.toLowerCase().includes(lower)) {
        return false;
      }
    }
    if (positionFilter !== 'all' && m.position !== positionFilter) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const handleUpdateMember = async (id: number, updatedData: any) => {
    try {
      await membersAPI.update(id, updatedData);
      setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
    } catch (err) {
      alert('Lỗi cập nhật thành viên');
    }
  };

  const handleToggleStatus = async (id: number) => {
    const member = members.find(m => m.id === id);
    if (member) {
      const newStatus = member.status === 'Đang hiển thị' ? 'Đang ẩn' : 'Đang hiển thị';
      await handleUpdateMember(id, { status: newStatus });
    }
  };

  const handleAddMember = async (newMemberData: any) => {
    try {
      const createdMember = await membersAPI.create(newMemberData);
      setMembers([...members, createdMember]);
      setIsAddMemberModalOpen(false);
    } catch (err) {
      alert('Lỗi khi thêm thành viên');
    }
  };

  const confirmDelete = async () => {
    if (memberToDelete) {
      try {
        await membersAPI.delete(memberToDelete.id);
        setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
        setMemberToDelete(null);
      } catch (err) {
        alert('Lỗi xóa thành viên');
      }
    }
  };

  const currentMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredMembers.length);

  const handleViewDetail = (member: any, mode: 'view' | 'edit' = 'view') => {
    setSelectedMember(member);
    setDetailMode(mode);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedMember(null);
    setViewMode('list');
  };

  if (isLoading) return <div style={{ padding: '2rem', color: '#fff' }}>Đang tải danh sách...</div>;

  if (viewMode === 'detail' && selectedMember) {
    return (
      <>
        <MemberDetail 
          member={selectedMember} 
          mode={detailMode} 
          onBack={handleBackToList} 
          onDeleteClick={() => setMemberToDelete(selectedMember)} 
          onUpdate={(updatedData) => handleUpdateMember(selectedMember.id, updatedData)}
        />
        {memberToDelete && (
          <DeleteMemberModal 
            memberName={memberToDelete.name}
            onClose={() => setMemberToDelete(null)}
            onConfirm={() => {
              setMembers(members.filter(m => m.id !== memberToDelete.id));
              setMemberToDelete(null);
              handleBackToList();
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="al-container">
      {/* Stats Grid */}
      <div className="al-stats-grid">
        <div className="al-stat-card">
          <div className="al-stat-icon al-icon-yellow"><Users size={24} /></div>
          <div className="al-stat-info">
            <h3>{members.length}</h3>
            <p className="al-stat-title">Tổng thành viên</p>
            <p className="al-stat-desc">Tất cả thành viên</p>
          </div>
        </div>
        <div className="al-stat-card">
          <div className="al-stat-icon al-icon-blue"><CheckCircle size={24} /></div>
          <div className="al-stat-info">
            <h3>{members.filter(m => m.status === 'Đang hiển thị').length}</h3>
            <p className="al-stat-title">Đang hiển thị</p>
            <p className="al-stat-desc">Đang hiển thị trên website</p>
          </div>
        </div>
        <div className="al-stat-card">
          <div className="al-stat-icon al-icon-yellow"><EyeOff size={24} /></div>
          <div className="al-stat-info">
            <h3>{members.filter(m => m.status === 'Đang ẩn').length}</h3>
            <p className="al-stat-title">Đang ẩn</p>
            <p className="al-stat-desc">Không hiển thị trên website</p>
          </div>
        </div>
        <div className="al-stat-card">
          <div className="al-stat-icon al-icon-blue"><Trash2 size={24} /></div>
          <div className="al-stat-info">
            <h3>0</h3>
            <p className="al-stat-title">Đã xóa</p>
            <p className="al-stat-desc">Thành viên đã xóa</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="al-main-card">
        {/* Toolbar */}
        <div className="al-toolbar">
          <div className="al-toolbar-left">
            <div className="al-search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm thành viên..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            <div className="al-filters">
              <div className="al-select-wrapper">
                <select 
                  value={positionFilter} 
                  onChange={(e) => { setPositionFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">Tất cả vị trí</option>
                  {positions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </div>

              <div className="al-select-wrapper">
                <select 
                  value={statusFilter} 
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Đang hiển thị">Đang hiển thị</option>
                  <option value="Đang ẩn">Đang ẩn</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          
          <div className="al-toolbar-right" style={{ display: 'flex', gap: '1rem' }}>
            <button className="al-btn-outline" onClick={() => {
              setSearchTerm('');
              setPositionFilter('all');
              setStatusFilter('all');
              setCurrentPage(1);
            }}>
              <RefreshCw size={16} /> Làm mới
            </button>
            <button style={{ 
                background: '#d89f2a', color: '#fff', border: 'none', 
                padding: '0.5rem 1rem', borderRadius: '4px', 
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem'
              }} onClick={() => setIsAddMemberModalOpen(true)}>
              <Plus size={16} /> Thêm thành viên
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="al-table-container">
          <table className="al-table">
            <thead>
              <tr>
                <th>#</th>
                <th>HÌNH ẢNH</th>
                <th>HỌ VÀ TÊN</th>
                <th>CHỨC VỤ</th>
                <th>TRẠNG THÁI</th>
                <th>THỨ TỰ</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Không tìm thấy thành viên nào.
                  </td>
                </tr>
              ) : currentMembers.map((member, index) => (
                <tr key={member.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{startItem + index}</td>
                  <td>
                    <img src={member.avatar} alt={member.name} className="al-avatar" />
                  </td>
                  <td>
                    <div className="al-user-info">
                      <div className="al-user-name">{member.name}</div>
                      <div className="al-user-email">{member.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="al-role-cell">
                      {member.position}
                      {member.isLeader && (
                        <div className="al-role-badge" title="Lãnh đạo cấp cao">
                          <ShieldCheck size={14} fill="#D4A017" stroke="#fff" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`al-badge ${member.status === 'Đang hiển thị' ? 'visible' : 'is-hidden'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>{member.orderIndex}</td>
                  <td>
                    <div className="al-actions">
                      <button className="al-btn-icon" title="Xem chi tiết" onClick={() => handleViewDetail(member, 'view')}>
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className="al-btn-icon" 
                        title={member.status === 'Đang hiển thị' ? "Tạm ẩn" : "Hiển thị"} 
                        onClick={() => handleToggleStatus(member.id)}
                      >
                        {member.status === 'Đang hiển thị' ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button className="al-btn-icon delete" title="Xóa" onClick={() => setMemberToDelete(member)}>
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
        {filteredMembers.length > 0 && (
          <div className="al-footer">
            <div className="al-showing-text">
              Hiển thị {startItem} đến {endItem} trong {filteredMembers.length} thành viên
            </div>
            <div className="al-pagination">
              <button 
                className="al-page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  className={`al-page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button 
                className="al-page-btn" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {memberToDelete && (
        <DeleteMemberModal 
          memberName={memberToDelete.name}
          onClose={() => setMemberToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <AddMemberModal 
          onClose={() => setIsAddMemberModalOpen(false)}
          onSave={handleAddMember}
        />
      )}
    </div>
  );
}
