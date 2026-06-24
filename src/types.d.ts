export type WorkoutType = "Run" | "Cycle" | "Strength" | "Yoga" | "Walk" | "HIIT" | "Swim";

export interface Workout {
  id: string;
  type: WorkoutType;
  duration: number; // minutes
  calories: number;
  notes?: string;
  timestamp: string; // ISO string
}

export interface DailyMetrics {
  steps: number;
  stepGoal: number;
  water: number; // mL or L
  waterGoal: number; // mL or L
  sleep: number; // hours
  sleepGoal: number; // hours
  activeMinutes: number;
  activeMinutesGoal: number;
  caloriesBurned: number;
  caloriesBurnedGoal: number;
  weight?: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  points: number;
  streak: number;
  routinesCompletedThisMonth: number;
  routineTargetMonth: number; // e.g. 24 workouts/rutines to complete for max discount
  unlockedBadges: string[]; // Badge IDs
  streakFreezes: number;
  longestStreak: number;
  lastCheckIn: string | null;
  checkInStreak: number;
  weeklyCheckIns: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  points: {
    today: number;
    week: number;
    month: number;
  };
  streak: number;
  status: "online" | "offline";
  lastActive: string;
  leaderboardBadge?: "Top Contributor" | "Consistency King";
}

export interface AccountabilityGroup {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  groupChallenge: {
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline: string;
  };
  weeklyRanking: { id: string; name: string; avatar: string; points: number }[];
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  weeklyMinutes: number;
  lastActive: string;
  status: "online" | "offline";
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  type: "steps" | "duration" | "frequency";
  targetValue: number;
  currentValue: number;
  metricLabel: string;
  rewardPoints: number;
  weekStart: string;
  weekEnd: string;
  status: "active" | "completed" | "claimed";
  streakBonus: number;
}

export interface DailyCheckInData {
  lastCheckIn: string | null;
  streak: number;
  weeklyCount: number;
}

export interface StreakProtectionData {
  streakFreezes: number;
  longestStreak: number;
  recoveryChallenge: {
    active: boolean;
    type: "steps" | "duration";
    target: number;
    current: number;
    reward: number;
  } | null;
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  workout?: {
    type: WorkoutType;
    duration: number;
    metric: string; // e.g., "5.2 km", "320 kcal"
  };
  likes: number;
  likedByCount: number;
  hasLiked: boolean;
  timestamp: string;
  comments: {
    id: string;
    authorName: string;
    content: string;
    timestamp: string;
  }[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  category: "Activity" | "Consistency" | "Social" | "Hydration";
  requirementText: string;
  unlocked: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "steps" | "duration" | "frequency";
  targetValue: number;
  currentValue: number;
  metricLabel: string;
  daysLeft: number;
  invitedBy?: string; // Friend name or "You"
  status: "pending" | "active" | "completed" | "declined";
  rewardPoints: number;
}
