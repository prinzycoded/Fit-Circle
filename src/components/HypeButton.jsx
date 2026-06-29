import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const EMOJIS = ["🔥", "💪", "👊", "⚡", "🔥", "💥", "🙌", "👏"];

function getRandomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

function BurstParticle({ id, x, emoji, onComplete }) {
  const angle = Math.random() * Math.PI * 2;
  const distance = 60 + Math.random() * 80;
  const xEnd = Math.cos(angle) * distance;
  const yEnd = Math.sin(angle) * distance - 40;

  return (
    <motion.span
      key={id}
      initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
      animate={{ x: xEnd, y: yEnd, opacity: 0, scale: 1.4 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 + Math.random() * 0.4, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="absolute pointer-events-none text-lg z-50"
      style={{ left: x, top: -8 }}
    >
      {emoji}
    </motion.span>
  );
}

export default function HypeButton({ liked, count, onToggle }) {
  const [burstParticles, setBurstParticles] = useState([]);
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [optimisticCount, setOptimisticCount] = useState(count);
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);
  const buttonRef = useRef(null);
  const particleId = useRef(0);

  const syncFromProps = () => {
    setOptimisticLiked(liked);
    setOptimisticCount(count);
  };

  const triggerBurst = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const newParticles = [];
    const particleCount = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `burst_${particleId.current++}`,
        x: centerX + (Math.random() - 0.5) * 40,
        emoji: getRandomEmoji(),
      });
    }
    setBurstParticles(prev => [...prev, ...newParticles]);
  }, []);

  const handlePointerDown = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      triggerBurst();
    }, 400);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!isLongPress.current) {
      const nextLiked = !optimisticLiked;
      setOptimisticLiked(nextLiked);
      setOptimisticCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));
      onToggle();
    }
    isLongPress.current = false;
  };

  const removeParticle = (id) => {
    setBurstParticles(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={buttonRef}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
          isLongPress.current = false;
        }}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onTouchCancel={() => {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
          isLongPress.current = false;
        }}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all select-none cursor-pointer overflow-visible ${
          optimisticLiked
            ? "bg-theme-accent/15 text-theme-accent border border-theme-accent/30 shadow-sm"
            : "text-theme-muted hover:text-theme-primary hover:bg-theme-border/30 border border-transparent"
        }`}
      >
        <motion.span
          key={optimisticLiked ? "liked" : "unliked"}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="inline-block"
        >
          {optimisticLiked ? "🔥" : "💪"}
        </motion.span>
        <motion.span
          key={optimisticCount}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {optimisticCount}
        </motion.span>

        <AnimatePresence>
          {burstParticles.map(p => (
            <BurstParticle
              key={p.id}
              id={p.id}
              x={p.x}
              emoji={p.emoji}
              onComplete={() => removeParticle(p.id)}
            />
          ))}
        </AnimatePresence>
      </button>
    </div>
  );
}
