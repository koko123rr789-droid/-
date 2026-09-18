import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Upload, 
  ExternalLink, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Moon, 
  Sun, 
  Smartphone, 
  Sparkles,
  Download,
  PenTool,
  Save
} from 'lucide-react';
import { playSound } from '../utils/audioSynth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PACKAGE_NAME = 'com.samsung.android.app.notes';

const PRESET_GUIDES = [
  {
    id: 'physics-sheet',
    title: 'مفاهيم وقوانين الفيزياء الحديثة والكلاسيكية',
    instructor: 'مستر محمد عبدالمعبود',
    pages: 42,
    badge: 'فيزياء 2026',
    color: 'from-blue-600 to-cyan-700',
    content: `⚡ ملخص قوانين الفيزياء - مستر محمد عبدالمعبود:
1. قانون أوم: V = I * R
2. قانون أوم للدائرة المغلقة: I = VB / (R_eq + r)
3. المقاومة النوعية: ρe = (R * A) / L
4. التوصيلية الكهربية: σ = 1 / ρe = L / (R * A)
5. القدرة الكهربية المستنفدة: P_w = V * I = I² * R = V² / R
6. الطاقة الكهربية: W = P_w * t
7. قانون كيرشوف الأول (نقطة التفرع): Σ I_in = Σ I_out
8. قانون كيرشوف الثاني (المسار المغلق): Σ VB = Σ (I * R)
9. كثافة الفيض المغناطيسي لسلك مستقيم: B = (μ * I) / (2π * d)
10. الملف الدائري: B = (μ * N * I) / (2 * r)
11. الملف اللولبي: B = (μ * N * I) / L
12. القوة المغناطيسية المؤثرة على سلك: F = B * I * L * sin(θ)
13. عزم الازدواج: τ = B * I * A * N * sin(θ)
14. قانون فاراداي للحث الكهرومغناطيسي: emf = -N * (ΔΦm / Δt)
15. معادلة دي برولي: λ = h / (m * v)
16. ظاهرة كومتون ومفعول بلانك: E = h * ν = m * c²`,
  },
  {
    id: 'english-sheet',
    title: 'كتيب الجرامر والمصطلحات والتراكيب الشاملة',
    instructor: 'مستر انجلشاوي (Mr Englishawy)',
    pages: 36,
    badge: 'إنجليزي 2026',
    color: 'from-amber-600 to-yellow-700',
    content: `🇬🇧 English Final Revision - Mr Englishawy:
• Present Simple vs Present Continuous:
  - Habitual actions vs actions happening now / temporary.
• Past Simple vs Past Continuous & Past Perfect:
  - While + Past Continuous, Past Simple.
  - After / As soon as + Past Perfect (had + P.P.), Past Simple.
  - By the time / Before + Past Simple, Past Perfect.
• Relative Clauses (who, whom, which, whose, where, when):
  - That cannot be preceded by a preposition or a non-defining comma.
• Conditionals (If Zero, 1st, 2nd, 3rd, Mixed):
  - Zero: If + Pres. Simple, Pres. Simple (facts).
  - 1st: If + Pres. Simple, will + inf (real possibilities).
  - 2nd: If + Past Simple, would + inf (unreal present).
  - 3rd: If + Past Perfect, would have + P.P. (regret in past).
• Passive Voice Mastery:
  - Subject + verb to be (in tense) + Past Participle + by agent.
• Reported Speech shifts (Tenses, Time words, Pronouns).`,
  },
  {
    id: 'arabic-sheet',
    title: 'خرائط النحو والإعراب والبلاغة ونصوص المراجعة',
    instructor: 'منصة أستاذي - وليد محسن',
    pages: 48,
    badge: 'لغة عربية',
    color: 'from-emerald-600 to-teal-700',
    content: `📖 خرائط النحو الذهبية - منصة أستاذي وليد محسن:
1. كان وأخواتها وأفعال المقاربة والرجاء والشروع (كاد وأخواتها):
   - يشترط في خبر أفعال الشروع والمقاربة أن يكون جملة فعلية فعلها مضارع.
   - يمتنع اقتران خبر أفعال الشروع بـ (أن).
2. إن وأخواتها ولا النافية للجنس:
   - شروط عمل لا النافية للجنس عمل إن:
     أ) أن يكون اسمها وخبرها نكرتين.
     ب) ألا يفصل بينها وبين اسمها فاصل.
     ج) ألا تسبق بحرف جر.
3. المشتقات العاملة (اسم الفاعل، صيغ المبالغة، اسم المفعول):
   - معمول اسم الفاعل وصيغ المبالغة: فاعل أو مفعول به.
   - معمول اسم المفعول: نائب فاعل مرفوع دائماً.
4. إعراب المصادر والمفاعيل الخمسة:
   - المفعول به، المفعول المطلق، المفعول لأجله، المفعول معه، والمفعول فيه (الظرف).
5. أسلوب الاستثناء: (تام مثبت، تام منفي، ناقص منفي حسب موقعه في الجملة).
6. جزم المضارع في جواب الطلب وأدوات الشرط الجازمة.`,
  },
  {
    id: 'jaw-mag-sheet',
    title: 'بنك أسئلة وتدريبات الثانوية العامة الشاملة',
    instructor: 'منصة Jaw Academy & MAG Academy',
    pages: 55,
    badge: 'مراجعة عامة',
    color: 'from-purple-600 to-indigo-700',
    content: `🎯 استراتيجيات حل نماذج الامتحانات:
1. اقرأ رأس السؤال كاملاً حتى علامة الاستفهام.
2. استبعد الإجابات غير المنطقية أولاً (طريقة الاستبعاد الذكي).
3. في المسائل الفيزيائية: استخرج المعطيات بالوحدات الدولية (SI Units).
4. في أسئلة المقال: نظّم خطواتك في نقاط واضحة واكتب القوانين الرياضية أولاً لتحصيل درجات الخطوات.
5. راجع إجاباتك ورتب وقتك: خصص 15 دقيقة لمراجعة ورقة البابل شيت والتأكد من تظليل الدوائر بشكل واضح.`,
  },
];

