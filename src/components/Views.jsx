import { useState } from 'react';
import { ArrowLeft, Bell, BriefcaseBusiness, Check, ChevronRight, MapPin, MessageCircle, Search, Send, UsersRound } from 'lucide-react';
import Avatar from './Avatar.jsx';

export function NetworkView({ people, following, onFollow }) {
  return (
    <section className="card destination-view">
      <div className="destination-heading"><div><span className="section-icon network-color"><UsersRound size={20} /></span><div><h1>Grow your network</h1><p>Connect with people who share your interests.</p></div></div></div>
      <div className="network-filters"><button className="filter-selected">People you may know</button><button>From your industry</button><button>In your area</button></div>
      <div className="network-grid">
        {people.map((person) => (
          <article className="network-person" key={person.id}>
            <div className={`network-cover ${person.avatar}`} />
            <Avatar initials={person.initials} className={`${person.avatar} network-avatar`} />
            <div className="network-person-info"><strong>{person.name}</strong><span>{person.headline}</span><small>{person.mutual}</small></div>
            <button className={`connect-button ${following.includes(person.id) ? 'connect-button-following' : ''}`} onClick={() => onFollow(person.id)}>
              {following.includes(person.id) ? <><Check size={15} /> Following</> : <><UsersRound size={15} /> Follow</>}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function JobsView({ onToast }) {
  const [applied, setApplied] = useState([]);
  const jobs = [
    { company: 'Northstar', initials: 'N', avatar: 'avatar-blue', title: 'Senior Product Designer', place: 'San Francisco, CA · Hybrid', type: 'Full-time · 2 days ago', match: 'Your profile is a strong match' },
    { company: 'Studio Good', initials: 'S', avatar: 'avatar-coral', title: 'Product Design Lead', place: 'Remote · United States', type: 'Full-time · 1 day ago', match: 'Actively reviewing applicants' },
    { company: 'Arc Labs', initials: 'A', avatar: 'avatar-lilac', title: 'UX Researcher', place: 'New York, NY · Hybrid', type: 'Full-time · 3 days ago', match: 'You would be a top applicant' },
  ];
  return (
    <section className="card destination-view jobs-view">
      <div className="destination-heading"><div><span className="section-icon jobs-color"><BriefcaseBusiness size={20} /></span><div><h1>Find your next opportunity</h1><p>Thoughtful teams are looking for thoughtful people.</p></div></div></div>
      <div className="job-search-bar"><Search size={18} /><input placeholder="Title, skill, or company" aria-label="Search jobs" /><span>⌖</span><input placeholder="City, state, or remote" aria-label="Job location" /><button onClick={() => onToast('Showing opportunities picked for you')}>Search</button></div>
      <h2 className="subsection-title">Recommended for you <span>Based on your profile</span></h2>
      {jobs.map((job, index) => (
        <article className="job-card" key={job.title}>
          <Avatar initials={job.initials} className={job.avatar} size="avatar-company" />
          <div className="job-details"><strong>{job.title}</strong><span>{job.company}</span><small><MapPin size={13} /> {job.place}</small><small>{job.type}</small><em>{job.match}</em></div>
          <button className={`job-apply ${applied.includes(index) ? 'job-applied' : ''}`} onClick={() => { setApplied((list) => list.includes(index) ? list : [...list, index]); onToast(`Your interest in ${job.title} was saved`); }}>
            {applied.includes(index) ? <><Check size={15} /> Saved</> : 'Easy Apply'}
          </button>
        </article>
      ))}
    </section>
  );
}

export function NotificationsView({ notifications, onMarkRead, onNavigate }) {
  return (
    <section className="card destination-view notifications-view">
      <div className="destination-heading"><div><span className="section-icon notifications-color"><Bell size={20} /></span><div><h1>Notifications</h1><p>Stay in the loop with your community.</p></div></div><button className="text-button" onClick={() => onMarkRead()}>Mark all as read</button></div>
      <div className="notification-filters"><button className="filter-selected">All</button><button>My posts</button><button>Mentions</button></div>
      {notifications.map((item) => (
        <button className={`notification-row ${item.unread ? 'notification-unread' : ''}`} key={item.id} onClick={() => { onMarkRead(item.id); onNavigate('home'); }}>
          <Avatar initials={item.initials} className={item.avatar} />
          <span className="notification-copy"><strong>{item.title}</strong><span>{item.detail}</span><small>{item.time}</small></span>
          {item.unread && <span className="unread-dot" />}
        </button>
      ))}
    </section>
  );
}

export function MessagingView({ people, conversations, onSend, initialPerson }) {
  const [selected, setSelected] = useState(() => people.find((item) => item.name === initialPerson)?.id || null);
  const [draft, setDraft] = useState('');
  const person = people.find((item) => item.id === selected);
  const messages = selected ? conversations[selected] || [] : [];
  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim() || !selected) return;
    onSend(selected, draft.trim());
    setDraft('');
  };
  return (
    <section className={`card messaging-view ${selected ? 'chat-open' : ''}`}>
      <div className="message-sidebar">
        <div className="message-title"><h1>Messaging</h1><button className="icon-button" aria-label="New message"><MessageCircle size={19} /></button></div>
        <label className="message-search"><Search size={15} /><input placeholder="Search messages" aria-label="Search messages" /></label>
        <div className="message-tabs"><button className="filter-selected">Focused</button><button>Other</button></div>
        {people.map((item) => {
          const last = (conversations[item.id] || [])[((conversations[item.id] || []).length || 1) - 1];
          return (
            <button key={item.id} className={`conversation-row ${selected === item.id ? 'conversation-selected' : ''}`} onClick={() => setSelected(item.id)}>
              <Avatar initials={item.initials} className={item.avatar} />
              <span><strong>{item.name}</strong><small>{last ? last.text : item.headline}</small></span>
            </button>
          );
        })}
      </div>
      {person ? (
        <div className="chat-panel">
          <div className="chat-header"><button className="chat-back icon-button" onClick={() => setSelected(null)} aria-label="Back to messages"><ArrowLeft size={18} /></button><Avatar initials={person.initials} className={person.avatar} size="avatar-small" /><span><strong>{person.name}</strong><small>{person.headline}</small></span><button className="icon-button" aria-label="More conversation options">···</button></div>
          <div className="chat-history">
            <div className="chat-intro"><Avatar initials={person.initials} className={person.avatar} /><strong>{person.name}</strong><span>{person.headline}</span><small>You're connected on Connectly</small></div>
            {messages.length === 0 ? <p className="chat-empty">This is the beginning of your conversation with {person.name}.</p> : messages.map((message, index) => (
              <div className="message-bubble" key={`${selected}-${index}`}><small>{message.time}</small><p>{message.text}</p></div>
            ))}
          </div>
          <form className="chat-compose" onSubmit={submit}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." aria-label="Write a message" rows="2" /><div><span>Press Enter to send</span><button type="submit" disabled={!draft.trim()}><Send size={15} /> Send</button></div></form>
        </div>
      ) : <div className="chat-placeholder"><MessageCircle size={28} /><strong>Your messages</strong><span>Select a conversation to start chatting.</span></div>}
    </section>
  );
}
