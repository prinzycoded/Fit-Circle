import React, { useState } from "react";
import {
  Dumbbell,
  Plus,
  Sparkles,
  Trophy,
  Flame,
  Target,
  Clock,
  Award,
  ChevronRight,
  Zap,
  Medal,
  X,
  Send,
} from "lucide-react";

export default function Dashboard({ metrics, user, challenges, badges, feedPosts, onUpdateMetrics, onLogWorkout, onCreateChallenge }) {
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [challengeForm, setChallengeForm] = useState({
    title: "",
    description: "",
    type: "duration",
    targetValue: 60,
    metricLabel: "min",
    daysLeft: 7,
    rewardPoints: 200,
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

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

      {/* Active Challenges + Next Badge side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Active Challenges */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-theme-accent" />
              <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Active Challenges</h2>
            </div>
            <button
              onClick={() => setShowCreateChallenge(true)}
              className="flex items-center gap-1 text-[10px] font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <Plus size={12} />
              Create
            </button>
          </div>

          {/* Create Challenge Form */}
          {showCreateChallenge && (
            <div className="mb-4 p-3 rounded-xl bg-theme-border/20 border border-theme-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-display font-bold text-theme-primary uppercase tracking-wider">New Challenge</span>
                <button onClick={() => setShowCreateChallenge(false)} className="p-1 text-theme-muted hover:text-theme-primary cursor-pointer">
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Challenge title"
                value={challengeForm.title}
                onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                className="w-full bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-xs font-bold text-theme-primary placeholder-theme-muted focus:outline-none focus:border-theme-accent"
              />
              <input
                type="text"
                placeholder="Short description"
                value={challengeForm.description}
                onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                className="w-full bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-xs font-bold text-theme-primary placeholder-theme-muted focus:outline-none focus:border-theme-accent"
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[8px] font-display font-bold text-theme-muted uppercase tracking-wider">Target</label>
                  <input
                    type="number" min="1"
                    value={challengeForm.targetValue}
                    onChange={(e) => setChallengeForm({ ...challengeForm, targetValue: Math.max(1, parseInt(e.target.value) || 0) })}
                    className="w-full bg-theme-surface border border-theme-border rounded-lg px-2 py-1.5 text-xs font-bold text-theme-primary focus:outline-none focus:border-theme-accent"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-display font-bold text-theme-muted uppercase tracking-wider">Unit</label>
                  <input
                    type="text"
                    value={challengeForm.metricLabel}
                    onChange={(e) => setChallengeForm({ ...challengeForm, metricLabel: e.target.value })}
                    className="w-full bg-theme-surface border border-theme-border rounded-lg px-2 py-1.5 text-xs font-bold text-theme-primary focus:outline-none focus:border-theme-accent"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-display font-bold text-theme-muted uppercase tracking-wider">Days</label>
                  <input
                    type="number" min="1" max="30"
                    value={challengeForm.daysLeft}
                    onChange={(e) => setChallengeForm({ ...challengeForm, daysLeft: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full bg-theme-surface border border-theme-border rounded-lg px-2 py-1.5 text-xs font-bold text-theme-primary focus:outline-none focus:border-theme-accent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={challengeForm.type}
                  onChange={(e) => setChallengeForm({ ...challengeForm, type: e.target.value })}
                  className="flex-1 bg-theme-surface border border-theme-border rounded-lg px-2 py-1.5 text-[10px] font-bold text-theme-primary focus:outline-none focus:border-theme-accent"
                >
                  <option value="duration">Duration</option>
                  <option value="steps">Steps</option>
                  <option value="frequency">Frequency</option>
                </select>
                <button
                  onClick={() => {
                    if (!challengeForm.title.trim()) return;
                    onCreateChallenge({
                      ...challengeForm,
                      title: challengeForm.title.trim(),
                      description: challengeForm.description.trim() || `Complete ${challengeForm.targetValue} ${challengeForm.metricLabel}`,
                    });
                    setChallengeForm({ title: "", description: "", type: "duration", targetValue: 60, metricLabel: "min", daysLeft: 7, rewardPoints: 200 });
                    setShowCreateChallenge(false);
                  }}
                  className="flex items-center gap-1 text-[10px] font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <Send size={11} />
                  Go
                </button>
              </div>
            </div>
          )}

          {activeChallenges.length === 0 && !showCreateChallenge ? (
            <p className="text-xs text-theme-muted py-2">No active challenges. Create one above!</p>
          ) : (
            <div className="space-y-3">
              {activeChallenges.slice(0, 3).map(c => {
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

        {/* Next Badge Preview */}
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

    </div>
  );
}
