import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import './AddMemberModal.css';

interface AddMemberModalProps {
  onClose: () => void;
  onSave: (member: any) => void;
}

export default function AddMemberModal({ onClose, onSave }: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    description: '',
    orderIndex: 0,
    avatar: '',
    facebook: '',
    zalo: '',
    tiktok: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.position) {
      alert("Vui lòng điền các trường bắt buộc (Tên, Chức vụ)!");
      return;
    }
    const isLeader = formData.position.includes('Chủ tịch') || formData.position.includes('Giám đốc');
    onSave({
      ...formData,
      isLeader,
      status: 'Đang hiển thị'
    });
  };

  return (
    <div className="amm-overlay" onClick={onClose}>
      <div className="amm-modal" onClick={e => e.stopPropagation()}>
        <div className="amm-header">
          <h3>Thêm thành viên ban lãnh đạo</h3>
          <button className="amm-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="amm-body">
          <div className="amm-section">
            <h4 className="amm-section-title">THÔNG TIN CÁ NHÂN</h4>
            <div className="amm-grid">
              {/* Avatar column */}
              <div className="amm-col">
                <div className="amm-form-group">
                  <label>Ảnh đại diện <span>*</span></label>
                  <label className="amm-upload-box" style={{ cursor: 'pointer', backgroundImage: formData.avatar ? `url(${formData.avatar})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {!formData.avatar && (
                      <>
                        <Upload size={24} className="amm-upload-icon" />
                        <p>Kéo thả ảnh vào đây<br/>hoặc</p>
                        <div className="amm-btn-upload">Chọn ảnh</div>
                      </>
                    )}
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />
                  </label>
                  <p className="amm-upload-hint">JPG, PNG tối đa 5MB. Kích thước đề xuất 600x600px</p>
                </div>
              </div>
              
              {/* Info column */}
              <div className="amm-col" style={{ gap: '1.25rem' }}>
                <div className="amm-form-group">
                  <label>Họ và tên <span>*</span></label>
                  <input type="text" name="name" placeholder="Nhập họ và tên" value={formData.name} onChange={handleChange} />
                </div>
                <div className="amm-form-group">
                  <label>Chức vụ <span>*</span></label>
                  <select name="position" value={formData.position} onChange={handleChange as any}>
                    <option value="" disabled>Chọn chức vụ</option>
                    <option value="Chủ tịch HĐQT">Chủ tịch HĐQT</option>
                    <option value="Phó Chủ tịch HĐQT">Phó Chủ tịch HĐQT</option>
                    <option value="Tổng Giám đốc">Tổng Giám đốc</option>
                    <option value="Phó Tổng Giám đốc">Phó Tổng Giám đốc</option>
                    <option value="Giám đốc Phát triển Dự án">Giám đốc Phát triển Dự án</option>
                    <option value="Giám đốc Kinh doanh">Giám đốc Kinh doanh</option>
                    <option value="Giám đốc Marketing">Giám đốc Marketing</option>
                    <option value="Giám đốc Tài chính">Giám đốc Tài chính</option>
                    <option value="Giám đốc Nhân sự">Giám đốc Nhân sự</option>
                    <option value="Cố vấn cấp cao">Cố vấn cấp cao</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="amm-grid-1">
                <div className="amm-form-group">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="Nhập email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="amm-form-group">
                  <label>Facebook</label>
                  <input type="text" name="facebook" placeholder="Nhập link Facebook" value={formData.facebook} onChange={handleChange} />
                </div>
                <div className="amm-form-group">
                  <label>Zalo</label>
                  <input type="text" name="zalo" placeholder="Nhập link Zalo" value={formData.zalo} onChange={handleChange} />
                </div>
                <div className="amm-form-group">
                  <label>Tiktok</label>
                  <input type="text" name="tiktok" placeholder="Nhập link Tiktok" value={formData.tiktok} onChange={handleChange} />
                </div>
            </div>
          </div>

          <div className="amm-section" style={{ marginTop: '0.5rem' }}>
            <h4 className="amm-section-title">THÔNG TIN CHI TIẾT</h4>
            <div className="amm-grid-2">
              <div className="amm-col">
                <div className="amm-form-group">
                  <label>Giới thiệu ngắn</label>
                  <textarea name="description" placeholder="Nhập giới thiệu ngắn về thành viên" rows={4} value={formData.description} onChange={handleChange}></textarea>
                </div>
                <div className="amm-form-group" style={{ marginTop: '0.5rem' }}>
                  <label>Thứ tự hiển thị <span>*</span></label>
                  <input type="number" name="orderIndex" value={formData.orderIndex} onChange={handleChange} />
                </div>
              </div>
              <div className="amm-col" style={{ gap: '1.25rem' }}>
                <div className="amm-form-group">
                  <label>Học vấn</label>
                  <button className="amm-btn-dashed"><Plus size={16}/> Thêm học vấn</button>
                </div>
                <div className="amm-form-group">
                  <label>Lĩnh vực chuyên môn</label>
                  <button className="amm-btn-dashed"><Plus size={16}/> Thêm lĩnh vực chuyên môn</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="amm-footer">
          <button className="amm-btn-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="amm-btn-save" onClick={handleSubmit}>Lưu thành viên</button>
        </div>
      </div>
    </div>
  );
}
