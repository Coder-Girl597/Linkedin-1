import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownWideNarrow, ChevronDown, FileText, Image, Sparkles, Video, X,
} from 'lucide-react';
import FeedPost from './components/FeedPost.jsx';
import NavBar from './components/NavBar.jsx';
import Avatar from './components/Avatar.jsx';
import { LeftSidebar, RightSidebar } from './components/Sidebars.jsx';
import { JobsView, MessagingView, NetworkView, NotificationsView } from './components/Views.jsx';
import ProfileView from './components/ProfileView.jsx';
import { currentUser, initialPosts, people } from './data.js';
import { deleteAttachment, getAttachment, saveAttachment } from './attachmentStorage.js';

const STORAGE_KEY = 'connectly-demo-v1';

function readSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('Connectly could not read saved demo data.', error);
    return {};
  }
}

const stored = readSavedState();

function getInitial(key, fallback) {
  return stored[key] ?? fallback;
}

function ComposePost({ onPublish, onError, user }) {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentKind, setAttachmentKind] = useState('photo');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const canPublish = Boolean(text.trim() || attachment) && !uploading;

  const openFilePicker = (kind) => {
    setAttachmentKind(kind);
    if (inputRef.current) {
      inputRef.current.accept = kind === 'photo' ? 'image/*' : kind === 'video' ? 'video/*' : '.pdf,.doc,.docx,.ppt,.pptx,.txt';
      inputRef.current.click();
    }
  };

  const publish = () => {
    if (!canPublish) return;
    onPublish(text.trim(), attachment);
    setText('');
    setAttachment(null);
  };

  const clearAttachment = () => {
    if (!attachment) return;
    URL.revokeObjectURL(attachment.previewUrl);
    setAttachment(null);
    deleteAttachment(attachment.id).catch((error) => {
      console.error('Connectly could not remove the selected attachment.', error);
      onError('Could not remove the selected attachment from browser storage.');
    });
  };

  const handleFileChange = async (event) => {
    const file = event.currentTarget.files?.[0];
    const input = event.currentTarget;
    if (!file) return;

    let id;
    let previewUrl;
    setUploading(true);
    try {
      id = crypto.randomUUID();
      previewUrl = URL.createObjectURL(file);
      await saveAttachment(id, file);

      if (attachment) {
        URL.revokeObjectURL(attachment.previewUrl);
        deleteAttachment(attachment.id).catch((error) => {
          console.error('Connectly could not replace the previous attachment.', error);
          onError('Could not remove the previous attachment from browser storage.');
        });
      }
      setAttachment({
        id,
        kind: attachmentKind,
        name: file.name,
        type: file.type,
        size: file.size,
        previewUrl,
      });
    } catch (error) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (id) {
        deleteAttachment(id).catch((cleanupError) => {
          console.error('Connectly could not clean up an incomplete attachment.', cleanupError);
        });
      }
      console.error('Connectly could not save the selected attachment.', error);
      onError('Could not attach that file. Please try again.');
    } finally {
      setUploading(false);
      input.value = '';
    }
  };

  return (
    <section className="card composer">
      <div className="composer-top">
        <Avatar initials={user.initials} className={user.avatar} />
        <button className="composer-prompt" onClick={() => document.getElementById('post-text')?.focus()}>Share an idea with your network...</button>
      </div>
      <textarea id="post-text" value={text} onChange={(event) => setText(event.target.value)} placeholder="What have you been working on?" aria-label="Write a post" rows="2" />
      {attachment && (
        <div className="selected-attachment"><FileText size={16} /><span>{attachment.name}</span><button onClick={clearAttachment} disabled={uploading} aria-label="Remove attachment"><X size={15} /></button></div>
      )}
      <input ref={inputRef} className="visually-hidden" type="file" onChange={handleFileChange} />
      <div className="composer-bottom">
        <div className="composer-tools">
          <button onClick={() => openFilePicker('photo')} disabled={uploading}><Image size={19} className="photo-tool" /><span>Photo</span></button>
          <button onClick={() => openFilePicker('video')} disabled={uploading}><Video size={19} className="video-tool" /><span>Video</span></button>
          <button onClick={() => openFilePicker('document')} disabled={uploading}><FileText size={19} className="document-tool" /><span>Document</span></button>
        </div>
        <button className="publish-button" onClick={publish} disabled={!canPublish}>{uploading ? 'Uploading…' : 'Post'}</button>
      </div>
    </section>
  );
}

