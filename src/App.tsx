import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageCircle, 
  Wrench, 
  Video, 
  Calendar as CalendarIcon, 
  FileText, 
  MapPin, 
  Share2, 
  Lock, 
  Unlock,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { 
  Member, 
  TechnicalStaff, 
  ContentItem, 
  VisitedLocation, 
  CalendarEvent, 
  NoteItem, 
  CommunityPost, 
  PostComment,
  VillageLawArticle,
  LawFeedback,
  UploadedDocument,
  ExpenseItem
} from './types';
import { StorageService } from './utils/storage';
import { Language, TRANSLATIONS } from './utils/translations';
import { INITIAL_COMMUNITY_POSTS } from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { CommunityFeed } from './components/CommunityFeed';
import { VillageLaws } from './components/VillageLaws';
import { MembersLedger } from './components/MembersLedger';
import { TechnicalTeam } from './components/TechnicalTeam';
import { ContentStudio } from './components/ContentStudio';
import { BigCalendar } from './components/BigCalendar';
import { NotesSection } from './components/NotesSection';
import { VisitedLocationsMap } from './components/VisitedLocationsMap';
import { ApkDistributionModal } from './components/ApkDistributionModal';
import { SecurityShield } from './components/SecurityShield';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => StorageService.getDarkMode());

  // Language state (defaults to Somali 'so' for elders, toggleable to 'en')
  const [language, setLanguageState] = useState<Language>(() => StorageService.getLanguage());

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    StorageService.saveLanguage(lang);
  };

  const t = TRANSLATIONS[language];

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);

  // Officer / Admin Authority state (Selective posting & editing)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => StorageService.getOfficerAuth());
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Google Maps Quota Exceeded Defense
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // App data states
  const [members, setMembers] = useState<Member[]>(() => StorageService.getMembers());
  const [technicalStaff, setTechnicalStaff] = useState<TechnicalStaff[]>(() => StorageService.getTechnicalStaff());
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => StorageService.getContentItems());
  const [locations, setLocations] = useState<VisitedLocation[]>(() => StorageService.getVisitedLocations());
  const [events, setEvents] = useState<CalendarEvent[]>(() => StorageService.getCalendarEvents());
  const [notes, setNotes] = useState<NoteItem[]>(() => StorageService.getNotes());
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => StorageService.getExpenses());
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = StorageService.getPosts();
    if (saved && saved.length > 0) return saved as CommunityPost[];
    return INITIAL_COMMUNITY_POSTS as CommunityPost[];
  });
  const [laws, setLaws] = useState<VillageLawArticle[]>(() => StorageService.getLaws());
  const [lawFeedback, setLawFeedback] = useState<LawFeedback[]>(() => StorageService.getLawFeedback());
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>(() => StorageService.getUploadedDocuments());

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    StorageService.saveDarkMode(darkMode);
  }, [darkMode]);

  // Maps Quota Exceeded listener
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Members handlers
  const handleAddMember = (newM: Omit<Member, 'id'>) => {
    const newId = `CSK-${String(members.length + 1).padStart(3, '0')}`;
    const updated = [{ ...newM, id: newId }, ...members];
    setMembers(updated);
    StorageService.saveMembers(updated);
  };

  const handleUpdateMember = (updatedM: Member) => {
    const updated = members.map((m) => (m.id === updatedM.id ? updatedM : m));
    setMembers(updated);
    StorageService.saveMembers(updated);
  };

  const handleDeleteMember = (id: string) => {
    if (!isAdmin) {
      setShowAdminPinModal(true);
      return;
    }
    if (confirm('Are you sure you want to remove this member record?')) {
      const updated = members.filter((m) => m.id !== id);
      setMembers(updated);
      StorageService.saveMembers(updated);
    }
  };

  // Expenses handlers (Where the money goes)
  const handleAddExpense = (newExp: Omit<ExpenseItem, 'id'>) => {
    const newId = `exp-${String(expenses.length + 1).padStart(3, '0')}`;
    const updated = [{ ...newExp, id: newId }, ...expenses];
    setExpenses(updated);
    StorageService.saveExpenses(updated);
  };

  const handleUpdateExpense = (updatedExp: ExpenseItem) => {
    const updated = expenses.map((e) => (e.id === updatedExp.id ? updatedExp : e));
    setExpenses(updated);
    StorageService.saveExpenses(updated);
  };

  const handleDeleteExpense = (id: string) => {
    if (!isAdmin) {
      setShowAdminPinModal(true);
      return;
    }
    if (confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto diiwaankan kharashka?' : 'Are you sure you want to delete this expense record?')) {
      const updated = expenses.filter((e) => e.id !== id);
      setExpenses(updated);
      StorageService.saveExpenses(updated);
    }
  };

  // Technical staff handlers
  const handleAddStaff = (newStaff: Omit<TechnicalStaff, 'id'>) => {
    const newId = `tech-${String(technicalStaff.length + 1).padStart(3, '0')}`;
    const updated = [...technicalStaff, { ...newStaff, id: newId }];
    setTechnicalStaff(updated);
    StorageService.saveTechnicalStaff(updated);
  };

  const handleUpdateStaff = (updatedStaff: TechnicalStaff) => {
    const updated = technicalStaff.map((s) => (s.id === updatedStaff.id ? updatedStaff : s));
    setTechnicalStaff(updated);
    StorageService.saveTechnicalStaff(updated);
  };

  const handleDeleteStaff = (id: string) => {
    if (!isAdmin) {
      setShowAdminPinModal(true);
      return;
    }
    const updated = technicalStaff.filter((s) => s.id !== id);
    setTechnicalStaff(updated);
    StorageService.saveTechnicalStaff(updated);
  };

  // Content studio handlers
  const handleAddContent = (newC: Omit<ContentItem, 'id' | 'createdDate'>) => {
    const newId = `cont-${Date.now().toString().slice(-4)}`;
    const updated = [
      {
        ...newC,
        id: newId,
        createdDate: new Date().toISOString().split('T')[0],
      },
      ...contentItems,
    ];
    setContentItems(updated);
    StorageService.saveContentItems(updated);
  };

  const handleUpdateContent = (updatedC: ContentItem) => {
    const updated = contentItems.map((c) => (c.id === updatedC.id ? updatedC : c));
    setContentItems(updated);
    StorageService.saveContentItems(updated);
  };

  const handleUpdateContentStatus = (id: string, status: ContentItem['status']) => {
    const updated = contentItems.map((c) => (c.id === id ? { ...c, status } : c));
    setContentItems(updated);
    StorageService.saveContentItems(updated);
  };

  const handleDeleteContent = (id: string) => {
    if (!isAdmin) {
      setShowAdminPinModal(true);
      return;
    }
    const updated = contentItems.filter((c) => c.id !== id);
    setContentItems(updated);
    StorageService.saveContentItems(updated);
  };

  // Calendar handlers
  const handleAddEvent = (newEv: Omit<CalendarEvent, 'id'>) => {
    const newId = `ev-${Date.now().toString().slice(-4)}`;
    const updated = [...events, { ...newEv, id: newId }];
    setEvents(updated);
    StorageService.saveCalendarEvents(updated);
  };

  const handleUpdateEvent = (updatedEv: CalendarEvent) => {
    const updated = events.map((e) => (e.id === updatedEv.id ? updatedEv : e));
    setEvents(updated);
    StorageService.saveCalendarEvents(updated);
  };

  const handleDeleteEvent = (id: string) => {
    if (!isAdmin) {
      setShowAdminPinModal(true);
      return;
    }
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    StorageService.saveCalendarEvents(updated);
  };

  // Notes handlers
  const handleAddNote = (newN: Omit<NoteItem, 'id' | 'dateUpdated'>) => {
    const newId = `note-${Date.now().toString().slice(-4)}`;
    const updated = [
      {
        ...newN,
        id: newId,
        dateUpdated: new Date().toISOString().split('T')[0],
      },
      ...notes,
    ];
    setNotes(updated);
    StorageService.saveNotes(updated);
  };

  const handleUpdateNote = (updatedN: NoteItem) => {
    const updated = notes.map((n) => (n.id === updatedN.id ? updatedN : n));
    setNotes(updated);
    StorageService.saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    if (!isAdmin) {
      setShowAdminPinModal(true);
      return;
    }
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    StorageService.saveNotes(updated);
  };

  const handleTogglePinNote = (id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    setNotes(updated);
    StorageService.saveNotes(updated);
  };

  // Visited Locations handlers
  const handleAddLocation = (newLoc: Omit<VisitedLocation, 'id'>) => {
    const newId = `loc-${Date.now().toString().slice(-4)}`;
    const updated = [...locations, { ...newLoc, id: newId }];
    setLocations(updated);
    StorageService.saveVisitedLocations(updated);
  };

  const handleUpdateLocation = (updatedLoc: VisitedLocation) => {
    const updated = locations.map((l) => (l.id === updatedLoc.id ? updatedLoc : l));
    setLocations(updated);
    StorageService.saveVisitedLocations(updated);
  };

  const handleDeleteLocation = (id: string) => {
    if (!isAdmin) {
      setShowAdminPinModal(true);
      return;
    }
    const updated = locations.filter((l) => l.id !== id);
    setLocations(updated);
    StorageService.saveVisitedLocations(updated);
  };

  // Community Feed & Post handlers
  const handleAddCommunityPost = (newP: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    const newPost: CommunityPost = {
      ...newP,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 1,
      comments: [],
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    StorageService.savePosts(updated);
  };

  const handleAddComment = (postId: string, comment: Omit<PostComment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: PostComment = {
      ...comment,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 1,
    };
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      }
      return p;
    });
    setPosts(updated);
    StorageService.savePosts(updated);
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    setPosts(updated);
    StorageService.savePosts(updated);
  };

  // Village Laws & Public Participation handlers
  const handleUpdateLaws = (newLaws: VillageLawArticle[]) => {
    setLaws(newLaws);
    StorageService.saveLaws(newLaws);
  };

  const handleAddLawFeedback = (newFb: Omit<LawFeedback, 'id' | 'dateSubmitted' | 'upvotes' | 'status'>) => {
    const item: LawFeedback = {
      ...newFb,
      id: `fb-${Date.now()}`,
      dateSubmitted: new Date().toISOString().split('T')[0],
      upvotes: 1,
      status: 'Under Review',
    };
    const updated = [item, ...lawFeedback];
    setLawFeedback(updated);
    StorageService.saveLawFeedback(updated);
  };

  const handleUpvoteFeedback = (id: string) => {
    const updated = lawFeedback.map(fb => fb.id === id ? { ...fb, upvotes: fb.upvotes + 1 } : fb);
    setLawFeedback(updated);
    StorageService.saveLawFeedback(updated);
  };

  const handleAddDocument = (newDoc: UploadedDocument) => {
    const updated = [newDoc, ...uploadedDocs];
    setUploadedDocs(updated);
    StorageService.saveUploadedDocuments(updated);
  };

  const handleDeleteDocument = (id: string) => {
    const updated = uploadedDocs.filter(d => d.id !== id);
    setUploadedDocs(updated);
    StorageService.saveUploadedDocuments(updated);
  };

  // Role toggle handler
  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      StorageService.saveOfficerAuth(false);
    } else {
      setShowAdminPinModal(true);
    }
  };

  const handleVerifyOfficerPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default committee officer PIN: 1990 or 2026 or 1234
    if (adminPinInput === '1990' || adminPinInput === '2026' || adminPinInput === '1234' || adminPinInput === '7788') {
      setIsAdmin(true);
      StorageService.saveOfficerAuth(true);
      setShowAdminPinModal(false);
      setAdminPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-20 lg:pb-0">
      {/* Google Maps Quota Defense Sticky Top Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Header with Developer Hotline & Somali Language Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        language={language}
        setLanguage={handleSetLanguage}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            members={members}
            contentItems={contentItems}
            locations={locations}
            events={events}
            technicalStaff={technicalStaff}
            setActiveTab={setActiveTab}
            onOpenAddMember={() => {
              if (!isAdmin) {
                setShowAdminPinModal(true);
                return;
              }
              setIsAddMemberModalOpen(true);
            }}
            onOpenAddContent={() => {
              if (!isAdmin) {
                setShowAdminPinModal(true);
                return;
              }
              setIsAddContentModalOpen(true);
            }}
            onOpenAddLocation={() => {
              if (!isAdmin) {
                setShowAdminPinModal(true);
                return;
              }
              setActiveTab('map');
            }}
          />
        )}

        {activeTab === 'feed' && (
          <CommunityFeed
            posts={posts}
            onAddPost={handleAddCommunityPost}
            onAddComment={handleAddComment}
            onLikePost={handleLikePost}
            isAdmin={isAdmin}
            onToggleAdmin={handleToggleAdmin}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'laws' && (
          <VillageLaws
            laws={laws}
            onUpdateLaws={handleUpdateLaws}
            feedback={lawFeedback}
            onAddFeedback={handleAddLawFeedback}
            onUpvoteFeedback={handleUpvoteFeedback}
            documents={uploadedDocs}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            isAdmin={isAdmin}
            onRequireAdmin={() => setShowAdminPinModal(true)}
            language={language}
          />
        )}

        {activeTab === 'members' && (
          <MembersLedger
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            isAddModalOpen={isAddMemberModalOpen}
            setIsAddModalOpen={setIsAddMemberModalOpen}
            language={language}
            isAdmin={isAdmin}
            onResetSampleData={() => {
              StorageService.resetToDefault();
              setMembers(StorageService.getMembers());
              setTechnicalStaff(StorageService.getTechnicalStaff());
              setContentItems(StorageService.getContentItems());
              setLocations(StorageService.getVisitedLocations());
              setEvents(StorageService.getCalendarEvents());
              setNotes(StorageService.getNotes());
              setExpenses(StorageService.getExpenses());
              alert(language === 'so' ? 'Xogta tusaalaha ah si guul leh ayaa dib loogu celiyay!' : 'Sample data reset to default successfully!');
            }}
            onClearAllData={() => {
              StorageService.saveMembers([]);
              setMembers([]);
              StorageService.saveExpenses([]);
              setExpenses([]);
            }}
          />
        )}

        {activeTab === 'security' && (
          <SecurityShield
            members={members}
            isAdmin={isAdmin}
            onToggleAdmin={handleToggleAdmin}
            onRefreshData={() => setMembers(StorageService.getMembers())}
          />
        )}

        {activeTab === 'technical' && (
          <TechnicalTeam
            staff={technicalStaff}
            onAddStaff={handleAddStaff}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
            isAdmin={isAdmin}
            onRequireAdmin={() => setShowAdminPinModal(true)}
          />
        )}

        {activeTab === 'content' && (
          <ContentStudio
            items={contentItems}
            onAddItem={handleAddContent}
            onUpdateItem={handleUpdateContent}
            onUpdateStatus={handleUpdateContentStatus}
            onDeleteItem={handleDeleteContent}
            isAddModalOpen={isAddContentModalOpen}
            setIsAddModalOpen={setIsAddContentModalOpen}
            isAdmin={isAdmin}
            onRequireAdmin={() => setShowAdminPinModal(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <BigCalendar
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            isAdmin={isAdmin}
            onRequireAdmin={() => setShowAdminPinModal(true)}
          />
        )}

        {activeTab === 'notes' && (
          <NotesSection
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePinNote}
            isAdmin={isAdmin}
            onRequireAdmin={() => setShowAdminPinModal(true)}
          />
        )}

        {activeTab === 'map' && (
          <VisitedLocationsMap
            locations={locations}
            onAddLocation={handleAddLocation}
            onUpdateLocation={handleUpdateLocation}
            onDeleteLocation={handleDeleteLocation}
            isAdmin={isAdmin}
            onRequireAdmin={() => setShowAdminPinModal(true)}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'feed'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[9px] mt-1 tracking-tight">
              {language === 'so' ? 'Wararka' : 'Feed'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('laws')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'laws'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span className="text-[9px] mt-1 tracking-tight">
              {language === 'so' ? 'Xeerka' : 'Laws'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'members'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[9px] mt-1 tracking-tight">
              {language === 'so' ? 'Xubnaha' : 'Members'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'calendar'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="text-[9px] mt-1 tracking-tight">
              {language === 'so' ? 'Jadwalka' : 'Calendar'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'map'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-[9px] mt-1 tracking-tight">
              {language === 'so' ? 'Khariidadda' : 'Map'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'dashboard'
                ? 'text-purple-600 dark:text-purple-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[9px] mt-1 tracking-tight">
              {language === 'so' ? 'Xogta' : 'More'}
            </span>
          </button>
        </div>
      </nav>

      {/* Footer with Developer Attribution */}
      <Footer onOpenApkModal={() => setIsApkModalOpen(true)} />

      {/* APK & Phone Distribution Modal */}
      <ApkDistributionModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Officer Authority Passcode Modal */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-xs">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'so' ? 'Fasaxa Saraakiisha Guddiga' : 'Committee Officer Access'}
              </h3>
              <p className="text-slate-500">
                {language === 'so' 
                  ? 'Si aad u darto xubno cusub, u soo saarto ogeysiisyada, ama u beddesho xogta qaldan, geli lambarka sirta ah.' 
                  : 'To add members, publish announcements, or edit records, enter the committee officer PIN.'}
              </p>
            </div>

            <form onSubmit={handleVerifyOfficerPin} className="space-y-3">
              <div>
                <input
                  type="password"
                  autoFocus
                  value={adminPinInput}
                  onChange={(e) => {
                    setAdminPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder={language === 'so' ? 'Geli PIN-ka (tusaale: 1990)' : 'Enter Officer PIN (e.g. 1990)'}
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {pinError && (
                  <p className="text-red-500 text-[11px] text-center mt-1">
                    {language === 'so' ? 'PIN-ku waa khalad. Furaha guddiga: 1990 ama 2026.' : 'Incorrect PIN. Default passcode: 1990 or 2026.'}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminPinModal(false);
                    setPinError(false);
                    setAdminPinInput('');
                  }}
                  className="flex-1 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
                >
                  {language === 'so' ? 'Ka noqo' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
                >
                  {language === 'so' ? 'Fur Fasaxa' : 'Unlock Access'}
                </button>
              </div>
            </form>

            <div className="text-[10px] text-center text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Developer: <strong>Adan Deeq Abdirahman Issa</strong> · +252 61 157 1310
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
