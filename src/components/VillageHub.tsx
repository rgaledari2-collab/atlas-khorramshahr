import React from 'react';
import { VillageData, VILLAGES_DATA } from '../data/villages';
import { ArrowLeft, BarChart3, Stethoscope, ArrowRight, MapPin, Users, School, ArrowUpRight } from 'lucide-react';

interface VillageHubProps {
  village: VillageData;
  onBackToMap: () => void;
  onOpenStats: () => void;
  onOpenServices: () => void;
  onSelectAnotherVillage: (village: VillageData) => void;
}


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

export const VillageHub: React.FC<VillageHubProps> = ({
  village,
  onBackToMap,
  onOpenStats,
  onOpenServices,
  onSelectAnotherVillage,
}) => {
  const coverImg = mapImages[village.id] || '/main_map_final.webp';

  return (
    <div className="absolute inset-0 z-30 flex bg-[#0c1414] text-[#f3ebdd] overflow-hidden animate-fade-in" dir="rtl">
      {/* Left Sidebar (30%) */}
      <div className="w-full sm:w-[380px] md:w-[420px] flex-shrink-0 bg-[#111e1d] border-l border-[#c6a15b]/20 flex flex-col h-full shadow-2xl z-10 relative">
        
        {/* Header / Topbar */}
        <div className="p-6 border-b border-[#c6a15b]/10">
          <button
            onClick={onBackToMap}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a2d2b] hover:bg-[#233c39] text-[#edd395] border border-[#c6a15b]/30 text-xs font-bold transition-all w-fit cursor-pointer">
            <ArrowRight className="w-4 h-4" />
            بازگشت به نقشه منطقه
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c6a15b]/10 border border-[#c6a15b]/20 text-[10px] font-bold text-[#c6a15b] mb-3">
            <MapPin className="w-3 h-3" />
            <span>حوزه عملیاتی خرمشهر و محور شلمچه</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            روستای {village.name}
          </h1>
          <p className="text-xs text-stone-400 mt-2 leading-relaxed">
            {village.tagline || 'اطلاعات، آمار و وضعیت منطقه تحت پوشش جمعیت بین‌المللی امام‌رضایی‌ها'}
          </p>
        </div>

        {/* Action Cards List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Stats Card */}
          <button
            onClick={onOpenStats}
            className="w-full text-right group relative p-5 rounded-2xl bg-[#162725] hover:bg-[#1c3230] border border-white/5 hover:border-[#c6a15b]/50 transition-all shadow-lg flex flex-col gap-4 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#c6a15b]/10 flex items-center justify-center text-[#edd395]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-1 bg-[#c6a15b]/20 text-[#c6a15b] font-mono rounded-lg">01</span>
            </div>
            <div>
              <div className="text-xs font-bold text-[#c6a15b] mb-1">کارپوشه تخصصی</div>
              <h2 className="text-2xl font-black text-white mb-2">آمار و شناسنامه جمعیتی</h2>
              <p className="text-[11px] text-stone-400 leading-relaxed">جمعیت، آمار تفکیکی مدارس، ایتام، خانوارهای تحت پوشش و توزیع سنی.</p>
            </div>
            
            {/* Mini Stats Summary */}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
              <div className="text-[10px] text-stone-400"><span className="text-white font-bold">{village.population?.toLocaleString('fa-IR') || '—'}</span> نفر جمعیت کل</div>
              <div className="text-[10px] text-stone-400"><span className="text-white font-bold">{village.households?.toLocaleString('fa-IR') || '—'}</span> خانوار مستقر</div>
            </div>
          </button>

          {/* Services Card */}
          <button
            onClick={onOpenServices}
            className="w-full text-right group relative p-5 rounded-2xl bg-[#162725] hover:bg-[#1c3230] border border-white/5 hover:border-[#c6a15b]/50 transition-all shadow-lg flex flex-col gap-4 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#c6a15b]/10 flex items-center justify-center text-[#edd395]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-[10px] px-2 py-1 bg-[#c6a15b]/20 text-[#c6a15b] font-mono rounded-lg">02</span>
            </div>
            <div>
              <div className="text-xs font-bold text-[#c6a15b] mb-1">کارپوشه تخصصی</div>
              <h2 className="text-2xl font-black text-white mb-2">خدمات، زیرساخت و پروژه‌ها</h2>
              <p className="text-[11px] text-stone-400 leading-relaxed">مراکز بهداشت، زیرساخت معابر و آب شرب، طرح‌های توانمندسازی و اشتغال.</p>
            </div>
          </button>

        </div>
      </div>

      {/* Right Map View (70%) */}
      <div className="hidden sm:block flex-1 relative bg-black">
        <img src={coverImg} alt="نقشه هوایی" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[20s] ease-in-out hover:scale-105" />
        
        {/* Top Floating Bar for Map Tools */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between gap-3 z-20">
          <div className="px-4 py-2 bg-[#111e1d]/90 backdrop-blur-md rounded-xl border border-[#c6a15b]/30 text-xs font-bold text-white flex items-center gap-2 shadow-xl">
            <MapPin className="w-4 h-4 text-[#c6a15b]" />
            نقشه هوایی ماهواره‌ای تفصیلی - روستای {village.name}
          </div>
        </div>

        {/* Dynamic Pins Placeholder (Based on infrastructure later) */}
        <div className="absolute inset-0 pointer-events-none">
           {/* We can map over infrastructure and drop pins here if coordinates exist, but for now we show a center pin */}
        </div>

      </div>
    </div>
  );
};
