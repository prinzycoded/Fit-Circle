import React, { useState } from "react";
import {
  MessageCircle,
  MoreVertical,
  Send,
  Repeat2,
  Bookmark,
  PenSquare,
  Image,
  X
} from "lucide-react";

import { motion } from "motion/react";
import HypeButton from "./HypeButton";

const PostCard = ({ post, currentUser, commentText, onCommentChange, onAddComment, onToggleLike, onReshare }) => {
  const getCategoryStyle = (type) => {
    switch (type) {
      case "Workout": return { bg: "bg-theme-accent-light", text: "text-theme-accent" };
      case "Challenge": return { bg: "bg-theme-warning-light", text: "text-theme-warning" };
      case "Milestone": return { bg: "bg-theme-success-light", text: "text-theme-success" };
      case "Nutrition": return { bg: "bg-theme-support-light", text: "text-theme-support" };
      case "Announcement": return { bg: "bg-theme-accent-light", text: "text-theme-accent" };
      default: return { bg: "bg-theme-border/50", text: "text-theme-muted" };
    }
  };

  const gradientStyles = {
    "Workout": { background: 'linear-gradient(135deg, #D95C42 0%, #e07b5e 100%)' },
    "Challenge": { background: 'linear-gradient(135deg, #3D6B8C 0%, #5a8aa5 100%)' },
    "Milestone": { background: 'linear-gradient(135deg, #1D202B 0%, #3a3f4a 100%)' },
    "Nutrition": { background: 'linear-gradient(135deg, #3D6B8C 0%, #2e4f63 100%)' },
    "Announcement": { background: 'linear-gradient(135deg, #D95C42 0%, #1D202B 100%)' },
  };

  const categoryStyle = getCategoryStyle(post.type);
  const headerGradient = gradientStyles[post.type] || gradientStyles.Milestone;

  return (
    <div className="card p-0 overflow-hidden card-hover">
      <div className="px-5 py-3 text-white flex justify-between items-center" style={headerGradient}>
        <div className="flex items-center gap-3">
          <img referrerPolicy="no-referrer" src={post.avatar} alt="" className="w-9 h-9 rounded-full border-2 border-white/30 shadow-sm" />
          <div>
            <p className="text-sm font-display font-bold leading-tight">{post.name}</p>
            <p className="text-[10px] text-white/70 font-medium">{post.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-display font-extrabold px-2 py-1 rounded-md backdrop-blur-sm ${categoryStyle.text} ${categoryStyle.bg}`}>
            {post.type}
          </span>
          <button className="text-white/60 hover:text-white cursor-pointer">
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-sm font-body text-theme-primary leading-relaxed">{post.content}</p>
        {post.metrics && (
          <div className="mt-3 flex gap-3 flex-wrap">
            {Object.entries(post.metrics).map(([key, val]) => (
              <div key={key} className="bg-theme-border/30 rounded-xl px-2.5 py-1 inline-flex items-center gap-1">
                <span className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider">{key}</span>
                <span className="text-xs font-bold text-theme-primary">{val}k</span>
              </div>
            ))}
          </div>
        )}
        {post.image && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-theme-border">
            <img referrerPolicy="no-referrer" src={post.image} alt="Post visual" className="w-full h-40 sm:h-48 object-cover" />
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-theme-border flex items-center justify-between">
        <div className="flex items-center gap-4 text-theme-muted text-xs">
          <HypeButton
            liked={post.hasLiked}
            count={post.likes}
            onToggle={() => onToggleLike(post.id)}
          />
          <div className="flex items-center gap-1.5">
            <MessageCircle size={14} />
            <span className="font-bold">{post.comments?.length || 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onReshare(post.id)}
            className="p-1.5 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-theme-border/30 transition-colors cursor-pointer"
          >
            <Repeat2 size={15} />
          </button>
          <button className="p-1.5 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-theme-border/30 transition-colors cursor-pointer">
            <Bookmark size={15} />
          </button>
        </div>
      </div>

      {post.comments && post.comments.length > 0 && (
        <div className="px-5 py-3 border-t border-theme-border bg-theme-bg/[0.02] space-y-3">
          {post.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <img referrerPolicy="no-referrer" src={c.avatar} alt="" className="w-6 h-6 rounded-full mt-0.5 border border-theme-border" />
              <div className="flex-1">
                <p className="text-xs font-display font-bold text-theme-primary">{c.name}</p>
                <p className="text-[12px] font-body text-theme-secondary leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 py-3 border-t border-theme-border bg-theme-border/10">
        <div className="flex items-center gap-2">
          <img referrerPolicy="no-referrer" src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full border border-theme-border" />
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText || ""}
            onChange={(e) => onCommentChange(post.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && commentText?.trim()) {
                onAddComment(post.id, commentText);
                onCommentChange(post.id, "");
              }
            }}
            className="flex-1 bg-transparent border-none text-xs font-body text-theme-primary placeholder-theme-muted focus:outline-none"
          />
          <button
            onClick={() => {
              if (commentText?.trim()) {
                onAddComment(post.id, commentText);
                onCommentChange(post.id, "");
              }
            }}
            className="text-theme-accent hover:text-theme-accent-hover cursor-pointer"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SocialHub({ 
  feed, 
  currentUser, 
  onAddComment,
  onToggleLike,
  onReshare,
  onCreatePost
}) {
  const [commentTexts, setCommentTexts] = useState({});
  const [activeFilter, setActiveFilter] = useState("All");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("Milestone");
  const [postImage, setPostImage] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const postTypes = ["Workout", "Challenge", "Milestone", "Nutrition"];

  const handleSubmitPost = () => {
    if (!postContent.trim()) return;
    onCreatePost(postContent.trim(), postType, postImage.trim() || null);
    setPostContent("");
    setPostType("Milestone");
    setPostImage("");
    setShowImageInput(false);
  };

  const handleCommentChange = (postId, value) => {
    setCommentTexts(prev => ({ ...prev, [postId]: value }));
  };

  const categories = ["All", "Announcement", "Workout", "Challenge", "Milestone", "Nutrition"];

  const normalizePost = (p) => ({
    ...p,
    type: p.type || "Workout",
    avatar: p.avatar || p.authorAvatar,
    name: p.name || p.authorName,
    time: p.time || p.timestamp,
    hasLiked: p.hasLiked ?? false,
    likes: p.likes ?? 0,
    metrics: p.metrics || (p.workout ? { [p.workout.type]: `${p.workout.duration}min` } : {}),
    comments: (p.comments || []).map(c => ({
      ...c,
      avatar: c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      name: c.name || c.authorName,
      text: c.text || c.content,
    })),
  });

  const filteredPosts = (activeFilter === "All" ? [...feed] : feed.filter(p => p.type === activeFilter))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    .map(normalizePost);

  return (
    <div id="social-hub-section" className="space-y-6">

      {/* Create Post Card */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <img referrerPolicy="no-referrer" src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-theme-border shrink-0" />
          <div className="flex-1 min-w-0 space-y-3">
            <textarea
              placeholder="What's on your mind? Share your fitness journey..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={2}
              className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-4 py-3 text-sm font-body text-theme-primary placeholder-theme-muted resize-none focus:outline-none focus:border-theme-accent transition-colors"
            />

            {/* Type selector pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider">Type:</span>
              {postTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPostType(type)}
                  className={`px-3 py-1.5 text-[10px] font-display font-bold rounded-xl transition-all cursor-pointer ${
                    postType === type
                      ? "bg-theme-accent text-white shadow-sm"
                      : "bg-theme-border/30 text-theme-secondary hover:bg-theme-border/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Optional image URL */}
            {showImageInput && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  className="flex-1 bg-theme-border/20 border border-theme-border rounded-xl px-4 py-2 text-xs font-body text-theme-primary placeholder-theme-muted focus:outline-none focus:border-theme-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => { setShowImageInput(false); setPostImage(""); }}
                  className="p-2 text-theme-muted hover:text-theme-primary cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Actions row */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-bold transition-all cursor-pointer ${
                  showImageInput
                    ? "bg-theme-accent-light text-theme-accent"
                    : "text-theme-muted hover:text-theme-primary hover:bg-theme-border/30"
                }`}
              >
                <Image size={14} />
                Photo
              </button>
              <button
                type="button"
                onClick={handleSubmitPost}
                disabled={!postContent.trim()}
                className="px-5 py-2 bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-display font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <PenSquare size={14} />
                Share Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="p-2.5 bg-theme-accent-light text-theme-accent rounded-xl">
            <MessageCircle size={20} />
          </div>
          <div>
            <h2 className="text-base font-display font-extrabold text-theme-primary tracking-tight">Social Feed</h2>
            <p className="text-xs text-theme-secondary font-body">Share workouts, react, and stay connected</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap md:flex-wrap justify-center pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 text-xs font-display font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === cat
                  ? "bg-theme-accent text-white"
                  : "bg-theme-border/30 text-theme-secondary hover:bg-theme-border/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div id="social-feed" className="space-y-5">
        {filteredPosts.length === 0 && (
          <div className="card text-center py-10">
            <MessageCircle size={32} className="mx-auto text-theme-muted mb-3" />
            <p className="text-sm font-bold text-theme-secondary">No posts in this category yet.</p>
            <p className="text-xs text-theme-muted mt-1">Check back after your next workout.</p>
          </div>
        )}
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            commentText={commentTexts[post.id] || ""}
            onCommentChange={handleCommentChange}
            onAddComment={onAddComment}
            onToggleLike={onToggleLike}
            onReshare={onReshare}
          />
        ))}
      </div>

    </div>
  );
}
