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
import CoachWorkoutBuilder from "./components/CoachWorkoutBuilder";
import WorkoutPlanView from "./components/WorkoutPlanView";
import ProgressTracker from "./components/ProgressTracker";
import ChallengeHeroCard from "./components/ChallengeHeroCard";
import ReminderSystem from "./components/ReminderSystem";
import SubscriptionPlans from "./components/SubscriptionPlans";
import RewardsStore from "./components/RewardsStore";
import CoachChat from "./components/CoachChat";
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
  LogOut,
  Ruler,
  Camera,
  Bell,
  Clock,
  Gift,
  ChevronDown,
  UserPlus,
  Activity,
  BarChart3,
  Image,
  ShoppingBag,
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
  { id: "steps-10k", title: "First 10K Steps", description: "Walked 10,000 steps in a single day.", icon: "👣", category: "Activity", requirementText: "Reach 10,000 steps in one day", unlocked: false },
  { id: "steps-50k", title: "50K Stepper", description: "Walked 50,000 total steps.", icon: "🏃", category: "Activity", requirementText: "Walk 50,000 total steps", unlocked: false },
  { id: "hydration-3day", title: "Hydration Streak Master", description: "Hit water goal 3 days in a row.", icon: "💧", category: "Hydration", requirementText: "Hit water goal 3 days in a row", unlocked: false },
  { id: "workout-10", title: "Dedicated Athlete", description: "Completed 10 workouts total.", icon: "💪", category: "Activity", requirementText: "Complete 10 workouts", unlocked: false },
  { id: "streak-7", title: "Week Warrior", description: "Maintained a 7-day streak.", icon: "🔥", category: "Consistency", requirementText: "Maintain a 7-day streak", unlocked: false },
  { id: "streak-30", title: "Monthly Legend", description: "Maintained a 30-day streak.", icon: "🏆", category: "Consistency", requirementText: "Maintain a 30-day streak", unlocked: false },
  { id: "challenge-3", title: "Challenge Conqueror", description: "Completed 3 challenges.", icon: "🎯", category: "Social", requirementText: "Complete 3 challenges", unlocked: false },
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

const initialWorkoutPlans = [];

const initialAssignedWorkouts = [];

const initialProgressData = {
  weight: [
    { date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0], value: 75.2 },
    { date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], value: 74.8 },
    { date: new Date().toISOString().split('T')[0], value: 74.5 },
  ],
  measurements: {
    chest: [{ date: new Date().toISOString().split('T')[0], value: 95 }],
    waist: [{ date: new Date().toISOString().split('T')[0], value: 82 }],
    arms: [{ date: new Date().toISOString().split('T')[0], value: 35 }],
    thighs: [{ date: new Date().toISOString().split('T')[0], value: 52 }],
  },
  photos: [],
};

const initialReminderSettings = {
  enabled: true,
  workoutReminders: true,
  checkInReminder: true,
  wateringReminder: false,
  reminderTime: "08:00",
  reminderDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  lastReminded: null,
};

