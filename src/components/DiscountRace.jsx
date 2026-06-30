import React, { useState } from "react";
import { 
  Trophy, 
  Flame, 
  Lock, 
  Unlock, 
  CheckCircle,
  Copy,
  Plus,
  Compass
} from "lucide-react";
import { motion } from "motion/react";

export default function DiscountRace({ user, onIncrementRoutine }) {
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  const milestones = [
    { target: 5, discount: "10% OFF", code: "FITBRONZE10", desc: "Bronze Tier - FitCircle Shop", id: "bronze" },
    { target: 12, discount: "20% OFF", code: "FITSILVER20", desc: "Silver Tier - Premium Partners", id: "silver" },
    { target: 20, discount: "30% OFF", code: "FITGOLD30", desc: "Gold Tier - Everything Free", id: "gold" }
  ];

  const currentCount = user.routinesCompletedThisMonth;
  const targetCount = user.routineTargetMonth;
  const totalPercentage = targetCount > 0 ? Math.min(100, Math.round((currentCount / targetCount) * 100)) : 0;

  const copyToClipboard = (code) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(code).catch(() => fallbackCopyText(code));
      } else {
        fallbackCopyText(code);
      }
    } catch (e) {
      console.warn("Failed to copy code", e);
    }
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const fallbackCopyText = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
  };

  return (
    <div id="discount-race-section" className="space-y-6">
      
      {/* Intro header */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-display font-bold text-theme-accent uppercase tracking-widest">
            <Compass size={16} />
            <span>Consistency Map</span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-theme-primary tracking-tight">
            Race to Your Monthly Discount
          </h2>
          <p className="text-sm text-theme-secondary font-body">
            Consistency is your currency. Complete 20 routine days this month to secure the ultimate <strong className="text-theme-accent">30% discount code</strong> on premium fitness gear.
          </p>
        </div>

        <div className="bg-theme-support-light border border-theme-border rounded-2xl p-5 text-center flex flex-col items-center justify-center min-w-0 w-full md:w-auto md:min-w-[180px] self-stretch md:self-auto">
          <p className="text-xs font-display font-bold text-theme-support uppercase tracking-widest">Routine Progress</p>
          <span className="text-4xl font-display font-extrabold text-theme-primary my-1">
            {currentCount} / {targetCount}
          </span>
          <p className="text-[10px] font-medium text-theme-muted uppercase">Days Completed</p>
          
          <button
            id="log-routine-day-btn"
            onClick={onIncrementRoutine}
            className="mt-3 flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover rounded-xl transition-all cursor-pointer"
          >
            <Plus size={13} />
            Log Routine Day
          </button>
        </div>
      </div>

      {/* Racetrack */}
      <div className="rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between" style={{ backgroundColor: '#1D202B' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80')` }}></div>
        
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-theme-support/20 text-theme-support border border-theme-support/30 text-[10px] font-display font-extrabold uppercase px-2 py-0.5 rounded-md">
              Race Arena
            </span>
            <span className="text-xs font-bold text-theme-muted">Progress: steady</span>
          </div>
          <p className="text-xs font-display font-bold text-theme-accent">{totalPercentage}% Complete</p>
        </div>

        <div id="racetrack-lane" className="relative z-10 py-8 sm:py-12 px-2 sm:px-4 bg-black/30 border border-theme-border/20 rounded-2xl md:my-4 min-h-[200px] sm:min-h-[240px]">
          
          <div className="absolute left-6 sm:left-10 right-6 sm:right-10 top-1/2 -translate-y-1/2 h-2 bg-theme-border/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000" 
              style={{ width: `${totalPercentage}%`, background: 'linear-gradient(90deg, #3D6B8C, #D95C42)' }}
            ></div>
          </div>

          <div className="absolute left-6 sm:left-10 right-6 sm:right-10 top-1/2 -translate-y-1/2 h-2 flex justify-between pointer-events-none">
            {[...Array(11)].map((_, i) => (
              <div key={i} className="w-px h-2 bg-white/10"></div>
            ))}
          </div>

          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out z-20"
            style={{ left: totalPercentage > 95 ? '95%' : `calc(12% + ${totalPercentage * 0.76}%)` }}
          >
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-theme-accent overflow-hidden shadow-lg" style={{ backgroundColor: '#3D6B8C' }}>
                  <img referrerPolicy="no-referrer" src={user.avatar} alt="You" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 bg-theme-accent text-white text-[9px] font-display font-extrabold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow">
                  <Flame size={8} />
                </div>
              </div>
              <span className="bg-black/60 text-[8px] sm:text-[10px] font-display font-bold px-1.5 py-0.5 rounded border border-white/10 text-white mt-1 whitespace-nowrap shadow-md">
                You ({currentCount}d)
              </span>
            </motion.div>
          </div>

          {milestones.map((m) => {
            const milestonePercent = (m.target / targetCount) * 100;
            const isPassed = currentCount >= m.target;
            const leftPos = milestonePercent > 85 ? '85%' : `calc(8% + ${milestonePercent * 0.84}%)`;
            return (
              <div 
                key={m.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
                style={{ left: leftPos }}
              >
                <div className={`p-1 sm:p-1.5 rounded-full ${isPassed ? "bg-theme-accent text-white" : "bg-theme-border/20 text-theme-muted"} border-2 shadow-md`} style={{ borderColor: isPassed ? '#D95C42' : '#2A2E3A' }}>
                  {isPassed ? <Unlock size={10} /> : <Lock size={10} />}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-display font-extrabold mt-1 px-1 py-0.5 rounded shadow whitespace-nowrap ${isPassed ? "text-theme-accent bg-black/40" : "text-theme-muted bg-black/20"}`}>
                  {m.discount}
                </span>
                <span className="text-[7px] sm:text-[8px] font-bold text-theme-muted uppercase mt-0.5">{m.target} Days</span>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-theme-muted mt-2">
          <span>Start</span>
          <span>Target (20 days)</span>
        </div>
      </div>

      {/* Vouchers */}
      <div id="unlocked-vouchers" className="space-y-4">
        <h3 className="text-base font-display font-extrabold text-theme-primary tracking-tight">Your Reward Vouchers</h3>
        
        <div id="vouchers-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {milestones.map((m) => {
            const isUnlocked = currentCount >= m.target;
            
            return (
              <div 
                key={m.id}
                className={`card flex flex-col justify-between relative overflow-hidden ${!isUnlocked ? 'opacity-50' : ''}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] uppercase font-display font-bold px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-theme-success-light text-theme-success' : 'bg-theme-border/50 text-theme-muted'}`}>
                      {isUnlocked ? 'Unlocked' : `Locked (${m.target} days)`}
                    </span>
                    <Trophy size={16} className={isUnlocked ? "text-theme-accent" : "text-theme-muted"} />
                  </div>
                  
                  <h4 className="text-xl font-display font-extrabold text-theme-primary mt-2 leading-none">{m.discount}</h4>
                  <p className="text-xs text-theme-secondary mt-1 font-body">{m.desc}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-dashed border-theme-border">
                  {isUnlocked ? (
                    <div>
                      <p className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-widest">Discount Code</p>
                      <div className="flex items-center justify-between mt-1 bg-theme-accent-light border border-theme-border rounded-xl px-3 py-2 text-theme-primary">
                        <code className="font-body text-xs font-bold tracking-wider">{m.code}</code>
                        <button
                          id={`copy-${m.id}`}
                          onClick={() => copyToClipboard(m.code)}
                          className="text-theme-accent hover:text-theme-accent-hover p-1 cursor-pointer"
                          title="Copy coupon"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-theme-border/30 rounded-xl p-2.5 text-center text-xs text-theme-muted font-bold">
                      {m.target - currentCount} more days needed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {copiedCoupon && (
        <div id="copied-toast" className="fixed bottom-6 right-6 z-50 bg-theme-surface border border-theme-border rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg">
          <CheckCircle className="text-theme-success" size={16} />
          <span className="text-xs font-bold text-theme-primary">
            Copied <span className="font-body font-bold text-theme-accent">{copiedCoupon}</span>
          </span>
        </div>
      )}

    </div>
  );
}
