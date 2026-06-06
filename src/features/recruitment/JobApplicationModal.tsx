import React, { useState } from 'react';
import { X, Upload, Send, Loader2 } from 'lucide-react';
import { candidatesAPI } from '../../lib/api';
import './JobApplicationModal.css';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number;
  jobTitle: string;
}

export default function JobApplicationModal({ isOpen, onClose, jobId, jobTitle }: JobApplicationModalProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Vui lòng đính kèm CV.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('cvFile', file);
      
      await candidatesAPI.applyWithFile(jobId, data);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: '', phone: '', email: '' });
        setFile(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi nộp hồ sơ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="job-apply-modal" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose} disabled={isSubmitting}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <p className="modal-subtitle">Ứng tuyển vị trí</p>
          <h2 className="modal-title">{jobTitle}</h2>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#10b981' }}>
            <h3 style={{ marginBottom: '1rem' }}>🎉 Nộp hồ sơ thành công!</h3>
            <p>Bộ phận nhân sự sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
          </div>
        ) : (
          <form className="apply-form" onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            
            <div className="form-group">
              <label>Họ và tên <span className="text-red">*</span></label>
              <input type="text" placeholder="Nhập họ và tên" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={isSubmitting} />
            </div>

            <div className="form-group">
              <label>Số điện thoại <span className="text-red">*</span></label>
              <input 
                type="tel" 
                placeholder="Nhập số điện thoại" 
                required 
                value={formData.phone} 
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setFormData({...formData, phone: val});
                }} 
                disabled={isSubmitting} 
              />
            </div>

            <div className="form-group">
              <label>Email <span className="text-red">*</span></label>
              <input type="email" placeholder="Nhập email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={isSubmitting} />
            </div>

            <div className="form-group">
              <label>CV/Resume <span className="text-red">*</span></label>
              <div className="file-upload-box">
                <input type="file" id="cv-upload" className="file-input" accept=".pdf,.doc,.docx" required onChange={e => setFile(e.target.files ? e.target.files[0] : null)} disabled={isSubmitting} />
                <label htmlFor="cv-upload" className="file-upload-label">
                  <Upload size={20} className="text-muted mb-2" />
                  {file ? (
                    <p style={{ color: '#d4a017', fontWeight: 600 }}>{file.name}</p>
                  ) : (
                    <p>Kéo thả file hoặc <b>chọn file</b></p>
                  )}
                  <span className="file-hint">Định dạng: PDF, DOC, DOCX (Tối đa 5MB)</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-submit-apply w-100" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={18} className="spin" /> : <Send size={18} />} 
              {isSubmitting ? 'Đang gửi...' : 'Gửi hồ sơ ứng tuyển'}
            </button>
          </form>
        )}

        <p className="privacy-note">
          Thông tin của bạn được bảo mật và chỉ dùng cho mục đích tuyển dụng.
        </p>
      </div>
    </div>
  );
}
