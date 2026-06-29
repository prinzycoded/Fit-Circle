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

export default function LoginPage() {
  const [role, setRole] = useState("client");
  const features = role === "owner" ? ownerFeatures : memberFeatures;

  return (
    <div className="min-h-screen bg-theme-bg text-theme-primary antialiased font-body bg-mesh">
      <div className="bg-noise"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start w-full">
          {/* Left: Brand / Features */}
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-theme-accent to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-theme-accent/20">
                {role === "owner" ? <Shield size={24} /> : <Dumbbell size={24} className="rotate-45" />}
              </div>
              <div>
                <span className="text-2xl font-display font-extrabold tracking-tight text-theme-primary">FitCircle</span>
                <p className="text-xs text-theme-muted font-medium uppercase tracking-widest mt-0.5">
                  {role === "owner" ? "Gym Management" : "Gamified Fitness Social"}
                </p>
              </div>
            </div>

            {/* Hero Card */}
            <div className="rounded-3xl text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D95C42 0%, #1D202B 100%)' }}>
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
              <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -left-10 bottom-0 w-56 h-56 bg-theme-warning/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 px-8 pt-10 pb-12">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/10">
                    {role === "owner" ? <Shield size={18} /> : <Flame size={18} className="text-theme-warning" />}
                  </div>
                  <div>
                    <span className="text-sm font-display font-extrabold tracking-tight">
                      {role === "owner" ? "Owner Portal" : "Member Dashboard"}
                    </span>
                    <p className="text-[9px] text-white/50 font-medium uppercase tracking-wider">Your hub</p>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight leading-tight">
                  {role === "owner" ? (
                    <>Run your gym,{" "}<span className="text-transparent bg-clip-text bg-linear-to-r from-theme-warning to-yellow-300">grow your community.</span></>
                  ) : (
                    <>Turn sweat into{" "}<span className="text-transparent bg-clip-text bg-linear-to-r from-theme-warning to-yellow-300">rewards.</span></>
                  )}
                </h1>
                <p className="text-white/70 text-sm leading-relaxed mt-3 max-w-md">
                  {role === "owner"
                    ? "FitCircle equips you with member analytics, challenge tools, announcements, and engagement tracking — everything you need to build a thriving gym community."
                    : "Every rep, run, and stretch earns you XP. Ignite streaks, collect badges, climb leaderboards, and unlock real discounts — all while your gym community cheers you on."}
                </p>

                {/* Pill Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-5">
                  {(role === "owner"
                    ? [
                        { icon: BarChart3, label: "Analytics", color: "text-blue-300" },
                        { icon: Shield, label: "Challenges", color: "text-purple-300" },
                        { icon: UserCheck, label: "Engagement", color: "text-emerald-300" },
                        { icon: Megaphone, label: "Broadcasts", color: "text-orange-300" },
                      ]
                    : [
                        { icon: Flame, label: "Streaks", color: "text-orange-300" },
                        { icon: Trophy, label: "Rewards", color: "text-yellow-300" },
                        { icon: Users, label: "Community", color: "text-blue-300" },
                        { icon: Award, label: "Badges", color: "text-emerald-300" },
                        { icon: Zap, label: "Challenges", color: "text-purple-300" },
                      ]
                  ).map(({ icon: Icon, label, color }) => (
                    <span key={label} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] font-bold border border-white/10 hover:bg-white/20 transition-all cursor-default">
                      <Icon size={11} className={color} />
                      {label}
                    </span>
                  ))}
                </div>

                {/* Live Stats Bar */}
                {role === "client" && (
                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-[10px] text-white/60 font-medium">1,240 active today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={12} className="text-yellow-300" />
                      <span className="text-[10px] text-white/60 font-medium">14K+ pts awarded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-blue-300" />
                      <span className="text-[10px] text-white/60 font-medium">48 members</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role toggle */}
            <div className="flex rounded-xl overflow-hidden border border-theme-border bg-theme-surface/60 backdrop-blur-sm p-1">
              <button
                onClick={() => setRole("client")}
                className={`flex-1 py-2.5 text-xs font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 rounded-lg ${
                  role === "client"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary"
                }`}
              >
                <Dumbbell size={14} />
                I'm a Member
              </button>
              <button
                onClick={() => setRole("owner")}
                className={`flex-1 py-2.5 text-xs font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 rounded-lg ${
                  role === "owner"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary"
                }`}
              >
                <Shield size={14} />
                I'm a Gym Owner
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map(({ icon: Icon, label, desc }, i) => (
                <div key={label} className="group relative overflow-hidden rounded-xl border border-theme-border bg-theme-surface/40 backdrop-blur-sm p-4 hover:bg-theme-surface hover:border-theme-accent/20 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-theme-accent-light text-theme-accent shrink-0 shadow-xs">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-display font-bold text-theme-primary leading-tight">{label}</p>
                      <p className="text-[11px] text-theme-secondary mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Auth Form */}
          <div className="lg:mt-8">
            <AuthForm role={role} />
          </div>
        </div>
      </div>
    </div>
  );
}
