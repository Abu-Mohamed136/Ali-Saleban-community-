import React, { useState } from 'react';
import { 
  Wrench, 
  PlusCircle, 
  Code, 
  Phone, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Trash2,
  Lock,
  Edit3
} from 'lucide-react';
import { TechnicalStaff, TechRole } from '../types';

interface TechnicalTeamProps {
  staff: TechnicalStaff[];
  onAddStaff: (member: Omit<TechnicalStaff, 'id'>) => void;
  onUpdateStaff?: (member: TechnicalStaff) => void;
  onDeleteStaff: (id: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
}

export const TechnicalTeam: React.FC<TechnicalTeamProps> = ({
  staff,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  isAdmin,
  onRequireAdmin,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    role: 'GIS & Land Surveyor' as TechRole,
    phone: '+252 61 ',
    email: '',
    specialization: '',
    assignedTasks: '',
    status: 'Active' as 'Active' | 'On Field Survey' | 'Consulting',
    isLeadDeveloper: false,
  });

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    setEditingStaffId(null);
    setFormData({
      fullName: '',
      role: 'GIS & Land Surveyor',
      phone: '+252 61 ',
      email: '',
      specialization: '',
      assignedTasks: '',
      status: 'Active',
      isLeadDeveloper: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: TechnicalStaff) => {
    if (!isAdmin) {
      onRequireAdmin();
      return;
    }
    setEditingStaffId(member.id);
    setFormData({
      fullName: member.fullName,
      role: member.role,
      phone: member.phone,
      email: member.email || '',
      specialization: member.specialization,
      assignedTasks: member.assignedTasks,
      status: member.status,
      isLeadDeveloper: member.isLeadDeveloper || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) return;

    if (editingStaffId && onUpdateStaff) {
      onUpdateStaff({
        ...formData,
        id: editingStaffId,
      });
    } else {
      onAddStaff(formData);
    }
    setIsModalOpen(false);
    setEditingStaffId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-800/40 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Engineering & Digital Systems Wing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Cali Saleebaan Technical Team Members</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              The engineers, land surveyors, hydrologists, and software developers driving the planning, mapping, and technical execution of <strong>Kulmis Village</strong>.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition shrink-0"
          >
            {isAdmin ? <PlusCircle className="w-4 h-4" /> : <Lock className="w-4 h-4 text-emerald-200" />}
            <span>Add Technical Team Member</span>
          </button>
        </div>
      </div>

      {/* Featured Lead Developer Card (Adan Deeq Abdirahman Issa) */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-xl border-2 border-emerald-500/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-emerald-400">
                <Code className="w-7 h-7" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Lead Developer & Systems Architect
                </span>
                <span className="text-xs text-slate-300 font-medium">Technical Staff Member</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Adan Deeq Abdirahman Issa
              </h3>
              <p className="text-xs text-emerald-100/90 max-w-xl">
                Creator and developer of this Cali Saleebaan Committee Android App. Responsible for offline data persistence, financial ledger integrity, Google Maps GPS survey integrations, and member APK distribution.
              </p>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs space-y-2 shrink-0 w-full md:w-auto">
            <div className="space-y-1 font-mono">
              <a
                href="https://wa.me/252611571310"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+252 61 157 1310 (WhatsApp / Somalia)</span>
              </a>
              <a
                href="tel:+254722123678"
                className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+254 722 123 678 (Kenya / Direct)</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>adandeeq136@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px] pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>App Status: Production Active & Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Roster of other Technical Team Members */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Registered Technical Staff ({staff.length})
          </h3>
          <span className="text-xs text-slate-500">
            Field Surveyors · Civil Engineers · Hydrologists
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-3 relative transition hover:shadow-md ${
                member.isLeadDeveloper
                  ? 'border-emerald-500/60 dark:border-emerald-600/60 ring-1 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {member.fullName}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {member.role}
                  </p>
                </div>
                <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  {member.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">Specialization:</strong>{' '}
                  {member.specialization}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  <strong className="text-slate-700 dark:text-slate-300">Task:</strong>{' '}
                  {member.assignedTasks}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>{member.phone}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(member)}
                    title="Edit Technical Staff Details"
                    className="p-1 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  {!member.isLeadDeveloper && isAdmin && (
                    <button
                      onClick={() => onDeleteStaff(member.id)}
                      title="Remove Technical Staff Member"
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Technical Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-emerald-800 via-blue-900 to-amber-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingStaffId ? 'Edit Technical Team Member (Wax Ka Beddel)' : 'Add Technical Team Member'}
                </h3>
                <p className="text-xs text-emerald-200">Cali Saleebaan, Kismayo Committee</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (Magaca) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Eng. Sharmaarke Maxamed"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Technical Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as TechRole })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    <option value="GIS & Land Surveyor">GIS & Land Surveyor</option>
                    <option value="Civil & Road Engineer">Civil & Road Engineer</option>
                    <option value="Water & Borehole Specialist">Water & Borehole Specialist</option>
                    <option value="Media & Video Hook Director">Media & Video Hook Director</option>
                    <option value="Finance & Audit Specialist">Finance & Audit Specialist</option>
                    <option value="App Developer & Systems Lead">Software Developer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (+252 / +254) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+252 61..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="engineer@kismayo-kulmis.org"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specialization / Degrees
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. GPS Cadastral Surveying & Satellite Mapping"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Project Tasks for Kulmis
                </label>
                <textarea
                  rows={2}
                  value={formData.assignedTasks}
                  onChange={(e) => setFormData({ ...formData, assignedTasks: e.target.value })}
                  placeholder="e.g. Demarcating Sector 3 boundaries and testing soil compaction"
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl shadow transition"
                >
                  {editingStaffId ? 'Save Changes' : 'Save Technical Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
