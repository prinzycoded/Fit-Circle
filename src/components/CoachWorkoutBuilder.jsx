import React, { useState } from "react";
import {
  Dumbbell,
  Plus,
  Trash2,
  Save,
  Users,
  ChevronRight,
  Calendar,
  Clock,
  Target,
  ListChecks,
  UserPlus,
  CheckCircle2,
  X,
  GripVertical,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const EXERCISE_TEMPLATES = [
  { name: "Bench Press", sets: 4, reps: 10 },
  { name: "Squat", sets: 4, reps: 8 },
  { name: "Deadlift", sets: 3, reps: 6 },
  { name: "Overhead Press", sets: 3, reps: 10 },
  { name: "Barbell Row", sets: 4, reps: 8 },
  { name: "Pull Up", sets: 3, reps: 12 },
  { name: "Bicep Curl", sets: 3, reps: 12 },
  { name: "Tricep Pushdown", sets: 3, reps: 12 },
  { name: "Leg Press", sets: 4, reps: 10 },
  { name: "Lunges", sets: 3, reps: 12 },
  { name: "Plank", sets: 3, reps: 0, duration: 60 },
  { name: "Running", sets: 1, reps: 0, duration: 30 },
  { name: "Cycling", sets: 1, reps: 0, duration: 45 },
  { name: "HIIT Circuit", sets: 1, reps: 0, duration: 20 },
  { name: "Yoga Flow", sets: 1, reps: 0, duration: 30 },
];

export default function CoachWorkoutBuilder({ members = [], workoutPlans = [], onCreateWorkoutPlan, onAssignWorkout, onNavigate }) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAssign, setShowAssign] = useState(null);
  const [planForm, setPlanForm] = useState({
    title: "",
    description: "",
    days: [{ day: 1, exercises: [{ name: "", sets: 3, reps: 10, duration: 0 }] }],
  });
  const [selectedMember, setSelectedMember] = useState("");

  const addDay = () => {
    setPlanForm(prev => ({
      ...prev,
      days: [...prev.days, { day: prev.days.length + 1, exercises: [{ name: "", sets: 3, reps: 10, duration: 0 }] }],
    }));
  };

  const removeDay = (dayIndex) => {
    setPlanForm(prev => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== dayIndex).map((d, i) => ({ ...d, day: i + 1 })),
    }));
  };

  const addExercise = (dayIndex) => {
    setPlanForm(prev => {
      const days = [...prev.days];
      days[dayIndex] = {
        ...days[dayIndex],
        exercises: [...days[dayIndex].exercises, { name: "", sets: 3, reps: 10, duration: 0 }],
      };
      return { ...prev, days };
    });
  };

  const removeExercise = (dayIndex, exIndex) => {
    setPlanForm(prev => {
      const days = [...prev.days];
      days[dayIndex] = {
        ...days[dayIndex],
        exercises: days[dayIndex].exercises.filter((_, i) => i !== exIndex),
      };
      return { ...prev, days };
    });
  };

  const updateExercise = (dayIndex, exIndex, field, value) => {
    setPlanForm(prev => {
      const days = [...prev.days];
      days[dayIndex] = {
        ...days[dayIndex],
        exercises: days[dayIndex].exercises.map((ex, i) =>
          i === exIndex ? { ...ex, [field]: value } : ex
        ),
      };
      return { ...prev, days };
    });
  };

  const selectTemplate = (dayIndex, template) => {
    setPlanForm(prev => {
      const days = [...prev.days];
      days[dayIndex] = {
        ...days[dayIndex],
        exercises: [...days[dayIndex].exercises, { ...template, duration: template.duration || 0 }],
      };
      return { ...prev, days };
    });
  };

  const handleCreate = () => {
    if (!planForm.title.trim()) return;
    onCreateWorkoutPlan(planForm);
    setPlanForm({
      title: "",
      description: "",
      days: [{ day: 1, exercises: [{ name: "", sets: 3, reps: 10, duration: 0 }] }],
    });
    setShowBuilder(false);
  };

  const handleAssign = (planId) => {
    if (!selectedMember) return;
    onAssignWorkout(planId, selectedMember);
    setSelectedMember("");
    setShowAssign(null);
  };

  const totalExercises = (plan) =>
    plan.days?.reduce((sum, d) => sum + (d.exercises?.length || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-theme-support-light text-theme-support rounded-xl">
          <Dumbbell size={20} />
        </div>
        <div>
          <h1 className="text-xl font-display font-extrabold text-theme-primary">Workout Builder</h1>
          <p className="text-xs text-theme-secondary">Create and assign workout plans to members</p>
        </div>
      </div>

      {/* Existing Plans */}
      {workoutPlans.length === 0 && !showBuilder ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-theme-border/30 flex items-center justify-center mx-auto mb-4">
            <Dumbbell size={32} className="text-theme-muted" />
          </div>
          <p className="text-sm font-display font-bold text-theme-primary">No workout plans yet</p>
          <p className="text-xs text-theme-secondary mt-1">Create your first plan to start assigning workouts.</p>
          <button
            onClick={() => setShowBuilder(true)}
            className="mt-4 bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-display font-bold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            Create Workout Plan
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-theme-secondary">{workoutPlans.length} plan{workoutPlans.length !== 1 && "s"} total</p>
            <button
              onClick={() => setShowBuilder(true)}
              className="bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-display font-bold px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              Create New Plan
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workoutPlans.map((plan) => {
            const assignedCount = plan.assignedTo?.length || 0;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card hover:bg-theme-border/10 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-theme-support-light text-theme-support rounded-lg">
                      <ListChecks size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-extrabold text-theme-primary">{plan.title}</h3>
                      <p className="text-[10px] text-theme-muted">Created {plan.createdAt}</p>
                    </div>
                  </div>
                </div>

                {plan.description && (
                  <p className="text-[11px] text-theme-secondary mb-3">{plan.description}</p>
                )}

                <div className="flex items-center gap-3 text-[10px] text-theme-muted mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {plan.days?.length || 0} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Dumbbell size={11} />
                    {totalExercises(plan)} exercises
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {assignedCount} assigned
                  </span>
                </div>

                {/* Day preview */}
                {plan.days && (
                  <div className="space-y-1 mb-3">
                    {plan.days.slice(0, 3).map((day, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] text-theme-secondary bg-theme-border/10 rounded-lg px-2.5 py-1.5">
                        <span className="font-bold text-theme-primary w-10">Day {day.day}</span>
                        <span className="truncate">{day.exercises?.map(e => e.name || "Exercise").join(", ") || "No exercises"}</span>
                      </div>
                    ))}
                    {plan.days.length > 3 && (
                      <p className="text-[9px] text-theme-muted text-center">+{plan.days.length - 3} more days</p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-theme-border">
                  <button
                    onClick={() => setShowAssign(plan.id)}
                    className="flex-1 py-2 rounded-xl bg-theme-accent-light text-theme-accent text-[10px] font-display font-bold hover:bg-theme-accent/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserPlus size={13} />
                    Assign
                  </button>
                  <button
                    onClick={() => setShowBuilder(true)}
                    className="flex-1 py-2 rounded-xl border border-theme-border text-[10px] font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye size={13} />
                    View
                  </button>
                </div>

                {/* Assign Modal Inline */}
                <AnimatePresence>
                  {showAssign === plan.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-theme-border space-y-2.5">
                        <p className="text-[10px] font-display font-bold text-theme-primary">Assign to member</p>
                        <select
                          value={selectedMember}
                          onChange={(e) => setSelectedMember(e.target.value)}
                          className="w-full bg-theme-bg border border-theme-border rounded-xl px-3 py-2 text-xs font-body text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent cursor-pointer"
                        >
                          <option value="">Select a member</option>
                          {members.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}{m.plan ? ` (${m.plan})` : " (No Plan)"}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setShowAssign(null); setSelectedMember(""); }}
                            className="flex-1 py-2 rounded-xl border border-theme-border text-[10px] font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAssign(plan.id)}
                            disabled={!selectedMember}
                            className="flex-1 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-[10px] font-display font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 size={13} />
                            Assign
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        </div>
      )}

      {/* Builder Modal */}
      <AnimatePresence>
        {showBuilder && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBuilder(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between sticky top-0 bg-theme-surface z-10 pb-3 border-b border-theme-border">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-theme-support-light text-theme-support rounded-xl">
                    <Dumbbell size={18} />
                  </div>
                  <h3 className="text-base font-display font-extrabold text-theme-primary">Create Workout Plan</h3>
                </div>
                <button onClick={() => setShowBuilder(false)} className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Plan Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 4-Week Strength Builder"
                    value={planForm.title}
                    onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2.5 text-sm font-body text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Description</label>
                  <textarea
                    placeholder="Describe the plan goals..."
                    value={planForm.description}
                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                    rows={2}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary placeholder-theme-muted resize-none focus:outline-none focus:ring-2 focus:ring-theme-accent"
                  />
                </div>
              </div>

              {/* Days */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-display font-bold text-theme-primary">Days & Exercises</span>
                  <button
                    onClick={addDay}
                    className="text-[10px] font-display font-bold text-theme-accent hover:text-theme-accent-hover flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    Add Day
                  </button>
                </div>

                {planForm.days.map((day, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-theme-border rounded-xl p-3 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-theme-muted" />
                        <span className="text-xs font-display font-bold text-theme-primary">Day {day.day}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const template = EXERCISE_TEMPLATES.find(t => t.name === e.target.value);
                              if (template) selectTemplate(dayIndex, template);
                              e.target.value = "";
                            }
                          }}
                          className="text-[9px] bg-theme-border/20 border border-theme-border rounded-lg px-2 py-1 text-theme-muted focus:outline-none cursor-pointer"
                        >
                          <option value="">+ Template</option>
                          {EXERCISE_TEMPLATES.map((t, i) => (
                            <option key={i} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                        {planForm.days.length > 1 && (
                          <button onClick={() => removeDay(dayIndex)} className="p-1 rounded-lg hover:bg-red-50 text-theme-muted hover:text-red-500 transition-colors cursor-pointer">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {day.exercises.map((ex, exIndex) => (
                      <div key={exIndex} className="flex items-center gap-2 bg-theme-bg rounded-lg p-2">
                        <span className="text-[9px] font-bold text-theme-muted w-4">{exIndex + 1}</span>
                        <input
                          type="text"
                          placeholder="Exercise name"
                          value={ex.name}
                          onChange={(e) => updateExercise(dayIndex, exIndex, "name", e.target.value)}
                          className="flex-1 bg-transparent border-none text-xs font-body text-theme-primary placeholder-theme-muted focus:outline-none min-w-0"
                        />
                        <input
                          type="number"
                          placeholder="Sets"
                          value={ex.sets || ""}
                          onChange={(e) => updateExercise(dayIndex, exIndex, "sets", parseInt(e.target.value) || 0)}
                          className="w-12 bg-theme-border/20 border border-theme-border rounded-lg px-1.5 py-1 text-[9px] text-center text-theme-primary focus:outline-none"
                          title="Sets"
                        />
                        <span className="text-[9px] text-theme-muted">x</span>
                        <input
                          type="number"
                          placeholder="Reps"
                          value={ex.reps || ""}
                          onChange={(e) => updateExercise(dayIndex, exIndex, "reps", parseInt(e.target.value) || 0)}
                          className="w-12 bg-theme-border/20 border border-theme-border rounded-lg px-1.5 py-1 text-[9px] text-center text-theme-primary focus:outline-none"
                          title="Reps"
                        />
                        <input
                          type="number"
                          placeholder="Min"
                          value={ex.duration || ""}
                          onChange={(e) => updateExercise(dayIndex, exIndex, "duration", parseInt(e.target.value) || 0)}
                          className="w-12 bg-theme-border/20 border border-theme-border rounded-lg px-1.5 py-1 text-[9px] text-center text-theme-primary focus:outline-none"
                          title="Duration (min)"
                        />
                        <span className="text-[8px] text-theme-muted">min</span>
                        <button onClick={() => removeExercise(dayIndex, exIndex)} className="p-1 rounded-lg hover:bg-red-50 text-theme-muted hover:text-red-500 transition-colors cursor-pointer shrink-0">
                          <X size={11} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => addExercise(dayIndex)}
                      className="text-[9px] font-bold text-theme-accent hover:text-theme-accent-hover flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={11} />
                      Add Exercise
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-theme-border sticky bottom-0 bg-theme-surface pb-1">
                <button
                  onClick={() => setShowBuilder(false)}
                  className="flex-1 py-2.5 rounded-xl border border-theme-border text-xs font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!planForm.title.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save size={15} />
                  Save Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
