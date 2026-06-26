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
  LogOut,
} from "lucide-react";
import DailyCheckIn from "./DailyCheckIn";
import StreakSystem from "./StreakSystem";
import AuthForm from "./AuthForm";
import { useAuth } from "../contexts/AuthContext";

export default function WelcomePage({ user, onCheckIn, onBuyFreeze, onUseFreeze }) {
  const { firebaseUser, logout } = useAuth();

  if (!firebaseUser) {
    return <AuthForm />;
  }
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

      {/* Hero Section */}
      <div className="rounded-3xl p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D95C42 0%, #1D202B 100%)' }}>
        <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center p-4">
          <Dumbbell size={180} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Dumbbell size={20} className="rotate-45" />
            </div>
            <span className="text-xl font-display font-extrabold tracking-tight">FitCircle</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mt-2 max-w-2xl">
            Your fitness journey, gamified.
          </h1>
          <p className="text-white/70 text-sm md:text-base mt-3 max-w-xl font-body leading-relaxed">
            FitCircle is a social fitness platform that turns your daily workouts into a game. 
            Earn points, build streaks, unlock badges, compete on leaderboards, and win real 
            discounts — all while staying accountable with friends and your gym community.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-xs font-bold">
              <Flame size={13} className="text-theme-warning" />
              Streak Tracking
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-xs font-bold">
              <Trophy size={13} className="text-theme-warning" />
              Reward System
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-xs font-bold">
              <Users size={13} className="text-theme-warning" />
              Community
            </span>
          </div>
        </div>
      </div>

      {/* Signed-in User Info */}
      <div className="card flex items-center justify-between gap-3" style={{ borderRadius: 12, padding: "12px 16px" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-theme-accent/20 flex items-center justify-center text-theme-accent font-display font-bold text-xs">
            {firebaseUser.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-display font-bold text-theme-primary">{firebaseUser.email}</p>
            <p className="text-[9px] text-theme-muted font-medium uppercase tracking-wider">Signed in</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-border/40 hover:bg-theme-border text-theme-muted hover:text-theme-primary text-[10px] font-display font-bold transition-all cursor-pointer"
        >
          <LogOut size={12} />
          Sign Out
        </button>
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
