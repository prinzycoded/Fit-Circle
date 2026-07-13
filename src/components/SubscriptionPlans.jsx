import React from "react";
import { Shield, Dumbbell, Trophy, CheckCircle2, Star, Zap, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: 29,
    color: "bg-theme-border/40",
    textColor: "text-theme-muted",
    borderColor: "border-theme-border",
    icon: Dumbbell,
    features: [
      "Workout plan assignments",
      "Notify your coach",
      "Progress tracking",
      "Daily health metrics",
      "Social feed access",
    ],
  },
  {
    name: "Standard",
    price: 49,
    color: "bg-theme-support-light",
    textColor: "text-theme-support",
    borderColor: "border-theme-support/40",
    icon: Shield,
    popular: true,
    features: [
      "Everything in Basic",
      "Join gym challenges",
      "Accountability groups",
      "Leaderboard ranking",
      "Weekly challenges",
    ],
  },
  {
    name: "Premium",
    price: 79,
    color: "bg-theme-warning-light",
    textColor: "text-theme-warning",
    borderColor: "border-theme-warning/40",
    icon: Trophy,
    features: [
      "Everything in Standard",
      "Priority coach support",
      "Exclusive achievement badges",
      "Early access to new features",
      "Premium profile badge",
    ],
  },
];

export default function SubscriptionPlans({ userPlan, onSubscribe, onNavigate }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-theme-accent-light text-theme-accent rounded-xl">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="text-xl font-display font-extrabold text-theme-primary">Subscription Plans</h1>
          <p className="text-xs text-theme-secondary">Choose a plan to unlock coaching and challenge features</p>
        </div>
      </div>

      {userPlan && (
        <div className="card p-4 border-theme-success/40 bg-theme-success-light/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-theme-success-light text-theme-success">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-display font-extrabold text-theme-primary">
                You're on the <span className="text-theme-accent">{userPlan}</span> plan
              </p>
              <p className="text-xs text-theme-secondary">All features in this tier are unlocked for you.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = userPlan === plan.name;
          const isUpgrade = userPlan && !isCurrentPlan;

          return (
            <div
              key={plan.name}
              className={`card p-5 flex flex-col relative overflow-hidden ${
                plan.popular ? "ring-2 ring-theme-accent" : ""
              } ${isCurrentPlan ? "ring-2 ring-theme-success" : ""}`}
            >
              {plan.popular && !isCurrentPlan && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-theme-accent text-white text-[8px] font-display font-extrabold rounded-full uppercase tracking-wider">
                  Popular
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-theme-success text-white text-[8px] font-display font-extrabold rounded-full uppercase tracking-wider">
                  Active
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl ${plan.color} flex items-center justify-center mb-4`}>
                <Icon size={20} className={plan.textColor} />
              </div>

              <h2 className="text-lg font-display font-extrabold text-theme-primary">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mt-1 mb-4">
                <span className="text-3xl font-display font-extrabold text-theme-primary">${plan.price}</span>
                <span className="text-xs text-theme-muted font-medium">/month</span>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-theme-success shrink-0 mt-0.5" />
                    <span className="text-xs text-theme-secondary font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (!isCurrentPlan) {
                    onSubscribe(plan.name);
                  }
                }}
                disabled={isCurrentPlan}
                className={`mt-5 w-full py-2.5 rounded-xl text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCurrentPlan
                    ? "bg-theme-success-light text-theme-success cursor-default"
                    : userPlan
                    ? "bg-theme-accent hover:bg-theme-accent-hover text-white"
                    : "bg-theme-accent hover:bg-theme-accent-hover text-white"
                }`}
              >
                {isCurrentPlan ? (
                  <>
                    <CheckCircle2 size={14} />
                    Current Plan
                  </>
                ) : userPlan ? (
                  <>
                    <Zap size={14} />
                    Upgrade
                  </>
                ) : (
                  <>
                    <Star size={14} />
                    Subscribe
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="card p-5 text-center">
        <p className="text-xs text-theme-secondary font-body">
          All plans include a 7-day free trial. Cancel anytime. 
          {!userPlan && (
            <span className="block mt-2">
              <button
                onClick={() => onNavigate?.("workout")}
                className="text-theme-accent font-bold hover:underline cursor-pointer"
              >
                Not ready? Browse workout plans first
              </button>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
