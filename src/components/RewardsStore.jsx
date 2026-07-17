import React, { useState } from "react";
import {
  ShoppingBag,
  Sparkles,
  Award,
  Shield,
  Star,
  Tags,
  Crown,
  Frame,
  Hash,
  Droplet,
  Footprints,
  Zap,
  Heart,
  Gift,
  CheckCircle2,
  Lock,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const REWARD_ITEMS = [
  // Avatar Frames
  { id: "frame-gold", type: "frame", name: "Gold Frame", desc: "Premium golden avatar border", cost: 3000, icon: Frame, color: "text-yellow-500", bg: "bg-yellow-100" },
  { id: "frame-neon", type: "frame", name: "Neon Frame", desc: "Glowing neon avatar border", cost: 5000, icon: Frame, color: "text-purple-500", bg: "bg-purple-100" },
  { id: "frame-champion", type: "frame", name: "Champion Frame", desc: "Elite champion laurel border", cost: 8000, icon: Crown, color: "text-orange-500", bg: "bg-orange-100" },
  // Profile Titles
  { id: "title-streaker", type: "title", name: "Title: Streak King", desc: "Unlock 'Streak King' profile title", cost: 2000, icon: Zap, color: "text-red-500", bg: "bg-red-100" },
  { id: "title-marathoner", type: "title", name: "Title: Marathoner", desc: "Unlock 'Marathoner' profile title", cost: 4000, icon: Footprints, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "title-hydration", type: "title", name: "Title: Hydration Hero", desc: "Unlock 'Hydration Hero' profile title", cost: 2500, icon: Droplet, color: "text-cyan-500", bg: "bg-cyan-100" },
  // Streak Shields
  { id: "shield-basic", type: "shield", name: "Streak Shield (1)", desc: "Protect 1 day of streak from breaking", cost: 1500, icon: Shield, color: "text-emerald-500", bg: "bg-emerald-100" },
  { id: "shield-premium", type: "shield", name: "Streak Shield (3)", desc: "Protect 3 days of streak from breaking", cost: 3500, icon: Shield, color: "text-emerald-600", bg: "bg-emerald-100" },
  // Perks
  { id: "perk-basic-discount", type: "perk", name: "5% Gym Discount", desc: "5% off your next subscription month", cost: 6000, icon: Tags, color: "text-pink-500", bg: "bg-pink-100" },
  { id: "perk-premium-discount", type: "perk", name: "15% Gym Discount", desc: "15% off your next subscription month", cost: 12000, icon: Tags, color: "text-pink-600", bg: "bg-pink-100" },
  { id: "perk-partner-pass", type: "perk", name: "Partner Pass", desc: "Free pass to partner fitness events", cost: 10000, icon: Gift, color: "text-indigo-500", bg: "bg-indigo-100" },
];

const CATEGORIES = [
  { id: "all", label: "All Items", icon: ShoppingBag },
  { id: "frame", label: "Avatar Frames", icon: Frame },
  { id: "title", label: "Profile Titles", icon: Hash },
  { id: "shield", label: "Streak Shields", icon: Shield },
  { id: "perk", label: "Perks & Discounts", icon: Tags },
];

export default function RewardsStore({ user, ownedItems = [], onRedeem, coachRewards = [], onRedeemCoachReward }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [confirming, setConfirming] = useState(null);

  const filtered = activeCategory === "all"
    ? REWARD_ITEMS
    : REWARD_ITEMS.filter(i => i.type === activeCategory);

  const handleRedeem = (item) => {
    if (onRedeem) onRedeem(item.id);
    setConfirming(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-theme-warning-light text-theme-warning rounded-xl">
          <ShoppingBag size={20} />
        </div>
        <div>
          <h1 className="text-xl font-display font-extrabold text-theme-primary">Rewards Store</h1>
          <p className="text-xs text-theme-secondary">Redeem your points for exclusive items and perks</p>
        </div>
      </div>

      {/* Points Balance */}
      <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D95C42 0%, #7C2D12 50%, #1D202B 100%)' }}>
        <div className="absolute right-0 top-0 bottom-0 opacity-5 flex items-center p-4">
          <Star size={120} />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70 font-medium">Your Balance</p>
            <p className="text-3xl font-display font-extrabold mt-1">{user.points.toLocaleString()}</p>
            <p className="text-xs text-white/50 mt-0.5">FitCircle Points</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-display font-extrabold text-yellow-300">{ownedItems.length}</p>
            <p className="text-xs text-white/70">Items Owned</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-display font-bold rounded-xl transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-theme-accent text-white"
                  : "bg-theme-border/30 text-theme-secondary hover:bg-theme-border/50"
              }`}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const Icon = item.icon;
          const owned = ownedItems.includes(item.id);
          const canAfford = user.points >= item.cost && !owned;
          const isConfirming = confirming === item.id;

          return (
            <motion.div
              key={item.id}
              layout
              className="card flex flex-col relative overflow-hidden"
            >
              {owned && (
                <div className="absolute top-3 right-3 bg-theme-success text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  Owned
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
                <Icon size={22} />
              </div>

              <h3 className="text-sm font-display font-bold text-theme-primary">{item.name}</h3>
              <p className="text-xs text-theme-secondary mt-1 flex-1">{item.desc}</p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-theme-border">
                <span className="flex items-center gap-1 text-sm font-display font-extrabold text-theme-primary">
                  <Star size={14} className="text-theme-warning fill-theme-warning" />
                  {item.cost.toLocaleString()}
                </span>

                <AnimatePresence mode="wait">
                  {owned ? (
                    <span className="text-xs font-display font-bold text-theme-success flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Owned
                    </span>
                  ) : isConfirming ? (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-1"
                    >
                      <button
                        onClick={() => handleRedeem(item)}
                        disabled={!canAfford}
                        className="text-[10px] font-display font-bold px-2.5 py-1.5 rounded-lg bg-theme-accent text-white hover:bg-theme-accent-hover transition-all cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirming(null)}
                        className="text-[10px] font-display font-bold px-2 py-1.5 rounded-lg border border-theme-border text-theme-secondary hover:bg-theme-border/30 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="redeem"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setConfirming(item.id)}
                      disabled={!canAfford}
                      className={`text-xs font-display font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                        canAfford
                          ? "bg-theme-warning-light text-theme-warning hover:bg-theme-warning/20"
                          : "bg-theme-border/30 text-theme-muted cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? (
                        <><Gift size={13} /> Redeem</>
                      ) : (
                        <><Lock size={13} /> {user.points < item.cost ? `${item.cost - user.points} more` : "Locked"}</>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-12">
          <ShoppingBag size={36} className="mx-auto text-theme-muted mb-3" />
          <p className="text-sm font-bold text-theme-secondary">No items in this category.</p>
        </div>
      )}

      {/* Coach-Created Rewards */}
      {coachRewards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-4 border-t border-theme-border">
            <div className="p-2 bg-purple-100 text-purple-500 rounded-xl">
              <Award size={16} />
            </div>
            <div>
              <h2 className="text-sm font-display font-extrabold text-theme-primary">Coach Rewards</h2>
              <p className="text-[10px] text-theme-secondary">Exclusive rewards created by your coach</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coachRewards.filter(r => r.active).map((reward) => {
              const typeColors = {
                consultation: { color: "text-purple-500", bg: "bg-purple-100" },
                meal_plan: { color: "text-green-500", bg: "bg-green-100" },
                discount: { color: "text-pink-500", bg: "bg-pink-100" },
                custom: { color: "text-blue-500", bg: "bg-blue-100" },
              };
              const tc = typeColors[reward.type] || typeColors.custom;
              const canAfford = user.points >= reward.cost;
              const isConfirming = confirming === reward.id;

              return (
                <motion.div
                  key={reward.id}
                  layout
                  className="card flex flex-col relative overflow-hidden border-2 border-purple-200/50"
                >
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-xl uppercase tracking-wider">
                    Coach
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${tc.bg} ${tc.color} flex items-center justify-center mb-3`}>
                    <Gift size={22} />
                  </div>

                  <h3 className="text-sm font-display font-bold text-theme-primary">{reward.name}</h3>
                  <p className="text-xs text-theme-secondary mt-1 flex-1">{reward.description}</p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-theme-border">
                    <span className="flex items-center gap-1 text-sm font-display font-extrabold text-theme-primary">
                      <Star size={14} className="text-theme-warning fill-theme-warning" />
                      {reward.cost.toLocaleString()}
                    </span>

                    <AnimatePresence mode="wait">
                      {isConfirming ? (
                        <motion.div
                          key="confirm-cr"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center gap-1"
                        >
                          <button
                            onClick={() => {
                              if (onRedeemCoachReward) onRedeemCoachReward(reward.id);
                              setConfirming(null);
                            }}
                            disabled={!canAfford}
                            className="text-[10px] font-display font-bold px-2.5 py-1.5 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirming(null)}
                            className="text-[10px] font-display font-bold px-2 py-1.5 rounded-lg border border-theme-border text-theme-secondary hover:bg-theme-border/30 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="redeem-cr"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={() => setConfirming(reward.id)}
                          disabled={!canAfford}
                          className={`text-xs font-display font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                            canAfford
                              ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                              : "bg-theme-border/30 text-theme-muted cursor-not-allowed"
                          }`}
                        >
                          {canAfford ? (
                            <><Gift size={13} /> Redeem</>
                          ) : (
                            <><Lock size={13} /> {user.points < reward.cost ? `${reward.cost - user.points} more` : "Locked"}</>
                          )}
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
