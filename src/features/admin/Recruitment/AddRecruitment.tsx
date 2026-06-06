import React, { useState } from 'react';
import { ChevronDown, MapPin, Calendar } from 'lucide-react';
import './Recruitment.css';

interface AddRecruitmentProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function AddRecruitment({ onBack, onSave }: AddRecruitmentProps) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    workMode: '',
    type: '',
    quantity: 1,
    description: '',
    requirements: '',
    salaryRange: '',
    benefits: '',
    hrName: 'Ms. Hương',
    hrPhone: '0909 123 456',
    hrEmail: 'hr@ankhanggroup.vn',
    hrAddress: 'Tầng 15, Tòa nhà AK Tower, 123 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
    deadline: '',
    status: 'Đang mở'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (delta: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta)
    }));
  };

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return new Date().toLocaleDateString('en-GB');
    if (dateStr.includes('/')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc (*)');
      return;
    }
    
    // Simulate save
    onSave({
      title: formData.title,
      department: formData.department || 'Chưa xác định',
      type: formData.type || 'Toàn thời gian',
      location: formData.location || 'Chưa xác định',
      salaryRange: formData.salaryRange,
      description: formData.description,
      requirements: formData.requirements,
      benefits: formData.benefits,
      hrName: formData.hrName,
      hrPhone: formData.hrPhone,
      hrEmail: formData.hrEmail,
      hrAddress: formData.hrAddress,
      deadline: formData.deadline || null,
      status: formData.status
    });
  };

  return (
    <div className="ar-container">
      {/* Header */}
      <div className="ar-form-header">
        <div>
          <h2>Thêm tin tuyển dụng</h2>
          <div className="ar-breadcrumb">Tuyển dụng &gt; Thêm tin tuyển dụng</div>
        </div>
        <div className="ar-header-actions">
          <button className="ar-btn-outline" onClick={onBack}>Hủy</button>
          <button className="ar-btn-primary" onClick={handleSubmit}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.5rem'}}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Đăng tin
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="ar-form-card">
        <form onSubmit={handleSubmit} className="ar-form-grid">
          
          {/* Row 1 */}
          <div className="ar-form-group">
            <label>Vị trí tuyển dụng <span className="required">*</span></label>
            <input 
              type="text" 
              placeholder="Nhập vị trí tuyển dụng" 
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          <div className="ar-form-group">
            <label>Phòng ban</label>
            <div className="ar-input-wrapper">
              <select value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)}>
                <option value="">Chọn phòng ban</option>
                <option value="Kinh doanh">Kinh doanh</option>
                <option value="Marketing">Marketing</option>
                <option value="Pháp lý">Pháp lý</option>
                <option value="Chăm sóc KH">Chăm sóc KH</option>
              </select>
              <ChevronDown size={16} className="ar-select-icon" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="ar-form-group">
            <label>Địa điểm làm việc</label>
            <div className="ar-input-wrapper with-icon">
              <MapPin size={16} className="ar-left-icon" />
              <input 
                type="text" 
                placeholder="Nhập địa điểm làm việc" 
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>
          <div className="ar-form-group">
            <label>Hình thức làm việc</label>
            <div className="ar-input-wrapper">
              <select value={formData.workMode} onChange={(e) => handleInputChange('workMode', e.target.value)}>
                <option value="">Chọn hình thức làm việc</option>
                <option value="Trực tiếp tại văn phòng">Trực tiếp tại văn phòng</option>
                <option value="Làm việc từ xa (Remote)">Làm việc từ xa (Remote)</option>
                <option value="Linh hoạt (Hybrid)">Linh hoạt (Hybrid)</option>
              </select>
              <ChevronDown size={16} className="ar-select-icon" />
            </div>
          </div>

          {/* Row 3 */}
          <div className="ar-form-group">
            <label>Loại hình công việc</label>
            <div className="ar-input-wrapper">
              <select value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)}>
                <option value="">Chọn loại hình công việc</option>
                <option value="Toàn thời gian">Toàn thời gian</option>
                <option value="Bán thời gian">Bán thời gian</option>
                <option value="Thực tập">Thực tập</option>
                <option value="Cộng tác viên">Cộng tác viên</option>
              </select>
              <ChevronDown size={16} className="ar-select-icon" />
            </div>
          </div>
          <div className="ar-form-group ar-quantity-group">
            <label>Số lượng cần tuyển</label>
            <div className="ar-quantity-control">
              <button type="button" onClick={() => handleQuantityChange(-1)}>-</button>
              <input 
                type="number" 
                value={formData.quantity} 
                onChange={(e) => handleInputChange('quantity', Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button type="button" onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          {/* Row 4 */}
          <div className="ar-form-group ar-full-width">
            <label>Mô tả công việc <span className="required">*</span></label>
            <div className="ar-textarea-wrapper">
              <textarea 
                placeholder="Nhập mô tả công việc..." 
                rows={5}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={500}
              />
              <div className="ar-char-counter">{formData.description.length}/500</div>
            </div>
          </div>

          {/* Row 5 */}
          <div className="ar-form-group ar-full-width">
            <label>Yêu cầu ứng viên</label>
            <div className="ar-textarea-wrapper">
              <textarea 
                placeholder="Nhập yêu cầu ứng viên..." 
                rows={4}
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                maxLength={300}
              />
              <div className="ar-char-counter">{formData.requirements.length}/300</div>
            </div>
          </div>

          {/* Row 6 */}
          <div className="ar-form-group">
            <label>Mức lương</label>
            <input 
              type="text" 
              placeholder="VD: 10 - 15 triệu" 
              value={formData.salaryRange}
              onChange={(e) => handleInputChange('salaryRange', e.target.value)}
            />
          </div>
          <div className="ar-form-group">
            <label>Hạn nộp hồ sơ</label>
            <div className="ar-input-wrapper with-icon">
              <Calendar size={16} className="ar-right-icon" />
              <input 
                type="date" 
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
            </div>
          </div>
          <div className="ar-form-group">
            <label>Trạng thái</label>
            <div className="ar-input-wrapper">
              <select value={formData.status} onChange={(e) => handleInputChange('status', e.target.value)}>
                <option value="Đang mở">Đang mở</option>
                <option value="Đã đóng">Đã đóng</option>
              </select>
              <ChevronDown size={16} className="ar-select-icon" />
            </div>
          </div>

        </form>
      </div>

      {/* Right Column - Sidebar */}
      <div className="ar-edit-sidebar" style={{ marginTop: '1.5rem' }}>
        <div className="ar-sidebar-card">
          <h3 className="ar-section-title">THÔNG TIN LIÊN HỆ HR</h3>
          <div className="ar-form-group">
            <label>Người liên hệ</label>
            <input 
              type="text" 
              placeholder="VD: Ms. Hương" 
              value={formData.hrName}
              onChange={(e) => handleInputChange('hrName', e.target.value)}
            />
          </div>
          <div className="ar-form-group" style={{ marginTop: '1rem' }}>
            <label>Số điện thoại</label>
            <input 
              type="text" 
              placeholder="VD: 0909 123 456" 
              value={formData.hrPhone}
              onChange={(e) => handleInputChange('hrPhone', e.target.value)}
            />
          </div>
          <div className="ar-form-group" style={{ marginTop: '1rem' }}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="VD: hr@ankhanggroup.vn" 
              value={formData.hrEmail}
              onChange={(e) => handleInputChange('hrEmail', e.target.value)}
            />
          </div>
          <div className="ar-form-group" style={{ marginTop: '1rem' }}>
            <label>Địa chỉ làm việc/phỏng vấn</label>
            <textarea 
              rows={3}
              placeholder="VD: Tầng 15, Tòa nhà AK Tower..." 
              value={formData.hrAddress}
              onChange={(e) => handleInputChange('hrAddress', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
