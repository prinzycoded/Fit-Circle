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
  Sparkles
} from "lucide-react";

export default function BadgesExhibit({ badges, user }) {
  const [viewMode, setViewMode] = useState("grid");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Fitness", "Consistency", "Nutrition", "Social", "Special"];

  const categoryIcons = {
    "Fitness": <Zap size={14} />,
    "Consistency": <Flame size={14} />,
    "Nutrition": <Droplet size={14} />,
    "Social": <Users size={14} />,
    "Special": <Sparkles size={14} />,
    "All": <Star size={14} />,
  };

  const filtered = activeCategory === "All" ? badges : badges.filter(b => b.category === activeCategory);
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div id="badges-section" className="space-y-6">

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
          {filtered.map((badge) => {
            const gradientMap = {
              "Fitness": 'linear-gradient(135deg, #D95C42 0%, #e07b5e 100%)',
              "Consistency": 'linear-gradient(135deg, #3D6B8C 0%, #5a8aa5 100%)',
              "Nutrition": 'linear-gradient(135deg, #3D6B8C 0%, #2e4f63 100%)',
              "Social": 'linear-gradient(135deg, #1D202B 0%, #3a3f4a 100%)',
              "Special": 'linear-gradient(135deg, #D95C42 0%, #3D6B8C 100%)',
            };
            return (
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
            );
          })}
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


