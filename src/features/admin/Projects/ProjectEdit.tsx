import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Eye, Save, Plus, Camera, X,
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Image as ImageIcon, MoreHorizontal, ChevronDown
} from 'lucide-react';
import './ProjectEdit.css';
import './ProjectEdit.css';
import { projectsAPI, propertiesAPI } from '../../../lib/api';

interface ProjectEditProps {
  project: any;
  onBack: () => void;
  onSave: (updatedProject: any) => void;
}

export default function ProjectEdit({ project, onBack, onSave }: ProjectEditProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [parentProjects, setParentProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setParentProjects(data);
      } catch (err) {
        console.error('Error fetching parent projects', err);
      }
    };
    fetchProjects();
  }, []);


  const [mainImage, setMainImage] = useState(project.image);
  const [gallery, setGallery] = useState(project.gallery);
  const [mapImage, setMapImage] = useState(project.mapImage || '');
  const [isFeatured, setIsFeatured] = useState(project.isFeatured !== undefined ? project.isFeatured : true);
  const [showOnHome, setShowOnHome] = useState(project.showOnHome !== undefined ? project.showOnHome : true);
  const [metaDesc, setMetaDesc] = useState("An Khang Riverside – Dự án nhà phố cao cấp ven sông tại Quận 2, TP. Thủ Đức với tiện ích đẳng cấp.");
  const [displayPrice, setDisplayPrice] = useState(
    project.price ? Number(project.price).toLocaleString('vi-VN') : ''
  );
  const [displayOrder, setDisplayOrder] = useState(project.displayOrder || 1);
  const [isUploading, setIsUploading] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Create refs for form inputs
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLInputElement>(null);
  const bedroomsRef = useRef<HTMLInputElement>(null);
  const bathroomsRef = useRef<HTMLInputElement>(null);
  const directionRef = useRef<HTMLInputElement>(null);
  const legalRef = useRef<HTMLInputElement>(null);
  const projectIdRef = useRef<HTMLSelectElement>(null);
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const mapImageInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsUploading(true);
        const res = await propertiesAPI.uploadImage(e.target.files[0]);
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
        const uploadPromises = files.map(f => propertiesAPI.uploadImage(f));
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
    setGallery(gallery.filter((_: string, i: number) => i !== index));
  };

  const handleMapImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsUploading(true);
        const res = await propertiesAPI.uploadImage(e.target.files[0]);
        setMapImage(res.url);
      } catch (err: any) {
        alert(err.message || 'Lỗi upload ảnh bản đồ');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveBtn = () => {
    // Gather all data from refs
    const updatedProject = {
      ...project,
      title: titleRef.current?.value || project.name,
      slug: slugRef.current?.value || project.code,
      type: typeRef.current?.value || project.typeValue,
      address: addressRef.current?.value || project.location,
      status: statusRef.current?.value || project.statusValue,
      price: displayPrice ? parseFloat(displayPrice.replace(/\./g, '')) : project.price,
      area: areaRef.current?.value || project.area,
      bedrooms: bedroomsRef.current?.value || project.bedrooms,
      bathrooms: bathroomsRef.current?.value || project.bathrooms,
      direction: directionRef.current?.value || project.direction,
      description: editorRef.current?.innerHTML || project.description,
      legal: legalRef.current?.value || project.legal || '',
      projectId: projectIdRef.current?.value ? parseInt(projectIdRef.current.value) : (project.projectId || null),
      isFeatured: isFeatured,
      showOnHome: showOnHome,
      displayOrder: displayOrder,
      images: [mainImage, ...gallery.filter((g: string) => g !== mainImage)].filter(Boolean),
      mapImage: mapImage
    };
    
    onSave(updatedProject);
  };

  const execCmd = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    document.execCommand(command, false, value);
  };

  return (
    <div className="ape-container">
      {/* Header Actions */}
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

      {/* Tabs */}
      <div className="ape-tabs-card">
        <div className={`ape-tab-item ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
          Thông tin cơ bản
        </div>
        <div className={`ape-tab-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>
          Tiến độ
        </div>
        <div className={`ape-tab-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          Sản phẩm
        </div>
        <div className={`ape-tab-item ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>
          Tài liệu
        </div>
        <div className={`ape-tab-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          Lịch sử hoạt động
        </div>
      </div>

      {/* Content Grid */}
      <div className="ape-content-grid">
        {/* Left Column (Form) */}
        <div className="ape-card no-top-radius">
          <h3 className="ape-card-title">Thông tin cơ bản</h3>
          
          <div className="ape-form-grid">
            <div className="ape-form-group">
              <label>Tên dự án <span>*</span></label>
              <div className="ape-input-wrapper">
                <input type="text" defaultValue={project.name} ref={titleRef} />
              </div>
            </div>
            
            <div className="ape-form-group">
              <label>Mã / Slug <span>*</span></label>
              <div className="ape-input-wrapper">
                <input type="text" defaultValue={project.code} ref={slugRef} />
              </div>
              <div className="ape-input-helper">Slug (ví dụ: vinhomes-grand-park)</div>
            </div>
            
            <div className="ape-form-group">
              <label>Loại dự án <span>*</span></label>
              <div className="ape-input-wrapper">
                <select defaultValue={project.typeValue || 'APARTMENT'} ref={typeRef}>
                  <option value="APARTMENT">Căn hộ</option>
                  <option value="HOUSE">Nhà phố</option>
                  <option value="LAND">Đất nền</option>
                </select>
              </div>
            </div>
            
            <div className="ape-form-group">
              <label>Trạng thái <span>*</span></label>
              <div className="ape-input-wrapper ape-status-select-wrapper">
                <div className="ape-status-dot"></div>
                <select defaultValue={project.statusValue || 'AVAILABLE'} ref={statusRef}>
                  <option value="AVAILABLE">Đang mở bán</option>
                  <option value="SOLD">Đã bán</option>
                  <option value="RENTED">Đã cho thuê</option>
                </select>
              </div>
            </div>
            
            <div className="ape-form-group">
              <label>Vị trí <span>*</span></label>
              <div className="ape-input-wrapper">
                <MapPin size={16} className="ape-input-icon left" />
                <input type="text" defaultValue={project.location} className="with-left-icon" ref={addressRef} />
              </div>
            </div>
            
            <div className="ape-form-group">
              <label>Giá bán (VNĐ) <span>*</span></label>
              <div className="ape-input-wrapper">
                <input 
                  type="text" 
                  value={displayPrice} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setDisplayPrice(val ? Number(val).toLocaleString('vi-VN') : '');
                  }} 
                />
              </div>
            </div>
            
            <div className="ape-form-group">
              <label>Diện tích (m²) <span>*</span></label>
              <div className="ape-input-wrapper">
                <input type="number" step="0.1" defaultValue={project.area} ref={areaRef} />
              </div>
            </div>
            
            <div className="ape-form-group">
              <label>Phòng ngủ</label>
              <div className="ape-input-wrapper">
                <input type="number" defaultValue={project.bedrooms} ref={bedroomsRef} />
              </div>
            </div>
            
            <div className="ape-form-group">
              <label>Phòng tắm</label>
              <div className="ape-input-wrapper">
                <input type="number" defaultValue={project.bathrooms} ref={bathroomsRef} />
              </div>
            </div>
            
            <div className="ape-form-group">
              <label>Hướng</label>
              <div className="ape-input-wrapper">
                <input type="text" defaultValue={project.direction} ref={directionRef} />
              </div>
            </div>

            <div className="ape-form-group">
              <label>Pháp lý</label>
              <div className="ape-input-wrapper">
                <input type="text" placeholder="Sổ hồng, Sổ đỏ..." defaultValue={project.legal} ref={legalRef} />
              </div>
            </div>

            <div className="ape-form-group">
              <label>Dự án khu vực</label>
              <div className="ape-input-wrapper">
                <select defaultValue={project.projectId || ''} ref={projectIdRef}>
                  <option value="">-- Không thuộc dự án nào --</option>
                  {parentProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="ape-form-group full-width">
              <label>Mô tả dự án</label>
              <div className="ape-editor-container">
                <div className="ape-editor-toolbar">
                  <div className="ape-toolbar-group">
                    <div className="ape-toolbar-select-wrapper">
                      <select 
                        className="ape-toolbar-select"
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
                      <ChevronDown size={14} />
                    </div>
                  </div>
                  <div className="ape-toolbar-divider"></div>
                  <div className="ape-toolbar-group">
                    <button className="ape-toolbar-btn" style={{ fontWeight: 'bold' }} onClick={(e) => execCmd(e, 'bold')} title="In đậm"><Bold size={14} /></button>
                    <button className="ape-toolbar-btn" style={{ fontStyle: 'italic' }} onClick={(e) => execCmd(e, 'italic')} title="In nghiêng"><Italic size={14} /></button>
                    <button className="ape-toolbar-btn" style={{ textDecoration: 'underline' }} onClick={(e) => execCmd(e, 'underline')} title="Gạch chân"><Underline size={14} /></button>
                  </div>
                  <div className="ape-toolbar-divider"></div>
                  <div className="ape-toolbar-group">
                    <button className="ape-toolbar-btn" onClick={(e) => execCmd(e, 'insertUnorderedList')} title="Danh sách chấm"><List size={14} /></button>
                    <button className="ape-toolbar-btn" onClick={(e) => execCmd(e, 'insertOrderedList')} title="Danh sách số"><ListOrdered size={14} /></button>
                  </div>
                  <div className="ape-toolbar-divider"></div>
                  <div className="ape-toolbar-group">
                    <button className="ape-toolbar-btn" onClick={(e) => execCmd(e, 'justifyLeft')} title="Căn trái"><AlignLeft size={14} /></button>
                    <button className="ape-toolbar-btn" onClick={(e) => execCmd(e, 'justifyCenter')} title="Căn giữa"><AlignCenter size={14} /></button>
                    <button className="ape-toolbar-btn" onClick={(e) => execCmd(e, 'justifyRight')} title="Căn phải"><AlignRight size={14} /></button>
                    <button className="ape-toolbar-btn" onClick={(e) => execCmd(e, 'justifyFull')} title="Căn đều 2 bên"><AlignJustify size={14} /></button>
                  </div>
                  <div className="ape-toolbar-divider"></div>
                  <div className="ape-toolbar-group">
                    <button className="ape-toolbar-btn" onClick={(e) => {
                      const url = prompt('Nhập đường dẫn URL:');
                      if (url) execCmd(e, 'createLink', url);
                    }} title="Chèn link"><Link size={14} /></button>
                    <button className="ape-toolbar-btn" onClick={(e) => {
                      const url = prompt('Nhập đường dẫn hình ảnh URL:');
                      if (url) execCmd(e, 'insertImage', url);
                    }} title="Chèn ảnh"><ImageIcon size={14} /></button>
                    <button className="ape-toolbar-btn"><MoreHorizontal size={14} /></button>
                  </div>
                </div>
                <div 
                  className="ape-editor-textarea" 
                  ref={editorRef}
                  contentEditable={true} 
                  suppressContentEditableWarning={true}
                  style={{ outline: 'none', overflowY: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                ></div>
                <div className="ape-char-count">186/2000</div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right Column (Cards) */}
        <div>
          {/* Images Card */}
          <div className="ape-card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="ape-card-title">Hình ảnh dự án</h3>
            
            <div className="ape-gallery-main">
              <img src={mainImage} alt="Main project" />
              <button className="ape-camera-btn" onClick={() => mainImageInputRef.current?.click()}>
                <Camera size={16} />
              </button>
              <input type="file" hidden ref={mainImageInputRef} accept="image/*" onChange={handleMainImageChange} />
            </div>
            
            <div className="ape-gallery-thumbs">
              {gallery.map((img: string, idx: number) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={img} alt={`Thumb ${idx}`} className="ape-gallery-thumb" />
                  <button 
                    style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => removeGalleryImage(idx)}
                  ><X size={10} /></button>
                </div>
              ))}
              {gallery.length < 5 && (
                <div className="ape-gallery-add" onClick={() => galleryInputRef.current?.click()}>
                  <Plus size={16} />
                  Thêm ảnh
                </div>
              )}
              <input type="file" hidden multiple ref={galleryInputRef} accept="image/*" onChange={handleGalleryChange} />
            </div>
            
            <div className="ape-gallery-helper">
              Định dạng: JPG, PNG, WEBP. Kích thước tối đa 5MB/ảnh.
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--navy-blue)' }}>Ảnh Bản Đồ (Map Image)</h4>
              <div className="ape-gallery-main" style={{ height: '150px' }}>
                {mapImage ? (
                  <img src={mapImage} alt="Map image" style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#94a3b8' }}>
                    Chưa có ảnh bản đồ
                  </div>
                )}
                <button className="ape-camera-btn" onClick={() => mapImageInputRef.current?.click()}>
                  <Camera size={16} />
                </button>
                <input type="file" hidden ref={mapImageInputRef} accept="image/*" onChange={handleMapImageChange} />
              </div>
            </div>
          </div>
          
          {/* Display Info Card */}
          <div className="ape-card">
            <h3 className="ape-card-title">Thông tin hiển thị</h3>
            
            <div className="ape-sidebar-group">
              <span className="ape-sidebar-label">Nổi bật</span>
              <div className="ape-toggle" onClick={() => setIsFeatured(!isFeatured)}>
                <span className="ape-toggle-text" style={{ color: isFeatured ? '#d89f2a' : '#a0aec0' }}>
                  {isFeatured ? 'Bật' : 'Tắt'}
                </span>
                <div className="ape-toggle-switch" style={{ background: isFeatured ? '#d89f2a' : '#e2e8f0' }}>
                  <div className="ape-toggle-slider" style={{ right: isFeatured ? '2px' : '18px' }}></div>
                </div>
              </div>
            </div>
            
            <div className="ape-sidebar-group no-border">
              <span className="ape-sidebar-label">Hiển thị trang chủ</span>
              <div className="ape-toggle" onClick={() => setShowOnHome(!showOnHome)}>
                <span className="ape-toggle-text" style={{ color: showOnHome ? '#d89f2a' : '#a0aec0' }}>
                  {showOnHome ? 'Bật' : 'Tắt'}
                </span>
                <div className="ape-toggle-switch" style={{ background: showOnHome ? '#d89f2a' : '#e2e8f0' }}>
                  <div className="ape-toggle-slider" style={{ right: showOnHome ? '2px' : '18px' }}></div>
                </div>
              </div>
            </div>
            
            <div className="ape-meta-group">
              <label>Thứ tự hiển thị</label>
              <div className="ape-input-wrapper">
                <input type="number" value={displayOrder} onChange={e => setDisplayOrder(parseInt(e.target.value) || 1)} min="1" />
              </div>
              <div className="ape-input-helper">Số thứ tự nhỏ hơn sẽ hiển thị trước</div>
            </div>
            
            <div className="ape-meta-group">
              <label>Meta Title</label>
              <div className="ape-input-wrapper">
                <input type="text" defaultValue={project.name || "An Khang Riverside – Nhà phố cao cấp ven sông"} />
              </div>
            </div>
            
            <div className="ape-meta-group">
              <label>Meta Description</label>
              <div className="ape-input-wrapper">
                <textarea 
                  value={metaDesc} 
                  onChange={(e) => setMetaDesc(e.target.value)} 
                  rows={3}
                ></textarea>
              </div>
              <div className="ape-input-helper" style={{ textAlign: 'right', color: metaDesc.length > 160 ? '#ef4444' : '#a0aec0' }}>
                {metaDesc.length}/160
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
