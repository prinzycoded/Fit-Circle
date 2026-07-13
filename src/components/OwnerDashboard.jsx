import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Calendar,
  Dumbbell,
  Activity,
  DollarSign,
  Target,
  Flame,
  Search,
  ChevronRight,
  Crown,
  Medal,
  MoreHorizontal,
  Eye,
  Star,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Award,
  Shield,
  Bell,
  Megaphone,
  Trash2,
  Pin,
  MessageCircle,
  ThumbsUp,
  Group,
  Timer,
  Gift,
  UserPlus,
  Send,
  ListChecks,
  Trophy,
  Swords,
  Skull,
  HeartHandshake,
  Sparkles,
  Hash,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CoachWorkoutBuilder from "./CoachWorkoutBuilder";

const MemberDetailModal = ({ member, onClose, shoutoutMember, setShoutoutMember, shoutoutReason, setShoutoutReason, onCreateShoutout }) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="card max-w-lg w-full space-y-5" onClick={e => e.stopPropagation()}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img referrerPolicy="no-referrer" src={member.avatar} alt="" className="w-14 h-14 rounded-2xl border border-theme-border" />
          <div>
            <h3 className="text-lg font-display font-extrabold text-theme-primary">{member.name}</h3>
            <p className="text-xs text-theme-muted">{member.email}</p>
            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              member.plan === "Premium" ? "bg-theme-warning-light text-theme-warning" :
              member.plan === "Standard" ? "bg-theme-support-light text-theme-support" :
              member.plan === "Basic" ? "bg-theme-border/40 text-theme-muted" :
              "bg-theme-border/20 text-theme-muted/50"
            }`}>{member.plan ? `${member.plan} Plan` : "No Plan"}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted cursor-pointer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-theme-support-light rounded-xl p-3 text-center">
          <p className="text-xl font-display font-extrabold text-theme-support">{member.points.toLocaleString()}</p>
          <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">Points</p>
        </div>
        <div className="bg-theme-warning-light rounded-xl p-3 text-center">
          <p className="text-xl font-display font-extrabold text-theme-warning">{member.streak}</p>
          <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">Streak</p>
        </div>
        <div className="bg-theme-accent-light rounded-xl p-3 text-center">
          <p className="text-xl font-display font-extrabold text-theme-accent">{member.checkInsThisMonth}</p>
          <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">Check-ins</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-display font-bold text-theme-primary uppercase tracking-wider">Today's Metrics</p>
        {[
          { label: "Steps", value: member.metrics.steps.toLocaleString(), goal: member.goals.stepGoal.toLocaleString(), pct: Math.round(member.metrics.steps / member.goals.stepGoal * 100) },
          { label: "Water", value: `${(member.metrics.water / 1000).toFixed(1)}L`, goal: `${(member.goals.waterGoal / 1000).toFixed(1)}L`, pct: Math.round(member.metrics.water / member.goals.waterGoal * 100) },
          { label: "Active Mins", value: `${member.metrics.activeMinutes}min`, goal: `${member.goals.activeMinutesGoal}min`, pct: Math.round(member.metrics.activeMinutes / member.goals.activeMinutesGoal * 100) },
        ].map(({ label, value, goal, pct }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-[10px] sm:text-xs font-medium text-theme-secondary w-16 sm:w-24">{label}</span>
            <div className="flex-1 progress-bar h-1.5">
              <div className="progress-bar-fill bg-theme-accent" style={{ width: `${Math.min(100, pct)}%` }}></div>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-theme-primary w-20 sm:w-32 text-right">{value} / {goal}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-theme-border text-xs text-theme-muted">
        <span className="flex items-center gap-1"><Calendar size={12} /> Joined {member.joined}</span>
        <span className={`flex items-center gap-1 ${member.status === "online" ? "text-theme-success" : ""}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${member.status === "online" ? "bg-theme-success" : "bg-theme-muted"}`}></span>
          {member.lastActive}
        </span>
      </div>

      {/* Shoutout action */}
      <div className="pt-3 border-t border-theme-border">
        {shoutoutMember === member.id ? (
          <div className="space-y-2">
            <textarea
              placeholder={`Why is ${member.name} awesome?`}
              value={shoutoutReason}
              onChange={(e) => setShoutoutReason(e.target.value)}
              rows={2}
              className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-3 py-2 text-xs font-body text-theme-primary placeholder-theme-muted resize-none focus:outline-none focus:border-theme-accent transition-colors"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (shoutoutReason.trim()) {
                    onCreateShoutout(member.name, member.avatar, shoutoutReason.trim());
                    setShoutoutReason("");
                    setShoutoutMember(null);
                  }
                }}
                disabled={!shoutoutReason.trim()}
                className="flex-1 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-display font-bold transition-all cursor-pointer"
              >
                Send Shoutout
              </button>
              <button
                onClick={() => { setShoutoutMember(null); setShoutoutReason(""); }}
                className="py-2 px-4 rounded-xl border border-theme-border text-xs font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShoutoutMember(member.id)}
            className="w-full py-2.5 rounded-xl bg-theme-warning-light text-theme-warning text-xs font-display font-bold hover:bg-theme-warning/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Star size={14} />
            Give Shoutout
          </button>
        )}
      </div>
    </div>
  </div>
);

export default function OwnerDashboard({ gym, members, feedPosts, challenges, accountabilityGroups, currentUser, onRemovePost, onCreateAnnouncement, onCreateShoutout, onCreateChallenge, onDeleteChallenge, onNudgeGroup, onNavigate, onAddComment, workoutPlans = [], featuredChallenge, onCreateWorkoutPlan, onAssignWorkout, onUpdateFeaturedChallenge, workoutPlanRequests = [], onClearWorkoutRequest, coachMessages = [], onSendCoachReply }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingMember, setViewingMember] = useState(null);
  const [sortBy, setSortBy] = useState("points");
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [announceContent, setAnnounceContent] = useState("");
  const [shoutoutMember, setShoutoutMember] = useState(null);
  const [shoutoutReason, setShoutoutReason] = useState("");
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeForm, setChallengeForm] = useState({
    title: "", description: "", type: "duration", targetValue: 60, metricLabel: "min", daysLeft: 7, rewardPoints: 300,
    difficulty: "medium", streakBonus: false, category: "fitness"
  });
  const [editingChallenge, setEditingChallenge] = useState(null);

  const memberRef = useRef(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [coachReplyInput, setCoachReplyInput] = useState("");
  const messagesListRef = useRef(null);

  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  }, [coachMessages]);

  const handleSendReply = () => {
    if (!coachReplyInput.trim() || !onSendCoachReply) return;
    onSendCoachReply(coachReplyInput.trim());
    setCoachReplyInput("");
  };

  const handleAdminComment = (postId) => {
    const text = (commentTexts[postId] || "").trim();
    if (text && onAddComment) {
      onAddComment(postId, text);
      setCommentTexts(prev => ({ ...prev, [postId]: "" }));
    }
  };

  // Generate activity timeline from existing data
  const [timelineActivities] = useState(() => {
    const activities = [];
    const now = Date.now();
    const hrs = (n) => `${n}h ago`;
    
    members.forEach((m, i) => {
      activities.push({
        id: `act-checkin-${m.id}`,
        memberName: m.name,
        memberAvatar: m.avatar,
        action: "checked in",
        detail: `${m.checkInsThisMonth} check-ins this month`,
        time: hrs(i + 1),
        type: "checkin",
      });
      activities.push({
        id: `act-workout-${m.id}`,
        memberName: m.name,
        memberAvatar: m.avatar,
        action: "completed a workout",
        detail: `${m.metrics.activeMinutes} min active`,
        time: hrs(i + 3),
        type: "workout",
      });
      if (m.streak >= 10) {
        activities.push({
          id: `act-streak-${m.id}`,
          memberName: m.name,
          memberAvatar: m.avatar,
          action: "hit a streak milestone",
          detail: `${m.streak} day streak!`,
          time: hrs(i + 5),
          type: "streak",
        });
      }
    });
    
    feedPosts.forEach((p, i) => {
      if (i < 5) {
        activities.push({
          id: `act-post-${p.id}`,
          memberName: p.authorName,
          memberAvatar: p.authorAvatar,
          action: "shared a post",
          detail: p.content.substring(0, 50) + (p.content.length > 50 ? "..." : ""),
          time: p.timestamp,
          type: "post",
        });
      }
    });

    return activities.sort((a, b) => {
      const aNum = parseInt(a.time) || 0;
      const bNum = parseInt(b.time) || 0;
      return aNum - bNum;
    }).slice(0, 20);
  });

  const filteredMembers = members
    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "streak") return b.streak - a.streak;
      if (sortBy === "checkIns") return b.checkInsThisMonth - a.checkInsThisMonth;
      return 0;
    });

  const stats = [
    { label: "Total Members", value: gym.totalMembers, icon: Users, color: "text-theme-support", bg: "bg-theme-support-light", change: "+12% this quarter", onClick: () => setActiveAdminSection("members") },
    { label: "Active Today", value: gym.activeToday, icon: Activity, color: "text-theme-success", bg: "bg-theme-success-light", change: `${Math.round(gym.activeToday / gym.totalMembers * 100)}% engagement`, onClick: () => setActiveAdminSection("members") },
    { label: "Avg Streak", value: `${gym.avgMemberStreak}d`, icon: Flame, color: "text-theme-warning", bg: "bg-theme-warning-light", change: "Across all members" },
    { label: "Monthly Revenue", value: `$${gym.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: "text-theme-accent", bg: "bg-theme-accent-light", change: "From membership plans" },
  ];

  const [activeAdminSection, setActiveAdminSection] = useState("overview");

  const adminTabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "members", label: "Members", icon: Users },
    { id: "challenges", label: "Challenges", icon: Zap },
    { id: "workouts", label: "Workouts", icon: Dumbbell },
    { id: "feed", label: "Feed", icon: MessageCircle },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "activity", label: "Activity", icon: TrendingUp },
    { id: "groups", label: "Groups", icon: Group },
  ];

  return (
    <div className="space-y-6">

      {/* Gym Header */}
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1D202B 0%, #D95C42 100%)' }}>
        <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center p-4">
          <Dumbbell size={140} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-display font-bold uppercase tracking-widest backdrop-blur-sm">
                Owner Dashboard
              </span>
              <span className="bg-theme-accent/70 text-white text-xs px-3 py-1 rounded-full font-display font-bold flex items-center gap-1">
                <Shield size={11} />
                Admin
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mt-1">
              {gym.name}
            </h1>
            <p className="text-white/70 text-sm mt-1 max-w-md font-body">
              Manage members, track engagement, and grow your fitness community.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 self-start md:self-auto border border-white/10">
            <img referrerPolicy="no-referrer" src={gym.ownerAvatar} alt="" className="w-10 h-10 rounded-xl border border-white/30" />
            <div>
              <p className="text-xs text-white/60 font-medium">Gym Owner</p>
              <p className="text-sm font-display font-bold text-white">{gym.ownerName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="lg:hidden overflow-x-auto flex gap-1 bg-theme-border/20 rounded-xl p-1">
        {adminTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveAdminSection(id)}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-display font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeAdminSection === id
                ? "bg-theme-surface text-theme-primary shadow-sm"
                : "text-theme-muted hover:text-theme-secondary"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Desktop layout: sidebar + content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <nav className="rounded-2xl overflow-hidden border border-theme-border bg-theme-surface/60 backdrop-blur-sm">
              {adminTabs.map(({ id, label, icon: Icon }, idx) => (
                <button
                  key={id}
                  onClick={() => setActiveAdminSection(id)}
                  className={`w-full text-left font-display font-bold text-xs py-3 px-4 transition-all flex items-center gap-3 cursor-pointer ${
                    idx > 0 ? "border-t border-theme-border/50" : ""
                  } ${
                    activeAdminSection === id
                      ? "bg-theme-accent text-white shadow-sm"
                      : "text-theme-secondary hover:text-theme-primary hover:bg-theme-border/20"
                  }`}
                >
                  <Icon size={16} className={activeAdminSection === id ? "text-white" : "text-theme-muted"} />
                  <span className="flex-1">{label}</span>
                  {activeAdminSection === id && <ChevronRight size={14} className="text-white/70" />}
                </button>
              ))}
            </nav>

            {/* Quick actions sidebar card */}
            <div className="rounded-2xl border border-theme-border bg-theme-surface/40 backdrop-blur-sm p-4 space-y-3">
              <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">Quick Actions</p>
              <button
                onClick={() => setShowAnnounceModal(true)}
                className="w-full flex items-center gap-2 py-2 px-3 rounded-xl bg-theme-accent-light text-theme-accent text-xs font-display font-bold hover:bg-theme-accent/20 transition-all cursor-pointer"
              >
                <Megaphone size={14} />
                Announcement
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">

      {/* Overview */}
      {activeAdminSection === "overview" && (
        <>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, change, onClick }) => (
          <div key={label} onClick={onClick} className={`card flex items-start gap-3 ${onClick ? "hover:bg-theme-border/20 cursor-pointer" : ""} transition-all`}>
            <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-display font-extrabold text-theme-primary">{value}</p>
              <p className="text-xs font-bold text-theme-muted uppercase tracking-wider truncate">{label}</p>
              <p className="text-[10px] text-theme-secondary mt-0.5">{change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Membership Distribution + Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-theme-accent" />
            <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Membership Distribution</h2>
          </div>
          <div className="space-y-3">
            {gym.plans.map((plan) => {
              const pct = Math.round(plan.members / gym.totalMembers * 100);
              const barColor = plan.name === "Premium" ? "bg-theme-warning" : plan.name === "Standard" ? "bg-theme-support" : "bg-theme-border";
              return (
                <div key={plan.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-display font-bold text-theme-primary">{plan.name}</span>
                    <span className="text-xs text-theme-muted">{plan.members} members · ${plan.members * plan.price}/mo</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div className={`progress-bar-fill ${barColor}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-theme-accent" />
            <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Gym Goals</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-theme-primary">Total Capacity</span>
                <span className="text-theme-muted">{gym.totalMembers} / {gym.memberGoal}</span>
              </div>
              <div className="progress-bar h-2">
                <div className="progress-bar-fill bg-theme-support" style={{ width: `${Math.round(gym.totalMembers / gym.memberGoal * 100)}%` }}></div>
              </div>
              <p className="text-[10px] text-theme-secondary mt-1">Target: {gym.memberGoal} members</p>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-theme-primary">Monthly Active</span>
                <span className="text-theme-muted">{gym.activeToday} / {gym.monthlyActiveGoal}</span>
              </div>
              <div className="progress-bar h-2">
                <div className="progress-bar-fill bg-theme-accent" style={{ width: `${Math.round(gym.activeToday / gym.monthlyActiveGoal * 100)}%` }}></div>
              </div>
              <p className="text-[10px] text-theme-secondary mt-1">Target: {gym.monthlyActiveGoal} daily active</p>
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Members */}
      {activeAdminSection === "members" && (
      <div ref={memberRef} className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-theme-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-theme-accent" />
            <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Member Management</h2>
            <span className="text-[10px] font-bold bg-theme-accent-light text-theme-accent px-2 py-0.5 rounded-full">{filteredMembers.length} active</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 bg-theme-bg border border-theme-border rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-accent"
              />
            </div>
            <div className="flex items-center gap-1 bg-theme-border/30 rounded-lg px-2 py-1.5 text-[10px] font-bold text-theme-muted">
              <BarChart3 size={12} />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent border-none text-theme-secondary font-bold text-[10px] focus:outline-none cursor-pointer"
              >
                <option value="points">Points</option>
                <option value="streak">Streak</option>
                <option value="checkIns">Check-ins</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-theme-border/50">
          {filteredMembers.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-theme-muted">No members match your search.</div>
          ) : (
            filteredMembers.map((member, idx) => (
              <div
                key={member.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-theme-border/10 transition-colors cursor-pointer"
                onClick={() => setViewingMember(member)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-display font-extrabold text-theme-muted w-5">{idx + 1}</span>
                  <img referrerPolicy="no-referrer" src={member.avatar} alt="" className="w-9 h-9 rounded-xl border border-theme-border shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-display font-bold text-theme-primary truncate">{member.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-theme-muted">
                      <span className={`inline-flex items-center gap-1 ${member.status === "online" ? "text-theme-success" : ""}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === "online" ? "bg-theme-success" : "bg-theme-muted"}`}></span>
                        {member.lastActive}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        member.plan === "Premium" ? "bg-theme-warning-light text-theme-warning" :
                        member.plan === "Standard" ? "bg-theme-support-light text-theme-support" :
                        member.plan === "Basic" ? "bg-theme-border/30 text-theme-muted" :
                        "bg-theme-border/20 text-theme-muted/50"
                      }`}>{member.plan || "No Plan"}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-display font-extrabold text-theme-primary">{member.points.toLocaleString()}</p>
                    <p className="text-[10px] text-theme-muted">pts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-display font-extrabold text-theme-warning">{member.streak}d</p>
                    <p className="text-[10px] text-theme-muted">streak</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-display font-extrabold text-theme-support">{member.checkInsThisMonth}</p>
                    <p className="text-[10px] text-theme-muted">check-ins</p>
                  </div>
                </div>
                <div className="flex sm:hidden items-center gap-2">
                  <span className="text-[9px] font-display font-bold text-theme-primary">{member.points.toLocaleString()}p</span>
                  <span className="text-[9px] font-display font-bold text-theme-warning">{member.streak}d</span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setViewingMember(member); }}
                  className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted hover:text-theme-accent transition-colors cursor-pointer"
                >
                  <Eye size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-2.5 text-center text-[10px] font-bold text-theme-muted bg-theme-border/5">
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>
      )}

      {/* Challenges */}
      {activeAdminSection === "challenges" && (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-theme-support-light text-theme-support rounded-xl">
              <Swords size={18} />
            </div>
            <div>
              <h1 className="text-xl font-display font-extrabold text-theme-primary">Challenge Arena</h1>
              <p className="text-xs text-theme-secondary">Create and manage gamified challenges for your members</p>
            </div>
          </div>
          <button
            onClick={() => setShowChallengeModal(true)}
            className="bg-theme-support hover:bg-theme-support/80 text-white text-xs font-display font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-theme-support/25 cursor-pointer"
          >
            <Zap size={14} />
            New Challenge
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Active", value: challenges.filter(c => c.createdByOwner && c.status === "active").length, icon: Flame, color: "text-theme-warning", bg: "bg-theme-warning-light" },
            { label: "Completed", value: challenges.filter(c => c.createdByOwner && c.status === "completed").length, icon: Trophy, color: "text-theme-success", bg: "bg-theme-success-light" },
            { label: "Participants", value: challenges.filter(c => c.createdByOwner).reduce((s, c) => s + (c.participants?.length || 0), 0), icon: Users, color: "text-theme-support", bg: "bg-theme-support-light" },
          ].map((stat, i) => (
            <div key={i} className="card flex items-center gap-3 px-4 py-3">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={16} />
              </div>
              <div>
                <p className="text-lg font-display font-extrabold text-theme-primary">{stat.value}</p>
                <p className="text-[10px] text-theme-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Challenge grid */}
        {challenges.filter(c => c.createdByOwner).length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card text-center py-14">
            <div className="w-16 h-16 rounded-2xl bg-theme-support-light flex items-center justify-center mx-auto mb-4">
              <Swords size={32} className="text-theme-support" />
            </div>
            <p className="text-sm font-display font-bold text-theme-primary">No challenges yet</p>
            <p className="text-xs text-theme-secondary mt-1">Create your first challenge to ignite friendly competition.</p>
            <button
              onClick={() => setShowChallengeModal(true)}
              className="mt-4 bg-theme-support hover:bg-theme-support/80 text-white text-xs font-display font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Zap size={15} />
              Create Challenge
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.filter(c => c.createdByOwner).map((challenge) => {
              const pct = challenge.targetValue > 0 ? Math.min(100, Math.round((challenge.currentValue / challenge.targetValue) * 100)) : 0;
              const participantCount = challenge.participants?.length || 0;
              const diffColors = { easy: "bg-theme-success-light text-theme-success", medium: "bg-theme-warning-light text-theme-warning", hard: "bg-theme-accent-light text-theme-accent", extreme: "bg-red-100 text-red-600" };
              const diffLabel = challenge.difficulty || "medium";
              const diffIcon = diffLabel === "easy" ? HeartHandshake : diffLabel === "hard" ? Skull : diffLabel === "extreme" ? Skull : Swords;
              const DiffIcon = diffIcon;
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card hover:shadow-lg hover:shadow-theme-support/5 transition-all overflow-hidden relative"
                >
                  {/* Difficulty stripe */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${diffLabel === "easy" ? "bg-theme-success" : diffLabel === "medium" ? "bg-theme-warning" : diffLabel === "hard" ? "bg-theme-accent" : "bg-red-500"}`} />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${diffColors[diffLabel] || diffColors.medium}`}>
                        <DiffIcon size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-display font-extrabold text-theme-primary">{challenge.title}</h3>
                        <p className="text-[10px] text-theme-muted">Created by you</p>
                      </div>
                    </div>
                  </div>

                  {challenge.description && (
                    <p className="text-[11px] text-theme-secondary mb-3 leading-relaxed">{challenge.description}</p>
                  )}

                  {/* Progress ring + stats */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative w-12 h-12 shrink-0">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--theme-border)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--theme-support)" strokeWidth="3" strokeDasharray={`${pct * 0.97} 100`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-theme-primary">{pct}%</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-theme-muted flex-wrap">
                      <span className="flex items-center gap-1"><Target size={11} />{challenge.targetValue}{challenge.metricLabel}</span>
                      <span className="flex items-center gap-1"><Users size={11} />{participantCount} joined</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{challenge.daysLeft}d left</span>
                      {challenge.streakBonus && <span className="flex items-center gap-1"><Flame size={11} className="text-theme-warning" />Streak</span>}
                    </div>
                  </div>

                  {/* Participant avatars */}
                  {participantCount > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex -space-x-2">
                        {challenge.participants.slice(0, 4).map((p, i) => (
                          <img key={i} referrerPolicy="no-referrer" src={p.avatar} alt="" className="w-6 h-6 rounded-full border-2 border-theme-surface" />
                        ))}
                      </div>
                      {participantCount > 4 && (
                        <span className="text-[9px] text-theme-muted font-bold ml-1">+{participantCount - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Difficulty badge + reward */}
                  <div className="flex items-center justify-between pt-3 border-t border-theme-border">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${diffColors[diffLabel] || diffColors.medium}`}>
                      {diffLabel}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-theme-warning">
                      <Star size={11} className="fill-theme-warning text-theme-warning" />
                      {challenge.rewardPoints} pts
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => onDeleteChallenge(challenge.id)}
                      className="flex-1 py-2 rounded-xl border border-theme-border text-[10px] font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all flex items-center justify-center gap-1 cursor-pointer hover:text-red-500"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* Workouts */}
      {activeAdminSection === "workouts" && (
      <div className="space-y-4">
        {workoutPlanRequests.filter(r => r.status === "pending").length > 0 && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 bg-theme-warning-light/50 border-b border-theme-warning/20 flex items-center gap-2">
              <Bell size={14} className="text-theme-warning" />
              <p className="text-xs font-display font-bold text-theme-primary">Pending Workout Plan Requests</p>
            </div>
            <div className="divide-y divide-theme-border/50">
              {workoutPlanRequests.filter(r => r.status === "pending").map((req) => (
                <div key={req.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-theme-warning-light flex items-center justify-center">
                      <span className="text-xs font-extrabold text-theme-warning">{req.memberName?.charAt(0) || "?"}</span>
                    </div>
                    <div>
                      <p className="text-xs font-display font-bold text-theme-primary">{req.memberName}</p>
                      <p className="text-[10px] text-theme-muted">Requested {req.requestedAt}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onClearWorkoutRequest(req.id)}
                    className="text-[10px] font-display font-bold px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white transition-all cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-theme-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListChecks size={16} className="text-theme-support" />
                <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Workout Plans</h2>
                <span className="text-[10px] font-bold bg-theme-support-light text-theme-support px-2 py-0.5 rounded-full">{workoutPlans.length} plans</span>
              </div>
            </div>
          </div>
          <div className="p-5">
            <CoachWorkoutBuilder
              members={members}
              workoutPlans={workoutPlans}
              onCreateWorkoutPlan={onCreateWorkoutPlan}
              onAssignWorkout={onAssignWorkout}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
      )}

      {/* Feed */}
      {activeAdminSection === "feed" && (
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-theme-border flex items-center gap-2">
          <MessageCircle size={16} className="text-theme-accent" />
          <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Feed Moderation</h2>
          <span className="text-[10px] font-bold bg-theme-accent-light text-theme-accent px-2 py-0.5 rounded-full">{feedPosts.length} posts</span>
        </div>
        <div className="divide-y divide-theme-border/50">
          {feedPosts.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-theme-muted">No posts yet.</div>
          ) : (
            [...feedPosts].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).slice(0, 15).map((post) => (
              <div key={post.id} className="hover:bg-theme-border/10 transition-colors">
                <div className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img referrerPolicy="no-referrer" src={post.authorAvatar} alt="" className="w-8 h-8 rounded-lg border border-theme-border shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-display font-bold text-theme-primary truncate">{post.authorName}</p>
                      <p className="text-[11px] text-theme-secondary truncate">{post.content}</p>
                      <div className="flex items-center gap-2 text-[9px] text-theme-muted mt-0.5">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${
                          post.type === "Announcement" ? "bg-theme-accent-light text-theme-accent" :
                          post.type === "Workout" ? "bg-theme-accent-light text-theme-accent" :
                          post.type === "Challenge" ? "bg-theme-warning-light text-theme-warning" :
                          post.type === "Milestone" ? "bg-theme-success-light text-theme-success" :
                          "bg-theme-border/30 text-theme-muted"
                        }`}>{post.type}</span>
                        <span>{post.timestamp}</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={9} />{post.likes}</span>
                        {post.pinned && <span className="text-theme-accent flex items-center gap-1"><Pin size={9} />Pinned</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onRemovePost(post.id)}
                      className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted hover:text-theme-accent transition-colors cursor-pointer"
                      title="Remove post"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-5 pb-3 pt-0 border-t border-theme-border/30 mx-5">
                  <img referrerPolicy="no-referrer" src={gym.ownerAvatar} alt="" className="w-6 h-6 rounded-full shrink-0 border border-theme-border" />
                  <input
                    type="text"
                    placeholder="Comment as admin..."
                    value={commentTexts[post.id] || ""}
                    onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdminComment(post.id); } }}
                    className="flex-1 bg-theme-border/10 border border-theme-border rounded-full px-3 py-1.5 text-[11px] font-body text-theme-primary placeholder-theme-muted focus:outline-none focus:border-theme-accent transition-colors"
                  />
                  <button
                    onClick={() => handleAdminComment(post.id)}
                    disabled={!(commentTexts[post.id] || "").trim()}
                    className="p-1.5 rounded-full text-theme-accent hover:bg-theme-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-5 py-2.5 text-center text-[10px] font-bold text-theme-muted bg-theme-border/5">
          Showing {Math.min(15, feedPosts.length)} of {feedPosts.length} posts
        </div>
      </div>
      )}

      {/* Messages */}
      {activeAdminSection === "messages" && (
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-theme-border flex items-center gap-2">
          <Mail size={16} className="text-theme-accent" />
          <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Private Messages</h2>
          <span className="text-[10px] font-bold bg-theme-accent-light text-theme-accent px-2 py-0.5 rounded-full">{coachMessages.filter(m => m.role === "client").length} unread</span>
        </div>

        {/* Messages list */}
        <div ref={messagesListRef} className="h-80 overflow-y-auto px-5 py-3 space-y-3 bg-theme-bg/30">
          {coachMessages.length === 0 ? (
            <div className="text-center py-12">
              <Mail size={32} className="mx-auto text-theme-muted mb-3" />
              <p className="text-sm font-display font-bold text-theme-primary">No messages yet</p>
              <p className="text-xs text-theme-muted mt-1">When members send you a private message, it will appear here.</p>
            </div>
          ) : (
            [...coachMessages].map((msg) => {
              const isFromClient = msg.role === "client";
              return (
                <div key={msg.id} className={`flex ${isFromClient ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isFromClient
                        ? "bg-theme-border/30 text-theme-primary rounded-bl-md"
                        : "bg-theme-accent text-white rounded-br-md"
                    }`}
                  >
                    {isFromClient && (
                      <p className="text-[9px] font-bold text-theme-accent mb-0.5 uppercase tracking-wider">Member</p>
                    )}
                    <p className="font-body">{msg.content}</p>
                    <p className={`text-[9px] mt-0.5 ${isFromClient ? "text-theme-muted" : "text-white/60"}`}>{msg.timestamp}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reply input */}
        <div className="flex items-center gap-2 p-3 border-t border-theme-border bg-theme-surface">
          <input
            type="text"
            placeholder="Type your reply..."
            value={coachReplyInput}
            onChange={(e) => setCoachReplyInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSendReply(); }}
            className="flex-1 bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-xs font-body text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-accent"
          />
          <button
            onClick={handleSendReply}
            disabled={!coachReplyInput.trim()}
            className="p-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all cursor-pointer"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
      )}

      {/* Activity */}
      {activeAdminSection === "activity" && (
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-theme-border flex items-center gap-2">
          <Activity size={16} className="text-theme-support" />
          <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Activity Timeline</h2>
          <span className="text-[10px] font-bold bg-theme-support-light text-theme-support px-2 py-0.5 rounded-full">Live</span>
        </div>
        <div className="divide-y divide-theme-border/50">
          {timelineActivities.map((act) => (
            <div key={act.id} className="flex items-center gap-3 px-5 py-3">
              <img referrerPolicy="no-referrer" src={act.memberAvatar} alt="" className="w-8 h-8 rounded-full border border-theme-border shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-body text-theme-primary leading-relaxed">
                  <span className="font-display font-bold">{act.memberName}</span> {act.action}
                </p>
                <p className="text-[10px] text-theme-muted">{act.detail}</p>
              </div>
              <span className="text-[10px] text-theme-muted shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Groups */}
      {activeAdminSection === "groups" && (
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-theme-border flex items-center gap-2">
          <Group size={16} className="text-theme-warning" />
          <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Group Hub</h2>
          <span className="text-[10px] font-bold bg-theme-warning-light text-theme-warning px-2 py-0.5 rounded-full">{accountabilityGroups.length} groups</span>
        </div>
        <div className="divide-y divide-theme-border/50">
          {accountabilityGroups.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-theme-muted">No groups yet.</div>
          ) : (
            accountabilityGroups.map((group) => {
              const totalMinutes = group.members.reduce((s, m) => s + m.weeklyMinutes, 0);
              const pct = group.groupChallenge ? Math.round(group.groupChallenge.current / group.groupChallenge.target * 100) : 0;
              return (
                <div key={group.id} className="px-5 py-4 hover:bg-theme-border/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-theme-warning-light text-theme-warning rounded-lg">
                        <Users size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-display font-bold text-theme-primary">{group.name}</p>
                        <p className="text-[9px] text-theme-muted">{group.members.length} members · {totalMinutes} min this week</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNudgeGroup(group.id, group.members[0]?.name)}
                      className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted hover:text-theme-accent transition-colors cursor-pointer"
                      title="Send nudge"
                    >
                      <UserPlus size={14} />
                    </button>
                  </div>
                  {group.groupChallenge && (
                    <div className="mt-2 bg-theme-border/10 rounded-xl p-3">
                      <div className="flex items-center justify-between text-[10px] mb-1.5">
                        <span className="font-bold text-theme-primary flex items-center gap-1"><Gift size={11} /> {group.groupChallenge.title}</span>
                        <span className="text-theme-muted">{group.groupChallenge.current}/{group.groupChallenge.target} {group.groupChallenge.unit}</span>
                      </div>
                      <div className="progress-bar h-1.5">
                        <div className="progress-bar-fill bg-theme-warning" style={{ width: `${Math.min(100, pct)}%` }}></div>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {group.members.map((m) => (
                      <div key={m.id} className="flex items-center gap-1 bg-theme-border/20 rounded-full pl-1 pr-2 py-0.5">
                        <img referrerPolicy="no-referrer" src={m.avatar} alt="" className="w-4 h-4 rounded-full" />
                        <span className="text-[9px] font-bold text-theme-secondary">{m.name.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="px-5 py-2.5 text-center text-[10px] font-bold text-theme-muted bg-theme-border/5">
          {accountabilityGroups.reduce((s, g) => s + g.members.length, 0)} total members across all groups
        </div>
      </div>
      )}

      {/* Mobile quick actions */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowAnnounceModal(true)}
          className="card w-full flex items-center gap-3 hover:bg-theme-accent-light/50 transition-colors text-left cursor-pointer"
        >
          <div className="p-2 bg-theme-accent-light text-theme-accent rounded-xl">
            <Megaphone size={18} />
          </div>
          <div>
            <p className="text-xs font-display font-bold text-theme-primary">Announcement</p>
            <p className="text-[10px] text-theme-muted">Notify all members</p>
          </div>
        </button>
      </div>

        </div>
      </div> {/* End grid */}

      {/* Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAnnounceModal(false)}>
          <div className="card max-w-lg w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-theme-accent-light text-theme-accent rounded-xl">
                  <Megaphone size={18} />
                </div>
                <h3 className="text-base font-display font-extrabold text-theme-primary">Send Announcement</h3>
              </div>
              <button onClick={() => setShowAnnounceModal(false)} className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <textarea
              placeholder="Write your announcement to all members..."
              value={announceContent}
              onChange={(e) => setAnnounceContent(e.target.value)}
              rows={4}
              className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-4 py-3 text-sm font-body text-theme-primary placeholder-theme-muted resize-none focus:outline-none focus:border-theme-accent transition-colors"
            />
            <p className="text-[10px] text-theme-muted font-medium">
              This will appear as a pinned announcement in the community social feed.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setShowAnnounceModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-theme-border text-xs font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (announceContent.trim()) {
                    onCreateAnnouncement(announceContent.trim());
                    setAnnounceContent("");
                    setShowAnnounceModal(false);
                  }
                }}
                disabled={!announceContent.trim()}
                className="flex-1 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Megaphone size={14} />
                Send to All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Creation Modal */}
      {showChallengeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowChallengeModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card max-w-lg w-full space-y-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between sticky top-0 bg-theme-surface z-10 pb-3 border-b border-theme-border">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-theme-support-light text-theme-support rounded-xl">
                  <Swords size={18} />
                </div>
                <div>
                  <h3 className="text-base font-display font-extrabold text-theme-primary">Design Challenge</h3>
                  <p className="text-[9px] text-theme-muted">Create a gamified challenge for your gym</p>
                </div>
              </div>
              <button onClick={() => setShowChallengeModal(false)} className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Title + Description */}
              <div>
                <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Challenge Name</label>
                <input
                  type="text"
                  placeholder="e.g. 30-Day Streak Challenge"
                  value={challengeForm.title}
                  onChange={(e) => setChallengeForm({...challengeForm, title: e.target.value})}
                  className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-4 py-2.5 text-sm font-body text-theme-primary placeholder-theme-muted focus:outline-none focus:border-theme-support transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  placeholder="What's this challenge about? Set the scene..."
                  value={challengeForm.description}
                  onChange={(e) => setChallengeForm({...challengeForm, description: e.target.value})}
                  rows={2}
                  className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary placeholder-theme-muted resize-none focus:outline-none focus:border-theme-support transition-colors"
                />
              </div>

              {/* Difficulty Selector */}
              <div>
                <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-2">Difficulty Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "easy", label: "Easy", icon: HeartHandshake, color: "text-theme-success", bg: "bg-theme-success-light", border: "border-theme-success/30" },
                    { id: "medium", label: "Medium", icon: Swords, color: "text-theme-warning", bg: "bg-theme-warning-light", border: "border-theme-warning/30" },
                    { id: "hard", label: "Hard", icon: Skull, color: "text-theme-accent", bg: "bg-theme-accent-light", border: "border-theme-accent/30" },
                    { id: "extreme", label: "Extreme", icon: Skull, color: "text-red-600", bg: "bg-red-100", border: "border-red-300" },
                  ].map((d) => {
                    const DiffIcon = d.icon;
                    const isActive = challengeForm.difficulty === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setChallengeForm({...challengeForm, difficulty: d.id})}
                        className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isActive ? `${d.bg} ${d.color} ${d.border}` : "border-theme-border bg-transparent text-theme-muted hover:bg-theme-border/20"
                        }`}
                      >
                        <DiffIcon size={18} className={isActive ? d.color : ""} />
                        <span className="text-[9px] font-bold">{d.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type + Target Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Metric Type</label>
                  <select
                    value={challengeForm.type}
                    onChange={(e) => setChallengeForm({...challengeForm, type: e.target.value})}
                    className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary focus:outline-none focus:border-theme-support cursor-pointer"
                  >
                    <option value="duration">Duration (minutes)</option>
                    <option value="steps">Steps</option>
                    <option value="frequency">Workout Frequency</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Target Value</label>
                  <input
                    type="number"
                    value={challengeForm.targetValue}
                    onChange={(e) => setChallengeForm({...challengeForm, targetValue: parseInt(e.target.value) || 0})}
                    className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary focus:outline-none focus:border-theme-support transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Unit Label</label>
                  <input
                    type="text"
                    placeholder="e.g. min, steps, sessions"
                    value={challengeForm.metricLabel}
                    onChange={(e) => setChallengeForm({...challengeForm, metricLabel: e.target.value})}
                    className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary placeholder-theme-muted focus:outline-none focus:border-theme-support transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={challengeForm.daysLeft}
                    onChange={(e) => setChallengeForm({...challengeForm, daysLeft: parseInt(e.target.value) || 0})}
                    className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary focus:outline-none focus:border-theme-support transition-colors"
                  />
                </div>
              </div>

              {/* Streak Bonus Toggle */}
              <div className="flex items-center justify-between bg-theme-warning-light/50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Flame size={18} className="text-theme-warning" />
                  <div>
                    <p className="text-xs font-display font-bold text-theme-primary">Streak Bonus</p>
                    <p className="text-[9px] text-theme-muted">Extra rewards for consecutive daily participation</p>
                  </div>
                </div>
                <button
                  onClick={() => setChallengeForm({...challengeForm, streakBonus: !challengeForm.streakBonus})}
                  className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${challengeForm.streakBonus ? "bg-theme-warning" : "bg-theme-border"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${challengeForm.streakBonus ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Reward */}
              <div>
                <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Reward Points</label>
                <input
                  type="number"
                  value={challengeForm.rewardPoints}
                  onChange={(e) => setChallengeForm({...challengeForm, rewardPoints: parseInt(e.target.value) || 0})}
                  className="w-full bg-theme-border/20 border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary focus:outline-none focus:border-theme-support transition-colors"
                />
                <p className="text-[9px] text-theme-muted mt-1 flex items-center gap-1">
                  <Star size={10} className="text-theme-warning" />
                  Members earn these points upon completing the challenge
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl bg-theme-bg border border-theme-border p-3 space-y-2">
              <p className="text-[9px] font-display font-bold text-theme-muted uppercase tracking-wider flex items-center gap-1">
                <Eye size={11} /> Preview
              </p>
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${challengeForm.difficulty === "easy" ? "bg-theme-success-light text-theme-success" : challengeForm.difficulty === "medium" ? "bg-theme-warning-light text-theme-warning" : challengeForm.difficulty === "hard" ? "bg-theme-accent-light text-theme-accent" : "bg-red-100 text-red-600"}`}>
                  <Swords size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-bold text-theme-primary truncate">{challengeForm.title || "Untitled Challenge"}</p>
                  <p className="text-[9px] text-theme-muted truncate">{challengeForm.targetValue} {challengeForm.metricLabel} &middot; {challengeForm.daysLeft}d &middot; {challengeForm.rewardPoints} pts</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setShowChallengeModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-theme-border text-xs font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (challengeForm.title.trim() && challengeForm.description.trim()) {
                    onCreateChallenge(
                      challengeForm.title.trim(),
                      challengeForm.description.trim(),
                      challengeForm.type,
                      challengeForm.targetValue,
                      challengeForm.metricLabel,
                      challengeForm.daysLeft,
                      challengeForm.rewardPoints,
                      challengeForm.difficulty,
                      challengeForm.streakBonus,
                      challengeForm.category
                    );
                    setChallengeForm({ title: "", description: "", type: "duration", targetValue: 60, metricLabel: "min", daysLeft: 7, rewardPoints: 300, difficulty: "medium", streakBonus: false, category: "fitness" });
                    setShowChallengeModal(false);
                  }
                }}
                disabled={!challengeForm.title.trim() || !challengeForm.description.trim()}
                className="flex-1 py-2.5 rounded-xl bg-theme-support hover:bg-theme-support/80 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-theme-support/25 cursor-pointer"
              >
                <Zap size={14} />
                Launch Challenge
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Member detail modal */}
      {viewingMember && (
        <MemberDetailModal
          member={viewingMember}
          onClose={() => setViewingMember(null)}
          shoutoutMember={shoutoutMember}
          setShoutoutMember={setShoutoutMember}
          shoutoutReason={shoutoutReason}
          setShoutoutReason={setShoutoutReason}
          onCreateShoutout={onCreateShoutout}
        />
      )}

    </div>
  );
}
