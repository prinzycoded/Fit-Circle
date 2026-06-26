import { useState } from "react";
import AuthForm from "./AuthForm";
import { Dumbbell, Trophy, Users, Target, Compass, Award, Shield, Star, Flame, BarChart3, Megaphone, UserCheck, DollarSign } from "lucide-react";

const memberFeatures = [
  { icon: Target, label: "Health Dashboard", desc: "Track workouts, log activity, and monitor your fitness journey." },
  { icon: Compass, label: "Consistency Race", desc: "Complete monthly routines to unlock discount rewards and coupons." },
  { icon: Users, label: "Social Feed", desc: "Share progress, challenge friends, and stay motivated together." },
  { icon: Trophy, label: "Leaderboards", desc: "Compete with members and climb the rankings every week." },
  { icon: Award, label: "Achievement Badges", desc: "Earn badges by hitting milestones and completing challenges." },
  { icon: Shield, label: "Accountability Groups", desc: "Join groups, nudge members, and crush team goals." },
];

const ownerFeatures = [
  { icon: BarChart3, label: "Gym Dashboard", desc: "Overview of member activity, revenue, and engagement metrics." },
  { icon: Users, label: "Member Management", desc: "View member profiles, plans, and activity stats." },
  { icon: Megaphone, label: "Announcements", desc: "Send announcements and shoutouts to all members." },
  { icon: Shield, label: "Challenges", desc: "Create gym-wide challenges to boost member motivation." },
  { icon: DollarSign, label: "Revenue Insights", desc: "Track plans, pricing tiers, and monthly revenue." },
  { icon: UserCheck, label: "Engagement", desc: "Monitor check-ins, streaks, and active member count." },
];

export default function LoginPage() {
  const [role, setRole] = useState("client");
  const features = role === "owner" ? ownerFeatures : memberFeatures;

  return (
    <div className="min-h-screen bg-theme-bg text-theme-primary antialiased font-body bg-mesh">
      <div className="bg-noise"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Brand / Features */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-theme-accent rounded-xl flex items-center justify-center text-white font-display font-extrabold shadow-sm">
                {role === "owner" ? <Shield size={24} /> : <Dumbbell size={24} className="rotate-45" />}
              </div>
              <div>
                <span className="text-2xl font-display font-extrabold tracking-tight text-theme-primary">FitCircle</span>
                <p className="text-xs text-theme-muted font-medium uppercase tracking-widest mt-0.5">
                  {role === "owner" ? "Gym Management" : "Gamified Fitness Social"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D95C42 0%, #1D202B 100%)' }}>
              <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center p-4">
                {role === "owner" ? <Shield size={180} /> : <Dumbbell size={180} />}
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={20} className="text-theme-warning" />
                  <span className="text-lg font-display font-extrabold tracking-tight">
                    {role === "owner" ? "Manage your gym, empower your community." : "Your fitness journey, gamified."}
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {role === "owner"
                    ? "FitCircle gives you the tools to manage members, create challenges, send announcements, and track engagement — all in one place."
                    : "FitCircle turns your daily workouts into a game. Earn points, build streaks, unlock badges, compete on leaderboards, and win real discounts."}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {(role === "owner"
                    ? ["Member Analytics", "Challenges", "Engagement"]
                    : ["Streak Tracking", "Reward System", "Community"]
                  ).map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-bold">
                      {tag === "Streak Tracking" || tag === "Member Analytics" ? <Flame size={11} className="text-theme-warning" /> : null}
                      {tag === "Reward System" || tag === "Challenges" ? <Trophy size={11} className="text-theme-warning" /> : null}
                      {tag === "Community" || tag === "Engagement" ? <Users size={11} className="text-theme-warning" /> : null}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Role toggle */}
            <div className="flex rounded-xl overflow-hidden border border-theme-border bg-theme-surface/60">
              <button
                onClick={() => setRole("client")}
                className={`flex-1 py-2.5 text-xs font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
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
                className={`flex-1 py-2.5 text-xs font-display font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  role === "owner"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary"
                }`}
              >
                <Shield size={14} />
                I'm a Gym Owner
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* Right: Auth Form */}
          <div>
            <AuthForm role={role} />
          </div>
        </div>
      </div>
    </div>
  );
}
