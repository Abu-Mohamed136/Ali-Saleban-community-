import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  PlusCircle, 
  Download, 
  FileText, 
  Phone, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Filter, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  Building,
  TrendingDown,
  TrendingUp,
  CreditCard,
  PieChart,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  UserCheck,
  UserX,
  Send,
  HelpCircle
} from 'lucide-react';
import { Member, MemberRole, ContributionStatus, PaymentMethod, ExpenseItem, ExpenseCategory } from '../types';
import { PdfService } from '../utils/pdfGenerator';
import { TRANSLATIONS } from '../utils/translations';

interface MembersLedgerProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  expenses?: ExpenseItem[];
  onAddExpense?: (expense: Omit<ExpenseItem, 'id'>) => void;
  onUpdateExpense?: (expense: ExpenseItem) => void;
  onDeleteExpense?: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  onResetSampleData?: () => void;
  onClearAllData?: () => void;
  language?: 'so' | 'en';
  isAdmin?: boolean;
}

export const MembersLedger: React.FC<MembersLedgerProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  expenses = [],
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  isAddModalOpen,
  setIsAddModalOpen,
  onResetSampleData,
  onClearAllData,
  language = 'so',
  isAdmin = true,
}) => {
  const t = TRANSLATIONS[language];

  // Active ledger view tab: 'roster' | 'expenses' | 'data-entry' | 'audit'
  const [activeLedgerTab, setActiveLedgerTab] = useState<'roster' | 'expenses' | 'data-entry'>('roster');

  // Search & Filters for Members
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Partial' | 'Pledged'>('All');

  // Search & Filter for Expenses
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<string>('All');

  // Modal States
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  
  // Quick Mark as Paid Modal State
  const [quickPayMember, setQuickPayMember] = useState<Member | null>(null);
  const [quickPayAmount, setQuickPayAmount] = useState<number>(0);
  const [quickPayMethod, setQuickPayMethod] = useState<PaymentMethod>('Hormuud EVC Plus');

  // Data Entry Center Tab inside tab 3
  const [dataEntryType, setDataEntryType] = useState<'member' | 'expense' | 'pledge-collection'>('member');

  // Member Form State
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    phone: '+252 61 ',
    role: 'Community Member' as MemberRole,
    subClanBranch: 'Cali Saleebaan',
    contributionAmount: 500,
    pledgedAmount: 500,
    status: 'Paid' as ContributionStatus,
    paymentMethod: 'Hormuud EVC Plus' as PaymentMethod,
    dateRegistered: new Date().toISOString().split('T')[0],
    villagePlotAssigned: true,
    plotNumber: 'KLM-SEC1-',
    notes: '',
  });

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    titleSo: '',
    category: 'Water & Borehole' as ExpenseCategory,
    amount: 500,
    date: new Date().toISOString().split('T')[0],
    paidTo: '',
    approvedBy: 'Ugaas Cabdiqaadir & Finance Committee',
    receiptNumber: `VCH-KLM-${Math.floor(Math.random() * 900) + 100}`,
    notes: '',
    status: 'Disbursed' as const,
  });

  // Pledge Collection Form State
  const [selectedPledgedMemberId, setSelectedPledgedMemberId] = useState('');
  const [pledgeCollectionAmount, setPledgeCollectionAmount] = useState(0);
  const [pledgeCollectionMethod, setPledgeCollectionMethod] = useState<PaymentMethod>('Hormuud EVC Plus');
  const [pledgeCollectionNote, setPledgeCollectionNote] = useState('');

  // Financial Computations
  const totalCollected = useMemo(() => {
    return members.reduce((sum, m) => sum + (m.contributionAmount || 0), 0);
  }, [members]);

  const totalPledged = useMemo(() => {
    return members.reduce((sum, m) => sum + (m.pledgedAmount || 0), 0);
  }, [members]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [expenses]);

  const remainingTreasury = totalCollected - totalSpent;
  const unpaidOutstanding = totalPledged > totalCollected ? totalPledged - totalCollected : 0;
  
  const paidCount = useMemo(() => members.filter(m => m.status === 'Paid').length, [members]);
  const partialCount = useMemo(() => members.filter(m => m.status === 'Partial').length, [members]);
  const unpaidCount = useMemo(() => members.filter(m => m.status === 'Pledged' || m.contributionAmount === 0).length, [members]);
  const collectionRate = totalPledged > 0 ? Math.round((totalCollected / totalPledged) * 100) : 100;

  // Filtered members list (Who paid vs who has not)
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery) ||
        (m.subClanBranch && m.subClanBranch.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.plotNumber && m.plotNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesStatus = true;
      if (statusFilter === 'Paid') matchesStatus = m.status === 'Paid';
      else if (statusFilter === 'Partial') matchesStatus = m.status === 'Partial';
      else if (statusFilter === 'Pledged') matchesStatus = m.status === 'Pledged' || m.contributionAmount === 0;

      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);

  // Filtered expenses list (Where money goes)
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        exp.title.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        exp.titleSo.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        exp.paidTo.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        exp.receiptNumber.toLowerCase().includes(expenseSearch.toLowerCase());

      const matchesCat = expenseCategoryFilter === 'All' || exp.category === expenseCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [expenses, expenseSearch, expenseCategoryFilter]);

  // Category breakdown for expenses
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses, totalSpent]);

  // Open Add Member
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      fullName: '',
      phone: '+252 61 ',
      role: 'Community Member',
      subClanBranch: 'Cali Saleebaan',
      contributionAmount: 500,
      pledgedAmount: 500,
      status: 'Paid',
      paymentMethod: 'Hormuud EVC Plus',
      dateRegistered: new Date().toISOString().split('T')[0],
      villagePlotAssigned: true,
      plotNumber: `KLM-SEC${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 800) + 100}`,
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Member
  const handleOpenEditMember = (m: Member) => {
    setEditingMember(m);
    setMemberForm({
      fullName: m.fullName,
      phone: m.phone,
      role: m.role,
      subClanBranch: m.subClanBranch || 'Cali Saleebaan',
      contributionAmount: m.contributionAmount,
      pledgedAmount: m.pledgedAmount,
      status: m.status,
      paymentMethod: m.paymentMethod,
      dateRegistered: m.dateRegistered,
      villagePlotAssigned: m.villagePlotAssigned,
      plotNumber: m.plotNumber || '',
      notes: m.notes || '',
    });
    setIsAddModalOpen(true);
  };

  // Submit Member Form
  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.fullName.trim() || !memberForm.phone.trim()) return;

    if (editingMember) {
      onUpdateMember({
        ...editingMember,
        ...memberForm,
      });
    } else {
      onAddMember(memberForm);
    }
    setIsAddModalOpen(false);
  };

  // Open Add Expense
  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setExpenseForm({
      title: '',
      titleSo: '',
      category: 'Water & Borehole',
      amount: 500,
      date: new Date().toISOString().split('T')[0],
      paidTo: '',
      approvedBy: 'Ugaas Cabdiqaadir & Finance Committee',
      receiptNumber: `VCH-KLM-${Math.floor(Math.random() * 900) + 100}`,
      notes: '',
      status: 'Disbursed',
    });
    setIsExpenseModalOpen(true);
  };

  // Open Edit Expense
  const handleOpenEditExpense = (exp: ExpenseItem) => {
    setEditingExpense(exp);
    setExpenseForm({
      title: exp.title,
      titleSo: exp.titleSo,
      category: exp.category,
      amount: exp.amount,
      date: exp.date,
      paidTo: exp.paidTo,
      approvedBy: exp.approvedBy,
      receiptNumber: exp.receiptNumber,
      notes: exp.notes || '',
      status: exp.status,
    });
    setIsExpenseModalOpen(true);
  };

  // Submit Expense Form
  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title.trim() && !expenseForm.titleSo.trim()) return;
    const finalTitle = expenseForm.title.trim() || expenseForm.titleSo.trim();
    const finalTitleSo = expenseForm.titleSo.trim() || expenseForm.title.trim();

    if (editingExpense) {
      if (onUpdateExpense) {
        onUpdateExpense({
          ...editingExpense,
          ...expenseForm,
          title: finalTitle,
          titleSo: finalTitleSo,
        });
      }
    } else {
      if (onAddExpense) {
        onAddExpense({
          ...expenseForm,
          title: finalTitle,
          titleSo: finalTitleSo,
        });
      }
    }
    setIsExpenseModalOpen(false);
  };

  // Quick Mark as Paid for Unpaid / Pledged Members
  const handleOpenQuickPay = (m: Member) => {
    setQuickPayMember(m);
    const balance = m.pledgedAmount > m.contributionAmount ? m.pledgedAmount - m.contributionAmount : m.pledgedAmount;
    setQuickPayAmount(balance > 0 ? balance : 500);
    setQuickPayMethod(m.paymentMethod || 'Hormuud EVC Plus');
  };

  const handleConfirmQuickPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPayMember) return;
    const newTotal = (quickPayMember.contributionAmount || 0) + Number(quickPayAmount);
    const newStatus: ContributionStatus = newTotal >= quickPayMember.pledgedAmount ? 'Paid' : 'Partial';

    onUpdateMember({
      ...quickPayMember,
      contributionAmount: newTotal,
      status: newStatus,
      paymentMethod: quickPayMethod,
    });
    setQuickPayMember(null);
  };

  // Quick Collect Pledge inside Data Entry Hub
  const handlePledgeMemberSelect = (id: string) => {
    setSelectedPledgedMemberId(id);
    const m = members.find(mem => mem.id === id);
    if (m) {
      const balance = m.pledgedAmount > m.contributionAmount ? m.pledgedAmount - m.contributionAmount : m.pledgedAmount;
      setPledgeCollectionAmount(balance > 0 ? balance : 0);
      setPledgeCollectionMethod(m.paymentMethod || 'Hormuud EVC Plus');
    }
  };

  const handleCollectPledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = members.find(mem => mem.id === selectedPledgedMemberId);
    if (!m) return;
    const newContribution = (m.contributionAmount || 0) + Number(pledgeCollectionAmount);
    const newStatus: ContributionStatus = newContribution >= m.pledgedAmount ? 'Paid' : 'Partial';

    onUpdateMember({
      ...m,
      contributionAmount: newContribution,
      status: newStatus,
      paymentMethod: pledgeCollectionMethod,
      notes: pledgeCollectionNote ? `${m.notes || ''} | ${pledgeCollectionNote}` : m.notes,
    });

    alert(language === 'so' ? `Lacagta $${pledgeCollectionAmount} si guul leh ayaa loogu qoray ${m.fullName}!` : `Successfully recorded $${pledgeCollectionAmount} for ${m.fullName}!`);
    setSelectedPledgedMemberId('');
    setPledgeCollectionAmount(0);
    setPledgeCollectionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Member Registration & Contributions Collected Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-amber-950 text-white rounded-2xl p-6 shadow-md border border-emerald-700/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-800/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-2 border border-emerald-500/30">
              <Building className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'so' ? 'Diiwaanka Maaliyadda & Xubnaha Kulmis' : 'Official Registry, Treasury & Project Disbursements'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'so' ? 'Diiwaanka Lacag-ururinta & Meesha Lacagtu Martay' : 'Kulmis Financial Ledger & Expenditures'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {language === 'so'
                ? 'Halkan kala soco xubnaha diiwaangashan, cidda bixisay iyo cidda aan bixin, wadarta lacagta la ururiyay, iyo meesha tooska ah ee lacagtu martay sida qodista ceelka, jidka 14km, iyo xarunta deegaanka.'
                : 'Complete community ledger: member registrations, who has paid vs who has not, total funds collected, and full itemized accounting of where funds are disbursed.'}
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveLedgerTab('data-entry')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.dataEntryHubBtn}</span>
            </button>

            <button
              onClick={() => PdfService.downloadFinancialAuditReportPdf(members, expenses)}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition border border-white/20"
              title="Download Full Balance Sheet PDF"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.downloadAuditPdfBtn}</span>
            </button>

            <button
              onClick={() => PdfService.downloadMembersRosterPdf(members)}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition border border-white/20"
              title="Download Member Roster PDF"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'so' ? 'Liiska Xubnaha (PDF)' : 'Members PDF'}</span>
            </button>
          </div>
        </div>

        {/* Developer Identification Banner Bottom */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-100">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.devTitle} <strong>Adan Deeq Abdirahman Issa</strong></span>
            <span className="font-mono text-emerald-300 font-bold ml-1">+252 61 157 1310 / +254 722 123 678</span>
          </div>

          <a
            href={`https://wa.me/252611571310?text=${encodeURIComponent(
              `*CALI SALEEBAAN COMMITTEE FINANCIAL AUDIT SYNC*\n\n` +
              `Salam Developer Adan Deeq,\n` +
              `Here is the latest financial ledger update for Kulmis Village:\n` +
              `• Total Members: ${members.length} (${paidCount} Paid, ${partialCount} Partial, ${unpaidCount} Not Paid)\n` +
              `• Total Funds Collected: $${totalCollected.toLocaleString()} USD\n` +
              `• Total Disbursed (Where Money Went): $${totalSpent.toLocaleString()} USD\n` +
              `• Net Treasury Balance: $${remainingTreasury.toLocaleString()} USD\n` +
              `• Outstanding Pledges: $${unpaidOutstanding.toLocaleString()} USD\n\n` +
              `Audited and verified in app.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition"
          >
            <Send className="w-3 h-3" />
            <span>{t.informDevBtn}</span>
          </a>
        </div>
      </div>

      {/* 4 HIGH-VISIBILITY FINANCIAL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Collected */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/70 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <span>{t.totalCollectedInApp}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            ${totalCollected.toLocaleString()} <span className="text-xs font-sans font-medium text-slate-500">USD</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>{collectionRate}% {language === 'so' ? 'la bixiyay' : 'collected'}</span>
            <span>{members.length} {t.membersCount}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, collectionRate)}%` }} />
          </div>
        </div>

        {/* Card 2: Where The Money Goes (Total Spent) */}
        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/70 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-1">
            <span>{t.totalDisbursed}</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            ${totalSpent.toLocaleString()} <span className="text-xs font-sans font-medium text-slate-500">USD</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>{expenses.length} {language === 'so' ? 'mashaariic' : 'disbursements'}</span>
            <button onClick={() => setActiveLedgerTab('expenses')} className="text-rose-600 dark:text-rose-400 font-bold hover:underline">
              {language === 'so' ? 'Eeg meesha ay martay →' : 'See breakdown →'}
            </button>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${totalCollected > 0 ? Math.min(100, Math.round((totalSpent / totalCollected) * 100)) : 0}%` }} />
          </div>
        </div>

        {/* Card 3: Net Treasury Balance */}
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/70 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">
            <span>{t.treasuryReserve}</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            ${remainingTreasury.toLocaleString()} <span className="text-xs font-sans font-medium text-slate-500">USD</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>{language === 'so' ? 'Kaydka hadda yaalla' : 'Available safe balance'}</span>
            <span className="text-emerald-600 font-bold">{remainingTreasury >= 0 ? '✓ Balanced' : '⚠️ Deficit'}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${totalCollected > 0 ? Math.max(0, Math.min(100, Math.round((remainingTreasury / totalCollected) * 100))) : 0}%` }} />
          </div>
        </div>

        {/* Card 4: Unpaid / Outstanding Pledges */}
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/70 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
            <span>{t.unpaidOutstanding}</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
            ${unpaidOutstanding.toLocaleString()} <span className="text-xs font-sans font-medium text-slate-500">USD</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>{unpaidCount + partialCount} {language === 'so' ? 'xubnood baa qabyo ah' : 'unpaid / partial'}</span>
            <button onClick={() => { setActiveLedgerTab('roster'); setStatusFilter('Pledged'); }} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
              {language === 'so' ? 'Yaa aan bixin? →' : 'Who did not pay? →'}
            </button>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${totalPledged > 0 ? Math.min(100, Math.round((unpaidOutstanding / totalPledged) * 100)) : 0}%` }} />
          </div>
        </div>
      </div>

      {/* THREE MAIN NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveLedgerTab('roster')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeLedgerTab === 'roster'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.tabRoster}</span>
          <span className="bg-black/20 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
            {members.length}
          </span>
        </button>

        <button
          onClick={() => setActiveLedgerTab('expenses')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeLedgerTab === 'expenses'
              ? 'bg-rose-700 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>{t.tabExpenses}</span>
          <span className="bg-black/20 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
            ${totalSpent.toLocaleString()}
          </span>
        </button>

        <button
          onClick={() => setActiveLedgerTab('data-entry')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeLedgerTab === 'data-entry'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.dataEntryHubBtn}</span>
          <span className="bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded text-[9px] uppercase">
            New
          </span>
        </button>
      </div>

      {/* SAMPLE NOTICE & EDIT BANNER */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              {t.sampleNoticeTitle}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              {t.sampleNoticeDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onResetSampleData && (
            <button
              onClick={onResetSampleData}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
            >
              {t.resetSamples}
            </button>
          )}
          {onClearAllData && (
            <button
              onClick={() => {
                if (confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto dhammaan xogta si aad ugu bilowdo mid faaruq ah?' : 'Clear all sample members to start with an empty table?')) {
                  onClearAllData();
                }
              }}
              className="px-3 py-1.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 hover:bg-red-100 rounded-lg text-red-700 dark:text-red-300 text-xs font-semibold transition"
            >
              {t.clearAllData}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MEMBERS ROSTER & WHO PAID VS WHO HAS NOT                            */}
      {/* ========================================================================= */}
      {activeLedgerTab === 'roster' && (
        <div className="space-y-4">
          {/* Sub-header & Filter Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* WHO PAID VS WHO HAS NOT FILTER BUTTONS */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl shrink-0 overflow-x-auto">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  statusFilter === 'All'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.filterAll} ({members.length})
              </button>

              <button
                onClick={() => setStatusFilter('Paid')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  statusFilter === 'Paid'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800'
                }`}
              >
                <CheckCircle className="w-3 h-3" />
                <span>{t.filterWhoPaid} ({paidCount})</span>
              </button>

              <button
                onClick={() => setStatusFilter('Partial')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  statusFilter === 'Partial'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>{t.filterPartialPaid} ({partialCount})</span>
              </button>

              <button
                onClick={() => setStatusFilter('Pledged')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  statusFilter === 'Pledged'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800'
                }`}
              >
                <AlertCircle className="w-3 h-3" />
                <span>{t.filterWhoNotPaid} ({unpaidCount})</span>
              </button>
            </div>
          </div>

          {/* Members Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">{t.colName}</th>
                    <th className="py-3.5 px-4">{t.colPhone}</th>
                    <th className="py-3.5 px-4">{t.colRole}</th>
                    <th className="py-3.5 px-4 text-right">{t.colAmount}</th>
                    <th className="py-3.5 px-4">{t.colStatus}</th>
                    <th className="py-3.5 px-4">{t.colPlot}</th>
                    <th className="py-3.5 px-4 text-center">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-semibold">{language === 'so' ? 'Lama helin xubno ku habboon baaritaankaaga.' : 'No members match your search criteria.'}</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => {
                      const isUnpaid = m.status === 'Pledged' || m.contributionAmount === 0;
                      const isPartial = m.status === 'Partial';
                      const owesMoney = isUnpaid || isPartial;
                      const balanceOwed = m.pledgedAmount > m.contributionAmount ? m.pledgedAmount - m.contributionAmount : 0;

                      return (
                        <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                          {/* Name & ID */}
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{m.fullName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {m.id} · {m.dateRegistered}</span>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="font-semibold">{m.phone}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{m.paymentMethod}</span>
                          </td>

                          {/* Role & Clan */}
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{m.role}</span>
                              <span className="text-[10px] text-slate-400">{m.subClanBranch || 'Cali Saleebaan'}</span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                            <div className="text-sm text-emerald-700 dark:text-emerald-400 font-black">${m.contributionAmount.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {language === 'so' ? 'Ballanqaad' : 'Pledged'}: ${m.pledgedAmount.toLocaleString()}
                              {balanceOwed > 0 && (
                                <span className="text-red-500 font-bold ml-1">(-${balanceOwed})</span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            {m.status === 'Paid' ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>{language === 'so' ? 'La Bixiyay' : 'Paid in Full'}</span>
                              </span>
                            ) : m.status === 'Partial' ? (
                              <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>{language === 'so' ? 'Qabyo' : 'Partial'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700 px-2.5 py-1 rounded-full font-bold text-[11px]">
                                <AlertCircle className="w-3 h-3 text-red-600" />
                                <span>{language === 'so' ? 'Ma Bixin' : 'Not Paid'}</span>
                              </span>
                            )}
                          </td>

                          {/* Plot */}
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                            {m.villagePlotAssigned ? (
                              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                                {m.plotNumber || 'Demarcated'}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">
                                {language === 'so' ? 'Wali lama siin' : 'Pending'}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                              {/* Quick Mark as Paid Button if owes money */}
                              {owesMoney && (
                                <button
                                  onClick={() => handleOpenQuickPay(m)}
                                  title={language === 'so' ? 'Calaamadee inuu bixiyay lacagta' : 'Mark as paid'}
                                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg text-[11px] font-bold transition shadow-xs"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{t.markAsPaidBtn}</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleOpenEditMember(m)}
                                title={t.editBtn}
                                className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-1 rounded-lg text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>{t.editBtn}</span>
                              </button>

                              <button
                                onClick={() => PdfService.downloadMemberReceiptPdf(m)}
                                title={t.pdfBtn}
                                className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded-lg text-[11px] font-bold hover:bg-slate-200 transition"
                              >
                                <FileText className="w-3 h-3 text-emerald-600" />
                                <span>PDF</span>
                              </button>

                              <button
                                onClick={() => onDeleteMember(m.id)}
                                title="Delete"
                                className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing <strong className="text-slate-800 dark:text-slate-200">{filteredMembers.length}</strong> of {members.length} registered members
                ({paidCount} Paid · {partialCount} Partial · {unpaidCount} Not Paid)
              </div>
              <div className="flex items-center gap-4 font-mono font-semibold">
                <span>Collected: <strong className="text-emerald-600 dark:text-emerald-400">${totalCollected.toLocaleString()}</strong></span>
                <span>Pledged: <strong className="text-amber-600 dark:text-amber-400">${totalPledged.toLocaleString()}</strong></span>
                <span>Plots: <strong className="text-blue-600 dark:text-blue-400">{members.filter(m => m.villagePlotAssigned).length}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WHERE THE MONEY GOES (PROJECT EXPENDITURES & DISBURSEMENTS)         */}
      {/* ========================================================================= */}
      {activeLedgerTab === 'expenses' && (
        <div className="space-y-5">
          {/* Expenses Overview Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-rose-600" />
                  <span>{language === 'so' ? 'Meesha Lacagtu Martay (Kharashaadka Mashruuca Kulmis)' : 'Where The Money Goes: Project Expenditures'}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  {language === 'so'
                    ? 'Liiskan wuxuu si hufan u muujinayaa shilinkasta oo laga saaray khasnadda guddiga, shirkadaha la siiyay, rasiidhada, iyo odayaasha saxiixay.'
                    : 'Transparent ledger of every community disbursement: contractor names, voucher numbers, approved authority, and category breakdown.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleOpenAddExpense}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow flex items-center gap-2 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.recordExpenseBtn}</span>
                </button>
              </div>
            </div>

            {/* Category Distribution Bars */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                {language === 'so' ? 'Qaybaha Lacagtu Ku Baxday (Project Breakdown)' : 'Category Allocation'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categoryBreakdown.map((item) => (
                  <div key={item.category} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-800 dark:text-slate-200 truncate">{item.category}</span>
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400">${item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>{item.percentage}% of total spent</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expense Search & Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={expenseSearch}
                onChange={(e) => setExpenseSearch(e.target.value)}
                placeholder={language === 'so' ? 'Raadi kharash, shirkad, foojar...' : 'Search expense title, contractor, voucher...'}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={expenseCategoryFilter}
                onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="All">{language === 'so' ? 'Dhammaan Qaybaha' : 'All Categories'}</option>
                <option value="Water & Borehole">Water & Borehole (Ceelka Biyaha)</option>
                <option value="Road Clearing & Grading">Road Clearing & Grading (Waddada)</option>
                <option value="Land Survey & Demarcation">Land Survey & Demarcation (Dhulka)</option>
                <option value="Town Hall & Shelter">Town Hall & Shelter (Xarunta)</option>
                <option value="Elder Arbitration & Meetings">Elder Arbitration (Odayaasha)</option>
                <option value="Solar Street Lighting">Solar Street Lighting (Nalalka)</option>
                <option value="Admin & Technology">Admin & Technology (Farsamada)</option>
              </select>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">{language === 'so' ? 'Taariikhda & Foojarka' : 'Date & Voucher'}</th>
                    <th className="py-3.5 px-4">{language === 'so' ? 'Mashruuca / Ujeeddada' : 'Project / Purpose'}</th>
                    <th className="py-3.5 px-4">{language === 'so' ? 'Qaybta' : 'Category'}</th>
                    <th className="py-3.5 px-4">{language === 'so' ? 'Shirkadda / Qofka La Siiyay' : 'Paid To (Contractor)'}</th>
                    <th className="py-3.5 px-4">{language === 'so' ? 'Saxiixaha' : 'Approved By'}</th>
                    <th className="py-3.5 px-4 text-right">{language === 'so' ? 'Lacagta ($)' : 'Amount ($)'}</th>
                    <th className="py-3.5 px-4 text-center">{language === 'so' ? 'Ficillo' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        {language === 'so' ? 'Wax kharash ah lama helin.' : 'No expenses recorded yet.'}
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                        {/* Date & Voucher */}
                        <td className="py-3 px-4 font-mono">
                          <div className="font-bold text-slate-900 dark:text-white">{exp.date}</div>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
                            {exp.receiptNumber}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {language === 'so' ? exp.titleSo : exp.title}
                          </div>
                          {exp.notes && (
                            <p className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">{exp.notes}</p>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="inline-block bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            {exp.category}
                          </span>
                        </td>

                        {/* Paid To */}
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          <div className="font-medium">{exp.paidTo}</div>
                        </td>

                        {/* Approved By */}
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          <div className="text-[11px]">{exp.approvedBy}</div>
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-4 text-right font-mono font-black text-rose-600 dark:text-rose-400 text-sm tabular-nums">
                          ${exp.amount.toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditExpense(exp)}
                              title="Edit Expense"
                              className="p-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 text-xs transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {onDeleteExpense && (
                              <button
                                onClick={() => onDeleteExpense(exp.id)}
                                title="Delete Expense"
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Expense Footer */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                {filteredExpenses.length} {language === 'so' ? 'kharash oo diiwaangashan' : 'disbursement records'}
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {language === 'so' ? 'Wadarta Kharashka:' : 'Total Disbursed:'} <strong className="text-rose-600">${totalSpent.toLocaleString()} USD</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: QUICK DATA ENTRY HUB                                               */}
      {/* ========================================================================= */}
      {activeLedgerTab === 'data-entry' && (
        <div className="space-y-6">
          {/* Sub-selector for data entry mode */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>{language === 'so' ? 'Xarunta Gelinta Xogta Cusub (Fast Data Entry Center)' : 'Quick Data Entry Center'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDataEntryType('member')}
                className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                  dataEntryType === 'member'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">{language === 'so' ? '1. Xubin & Lacag Cusub' : '1. New Member & Contribution'}</h4>
                  <p className="text-[11px] text-slate-500">{language === 'so' ? 'Diiwaangeli qof iyo booskiisa' : 'Register member & assign plot'}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDataEntryType('expense')}
                className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                  dataEntryType === 'expense'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">{language === 'so' ? '2. Kharashka Mashruuca' : '2. Record Project Expense'}</h4>
                  <p className="text-[11px] text-slate-500">{language === 'so' ? 'Meesha lacagtu martay' : 'Where money was disbursed'}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDataEntryType('pledge-collection')}
                className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                  dataEntryType === 'pledge-collection'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">{language === 'so' ? '3. Qaadashada Ballanqaad' : '3. Collect Member Pledge'}</h4>
                  <p className="text-[11px] text-slate-500">{language === 'so' ? 'Qof hore u ballanqaaday bixi' : 'Mark pledged member paid'}</p>
                </div>
              </button>
            </div>
          </div>

          {/* MODE 1: MEMBER & PAYMENT REGISTRATION FORM */}
          {dataEntryType === 'member' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>{language === 'so' ? 'Diiwaangelinta Xubinta Cusub & Lacagta Bixinta' : 'Register New Member & Payment'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'so' ? 'Gali magaca, taleefanka EVC/Zaad, jilibka, iyo lacagta la bixiyay.' : 'Record verified name, mobile money number, clan branch, and contribution.'}
                </p>
              </div>

              <form onSubmit={handleSubmitMember} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Magaca oo Dhammaystiran *' : 'Full Member Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.fullName}
                      onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                      placeholder="e.g. Cabdiqaadir Maxamed Shire"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Taleefanka (EVC Plus / Zaad) *' : 'Phone Number (EVC / Zaad) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.phone}
                      onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                      placeholder="+252 61 555 1234"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Jilibka / Laanta Cali Saleebaan' : 'Sub-Clan / Branch'}
                    </label>
                    <input
                      type="text"
                      value={memberForm.subClanBranch}
                      onChange={(e) => setMemberForm({ ...memberForm, subClanBranch: e.target.value })}
                      placeholder="e.g. Cali Saleebaan - Reer Maxamed"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Xilka Guddiga' : 'Role / Position'}
                    </label>
                    <select
                      value={memberForm.role}
                      onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value as MemberRole })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    >
                      <option value="Community Member">Community Member (Xubin)</option>
                      <option value="Committee Elder">Committee Elder (Oday Dhaqan)</option>
                      <option value="Executive Chairman">Executive Chairman (Guddoomiye)</option>
                      <option value="Vice Chairman">Vice Chairman (Guddoomiye Kuxigeen)</option>
                      <option value="Treasurer & Finance">Treasurer & Finance (Xisaabiye)</option>
                      <option value="General Secretary">General Secretary (Xoghayaha Guud)</option>
                      <option value="Youth Representative">Youth Representative (Dhallinyaro)</option>
                      <option value="Diaspora Coordinator">Diaspora Coordinator (Jaaliyadaha)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Lacagta La Bixiyay Hadda ($ USD) *' : 'Contribution Amount Paid ($ USD) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={memberForm.contributionAmount}
                      onChange={(e) => setMemberForm({ ...memberForm, contributionAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Wadarta Ballanqaadka ($ USD) *' : 'Total Pledged Target ($ USD) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={memberForm.pledgedAmount}
                      onChange={(e) => setMemberForm({ ...memberForm, pledgedAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Habka Lacag-bixinta' : 'Payment Method'}
                    </label>
                    <select
                      value={memberForm.paymentMethod}
                      onChange={(e) => setMemberForm({ ...memberForm, paymentMethod: e.target.value as PaymentMethod })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    >
                      <option value="Hormuud EVC Plus">Hormuud EVC Plus (Somalia)</option>
                      <option value="Telesom Zaad">Telesom Zaad</option>
                      <option value="e-Dahab">e-Dahab (Dahabshiil)</option>
                      <option value="Bank Transfer (IBS/Premier)">Bank Transfer (IBS / Premier Bank)</option>
                      <option value="Cash in Hand">Cash in Hand (Lacag Gacanta)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Booska Kulmis Loo Qoondeeyay' : 'Kulmis Land Plot Number'}
                    </label>
                    <input
                      type="text"
                      value={memberForm.plotNumber}
                      onChange={(e) => setMemberForm({ ...memberForm, plotNumber: e.target.value })}
                      placeholder="KLM-SEC1-042"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'so' ? 'Faahfaahin / Qoraal Dheeraad ah' : 'Notes / Additional Information'}
                  </label>
                  <textarea
                    rows={2}
                    value={memberForm.notes}
                    onChange={(e) => setMemberForm({ ...memberForm, notes: e.target.value })}
                    placeholder="e.g. Paid in full for solar borehole project and boundary survey pegging."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow transition flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'so' ? 'Keydi Xubinta & Lacagta' : 'Save Member & Contribution'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODE 2: PROJECT EXPENDITURE / DISBURSEMENT REGISTRATION FORM */}
          {dataEntryType === 'expense' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-rose-600" />
                  <span>{language === 'so' ? 'Diiwaangelinta Kharashka / Meesha Lacagtu Martay' : 'Record Project Expense / Disbursement'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'so' ? 'Qor kharashka cusub ee ku baxay ceelka, waddada, shirkadda la siiyay, iyo odayaasha saxiixay.' : 'Record new disbursements for community infrastructure projects with contractor and voucher.'}
                </p>
              </div>

              <form onSubmit={handleSubmitExpense} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Cinwaanka Kharashka (Af-Soomaali) *' : 'Expense Title (Somali) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={expenseForm.titleSo}
                      onChange={(e) => setExpenseForm({ ...expenseForm, titleSo: e.target.value })}
                      placeholder="e.g. Qodista Ceelka Biyaha Wajiga 2aad"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Cinwaanka (English)' : 'Expense Title (English)'}
                    </label>
                    <input
                      type="text"
                      value={expenseForm.title}
                      onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                      placeholder="e.g. Solar Deep Borehole Phase 2 Drilling"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Qaybta Mashruuca *' : 'Project Category *'}
                    </label>
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as ExpenseCategory })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    >
                      <option value="Water & Borehole">Water & Borehole (Ceelka Biyaha)</option>
                      <option value="Road Clearing & Grading">Road Clearing & Grading (Waddada 14km)</option>
                      <option value="Land Survey & Demarcation">Land Survey & Demarcation (Sahanka Dhulka)</option>
                      <option value="Town Hall & Shelter">Town Hall & Shelter (Xarunta Odayaasha)</option>
                      <option value="Elder Arbitration & Meetings">Elder Arbitration & Meetings (Dhaqanka & Xuduudaha)</option>
                      <option value="Solar Street Lighting">Solar Street Lighting (Nalalka Cadceedda)</option>
                      <option value="Security & Protection">Security & Protection (Ilaalada & Amniga)</option>
                      <option value="Admin & Technology">Admin & Technology (Farsamada & Software)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Lacagta La Bixiyay ($ USD) *' : 'Amount Disbursed ($ USD) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Shirkadda / Qofka La Siiyay *' : 'Paid To (Contractor / Vendor) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={expenseForm.paidTo}
                      onChange={(e) => setExpenseForm({ ...expenseForm, paidTo: e.target.value })}
                      placeholder="e.g. Jubaland Deep Drilling Co."
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Mas’uulka Saxiixay *' : 'Approved By *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={expenseForm.approvedBy}
                      onChange={(e) => setExpenseForm({ ...expenseForm, approvedBy: e.target.value })}
                      placeholder="e.g. Ugaas Cabdiqaadir & Finance Committee"
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Lambarka Foojarka / Rasiidka *' : 'Voucher / Receipt Ref # *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={expenseForm.receiptNumber}
                      onChange={(e) => setExpenseForm({ ...expenseForm, receiptNumber: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Taariikhda La Bixiyay *' : 'Date Disbursed *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'so' ? 'Faahfaahin ku saabsan Shaqada La Qabtay' : 'Expense Notes / Work Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={expenseForm.notes}
                    onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                    placeholder="e.g. Steel pipes delivery and rig mobilization on site at central Kulmis."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-6 py-2.5 rounded-xl shadow transition flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'so' ? 'Keydi Kharashka Cusub' : 'Save New Project Expense'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODE 3: COLLECT PLEDGE FROM EXISTING MEMBER */}
          {dataEntryType === 'pledge-collection' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span>{language === 'so' ? 'Qaadashada & Diiwaangelinta Lacagta Ballanqaadka' : 'Collect Member Pledge & Update Status'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'so' ? 'Dooro xubin hore u ballanqaadday oo hadda bixisay lacagtiisa si aad u beddesho xaaladdeeda oo loogu calaamadeeyo Bixiyay.' : 'Select an unpaid or partial member from the list who just paid their contribution.'}
                </p>
              </div>

              <form onSubmit={handleCollectPledgeSubmit} className="space-y-4 text-xs max-w-xl">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'so' ? 'Dooro Xubinta Bixinaysa *' : 'Select Pledged Member *'}
                  </label>
                  <select
                    required
                    value={selectedPledgedMemberId}
                    onChange={(e) => handlePledgeMemberSelect(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="">{language === 'so' ? '-- Dooro Xubin Liiska ku jirta --' : '-- Select Member --'}</option>
                    {members.map((m) => {
                      const balance = m.pledgedAmount > m.contributionAmount ? m.pledgedAmount - m.contributionAmount : 0;
                      return (
                        <option key={m.id} value={m.id}>
                          {m.fullName} ({m.phone}) — {m.status}: Paid ${m.contributionAmount} / Pledged ${m.pledgedAmount} {balance > 0 ? `[Owes $${balance}]` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedPledgedMemberId && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-xs">
                    <p className="font-bold text-amber-900 dark:text-amber-200">
                      {language === 'so' ? 'Xogta Xubinta La Doortay:' : 'Selected Member Details:'}
                    </p>
                    {(() => {
                      const m = members.find(mem => mem.id === selectedPledgedMemberId);
                      if (!m) return null;
                      const balance = m.pledgedAmount > m.contributionAmount ? m.pledgedAmount - m.contributionAmount : 0;
                      return (
                        <div className="mt-1 space-y-1 text-slate-700 dark:text-slate-300">
                          <div><strong>Magaca:</strong> {m.fullName} | <strong>Taleefanka:</strong> {m.phone}</div>
                          <div><strong>Xaaladda:</strong> {m.status} | <strong>Hadda Bixiyay:</strong> ${m.contributionAmount} | <strong>Ballanqaad:</strong> ${m.pledgedAmount}</div>
                          {balance > 0 ? (
                            <div className="text-red-600 font-bold">Lacagta ka dhiman: ${balance} USD</div>
                          ) : (
                            <div className="text-emerald-600 font-bold">Wuu wada bixiyay ballanqaadkiisa, laakiin tabarucaad dheeraad ah waa loo dari karaa!</div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Lacagta Hadda Laga Qabtay ($ USD) *' : 'Amount Received Now ($ USD) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={pledgeCollectionAmount}
                      onChange={(e) => setPledgeCollectionAmount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'so' ? 'Habka Lacagta loo Bixiyay *' : 'Payment Method *'}
                    </label>
                    <select
                      value={pledgeCollectionMethod}
                      onChange={(e) => setPledgeCollectionMethod(e.target.value as PaymentMethod)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                    >
                      <option value="Hormuud EVC Plus">Hormuud EVC Plus (Somalia)</option>
                      <option value="Telesom Zaad">Telesom Zaad</option>
                      <option value="e-Dahab">e-Dahab (Dahabshiil)</option>
                      <option value="Bank Transfer (IBS/Premier)">Bank Transfer (IBS / Premier Bank)</option>
                      <option value="Cash in Hand">Cash in Hand (Lacag Gacanta)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'so' ? 'Qoraal Dheeraad ah (Tixraac/Foojar)' : 'Payment Reference / Note'}
                  </label>
                  <input
                    type="text"
                    value={pledgeCollectionNote}
                    onChange={(e) => setPledgeCollectionNote(e.target.value)}
                    placeholder="e.g. EVC Ref: TXN-894102 received on Oct 26"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!selectedPledgedMemberId || pledgeCollectionAmount <= 0}
                    className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl shadow transition flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'so' ? 'Xaqiiji Qaadashada & Cusboonaysii Xaaladda' : 'Confirm Payment & Update Status'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT MEMBER MODAL                                           */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-emerald-800 via-blue-900 to-amber-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingMember ? (language === 'so' ? 'Wax Ka Beddel Xogta Xubinta' : 'Edit Member Information') : (language === 'so' ? 'Diiwaangeli Xubin Cusub' : 'Register New Member')}
                </h3>
                <p className="text-xs text-emerald-200">
                  Cali Saleebaan, Kismayo Committee · Kulmis Village
                </p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMember} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (Magaca oo Dhammaystiran) *
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.fullName}
                  onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                  placeholder="e.g. Cabdiqaadir Maxamed Shire"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone (Taleefanka EVC/Zaad) *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    placeholder="+252 61 555 1234"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sub-Clan (Jilibka)
                  </label>
                  <input
                    type="text"
                    value={memberForm.subClanBranch}
                    onChange={(e) => setMemberForm({ ...memberForm, subClanBranch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role in Committee (Xilka)
                  </label>
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value as MemberRole })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Community Member">Community Member</option>
                    <option value="Committee Elder">Committee Elder</option>
                    <option value="Executive Chairman">Executive Chairman</option>
                    <option value="Vice Chairman">Vice Chairman</option>
                    <option value="Treasurer & Finance">Treasurer & Finance</option>
                    <option value="General Secretary">General Secretary</option>
                    <option value="Youth Representative">Youth Representative</option>
                    <option value="Diaspora Coordinator">Diaspora Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method (Habka Lacagta)
                  </label>
                  <select
                    value={memberForm.paymentMethod}
                    onChange={(e) => setMemberForm({ ...memberForm, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Hormuud EVC Plus">Hormuud EVC Plus</option>
                    <option value="Telesom Zaad">Telesom Zaad</option>
                    <option value="e-Dahab">e-Dahab</option>
                    <option value="Bank Transfer (IBS/Premier)">Bank Transfer (IBS/Premier)</option>
                    <option value="Cash in Hand">Cash in Hand</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Paid ($ USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={memberForm.contributionAmount}
                    onChange={(e) => setMemberForm({ ...memberForm, contributionAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pledged ($ USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={memberForm.pledgedAmount}
                    onChange={(e) => setMemberForm({ ...memberForm, pledgedAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status (Xaaladda)
                  </label>
                  <select
                    value={memberForm.status}
                    onChange={(e) => setMemberForm({ ...memberForm, status: e.target.value as ContributionStatus })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Paid">Paid (La Bixiyay)</option>
                    <option value="Partial">Partial (Qabyo)</option>
                    <option value="Pledged">Pledged (Ballanqaad)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kulmis Plot Number (Booska)
                  </label>
                  <input
                    type="text"
                    value={memberForm.plotNumber}
                    onChange={(e) => setMemberForm({ ...memberForm, plotNumber: e.target.value })}
                    placeholder="KLM-SEC1-001"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date Registered
                  </label>
                  <input
                    type="date"
                    value={memberForm.dateRegistered}
                    onChange={(e) => setMemberForm({ ...memberForm, dateRegistered: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes (Xusuusin)
                </label>
                <textarea
                  rows={2}
                  value={memberForm.notes}
                  onChange={(e) => setMemberForm({ ...memberForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMember ? t.save : t.registerMemberBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT EXPENSE MODAL                                          */}
      {/* ========================================================================= */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-rose-800 via-slate-900 to-amber-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingExpense ? (language === 'so' ? 'Wax Ka Beddel Kharashka' : 'Edit Project Expense') : (language === 'so' ? 'Geli Kharash Cusub' : 'Record Project Expense')}
                </h3>
                <p className="text-xs text-rose-200">
                  {language === 'so' ? 'Meesha Lacagtu Martay · Kulmis Village' : 'Kulmis Village Project Disbursement'}
                </p>
              </div>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitExpense} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expense Title in Somali (Cinwaanka Af-Soomaaliga) *
                </label>
                <input
                  type="text"
                  required
                  value={expenseForm.titleSo}
                  onChange={(e) => setExpenseForm({ ...expenseForm, titleSo: e.target.value })}
                  placeholder="e.g. Qodista Ceelka Biyaha Wajiga 1aad"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expense Title in English (Cinwaanka Ingiriisiga)
                </label>
                <input
                  type="text"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  placeholder="e.g. Solar Borehole Drilling Rig Mobilization"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category (Qaybta) *
                  </label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as ExpenseCategory })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Water & Borehole">Water & Borehole (Ceelka Biyaha)</option>
                    <option value="Road Clearing & Grading">Road Clearing & Grading (Waddada)</option>
                    <option value="Land Survey & Demarcation">Land Survey & Demarcation (Dhulka)</option>
                    <option value="Town Hall & Shelter">Town Hall & Shelter (Xarunta)</option>
                    <option value="Elder Arbitration & Meetings">Elder Arbitration (Odayaasha)</option>
                    <option value="Solar Street Lighting">Solar Street Lighting (Nalalka)</option>
                    <option value="Security & Protection">Security & Protection (Amniga)</option>
                    <option value="Admin & Technology">Admin & Technology (Farsamada)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount Spent ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Paid To (Shirkadda / Qofka) *
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseForm.paidTo}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paidTo: e.target.value })}
                    placeholder="e.g. Kismayo Earthmoving Ltd"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Approved By (Saxiixaha) *
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseForm.approvedBy}
                    onChange={(e) => setExpenseForm({ ...expenseForm, approvedBy: e.target.value })}
                    placeholder="e.g. Ugaas Cabdiqaadir & Finance Committee"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Voucher / Receipt Ref #
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseForm.receiptNumber}
                    onChange={(e) => setExpenseForm({ ...expenseForm, receiptNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date Disbursed
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes / Description
                </label>
                <textarea
                  rows={2}
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  placeholder="Notes on the work, location or delivery"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingExpense ? t.save : language === 'so' ? 'Keydi Kharashka' : 'Save Expense'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: QUICK MARK AS PAID CONFIRMATION MODAL                            */}
      {/* ========================================================================= */}
      {quickPayMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {language === 'so' ? 'Calaamadee in Lacagta la Helay' : 'Confirm Contribution Payment'}
                </h3>
                <p className="text-xs text-emerald-200">
                  {quickPayMember.fullName} ({quickPayMember.id})
                </p>
              </div>
              <button onClick={() => setQuickPayMember(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmQuickPay} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div><strong>{language === 'so' ? 'Xubinta:' : 'Member:'}</strong> {quickPayMember.fullName}</div>
                <div><strong>{language === 'so' ? 'Taleefanka:' : 'Phone:'}</strong> {quickPayMember.phone}</div>
                <div><strong>{language === 'so' ? 'Hore loo Bixiyay:' : 'Previously Paid:'}</strong> ${quickPayMember.contributionAmount}</div>
                <div><strong>{language === 'so' ? 'Wadarta Ballanqaadka:' : 'Total Pledge:'}</strong> ${quickPayMember.pledgedAmount}</div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'so' ? 'Lacagta Hadda la Bixinayo ($ USD) *' : 'Amount Received Now ($ USD) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quickPayAmount}
                  onChange={(e) => setQuickPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'so' ? 'Habka Lacagta loo Bixiyay *' : 'Payment Method *'}
                </label>
                <select
                  value={quickPayMethod}
                  onChange={(e) => setQuickPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                >
                  <option value="Hormuud EVC Plus">Hormuud EVC Plus (Somalia)</option>
                  <option value="Telesom Zaad">Telesom Zaad</option>
                  <option value="e-Dahab">e-Dahab (Dahabshiil)</option>
                  <option value="Bank Transfer (IBS/Premier)">Bank Transfer (IBS / Premier Bank)</option>
                  <option value="Cash in Hand">Cash in Hand</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickPayMember(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'so' ? 'Calaamadee Bixiyay' : 'Confirm Payment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
