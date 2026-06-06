import React, { useRef, useState, useEffect } from 'react';
import { 
  ChevronDown, Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link, Image as ImageIcon, 
  Quote, Grid, Undo, Redo, ImagePlus, Send, X
} from 'lucide-react';
import { postsAPI } from '../../../lib/api';
import './AddPost.css';

interface AddPostProps {
  onBack?: () => void;
  isEdit?: boolean;
  postData?: any;
}

export default function AddPost({ onBack, isEdit, postData }: AddPostProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Fetch categories
    postsAPI.getCategories().then(res => setCategories(res)).catch(err => console.error(err));

    // Initialize content
    if (editorRef.current && postData?.content) {
      editorRef.current.innerHTML = postData.content;
    }
    
    // Initialize image
    if (postData?.thumbnail) {
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const imgUrl = postData.thumbnail.startsWith('http') ? postData.thumbnail : BASE_URL.replace('/api', '') + postData.thumbnail;
      setFeaturedImage(imgUrl);
    }
  }, [postData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFeaturedImage(URL.createObjectURL(file));
    }
  };

  const execCmd = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    document.execCommand(command, false, value);
  };

  const handleSave = async (published: boolean) => {
    try {
      setLoading(true);
      const title = (document.getElementById('post-title') as HTMLInputElement)?.value;
      const categoryId = (document.getElementById('post-category') as HTMLSelectElement)?.value;
      const authorName = (document.getElementById('post-author') as HTMLSelectElement)?.value;
      const content = editorRef.current?.innerHTML || '';

      if (!title || !content) {
        alert('Vui lòng nhập tiêu đề và nội dung bài viết!');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('published', published.toString());
      if (categoryId) formData.append('categoryId', categoryId);
      if (authorName) formData.append('authorName', authorName);

      if (selectedFile) {
        formData.append('thumbnailFile', selectedFile);
      }

      if (isEdit && postData) {
        await postsAPI.update(postData.id, formData);
        alert('Đã cập nhật bài viết thành công!');
      } else {
        await postsAPI.create(formData);
        alert('Đã tạo bài viết thành công!');
      }
      
      if (onBack) onBack();
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi lưu bài viết: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aap-container">
      <div className="aap-layout">
        
        {/* Left Column: Form */}
        <div className="aap-main-col">
          <div className="aap-card">
            <h3 className="aap-card-title">Thông tin bài viết</h3>
            
            <div className="aap-form-group">
              <label className="aap-label">Tiêu đề bài viết <span>*</span></label>
              <div className="aap-input-wrapper">
                <input id="post-title" type="text" className="aap-input" placeholder="Nhập tiêu đề bài viết..." defaultValue={postData?.title || ''} />
                <span className="aap-char-count">{(postData?.title?.length || 0)}/150</span>
              </div>
            </div>
            
            <div className="aap-form-group">
              <label className="aap-label">Tóm tắt bài viết</label>
              <div className="aap-input-wrapper">
                <textarea className="aap-textarea" placeholder="Nhập tóm tắt ngắn gọn về nội dung bài viết..." rows={3} defaultValue={isEdit ? "Đây là bản tóm tắt ví dụ cho bài viết..." : ""}></textarea>
                <span className="aap-char-count">{isEdit ? 45 : 0}/300</span>
              </div>
            </div>
            
            <div className="aap-form-group">
              <label className="aap-label">Nội dung bài viết <span>*</span></label>
              <div className="aap-editor-container">
                <div className="aap-editor-toolbar">
                  <div className="aap-toolbar-group">
                    <div className="aap-select-wrapper">
                      <select 
                        className="aap-toolbar-select"
                        onChange={(e) => {
                          e.preventDefault();
                          document.execCommand('formatBlock', false, e.target.value);
                        }}
                      >
                        <option value="P">Đoạn văn</option>
                        <option value="H1">Tiêu đề 1</option>
                        <option value="H2">Tiêu đề 2</option>
                        <option value="H3">Tiêu đề 3</option>
                      </select>
                      <ChevronDown size={14} className="aap-select-icon" style={{ right: '0.5rem' }} />
                    </div>
                  </div>
                  <div className="aap-toolbar-divider"></div>
                  <div className="aap-toolbar-group">
                    <button className="aap-toolbar-btn" style={{ fontWeight: 'bold' }} onClick={(e) => execCmd(e, 'bold')}><Bold size={14} /></button>
                    <button className="aap-toolbar-btn" style={{ fontStyle: 'italic' }} onClick={(e) => execCmd(e, 'italic')}><Italic size={14} /></button>
                    <button className="aap-toolbar-btn" style={{ textDecoration: 'underline' }} onClick={(e) => execCmd(e, 'underline')}><Underline size={14} /></button>
                  </div>
                  <div className="aap-toolbar-divider"></div>
                  <div className="aap-toolbar-group">
                    <button className="aap-toolbar-btn" onClick={(e) => execCmd(e, 'insertUnorderedList')}><List size={14} /></button>
                    <button className="aap-toolbar-btn" onClick={(e) => execCmd(e, 'insertOrderedList')}><ListOrdered size={14} /></button>
                    <button className="aap-toolbar-btn" onClick={(e) => execCmd(e, 'justifyLeft')}><AlignLeft size={14} /></button>
                    <button className="aap-toolbar-btn" onClick={(e) => execCmd(e, 'justifyCenter')}><AlignCenter size={14} /></button>
                    <button className="aap-toolbar-btn" onClick={(e) => execCmd(e, 'justifyRight')}><AlignRight size={14} /></button>
                  </div>
                  <div className="aap-toolbar-divider"></div>
                  <div className="aap-toolbar-group">
                    <button className="aap-toolbar-btn" onClick={(e) => {
                      const url = prompt('Nhập đường dẫn URL:');
                      if (url) execCmd(e, 'createLink', url);
                    }}><Link size={14} /></button>
                    <button className="aap-toolbar-btn" onClick={(e) => {
                      const url = prompt('Nhập đường dẫn hình ảnh URL:');
                      if (url) execCmd(e, 'insertImage', url);
                    }}><ImageIcon size={14} /></button>
                    <button className="aap-toolbar-btn" onClick={(e) => execCmd(e, 'formatBlock', 'BLOCKQUOTE')}><Quote size={14} /></button>
                    <button className="aap-toolbar-btn"><Grid size={14} /></button>
                  </div>
                  <div className="aap-toolbar-divider"></div>
                  <div className="aap-toolbar-group">
                    <button className="aap-toolbar-btn" onClick={(e) => execCmd(e, 'undo')}><Undo size={14} /></button>
                    <button className="aap-toolbar-btn" onClick={(e) => execCmd(e, 'redo')}><Redo size={14} /></button>
                  </div>
                </div>
                <div 
                  className="aap-editor-content" 
                  ref={editorRef}
                  contentEditable={true} 
                  suppressContentEditableWarning={true}
                ></div>
                <div className="aap-editor-footer">
                  0 từ
                </div>
              </div>
            </div>
            
            <div className="aap-form-row">
              <div className="aap-form-group" style={{ marginBottom: 0 }}>
                <label className="aap-label">Danh mục <span>*</span></label>
                <div className="aap-select-wrapper">
                  <select id="post-category" className="aap-select" defaultValue={postData?.categoryId || ""}>
                    <option value="" disabled>Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="aap-select-icon" />
                </div>
              </div>
              <div className="aap-form-group" style={{ marginBottom: 0 }}>
                <label className="aap-label">Tác giả</label>
                <div className="aap-select-wrapper">
                  <select id="post-author" className="aap-select" defaultValue={postData?.authorName || "Admin"}>
                    <option value="Admin">Admin</option>
                  </select>
                  <ChevronDown size={16} className="aap-select-icon" />
                </div>
              </div>
            </div>
            
            <div className="aap-form-group" style={{ marginBottom: 0, marginTop: '1.5rem' }}>
              <label className="aap-label">Tags</label>
              <div className="aap-input-wrapper">
                <input type="text" className="aap-input" placeholder="Nhập và nhấn Enter để thêm tag..." />
              </div>
              <div className="aap-helper-text">Ví dụ: thị trường, pháp lý, kinh nghiệm, đầu tư,...</div>
            </div>
            
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="aap-sidebar-col">
          <div className="aap-card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="aap-card-title">Đăng bài viết</h3>
            
            <div className="aap-form-group">
              <label className="aap-label">Trạng thái <span>*</span></label>
              <div className="aap-status-options">
                <label className="aap-radio-label">
                  <input type="radio" name="post_status" value="draft" className="aap-radio-input" hidden defaultChecked={postData?.status === 'draft'} />
                  <div className="aap-radio-custom"></div>
                  <div className="aap-radio-text">
                    <span className="aap-radio-title">Bản nháp</span>
                    <span className="aap-radio-desc">Lưu bài viết ở dạng nháp</span>
                  </div>
                </label>
                <label className="aap-radio-label">
                  <input type="radio" name="post_status" value="published" className="aap-radio-input" hidden defaultChecked={postData?.status === 'published' || !postData?.status} />
                  <div className="aap-radio-custom"></div>
                  <div className="aap-radio-text">
                    <span className="aap-radio-title" style={{ color: '#d89f2a' }}>Xuất bản</span>
                    <span className="aap-radio-desc">Hiển thị ngay trên website</span>
                  </div>
                </label>
                <label className="aap-radio-label">
                  <input type="radio" name="post_status" value="hidden" className="aap-radio-input" hidden defaultChecked={postData?.status === 'hidden'} />
                  <div className="aap-radio-custom"></div>
                  <div className="aap-radio-text">
                    <span className="aap-radio-title">Tạm ẩn</span>
                    <span className="aap-radio-desc">Không hiển thị công khai</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="aap-form-group">
              <label className="aap-label">Thời gian đăng</label>
              <input type="datetime-local" className="aap-input" defaultValue="2025-05-16T15:30" />
            </div>

            <button className="aap-btn aap-btn-publish" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleSave(true)} disabled={loading}>
              <Send size={16} /> {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Xuất bản')}
            </button>
            <button className="aap-btn aap-btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} onClick={() => handleSave(false)} disabled={loading}>
              <Grid size={16} /> Lưu nháp
            </button>
          </div>
          
          <div className="aap-card">
            <h3 className="aap-card-title">Ảnh đại diện</h3>
            {featuredImage ? (
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img src={featuredImage} alt="Featured" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  onClick={() => {
                    setFeaturedImage(null);
                    setSelectedFile(null);
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="aap-upload-box" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                <ImageIcon size={32} className="aap-upload-icon" />
                <div className="aap-upload-text">Kéo thả ảnh vào đây</div>
                <div className="aap-upload-or">hoặc</div>
                <button className="aap-btn-select-img" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Chọn ảnh</button>
              </div>
            )}
            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
            <div className="aap-helper-text" style={{ textAlign: 'center', marginTop: '1rem' }}>
              Định dạng: JPG, PNG. Kích thước tối đa 2MB. Tỉ lệ 16:9 được khuyến nghị.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
