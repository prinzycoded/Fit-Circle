import React from "react";
import { 
  Flame, 
  Shield, 
  AlertTriangle 
} from "lucide-react";

export default function StreakSystem({ user, onBuyFreeze, onUseFreeze }) {
  const freezeAvailable = user.streakFreezes || 0;

  return (
    <div id="streak-widget" className="card card-hover" style={{ borderRadius: 12, padding: 16 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-theme-warning-light text-theme-warning rounded-lg">
            <Flame size={13} />
          </div>
          <h3 className="text-xs font-display font-extrabold text-theme-primary tracking-tight">
            Streak Protection
          </h3>
        </div>
        <span className="text-[9px] font-display font-bold text-theme-warning bg-theme-warning-light px-2 py-0.5 rounded-full">
          {user.streak || 0}d
        </span>
      </div>

      {/* Count + Freeze row */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-linear-to-br from-theme-warning to-theme-accent rounded-xl text-white">
            <Flame size={18} />
          </div>
          <div>
            <p className="text-lg font-display font-extrabold text-theme-primary leading-none">
              {user.streak || 0}
            </p>
            <p className="text-[9px] text-theme-secondary font-medium">Day Streak</p>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-display font-bold text-theme-muted">Freeze</span>
            <span className="font-display font-extrabold text-theme-primary">{freezeAvailable}/3</span>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3].map((slot) => (
              <div key={slot}
                className={`flex-1 min-w-[22px] h-5 rounded-md border flex items-center justify-center text-xs font-display font-extrabold transition-colors ${
                  slot <= freezeAvailable
                    ? 'bg-theme-support-light border-theme-support text-theme-support'
                    : 'bg-theme-border/20 border-theme-border/30 text-theme-muted'
                }`}
              >
                {slot <= freezeAvailable ? <Shield size={10} className="fill-theme-support text-theme-support" /> : <Shield size={10} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info + Actions row */}
      <div className="flex items-start gap-2 p-2.5 bg-theme-border/10 rounded-xl mb-3">
        <AlertTriangle size={11} className="text-theme-warning shrink-0 mt-0.5" />
        <p className="text-[9px] text-theme-secondary leading-relaxed flex-1">
          Miss a day and your streak stays safe. Freeze tokens renew monthly.
        </p>
        <div className="flex gap-1.5 shrink-0">
          <button onClick={onBuyFreeze} className="px-2.5 py-1 text-[9px] font-display font-bold text-theme-support bg-theme-support-light hover:bg-theme-support-light/80 rounded-lg transition-all cursor-pointer">
            Buy (500)
          </button>
          <button onClick={onUseFreeze} className="px-2.5 py-1 text-[9px] font-display font-bold text-theme-accent bg-theme-accent-light hover:bg-theme-accent-light/80 rounded-lg transition-all cursor-pointer">
            Use
          </button>
        </div>
      </div>

      {/* Milestone preview */}
      <div className="pt-3 border-t border-theme-border flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-1">
          <span className="text-theme-muted">Next freeze at</span>
          <span className="font-display font-extrabold text-theme-primary">7 days</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-theme-muted">Streak badge at</span>
          <span className="font-display font-extrabold text-theme-primary">30 days</span>
        </div>
      </div>
    </div>
  );
}
