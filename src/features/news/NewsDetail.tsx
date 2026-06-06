import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Calendar, Eye, Share2, Bookmark, Mail
} from 'lucide-react';
import { postsAPI } from '../../lib/api';
import './NewsDetail.css';

interface NewsDetailProps {
  onBack: () => void;
  newsId?: number | string; // the slug
}

export default function NewsDetail({ onBack, newsId }: NewsDetailProps) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (newsId) {
          const data = await postsAPI.getBySlug(newsId.toString());
          setPost(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [newsId]);

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const getImgUrl = (path: string) => {
    if (!path) return 'https://placehold.co/1200x600?text=No+Image';
    if (path.startsWith('http')) return path;
    return BASE_URL.replace('/api', '') + path;
  };

  if (loading) {
    return (
      <div className="news-detail-page">
        <div className="nd-container" style={{ padding: '5rem', textAlign: 'center', color: 'var(--gold-accent)' }}>
          Đang tải bài viết...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="news-detail-page">
        <div className="nd-container" style={{ padding: '5rem', textAlign: 'center' }}>
          Không tìm thấy bài viết. <button onClick={onBack} className="btn-outline-navy mt-3">Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <div className="nd-container">
        
        <button className="btn-back" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0', marginBottom: '1.5rem', marginTop: '1.5rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
          <ChevronLeft size={20} /> Quay lại danh sách tin tức
        </button>

        {/* Breadcrumbs */}
        <div className="nd-breadcrumbs">
          <span>Trang chủ</span>
          <ChevronRight size={14} /> 
          <span onClick={onBack} style={{cursor: 'pointer'}}>Tin tức</span> 
          <ChevronRight size={14} /> 
          <span>{post.category?.name || 'Không phân loại'}</span> 
          <ChevronRight size={14} /> 
          <span className="current">{post.title}</span>
        </div>

        <div className="nd-layout">
          
          <div className="nd-main-content">
            <div className="nd-header">
              <div className="nd-hero-image">
                <img src={getImgUrl(post.thumbnail)} alt={post.title} />
              </div>
              <div className="nd-header-info">
                <h1 className="nd-title">{post.title}</h1>
                <div className="nd-meta">
                  <div className="nd-meta-left">
                    <span className="nd-author">Tác giả: <strong>{post.authorName || 'Admin'}</strong></span>
                    <span className="nd-date"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span className="nd-views"><Eye size={14} /> {post.views || 0} lượt xem</span>
                  </div>
                  <div className="nd-actions">
                    <button className="btn-outline-navy"><Share2 size={16} /> Chia sẻ</button>
                    <button className="btn-outline-navy"><Bookmark size={16} /> Lưu bài viết</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="nd-body" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="nd-author-box mt-5" style={{ display: 'flex', gap: '1rem', padding: '1.5rem', background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div className="nd-author-avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--navy-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {post.authorName ? post.authorName.charAt(0) : 'A'}
              </div>
              <div className="nd-author-info">
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--navy-primary)' }}>{post.authorName || 'Admin'}</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Ban Biên Tập - Golden Land</p>
              </div>
            </div>
          </div>

          <div className="nd-sidebar">
            <div className="nd-related">
              <h3>BÀI VIẾT LIÊN QUAN</h3>
              <div className="related-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div className="related-card" onClick={onBack} style={{ cursor: 'pointer' }}>
                  <button className="btn-outline-navy" style={{ width: '100%' }}>Xem các bài viết khác</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="nd-newsletter mt-5 mb-5">
          <div className="nd-nl-left">
            <div className="nd-nl-icon"><Mail size={24} className="text-gold" /></div>
            <div>
              <h4>Đăng ký nhận bản tin</h4>
              <p>Cập nhật tin tức và ưu đãi mới nhất từ An Khang Group</p>
            </div>
          </div>
          <div className="nd-nl-right">
            <input type="email" placeholder="Nhập email của bạn" style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: 'none', outline: 'none' }} />
            <button className="btn-solid-gold" style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Đăng ký</button>
          </div>
        </div>

      </div>
    </div>
  );
}
