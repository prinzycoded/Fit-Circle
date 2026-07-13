import React, { useState } from "react";
import {
  Award,
  Grid3X3,
  List,
  Star,
  Users,
  Zap,
  Flame,
  Droplet,
  Sparkles,
  Footprints,
  CheckCircle2,
  Lock,
} from "lucide-react";

const MILESTONE_BADGES = [
  { id: "steps-10k", title: "First 10K Steps", desc: "Walked 10,000 steps in a single day", icon: Footprints, category: "Activity", unlocked: false },
  { id: "steps-50k", title: "50K Stepper", desc: "Walked 50,000 total steps", icon: Footprints, category: "Activity", unlocked: false },
  { id: "hydration-3day", title: "Hydration Streak Master", desc: "Hit water goal 3 days in a row", icon: Droplet, category: "Consistency", unlocked: false },
  { id: "hydration-7day", title: "Aqua Champion", desc: "Hit water goal 7 days in a row", icon: Droplet, category: "Consistency", unlocked: false },
  { id: "workout-10", title: "Dedicated Athlete", desc: "Completed 10 workouts total", icon: Zap, category: "Activity", unlocked: false },
  { id: "workout-50", title: "Iron Will", desc: "Completed 50 workouts total", icon: Zap, category: "Activity", unlocked: false },
  { id: "streak-7", title: "Week Warrior", desc: "Maintained a 7-day streak", icon: Flame, category: "Consistency", unlocked: false },
  { id: "streak-30", title: "Monthly Legend", desc: "Maintained a 30-day streak", icon: Flame, category: "Consistency", unlocked: false },
  { id: "social-share", title: "Social Butterfly", desc: "Shared 5 workouts to the feed", icon: Users, category: "Social", unlocked: false },
  { id: "challenge-3", title: "Challenge Conqueror", desc: "Completed 3 challenges", icon: Award, category: "Social", unlocked: false },
];

