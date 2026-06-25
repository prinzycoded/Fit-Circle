import React, { useState, useEffect } from "react";
import { 
  initialDailyMetrics, 
  initialUserProfile, 
  initialFriends, 
  initialFeedPosts, 
  initialBadges, 
  initialChallenges,
  initialAccountabilityGroups,
  initialWeeklyChallenges,
  initialGymProfile,
  initialMemberList,
} from "./MockData";
import Dashboard from "./components/Dashboard";
import DiscountRace from "./components/DiscountRace";
import SocialHub from "./components/SocialHub";
import LeaderboardComponent from "./components/LeaderboardComponents";
import BadgesExhibit from "./components/BadgesExhibit";
import DailyCheckIn from "./components/DailyCheckIn";
import AccountabilityGroups from "./components/AccountabilityGroups";
import WeeklyChallengeSystem from "./components/WeeklyChallengeSystem";
import StreakSystem from "./components/StreakSystem";
import OwnerDashboard from "./components/OwnerDashboard";
import { 
  Flame, 
  Trophy, 
  Dumbbell, 
  Users, 
  Award, 
  Sparkles, 
  Heart,
  ChevronRight,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  Shield,
  RefreshCw,
  UserCheck,
  Target,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY_PREFIX = "fitcircle_";

// Safe cross-browser storage wrapper to handle iframe third-party permission constraints
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage read access denied or unavailable in this context, adopting memory fallback", e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage write access denied or unavailable in this context", e);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage delete access denied or unavailable in this context", e);
    }
  }
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("dashboard");

  // Core App States
  const [metrics, setMetrics] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}metrics`);
      return saved ? JSON.parse(saved) : initialDailyMetrics;
    } catch (e) {
      console.error("Corrupted local metrics storage, resetting to default.", e);
      return initialDailyMetrics;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch (e) {
      console.error("Corrupted local user storage, resetting to default.", e);
      return initialUserProfile;
    }
  });

  const [friends, setFriends] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}friends`);
      return saved ? JSON.parse(saved) : initialFriends;
    } catch (e) {
      console.error("Corrupted local friends storage, resetting to default.", e);
      return initialFriends;
    }
  });

  const [feedPosts, setFeedPosts] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}posts`);
      return saved ? JSON.parse(saved) : initialFeedPosts;
    } catch (e) {
      console.error("Corrupted local posts storage, resetting to default.", e);
      return initialFeedPosts;
    }
  });

  const [badges, setBadges] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}badges`);
      return saved ? JSON.parse(saved) : initialBadges;
    } catch (e) {
      console.error("Corrupted local badges storage, resetting to default.", e);
      return initialBadges;
    }
  });

  const [challenges, setChallenges] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}challenges`);
      return saved ? JSON.parse(saved) : initialChallenges;
    } catch (e) {
      console.error("Corrupted local challenges storage, resetting to default.", e);
      return initialChallenges;
    }
  });

  const [accountabilityGroups, setAccountabilityGroups] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}groups`);
      return saved ? JSON.parse(saved) : initialAccountabilityGroups;
    } catch (e) {
      return initialAccountabilityGroups;
    }
  });

  const [weeklyChallenges, setWeeklyChallenges] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}weeklyChals`);
      return saved ? JSON.parse(saved) : initialWeeklyChallenges;
    } catch (e) {
      return initialWeeklyChallenges;
    }
  });

  // Role State: "client" or "owner"
  const [viewAs, setViewAs] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
      return saved || "client";
    } catch (e) {
      return "client";
    }
  });

  const [gym] = useState(initialGymProfile);
  const [members] = useState(initialMemberList);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}darkMode`);
      return saved === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}darkMode`, darkMode.toString());
  }, [darkMode]);

  // Alert/Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync state with safeStorage
  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}metrics`, JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}friends`, JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}posts`, JSON.stringify(feedPosts));
  }, [feedPosts]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}badges`, JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}challenges`, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}groups`, JSON.stringify(accountabilityGroups));
  }, [accountabilityGroups]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}weeklyChals`, JSON.stringify(weeklyChallenges));
  }, [weeklyChallenges]);

  // Secondary evaluation after logging or changing metrics to see if badges trigger
  useEffect(() => {
    evaluateBadges();
  }, [metrics, user.routinesCompletedThisMonth]);

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Evaluation algorithm for badges
  const evaluateBadges = () => {
    let changed = false;
    const newBadges = badges.map(badge => {
      if (badge.unlocked) return badge;

      let shouldUnlock = false;

      if (badge.id === "century-club" && metrics.steps >= 10000) {
        shouldUnlock = true;
      }
      if (badge.id === "streak-master" && user.streak >= 5) {
        shouldUnlock = true;
      }
      if (badge.id === "discount-racer" && user.routinesCompletedThisMonth >= 20) {
        shouldUnlock = true;
      }
      if (badge.id === "social-butterfly") {
        const completedChalsCount = challenges.filter(c => c.status === "completed").length;
        if (completedChalsCount >= 2) {
          shouldUnlock = true;
        }
      }

      if (shouldUnlock) {
        changed = true;
        setUser(prev => ({ ...prev, points: prev.points + 500 }));
        showToast(`Badge Unlocked: "${badge.title}"! (+500 pts)`, "badge");
        return { ...badge, unlocked: true };
      }
      return badge;
    });

    if (changed) {
      setBadges(newBadges);
    }
  };

  // Handler for Metric changes
  const handleUpdateMetrics = (newMetrics) => {
    // Determine point additions if step or water goals increase
    const stepDiff = newMetrics.steps - metrics.steps;
    const waterDiff = newMetrics.water - metrics.water;
    
    let pointAward = 0;
    if (stepDiff >= 1000) {
      pointAward += Math.floor(stepDiff / 1000) * 10;
    }
    if (waterDiff >= 250) {
      pointAward += Math.floor(waterDiff / 250) * 5;
    }

    if (pointAward > 0) {
      setUser(prev => ({ ...prev, points: prev.points + pointAward }));
      showToast(`+${pointAward} Consistency Points credited!`);
    }

    setMetrics(newMetrics);
  };

  // Handler for logging workout
  const handleLogWorkout = (type, duration, calories) => {
    const pointsGained = 150; // default for active workout logged
    
    // 1. Update user points, streak and routine completed count
    setUser(prev => ({
      ...prev,
      points: prev.points + pointsGained,
      routinesCompletedThisMonth: Math.min(prev.routineTargetMonth, prev.routinesCompletedThisMonth + 1),
    }));

    // 2. Generate sharing feed post
    const newPost = {
      id: `post_new_${Date.now()}`,
      authorName: user.name,
      authorAvatar: user.avatar,
      content: `Just wrapped up an awesome ${duration} minute ${type} session. Feel energetic, healthy and focused! 💪🏁`,
      workout: {
        type: type,
        duration: duration,
        metric: `${calories} kcal burned`,
      },
      likes: 0,
      likedByCount: 0,
      hasLiked: false,
      timestamp: "Just now",
      comments: [],
    };

    setFeedPosts(prev => [newPost, ...prev]);

    // 3. Update active challenge values if applicable
    const updatedChallenges = challenges.map(c => {
      if (c.status !== "active") return c;

      if (c.type === "duration" && c.title.toLowerCase().includes("minutes")) {
        const nextVal = Math.min(c.targetValue, c.currentValue + duration);
        if (nextVal >= c.targetValue && c.currentValue < c.targetValue) {
          // Grant reward points upon completion
          setUser(p => ({ ...p, points: p.points + c.rewardPoints }));
          showToast(`Challenge Complete: "${c.title}"! Joined rewards: +${c.rewardPoints} pts`, "success");
          return { ...c, currentValue: nextVal, status: "completed" };
        }
        return { ...c, currentValue: nextVal };
      }
      
      if (c.type === "frequency" && c.title.toLowerCase().includes("hydrated")) {
        // Log hydration completes another day
        const nextVal = Math.min(c.targetValue, c.currentValue + 1);
        if (nextVal >= c.targetValue && c.currentValue < c.targetValue) {
          setUser(p => ({ ...p, points: p.points + c.rewardPoints }));
          showToast(`Hydration Sprint Complete! +${c.rewardPoints} pts`, "success");
          return { ...c, currentValue: nextVal, status: "completed" };
        }
        return { ...c, currentValue: nextVal };
      }

      return c;
    });

    setChallenges(updatedChallenges);
    showToast(`Shared workout progress to Feed! +${pointsGained} points added.`);
  };

  // Handler for completing a consistency racetrack routine checkoff directly
  const handleIncrementRoutine = () => {
    const nextRoutines = user.routinesCompletedThisMonth + 1;
    if (nextRoutines > user.routineTargetMonth) {
      showToast("Monthly maximum consistency target achieved! You are a superstar.", "info");
      return;
    }

    const pointsGained = 200;

    setUser(prev => ({
      ...prev,
      routinesCompletedThisMonth: nextRoutines,
      points: prev.points + pointsGained,
    }));

    // Generate automatic community feed post too
    const newPost = {
      id: `post_routine_${Date.now()}`,
      authorName: user.name,
      authorAvatar: user.avatar,
      content: `Completed routine day ${nextRoutines}/${user.routineTargetMonth} on the consistency virtual race! One step closer to the monthly coupon reward!`,
      likes: 1,
      likedByCount: 1,
      hasLiked: false,
      timestamp: "Just now",
      comments: []
    };

    setFeedPosts(prev => [newPost, ...prev]);

    // Update active challenge for steps metric or active routine counts
    showToast(`Routine Logged! Moving forward on the consistency map. Added +${pointsGained} points!`);
  };

  // Nudge Like Post on Feed tab
  const handleLikePost = (postId) => {
    setFeedPosts(posts => posts.map(post => {
      if (post.id === postId) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked: hasLiked,
          likes: hasLiked ? post.likes + 1 : post.likes - 1,
        };
      }
      return post;
    }));
  };

  // Add custom comment
  const handleAddComment = (postId, commentText) => {
    setFeedPosts(posts => posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `comment_new_${Date.now()}`,
              authorName: user.name,
              content: commentText,
              timestamp: "Just now",
            }
          ]
        };
      }
      return post;
    }));
  };

  // Accept a challenge card
  const handleAcceptChallenge = (challengeId) => {
    setChallenges(chals => chals.map(c => {
      if (c.id === challengeId) {
        showToast(`Challenge accepted! Let's hit the target before the weekend.`, "info");
        return {
          ...c,
          status: "active",
        };
      }
      return c;
    }));
  };

  // Host dual or dispatch challenge to a friend
  const handleInviteFriendChallenge = (friendName, challengeTitle) => {
    const newChal = {
      id: `chal_new_${Date.now()}`,
      title: challengeTitle,
      description: `Targeted workout race with ${friendName}. Let's push to hit the daily metrics first!`,
      type: "duration",
      targetValue: 200,
      currentValue: 0,
      metricLabel: "min logged",
      daysLeft: 4,
      invitedBy: "You",
      status: "active",
      rewardPoints: 300,
    };

    setChallenges(prev => [newChal, ...prev]);
    showToast(`Dispatched custom Duel challenge to ${friendName}!`, "success");
  };

  // === DAILY CHECK-IN ===
  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (user.lastCheckIn === today) {
      showToast("You already checked in today! Come back tomorrow.", "info");
      return;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const isConsecutive = user.lastCheckIn === yesterday;
    const newCheckInStreak = isConsecutive ? user.checkInStreak + 1 : 1;
    const pointsAwarded = 50 + (isConsecutive ? Math.min(newCheckInStreak * 10, 100) : 0);

    setUser(prev => ({
      ...prev,
      lastCheckIn: today,
      checkInStreak: newCheckInStreak,
      weeklyCheckIns: prev.lastCheckIn !== today ? prev.weeklyCheckIns + (prev.lastCheckIn === yesterday ? 1 : 1) : prev.weeklyCheckIns,
      streak: newCheckInStreak,
      points: prev.points + pointsAwarded,
      longestStreak: Math.max(prev.longestStreak, newCheckInStreak),
    }));

    showToast(`Daily check-in complete! +${pointsAwarded} pts (${newCheckInStreak}d streak)`);
  };

  // === STREAK PROTECTION ===
  const handleBuyStreakFreeze = () => {
    if (user.points < 500) {
      showToast("Need 500 points to buy a Streak Freeze!", "info");
      return;
    }
    setUser(prev => ({
      ...prev,
      points: prev.points - 500,
      streakFreezes: prev.streakFreezes + 1,
    }));
    showToast("Streak Freeze purchased! Your streak is safe tomorrow.");
  };

  const handleUseStreakFreeze = () => {
    if (user.streakFreezes <= 0) {
      showToast("No streak freezes available. Buy one for 500 pts.", "info");
      return;
    }
    setUser(prev => ({
      ...prev,
      streakFreezes: prev.streakFreezes - 1,
    }));
    showToast("Streak Freeze activated! Your streak is protected.");
  };

  // === ACCOUNTABILITY GROUP ===
  const handleNudgeGroupMember = (groupId, memberName) => {
    setAccountabilityGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          members: g.members.map(m => ({
            ...m,
            weeklyMinutes: m.name === memberName ? m.weeklyMinutes + 5 : m.weeklyMinutes,
          })),
        };
      }
      return g;
    }));
    showToast(`Sent encouragement to ${memberName}! +5 min motivation bonus.`);
  };

  const handleJoinGroup = (groupId) => {
    showToast("You're already a member of all available groups!", "info");
  };

  // === WEEKLY CHALLENGES ===
  const handleClaimWeeklyReward = (wcId) => {
    setWeeklyChallenges(prev => prev.map(wc => {
      if (wc.id === wcId && wc.status === "completed") {
        setUser(p => ({
          ...p,
          points: p.points + wc.rewardPoints + (wc.streakBonus > 1 ? wc.rewardPoints * 0.5 : 0),
        }));
        showToast(`Weekly reward claimed! +${wc.rewardPoints + (wc.streakBonus > 1 ? wc.rewardPoints * 0.5 : 0)} pts`);
        return { ...wc, status: "claimed" };
      }
      return wc;
    }));
  };

  // === WEEKLY RESET (called on new week) ===
  const handleResetWeeklyChallenges = () => {
    const newWeekStart = new Date().toISOString().split('T')[0];
    setWeeklyChallenges(prev => prev.map(wc => ({
      ...wc,
      currentValue: 0,
      weekStart: newWeekStart,
      status: "active",
      streakBonus: wc.streakBonus + 1,
      rewardPoints: Math.round(wc.rewardPoints * 1.15),
    })));
    showToast("New weekly challenges are ready! Bonus rewards increased!");
  };

  // Quick reset standard stats for fresh presentation demo
  const handleResetData = () => {
    setShowResetConfirm(true);
  };

  const confirmResetData = () => {
    safeStorage.removeItem(`${STORAGE_KEY_PREFIX}metrics`);
    safeStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
    safeStorage.removeItem(`${STORAGE_KEY_PREFIX}friends`);
    safeStorage.removeItem(`${STORAGE_KEY_PREFIX}posts`);
    safeStorage.removeItem(`${STORAGE_KEY_PREFIX}badges`);
    safeStorage.removeItem(`${STORAGE_KEY_PREFIX}challenges`);
    safeStorage.removeItem(`${STORAGE_KEY_PREFIX}groups`);
    safeStorage.removeItem(`${STORAGE_KEY_PREFIX}weeklyChals`);
    window.location.reload();
  };

  return (
    <div id="applet-viewport" className="min-h-screen bg-theme-bg text-theme-primary antialiased font-body bg-mesh">
      <div className="bg-noise"></div>
      
      {/* Top Main Navigation / Brand Bar */}
      <header id="app-header" className="sticky top-0 z-40 bg-theme-surface/80 backdrop-blur-lg border-b border-theme-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-theme-accent rounded-xl flex items-center justify-center text-white font-display font-extrabold shadow-sm">
              <Dumbbell size={18} className="rotate-45" />
            </div>
            <div>
              <span className="text-base font-display font-extrabold tracking-tight text-theme-primary">FitCircle</span>
              <p className="text-[10px] text-theme-muted font-medium uppercase tracking-widest mt-0.5">Gamified Fitness Social</p>
            </div>
            <button
              id="view-as-toggle-btn"
              onClick={() => {
                const next = viewAs === "client" ? "owner" : "client";
                setViewAs(next);
                safeStorage.setItem(`${STORAGE_KEY_PREFIX}role`, next);
                showToast(next === "owner" ? "Switched to Owner Dashboard" : "Switched to Client View", "info");
              }}
              className={`ml-2 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer text-[10px] font-display font-bold ${
                viewAs === "owner"
                  ? "bg-theme-accent text-white shadow-sm"
                  : "bg-theme-border/40 text-theme-muted hover:text-theme-primary hover:bg-theme-border"
              }`}
              title={viewAs === "owner" ? "Switch to Client View" : "Switch to Owner Dashboard"}
            >
              <Shield size={12} />
              {viewAs === "owner" ? "Owner" : "Client"}
            </button>
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(prev => !prev)}
              className="ml-2 w-8 h-8 rounded-xl flex items-center justify-center bg-theme-border/40 hover:bg-theme-border transition-all text-theme-muted hover:text-theme-primary cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          {/* Quick Realtime Multi-Status Header widget */}
          <div className="flex items-center gap-3">
            
            <div className="hidden sm:flex items-center gap-2.5 bg-theme-support-light border border-theme-border rounded-xl px-3 py-1.5 text-theme-support">
              <Trophy size={14} className="text-theme-accent" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest leading-none text-theme-muted">Your points</p>
                <p className="text-xs font-display font-extrabold mt-0.5">
                  {user.points.toLocaleString()} <span className="text-[10px] text-theme-secondary">pts</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-theme-warning-light border border-theme-border rounded-xl px-3 py-1.5 text-theme-warning">
              <Flame size={14} className="text-theme-warning" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest leading-none text-theme-muted">Active Streak</p>
                <p className="text-xs font-display font-extrabold mt-0.5">
                  {user.streak} <span className="text-[10px] text-theme-secondary">Days</span>
                </p>
              </div>
            </div>

            {/* Profile circular preview */}
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-theme-border shadow-xs">
              <img referrerPolicy="no-referrer" src={user.avatar} alt="Me" className="w-full h-full object-cover" />
            </div>

          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main id="app-main-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {viewAs === "owner" ? (
          <OwnerDashboard
            gym={gym}
            members={members}
          />
        ) : (

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Visual Navigation tabs & Mini Consistency Widget (3 Grid Columns) */}
          <section id="sidebar-col" className="lg:col-span-3 space-y-6">
            
            {/* Visual Navigation + Daily Check-In Combined */}
            <div className="card space-y-1">
              <p className="text-[11px] font-display font-bold uppercase text-theme-muted tracking-widest mb-2 px-1">Navigation</p>
              
              <button
                id="view-dashboard-btn"
                onClick={() => setActiveTab("dashboard")}
                className={`w-full text-left font-display font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-between ${
                  activeTab === "dashboard"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-border/30"
                }`}
              >
                <span>Health Dashboard</span>
                <ChevronRight size={14} className={activeTab === "dashboard" ? "opacity-100" : "opacity-0"} />
              </button>

              <button
                id="view-race-btn"
                onClick={() => setActiveTab("race")}
                className={`w-full text-left font-display font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-between ${
                  activeTab === "race"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-border/30"
                }`}
              >
                <span>Consistency Race</span>
                <ChevronRight size={14} className={activeTab === "race" ? "opacity-100" : "opacity-0"} />
              </button>

              <button
                id="view-social-btn"
                onClick={() => setActiveTab("social")}
                className={`w-full text-left font-display font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-between ${
                  activeTab === "social"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-border/30"
                }`}
              >
                <span>Social Feed & Challenges</span>
                <ChevronRight size={14} className={activeTab === "social" ? "opacity-100" : "opacity-0"} />
              </button>

              <button
                id="view-leaderboard-btn"
                onClick={() => setActiveTab("leaderboard")}
                className={`w-full text-left font-display font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-between ${
                  activeTab === "leaderboard"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-border/30"
                }`}
              >
                <span>Competitor Leaderboard</span>
                <ChevronRight size={14} className={activeTab === "leaderboard" ? "opacity-100" : "opacity-0"} />
              </button>

              <button
                id="view-badges-btn"
                onClick={() => setActiveTab("badges")}
                className={`w-full text-left font-display font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-between ${
                  activeTab === "badges"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-border/30"
                }`}
              >
                <span>Achievement Badges</span>
                <ChevronRight size={14} className={activeTab === "badges" ? "opacity-100" : "opacity-0"} />
              </button>

              <button
                id="view-groups-btn"
                onClick={() => setActiveTab("groups")}
                className={`w-full text-left font-display font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-between ${
                  activeTab === "groups"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-border/30"
                }`}
              >
                <span>Accountability Groups</span>
                <ChevronRight size={14} className={activeTab === "groups" ? "opacity-100" : "opacity-0"} />
              </button>

              <button
                id="view-weekly-chals-btn"
                onClick={() => setActiveTab("weeklyChallenges")}
                className={`w-full text-left font-display font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-between ${
                  activeTab === "weeklyChallenges"
                    ? "bg-theme-accent text-white shadow-sm"
                    : "text-theme-secondary hover:text-theme-primary hover:bg-theme-border/30"
                }`}
              >
                <span>Weekly Challenges</span>
                <ChevronRight size={14} className={activeTab === "weeklyChallenges" ? "opacity-100" : "opacity-0"} />
              </button>

              {/* Divider */}
              <div className="border-t border-theme-border my-2"></div>

              {/* Daily Check-In inside nav card */}
              <DailyCheckIn
                user={user}
                onCheckIn={handleCheckIn}
              />
            </div>

            {/* Consistency Track */}
            <div className="card space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-display font-bold uppercase text-theme-muted tracking-widest">
                <Compass size={12} className="text-theme-accent" />
                <span>Consistency Track</span>
              </div>
              
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-display font-extrabold text-theme-primary">
                    {user.routinesCompletedThisMonth} / {user.routineTargetMonth}
                  </span>
                  <span className="text-[10px] font-display font-extrabold text-theme-support bg-theme-support-light px-2 py-0.5 rounded-full">
                    {Math.round((user.routinesCompletedThisMonth / user.routineTargetMonth) * 100)}%
                  </span>
                </div>
                <p className="text-[10px] text-theme-muted font-medium mt-0.5 uppercase tracking-wide">Workouts Completed This Month</p>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-bar-fill bg-theme-accent"
                  style={{ width: `${(user.routinesCompletedThisMonth / user.routineTargetMonth) * 100}%` }}
                ></div>
              </div>

              <p className="text-[10px] text-theme-secondary font-medium">
                {user.routinesCompletedThisMonth >= 12 
                  ? "Silver Tier Coupon unlocked! Climb to Gold to get 30% off!"
                  : "Complete 5 more routine days to unlock Bronze (10% Off) tier!"}
              </p>
            </div>

            {/* Streak Protection System */}
            <StreakSystem
              user={user}
              onBuyFreeze={handleBuyStreakFreeze}
              onUseFreeze={handleUseStreakFreeze}
            />

            {/* Quick action: Reset simulator */}
            <div className="card text-center">
              <p className="text-[10px] font-medium text-theme-muted">Need a fresh start?</p>
              <button
                id="reset-demo-btn"
                onClick={handleResetData}
                className="mt-2 text-[10px] font-display font-bold text-theme-accent hover:text-theme-accent-hover underline-offset-2 underline cursor-pointer"
              >
                Reset Simulator Data
              </button>
            </div>

          </section>

          {/* RIGHT COLUMN: The Interactive Body View (9 Grid Columns) */}
          <section id="content-col" className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="min-h-500px"
              >
                {activeTab === "dashboard" && (
                  <Dashboard 
                    metrics={metrics}
                    user={user}
                    onUpdateMetrics={handleUpdateMetrics}
                    onLogWorkout={handleLogWorkout}
                  />
                )}

                {activeTab === "race" && (
                  <DiscountRace 
                    user={user}
                    onIncrementRoutine={handleIncrementRoutine}
                  />
                )}

                {activeTab === "social" && (
                  <SocialHub 
                    feed={feedPosts}
                    currentUser={user}
                    onToggleLike={(postId) => handleLikePost(postId)}
                    onAddComment={handleAddComment}
                    onReshare={(postId) => showToast("Post reshared to your network!", "success")}
                  />
                )}

                {activeTab === "leaderboard" && (
                  <LeaderboardComponent 
                    leaderboardData={friends}
                    currentUserId={user.id}
                  />
                )}

                {activeTab === "badges" && (
                  <BadgesExhibit 
                    badges={badges}
                    user={user}
                  />
                )}

                {activeTab === "groups" && (
                  <AccountabilityGroups
                    groups={accountabilityGroups}
                    currentUserId={user.id}
                    onSendNudge={(groupId) => {
                      const group = accountabilityGroups.find(g => g.id === groupId);
                      if (group) {
                        handleNudgeGroupMember(groupId, group.members[0]?.name);
                      }
                    }}
                    onJoinGroup={handleJoinGroup}
                  />
                )}

                {activeTab === "weeklyChallenges" && (
                  <WeeklyChallengeSystem
                    challenges={weeklyChallenges}
                    currentUser={user}
                    onJoinChallenge={(wcId) => showToast("Joined the challenge!", "success")}
                    onClaimReward={handleClaimWeeklyReward}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </section>

        </div>
        )}
      </main>

      {/* Floating global warning-free Toast notification box */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            id="toast-notification-banner"
            className={`fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 p-4 rounded-2xl shadow-xl border z-50 flex items-start gap-3 ${
              toastMessage.type === "badge"
                ? "bg-theme-success border-theme-success text-white"
                : "bg-theme-surface border-theme-border shadow-lg"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-theme-border/30 flex items-center justify-center select-none font-display font-bold text-sm">
              {toastMessage.type === "badge" ? "A" : "i"}
            </div>
            <div className="flex-1 space-y-0.5">
              <span className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-widest block">
                FitCircle
              </span>
              <p className="text-xs font-display font-bold leading-tight text-theme-primary">
                {toastMessage.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Non-blocking confirmation modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card max-w-sm w-full space-y-5 text-center"
            >
              <div className="w-12 h-12 bg-theme-accent-light rounded-full flex items-center justify-center mx-auto font-display font-bold text-theme-accent text-lg">
                !
              </div>
              <h3 className="text-lg font-display font-extrabold text-theme-primary">Reset Simulator?</h3>
              <p className="text-xs text-theme-secondary leading-relaxed font-medium">
                This will wipe your streaks, workouts, challenges, and metrics to restore the default showcase. Are you sure?
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-theme-border text-xs font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmResetData}
                  className="flex-1 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-xs font-display font-bold text-white transition-all cursor-pointer"
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Client Centered Footer */}
      <footer id="app-footer" className="border-t border-theme-border py-6 text-center text-xs text-theme-muted mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 FitCircle {viewAs === "owner" ? "Gym Management" : "Applet"} • {viewAs === "owner" ? "Empowering your gym community." : "Put yourself at the center of your fitness journey."}</p>
          <div className="flex gap-4">
            <span className="hover:text-theme-secondary cursor-pointer">Terms</span>
            <span className="hover:text-theme-secondary cursor-pointer">Privacy</span>
            <span className="hover:text-theme-secondary cursor-pointer text-theme-accent font-bold" onClick={handleResetData}>Clear Cache</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

