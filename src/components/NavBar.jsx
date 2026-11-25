import { useState } from 'react';
import {
  Bell, BriefcaseBusiness, ChevronDown, Home, MessageCircle, Search,
  UsersRound, X,
} from 'lucide-react';
import Avatar from './Avatar.jsx';

const tabs = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'network', label: 'My Network', Icon: UsersRound },
  { id: 'jobs', label: 'Jobs', Icon: BriefcaseBusiness },
  { id: 'messaging', label: 'Messaging', Icon: MessageCircle },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
];

export default function NavBar({ activeTab, onNavigate, query, onSearch, user, unreadCount, onProfileAction }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navigate = (tab) => {
    onNavigate(tab);
    setProfileOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={() => navigate('home')} aria-label="Connectly home">
          <span className="brand-mark">c</span>
          <span className="brand-name">connectly</span>
        </button>
        <div className={`search-box ${mobileSearchOpen ? 'search-box-open' : ''}`}>
          <Search size={17} aria-hidden="true" />
          <input
            aria-label="Search people and posts"
            placeholder="Search people, posts..."
            value={query}
            onChange={(event) => onSearch(event.target.value)}
            onFocus={() => onNavigate('home')}
          />
          <button className="search-close" onClick={() => setMobileSearchOpen(false)} aria-label="Close search">
            <X size={17} />
          </button>
        </div>
        <button className="mobile-search-trigger" onClick={() => setMobileSearchOpen((open) => !open)} aria-label="Search">
          <Search size={21} />
        </button>
        <nav className="primary-nav" aria-label="Primary navigation">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-item ${activeTab === id ? 'nav-item-active' : ''}`}
              onClick={() => navigate(id)}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <span className="nav-icon-wrap">
                <Icon size={21} strokeWidth={1.8} />
                {id === 'notifications' && unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
              </span>
              <span>{label}</span>
            </button>
          ))}
          <div className="profile-menu-wrap">
            <button
              className={`nav-item profile-nav ${profileOpen || activeTab === 'profile' ? 'nav-item-active' : ''}`}
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
            >
              <Avatar initials={user.initials} className={user.avatar} size="avatar-nav" />
              <span>Me <ChevronDown size={12} /></span>
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-user">
                  <Avatar initials={user.initials} className={user.avatar} />
                  <div><strong>{user.name}</strong><span>{user.headline}</span></div>
                </div>
                <button onClick={() => { onProfileAction('profile'); setProfileOpen(false); }}>View profile</button>
                <button onClick={() => { onProfileAction('settings'); setProfileOpen(false); }}>Settings &amp; privacy</button>
                <button onClick={() => { onProfileAction('signout'); setProfileOpen(false); }}>Sign out</button>
              </div>
            )}
          </div>
        </nav>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {tabs.filter((tab) => tab.id !== 'jobs').map(({ id, label, Icon }) => (
          <button key={id} onClick={() => navigate(id)} className={activeTab === id ? 'mobile-nav-active' : ''}>
            <span className="nav-icon-wrap">
              <Icon size={21} />
              {id === 'notifications' && unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
            </span>
            <span>{label}</span>
          </button>
        ))}
        <button onClick={() => navigate('profile')} className={activeTab === 'profile' ? 'mobile-nav-active' : ''}>
          <Avatar initials={user.initials} className={`${user.avatar} avatar-mobile-nav`} />
          <span>Me</span>
        </button>
      </nav>
    </header>
  );
}
