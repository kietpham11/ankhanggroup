import { useState, useEffect } from 'react';
import {
  Building2, Search, MapPin, BadgeDollarSign, Maximize,
  ShieldCheck, Map, Clock, Heart, BedDouble, Bath, ChevronRight, ChevronLeft,
  User, Home, Menu, LogOut, LayoutDashboard, Info, Phone, Mail, Briefcase, Newspaper
} from 'lucide-react';
import { useAuth } from './context/AuthContext';

import About from './pages/About';
import Projects from './features/projects/Projects';
import News from './features/news/News';
import NewsDetail from './features/news/NewsDetail';
import Contact from './pages/Contact';
import Recruitment from './features/recruitment/Recruitment';
import JobDetail from './features/recruitment/JobDetail';
import TeamMemberDetail from './features/team/TeamMemberDetail';
import HomeView from './pages/Home';
import Footer from './components/layout/Footer';
import ProjectDetail from './features/projects/ProjectDetail';
import { propertiesAPI } from './lib/api';
import './App.css';

interface Property {
  id: number;
  title: string;
  slug: string;
  address: string;
  price: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  type: string;
  status: string;
  images: { url: string }[];
}

const TYPE_LABELS: Record<string, string> = {
  LAND: 'Đất nền', HOUSE: 'Nhà phố',
};