const initialFeaturedChallenge = {
  id: "fc1",
  title: "Summer Shred Challenge",
  description: "Complete 20 workout sessions this month. Burn fat, build muscle, and compete for exclusive subscription discounts!",
  challengeType: "time-based",
  targetValue: 20,
  currentValue: 3,
  metricLabel: "workout sessions",
  daysLeft: 25,
  rules: [
    "Complete 20 workout sessions (any type: Run, HIIT, Strength, Yoga, etc.)",
    "Each session must be at least 20 minutes long",
    "Log each session within 24 hours of completion",
    "The first 3 members to finish win the discount rewards",
    "Only logged workouts count — share them to the feed",
  ],
  rewards: [
    { rank: 1, label: "1st Place — 20% OFF", discount: 20, claimed: false, claimedBy: null },
    { rank: 2, label: "2nd Place — 17% OFF", discount: 17, claimed: false, claimedBy: null },
    { rank: 3, label: "3rd Place — 15% OFF", discount: 15, claimed: false, claimedBy: null },
  ],
  participants: [
    { id: "liam", name: "Liam Carter", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80", progress: 8 },
    { id: "jessica", name: "Jessica Vance", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80", progress: 6 },
    { id: "me", name: "You (Alex)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80", progress: 3 },
    { id: "noah", name: "Noah Reynolds", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&auto=format&fit=crop&q=80", progress: 1 },
  ],
  completers: [],
  badge: { icon: "🏆", name: "Summer Shred Champion" },
  createdBy: "FitCircle Coach",
  status: "active",
  startDate: "2026-07-01",
  endDate: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
};

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
  const [authEntryDone, setAuthEntryDone] = useState(false);

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
  const [workoutPlans, setWorkoutPlans] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}workoutPlans`);
      return saved ? JSON.parse(saved) : initialWorkoutPlans;
    } catch (e) {
      return initialWorkoutPlans;
    }
  });

  const [assignedWorkouts, setAssignedWorkouts] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}assignedWorkouts`);
      return saved ? JSON.parse(saved) : initialAssignedWorkouts;
    } catch (e) {
      return initialAssignedWorkouts;
    }
  });

  const [workoutPlanRequests, setWorkoutPlanRequests] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}workoutRequests`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [progressData, setProgressData] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}progressData`);
      return saved ? JSON.parse(saved) : initialProgressData;
    } catch (e) {
      return initialProgressData;
    }
  });

  const [reminderSettings, setReminderSettings] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}reminderSettings`);
      return saved ? JSON.parse(saved) : initialReminderSettings;
    } catch (e) {
      return initialReminderSettings;
    }
  });

  const [featuredChallenge, setFeaturedChallenge] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}featuredChallenge`);
      return saved ? JSON.parse(saved) : initialFeaturedChallenge;
    } catch (e) {
      return initialFeaturedChallenge;
    }
  });

  const [viewAs, setViewAs] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
      return saved || "client";
    } catch (e) {
      return "client";
    }
  });

  const [gym, setGym] = useState(initialGymProfile);
  const [members, setMembers] = useState(initialMemberList);

  // Subscription state
  const [userPlan, setUserPlan] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}userPlan`);
      return saved || null;
    } catch (e) {
      return null;
    }
  });

  const [ownedItems, setOwnedItems] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}ownedItems`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleRedeemItem = (itemId) => {
    const items = [
      { id: "frame-gold", cost: 3000 }, { id: "frame-neon", cost: 5000 }, { id: "frame-champion", cost: 8000 },
      { id: "title-streaker", cost: 2000 }, { id: "title-marathoner", cost: 4000 }, { id: "title-hydration", cost: 2500 },
      { id: "shield-basic", cost: 1500 }, { id: "shield-premium", cost: 3500 },
      { id: "perk-basic-discount", cost: 6000 }, { id: "perk-premium-discount", cost: 12000 }, { id: "perk-partner-pass", cost: 10000 },
    ];
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    if (ownedItems.includes(itemId)) {
      showToast("You already own this item.", "info");
      return;
    }
    if (user.points < item.cost) {
      showToast("Not enough points!", "error");
      return;
    }
    setUser(prev => ({ ...prev, points: prev.points - item.cost }));
    setOwnedItems(prev => [...prev, itemId]);
    // Apply streak shields immediately
    if (itemId === "shield-basic") {
      setUser(prev => ({ ...prev, streakFreezes: prev.streakFreezes + 1 }));
    }
    if (itemId === "shield-premium") {
      setUser(prev => ({ ...prev, streakFreezes: prev.streakFreezes + 3 }));
    }
    showToast(`Redeemed ${itemId.includes("frame") ? "Avatar Frame" : itemId.includes("title") ? "Profile Title" : itemId.includes("shield") ? "Streak Shield" : "Perk"}!`, "success");
  };

  const [coachMessages, setCoachMessages] = useState(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEY_PREFIX}coachMessages`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleSendCoachMessage = (content) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      role: "client",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const isFirstMessage = coachMessages.length === 0;
    setCoachMessages(prev => [...prev, newMsg]);
    if (isFirstMessage) {
      setTimeout(() => {
        setCoachMessages(prev => [...prev, {
          id: `msg_reply_${Date.now()}`,
          role: "coach",
          content: "Thanks for reaching out! I'll check on this and get back to you soon. Keep up the great work! 💪",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
      }, 1500);
    }
    showToast("Message sent to your coach!", "success");
  };

  const handleSendCoachReply = (content) => {
    const newMsg = {
      id: `msg_coach_${Date.now()}`,
      role: "coach",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setCoachMessages(prev => [...prev, newMsg]);
    showToast("Reply sent!", "success");
  };

  const handleSubscribe = (planName) => {
    setUserPlan(planName);
    setMembers(prev => prev.map(m =>
      m.id === user.id ? { ...m, plan: planName } : m
    ));
    showToast(`You're now on the ${planName} plan! Welcome aboard.`, "success");
  };

  // Alert/Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

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

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}workoutPlans`, JSON.stringify(workoutPlans));
  }, [workoutPlans]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}assignedWorkouts`, JSON.stringify(assignedWorkouts));
  }, [assignedWorkouts]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}workoutRequests`, JSON.stringify(workoutPlanRequests));
  }, [workoutPlanRequests]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}progressData`, JSON.stringify(progressData));
  }, [progressData]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}reminderSettings`, JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}featuredChallenge`, JSON.stringify(featuredChallenge));
  }, [featuredChallenge]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}userPlan`, userPlan);
  }, [userPlan]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}ownedItems`, JSON.stringify(ownedItems));
  }, [ownedItems]);

  useEffect(() => {
    safeStorage.setItem(`${STORAGE_KEY_PREFIX}coachMessages`, JSON.stringify(coachMessages));
  }, [coachMessages]);

  // Auto-proceed when Firebase session is restored on page reload
  useEffect(() => {
    if (firebaseUser && !loading) {
      setAuthEntryDone(true);
    }
  }, [firebaseUser, loading]);

  // Sync Firebase user info into the app user state on login
  useEffect(() => {
    if (firebaseUser) {
      const displayName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";
      setUser(prev => ({
        ...prev,
        id: firebaseUser.uid,
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
  }, [firebaseUser?.uid, firebaseUser?.displayName, firebaseUser?.photoURL]);

  // Sync Firebase user info into the gym owner profile on login
  useEffect(() => {
    if (firebaseUser) {
      const ownerName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Gym Owner";
      setGym(prev => ({
        ...prev,
        ownerName: ownerName,
        ownerAvatar: firebaseUser.photoURL || prev.ownerAvatar,
      }));
    }
  }, [firebaseUser?.uid, firebaseUser?.displayName, firebaseUser?.photoURL]);

  // Sync Firebase auth users into the members list so coaches can assign workouts
  useEffect(() => {
    if (firebaseUser) {
      setMembers(prev => {
        const exists = prev.some(m => m.id === firebaseUser.uid || m.email === firebaseUser.email);
        if (exists) return prev;
        const fbName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Member";
        return [{
          id: firebaseUser.uid,
          name: fbName,
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbName)}&background=D95C42&color=fff`,
          email: firebaseUser.email || "",
          plan: null,
          joined: new Date().toISOString().split('T')[0],
          points: 0, streak: 0, checkInsThisMonth: 0,
          lastActive: "Just now", status: "online",
          metrics: { steps: 0, water: 0, activeMinutes: 0, caloriesBurned: 0 },
          goals: { stepGoal: 10000, waterGoal: 2500, activeMinutesGoal: 45 },
        }, ...prev];
      });
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

  // === QUICK LOG HANDLERS ===
  const handleQuickLogWater = () => {
    setMetrics(prev => ({ ...prev, water: Math.min(prev.waterGoal, prev.water + 250) }));
    setUser(prev => ({ ...prev, points: prev.points + 5 }));
    updateChallengeProgress("frequency", 1);
    showToast("+1 Glass of water logged! +5 pts", "success");
  };

  const handleQuickLogSteps = (amount = 500) => {
    const newSteps = Math.min(metrics.stepGoal * 2, metrics.steps + amount);
    const stepDiff = newSteps - metrics.steps;
    let pointAward = 0;
    if (stepDiff >= 1000) {
      pointAward += Math.floor(stepDiff / 1000) * 10;
    }
    setMetrics(prev => ({ ...prev, steps: newSteps }));
    if (pointAward > 0) {
      setUser(prev => ({ ...prev, points: prev.points + pointAward }));
    }
    updateChallengeProgress("steps", stepDiff);
    showToast(`+${stepDiff} steps logged!${pointAward > 0 ? ` +${pointAward} pts` : ""}`, "success");
  };

  const handleQuickLogActiveMinutes = (minutes = 15) => {
    setMetrics(prev => ({
      ...prev,
      activeMinutes: Math.min(prev.activeMinutesGoal * 2, prev.activeMinutes + minutes),
      caloriesBurned: prev.caloriesBurned + minutes * 8,
    }));
    setUser(prev => ({ ...prev, points: prev.points + 10 }));
    updateChallengeProgress("duration", minutes);
    showToast(`+${minutes} active minutes logged! +10 pts`, "success");
  };

  const updateChallengeProgress = (type, amount) => {
    setWeeklyChallenges(prev => prev.map(wc => {
      if (wc.status !== "active") return wc;
      if (wc.type === type) {
        const nextVal = Math.min(wc.targetValue, wc.currentValue + amount);
        if (nextVal >= wc.targetValue && wc.currentValue < wc.targetValue) {
          showToast(`Weekly challenge "${wc.title}" completed!`, "badge");
          return { ...wc, currentValue: nextVal, status: "completed" };
        }
        return { ...wc, currentValue: nextVal };
      }
      return wc;
    }));
    setChallenges(prev => prev.map(c => {
      if (c.status !== "active") return c;
      if (c.type === type) {
        const nextVal = Math.min(c.targetValue, c.currentValue + amount);
        if (nextVal >= c.targetValue && c.currentValue < c.targetValue) {
          setUser(p => ({ ...p, points: p.points + c.rewardPoints }));
          showToast(`Challenge "${c.title}" completed! +${c.rewardPoints} pts`, "badge");
          return { ...c, currentValue: nextVal, status: "completed" };
        }
        return { ...c, currentValue: nextVal };
      }
      return c;
    }));
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

      if (c.type === "duration") {
        const nextVal = Math.min(c.targetValue, c.currentValue + duration);
        if (nextVal >= c.targetValue && c.currentValue < c.targetValue) {
          setUser(p => ({ ...p, points: p.points + c.rewardPoints }));
          challengeCompleted = true;
          return { ...c, currentValue: nextVal, status: "completed" };
        }
        return { ...c, currentValue: nextVal };
      }
      
      if (c.type === "frequency") {
        const nextVal = Math.min(c.targetValue, c.currentValue + 1);
        if (nextVal >= c.targetValue && c.currentValue < c.targetValue) {
          setUser(p => ({ ...p, points: p.points + c.rewardPoints }));
          challengeCompleted = true;
          return { ...c, currentValue: nextVal, status: "completed" };
        }
        return { ...c, currentValue: nextVal };
      }

      if (c.type === "steps") {
        const stepsEstimate = type.toLowerCase().includes("run") || type.toLowerCase().includes("walk") ? duration * 120 : duration * 60;
        const nextVal = Math.min(c.targetValue, c.currentValue + stepsEstimate);
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
  const handleCreateOwnerChallenge = (title, description, type, targetValue, metricLabel, daysLeft, rewardPoints, difficulty = "medium", streakBonus = false, category = "fitness") => {
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
      difficulty,
      streakBonus,
      category,
      createdByOwner: true,
    };
    setChallenges(prev => [newChallenge, ...prev]);
    showToast(`Challenge "${title}" launched!`, "success");
  };

  // Delete a challenge (owner only)
  const handleDeleteChallenge = (challengeId) => {
    setChallenges(prev => prev.filter(c => c.id !== challengeId));
    showToast("Challenge has been deleted.", "info");
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
    const missedDay = !isConsecutive && user.lastCheckIn && user.lastCheckIn !== yesterday;

    let newCheckInStreak;
    let streakFreezesUsed = 0;

    if (missedDay && user.streakFreezes > 0) {
      streakFreezesUsed = 1;
      newCheckInStreak = user.checkInStreak + 1;
    } else {
      newCheckInStreak = isConsecutive ? user.checkInStreak + 1 : 1;
    }

    const pointsAwarded = 50 + (isConsecutive || streakFreezesUsed > 0 ? Math.min(newCheckInStreak * 10, 100) : 0);

    setUser(prev => ({
      ...prev,
      lastCheckIn: today,
      checkInStreak: newCheckInStreak,
      streakFreezes: Math.max(0, prev.streakFreezes - streakFreezesUsed),
      weeklyCheckIns: prev.lastCheckIn !== today ? prev.weeklyCheckIns + 1 : prev.weeklyCheckIns,
      streak: newCheckInStreak,
      points: prev.points + pointsAwarded,
      longestStreak: Math.max(prev.longestStreak, newCheckInStreak),
    }));

    const freezeMsg = streakFreezesUsed > 0 ? ` (Streak Freeze auto-applied!)` : "";
    showToast(`Daily check-in complete! +${pointsAwarded} pts (${newCheckInStreak}d streak)${freezeMsg}`);
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

  // === OWNER CHALLENGES ===
  const handleJoinOwnerChallenge = (challengeId) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId && c.createdByOwner) {
        const participants = c.participants || [];
        const alreadyJoined = participants.some(p => p.id === user.id);
        if (alreadyJoined) return c;
        return {
          ...c,
          participants: [...participants, { id: user.id, name: user.name, avatar: user.avatar, progress: 0 }],
          status: "active",
        };
      }
      return c;
    }));
    showToast("You joined the coach's challenge! Start working toward the goal.", "success");
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

  // === WORKOUT PLAN MANAGEMENT (Coach) ===
  const handleCreateWorkoutPlan = (plan) => {
    const newPlan = {
      ...plan,
      id: `wp_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: gym.ownerName || "Coach",
      status: "active",
    };
    setWorkoutPlans(prev => [newPlan, ...prev]);
    showToast(`Workout plan "${plan.title}" created!`, "success");
    return newPlan;
  };

  const handleAssignWorkoutToMember = (planId, memberId) => {
    const plan = workoutPlans.find(p => p.id === planId);
    if (!plan) return;
    const member = members.find(m => m.id === memberId);
    if (!member) {
      showToast("Member not found.", "error");
      return;
    }
    const existing = assignedWorkouts.find(a => a.planId === planId && a.clientId === memberId);
    if (existing) {
      showToast("This member already has this plan assigned.", "info");
      return;
    }
    const newAssignment = {
      id: `a_${Date.now()}`,
      planId,
      clientId: memberId,
      assignedBy: gym.ownerName || "Coach",
      assignedDate: new Date().toISOString().split('T')[0],
      currentDay: 0,
      completedDays: [],
      status: "active",
      startedAt: new Date().toISOString().split('T')[0],
      completedAt: null,
    };
    setAssignedWorkouts(prev => [...prev, newAssignment]);
    setWorkoutPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const assignedTo = p.assignedTo || [];
        return { ...p, assignedTo: assignedTo.includes(memberId) ? assignedTo : [...assignedTo, memberId] };
      }
      return p;
    }));
    showToast(`Plan assigned to ${member.name || memberId}!`, "success");
  };

  // Handle client request for a workout plan
  const handleRequestWorkoutPlan = (memberId, memberName) => {
    const existing = workoutPlanRequests.find(r => r.memberId === memberId);
    if (existing) {
      showToast("You already have a pending request with the coach.", "info");
      return;
    }
    setWorkoutPlanRequests(prev => [...prev, {
      id: `req_${Date.now()}`,
      memberId,
      memberName,
      requestedAt: new Date().toISOString().split('T')[0],
      status: "pending"
    }]);
    showToast("Request sent to your coach!", "success");
  };

  // Clear workout plan request (coach acknowledges it)
  const handleClearWorkoutRequest = (requestId) => {
    setWorkoutPlanRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // === WORKOUT DAY LOGGING (Client) ===
  const handleLogWorkoutDay = (assignmentId, dayIndex) => {
    setAssignedWorkouts(prev => prev.map(a => {
      if (a.id !== assignmentId) return a;
      if (a.completedDays.includes(dayIndex)) return a;
      const newCompleted = [...a.completedDays, dayIndex];
      const plan = workoutPlans.find(p => p.id === a.planId);
      const totalDays = plan?.days?.length || 1;
      const isComplete = newCompleted.length >= totalDays;
      const pointsGained = 100;
      setUser(p => ({ ...p, points: p.points + pointsGained }));
      showToast(`Day ${dayIndex + 1} completed! +${pointsGained} pts`, "success");
      return {
        ...a,
        completedDays: newCompleted,
        currentDay: isComplete ? totalDays : Math.max(...newCompleted) + 1,
        status: isComplete ? "completed" : "active",
        completedAt: isComplete ? new Date().toISOString().split('T')[0] : null,
      };
    }));
    // Progress the featured challenge
    setFeaturedChallenge(prev => {
      if (!prev || prev.status !== "active") return prev;
      const newVal = Math.min(prev.targetValue, prev.currentValue + 1);
      const updatedParticipants = prev.participants.map(p =>
        p.id === "me" || p.id === user.id ? { ...p, progress: newVal } : p
      );
      return { ...prev, currentValue: newVal, participants: updatedParticipants };
    });
  };

  // === PROGRESS TRACKING ===
  const handleUpdateProgress = (entry) => {
    setProgressData(prev => {
      if (entry.type === "weight") {
        return {
          ...prev,
          weight: [...prev.weight, { date: entry.date, value: entry.value }],
        };
      }
      if (entry.type === "measurement") {
        const existing = prev.measurements[entry.measurementType] || [];
        return {
          ...prev,
          measurements: {
            ...prev.measurements,
            [entry.measurementType]: [...existing, { date: entry.date, value: entry.value }],
          },
        };
      }
      if (entry.type === "photo") {
        return {
          ...prev,
          photos: [...prev.photos, { date: entry.date, url: entry.url, caption: entry.caption || "" }],
        };
      }
      return prev;
    });
    showToast("Progress updated!", "success");
  };

  // === REMINDER SETTINGS ===
  const handleUpdateReminders = (settings) => {
    setReminderSettings(prev => ({ ...prev, ...settings }));
    showToast("Reminder settings saved!", "success");
  };

  // === FEATURED CHALLENGE ===
  const handleJoinFeaturedChallenge = () => {
    setFeaturedChallenge(prev => {
      if (!prev || prev.status !== "active") return prev;
      const alreadyJoined = prev.participants.some(p => p.id === "me" || p.id === user.id);
      if (alreadyJoined) {
        showToast("You've already joined this challenge!", "info");
        return prev;
      }
      showToast("You joined the Summer Shred Challenge! Start logging workouts!", "success");
      return {
        ...prev,
        participants: [...prev.participants, { id: user.id, name: user.name, avatar: user.avatar, progress: 0 }],
      };
    });
  };

  const handleUpdateFeaturedChallenge = (updates) => {
    setFeaturedChallenge(prev => ({ ...prev, ...updates }));
    showToast("Featured challenge updated!", "success");
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-theme-accent-light flex items-center justify-center mx-auto animate-pulse">
            <svg className="animate-spin w-6 h-6 text-theme-accent" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-sm font-display font-bold text-theme-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <LoginPage onLoginSuccess={() => setAuthEntryDone(true)} />;
  }

  return (
    <div id="applet-viewport" className="min-h-screen bg-theme-bg text-theme-primary antialiased font-body bg-mesh overflow-x-hidden">
      <div className="bg-noise"></div>
      
      {/* Top Main Navigation / Brand Bar */}
      <header id="app-header" className="sticky top-0 z-40 bg-theme-surface border-b border-theme-border/60 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-theme-accent rounded-xl flex items-center justify-center text-white font-display font-extrabold shadow-sm shrink-0">
              <Dumbbell size={16} className="rotate-45 sm:size-[18]" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-display font-extrabold tracking-tight text-theme-primary truncate block">FitCircle</span>
              <p className="hidden sm:block text-[10px] text-theme-muted font-medium uppercase tracking-widest mt-0.5">{viewAs === "owner" ? "Gym Management" : "Gamified Fitness Social"}</p>
            </div>

          </div>

          {/* Quick Realtime Multi-Status Header widget */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            <div className="hidden lg:flex items-center gap-2.5 bg-theme-support-light border border-theme-border rounded-xl px-3 py-1.5 text-theme-support">
              <Trophy size={14} className="text-theme-accent" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest leading-none text-theme-muted">Your points</p>
                <p className="text-xs font-display font-extrabold mt-0.5">
                  {user.points.toLocaleString()} <span className="text-[10px] text-theme-secondary">pts</span>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2.5 bg-theme-warning-light border border-theme-border rounded-xl px-3 py-1.5 text-theme-warning">
              <Flame size={14} className="text-theme-warning" />
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-widest leading-none text-theme-muted">Active Streak</p>
                <p className="text-xs font-display font-extrabold mt-0.5">
                  {user.streak} <span className="text-[10px] text-theme-secondary">Days</span>
                </p>
              </div>
            </div>

            {/* Profile circular preview */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-theme-border shadow-xs shrink-0">
              <img referrerPolicy="no-referrer" src={user.avatar} alt="Me" className="w-full h-full object-cover" />
            </div>

            {firebaseUser && (
              <button
                onClick={logout}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center bg-theme-border/40 hover:bg-theme-border transition-all text-theme-muted hover:text-theme-primary cursor-pointer shrink-0"
                title="Sign Out"
              >
                <LogOut size={12} className="sm:size-[14]" />
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main id="app-main-view" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8">

        {viewAs === "owner" ? (
          <OwnerDashboard
            gym={gym}
            members={members}
            feedPosts={feedPosts}
            challenges={challenges}
            accountabilityGroups={accountabilityGroups}
            currentUser={user}
            workoutPlans={workoutPlans}
            featuredChallenge={featuredChallenge}
            coachMessages={coachMessages}
            onRemovePost={handleRemovePost}
            onCreateAnnouncement={handleCreateAnnouncement}
            onCreateShoutout={handleCreateShoutout}
            onCreateChallenge={handleCreateOwnerChallenge}
            onDeleteChallenge={handleDeleteChallenge}
            onNudgeGroup={handleNudgeGroupMember}
            onNavigate={setActiveTab}
            onAddComment={handleAddComment}
            onCreateWorkoutPlan={handleCreateWorkoutPlan}
            onAssignWorkout={handleAssignWorkoutToMember}
            onUpdateFeaturedChallenge={handleUpdateFeaturedChallenge}
            workoutPlanRequests={workoutPlanRequests}
            onClearWorkoutRequest={handleClearWorkoutRequest}
            onSendCoachReply={handleSendCoachReply}
          />
        ) : (<>
          {/* Mobile bottom nav bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-theme-surface/95 backdrop-blur-lg border-t border-theme-border safe-bottom">
            <div className="flex items-center justify-around max-w-lg mx-auto">
              {[
                { tab: "welcome", label: "Home", icon: Compass },
                { tab: "dashboard", label: "Dash", icon: Heart },
                { tab: "race", label: "Race", icon: Target },
                { tab: "social", label: "Feed", icon: Users },
                { tab: "leaderboard", label: "Top", icon: Trophy },
                { tab: "badges", label: "More", icon: Award },
                { tab: "store", label: "Store", icon: ShoppingBag },
                { tab: "subscription", label: "Plan", icon: Shield },
              ].map(({ tab, label, icon: Icon }) => {
                const isActive = activeTab === tab || (tab === "badges" && (activeTab === "groups" || activeTab === "weeklyChallenges" || activeTab === "badges"));
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex flex-col items-center gap-0.5 py-2 px-1 transition-all flex-1 min-w-0 ${
                      isActive ? "text-theme-accent" : "text-theme-muted hover:text-theme-secondary"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-theme-accent" : ""} />
                    <span className={`text-[9px] font-display font-bold leading-tight ${isActive ? "text-theme-accent" : ""}`}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 pb-20 lg:pb-0">

          {/* LEFT COLUMN: Sidebar Navigation Panel (hidden on mobile, shown on lg+) */}
          <section id="sidebar-col" className="hidden lg:block lg:col-span-3">
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
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-[8px] font-display font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        userPlan === "Premium"
                          ? "bg-theme-warning/20 text-theme-warning"
                          : userPlan === "Standard"
                          ? "bg-theme-support/20 text-blue-300"
                          : userPlan === "Basic"
                          ? "bg-white/10 text-white/60"
                          : "bg-white/10 text-white/40"
                      }`}>
                        {userPlan || "Free"}
                      </span>
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
                  { tab: "workout", label: "Workout Plan", icon: Dumbbell },
                  { tab: "progress", label: "Progress Tracker", icon: Activity },
                  { tab: "groups", label: "Accountability Groups", icon: Shield },
                  { tab: "weeklyChallenges", label: "Weekly Challenges", icon: Calendar },
                  { tab: "store", label: "Rewards Store", icon: ShoppingBag },
                  { tab: "subscription", label: "Subscription", icon: Shield },
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
                className="min-h-[300px] sm:min-h-[500px]"
              >
                {activeTab === "welcome" && (
                  <WelcomePage
                    user={user}
                    badges={badges}
                    accountabilityGroups={accountabilityGroups}
                    onCheckIn={handleCheckIn}
                    onBuyFreeze={handleBuyStreakFreeze}
                    onUseFreeze={handleUseStreakFreeze}
                    onRescueStreak={handleNudgeGroupMember}
                    onNavigate={setActiveTab}
                  />
                )}

                {activeTab === "dashboard" && (
                  <Dashboard 
                    metrics={metrics}
                    user={user}
                    challenges={challenges}
                    weeklyChallenges={weeklyChallenges}
                    ownerChallenges={challenges.filter(c => c.createdByOwner)}
                    badges={badges}
                    feedPosts={feedPosts}
                    accountabilityGroups={accountabilityGroups}
                    workoutPlans={workoutPlans}
                    assignedWorkouts={assignedWorkouts}
                    featuredChallenge={featuredChallenge}
                    reminderSettings={reminderSettings}
                    progressData={progressData}
                    onUpdateMetrics={handleUpdateMetrics}
                    onLogWorkout={handleLogWorkout}
                    onJoinOwnerChallenge={handleJoinOwnerChallenge}
                    onNavigate={setActiveTab}
                    onLogWorkoutDay={handleLogWorkoutDay}
                    onJoinFeaturedChallenge={handleJoinFeaturedChallenge}
                    onUpdateReminders={handleUpdateReminders}
                    onUpdateProgress={handleUpdateProgress}
                    onQuickLogWater={handleQuickLogWater}
                    onQuickLogSteps={handleQuickLogSteps}
                    onQuickLogActiveMinutes={handleQuickLogActiveMinutes}
                  />
                )}

                {activeTab === "race" && (
                  <DiscountRace 
                    user={user}
                    onIncrementRoutine={handleIncrementRoutine}
                  />
                )}

                {activeTab === "social" && (
                  <div className="space-y-6">
                    <SocialHub 
                      feed={feedPosts}
                      currentUser={user}
                      onToggleLike={(postId) => handleLikePost(postId)}
                      onAddComment={handleAddComment}
                      onReshare={(postId) => showToast("Post reshared to your network!", "success")}
                      onCreatePost={handleCreatePost}
                    />
                    <CoachChat
                      gym={gym}
                      currentUser={user}
                      messages={coachMessages}
                      onSendMessage={handleSendCoachMessage}
                    />
                  </div>
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

                {activeTab === "subscription" && (
                  <SubscriptionPlans
                    userPlan={userPlan}
                    onSubscribe={handleSubscribe}
                    onNavigate={setActiveTab}
                  />
                )}

                {activeTab === "store" && (
                  <RewardsStore
                    user={user}
                    ownedItems={ownedItems}
                    onRedeem={handleRedeemItem}
                  />
                )}

                {activeTab === "workout" && (
                  <WorkoutPlanView
                    workoutPlans={workoutPlans}
                    assignedWorkouts={assignedWorkouts}
                    currentUser={user}
                    userPlan={userPlan}
                    onLogDay={handleLogWorkoutDay}
                    onNavigate={setActiveTab}
                    onRequestPlan={handleRequestWorkoutPlan}
                  />
                )}

                {activeTab === "progress" && (
                  <ProgressTracker
                    progressData={progressData}
                    onUpdateProgress={handleUpdateProgress}
                  />
                )}

                {activeTab === "weeklyChallenges" && (
                  <WeeklyChallengeSystem
                    challenges={weeklyChallenges}
                    ownerChallenges={challenges.filter(c => c.createdByOwner)}
                    currentUser={user}
                    userPlan={userPlan}
                    onJoinChallenge={(wcId) => showToast("Joined the challenge!", "success")}
                    onJoinOwnerChallenge={handleJoinOwnerChallenge}
                    onClaimReward={handleClaimWeeklyReward}
                    onNavigate={setActiveTab}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </section>

        </div>
        </>)}
      </main>

      {/* Floating global warning-free Toast notification box */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            id="toast-notification-banner"
            className={`fixed bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-80 p-4 rounded-2xl shadow-xl border z-[60] flex items-start gap-3 ${
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

      {/* Client Centered Footer */}
      <footer id="app-footer" className="border-t border-theme-border py-6 text-center text-xs text-theme-muted mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 FitCircle {viewAs === "owner" ? "Gym Management" : "Applet"} • {viewAs === "owner" ? "Empowering your gym community." : "Put yourself at the center of your fitness journey."}</p>
          <div className="flex gap-4">
            <span className="hover:text-theme-secondary cursor-pointer">Terms</span>
            <span className="hover:text-theme-secondary cursor-pointer">Privacy</span>
            <span className="hover:text-theme-secondary cursor-pointer">About</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