export default function BadgesExhibit({ badges, user }) {
  const [viewMode, setViewMode] = useState("grid");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Activity", "Consistency", "Nutrition", "Social", "Special"];

  const categoryIcons = {
    "Activity": <Zap size={14} />,
    "Consistency": <Flame size={14} />,
    "Nutrition": <Droplet size={14} />,
    "Social": <Users size={14} />,
    "Special": <Sparkles size={14} />,
    "All": <Star size={14} />,
  };

  const gradientMap = {
    "Activity": 'linear-gradient(135deg, #D95C42 0%, #e07b5e 100%)',
    "Consistency": 'linear-gradient(135deg, #3D6B8C 0%, #5a8aa5 100%)',
    "Nutrition": 'linear-gradient(135deg, #3D6B8C 0%, #2e4f63 100%)',
    "Social": 'linear-gradient(135deg, #1D202B 0%, #3a3f4a 100%)',
    "Special": 'linear-gradient(135deg, #D95C42 0%, #3D6B8C 100%)',
  };

  // Compute which milestones the user has actually unlocked based on their stats
  const computedMilestones = MILESTONE_BADGES.map(m => {
    let unlocked = false;
    if (m.id === "steps-10k" && user.totalSteps >= 10000) unlocked = true;
    if (m.id === "steps-50k" && user.totalSteps >= 50000) unlocked = true;
    if (m.id === "hydration-3day" && user.longestWaterStreak >= 3) unlocked = true;
    if (m.id === "hydration-7day" && user.longestWaterStreak >= 7) unlocked = true;
    if (m.id === "workout-10" && user.routinesCompletedThisMonth >= 10) unlocked = true;
    if (m.id === "workout-50" && user.routinesCompletedThisMonth >= 50) unlocked = true;
    if (m.id === "streak-7" && user.longestStreak >= 7) unlocked = true;
    if (m.id === "streak-30" && user.longestStreak >= 30) unlocked = true;
    if (m.id === "social-share" && user.feedPostsCount >= 5) unlocked = true;
    if (m.id === "challenge-3" && user.challengesCompleted >= 3) unlocked = true;
    // Fallback: check if badge id exists in user.unlockedBadges
    if (badges.some(b => b.id === m.id && b.unlocked)) unlocked = true;
    return { ...m, unlocked };
  });

  const unlockedMilestones = computedMilestones.filter(m => m.unlocked);
  const filtered = activeCategory === "All" ? badges : badges.filter(b => b.category === activeCategory);
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div id="badges-section" className="space-y-6">

      {/* Milestone Showcase */}
      {unlockedMilestones.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-theme-warning" />
            <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Milestone Showcase</h2>
            <span className="text-[10px] font-bold bg-theme-warning-light text-theme-warning px-2 py-0.5 rounded-full">{unlockedMilestones.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {computedMilestones.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
                    m.unlocked
                      ? "bg-theme-success-light text-theme-success border border-theme-success/30"
                      : "bg-theme-border/20 text-theme-muted border border-theme-border/30 opacity-50"
                  }`}
                  title={m.desc}
                >
                  <Icon size={13} />
                  <span>{m.title}</span>
                  {m.unlocked ? <CheckCircle2 size={11} /> : <Lock size={11} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="p-2.5 bg-theme-success-light text-theme-success rounded-xl">
            <Award size={20} />
          </div>
          <div>
            <h2 className="text-base font-display font-extrabold text-theme-primary tracking-tight">Badges & Achievements</h2>
            <p className="text-xs text-theme-secondary font-body">Collect, unlock, and display your journey</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-lg font-display font-extrabold text-theme-primary leading-none">{unlockedCount}</p>
            <p className="text-[10px] font-bold text-theme-muted uppercase">of {badges.length} badges</p>
          </div>
          <div className="flex bg-theme-border/30 rounded-xl p-0.5">
            <button
              id="grid-view-btn"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg cursor-pointer ${viewMode === "grid" ? 'bg-theme-surface text-theme-accent shadow-sm' : 'text-theme-muted hover:text-theme-primary'}`}
            >
              <Grid3X3 size={15} />
            </button>
            <button
              id="list-view-btn"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg cursor-pointer ${viewMode === "list" ? 'bg-theme-surface text-theme-accent shadow-sm' : 'text-theme-muted hover:text-theme-primary'}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Category filter */}
      {badges.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-display font-bold rounded-xl transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? "bg-theme-accent text-white"
                  : "bg-theme-border/30 text-theme-secondary hover:bg-theme-border/50"
              }`}
            >
              {categoryIcons[cat]}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* Badges display */}
      {filtered.length === 0 ? (
        <div className="card text-center py-10">
          <Award size={36} className="mx-auto text-theme-muted mb-3" />
          <p className="text-sm font-bold text-theme-secondary">No badges in this category yet.</p>
          <p className="text-xs text-theme-muted mt-1">Complete workouts and challenges to unlock more.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div id="badges-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((badge) => (
            <div
              key={badge.id}
              className={`card flex flex-col items-center justify-center text-center p-4 transition-all ${
                badge.unlocked ? 'card-hover' : 'opacity-40 grayscale'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm transition-transform`}
                style={{ background: badge.unlocked ? (gradientMap[badge.category] || gradientMap.Consistency) : '#2A2E3A' }}
              >
                <span className="text-white text-xl font-display font-extrabold leading-none">
                  {badge.icon || <Award size={22} />}
                </span>
              </div>
              <p className="text-xs font-display font-bold text-theme-primary">{badge.title}</p>
              <p className="text-[10px] text-theme-secondary mt-0.5 leading-tight font-body">{badge.description}</p>
              <span className={`mt-2 px-2 py-0.5 text-[9px] font-display font-extrabold uppercase rounded-full ${
                badge.unlocked ? 'bg-theme-success-light text-theme-success' : 'bg-theme-border/50 text-theme-muted'
              }`}>
                {badge.unlocked ? 'Earned' : `Locked`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div id="badges-list" className="space-y-2">
          {filtered.map((badge) => (
            <div
              key={badge.id}
              className={`card flex items-center justify-between p-3 gap-3 ${badge.unlocked ? '' : 'opacity-50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-display font-extrabold ${
                  badge.unlocked ? '' : 'bg-theme-border/50'
                }`} style={badge.unlocked ? { background: '#3D6B8C' } : {}}>
                  {badge.icon || <Award size={18} />}
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-theme-primary">{badge.title}</p>
                  <p className="text-xs text-theme-secondary font-body">{badge.description}</p>
                </div>
              </div>
              <span className={`text-[10px] font-display font-extrabold px-2.5 py-1 rounded-full uppercase whitespace-nowrap ${
                badge.unlocked ? 'bg-theme-success-light text-theme-success' : 'bg-theme-border/30 text-theme-muted'
              }`}>
                {badge.unlocked ? 'Earned' : `Locked`}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
