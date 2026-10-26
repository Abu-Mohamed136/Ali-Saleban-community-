import React, { useState } from 'react';
import { 
  FileText, 
  PlusCircle, 
  Search, 
  Pin, 
  Download, 
  Calendar, 
  User, 
  Trash2, 
  X, 
  Lock, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { NoteItem } from '../types';
import { PdfService } from '../utils/pdfGenerator';

interface NotesSectionProps {
  notes: NoteItem[];
  onAddNote: (note: Omit<NoteItem, 'id' | 'dateUpdated'>) => void;
  onUpdateNote?: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onTogglePin,
  isAdmin,
  onRequireAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const [formNote, setFormNote] = useState({
    title: '',
    category: 'Meeting Minutes' as NoteItem['category'],
    content: '',
    author: 'Adan Deeq Abdirahman Issa (Technical Staff)',
    pinned: false,
  });

  const categories: Array<NoteItem['category']> = [
    'Meeting Minutes',
    'Village Masterplan',
    'Survey Report',
    'Technical Architecture',
    'Elder Resolutions',
  ];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Sort pinned first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  });

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    setEditingNoteId(null);
    setFormNote({
      title: '',
      category: 'Meeting Minutes',
      content: '',
      author: 'Adan Deeq Abdirahman Issa (Technical Staff)',
      pinned: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: NoteItem) => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    setEditingNoteId(note.id);
    setFormNote({
      title: note.title,
      category: note.category,
      content: note.content,
      author: note.author,
      pinned: note.pinned,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNote.title.trim() || !formNote.content.trim()) return;

    if (editingNoteId && onUpdateNote) {
      const existing = notes.find((n) => n.id === editingNoteId);
      onUpdateNote({
        ...formNote,
        id: editingNoteId,
        dateUpdated: new Date().toISOString().split('T')[0],
      });
    } else {
      onAddNote(formNote);
    }
    setIsModalOpen(false);
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-amber-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-900/50 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Official Committee Archive</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Committee Notes & Elder Resolutions
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Official records of meetings, technical roadmaps, survey reports, and clan council agreements for Kulmis Village. Available offline and downloadable as PDF.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition shrink-0"
          >
            {isAdmin ? <PlusCircle className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-200" />}
            <span>New Note / Resolution</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, resolutions, survey logs..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            No notes found matching your criteria.
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between transition hover:shadow-md relative ${
                note.pinned
                  ? 'border-amber-400/80 dark:border-amber-500/80 ring-1 ring-amber-400/40 bg-amber-50/20 dark:bg-amber-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                    {note.category}
                  </span>

                  <button
                    onClick={() => onTogglePin(note.id)}
                    title={note.pinned ? 'Unpin Note' : 'Pin to top'}
                    className={`p-1 rounded transition ${
                      note.pinned
                        ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/40'
                        : 'text-slate-400 hover:text-amber-500'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">
                  {note.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line line-clamp-6">
                  {note.content}
                </p>
              </div>

              {/* Note Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                    {note.author}
                  </span>
                  <span>{note.dateUpdated}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(note)}
                    title="Edit Note Details"
                    className="p-1 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition flex items-center gap-0.5 font-medium text-[11px]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => PdfService.downloadNotesPdf(note)}
                    title="Download Note Document as PDF"
                    className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition flex items-center gap-1 font-semibold text-[10px]"
                  >
                    <Download className="w-3 h-3" />
                    <span>PDF</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      title="Delete Note"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-amber-900 to-emerald-950 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingNoteId ? 'Edit Committee Note (Wax Ka Beddel)' : 'Write Committee Note or Resolution'}
                </h3>
                <p className="text-xs text-amber-200">Cali Saleebaan, Kismayo Committee Archive</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formNote.title}
                  onChange={(e) => setFormNote({ ...formNote, title: e.target.value })}
                  placeholder="e.g. Minutes of Kismayo Elders Meeting on Water Rig Logistics"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formNote.category}
                    onChange={(e) => setFormNote({ ...formNote, category: e.target.value as NoteItem['category'] })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Author / Signatory
                  </label>
                  <input
                    type="text"
                    required
                    value={formNote.author}
                    onChange={(e) => setFormNote({ ...formNote, author: e.target.value })}
                    placeholder="Adan Deeq Abdirahman Issa (Technical Staff)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content / Resolutions / Minutes *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formNote.content}
                  onChange={(e) => setFormNote({ ...formNote, content: e.target.value })}
                  placeholder="Record full minutes, survey GPS findings, water pipeline details, or elder council resolutions..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={formNote.pinned}
                  onChange={(e) => setFormNote({ ...formNote, pinned: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="pinCheck" className="text-slate-700 dark:text-slate-300 font-medium">
                  Pin this document to top of official archive
                </label>
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
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2 rounded-xl shadow transition"
                >
                  {editingNoteId ? 'Save Changes' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
