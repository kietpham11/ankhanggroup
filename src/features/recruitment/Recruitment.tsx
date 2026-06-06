import React, { useState } from 'react';
import { 
  Users, Trophy, Heart, Search, Briefcase, MapPin, 
  Clock, Coins, Mail, ArrowRight, BadgeDollarSign, 
  Award, BookOpen, Plane, ShieldCheck, Lightbulb, 
  Handshake, TrendingUp, Loader2
} from 'lucide-react';
import './Recruitment.css';
import { jobsAPI, candidatesAPI } from '../../lib/api';

export default function Recruitment({ onViewDetail }: { onViewDetail?: (id: number) => void }) {
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Quick Apply State
  const [qaForm, setQaForm] = useState({ name: '', phone: '', jobId: '' });
  const [qaFile, setQaFile] = useState<File | null>(null);
  const [qaSubmitting, setQaSubmitting] = useState(false);
  const [qaStatus, setQaStatus] = useState<'idle' | 'success' | 'error'>('idle');

  React.useEffect(() => {
    jobsAPI.getAll()
      .then(data => {
        // Filter only open jobs
        const openJobs = data.filter((j: any) => j.status === 'Đang mở' || j.status === 'AVAILABLE');
        setJobs(openJobs);
        if (openJobs.length > 0) {
          setQaForm(prev => ({ ...prev, jobId: openJobs[0].id.toString() }));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleQuickApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaFile || !qaForm.jobId) return;

    setQaSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', qaForm.name);
      data.append('phone', qaForm.phone);
      data.append('email', 'quickapply@ankhang.com'); // Default email for quick apply
      data.append('cvFile', qaFile);

      await candidatesAPI.applyWithFile(parseInt(qaForm.jobId), data);
      setQaStatus('success');
      setTimeout(() => {
        setQaStatus('idle');
        setQaForm(prev => ({ ...prev, name: '', phone: '' }));
        setQaFile(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setQaStatus('error');
    } finally {
      setQaSubmitting(false);
    }
  };
  return (
    <div className="recruitment-page">
      {/* HERO SECTION */}
      <section className="recruitment-hero">
        <div className="recruitment-container">
          <div className="breadcrumb">Trang chủ &gt; Tuyển dụng</div>
          <h1 className="hero-title">
            Gia nhập<br/>
            <span className="text-gold">An Khang Group</span>
          </h1>
          <h3 className="hero-subtitle">Kiến tạo giá trị – Định hình tương lai cùng chúng tôi</h3>
          <p className="hero-desc">
            Tại An Khang Group, chúng tôi không chỉ xây dựng những công trình bất động sản chất lượng, mà còn kiến tạo môi trường làm việc chuyên nghiệp, năng động và nhân văn.
          </p>
          <div className="hero-actions">
            <button className="btn-gold">
              Xem vị trí đang tuyển dụng <ArrowRight size={16} />
            </button>
            <button className="btn-outline">
              Về An Khang Group
            </button>
          </div>
        </div>
      </section>

      {/* STATS ROW */}
      <section className="recruitment-container stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <Users size={32} className="stat-icon" />
            <div>
              <h4>500+ Nhân sự</h4>
              <p>Tập hợp những cá nhân tài năng, nhiệt huyết và chuyên nghiệp đang đồng hành phát triển cùng An Khang Group mỗi ngày.</p>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp size={32} className="stat-icon" />
            <div>
              <h4>10+ Năm</h4>
              <p>Phát triển bền vững, không ngừng đổi mới và từng bước khẳng định vị thế vững chắc trên thị trường bất động sản.</p>
            </div>
          </div>
          <div className="stat-card">
            <Trophy size={32} className="stat-icon" />
            <div>
              <h4>Nhiều giải thưởng</h4>
              <p>Tự hào đón nhận hàng loạt danh hiệu uy tín và các giải thưởng danh giá bậc nhất trong lĩnh vực đầu tư bất động sản.</p>
            </div>
          </div>
          <div className="stat-card">
            <Heart size={32} className="stat-icon" />
            <div>
              <h4>Môi trường lý tưởng</h4>
              <p>Văn hóa doanh nghiệp luôn đề cao con người, khuyến khích sáng tạo đột phá và tạo điều kiện phát triển bản thân toàn diện.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <section className="recruitment-container recruitment-main">
        {/* LEFT COLUMN */}
        <div className="jobs-column">
          <h2 className="section-heading text-gold">VỊ TRÍ ĐANG TUYỂN DỤNG</h2>
          

          <div className="jobs-list">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải tin tuyển dụng...</div>
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>Hiện tại chưa có vị trí nào đang tuyển dụng.</div>
            ) : jobs.map(job => (
              <div className="job-card" key={job.id} onClick={() => onViewDetail && onViewDetail(job.id)} style={{cursor: 'pointer'}}>
                <div className="job-icon-wrapper">
                  <Briefcase size={24} className="text-gold" />
                </div>
                <div className="job-info">
                  <div className="job-header">
                    <h4 className="job-title">{job.title}</h4>
                    {job.type?.toLowerCase().includes('hot') && <span className="badge-hot">HOT</span>}
                  </div>
                  <div className="job-meta">
                    <span>{job.department || 'Phòng ban chung'}</span>
                    <span className="dot">•</span>
                    <span>{job.location || 'TP. Hồ Chí Minh'}</span>
                  </div>
                </div>
                <div className="job-details">
                  <div className="job-detail-item">
                    <Coins size={16} className="text-muted" /> Thu nhập: {job.salaryRange || 'Thoả thuận'}
                  </div>
                  <div className="job-detail-item">
                    <Clock size={16} className="text-muted" /> Hạn nộp: {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không thời hạn'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="btn-view-all">
            Xem tất cả vị trí <ArrowRight size={16} />
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="sidebar-column">
          {/* Quick Apply Form */}
          <div className="sidebar-box quick-apply-box">
            <h4 className="text-gold" style={{marginBottom: '0.5rem', textAlign: 'center'}}>ỨNG TUYỂN NHANH</h4>
            <p style={{textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn.</p>
            
            {qaStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '1rem 0', color: '#10b981' }}>
                <p>🎉 Nộp hồ sơ thành công!</p>
              </div>
            ) : (
              <form className="quick-apply-form" onSubmit={handleQuickApply}>
                <div className="qa-group">
                  <select 
                    className="qa-input" 
                    required 
                    value={qaForm.jobId} 
                    onChange={e => setQaForm({...qaForm, jobId: e.target.value})}
                    disabled={qaSubmitting}
                  >
                    <option value="" disabled>-- Chọn vị trí ứng tuyển --</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>
                <div className="qa-group">
                  <input type="text" placeholder="Họ và tên *" required className="qa-input" value={qaForm.name} onChange={e => setQaForm({...qaForm, name: e.target.value})} disabled={qaSubmitting} />
                </div>
                <div className="qa-group">
                  <input 
                    type="tel" 
                    placeholder="Số điện thoại *" 
                    required 
                    className="qa-input" 
                    value={qaForm.phone} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setQaForm({...qaForm, phone: val});
                    }} 
                    disabled={qaSubmitting} 
                  />
                </div>
                <div className="qa-group">
                  <div className="qa-file-upload">
                    <input type="file" id="sidebar-cv" className="qa-file-input" accept=".pdf,.doc,.docx" required onChange={e => setQaFile(e.target.files ? e.target.files[0] : null)} disabled={qaSubmitting} />
                    <label htmlFor="sidebar-cv" className="qa-file-label">
                      <span className="qa-file-hint" style={{ color: qaFile ? '#d4a017' : 'inherit' }}>
                        {qaFile ? qaFile.name : 'Tải lên CV (PDF, DOCX)'}
                      </span>
                    </label>
                  </div>
                </div>
                {qaStatus === 'error' && <div style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center', marginBottom: '0.5rem' }}>Đã có lỗi xảy ra.</div>}
                <button type="submit" className="btn-gold w-100" style={{marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}} disabled={qaSubmitting}>
                  {qaSubmitting ? <Loader2 size={16} className="spin" /> : null}
                  {qaSubmitting ? 'Đang gửi...' : 'Gửi CV tự ứng tuyển'}
                </button>
              </form>
            )}
          </div>

          {/* Box 2 */}
          <div className="sidebar-box benefits-box">
            <h4 className="text-gold">Phúc lợi dành cho bạn</h4>
            <ul className="benefits-list">
              <li><BadgeDollarSign size={18} className="text-gold" /> Thu nhập cạnh tranh</li>
              <li><Award size={18} className="text-gold" /> Thưởng hiệu quả hấp dẫn</li>
              <li><BookOpen size={18} className="text-gold" /> Đào tạo & phát triển bản thân</li>
              <li><Users size={18} className="text-gold" /> Môi trường chuyên nghiệp</li>
              <li><Plane size={18} className="text-gold" /> Du lịch, team building & sự kiện</li>
            </ul>
          </div>
        </div>
      </section>


    </div>
  );
}
