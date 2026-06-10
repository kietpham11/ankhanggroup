import React, { useState, useRef } from 'react';
import { X, MapPin, ImagePlus } from 'lucide-react';
import './AddProjectModal.css';

interface AddProjectModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function AddProjectModal({ onClose, onSave }: AddProjectModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        alert('Bạn chỉ có thể tải lên tối đa 5 ảnh!');
        return;
      }
      const newUrls = files.map(f => URL.createObjectURL(f));
      setImages([...images, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="apm-overlay" onClick={onClose}>
      <div className="apm-modal" onClick={e => e.stopPropagation()}>
        <div className="apm-header">
          <h3>Thêm dự án mới</h3>
          <button className="apm-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="apm-body">
          <div className="apm-section">
            <h4 className="apm-section-title">THÔNG TIN CƠ BẢN</h4>
            <div className="apm-form-grid">
              <div className="apm-form-group">
                <label>Tên dự án <span>*</span></label>
                <div className="apm-input-wrapper">
                  <input type="text" placeholder="Nhập tên dự án" />
                </div>
              </div>
              
              <div className="apm-form-group">
                <label>Mã dự án <span>*</span></label>
                <div className="apm-input-wrapper">
                  <input type="text" placeholder="Nhập mã dự án (VD: AKR001)" />
                </div>
              </div>
              
              <div className="apm-form-group">
                <label>Loại dự án <span>*</span></label>
                <div className="apm-input-wrapper">
                  <select defaultValue="">
                    <option value="" disabled>Chọn loại hình</option>
                    <option value="Đất nền">Đất nền</option>
                    <option value="Căn hộ">Căn hộ</option>
                    <option value="Nhà lầu trệt">Nhà lầu trệt</option>
                    <option value="Nhà cấp 4">Nhà cấp 4</option>
                    <option value="Nhà cấp 4 gác lửng">Nhà cấp 4 gác lửng</option>
                    <option value="Biệt thự mini">Biệt thự mini</option>
                    <option value="Biệt thự sân vườn">Biệt thự sân vườn</option>
                    <option value="Cấp 4 sân vườn">Cấp 4 sân vườn</option>
                  </select>
                </div>
              </div>
              
              <div className="apm-form-group">
                <label>Vị trí dự án <span>*</span></label>
                <div className="apm-input-wrapper">
                  <input type="text" placeholder="Nhập vị trí dự án" />
                  <MapPin size={16} className="apm-input-icon" />
                </div>
              </div>
              
              <div className="apm-form-group">
                <label>Chủ đầu tư</label>
                <div className="apm-input-wrapper">
                  <input type="text" placeholder="Nhập chủ đầu tư" />
                </div>
              </div>
              
              <div className="apm-form-group">
                <label>Đơn vị phát triển</label>
                <div className="apm-input-wrapper">
                  <input type="text" placeholder="Nhập đơn vị phát triển" />
                </div>
              </div>
              
              <div className="apm-form-group">
                <label>Quy mô dự án</label>
                <div className="apm-input-wrapper">
                  <input type="text" placeholder="Nhập quy mô (VD: 2.5 ha, 500 căn hộ...)" />
                </div>
              </div>
              
              <div className="apm-form-group">
                <label>Tổng số sản phẩm</label>
                <div className="apm-input-wrapper">
                  <input type="text" placeholder="Nhập tổng số sản phẩm" />
                </div>
              </div>
              
              <div className="apm-form-group">
                <label>Giá bán (VNĐ)</label>
                <div className="apm-input-wrapper">
                  <input type="text" placeholder="Ví dụ: 2950000000" />
                </div>
              </div>
              
              <div className="apm-form-group full-width">
                <label>Mô tả dự án</label>
                <div className="apm-textarea-wrapper">
                  <textarea placeholder="Nhập mô tả chi tiết về dự án..."></textarea>
                  <span className="apm-char-count">0/500</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="apm-section">
            <h4 className="apm-section-title">HÌNH ẢNH DỰ ÁN</h4>
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img src={img} alt={`Upload ${idx}`} style={{ width: 80, height: 80, borderRadius: 6, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                    <button 
                      style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      onClick={() => removeImage(idx)}
                    ><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
            
            {images.length < 5 && (
              <div className="apm-upload-box" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus size={32} className="apm-upload-icon" />
                <p className="apm-upload-title">Tải lên hình ảnh dự án</p>
                <p className="apm-upload-desc">Kéo thả file vào đây hoặc <strong>click để chọn file</strong></p>
                <p className="apm-upload-format">Định dạng: JPG, PNG, JPEG (Tối đa 5MB) - Đã tải {images.length}/5 ảnh</p>
              </div>
            )}
            <input type="file" hidden multiple ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
          </div>
        </div>
        
        <div className="apm-footer">
          <button className="apm-btn-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="apm-btn-save" onClick={onSave}>Lưu dự án</button>
        </div>
      </div>
    </div>
  );
}
