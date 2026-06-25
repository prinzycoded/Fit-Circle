import React from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  Target,
  ChevronRight,
  Play
} from "lucide-react";

export default function DailyCheckIn({ user, onCheckIn }) {
  const today = new Date().toISOString().split('T')[0];
  const checkedInToday = user.lastCheckIn === today;
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const getLastWeekCheckIns = () => {
    const result = [];
    const streakStart = new Date(user.lastCheckIn);
    streakStart.setDate(streakStart.getDate() - (user.checkInStreak - 1));
    const streakStartStr = streakStart.toISOString().split('T')[0];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      result.push({
        date: ds,
        day: weekDays[d.getDay() === 0 ? 6 : d.getDay() - 1],
        done: ds >= streakStartStr && ds <= user.lastCheckIn,
      });
    }
    return result;
  };

  const lastWeek = getLastWeekCheckIns();
  const doneCount = lastWeek.filter(d => d.done).length;

  return (
    <div id="daily-checkin-widget" className="card card-hover">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-theme-success-light text-theme-success rounded-lg">
            <CheckCircle2 size={16} />
          </div>
          <h3 className="text-sm font-display font-extrabold text-theme-primary tracking-tight">
            Daily Check-In
          </h3>
        </div>
        {checkedInToday ? (
          <span className="text-[10px] font-display font-bold text-theme-success bg-theme-success-light px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={11} />
            Checked In
          </span>
        ) : (
          <span className="text-[10px] font-display font-bold text-theme-warning bg-theme-warning-light px-2.5 py-1 rounded-full">
            Pending
          </span>
        )}
      </div>

      {/* Weekly mini grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {lastWeek.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-theme-muted uppercase tracking-wider">{day.day}</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              day.done
                ? 'bg-theme-success text-white shadow-sm'
                : 'bg-theme-border/30 text-theme-muted'
            }`}>
              {day.done ? <CheckCircle2 size={12} /> : <Circle size={12} />}
            </div>
          </div>
        ))}
      </div>

      {/* Today's status */}
      <div className="bg-theme-bg/0.03 rounded-2xl p-4 border border-theme-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-theme-accent-light text-theme-accent rounded-xl">
            <Target size={18} />
          </div>
          <div>
            <p className="text-xs font-display font-bold text-theme-primary">
              {checkedInToday ? "Today's check-in complete" : "Check in for today"}
            </p>
            <p className="text-[10px] text-theme-secondary font-body mt-0.5">
              {checkedInToday 
                ? `${user.points?.toLocaleString() || 0} points earned` 
                : `${doneCount}/7 days this week`
              }
            </p>
          </div>
        </div>

        {!checkedInToday && (
          <button
            id="check-in-btn"
            onClick={onCheckIn}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-display font-bold text-white bg-theme-accent hover:bg-theme-accent-hover rounded-xl transition-all cursor-pointer"
          >
            <Play size={12} />
            Check In
          </button>
        )}
      </div>
    </div>
  );
}