function EmptyFeed({ query, savedOnly }) {
  return (
    <div className="card empty-feed">
      <span className="empty-icon"><Sparkles size={24} /></span>
      <h2>{savedOnly ? 'No saved posts yet' : query ? 'No posts found' : 'Your feed is all caught up'}</h2>
      <p>{savedOnly ? 'Save posts you want to come back to and they’ll show up here.' : query ? 'Try another name or keyword to find a conversation.' : 'Follow a few people or share an idea to get things started.'}</p>
    </div>
  );
}

function PeopleSearchResults({ peopleResults, following, onFollow }) {
  if (!peopleResults.length) return null;
  return (
    <section className="card people-search-results" aria-label="People search results">
      <h2>People</h2>
      {peopleResults.map((person) => (
        <div className="people-result" key={person.id}>
          <Avatar initials={person.initials} className={person.avatar} size="avatar-small" />
          <span><strong>{person.name}</strong><small>{person.headline}</small></span>
          <button
            className={`connect-button ${following.includes(person.id) ? 'connect-button-following' : ''}`}
            onClick={() => onFollow(person.id)}
          >
            {following.includes(person.id) ? 'Following' : 'Follow'}
          </button>
        </div>
      ))}
    </section>
  );
}

export default function App() {
  const [posts, setPosts] = useState(() => {
    const savedPosts = getInitial('posts', initialPosts);
    if (!Array.isArray(savedPosts)) return initialPosts;
    const savedIds = new Set(savedPosts.map((post) => post.id));
    return [...savedPosts, ...initialPosts.filter((post) => !savedIds.has(post.id))];
  });
  const [following, setFollowing] = useState(() => getInitial('following', ['maya']));
  const [conversations, setConversations] = useState(() => getInitial('conversations', {}));
  const [notifications, setNotifications] = useState(() => getInitial('notifications', [
    { id: 'n1', initials: 'MC', avatar: 'avatar-lilac', title: 'Maya Chen and 4 others reacted to your comment.', detail: 'Keep sharing your perspective with your network.', time: '1h', unread: true },
    { id: 'n2', initials: 'JO', avatar: 'avatar-green', title: 'James Okafor mentioned you in a post.', detail: '“Great point, Alex — this is exactly what we’re exploring.”', time: '3h', unread: true },
    { id: 'n3', initials: 'SR', avatar: 'avatar-coral', title: 'Sofia Reyes is celebrating a work anniversary.', detail: 'Send a note to celebrate this milestone.', time: 'Yesterday', unread: false },
  ]));
  const [activeTab, setActiveTab] = useState('home');
  const [query, setQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [toast, setToast] = useState('');
  const [messageTarget, setMessageTarget] = useState('');
  const toastTimer = useRef(null);
  const [mediaUrls, setMediaUrls] = useState({});
  const mediaUrlsRef = useRef(new Map());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts, following, conversations, notifications }));
    } catch (error) {
      console.error('Connectly could not persist demo data.', error);
      showToast('Could not save your changes in this browser.');
    }
  }, [posts, following, conversations, notifications]);

  useEffect(() => {
    const openSaved = () => {
      setSavedOnly(true);
      setQuery('');
      setActiveTab('home');
    };
    window.addEventListener('connectly:saved', openSaved);
    return () => window.removeEventListener('connectly:saved', openSaved);
  }, []);

  useEffect(() => {
    let active = true;
    const attachments = [...new Map(
      posts
        .filter((post) => post.attachment?.id)
        .map((post) => [post.attachment.id, post.attachment]),
    ).values()];

    Promise.all(attachments.map(async (attachment) => ({
      id: attachment.id,
      file: await getAttachment(attachment.id),
    })))
      .then((storedAttachments) => {
        if (!active) return;
        const restoredUrls = {};
        storedAttachments.forEach(({ id, file }) => {
          if (!file || mediaUrlsRef.current.has(id)) return;
          const url = URL.createObjectURL(file);
          mediaUrlsRef.current.set(id, url);
          restoredUrls[id] = url;
        });
        if (Object.keys(restoredUrls).length) {
          setMediaUrls((current) => ({ ...current, ...restoredUrls }));
        }
      })
      .catch((error) => {
        if (!active) return;
        console.error('Connectly could not restore post attachments.', error);
        showToast('Could not load some saved post attachments.');
      });

    return () => {
      active = false;
      mediaUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      mediaUrlsRef.current.clear();
    };
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2800);
  }

  const unreadCount = notifications.filter((item) => item.unread).length;
  const savedCount = posts.filter((post) => post.saved).length;
  const visiblePosts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...posts]
      .filter((post) => !post.hidden)
      .filter((post) => !savedOnly || post.saved)
      .filter((post) => !normalized || `${post.author.name} ${post.author.headline} ${post.content} ${post.attachment?.name || ''}`.toLowerCase().includes(normalized));
  }, [posts, query, savedOnly]);
  const peopleResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? people.filter((person) => `${person.name} ${person.headline}`.toLowerCase().includes(normalized))
      : [];
  }, [query]);

  function navigate(tab) {
    setActiveTab(tab);
    if (tab !== 'home') setSavedOnly(false);
  }

  function publishPost(content, attachment) {
    const savedAttachment = attachment && {
      id: attachment.id,
      kind: attachment.kind,
      name: attachment.name,
      type: attachment.type,
      size: attachment.size,
    };
    if (attachment?.previewUrl) {
      mediaUrlsRef.current.set(attachment.id, attachment.previewUrl);
      setMediaUrls((current) => ({ ...current, [attachment.id]: attachment.previewUrl }));
    }
    const newPost = {
      id: `post-${Date.now()}`,
      author: { name: currentUser.name, headline: currentUser.headline, initials: currentUser.initials, avatar: currentUser.avatar },
      time: 'now',
      content,
      attachment: savedAttachment,
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
      commentsList: [],
    };
    setPosts((list) => [newPost, ...list]);
    setSavedOnly(false);
    showToast('Your post is now live.');
  }

  function toggleLike(id) {
    setPosts((list) => list.map((post) => post.id === id
      ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
      : post));
  }

  function addComment(id, text) {
    setPosts((list) => list.map((post) => post.id === id
      ? { ...post, comments: post.comments + 1, commentsList: [...(post.commentsList || []), { author: currentUser.name, initials: currentUser.initials, avatar: currentUser.avatar, text }] }
      : post));
  }

  function toggleSave(id) {
    const post = posts.find((item) => item.id === id);
    setPosts((list) => list.map((item) => item.id === id ? { ...item, saved: !item.saved } : item));
    showToast(post?.saved ? 'Post removed from saved items.' : 'Post saved for later.');
  }

  function hidePost(id) {
    setPosts((list) => list.map((post) => post.id === id ? { ...post, hidden: true } : post));
    showToast('Post hidden from your feed.');
  }

  function repost(id) {
    const original = posts.find((post) => post.id === id);
    if (!original) return;
    setPosts((list) => [{
      id: `repost-${Date.now()}`,
      author: { name: currentUser.name, headline: currentUser.headline, initials: currentUser.initials, avatar: currentUser.avatar },
      repostedBy: currentUser.name,
      time: 'now',
      content: '',
      repostOf: { author: original.author, content: original.content },
      likes: 0,
      comments: 0,
      liked: false,
      saved: false,
      commentsList: [],
    }, ...list]);
    setSavedOnly(false);
    showToast('Reposted to your network.');
  }

  function startMessage(name) {
    setMessageTarget(name);
    setActiveTab('messaging');
    setSavedOnly(false);
  }

  function sendMessage(personId, text) {
    setConversations((existing) => ({
      ...existing,
      [personId]: [...(existing[personId] || []), { text, time: 'Just now' }],
    }));
    showToast('Message sent.');
  }

  function handleProfileAction(action) {
    if (action === 'profile') {
      setActiveTab('profile');
      setSavedOnly(false);
      setQuery('');
    }
    else if (action === 'settings') showToast('Settings are ready for your account.');
    else showToast('You’re signed in to this local demo.');
  }

  const markRead = (id) => setNotifications((list) => list.map((item) => id ? (item.id === id ? { ...item, unread: false } : item) : { ...item, unread: false }));

  return (
    <div className="app-shell min-h-screen">
      <NavBar
        activeTab={activeTab}
        onNavigate={navigate}
        query={query}
        onSearch={(value) => { setQuery(value); setSavedOnly(false); }}
        user={currentUser}
        unreadCount={unreadCount}
        onProfileAction={handleProfileAction}
      />
      <main className={`page-layout ${activeTab !== 'home' ? 'single-view-layout' : ''}`}>
        {activeTab === 'home' ? (
          <>
            <LeftSidebar onOpenProfile={() => handleProfileAction('profile')} savedCount={savedCount} />
            <section className="feed-column" aria-label="Your feed">
              {savedOnly ? (
                <div className="feed-heading saved-heading"><div><h1>Saved items</h1><p>Your collection of posts to revisit.</p></div><button onClick={() => setSavedOnly(false)}>Back to feed <ArrowRight size={15} /></button></div>
              ) : (
                <div className="feed-heading"><div><h1>Your community, in the know.</h1><p>Ideas and people worth your time.</p></div><button className="feed-sort" onClick={() => showToast('Your feed is sorted by most relevant')}><ArrowDownWideNarrow size={15} /> <span>Top</span> <ChevronDown size={14} /></button></div>
              )}
              {!savedOnly && <ComposePost onPublish={publishPost} onError={showToast} user={currentUser} />}
              {query && <div className="search-results-label">Showing posts matching <strong>“{query}”</strong> <button onClick={() => setQuery('')}>Clear</button></div>}
              <div className="feed-list">
                {visiblePosts.map((post) => (
                  <FeedPost
                    key={post.id}
                    post={post}
                    mediaUrl={mediaUrls[post.attachment?.id]}
                    user={currentUser}
                    onLike={toggleLike}
                    onComment={addComment}
                    onRepost={repost}
                    onSave={toggleSave}
                    onMessage={startMessage}
                    onReport={hidePost}
                  />
                ))}
                {query && <PeopleSearchResults
                  peopleResults={peopleResults}
                  following={following}
                  onFollow={(id) => setFollowing((list) => list.includes(id) ? list.filter((item) => item !== id) : [...list, id])}
                />}
                {visiblePosts.length === 0 && <EmptyFeed query={query} savedOnly={savedOnly} />}
              </div>
            </section>
            <RightSidebar
              people={people}
              following={following}
              onFollow={(id) => setFollowing((list) => list.includes(id) ? list.filter((item) => item !== id) : [...list, id])}
              onSeeAll={(item) => showToast(`${item} will be refreshed for you.`)}
            />
          </>
        ) : activeTab === 'profile' ? (
          <section className="full-destination profile-destination">
            <ProfileView
              user={currentUser}
              posts={posts}
              mediaUrls={mediaUrls}
              onBack={() => { setActiveTab('home'); setSavedOnly(false); setQuery(''); }}
              onLike={toggleLike}
              onComment={addComment}
              onRepost={repost}
              onSave={toggleSave}
              onMessage={startMessage}
              onHide={hidePost}
              onToast={showToast}
            />
          </section>
        ) : (
          <section className="full-destination">
            {activeTab === 'network' && <NetworkView people={people} following={following} onFollow={(id) => setFollowing((list) => list.includes(id) ? list.filter((item) => item !== id) : [...list, id])} />}
            {activeTab === 'jobs' && <JobsView onToast={showToast} />}
            {activeTab === 'notifications' && <NotificationsView notifications={notifications} onMarkRead={markRead} onNavigate={navigate} />}
            {activeTab === 'messaging' && <MessagingView people={people} conversations={conversations} onSend={sendMessage} initialPerson={messageTarget} />}
          </section>
        )}
      </main>
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </div>
  );
}
