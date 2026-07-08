import React, { useState } from "react";
import {
  Activity,
  Ruler,
  TrendingUp,
  TrendingDown,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const MEASUREMENT_TYPES = [
  { id: "chest", label: "Chest", unit: "cm" },
  { id: "waist", label: "Waist", unit: "cm" },
  { id: "arms", label: "Arms", unit: "cm" },
  { id: "thighs", label: "Thighs", unit: "cm" },
];

const SimpleChart = ({ data, color = "var(--theme-accent)", height = 120 }) => {
  if (!data || data.length < 2) return null;
  const values = data.map(d => d.value);
  const max = Math.max(...values) * 1.1;
  const min = Math.min(...values) * 0.9;
  const range = max - min;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = range > 0 ? ((d.value - min) / range) * height : height / 2;
    return `${x},${height - y}`;
  }).join(" ");
  const trend = values[values.length - 1] - values[0];
  const TrendIcon = trend <= 0 ? TrendingDown : TrendingUp;
  const trendColor = trend <= 0 ? "text-theme-success" : "text-theme-warning";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider">
          {data[0].date} &mdash; {data[data.length - 1].date}
        </span>
        <span className={`text-[11px] font-display font-extrabold flex items-center gap-0.5 ${trendColor}`}>
          <TrendIcon size={12} />
          {trend > 0 ? "+" : ""}{trend.toFixed(1)}
        </span>
      </div>
      <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = range > 0 ? ((d.value - min) / range) * height : height / 2;
          return (
            <circle
              key={i}
              cx={x}
              cy={height - y}
              r="2.5"
              fill={color}
              className="hover:r-4 transition-all"
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-[9px] text-theme-muted">
        <span>{data[0].value}</span>
        <span>{data[data.length - 1].value}</span>
      </div>
    </div>
  );
};

export default function ProgressTracker({ progressData, onUpdateProgress }) {
  const [showEntry, setShowEntry] = useState(false);
  const [entryForm, setEntryForm] = useState({
    type: "measurement",
    value: "",
    measurementType: "chest",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entryForm.value) return;
    onUpdateProgress({ type: "measurement", date: entryForm.date, value: parseFloat(entryForm.value), measurementType: entryForm.measurementType });
    setEntryForm({
      type: "measurement",
      value: "",
      measurementType: "chest",
      date: new Date().toISOString().split("T")[0],
    });
    setShowEntry(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-accent-light text-theme-accent rounded-xl">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-xl font-display font-extrabold text-theme-primary">Progress Tracker</h1>
            <p className="text-xs text-theme-secondary">Track your body measurements</p>
          </div>
        </div>
        <button
          onClick={() => setShowEntry(true)}
          className="bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-display font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={15} />
          Log Entry
        </button>
      </div>

      {/* Summary Card */}
      <div className="card flex items-center gap-3 py-3 px-4">
        <div className="p-2 bg-theme-support-light text-theme-support rounded-xl">
          <Ruler size={16} />
        </div>
        <div>
          <p className="text-xs font-display font-extrabold text-theme-primary">
            {Object.values(progressData.measurements || {}).some(m => m.length > 0) ? "Recorded" : "No data"}
          </p>
          <p className="text-[10px] text-theme-muted">Measurements</p>
          <p className="text-[9px] text-theme-secondary">
            {Object.entries(progressData.measurements || {}).filter(([, v]) => v.length > 0).length}/4 tracked
          </p>
        </div>
      </div>

      <div className="space-y-4">
          {MEASUREMENT_TYPES.map(({ id, label, unit }) => {
            const data = progressData.measurements?.[id] || [];
            const latest = data.length > 0 ? data[data.length - 1] : null;
            const first = data.length > 0 ? data[0] : null;
            const change = latest && first ? latest.value - first.value : null;
            return (
              <div key={id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Ruler size={14} className="text-theme-support" />
                    <h3 className="text-sm font-display font-extrabold text-theme-primary">{label}</h3>
                  </div>
                  {latest && (
                    <span className="text-xs font-display font-bold text-theme-primary">{latest.value} {unit}</span>
                  )}
                </div>
                {data.length >= 2 ? (
                  <SimpleChart data={data} color="var(--theme-support)" height={80} />
                ) : data.length === 1 ? (
                  <div className="text-center py-4 bg-theme-border/10 rounded-xl">
                    <p className="text-xs text-theme-muted">
                      Current: {data[0].value} {unit} &mdash; Log another to see trends
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-theme-border/10 rounded-xl">
                    <p className="text-xs text-theme-muted">No {label.toLowerCase()} measurements recorded yet.</p>
                  </div>
                )}
                {change !== null && (
                  <div className="flex items-center gap-1 mt-2 text-[10px]">
                    <span className={`font-bold ${change <= 0 ? "text-theme-success" : "text-theme-warning"}`}>
                      {change > 0 ? "+" : ""}{change.toFixed(1)} {unit}
                    </span>
                    <span className="text-theme-muted">total change</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      {/* Log Entry Modal */}
      <AnimatePresence>
        {showEntry && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEntry(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card max-w-md w-full space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-theme-accent-light text-theme-accent rounded-xl">
                    <Plus size={18} />
                  </div>
                  <h3 className="text-base font-display font-extrabold text-theme-primary">Log Measurement</h3>
                </div>
                <button onClick={() => setShowEntry(false)} className="p-1.5 rounded-lg hover:bg-theme-border/30 text-theme-muted cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Date</label>
                  <input
                    type="date"
                    value={entryForm.date}
                    onChange={(e) => setEntryForm({ ...entryForm, date: e.target.value })}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Body Part</label>
                  <select
                    value={entryForm.measurementType}
                    onChange={(e) => setEntryForm({ ...entryForm, measurementType: e.target.value })}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2.5 text-xs font-body text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent cursor-pointer"
                  >
                    {MEASUREMENT_TYPES.map(({ id, label, unit }) => (
                      <option key={id} value={id}>{label} ({unit})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-display font-bold text-theme-muted uppercase tracking-wider block mb-1">Value</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 95"
                    value={entryForm.value}
                    onChange={(e) => setEntryForm({ ...entryForm, value: e.target.value })}
                    className="w-full bg-theme-bg border border-theme-border rounded-xl px-4 py-2.5 text-sm font-body text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-accent"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEntry(false)}
                    className="flex-1 py-2.5 rounded-xl border border-theme-border text-xs font-display font-bold text-theme-secondary hover:bg-theme-border/30 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!entryForm.value}
                    className="flex-1 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-display font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={15} />
                    Save Measurement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
