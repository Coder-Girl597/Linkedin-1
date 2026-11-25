import { ArrowLeft, ArrowRight, Award, BriefcaseBusiness, CalendarDays, GraduationCap, MapPin, Pencil, Plus, Sparkles } from 'lucide-react';
import Avatar from './Avatar.jsx';
import FeedPost from './FeedPost.jsx';

const experience = [
  {
    company: 'Fieldnote',
    role: 'Product Designer',
    dates: '2022 – Present · 3 yrs',
    location: 'San Francisco Bay Area',
    description: 'Leading product design for collaboration tools. Built a shared design system adopted across four product teams and helped simplify the onboarding experience.',
    mark: 'F',
    color: 'experience-blue',
  },
  {
    company: 'Brightwell',
    role: 'Senior UX Designer',
    dates: '2019 – 2022 · 3 yrs',
    location: 'San Francisco, California',
    description: 'Designed accessible digital experiences for healthcare teams, partnering with research and engineering from discovery through launch.',
    mark: 'B',
    color: 'experience-coral',
  },
  {
    company: 'Daylight Studio',
    role: 'Product Designer',
    dates: '2017 – 2019 · 2 yrs',
    location: 'Oakland, California',
    description: 'Worked with early-stage teams to turn customer insights into clear, useful web and mobile products.',
    mark: 'D',
    color: 'experience-amber',
  },
];

const skills = [
  'Product Design',
  'Design Systems',
  'User Experience (UX)',
  'Figma',
  'Prototyping',
  'Interaction Design',
  'User Research',
  'Product Strategy',
];

