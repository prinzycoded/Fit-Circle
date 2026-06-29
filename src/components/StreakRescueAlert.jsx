import React, { useState } from "react";
import { AlertTriangle, Send, Flame, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function StreakRescueAlert({ groups, currentUserId, onRescue }) {
  const [rescued, setRescued] = useState({});
  const [dismissed, setDismissed] = useState(false);

  const atRiskMembers = [];
  groups.forEach(group => {
    const isMember = group.members?.some(m => m.id === currentUserId);
    if (!isMember) return;
    group.members.forEach(m => {
      if (m.id === currentUserId) return;
      const minutesToday = m.weeklyMinutes || 0;
      const isPending = minutesToday < 10;
      if (isPending) {
        atRiskMembers.push({
          ...m,
          groupName: group.name,
          groupId: group.id,
        });
      }
    });
  });

  const unique = [];
  const seen = new Set();
  atRiskMembers.forEach(m => {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      unique.push(m);
    }
  });

  const handleRescue = (member) => {
    setRescued(prev => ({ ...prev, [member.id]: true }));
    if (onRescue) onRescue(member.groupId, member.name);
    setTimeout(() => {
      setRescued(prev => ({ ...prev, [member.id]: false }));
    }, 3000);
  };

  if (dismissed || unique.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        className="relative overflow-hidden rounded-2xl border border-red-200 dark:border-red-900/40"
        style={{
          background: "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
        }}
      >
        <div className="dark:hidden absolute inset-0 opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='0.04'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z'/%3E%3C/g%3E%3C/svg%3E")` }}></div>

        <div className="relative z-10 p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl shrink-0">
              <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-display font-extrabold text-red-800 dark:text-red-300">
                  Streaks at Risk!
                </h3>
                <button
                  onClick={() => setDismissed(true)}
                  className="p-1 rounded-lg hover:bg-red-200/50 dark:hover:bg-red-900/30 text-red-500 transition-colors cursor-pointer shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-red-700 dark:text-red-400 font-medium mt-0.5">
                {unique.length === 1
                  ? "An accountability partner hasn't checked in today."
                  : `${unique.length} accountability partners haven't checked in today.`}
              </p>

              <div className="mt-3 space-y-2">
                {unique.map(member => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                      rescued[member.id]
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-white/70 dark:bg-white/5"
                    }`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-red-200 dark:ring-red-800/50"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-display font-bold text-red-800 dark:text-red-300 truncate">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                        <Flame size={9} className="text-orange-500" />
                        <span>{member.weeklyMinutes || 0} min today</span>
                        <span className="mx-1">·</span>
                        <span className="text-red-500 font-bold">Pending check-in</span>
                      </p>
                    </div>
                    {rescued[member.id] ? (
                      <span className="flex items-center gap-1 text-[10px] font-display font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-lg whitespace-nowrap">
                        <CheckCircle2 size={11} />
                        Rescued!
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRescue(member)}
                        className="flex items-center gap-1 text-[10px] font-display font-bold text-white bg-red-500 hover:bg-red-600 active:bg-red-700 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer shadow-sm"
                      >
                        <Send size={10} />
                        Rescue Bump
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
