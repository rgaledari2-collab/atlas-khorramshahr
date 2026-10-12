export interface OrphanRecord {
  id: number;
  guardianName: string;
  guardianAge: string | number;
  guardianNationalId: string;
  childName: string;
  childLastName: string;
  fatherName: string;
  childNationalId: string;
  childAge: string | number;
  educationLevel: string;
  schoolName: string;
  healthStatus: string;
  address: string;
  phone: string;
}

export interface UnderprivilegedRecord {
  id: number;
  fullName: string;
  nationalId: string;
  phone: string;
  address: string;
}

export interface SchoolGradeStats {
  schoolName: string;
  preSchool: string | number;
  grade1: number;
  grade2: number;
  grade3: number;
  grade4: number;
  grade5: number;
  grade6: number;
  total: number;
}

export interface InfrastructureItem {
  name: string;
  area: string;
  stat: string;
  unit: string;
  type: 'health' | 'education' | 'culture' | 'gov' | 'religion';
}

export interface VillageDetails {
  infrastructure?: InfrastructureItem[];
  schools?: SchoolGradeStats[];
  orphans?: OrphanRecord[];
  underprivileged?: UnderprivilegedRecord[];
  disabilityStats?: { label: string; count: number }[];
  notes?: string;
}

export interface VillageData {
  id: string;
  name: string;
  x: number; // percentage on map (0 to 1)
  y: number; // percentage on map (0 to 1)
  tagline?: string;
  province: string;
  county: string;
  district: string;
  coordinates: string;
  population?: number;
  households?: number;
  hasDetails?: boolean;
  orphansCount?: number;
  underprivilegedCount?: number;
  studentsCount?: number;
}

