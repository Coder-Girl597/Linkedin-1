import { useState } from 'react';
import {
  Bookmark, Check, Ellipsis, FileText, Image, MessageSquare,
  Repeat2, Send, ThumbsUp, Video, X,
} from 'lucide-react';
import Avatar from './Avatar.jsx';

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FeedPost({ post, mediaUrl, user, onLike, onComment, onRepost, onSave, onMessage, onReport }) {
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
        post.attachment.kind === 'photo' && mediaUrl ? (
          <img className="post-uploaded-media" src={mediaUrl} alt={`Photo attachment: ${post.attachment.name}`} loading="lazy" />
        ) : post.attachment.kind === 'video' && mediaUrl ? (
          <video className="post-uploaded-media post-uploaded-video" src={mediaUrl} controls playsInline preload="metadata" aria-label={`Video attachment: ${post.attachment.name}`} />
        ) : (
          <div className={`attachment-preview attachment-${post.attachment.kind}`}>
            {post.attachment.kind === 'document' && mediaUrl && (post.attachment.type === 'application/pdf' || post.attachment.name.toLowerCase().endsWith('.pdf')) && (
              <iframe className="post-document-preview" src={mediaUrl} title={`Preview of ${post.attachment.name}`} loading="lazy" />
            )}
            <div className={`attachment-tile attachment-${post.attachment.kind}`}>
              {post.attachment.kind === 'video' ? <Video size={28} /> : post.attachment.kind === 'document' ? <FileText size={28} /> : <Image size={28} />}
              <span>
                <strong>{post.attachment.name}</strong>
                <small>
                  {mediaUrl
                    ? `${post.attachment.kind === 'document' ? 'Document' : post.attachment.kind === 'video' ? 'Video' : 'Photo'} attachment${formatFileSize(post.attachment.size) ? ` · ${formatFileSize(post.attachment.size)}` : ''}`
                    : 'Preview unavailable'}
                </small>
              </span>
              {mediaUrl && post.attachment.kind === 'document' && (
                <div className="attachment-document-actions">
                  <a href={mediaUrl} target="_blank" rel="noreferrer">Open</a>
                  <a href={mediaUrl} download={post.attachment.name}>Download</a>
                </div>
              )}
              {mediaUrl && post.attachment.kind !== 'document' && (
                <a className="attachment-download" href={mediaUrl} download={post.attachment.name}>Download</a>
              )}
            </div>
          </div>
        )
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
