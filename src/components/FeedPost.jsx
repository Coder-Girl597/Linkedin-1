import { useState } from 'react';
import {
  Bookmark, Check, Ellipsis, FileText, Image, MessageSquare,
  Repeat2, Send, ThumbsUp, Video, X,
} from 'lucide-react';
import Avatar from './Avatar.jsx';

export default function FeedPost({ post, user, onLike, onComment, onRepost, onSave, onMessage, onReport }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const submitComment = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    onComment(post.id, text);
    setCommentText('');
    setCommentsOpen(true);
  };

  return (
    <article className="card feed-post">
      {post.repostedBy && (
        <div className="repost-by"><Repeat2 size={14} /> {post.repostedBy} reposted</div>
      )}
      <div className="post-header">
        <Avatar initials={post.author.initials} className={post.author.avatar} />
        <div className="post-author">
          <strong>{post.author.name}</strong>
          <span>{post.author.headline}</span>
          <small>{post.time} <span>·</span> <span aria-label="Visible to everyone">◎</span></small>
        </div>
        <div className="post-menu-wrap">
          <button className="icon-button post-menu-trigger" onClick={() => setMenuOpen((open) => !open)} aria-label="Post options" aria-expanded={menuOpen}>
            <Ellipsis size={21} />
          </button>
          {menuOpen && (
            <div className="post-menu">
              <button onClick={() => { onSave(post.id); setMenuOpen(false); }}>
                {post.saved ? <Check size={16} /> : <Bookmark size={16} />}
                {post.saved ? 'Remove from saved' : 'Save post'}
              </button>
              <button onClick={() => { onReport(post.id); setMenuOpen(false); }}>Hide post</button>
            </div>
          )}
        </div>
      </div>
      <p className="post-copy">{post.content}</p>
      {post.attachment && (
        <div className={`attachment-tile attachment-${post.attachment.kind}`}>
          {post.attachment.kind === 'video' ? <Video size={28} /> : post.attachment.kind === 'document' ? <FileText size={28} /> : <Image size={28} />}
          <span><strong>{post.attachment.name}</strong><small>{post.attachment.kind === 'document' ? 'Document attachment' : `${post.attachment.kind[0].toUpperCase()}${post.attachment.kind.slice(1)} attachment`}</small></span>
        </div>
      )}
      {post.image && (
        <div className={`post-image post-image-${post.id}`}>
          <div className="post-image-shade" />
          <span className="image-caption">{post.imageLabel}</span>
          <strong>{post.image}</strong>
          <span className="image-decoration">✳</span>
        </div>
      )}
      {post.repostOf && (
        <div className="shared-post">
          <strong>{post.repostOf.author.name}</strong>
          <span>{post.repostOf.content}</span>
        </div>
      )}
      <div className="post-engagement">
        <span className="reaction-stack"><span>♥</span><span>👏</span></span>
        <span>{post.likes} reactions</span>
        <button onClick={() => setCommentsOpen((open) => !open)}>{post.comments} comments</button>
      </div>
      <div className="post-actions">
        <button className={post.liked ? 'action-liked' : ''} onClick={() => onLike(post.id)} aria-pressed={post.liked}>
          <ThumbsUp size={19} fill={post.liked ? 'currentColor' : 'none'} /> <span>{post.liked ? 'Liked' : 'Like'}</span>
        </button>
        <button onClick={() => setCommentsOpen((open) => !open)} aria-expanded={commentsOpen}>
          <MessageSquare size={19} /><span>Comment</span>
        </button>
        <button onClick={() => onRepost(post.id)}><Repeat2 size={19} /><span>Repost</span></button>
        <button onClick={() => onMessage(post.author.name)}><Send size={18} /><span>Send</span></button>
      </div>
      {commentsOpen && (
        <div className="comments-area">
          <form className="comment-composer" onSubmit={submitComment}>
            <Avatar initials={user.initials} className={user.avatar} size="avatar-small" />
            <input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." aria-label="Add a comment" />
            {commentText.trim() && <button className="comment-submit" type="submit" aria-label="Post comment"><Send size={16} /></button>}
          </form>
          {(post.commentsList || []).length === 0 ? (
            <p className="no-comments">Start the conversation.</p>
          ) : (
            <div className="comment-list">
              {(post.commentsList || []).map((comment, index) => (
                <div className="comment-row" key={`${post.id}-${index}`}>
                  <Avatar initials={comment.initials} className={comment.avatar} size="avatar-small" />
                  <div className="comment-bubble"><strong>{comment.author}</strong><p>{comment.text}</p></div>
                </div>
              ))}
            </div>
          )}
          <button className="close-comments" onClick={() => setCommentsOpen(false)}><X size={14} /> Close comments</button>
        </div>
      )}
    </article>
  );
}
