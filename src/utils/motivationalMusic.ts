/**
 * Motivational Music & Anthems Engine for Thanaweya Students
 * Supports:
 * 1. Official YouTube Audio/Video streams for the exact requested tracks:
 *    - سوف نبقى هنا (رامي محمد)
 *    - أحلامنا لا تنتهي
 *    - إفرح وغرد يا فتى
 *    - ختمنا الطريق بصدق المسير
 *    - ولما نسيب الملعب • قف شامخاً
 *    - كن فريداً يا فتى
 * 2. Custom local MP3 files uploaded from student's phone/computer.
 * 3. Custom YouTube links added by student.
 * 4. ABSOLUTELY ZERO synthetic oscillator beeps ("طنين").
 */

import { getAllStoredAudioTracks, saveAudioTrack, deleteStoredAudioTrack } from './audioStorage';

export interface MotivationalTrack {
  id: string;
  title: string;
  artist: string;
  tag: string;
  durationSeconds: number;
  lyrics: string[];
  youtubeId?: string;
  audioUrl?: string;
  isCustom?: boolean;
  type: 'youtube' | 'local_audio';
}

export const OFFICIAL_TRACKS: MotivationalTrack[] = [
  {
    id: 'track-sawfa-nabqa',
    title: 'سوف نبقى هنا',
    artist: 'رامي محمد • كلمات د. عادل المشيطي',
    tag: 'أنشودة الصمود والتفوق • كي يزول الألم',
    durationSeconds: 275,
    youtubeId: 'E5Q1lD_rw3s',
    type: 'youtube',
    lyrics: [
      'سوف نبقى هنا.. كي يزول الألم!',
      'سوف نحيا هنا.. سوف يحلو النغم!',
      'موطني موطني.. موطني ذا الإباء..',
      'رغم كيد العِدا.. رغم كل النقم!',
      'سوف نمضي إلى.. قمة المجد فخراً..',
      'ونزيح الأسى.. وننير الظُّلَم!',
      'هكذا الصبر يا صاحبي.. هكذا العزم فانتظر القمم!',
    ],
  },
  {
    id: 'track-ahlamona',
    title: 'أحلامنا لا تنتهي',
    artist: 'أنشودة الإصرار والهمة العالية',
    tag: 'شكراً أساتذتي • أمي وأبي',
    durationSeconds: 218,
    youtubeId: '7l_fBmU0kXk',
    type: 'youtube',
    lyrics: [
      'أحلامنا لا تنتهي والقلب يبذل ما لديه..',
      'ونفوسنا لا تشتهي شيئاً سوى وصلت إليه!',
      'بالأمس نرتقب الوصول، واليوم نجني الأمنيات..',
      'وطريقنا مهما يطول، الصعب يصبح ذكريات..',
      'شكراً أساتذتي فما دنت الدروب سوى بكم..',
      'معكم مشينا في الطريق، نحيا بفضل علومكم..',
      'أمي سهرتِ ليالياً حتى وصلتُ لما أريد..',
      'وأبي بذلتَ العمر لي ومددتَ كفاً بالمزيد!',
    ],
  },
  {
    id: 'track-efrah',
    title: 'إفرح وغرّد يا فتى',
    artist: 'أنشودة التتويج والتفوق',
    tag: 'قد نالت الروح المنى • أنت الذي ما همه',
    durationSeconds: 195,
    youtubeId: 'F25czPH4Ipg',
    type: 'youtube',
    lyrics: [
      'إفرح وغرّد يا فتى.. قد نالت الروح المنى!',
      'كم كنت تزرع جاهداً، واليوم قلبك قد جنى!',
      'أنت الذي ما همّهُ، صعبٌ يُعرقلُ عزمهُ..',
      'وصرختَ قلتَ أنا لها.. ما ضل خطوك حلمه!',
      'أكمل مسيرك يا فتى، واصعد عُلاك كما تشاء..',
      'هي رحلةٌ وطريقها يهدي الأماني والضياء!',
      'فخرٌ ومثلك يُفتخر.. لك همةٌ لا تنكسر!',
    ],
  },
  {
    id: 'track-khatamna',
    title: 'ختمنا الطريق بصدق المسير',
    artist: 'أنشودة ختام الكفاح والفرحة',
    tag: 'لمجد طلبنا وحلم كبير',
    durationSeconds: 210,
    youtubeId: 'hHPCis9GV0o',
    type: 'youtube',
    lyrics: [
      'ختمنا الطريق بصدق المسير.. لمجدٍ طلبنا وحلمٍ كبير!',
      'وفي الدرب عشنا حياةً وسرنا، بصبرٍ جميلٍ وقلبٍ جسور..',
      'وهبنا خطانا لهذا السفر.. منحنا الليالي لكفّ السهر..',
      'وخضنا معاً كل عسرٍ وما.. ثنى ألف دربٍ ليحيا الأثر!',
      'وظني جميلٌ برب العباد، سيشفي فؤادي بمرأى مرادي!',
    ],
  },
  {
    id: 'track-mal3ab',
    title: 'ولما نسيب الملعب • قف شامخاً',
    artist: 'مونتاج الحسم والبطولة • ثانوية عامة',
    tag: 'اللعبة لعبتك يا هندسة!',
    durationSeconds: 205,
    youtubeId: 'dwb99U2CCJI',
    type: 'youtube',
    lyrics: [
      '«ولما نسيب الملعب.. ما ينفعش نسيبه والماتش لسه شغال!»',
      '«اللعبة لعبتك يا هندسة.. يبقى تكملها لآخر دقيقة!»',
      'ما بال قلبك يائسٌ وبخوفه في الدرب تاه؟',
      'ونسيت حلمك عندما ضاقت عليك سما الحياة؟',
      'أنت المثابر يا فتى، لا لا يليق بك الخضوع..',
      'قف شامخاً فوق القمم.. هذا مقامك لن ندم!',
    ],
  },
  {
    id: 'track-kon-fareedan',
    title: 'كُن فريداً يا فتى',
    artist: 'أنشودة التميز والانطلاق',
    tag: 'أنت أنت فلا تقارن • عزم ما انكسر',
    durationSeconds: 200,
    youtubeId: 'RmGMvAHNQVI',
    type: 'youtube',
    lyrics: [
      '«بس أنا بذلت أقصى مجهود في حياتي.. ومكمل علشان هوصل!»',
      'كُن فريداً يا فتى.. كي يكون لك الأثر!',
      'أنتَ أنتَ فلا تُقارن.. فيك عزمٌ ما انكسر!',
      'كل عُسرٍ في الزمان.. فيه يُسرانِ معاً..',
      'أنت قمتك التي لا تضاهيها سماء!',
    ],
  },
];

