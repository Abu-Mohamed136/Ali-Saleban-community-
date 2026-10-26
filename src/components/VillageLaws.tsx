import React, { useState } from 'react';
import { 
  Scale, 
  BookOpen, 
  FileText, 
  Upload, 
  Download, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Search, 
  Plus, 
  ExternalLink, 
  ShieldCheck, 
  Award, 
  Layers, 
  Sparkles,
  HelpCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Share2,
  Trash2,
  Edit3
} from 'lucide-react';
import { VillageLawArticle, LawFeedback, UploadedDocument, LawCategory, DocumentCategory } from '../types';
import { PdfService } from '../utils/pdfGenerator';
import { StorageService } from '../utils/storage';
import { Language, TRANSLATIONS } from '../utils/translations';

interface VillageLawsProps {
  laws: VillageLawArticle[];
  onUpdateLaws: (laws: VillageLawArticle[]) => void;
  feedback: LawFeedback[];
  onAddFeedback: (item: Omit<LawFeedback, 'id' | 'dateSubmitted' | 'upvotes' | 'status'>) => void;
  onUpvoteFeedback: (id: string) => void;
  onUpdateFeedbackStatus?: (id: string, status: LawFeedback['status'], response?: string) => void;
  documents: UploadedDocument[];
  onAddDocument: (doc: UploadedDocument) => void;
  onDeleteDocument: (id: string) => void;
  isAdmin: boolean;
  onRequireAdmin: () => void;
  language: Language;
}

