import React from 'react';
import { Code, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenApkModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApkModal }) => {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Top Footer Banner: Official Developer Attribution */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-b border-emerald-900/40 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">Official App Developer</p>
              <p className="text-sm font-bold text-white tracking-tight">
                Adan Deeq Abdirahman Issa
              </p>
              <p className="text-xs text-slate-400">Technical Staff Member · Cali Saleebaan, Kismayo Committee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenApkModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
            >
              Install on Android & iPhone
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1: Committee Details */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">CALI SALEEBAAN COMMITTEE</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dedicated to community solidarity, transparent contribution records, and the visionary expansion of our new settlement, <strong>Kulmis Village</strong>, Kismayo District, Jubaland, Somalia.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kismayo Head Office & Kulmis Village Project Site</span>
          </div>
        </div>

        {/* Col 2: Transparency & Tech */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Systems & Local Security</h4>
          <ul className="text-xs text-slate-400 space-y-1.5">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Offline-first local data storage (localStorage)</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Instant PDF downloads for members & audits</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Maps verified GPS survey locations</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Developer & Contact */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Technical Support & Contact</h4>
          <p className="text-xs text-slate-400">
            For app updates, registration errors, or system inquiries:
          </p>
          <div className="mt-2 text-xs space-y-1.5 text-slate-300">
            <p className="font-semibold text-white">Adan Deeq Abdirahman Issa</p>
            <p className="text-slate-400">Email: adandeeq136@gmail.com</p>
            <div className="space-y-1">
              <a 
                href="https://wa.me/252611571310"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono"
              >
                <Phone className="w-3 h-3" />
                <span>+252 61 157 1310 (Somalia / WhatsApp)</span>
              </a>
              <a 
                href="tel:+254722123678"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono"
              >
                <Phone className="w-3 h-3" />
                <span>+254 722 123 678 (Kenya / Direct)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/80 py-4 px-4 sm:px-6 text-center text-xs text-slate-400">
        <p>
          © 2026 CALI SALEEBAAN, KISMAYO COMMITTEE. All rights reserved. Built with pride for Kulmis Village Expansion by Lead Developer <strong className="text-slate-300">Adan Deeq Abdirahman Issa</strong> (Technical Staff Member).
        </p>
      </div>
    </footer>
  );
};
