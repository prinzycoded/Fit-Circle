import { useState } from "react";
import AuthForm from "./AuthForm";
import { Dumbbell, Trophy, Users, Target, Compass, Award, Shield, Star, Flame, Zap, BarChart3, Megaphone, UserCheck, DollarSign } from "lucide-react";

const memberFeatures = [
  { icon: Target, label: "Health Dashboard", desc: "Log runs, lifts, and yoga sessions. See weekly trends and earn XP for every active minute." },
  { icon: Compass, label: "Consistency Race", desc: "Complete 20 monthly routines and unlock discount codes for real gear and supplements." },
  { icon: Users, label: "Social Feed", desc: "Post workout selfies, comment on friends' PRs, and reshare your wins to the gym feed." },
  { icon: Trophy, label: "Leaderboards", desc: "Rank against members in your gym by steps, active minutes, and streak length." },
  { icon: Award, label: "Achievement Badges", desc: "Hit 10K steps in a day, maintain a 5-day streak — badges pop automatically." },
  { icon: Shield, label: "Accountability Groups", desc: "Join morning-run crews or weekend warrior squads. Nudge members who fall behind." },
];

const ownerFeatures = [
  { icon: BarChart3, label: "Gym Dashboard", desc: "See active members, today's check-ins, and month-over-month revenue at a glance." },
  { icon: Users, label: "Member Management", desc: "Browse member profiles, membership plans, and individual activity history." },
  { icon: Megaphone, label: "Announcements", desc: "Broadcast class schedule changes, promotions, or shoutout top performers." },
  { icon: Shield, label: "Challenges", desc: "Launch gym-wide step or hydration challenges with reward points you set." },
  { icon: DollarSign, label: "Revenue Insights", desc: "Track Basic, Standard, Premium plan adoption and monthly recurring revenue." },
  { icon: UserCheck, label: "Engagement", desc: "Monitor daily active rate, average streak, and members at risk of churn." },
];

export default function LoginPage({ onLoginSuccess }) {
  const [role, setRole] = useState("client");
  const features = role === "owner" ? ownerFeatures : memberFeatures;

  return (
    <div className="min-h-screen bg-theme-bg text-theme-primary antialiased font-body bg-mesh">
      <div className="bg-noise"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start w-full">
          {/* Left: Brand / Features — takes 3 of 5 cols */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-theme-accent to-orange-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-theme-accent/20">
                {role === "owner" ? <Shield size={20} /> : <Dumbbell size={20} className="rotate-45" />}
              </div>
              <div>
                <span className="text-xl font-display font-extrabold tracking-tight text-theme-primary">FitCircle</span>
                <p className="text-[10px] text-theme-muted font-medium uppercase tracking-widest">
                  {role === "owner" ? "Gym Management" : "Gamified Fitness Social"}
                </p>
              </div>
            </div>

            {/* Hero Card — compact */}
            <div className="rounded-2xl text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D95C42 0%, #1D202B 100%)' }}>
              <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 px-6 py-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center ring-2 ring-white/10">
                    {role === "owner" ? <Shield size={15} /> : <Flame size={15} className="text-theme-warning" />}
                  </div>
                  <span className="text-xs font-display font-extrabold tracking-tight">
                    {role === "owner" ? "Owner Portal" : "Member Dashboard"}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight leading-tight">
                  {role === "owner" ? (
                    <>Run your gym,{" "}<span className="text-transparent bg-clip-text bg-linear-to-r from-theme-warning to-yellow-300">grow your community.</span></>
                  ) : (
                    <>Turn sweat into{" "}<span className="text-transparent bg-clip-text bg-linear-to-r from-theme-warning to-yellow-300">rewards.</span></>
                  )}
                </h1>
                <p className="text-white/70 text-xs leading-relaxed mt-2 max-w-md">
                  {role === "owner"
                    ? "Analytics, challenges, announcements, and engagement tracking — everything to build a thriving gym community."
                    : "Earn XP for every rep. Ignite streaks, collect badges, climb leaderboards, and unlock real discounts."}
                </p>

                {/* Live Stats Bar — moved up, pills removed to save space */}
                {role === "client" && (
                  <div className="mt-4 flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-[9px] text-white/50 font-medium">1,240 active</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy size={10} className="text-yellow-300" />
                      <span className="text-[9px] text-white/50 font-medium">14K+ pts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={10} className="text-blue-300" />
                      <span className="text-[9px] text-white/50 font-medium">48 members</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role toggle + Features combined row */}
            <div className="flex rounded-xl overflow-hidden border border-theme-border bg-theme-surface/60 backdrop-blur-sm p-0.5">
              <button
                onClick={() => setRole("client")}
                className={`flex-1 py-2 text-[10px] font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-lg ${
                  role === "client"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary"
                }`}
              >
                <Dumbbell size={12} />
                Member
              </button>
              <button
                onClick={() => setRole("owner")}
                className={`flex-1 py-2 text-[10px] font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-lg ${
                  role === "owner"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary"
                }`}
              >
                <Shield size={12} />
                Gym Owner
              </button>
            </div>

            {/* Features Grid — 3 columns for rectangular cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {features.map(({ icon: Icon, label, desc }, i) => (
                <div key={label} className="group rounded-lg border border-theme-border bg-theme-surface/40 backdrop-blur-sm p-3 hover:bg-theme-surface hover:border-theme-accent/20 hover:shadow-sm transition-all flex flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 rounded-md bg-theme-accent-light text-theme-accent shrink-0">
                      <Icon size={13} />
                    </div>
                    <p className="text-[11px] font-display font-bold text-theme-primary leading-tight">{label}</p>
                  </div>
                  <p className="text-[9px] text-theme-secondary leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Auth Form — takes 2 of 5 cols */}
          <div className="lg:col-span-2">
            <AuthForm role={role} onLoginSuccess={onLoginSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
