import React, { useState, useEffect } from 'react';
import {
  Search, Calendar, Eye, ChevronRight, Star,
  Send, ShieldCheck, TrendingUp, Headphones, Lock
} from 'lucide-react';
import { postsAPI, contactsAPI } from '../../lib/api';
import './News.css';

export default function News({ onViewDetail, banner }: { onViewDetail?: (id: number | string) => void, banner?: string }) {
  const [activeCategory, setActiveCategory] = useState<any>({ id: 'all', name: 'Tất cả' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([{ id: 'all', name: 'Tất cả' }]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  const [subName, setSubName] = useState('');
  const [subPhone, setSubPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subPhone) return;
    try {
      setIsSubmitting(true);
      await contactsAPI.send({
        name: subName,
        email: 'Không cung cấp',
        phone: subPhone,
        message: 'Đăng ký nhận thông tin mới nhất về thị trường và các dự án hấp dẫn',
      });
      alert('Đăng ký nhận tin thành công! Chúng tôi sẽ liên hệ sớm nhất.');
      setSubName('');
      setSubPhone('');
    } catch (err) {
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [postsData, catsData] = await Promise.all([
          postsAPI.getAll({ 
            categoryId: activeCategory.id !== 'all' ? activeCategory.id : undefined,
            search: searchQuery || undefined 
          }),
          postsAPI.getCategories()
        ]);
        setPosts(postsData);
        if (categories.length === 1) { // Only set once
          setCategories([{ id: 'all', name: 'Tất cả' }, ...catsData]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const filteredPosts = posts; // We already filtered from backend, but if needed we can rely entirely on backend
  
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const displayFeatured = (currentPage === 1 && paginatedPosts.length > 0) ? paginatedPosts[0] : null;
  const displayList = displayFeatured ? paginatedPosts.slice(1) : paginatedPosts;

  const popularPosts = posts.slice(0, 4); // Just mock popular as first 4 for now

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const getImgUrl = (path: string) => {
    if (!path) return 'https://placehold.co/600x400?text=No+Image';
    if (path.startsWith('http')) return path;
    return BASE_URL.replace('/api', '') + path;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  // Removed static dynamic topics


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
    <div className="news-page">
      {/* HEADER HERO */}
      <div className="news-header-bg" style={banner ? { backgroundImage: `url(${banner})` } : {}}>
        <div className="news-container">
          <div className="breadcrumb">Trang chủ <span className="mx-2">&gt;</span> <span className="text-gold">Tin tức</span></div>
          <h1 className="page-title">Tin tức</h1>
          <p className="page-subtitle">Cập nhật thông tin mới nhất về thị trường bất động sản</p>
        </div>
      </div>

      <div className="news-container">
        {/* SEARCH & CATEGORIES */}
        <div className="news-search-area">
          <div className="search-bar">
            <Search size={20} className="text-muted" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tin tức..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn-search-news">Tìm kiếm</button>
          </div>
          <div className="news-categories">
            <span className="cat-label">Danh mục:</span>
            <div className="cat-tags">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`cat-tag ${activeCategory.id === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="news-main-layout">
          {/* LEFT COLUMN: MAIN CONTENT */}
          <main className="news-content-col">

            {/* FEATURED POST */}
            {displayFeatured && (
              <div className="featured-news-card">
                <div className="featured-image">
                  <span className="badge-highlight"><Star size={12} fill="currentColor" /> Nổi bật</span>
                  <img src={getImgUrl(displayFeatured.thumbnail)} alt={displayFeatured.title} />
                </div>
                <div className="featured-info">
                  <span className="category-text">{displayFeatured.category?.name || 'Không phân loại'}</span>
                  <h2 className="featured-title">{displayFeatured.title}</h2>
                  <p className="featured-excerpt">{displayFeatured.content?.substring(0, 150).replace(/<[^>]+>/g, '')}...</p>
                  <div className="post-meta">
                    <span><Calendar size={14} /> {new Date(displayFeatured.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span><Eye size={14} /> {displayFeatured.views || 368} lượt xem</span>
                  </div>
                  <button className="btn-read-more" onClick={() => onViewDetail && onViewDetail(displayFeatured.slug)}>Đọc tiếp <ChevronRight size={16} /></button>
                </div>
              </div>
            )}

            {/* LIST POSTS */}
            {displayList.length > 0 && (
              <div className="news-list">
                {displayList.map(post => (
                  <div className="news-list-item" key={post.id} onClick={() => onViewDetail && onViewDetail(post.slug)} style={{cursor: 'pointer'}}>
                    <div className="item-image">
                      <img src={getImgUrl(post.thumbnail)} alt={post.title} />
                    </div>
                    <div className="item-info">
                      <span className="category-text">{post.category?.name || 'Không phân loại'}</span>
                      <h3 className="item-title">{post.title}</h3>
                      <p className="item-excerpt">{post.content?.substring(0, 100).replace(/<[^>]+>/g, '')}...</p>
                      <div className="post-meta">
                        <span><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span><Eye size={14} /> {post.views || 368} lượt xem</span>
                      </div>
                    </div>
                    <div className="item-action">
                      <ChevronRight size={24} className="text-gold" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NO RESULTS */}
            {!loading && paginatedPosts.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn.
              </div>
            )}
            
            {loading && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gold-accent)' }}>
                Đang tải dữ liệu...
              </div>
            )}

            {/* PAGINATION */}
            {renderPagination()}
          </main>

          {/* RIGHT COLUMN: SIDEBAR */}
          <aside className="news-sidebar">

            <div className="sidebar-widget">
              <h3 className="widget-title">BÀI VIẾT NỔI BẬT</h3>
              <div className="popular-posts">
                {popularPosts.map(post => (
                  <div 
                    className="popular-item" 
                    key={post.id}
                    onClick={() => onViewDetail && onViewDetail(post.slug)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={getImgUrl(post.thumbnail)} alt={post.title} className="popular-img" style={{ objectFit: 'cover' }} />
                    <div className="popular-info">
                      <h4>{post.title}</h4>
                      <span className="date">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-widget">
              <h3 className="widget-title">CHỦ ĐỀ ĐƯỢC QUAN TÂM</h3>
              <ul className="topic-list">
                {categories.filter(c => c.id !== 'all').map((topic, i) => (
                  <li 
                    key={i} 
                    onClick={() => setActiveCategory(topic)}
                    style={{ 
                      cursor: 'pointer', 
                      color: activeCategory.id === topic.id ? 'var(--gold-accent)' : 'inherit',
                      fontWeight: activeCategory.id === topic.id ? '500' : 'normal'
                    }}
                  >
                    <span>{topic.name}</span>
                    <span className="topic-count" style={{ 
                      color: activeCategory.id === topic.id ? 'var(--gold-accent)' : 'inherit',
                      borderColor: activeCategory.id === topic.id ? 'rgba(229, 184, 105, 0.3)' : 'inherit'
                    }}>{topic._count?.posts || 0}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget newsletter-widget">
              <h3 className="widget-title">ĐĂNG KÝ NHẬN TIN</h3>
              <p>Nhận thông tin mới nhất về thị trường và các dự án hấp dẫn</p>
              <form className="newsletter-form" onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <input 
                  type="text" 
                  placeholder="Nhập họ và tên..." 
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                  required
                />
                <input 
                  type="tel" 
                  placeholder="Nhập số điện thoại..." 
                  value={subPhone}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setSubPhone(val);
                  }}
                  required
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang gửi...' : 'Đăng ký ngay'} <Send size={16} />
                </button>
              </form>
              <p className="privacy-note">Chúng tôi cam kết bảo mật thông tin của bạn.</p>
            </div>

          </aside>
        </div>



      </div>
    </div>
  );
}
