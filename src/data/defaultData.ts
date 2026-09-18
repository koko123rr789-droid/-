import { StudyPlatform, GameItem, BackgroundSetting } from '../types';

export const INITIAL_PLATFORMS: StudyPlatform[] = [
  {
    id: 'jaw-academy',
    name: 'منصة جو أكاديمي',
    nameEn: 'Jaw Academy',
    url: 'https://jawacademy.net',
    description: 'المنصة التعليمية الشاملة للثانوية العامة والدروس والامتحانات والمتابعة الأكاديمية.',
    category: 'primary',
    color: 'from-amber-500 to-yellow-600',
    iconName: 'GraduationCap',
    dailyLimitMinutes: 300, // 5 hours daily limit as requested!
    usedTodaySeconds: 0,
    isFavorite: true,
  },
  {
    id: 'mag-academy',
    name: 'منصة MAG أكاديمي',
    nameEn: 'MAG Academy',
    url: 'https://magacademy.co',
    description: 'أكاديمية MAG التعليمية المتخصصة في شروحات المواد والمراجعات النهائية والاختبارات.',
    category: 'primary',
    color: 'from-emerald-500 to-teal-600',
    iconName: 'BookOpen',
    dailyLimitMinutes: 300, // 5 hours daily limit as requested!
    usedTodaySeconds: 0,
    isFavorite: true,
  },
  {
    id: 'abdelmaaboud',
    name: 'منصة مستر محمد عبدالمعبود',
    nameEn: 'Abdelmaaboud Physics',
    url: 'https://abdelmaaboud.com',
    description: 'المنصة الرسمية لكبير معلمي الفيزياء لشرح المنهج وحل التدريبات ونماذج الامتحانات.',
    category: 'primary',
    color: 'from-blue-500 to-indigo-600',
    iconName: 'Zap',
    dailyLimitMinutes: 300, // 5 hours daily limit as requested!
    usedTodaySeconds: 0,
    isFavorite: true,
  },
  {
    id: 'englishawy',
    name: 'منصة انجلشاوي',
    nameEn: 'Mr Englishawy',
    url: 'https://www.mrenglishawy.com',
    description: 'منصة مستر انجلشاوي لإتقان اللغة الإنجليزية، الجرامر، المهارات وقطع الفهم.',
    category: 'primary',
    color: 'from-rose-500 to-pink-600',
    iconName: 'Compass',
    dailyLimitMinutes: 300, // 5 hours daily limit as requested!
    usedTodaySeconds: 0,
    isFavorite: true,
  },
  {
    id: 'waleed-mohsen',
    name: 'منصة أستاذي - وليد محسن',
    nameEn: 'Waleed Mohsen - Ostazy',
    url: 'https://waleed-mohsen.com',
    description: 'منصة أستاذي لتعليم اللغة العربية والنحو والبلاغة والأدب والنصوص بأحدث الطرق.',
    category: 'primary',
    color: 'from-purple-500 to-violet-600',
    iconName: 'Target',
    dailyLimitMinutes: 300, // 5 hours daily limit as requested!
    usedTodaySeconds: 0,
    isFavorite: true,
  },
];

export const GAMES_CATALOG: GameItem[] = [
  {
    id: 'water-sort-puzzle',
    title: 'فرز الألوان والمياه',
    subtitle: 'Water Sort Color Match',
    category: 'ذكاء وتفكير • Google Play',
    icon: 'Sparkles',
    difficulty: 'ممتع وذكي',
    packageName: 'com.water.sort.color.match.puzzle.game',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.water.sort.color.match.puzzle.game',
    description: 'لعبة ترتيب وتفريغ السوائل الملونة في الأنابيب الزجاجية حتى يصبح كل أنبوب بلون موحد. تنمي الصبر والدقة والهدوء الذهني.',
  },
  {
    id: 'gears-racing',
    title: 'سباق التروس والسرعة',
    subtitle: 'Gears Racing Speed',
    category: 'سباق وانتباه • Google Play',
    icon: 'Zap',
    difficulty: 'حماسي وسريع',
    packageName: 'com.y4444.gears.racing',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.y4444.gears.racing',
    description: 'لعبة قيادة وتبديل تروس السرعة والتسارع بدقة مع تجنب السيارات المنافسة واستخدام نيترو الحسم في الوقت المناسب.',
  },
  {
    id: 'math-lightning',
    title: 'تحدي عباقرة الرياضيات',
    subtitle: 'سرعة الحساب الذهني الخاطف',
    category: 'حساب وتركيز',
    icon: 'Calculator',
    difficulty: 'متدرج',
    description: 'اختبر سرعة استجابة عقلك لحل العمليات الرياضية السريعة قبل انتهاء المؤقت لرفع معدل التركيز واليقظة الذهنية.',
  },
  {
    id: 'memory-matrix',
    title: 'مصفوفة بطاقات الذاكرة',
    subtitle: 'تقوية الذاكرة الصورية والتركيز',
    category: 'ذاكرة وتنشيط',
    icon: 'Sparkles',
    difficulty: 'متوسط',
    description: 'اكتشف وطابق أزواج الرموز والمفاهيم المتطابقة في أقل عدد من الحركات لتثبيت قوة الاسترجاع السريع.',
  },
  {
    id: 'game-2048',
    title: 'لغز الأرقام 2048',
    subtitle: 'التخطيط الاستراتيجي الصامت',
    category: 'ألغاز وتخطيط',
    icon: 'Grid',
    difficulty: 'ممتع وتكتيكي',
    description: 'ادمج المربعات المتشابهة لتصل إلى مربع 2048 واستمتع بفترة راحة ذهنية منظمة بعيداً عن التشتت.',
  },
  {
    id: 'reflex-trigger',
    title: 'اختبار سرعة رد الفعل',
    subtitle: 'تنشيط رد الفعل العصبي والانتباه',
    category: 'انتباه وتحدي',
    icon: 'Zap',
    difficulty: 'سريع جداً',
    description: 'قس سرعتك بالمللي ثانية عند تحول الشاشة للون الأخضر! رائع لكسر روتين المذاكرة الطويلة.',
  },
];

export const MOTIVATIONAL_QUOTES = [
  {
    quote: 'مهمة تحديد المستقبل والمصير والتنافس.. ولابد أن تكون بابا المجال!',
    author: 'شعار التفوق والإصرار',
    tag: 'شعار اليوم',
  },
  {
    quote: 'مستقبلك بإيدك، وكل دقيقة تركيز الآن هي درجة في كليتك اللي بتحلم بيها.',
    author: 'طموح وإصرار',
    tag: 'تحفيز',
  },
  {
    quote: 'لا يوجد مستحيل أمام قلبٍ ينبض بالطموح وعقلٍ يثق بقدراته وبفضل الله أولاً.',
    author: 'همة حتى القمة',
    tag: 'ثقة',
  },
  {
    quote: 'التعب يزول والدرجات والأفراح تبقى.. ختامها فرحة لا توصف يوم النتيجة بإذن الله.',
    author: 'فرحة التخرج',
    tag: 'أمل',
  },
  {
    quote: 'قسّم وقتك بدقة: 5 ساعات دراسة حقيقية بتركيز كامل تصنع منك الأول على الجمهورية.',
    author: 'نصيحة تنظيم',
    tag: 'تركيز',
  },
];

export const DEFAULT_BACKGROUND_SETTING: BackgroundSetting = {
  mode: 'thanaweya_poster',
  darknessOverlay: 55, // 55% dim to ensure high contrast text & buttons
  enableParticles: true,
  enableRays: true,
};
