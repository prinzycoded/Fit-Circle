import React, { useState } from "react";
import { 
  Users, 
  Trophy, 
  TrendingUp,
  Bell,
  ChevronRight,
  UserPlus
} from "lucide-react";

export default function AccountabilityGroups({ groups, currentUserId, onJoinGroup, onSendNudge }) {
  const [expandedGroup, setExpandedGroup] = useState(null);

  if (!groups || groups.length === 0) {
    return (
      <div id="accountability-groups-section" className="space-y-6">
        <div className="card text-center py-12">
          <Users size={40} className="mx-auto text-theme-muted mb-3" />
          <h3 className="text-lg font-display font-extrabold text-theme-primary mb-1">No Groups Yet</h3>
          <p className="text-sm text-theme-secondary mb-6 font-body">Join or create an accountability group to stay motivated with friends.</p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover rounded-xl transition-all cursor-pointer">
            <UserPlus size={16} />
            Find a Group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="accountability-groups-section" className="space-y-6">

      {/* Header */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-support-light text-theme-support rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-base font-display font-extrabold text-theme-primary tracking-tight">Accountability Groups</h2>
            <p className="text-xs text-theme-secondary font-body">{groups.length} group{(groups.length > 1 ? 's' : '')} active</p>
          </div>
        </div>
        <button className="px-3.5 py-1.5 text-xs font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover rounded-xl transition-all flex items-center gap-1.5 cursor-pointer">
          <UserPlus size={14} />
          Join New
        </button>
      </div>

      {/* Group cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => {
          const isMember = group.members?.some(m => m.id === currentUserId);
          const myRank = group.members?.findIndex(m => m.id === currentUserId) + 1;

          return (
            <div
              key={group.id}
              className={`card flex flex-col ${!isMember ? 'border-theme-border/80' : ''}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-display font-extrabold shadow-sm ${group.gradient || 'bg-theme-support'}`}
                    style={group.gradient ? { background: group.gradient } : {}}>
                    {group.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-theme-primary">{group.name}</h3>
                    <p className="text-[10px] text-theme-secondary font-medium font-body">{group.members?.length || 0} members</p>
                  </div>
                </div>

                {isMember ? (
                  <span className="text-[10px] font-display font-bold text-theme-success bg-theme-success-light px-2 py-0.5 rounded-full">
                    Joined
                  </span>
                ) : (
                  <button
                    id={`join-group-btn-${group.id}`}
                    onClick={() => onJoinGroup(group.id)}
                    className="px-3 py-1 text-[10px] font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover rounded-xl transition-all cursor-pointer"
                  >
                    Join
                  </button>
                )}
              </div>

              {/* Group stats row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-xs">
                  <TrendingUp size={13} className="text-theme-accent" />
                  <span className="font-bold text-theme-primary">{group.groupChallenge?.current || 0}</span>
                  <span className="text-theme-muted text-[10px]">pts</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Trophy size={13} className="text-theme-warning" />
                  <span className="font-bold text-theme-primary">#{group.weeklyRanking?.findIndex(m => m.id === currentUserId) + 1 || '-'}</span>
                  <span className="text-theme-muted text-[10px]">rank</span>
                </div>
                {myRank > 0 && (
                  <div className="flex items-center gap-1.5 text-xs ml-auto">
                    <span className="text-theme-muted text-[10px]">Your rank:</span>
                    <span className="font-bold text-theme-primary">#{myRank}</span>
                  </div>
                )}
              </div>

              {/* Member avatars */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex -space-x-1.5">
                  {group.members?.slice(0, 4).map((m, i) => (
                    <img
                      key={i}
                      referrerPolicy="no-referrer"
                      src={m.avatar}
                      alt={m.name}
                      className="w-7 h-7 rounded-full border-2 border-theme-surface"
                    />
                  ))}
                  {group.members?.length > 4 && (
                    <div className="w-7 h-7 rounded-full border-2 border-theme-surface bg-theme-border/30 text-[10px] font-display font-extrabold text-theme-muted flex items-center justify-center">
                      +{group.members.length - 4}
                    </div>
                  )}
                </div>
                {isMember && (
                  <button
                    id={`nudge-btn-${group.id}`}
                    onClick={() => onSendNudge(group.id)}
                    className="ml-auto text-theme-muted hover:text-theme-accent p-1.5 rounded-lg hover:bg-theme-accent-light transition-colors cursor-pointer"
                    title="Send nudge to group"
                  >
                    <Bell size={14} />
                  </button>
                )}
              </div>

              {/* Expand / collapse member details */}
              <button
                onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                className="flex items-center justify-center gap-1 text-[10px] font-bold text-theme-muted hover:text-theme-primary py-1 border-t border-theme-border/40 mt-1 transition-colors cursor-pointer"
              >
                <Users size={11} />
                <span>View members</span>
                <ChevronRight size={11} className={`transition-transform ${expandedGroup === group.id ? 'rotate-90' : ''}`} />
              </button>

              {expandedGroup === group.id && (
                <div className="mt-2 space-y-1.5">
                  {group.members?.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded-xl bg-theme-border/20">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-display font-extrabold text-theme-muted w-4">{idx + 1}.</span>
                        <img referrerPolicy="no-referrer" src={m.avatar} alt="" className="w-6 h-6 rounded-full border border-theme-border" />
                        <span className="text-xs font-display font-bold text-theme-primary">{m.name}</span>
                      </div>
                          <span className="text-[10px] font-bold text-theme-muted">{m.weeklyMinutes || 0} min</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick nudge */}
              {isMember && (
                <button
                  id={`quick-nudge-${group.id}`}
                  onClick={() => onSendNudge(group.id)}
                  className="mt-2 w-full py-2 text-xs font-display font-bold text-theme-accent bg-theme-accent-light hover:bg-theme-accent-light/80 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell size={12} />
                  Send Nudge
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