export const PdfReaderModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('physics-sheet');
  const [userPdfUrl, setUserPdfUrl] = useState<string | null>(null);
  const [userPdfName, setUserPdfName] = useState<string>('');
  const [pdfPage, setPdfPage] = useState<number>(1);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isPdfRendering, setIsPdfRendering] = useState<boolean>(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isNightMode, setIsNightMode] = useState<boolean>(true);
  const [studyNotes, setStudyNotes] = useState<string>(() => {
    return localStorage.getItem('thanaweya_pdf_notes') || '';
  });
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('thanaweya_pdf_notes', studyNotes);
  }, [studyNotes]);

  // Render PDF.js page onto canvas when pdfDoc, page, or zoom changes
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;
    const renderPage = async () => {
      try {
        setIsPdfRendering(true);
        const page = await pdfDoc.getPage(pdfPage);
        if (isCancelled || !canvasRef.current) return;

        const viewport = page.getViewport({ scale: (zoomLevel / 100) * 1.5 });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      } catch (err) {
        console.warn('Error rendering PDF page:', err);
      } finally {
        if (!isCancelled) setIsPdfRendering(false);
      }
    };

    renderPage();
    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pdfPage, zoomLevel]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept any PDF by name or type
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type.includes('pdf')) || true;
    if (!isPdf) {
      alert('يرجى اختيار ملف بصيغة PDF.');
      return;
    }

    const url = URL.createObjectURL(file);
    setUserPdfUrl(url);
    setUserPdfName(file.name);
    playSound('success');

    // Parse with PDF.js if available
    try {
      if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = (window as any).pdfjsLib.getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setPdfTotalPages(doc.numPages);
        setPdfPage(1);
      }
    } catch (err) {
      console.warn('PDF.js loading note:', err);
    }
  };

  const handleOpenSamsungNotes = () => {
    playSound('click');
    // Try launching Samsung Notes package via Android intent, fallback to Play Store
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      window.location.href = `intent://#Intent;package=${PACKAGE_NAME};action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end;`;
      setTimeout(() => {
        window.open(`https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`, '_blank');
      }, 1200);
    } else {
      window.open(`https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`, '_blank');
    }
  };

  const currentPreset = PRESET_GUIDES.find((p) => p.id === selectedPresetId) || PRESET_GUIDES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative bg-neutral-900 border-2 border-amber-500/40 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-right">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-neutral-900 rounded-[14px] flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base sm:text-lg font-heading">
                  قارئ ومكتبة ملازم ومذكرات PDF
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {PACKAGE_NAME}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                تصفح مذكرات الأساتذة، ورفع ملازمك الخاصة، وتدوين الملاحظات أثناء المذاكرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Launch Samsung Notes button */}
            <button
              onClick={handleOpenSamsungNotes}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
              title="فتح تطبيق Samsung Notes المثبت على الهاتف"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">فتح في Samsung Notes</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </button>

            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Document Switcher */}
        <div className="px-4 py-2 bg-neutral-950/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          
          {/* Presets List */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {PRESET_GUIDES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  playSound('click');
                  setUserPdfUrl(null);
                  setSelectedPresetId(preset.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  !userPdfUrl && selectedPresetId === preset.id
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {preset.title.split(' ')[0]} - {preset.instructor.split(' ')[1] || preset.instructor}
              </button>
            ))}

            {/* Custom Upload Button */}
            <label className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer flex items-center gap-1.5 border transition-all ${
              userPdfUrl
                ? 'bg-emerald-500 text-neutral-950 border-emerald-400 shadow-md'
                : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200'
            }`}>
              <Upload className="w-3.5 h-3.5" />
              <span>{userPdfName ? `ملفي: ${userPdfName.substring(0, 12)}...` : 'رفع ملزمة PDF من جهازي'}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Viewer Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-amber-400 w-12 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              title={isNightMode ? 'وضع القراءة الفاتح' : 'وضع القراءة الليلي لحماية العين'}
            >
              {isNightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>
          </div>

        </div>

        {/* Content Body: Split between Document Viewer and Quick Notes */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Main Document Viewer (8 cols) */}
          <div className={`lg:col-span-8 h-full overflow-y-auto p-4 sm:p-6 transition-colors ${
            isNightMode ? 'bg-neutral-950 text-neutral-200' : 'bg-white text-neutral-900'
          }`}>
            
            {userPdfUrl ? (
              <div className="w-full h-full flex flex-col space-y-3">
                {/* Control bar for user PDF */}
                <div className="p-3 bg-neutral-900 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-xs">📄 {userPdfName || 'ملزمة الطالب'}</span>
                    {pdfTotalPages > 1 && (
                      <span className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                        صفحة {pdfPage} من {pdfTotalPages}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {pdfTotalPages > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          disabled={pdfPage <= 1}
                          onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                          className="px-2 py-1 text-xs rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-40"
                        >
                          السابقة
                        </button>
                        <button
                          disabled={pdfPage >= pdfTotalPages}
                          onClick={() => setPdfPage((p) => Math.min(pdfTotalPages, p + 1))}
                          className="px-2 py-1 text-xs rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-40"
                        >
                          التالية
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => window.open(userPdfUrl, '_blank')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                      title="فتح في عارض الهاتف المستقل / Google Drive / متصفح الهاتف"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح بملء الشاشة ↗</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserPdfUrl(null);
                        setUserPdfName('');
                        setPdfDoc(null);
                      }}
                      className="px-2 py-1 text-xs rounded bg-red-900/50 text-red-200 hover:bg-red-800"
                      title="إغلاق هذا الملف"
                    >
                      إلغاء الملف
                    </button>
                  </div>
                </div>

                {/* PDF Viewer Display: Canvas or Embedded Object */}
                <div className="flex-1 w-full min-h-[520px] rounded-2xl overflow-auto border border-neutral-700 bg-neutral-900 flex items-center justify-center p-2">
                  {pdfDoc ? (
                    <canvas
                      ref={canvasRef}
                      className="max-w-full shadow-2xl rounded-lg mx-auto block bg-white"
                    />
                  ) : (
                    <object
                      data={userPdfUrl}
                      type="application/pdf"
                      className="w-full h-full min-h-[520px] rounded-xl"
                    >
                      <iframe
                        src={`${userPdfUrl}#toolbar=1&navpanes=1`}
                        className="w-full h-full min-h-[520px] border-none"
                        title="ملزمة الطالب الشخصية"
                      />
                    </object>
                  )}
                </div>
              </div>
            ) : (
              <div 
                className="space-y-4 max-w-3xl mx-auto transition-transform origin-top"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                {/* Header of the guide */}
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500 text-neutral-950">
                      {currentPreset.badge}
                    </span>
                    <h4 className="text-base sm:text-lg font-black mt-1 font-heading text-amber-400">
                      {currentPreset.title}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      إعداد وشرح: {currentPreset.instructor}
                    </p>
                  </div>
                  <div className="text-left text-xs text-neutral-400 font-mono">
                    {currentPreset.pages} صفحة مراجعة
                  </div>
                </div>

                {/* Printable Study Sheet Content */}
                <div className={`p-5 rounded-2xl border font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-inner ${
                  isNightMode 
                    ? 'bg-neutral-900/90 border-neutral-800 text-neutral-200' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}>
                  {currentPreset.content}
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
                  <span>💡 نصيحة: يمكنك حفظ هذه القوانين والمفاهيم في مفكرتك اليومية أو فتح ملزمتك الخاصة بصيغة PDF.</span>
                </div>
              </div>
            )}

          </div>

          {/* Quick Notes Pad (4 cols) */}
          <div className="lg:col-span-4 h-full bg-neutral-900/95 border-t lg:border-t-0 lg:border-r border-neutral-800 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <PenTool className="w-4 h-4" />
                <span>ملاحظات وتلخيصات المذاكرة</span>
              </div>
              <button
                onClick={() => {
                  playSound('success');
                  setSaveToast(true);
                  setTimeout(() => setSaveToast(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1"
              >
                <Save className="w-3 h-3" />
                <span>حفظ</span>
              </button>
            </div>

            <textarea
              value={studyNotes}
              onChange={(e) => setStudyNotes(e.target.value)}
              placeholder="سجل هنا أهم القوانين والملاحظات التي تحتاج حفظها أثناء قراءة الملزمة..."
              className="flex-1 my-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 resize-none focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
            />

            {saveToast && (
              <div className="text-[11px] text-emerald-400 text-center font-bold py-1 animate-pulse">
                ✓ تم حفظ الملاحظات تلقائياً في المتصفح
              </div>
            )}

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
              <span>مرتبط بـ Samsung Notes</span>
              <span>حفظ محلي آمن 🔒</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
