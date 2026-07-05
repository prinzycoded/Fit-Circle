import React from "react";
import {
  Dumbbell,
  Trophy,
  Flame,
  Users,
  Award,
  Target,
  CheckCircle2,
  Compass,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Gift,
  Clock,
  Medal,
  TrendingUp,
} from "lucide-react";
import DailyCheckIn from "./DailyCheckIn";
import StreakSystem from "./StreakSystem";
import StreakRescueAlert from "./StreakRescueAlert";
import SyndicateDashboardCard from "./SyndicateDashboardCard";

export default function WelcomePage({ user, badges, onCheckIn, onBuyFreeze, onUseFreeze, accountabilityGroups, onRescueStreak, onNavigate }) {
  const features = [
    { icon: Target, label: "Health Dashboard", desc: "Track workouts, log activity, and monitor your fitness journey." },
    { icon: Compass, label: "Consistency Race", desc: "Complete monthly routines to unlock discount rewards and coupons." },
    { icon: Users, label: "Social Feed", desc: "Share progress, challenge friends, and stay motivated together." },
    { icon: Trophy, label: "Leaderboards", desc: "Compete with members and climb the rankings every week." },
    { icon: Award, label: "Achievement Badges", desc: "Earn badges by hitting milestones and completing challenges." },
    { icon: Shield, label: "Accountability Groups", desc: "Join groups, nudge members, and crush team goals." },
  ];

  const routinesPct = Math.min(100, Math.round((user.routinesCompletedThisMonth / user.routineTargetMonth) * 100));
  const arenaRank = Math.max(1, Math.min(50, 50 - Math.floor(user.points / 300)));
  const avgMonthlySpend = 200;
  const savingsRate = user.routinesCompletedThisMonth >= 20 ? 0.3 : user.routinesCompletedThisMonth >= 12 ? 0.2 : user.routinesCompletedThisMonth >= 5 ? 0.1 : 0;
  const totalSaved = Math.round(avgMonthlySpend * savingsRate);

  return (
    <div className="space-y-4 sm:space-y-8">

      {/* Arena Contest Hero */}
      <div className="rounded-xl sm:rounded-2xl text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D95C42 0%, #7C2D12 50%, #1D202B 100%)' }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between px-3 sm:px-5 pt-2 sm:pt-4 pb-1">
            <div className="flex items-center gap-1">
              <div className="w-5 sm:w-7 h-5 sm:h-7 bg-theme-warning/20 backdrop-blur-sm rounded-lg flex items-center justify-center ring-2 ring-theme-warning/20">
                <Trophy size={10} className="text-theme-warning" />
              </div>
              <span className="text-[10px] sm:text-sm font-display font-extrabold tracking-tight">FitCircle Arena</span>
              <span className="ml-0.5 px-1 py-0.5 bg-theme-warning text-black text-[6px] sm:text-[7px] font-bold rounded uppercase">LIVE</span>
            </div>
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-0.5 border border-white/10">
              <Medal size={7} className="text-yellow-300" />
              <span className="text-[6px] sm:text-[8px] font-display font-bold text-white/70">Prize:</span>
              <span className="text-[8px] sm:text-[10px] font-display font-extrabold text-theme-warning">$2,400</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-6 items-center px-3 sm:px-5 pt-0 pb-3 sm:pb-6">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-1 mb-1">
                <span className="px-1 py-0.5 bg-theme-warning/20 text-theme-warning text-[7px] font-bold rounded border border-theme-warning/20">S2</span>
                <span className="px-1 py-0.5 bg-white/10 text-white/80 text-[7px] font-bold rounded">6d left</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-display font-extrabold tracking-tight leading-tight">
                The Contest Arena{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-theme-warning to-yellow-300">
                  awaits.
                </span>
              </h1>
              <p className="text-white/70 text-[10px] sm:text-sm mt-0.5 sm:mt-1.5 max-w-xl font-body leading-relaxed">
                Every rep earns Arena Points. Climb ranks, unlock prize tiers, and battle for the $2,400 Grand Prize.
              </p>
              
              <div className="mt-2 sm:mt-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] sm:text-[9px] font-display font-bold uppercase tracking-wider text-white/60">Your Arena Score</span>
                  <span className="text-[10px] sm:text-[11px] font-display font-extrabold text-theme-warning">{user.points.toLocaleString()} pts</span>
                </div>
                <div className="relative">
                  <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-theme-warning to-yellow-300 rounded-full" style={{ width: `${Math.min(100, (user.points / 25000) * 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[6px] text-white/50">🥉5K</span>
                    <span className="text-[6px] text-white/50">🥈15K</span>
                    <span className="text-[6px] text-white/50">🥇25K</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-1 mt-2">
                {[
                  { icon: Trophy, label: "Grand Prize $2,400", color: "text-yellow-300" },
                  { icon: Medal, label: "Top 3 Payout", color: "text-orange-300" },
                  { icon: Zap, label: "Bonus Challenges", color: "text-purple-300" },
                  { icon: Flame, label: "Streak Multiplier", color: "text-red-300" },
                  { icon: Trophy, label: `You've saved $${totalSaved}`, color: "text-emerald-300" },
                ].map(({ icon: Icon, label, color }) => (
                  <span key={label} className="flex items-center gap-0.5 bg-white/10 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-[7px] sm:text-[8px] font-bold border border-white/10">
                    <Icon size={7} className={color} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 flex items-center justify-center mt-1 sm:mt-0">
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full max-w-xs">
                {[
                  { value: `#${arenaRank}`, label: "Your Rank", icon: Medal, accent: "text-yellow-300", nav: "leaderboard" },
                  { value: `${user.streak}`, label: "Day Streak", icon: Flame, accent: "text-orange-300", nav: "welcome" },
                  { value: `${user.routinesCompletedThisMonth}`, label: "Workouts Season", icon: Zap, accent: "text-purple-300", nav: "dashboard" },
                  { value: `${(badges || []).filter(b => b.unlocked).length}`, label: "Medals Earned", icon: Award, accent: "text-emerald-300", nav: "badges" },
                ].map(({ value, label, icon: Icon, accent, nav }) => (
                  <div key={label} onClick={() => onNavigate?.(nav)} className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-center border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                    <Icon size={12} className={`mx-auto ${accent} mb-0.5`} />
                    <p className="text-xs sm:text-base font-display font-extrabold">{value}</p>
                    <p className="text-[7px] sm:text-[8px] text-white/60 font-medium uppercase tracking-wider mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Daily Check-In (compact) */}
        <DailyCheckIn user={user} onCheckIn={onCheckIn} />

        {/* Consistency Tracker (compact) - Contest Edition */}
        <div className="card flex flex-col justify-between relative overflow-hidden" style={{ borderRadius: 12, padding: 16 }}>
          <div className="absolute -right-6 -top-6 w-16 h-16 bg-theme-accent/5 rounded-full blur-xl"></div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-display font-bold uppercase text-theme-muted tracking-widest mb-2">
              <Compass size={11} className="text-theme-accent" />
              <span>Consistency Race</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-display font-extrabold text-theme-primary">
                {user.routinesCompletedThisMonth} / {user.routineTargetMonth}
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[9px] font-display font-bold text-theme-success bg-theme-success-light px-2 py-0.5 rounded-full">
                  <Gift size={9} />
                  <span>Prize Pool: 30% Off</span>
                </span>
                <span className="text-[9px] font-display font-extrabold text-theme-support bg-theme-support-light px-2 py-0.5 rounded-full">
                  {routinesPct}%
                </span>
              </div>
            </div>
            <p className="text-[9px] text-theme-muted font-medium mt-0.5 uppercase tracking-wide">Workouts Completed This Month</p>
          </div>
          <div className="mt-3">
            <div className="relative">
              <div className="progress-bar">
                <div className="progress-bar-fill bg-theme-accent" style={{ width: `${routinesPct}%` }}></div>
              </div>
              {/* Tier markers */}
              <div className="flex justify-between mt-1 px-0.5">
                {[
                  { at: 25, label: "🥉 Bronze", pct: "10%" },
                  { at: 60, label: "🥈 Silver", pct: "20%" },
                  { at: 100, label: "🥇 Gold", pct: "30%" },
                ].map((tier) => (
                  <span key={tier.at} className={`text-[7px] font-display font-bold px-1 py-0.5 rounded ${
                    routinesPct >= tier.at
                      ? "text-theme-success bg-theme-success-light"
                      : "text-theme-muted bg-theme-border/30"
                  }`}>
                    {tier.label} {tier.pct}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[9px] text-theme-secondary font-medium mt-1.5 flex items-center gap-1">
              <Trophy size={9} className="text-theme-warning shrink-0" />
              {user.routinesCompletedThisMonth >= 20
                ? "Gold tier achieved! 🎉 Use code FITGOLD30 at checkout."
                : user.routinesCompletedThisMonth >= 12
                ? "Silver unlocked! 6 more workouts to Gold (30% Off)!"
                : `${20 - user.routinesCompletedThisMonth} more workouts to unlock Gold tier!`}
            </p>
          </div>
        </div>

      </div>

      {/* Streak Rescue Alert */}
      <StreakRescueAlert
        groups={accountabilityGroups || []}
        currentUserId={user.id}
        onRescue={onRescueStreak}
      />

      {/* Active Contests Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Daily Quest */}
        <div className="card overflow-hidden relative" style={{ borderRadius: 12, padding: 0 }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-theme-accent to-theme-warning"></div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-[10px] font-display font-bold uppercase text-theme-muted tracking-widest">
                <Zap size={11} className="text-theme-warning" />
                <span>Daily Quest</span>
              </div>
              <span className="flex items-center gap-1 text-[9px] font-display font-bold text-theme-accent bg-theme-accent-light px-2 py-0.5 rounded-full">
                <Clock size={9} />
                <span>11h 24m left</span>
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-theme-warning-light text-theme-warning rounded-xl shrink-0">
                <Target size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-display font-bold text-theme-primary leading-snug">Burn 500 active calories today</p>
                <p className="text-[10px] text-theme-secondary mt-0.5">Log high-intensity workouts to earn bonus XP.</p>
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex-1">
                    <div className="progress-bar">
                      <div className="progress-bar-fill bg-theme-warning" style={{ width: "68%" }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] font-display font-bold text-theme-primary">340 / 500 cal</span>
                      <span className="text-[9px] font-display font-bold text-theme-muted">68%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-theme-success shrink-0">
                    <Gift size={11} />
                    <span className="text-[9px] font-display font-extrabold">+150 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Showdown - Mini Leaderboard */}
        <div className="card overflow-hidden relative" style={{ borderRadius: 12, padding: 0 }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-theme-support to-theme-accent"></div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-[10px] font-display font-bold uppercase text-theme-muted tracking-widest">
                <Medal size={11} className="text-theme-support" />
                <span>Weekly Showdown</span>
              </div>
              <span className="text-[9px] font-display font-bold text-theme-support bg-theme-support-light px-2 py-0.5 rounded-full">
                <TrendingUp size={9} className="inline mr-0.5" />
                6 days left
              </span>
            </div>
            <div className="space-y-2">
              {[
                { rank: 1, name: "Liam Carter", points: 11200, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
                { rank: 2, name: "Jessica Vance", points: 10400, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80", color: "text-gray-400", bg: "bg-gray-50 dark:bg-gray-800/30" },
                { rank: 3, name: "Ava Mitchell", points: 7650, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80", color: "text-amber-700", bg: "bg-amber-50 dark:bg-amber-900/20" },
              ].map(({ rank, name, points, avatar, color, bg }) => (
                <div key={rank} className={`flex items-center gap-2.5 p-2 rounded-xl ${bg} transition-all`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-display font-extrabold ${color} ${rank === 1 ? 'bg-yellow-100 dark:bg-yellow-900/30' : rank === 2 ? 'bg-gray-100 dark:bg-gray-700/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                    {rank}
                  </span>
                  <img src={avatar} alt={name} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20" />
                  <span className="flex-1 text-[11px] font-display font-bold text-theme-primary truncate">{name}</span>
                  <span className="text-[10px] font-display font-bold text-theme-muted">{points.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
            <button className="mt-2.5 w-full py-1.5 text-[9px] font-display font-bold text-theme-accent hover:text-white hover:bg-theme-accent rounded-lg transition-all text-center border border-theme-border hover:border-theme-accent">
              View Full Leaderboard →
            </button>
          </div>
        </div>

      </div>

      {/* Streak Protection (rectangle - full width) */}
      <StreakSystem user={user} onBuyFreeze={onBuyFreeze} onUseFreeze={onUseFreeze} />

      {/* Syndicate Ascent Dashboard */}
      <SyndicateDashboardCard
        team={[
          { id: "liam", name: "Liam Carter", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80", streak: 12, points: 18950, checkInStatus: "done" },
          { id: "jessica", name: "Jessica Vance", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80", streak: 9, points: 16880, checkInStatus: "done" },
          { id: user.id, name: user.name, avatar: user.avatar, streak: user.streak, points: user.points, checkInStatus: user.lastCheckIn === new Date().toISOString().split('T')[0] ? "done" : "pending" },
          { id: "noah", name: "Noah Reynolds", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80", streak: 8, points: 17430, checkInStatus: "pending" },
        ]}
        onRescue={(member) => onRescueStreak && onRescueStreak("group1", member.name)}
      />

      {/* Features Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star size={16} className="text-theme-accent" />
          <h2 className="text-base font-display font-extrabold text-theme-primary tracking-tight">Everything in FitCircle</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card flex items-start gap-3 card-hover">
              <div className="p-2 bg-theme-accent-light text-theme-accent rounded-xl shrink-0">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs font-display font-bold text-theme-primary">{label}</p>
                <p className="text-[10px] text-theme-secondary mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="card text-center py-6">
        <p className="text-sm font-display font-extrabold text-theme-primary">Ready to get started?</p>
        <p className="text-xs text-theme-secondary mt-1 max-w-md mx-auto">
          Head over to the Health Dashboard to log your first workout, or check out the Social Feed to see what others are doing.
        </p>
      </div>

    </div>
  );
}
