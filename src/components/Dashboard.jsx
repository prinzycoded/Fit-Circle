import React, { useState } from "react";
import {
  Dumbbell,
  Plus,
  Sparkles,
  Trophy,
  Flame,
  Target,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
  Zap,
  Medal,
  Users,
  Shield,
  Calendar,
  Bell,
  Activity,
  Image,
} from "lucide-react";


export default function Dashboard({ metrics, user, challenges, weeklyChallenges = [], ownerChallenges = [], badges, feedPosts, accountabilityGroups = [], onUpdateMetrics, onLogWorkout, onJoinOwnerChallenge, onNavigate, featuredChallenge, onJoinFeaturedChallenge = () => {}, onUpdateReminders, onUpdateProgress }) {

  const normalizeChallenge = (c) => ({
    ...c,
    participants: c.participants || c.members || [],
    progress: c.progress ?? c.currentValue ?? 0,
    goal: c.goal ?? c.targetValue ?? 100,
    claimedBy: c.claimedBy || [],
    category: c.category || "General",
    reward: c.reward || (c.rewardPoints ? `${c.rewardPoints} pts` : null),
    daysLeft: c.daysLeft ?? (c.weekEnd ? Math.max(1, Math.ceil((new Date(c.weekEnd) - new Date()) / (1000 * 60 * 60 * 24))) : 7),
  });
  const [customWorkout, setCustomWorkout] = useState({
    type: "Run",
    duration: 30,
    calories: 250,
  });

  const submitQuickWorkout = (e) => {
    e.preventDefault();
    onLogWorkout(customWorkout.type, customWorkout.duration, customWorkout.calories);
    onUpdateMetrics({
      ...metrics,
      activeMinutes: metrics.activeMinutes + customWorkout.duration,
      caloriesBurned: metrics.caloriesBurned + customWorkout.calories,
    });
  };

  const activeChallenges = challenges.filter(c => c.status === "active" || c.status === "pending");
  const myWorkouts = feedPosts.filter(p => p.authorName === user.name);
  const nextBadge = badges.filter(b => !b.unlocked)[0];
  const mySquads = accountabilityGroups.filter(g => g.members.some(m => m.id === "me" || m.id === user.id));

  return (
    <div id="dashboard-section" className="space-y-6">

      {/* Welcome banner */}
      <div id="welcome-card" className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3D6B8C 0%, #1D202B 100%)' }}>
        <div className="absolute right-0 bottom-0 top-0 opacity-5 flex items-center justify-center p-4">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-display font-bold uppercase tracking-widest backdrop-blur-sm">
                Member Profile
              </span>
              <div className="flex items-center gap-1 bg-theme-accent text-white text-xs px-3 py-1 rounded-full font-display font-bold">
                <Trophy size={11} />
                <span>{user.points.toLocaleString()} pts</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mt-1">
              Welcome back, {user.name.split(" ")[0]}.
            </h1>
            <p className="text-white/70 text-sm mt-1 max-w-sm font-body">
              Your consistency is driving results. You are on track for your seasonal discount reward.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 self-start md:self-auto border border-white/10">
            <div className="w-12 h-12 bg-theme-accent rounded-full flex items-center justify-center text-xl shadow-inner">
              <Flame size={22} />
            </div>
            <div>
              <p className="text-xs text-white/60 font-medium font-body">Active Streak</p>
              <p className="text-xl font-display font-extrabold text-theme-accent-light">
                {user.streak}d strong
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Challenge (compact) */}
      {featuredChallenge && (() => {
        const pct = featuredChallenge.targetValue > 0
          ? Math.min(100, Math.round((featuredChallenge.currentValue / featuredChallenge.targetValue) * 100))
          : 0;
        const daysLeft = featuredChallenge.daysLeft || 25;
        const hasJoined = featuredChallenge.participants?.some(p => p.id === "me" || p.id === user.id);
        return (
          <div
            onClick={() => onNavigate?.("welcome")}
            className="rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer group"
            style={{ background: 'linear-gradient(135deg, #D95C42 0%, #1D202B 100%)' }}
          >
            <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center p-4">
              <Trophy size={120} />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={10} />
                    Featured Challenge
                  </span>
                  <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full font-bold">
                    {daysLeft}d left
                  </span>
                </div>
                <h3 className="text-sm font-display font-extrabold tracking-tight truncate">{featuredChallenge.title}</h3>
                <p className="text-[11px] text-white/70 mt-0.5 line-clamp-1">{featuredChallenge.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-bold">{featuredChallenge.currentValue}/{featuredChallenge.targetValue}</span>
                      <span className="text-white/60">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                      <div className="h-full rounded-full bg-theme-accent" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex -space-x-1.5">
                    {(featuredChallenge.participants || []).slice(0, 4).map((p, i) => (
                      <img key={p.id || i} referrerPolicy="no-referrer" src={p.avatar} alt="" className="w-6 h-6 rounded-full border-2 border-white/30" />
                    ))}
                    {(featuredChallenge.participants?.length || 0) > 4 && (
                      <div className="w-6 h-6 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center text-[8px] font-bold">
                        +{featuredChallenge.participants.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!hasJoined ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); onJoinFeaturedChallenge(); }}
                    className="bg-white text-[#D95C42] text-[10px] font-display font-bold px-4 py-2 rounded-xl hover:bg-white/90 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap size={13} />
                    Join
                  </button>
                ) : (
                  <span className="bg-green-400/20 text-green-200 text-[10px] font-display font-bold px-3 py-2 rounded-xl flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Joined
                  </span>
                )}
                <ChevronRight size={14} className="text-white/40 group-hover:text-white/70 transition-colors" />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card flex items-center gap-3 py-3 px-4">
          <div className="p-2 bg-theme-accent-light text-theme-accent rounded-xl">
            <Zap size={16} />
          </div>
          <div>
            <p className="text-xs font-display font-extrabold text-theme-primary">{user.points.toLocaleString()}</p>
            <p className="text-[10px] text-theme-muted">Total Points</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 py-3 px-4">
          <div className="p-2 bg-theme-warning-light text-theme-warning rounded-xl">
            <Flame size={16} />
          </div>
          <div>
            <p className="text-xs font-display font-extrabold text-theme-primary">{user.streak}d</p>
            <p className="text-[10px] text-theme-muted">Streak</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 py-3 px-4">
          <div className="p-2 bg-theme-support-light text-theme-support rounded-xl">
            <Dumbbell size={16} />
          </div>
          <div>
            <p className="text-xs font-display font-extrabold text-theme-primary">{user.routinesCompletedThisMonth}</p>
            <p className="text-[10px] text-theme-muted">Workouts/Month</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 py-3 px-4">
          <div className="p-2 bg-theme-success-light text-theme-success rounded-xl">
            <Award size={16} />
          </div>
          <div>
            <p className="text-xs font-display font-extrabold text-theme-primary">{badges.filter(b => b.unlocked).length}</p>
            <p className="text-[10px] text-theme-muted">Badges Earned</p>
          </div>
        </div>
      </div>

      {/* Squad Captain */}
      {mySquads.length > 0 && (
        <div onClick={() => onNavigate?.("groups")} className="card flex items-center justify-between gap-4 cursor-pointer hover:bg-theme-border/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-theme-accent/10 text-theme-accent rounded-xl">
              <Shield size={18} />
            </div>
            <div>
              <p className="text-xs font-display font-extrabold text-theme-primary">Squad Captain</p>
              <p className="text-[10px] text-theme-secondary">{mySquads.length} active squad{mySquads.length > 1 ? "s" : ""} · {mySquads.reduce((sum, g) => sum + g.members.length, 0)} members</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {mySquads.flatMap(g => g.members.filter(m => m.id !== "me" && m.id !== user.id)).slice(0, 4).map((m, i) => (
                <img key={m.id || i} src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full border-2 border-theme-surface object-cover" />
              ))}
              {mySquads.flatMap(g => g.members.filter(m => m.id !== "me" && m.id !== user.id)).length > 4 && (
                <div className="w-7 h-7 rounded-full border-2 border-theme-surface bg-theme-border/50 flex items-center justify-center text-[9px] font-display font-bold text-theme-muted">
                  +{mySquads.flatMap(g => g.members.filter(m => m.id !== "me" && m.id !== user.id)).length - 4}
                </div>
              )}
            </div>
            <ChevronRight size={14} className="text-theme-muted" />
          </div>
        </div>
      )}

      {/* Challenges Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-theme-accent" />
            <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Challenges</h2>
          </div>
        </div>

        {/* Weekly Challenges */}
        {weeklyChallenges.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-theme-warning" />
              <span className="text-[11px] font-display font-bold text-theme-primary">Weekly Challenges</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weeklyChallenges.map((raw) => {
                const c = normalizeChallenge(raw);
                const pct = c.goal > 0 ? Math.min(100, Math.round((c.progress / c.goal) * 100)) : 0;
                const joined = c.participants.some(p => p.id === user.id);
                const done = c.progress >= c.goal;
                return (
                  <div key={c.id} className="rounded-xl border border-theme-border bg-theme-surface/40 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-display font-bold text-theme-primary">{c.title}</h4>
                      {done ? (
                        <span className="text-[9px] font-bold text-theme-success bg-theme-success-light px-2 py-0.5 rounded-full">Done</span>
                      ) : joined ? (
                        <span className="text-[9px] font-bold text-theme-accent bg-theme-accent-light px-2 py-0.5 rounded-full">Active</span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3 text-[9px] text-theme-secondary mb-2">
                      <span>{c.participants.length} joined</span>
                      <span>{c.daysLeft || 7}d left</span>
                    </div>
                    <div className="progress-bar h-1.5 mb-2">
                      <div className={`progress-bar-fill ${done ? 'bg-theme-success' : 'bg-theme-accent'}`} style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-theme-muted">{c.progress}/{c.goal}</span>
                      {!joined && !done && (
                        <button
                          onClick={() => {}}
                          className="text-[9px] font-bold text-theme-accent hover:text-theme-accent-hover cursor-pointer"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Coach Challenges */}
        {ownerChallenges.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-purple-500" />
              <span className="text-[11px] font-display font-bold text-theme-primary">Coach Challenges</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ownerChallenges.map((raw) => {
                const c = normalizeChallenge(raw);
                const pct = c.goal > 0 ? Math.min(100, Math.round((c.progress / c.goal) * 100)) : 0;
                const joined = c.participants.some(p => p.id === user.id);
                const done = c.progress >= c.goal;
                return (
                  <div key={c.id} className="rounded-xl border border-purple-200/30 bg-purple-50/20 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-display font-bold text-theme-primary">{c.title}</h4>
                      {done ? (
                        <span className="text-[9px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Done</span>
                      ) : joined ? (
                        <span className="text-[9px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">Active</span>
                      ) : null}
                    </div>
                    <p className="text-[9px] text-theme-secondary mb-2">{c.description}</p>
                    <div className="flex items-center gap-3 text-[9px] text-theme-secondary mb-2">
                      <span>{c.participants.length} joined</span>
                      <span>{c.daysLeft || 7}d left</span>
                    </div>
                    <div className="progress-bar h-1.5 mb-2">
                      <div className={`progress-bar-fill ${done ? 'bg-purple-500' : 'bg-purple-400'}`} style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-theme-muted">{c.progress}/{c.goal}</span>
                      {!joined && !done && (
                        <button
                          onClick={() => onJoinOwnerChallenge(c.id)}
                          className="text-[9px] font-bold text-purple-500 hover:text-purple-700 cursor-pointer"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Your Active Challenges */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-theme-accent" />
            <span className="text-[11px] font-display font-bold text-theme-primary">Your Challenges</span>
          </div>
          {activeChallenges.length === 0 ? (
            <p className="text-xs text-theme-muted py-2">No personal challenges yet. Join a coach challenge to get started!</p>
          ) : (
            <div className="space-y-3">
              {activeChallenges.map(c => {
                const pct = c.targetValue > 0 ? Math.min(100, Math.round((c.currentValue / c.targetValue) * 100)) : 0;
                return (
                  <div key={c.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-display font-bold text-theme-primary truncate">{c.title}</span>
                      <span className="text-[10px] font-bold text-theme-muted">{c.currentValue}/{c.targetValue} {c.metricLabel}</span>
                    </div>
                    <div className="progress-bar h-1.5">
                      <div className="progress-bar-fill bg-theme-accent" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <span className={`text-[10px] font-medium ${c.status === "pending" ? "text-theme-warning" : "text-theme-success"}`}>
                        {c.status === "pending" ? "Not started" : "In progress"}
                      </span>
                      <span className="text-[10px] text-theme-muted">{c.daysLeft ? `${c.daysLeft}d left` : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Next Badge Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Medal size={16} className="text-theme-warning" />
            <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Next Badge</h2>
          </div>
          {nextBadge ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-theme-border/30 flex items-center justify-center text-2xl">
                {nextBadge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-extrabold text-theme-primary">{nextBadge.title}</p>
                <p className="text-xs text-theme-secondary mt-0.5">{nextBadge.description}</p>
                <p className="text-[10px] text-theme-muted mt-1">
                  {nextBadge.requirementText}
                </p>
              </div>
              <ChevronRight size={16} className="text-theme-muted shrink-0" />
            </div>
          ) : (
            <p className="text-xs text-theme-muted py-2">All badges unlocked! You're a legend.</p>
          )}
        </div>
      </div>

      {/* Recent Workout History */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-theme-support" />
          <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Recent Workouts</h2>
        </div>
        {myWorkouts.length === 0 ? (
          <p className="text-xs text-theme-muted py-2">No workouts logged yet. Start your journey today!</p>
        ) : (
          <div className="space-y-2.5">
            {myWorkouts.slice(0, 4).map((w, i) => (
              <div key={w.id || i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-theme-accent-light flex items-center justify-center text-theme-accent shrink-0">
                  <Dumbbell size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-bold text-theme-primary truncate">
                    {w.workout?.type || "Workout"}
                  </p>
                  <p className="text-[10px] text-theme-muted">
                    {w.workout?.duration || 0} min · {w.workout?.metric || ""}
                  </p>
                </div>
                <span className="text-[10px] text-theme-muted shrink-0">{w.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workout Logger */}
      <div id="workout-logger-section" className="card">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="text-theme-accent" size={18} />
          <h2 className="text-base font-display font-extrabold text-theme-primary tracking-tight">
            Log New Workout
          </h2>
        </div>

        <form onSubmit={submitQuickWorkout} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-display font-bold text-theme-secondary uppercase tracking-wider">Activity</label>
            <select
              value={customWorkout.type}
              onChange={(e) => setCustomWorkout({ ...customWorkout, type: e.target.value })}
              className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2.5 text-sm font-bold text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
            >
              <option value="Run">Outdoor Run</option>
              <option value="Cycle">Road Cycling</option>
              <option value="Strength">Weight Lifting</option>
              <option value="Yoga">Gentle Yoga</option>
              <option value="Walk">Brisk Walk</option>
              <option value="HIIT">HIIT Training</option>
              <option value="Swim">Laps Swimming</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-display font-bold text-theme-secondary uppercase tracking-wider">Duration (min)</label>
            <input
              type="number" min="1" max="300"
              value={customWorkout.duration}
              onChange={(e) => {
                const mins = Math.max(1, parseInt(e.target.value) || 0);
                let burnPerMin = 8;
                if (customWorkout.type === "Run") burnPerMin = 10;
                if (customWorkout.type === "Cycle") burnPerMin = 8;
                if (customWorkout.type === "Yoga") burnPerMin = 4;
                if (customWorkout.type === "HIIT") burnPerMin = 12;
                setCustomWorkout({ ...customWorkout, duration: mins, calories: mins * burnPerMin });
              }}
              className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2 text-sm font-bold text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-display font-bold text-theme-secondary uppercase tracking-wider">Est. Calories</label>
            <input
              type="number" min="1"
              value={customWorkout.calories}
              onChange={(e) => setCustomWorkout({ ...customWorkout, calories: Math.max(1, parseInt(e.target.value) || 0) })}
              className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2 text-sm font-bold text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          <button
            id="log-workout-btn"
            type="submit"
            className="w-full bg-theme-accent hover:bg-theme-accent-hover text-white font-display font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            Log & Share
          </button>
        </form>

        <p className="text-xs text-center text-theme-muted mt-4 pt-4 border-t border-theme-border font-body">
          Logging a workout increases your stats, leaderboard scores, and counts toward your monthly discount race goal.
        </p>
      </div>

      {/* Quick Links: Progress & Reminders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div onClick={() => onNavigate?.("progress")} className="card flex items-center gap-3 hover:bg-theme-border/20 transition-all cursor-pointer">
          <div className="p-2.5 bg-theme-accent-light text-theme-accent rounded-xl">
            <Activity size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-display font-extrabold text-theme-primary">Progress Tracker</p>
            <p className="text-[10px] text-theme-secondary">Weight, measurements & photos</p>
          </div>
          <ChevronRight size={14} className="text-theme-muted" />
        </div>
        <div onClick={() => onNavigate?.("workout")} className="card flex items-center gap-3 hover:bg-theme-border/20 transition-all cursor-pointer">
          <div className="p-2.5 bg-theme-support-light text-theme-support rounded-xl">
            <Dumbbell size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-display font-extrabold text-theme-primary">Workout Plan</p>
            <p className="text-[10px] text-theme-secondary">View assigned workouts & log days</p>
          </div>
          <ChevronRight size={14} className="text-theme-muted" />
        </div>
      </div>

    </div>
  );
}
