import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
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
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
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
  Moon,
  LogOut,
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

const initialDailyMetrics = {
  steps: 7420, stepGoal: 10000, water: 1400, waterGoal: 2500,
  sleep: 6.8, sleepGoal: 8.0, activeMinutes: 35, activeMinutesGoal: 45,
  caloriesBurned: 380, caloriesBurnedGoal: 550, weight: 74.5,
};

const initialUserProfile = {
  id: "me",
  name: "You (Alex)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  points: 14200, streak: 5, routinesCompletedThisMonth: 14, routineTargetMonth: 20,
  unlockedBadges: ["early-bird", "water-master"], streakFreezes: 2, longestStreak: 14,
  lastCheckIn: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  checkInStreak: 5, weeklyCheckIns: 4,
};

const initialFriends = [
  { id: "liam", name: "Liam Carter", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", points: { today: 1850, week: 11200, month: 18950 }, streak: 12, status: "online", lastActive: "Active now" },
  { id: "noah", name: "Noah Reynolds", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", points: { today: 1420, week: 9800, month: 17430 }, streak: 8, status: "offline", lastActive: "15m ago" },
  { id: "jessica", name: "Jessica Vance", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", points: { today: 1680, week: 10400, month: 16880 }, streak: 9, status: "online", lastActive: "Active now" },
  { id: "ava", name: "Ava Mitchell", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80", points: { today: 1210, week: 7650, month: 15120 }, streak: 4, status: "online", lastActive: "Active 5m ago" },
  { id: "chloe", name: "Chloe Bennett", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", points: { today: 950, week: 8900, month: 14760 }, streak: 15, status: "offline", lastActive: "1h ago" },
  { id: "daniel", name: "Daniel Craig", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", points: { today: 1300, week: 7900, month: 13920 }, streak: 6, status: "online", lastActive: "Active now" },
];

const initialFeedPosts = [
  { id: "post1", authorName: "Liam Carter", authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", content: "Smashed out a solid morning run around Sydney Harbour! The weather was absolute perfection today. Who's hitting their active minutes goal?", workout: { type: "Run", duration: 45, metric: "7.2 km (420 kcal)" }, likes: 12, likedByCount: 12, hasLiked: false, timestamp: "2 hours ago", comments: [{ id: "c1", authorName: "Jessica Vance", content: "Killing it! Setting a high bar for the weekly leaderboard index!", timestamp: "1 hour ago" }] },
  { id: "post2", authorName: "Jessica Vance", authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", content: "Just finished an intense HIIT session! Sweat level 100. Feel amazing now! 🧘‍♀️💦", workout: { type: "HIIT", duration: 30, metric: "350 kcal" }, likes: 8, likedByCount: 8, hasLiked: false, timestamp: "4 hours ago", comments: [] },
  { id: "post3", authorName: "Ava Mitchell", authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80", content: "Unwinding after a busy day with 20 minutes of gentle yoga. Mindset re-centered.", workout: { type: "Yoga", duration: 20, metric: "Gentle Flow (110 kcal)" }, likes: 5, likedByCount: 5, hasLiked: false, timestamp: "Yesterday", comments: [{ id: "c2", authorName: "Noah Reynolds", content: "Yoga is so underrated. I need to add that to my routine!", timestamp: "Yesterday" }] },
];

const initialBadges = [
  { id: "early-bird", title: "Rising Star", description: "Logged a workout before 8:00 AM.", icon: "🌅", category: "Activity", requirementText: "Complete a workout before 8 AM", unlocked: true },
  { id: "water-master", title: "Aqua Champion", description: "Exceeded daily hydration target for three consecutive days.", icon: "💧", category: "Hydration", requirementText: "Hit water goal 3 days in a row", unlocked: true },
  { id: "streak-master", title: "Unstoppable", description: "Maintained an active habit streak of 5 days or more.", icon: "🔥", category: "Consistency", requirementText: "Maintain a 5-day streak", unlocked: false },
  { id: "social-butterfly", title: "Squad Captain", description: "Invited friends or shared, and finished 2 group fitness challenges.", icon: "👑", category: "Social", requirementText: "Complete 2 group challenges", unlocked: false },
  { id: "century-club", title: "10K Stepper", description: "Walked 10,000+ steps in a single day.", icon: "👣", category: "Activity", requirementText: "Reach 10,000 steps in one day", unlocked: false },
  { id: "discount-racer", title: "Value Champion", description: "Unlocked the top 30% monthly fitness discount code.", icon: "🏷️", category: "Consistency", requirementText: "Complete 20 routines in a month", unlocked: false },
];

const initialChallenges = [
  { id: "chal1", title: "Active Minutes Sprinter", description: "Let's log 150 minutes of high intensity workouts together before Sunday!", type: "duration", targetValue: 150, currentValue: 35, metricLabel: "min logged", daysLeft: 3, invitedBy: "Liam Carter", status: "pending", rewardPoints: 250 },
  { id: "chal2", title: "Stepping into Summer", description: "Challenge to reach 30,000 steps over 3 days! Keep moving!", type: "steps", targetValue: 30000, currentValue: 7420, metricLabel: "steps walked", daysLeft: 2, status: "active", rewardPoints: 400 },
  { id: "chal3", title: "Consistently hydrated", description: "Drink at least 2.0 Liters of water every day for 5 days.", type: "frequency", targetValue: 5, currentValue: 3, metricLabel: "days compliant", daysLeft: 1, status: "active", rewardPoints: 200 },
];

const initialAccountabilityGroups = [
  { id: "group1", name: "Morning Movers", description: "Early birds who crush workouts before 8 AM. Daily check-in required!", members: [{ id: "liam", name: "Liam Carter", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", weeklyMinutes: 210, lastActive: "Active now", status: "online" }, { id: "jessica", name: "Jessica Vance", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", weeklyMinutes: 180, lastActive: "Active now", status: "online" }, { id: "me", name: "You (Alex)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", weeklyMinutes: 150, lastActive: "Active now", status: "online" }, { id: "noah", name: "Noah Reynolds", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", weeklyMinutes: 90, lastActive: "15m ago", status: "offline" }], groupChallenge: { title: "500 Minutes Together", target: 500, current: 420, unit: "min", deadline: "Sunday" }, weeklyRanking: [{ id: "liam", name: "Liam Carter", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", points: 3200 }, { id: "jessica", name: "Jessica Vance", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", points: 2800 }, { id: "me", name: "You (Alex)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", points: 2100 }, { id: "noah", name: "Noah Reynolds", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", points: 1200 }] },
  { id: "group2", name: "Weekend Warriors", description: "We go hard on weekends! Join us for Saturday HIIT and Sunday long runs.", members: [{ id: "ava", name: "Ava Mitchell", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80", weeklyMinutes: 160, lastActive: "Active 5m ago", status: "online" }, { id: "chloe", name: "Chloe Bennett", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", weeklyMinutes: 200, lastActive: "1h ago", status: "offline" }], groupChallenge: { title: "Weekend 10K Steps Each Day", target: 60000, current: 32000, unit: "steps", deadline: "Monday" }, weeklyRanking: [{ id: "chloe", name: "Chloe Bennett", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", points: 1800 }, { id: "ava", name: "Ava Mitchell", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80", points: 1500 }] },
];

const initialWeeklyChallenges = [
  { id: "wc1", title: "Step Surge", description: "Walk 50,000 steps this week! Break it down to ~7,100 daily.", type: "steps", targetValue: 50000, currentValue: 12400, metricLabel: "steps", rewardPoints: 600, weekStart: "2026-06-22", weekEnd: "2026-06-28", status: "active", streakBonus: 1 },
  { id: "wc2", title: "HIIT x3", description: "Complete 3 HIIT sessions this week. Intensity matters!", type: "frequency", targetValue: 3, currentValue: 1, metricLabel: "sessions", rewardPoints: 450, weekStart: "2026-06-22", weekEnd: "2026-06-28", status: "active", streakBonus: 1 },
  { id: "wc3", title: "Hydration Hero", description: "Drink 2L+ water for 5 days this week.", type: "frequency", targetValue: 5, currentValue: 5, metricLabel: "days", rewardPoints: 350, weekStart: "2026-06-22", weekEnd: "2026-06-28", status: "completed", streakBonus: 1 },
];

const initialGymProfile = {
  id: "gym-1", name: "Fit Circle Gym", ownerName: "Marcus Chen",
  ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  totalMembers: 48, activeToday: 31, totalPointsDistributed: 847500, avgMemberStreak: 6.2,
  monthlyRevenue: 12450, memberGoal: 75, monthlyActiveGoal: 40, since: "2024-09",
  plans: [{ name: "Basic", members: 18, price: 29 }, { name: "Standard", members: 22, price: 49 }, { name: "Premium", members: 8, price: 79 }],
};

const initialMemberList = [
  { id: "liam", name: "Liam Carter", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", email: "liam.c@fitcircle.com", plan: "Premium", joined: "2025-11-03", points: 18950, streak: 12, checkInsThisMonth: 18, lastActive: "Active now", status: "online", metrics: { steps: 8450, water: 1900, activeMinutes: 42, caloriesBurned: 410 }, goals: { stepGoal: 10000, waterGoal: 2500, activeMinutesGoal: 45 } },
  { id: "noah", name: "Noah Reynolds", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", email: "noah.r@fitcircle.com", plan: "Standard", joined: "2025-12-14", points: 17430, streak: 8, checkInsThisMonth: 14, lastActive: "15m ago", status: "offline", metrics: { steps: 6200, water: 1600, activeMinutes: 30, caloriesBurned: 290 }, goals: { stepGoal: 10000, waterGoal: 2500, activeMinutesGoal: 45 } },
  { id: "jessica", name: "Jessica Vance", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", email: "jessica.v@fitcircle.com", plan: "Premium", joined: "2025-10-20", points: 16880, streak: 9, checkInsThisMonth: 20, lastActive: "Active now", status: "online", metrics: { steps: 9200, water: 2100, activeMinutes: 55, caloriesBurned: 520 }, goals: { stepGoal: 10000, waterGoal: 2500, activeMinutesGoal: 60 } },
  { id: "ava", name: "Ava Mitchell", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80", email: "ava.m@fitcircle.com", plan: "Standard", joined: "2026-01-08", points: 15120, streak: 4, checkInsThisMonth: 10, lastActive: "Active 5m ago", status: "online", metrics: { steps: 5100, water: 1400, activeMinutes: 25, caloriesBurned: 210 }, goals: { stepGoal: 10000, waterGoal: 2500, activeMinutesGoal: 45 } },
  { id: "chloe", name: "Chloe Bennett", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", email: "chloe.b@fitcircle.com", plan: "Basic", joined: "2026-02-19", points: 14760, streak: 15, checkInsThisMonth: 22, lastActive: "1h ago", status: "offline", metrics: { steps: 11000, water: 2400, activeMinutes: 60, caloriesBurned: 580 }, goals: { stepGoal: 12000, waterGoal: 3000, activeMinutesGoal: 60 } },
  { id: "daniel", name: "Daniel Craig", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", email: "daniel.c@fitcircle.com", plan: "Standard", joined: "2026-03-01", points: 13920, streak: 6, checkInsThisMonth: 13, lastActive: "Active now", status: "online", metrics: { steps: 7300, water: 1800, activeMinutes: 35, caloriesBurned: 340 }, goals: { stepGoal: 10000, waterGoal: 2500, activeMinutesGoal: 45 } },
];

export default function App() {
  const { firebaseUser, loading, logout } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState("welcome");

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

  // Sync Firebase user info into the app user state on login
  useEffect(() => {
    if (firebaseUser) {
      const displayName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";
      setUser(prev => ({
        ...prev,
        name: displayName,
        email: firebaseUser.email || prev.email,
        avatar: firebaseUser.photoURL || prev.avatar,
      }));
      // Sync role from localStorage (set by AuthForm before login)
      try {
        const savedRole = localStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
        if (savedRole === "owner" || savedRole === "client") {
          setViewAs(savedRole);
        }
      } catch (e) { /* ignore */ }
    }
  }, [firebaseUser?.uid]);

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
    let challengeCompleted = false;
    const updatedChallenges = challenges.map(c => {
      if (c.status !== "active") return c;

      if (c.type === "duration" && c.title.toLowerCase().includes("minutes")) {
        const nextVal = Math.min(c.targetValue, c.currentValue + duration);
        if (nextVal >= c.targetValue && c.currentValue < c.targetValue) {
          setUser(p => ({ ...p, points: p.points + c.rewardPoints }));
          challengeCompleted = true;
          return { ...c, currentValue: nextVal, status: "completed" };
        }
        return { ...c, currentValue: nextVal };
      }
      
      if (c.type === "frequency" && c.title.toLowerCase().includes("hydrated")) {
        const nextVal = Math.min(c.targetValue, c.currentValue + 1);
        if (nextVal >= c.targetValue && c.currentValue < c.targetValue) {
          setUser(p => ({ ...p, points: p.points + c.rewardPoints }));
          challengeCompleted = true;
          return { ...c, currentValue: nextVal, status: "completed" };
        }
        return { ...c, currentValue: nextVal };
      }

      return c;
    });

    setChallenges(updatedChallenges);
    if (!challengeCompleted) {
      showToast(`Shared workout progress to Feed! +${pointsGained} points added.`);
    }
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

  // Create a custom user post on the social feed
  const handleCreatePost = (content, type, image) => {
    const newPost = {
      id: `post_user_${Date.now()}`,
      authorName: user.name,
      authorAvatar: user.avatar,
      type: type || "Milestone",
      content: content,
      image: image || null,
      likes: 0,
      likedByCount: 0,
      hasLiked: false,
      timestamp: "Just now",
      comments: [],
    };
    setFeedPosts(prev => [newPost, ...prev]);
    showToast("Your post has been shared with the community!", "success");
  };

  // Remove a post (owner moderation)
  const handleRemovePost = (postId) => {
    setFeedPosts(prev => prev.filter(p => p.id !== postId));
    showToast("Post has been removed from the feed.", "info");
  };

  // Gym announcement (owner)
  const handleCreateAnnouncement = (content) => {
    const newPost = {
      id: `post_announce_${Date.now()}`,
      authorName: gym.name,
      authorAvatar: gym.ownerAvatar,
      type: "Announcement",
      content: content,
      likes: 0,
      likedByCount: 0,
      hasLiked: false,
      timestamp: "Just now",
      comments: [],
      pinned: true,
    };
    setFeedPosts(prev => [newPost, ...prev]);
    showToast("Announcement sent to all members!", "success");
  };

  // Give a member shoutout (owner)
  const handleCreateShoutout = (memberName, memberAvatar, reason) => {
    const newPost = {
      id: `post_shoutout_${Date.now()}`,
      authorName: gym.name,
      authorAvatar: gym.ownerAvatar,
      type: "Milestone",
      content: `Owner Shoutout: ${memberName} ${reason}`,
      likes: 0,
      likedByCount: 0,
      hasLiked: false,
      timestamp: "Just now",
      comments: [],
    };
    setFeedPosts(prev => [newPost, ...prev]);
    showToast(`Shoutout sent for ${memberName}!`, "success");
  };

  // Create a gym-wide challenge (owner)
  const handleCreateOwnerChallenge = (title, description, type, targetValue, metricLabel, daysLeft, rewardPoints) => {
    const newChallenge = {
      id: `owner_chal_${Date.now()}`,
      title,
      description,
      type,
      targetValue,
      currentValue: 0,
      metricLabel,
      daysLeft,
      invitedBy: gym.name,
      status: "active",
      rewardPoints,
      createdByOwner: true,
    };
    setChallenges(prev => [newChallenge, ...prev]);
    showToast(`Challenge "${title}" created and sent to all members!`, "success");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-theme-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-theme-muted font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <LoginPage />;
  }

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
              <p className="text-[10px] text-theme-muted font-medium uppercase tracking-widest mt-0.5">{viewAs === "owner" ? "Gym Management" : "Gamified Fitness Social"}</p>
            </div>
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

            {firebaseUser && (
              <button
                onClick={logout}
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-theme-border/40 hover:bg-theme-border transition-all text-theme-muted hover:text-theme-primary cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main id="app-main-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {viewAs === "owner" ? (
          <OwnerDashboard
            gym={gym}
            members={members}
            feedPosts={feedPosts}
            challenges={challenges}
            accountabilityGroups={accountabilityGroups}
            currentUser={user}
            onRemovePost={handleRemovePost}
            onCreateAnnouncement={handleCreateAnnouncement}
            onCreateShoutout={handleCreateShoutout}
            onCreateChallenge={handleCreateOwnerChallenge}
            onNudgeGroup={handleNudgeGroupMember}
          />
        ) : (

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Sidebar Navigation Panel */}
          <section id="sidebar-col" className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">

              {/* User Profile Card */}
              <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #D95C42 0%, #1D202B 100%)' }}>
                <div className="absolute right-0 top-0 bottom-0 opacity-10">
                  <Dumbbell size={80} className="rotate-45" />
                </div>
                <div className="relative z-10 flex items-center gap-3">
                  <img referrerPolicy="no-referrer" src={user.avatar} alt="" className="w-11 h-11 rounded-xl border-2 border-white/30 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-bold truncate">{user.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Trophy size={11} className="text-theme-warning" />
                      <span className="text-[10px] text-white/80 font-medium">{user.points.toLocaleString()} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="rounded-2xl overflow-hidden border border-theme-border bg-theme-surface/60 backdrop-blur-sm">
                {[
                  { tab: "welcome", label: "Home", icon: Compass },
                  { tab: "dashboard", label: "Health Dashboard", icon: Heart },
                  { tab: "race", label: "Consistency Race", icon: Target },
                  { tab: "social", label: "Social Feed", icon: Users },
                  { tab: "leaderboard", label: "Leaderboard", icon: Trophy },
                  { tab: "badges", label: "Achievement Badges", icon: Award },
                  { tab: "groups", label: "Accountability Groups", icon: Shield },
                  { tab: "weeklyChallenges", label: "Weekly Challenges", icon: Calendar },
                ].map(({ tab, label, icon: Icon }) => (
                  <button
                    key={tab}
                    id={`view-${tab}-btn`}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left font-display font-bold text-xs py-3 px-4 transition-all flex items-center gap-3 cursor-pointer ${
                      activeTab === tab
                        ? "bg-theme-accent text-white shadow-sm"
                        : "text-theme-secondary hover:text-theme-primary hover:bg-theme-border/20"
                    }`}
                  >
                    <Icon size={16} className={activeTab === tab ? "text-white" : "text-theme-muted"} />
                    <span className="flex-1">{label}</span>
                    {activeTab === tab && <ChevronRight size={14} className="text-white/70" />}
                  </button>
                ))}
              </nav>

              {/* Quick action: Reset simulator */}
              <div className="rounded-2xl border border-theme-border bg-theme-surface/40 backdrop-blur-sm p-4 text-center">
                <p className="text-[10px] font-medium text-theme-muted">Need a fresh start?</p>
                <button
                  id="reset-demo-btn"
                  onClick={handleResetData}
                  className="mt-2 text-[10px] font-display font-bold text-theme-accent hover:text-theme-accent-hover underline-offset-2 underline cursor-pointer"
                >
                  Reset Simulator Data
                </button>
              </div>

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
                {activeTab === "welcome" && (
                  <WelcomePage
                    user={user}
                    badges={badges}
                    onCheckIn={handleCheckIn}
                    onBuyFreeze={handleBuyStreakFreeze}
                    onUseFreeze={handleUseStreakFreeze}
                  />
                )}

                {activeTab === "dashboard" && (
                  <Dashboard 
                    metrics={metrics}
                    user={user}
                    challenges={challenges}
                    badges={badges}
                    feedPosts={feedPosts}
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
                    onCreatePost={handleCreatePost}
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