export const VillageLaws: React.FC<VillageLawsProps> = ({
  laws,
  onUpdateLaws,
  feedback,
  onAddFeedback,
  onUpvoteFeedback,
  onUpdateFeedbackStatus,
  documents,
  onAddDocument,
  onDeleteDocument,
  isAdmin,
  onRequireAdmin,
  language,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'articles' | 'participation' | 'vault'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({
    'law-001': true,
    'law-002': true,
  });

  // User vote tracking (in-memory per session)
  const [votedArticles, setVotedArticles] = useState<Record<string, 'support' | 'amend' | 'disagree'>>({});

  // New Feedback Form state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [fbAuthor, setFbAuthor] = useState('');
  const [fbRole, setFbRole] = useState('');
  const [fbArticleId, setFbArticleId] = useState<string>('law-001');
  const [fbType, setFbType] = useState<LawFeedback['feedbackType']>('Proposal');
  const [fbTitle, setFbTitle] = useState('');
  const [fbComment, setFbComment] = useState('');

  // New Document Upload Form state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docTitleSo, setDocTitleSo] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Land Title & Deed');
  const [docDescription, setDocDescription] = useState('');
  const [docUploader, setDocUploader] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');

  // Officer edit article modal
  const [editingArticle, setEditingArticle] = useState<VillageLawArticle | null>(null);

  // Toggle expand/collapse
  const toggleArticleExpand = (id: string) => {
    setExpandedArticles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle voting on law
  const handleVote = (articleId: string, type: 'support' | 'amend' | 'disagree') => {
    if (votedArticles[articleId]) {
      alert(language === 'so' ? 'Horey ayaad codkaaga u dhiibatay qodobkan!' : 'You already voted on this article!');
      return;
    }

    const updated = laws.map(a => {
      if (a.id === articleId) {
        return {
          ...a,
          supportCount: type === 'support' ? a.supportCount + 1 : a.supportCount,
          amendCount: type === 'amend' ? a.amendCount + 1 : a.amendCount,
          disagreeCount: type === 'disagree' ? a.disagreeCount + 1 : a.disagreeCount,
        };
      }
      return a;
    });

    onUpdateLaws(updated);
    setVotedArticles(prev => ({ ...prev, [articleId]: type }));
  };

  // Handle submitting new community feedback
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbAuthor.trim() || !fbComment.trim() || !fbTitle.trim()) {
      alert(language === 'so' ? 'Fadlan buuxi magacaaga, cinwaanka, iyo faahfaahinta ra’yigaaga.' : 'Please fill your name, title, and comments.');
      return;
    }

    const matchedArticle = laws.find(l => l.id === fbArticleId);

    onAddFeedback({
      articleId: fbArticleId,
      articleNumber: matchedArticle?.articleNumber,
      authorName: fbAuthor.trim(),
      authorRole: fbRole.trim() || (language === 'so' ? 'Xubin Bulshada Kulmis' : 'Kulmis Community Member'),
      feedbackType: fbType,
      title: fbTitle.trim(),
      comment: fbComment.trim(),
    });

    // Reset form
    setFbAuthor('');
    setFbRole('');
    setFbTitle('');
    setFbComment('');
    setShowFeedbackModal(false);
    setActiveSubTab('participation');
    alert(language === 'so' ? 'Mahadsanid! Ra’yigaaga iyo taladaada waa la gudbiyay.' : 'Thank you! Your participation feedback has been submitted.');
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFileDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle document upload submit
  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      alert(language === 'so' ? 'Fadlan gali cinwaanka dukumentiga.' : 'Please enter document title.');
      return;
    }

    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      titleSo: docTitleSo.trim() || docTitle.trim(),
      category: docCategory,
      fileName: selectedFile ? selectedFile.name : `${docTitle.trim().replace(/\s+/g, '_')}.pdf`,
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
      fileType: selectedFile ? selectedFile.type : 'application/pdf',
      uploadedBy: docUploader.trim() || (isAdmin ? 'Adan Deeq (Systems Lead)' : 'Guddiga Kismaayo'),
      uploadedAt: new Date().toISOString().split('T')[0],
      description: docDescription.trim() || (language === 'so' ? 'Dukumenti rasmi ah oo la xiriira Tuulada Kulmis.' : 'Official document relating to Kulmis village development.'),
      fileData: fileDataUrl,
      isOfficialStamp: isAdmin,
      downloadCount: 1,
    };

    onAddDocument(newDoc);
    setDocTitle('');
    setDocTitleSo('');
    setDocDescription('');
    setDocUploader('');
    setSelectedFile(null);
    setFileDataUrl('');
    setShowUploadModal(false);
    setActiveSubTab('vault');
    alert(language === 'so' ? 'Dukumentiga si guul leh ayaa loo kaydiyay!' : 'Document successfully uploaded to village vault!');
  };

  // Handle document download
  const handleDownloadDoc = (doc: UploadedDocument) => {
    // 1. If fileData is present (uploaded file), download real blob
    if (doc.fileData && doc.fileData.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = doc.fileData;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // 2. If it's one of the official pre-seeded documents, generate matching PDF
    if (doc.id === 'doc-004') {
      PdfService.downloadVillageConstitutionPdf(laws);
    } else if (doc.id === 'doc-001') {
      PdfService.downloadMasterplanPdf();
    } else if (doc.id === 'doc-003') {
      PdfService.downloadGpsSurveyReportPdf([
        {
          id: 'well-01',
          name: 'Ceelka Biyaha Macaanka Kulmis (Solar Borehole)',
          category: 'Water Borehole',
          lat: -0.3582,
          lng: 42.5463,
          dateVisited: '2025-02-08',
          visitedBy: 'Eng. Maxamed Saciid & Adan Deeq',
          findings: 'Potable water certified at 110m depth, solar-powered 8.5 m³/hr yield',
          expansionPotential: 'Can supply 5,000 residents and livestock troughs'
        }
      ]);
    } else {
      // Default to Constitution or Masterplan PDF
      PdfService.downloadVillageConstitutionPdf(laws);
    }
  };

  // Filtered Articles
  const filteredArticles = laws.filter(art => {
    const matchesSearch = 
      art.titleSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.fullTextSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.fullTextEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.articleNumber.toString().includes(searchQuery);

    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories: (LawCategory | 'All')[] = [
    'All',
    'Land & Plots',
    'Water & Utilities',
    'Environment & Trees',
    'Roads & Infrastructure',
    'Justice & Arbitration',
    'Finance & Transparency',
    'Diaspora Rights',
    'Security & Safety'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner in required palette (Green, Blue, Earth Brown, Dark Slate) */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-900 via-blue-950 to-amber-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
              <Scale className="w-3.5 h-3.5" />
              <span>Dastuurka & Qawaaniinta Rasmiga ah · Kulmis 2026</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {language === 'so' 
                ? 'Xeerka & Qawaaniinta Tuulada KULMIS' 
                : 'Kulmis Village Laws & Public Participation'}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {language === 'so'
                ? 'Akhriso sharciyada rasmiga ah ee lahaanshaha dhulka (20x20m), biyaha ceelasha, ilaalinta deegaanka, iyo garsoorka odayaasha. Dhiibo ra’yigaaga oo soo geli shahaadooyinka iyo warqadaha muhiimka ah.'
                : 'Read official laws governing plot allocations (20x20m), solar boreholes, environmental protection, and elder dispute arbitration. Participate in public review and upload vital land deeds.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-200 font-medium">
              <span className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-md border border-emerald-600/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {language === 'so' ? 'Waxaa Saxiixay 12 Oday Dhaqan' : 'Ratified by 12 Elder Council Members'}
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-md border border-blue-600/30">
                <FileCheck className="w-4 h-4 text-blue-400" />
                {language === 'so' ? '8 Qodob oo Dhaqan-gal ah' : '8 Active Legislative Articles'}
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-md border border-amber-600/30">
                <Award className="w-4 h-4 text-amber-400" />
                {language === 'so' ? 'Farsamada: Adan Deeq (+252611571310)' : 'Lead: Adan Deeq (+252611571310)'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
            <button
              onClick={() => PdfService.downloadVillageConstitutionPdf(laws)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'so' ? 'Soo Dejiso Dastuurka (PDF)' : 'Download Constitution (PDF)'}</span>
            </button>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition transform active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'so' ? 'Dhiibo Ra’yigaaga (Public Vote)' : 'Submit Proposal / Vote'}</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition transform active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'so' ? 'Soo Geli Dukumenti (Upload)' : 'Upload Official Deed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Main Interactive Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('articles')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition ${
            activeSubTab === 'articles'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'so' ? 'Qodobbada Xeerka (8 Articles)' : 'Village Law Articles (8)'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('participation')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition ${
            activeSubTab === 'participation'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'so' ? 'Ka-Qeybgalka Dadweynaha & Codbixinta' : 'Public Participation & Forum'}</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-bold">
            {feedback.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('vault')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition ${
            activeSubTab === 'vault'
              ? 'border-amber-700 text-amber-800 dark:text-amber-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'so' ? 'Kaydka Dukumentiyada & Sahanka' : 'Document Vault & Cadastre'}</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-bold">
            {documents.length}
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: ARTICLES READER */}
      {activeSubTab === 'articles' && (
        <div className="space-y-6">
          {/* Search & Category Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'so' ? 'Raadi qodob (tusaale: dhulka, biyaha, 20x20)...' : 'Search laws by keyword (e.g. land, water, 20x20)...'}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
              <span className="text-xs font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                {language === 'so' ? 'Qaybta:' : 'Category:'}
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat === 'All' ? (language === 'so' ? 'Dhammaan' : 'All') : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles List */}
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <Scale className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  {language === 'so' ? 'Lama helin qodob la xiriira raadintaada.' : 'No village articles match your search criteria.'}
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
                >
                  {language === 'so' ? 'Dib u celi raadinta' : 'Reset search filters'}
                </button>
              </div>
            ) : (
              filteredArticles.map((article) => {
                const isExpanded = !!expandedArticles[article.id];
                const totalVotes = article.supportCount + article.amendCount + article.disagreeCount;
                const supportPct = totalVotes > 0 ? Math.round((article.supportCount / totalVotes) * 100) : 100;
                const userVoted = votedArticles[article.id];

                return (
                  <div
                    key={article.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition hover:border-emerald-600/40"
                  >
                    {/* Header Strip */}
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                            Qodobka {article.articleNumber}aad
                          </span>
                          <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                            {article.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {article.status}
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-1">
                          {language === 'so' ? article.titleSo : article.titleEn}
                        </h2>
                        {language === 'so' && (
                          <p className="text-xs text-slate-500 italic">
                            [English]: {article.titleEn}
                          </p>
                        )}
                      </div>

                      {/* Header controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isAdmin && (
                          <button
                            onClick={() => setEditingArticle(article)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 transition"
                            title="Edit clause as officer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                            <span>{language === 'so' ? 'Wax Ka Beddel' : 'Edit Law'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => toggleArticleExpand(article.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
                        >
                          <span>{isExpanded ? (language === 'so' ? 'Xir Qoraalka' : 'Collapse') : (language === 'so' ? 'Akhriso oo Dhan' : 'Read Full')}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Article Summary */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-lg border-l-4 border-amber-600">
                        <span className="font-bold text-amber-900 dark:text-amber-200 block mb-0.5">
                          {language === 'so' ? 'Dulmar Guud (Summary):' : 'Key Clause:'}
                        </span>
                        {language === 'so' ? article.summarySo : article.summaryEn}
                      </p>

                      {/* Full Text When Expanded */}
                      {isExpanded && (
                        <div className="space-y-4 pt-2">
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2">
                              {language === 'so' ? 'Qoraalka Rasmiga ah ee Sharciga (Af-Soomaali):' : 'Official Enacted Text (Somali):'}
                            </h3>
                            <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                              {article.fullTextSo}
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 mb-2">
                              Official Translation (English Standard):
                            </h3>
                            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                              {article.fullTextEn}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Consensus Tally & Public Voting Section */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="w-full sm:w-1/2 space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <span>{language === 'so' ? 'Isku-oggolaanshaha Bulshada:' : 'Community Consensus:'}</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{supportPct}% Taageero ({totalVotes} cod)</span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                            <div style={{ width: `${supportPct}%` }} className="bg-emerald-600 h-full" title="Support" />
                            <div style={{ width: `${totalVotes > 0 ? (article.amendCount / totalVotes) * 100 : 0}%` }} className="bg-blue-500 h-full" title="Amendment" />
                            <div style={{ width: `${totalVotes > 0 ? (article.disagreeCount / totalVotes) * 100 : 0}%` }} className="bg-amber-500 h-full" title="Disagree" />
                          </div>
                        </div>

                        {/* Interactive Voting Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => handleVote(article.id, 'support')}
                            disabled={!!userVoted}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              userVoted === 'support'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{language === 'so' ? 'Taageer' : 'Support'} ({article.supportCount})</span>
                          </button>

                          <button
                            onClick={() => {
                              setFbArticleId(article.id);
                              setFbType('Amendment');
                              setShowFeedbackModal(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-700 dark:text-slate-200 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                            <span>{language === 'so' ? 'Soo Jeedin' : 'Propose'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PUBLIC PARTICIPATION & FEEDBACK */}
      {activeSubTab === 'participation' && (
        <div className="space-y-6">
          {/* Preamble Callout */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  {language === 'so' ? 'Golaha Ka-Qeybgalka Dadweynaha & Ra’yi-Dhiibashada' : 'Public Participation & Community Proposal Forum'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {language === 'so' 
                    ? 'Tuulada Kulmis waxaa lagu dhisayaa wadatashi furan. Odayaasha, dhalinyarada, haweenka, iyo jaaliyadda dibadda halkan ku dhiibo taladaada ku saabsan sharciyada la dejiyay.' 
                    : 'Kulmis Village is founded on open consultation. Community elders, diaspora members, youth, and families can propose amendments and review decisions.'}
                </p>
              </div>

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'so' ? 'Qor Soo Jeedin Cusub' : 'Submit New Proposal'}</span>
              </button>
            </div>
          </div>

          {/* Proposals Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedback.map((item) => {
              const matchedArticle = laws.find(l => l.id === item.articleId);

              return (
                <div 
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition"
                >
                  <div className="space-y-3">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {item.authorName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.authorRole}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {item.dateSubmitted} · {matchedArticle ? (language === 'so' ? `Qodobka ${matchedArticle.articleNumber}aad` : `Article ${matchedArticle.articleNumber}`) : 'Guud / General'}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        item.feedbackType === 'Support'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.feedbackType === 'Amendment'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {item.feedbackType}
                      </span>
                    </div>

                    {/* Proposal Title & Comment */}
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        "{item.comment}"
                      </p>
                    </div>

                    {/* Officer response if present */}
                    {item.officerResponse && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs">
                        <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {language === 'so' ? 'Jawaabta Golaha Odayaasha / Guddiga:' : 'Committee Resolution:'}
                        </span>
                        <p className="text-emerald-800 dark:text-emerald-200">
                          {item.officerResponse}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer actions: Upvote & Status */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.status}
                    </span>

                    <button
                      onClick={() => onUpvoteFeedback(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 transition"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.upvotes} {language === 'so' ? 'Oggol' : 'Upvotes'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DOCUMENT VAULT & UPLOAD */}
      {activeSubTab === 'vault' && (
        <div className="space-y-6">
          {/* Header Action Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-700" />
                {language === 'so' ? 'Xarunta Kaydka Dukumentiyada Rasmiga ah ee Kulmis' : 'Kulmis Official Land Documents & Cadastre Vault'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {language === 'so' 
                  ? 'Dhammaan shahaadooyinka lahaanshaha, khariidadaha sahanka, heshiisyada odayaasha, iyo warbixinnada ceelasha biyaha ee loo diyaariyay Tuulada Kulmis.'
                  : 'Official digitized archives including 2026 expansion blueprints, hydrological reports, elder arbitration decrees, and plot allocation documents.'}
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'so' ? 'Soo Geli Dukumenti (Upload File)' : 'Upload New Document'}</span>
            </button>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-600/40 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                          {doc.category}
                        </span>
                        {doc.isOfficialStamp && (
                          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            {language === 'so' ? 'Saxiix Rasmi ah' : 'Certified Seal'}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                        {language === 'so' ? doc.titleSo : doc.title}
                      </h3>
                      {language === 'so' && doc.title !== doc.titleSo && (
                        <p className="text-xs text-slate-500 italic">[English]: {doc.title}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>{language === 'so' ? 'Magaca Faylka:' : 'File:'} <b className="text-slate-700 dark:text-slate-200">{doc.fileName}</b></span>
                      <span>{doc.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'so' ? 'Qofka Soo Geliyay:' : 'Uploaded by:'} {doc.uploadedBy}</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    {doc.downloadCount} {language === 'so' ? 'jeer la soo degsaday' : 'downloads'}
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          if (confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto dukumentigan?' : 'Delete this document?')) {
                            onDeleteDocument(doc.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDownloadDoc(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'so' ? 'Soo Dejiso (PDF)' : 'Download (PDF)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: SUBMIT PUBLIC PARTICIPATION FEEDBACK */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {language === 'so' ? 'Dhiibo Ra’yigaaga & Soo Jeedintaada' : 'Public Participation Submission'}
                </h3>
              </div>
              <button 
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'so' ? 'Magacaaga oo Buuxa:' : 'Your Full Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={fbAuthor}
                  onChange={(e) => setFbAuthor(e.target.value)}
                  placeholder="Tusaale: Axmed Cabdiraxmaan Maxamuud"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'so' ? 'Xilkaaga ama Magaalada:' : 'Role or Diaspora City:'}
                  </label>
                  <input
                    type="text"
                    value={fbRole}
                    onChange={(e) => setFbRole(e.target.value)}
                    placeholder="Tusaale: Oday Dhaqan / London / Kismaayo"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'so' ? 'Nooca Ra’yiga:' : 'Feedback Type:'}
                  </label>
                  <select
                    value={fbType}
                    onChange={(e) => setFbType(e.target.value as LawFeedback['feedbackType'])}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Proposal">{language === 'so' ? 'Soo Jeedin Cusub (Proposal)' : 'New Proposal'}</option>
                    <option value="Support">{language === 'so' ? 'Taageero & Duco (Support)' : 'Support / Endorsement'}</option>
                    <option value="Amendment">{language === 'so' ? 'Wax Ka Beddel (Amendment)' : 'Amendment'}</option>
                    <option value="Concern">{language === 'so' ? 'Digniin / Su’aal (Concern)' : 'Concern / Question'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'so' ? 'Qodobka aad ka hadlayso:' : 'Select Target Article:'}
                </label>
                <select
                  value={fbArticleId}
                  onChange={(e) => setFbArticleId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {laws.map(l => (
                    <option key={l.id} value={l.id}>
                      Qodobka {l.articleNumber}aad: {l.titleSo.substring(0, 48)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'so' ? 'Cinwaanka Soo Jeedinta:' : 'Proposal Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={fbTitle}
                  onChange={(e) => setFbTitle(e.target.value)}
                  placeholder="Tusaale: Balaarinta Waddooyinka Gaadiidka Xamuulka"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'so' ? 'Qoraalkaaga Faahfaahsan:' : 'Detailed Feedback / Proposed Wording:'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={fbComment}
                  onChange={(e) => setFbComment(e.target.value)}
                  placeholder={language === 'so' ? 'Qor fikraddaada ama waxa aad jeclaan lahayd in xeerka lagu daro...' : 'Write your suggestion or amendment to the elder council...'}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {language === 'so' ? 'Ka Noqo' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-700 hover:bg-blue-600 text-white shadow-md"
                >
                  {language === 'so' ? 'Gudbi Ra’yigaaga' : 'Submit to Council'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD DOCUMENT */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {language === 'so' ? 'Soo Geli Dukumenti ama Shahaado Dhul' : 'Upload Document to Village Vault'}
                </h3>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDocSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'so' ? 'Xulo Faylka (PDF, Image, Doc):' : 'Select Document File:'}
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                />
                {selectedFile && (
                  <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
                    ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'so' ? 'Magaca Dukumentiga (English / Af-Soomaali):' : 'Document Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Warqadda Lahaanshaha Booska CSK-045"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'so' ? 'Qaybta Dukumentiga:' : 'Category:'}
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Land Title & Deed">Land Title & Deed (Boosaska)</option>
                    <option value="Cadastre & Survey Map">Cadastre & Survey Map (Sahanka)</option>
                    <option value="Elder Council Decree">Elder Council Decree (Go'aan Odayaal)</option>
                    <option value="Water & Well Report">Water & Well Report (Ceelka Biyaha)</option>
                    <option value="Financial Audit">Financial Audit (Xisaabaadka)</option>
                    <option value="Village Charter">Village Charter (Dastuurka)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'so' ? 'Magacaaga (Qofka Soo Geliyay):' : 'Uploaded By:'}
                  </label>
                  <input
                    type="text"
                    value={docUploader}
                    onChange={(e) => setDocUploader(e.target.value)}
                    placeholder="Adan Deeq / Xubin Guddiga"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'so' ? 'Faahfaahin Kooban:' : 'Brief Description:'}
                </label>
                <textarea
                  rows={3}
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  placeholder="Tusaale: Shahaado rasmi ah oo muujinaysa xudduudda booska 20x20m..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  {language === 'so' ? 'Ka Noqo' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-amber-800 hover:bg-amber-700 text-white shadow-md"
                >
                  {language === 'so' ? 'Keydi oo Soo Geli' : 'Save to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: OFFICER EDIT ARTICLE MODAL */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {language === 'so' ? `Wax Ka Beddel Qodobka ${editingArticle.articleNumber}aad` : `Edit Article ${editingArticle.articleNumber}`}
              </h3>
              <button onClick={() => setEditingArticle(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updated = laws.map(a => a.id === editingArticle.id ? editingArticle : a);
                onUpdateLaws(updated);
                setEditingArticle(null);
                alert(language === 'so' ? 'Qodobka si guul leh ayaa loo cusbooneysiiyay!' : 'Article updated successfully!');
              }}
              className="space-y-4 pt-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cinwaanka (Somali):
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.titleSo}
                  onChange={(e) => setEditingArticle({ ...editingArticle, titleSo: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dulmar Kooban (Summary):
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.summarySo}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summarySo: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Qoraalka Buuxa ee Sharciga (Af-Soomaali):
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingArticle.fullTextSo}
                  onChange={(e) => setEditingArticle({ ...editingArticle, fullTextSo: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  {language === 'so' ? 'Ka Noqo' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white shadow-md"
                >
                  {language === 'so' ? 'Keydi Wax Ka Beddelka' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
