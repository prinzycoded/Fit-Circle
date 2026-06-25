import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  Calendar,
  Dumbbell,
  Activity,
  DollarSign,
  Target,
  Flame,
  Search,
  ChevronRight,
  Crown,
  Medal,
  MoreHorizontal,
  Eye,
  Star,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Award,
  Shield,
  Bell,
} from "lucide-react";

export default function OwnerDashboard({ gym, members, onViewMember }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingMember, setViewingMember] = useState(null);
  const [sortBy, setSortBy] = useState("points");

  const filteredMembers = members
    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "streak") return b.streak - a.streak;
      if (sortBy === "checkIns") return b.checkInsThisMonth - a.checkInsThisMonth;
      return 0;
    });

  const stats = [
    { label: "Total Members", value: gym.totalMembers, icon: Users, color: "text-theme-support", bg: "bg-theme-support-light", change: "+12% this quarter" },
    { label: "Active Today", value: gym.activeToday, icon: Activity, color: "text-theme-success", bg: "bg-theme-success-light", change: `${Math.round(gym.activeToday / gym.totalMembers * 100)}% engagement` },
    { label: "Avg Streak", value: `${gym.avgMemberStreak}d`, icon: Flame, color: "text-theme-warning", bg: "bg-theme-warning-light", change: "Across all members" },
    { label: "Monthly Revenue", value: `$${gym.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: "text-theme-accent", bg: "bg-theme-accent-light", change: "From membership plans" },
  ];

  const MemberDetailModal = ({ member, onClose }) => (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card max-w-lg w-full space-y-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img referrerPolicy="no-referrer" src={member.avatar} alt="" className="w-14 h-14 rounded-2xl border border-theme-border" />
            <div>
              <h3 className="text-lg font-display font-extrabold text-theme-primary">{member.name}</h3>
              <p className="text-xs text-theme-muted">{member.email}</p>
              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                member.plan === "Premium" ? "bg-theme-warning-light text-theme-warning" :
                member.plan === "Standard" ? "bg-theme-support-light text-theme-support" :
                "bg-theme-border/40 text-theme-muted"
              }`}>{member.plan} Plan</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-theme-support-light rounded-xl p-3 text-center">
            <p className="text-xl font-display font-extrabold text-theme-support">{member.points.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">Points</p>
          </div>
          <div className="bg-theme-warning-light rounded-xl p-3 text-center">
            <p className="text-xl font-display font-extrabold text-theme-warning">{member.streak}</p>
            <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">Streak</p>
          </div>
          <div className="bg-theme-accent-light rounded-xl p-3 text-center">
            <p className="text-xl font-display font-extrabold text-theme-accent">{member.checkInsThisMonth}</p>
            <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider mt-0.5">Check-ins</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <p className="text-xs font-display font-bold text-theme-primary uppercase tracking-wider">Today's Metrics</p>
          {[
            { label: "Steps", value: member.metrics.steps.toLocaleString(), goal: member.goals.stepGoal.toLocaleString(), pct: Math.round(member.metrics.steps / member.goals.stepGoal * 100) },
            { label: "Water", value: `${(member.metrics.water / 1000).toFixed(1)}L`, goal: `${(member.goals.waterGoal / 1000).toFixed(1)}L`, pct: Math.round(member.metrics.water / member.goals.waterGoal * 100) },
            { label: "Active Mins", value: `${member.metrics.activeMinutes}min`, goal: `${member.goals.activeMinutesGoal}min`, pct: Math.round(member.metrics.activeMinutes / member.goals.activeMinutesGoal * 100) },
          ].map(({ label, value, goal, pct }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs font-medium text-theme-secondary w-24">{label}</span>
              <div className="flex-1 progress-bar h-1.5">
                <div className="progress-bar-fill bg-theme-accent" style={{ width: `${Math.min(100, pct)}%` }}></div>
              </div>
              <span className="text-xs font-bold text-theme-primary w-32 text-right">{value} / {goal}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-theme-border text-xs text-theme-muted">
          <span className="flex items-center gap-1"><Calendar size={12} /> Joined {member.joined}</span>
          <span className={`flex items-center gap-1 ${member.status === "online" ? "text-theme-success" : ""}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${member.status === "online" ? "bg-theme-success" : "bg-theme-muted"}`}></span>
            {member.lastActive}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Gym Header */}
      <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1D202B 0%, #D95C42 100%)' }}>
        <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center p-4">
          <Dumbbell size={140} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-display font-bold uppercase tracking-widest backdrop-blur-sm">
                Owner Dashboard
              </span>
              <span className="bg-theme-accent/70 text-white text-xs px-3 py-1 rounded-full font-display font-bold flex items-center gap-1">
                <Shield size={11} />
                Admin
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mt-1">
              {gym.name}
            </h1>
            <p className="text-white/70 text-sm mt-1 max-w-md font-body">
              Manage members, track engagement, and grow your fitness community.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 self-start md:self-auto border border-white/10">
            <img referrerPolicy="no-referrer" src={gym.ownerAvatar} alt="" className="w-10 h-10 rounded-xl border border-white/30" />
            <div>
              <p className="text-xs text-white/60 font-medium">Gym Owner</p>
              <p className="text-sm font-display font-bold text-white">{gym.ownerName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, change }) => (
          <div key={label} className="card flex items-start gap-3 card-hover">
            <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-display font-extrabold text-theme-primary">{value}</p>
              <p className="text-xs font-bold text-theme-muted uppercase tracking-wider truncate">{label}</p>
              <p className="text-[10px] text-theme-secondary mt-0.5">{change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Membership Distribution + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-theme-accent" />
            <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Membership Distribution</h2>
          </div>
          <div className="space-y-3">
            {gym.plans.map((plan) => {
              const pct = Math.round(plan.members / gym.totalMembers * 100);
              const barColor = plan.name === "Premium" ? "bg-theme-warning" : plan.name === "Standard" ? "bg-theme-support" : "bg-theme-border";
              return (
                <div key={plan.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-display font-bold text-theme-primary">{plan.name}</span>
                    <span className="text-xs text-theme-muted">{plan.members} members · ${plan.members * plan.price}/mo</span>
                  </div>
                  <div className="progress-bar h-2">
                    <div className={`progress-bar-fill ${barColor}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card space-y-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-theme-accent" />
            <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Gym Goals</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-theme-primary">Total Capacity</span>
                <span className="text-theme-muted">{gym.totalMembers} / {gym.memberGoal}</span>
              </div>
              <div className="progress-bar h-2">
                <div className="progress-bar-fill bg-theme-support" style={{ width: `${Math.round(gym.totalMembers / gym.memberGoal * 100)}%` }}></div>
              </div>
              <p className="text-[10px] text-theme-secondary mt-1">Target: {gym.memberGoal} members</p>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-theme-primary">Monthly Active</span>
                <span className="text-theme-muted">{gym.activeToday} / {gym.monthlyActiveGoal}</span>
              </div>
              <div className="progress-bar h-2">
                <div className="progress-bar-fill bg-theme-accent" style={{ width: `${Math.round(gym.activeToday / gym.monthlyActiveGoal * 100)}%` }}></div>
              </div>
              <p className="text-[10px] text-theme-secondary mt-1">Target: {gym.monthlyActiveGoal} daily active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Member Management */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-theme-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-theme-accent" />
            <h2 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Member Management</h2>
            <span className="text-[10px] font-bold bg-theme-accent-light text-theme-accent px-2 py-0.5 rounded-full">{filteredMembers.length} active</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 bg-theme-bg border border-theme-border rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-accent"
              />
            </div>
            <div className="flex items-center gap-1 bg-theme-border/30 rounded-lg px-2 py-1.5 text-[10px] font-bold text-theme-muted">
              <BarChart3 size={12} />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent border-none text-theme-secondary font-bold text-[10px] focus:outline-none cursor-pointer"
              >
                <option value="points">Points</option>
                <option value="streak">Streak</option>
                <option value="checkIns">Check-ins</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-theme-border/50">
          {filteredMembers.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-theme-muted">No members match your search.</div>
          ) : (
            filteredMembers.map((member, idx) => (
              <div
                key={member.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-theme-border/10 transition-colors cursor-pointer"
                onClick={() => setViewingMember(member)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-display font-extrabold text-theme-muted w-5">{idx + 1}</span>
                  <img referrerPolicy="no-referrer" src={member.avatar} alt="" className="w-9 h-9 rounded-xl border border-theme-border shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-display font-bold text-theme-primary truncate">{member.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-theme-muted">
                      <span className={`inline-flex items-center gap-1 ${member.status === "online" ? "text-theme-success" : ""}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === "online" ? "bg-theme-success" : "bg-theme-muted"}`}></span>
                        {member.lastActive}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        member.plan === "Premium" ? "bg-theme-warning-light text-theme-warning" :
                        member.plan === "Standard" ? "bg-theme-support-light text-theme-support" :
                        "bg-theme-border/30 text-theme-muted"
                      }`}>{member.plan}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-display font-extrabold text-theme-primary">{member.points.toLocaleString()}</p>
                    <p className="text-[10px] text-theme-muted">pts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-display font-extrabold text-theme-warning">{member.streak}d</p>
                    <p className="text-[10px] text-theme-muted">streak</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-display font-extrabold text-theme-support">{member.checkInsThisMonth}</p>
                    <p className="text-[10px] text-theme-muted">check-ins</p>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setViewingMember(member); }}
                  className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted hover:text-theme-accent transition-colors cursor-pointer"
                >
                  <Eye size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-2.5 text-center text-[10px] font-bold text-theme-muted bg-theme-border/5">
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button className="card flex items-center gap-3 hover:bg-theme-accent-light/50 transition-colors text-left cursor-pointer">
          <div className="p-2 bg-theme-accent-light text-theme-accent rounded-xl">
            <Bell size={18} />
          </div>
          <div>
            <p className="text-xs font-display font-bold text-theme-primary">Send Announcement</p>
            <p className="text-[10px] text-theme-muted">Notify all members</p>
          </div>
        </button>
        <button className="card flex items-center gap-3 hover:bg-theme-support-light/50 transition-colors text-left cursor-pointer">
          <div className="p-2 bg-theme-support-light text-theme-support rounded-xl">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-xs font-display font-bold text-theme-primary">Create Challenge</p>
            <p className="text-[10px] text-theme-muted">Boost engagement</p>
          </div>
        </button>
        <button className="card flex items-center gap-3 hover:bg-theme-warning-light/50 transition-colors text-left cursor-pointer">
          <div className="p-2 bg-theme-warning-light text-theme-warning rounded-xl">
            <BarChart3 size={18} />
          </div>
          <div>
            <p className="text-xs font-display font-bold text-theme-primary">View Reports</p>
            <p className="text-[10px] text-theme-muted">Monthly analytics</p>
          </div>
        </button>
      </div>

      {/* Member detail modal */}
      {viewingMember && (
        <MemberDetailModal
          member={viewingMember}
          onClose={() => setViewingMember(null)}
        />
      )}

    </div>
  );
}
