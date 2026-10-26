export type MemberRole = 
  | 'Committee Elder' 
  | 'Executive Chairman' 
  | 'Vice Chairman' 
  | 'Treasurer & Finance' 
  | 'General Secretary' 
  | 'Youth Representative' 
  | 'Diaspora Coordinator' 
  | 'Community Member';

export type ContributionStatus = 'Paid' | 'Partial' | 'Pledged';

export type PaymentMethod = 
  | 'Hormuud EVC Plus' 
  | 'Telesom Zaad' 
  | 'e-Dahab' 
  | 'Bank Transfer (IBS/Premier)' 
  | 'Cash in Hand';

export interface Member {
  id: string;
  fullName: string;
  phone: string;
  role: MemberRole;
  subClanBranch?: string;
  contributionAmount: number;
  pledgedAmount: number;
  status: ContributionStatus;
  paymentMethod: PaymentMethod;
  dateRegistered: string;
  villagePlotAssigned: boolean;
  plotNumber?: string;
  notes?: string;
}

export type TechRole = 
  | 'App Developer & Systems Lead'
  | 'GIS & Land Surveyor'
  | 'Civil & Road Engineer'
  | 'Water & Borehole Specialist'
  | 'Media & Video Hook Director'
  | 'Finance & Audit Specialist';

export interface TechnicalStaff {
  id: string;
  fullName: string;
  role: TechRole;
  phone: string;
  email: string;
  specialization: string;
  isLeadDeveloper?: boolean;
  assignedTasks: string;
  status: 'Active' | 'On Field Survey' | 'Consulting';
}

export type ContentStatus = 'Idea' | 'Drafting' | 'Filming' | 'Scheduled' | 'Published';

export type PlatformTarget = 'TikTok' | 'WhatsApp Broadcast' | 'Facebook' | 'YouTube Shorts' | 'Community Radio';

export interface ContentItem {
  id: string;
  title: string;
  targetPlatform: PlatformTarget;
  videoHook: string;
  scriptOutline: string;
  scheduledDate: string;
  status: ContentStatus;
  campaign: 'Kulmis Expansion' | 'Water Well Drive' | 'Diaspora Outreach' | 'Member Census' | 'Road Clearing';
  createdDate: string;
  notes?: string;
}

export interface VisitedLocation {
  id: string;
  name: string;
  somaliName?: string;
  category: 'Kulmis Village Core' | 'Water Borehole' | 'New Road Access' | 'School & Clinic' | 'Committee HQ' | 'Farmland Border';
  lat: number;
  lng: number;
  dateVisited: string;
  visitedBy: string;
  findings: string;
  expansionPotential: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'Meeting' | 'Field Survey' | 'Content Post' | 'Fundraiser' | 'Registration Drive';
  location: string;
  description: string;
}

export interface NoteItem {
  id: string;
  title: string;
  category: 'Meeting Minutes' | 'Village Masterplan' | 'Survey Report' | 'Technical Architecture' | 'Elder Resolutions';
  content: string;
  author: string;
  dateUpdated: string;
  pinned: boolean;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorRoleOrCity: string;
  commentText: string;
  createdAt: string;
  likes: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  isAuthorizedOfficer: boolean;
  title: string;
  content: string;
  videoHook?: string;
  imageUrl?: string;
  campaign: string;
  createdAt: string;
  likes: number;
  comments: PostComment[];
}

export interface VillageFundStats {
  targetBudget: number;
  totalCollected: number;
  totalPledged: number;
  registeredMembersCount: number;
  plotsDemarcated: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  titleSo: string;
  description: string;
  descriptionSo: string;
  timestamp: string;
  type: 'contribution' | 'member' | 'location' | 'note' | 'post' | 'calendar';
  actor: string;
  targetTab?: string;
}

export type LawCategory = 
  | 'Land & Plots' 
  | 'Water & Utilities' 
  | 'Environment & Trees' 
  | 'Roads & Infrastructure' 
  | 'Justice & Arbitration' 
  | 'Finance & Transparency' 
  | 'Diaspora Rights' 
  | 'Security & Safety';

export interface VillageLawArticle {
  id: string;
  articleNumber: number;
  titleSo: string;
  titleEn: string;
  category: LawCategory;
  summarySo: string;
  summaryEn: string;
  fullTextSo: string;
  fullTextEn: string;
  dateAdopted: string;
  status: 'Draft / Public Review' | 'Ratified by Elders' | 'Active Law';
  supportCount: number;
  amendCount: number;
  disagreeCount: number;
}

export interface LawFeedback {
  id: string;
  articleId?: string;
  articleNumber?: number;
  authorName: string;
  authorRole: string; // e.g. Elder, Youth Rep, Diaspora (Minneapolis), etc.
  feedbackType: 'Proposal' | 'Support' | 'Concern' | 'Amendment';
  title: string;
  comment: string;
  dateSubmitted: string;
  upvotes: number;
  status: 'Under Review' | 'Adopted by Elders' | 'Discussed';
  officerResponse?: string;
}

export type DocumentCategory = 
  | 'Land Title & Deed' 
  | 'Cadastre & Survey Map' 
  | 'Elder Council Decree' 
  | 'Water & Well Report' 
  | 'Financial Audit' 
  | 'Village Charter';

export interface UploadedDocument {
  id: string;
  title: string;
  titleSo: string;
  category: DocumentCategory;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
  fileData?: string; // Base64 or Blob URL
  isOfficialStamp: boolean;
  downloadCount: number;
}

export type ExpenseCategory = 
  | 'Water & Borehole'
  | 'Land Survey & Demarcation'
  | 'Road Clearing & Grading'
  | 'Elder Arbitration & Meetings'
  | 'Town Hall & Shelter'
  | 'Security & Protection'
  | 'Solar Street Lighting'
  | 'Admin & Technology';

export interface ExpenseItem {
  id: string;
  title: string;
  titleSo: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paidTo: string;
  approvedBy: string;
  receiptNumber: string;
  notes?: string;
  status: 'Disbursed' | 'Committed' | 'Pending Approval';
}


