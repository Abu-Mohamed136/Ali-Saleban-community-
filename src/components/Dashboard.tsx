import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Video, 
  ArrowRight, 
  PlusCircle, 
  Download, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  FileText,
  FileCheck2,
  Award,
  Scale
} from 'lucide-react';
import { Member, ContentItem, VisitedLocation, CalendarEvent, TechnicalStaff } from '../types';
import { PdfService } from '../utils/pdfGenerator';
import { StorageService } from '../utils/storage';

interface DashboardProps {
  members: Member[];
  contentItems: ContentItem[];
  locations: VisitedLocation[];
  events: CalendarEvent[];
  technicalStaff: TechnicalStaff[];
  setActiveTab: (tab: string) => void;
  onOpenAddMember: () => void;
  onOpenAddContent: () => void;
  onOpenAddLocation: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  members,
  contentItems,
  locations,
  events,
  technicalStaff,
  setActiveTab,
  onOpenAddMember,
  onOpenAddContent,
  onOpenAddLocation,
}) => {
  const [selectedReceiptMemberId, setSelectedReceiptMemberId] = useState<string>(members[0]?.id || '');
  const totalCollected = members.reduce((acc, m) => acc + m.contributionAmount, 0);
  const totalPledged = members.reduce((acc, m) => acc + m.pledgedAmount, 0);
  const targetBudget = 50000; // Target for Phase 1 Kulmis Expansion
  const percentCollected = Math.min(100, Math.round((totalCollected / targetBudget) * 100));
  const plotsAllocated = members.filter((m) => m.villagePlotAssigned).length;

  const handleDownloadSelectedReceipt = () => {
    const mem = members.find((m) => m.id === selectedReceiptMemberId) || members[0];
    if (mem) {
      PdfService.downloadMemberReceiptPdf(mem);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/kulmis_village_expansion_1793026690983.jpg"
            alt="Kulmis Village Expansion"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-600/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kulmis Village 2026 Expansion Milestone</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            CALI SALEEBAAN, KISMAYO COMMITTEE
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Building the foundation of our new settlement <strong>KULMIS</strong>, near Kismayo. Track member registrations, see total funds collected in real-time, write viral video hooks, inspect surveyed GPS locations, and download official PDF documents.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddMember}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New Member</span>
            </button>

            <button
              onClick={() => PdfService.downloadMembersRosterPdf(members)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Members Ledger (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (4 Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Contributions Collected */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Total Funds Collected</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            ${totalCollected.toLocaleString()}
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Goal: ${targetBudget.toLocaleString()}</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{percentCollected}% achieved</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-600 to-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${percentCollected}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Registered Members */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Registered Members</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {members.length}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {plotsAllocated} assigned land plots in Kulmis
          </p>
          <button
            onClick={() => setActiveTab('members')}
            className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View member directory</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 3: Visited Locations Surveyed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">Locations Visited</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {locations.length}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            GPS mapped with Google Maps
          </p>
          <button
            onClick={() => setActiveTab('map')}
            className="mt-3 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Open satellite map</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Metric 4: Video Hooks & Posts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">Content & Hooks</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {contentItems.length}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {contentItems.filter((c) => c.status === 'Scheduled').length} scheduled for broadcast
          </p>
          <button
            onClick={() => setActiveTab('feed')}
            className="mt-3 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Follow committee posts</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* DEDICATED PDF DOCUMENTS DOWNLOAD CENTER (XARUNTA SOO DEJINTA DUKUMENTIYADA PDF) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-xl text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/40">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-800/60 text-emerald-200 px-3 py-0.5 rounded-full text-xs font-bold mb-1">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Official PDF Document Downloads (Soo Degso Dukumentiyada)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              Download Committee Records in Official PDF Format
            </h3>
            <p className="text-xs text-slate-300">
              Generate and download certified PDFs for printing, townhalls, banking proof, and offline records.
            </p>
          </div>
          <span className="text-xs text-emerald-300 font-mono">
            Certified by Developer: Adan Deeq (+252 61 157 1310)
          </span>
        </div>

        {/* Primary PDF Download Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {/* Doc 1: Members Roster & Contributions */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3 transition">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">1. Members & Ledger PDF</h4>
              <p className="text-[11px] text-slate-300">
                Full roster of {members.length} members with phone numbers, contribution amounts, and plot assignments.
              </p>
            </div>
            <button
              onClick={() => PdfService.downloadMembersRosterPdf(members)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Ledger PDF</span>
            </button>
          </div>

          {/* Doc 2: Kulmis Village Constitution & Laws */}
          <div className="bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 transition">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">2. Village Laws & Constitution</h4>
              <p className="text-[11px] text-emerald-200">
                Official 8 articles: 20x20m plots, water rights, anti-charcoal ban, elder council, and diaspora security.
              </p>
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => PdfService.downloadVillageConstitutionPdf(StorageService.getLaws())}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Constitution (PDF)</span>
              </button>
              <button
                onClick={() => setActiveTab('laws')}
                className="w-full bg-white/10 hover:bg-white/20 text-emerald-200 text-[11px] font-semibold py-1 px-2 rounded text-center transition"
              >
                Read & Vote on Laws →
              </button>
            </div>
          </div>

          {/* Doc 3: Kulmis Village Masterplan */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3 transition">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">3. Kulmis Masterplan PDF</h4>
              <p className="text-[11px] text-slate-300">
                Official village roadmap, deep solar borehole plans, 4.8km access road, and 350-plot cadastre.
              </p>
            </div>
            <button
              onClick={() => PdfService.downloadMasterplanPdf()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Masterplan PDF</span>
            </button>
          </div>

          {/* Doc 4: GPS Survey Report */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3 transition">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-amber-600/30 text-amber-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">4. GPS Survey Report PDF</h4>
              <p className="text-[11px] text-slate-300">
                {locations.length} visited coordinate points, water aquifer findings, soil suitability, and cadastre markers.
              </p>
            </div>
            <button
              onClick={() => PdfService.downloadGpsSurveyReportPdf(locations)}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download GPS Report PDF</span>
            </button>
          </div>

          {/* Doc 5: Individual Member Contribution Receipt */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3 transition">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-purple-600/30 text-purple-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">5. Member Receipt PDF</h4>
              <p className="text-[11px] text-slate-300">
                Official certified certificate of contribution & plot allocation with seal.
              </p>
              <select
                value={selectedReceiptMemberId}
                onChange={(e) => setSelectedReceiptMemberId(e.target.value)}
                className="w-full text-[11px] bg-slate-900 border border-white/20 text-white rounded p-1.5 mt-1 outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} (${m.contributionAmount})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleDownloadSelectedReceipt}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Receipt (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Section: Project Progress & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Kulmis Key Development Projects (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Kulmis Village Expansion Priorities</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live infrastructure milestones funded by member contributions</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
              Phase 1 Active
            </span>
          </div>

          <div className="space-y-3">
            {/* Project 1 */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Solar Deep Water Borehole #1 (120m)</h4>
                    <p className="text-[11px] text-slate-500">Drilling sweet drinking water for Kulmis settlement</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">$18,500 / $22,000</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            {/* Project 2 */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">14km Coastal Highway Access Road</h4>
                    <p className="text-[11px] text-slate-500">Grading arterial road connecting Kismayo port to Kulmis</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">$9,200 / $14,000</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Project 3 */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Cadastral Demarcation of 350 Plots</h4>
                    <p className="text-[11px] text-slate-500">Concrete boundary pillars & GPS coordinates register</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">$5,800 / $6,500</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '89%' }} />
              </div>
            </div>
          </div>

          {/* Committee Meeting Showcase */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <img
              src="/src/assets/images/committee_meeting_kismayo_1793026691049.jpg"
              alt="Committee Planning Meeting"
              className="w-full sm:w-44 h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-white">
                Elder Assembly & Technical Council Sessions
              </p>
              <p className="leading-relaxed">
                Bi-weekly physical meetings held at our Kismayo office and broadcast live to diaspora members in Minnesota, London, and Scandinavia.
              </p>
              <button
                onClick={() => setActiveTab('feed')}
                className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Follow Live Activities & Posts</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Technical Staff & Developer Spotlight (1 Col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Technical Staff Members</h3>
            <button
              onClick={() => setActiveTab('technical')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              View All ({technicalStaff.length})
            </button>
          </div>

          {/* Developer Card (Prominent) */}
          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-950 text-white rounded-xl p-4 border border-emerald-500/30 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lead App Developer</span>
            </div>
            <h4 className="text-sm font-extrabold text-white">Adan Deeq Abdirahman Issa</h4>
            <p className="text-xs text-slate-300">Technical Staff Member</p>
            <p className="text-[11px] font-mono text-emerald-300 font-semibold">
              Somalia: +252 61 157 1310 · Kenya: +254 722 123 678
            </p>
            <p className="text-[11px] text-emerald-200/80 leading-relaxed pt-1">
              Engineered the Cali Saleebaan offline ledger, WhatsApp APK distributor, and Google Maps GPS system.
            </p>
            <button
              onClick={() => setActiveTab('security')}
              className="mt-2 w-full bg-emerald-600/60 hover:bg-emerald-600 border border-emerald-400/40 text-white rounded-lg py-1.5 px-2 text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>Anti-Scam & Verified Accounts</span>
            </button>
          </div>

          {/* Other technical team snippets */}
          <div className="space-y-2">
            {technicalStaff.slice(1, 4).map((tech) => (
              <div key={tech.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{tech.fullName}</p>
                  <p className="text-[11px] text-slate-500">{tech.role}</p>
                </div>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                  {tech.status}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('technical')}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 rounded-xl transition"
          >
            Manage Technical Team
          </button>
        </div>
      </div>
    </div>
  );
};
