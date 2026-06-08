import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Clock, PhoneCall, 
  Search, ChevronDown, Download, Phone, 
  Mail, Calendar, MessageSquare, MoreHorizontal,
  ChevronLeft, ChevronRight, Eye, Check, RefreshCw
} from 'lucide-react';
import './Contacts.css';
import { contactsAPI } from '../../../lib/api';

const mapStatusToUI = (status: string) => {
  if (status === 'PENDING') return { label: 'Mới', class: 'new' };
  if (status === 'RESOLVED') return { label: 'Đã liên hệ', class: 'contacted' };
  return { label: 'Thất bại', class: 'red' }; // Or whatever other status
};

const formatDate = (isoStr: string) => {
  const d = new Date(isoStr);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const parseDateToTime = (dateStr: string) => {
  if (!dateStr) return 0;
  const parts = dateStr.split(' ')[0].split('/');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
  }
  return 0;
};

export default function Contacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneModal, setPhoneModal] = useState<any>(null);
  const [optionsModal, setOptionsModal] = useState<{ contact: any, selectedStatus: string, note: string } | null>(null);
  const itemsPerPage = 5;

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const data = await contactsAPI.getAll();
      const mapped = data.map((c: any) => {
        const uiStatus = mapStatusToUI(c.status);
        const nameParts = (c.name || '').trim().split(/\s+/);
        const initials = nameParts.length > 1 
          ? (nameParts[0]?.[0] || '') + (nameParts[nameParts.length - 1]?.[0] || '')
          : (nameParts[0]?.[0] || 'U');
        return {
          id: c.id,
          initials: initials.toUpperCase(),
          name: c.name || 'Không tên',
          status: uiStatus.label,
          statusClass: uiStatus.class,
          avatarClass: uiStatus.class,
          project: c.property?.title || 'Đăng ký chung',
          subProject: c.message || '',
          phone: c.phone || '',
          email: c.email || '',
          datetime: formatDate(c.createdAt),
          rawStatus: c.status
        };
      });
      setContacts(mapped);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(c => {
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      if (!c.name.toLowerCase().includes(lowerTerm) && 
          !c.phone.includes(searchTerm) && 
          !c.email.toLowerCase().includes(lowerTerm) && 
          !c.project.toLowerCase().includes(lowerTerm)) {
        return false;
      }
    }
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    
    if (dateFrom || dateTo) {
      const contactTime = parseDateToTime(c.datetime);
      if (contactTime > 0) {
        const effectiveDateFrom = dateFrom || dateTo;
        const effectiveDateTo = dateTo || dateFrom;
        if (effectiveDateFrom && contactTime < new Date(effectiveDateFrom).getTime()) return false;
        if (effectiveDateTo && contactTime > new Date(effectiveDateTo).getTime() + 86399999) return false;
      }
    }
    
    return true;
  });
  
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const currentContacts = filteredContacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportExcel = () => {
    const headers = ['ID', 'Tên Khách Hàng', 'SĐT', 'Email', 'Dự Án', 'Phân Khu', 'Thời Gian', 'Trạng Thái'];
    const csvContent = [
      headers.join(','),
      ...filteredContacts.map(c => 
        [c.id, `"${c.name}"`, `"${c.phone}"`, `"${c.email}"`, `"${c.project}"`, `"${c.subProject}"`, `"${c.datetime}"`, `"${c.status}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Danh_sach_lien_he_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMoreAction = (contact: any) => {
    setOptionsModal({ contact, selectedStatus: '', note: '' });
  };

  const handleSaveOptions = async () => {
    if (!optionsModal) return;
    const { contact, selectedStatus, note } = optionsModal;
    
    let backendStatus = 'PENDING';
    if (selectedStatus === '1') backendStatus = 'RESOLVED';
    else if (selectedStatus === '2') backendStatus = 'REJECTED'; // Or any appropriate failed state

    try {
      await contactsAPI.updateStatus(contact.id, backendStatus);
      // Optimistic update
      const uiStatus = mapStatusToUI(backendStatus);
      setContacts(contacts.map(c => c.id === contact.id ? { 
        ...c, 
        status: uiStatus.label, 
        statusClass: uiStatus.class, 
        rawStatus: backendStatus,
        subProject: note ? `Ghi chú: ${note}` : c.subProject
      } : c));
      alert('Cập nhật trạng thái thành công!');
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
    
    setOptionsModal(null);
  };

  return (
    <div className="ac-container">
      {/* Stats Grid */}
      <div className="ac-stats-grid">
        <div className="ac-stat-card">
          <div className="ac-stat-left">
            <div className="ac-stat-icon ac-icon-blue">
              <Users size={24} />
            </div>
            <div className="ac-stat-info">
              <div className="ac-stat-label">Tổng liên hệ</div>
              <div className="ac-stat-value">{contacts.length}</div>
              <div className="ac-stat-sub">Khách hàng</div>
            </div>
          </div>
        </div>

        <div className="ac-stat-card">
          <div className="ac-stat-left">
            <div className="ac-stat-icon ac-icon-green">
              <UserPlus size={24} />
            </div>
            <div className="ac-stat-info">
              <div className="ac-stat-label">Mới</div>
              <div className="ac-stat-value">{contacts.filter(c => c.status === 'Mới').length}</div>
              <div className="ac-stat-sub">Khách hàng</div>
            </div>
          </div>
          <div className="ac-stat-percent ac-pct-green">
            {contacts.length > 0 ? Math.round((contacts.filter(c => c.status === 'Mới').length / contacts.length) * 100) : 0}%
          </div>
        </div>

        <div className="ac-stat-card">
          <div className="ac-stat-left">
            <div className="ac-stat-icon ac-icon-purple">
              <PhoneCall size={24} />
            </div>
            <div className="ac-stat-info">
              <div className="ac-stat-label">Đã liên hệ</div>
              <div className="ac-stat-value">{contacts.filter(c => c.status === 'Đã liên hệ').length}</div>
              <div className="ac-stat-sub">Khách hàng</div>
            </div>
          </div>
          <div className="ac-stat-percent ac-pct-purple">
            {contacts.length > 0 ? Math.round((contacts.filter(c => c.status === 'Đã liên hệ').length / contacts.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="ac-main-card">
        <div className="ac-main-header">
          <div className="ac-header-title">Danh sách liên hệ</div>
          <div className="ac-toolbar">
            <div className="ac-search-box">
              <Search size={18} />
              <input type="text" placeholder="Tìm theo tên, SĐT, email, dự án..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
            
            <div className="ac-filters" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="ac-filter-group">
                <span className="ac-filter-label">Từ ngày - Đến ngày</span>
                <div className="ac-select-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'transparent', border: 'none', padding: 0 }}>
                  <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }} className="ac-date-input" title="Từ ngày" style={{ padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-white)', color: 'var(--text-color)' }} />
                  <span>-</span>
                  <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }} className="ac-date-input" title="Đến ngày" style={{ padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-white)', color: 'var(--text-color)' }} />
                </div>
              </div>
              <div className="ac-filter-group">
                <span className="ac-filter-label">Trạng thái</span>
                <div className="ac-select-wrapper">
                  <select 
                    value={statusFilter} 
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Mới">Mới</option>
                    <option value="Đã liên hệ">Đã liên hệ</option>
                    <option value="Thất bại">Thất bại</option>
                  </select>
                  <ChevronDown size={16} />
                </div>
              </div>
              <div className="ac-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="ac-btn-export" style={{ background: 'var(--bg-white)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }} onClick={() => {
                  setStatusFilter('all');
                  setDateFrom('');
                  setDateTo('');
                  setSearchTerm('');
                  setCurrentPage(1);
                }}>
                  <RefreshCw size={16} /> Làm mới
                </button>
                <button className="ac-btn-export" onClick={handleExportExcel}>
                  <Download size={16} /> Xuất Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="ac-table-container">
          <table className="ac-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Thông tin liên hệ</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map(contact => (
                <tr key={contact.id}>
                  <td>
                    <div className="ac-client-cell">
                      <div className={`ac-avatar ${contact.avatarClass}`}>{contact.initials}</div>
                      <div className="ac-client-info">
                        <span className="ac-client-name">{contact.name}</span>
                        {contact.status === 'Mới' && (
                          <span className="ac-badge new">Mới</span>
                        )}
                        {contact.status === 'Đã liên hệ' && (
                          <span className="ac-badge contacted">Đã liên hệ</span>
                        )}
                        {contact.status === 'Thất bại' && (
                          <span className="ac-badge" style={{ background: '#fef2f2', color: '#ef4444' }}>Thất bại</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="ac-contact-item">
                      <Phone size={14} /> {contact.phone}
                    </div>
                    {contact.note && (
                      <div className="ac-text-sub" style={{ marginTop: '0.4rem', color: '#ef4444', fontStyle: 'italic' }}>
                        * Ghi chú: {contact.note}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="ac-time-cell">
                      <Calendar size={14} /> {contact.datetime}
                    </div>
                  </td>
                  <td>
                    <span className={`ac-badge ${contact.statusClass}`}>{contact.status}</span>
                  </td>
                  <td>
                    <div className="ac-row-actions">
                      <button className="ac-btn-action" title="Gọi điện" onClick={() => setPhoneModal(contact)}>
                        <Phone size={14} />
                      </button>
                      <button className="ac-btn-action" title="Tùy chọn khác" onClick={() => handleMoreAction(contact)}>
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ac-pagination-footer">
          <div className="ac-pagination-info">
            Hiển thị {filteredContacts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredContacts.length)} trong {filteredContacts.length} liên hệ
          </div>
          <div className="ac-pagination-controls">
            <div className="ac-page-list">
              <button 
                className="ac-page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              
              <button className={`ac-page-btn ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
              <button className={`ac-page-btn ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
              <button className={`ac-page-btn ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
              <button className="ac-page-btn" disabled>...</button>
              <button className={`ac-page-btn ${currentPage === 7 ? 'active' : ''}`} onClick={() => setCurrentPage(7)}>7</button>

              <button 
                className="ac-page-btn" 
                disabled={currentPage === 7}
                onClick={() => setCurrentPage(prev => Math.min(7, prev + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="ac-page-size">
              <div className="ac-select-wrapper">
                <select defaultValue="5" style={{ minWidth: 'auto', padding: '0.4rem 2rem 0.4rem 1rem' }}>
                  <option value="5">5 / trang</option>
                  <option value="10">10 / trang</option>
                  <option value="20">20 / trang</option>
                </select>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Modal */}
      {phoneModal && (
        <div className="ac-modal-overlay" onClick={() => setPhoneModal(null)}>
          <div className="ac-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="ac-modal-header">
              <h3>Thông tin liên lạc</h3>
              <button className="ac-close-btn" onClick={() => setPhoneModal(null)}>×</button>
            </div>
            <div className="ac-modal-body">
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>
                Số điện thoại của khách hàng <strong style={{ color: 'var(--navy-primary)' }}>{phoneModal.name}</strong>:
              </p>
              <div className="ac-phone-display">
                <Phone size={24} color="var(--gold-accent)" />
                <span className="ac-phone-number">{phoneModal.phone}</span>
              </div>
            </div>
            <div className="ac-modal-footer">
              <button className="ac-btn-primary" onClick={() => setPhoneModal(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Options Modal */}
      {optionsModal && (
        <div className="ac-modal-overlay" onClick={() => setOptionsModal(null)}>
          <div className="ac-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="ac-modal-header">
              <h3>Tùy chọn liên hệ</h3>
              <button className="ac-close-btn" onClick={() => setOptionsModal(null)}>×</button>
            </div>
            <div className="ac-modal-body" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-color)', fontSize: '0.95rem' }}>
                Tùy chọn cho khách hàng <strong style={{ color: 'var(--navy-primary)' }}>{optionsModal.contact.name}</strong>:
              </p>
              
              <button 
                className={`ac-status-btn ${optionsModal.selectedStatus === '1' ? 'active' : ''}`}
                onClick={() => setOptionsModal({ ...optionsModal, selectedStatus: '1', note: '' })}
              >
                <span>Đánh dấu Đã liên hệ</span>
                {optionsModal.selectedStatus === '1' && <Check size={18} />}
              </button>

              <button 
                className={`ac-status-btn ${optionsModal.selectedStatus === '2' ? 'active' : ''}`}
                onClick={() => setOptionsModal({ ...optionsModal, selectedStatus: '2' })}
                style={{ marginBottom: '0' }}
              >
                <span>Không nghe máy / Từ chối</span>
                {optionsModal.selectedStatus === '2' && <Check size={18} />}
              </button>

              {optionsModal.selectedStatus === '2' && (
                <textarea 
                  className="ac-note-input"
                  placeholder="Nhập ghi chú lý do (VD: Thuê bao, Không có nhu cầu...)"
                  value={optionsModal.note}
                  onChange={(e) => setOptionsModal({ ...optionsModal, note: e.target.value })}
                  autoFocus
                />
              )}
            </div>
            <div className="ac-modal-footer">
              <button className="ac-btn-cancel" onClick={() => setOptionsModal(null)}>Hủy</button>
              <button 
                className="ac-btn-primary" 
                onClick={handleSaveOptions}
                disabled={!optionsModal.selectedStatus || (optionsModal.selectedStatus === '2' && !optionsModal.note.trim())}
                style={{ opacity: (!optionsModal.selectedStatus || (optionsModal.selectedStatus === '2' && !optionsModal.note.trim())) ? 0.5 : 1 }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
