import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Apple, 
  Share2, 
  Download, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  FileCode, 
  HelpCircle,
  Sparkles,
  Phone,
  ShieldCheck,
  Package
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ApkService } from '../utils/apkGenerator';

interface ApkDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDistributionModal: React.FC<ApkDistributionModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'iphone' | 'whatsapp'>('android');
  const [copied, setCopied] = useState(false);
  const [isGeneratingApk, setIsGeneratingApk] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-oyhmnj2klgu4hvdmpeq6c5-577038769068.europe-west2.run.app';
  const directApkUrl = `${currentUrl}/Cali_Saleebaan_Kismayo_Committee.apk`;

  const whatsappMessage = encodeURIComponent(
    `*CALI SALEEBAAN, KISMAYO COMMITTEE APP*\n\n` +
    `Assalamu Calaykum! This is the official app for tracking member registration, contributions, and future expansion plans for our new village *KULMIS*.\n\n` +
    `Lead Developer: *Adan Deeq Abdirahman Issa* (Technical Staff)\n` +
    `Contact / WhatsApp: *+252 61 157 1310* | Kenya: *+254 722 123 678*\n\n` +
    `📥 *Direct Android .APK Download:*\n${directApkUrl}\n\n` +
    `👉 *Open App in Web Browser (Android & iPhone):*\n${currentUrl}\n\n` +
    `1. Download the .apk or open the link\n` +
    `2. Install onto home screen\n` +
    `3. View your contribution ledger & PDF receipts 100% offline!`
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directApkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateAndDownloadApk = async () => {
    try {
      setIsGeneratingApk(true);
      await ApkService.downloadRealApkFile();
    } catch (err) {
      console.error('Failed to generate APK:', err);
      // Fallback to static direct link
      const a = document.createElement('a');
      a.href = '/Cali_Saleebaan_Kismayo_Committee.apk';
      a.download = 'Cali_Saleebaan_Kismayo_Committee.apk';
      a.click();
    } finally {
      setIsGeneratingApk(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden transition-colors my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-blue-900 to-amber-900 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-emerald-300" />
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-200">
                Direct APK & Mobile Distribution
              </span>
            </div>
            <h3 className="text-lg font-bold">Download Cali Saleebaan App (.APK)</h3>
            <p className="text-xs text-slate-200 mt-0.5">
              Soo degso faylka rasmiga ah ee APK ama ku rakibo Android & iPhone
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              activeTab === 'android'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (.APK Download)</span>
          </button>

          <button
            onClick={() => setActiveTab('iphone')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              activeTab === 'iphone'
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / Safari</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              activeTab === 'whatsapp'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Share</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* TAB 1: ANDROID (.APK & DIRECT INSTALL) */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              {/* PRIMARY ACTION: DIRECT .APK DOWNLOAD */}
              <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-slate-900/10 border-2 border-emerald-500 dark:border-emerald-600 rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Download className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Standalone Package Archive</span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Download APK File (.apk)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Faylka rasmiga ah ee APK-ga: <strong>Cali_Saleebaan_Kismayo_Committee_v2.4.apk</strong>. Taabo badhanka cagaaran ee hoose si aad ugu soo degsato taleefankaaga.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleGenerateAndDownloadApk}
                    disabled={isGeneratingApk}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isGeneratingApk ? 'Building .APK Package...' : 'Soo Degso Faylka APK (Download .apk)'}
                    </span>
                  </button>

                  <a
                    href="/Cali_Saleebaan_Kismayo_Committee.apk"
                    download="Cali_Saleebaan_Kismayo_Committee.apk"
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition border border-slate-300 dark:border-slate-700 shrink-0"
                  >
                    <span>Direct Server .APK</span>
                  </a>
                </div>

                <div className="bg-emerald-100/70 dark:bg-emerald-950/70 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-950 dark:text-emerald-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tilmaamaha Rakibidda APK-ga (Installation Steps):</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[10px] pl-1">
                    <li>Guji badhanka cagaaran ee <strong>"Soo Degso Faylka APK"</strong>.</li>
                    <li>Marka uu soo dego, ka fur qeybta Downloads ama ogeysiisyada taleefankaaga.</li>
                    <li>Taabo <strong>"Install"</strong> (Haddii taleefanku ku weydiiyo <em>"Allow from this source"</em>, dooro Haa).</li>
                    <li>App-ku wuxuu si toos ah ugu darmayaa shaashaddaada (Home screen)!</li>
                  </ol>
                </div>
              </div>

              {/* SECONDARY OPTION: NATIVE CHROME / WEBApK INSTALL */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Option 2: Direct 1-Click Chrome Install (Add to Home Screen)
                  </h5>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-semibold">
                    Instant
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Google Chrome will automatically install the app as a verified WebAPK with a desktop icon, splash screen, and offline local cache.
                </p>

                {isInstallable ? (
                  <button
                    onClick={install}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow flex items-center justify-center gap-2 transition"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Install 1-Click App Icon Now</span>
                  </button>
                ) : isInstalled ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 py-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Already Installed on this Device!</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    In Chrome on your phone, tap the three dots (⋮) in the top-right corner, then tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: IPHONE / IPAD */}
          {activeTab === 'iphone' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">iPhone & iPad Installation</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Apple iOS does not use APK files; instead, Safari lets you add the app to your Home Screen in 5 seconds with full offline support.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-blue-200 dark:border-blue-900 text-xs space-y-2 text-slate-700 dark:text-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                    <span>Open this website link in <strong>Apple Safari</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                    <span>Tap the <strong>Share</strong> button (box with upward arrow <span className="font-bold">⎋</span>) at the bottom toolbar.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                    <span>Scroll down and select <strong>"Add to Home Screen"</strong> (Ku dar Shaashadda).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
                    <span>Tap <strong>"Add"</strong> in the top-right corner. The official green committee icon will appear on your iPhone!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHATSAPP SHARE */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Share via WhatsApp with Members</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Send the official app invite and direct .APK download link to clan group chats and diaspora families.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {decodeURIComponent(whatsappMessage)}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Send to WhatsApp Chats</span>
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition border border-slate-300 dark:border-slate-700"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'Copied Link!' : 'Copy APK Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Developer Attribution & Hotlines */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              Developer: <strong className="text-slate-800 dark:text-slate-200">Adan Deeq Abdirahman Issa</strong> (Technical Staff)
            </div>
            <div className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              +252 61 157 1310 / +254 722 123 678
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
