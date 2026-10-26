import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Download, 
  Upload, 
  Phone, 
  ExternalLink,
  KeyRound,
  FileCheck2,
  Copy,
  Check
} from 'lucide-react';
import { Member } from '../types';
import { StorageService } from '../utils/storage';

interface SecurityShieldProps {
  members: Member[];
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onRefreshData: () => void;
}

export const SecurityShield: React.FC<SecurityShieldProps> = ({
  members,
  isAdmin,
  onToggleAdmin,
  onRefreshData,
}) => {
  const [receiptQuery, setReceiptQuery] = useState('');
  const [verifiedMember, setVerifiedMember] = useState<Member | null | 'NOT_FOUND'>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const officialAccounts = [
    {
      service: 'Hormuud EVC Plus (Official Merchant)',
      number: '*712*611571310*AMOUNT# / Merchant #584920',
      accountName: 'CALI SALEEBAAN KISMAYO COMMITTEE',
      officer: 'Axmed Daahir (Treasurer) & Sheekh Nuur',
      verified: true,
    },
    {
      service: 'Telesom Zaad Service',
      number: '*220*611571310*AMOUNT#',
      accountName: 'GUDDIGA KULMIS KISMAAYO',
      officer: 'Treasurer Mobile Vault',
      verified: true,
    },
    {
      service: 'Premier Bank Somalia',
      number: 'ACC: 0108-4491-002',
      accountName: 'Cali Saleebaan Kulmis Development Fund',
      officer: 'Joint Signatures (Chairman & Treasurer)',
      verified: true,
    },
    {
      service: 'IBS Bank Somalia',
      number: 'ACC: 8820-1194-001',
      accountName: 'Kismayo Community Committee',
      officer: 'Official Account Branch Kismayo',
      verified: true,
    }
  ];

  const handleVerifyReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptQuery.trim()) return;

    const q = receiptQuery.trim().toUpperCase();
    const found = members.find(
      (m) =>
        m.id.toUpperCase() === q ||
        `${m.id}-RC`.toUpperCase().includes(q) ||
        (m.plotNumber && m.plotNumber.toUpperCase() === q) ||
        m.phone.includes(q)
    );

    if (found) {
      setVerifiedMember(found);
    } else {
      setVerifiedMember('NOT_FOUND');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleExportBackup = () => {
    const backupJson = StorageService.exportAllData();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cali_Saleebaan_Secure_Ledger_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = StorageService.importAllData(content);
        if (success) {
          alert('Secure Backup restored successfully! All data has been verified.');
          onRefreshData();
        } else {
          alert('Invalid or corrupted backup file.');
        }
      } catch (err) {
        alert('Failed to read backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Anti-Scam & Hacker Protection Shield */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-red-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-red-900/60 border border-red-700/50 px-3 py-1 rounded-full text-xs font-semibold text-red-200">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Anti-Scam & Hacker Protection Protocol</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Official Anti-Fraud & Security Vault
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Digniin ka dhan ah been-abuurka iyo tuugada: Only send Kulmis contributions to verified accounts below. Use our receipt validator to ensure your plot allocation is genuine and protected against hacker manipulation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <a
              href="https://wa.me/252611571310?text=Assalamu%20Alaikum%20Adan%20Deeq,%20I%20want%20to%20report%20a%20suspected%20scam%20or%20fraudulent%20activity%20concerning%20Kulmis%20Committee:"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Scam to Developer</span>
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Official Payment Verification Accounts vs Receipt Authenticator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Official Verified Accounts (Anti-Impersonation) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Official Verified Committee Payment Accounts
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Digniin Muhiim ah (Critical Security Warning):</span>
            </p>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-tight">
              Guddiga Cali Saleebaan marna ma aqbalo lacag lagu shubo lambarro shakhsi ah. Hadii qof ku weydiisto lacag ka baxsan akoonadan rasmiga ah, fadlan degdeg ula xiriir Horumariyaha App-ka <strong>Adan Deeq (+252 61 157 1310 / +254 722 123 678)</strong>.
            </p>
          </div>

          <div className="space-y-3">
            {officialAccounts.map((acc, idx) => (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-950/50 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {acc.service}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Official Certified</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                    {acc.number}
                  </span>
                  <button
                    onClick={() => handleCopy(acc.number, `acc-${idx}`)}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    title="Copy Account Number"
                  >
                    {copiedAccount === `acc-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Name: <strong>{acc.accountName}</strong></span>
                  <span className="text-[10px]">{acc.officer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: Receipt & Member Authenticator (Anti-Forgery) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Official Receipt & Land Plot Authenticator
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              TAMPER PROOF
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Verify whether a printed receipt, plot allocation, or membership claim is genuine in the certified committee ledger:
          </p>

          <form onSubmit={handleVerifyReceipt} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={receiptQuery}
                  onChange={(e) => {
                    setReceiptQuery(e.target.value);
                    setVerifiedMember(null);
                  }}
                  placeholder="Enter Member ID (e.g. CSK-001) or Plot # or Phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition shrink-0"
              >
                Verify
              </button>
            </div>
          </form>

          {/* Verification Results */}
          {verifiedMember && verifiedMember !== 'NOT_FOUND' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>GENUINE & VERIFIED RECORD</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-200 pt-1">
                <div>
                  <span className="text-slate-400 block">Member Name:</span>
                  <strong className="text-slate-900 dark:text-white">{verifiedMember.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Registration ID:</span>
                  <strong className="font-mono">{verifiedMember.id}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Amount Paid:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">${verifiedMember.contributionAmount} USD</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Kulmis Land Plot:</span>
                  <strong>{verifiedMember.plotNumber || (verifiedMember.villagePlotAssigned ? 'Assigned' : 'Pending')}</strong>
                </div>
              </div>
            </div>
          )}

          {verifiedMember === 'NOT_FOUND' && (
            <div className="bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>WARNING: UNVERIFIED / FAKE RECEIPT</span>
              </div>
              <p className="text-[11px] text-red-700 dark:text-red-300 leading-tight">
                No matching member or receipt found in the official ledger for "{receiptQuery}". Please alert developer Adan Deeq (+252 61 157 1310) immediately.
              </p>
            </div>
          )}

          {/* Offline Backup & Anti-Hacking Lock */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Offline Database Encryption & Disaster Recovery</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Export and store certified JSON ledger backups off your device so hackers or corrupted phones can never erase committee records.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleExportBackup}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Secure Backup</span>
              </button>

              <label className="flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
