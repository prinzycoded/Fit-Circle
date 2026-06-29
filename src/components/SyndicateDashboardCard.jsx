import React from "react";
import { Flame, Shield, Bell, Zap, Crown } from "lucide-react";

export default function SyndicateDashboardCard({ team, onRescue }) {
  if (!team || team.length === 0) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl text-white"
      style={{ background: "linear-gradient(135deg, #D95C42 0%, #1D202B 100%)" }}
    >
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 backdrop-blur-sm rounded-xl ring-1 ring-white/10">
              <Crown size={16} className="text-yellow-300" />
            </div>
            <div>
              <h3 className="text-sm font-display font-extrabold tracking-tight">The Syndicate Ascent</h3>
              <p className="text-[10px] text-white/60 font-medium flex items-center gap-1">
                <Shield size={9} />
                Team Accountability Contest
              </p>
            </div>
          </div>
          <span className="text-[9px] font-display font-bold text-yellow-300 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            <Zap size={9} className="inline mr-0.5" />
            Active
          </span>
        </div>

        {/* Team members */}
        <div className="space-y-2.5">
          {team.map((member, idx) => {
            const isPending = member.checkInStatus === "pending";
            return (
              <div
                key={member.id || idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  isPending
                    ? "bg-white/10 ring-1 ring-red-400/40"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/15"
                  />
                  {isPending && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center ring-2 ring-[#D95C42]">
                      <Bell size={7} className="text-white" />
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-display font-bold truncate">{member.name}</p>
                    {idx === 0 && (
                      <Crown size={10} className="text-yellow-300 shrink-0" />
                    )}
                    {isPending && (
                      <span className="text-[8px] font-display font-bold text-red-300 bg-red-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Flame size={10} className="text-orange-400" />
                      <span className="text-[10px] font-display font-bold text-orange-300">
                        {member.streak}
                      </span>
                      <span className="text-[9px] text-white/50 font-medium">day streak</span>
                    </div>
                    {member.points !== undefined && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="text-[10px] text-white/70 font-medium">
                          {member.points.toLocaleString()} pts
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* CTA */}
                {isPending ? (
                  <button
                    onClick={() => onRescue && onRescue(member)}
                    className="flex items-center gap-1 text-[9px] font-display font-bold text-white bg-red-500 hover:bg-red-600 active:bg-red-700 px-2.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer shadow-sm"
                  >
                    <Bell size={9} />
                    Nudge
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-[9px] font-display font-bold text-green-300 bg-green-500/15 px-2.5 py-1.5 rounded-lg shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Active
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer stat */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <p className="text-[10px] text-white/50 font-medium">
            Team Total: <span className="text-white font-bold">{team.reduce((s, m) => s + (m.streak || 0), 0)}</span> day streak
          </p>
          <p className="text-[10px] text-white/50 font-medium">
            <span className="text-yellow-300 font-bold">{team.filter(m => m.checkInStatus === "done").length}/{team.length}</span> checked in
          </p>
        </div>
      </div>
    </div>
  );
}
