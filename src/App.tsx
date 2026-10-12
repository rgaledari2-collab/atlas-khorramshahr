/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VILLAGES_DATA, VillageData } from './data/villages';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { InteractiveMap } from './components/InteractiveMap';
import { VillageHub } from './components/VillageHub';
import { VillageDossierModal } from './components/VillageDossierModal';
import { ServicesModal } from './components/ServicesModal';
import { ArchitectureAnalysisModal } from './components/ArchitectureAnalysisModal';
import {
  Search,
  MapPin,
  Users,
  School,
  HeartHandshake,
  ShieldCheck,
  ShieldAlert,
  Layers,
  ChevronRight,
  Camera,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

function CommandPalette({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (v: VillageData) => void }) {
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (isOpen) setQuery('');
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // if (!isOpen) return null; - Managed by AnimatePresence now

  const results = VILLAGES_DATA.filter(v => 
    v.name.includes(query) || 
    (v.district && v.district.includes(query)) ||
    (v.tagline && v.tagline.includes(query))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" 
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: -20 }} 
            transition={{ type: 'spring', damping: 20, stiffness: 300 }} 
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden" 
            onClick={e => e.stopPropagation()} 
            dir="rtl"
            style={{ contentVisibility: 'auto' }}
          >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-stone-200">
          <Search className="w-6 h-6 text-stone-400" />
          <input 
            autoFocus 
            className="flex-1 text-lg outline-none bg-transparent placeholder:text-stone-300" 
            placeholder="جستجوی روستا، منطقه یا امکانات..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
          <div className="text-[10px] font-mono bg-stone-100 text-stone-500 px-2 py-1 rounded-md">ESC</div>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-sm">نتیجه‌ای یافت نشد.</div>
          ) : (
            results.map(v => (
              <button 
                key={v.id} 
                onClick={() => { onSelect(v); onClose(); }}
                className="w-full flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors text-right group"
              >
                <div>
                  <div className="font-bold text-stone-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-400 group-hover:text-[#8B322C]" />
                    روستای {v.name}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1 pl-6">{v.district} · {v.tagline}</div>
                </div>
                <div className="flex gap-2">
                  {(v.orphansCount || 0) > 0 && <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-1 rounded-full">{v.orphansCount} یتیم</span>}
                  {(v.underprivilegedCount || 0) > 0 && <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded-full">{v.underprivilegedCount} نیازمند</span>}
                </div>
              </button>
            ))
          )}
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [selectedVillage, setSelectedVillage] = useState<VillageData | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Global search across villages, schools, and metrics
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return VILLAGES_DATA.filter((v) => {
      if (v.name.toLowerCase().includes(q)) return true;
      if (v.tagline?.toLowerCase().includes(q)) return true;
      if (v.schools?.some((s) => s.schoolName.toLowerCase().includes(q))) return true;
      if (v.orphans?.some((o) => 
        o.childName.toLowerCase().includes(q) || 
        o.childLastName.toLowerCase().includes(q) ||
        o.guardianName.toLowerCase().includes(q)
      )) return true;
      return false;
    });
  }, [searchQuery]);

  // Aggregate stats across all villages
  const totalStats = useMemo(() => {
    const totalPop = VILLAGES_DATA.reduce((acc, v) => acc + (v.population || 0), 0);
    const totalFamilies = VILLAGES_DATA.reduce((acc, v) => acc + (v.households || 0), 0);
    const totalOrphans = VILLAGES_DATA.reduce((acc, v) => acc + (v.orphansCount || 0), 0);
    const totalUnderprivileged = VILLAGES_DATA.reduce((acc, v) => acc + (v.underprivilegedCount || 0), 0);
    return { totalPop, totalFamilies, totalOrphans, totalUnderprivileged, villageCount: VILLAGES_DATA.length };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d1c1b] text-stone-100 font-sans" dir="rtl">
      {/* Top Header */}
      {!selectedVillage && (
        <Header
          selectedVillage={selectedVillage}
          onSelectVillage={(v) => {
            setSelectedVillage(v);
          }}
          privacyMode={privacyMode}
          onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
          onOpenAnalysis={() => setIsAnalysisOpen(true)}
          onOpenServices={() => setIsServicesOpen(true)}
        />
      )}

      {/* Main Interactive Atlas Map */}
      <div className="absolute inset-0">
        <ErrorBoundary fallbackMessage="خطا در جستجو"><CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onSelect={(v) => { setSelectedVillage(v); setIsDossierOpen(true); }} /></ErrorBoundary>
      <ErrorBoundary fallbackMessage="خطا در بارگذاری نقشه"><InteractiveMap
          selectedVillage={selectedVillage}
          onSelectVillage={(v) => setSelectedVillage(v)}
          privacyMode={privacyMode}
          onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
        /></ErrorBoundary>
      </div>

      {/* Floating Global Search & Quick Navigator (Top Right under Header) */}
      {!selectedVillage && (
        <div className="absolute top-20 right-4 sm:right-8 z-30 w-80 sm:w-96">
          <div className="relative">
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#142a29]/95 backdrop-blur-xl border border-[#c6a15b]/40 shadow-2xl focus-within:border-amber-400 transition-all">
            <Search className="w-4 h-4 text-[#edd395] flex-shrink-0" />
            <input
              type="text"
              placeholder="جستجوی روستا، نام مدرسه، مددجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-stone-400 focus:outline-none w-full"
            />
            {searchQuery && (
              <button
                type="button" onPointerDown={(e) => { e.preventDefault(); setSearchQuery(''); }} onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-white p-2 relative z-50 cursor-pointer bg-white/5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchQuery && (
            <div className="absolute top-full mt-2 inset-x-0 bg-[#142a29]/98 backdrop-blur-xl border border-[#c6a15b]/50 rounded-2xl shadow-2xl max-h-72 overflow-y-auto p-2 space-y-1.5 z-40">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-400">
                  موردی با این عبارت در روستاهای منطقه یافت نشد.
                </div>
              ) : (
                searchResults.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVillage(v);
                      setSearchQuery('');
                    }}
                    className="w-full text-right p-2.5 rounded-xl bg-white/5 hover:bg-[#c6a15b]/20 border border-white/5 hover:border-[#c6a15b]/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300">
                        روستای {v.name}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {v.population ? `${v.population.toLocaleString('fa-IR')} نفر` : 'اطلاعات در حال تکمیل'} {v.households ? `· ${v.households.toLocaleString('fa-IR')} خانوار` : ''}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-300 -scale-x-100" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Aggregate Overview Bar (Bottom Left) */}
      <div className="hidden md:flex absolute bottom-6 right-6 z-20 flex-col gap-2">
        <div className="px-4 py-3 rounded-2xl bg-[#142a29]/90 backdrop-blur-md border border-[#c6a15b]/40 shadow-xl flex items-center gap-5 text-xs">
          <div>
            <span className="text-stone-400 text-[10px] block">پایش روستاها:</span>
            <strong className="text-amber-300 font-bold">{totalStats.villageCount} روستای هدف</strong>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="text-stone-400 text-[10px] block">کل جمعیت ثبت‌شده:</span>
            <strong className="text-white font-bold">{totalStats.totalPop.toLocaleString('fa-IR')} نفر</strong>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <span className="text-stone-400 text-[10px] block">ایتام تحت پایش:</span>
            <strong className="text-amber-400 font-bold">{totalStats.totalOrphans.toLocaleString('fa-IR')} کودک</strong>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <button
            onClick={() => setPrivacyMode(!privacyMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
              privacyMode
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                : 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
            }`}
            title="سپر حریم خصوصی: ماسک کردن کدهای ملی و شماره تلفن مددجویان"
          >
            {privacyMode ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            <span>حریم خصوصی: {privacyMode ? 'فعال' : 'غیرفعال'}</span>
          </button>
        </div>
      </div>
        </div>
      )}

      {/* Village Hub Overlay when a village is selected */}
      {selectedVillage && (
        <VillageHub
          village={selectedVillage}
          onBackToMap={() => setSelectedVillage(null)}
          onOpenStats={() => setIsDossierOpen(true)}
          onOpenServices={() => setIsServicesOpen(true)}
          onSelectAnotherVillage={(v) => setSelectedVillage(v)}
        />
      )}

      {/* Village Dossier Modal (Detailed Census, Orphans, Schools, Facilities) */}
      {isDossierOpen && selectedVillage && (
        <ErrorBoundary fallbackMessage="خطا در پرونده روستا"><VillageDossierModal
          village={selectedVillage}
          onClose={() => setIsDossierOpen(false)}
          privacyMode={privacyMode}
          onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
        />
      )}

      {/* Regional Health & Public Services Modal */}
      {isServicesOpen && (
        <ServicesModal
          villageName={selectedVillage?.name || 'منطقه خرمشهر و شلمچه'}
          onClose={() => setIsServicesOpen(false)}
        />
      )}

      {/* Architecture & Engineering Analysis Modal */}
      {isAnalysisOpen && (
        <ArchitectureAnalysisModal
          onClose={() => setIsAnalysisOpen(false)}
        />
      )}
    </div>
  );
}
