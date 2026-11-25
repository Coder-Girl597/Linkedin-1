import { ArrowRight, Bookmark, ChevronRight, Plus, TrendingUp } from 'lucide-react';
import Avatar from './Avatar.jsx';
import { currentUser, news } from '../data.js';

export function LeftSidebar({ onOpenProfile, savedCount }) {
  return (
    <aside className="left-sidebar">
      <section className="card profile-card">
        <button className="cover-art" onClick={onOpenProfile} aria-label="View profile" />
        <Avatar initials={currentUser.initials} className={`${currentUser.avatar} profile-avatar`} />
        <button className="profile-card-info" onClick={onOpenProfile}>
          <strong>{currentUser.name}</strong>
          <span>{currentUser.headline}</span>
          <small>{currentUser.location}</small>
        </button>
        <div className="profile-stats">
          <button onClick={onOpenProfile}><span>Profile viewers</span><strong>184</strong></button>
          <button onClick={onOpenProfile}><span>Post impressions</span><strong>2,481</strong></button>
        </div>
        <button className="premium-link" onClick={onOpenProfile}>
          <span className="premium-cube">✦</span>
          <span>Try Premium for free</span>
          <ArrowRight size={15} />
        </button>
        <button className="saved-link" onClick={() => window.dispatchEvent(new CustomEvent('connectly:saved'))}>
          <Bookmark size={16} /><span>My saved items</span>{savedCount > 0 && <b>{savedCount}</b>}
        </button>
      </section>

      <section className="card sidebar-links">
        <h3>Recent</h3>
        <button><span className="group-icon">#</span> design-leadership</button>
        <button><span className="group-icon">◈</span> Product Makers Community</button>
        <button><span className="group-icon">#</span> future-of-work</button>
        <button className="discover-link">Discover more <ChevronRight size={15} /></button>
      </section>
      <div className="sidebar-footer">
        <span>About</span><span>Accessibility</span><span>Help Center</span>
        <span>Privacy &amp; Terms</span><span>Ad Choices</span><span>More</span>
        <div className="footer-brand"><span className="tiny-brand">c</span> Connectly Corporation © 2025</div>
      </div>
    </aside>
  );
}

export function RightSidebar({ people, following, onFollow, onSeeAll }) {
  return (
    <aside className="right-sidebar">
      <section className="card news-card">
        <div className="card-heading">
          <h2>Connectly News</h2><span className="info-dot">i</span>
        </div>
        <p className="sidebar-eyebrow">TOP STORIES <span>·</span> DAILY BRIEFING</p>
        <ul className="news-list">
          {news.map((item, index) => (
            <li key={item.title}>
              <button onClick={() => onSeeAll(item.title)}>
                <span className="news-dot" />
                <span><strong>{item.title}</strong><small>{item.detail}</small></span>
              </button>
              {index === 0 && <span className="news-hot"><TrendingUp size={11} /> Trending</span>}
            </li>
          ))}
        </ul>
        <button className="show-more" onClick={() => onSeeAll('Top stories')}>Show more <ChevronRight size={15} /></button>
      </section>

      <section className="card suggestions-card">
        <div className="card-heading">
          <h2>People you may know</h2><span className="info-dot">i</span>
        </div>
        {people.slice(0, 3).map((person) => (
          <div className="suggestion" key={person.id}>
            <Avatar initials={person.initials} className={person.avatar} />
            <div className="suggestion-copy">
              <strong>{person.name}</strong>
              <span>{person.headline}</span>
              <small>{person.mutual}</small>
              <button
                className={`connect-button ${following.includes(person.id) ? 'connect-button-following' : ''}`}
                onClick={() => onFollow(person.id)}
              >
                {following.includes(person.id) ? '✓ Following' : <><Plus size={15} /> Follow</>}
              </button>
            </div>
          </div>
        ))}
        <button className="show-more" onClick={() => onSeeAll('People you may know')}>See all recommendations <ChevronRight size={15} /></button>
      </section>

      <section className="card article-card">
        <span className="article-kicker">EDITOR'S PICK</span>
        <div className="article-art"><span>THE<br />WORK<br />AHEAD</span><span className="article-orbit" /></div>
        <div className="article-copy">
          <strong>Work, reimagined.</strong>
          <p>Ideas and perspectives for what comes next.</p>
          <button onClick={() => onSeeAll('Today’s most popular articles')}>Explore the latest <ArrowRight size={14} /></button>
        </div>
      </section>

      <div className="right-footer">About · Accessibility · Help Center<br />Privacy &amp; Terms · Ad Choices · More<br /><strong>Connectly</strong> Corporation © 2025</div>
    </aside>
  );
}
