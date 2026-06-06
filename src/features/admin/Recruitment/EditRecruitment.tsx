import React, { useState } from 'react';
import { ChevronDown, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import './Recruitment.css';

interface EditRecruitmentProps {
  jobId: number;
  jobData: any;
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function EditRecruitment({ jobId, jobData, onBack, onSave }: EditRecruitmentProps) {
  const parseDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return '';
  };

  const [formData, setFormData] = useState({
    title: jobData?.title || '',
    department: jobData?.department || '',
    location: jobData?.location || '',
    workMode: jobData?.workMode || '',
    type: jobData?.type || '',
    level: jobData?.level || '',
    quantity: jobData?.candidates || 1, // reusing candidates as a mock for quantity just for display
    description: jobData?.description || '- Tìm kiếm, tư vấn và chăm sóc khách hàng có nhu cầu mua/bán BĐS.\n- Giới thiệu sản phẩm phù hợp với nhu cầu khách hàng.\n- Đàm phán, thương lượng và ký kết hợp đồng.\n- Chăm sóc khách hàng sau bán hàng.',
    requirements: jobData?.requirements || '- Tốt nghiệp Cao đẳng/Đại học các chuyên ngành liên quan.\n- Kỹ năng giao tiếp, đàm phán tốt.\n- Năng động, chịu khó, có trách nhiệm trong công việc.',
    salaryRange: jobData?.salaryRange || '10 - 15 triệu',
    benefits: jobData?.benefits || '',
    hrName: jobData?.hrName || 'Ms. Hương',
    hrPhone: jobData?.hrPhone || '0909 123 456',
    hrEmail: jobData?.hrEmail || 'hr@ankhanggroup.vn',
    hrAddress: jobData?.hrAddress || 'Tầng 15, Tòa nhà AK Tower, 123 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
    deadline: parseDateForInput(jobData?.deadline) || '',
    status: jobData?.status || 'Đang mở'
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
    if (!dateStr) return '';
    if (dateStr.includes('/')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc (*)');
      return;
    }
    
    // Simulate save
    onSave({
      ...jobData,
      title: formData.title,
      department: formData.department,
      type: formData.type,
      salaryRange: formData.salaryRange,
      description: formData.description,
      requirements: formData.requirements,
      benefits: formData.benefits,
      hrName: formData.hrName,
      hrPhone: formData.hrPhone,
      hrEmail: formData.hrEmail,
      hrAddress: formData.hrAddress,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      status: formData.status
    });
  };

  return (
    <div className="ar-container">
      {/* Header */}
      <div className="ar-form-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={onBack}>
            <ArrowLeft size={24} style={{ color: 'var(--navy-primary)' }} />
            Chỉnh sửa tin tuyển dụng
          </h2>
          <div className="ar-breadcrumb">Tuyển dụng &gt; Danh sách tin tuyển dụng &gt; Chỉnh sửa</div>
        </div>
        <div className="ar-header-actions">
          <button className="ar-btn-outline" onClick={onBack}>Hủy</button>
          <button className="ar-btn-primary" onClick={handleSubmit}>Lưu thay đổi</button>
        </div>
      </div>

      <div className="ar-edit-layout">
        {/* Left Column - Main Form */}
        <div className="ar-edit-main">
          <h3 className="ar-section-title">THÔNG TIN TUYỂN DỤNG</h3>
          <form className="ar-form-grid" onSubmit={e => e.preventDefault()}>
            
            {/* Row 1 */}
            <div className="ar-form-group ar-full-width">
              <label>Vị trí tuyển dụng <span className="required">*</span></label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            {/* Row 2 */}
            <div className="ar-form-group">
              <label>Phòng ban <span className="required">*</span></label>
              <div className="ar-input-wrapper">
                <select value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)}>
                  <option value="Kinh doanh">Kinh doanh</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Pháp lý">Pháp lý</option>
                  <option value="Chăm sóc KH">Chăm sóc KH</option>
                </select>
                <ChevronDown size={16} className="ar-select-icon" />
              </div>
            </div>
            <div className="ar-form-group">
              <label>Loại hình công việc <span className="required">*</span></label>
              <div className="ar-input-wrapper">
                <select value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)}>
                  <option value="Toàn thời gian">Toàn thời gian</option>
                  <option value="Bán thời gian">Bán thời gian</option>
                  <option value="Thực tập">Thực tập</option>
                </select>
                <ChevronDown size={16} className="ar-select-icon" />
              </div>
            </div>

            {/* Row 3 */}
            <div className="ar-form-group">
              <label>Địa điểm làm việc <span className="required">*</span></label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
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

            {/* Row 4 */}
            <div className="ar-form-group ar-quantity-group">
              <label>Số lượng cần tuyển <span className="required">*</span></label>
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
            <div className="ar-form-group">
              <label>Mức lương</label>
              <input 
                type="text" 
                value={formData.salaryRange}
                onChange={(e) => handleInputChange('salaryRange', e.target.value)}
              />
            </div>

            {/* Row 5 */}
            <div className="ar-form-group ar-full-width">
              <label>Mô tả công việc <span className="required">*</span></label>
              <div className="ar-textarea-wrapper">
                <textarea 
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  maxLength={2000}
                />
                <div className="ar-char-counter">{formData.description.length}/2000</div>
              </div>
            </div>

            {/* Row 6 */}
            <div className="ar-form-group ar-full-width">
              <label>Yêu cầu ứng viên <span className="required">*</span></label>
              <div className="ar-textarea-wrapper">
                <textarea 
                  rows={4}
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  maxLength={1000}
                />
                <div className="ar-char-counter">{formData.requirements.length}/1000</div>
              </div>
            </div>

            {/* Row 7 */}
            <div className="ar-form-group">
              <label>Hình thức làm việc</label>
              <div className="ar-input-wrapper">
                <select value={formData.workMode} onChange={(e) => handleInputChange('workMode', e.target.value)}>
                  <option value="Tại văn phòng">Tại văn phòng</option>
                  <option value="Làm việc từ xa (Remote)">Làm việc từ xa (Remote)</option>
                  <option value="Linh hoạt (Hybrid)">Linh hoạt (Hybrid)</option>
                </select>
                <ChevronDown size={16} className="ar-select-icon" />
              </div>
            </div>
            <div className="ar-form-group">
              <label>Cấp bậc</label>
              <div className="ar-input-wrapper">
                <select value={formData.level} onChange={(e) => handleInputChange('level', e.target.value)}>
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Quản lý">Quản lý</option>
                  <option value="Giám đốc">Giám đốc</option>
                </select>
                <ChevronDown size={16} className="ar-select-icon" />
              </div>
            </div>
          </form>
        </div>

        {/* Right Column - Sidebar */}
        <div className="ar-edit-sidebar">
          {/* Status Section */}
          <div className="ar-sidebar-card">
            <h3 className="ar-section-title">TRẠNG THÁI TUYỂN DỤNG</h3>
            <div className="ar-radio-group">
              <label className="ar-radio-item">
                  <input 
                    type="radio" 
                    name="status" 
                    value="Đang mở" 
                    checked={formData.status === 'Đang mở'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  />
                  <div className="ar-radio-label">
                    <span className="ar-radio-title">
                      Đang tuyển 
                      {formData.status === 'Đang mở' && <span className="ar-status-tag ar-tag-green">Hiển thị ngay</span>}
                    </span>
                  </div>
                </label>

              <label className="ar-radio-item">
                <input 
                  type="radio" 
                  name="status" 
                  value="Tạm dừng" 
                  checked={formData.status === 'Tạm dừng'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                />
                <div className="ar-radio-label">
                  <span className="ar-radio-title">
                    Tạm dừng 
                    {formData.status === 'Tạm dừng' && <span className="ar-status-tag ar-tag-gray">Ẩn khỏi ứng viên</span>}
                  </span>
                </div>
              </label>

              <label className="ar-radio-item">
                <input 
                  type="radio" 
                  name="status" 
                  value="Đã đóng" 
                  checked={formData.status === 'Đã đóng'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                />
                <div className="ar-radio-label">
                  <span className="ar-radio-title">
                    Đã đóng 
                    {formData.status === 'Đã đóng' && <span className="ar-status-tag ar-tag-gray">Đã hết hạn tuyển dụng</span>}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* User specifically asked to remove 'KÊNH ĐĂNG TUYỂN' section */}

          {/* Info Section */}
          <div className="ar-sidebar-card">
            <h3 className="ar-section-title">THÔNG TIN KHÁC</h3>
            <div className="ar-info-list">
              <div className="ar-info-item">
                <span className="ar-info-label">Ngày đăng</span>
                <span className="ar-info-value">{jobData?.createdAt ? new Date(jobData.createdAt).toLocaleDateString('vi-VN') : '15/05/2025'}</span>
              </div>
              <div className="ar-info-item">
                <span className="ar-info-label">Người tạo</span>
                <span className="ar-info-value">Admin</span>
              </div>
              <div className="ar-info-item">
                <span className="ar-info-label">Mã tin tuyển dụng</span>
                <span className="ar-info-value">{jobData?.slug || 'NEW'}</span>
              </div>
            </div>
          </div>

          {/* HR Contact Section */}
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
    </div>
  );
}