export default function ProfileView({
  user,
  posts,
  onBack,
  onLike,
  onComment,
  onRepost,
  onSave,
  onMessage,
  onHide,
  onToast,
}) {
  const authoredPosts = posts.filter((post) => post.author.name === user.name && !post.hidden);

  return (
    <div className="profile-page">
      <button className="profile-back" onClick={onBack}><ArrowLeft size={16} /> Back to feed</button>
      <section className="card profile-hero">
        <div className="profile-cover-large">
          <span className="cover-orbit cover-orbit-one" />
          <span className="cover-orbit cover-orbit-two" />
          <span className="cover-line" />
          <span className="profile-cover-label">DESIGN · CRAFT · COMMUNITY</span>
        </div>
        <div className="profile-hero-content">
          <Avatar initials={user.initials} className={`${user.avatar} profile-hero-avatar`} />
          <div className="profile-hero-actions">
            <button className="profile-action-secondary" onClick={() => onToast('Your profile editor is ready.')}>
              <Pencil size={14} /> Edit profile
            </button>
            <button className="profile-action-primary" onClick={() => onToast('Your profile link is ready to share.')}>
              <Plus size={15} /> Add profile section
            </button>
          </div>
          <div className="profile-identity">
            <h1>{user.name}</h1>
            <p>{user.headline}</p>
            <div className="profile-meta"><span>{user.location}</span><span className="profile-meta-dot">·</span><button onClick={() => onToast('Your network has 500+ connections.')}>500+ connections</button></div>
            <div className="profile-open-to"><Sparkles size={14} /><strong>Open to work</strong><span>Product Designer, Senior Product Designer roles</span></div>
          </div>
          <div className="profile-hero-network">
            <span className="network-mini-avatars"><Avatar initials="MC" className="avatar-lilac" size="avatar-small" /><Avatar initials="JO" className="avatar-green" size="avatar-small" /><Avatar initials="SR" className="avatar-coral" size="avatar-small" /></span>
            <span>Followed by Maya, James, and 18 others</span>
          </div>
        </div>
      </section>

      <div className="profile-content-grid">
        <div className="profile-main-column">
          <section className="card profile-section">
            <div className="profile-section-title"><h2>About</h2><button className="icon-button" aria-label="Edit about section" onClick={() => onToast('About section editor is ready.')}><Pencil size={15} /></button></div>
            <p className="about-copy">I’m a product designer who loves making complex things feel simple. I work at the intersection of thoughtful systems, clear storytelling, and the small details that make digital products feel human.</p>
            <p className="about-copy">Over the past eight years, I’ve partnered with curious teams to bring ideas from early sketches to products used every day. Outside of work, you’ll find me collecting cookbooks, exploring the Bay Area, or sketching at a neighborhood cafe.</p>
          </section>

          <section className="card profile-section">
            <div className="profile-section-title"><div><h2>Experience</h2><span className="section-subtitle">A little about where I’ve been</span></div><button className="icon-button" aria-label="Add experience" onClick={() => onToast('Add an experience from your profile editor.')}><Plus size={18} /></button></div>
            <div className="experience-list">
              {experience.map((item, index) => (
                <article className="experience-item" key={item.company}>
                  <span className={`experience-mark ${item.color}`}>{item.mark}</span>
                  <div className="experience-copy">
                    <h3>{item.role}</h3>
                    <strong>{item.company}</strong>
                    <span>{item.dates}</span>
                    <small><MapPin size={12} /> {item.location}</small>
                    <p>{item.description}</p>
                    {index === 0 && <span className="experience-skills"><Sparkles size={12} /> Product Design · Design Systems</span>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card profile-section">
            <div className="profile-section-title"><h2>Education</h2><button className="icon-button" aria-label="Add education" onClick={() => onToast('Add education from your profile editor.')}><Plus size={18} /></button></div>
            <article className="education-item">
              <span className="education-mark"><GraduationCap size={22} /></span>
              <div><h3>California College of the Arts</h3><span>Bachelor of Fine Arts, Interaction Design</span><small>2013 – 2017</small></div>
            </article>
          </section>

          <section className="card profile-section">
            <div className="profile-section-title"><div><h2>Skills</h2><span className="section-subtitle">What I bring to the table</span></div><button className="icon-button" aria-label="Add skill" onClick={() => onToast('Manage your skills from your profile editor.')}><Plus size={18} /></button></div>
            <div className="profile-skills">
              {skills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}
            </div>
            <button className="all-skills-button" onClick={() => onToast('You have 8 featured skills.')}>Show all skills <ArrowRight size={14} /></button>
          </section>

          <section className="card profile-section activity-section">
            <div className="profile-section-title"><div><h2>Activity</h2><span className="section-subtitle">Recent posts from {user.name.split(' ')[0]}</span></div><button className="activity-post-button" onClick={onBack}>Create a post</button></div>
            {authoredPosts.length > 0 ? (
              <div className="profile-activity-posts">
                {authoredPosts.map((post) => (
                  <FeedPost
                    key={post.id}
                    post={post}
                    user={user}
                    onLike={onLike}
                    onComment={onComment}
                    onRepost={onRepost}
                    onSave={onSave}
                    onMessage={onMessage}
                    onReport={onHide}
                  />
                ))}
              </div>
            ) : (
              <div className="profile-empty-activity"><span><CalendarDays size={20} /></span><strong>Nothing shared just yet</strong><p>When you share a post, it will show up here.</p><button onClick={onBack}>Start a post <ArrowRight size={14} /></button></div>
            )}
          </section>
        </div>

        <aside className="profile-aside">
          <section className="card profile-aside-card">
            <h2>Profile highlights</h2>
            <div className="highlight-item"><span className="highlight-icon"><BriefcaseBusiness size={15} /></span><p><strong>Currently working at Fieldnote</strong><small>Product team · 2022 – Present</small></p></div>
            <div className="highlight-item"><span className="highlight-icon highlight-award"><Award size={15} /></span><p><strong>Design systems advocate</strong><small>Building tools that help teams do their best work</small></p></div>
          </section>
          <section className="card profile-aside-card profile-people-card">
            <h2>People also viewed</h2>
            {[
              { name: 'Maya Chen', role: 'Design Lead at Figma', initials: 'MC', avatar: 'avatar-lilac' },
              { name: 'James Okafor', role: 'Founder & CEO at Northstar', initials: 'JO', avatar: 'avatar-green' },
              { name: 'Sofia Reyes', role: 'Product Manager · Climate tech', initials: 'SR', avatar: 'avatar-coral' },
            ].map((person) => (
              <button className="profile-person-link" key={person.name} onClick={() => onToast(`${person.name}’s profile preview is coming up.`)}>
                <Avatar initials={person.initials} className={person.avatar} size="avatar-small" />
                <span><strong>{person.name}</strong><small>{person.role}</small></span>
                <ArrowRight size={14} />
              </button>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}