export const VILLAGES_DATA: VillageData[] = [
  {
    id: "soureh",
    name: "سوره",
    x: 0.67,
    y: 0.681,
    tagline: "روستای مرکزی با بیشترین جمعیت و زیرساخت آموزشی و بهداشتی",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی، حومه غربی",
    coordinates: "48.1330° E, 30.4567° N",
    population: 4175,
    households: 1051,
    hasDetails: true,
    orphansCount: 14,
    underprivilegedCount: 56,
    studentsCount: 235
  },
  {
    id: "ariz",
    name: "عریض",
    x: 0.5,
    y: 0.12,
    tagline: "روستای معراج در محور شمالی با نیازهای توسعه آموزشی و حمایتی",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی، حومه غربی",
    coordinates: "48.1345° E, 30.4913° N",
    population: 281,
    households: 74,
    hasDetails: true,
    orphansCount: 1,
    underprivilegedCount: 4,
    studentsCount: 24
  },
  {
    id: "pol-now",
    name: "پل نو",
    x: 0.55,
    y: 0.43,
    tagline: "روستای کلیدی در محور جاده شلمچه با دو مدرسه و مرکز بهداشت",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی، حومه غربی",
    coordinates: "48.1272° E, 30.4711° N",
    population: 1874,
    households: 592,
    hasDetails: true,
    orphansCount: 7,
    underprivilegedCount: 22,
    studentsCount: 94
  },
  {
    id: "jadideh",
    name: "جدیده",
    x: 0.812,
    y: 0.795,
    tagline: "روستای دارای مرکز جامع خدمات سلامت منطقه",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی، حومه غربی",
    coordinates: "48.1450° E, 30.4420° N",
    population: 3200,
    households: 850,
    hasDetails: true,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "sad-dastgah",
    name: "صد دستگاه",
    x: 0.89,
    y: 0.88,
    tagline: "منطقه مسکونی حومه خرمشهر با بافت فشرده",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.1520° E, 30.4350° N",
    population: 2500,
    households: 600,
    hasDetails: true,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "darband-gharbi",
    name: "دربند غربی",
    x: 0.785,
    y: 0.89,
    tagline: "روستای حاشیه رودخانه با ظرفیت‌های کشاورزی و نخلداری",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.1400° E, 30.4310° N",
    population: 1800,
    households: 400,
    hasDetails: true,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "darband-sharqi",
    name: "دربند شرقی",
    x: 0.655,
    y: 0.865,
    tagline: "روستای شرقی مجاور نخلستان‌ها و کانال‌های آب",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.1310° E, 30.4340° N",
    hasDetails: false,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "sarhaniyeh-avval",
    name: "سرحانیه اول",
    x: 0.85,
    y: 0.71,
    tagline: "منطقه سرحانیه با نیازمندی‌های ارتقای امکانات خدماتی",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.1490° E, 30.4510° N",
    hasDetails: false,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "sarhaniyeh-sofla",
    name: "سرحانیه سفلی",
    x: 0.88,
    y: 0.64,
    tagline: "بخش جنوبی سرحانیه مجاور محور دسترسی اصلی",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.1530° E, 30.4590° N",
    hasDetails: false,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "maslavi",
    name: "مصلاوی",
    x: 0.73,
    y: 0.51,
    tagline: "روستای مجاور محور سوره و پل نو",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.1380° E, 30.4680° N",
    hasDetails: false,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "maslavi2",
    name: "مصلاوی ۲",
    x: 0.8,
    y: 0.47,
    tagline: "بخش الحاقی روستای مصلاوی",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.1420° E, 30.4710° N",
    hasDetails: false,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "shahrak-sadat",
    name: "شهرک سادات",
    x: 0.83,
    y: 0.38,
    tagline: "شهرک مسکونی محور شمالی غرب خرمشهر",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.1460° E, 30.4790° N",
    hasDetails: false,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "shahrak-sevvom",
    name: "شهرک سوم",
    x: 0.12,
    y: 0.19,
    tagline: "نقطه غربی نزدیک به نوار مرزی شلمچه",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.0750° E, 30.4850° N",
    hasDetails: false,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  },
  {
    id: "mofti-ariz",
    name: "مفتی عریض",
    x: 0.68,
    y: 0.09,
    tagline: "منطقه کشاورزی و دامپروری منتهی‌الیه شمال غربی",
    province: "خوزستان",
    county: "خرمشهر",
    district: "مرکزی",
    coordinates: "48.1390° E, 30.5010° N",
    hasDetails: false,
    orphansCount: 0,
    underprivilegedCount: 0,
    studentsCount: 0
  }
];

export const REGIONAL_HEALTH_INFO = {
  title: "شبکه و دسترسی سلامت منطقه غرب خرمشهر",
  centers: [
    {
      title: "مراکز جامع سلامت",
      desc: "جدیده و امام حسین؛ با حضور پزشک ثابت در مرکز و پزشک چرخشی در خانه‌های بهداشت روستایی.",
      badge: "پوشش عمومی"
    },
    {
      title: "خدمات و مراقبت‌های پایه",
      desc: "بهداشت خانواده و باروری، واکسیناسیون کشوری، دندانپزشکی، تغذیه، سلامت روان، ویزیت پزشک عمومی و داروخانه.",
      badge: "پایه و پیشگیری"
    },
    {
      title: "زمان دسترسی در ساعات کاری",
      desc: "حداکثر ۱۰ دقیقه تا نزدیک‌ترین خانه بهداشت برای دورترین روستاهای تحت پوشش محور شلمچه.",
      badge: "۱۰ دقیقه"
    },
    {
      title: "زمان دسترسی خارج از ساعت اداری",
      desc: "۲۰ الی ۳۰ دقیقه تا بیمارستان‌های شهر خرمشهر (شهید بهشتی و ولیعصر)؛ کمبود فوریت‌های شبانه‌روزی محلی از مهم‌ترین چالش‌های مردم است.",
      badge: "چالش حیاتی"
    }
  ],
  source: "برگرفته از گزارش پایش میدانی «خدمات درمانی و فعالیت» - جمعیت امام‌رضایی‌ها"
};\n