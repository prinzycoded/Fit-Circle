import React, { useState } from "react";
import {
  Dumbbell,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Trophy,
  Flame,
  Target,
  ChevronRight,
  ListChecks,
  Zap,
  Bell,
  BellOff,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";

export default function WorkoutPlanView({ workoutPlans = [], assignedWorkouts = [], currentUser, userPlan, onLogDay, onNavigate, onRequestPlan }) {
  const [requestSent, setRequestSent] = useState(false);

  const myAssignments = assignedWorkouts.filter(a => a.clientId === "me" || a.clientId === currentUser?.id);
  const assignedPlanIds = myAssignments.map(a => a.planId);
  const myPlans = workoutPlans.filter(p => assignedPlanIds.includes(p.id));

  const getAssignment = (planId) => myAssignments.find(a => a.planId === planId);

  if (myPlans.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-support-light text-theme-support rounded-xl">
            <Dumbbell size={20} />
          </div>
          <div>
            <h1 className="text-xl font-display font-extrabold text-theme-primary">My Workout Plan</h1>
            <p className="text-xs text-theme-secondary">Track your assigned workouts and progress</p>
          </div>
        </div>
        <div className="card text-center py-16">
          <div className="w-20 h-20 rounded-3xl bg-theme-border/30 flex items-center justify-center mx-auto mb-5">
            <Dumbbell size={40} className="text-theme-muted" />
          </div>
          <h2 className="text-lg font-display font-extrabold text-theme-primary mb-2">No Workout Plan Assigned</h2>
          <p className="text-sm text-theme-secondary max-w-md mx-auto mb-6">
            Your coach hasn't assigned you a workout plan yet. Once they do, you'll see your daily workouts here to track your progress.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate?.("dashboard")}
              className="bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-display font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Target size={15} />
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                if (!requestSent && onRequestPlan) {
                  onRequestPlan(currentUser?.id || "me", currentUser?.name || "You");
                  setRequestSent(true);
                }
              }}
              disabled={requestSent}
              className={`text-xs font-display font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                requestSent
                  ? "bg-theme-success-light text-theme-success cursor-default"
                  : "bg-theme-warning-light text-theme-warning hover:bg-theme-warning/20"
              }`}
            >
              {requestSent ? <BellOff size={15} /> : <Bell size={15} />}
              {requestSent ? "Request Sent" : "Notify Coach"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-support-light text-theme-support rounded-xl">
            <Dumbbell size={20} />
          </div>
          <div>
            <h1 className="text-xl font-display font-extrabold text-theme-primary">My Workout Plan</h1>
            <p className="text-xs text-theme-secondary">{myPlans.length} active plan{myPlans.length > 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {myPlans.map((plan) => {
          const assignment = getAssignment(plan.id);
          if (!assignment) return null;
          const totalDays = plan.days?.length || 0;
          const completedCount = assignment.completedDays?.length || 0;
          const progressPct = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
          const isComplete = assignment.status === "completed";

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isComplete ? "bg-theme-success-light text-theme-success" : "bg-theme-support-light text-theme-support"}`}>
                    {isComplete ? <Trophy size={20} /> : <ListChecks size={20} />}
                  </div>
                  <div>
                    <h2 className="text-base font-display font-extrabold text-theme-primary">{plan.title}</h2>
                    <p className="text-[10px] text-theme-muted">
                      Assigned by {plan.createdBy || "Coach"} &middot; {plan.createdAt}
                    </p>
                  </div>
                </div>
                <div className={`text-right ${isComplete ? "text-theme-success" : "text-theme-accent"}`}>
                  <p className="text-2xl font-display font-extrabold">{completedCount}/{totalDays}</p>
                  <p className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">Days Done</p>
                </div>
              </div>

              {plan.description && (
                <p className="text-xs text-theme-secondary mb-4">{plan.description}</p>
              )}

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span className="font-bold text-theme-primary">Progress</span>
                  <span className="text-theme-muted">{progressPct}%</span>
                </div>
                <div className="progress-bar h-2">
                  <div
                    className={`progress-bar-fill ${isComplete ? "bg-theme-success" : "bg-theme-accent"}`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-theme-border/10 rounded-xl p-2.5 text-center">
                  <p className="text-lg font-display font-extrabold text-theme-primary">{totalDays}</p>
                  <p className="text-[9px] text-theme-muted font-bold uppercase tracking-wider">Total Days</p>
                </div>
                <div className="bg-theme-border/10 rounded-xl p-2.5 text-center">
                  <p className="text-lg font-display font-extrabold text-theme-accent">{completedCount}</p>
                  <p className="text-[9px] text-theme-muted font-bold uppercase tracking-wider">Completed</p>
                </div>
                <div className="bg-theme-border/10 rounded-xl p-2.5 text-center">
                  <p className="text-lg font-display font-extrabold text-theme-warning">{totalDays - completedCount}</p>
                  <p className="text-[9px] text-theme-muted font-bold uppercase tracking-wider">Remaining</p>
                </div>
              </div>

              {/* Day List */}
              <div className="space-y-1.5">
                {plan.days?.map((day, index) => {
                  const isCompleted = assignment.completedDays?.includes(index);
                  const isCurrent = assignment.currentDay === index;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-xl border p-3 transition-all ${
                        isCompleted
                          ? "border-theme-success/30 bg-theme-success-light/20"
                          : isCurrent
                          ? "border-theme-accent/30 bg-theme-accent-light/10"
                          : "border-theme-border bg-theme-surface/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {isCompleted ? (
                            <CheckCircle2 size={18} className="text-theme-success shrink-0" />
                          ) : isCurrent ? (
                            <Circle size={18} className="text-theme-accent shrink-0 fill-theme-accent/20" />
                          ) : (
                            <Circle size={18} className="text-theme-muted shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-display font-bold ${isCompleted ? "text-theme-success" : "text-theme-primary"}`}>
                                Day {day.day}
                              </span>
                              {isCompleted && (
                                <span className="text-[8px] font-bold text-theme-success bg-theme-success-light px-1.5 py-0.5 rounded-full">Done</span>
                              )}
                              {isCurrent && !isCompleted && (
                                <span className="text-[8px] font-bold text-theme-accent bg-theme-accent-light px-1.5 py-0.5 rounded-full">Current</span>
                              )}
                            </div>
                            <p className="text-[10px] text-theme-secondary truncate mt-0.5">
                              {day.exercises?.length || 0} exercises
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCurrent && !isCompleted && (
                            <button
                              onClick={() => onLogDay(assignment.id, index)}
                              className="bg-theme-accent hover:bg-theme-accent-hover text-white text-[9px] font-display font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 size={11} />
                              Complete
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Exercise Preview */}
                      {day.exercises?.length > 0 && (
                        <div className="mt-2 ml-7 flex flex-wrap gap-1">
                          {day.exercises.map((ex, i) => (
                            <span
                              key={i}
                              className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full ${
                                isCompleted
                                  ? "bg-theme-success/10 text-theme-success"
                                  : "bg-theme-border/30 text-theme-secondary"
                              }`}
                            >
                              {ex.name || `Exercise ${i + 1}`}
                              {ex.sets > 0 && ` ${ex.sets}x${ex.reps}`}
                              {ex.duration > 0 && ` ${ex.duration}min`}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Complete Banner */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 rounded-xl bg-theme-success-light/30 border border-theme-success/30 text-center"
                >
                  <Trophy size={24} className="text-theme-success mx-auto mb-2" />
                  <p className="text-sm font-display font-extrabold text-theme-success">Plan Complete!</p>
                  <p className="text-xs text-theme-secondary mt-1">You finished all {totalDays} days. Great work!</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
