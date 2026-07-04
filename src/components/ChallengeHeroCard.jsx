import React, { useState, useEffect } from "react";
import {
  Trophy,
  Clock,
  Users,
  Medal,
  Gift,
  Sparkles,
  Target,
  CheckCircle2,
  UserPlus,
  Send,
  ChevronRight,
  Flame,
  Star,
  Award,
  Zap,
  Timer,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function CountdownTimer({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate) - new Date();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1.5 min-w-[3rem]">
            <span className="text-lg font-display font-extrabold text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <p className="text-[8px] text-white/60 uppercase tracking-wider mt-0.5 font-bold">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function ChallengeHeroCard({
  challenge,
  currentUser,
  onJoin,
  onInvite,
  onNavigate,
}) {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showRules, setShowRules] = useState(false);

  if (!challenge) {
    return (
      <div className="rounded-3xl p-8 text-center bg-theme-border/10 border border-theme-border border-dashed">
        <Trophy size={40} className="text-theme-muted mx-auto mb-3" />
        <h3 className="text-lg font-display font-extrabold text-theme-primary">No Active Challenge</h3>
        <p className="text-sm text-theme-secondary mt-1">Check back soon for the next challenge!</p>
      </div>
    );
  }

  const hasJoined = challenge.participants?.some(p => p.id === "me" || p.id === currentUser?.id);
  const isComplete = challenge.status === "completed" || challenge.currentValue >= challenge.targetValue;
  const progressPct = challenge.targetValue > 0
    ? Math.min(100, Math.round((challenge.currentValue / challenge.targetValue) * 100))
    : 0;
  const sortedParticipants = [...(challenge.participants || [])].sort((a, b) => (b.progress || 0) - (a.progress || 0));
  const topCompleters = challenge.completers || [];
  const top3 = sortedParticipants.slice(0, 3);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    onInvite?.(inviteEmail.trim(), challenge.title);
    setInviteEmail("");
    setShowInvite(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden relative"
    >
      {/* Hero Background */}
      <div
        className="relative p-6 sm:p-8 text-white overflow-hidden"
        style={{
          background: isComplete
            ? "linear-gradient(135deg, #2ECC71 0%, #1D202B 100%)"
            : "linear-gradient(135deg, #D95C42 0%, #1D202B 100%)",
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center p-4">
          <Trophy size={200} />
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 blur-xl" />
        <div className="absolute -right-5 -top-5 w-32 h-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative z-10 space-y-6">
          {/* Header Badge */}
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-display font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
              <Sparkles size={11} />
              Featured Challenge
            </span>
            {isComplete && (
              <span className="bg-green-400/30 text-green-200 text-[10px] px-3 py-1 rounded-full font-display font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                <CheckCircle2 size={11} />
                Completed
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              {challenge.title}
            </h1>
            <p className="text-sm text-white/80 max-w-xl font-body leading-relaxed">
              {challenge.description}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] text-white/70 font-bold uppercase tracking-wider">
              <Clock size={12} />
              Challenge ends in
            </div>
            <CountdownTimer endDate={challenge.endDate} />
          </div>

          {/* Main Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-display font-bold">
                {challenge.currentValue}/{challenge.targetValue} {challenge.metricLabel}
              </span>
              <span className="text-white/70">{progressPct}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${isComplete ? "bg-green-400" : "bg-theme-accent"}`}
              />
            </div>
          </div>

          {/* Rewards / Podium */}
          <div className="grid grid-cols-3 gap-2">
            {(challenge.rewards || []).map((reward, i) => (
              <div
                key={i}
                className={`rounded-xl p-3 text-center border border-white/10 backdrop-blur-sm ${
                  reward.claimed ? "bg-green-400/20" : "bg-white/5"
                }`}
              >
                <Medal size={16} className={`mx-auto mb-1 ${i === 0 ? "text-yellow-300" : i === 1 ? "text-gray-300" : "text-amber-600"}`} />
                <p className="text-[10px] font-display font-bold">{reward.label}</p>
                {reward.claimedBy && (
                  <p className="text-[8px] text-green-300 mt-1">Claimed by {reward.claimedBy}</p>
                )}
              </div>
            ))}
          </div>

          {/* Badge Preview */}
          {challenge.badge && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
              <span className="text-2xl">{challenge.badge.icon}</span>
              <div>
                <p className="text-[10px] font-display font-bold text-white">Completion Badge</p>
                <p className="text-[8px] text-white/60">{challenge.badge.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Participants + Actions */}
      <div className="bg-theme-surface border border-t-0 border-theme-border rounded-b-3xl p-6 space-y-4">
        {/* Top 3 Participants */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={14} className="text-theme-warning" />
            <h3 className="text-xs font-display font-bold text-theme-primary">Leaderboard</h3>
            <span className="text-[9px] text-theme-muted">{challenge.participants?.length || 0} participants</span>
          </div>

          {top3.length === 0 ? (
            <p className="text-xs text-theme-muted py-2">No participants yet. Be the first to join!</p>
          ) : (
            <div className="space-y-1.5">
              {top3.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ${
                    i === 0 ? "bg-yellow-50/50 border border-yellow-200/30" :
                    i === 1 ? "bg-gray-50/50 border border-gray-200/30" :
                    i === 2 ? "bg-amber-50/50 border border-amber-200/30" :
                    "bg-theme-border/10"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold ${
                    i === 0 ? "bg-yellow-400 text-white" :
                    i === 1 ? "bg-gray-300 text-white" :
                    "bg-amber-500 text-white"
                  }`}>
                    {i + 1}
                  </span>
                  <img referrerPolicy="no-referrer" src={p.avatar} alt="" className="w-7 h-7 rounded-full border border-theme-border" />
                  <span className="flex-1 text-[11px] font-display font-bold text-theme-primary truncate">{p.name}</span>
                  <span className="text-[10px] font-bold text-theme-accent">{p.progress || 0}</span>
                  <div className="w-16 h-1.5 rounded-full bg-theme-border/30">
                    <div
                      className="h-full rounded-full bg-theme-accent"
                      style={{ width: `${challenge.targetValue > 0 ? Math.min(100, ((p.progress || 0) / challenge.targetValue) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rules Toggle */}
        <div>
          <button
            onClick={() => setShowRules(!showRules)}
            className="flex items-center gap-2 text-[10px] font-bold text-theme-secondary hover:text-theme-primary transition-all cursor-pointer"
          >
            <Target size={12} />
            Rules & Requirements
            <ChevronRight size={12} className={`transition-transform ${showRules ? "rotate-90" : ""}`} />
          </button>
          <AnimatePresence>
            {showRules && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-1.5">
                  {(challenge.rules || []).map((rule, i) => (
                    <div key={i} className="flex items-start gap-2 text-[10px] text-theme-secondary">
                      <CheckCircle2 size={10} className="text-theme-accent shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {!isComplete && (
          <div className="flex items-center gap-3 pt-2">
            {!hasJoined ? (
              <button
                onClick={onJoin}
                className="flex-1 bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-display font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap size={16} />
                Join Challenge
              </button>
            ) : (
              <div className="flex-1 bg-theme-success-light text-theme-success rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-display font-bold">
                <CheckCircle2 size={16} />
                You're In!
              </div>
            )}

            <button
              onClick={() => setShowInvite(!showInvite)}
              className="px-4 py-3 rounded-xl border border-theme-border text-xs font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus size={16} />
              Invite
            </button>
          </div>
        )}

        {/* Invite Input */}
        <AnimatePresence>
          {showInvite && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Enter friend's name or email..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
                  className="flex-1 bg-theme-bg border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="p-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Banner */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-green-50 border border-green-200 p-4 text-center"
          >
            <Trophy size={28} className="text-green-500 mx-auto mb-2" />
            <p className="text-sm font-display font-extrabold text-green-700">Challenge Complete!</p>
            <p className="text-xs text-green-600 mt-1">Great work reaching the goal. Rewards will be distributed soon.</p>
          </motion.div>
        )}

        {/* Bottom info */}
        <div className="flex items-center justify-between text-[9px] text-theme-muted pt-2 border-t border-theme-border">
          <span>Created by {challenge.createdBy || "FitCircle Coach"}</span>
          <span className="flex items-center gap-1">
            <Gift size={10} />
            {challenge.participants?.length || 0} joined
          </span>
        </div>
      </div>
    </motion.div>
  );
}
