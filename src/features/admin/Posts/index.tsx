import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, Clock, XCircle, Search, 
  ChevronDown, RefreshCw, Edit, Eye, EyeOff, Trash2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import DeletePostModal from './components/DeletePostModal';
import CategoryModal from './components/CategoryModal';
import { postsAPI } from '../../../lib/api';
import './Posts.css';

interface AdminPostsProps {
  onEdit?: (post: any) => void;
}

const parseDateToTime = (dateStr: string) => {
  if (!dateStr) return 0;
  return new Date(dateStr).getTime();
};

export default function Posts({ onEdit }: AdminPostsProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [postToDelete, setPostToDelete] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsData, catsData] = await Promise.all([
        postsAPI.getAllAdmin(),
        postsAPI.getCategories()
      ]);
      setPosts(postsData);
      setCategories(catsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  // Pagination and Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  
  const filteredPosts = posts.filter(post => {
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      if (!post.title.toLowerCase().includes(lowerTerm)) {
        return false;
      }
    }
    if (categoryFilter !== 'all' && post.category?.name !== categoryFilter) return false;
    
    // Status in DB is boolean: published = true/false. For drafts, we might rely on a published flag. 
    // Currently backend only returns published=true if not admin, but Admin gets all. Wait, GET /api/posts has `where = { published: true }`.
    // I need to fix `GET /api/posts` to return all for admin!
    
    if (authorFilter !== 'all' && post.authorName !== authorFilter) return false;
    
    if (dateFrom || dateTo) {
      const postTime = parseDateToTime(post.createdAt);
      if (postTime > 0) {
        const effectiveDateFrom = dateFrom || dateTo;
        const effectiveDateTo = dateTo || dateFrom;
        if (effectiveDateFrom && postTime < new Date(effectiveDateFrom).getTime()) return false;
        if (effectiveDateTo && postTime > new Date(effectiveDateTo).getTime() + 86399999) return false;
      }
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const currentPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Bản nháp';
      case 'hidden': return 'Đã tạm ẩn';
      default: return status;
    }
  };

  const handleToggleVisibility = async (id: number, currentPublished: boolean) => {
    try {
      const formData = new FormData();
      formData.append('published', (!currentPublished).toString());
      await postsAPI.update(id, formData);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Lỗi cập nhật trạng thái bài viết!');
    }
  };

  return (
    <div className="ap-container">
      {/* Stats Row */}
      <div className="ap-stats-grid">
        <div className="ap-stat-card">
          <div className="ap-stat-icon-wrapper total"><FileText size={24} /></div>
          <div className="ap-stat-info">
            <div className="ap-stat-value">{posts.length}</div>
            <div className="ap-stat-label">Tổng bài viết</div>
            <div className="ap-stat-sub">Tất cả bài viết</div>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-icon-wrapper published"><CheckCircle2 size={24} /></div>
          <div className="ap-stat-info">
            <div className="ap-stat-value">{posts.filter(p => p.published).length}</div>
            <div className="ap-stat-label">Đã xuất bản</div>
            <div className="ap-stat-sub">Hiển thị công khai</div>
          </div>
        </div>
        <div className="ap-stat-card">
          <div className="ap-stat-icon-wrapper draft"><Clock size={24} /></div>
          <div className="ap-stat-info">
            <div className="ap-stat-value">{posts.filter(p => !p.published).length}</div>
            <div className="ap-stat-label">Bản nháp / Tạm ẩn</div>
            <div className="ap-stat-sub">Chưa xuất bản</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ap-main-card">
        {/* Filters */}
        <div className="ap-filters-row">
          <div className="ap-search-wrapper">
            <Search size={18} className="ap-search-icon" />
            <input type="text" placeholder="Tìm kiếm bài viết..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
          </div>
          <div className="ap-select-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'transparent', border: 'none', padding: 0 }}>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1); }} className="ap-date-input" title="Từ ngày" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-white)', color: 'var(--text-color)' }} />
            <span>-</span>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1); }} className="ap-date-input" title="Đến ngày" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-white)', color: 'var(--text-color)' }} />
          </div>
          <div className="ap-select-wrapper">
            <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
          <div className="ap-select-wrapper">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">Tất cả trạng thái</option>
            </select>
            <ChevronDown size={16} />
          </div>
          <div className="ap-select-wrapper">
            <select value={authorFilter} onChange={e => { setAuthorFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">Tất cả tác giả</option>
              <option value="Admin">Admin</option>
            </select>
            <ChevronDown size={16} />
          </div>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            style={{ 
              background: 'white', color: 'var(--gold-accent)', border: '1px solid var(--gold-accent)', 
              padding: '0 1rem', borderRadius: '4px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 500,
              height: '38px', whiteSpace: 'nowrap'
            }}
          >
            <FileText size={16} /> Quản lý danh mục
          </button>
          <button className="ap-btn-refresh" onClick={() => {
            setCategoryFilter('all');
            setStatusFilter('all');
            setAuthorFilter('all');
            setDateFrom('');
            setDateTo('');
            setSearchTerm('');
            setCurrentPage(1);
          }}>
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>

        {/* Table */}
        <div className="ap-table-wrapper">
          <table className="ap-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>TIÊU ĐỀ</th>
                <th>DANH MỤC</th>
                <th>TÁC GIẢ</th>
                <th style={{ textAlign: 'center' }}>TRẠNG THÁI</th>
                <th style={{ textAlign: 'center' }}>LƯỢT XEM</th>
                <th>NGÀY TẠO</th>
                <th style={{ textAlign: 'center' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</td>
                </tr>
              ) : currentPosts.map((post, index) => {
                const isPublished = post.published;
                const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const imgUrl = post.thumbnail ? (post.thumbnail.startsWith('http') ? post.thumbnail : BASE_URL.replace('/api', '') + post.thumbnail) : 'https://placehold.co/100x100?text=No+Image';
                return (
                <tr key={post.id}>
                  <td className="ap-text-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <div className="ap-post-cell">
                      <img src={imgUrl} alt={post.title} className="ap-post-thumb" style={{ objectFit: 'cover' }} />
                      <div className="ap-post-info">
                        <div className="ap-post-name">{post.title}</div>
                        <div className="ap-post-slug">{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="ap-text-cell">{post.category?.name || 'Chưa phân loại'}</td>
                  <td className="ap-text-cell">{post.authorName}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`ap-status ${isPublished ? 'published' : 'is-hidden'}`}>
                      {isPublished ? 'Đã xuất bản' : 'Tạm ẩn'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="ap-views-cell" style={{ justifyContent: 'center' }}>
                      {post.views || 0} <Eye size={14} />
                    </div>
                  </td>
                  <td>
                    <div className="ap-text-cell">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td>
                    <div className="ap-actions" style={{ justifyContent: 'center' }}>
                      <button className="ap-action-btn" title="Chỉnh sửa" onClick={() => onEdit && onEdit(post)}><Edit size={16} /></button>
                      <button 
                        className="ap-action-btn" 
                        title={!isPublished ? "Hiện bài viết" : "Tạm ẩn"} 
                        onClick={() => handleToggleVisibility(post.id, isPublished)}
                      >
                        {!isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button className="ap-action-btn delete" title="Xóa" onClick={() => setPostToDelete(post)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="ap-pagination-wrapper">
          <div className="ap-pagination-info">
            Hiển thị {filteredPosts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredPosts.length)} trong {filteredPosts.length} bài viết
          </div>
          <div className="ap-pagination">
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

      {postToDelete && (
        <DeletePostModal
          postTitle={postToDelete.title}
          onClose={() => setPostToDelete(null)}
          onConfirm={async () => {
            try {
              await postsAPI.delete(postToDelete.id);
              fetchData();
              setPostToDelete(null);
            } catch (error) {
              console.error(error);
              alert('Xóa thất bại!');
            }
          }}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal 
          onClose={() => setIsCategoryModalOpen(false)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
