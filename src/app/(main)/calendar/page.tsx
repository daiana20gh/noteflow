"use client";

import { useState, useEffect, useCallback } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import DayPanel from "@/components/DayPanel";
import { listEvents, createEvent, updateEvent, deleteEvent } from "@/lib/api";
import type { CalendarEvent } from "@/lib/calendar";
import { toMonthKey, toDateKey } from "@/lib/calendar";

export default function CalendarPage() {
  const today = toDateKey(new Date());
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const monthKey = toMonthKey(currentDate);

  const loadEvents = useCallback(async (month: string) => {
    try {
      const data = await listEvents(month);
      setEvents(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadEvents(monthKey);
  }, [monthKey, loadEvents]);

  const handlePrevMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const handleGoToDate = (year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleAddEvent = async (data: { title: string; hour: number; notes: string; color: string }) => {
    try {
      const ev = await createEvent({ ...data, date: selectedDate });
      setEvents((prev) => [...prev, ev]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateEvent = async (id: string, data: { title: string; notes: string; color: string }) => {
    try {
      const ev = await updateEvent(id, data);
      setEvents((prev) => prev.map((e) => (e.id === id ? ev : e)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const dayEvents = events.filter((e) => e.date === selectedDate);

  return (
    <div className="flex h-full bg-gray-50 dark:bg-black overflow-hidden">
      {/* Calendar grid panel */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
            <p className="text-sm text-gray-400 mt-1">Click a day to view and manage hourly events</p>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <CalendarGrid
              currentDate={currentDate}
              events={events}
              selectedDate={selectedDate}
              today={today}
              onSelectDate={setSelectedDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onGoToDate={handleGoToDate}
            />
          </div>
        </div>
      </div>

      {/* Day panel */}
      <div className="w-80 shrink-0 h-full border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
        <DayPanel
          date={selectedDate}
          events={dayEvents}
          onAdd={handleAddEvent}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      </div>
    </div>
  );
}
