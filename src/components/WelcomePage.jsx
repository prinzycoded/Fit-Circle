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
} from "lucide-react";
import DailyCheckIn from "./DailyCheckIn";
import StreakSystem from "./StreakSystem";

export default function WelcomePage({ user, badges, onCheckIn, onBuyFreeze, onUseFreeze }) {
  const features = [
    { icon: Target, label: "Health Dashboard", desc: "Track workouts, log activity, and monitor your fitness journey." },
    { icon: Compass, label: "Consistency Race", desc: "Complete monthly routines to unlock discount rewards and coupons." },
    { icon: Users, label: "Social Feed", desc: "Share progress, challenge friends, and stay motivated together." },
    { icon: Trophy, label: "Leaderboards", desc: "Compete with members and climb the rankings every week." },
    { icon: Award, label: "Achievement Badges", desc: "Earn badges by hitting milestones and completing challenges." },
    { icon: Shield, label: "Accountability Groups", desc: "Join groups, nudge members, and crush team goals." },
  ];

  const routinesPct = Math.min(100, Math.round((user.routinesCompletedThisMonth / user.routineTargetMonth) * 100));

  return (
    <div className="space-y-8">

      {/* Welcome Hero */}
      <div className="rounded-3xl text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D95C42 0%, #1D202B 100%)' }}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-8 bottom-0 w-48 h-48 bg-theme-warning/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 px-8 pt-8 pb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/10">
              <Dumbbell size={20} className="rotate-45" />
            </div>
            <span className="text-xl font-display font-extrabold tracking-tight">FitCircle</span>
            <span className="ml-2 px-2.5 py-0.5 bg-theme-warning/20 text-theme-warning text-[9px] font-bold rounded-full uppercase tracking-wider">v2.0</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3">
              <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight leading-tight">
                Your fitness journey,{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-theme-warning to-yellow-300">
                  gamified.
                </span>
              </h1>
              <p className="text-white/70 text-sm md:text-base mt-3 max-w-xl font-body leading-relaxed">
                FitCircle transforms every workout into a quest. Earn{" "}
                <span className="text-white font-bold">XP points</span>, ignite{" "}
                <span className="text-white font-bold">streaks</span>, collect{" "}
                <span className="text-white font-bold">badges</span>, and climb the{" "}
                <span className="text-white font-bold">leaderboards</span> — all while 
                staying accountable with your gym community.
              </p>
              
              <div className="flex flex-wrap items-center gap-2 mt-5">
                {[
                  { icon: Flame, label: "Streak Tracking", color: "text-orange-300" },
                  { icon: Trophy, label: "Reward System", color: "text-yellow-300" },
                  { icon: Users, label: "Community", color: "text-blue-300" },
                  { icon: Zap, label: "Live Challenges", color: "text-purple-300" },
                  { icon: Award, label: "Achievements", color: "text-emerald-300" },
                ].map(({ icon: Icon, label, color }) => (
                  <span key={label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] font-bold border border-white/10 hover:bg-white/20 transition-all">
                    <Icon size={12} className={color} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {[
                  { value: user.points.toLocaleString(), label: "Points Earned", icon: Trophy },
                  { value: `${user.streak}`, label: "Day Streak", icon: Flame },
                  { value: `${user.routinesCompletedThisMonth}`, label: "Workouts Done", icon: Zap },
                  { value: `${(badges || []).filter(b => b.unlocked).length}`, label: "Badges Unlocked", icon: Award },
                ].map(({ value, label, icon: Icon }) => (
                  <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                    <Icon size={20} className="mx-auto text-theme-warning mb-1.5" />
                    <p className="text-xl font-display font-extrabold">{value}</p>
                    <p className="text-[9px] text-white/60 font-medium uppercase tracking-wider mt-0.5">{label}</p>
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

        {/* Consistency Tracker (compact) */}
        <div className="card flex flex-col justify-between" style={{ borderRadius: 12, padding: 16 }}>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-display font-bold uppercase text-theme-muted tracking-widest mb-2">
              <Compass size={11} className="text-theme-accent" />
              <span>Consistency Track</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-display font-extrabold text-theme-primary">
                {user.routinesCompletedThisMonth} / {user.routineTargetMonth}
              </span>
              <span className="text-[9px] font-display font-extrabold text-theme-support bg-theme-support-light px-2 py-0.5 rounded-full">
                {routinesPct}%
              </span>
            </div>
            <p className="text-[9px] text-theme-muted font-medium mt-0.5 uppercase tracking-wide">Workouts Completed This Month</p>
          </div>
          <div className="mt-3">
            <div className="progress-bar">
              <div className="progress-bar-fill bg-theme-accent" style={{ width: `${routinesPct}%` }}></div>
            </div>
            <p className="text-[9px] text-theme-secondary font-medium mt-1.5">
              {user.routinesCompletedThisMonth >= 12
                ? "Silver Tier Coupon unlocked! Climb to Gold to get 30% off!"
                : "Complete 5 more routine days to unlock Bronze (10% Off) tier!"}
            </p>
          </div>
        </div>

      </div>

      {/* Streak Protection (rectangle - full width) */}
      <StreakSystem user={user} onBuyFreeze={onBuyFreeze} onUseFreeze={onUseFreeze} />

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
