import React, { useState } from "react";
import { 
  Calendar,
  Target,
  Users,
  Timer,
  Zap,
  CheckCircle2,
  Flame,
  Gift,
  Shield
} from "lucide-react";

export default function WeeklyChallengeSystem({ challenges, ownerChallenges = [], currentUser, onJoinChallenge, onJoinOwnerChallenge, onClaimReward }) {
  const [expandedChallenge, setExpandedChallenge] = useState(null);

  const normalizeChallenge = (c) => ({
    ...c,
    participants: c.participants || c.members || [],
    progress: c.progress ?? c.currentValue ?? 0,
    goal: c.goal ?? c.targetValue ?? 100,
    claimedBy: c.claimedBy || [],
    category: c.category || "General",
    reward: c.reward || (c.rewardPoints ? `${c.rewardPoints} pts` : null),
    daysLeft: c.daysLeft ?? (c.weekEnd ? Math.max(1, Math.ceil((new Date(c.weekEnd) - new Date()) / (1000 * 60 * 60 * 24))) : 7),
  });

  if (!challenges || challenges.length === 0) {
    return (
      <div id="weekly-challenges-section" className="space-y-6">
        <div className="card text-center py-12">
          <Calendar size={40} className="mx-auto text-theme-muted mb-3" />
          <h3 className="text-lg font-display font-extrabold text-theme-primary mb-1">No Active Challenges</h3>
          <p className="text-sm text-theme-secondary mb-6 font-body">New weekly challenges are posted every Monday. Check back soon.</p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover rounded-xl transition-all cursor-pointer">
            <Zap size={16} />
            Suggest a Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="weekly-challenges-section" className="space-y-6">

      {/* Header */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-warning-light text-theme-warning rounded-xl">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="text-base font-display font-extrabold text-theme-primary tracking-tight">Weekly Challenges</h2>
            <p className="text-xs text-theme-secondary font-body">{challenges.length} challenge{(challenges.length > 1 ? 's' : '')} available</p>
          </div>
        </div>
        <span className="text-[10px] font-display font-bold text-theme-muted bg-theme-border/30 px-2.5 py-1 rounded-full">
          Ends Sunday
        </span>
      </div>

      {/* Weekly Challenge cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((raw) => {
          const challenge = normalizeChallenge(raw);
          const { participants, progress, goal, claimedBy } = challenge;
          const progressPercent = Math.min(100, Math.round((progress / goal) * 100));
          const isJoined = participants.some(p => p.id === currentUser?.id);
          const isCompleted = progress >= goal;
          const isClaimed = claimedBy.includes(currentUser?.id) || false;

          return (
            <div
              key={challenge.id}
              className={`card flex flex-col overflow-hidden relative ${isCompleted ? 'border-theme-success/30' : ''}`}
            >
              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                isCompleted ? 'bg-theme-success' : 'bg-theme-accent'
              }`}></div>

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl flex items-center justify-center ${
                    isCompleted ? 'bg-theme-success-light text-theme-success' : 'bg-theme-accent-light text-theme-accent'
                  }`}>
                    <Target size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-display font-bold text-theme-primary">{challenge.title}</h3>
                    <p className="text-[10px] text-theme-secondary font-medium font-body">{challenge.category || 'General'}</p>
                  </div>
                </div>

                {isCompleted ? (
                  <span className="text-[10px] font-display font-bold text-theme-success bg-theme-success-light px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Complete
                  </span>
                ) : isJoined ? (
                  <span className="text-[10px] font-display font-bold text-theme-accent bg-theme-accent-light px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                ) : null}
              </div>

              {/* Description */}
              <p className="text-xs text-theme-secondary mb-4 font-body">{challenge.description}</p>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-xs mb-4">
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-theme-muted" />
                  <span className="text-theme-primary font-bold">{participants.length}</span>
                  <span className="text-theme-muted">joined</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Timer size={12} className="text-theme-muted" />
                  <span className="text-theme-primary font-bold">{challenge.daysLeft || 7}d</span>
                  <span className="text-theme-muted">left</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame size={12} className="text-theme-warning" />
                  <span className="text-theme-primary font-bold">{progress}</span>
                  <span className="text-theme-muted">/ {goal}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-[10px] font-display font-bold mb-1">
                  <span className="text-theme-muted">Progress</span>
                  <span className={isCompleted ? 'text-theme-success' : 'text-theme-accent'}>{progressPercent}%</span>
                </div>
                <div className="progress-bar h-2.5">
                  <div 
                    className={`progress-bar-fill ${isCompleted ? 'bg-theme-success' : 'bg-theme-accent'}`} 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Reward */}
              {challenge.reward && (
                <div className="bg-theme-warning-light/50 border border-dashed border-theme-warning/30 rounded-xl p-3 mb-4 flex items-center gap-3">
                  <div className="p-1.5 bg-theme-warning-light text-theme-warning rounded-lg">
                    <Gift size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-display font-bold text-theme-primary">Reward: {challenge.reward}</p>
                    <p className="text-[10px] text-theme-secondary font-body">Claim this when you reach the goal</p>
                  </div>
                </div>
              )}

              {/* Action button */}
              {isCompleted && !isClaimed ? (
                <button
                  id={`claim-btn-${challenge.id}`}
                  onClick={() => onClaimReward(challenge.id)}
                  className="w-full py-2.5 text-xs font-display font-bold text-white bg-theme-success hover:bg-theme-success-dark rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gift size={14} />
                  Claim Reward
                </button>
              ) : isCompleted && isClaimed ? (
                <div className="w-full py-2.5 text-xs font-display font-bold text-theme-success bg-theme-success-light rounded-xl text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={14} />
                  Reward Claimed
                </div>
              ) : isJoined ? (
                <div className="flex items-center gap-2">
                  <button
                    id={`view-progress-btn-${challenge.id}`}
                    onClick={() => setExpandedChallenge(expandedChallenge === challenge.id ? null : challenge.id)}
                    className="flex-1 py-2.5 text-xs font-display font-bold text-theme-accent bg-theme-accent-light hover:bg-theme-accent-light/80 rounded-xl transition-all cursor-pointer"
                  >
                    View Progress
                  </button>
                </div>
              ) : (
                <button
                  id={`join-challenge-btn-${challenge.id}`}
                  onClick={() => onJoinChallenge(challenge.id)}
                  className="w-full py-2.5 text-xs font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap size={14} />
                  Join Challenge
                </button>
              )}

              {/* Expanded progress detail */}
              {expandedChallenge === challenge.id && isJoined && (
                <div className="mt-3 pt-3 border-t border-theme-border space-y-2">
                  <p className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-widest">Participant Progress</p>
                  {participants.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img referrerPolicy="no-referrer" src={p.avatar} alt="" className="w-5 h-5 rounded-full" />
                        <span className="font-display font-bold text-theme-primary">{p.name}</span>
                      </div>
                      <span className="font-bold text-theme-muted">{p.progress || 0}/{goal}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Coach Challenges section */}
      {ownerChallenges.length > 0 && (
        <div className="space-y-4">
          <div className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-base font-display font-extrabold text-theme-primary tracking-tight">Coach Challenges</h2>
                <p className="text-xs text-theme-secondary font-body">{ownerChallenges.length} challenge{(ownerChallenges.length > 1 ? 's' : '')} from your coach</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownerChallenges.map((raw) => {
              const challenge = normalizeChallenge(raw);
              const { participants, progress, goal } = challenge;
              const progressPercent = Math.min(100, Math.round((progress / goal) * 100));
              const isJoined = participants.some(p => p.id === currentUser?.id);
              const isCompleted = progress >= goal;

              return (
                <div key={challenge.id} className={`card flex flex-col overflow-hidden relative ${isCompleted ? 'border-purple-400/30' : ''}`}>
                  {/* Top accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${isCompleted ? 'bg-purple-500' : 'bg-purple-400'}`}></div>

                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-purple-100 text-purple-600' : 'bg-purple-50 text-purple-500'}`}>
                        <Shield size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-display font-bold text-theme-primary">{challenge.title}</h3>
                        <p className="text-[10px] text-theme-secondary font-medium font-body">{challenge.invitedBy ? `by ${challenge.invitedBy}` : 'Coach'}</p>
                      </div>
                    </div>

                    {isCompleted ? (
                      <span className="text-[10px] font-display font-bold text-purple-600 bg-purple-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        Complete
                      </span>
                    ) : isJoined ? (
                      <span className="text-[10px] font-display font-bold text-purple-500 bg-purple-50 px-2.5 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : null}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-theme-secondary mb-4 font-body">{challenge.description}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-theme-muted" />
                      <span className="text-theme-primary font-bold">{participants.length}</span>
                      <span className="text-theme-muted">joined</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Timer size={12} className="text-theme-muted" />
                      <span className="text-theme-primary font-bold">{challenge.daysLeft || 7}d</span>
                      <span className="text-theme-muted">left</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame size={12} className="text-theme-warning" />
                      <span className="text-theme-primary font-bold">{progress}</span>
                      <span className="text-theme-muted">/ {goal}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-[10px] font-display font-bold mb-1">
                      <span className="text-theme-muted">Progress</span>
                      <span className={isCompleted ? 'text-purple-600' : 'text-purple-500'}>{progressPercent}%</span>
                    </div>
                    <div className="progress-bar h-2.5">
                      <div className={`progress-bar-fill ${isCompleted ? 'bg-purple-500' : 'bg-purple-400'}`} style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Reward */}
                  {challenge.reward && (
                    <div className="bg-purple-50/50 border border-dashed border-purple-300/30 rounded-xl p-3 mb-4 flex items-center gap-3">
                      <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                        <Gift size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-display font-bold text-theme-primary">Reward: {challenge.reward}</p>
                        <p className="text-[10px] text-theme-secondary font-body">Claim this when you reach the goal</p>
                      </div>
                    </div>
                  )}

                  {/* Action button */}
                  {isCompleted ? (
                    <div className="w-full py-2.5 text-xs font-display font-bold text-purple-600 bg-purple-100 rounded-xl text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={14} />
                      Goal Reached
                    </div>
                  ) : isJoined ? (
                    <button
                      onClick={() => setExpandedChallenge(expandedChallenge === challenge.id ? null : challenge.id)}
                      className="w-full py-2.5 text-xs font-display font-bold text-purple-500 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all cursor-pointer"
                    >
                      View Progress
                    </button>
                  ) : (
                    <button
                      onClick={() => onJoinOwnerChallenge(challenge.id)}
                      className="w-full py-2.5 text-xs font-display font-bold text-white bg-purple-500 hover:bg-purple-600 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap size={14} />
                      Join Challenge
                    </button>
                  )}

                  {/* Expanded progress detail */}
                  {expandedChallenge === challenge.id && isJoined && (
                    <div className="mt-3 pt-3 border-t border-theme-border space-y-2">
                      <p className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-widest">Participant Progress</p>
                      {participants.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img referrerPolicy="no-referrer" src={p.avatar} alt="" className="w-5 h-5 rounded-full" />
                            <span className="font-display font-bold text-theme-primary">{p.name}</span>
                          </div>
                          <span className="font-bold text-theme-muted">{p.progress || 0}/{goal}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
