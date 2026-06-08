import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Save, Camera, X,
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Image as ImageIcon
} from 'lucide-react';
import './ProjectEdit.css';
import { projectsAPI } from '../../../lib/api';

interface ProjectEditProps {
  project: any;
  onBack: () => void;
  onSave: (updatedProject: any) => void;
}

export default function ProjectEdit({ project, onBack, onSave }: ProjectEditProps) {
  const [activeTab, setActiveTab] = useState('info');

  const [mainImage, setMainImage] = useState(project.images?.[0] || '');
  const [gallery, setGallery] = useState(project.images?.slice(1) || []);
  const [isFeatured, setIsFeatured] = useState(project.isFeatured !== undefined ? project.isFeatured : true);
  const [isUploading, setIsUploading] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsUploading(true);
        const res = await projectsAPI.uploadImage?.(e.target.files[0]) || await (await fetch(import.meta.env.VITE_API_URL + '/properties/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('gl_token')}` },
          body: (() => { const fd = new FormData(); fd.append('image', e.target.files[0]); return fd; })()
        })).json();
        setMainImage(res.url);
      } catch (err: any) {
        alert(err.message || 'Lỗi upload ảnh chính');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (gallery.length + files.length > 5) {
        alert('Bạn chỉ có thể chọn tối đa 5 ảnh phụ!');
        return;
      }
      try {
        setIsUploading(true);
        const uploadPromises = files.map(async f => {
          const res = await fetch(import.meta.env.VITE_API_URL + '/properties/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('gl_token')}` },
            body: (() => { const fd = new FormData(); fd.append('image', f); return fd; })()
          });
          return res.json();
        });
        const results = await Promise.all(uploadPromises);
        const newUrls = results.map(r => r.url);
        setGallery([...gallery, ...newUrls]);
      } catch (err: any) {
        alert(err.message || 'Lỗi upload ảnh phụ');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setGallery(newGallery);
  };

  const handleSaveBtn = () => {
    const updatedProject = {
      ...project,
      name: titleRef.current?.value || project.name,
      slug: slugRef.current?.value || project.slug,
      location: locationRef.current?.value || project.location,
      status: statusRef.current?.value || project.status,
      description: descriptionRef.current?.value || project.description,
      content: editorRef.current?.innerHTML || project.content,
      isFeatured: isFeatured,
      images: [mainImage, ...gallery.filter((g: string) => g !== mainImage)].filter(Boolean),
    };
    onSave(updatedProject);
  };

  const execCmd = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    document.execCommand(command, false, value);
  };

  return (
    <div className="ape-container">
      <div className="ape-header-actions">
        <button className="ape-btn-back" onClick={onBack}>
          <ArrowLeft size={16} /> Quay lại chi tiết
        </button>
        <div className="ape-header-right">
          <button className="ape-btn-save" onClick={handleSaveBtn} disabled={isUploading}>
            <Save size={16} /> {isUploading ? 'Đang tải lên...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <div className="ape-main-content">
        <div className="ape-tabs">
          <button className={`ape-tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Thông tin cơ bản</button>
          <button className={`ape-tab ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>Hình ảnh</button>
        </div>

        {activeTab === 'info' && (
          <div className="ape-tab-content">
            <h3 className="ape-section-title">Thông tin Dự án</h3>
            <div className="ape-form-grid">
              <div className="ape-form-group">
                <label>Tên dự án *</label>
                <input type="text" ref={titleRef} defaultValue={project.name || project.title || ''} className="ape-input" placeholder="Tên dự án..." />
              </div>
              <div className="ape-form-group">
                <label>Mã / Slug *</label>
                <input type="text" ref={slugRef} defaultValue={project.slug || project.code || ''} className="ape-input" placeholder="Slug (ví dụ: vinhomes-grand-park)" />
              </div>
              <div className="ape-form-group">
                <label>Vị trí *</label>
                <div className="ape-input-with-icon">
                  <MapPin size={16} className="ape-input-icon" />
                  <input type="text" ref={locationRef} defaultValue={project.location || project.address || ''} className="ape-input" placeholder="Địa chỉ..." />
                </div>
              </div>
              <div className="ape-form-group">
                <label>Trạng thái *</label>
                <select ref={statusRef} defaultValue={project.status || project.statusValue || 'Đang mở bán'} className="ape-input">
                  <option value="Đang mở bán">Đang mở bán</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                  <option value="Sắp mở bán">Sắp mở bán</option>
                </select>
              </div>
            </div>

            <div className="ape-form-group" style={{ marginTop: '20px' }}>
              <label>Mô tả ngắn</label>
              <textarea ref={descriptionRef} defaultValue={project.description || ''} className="ape-input" rows={3} placeholder="Mô tả ngắn gọn về dự án..."></textarea>
            </div>

            <div className="ape-form-group" style={{ marginTop: '20px' }}>
              <label>Tổng quan dự án (Chi tiết)</label>
              <div className="ape-editor-container">
                <div className="ape-editor-toolbar">
                  <button onClick={(e) => execCmd(e, 'bold')} title="In đậm"><Bold size={15} /></button>
                  <button onClick={(e) => execCmd(e, 'italic')} title="In nghiêng"><Italic size={15} /></button>
                  <button onClick={(e) => execCmd(e, 'underline')} title="Gạch chân"><Underline size={15} /></button>
                  <div className="ape-toolbar-divider"></div>
                  <button onClick={(e) => execCmd(e, 'insertUnorderedList')} title="Danh sách"><List size={15} /></button>
                  <button onClick={(e) => execCmd(e, 'insertOrderedList')} title="Danh sách số"><ListOrdered size={15} /></button>
                  <div className="ape-toolbar-divider"></div>
                  <button onClick={(e) => execCmd(e, 'justifyLeft')} title="Căn trái"><AlignLeft size={15} /></button>
                  <button onClick={(e) => execCmd(e, 'justifyCenter')} title="Căn giữa"><AlignCenter size={15} /></button>
                  <button onClick={(e) => execCmd(e, 'justifyRight')} title="Căn phải"><AlignRight size={15} /></button>
                  <button onClick={(e) => execCmd(e, 'justifyFull')} title="Căn đều"><AlignJustify size={15} /></button>
                </div>
                <div 
                  className="ape-editor-content"
                  contentEditable
                  ref={editorRef}
                  dangerouslySetInnerHTML={{ __html: project.content || project.description || '' }}
                />
              </div>
            </div>

            <div className="ape-settings-section" style={{ marginTop: '20px' }}>
              <div className="ape-toggle-group">
                <label className="ape-toggle-label">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                  <span className="ape-toggle-text">Dự án Nổi bật (Hiển thị ưu tiên)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="ape-tab-content">
            <h3 className="ape-section-title">Hình ảnh dự án</h3>
            
            <div className="ape-media-grid">
              <div className="ape-media-card">
                <div className="ape-media-header">
                  <h4>Ảnh đại diện (Thumbnail) *</h4>
                  <p>Kích thước khuyến nghị: 800x600px</p>
                </div>
                <div className="ape-image-upload-area" onClick={() => mainImageInputRef.current?.click()}>
                  {mainImage ? (
                    <img src={mainImage} alt="Main" className="ape-preview-img" />
                  ) : (
                    <div className="ape-upload-placeholder">
                      <Camera size={32} />
                      <span>Bấm để chọn ảnh đại diện</span>
                    </div>
                  )}
                  <input type="file" hidden ref={mainImageInputRef} accept="image/*" onChange={handleMainImageChange} />
                </div>
              </div>
            </div>

            <div className="ape-media-card" style={{ marginTop: '20px' }}>
              <div className="ape-media-header">
                <h4>Thư viện ảnh (Gallery)</h4>
                <p>Tối đa 5 ảnh phụ</p>
              </div>
              <div className="ape-gallery-grid">
                {gallery.map((img: string, index: number) => (
                  <div key={index} className="ape-gallery-item">
                    <img src={img} alt={`Gallery ${index}`} />
                    <button className="ape-btn-remove-img" onClick={() => removeGalleryImage(index)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {gallery.length < 5 && (
                  <div className="ape-gallery-add" onClick={() => galleryInputRef.current?.click()}>
                    <Plus size={24} />
                    <span>Thêm ảnh</span>
                    <input type="file" hidden ref={galleryInputRef} accept="image/*" multiple onChange={handleGalleryChange} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
