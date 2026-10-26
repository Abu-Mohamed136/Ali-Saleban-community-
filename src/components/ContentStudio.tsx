import React, { useState } from 'react';
import { 
  Video, 
  PlusCircle, 
  Copy, 
  CheckCircle2, 
  Calendar, 
  Share2, 
  Sparkles, 
  Film, 
  Check, 
  Clock, 
  X, 
  Trash2, 
  Edit3, 
  Send,
  Lock
} from 'lucide-react';
import { ContentItem, ContentStatus, PlatformTarget } from '../types';

interface ContentStudioProps {
  items: ContentItem[];
  onAddItem: (item: Omit<ContentItem, 'id' | 'createdDate'>) => void;
  onUpdateItem?: (item: ContentItem) => void;
  onUpdateStatus: (id: string, status: ContentStatus) => void;
  onDeleteItem: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

const HOOK_TEMPLATES = [
  {
    title: 'Village Future Hook',
    hook: 'Stop scrolling! Here is why every Cali Saleebaan family in Somalia and the diaspora is talking about our new town KULMIS near Kismayo.',
  },
  {
    title: 'Water Well Miracle',
    hook: 'Biyaheenii waa soo baxeen! Watch the exact moment our 120-meter deep solar borehole hit pure sweet drinking water in Kulmis.',
  },
  {
    title: 'Diaspora Land Call',
    hook: 'Don’t spend decades paying rent in North America or Europe without securing your generational coastal plot in Kulmis, Kismayo.',
  },
  {
    title: 'Transparency / Fund Proof',
    hook: '100% financial transparency: Here is the exact mobile app where every single dollar contributed to Kulmis is tracked down to the cent.',
  }
];

export const ContentStudio: React.FC<ContentStudioProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onUpdateStatus,
  onDeleteItem,
  isAddModalOpen,
  setIsAddModalOpen,
  isAdmin,
  onRequireAdmin,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('All');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    targetPlatform: 'TikTok' as PlatformTarget,
    videoHook: '',
    scriptOutline: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    status: 'Idea' as ContentStatus,
    campaign: 'Kulmis Expansion' as ContentItem['campaign'],
  });

  const handleOpenAdd = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    setEditingItemId(null);
    setFormData({
      title: '',
      targetPlatform: 'TikTok',
      videoHook: HOOK_TEMPLATES[0].hook,
      scriptOutline: '1. Attention-grabbing opening with drone shot.\n2. Community elder message.\n3. Call to Action: Register your plot in the committee app.',
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'Idea',
      campaign: 'Kulmis Expansion',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: ContentItem) => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    setEditingItemId(item.id);
    setFormData({
      title: item.title,
      targetPlatform: item.targetPlatform,
      videoHook: item.videoHook,
      scriptOutline: item.scriptOutline,
      scheduledDate: item.scheduledDate,
      status: item.status,
      campaign: item.campaign,
    });
    setIsAddModalOpen(true);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.videoHook.trim()) return;

    if (editingItemId && onUpdateItem) {
      const existing = items.find((i) => i.id === editingItemId);
      onUpdateItem({
        ...formData,
        id: editingItemId,
        createdDate: existing ? existing.createdDate : new Date().toISOString().split('T')[0],
      });
    } else {
      onAddItem(formData);
    }
    setIsAddModalOpen(false);
    setEditingItemId(null);
  };

  const filteredItems = selectedCampaign === 'All' 
    ? items 
    : items.filter(i => i.campaign === selectedCampaign);

  const statusColumns: { label: string; status: ContentStatus }[] = [
    { label: 'Ideas & Brainstorm', status: 'Idea' },
    { label: 'Drafting Script', status: 'Drafting' },
    { label: 'Filming on Site', status: 'Filming' },
    { label: 'Scheduled', status: 'Scheduled' },
    { label: 'Published & Live', status: 'Published' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-900/50 px-3 py-1 rounded-full text-xs font-semibold text-purple-300 mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>Media & Campaign Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Video Hooks & Post Scheduler</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Write compelling video hooks, schedule social media announcements for Kulmis village expansion, and broadcast updates to WhatsApp and TikTok.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition shrink-0"
          >
            {isAdmin ? <PlusCircle className="w-4 h-4" /> : <Lock className="w-4 h-4 text-purple-200" />}
            <span>Create Video Hook</span>
          </button>
        </div>

        {/* Hook Quick Templates */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-xs font-semibold text-purple-200 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended Somali & Diaspora Hook Templates:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {HOOK_TEMPLATES.map((tmpl, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isAdmin) {
                    onRequireAdmin();
                    return;
                  }
                  setEditingItemId(null);
                  setFormData({
                    title: tmpl.title,
                    targetPlatform: 'TikTok',
                    videoHook: tmpl.hook,
                    scriptOutline: '1. Hook opening.\n2. Story demonstration in Kulmis.\n3. Call to register in app.',
                    scheduledDate: new Date().toISOString().split('T')[0],
                    status: 'Drafting',
                    campaign: 'Kulmis Expansion',
                  });
                  setIsAddModalOpen(true);
                }}
                className="text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 text-xs transition"
              >
                <div className="font-bold text-white text-[11px] mb-1">{tmpl.title}</div>
                <div className="text-[10px] text-slate-300 line-clamp-2">{tmpl.hook}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Pipeline & Columns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Content Progress Pipeline ({filteredItems.length} Posts)
          </h3>

          {/* Filter by Campaign */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Campaign:</span>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-200 outline-none"
            >
              <option value="All">All Campaigns</option>
              <option value="Kulmis Expansion">Kulmis Expansion</option>
              <option value="Water Well Drive">Water Well Drive</option>
              <option value="Diaspora Outreach">Diaspora Outreach</option>
              <option value="Road Clearing">Road Clearing</option>
            </select>
          </div>
        </div>

        {/* 5 Kanban Stage Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {statusColumns.map((col) => {
            const colItems = filteredItems.filter(i => i.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                    {col.label}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {colItems.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[600px] no-scrollbar">
                  {colItems.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400">
                      Empty
                    </div>
                  ) : (
                    colItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800 rounded-xl p-3 space-y-2 shadow-xs transition hover:border-purple-300 dark:hover:border-purple-800 text-xs"
                      >
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <span className="font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                            {item.targetPlatform}
                          </span>
                          <span className="text-slate-400">{item.scheduledDate}</span>
                        </div>

                        <h5 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                          {item.title}
                        </h5>

                        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 italic relative group">
                          "{item.videoHook}"
                          <button
                            onClick={() => handleCopy(item.id, item.videoHook)}
                            className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:underline"
                          >
                            {copiedId === item.id ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>Copied Hook!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Hook</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Status Mover & Actions */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          {isAdmin ? (
                            <select
                              value={item.status}
                              onChange={(e) => onUpdateStatus(item.id, e.target.value as ContentStatus)}
                              className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded px-1.5 py-1 outline-none"
                            >
                              <option value="Idea">Idea</option>
                              <option value="Drafting">Drafting</option>
                              <option value="Filming">Filming</option>
                              <option value="Scheduled">Scheduled</option>
                              <option value="Published">Published</option>
                            </select>
                          ) : (
                            <span className="text-[10px] text-slate-400">{item.status}</span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              title="Edit Video Hook"
                              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 p-1 rounded transition text-[10px] font-medium flex items-center gap-0.5"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>

                            {isAdmin && (
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal to create or edit video hook */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-purple-800 to-emerald-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingItemId ? 'Edit Video Hook (Wax Ka Beddel)' : 'New Video Hook & Post Idea'}
                </h3>
                <p className="text-xs text-purple-200">Cali Saleebaan, Kismayo Committee Media Hub</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Post Title / Topic *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Kulmis Water Borehole Pure Water Test"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Social Platform *
                  </label>
                  <select
                    value={formData.targetPlatform}
                    onChange={(e) => setFormData({ ...formData, targetPlatform: e.target.value as PlatformTarget })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    <option value="TikTok">TikTok (Short Form)</option>
                    <option value="Facebook">Facebook (Townhall & Elders)</option>
                    <option value="YouTube">YouTube (Full Documentary)</option>
                    <option value="Instagram">Instagram Reels</option>
                    <option value="WhatsApp Status">WhatsApp Status & Broadcast</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video Hook (First 3 Seconds) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.videoHook}
                  onChange={(e) => setFormData({ ...formData, videoHook: e.target.value })}
                  placeholder="Write the exact hook statement that will stop users from scrolling..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video Script Outline & Call to Action (CTA)
                </label>
                <textarea
                  rows={3}
                  value={formData.scriptOutline}
                  onChange={(e) => setFormData({ ...formData, scriptOutline: e.target.value })}
                  placeholder="1. Show drone shot. 2. Interview elder on site. 3. Call to register in Cali Saleebaan app..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2 rounded-xl shadow transition"
                >
                  {editingItemId ? 'Save Changes' : 'Save Hook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
