import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightCard } from './SpotlightCard';
import { VillageData, OrphanRecord, UnderprivilegedRecord, VillageDetails, SchoolGradeStats, InfrastructureItem } from '../data/villages';
type VillageFullData = VillageData & VillageDetails;
import {
  X,
  Users,
  Home,
  GraduationCap,
  HeartHandshake,
  Search,
  ShieldCheck,
  ShieldAlert,
  Building2,
  MapPin,
  HeartPulse,
  UserCircle,
  Phone,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

// ─── Animated Counter Hook (pure JS, no lib) ───
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<number>();
  useEffect(() => {
    if (!target) { setCount(0); return; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(start);
    }, 16);
    ref.current = id as any;
    return () => clearInterval(ref.current);
  }, [target, duration]);
  return count;
}

// ─── Donut Chart (pure SVG) ───
function DonutChart({ data }: { data: { label: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (!total) return null;
  const colors = ['#4f46e5', '#6366f1', '#cbd5e1', '#4d7c6a', '#6b8fa3', '#a07d5a'];
  const radius = 70;
  const cx = 90, cy = 90;
  let cumulative = 0;

  const slices = data.map((item, i) => {
    const pct = item.count / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const largeArc = pct > 0.5 ? 1 : 0;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    return (
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={colors[i % colors.length]}
        opacity={0.85}
        className="transition-all duration-500 hover:opacity-100"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
      />
    );
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {slices}
          <circle cx={cx} cy={cy} r="42" fill="#ffffff" />
          <text x={cx} y={cy - 6} textAnchor="middle" className="fill-[#4f46e5]" fontSize="22" fontWeight="900">{total}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" className="fill-stone-500" fontSize="10" fontWeight="700">نفر</text>
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 border border-stone-200">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-stone-700 truncate">{item.label}</div>
              <div className="text-sm font-black text-[#4f46e5]">{item.count} نفر</div>
            </div>
            <div className="text-[10px] text-stone-400 font-mono">{Math.round((item.count / total) * 100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pagination Controls ───
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="p-1.5 rounded-lg bg-white border border-stone-300 disabled:opacity-30 hover:bg-stone-50 transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <span className="text-xs font-bold text-stone-600 px-3">
        صفحه {current.toLocaleString('fa-IR')} از {total.toLocaleString('fa-IR')}
      </span>
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="p-1.5 rounded-lg bg-white border border-stone-300 disabled:opacity-30 hover:bg-stone-50 transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Stat Card with Counter ───
function StatCard({ label, value, sub, icon: Icon, color = '#4f46e5' }: {
  label: string; value: number; sub: string; icon: React.ElementType; color?: string;
}) {
  const animatedValue = useCountUp(value);
  return (
    <SpotlightCard className="relative p-4 rounded-2xl bg-white border border-slate-200 shadow-sm group hover:shadow-md transition-shadow" spotlightColor="rgba(99, 102, 241, 0.1)">
      <Icon className="absolute -left-2 -bottom-2 w-16 h-16 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity" style={{ color }} />
      <span className="text-[11px] text-stone-500 font-bold block">{label}</span>
      <div className="text-3xl font-black mt-1.5" style={{ color }}>
        {value ? animatedValue.toLocaleString('fa-IR') : '—'}
      </div>
      <span className="text-[10px] text-stone-400 mt-1 block">{sub}</span>
    </div>
  );
}

// ─── Main Component ───
interface VillageDossierModalProps {
  village: VillageData;
  onClose: () => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
}

export const VillageDossierModal: React.FC<VillageDossierModalProps> = ({
  village,
  onClose,
  privacyMode,
  onTogglePrivacy,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'schools' | 'orphans' | 'underprivileged' | 'disability' | 'map'>('overview');
  const [details, setDetails] = useState<VillageDetails>((window as any)._villageCache?.[village.id] || {});
  const [loadingDetails, setLoadingDetails] = useState(!(window as any)._villageCache?.[village.id]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => { setPage(1); }, [activeTab, village.id]);

  useEffect(() => {
    const cache = (window as any)._villageCache || ((window as any)._villageCache = {});
    if (cache[village.id]) {
      setDetails(cache[village.id]);
      setLoadingDetails(false);
      return;
    }
    setDetails({});
    setLoadingDetails(true);
    fetch(`/data/${village.id}.json`)
      .then(res => res.ok ? res.json() : {})
      .then(data => { 
        cache[village.id] = data;
        setDetails(data); 
        setLoadingDetails(false); 
      })
      .catch(() => setLoadingDetails(false));
  }, [village.id]);

  const v: VillageFullData = { ...village, ...details };

  const maskNationalId = (id: string | undefined): string => {
    if (!id || id === '—' || id === '*' || id.includes('عراقی')) return id || '—';
    if (!privacyMode) return id;
    if (id.length < 5) return '***';
    return id.substring(0, 3) + '****' + id.substring(id.length - 2);
  };

  const maskPhone = (phone: string | undefined): string => {
    if (!phone || phone === '—' || phone === '*') return phone || '—';
    if (!privacyMode) return phone;
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 8) return '۰۹*********';
    return clean.substring(0, 4) + '***' + clean.substring(clean.length - 3);
  };

  const filteredOrphans = useMemo(() => {
    if (!v.orphans) return [];
    if (!searchTerm.trim()) return v.orphans;
    const q = searchTerm.toLowerCase();
    return v.orphans.filter(
      (o: OrphanRecord) =>
        o.childName.toLowerCase().includes(q) ||
        o.childLastName.toLowerCase().includes(q) ||
        o.guardianName.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.schoolName.toLowerCase().includes(q)
    );
  }, [v.orphans, searchTerm]);

  const filteredUnderprivileged = useMemo(() => {
    if (!v.underprivileged) return [];
    if (!searchTerm.trim()) return v.underprivileged;
    const q = searchTerm.toLowerCase();
    return v.underprivileged.filter(
      (u: UnderprivilegedRecord) => u.fullName.toLowerCase().includes(q) || u.address.toLowerCase().includes(q)
    );
  }, [v.underprivileged, searchTerm]);

  const orphanPages = Math.ceil(filteredOrphans.length / ITEMS_PER_PAGE);
  const underprivilegedPages = Math.ceil(filteredUnderprivileged.length / ITEMS_PER_PAGE);

  // Map image for cover
  const mapImages: Record<string, string> = {
  'soureh':            '/soureh_map_web.webp',
  'ariz':              '/ariz_map_web.webp',
  'pol-now':           '/pol-now_map_web.webp',
  'jadideh':           '/jadideh_map_v4.jpg',
  'sad-dastgah':       '/sad-dastgah_map_web.webp',
  'darband-gharbi':    '/darband-gharbi_map_web.webp',
  'darband-sharqi':    '/darband-sharqi_map_web.webp',
  'sarhaniyeh-avval':  '/image_1.webp',
  'sarhaniyeh-sofla':  '/image_0.webp',
  'maslavi':           '/maslavi_map_user.webp',
  'maslavi2':          '/maslavi_map_user.webp',
  'shahrak-sadat':     '/shahrak-sadat_map_web.webp',
  'shahrak-sevvom':    '/shahrak-sevvom_map_hq.jpg',
  'mofti-ariz':        '/ariz_map_web.webp',
};
  const coverImg = mapImages[village.id] || '/main_map_final.webp';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 20, scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#ffffff] text-[#111111] rounded-2xl shadow-2xl overflow-hidden border border-[#cbd5e1]/40"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
        {/* ═══ COVER IMAGE HEADER ═══ */}
        <div className="relative h-36 sm:h-44 flex-shrink-0 overflow-hidden">
          <img
            src={coverImg}
            alt={village.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(2px) brightness(0.45) saturate(1.3)' }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#ffffff]" />
          <div className="relative z-10 h-full flex items-end px-6 pb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-[#4f46e5] text-[#f3ebdd] flex items-center justify-center font-black text-2xl shadow-xl border-2 border-white/30">
                {village.name.charAt(0)}
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-200/90">شناسنامه آماری و اجتماعی</div>
                <h2 className="text-2xl font-black text-white drop-shadow-lg">
                  روستای {village.name}
                </h2>
                <div className="text-[10px] text-stone-300 font-mono mt-0.5">{village.coordinates}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePrivacy}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 backdrop-blur-sm ${
                  privacyMode
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40'
                    : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
                }`}
              >
                {privacyMode ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                <span className="hidden sm:inline">{privacyMode ? 'ماسک فعال' : 'نمایش کامل'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-white/80 hover:bg-white/20 transition-all backdrop-blur-sm"
                aria-label="بستن"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ NAVIGATION TABS ═══ */}
        <div className="flex overflow-x-auto gap-2 px-6 py-2.5 bg-[#e8dfc8]/60 border-b border-[#111111]/10 text-xs font-bold flex-shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-[#555] hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            نمای کلی
          </button>

          {v.schools && (
            <button
              onClick={() => setActiveTab('schools')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'schools' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-[#555] hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              مدارس
              <span className="px-1.5 text-[10px] rounded-full bg-white/20">
                {v.schools.reduce((a: number, s: SchoolGradeStats) => a + s.total, 0)}
              </span>
            </button>
          )}

          {v.orphans && (
            <button
              onClick={() => setActiveTab('orphans')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'orphans' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-[#555] hover:bg-slate-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              ایتام
              <span className="px-1.5 text-[10px] rounded-full bg-white/20">{v.orphans.length}</span>
            </button>
          )}

          {v.underprivileged && (
            <button
              onClick={() => setActiveTab('underprivileged')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'underprivileged' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-[#555] hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              کم‌برخوردار
              <span className="px-1.5 text-[10px] rounded-full bg-white/20">{v.underprivileged.length}</span>
            </button>
          )}

          {v.disabilityStats && (
            <button
              onClick={() => setActiveTab('disability')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'disability' ? 'bg-[#4f46e5] text-white shadow-sm' : 'text-[#555] hover:bg-slate-100'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              کم‌توانی و سلامت
            </button>
          )}
        </div>

        {/* ═══ CONTENT BODY ═══ */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ contentVisibility: 'auto' }}>

          {/* Loading State Skeleton */}
          {loadingDetails && (
            <div className="space-y-6 w-full animate-pulse">
              <style>{`
                .shimmer {
                  background: linear-gradient(90deg, #f0e9d9 25%, #ffffff 50%, #f0e9d9 75%);
                  background-size: 200% 100%;
                  animation: shimmerLoad 1.5s infinite;
                }
                @keyframes shimmerLoad {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}</style>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Main Population Card - Spans 8 cols */}
                <SpotlightCard className="sm:col-span-8 relative p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-xl overflow-hidden group" spotlightColor="rgba(255,255,255,0.15)">
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                     <svg width="300" height="100" viewBox="0 0 300 100"><path d="M0,100 C50,80 100,120 150,60 C200,0 250,90 300,40 L300,100 Z" fill="white"/></svg>
                  </div>
                  <Users className="absolute -left-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-sm font-bold text-indigo-100 block mb-1">جمعیت ساکن و فعال</span>
                  <div className="flex items-baseline gap-2">
                     <div className="text-5xl font-black tracking-tighter">{v.population ? v.population.toLocaleString('fa-IR') : '—'}</div>
                     <span className="text-sm font-bold text-indigo-200">نفر</span>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                     <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                     آخرین سرشماری میدانی
                  </div>
                </SpotlightCard>

                {/* Secondary Cards */}
                <SpotlightCard className="sm:col-span-4 relative p-5 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden group" spotlightColor="rgba(99, 102, 241, 0.05)">
                  <Home className="absolute -left-2 -bottom-2 w-20 h-20 text-slate-100 group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-xs font-bold text-slate-400 block">تعداد خانوار</span>
                  <div className="text-3xl font-black text-slate-800 mt-1">{v.households ? v.households.toLocaleString('fa-IR') : '—'}</div>
                  <svg className="absolute right-0 bottom-4 w-full h-8 opacity-40" preserveAspectRatio="none" viewBox="0 0 100 20"><polyline points="0,20 20,15 40,18 60,10 80,12 100,5" fill="none" stroke="#cbd5e1" strokeWidth="2"/></svg>
                </SpotlightCard>

                <SpotlightCard className="sm:col-span-6 relative p-5 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden group" spotlightColor="rgba(99, 102, 241, 0.05)">
                  <GraduationCap className="absolute -left-2 -bottom-2 w-20 h-20 text-emerald-50 group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-xs font-bold text-emerald-600 block">دانش‌آموزان (محصلین ابتدایی)</span>
                  <div className="text-3xl font-black text-emerald-700 mt-1">{v.schools ? v.schools.reduce((a, s) => a + s.total, 0).toLocaleString('fa-IR') : 0}</div>
                  <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full w-2/3"></div></div>
                </SpotlightCard>

                <SpotlightCard className="sm:col-span-6 relative p-5 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden group" spotlightColor="rgba(99, 102, 241, 0.05)">
                  <HeartHandshake className="absolute -left-2 -bottom-2 w-20 h-20 text-rose-50 group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-xs font-bold text-rose-500 block">پرونده‌های حمایتی (ایتام و نیازمندان)</span>
                  <div className="text-3xl font-black text-rose-600 mt-1">{((v.orphans?.length || 0) + (v.underprivileged?.length || 0)).toLocaleString('fa-IR')}</div>
                  <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-rose-400 rounded-full w-3/4"></div></div>
                </SpotlightCard>
              </div>

              {/* Geographic Info */}
              <div className="bg-slate-100 p-5 rounded-2xl border border-[#111111]/10">
                <h3 className="text-sm font-extrabold text-[#4f46e5] flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4" />
                  مشخصات اداری و موقعیت جغرافیایی
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/80 p-3 rounded-xl border border-stone-300">
                    <span className="text-stone-500 block mb-1">استان / شهرستان:</span>
                    <strong className="text-stone-800 text-sm">{v.province}، {v.county}</strong>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-stone-300">
                    <span className="text-stone-500 block mb-1">بخش و دهستان:</span>
                    <strong className="text-stone-800 text-sm">{v.district}</strong>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-stone-300">
                    <span className="text-stone-500 block mb-1">مختصات ماهواره‌ای:</span>
                    <strong className="text-[#4f46e5] font-mono text-sm">{v.coordinates}</strong>
                  </div>
                </div>
              </div>

              {/* Infrastructure */}
              {v.infrastructure && (
                <div>
                  <h3 className="text-base font-extrabold text-[#4f46e5] flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-[#cbd5e1]" />
                    زیرساخت‌ها و اماکن عمومی
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {v.infrastructure.map((inf: InfrastructureItem, idx: number) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-[#cbd5e1]/30 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
                        <div>
                          <div className="font-bold text-stone-900">{inf.name}</div>
                          <div className="text-xs text-stone-500 mt-1">مساحت: {inf.area}</div>
                        </div>
                        <div className="bg-[#4f46e5]/10 text-[#4f46e5] font-extrabold text-xs px-2.5 py-1 rounded-full">
                          {inf.stat} {inf.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ MAP TAB ═══ */}
          {activeTab === 'map' && (
            <div className="relative w-full h-[60vh] min-h-[400px] bg-black rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
              <img src={coverImg} alt="نقشه هوایی" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[15s] hover:scale-110 cursor-crosshair" />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl font-mono shadow-xl">
                نقشه هوایی ماهواره‌ای - روستای {village.name}
              </div>
            </div>
          )}

          {/* ═══ TAB 2: SCHOOLS — Comparative Bar Chart ═══ */}
          {activeTab === 'schools' && v.schools && !loadingDetails && (
            <div className="space-y-5">
              <h3 className="text-base font-extrabold text-[#4f46e5] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#cbd5e1]" />
                مقایسه بصری مدارس
              </h3>

              {/* Visual Bar Comparison */}
              <div className="space-y-3">
                {(() => {
                  const maxTotal = Math.max(...v.schools.map((s: SchoolGradeStats) => s.total));
                  const barColors = ['#4f46e5', '#cbd5e1', '#4d7c6a', '#6b8fa3', '#6366f1'];
                  return v.schools.map((s: SchoolGradeStats, idx: number) => (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-stone-800 text-sm">{s.schoolName}</span>
                        <span className="text-lg font-black" style={{ color: barColors[idx % barColors.length] }}>
                          {s.total} <span className="text-xs font-bold text-stone-400">نفر</span>
                        </span>
                      </div>
                      <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(s.total / maxTotal) * 100}%`,
                            background: `linear-gradient(90deg, ${barColors[idx % barColors.length]}cc, ${barColors[idx % barColors.length]})`,
                          }}
                        />
                      </div>
                      {/* Grade breakdown chips */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {[
                          { label: 'پیش', val: s.preSchool },
                          { label: 'اول', val: s.grade1 },
                          { label: 'دوم', val: s.grade2 },
                          { label: 'سوم', val: s.grade3 },
                          { label: 'چهارم', val: s.grade4 },
                          { label: 'پنجم', val: s.grade5 },
                          { label: 'ششم', val: s.grade6 },
                        ].map((g, gi) => (
                          <span key={gi} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">
                            {g.label}: {g.val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Totals Summary */}
              <div className="bg-slate-100 p-4 rounded-xl border border-[#111111]/10 flex items-center justify-between">
                <span className="font-extrabold text-stone-700">جمع کل دانش‌آموزان:</span>
                <span className="text-2xl font-black text-[#4f46e5]">
                  {v.schools.reduce((a: number, s: SchoolGradeStats) => a + s.total, 0).toLocaleString('fa-IR')} نفر
                </span>
              </div>
            </div>
          )}

          {/* ═══ TAB 3: ORPHANS — Card Layout ═══ */}
          {activeTab === 'orphans' && v.orphans && !loadingDetails && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#4f46e5] flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-[#6366f1]" />
                    ایتام تحت پوشش ({v.orphans.length} پرونده)
                  </h3>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="جستجوی نام، سرپرست یا آدرس..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    className="w-full pl-3 pr-9 py-2 bg-white text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
                  />
                </div>
              </div>

              {/* Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredOrphans.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((o: OrphanRecord, idx: number) => {
                  const hasHealthIssue = o.healthStatus.includes('دندان') || o.healthStatus.includes('حلق') || o.healthStatus.includes('بینی') || o.healthStatus.includes('ناشنوا');
                  return (
                    <SpotlightCard key={o.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 hover:shadow-md transition-shadow" spotlightColor="rgba(99, 102, 241, 0.08)">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#4f46e5]/10 flex items-center justify-center flex-shrink-0">
                            <UserCircle className="w-5 h-5 text-[#4f46e5]" />
                          </div>
                          <div>
                            <div className="font-extrabold text-[#4f46e5] text-sm">{o.childName} {o.childLastName}</div>
                            <div className="text-[11px] text-stone-500">فرزند {o.fatherName} · سن: {o.childAge}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                          hasHealthIssue ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {hasHealthIssue ? '⚠ نیاز درمانی' : '✓ سالم'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-stone-50 rounded-lg p-2">
                          <span className="text-stone-400 block">مقطع:</span>
                          <span className="font-bold text-stone-700">{o.educationLevel}</span>
                        </div>
                        <div className="bg-stone-50 rounded-lg p-2">
                          <span className="text-stone-400 block">مدرسه:</span>
                          <span className="font-bold text-stone-700">{o.schoolName}</span>
                        </div>
                        <div className="bg-stone-50 rounded-lg p-2">
                          <span className="text-stone-400 block">سرپرست:</span>
                          <span className="font-bold text-stone-700">{o.guardianName}</span>
                        </div>
                        <div className="bg-stone-50 rounded-lg p-2">
                          <span className="text-stone-400 block">تماس:</span>
                          <span className="font-bold text-stone-700 font-mono">{maskPhone(o.phone)}</span>
                        </div>
                      </div>

                      <div className="mt-2 text-[10px] text-stone-500 truncate flex items-center gap-1" title={o.address}>
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {o.address}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Pagination current={page} total={orphanPages} onChange={setPage} />
            </div>
          )}

          {/* ═══ TAB 4: UNDERPRIVILEGED — Card Layout ═══ */}
          {activeTab === 'underprivileged' && v.underprivileged && !loadingDetails && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base font-extrabold text-[#4f46e5] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#6366f1]" />
                  خانوارهای کم‌برخوردار ({v.underprivileged.length} خانوار)
                </h3>
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="جستجوی نام یا آدرس..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    className="w-full pl-3 pr-9 py-2 bg-white text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredUnderprivileged.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((u: UnderprivilegedRecord, idx: number) => (
                  <div key={u.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 hover:shadow-md transition-shadow flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-900 text-sm">{u.fullName}</div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-stone-500">
                        <span className="font-mono">{maskNationalId(u.nationalId)}</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {maskPhone(u.phone)}
                        </span>
                      </div>
                      <div className="mt-1.5 text-[10px] text-stone-400 truncate flex items-center gap-1" title={u.address}>
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {u.address}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination current={page} total={underprivilegedPages} onChange={setPage} />
            </div>
          )}

          {/* ═══ TAB 5: DISABILITY — Donut Chart ═══ */}
          {activeTab === 'disability' && v.disabilityStats && !loadingDetails && (
            <div className="space-y-5">
              <h3 className="text-base font-extrabold text-[#4f46e5] flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-[#6366f1]" />
                پایش معلولیت‌ها و نیازهای توانبخشی
              </h3>
              <DonutChart data={v.disabilityStats} />
            </div>
          )}
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="px-6 py-3 bg-slate-100 border-t border-[#111111]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-600 gap-2 flex-shrink-0">
          <span>سامانه ثبت داده‌های عملیاتی پایگاه‌های جهادی امام‌رضایی‌ها در شهرستان خرمشهر</span>
          <span className="font-mono text-stone-500">منطقه عملیاتی شلمچه و حومه غربی</span>
        </div>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
};
