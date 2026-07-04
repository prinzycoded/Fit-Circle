import React, { useState } from "react";
import {
  Bell,
  BellOff,
  Clock,
  Calendar,
  Dumbbell,
  CheckCircle2,
  Droplets,
  ChevronRight,
  Save,
  Timer,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "motion/react";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ReminderSystem({ reminderSettings, onUpdateReminders }) {
  const [localSettings, setLocalSettings] = useState(reminderSettings);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleTimeChange = (time) => {
    setLocalSettings(prev => ({ ...prev, reminderTime: time }));
    setSaved(false);
  };

  const handleDayToggle = (day) => {
    setLocalSettings(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.includes(day)
        ? prev.reminderDays.filter(d => d !== day)
        : [...prev.reminderDays, day],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    onUpdateReminders(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reminders = [
    { key: "workoutReminders", label: "Workout Reminders", description: "Remind me to log my daily workout", icon: Dumbbell, color: "text-theme-accent", bg: "bg-theme-accent-light" },
    { key: "checkInReminder", label: "Daily Check-in", description: "Remind me to check in every day", icon: CheckCircle2, color: "text-theme-success", bg: "bg-theme-success-light" },
    { key: "wateringReminder", label: "Hydration Alert", description: "Remind me to drink water regularly", icon: Droplets, color: "text-theme-support", bg: "bg-theme-support-light" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-warning-light text-theme-warning rounded-xl">
            <Bell size={20} />
          </div>
          <div>
            <h1 className="text-xl font-display font-extrabold text-theme-primary">Reminders</h1>
            <p className="text-xs text-theme-secondary">Stay on track with smart reminders</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 text-xs font-display font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            saved
              ? "bg-theme-success-light text-theme-success"
              : "bg-theme-accent hover:bg-theme-accent-hover text-white"
          }`}
        >
          {saved ? (
            <><CheckCircle2 size={15} /> Saved</>
          ) : (
            <><Save size={15} /> Save Changes</>
          )}
        </button>
      </div>

      {/* Master Toggle */}
      <div className={`card flex items-center justify-between ${!localSettings.enabled ? "opacity-60" : ""}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${localSettings.enabled ? "bg-theme-warning-light text-theme-warning" : "bg-theme-border/30 text-theme-muted"}`}>
            {localSettings.enabled ? <Bell size={20} /> : <BellOff size={20} />}
          </div>
          <div>
            <p className="text-sm font-display font-extrabold text-theme-primary">All Reminders</p>
            <p className="text-[10px] text-theme-secondary">{localSettings.enabled ? "Reminders are active" : "All reminders are paused"}</p>
          </div>
        </div>
        <button
          onClick={() => handleToggle("enabled")}
          className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${
            localSettings.enabled ? "bg-theme-accent" : "bg-theme-border"
          }`}
        >
          <motion.div
            animate={{ x: localSettings.enabled ? 24 : 2 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
          />
        </button>
      </div>

      {localSettings.enabled && (
        <>
          {/* Reminder Types */}
          <div className="space-y-3">
            <p className="text-xs font-display font-bold text-theme-primary uppercase tracking-wider">Reminder Types</p>
            {reminders.map(({ key, label, description, icon: Icon, color, bg }) => (
              <div key={key} className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${bg} ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-display font-bold text-theme-primary">{label}</p>
                    <p className="text-[10px] text-theme-secondary">{description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(key)}
                  className={`relative w-10 h-5 rounded-full transition-all cursor-pointer ${
                    localSettings[key] ? "bg-theme-accent" : "bg-theme-border"
                  }`}
                >
                  <motion.div
                    animate={{ x: localSettings[key] ? 20 : 2 }}
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Time Picker */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Timer size={16} className="text-theme-support" />
              <h2 className="text-sm font-display font-extrabold text-theme-primary">Reminder Time</h2>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={localSettings.reminderTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="bg-theme-bg border border-theme-border rounded-xl px-4 py-3 text-sm font-display font-bold text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
              />
              <div className="flex items-center gap-2 text-xs text-theme-secondary">
                {parseInt(localSettings.reminderTime) < 12 ? (
                  <><Sun size={14} className="text-theme-warning" /> Morning</>
                ) : parseInt(localSettings.reminderTime) < 17 ? (
                  <><Sun size={14} className="text-theme-warning" /> Afternoon</>
                ) : (
                  <><Moon size={14} className="text-theme-support" /> Evening</>
                )}
              </div>
            </div>
          </div>

          {/* Day Selection */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-theme-warning" />
              <h2 className="text-sm font-display font-extrabold text-theme-primary">Repeat Days</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = localSettings.reminderDays.includes(day);
                const isWeekend = day === "Saturday" || day === "Sunday";
                return (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-display font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-theme-accent text-white"
                        : "bg-theme-border/20 text-theme-secondary hover:bg-theme-border/40"
                    } ${isWeekend ? "opacity-70" : ""}`}
                  >
                    {day.substring(0, 3)}
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] text-theme-muted mt-2">
              {localSettings.reminderDays.length} day{localSettings.reminderDays.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        </>
      )}

      {/* Summary */}
      <div className="card bg-theme-warning-light/20 border-theme-warning/20">
        <div className="flex items-start gap-3">
          <Bell size={16} className="text-theme-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-display font-bold text-theme-primary">Reminder Summary</p>
            <p className="text-[10px] text-theme-secondary mt-1">
              {localSettings.enabled
                ? `You'll receive ${[localSettings.workoutReminders && "workout", localSettings.checkInReminder && "check-in", localSettings.wateringReminder && "hydration"].filter(Boolean).join(", ")} reminders at ${localSettings.reminderTime} on ${localSettings.reminderDays.length} day(s).`
                : "Reminders are currently paused. Toggle them on to stay on track."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
