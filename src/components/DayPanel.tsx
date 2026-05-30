"use client";

import { useState } from "react";
import type { CalendarEvent } from "@/lib/calendar";
import { EVENT_COLORS, formatDayLabel } from "@/lib/calendar";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function pad(n: number) {
  return String(n).padStart(2, "0");
}

type EventFormState = {
  title: string;
  notes: string;
  color: string;
};

type Props = {
  date: string;
  events: CalendarEvent[];
  onAdd: (data: { title: string; hour: number; notes: string; color: string }) => void;
  onUpdate: (id: string, data: { title: string; notes: string; color: string }) => void;
  onDelete: (id: string) => void;
};

export default function DayPanel({ date, events, onAdd, onUpdate, onDelete }: Props) {
  const [addingHour, setAddingHour] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventFormState>({ title: "", notes: "", color: EVENT_COLORS[0] });

  const eventsForHour = (hour: number) => events.filter((e) => e.hour === hour);

  const openAdd = (hour: number) => {
    setAddingHour(hour);
    setEditingId(null);
    setForm({ title: "", notes: "", color: EVENT_COLORS[0] });
  };

  const openEdit = (ev: CalendarEvent) => {
    setEditingId(ev.id);
    setAddingHour(null);
    setForm({ title: ev.title, notes: ev.notes, color: ev.color });
  };

  const cancelForm = () => {
    setAddingHour(null);
    setEditingId(null);
  };

  const submitAdd = () => {
    if (!form.title.trim() || addingHour === null) return;
    onAdd({ ...form, title: form.title.trim(), hour: addingHour });
    setAddingHour(null);
  };

  const submitEdit = () => {
    if (!form.title.trim() || !editingId) return;
    onUpdate(editingId, { ...form, title: form.title.trim() });
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
          {formatDayLabel(date)}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{events.length} event{events.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Hourly timeline */}
      <div className="flex-1 overflow-y-auto">
        {HOURS.map((hour) => {
          const hourEvents = eventsForHour(hour);
          const isAddingThis = addingHour === hour;

          return (
            <div key={hour} className="group relative border-b border-gray-50 dark:border-gray-800/60">
              {/* Hour label + add button */}
              <div className="flex items-center gap-2 px-4 pt-2 pb-1">
                <span className="text-xs text-gray-400 w-10 shrink-0 font-mono">
                  {pad(hour)}:00
                </span>
                {!isAddingThis && (
                  <button
                    onClick={() => openAdd(hour)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition ml-auto"
                  >
                    + add
                  </button>
                )}
              </div>

              {/* Existing events */}
              <div className="px-4 pb-1 space-y-1">
                {hourEvents.map((ev) => (
                  <div key={ev.id}>
                    {editingId === ev.id ? (
                      <EventForm
                        form={form}
                        setForm={setForm}
                        onSubmit={submitEdit}
                        onCancel={cancelForm}
                        submitLabel="Save"
                      />
                    ) : (
                      <div
                        className="flex items-start gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group/ev"
                        onClick={() => openEdit(ev)}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
                          style={{ backgroundColor: ev.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                            {ev.title}
                          </p>
                          {ev.notes && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{ev.notes}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(ev.id); }}
                          className="opacity-0 group-hover/ev:opacity-100 text-gray-300 hover:text-red-500 text-xs shrink-0 transition"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Inline add form */}
                {isAddingThis && (
                  <EventForm
                    form={form}
                    setForm={setForm}
                    onSubmit={submitAdd}
                    onCancel={cancelForm}
                    submitLabel="Add"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  form: EventFormState;
  setForm: React.Dispatch<React.SetStateAction<EventFormState>>;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-2 shadow-sm">
      <input
        autoFocus
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); if (e.key === "Escape") onCancel(); }}
        placeholder="Event title"
        className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111] outline-none focus:ring-1 focus:ring-violet-400"
      />
      <textarea
        value={form.notes}
        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        placeholder="Notes (optional)"
        rows={2}
        className="w-full text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111] outline-none focus:ring-1 focus:ring-violet-400 resize-none"
      />
      <div className="flex gap-1">
        {EVENT_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setForm((f) => ({ ...f, color: c }))}
            className={`w-5 h-5 rounded-full border-2 transition ${form.color === c ? "border-gray-700 dark:border-white scale-110" : "border-transparent"}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex gap-1.5 pt-0.5">
        <button
          onClick={onSubmit}
          className="flex-1 text-xs py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition"
        >
          {submitLabel}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
