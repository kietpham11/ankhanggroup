import { useState, useEffect } from 'react';
import {
  Building2, LayoutDashboard, Home, FileText, Image,
  Settings, User, LogOut, Bell, Calendar,
  Eye, MessageSquare, ArrowUpRight, ArrowDownRight,
  MoreVertical, Menu, Plus, Check, X, Phone, Mail, Briefcase, Users
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { dashboardAPI, contactsAPI, propertiesAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Projects from '../features/admin/Projects';
import Posts from '../features/admin/Posts';
import AddPost from '../features/admin/Posts/AddPost';
import Contacts from '../features/admin/Contacts';
import Recruitment from '../features/admin/Recruitment';
import Candidates from '../features/admin/Candidates';
import AddProjectModal from '../features/admin/Projects/components/AddProjectModal';
import AdminSettings from '../features/admin/Settings';
import Leadership from '../features/admin/Leadership';
import './Admin.css';

const COLORS = ['#D4A017', '#F4C542', '#C8D0E0', '#0B224F'];
const PIE_LABELS: Record<string, string> = {
  HOUSE: 'Nhà phố', LAND: 'Đất nền'
};

type Page = 'dashboard' | 'recruitment' | 'candidates' | 'contacts' | 'posts' | 'projects' | 'settings' | 'leadership';

function Admin() {
  const { user, isAdmin, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [postView, setPostView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/ak-management/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Dashboard data
  const [stats, setStats] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<number>(30);
  const [dashboardData, setDashboardData] = useState<any>({
    contactsReport: [],
    projectStatusDistribution: [],
    topProperties: [],
    revenueData: [],
    trafficData: []
  });
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (authLoading || !user || !isAdmin) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B224F', color: 'white' }}>Đang xác thực...</div>;
  }

  useEffect(() => {
    loadDashboard(timeframe);
    
    // Auto refresh stats every 10 seconds to show new notifications
    const interval = setInterval(async () => {
      try {
        const pendingContacts = await contactsAPI.getAll('PENDING');
        setStats((prev: any) => {
          if (prev && pendingContacts.length > prev.pendingContacts) {
            // Play sound and show toast
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));
            
            setToastMessage(`Có ${pendingContacts.length - prev.pendingContacts} khách hàng mới vừa để lại liên hệ!`);
            setTimeout(() => setToastMessage(null), 6000);
          }
          return prev ? { ...prev, pendingContacts: pendingContacts.length } : prev;
        });
      } catch (err) {
        console.error('Lỗi khi check thông báo', err);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [timeframe]);

  const loadDashboard = async (days: number) => {
    try {
      setIsLoading(true);
      const data = await dashboardAPI.getStats(days);
      
      setStats(data.stats);

      setDashboardData({
        contactsReport: data.contactsReport || [],
        projectStatusDistribution: data.projectStatusDistribution || [],
        topProperties: data.topProperties || [],
        revenueData: data.revenueData || [],
        trafficData: data.trafficData || []
      });
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const data = await contactsAPI.getAll();
      setContacts(data);
    } catch (err) { console.error(err); }
  };

  const handlePageChange = (page: Page) => {
    setActivePage(page);
    setIsSidebarOpen(false);
    if (page === 'contacts') loadContacts();
  };

  const handleContactStatus = async (id: number, status: string) => {
    await contactsAPI.updateStatus(id, status);
    loadContacts();
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm('Xác nhận xoá liên hệ này?')) return;
    await contactsAPI.delete(id);
    loadContacts();
  };

  const menuItems: { page: Page; icon: any; label: string }[] = [
    { page: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { page: 'projects', icon: Building2, label: 'Dự án' },
    { page: 'posts', icon: FileText, label: 'Bài viết' },
    { page: 'recruitment', icon: Briefcase, label: 'Tuyển dụng' },
    { page: 'candidates', icon: Users, label: 'Ứng viên' },
    { page: 'contacts', icon: MessageSquare, label: 'Liên hệ' },
    { page: 'settings', icon: Settings, label: 'Cài đặt' },
    { page: 'leadership', icon: Users, label: 'Đội ngũ lãnh đạo' },
  ];

  return (
    <div className="admin-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          background: '#10b981', color: 'white', padding: '1rem 1.5rem',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '0.8rem',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <Bell size={20} />
          <div style={{ fontWeight: 500 }}>{toastMessage}</div>
          <button onClick={() => setToastMessage(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '0.5rem' }}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className={`mobile-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)} />

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ padding: '0 1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <img src="/images/logo-final.png" alt="An Khang Group" style={{ height: '100px', width: 'auto', objectFit: 'contain', transform: 'scale(1.2)' }} />
        </div>

        <div className="sidebar-menu">
          <div className="menu-group-title">QUẢN LÝ</div>
          {menuItems.map(({ page, icon: Icon, label }) => (
            <div key={page}
              className={`menu-item ${activePage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}>
              <Icon size={18} /> {label}
              {page === 'contacts' && stats?.pendingContacts > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', borderRadius: '9999px', fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
                  {stats.pendingContacts}
                </span>
              )}
            </div>
          ))}
          <div className="menu-group-title">TÀI KHOẢN</div>
          <div className="menu-item"><User size={18} /> Thông tin cá nhân</div>
        </div>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="admin-avatar">{user?.name?.[0]?.toUpperCase() ?? 'A'}</div>
            <div className="admin-info">
              <h4>{user?.name ?? 'Admin'}</h4>
              <p>{user?.email}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={logout}><LogOut size={16} /> Đăng xuất</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-header-menu" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="admin-title">
              <h2>{menuItems.find(m => m.page === activePage)?.label}</h2>
              {activePage === 'projects' ? (
                <p>Dashboard &gt; Dự án</p>
              ) : activePage === 'posts' ? (
                <p>Dashboard &gt; Bài viết {postView === 'add' ? '> Thêm bài viết' : postView === 'edit' ? '> Chỉnh sửa bài viết' : ''}</p>
              ) : activePage === 'leadership' ? (
                <p>Dashboard &gt; Đội ngũ lãnh đạo</p>
              ) : (
                <p>Xin chào, Quản trị viên</p>
              )}
            </div>
          </div>
          <div className="header-right">
            {/* Thêm dự án button moved to Projects feature */}
            {activePage === 'posts' && postView === 'list' && (
              <button style={{ 
                background: '#d89f2a', color: '#fff', border: 'none', 
                padding: '0.5rem 1rem', borderRadius: '4px', 
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem'
              }} onClick={() => setPostView('add')}>
                <Plus size={16} /> Thêm bài viết
              </button>
            )}
            {activePage === 'posts' && (postView === 'add' || postView === 'edit') && (
              <button style={{ 
                background: '#ffffff', color: '#4a5568', border: '1px solid #e2e8f0', 
                padding: '0.5rem 1rem', borderRadius: '4px', 
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem'
              }} onClick={() => {
                setPostView('list');
                setEditingPost(null);
              }}>
                &lt; Quay lại danh sách
              </button>
            )}
            <div className="date-picker">
              <Calendar size={16} /> {new Date().toLocaleDateString('vi-VN')}
            </div>
            <button className="notification-btn" style={{ position: 'relative' }} onClick={() => handlePageChange('contacts')} title="Thông báo liên hệ mới">
              <Bell size={20} />
              {stats?.pendingContacts > 0 && (
                <span style={{ 
                  position: 'absolute', top: '2px', right: '2px', 
                  background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', 
                  width: '16px', height: '16px', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 0 2px #f8fafc'
                }}>
                  {stats.pendingContacts}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ====== DASHBOARD ====== */}
        {activePage === 'dashboard' && (
          <>
            <div className="stats-grid">
              {[
                { label: 'Tổng bất động sản', value: stats?.totalProperties ?? '...', icon: <Home size={24} />, trend: '+12.5%', up: true },
                { label: 'Tổng lượt xem', value: stats?.totalUsers ?? '...', icon: <Eye size={24} />, trend: '+18.7%', up: true },
                { label: 'Lượt liên hệ', value: stats?.totalContacts ?? '...', icon: <MessageSquare size={24} />, trend: '+5.3%', up: true },
                { label: 'Bài viết đã đăng', value: stats?.totalPosts ?? '...', icon: <FileText size={24} />, trend: '+2', up: true },
              ].map((card, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-info">
                    <h5>{card.label}</h5>
                    <div className="stat-number">{card.value}</div>
                    <div className={`stat-trend ${card.up ? 'trend-up' : 'trend-down'}`}>
                      {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {card.trend} so với tháng trước
                    </div>
                  </div>
                  <div className="stat-icon">{card.icon}</div>
                </div>
              ))}
            </div>

            <div className="charts-row">
              <div className="chart-card">
                <div className="chart-header"><h3>Báo cáo Liên hệ</h3></div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={dashboardData.contactsReport}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="name" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" />
                    <Tooltip contentStyle={{ backgroundColor: '#071A3D', border: '1px solid rgba(212,160,23,0.25)', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" name="Chưa xử lý" dataKey="PENDING" stroke="#ef4444" strokeWidth={3} dot={{ r: 3 }} />
                    <Line type="monotone" name="Đã xử lý" dataKey="RESOLVED" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                  Dữ liệu thống kê số lượng liên hệ theo trạng thái trong {timeframe} ngày qua.
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header"><h3>Thống kê Trạng thái Dự án</h3></div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={dashboardData.projectStatusDistribution.length ? dashboardData.projectStatusDistribution : [{name: 'Chưa có dữ liệu', value: 1}]} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={5} dataKey="value">
                      {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#071A3D', border: '1px solid rgba(212,160,23,0.25)', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                  Tỷ trọng phân bổ rổ hàng dự án hiện tại theo trạng thái.
                </div>
              </div>
            </div>

            <div className="charts-row" style={{ marginTop: '1.5rem' }}>
              <div className="chart-card">
                <div className="chart-header"><h3>Lượng Liên hệ (6 tháng qua)</h3></div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dashboardData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="name" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" />
                    <Tooltip cursor={{ fill: 'rgba(212,160,23,0.1)' }} contentStyle={{ backgroundColor: '#071A3D', border: '1px solid rgba(212,160,23,0.25)', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#D4A017" radius={[4, 4, 0, 0]} name="Số liên hệ" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                  Tổng số lượng liên hệ nhận được phân bổ theo 6 tháng gần nhất.
                </div>
              </div>
              <div className="chart-card">
                <div className="chart-header"><h3>Nguồn khách hàng tiềm năng</h3></div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dashboardData.trafficData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4a5568', fontSize: 12 }} />
                    <Radar name="Lượt tiếp cận" dataKey="A" stroke="#D4A017" fill="#D4A017" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1a202c' }} />
                  </RadarChart>
                </ResponsiveContainer>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                  Ước tính nguồn lưu lượng khách hàng tiếp cận trong {timeframe} ngày qua.
                </div>
              </div>
            </div>

            <div className="tables-row" style={{ marginTop: '1.5rem' }}>
              <div className="table-card" style={{ flex: '1' }}>
                <div className="table-header">
                  <h3>Top 5 Bất động sản quan tâm nhất</h3>
                </div>
                <table className="admin-table">
                  <thead><tr><th>#</th><th>Bất động sản</th><th>Trạng thái</th><th style={{ textAlign: 'right' }}>Lượt liên hệ</th></tr></thead>
                  <tbody>
                    {dashboardData.topProperties.map((p: any, idx: number) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600, color: 'var(--gold-accent)' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 500 }}>{p.name}</td>
                        <td><span className={`status-badge ${p.status === 'Đang mở bán' ? 'status-active' : 'status-pending'}`}>{p.status}</span></td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{p.views.toLocaleString('vi-VN')}</td>
                      </tr>
                    ))}
                    {dashboardData.topProperties.length === 0 && (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Chưa có dữ liệu liên hệ</td></tr>
                    )}
                  </tbody>
                </table>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                  Xếp hạng các sản phẩm có số lượng khách hàng yêu cầu liên hệ cao nhất trong {timeframe} ngày qua.
                </div>
              </div>
            </div>
          </>
        )}

        {/* ====== CONTACTS PAGE ====== */}
        {activePage === 'contacts' && (
          <Contacts />
        )}

        {/* ====== RECRUITMENT PAGE ====== */}
        {activePage === 'recruitment' && (
          <Recruitment />
        )}

        {/* ====== CANDIDATES PAGE ====== */}
        {activePage === 'candidates' && (
          <Candidates />
        )}

        {/* ====== PROJECTS PAGE ====== */}
        {activePage === 'projects' && (
          <Projects />
        )}

        {/* ====== POSTS PAGE ====== */}
        {activePage === 'posts' && postView === 'list' && (
          <Posts onEdit={(post) => {
            setEditingPost(post);
            setPostView('edit');
          }} />
        )}
        {activePage === 'posts' && (postView === 'add' || postView === 'edit') && (
          <AddPost 
            isEdit={postView === 'edit'} 
            postData={editingPost}
            onBack={() => {
              setPostView('list');
              setEditingPost(null);
            }} 
          />
        )}

        {/* ====== SETTINGS PAGE ====== */}
        {activePage === 'settings' && (
          <AdminSettings onNavigate={handlePageChange} />
        )}
        
        {/* ====== LEADERSHIP PAGE ====== */}
        {activePage === 'leadership' && (
          <Leadership />
        )}
      </main>

      {/* Add Project Modal removed */}
    </div>
  );
}

export default Admin;
