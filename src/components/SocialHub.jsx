import React, { useState } from "react";
import {
  MessageCircle,
  ThumbsUp,
  MoreVertical,
  Send,
  Repeat2,
  Bookmark
} from "lucide-react";

import { motion } from "motion/react";

export default function SocialHub({ 
  feed, 
  currentUser, 
  onAddComment,
  onToggleLike,
  onReshare
}) {
  const [newComment, setNewComment] = useState({});
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Workout", "Challenge", "Milestone", "Nutrition"];

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

  const filteredPosts = (activeFilter === "All" ? feed : feed.filter(p => p.type === activeFilter)).map(normalizePost);

  const PostContent = ({ post }) => {
    const getCategoryStyle = (type) => {
      switch (type) {
        case "Workout": return { bg: "bg-theme-accent-light", text: "text-theme-accent" };
        case "Challenge": return { bg: "bg-theme-warning-light", text: "text-theme-warning" };
        case "Milestone": return { bg: "bg-theme-success-light", text: "text-theme-success" };
        case "Nutrition": return { bg: "bg-theme-support-light", text: "text-theme-support" };
        default: return { bg: "bg-theme-border/50", text: "text-theme-muted" };
      }
    };

    const gradientStyles = {
      "Workout": { background: 'linear-gradient(135deg, #D95C42 0%, #e07b5e 100%)' },
      "Challenge": { background: 'linear-gradient(135deg, #3D6B8C 0%, #5a8aa5 100%)' },
      "Milestone": { background: 'linear-gradient(135deg, #1D202B 0%, #3a3f4a 100%)' },
      "Nutrition": { background: 'linear-gradient(135deg, #3D6B8C 0%, #2e4f63 100%)' },
    };

    const categoryStyle = getCategoryStyle(post.type);
    const headerGradient = gradientStyles[post.type] || gradientStyles.Milestone;

    return (
      <div className="card p-0 overflow-hidden card-hover">
        {/* Header gradient */}
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

        {/* Body */}
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
              <img referrerPolicy="no-referrer" src={post.image} alt="Post visual" className="w-full h-48 object-cover" />
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="px-5 py-3 border-t border-theme-border flex items-center justify-between">
          <div className="flex items-center gap-4 text-theme-muted text-xs">
            <button
              onClick={() => onToggleLike(post.id)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${post.hasLiked ? 'text-theme-accent' : 'hover:text-theme-primary'}`}
            >
              <ThumbsUp size={14} className={post.hasLiked ? 'fill-current' : ''} />
              <span className="font-bold">{post.likes}</span>
            </button>
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

        {/* Comments */}
        {post.comments && post.comments.length > 0 && (
          <div className="px-5 py-3 border-t border-theme-border bg-theme-bg/[0.02] space-y-3">
            {post.comments.map((c, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <img referrerPolicy="no-referrer" src={c.avatar} alt="" className="w-6 h-6 rounded-full mt-0.5 border border-theme-border" />
                <div className="flex-1">
                  <p className="text-xs font-display font-bold text-theme-primary">{c.name}</p>
                  <p className="text-[12px] font-body text-theme-secondary leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment input */}
        <div className="px-5 py-3 border-t border-theme-border bg-theme-border/10">
          <div className="flex items-center gap-2">
            <img referrerPolicy="no-referrer" src={currentUser.avatar} alt="" className="w-7 h-7 rounded-full border border-theme-border" />
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment[post.id] || ""}
              onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newComment[post.id]?.trim()) {
                  onAddComment(post.id, newComment[post.id]);
                  setNewComment({ ...newComment, [post.id]: "" });
                }
              }}
              className="flex-1 bg-transparent border-none text-xs font-body text-theme-primary placeholder-theme-muted focus:outline-none"
            />
            <button
              onClick={() => {
                if (newComment[post.id]?.trim()) {
                  onAddComment(post.id, newComment[post.id]);
                  setNewComment({ ...newComment, [post.id]: "" });
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

  return (
    <div id="social-hub-section" className="space-y-6">

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

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
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
          <PostContent key={post.id} post={post} />
        ))}
      </div>

    </div>
  );
}
