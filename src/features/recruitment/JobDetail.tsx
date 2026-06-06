import React, { useState } from 'react';
import { 
  ArrowLeft, Building2, Coins, Clock, Bookmark, Share2, Send,
  Users, MapPin, Award, Calendar, CheckCircle2, GraduationCap,
  Shield, TrendingUp, Mail, Phone, Map
} from 'lucide-react';
import JobApplicationModal from './JobApplicationModal';
import './JobDetail.css';

import { jobsAPI } from '../../lib/api';

interface JobDetailProps {
  onBack: () => void;
  jobId?: number;
}

export default function JobDetail({ onBack, jobId }: JobDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (jobId) {
      jobsAPI.getById(jobId)
        .then(data => setJob(data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [jobId]);

  if (isLoading) {
    return <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải chi tiết công việc...</div>;
  }

  if (!job) {
    return <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Không tìm thấy công việc này.</div>;
  }

  const renderList = (text?: string) => {
    if (!text) return <li><span className="text-muted">Chưa cập nhật</span></li>;
    return text.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
      <li key={idx}><CheckCircle2 size={16} className="text-gold flex-shrink-0 mt-1" /> <span>{line}</span></li>
    ));
  };

  return (
    <div className="job-detail-page">
      <div className="jd-container">
        
        {/* Breadcrumbs */}
        <div className="jd-breadcrumbs">
          <button className="btn-back-text" onClick={onBack}><ArrowLeft size={16} /> Trang chủ</button> 
          <span>&gt;</span>
          <span onClick={onBack} style={{cursor: 'pointer'}}>Tuyển dụng</span> 
          <span>&gt;</span>
          <span className="current">{job.title}</span>
        </div>

        {/* Header Box */}
        <div className="jd-header-box">
          <div className="jd-header-left">
            <div className="jd-icon-wrapper">
              <Building2 size={32} className="text-gold" />
            </div>
            <div className="jd-title-info">
              <div className="jd-title-row">
                <h1>{job.title}</h1>
                {job.type?.toLowerCase().includes('hot') && <span className="badge-hot">HOT</span>}
              </div>
              <div className="jd-sub-info">
                <span><Building2 size={14} className="text-gold" /> {job.department || 'Phòng ban chung'}</span>
                <span className="dot">•</span>
                <span><MapPin size={14} className="text-gold" /> {job.location || 'TP. Hồ Chí Minh'}</span>
              </div>
            </div>
          </div>
          
          <div className="jd-header-mid">
            <div className="jd-meta-item">
              <Coins size={16} className="text-muted" />
              <span>Thu nhập: {job.salaryRange || 'Thỏa thuận'}</span>
            </div>
            <div className="jd-meta-item">
              <Clock size={16} className="text-muted" />
              <span>Loại hình: {job.type || 'Toàn thời gian'}</span>
            </div>
          </div>

          <div className="jd-header-right">
            <button className="btn-solid-gold w-100" onClick={() => setIsModalOpen(true)}>
              <Send size={16} /> Ứng tuyển ngay
            </button>
          </div>
        </div>

        {/* Overview Row */}
        <div className="jd-overview-section">
          <h3 className="jd-section-title">TỔNG QUAN</h3>
          <div className="jd-overview-grid">
            <div className="jd-ov-item">
              <Users size={24} className="text-gold" />
              <div>
                <span className="ov-label">Phòng ban</span>
                <span className="ov-val">{job.department || 'Chưa cập nhật'}</span>
              </div>
            </div>
            <div className="jd-ov-item">
              <Building2 size={24} className="text-gold" />
              <div>
                <span className="ov-label">Hình thức</span>
                <span className="ov-val">{job.type || 'Toàn thời gian'}</span>
              </div>
            </div>
            <div className="jd-ov-item">
              <Users size={24} className="text-gold" />
              <div>
                <span className="ov-label">Số lượng</span>
                <span className="ov-val">Nhiều nhân sự</span>
              </div>
            </div>
            <div className="jd-ov-item">
              <MapPin size={24} className="text-gold" />
              <div>
                <span className="ov-label">Địa điểm</span>
                <span className="ov-val">{job.location || 'TP. Hồ Chí Minh'}</span>
              </div>
            </div>
            <div className="jd-ov-item">
              <Award size={24} className="text-gold" />
              <div>
                <span className="ov-label">Cấp bậc</span>
                <span className="ov-val">Nhân viên</span>
              </div>
            </div>
            <div className="jd-ov-item">
              <Calendar size={24} className="text-gold" />
              <div>
                <span className="ov-label">Hạn nộp hồ sơ</span>
                <span className="ov-val">{job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Columns Layout */}
        <div className="jd-main-grid">
          
          {/* Job Description */}
          <div className="jd-box">
            <h3 className="jd-section-title">MÔ TẢ CÔNG VIỆC</h3>
            <ul className="jd-list">
              {renderList(job.description)}
            </ul>
          </div>

          {/* Requirements */}
          <div className="jd-box">
            <h3 className="jd-section-title">YÊU CẦU ỨNG VIÊN</h3>
            <ul className="jd-list">
              {renderList(job.requirements)}
            </ul>
          </div>

          {/* Benefits */}
          <div className="jd-box">
            <h3 className="jd-section-title">QUYỀN LỢI ĐƯỢC HƯỞNG</h3>
            <ul className="jd-list">
              {renderList(job.benefits)}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="jd-bottom-grid">
          {/* Contact Info */}
          <div className="jd-box">
            <h3 className="jd-section-title">THÔNG TIN LIÊN HỆ</h3>
            <div className="jd-contact-list">
              <div className="jd-contact-item">
                <Building2 size={16} className="text-muted mt-1" />
                <div>
                  <strong>{job.hrName || 'Phòng Nhân sự - An Khang Group'}</strong>
                </div>
              </div>
              <div className="jd-contact-item">
                <MapPin size={16} className="text-muted mt-1" />
                <div>
                  {job.hrAddress || 'Tầng 15, Tòa nhà AK Tower, 123 Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh'}
                </div>
              </div>
              <div className="jd-contact-item">
                <Mail size={16} className="text-muted mt-1" />
                <div>
                  {job.hrEmail || 'hr@ankhanggroup.vn'}
                </div>
              </div>
              <div className="jd-contact-item">
                <Phone size={16} className="text-muted mt-1" />
                <div>
                  {job.hrPhone || '0909 123 456'}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <JobApplicationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        jobId={job.id}
        jobTitle={job.title} 
      />
    </div>
  );
}
