"use client";

import { useState, useEffect } from "react";
import type { CalendarEvent } from "@/lib/calendar";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function firstWeekdayOffset(year: number, month: number): number {
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
  onGoToDate: (year: number, month: number) => void;
};

export default function CalendarGrid({
  currentDate,
  events,
  selectedDate,
  today,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onGoToDate,
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const offset = firstWeekdayOffset(year, month);
  const totalDays = daysInMonth(year, month);

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Close pickers on outside click
  useEffect(() => {
    const handler = () => { setShowMonthPicker(false); setShowYearPicker(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Build event map: dateKey → unique colors[]
  const eventMap = new Map<string, string[]>();
  for (const ev of events) {
    const list = eventMap.get(ev.date) ?? [];
    if (!list.includes(ev.color)) list.push(ev.color);
    eventMap.set(ev.date, list);
  }

  // Build grid cells (nulls = padding)
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // Year range: ±10 around current year
  const yearRange = Array.from({ length: 21 }, (_, i) => year - 10 + i);

  return (
    <div className="flex flex-col gap-6">
      {/* Header: prev · month · year · next */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition text-xl font-light"
        >
          ‹
        </button>

        <div className="flex items-center gap-0.5">
          {/* Month picker */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowMonthPicker((v) => !v); setShowYearPicker(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-base font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {MONTHS[month]}
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMonthPicker && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-40 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-3 w-52">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Select Month</p>
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS.map((m, i) => (
                    <button
                      key={m}
                      onClick={() => { onGoToDate(year, i); setShowMonthPicker(false); }}
                      className={`text-xs py-2.5 rounded-xl transition font-medium ${
                        i === month
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Year picker */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowYearPicker((v) => !v); setShowMonthPicker(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-base font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {year}
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showYearPicker && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-40 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-3 w-44 max-h-60 overflow-y-auto">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Select Year</p>
                <div className="grid grid-cols-3 gap-1">
                  {yearRange.map((y) => (
                    <button
                      key={y}
                      onClick={() => { onGoToDate(y, month); setShowYearPicker(false); }}
                      className={`text-xs py-2.5 rounded-xl transition font-medium ${
                        y === year
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onNextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition text-xl font-light"
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[11px] font-bold uppercase tracking-wide py-1 ${
              i >= 5 ? "text-violet-400 dark:text-violet-500" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`pad-${idx}`} />;

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = dateKey === today;
          const isSelected = dateKey === selectedDate;
          const dots = eventMap.get(dateKey) ?? [];
          const weekdayIdx = (offset + day - 1) % 7;
          const isWeekend = weekdayIdx >= 5;

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`relative flex flex-col items-center justify-start pt-2 pb-3 rounded-2xl min-h-[60px] transition-all duration-150
                ${isSelected
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/50 scale-[1.04]"
                  : isToday
                  ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 ring-2 ring-violet-400 dark:ring-violet-600"
                  : isWeekend
                  ? "text-violet-500 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <span className="text-sm font-semibold leading-none">{day}</span>
              {dots.length > 0 && (
                <div className="flex gap-0.5 mt-2">
                  {dots.slice(0, 3).map((color, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isSelected ? "rgba(255,255,255,0.7)" : color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-600 text-center pb-1">
        Click a day to view or add events
      </p>
    </div>
  );
}
