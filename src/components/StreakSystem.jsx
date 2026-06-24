import React from "react";
import { 
  Flame, 
  Shield, 
  AlertTriangle 
} from "lucide-react";

export default function StreakSystem({ user, onBuyFreeze, onUseFreeze }) {
  const freezeAvailable = user.streakFreezes || 0;

  return (
    <div id="streak-widget" className="card card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-theme-warning-light text-theme-warning rounded-lg">
            <Flame size={16} />
          </div>
          <h3 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">
            Streak Protection
          </h3>
        </div>
        <button className="text-theme-muted hover:text-theme-primary cursor-pointer">
          <Shield size={15} />
        </button>
      </div>

      {/* Count */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-br from-theme-warning to-theme-accent rounded-2xl text-white">
          <Flame size={24} />
        </div>
        <div>
          <p className="text-2xl font-display font-extrabold text-theme-primary leading-none">
            {user.streak || 0}
          </p>
          <p className="text-xs text-theme-secondary font-medium font-body">Day Streak</p>
        </div>
      </div>

      {/* Freeze protections */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-display font-bold text-theme-primary">Freeze Protections</span>
          <span className="font-display font-extrabold text-theme-primary">{freezeAvailable} left</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((slot) => (
            <div
              key={slot}
              className={`flex-1 h-8 rounded-xl border flex items-center justify-center text-xs font-display font-extrabold transition-colors ${
                slot <= freezeAvailable
                  ? 'bg-theme-support-light border-theme-support text-theme-support shadow-sm'
                  : 'bg-theme-border/20 border-theme-border/30 text-theme-muted'
              }`}
            >
              {slot <= freezeAvailable ? (
                <Shield size={14} className="fill-theme-support text-theme-support" />
              ) : (
                <Shield size={14} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info text */}
      <div className="flex items-start gap-2 mt-4 p-3 bg-theme-border/20 rounded-xl">
        <AlertTriangle size={14} className="text-theme-warning flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-theme-secondary leading-relaxed font-body">
          Miss a day and your streak stays safe. Freeze tokens renew monthly and keep your consistency rewards intact.
        </p>
      </div>

      {/* Buy / Use freeze */}
      <div className="mt-4 pt-4 border-t border-theme-border space-y-2">
        <p className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-widest mb-2">Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            id="buy-freeze-btn"
            onClick={onBuyFreeze}
            className="py-2 px-3 text-[10px] font-display font-bold text-theme-support bg-theme-support-light hover:bg-theme-support-light/80 rounded-xl transition-all cursor-pointer"
          >
            Buy Freeze (500 pts)
          </button>
          <button
            id="use-freeze-btn"
            onClick={onUseFreeze}
            className="py-2 px-3 text-[10px] font-display font-bold text-theme-accent bg-theme-accent-light hover:bg-theme-accent-light/80 rounded-xl transition-all cursor-pointer"
          >
            Use Freeze
          </button>
        </div>
      </div>

      {/* Milestone preview */}
      <div className="mt-4 pt-4 border-t border-theme-border">
        <p className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-widest mb-2">Upcoming Milestones</p>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-theme-muted font-body">Next freeze at</span>
            <span className="font-display font-extrabold text-theme-primary">7 days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-theme-muted font-body">Streak badge at</span>
            <span className="font-display font-extrabold text-theme-primary">30 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
