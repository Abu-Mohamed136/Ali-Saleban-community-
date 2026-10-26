import { 
  Member, 
  TechnicalStaff, 
  ContentItem, 
  VisitedLocation, 
  CalendarEvent, 
  NoteItem,
  VillageLawArticle,
  LawFeedback,
  UploadedDocument,
  ExpenseItem
} from '../types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_TECHNICAL_STAFF, 
  INITIAL_CONTENT_ITEMS, 
  INITIAL_VISITED_LOCATIONS, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_NOTES,
  INITIAL_EXPENSES
} from '../data/initialData';
import {
  INITIAL_VILLAGE_LAWS,
  INITIAL_PUBLIC_FEEDBACK,
  INITIAL_UPLOADED_DOCUMENTS
} from '../data/lawsData';

const STORAGE_KEYS = {
  MEMBERS: 'cs_kismayo_members_v1',
  TECH_STAFF: 'cs_kismayo_tech_staff_v1',
  CONTENT: 'cs_kismayo_content_v1',
  LOCATIONS: 'cs_kismayo_locations_v1',
  EVENTS: 'cs_kismayo_events_v1',
  NOTES: 'cs_kismayo_notes_v1',
  POSTS: 'cs_kismayo_posts_v1',
  DARK_MODE: 'cs_kismayo_dark_mode_v1',
  OFFICER_AUTH: 'cs_kismayo_officer_auth_v1',
  LANGUAGE: 'cs_kismayo_language_v1',
  LAWS: 'cs_kismayo_laws_v1',
  LAW_FEEDBACK: 'cs_kismayo_law_feedback_v1',
  UPLOADED_DOCS: 'cs_kismayo_uploaded_docs_v1',
  EXPENSES: 'cs_kismayo_expenses_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  getPosts(): any[] {
    // Dynamic import fallback handled via INITIAL_COMMUNITY_POSTS
    const raw = safeGet<any[]>(STORAGE_KEYS.POSTS, []);
    if (raw && raw.length > 0) return raw;
    return [];
  },
  savePosts(posts: any[]): void {
    safeSet(STORAGE_KEYS.POSTS, posts);
  },

  getOfficerAuth(): boolean {
    return safeGet<boolean>(STORAGE_KEYS.OFFICER_AUTH, true); // Default true so developer and officers can immediately test
  },
  saveOfficerAuth(val: boolean): void {
    safeSet(STORAGE_KEYS.OFFICER_AUTH, val);
  },

  getMembers(): Member[] {
    return safeGet<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
  },
  saveMembers(members: Member[]): void {
    safeSet(STORAGE_KEYS.MEMBERS, members);
  },

  getTechnicalStaff(): TechnicalStaff[] {
    return safeGet<TechnicalStaff[]>(STORAGE_KEYS.TECH_STAFF, INITIAL_TECHNICAL_STAFF);
  },
  saveTechnicalStaff(staff: TechnicalStaff[]): void {
    safeSet(STORAGE_KEYS.TECH_STAFF, staff);
  },

  getContentItems(): ContentItem[] {
    return safeGet<ContentItem[]>(STORAGE_KEYS.CONTENT, INITIAL_CONTENT_ITEMS);
  },
  saveContentItems(items: ContentItem[]): void {
    safeSet(STORAGE_KEYS.CONTENT, items);
  },

  getVisitedLocations(): VisitedLocation[] {
    return safeGet<VisitedLocation[]>(STORAGE_KEYS.LOCATIONS, INITIAL_VISITED_LOCATIONS);
  },
  saveVisitedLocations(locations: VisitedLocation[]): void {
    safeSet(STORAGE_KEYS.LOCATIONS, locations);
  },

  getCalendarEvents(): CalendarEvent[] {
    return safeGet<CalendarEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_CALENDAR_EVENTS);
  },
  saveCalendarEvents(events: CalendarEvent[]): void {
    safeSet(STORAGE_KEYS.EVENTS, events);
  },

  getNotes(): NoteItem[] {
    return safeGet<NoteItem[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  },
  saveNotes(notes: NoteItem[]): void {
    safeSet(STORAGE_KEYS.NOTES, notes);
  },

  getDarkMode(): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  },
  saveDarkMode(isDark: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  },

  getLanguage(): 'so' | 'en' {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (stored === 'en' || stored === 'so') return stored;
      return 'so'; // Default to Somali as requested for older community members
    } catch {
      return 'so';
    }
  },
  saveLanguage(lang: 'so' | 'en'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error(e);
    }
  },

  exportAllData(): string {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'CALI SALEEBAAN, KISMAYO COMMITTEE',
      author: 'Adan Deeq Abdirahman Issa (Technical Staff)',
      data: {
        members: this.getMembers(),
        technicalStaff: this.getTechnicalStaff(),
        content: this.getContentItems(),
        locations: this.getVisitedLocations(),
        events: this.getCalendarEvents(),
        notes: this.getNotes(),
        expenses: this.getExpenses(),
      }
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.data) {
        if (parsed.data.members) this.saveMembers(parsed.data.members);
        if (parsed.data.technicalStaff) this.saveTechnicalStaff(parsed.data.technicalStaff);
        if (parsed.data.content) this.saveContentItems(parsed.data.content);
        if (parsed.data.locations) this.saveVisitedLocations(parsed.data.locations);
        if (parsed.data.events) this.saveCalendarEvents(parsed.data.events);
        if (parsed.data.notes) this.saveNotes(parsed.data.notes);
        if (parsed.data.expenses) this.saveExpenses(parsed.data.expenses);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  },

  getLaws(): VillageLawArticle[] {
    return safeGet<VillageLawArticle[]>(STORAGE_KEYS.LAWS, INITIAL_VILLAGE_LAWS);
  },
  saveLaws(laws: VillageLawArticle[]): void {
    safeSet(STORAGE_KEYS.LAWS, laws);
  },

  getLawFeedback(): LawFeedback[] {
    return safeGet<LawFeedback[]>(STORAGE_KEYS.LAW_FEEDBACK, INITIAL_PUBLIC_FEEDBACK);
  },
  saveLawFeedback(feedback: LawFeedback[]): void {
    safeSet(STORAGE_KEYS.LAW_FEEDBACK, feedback);
  },

  getUploadedDocuments(): UploadedDocument[] {
    return safeGet<UploadedDocument[]>(STORAGE_KEYS.UPLOADED_DOCS, INITIAL_UPLOADED_DOCUMENTS);
  },
  saveUploadedDocuments(docs: UploadedDocument[]): void {
    safeSet(STORAGE_KEYS.UPLOADED_DOCS, docs);
  },

  getExpenses(): ExpenseItem[] {
    return safeGet<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  },
  saveExpenses(expenses: ExpenseItem[]): void {
    safeSet(STORAGE_KEYS.EXPENSES, expenses);
  },

  resetToDefault(): void {
    safeSet(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    safeSet(STORAGE_KEYS.TECH_STAFF, INITIAL_TECHNICAL_STAFF);
    safeSet(STORAGE_KEYS.CONTENT, INITIAL_CONTENT_ITEMS);
    safeSet(STORAGE_KEYS.LOCATIONS, INITIAL_VISITED_LOCATIONS);
    safeSet(STORAGE_KEYS.EVENTS, INITIAL_CALENDAR_EVENTS);
    safeSet(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    safeSet(STORAGE_KEYS.LAWS, INITIAL_VILLAGE_LAWS);
    safeSet(STORAGE_KEYS.LAW_FEEDBACK, INITIAL_PUBLIC_FEEDBACK);
    safeSet(STORAGE_KEYS.UPLOADED_DOCS, INITIAL_UPLOADED_DOCUMENTS);
    safeSet(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  }
};