function App() {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('sell');
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    "baner1.jpg",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
  ];
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'contact' | 'projects' | 'news' | 'recruitment' | 'project_detail' | 'news_detail' | 'job_detail' | 'team_detail'>('home');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentNewsId, setCurrentNewsId] = useState<number | string | null>(null);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [currentTeamMemberId, setCurrentTeamMemberId] = useState<number | null>(null);
  // Removed showAuth state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [banners, setBanners] = useState<any>({
    home: [
      "/images/banner1.png",
      "/images/banner2.png",
      "/images/banner3.png"
    ],
    news: '',
    projects: '',
    recruitment: '',
    about: '',
    contact: ''
  });

  useEffect(() => {
    propertiesAPI.getAll()
      .then(setProperties)
      .catch(console.error)
      .finally(() => setIsLoading(false));

    // Fetch banners
    import('./lib/api').then(({ settingsAPI, getFullImgUrl }) => {
      settingsAPI.get('BANNERS')
        .then((res: any) => {
          if (res && res.value) {
            const val = res.value;
            setBanners((prev: any) => ({
              ...prev,
              home: val.home && val.home.length > 0 ? val.home.map((u: string) => getFullImgUrl(u)) : prev.home,
              news: getFullImgUrl(val.news) || prev.news,
              projects: getFullImgUrl(val.projects) || prev.projects,
              recruitment: getFullImgUrl(val.recruitment) || prev.recruitment,
              about: getFullImgUrl(val.about) || prev.about,
              contact: getFullImgUrl(val.contact) || prev.contact,
            }));
          }
        })
        .catch(console.error);
    });

    // Handle browser back button (PopState)
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        setCurrentView(state.currentView || 'home');
        setCurrentProjectId(state.currentProjectId || null);
        setCurrentNewsId(state.currentNewsId || null);
        setCurrentJobId(state.currentJobId || null);
        setCurrentTeamMemberId(state.currentTeamMemberId || null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Initial replaceState to have a valid state on first load
    if (!window.history.state) {
      window.history.replaceState({ currentView: 'home' }, '', '#home');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Sync state to browser history for Back button
    const currentState = window.history.state;
    const isStateDifferent = !currentState || 
      currentState.currentView !== currentView || 
      currentState.currentProjectId !== currentProjectId ||
      currentState.currentNewsId !== currentNewsId ||
      currentState.currentJobId !== currentJobId ||
      currentState.currentTeamMemberId !== currentTeamMemberId;

    if (isStateDifferent) {
      window.history.pushState({
        currentView,
        currentProjectId,
        currentNewsId,
        currentJobId,
        currentTeamMemberId
      }, '', `#${currentView}`);
    }

    window.scrollTo(0, 0);

    if (currentView === 'home') {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % bannerImages.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [currentView, currentProjectId, currentNewsId, currentJobId, currentTeamMemberId]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % bannerImages.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + bannerImages.length) % bannerImages.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    propertiesAPI.getAll(search ? { search } : {}).then(setProperties);
  };

  const handleFavorite = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { alert('Tính năng yêu thích tạm thời chỉ dành cho thành viên nội bộ.'); return; }
    try {
      await propertiesAPI.toggleFavorite(id);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="app-container">

      {/* HEADER */}
      <header className="header">
        <div className="logo-container">
          <img src="/images/logo-final.png" alt="An Khang Group" style={{ height: '50px', width: 'auto', objectFit: 'contain', cursor: 'pointer', transform: 'scale(1.4)', transformOrigin: 'left center' }} onClick={() => setCurrentView('home')} />
        </div>

        <nav className="nav-menu">
          <a href="#home" onClick={() => setCurrentView('home')} className={`nav-link ${currentView === 'home' ? 'active' : ''}`}>Trang chủ</a>
          <a href="#projects" onClick={() => setCurrentView('projects')} className={`nav-link ${currentView === 'projects' ? 'active' : ''}`}>Dự án</a>
          <a href="#news" onClick={() => setCurrentView('news')} className={`nav-link ${currentView === 'news' ? 'active' : ''}`}>Tin tức</a>
          <a href="#recruitment" onClick={() => setCurrentView('recruitment')} className={`nav-link ${currentView === 'recruitment' ? 'active' : ''}`}>Tuyển dụng</a>
          <a href="#about" onClick={() => setCurrentView('about')} className={`nav-link ${currentView === 'about' ? 'active' : ''}`}>Về chúng tôi</a>
          <a href="#contact" onClick={() => setCurrentView('contact')} className={`nav-link ${currentView === 'contact' ? 'active' : ''}`}>Liên hệ</a>
        </nav>

        <div className="header-actions">
        </div>
      </header>

      {currentView === 'home' && (
        <HomeView 
          banners={banners.home}
          onViewDetail={(slug) => {
            setCurrentProjectId(slug);
            setCurrentView('project_detail');
          }} 
          onViewAllProjects={() => setCurrentView('projects')}
        />
      )}

      {currentView === 'projects' && (
        <Projects banner={banners.projects} onViewDetail={(id) => {
          setCurrentProjectId(id);
          setCurrentView('project_detail');
        }} />
      )}

      {currentView === 'project_detail' && (
        <ProjectDetail 
          projectSlug={currentProjectId ? String(currentProjectId) : undefined}
          onBack={() => setCurrentView('projects')}
        />
      )}

      {currentView === 'news' && (
        <News banner={banners.news} onViewDetail={(id) => {
          setCurrentNewsId(id);
          setCurrentView('news_detail');
        }} />
      )}

      {currentView === 'news_detail' && (
        <NewsDetail 
          newsId={currentNewsId || undefined}
          onBack={() => setCurrentView('news')}
        />
      )}

      {currentView === 'recruitment' && (
        <Recruitment banner={banners.recruitment} onViewDetail={(id) => {
          setCurrentJobId(id);
          setCurrentView('job_detail');
        }} />
      )}

      {currentView === 'job_detail' && (
        <JobDetail 
          jobId={currentJobId || undefined}
          onBack={() => setCurrentView('recruitment')}
        />
      )}

      {/* ABOUT US SECTION */}
      {currentView === 'about' && (
        <About banner={banners.about} onViewTeamMember={(id) => {
          setCurrentTeamMemberId(id);
          setCurrentView('team_detail');
        }} />
      )}

      {currentView === 'team_detail' && (
        <TeamMemberDetail 
          memberId={currentTeamMemberId || undefined}
          onBack={() => setCurrentView('about')}
        />
      )}

      {/* CONTACT SECTION */}
      {currentView === 'contact' && (
        <Contact banner={banners.contact} />
      )}

      <Footer />

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="mobile-nav">
        {[
          { icon: <Home size={20} />, label: 'Trang chủ', active: currentView === 'home', onClick: () => setCurrentView('home') },
          { icon: <Building2 size={20} />, label: 'Dự án', active: currentView === 'projects', onClick: () => setCurrentView('projects') },
          { icon: <Newspaper size={20} />, label: 'Tin tức', active: currentView === 'news', onClick: () => setCurrentView('news') },
          { icon: <Briefcase size={20} />, label: 'Tuyển dụng', active: currentView === 'recruitment', onClick: () => setCurrentView('recruitment') },
          { icon: <Info size={20} />, label: 'Về chúng tôi', active: currentView === 'about', onClick: () => setCurrentView('about') },
          { icon: <Phone size={20} />, label: 'Liên hệ', active: currentView === 'contact', onClick: () => setCurrentView('contact') },
        ].map((item, i) => (
          <div key={i} className={`mobile-nav-item ${item.active ? 'active' : ''}`} onClick={item.onClick}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
