import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  Clock, 
  MapPin, 
  X, 
  Trash2,
  Lock,
  Sparkles,
  Edit3
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface BigCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent?: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const BigCalendar: React.FC<BigCalendarProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  isAdmin,
  onRequireAdmin,
}) => {
  // Current view date
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Oct 2026
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-27');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [formEvent, setFormEvent] = useState({
    title: '',
    date: '2026-10-27',
    time: '10:00',
    type: 'Meeting' as CalendarEvent['type'],
    location: 'Kulmis Project Site',
    description: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const somaliMonthNames = [
    'Bisha 1aad (Jan)', 'Bisha 2aad (Feb)', 'Bisha 3aad (Mar)', 'Bisha 4aad (Apr)', 
    'Bisha 5aad (May)', 'Bisha 6aad (Jun)', 'Bisha 7aad (Jul)', 'Bisha 8aad (Aug)', 
    'Bisha 9aad (Sep)', 'Bisha 10aad (Oct)', 'Bisha 11aad (Nov)', 'Bisha 12aad (Dec)'
  ];

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleOpenAddModal = (dateStr?: string) => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    const d = dateStr || selectedDate;
    setSelectedDate(d);
    setEditingEventId(null);
    setFormEvent({
      title: '',
      date: d,
      time: '10:00',
      type: 'Meeting',
      location: 'Kismayo Office / Kulmis Site',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt: CalendarEvent) => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    setEditingEventId(evt.id);
    setSelectedDate(evt.date);
    setFormEvent({
      title: evt.title,
      date: evt.date,
      time: evt.time,
      type: evt.type,
      location: evt.location,
      description: evt.description,
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEvent.title.trim()) return;

    if (editingEventId && onUpdateEvent) {
      onUpdateEvent({
        ...formEvent,
        id: editingEventId,
      });
    } else {
      onAddEvent(formEvent);
    }
    setIsModalOpen(false);
    setEditingEventId(null);
  };

  const eventTypeColors: Record<CalendarEvent['type'], { bg: string; text: string; border: string }> = {
    Meeting: { bg: 'bg-blue-100 dark:bg-blue-950/80', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-800' },
    'Field Survey': { bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-800' },
    'Content Post': { bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-800' },
    Fundraiser: { bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-900 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-800' },
    'Registration Drive': { bg: 'bg-rose-100 dark:bg-rose-950/80', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-800' },
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header with Expansive Navigation */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-blue-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-900/50 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-2">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Full-Scale Master Schedule</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Kulmis Expansion & Committee Big Calendar
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Field inspections, community townhalls, water well drilling reviews, and scheduled video broadcasts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-white/10 rounded-lg text-white transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold px-3 min-w-[140px] text-center">
                {monthNames[month]} {year}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-white/10 rounded-lg text-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleOpenAddModal(selectedDate)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition shrink-0"
            >
              {isAdmin ? <PlusCircle className="w-4 h-4" /> : <Lock className="w-4 h-4 text-blue-200" />}
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Expansive Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Days of week */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center font-bold text-xs py-3 text-slate-600 dark:text-slate-400">
          <div>Sun (Axad)</div>
          <div>Mon (Isniin)</div>
          <div>Tue (Talaado)</div>
          <div>Wed (Arbaco)</div>
          <div>Thu (Khamiis)</div>
          <div>Fri (Jimco)</div>
          <div>Sat (Sabti)</div>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-28 sm:h-32 bg-slate-50/50 dark:bg-slate-950/30 p-2" />
          ))}

          {/* Actual days */}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayEvents = events.filter((e) => e.date === dateStr);
            const isSelected = selectedDate === dateStr;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-28 sm:h-32 p-2 relative flex flex-col justify-between transition cursor-pointer hover:bg-blue-50/50 dark:hover:bg-slate-800/40 ${
                  isSelected ? 'bg-blue-50 dark:bg-slate-800/80 ring-2 ring-blue-500 inset-0 z-10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-semibold text-slate-400">
                      {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Day events pills preview */}
                <div className="space-y-1 overflow-y-auto max-h-16 no-scrollbar mt-1">
                  {dayEvents.slice(0, 2).map((ev) => {
                    const style = eventTypeColors[ev.type] || eventTypeColors.Meeting;
                    return (
                      <div
                        key={ev.id}
                        className={`text-[10px] truncate px-1.5 py-0.5 rounded border ${style.bg} ${style.text} ${style.border} font-medium`}
                      >
                        {ev.time} {ev.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] text-slate-400 pl-1 font-semibold">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-end">
                  <span className="opacity-0 group-hover:opacity-100 transition">+</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Detail */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Selected Date Agenda
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {selectedDate}
            </h3>
            <p className="text-xs text-slate-500">
              Meetings, field surveys, and social media posts scheduled for this day
            </p>
          </div>

          <button
            onClick={() => handleOpenAddModal(selectedDate)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {isAdmin ? <PlusCircle className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>Schedule on this date</span>
          </button>
        </div>

        {events.filter((e) => e.date === selectedDate).length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No events scheduled for {selectedDate}. Click "Schedule on this date" to add an event.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {events
              .filter((e) => e.date === selectedDate)
              .map((evt) => {
                const style = eventTypeColors[evt.type] || eventTypeColors.Meeting;
                return (
                  <div
                    key={evt.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 bg-slate-50/50 dark:bg-slate-950/50 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}>
                        {evt.type}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{evt.time}</span>
                        </span>

                        <button
                          onClick={() => handleOpenEditModal(evt)}
                          title="Edit Event (Wax ka beddel)"
                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 p-1 rounded transition flex items-center gap-1 text-[11px]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => onDeleteEvent(evt.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {evt.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{evt.location}</span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {evt.description}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-900 to-emerald-950 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingEventId ? 'Edit Committee Event (Wax Ka Beddel)' : 'Schedule Committee Event'}
                </h3>
                <p className="text-xs text-blue-200">Date: {formEvent.date}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formEvent.title}
                  onChange={(e) => setFormEvent({ ...formEvent, title: e.target.value })}
                  placeholder="e.g. Field Inspection to Kulmis Borehole #1"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formEvent.date}
                    onChange={(e) => setFormEvent({ ...formEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time (Saacadda)
                  </label>
                  <input
                    type="text"
                    value={formEvent.time}
                    onChange={(e) => setFormEvent({ ...formEvent, time: e.target.value })}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={formEvent.type}
                    onChange={(e) => setFormEvent({ ...formEvent, type: e.target.value as CalendarEvent['type'] })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Meeting">Meeting (General / Elders)</option>
                    <option value="Field Survey">Field Survey to Kulmis</option>
                    <option value="Content Post">Video / Content Post</option>
                    <option value="Fundraiser">Fundraiser & Townhall</option>
                    <option value="Registration Drive">Registration Drive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location (Goobta) *
                </label>
                <input
                  type="text"
                  required
                  value={formEvent.location}
                  onChange={(e) => setFormEvent({ ...formEvent, location: e.target.value })}
                  placeholder="e.g. Kulmis Sector 1 HQ or Kismayo Committee Hall"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Agenda Notes
                </label>
                <textarea
                  rows={3}
                  value={formEvent.description}
                  onChange={(e) => setFormEvent({ ...formEvent, description: e.target.value })}
                  placeholder="Outline the meeting agenda, attendees, survey coordinates, or action items..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl shadow transition"
                >
                  {editingEventId ? 'Save Changes' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
