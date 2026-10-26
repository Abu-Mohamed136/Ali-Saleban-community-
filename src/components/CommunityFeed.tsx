import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  PlusCircle, 
  X, 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Video, 
  MoreHorizontal,
  Clock,
  User,
  ThumbsUp,
  Bell,
  BellRing,
  Bookmark,
  BookmarkCheck,
  Activity,
  ArrowRight,
  ExternalLink,
  MapPin,
  FileText,
  DollarSign,
  Calendar
} from 'lucide-react';
import { CommunityPost, PostComment, ActivityItem } from '../types';
import { INITIAL_ACTIVITIES } from '../data/initialData';

interface CommunityFeedProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  onAddComment: (postId: string, comment: Omit<PostComment, 'id' | 'createdAt' | 'likes'>) => void;
  onLikePost: (postId: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  onAddPost,
  onAddComment,
  onLikePost,
  isAdmin,
  onToggleAdmin,
  onNavigateTab,
}) => {
  // Tabs: all | following | activities
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'following' | 'activities'>('all');

  // Follow states
  const [isFollowingCommittee, setIsFollowingCommittee] = useState<boolean>(() => {
    return localStorage.getItem('cs_following_committee') === 'true';
  });
  const [followedPostIds, setFollowedPostIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cs_followed_posts') || '["post-01"]');
    } catch {
      return ['post-01'];
    }
  });

  // Comment input state
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commenterName, setCommenterName] = useState('');
  const [commenterCity, setCommenterCity] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New post state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostHook, setNewPostHook] = useState('');
  const [newPostImage, setNewPostImage] = useState('/src/assets/images/kulmis_village_expansion_1793026690983.jpg');

  // Activities list
  const [activities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES as ActivityItem[]);

  const handleToggleFollowCommittee = () => {
    const next = !isFollowingCommittee;
    setIsFollowingCommittee(next);
    localStorage.setItem('cs_following_committee', String(next));
  };

  const handleToggleFollowPost = (postId: string) => {
    let updated: string[];
    if (followedPostIds.includes(postId)) {
      updated = followedPostIds.filter(id => id !== postId);
    } else {
      updated = [...followedPostIds, postId];
    }
    setFollowedPostIds(updated);
    localStorage.setItem('cs_followed_posts', JSON.stringify(updated));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commenterName.trim()) return;

    onAddComment(postId, {
      authorName: commenterName.trim(),
      authorRoleOrCity: commenterCity.trim() || 'Community Member',
      commentText: commentText.trim(),
    });

    setCommentText('');
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    onAddPost({
      authorName: 'Adan Deeq Abdirahman Issa',
      authorRole: 'Lead App Developer & Technical Staff',
      isAuthorizedOfficer: true,
      title: newPostTitle,
      content: newPostContent,
      videoHook: newPostHook || undefined,
      imageUrl: newPostImage || undefined,
      campaign: 'Kulmis Expansion',
    });

    setNewPostTitle('');
    setNewPostContent('');
    setNewPostHook('');
    setIsCreateModalOpen(false);
  };

  const shareToWhatsapp = (post: CommunityPost) => {
    const text = encodeURIComponent(
      `*CALI SALEEBAAN COMMITTEE UPDATE: ${post.title}*\n\n` +
      `${post.content.substring(0, 200)}...\n\n` +
      `Posted by ${post.authorName} (${post.authorRole})\n` +
      `Read and comment on the official app: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const filteredPosts = activeSubTab === 'following'
    ? posts.filter(p => followedPostIds.includes(p.id))
    : posts;

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'contribution':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'member':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-amber-600" />;
      case 'note':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-rose-600" />;
      default:
        return <Activity className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* 1. TOP "FOLLOW COMMITTEE & ACTIVITIES" HERO BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 border border-emerald-500/40 rounded-2xl p-5 text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/30">
              <Bell className="w-3.5 h-3.5" />
              <span>Official Community Stream</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold">
              Follow Cali Saleebaan Committee & Activities
            </h3>
            <p className="text-xs text-slate-300">
              Kala soco wararka tooska ah, tabarucaadka cusub, iyo dhismayaasha tuulada Kulmis.
            </p>
          </div>

          {/* Follow Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleFollowCommittee}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
                isFollowingCommittee
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-400'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isFollowingCommittee ? <BellRing className="w-4 h-4 animate-bounce" /> : <Bell className="w-4 h-4" />}
              <span>{isFollowingCommittee ? 'Following (Waad La Socotaa)' : 'Follow (La Soco)'}</span>
            </button>
          </div>
        </div>

        {/* Follow Stats & WhatsApp Broadcast Link */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-emerald-300">1,428 members actively following</span>
          </div>

          <a
            href="https://wa.me/252611571310?text=Assalamu%20Alaikum%20Adan%20Deeq,%20I%20want%20to%20subscribe%20to%20the%20official%20Cali%20Saleebaan%20WhatsApp%20broadcast%20updates:"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
          >
            <Share2 className="w-3 h-3" />
            <span>Kala soco WhatsApp-ka (+252 61 157 1310)</span>
          </a>
        </div>
      </div>

      {/* 2. THREE-TAB SELECTOR: All Posts / Posts I Follow / Live Activity Stream */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold gap-1">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'all'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>All Posts ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('following')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'following'
              ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Followed Posts ({followedPostIds.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('activities')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'activities'
              ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Activities ({activities.length})</span>
        </button>
      </div>

      {/* 3. SUB-TAB 3: LIVE ACTIVITY STREAM (DHAQDAQAAQA TOOSKA AH EE APP-KA) */}
      {activeSubTab === 'activities' && (
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Real-Time Committee Activities Log
                </h4>
                <p className="text-[11px] text-slate-500">
                  Dhaqdhaqaaqyadii ugu dambeeyay ee laga diiwaangeliyay app-ka
                </p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Live Feed
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2">
              {activities.map((act) => (
                <div key={act.id} className="py-3 flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getActivityIcon(act.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900 dark:text-white">
                        {act.title}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-400">
                        {act.timestamp}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {act.description}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-medium">
                        By {act.actor}
                      </span>

                      {act.targetTab && onNavigateTab && (
                        <button
                          onClick={() => onNavigateTab(act.targetTab!)}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <span>Inspect details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TABS 1 & 2: POSTS FEED */}
      {activeSubTab !== 'activities' && (
        <>
          {/* Top Authority & Role Status Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                isAdmin ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isAdmin ? 'Officer Mode: Authorized to Post & Edit' : 'Member Mode: Read & Comment Only'}
                  </span>
                  {isAdmin && (
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded text-[10px]">
                      OFFICER
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {isAdmin 
                    ? 'You have permission to publish official announcements and manage members.'
                    : 'Members can participate by commenting below. Only authorized officers post.'}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                isAdmin
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
              }`}
            >
              {isAdmin ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isAdmin ? 'Switch to Member View' : 'Officer Access'}</span>
            </button>
          </div>

          {/* Facebook-style "Create Post" Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-blue-700 text-white font-extrabold flex items-center justify-center text-sm shadow">
                AD
              </div>
              {isAdmin ? (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex-1 text-left bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2.5 rounded-full text-xs text-slate-500 dark:text-slate-400 transition"
                >
                  Post an official Kulmis Village update, Adan Deeq...
                </button>
              ) : (
                <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-full text-xs text-slate-400 italic">
                  Posting is restricted to authorized committee officers. Add your comment on any post below!
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs text-slate-600 dark:text-slate-300">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-1.5 py-1 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">Photo / Blueprints</span>
                </button>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-1.5 py-1 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <Video className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">Video Hook</span>
                </button>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-1.5 py-1 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-emerald-700 dark:text-emerald-400 font-semibold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Announcement</span>
                </button>
              </div>
            )}
          </div>

          {/* Posts Stream */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400 space-y-2">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-600 dark:text-slate-300">No followed posts yet.</p>
                <p>Click "Follow Post" on any announcement in the feed to track its updates and comments.</p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isCommenting = activeCommentPostId === post.id;
                const isFollowed = followedPostIds.includes(post.id);

                return (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-xs transition"
                  >
                    {/* Post Header */}
                    <div className="p-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-700 to-blue-800 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                          {post.authorName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                              {post.authorName}
                            </h4>
                            {post.isAuthorizedOfficer && (
                              <span title="Verified Committee Officer">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{post.authorRole}</span>
                            <span>·</span>
                            <span className="font-mono">
                              {new Date(post.createdAt).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* FOLLOW THIS POST BUTTON */}
                        <button
                          onClick={() => handleToggleFollowPost(post.id)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 transition ${
                            isFollowed
                              ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isFollowed ? <BookmarkCheck className="w-3 h-3 text-blue-600" /> : <Bookmark className="w-3 h-3" />}
                          <span>{isFollowed ? 'Following Post' : 'Follow Post'}</span>
                        </button>

                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                          {post.campaign}
                        </span>
                      </div>
                    </div>

                    {/* Post Title & Content */}
                    <div className="px-4 pb-3 space-y-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-[13px]">
                        {post.content}
                      </p>

                      {/* Video Hook Badge if present */}
                      {post.videoHook && (
                        <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl p-2.5 text-xs text-purple-900 dark:text-purple-300 italic">
                          <span className="font-bold not-italic text-purple-700 dark:text-purple-400 mr-1.5">🎬 Video Hook:</span>
                          "{post.videoHook}"
                        </div>
                      )}
                    </div>

                    {/* Post Attached Image */}
                    {post.imageUrl && (
                      <div className="w-full max-h-[380px] bg-slate-950 overflow-hidden border-y border-slate-100 dark:border-slate-800">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Engagement Stats Bar */}
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                          👍
                        </span>
                        <span>{post.likes} reactions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{post.comments.length} comments</span>
                        {isFollowed && (
                          <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                            <Bell className="w-3 h-3" />
                            <span>Notifications on</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Facebook-style Action Buttons (Like / Comment / WhatsApp Share) */}
                    <div className="px-2 py-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => onLikePost(post.id)}
                        className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
                      >
                        <ThumbsUp className="w-4 h-4 text-blue-600" />
                        <span>Support</span>
                      </button>

                      <button
                        onClick={() => setActiveCommentPostId(isCommenting ? null : post.id)}
                        className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-emerald-700 dark:text-emerald-400"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Comment ({post.comments.length})</span>
                      </button>

                      <button
                        onClick={() => shareToWhatsapp(post)}
                        className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-[#25D366]"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Comments Section (Any member can contribute by commenting) */}
                    <div className="p-4 bg-slate-50/60 dark:bg-slate-950/60 space-y-3">
                      {/* Existing Comments */}
                      <div className="space-y-2.5">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {comment.authorName[0]}
                            </div>
                            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 space-y-0.5 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white text-xs">
                                  {comment.authorName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {comment.authorRoleOrCity}
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                                {comment.commentText}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Comment Input Box */}
                      <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="pt-2 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            required
                            value={commenterName}
                            onChange={(e) => setCommenterName(e.target.value)}
                            placeholder="Your Name (Magacaaga) *"
                            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <input
                            type="text"
                            value={commenterCity}
                            onChange={(e) => setCommenterCity(e.target.value)}
                            placeholder="City / Role (e.g. London, Clan Elder)"
                            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            required
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your feedback or contribution note..."
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2 rounded-xl transition shadow shrink-0"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Modal to Create Post (Only for authorized officers / developer) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-emerald-800 via-blue-900 to-amber-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Publish Official Committee Update</h3>
                <p className="text-xs text-emerald-200">Only authorized officers can publish to the stream</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Post Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Deep Water Borehole Testing Completed Successfully"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Details / Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe the update, fund status, or message to elders and diaspora..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video Hook (Optional — for short-form social sharing)
                </label>
                <input
                  type="text"
                  value={newPostHook}
                  onChange={(e) => setNewPostHook(e.target.value)}
                  placeholder="e.g. Watch the exact moment clean sweet water gushed at Kulmis!"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attach Photo / Visual
                </label>
                <select
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                >
                  <option value="/src/assets/images/kulmis_village_expansion_1793026690983.jpg">
                    Kulmis Village Aerial Landscape
                  </option>
                  <option value="/src/assets/images/committee_meeting_kismayo_1793026691049.jpg">
                    Committee Elders Planning Session
                  </option>
                  <option value="">No Image (Text Announcement Only)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl shadow transition"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