export let MOTIVATIONAL_TRACKS: MotivationalTrack[] = [...OFFICIAL_TRACKS];

class MotivationalPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying = false;
  private currentTrackIndex = 0;
  private volume = 0.95;
  private listeners: Array<() => void> = [];
  private isPlayerVisible = false;

  constructor() {
    this.init();
  }

  private async init() {
    await this.loadStoredTracks();
  }

  public async loadStoredTracks() {
    try {
      const stored = await getAllStoredAudioTracks();
      const customTracks: MotivationalTrack[] = (stored || []).map((item) => ({
        id: item.id,
        title: item.title,
        artist: item.artist || 'ملف صوتي MP3 من جهازك',
        tag: '🎵 ملفك الشخصي المرفوع',
        durationSeconds: 240,
        audioUrl: URL.createObjectURL(item.blob),
        isCustom: true,
        type: 'local_audio',
        lyrics: [
          `🎵 استمع الآن لملفك الصوتي: ${item.title}`,
          '«اللهم بارك في وقتي وجهدي وسهل لي كل صعب»',
        ],
      }));

      // Saved custom YouTube links from localStorage
      const customYtSaved = localStorage.getItem('thanaweya_custom_yt_tracks');
      let customYtTracks: MotivationalTrack[] = [];
      if (customYtSaved) {
        try {
          customYtTracks = JSON.parse(customYtSaved);
        } catch {}
      }

      MOTIVATIONAL_TRACKS = [...customTracks, ...customYtTracks, ...OFFICIAL_TRACKS];
      this.notify();
    } catch (e) {
      console.error('Error loading tracks:', e);
    }
  }

  public async addCustomAudioFile(file: File): Promise<MotivationalTrack> {
    const id = `custom-audio-${Date.now()}`;
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
    await saveAudioTrack(id, cleanTitle, 'ملف صوتي MP3', file);

    const objectUrl = URL.createObjectURL(file);
    const newTrack: MotivationalTrack = {
      id,
      title: cleanTitle,
      artist: 'ملف صوتي MP3 من جهازك',
      tag: '⭐ أنشودتك المحفوظة',
      durationSeconds: 240,
      audioUrl: objectUrl,
      isCustom: true,
      type: 'local_audio',
      lyrics: [`🎵 جاري تشغيل: ${cleanTitle}`],
    };

    MOTIVATIONAL_TRACKS = [newTrack, ...MOTIVATIONAL_TRACKS.filter((t) => t.id !== id)];
    this.currentTrackIndex = 0;
    this.play();
    this.notify();
    return newTrack;
  }

  public addCustomYouTubeTrack(title: string, youtubeUrlOrId: string): MotivationalTrack | null {
    // Extract 11-char ID
    const match = youtubeUrlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/) ||
                  youtubeUrlOrId.match(/^[\w-]{11}$/);
    if (!match) return null;

    const ytId = match[1] || match[0];
    const newTrack: MotivationalTrack = {
      id: `custom-yt-${Date.now()}`,
      title: title || 'أنشودة من يوتيوب',
      artist: 'يوتيوب • صوت حقيقي',
      tag: '⭐ رابط يوتيوب مخصص',
      durationSeconds: 240,
      youtubeId: ytId,
      isCustom: true,
      type: 'youtube',
      lyrics: [`🎵 جاري تشغيل: ${title} عبر يوتيوب`],
    };

    MOTIVATIONAL_TRACKS = [newTrack, ...MOTIVATIONAL_TRACKS];
    this.currentTrackIndex = 0;

    // Save custom YT list
    const currentCustomYt = MOTIVATIONAL_TRACKS.filter((t) => t.isCustom && t.type === 'youtube');
    localStorage.setItem('thanaweya_custom_yt_tracks', JSON.stringify(currentCustomYt));

    this.play();
    this.notify();
    return newTrack;
  }

  public async removeCustomTrack(id: string) {
    const track = MOTIVATIONAL_TRACKS.find((t) => t.id === id);
    if (track?.type === 'local_audio') {
      await deleteStoredAudioTrack(id);
    }
    MOTIVATIONAL_TRACKS = MOTIVATIONAL_TRACKS.filter((t) => t.id !== id);

    const currentCustomYt = MOTIVATIONAL_TRACKS.filter((t) => t.isCustom && t.type === 'youtube');
    localStorage.setItem('thanaweya_custom_yt_tracks', JSON.stringify(currentCustomYt));

    if (this.currentTrackIndex >= MOTIVATIONAL_TRACKS.length) {
      this.currentTrackIndex = 0;
    }
    this.stopLocalAudio();
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getPlaybackState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.getCurrentTrack(),
      currentIndex: this.currentTrackIndex,
      volume: this.volume,
      tracksCount: MOTIVATIONAL_TRACKS.length,
      isPlayerVisible: this.isPlayerVisible,
    };
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): MotivationalTrack {
    return MOTIVATIONAL_TRACKS[this.currentTrackIndex] || OFFICIAL_TRACKS[0];
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notify();
  }

  public setTrack(index: number) {
    if (index >= 0 && index < MOTIVATIONAL_TRACKS.length) {
      this.currentTrackIndex = index;
      if (this.isPlaying) {
        this.play();
      } else {
        this.notify();
      }
    }
  }

  public playRandom() {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_TRACKS.length);
    this.currentTrackIndex = randomIndex;
    this.play();
  }

  public play() {
    this.isPlaying = true;
    const track = this.getCurrentTrack();

    if (track.type === 'local_audio' && track.audioUrl) {
      this.startLocalAudio(track.audioUrl);
    } else {
      this.stopLocalAudio();
    }

    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    this.stopLocalAudio();
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % MOTIVATIONAL_TRACKS.length;
    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public prevTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + MOTIVATIONAL_TRACKS.length) % MOTIVATIONAL_TRACKS.length;
    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public togglePlayerVisibility() {
    this.isPlayerVisible = !this.isPlayerVisible;
    this.notify();
  }

  public setPlayerVisibility(v: boolean) {
    this.isPlayerVisible = v;
    this.notify();
  }

  private startLocalAudio(url: string) {
    try {
      if (!this.audioElement) {
        this.audioElement = new Audio();
      }
      this.audioElement.src = url;
      this.audioElement.volume = this.volume;
      this.audioElement.play().catch(() => {});
      this.audioElement.onended = () => {
        this.nextTrack();
      };
    } catch {}
  }

  private stopLocalAudio() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch {}
    }
  }
}

export const motivationalPlayer = new MotivationalPlayer();
export const musicPlayer = motivationalPlayer;
