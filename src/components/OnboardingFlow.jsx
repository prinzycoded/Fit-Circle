import React, { useState } from "react";
import { Heart, Target, Trophy, Users, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const STEPS = [
  { id: "checkin", title: "Complete your first Daily Check-In", desc: "Build your streak and earn points", icon: Heart, tab: "welcome", action: "checkin" },
  { id: "activity", title: "Log your first activity", desc: "Track steps, water, or a workout", icon: Target, tab: "dashboard" },
  { id: "challenge", title: "Join a Weekly Challenge", desc: "Compete with members and earn rewards", icon: Trophy, tab: "weeklyChallenges" },
  { id: "social", title: "Share on Social Feed", desc: "Post your progress and connect with others", icon: Users, tab: "social" },
];

export default function OnboardingFlow({
  onboarding,
  onCompleteStep,
  onDismissWelcome,
  onNavigate,
}) {
  const [showModal, setShowModal] = useState(!onboarding?.welcomeDismissed);
  const allDone = STEPS.every(s => (onboarding.completed || []).includes(s.id));

  if (allDone) return null;

  const completed = onboarding.completed || [];
  const pct = Math.round((completed.length / STEPS.length) * 100);

  return (
    <>
      {/* Welcome Modal — shows once on first visit */}
      <AnimatePresence>
        {!onboarding.welcomeDismissed && showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowModal(false); onDismissWelcome(); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-2xl overflow-hidden text-white"
              style={{ background: 'linear-gradient(135deg, #D95C42 0%, #7C2D12 50%, #1D202B 100%)' }}
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
              <div className="relative z-10 p-6 sm:p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/15 ring-2 ring-white/20 flex items-center justify-center">
                  <Sparkles size={28} className="text-yellow-300" />
                </div>
                <h2 className="text-xl font-display font-extrabold tracking-tight mb-2">
                  Welcome to FitCircle!
                </h2>
                <p className="text-sm text-white/70 font-body leading-relaxed max-w-sm mx-auto">
                  Your gamified fitness journey starts now. Earn points, build streaks, compete on leaderboards, and crush your goals with the community.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={() => { setShowModal(false); onDismissWelcome(); }}
                    className="w-full py-3 rounded-xl font-display font-bold text-sm bg-white text-[#D95C42] hover:bg-white/90 transition-all"
                  >
                    Let's Go!
                  </button>
                  <button
                    onClick={() => { setShowModal(false); onDismissWelcome(); }}
                    className="text-xs text-white/60 hover:text-white/90 transition-all py-1"
                  >
                    Skip onboarding
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checklist Card — persistent on WelcomePage until all steps done */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-theme-border bg-theme-surface overflow-hidden"
        style={{ borderRadius: 12 }}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-theme-accent/20 flex items-center justify-center">
                <Sparkles size={14} className="text-theme-accent" />
              </div>
              <div>
                <h3 className="text-xs font-display font-extrabold text-theme-primary">Getting Started</h3>
                <p className="text-[9px] text-theme-muted font-medium">{completed.length}/{STEPS.length} steps done</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-display font-bold text-theme-accent">{pct}%</span>
              <div className="w-16 h-1.5 bg-theme-border rounded-full overflow-hidden">
                <div className="h-full bg-theme-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {STEPS.map((step) => {
              const isDone = completed.includes(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (!isDone) onCompleteStep(step.id);
                    onNavigate(step.tab);
                  }}
                  disabled={isDone}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                    isDone
                      ? "opacity-50 cursor-default"
                      : "hover:bg-theme-border/30 cursor-pointer"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isDone
                      ? "bg-theme-success/20 text-theme-success"
                      : "bg-theme-accent/10 text-theme-accent"
                  }`}>
                    {isDone ? <CheckCircle2 size={14} /> : <step.icon size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-display font-bold ${isDone ? "text-theme-muted line-through" : "text-theme-primary"}`}>
                      {step.title}
                    </p>
                    <p className="text-[9px] text-theme-muted font-medium truncate">{step.desc}</p>
                  </div>
                  {!isDone && (
                    <ArrowRight size={12} className="text-theme-muted shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
