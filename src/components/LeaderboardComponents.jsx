import React, { useState } from "react";
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Crown,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter
} from "lucide-react";

export default function LeaderboardComponents({ leaderboardData, currentUserId }) {
  const [activeTab, setActiveTab] = useState("Overall");
  const tabs = ["Overall", "Monthly", "Friends"];

  const normalizeEntry = (e) => ({
    ...e,
    points: typeof e.points === "number" ? e.points : (e.points?.month || e.points?.week || e.points?.today || 0),
    stats: e.stats || `${e.streak || 0}d streak`,
    badges: e.badges || 0,
    change: e.change ?? 0,
    rankChange: e.rankChange,
  });

  const getFilteredData = () => {
    const raw = activeTab === "Friends" ? leaderboardData.slice(0, 5) : leaderboardData;
    return raw.map(normalizeEntry);
  };

  const data = getFilteredData();
  const first = data[0];
  const second = data[1];
  const rest = data.slice(2);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="text-theme-warning" size={16} />;
      case 2: return <Medal className="text-theme-support" size={16} />;
      case 3: return <Medal className="text-theme-muted" size={16} />;
      default: return null;
    }
  };

  const getTrendIcon = (change) => {
    if (!change) return <Minus size={12} className="text-theme-muted" />;
    if (change > 0) return <ArrowUp size={12} className="text-theme-success" />;
    return <ArrowDown size={12} className="text-theme-accent" />;
  };

  return (
    <div id="leaderboard-section" className="space-y-6">

      {/* Header */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="p-2.5 bg-theme-warning-light text-theme-warning rounded-xl">
            <Trophy size={20} />
          </div>
          <div>
            <h2 className="text-base font-display font-extrabold text-theme-primary tracking-tight">Leaderboard</h2>
            <p className="text-xs text-theme-secondary font-body">See who is leading the pack this month</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-display font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-theme-accent text-white"
                  : "bg-theme-border/30 text-theme-secondary hover:bg-theme-border/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      {first && (
        <div id="podium-section" className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-theme-accent" />
            <h3 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">Top Performers</h3>
          </div>
          <div className="flex items-end justify-center gap-2 sm:gap-4 py-3 flex-wrap">
            {second && (
              <div className="text-center flex flex-col items-center">
                <img referrerPolicy="no-referrer" src={second.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-theme-support shadow-md" />
                <p className="text-xs font-display font-bold text-theme-primary mt-1.5">{second.name}</p>
                <p className="text-[10px] text-theme-muted">{second.points.toLocaleString()} pts</p>
                <div className="mt-1 bg-theme-support-light text-theme-support text-[10px] font-display font-extrabold rounded-full px-2.5 py-0.5 flex items-center gap-1">
                  <Medal size={10} />
                  <span>2nd</span>
                </div>
              </div>
            )}
            <div className="text-center flex flex-col items-center -mt-4">
              <Crown size={24} className="text-theme-warning" />
              <img referrerPolicy="no-referrer" src={first.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-theme-warning shadow-lg mt-1" />
              <p className="text-sm font-display font-extrabold text-theme-primary mt-1.5">{first.name}</p>
              <p className="text-xs text-theme-muted">{first.points.toLocaleString()} pts</p>
              <div className="mt-1 bg-theme-warning-light text-theme-warning text-[10px] font-display font-extrabold rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <Crown size={10} />
                <span>1st</span>
              </div>
            </div>
            {data[2] && (
              <div className="text-center flex flex-col items-center">
                <img referrerPolicy="no-referrer" src={data[2].avatar} alt="" className="w-10 h-10 rounded-full border-2 border-theme-border shadow-md" />
                <p className="text-xs font-display font-bold text-theme-primary mt-1.5">{data[2].name}</p>
                <p className="text-[10px] text-theme-muted">{data[2].points.toLocaleString()} pts</p>
                <div className="mt-1 bg-theme-border/50 text-theme-muted text-[10px] font-display font-extrabold rounded-full px-2.5 py-0.5 flex items-center gap-1">
                  <Medal size={10} />
                  <span>3rd</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-theme-border flex items-center justify-between">
          <span className="text-xs font-display font-extrabold text-theme-primary uppercase tracking-widest">
            {activeTab === "Friends" ? "Friend Standings" : "All Members"}
          </span>
          <div className="flex items-center gap-1 bg-theme-border/30 rounded-lg px-2 py-1 text-theme-muted cursor-pointer">
            <Filter size={12} />
            <span className="text-[10px] font-bold uppercase">Filter</span>
          </div>
        </div>

        {rest.map((entry, idx) => {
          const rank = idx + 3;
          const isCurrent = entry.id === currentUserId;
          return (
            <div
              id={`leaderbaord-row-${entry.id}`}
              key={entry.id}
              className={`flex items-center justify-between px-5 py-3 border-b border-theme-border/50 transition-colors ${
                isCurrent ? 'bg-theme-accent-light/20' : 'bg-transparent hover:bg-theme-border/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 text-center">
                  {getRankIcon(rank) ? (
                    <div className="flex items-center justify-center gap-1">
                      {getRankIcon(rank)}
                      <span className="text-xs font-display font-extrabold text-theme-primary">{rank}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-display font-bold text-theme-muted">{rank}</span>
                  )}
                </div>
                <img referrerPolicy="no-referrer" src={entry.avatar} alt="" className="w-8 h-8 rounded-full border border-theme-border" />
                <div>
                  <p className="text-xs font-display font-bold text-theme-primary">
                    {entry.name}{isCurrent && <span className="ml-1 text-[10px] font-bold text-theme-accent">(You)</span>}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-theme-muted">
                    <span>{entry.stats}</span>
                    <span className="mx-0.5">-</span>
                    <span>{entry.badges} badges</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-display font-extrabold text-theme-primary">{entry.points.toLocaleString()}</p>
                  <div className="flex items-center gap-0.5 justify-end">
                    {getTrendIcon(entry.change)}
                    <span className={`text-[10px] font-bold ${entry.change > 0 ? 'text-theme-success' : entry.change < 0 ? 'text-theme-accent' : 'text-theme-muted'}`}>
                      {entry.change || 0}
                    </span>
                  </div>
                </div>
                {entry.rankChange !== undefined && (
                  <div className={`px-2 py-0.5 rounded text-[10px] font-display font-bold ${
                    entry.rankChange > 0 ? 'bg-theme-success-light text-theme-success' :
                    entry.rankChange < 0 ? 'bg-theme-accent-light text-theme-accent' :
                    'bg-theme-border/30 text-theme-muted'
                  }`}>
                    {entry.rankChange > 0 ? `+${entry.rankChange}` : entry.rankChange === 0 ? '-' : entry.rankChange}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="px-5 py-2.5 text-center text-[10px] font-bold text-theme-muted bg-theme-border/5">
          Showing {data.length} of {leaderboardData.length} participants
        </div>
      </div>

    </div>
  );
}
