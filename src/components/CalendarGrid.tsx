"use client";

import type { CalendarEvent } from "@/lib/calendar";
import { formatMonthLabel, toDateKey } from "@/lib/calendar";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function firstWeekdayOffset(year: number, month: number): number {
  // Returns 0=Mon … 6=Sun
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

type Props = {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: string | null;
  today: string;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export default function CalendarGrid({
  currentDate,
  events,
  selectedDate,
  today,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const offset = firstWeekdayOffset(year, month);
  const totalDays = daysInMonth(year, month);

  // Build event map: dateKey → colors[]
  const eventMap = new Map<string, string[]>();
  for (const ev of events) {
    const list = eventMap.get(ev.date) ?? [];
    if (!list.includes(ev.color)) list.push(ev.color);
    eventMap.set(ev.date, list);
  }

  // Build grid cells (nulls are padding)
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
        >
          ‹
        </button>
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          {formatMonthLabel(currentDate)}
        </h2>
        <button
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition"
        >
          ›
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}

        {/* Day cells */}
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`pad-${idx}`} />;
          }

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateKey === today;
          const isSelected = dateKey === selectedDate;
          const dots = eventMap.get(dateKey) ?? [];

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`relative flex flex-col items-center justify-start pt-1.5 pb-2 rounded-xl min-h-[52px] transition text-sm font-medium
                ${isSelected
                  ? "bg-violet-600 text-white shadow-md"
                  : isToday
                  ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 ring-1 ring-violet-300 dark:ring-violet-700"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <span>{day}</span>
              {dots.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {dots.slice(0, 3).map((color, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isSelected ? "rgba(255,255,255,0.8)" : color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <p className="text-xs text-gray-400 text-center">
        Click a day to view or add events
      </p>
    </div>
  );
}
