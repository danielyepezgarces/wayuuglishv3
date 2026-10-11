import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';
import { User, DailyActivityRecord } from '../../types';
import { storage } from '../../services/storageService';
import { sounds } from '../../services/soundEffects';

interface WeeklyActivityProps {
  user: User;
  onOpenGoalSettings?: () => void;
  compact?: boolean;
}

type ViewMetric = 'all' | 'lessons' | 'xp';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomBarTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const lessonsData = payload.find((p) => p.dataKey === 'lessonsCompleted');
  const xpData = payload.find((p) => p.dataKey === 'xpEarned');

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-700/60 text-xs min-w-[170px] animate-fade-in">
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-700/80">
        <span className="font-bold text-slate-200">{label}</span>
        <span className="text-[10px] text-slate-400 font-mono">Últimos 7 días</span>
      </div>

      <div className="space-y-1.5">
        {lessonsData !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-rose-300">
              <i className="fa-solid fa-book-open text-[10px]"></i>
              <span>Lecciones:</span>
            </span>
            <span className="font-mono font-bold text-white">
              {lessonsData.value} {lessonsData.value === 1 ? 'lección' : 'lecciones'}
            </span>
          </div>
        )}

        {xpData !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-amber-300">
              <i className="fa-solid fa-bolt text-[10px]"></i>
              <span>Puntos XP:</span>
            </span>
            <span className="font-mono font-bold text-amber-300">
              +{xpData.value} XP
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const WeeklyActivity: React.FC<WeeklyActivityProps> = ({
  user,
  onOpenGoalSettings,
  compact = false
}) => {
  const [metric, setMetric] = useState<ViewMetric>('all');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(6); // Default to today (index 6)

  // Compute 7-day data from storageService
  const weeklyData: DailyActivityRecord[] = useMemo(() => {
    return storage.getWeeklyActivity(user);
  }, [user]);

  // Aggregate 7-day statistics
  const stats = useMemo(() => {
    const totalLessons = weeklyData.reduce((acc, d) => acc + d.lessonsCompleted, 0);
    const totalXp = weeklyData.reduce((acc, d) => acc + d.xpEarned, 0);
    const daysWithGoalMet = weeklyData.filter((d) => d.goalReached).length;
    const avgXpPerDay = Math.round(totalXp / 7);

    // Find best day
    let bestDay = weeklyData[0];
    for (const d of weeklyData) {
      if (d.xpEarned > (bestDay?.xpEarned || 0)) {
        bestDay = d;
      }
    }

    return {
      totalLessons,
      totalXp,
      daysWithGoalMet,
      avgXpPerDay,
      bestDay
    };
  }, [weeklyData]);

  const activeDay = selectedDayIndex !== null ? weeklyData[selectedDayIndex] : weeklyData[weeklyData.length - 1];

  const handleBarClick = (index: number) => {
    sounds.playPop();
    setSelectedDayIndex(index);
  };

  return (
    <div className={`w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden ${compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'}`}>
      {/* Header section with Cultural Accents */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-sm shadow-xs">
              <i className="fa-solid fa-chart-column"></i>
            </span>
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
              Actividad Semanal
            </h2>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Últimos 7 días
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Monitorea las lecciones culminadas y puntos de experiencia (XP) acumulados día a día en tu camino bilingüe Wayuu.
          </p>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => {
              sounds.playPop();
              setMetric('all');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              metric === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-layer-group text-[11px] text-slate-500"></i>
            <span>Comparar</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setMetric('lessons');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              metric === 'lessons'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <i className="fa-solid fa-book-open text-[11px]"></i>
            <span>Lecciones</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setMetric('xp');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              metric === 'xp'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-600'
            }`}
          >
            <i className="fa-solid fa-bolt text-[11px]"></i>
            <span>Puntos XP</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-5">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/40 border border-rose-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <i className="fa-solid fa-book-open text-base"></i>
          </div>
          <div>
            <div className="font-mono font-extrabold text-xl text-rose-900 leading-none">
              {stats.totalLessons}
            </div>
            <div className="text-[11px] font-semibold text-rose-700/90 mt-1">
              Lecciones completadas
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/40 border border-amber-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <i className="fa-solid fa-bolt text-base"></i>
          </div>
          <div>
            <div className="font-mono font-extrabold text-xl text-amber-900 leading-none">
              +{stats.totalXp}
            </div>
            <div className="text-[11px] font-semibold text-amber-800/90 mt-1">
              Puntos XP obtenidos
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <i className="fa-solid fa-bullseye text-base"></i>
          </div>
          <div>
            <div className="font-mono font-extrabold text-xl text-emerald-900 leading-none">
              {stats.daysWithGoalMet}/7
            </div>
            <div className="text-[11px] font-semibold text-emerald-800/90 mt-1">
              Días con meta cumplida
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/40 border border-indigo-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <i className="fa-solid fa-trophy text-base"></i>
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-indigo-900 truncate max-w-[120px]">
              {stats.bestDay ? `${stats.bestDay.dayName}` : 'Hoy'}
            </div>
            <div className="text-[11px] font-semibold text-indigo-700/90 mt-0.5">
              Mejor día ({stats.bestDay?.xpEarned || 0} XP)
            </div>
          </div>
        </div>
      </div>

      {/* Main Recharts Bar Chart Container */}
      <div className="mt-4 pt-2 pb-2">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
              barGap={6}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="dayLabel"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: '#F1F5F9', opacity: 0.6 }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
                formatter={(value) => {
                  if (value === 'lessonsCompleted') return 'Lecciones completadas';
                  if (value === 'xpEarned') return 'Puntos XP ganados';
                  return value;
                }}
              />

              {/* Bar 1: Lessons Completed (Rose / Crimson) */}
              {(metric === 'all' || metric === 'lessons') && (
                <Bar
                  dataKey="lessonsCompleted"
                  name="lessonsCompleted"
                  fill="#E11D48"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={38}
                  onClick={(_entry, index) => handleBarClick(index)}
                  className="cursor-pointer transition-opacity hover:opacity-85"
                >
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`cell-lessons-${index}`}
                      fill={selectedDayIndex === index ? '#BE123C' : '#E11D48'}
                    />
                  ))}
                </Bar>
              )}

              {/* Bar 2: XP Points Earned (Amber / Gold) */}
              {(metric === 'all' || metric === 'xp') && (
                <Bar
                  dataKey="xpEarned"
                  name="xpEarned"
                  fill="#F59E0B"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={38}
                  onClick={(_entry, index) => handleBarClick(index)}
                  className="cursor-pointer transition-opacity hover:opacity-85"
                >
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`cell-xp-${index}`}
                      fill={selectedDayIndex === index ? '#D97706' : '#F59E0B'}
                    />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Day Inspector Panel */}
      {activeDay && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
                activeDay.goalReached
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}
            >
              <i
                className={`fa-solid ${
                  activeDay.goalReached ? 'fa-calendar-check' : 'fa-clock'
                }`}
              ></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {activeDay.dayName} ({activeDay.date})
                </span>
                {activeDay.date === new Date().toISOString().split('T')[0] && (
                  <span className="px-2 py-0.2 font-mono text-[10px] font-bold bg-rose-100 text-rose-700 rounded-full">
                    Hoy
                  </span>
                )}
                {activeDay.goalReached && (
                  <span className="px-2 py-0.2 font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <i className="fa-solid fa-check text-[9px]"></i>
                    <span>Meta alcanzada</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeDay.lessonsCompleted} {activeDay.lessonsCompleted === 1 ? 'lección' : 'lecciones'} completadas · {activeDay.xpEarned} XP ganados de meta ({activeDay.dailyGoalXp} XP)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onOpenGoalSettings && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenGoalSettings();
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition shadow-xs flex items-center gap-1.5"
              >
                <i className="fa-solid fa-sliders text-[11px] text-slate-500"></i>
                <span>Ajustar Meta</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Motivational & Wayuu Cultural Bottom Ribbon */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <i className="fa-solid fa-fire text-amber-500 text-sm"></i>
          <span>
            Tu racha activa es de <strong className="text-slate-800 font-mono">{user.streak} días</strong>. ¡Estudiar un poco cada día fortalece la memoria cultural!
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-medium">
          <span className="flex items-center gap-1 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
            <span>Lecciones</span>
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Puntos XP</span>
          </span>
        </div>
      </div>
    </div>
  );
};
