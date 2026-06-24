import React, { useState } from "react";
import { 
  Footprints, 
  Droplet, 
  Moon, 
  Dumbbell, 
  Flame, 
  Plus, 
  Minus, 
  Edit3, 
  Save, 
  X, 
  Sparkles, 
  Target,
  Trophy
} from "lucide-react";
import { motion } from "motion/react";

export default function Dashboard({ metrics, user, onUpdateMetrics, onLogWorkout }) {
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [editableGoals, setEditableGoals] = useState({
    stepGoal: metrics.stepGoal,
    waterGoal: metrics.waterGoal,
    sleepGoal: metrics.sleepGoal,
    activeMinutesGoal: metrics.activeMinutesGoal,
    caloriesBurnedGoal: metrics.caloriesBurnedGoal,
  });

  const [logStepsAmount, setLogStepsAmount] = useState(1000);
  const [logWaterAmount, setLogWaterAmount] = useState(250);
  const [customWorkout, setCustomWorkout] = useState({
    type: "Run",
    duration: 30,
    calories: 250,
  });

  const handleSaveGoals = () => {
    onUpdateMetrics({ ...metrics, ...editableGoals });
    setIsEditingGoals(false);
  };

  const handleAddSteps = (amount) => {
    onUpdateMetrics({ ...metrics, steps: Math.max(0, metrics.steps + amount) });
  };

  const handleAddWater = (amount) => {
    onUpdateMetrics({ ...metrics, water: Math.max(0, metrics.water + amount) });
  };

  const handleAddSleep = (amount) => {
    onUpdateMetrics({ ...metrics, sleep: Math.max(0, Math.round((metrics.sleep + amount) * 10) / 10) });
  };

  const submitQuickWorkout = (e) => {
    e.preventDefault();
    onLogWorkout(customWorkout.type, customWorkout.duration, customWorkout.calories);
    onUpdateMetrics({
      ...metrics,
      activeMinutes: metrics.activeMinutes + customWorkout.duration,
      caloriesBurned: metrics.caloriesBurned + customWorkout.calories,
    });
  };

  const stepsPercent = Math.min(100, Math.round((metrics.steps / metrics.stepGoal) * 100));
  const waterPercent = Math.min(100, Math.round((metrics.water / metrics.waterGoal) * 100));
  const sleepPercent = Math.min(100, Math.round((metrics.sleep / metrics.sleepGoal) * 100));
  const activePercent = Math.min(100, Math.round((metrics.activeMinutes / metrics.activeMinutesGoal) * 100));
  const caloriesPercent = Math.min(100, Math.round((metrics.caloriesBurned / metrics.caloriesBurnedGoal) * 100));

  const MetricCard = ({ label, value, unit, goal, percent, color, icon: Icon, children }) => (
    <div className="card flex flex-col justify-between relative overflow-hidden card-hover">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`}></div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-display font-bold uppercase tracking-widest text-theme-muted">{label}</span>
        <div className={`w-8 h-8 rounded-full ${color.replace('bg', 'bg').replace('-500', '/10')} flex items-center justify-center ${color.replace('bg', 'text')}`}>
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-display font-extrabold text-theme-primary tracking-tight">
          {value} <span className="text-sm font-medium text-theme-secondary">{unit}</span>
        </p>
        <p className="text-xs font-medium text-theme-muted mt-0.5">Goal: {goal}</p>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center text-xs font-display font-bold mb-1.5">
          <span className="text-theme-secondary">Progress</span>
          <span className={color.replace('bg', 'text')}>{percent}%</span>
        </div>
        <div className="progress-bar h-2">
          <div className={`progress-bar-fill ${color}`} style={{ width: `${percent}%` }}></div>
        </div>
      </div>
      {children && <div className="mt-4 pt-4 border-t border-theme-border">{children}</div>}
    </div>
  );

  return (
    <div id="dashboard-section" className="space-y-6">
      
      {/* Welcome banner */}
      <div id="welcome-card" className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3D6B8C 0%, #1D202B 100%)' }}>
        <div className="absolute right-0 bottom-0 top-0 opacity-5 flex items-center justify-center p-4">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-display font-bold uppercase tracking-widest backdrop-blur-sm">
                Member Profile
              </span>
              <div className="flex items-center gap-1 bg-theme-accent text-white text-xs px-3 py-1 rounded-full font-display font-bold">
                <Trophy size={11} />
                <span>{user.points.toLocaleString()} pts</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mt-1">
              Welcome back, {user.name.split(" ")[0]}.
            </h1>
            <p className="text-white/70 text-sm mt-1 max-w-sm font-body">
              Your consistency is driving results. You are on track for your seasonal discount reward.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 self-start md:self-auto border border-white/10">
            <div className="w-12 h-12 bg-theme-accent rounded-full flex items-center justify-center text-xl shadow-inner">
              <Flame size={22} />
            </div>
            <div>
              <p className="text-xs text-white/60 font-medium font-body">Active Streak</p>
              <p className="text-xl font-display font-extrabold text-theme-accent-light">
                {user.streak}d strong
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goal management bar */}
      <div className="card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-accent-light text-theme-accent rounded-xl">
            <Target size={20} />
          </div>
          <div>
            <h3 className="font-display font-bold text-theme-primary text-sm">Personal Goal Dashboard</h3>
            <p className="text-xs text-theme-secondary">Tune your fitness targets instantly</p>
          </div>
        </div>

        {isEditingGoals ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="cancel-goals-btn"
              onClick={() => setIsEditingGoals(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-display font-bold text-theme-secondary border border-theme-border rounded-xl hover:bg-theme-border/30 transition-all cursor-pointer"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              id="save-goals-btn"
              onClick={handleSaveGoals}
              className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover rounded-xl cursor-pointer"
            >
              <Save size={14} />
              Save Changes
            </button>
          </div>
        ) : (
          <button
            id="edit-goals-btn"
            onClick={() => {
              setEditableGoals({
                stepGoal: metrics.stepGoal,
                waterGoal: metrics.waterGoal,
                sleepGoal: metrics.sleepGoal,
                activeMinutesGoal: metrics.activeMinutesGoal,
                caloriesBurnedGoal: metrics.caloriesBurnedGoal,
              });
              setIsEditingGoals(true);
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-display font-bold text-theme-accent bg-theme-accent-light hover:bg-theme-accent-light/80 rounded-xl transition-all cursor-pointer"
          >
            <Edit3 size={14} />
            Edit Goals & Targets
          </button>
        )}
      </div>

      {/* Goals editor */}
      {isEditingGoals && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id="goals-editor-form"
          className="bg-theme-support-light border border-theme-border rounded-2xl p-5 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {[
            { key: 'stepGoal', label: 'Steps Daily', min: 1000, step: 100 },
            { key: 'waterGoal', label: 'Water (mL)', min: 500, step: 250 },
            { key: 'sleepGoal', label: 'Sleep (hrs)', min: 4, step: 0.5 },
            { key: 'activeMinutesGoal', label: 'Active Mins', min: 10, step: 5 },
            { key: 'caloriesBurnedGoal', label: 'Calorie Burn', min: 100, step: 50 },
          ].map(({ key, label, min, step }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-display font-bold text-theme-support uppercase tracking-wider">{label}</label>
              <input
                type="number"
                step={step}
                value={editableGoals[key]}
                onChange={(e) => setEditableGoals({ ...editableGoals, [key]: Math.max(min, parseFloat(e.target.value) || 0) })}
                className="w-full bg-theme-surface border border-theme-border rounded-xl px-3 py-1.5 text-sm font-bold text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Metrics Grid */}
      <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <MetricCard label="Steps" value={metrics.steps.toLocaleString()} unit="" goal={metrics.stepGoal.toLocaleString()} percent={stepsPercent} color="bg-theme-support" icon={Footprints}>
          <div className="flex items-center justify-between gap-1">
            <button onClick={() => handleAddSteps(-500)} className="p-1 text-theme-muted hover:text-theme-support hover:bg-theme-support-light rounded-lg transition-colors cursor-pointer">
              <Minus size={14} />
            </button>
            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest text-center flex-1">+/-500 steps</span>
            <button onClick={() => handleAddSteps(500)} className="p-1 text-theme-muted hover:text-theme-support hover:bg-theme-support-light rounded-lg transition-colors cursor-pointer">
              <Plus size={14} />
            </button>
          </div>
        </MetricCard>

        <MetricCard label="Hydration" value={(metrics.water / 1000).toFixed(2)} unit="L" goal={`${(metrics.waterGoal / 1000).toFixed(2)} L`} percent={waterPercent} color="bg-theme-accent" icon={Droplet}>
          <div className="flex items-center justify-between gap-1">
            <button onClick={() => handleAddWater(-250)} className="p-1 text-theme-muted hover:text-theme-accent hover:bg-theme-accent-light rounded-lg transition-colors cursor-pointer">
              <Minus size={14} />
            </button>
            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest text-center flex-1">+/-250 mL</span>
            <button onClick={() => handleAddWater(250)} className="p-1 text-theme-muted hover:text-theme-accent hover:bg-theme-accent-light rounded-lg transition-colors cursor-pointer">
              <Plus size={14} />
            </button>
          </div>
        </MetricCard>

        <MetricCard label="Sleep" value={metrics.sleep} unit="hrs" goal={`${metrics.sleepGoal} hrs`} percent={sleepPercent} color="bg-theme-support" icon={Moon}>
          <div className="flex items-center justify-between gap-1">
            <button onClick={() => handleAddSleep(-0.5)} className="p-1 text-theme-muted hover:text-theme-support hover:bg-theme-support-light rounded-lg transition-colors cursor-pointer">
              <Minus size={14} />
            </button>
            <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest text-center flex-1">+/-0.5 hrs</span>
            <button onClick={() => handleAddSleep(0.5)} className="p-1 text-theme-muted hover:text-theme-support hover:bg-theme-support-light rounded-lg transition-colors cursor-pointer">
              <Plus size={14} />
            </button>
          </div>
        </MetricCard>

        <MetricCard label="Gym Time" value={metrics.activeMinutes} unit="mins" goal={`${metrics.activeMinutesGoal} mins`} percent={activePercent} color="bg-theme-success" icon={Dumbbell}>
          <div className="text-center">
            <span className="text-[10px] font-display font-bold text-theme-success bg-theme-success-light px-2 py-1 rounded-md inline-block uppercase tracking-wider">
              {metrics.activeMinutes >= metrics.activeMinutesGoal ? "Complete" : "Keep moving"}
            </span>
          </div>
        </MetricCard>

        <MetricCard label="Burned" value={metrics.caloriesBurned} unit="kcal" goal={`${metrics.caloriesBurnedGoal} kcal`} percent={caloriesPercent} color="bg-theme-warning" icon={Flame}>
          <div className="text-center">
            <span className="text-[10px] font-display font-bold text-theme-warning bg-theme-warning-light px-2.5 py-1 rounded-md inline-block uppercase tracking-wider">
              {caloriesPercent}% Done
            </span>
          </div>
        </MetricCard>

      </div>

      {/* Workout Logger */}
      <div id="workout-logger-section" className="card">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="text-theme-accent" size={18} />
          <h2 className="text-base font-display font-extrabold text-theme-primary tracking-tight">
            Log New Workout
          </h2>
        </div>

        <form onSubmit={submitQuickWorkout} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-display font-bold text-theme-secondary uppercase tracking-wider">Activity</label>
            <select
              value={customWorkout.type}
              onChange={(e) => setCustomWorkout({ ...customWorkout, type: e.target.value })}
              className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2.5 text-sm font-bold text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
            >
              <option value="Run">Outdoor Run</option>
              <option value="Cycle">Road Cycling</option>
              <option value="Strength">Weight Lifting</option>
              <option value="Yoga">Gentle Yoga</option>
              <option value="Walk">Brisk Walk</option>
              <option value="HIIT">HIIT Training</option>
              <option value="Swim">Laps Swimming</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-display font-bold text-theme-secondary uppercase tracking-wider">Duration (min)</label>
            <input
              type="number" min="1" max="300"
              value={customWorkout.duration}
              onChange={(e) => {
                const mins = Math.max(1, parseInt(e.target.value) || 0);
                let burnPerMin = 8;
                if (customWorkout.type === "Run") burnPerMin = 10;
                if (customWorkout.type === "Cycle") burnPerMin = 8;
                if (customWorkout.type === "Yoga") burnPerMin = 4;
                if (customWorkout.type === "HIIT") burnPerMin = 12;
                setCustomWorkout({ ...customWorkout, duration: mins, calories: mins * burnPerMin });
              }}
              className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2 text-sm font-bold text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-display font-bold text-theme-secondary uppercase tracking-wider">Est. Calories</label>
            <input
              type="number" min="1"
              value={customWorkout.calories}
              onChange={(e) => setCustomWorkout({ ...customWorkout, calories: Math.max(1, parseInt(e.target.value) || 0) })}
              className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2 text-sm font-bold text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
            />
          </div>

          <button
            id="log-workout-btn"
            type="submit"
            className="w-full bg-theme-accent hover:bg-theme-accent-hover text-white font-display font-bold text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            Log & Share
          </button>
        </form>

        <p className="text-xs text-center text-theme-muted mt-4 pt-4 border-t border-theme-border font-body">
          Logging a workout increases your stats, leaderboard scores, and counts toward your monthly discount race goal.
        </p>
      </div>

    </div>
  );
}
