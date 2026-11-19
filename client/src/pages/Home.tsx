import {
  ArrowDownToLine,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Facebook,
  Grid2X2,
  Heart,
  ImagePlus,
  Instagram,
  Leaf,
  LibraryBig,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  Plus,
  Send,
  Sparkles,
  Sprout,
  Upload,
  WandSparkles,
} from "lucide-react";
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type ViewName = "create" | "calendar" | "library" | "voice";
type Platform = "instagram" | "rednote" | "facebook";

type Bouquet = {
  id: string;
  name: string;
  detail: string;
  image: string;
  color: string;
  accent: string;
};

type CopySet = Record<Platform, string>;

type ScheduleSlot = {
  id: string;
  day: string;
  date: string;
  weekday: string;
  post: {
    title: string;
    platform: Platform;
    time: string;
    color: string;
  } | null;
};

const bouquetImages = "/manus-storage/async-images/";

const initialBouquets: Bouquet[] = [
  {
    id: "peony",
    name: "Blush peony",
    detail: "Peony · Rose · Eucalyptus",
    image: `${bouquetImages}BlkFLtOiPr1JtcDTunVl8O/image-1.webp`,
    color: "#f1d9d4",
    accent: "Petal pink",
  },
  {
    id: "garden",
    name: "Garden day",
    detail: "Ranunculus · Cosmos · Olive",
    image: `${bouquetImages}BlkFLtOiPr1JtcDTunVl8O/image-2.webp`,
    color: "#dce6d3",
    accent: "Sage green",
  },
  {
    id: "rose",
    name: "Softly rose",
    detail: "Garden rose · Apricot · Silk",
    image: `${bouquetImages}BlkFLtOiPr1JtcDTunVl8O/image-3.webp`,
    color: "#ead1cf",
    accent: "Dusty rose",
  },
  {
    id: "sage",
    name: "Quiet stems",
    detail: "White tulip · Sage · Ivory",
    image: `${bouquetImages}BlkFLtOiPr1JtcDTunVl8O/image-4.webp`,
    color: "#dfe6d9",
    accent: "Olive mist",
  },
  {
    id: "sunset",
    name: "Afterglow",
    detail: "Dahlia · Lisianthus · Peach",
    image: `${bouquetImages}BlkFLtOiPr1JtcDTunVl8O/image-5.webp`,
    color: "#ecd3c1",
    accent: "Apricot bloom",
  },
  {
    id: "wildflower",
    name: "Field note",
    detail: "Lavender · Chamomile · Sweet pea",
    image: `${bouquetImages}WRc7v1urVVjtkXgCYH2LEu/image-1.webp`,
    color: "#e4dfe6",
    accent: "Lavender air",
  },
];

const initialCopy: CopySet = {
  instagram:
    "A little more bloom in the week.\n\nOur blush peony bouquet is gathered slowly, stem by stem, for the moments that deserve to feel beautifully unhurried.\n\nAdd a handwritten note on us this week — because the smallest gestures often stay the longest.\n\n#BloomWithUs #PeonySeason #FlowersForTheFeeling",
  rednote:
    "把春天送到她手里｜Blush peony 🌸\n\n一束柔软的粉色牡丹、玫瑰和尤加利，像把窗边的好天气一起打包。\n\n本周下单，附赠手写卡片。把想说的话，认真写下来。\n\n#花束分享 #送花日常 #Bloom花店",
  facebook:
    "There is something about peonies that makes an ordinary Tuesday feel like a little occasion.\n\nOur Blush Peony arrangement pairs full, romantic blooms with a whisper of eucalyptus — finished with your message, handwritten by our team.\n\nFree note card with every order this week. Send a little feeling.",
};

const initialSchedule: ScheduleSlot[] = [
  {
    id: "mon",
    day: "Mon",
    date: "14",
    weekday: "June",
    post: { title: "A little more bloom", platform: "instagram", time: "09:30", color: "#f0d8d4" },
  },
  {
    id: "tue",
    day: "Tue",
    date: "15",
    weekday: "June",
    post: { title: "The language of ranunculus", platform: "rednote", time: "12:00", color: "#dce6d3" },
  },
  {
    id: "wed",
    day: "Wed",
    date: "16",
    weekday: "June",
    post: { title: "A note for your Wednesday", platform: "facebook", time: "10:15", color: "#e4dfe6" },
  },
  {
    id: "thu",
    day: "Thu",
    date: "17",
    weekday: "June",
    post: { title: "Meet the garden rose", platform: "instagram", time: "09:30", color: "#ead1cf" },
  },
  {
    id: "fri",
    day: "Fri",
    date: "18",
    weekday: "June",
    post: { title: "Weekend stems, ready", platform: "rednote", time: "16:45", color: "#ecd3c1" },
  },
  { id: "sat", day: "Sat", date: "19", weekday: "June", post: null },
  { id: "sun", day: "Sun", date: "20", weekday: "June", post: null },
];

const holidays = ["Mother's Day", "Valentine's Day", "Lunar New Year", "New baby", "Just because"];
const offers = ["Free handwritten note", "10% off weekend delivery", "Complimentary vase", "Free same-day delivery"];

const platformMeta: Record<Platform, { label: string; icon: typeof Instagram; className: string }> = {
  instagram: { label: "Instagram", icon: Instagram, className: "platform-instagram" },
  rednote: { label: "Xiaohongshu", icon: Sprout, className: "platform-rednote" },
  facebook: { label: "Facebook", icon: Facebook, className: "platform-facebook" },
};

function PlatformIcon({ platform, size = 15 }: { platform: Platform; size?: number }) {
  const Icon = platformMeta[platform].icon;
  return <Icon size={size} strokeWidth={1.8} />;
}

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function Sidebar({ activeView, onChange }: { activeView: ViewName; onChange: (view: ViewName) => void }) {
  const items: { id: ViewName; label: string; icon: typeof PenLine }[] = [
    { id: "create", label: "Create", icon: PenLine },
    { id: "calendar", label: "Calendar", icon: CalendarDays },
    { id: "library", label: "Bouquet library", icon: LibraryBig },
    { id: "voice", label: "Brand voice", icon: Leaf },
  ];

  return (
    <aside className="studio-sidebar">
      <div className="sidebar-top">
        <div className="brand-lockup">
          <LogoMark />
          <div>
            <div className="wordmark">bloom</div>
            <div className="brand-subtitle">social studio</div>
          </div>
        </div>
        <button className="icon-button help-button" aria-label="Help">
          <CircleHelp size={17} />
        </button>
      </div>

      <div className="sidebar-section-label">Workspace</div>
      <nav className="main-nav" aria-label="Primary">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item ${activeView === id ? "active" : ""}`}
            onClick={() => onChange(id)}
          >
            <Icon size={17} strokeWidth={1.7} />
            <span>{label}</span>
            {id === "calendar" && <span className="nav-count">5</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-season-card">
        <div className="season-orbit"><Sprout size={17} /></div>
        <div>
          <span className="eyebrow">In season now</span>
          <strong>Peony & sweet pea</strong>
          <span className="side-note">June 14 — 20, 2026</span>
        </div>
        <ArrowUpRight size={16} className="side-arrow" />
      </div>

      <div className="sidebar-bottom">
        <div className="profile-row">
          <div className="avatar">EM</div>
          <div className="profile-copy">
            <strong>Emma from Bloom</strong>
            <span>Admin workspace</span>
          </div>
          <ChevronDown size={15} className="muted-icon" />
        </div>
        <div className="sidebar-credit">Bloom Studio <span>v1.0</span></div>
      </div>
    </aside>
  );
}

function TopBar({ activeView, onNewCampaign }: { activeView: ViewName; onNewCampaign: () => void }) {
  const pageTitle = {
    create: "Create a campaign",
    calendar: "Publishing calendar",
    library: "Bouquet library",
    voice: "Brand voice",
  }[activeView];

  return (
    <header className="topbar">
      <div className="breadcrumb"><span>Bloom studio</span><span className="breadcrumb-slash">/</span><strong>{pageTitle}</strong></div>
      <div className="topbar-actions">
        <div className="week-status"><span className="status-dot" /> 5 of 5 posts scheduled</div>
        <button className="outline-button" onClick={onNewCampaign}><Plus size={15} /> New campaign</button>
        <button className="icon-button topbar-avatar">EM</button>
      </div>
    </header>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="field-group">
      <span className="field-label">{label}</span>
      <span className="select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <ChevronDown size={15} className="select-chevron" />
      </span>
    </label>
  );
}

function BouquetPicker({ bouquets, selectedId, onSelect, onUpload }: { bouquets: Bouquet[]; selectedId: string; onSelect: (id: string) => void; onUpload: (event: ChangeEvent<HTMLInputElement>) => void }) {
  const uploadInput = useRef<HTMLInputElement>(null);
  return (
    <div className="bouquet-picker">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">01 / Image</span>
          <h2>Choose your bouquet</h2>
        </div>
        <span className="picker-count">{bouquets.length} photos</span>
      </div>
      <div className="bouquet-scroller">
        {bouquets.map((bouquet) => (
          <button key={bouquet.id} className={`bouquet-choice ${selectedId === bouquet.id ? "selected" : ""}`} onClick={() => onSelect(bouquet.id)}>
            <span className="bouquet-thumb"><img src={bouquet.image} alt={bouquet.name} /></span>
            <span className="bouquet-choice-name">{bouquet.name}</span>
            <span className="bouquet-choice-detail">{bouquet.detail}</span>
            {selectedId === bouquet.id && <span className="selected-check"><Check size={11} /></span>}
          </button>
        ))}
        <button className="upload-choice" onClick={() => uploadInput.current?.click()}>
          <span className="upload-icon"><Upload size={17} /></span>
          <span className="bouquet-choice-name">Upload photo</span>
          <span className="bouquet-choice-detail">JPG or PNG</span>
          <input ref={uploadInput} type="file" accept="image/png,image/jpeg" onChange={onUpload} hidden />
        </button>
      </div>
    </div>
  );
}

function CampaignSetup({
  selectedBouquet,
  holiday,
  offer,
  onHolidayChange,
  onOfferChange,
  onGenerate,
  isGenerating,
}: {
  selectedBouquet: Bouquet;
  holiday: string;
  offer: string;
  onHolidayChange: (value: string) => void;
  onOfferChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  return (
    <section className="campaign-setup">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">02 / Direction</span>
          <h2>Set the feeling</h2>
        </div>
        <span className="ai-badge"><Sparkles size={12} /> AI assisted</span>
      </div>
      <div className="selected-bouquet-line">
        <span className="mini-image"><img src={selectedBouquet.image} alt="" /></span>
        <div><span className="selected-bouquet-kicker">Selected bouquet</span><strong>{selectedBouquet.name}</strong></div>
        <span className="selected-bouquet-tag">{selectedBouquet.accent}</span>
      </div>
      <div className="fields-row">
        <SelectField label="Occasion / holiday" value={holiday} options={holidays} onChange={onHolidayChange} />
        <SelectField label="Offer to mention" value={offer} options={offers} onChange={onOfferChange} />
      </div>
      <div className="generate-row">
        <div className="generate-hint"><WandSparkles size={16} /><span>One idea, three native voices.</span></div>
        <button className={`generate-button ${isGenerating ? "loading" : ""}`} onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? <><span className="button-shimmer" /> Writing copy…</> : <><Sparkles size={15} /> Generate all 3 posts</>}
        </button>
      </div>
    </section>
  );
}

function PhoneFrame({ platform, image, copy, isGenerating }: { platform: Platform; image: string; copy: string; isGenerating: boolean }) {
  const meta = platformMeta[platform];
  const isRednote = platform === "rednote";
  return (
    <article className={`phone-card ${meta.className}`}>
      <div className="phone-card-label"><PlatformIcon platform={platform} size={14} /><span>{meta.label}</span><span className="drag-label"><ArrowDownToLine size={12} /> drag to schedule</span></div>
      <div className="phone-shell">
        <div className="phone-notch" />
        <div className="phone-header">
          <div className="phone-profile"><span className="profile-petal"><LogoMark /></span><span>{isRednote ? "bloomflowers" : "bloom.flower.shop"}</span></div>
          <MoreHorizontal size={16} />
        </div>
        <div className="phone-photo"><img src={image} alt="Bloom bouquet" /><span className="photo-count">1 / 1</span></div>
        <div className="phone-actions"><div><Heart size={18} /><MessageCircle size={18} /><Send size={17} /></div><Bookmark size={18} /></div>
        <div className={`phone-caption ${isGenerating ? "is-generating" : ""}`}>
          <strong>{isRednote ? "bloomflowers" : "bloom.flower.shop"}</strong>
          {isGenerating ? <><span className="copy-line" /><span className="copy-line short" /><span className="copy-line" /></> : <span className="caption-copy">{copy}</span>}
        </div>
        <div className="phone-footer">{isRednote ? "刚刚" : "Just now"}</div>
      </div>
    </article>
  );
}

function GeneratedPosts({ bouquets, selectedId, copy, isGenerating }: { bouquets: Bouquet[]; selectedId: string; copy: CopySet; isGenerating: boolean }) {
  const selected = bouquets.find((item) => item.id === selectedId) ?? bouquets[0];
  return (
    <section className="generated-section">
      <div className="section-heading-row preview-heading">
        <div>
          <span className="eyebrow">03 / Preview</span>
          <h2>Three ways to say it</h2>
          <p className="section-description">Same bouquet, shaped for each place your community finds you.</p>
        </div>
        <div className="preview-tools"><span className="copy-ready"><span className="status-dot" /> Copy ready</span><button className="icon-button"><MoreHorizontal size={17} /></button></div>
      </div>
      <div className="phone-grid">
        {(Object.keys(platformMeta) as Platform[]).map((platform) => (
          <div key={platform} draggable onDragStart={(event) => event.dataTransfer.setData("text/bloom-platform", platform)} className="draggable-post">
            <PhoneFrame platform={platform} image={selected.image} copy={copy[platform]} isGenerating={isGenerating} />
          </div>
        ))}
      </div>
    </section>
  );
}

function WeekStrip({ schedule, onDropPost, onOpenCalendar, onQuickAdd }: { schedule: ScheduleSlot[]; onDropPost: (slotId: string, platform: Platform) => void; onOpenCalendar: () => void; onQuickAdd: (slotId: string) => void }) {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const handleDragOver = (event: DragEvent<HTMLDivElement>, id: string) => {
    event.preventDefault();
    setDragOver(id);
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>, id: string) => {
    event.preventDefault();
    const platform = event.dataTransfer.getData("text/bloom-platform") as Platform;
    if (platform) onDropPost(id, platform);
    setDragOver(null);
  };
  return (
    <section className="week-strip-section">
      <div className="section-heading-row week-heading">
        <div><span className="eyebrow">04 / Schedule</span><h2>Drag into the week</h2></div>
        <button className="text-button" onClick={onOpenCalendar}>Open calendar <ArrowUpRight size={14} /></button>
      </div>
      <div className="week-strip">
        <button className="week-nav"><ChevronLeft size={16} /></button>
        {schedule.map((slot) => (
          <div key={slot.id} className={`week-day ${dragOver === slot.id ? "drag-over" : ""}`} onDragOver={(event) => handleDragOver(event, slot.id)} onDragLeave={() => setDragOver(null)} onDrop={(event) => handleDrop(event, slot.id)}>
            <div className="day-top"><span>{slot.day}</span><strong>{slot.date}</strong></div>
            {slot.post ? <div className="scheduled-mini" style={{ background: slot.post.color }}><span className="mini-platform"><PlatformIcon platform={slot.post.platform} size={12} /></span><strong>{slot.post.title}</strong><span className="mini-time"><Clock3 size={10} /> {slot.post.time}</span></div> : <button className="empty-drop" onClick={() => onQuickAdd(slot.id)}><Plus size={14} /><span>Drop here</span><small>or click to add</small></button>}
          </div>
        ))}
        <button className="week-nav"><ChevronRight size={16} /></button>
      </div>
    </section>
  );
}

function CreateView({ bouquets, selectedId, onSelectBouquet, onUpload, holiday, offer, onHolidayChange, onOfferChange, onGenerate, isGenerating, copy, schedule, onDropPost, onOpenCalendar, onQuickAdd }: {
  bouquets: Bouquet[];
  selectedId: string;
  onSelectBouquet: (id: string) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  holiday: string;
  offer: string;
  onHolidayChange: (value: string) => void;
  onOfferChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  copy: CopySet;
  schedule: ScheduleSlot[];
  onDropPost: (slotId: string, platform: Platform) => void;
  onOpenCalendar: () => void;
  onQuickAdd: (slotId: string) => void;
}) {
  const selected = bouquets.find((item) => item.id === selectedId) ?? bouquets[0];
  return (
    <div className="page-content create-view">
      <div className="page-intro">
        <div>
          <span className="eyebrow">Monday, June 14, 2026</span>
          <h1>A little more bloom<br /><em>in the week.</em></h1>
        </div>
        <div className="intro-aside"><span className="intro-mark"><Leaf size={16} /></span><p>Compose one beautiful idea.<br />Let Bloom shape the rest.</p></div>
      </div>
      <div className="setup-panel">
        <BouquetPicker bouquets={bouquets} selectedId={selectedId} onSelect={onSelectBouquet} onUpload={onUpload} />
        <CampaignSetup selectedBouquet={selected} holiday={holiday} offer={offer} onHolidayChange={onHolidayChange} onOfferChange={onOfferChange} onGenerate={onGenerate} isGenerating={isGenerating} />
      </div>
      <GeneratedPosts bouquets={bouquets} selectedId={selectedId} copy={copy} isGenerating={isGenerating} />
      <WeekStrip schedule={schedule} onDropPost={onDropPost} onOpenCalendar={onOpenCalendar} onQuickAdd={onQuickAdd} />
    </div>
  );
}

function CalendarView({ schedule, onDropPost, onQuickAdd }: { schedule: ScheduleSlot[]; onDropPost: (slotId: string, platform: Platform) => void; onQuickAdd: (slotId: string) => void }) {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const handleDrop = (event: DragEvent<HTMLDivElement>, id: string) => {
    event.preventDefault();
    const platform = event.dataTransfer.getData("text/bloom-platform") as Platform;
    if (platform) onDropPost(id, platform);
    setDragOver(null);
  };
  return (
    <div className="page-content calendar-view">
      <div className="page-intro calendar-intro">
        <div><span className="eyebrow">June 14 — 20, 2026</span><h1>Make room for<br /><em>good things.</em></h1></div>
        <div className="calendar-summary"><span className="summary-number">05</span><span>posts this week<br /><strong>All channels covered</strong></span></div>
      </div>
      <div className="calendar-toolbar"><div className="month-switcher"><button className="icon-button"><ChevronLeft size={16} /></button><strong>June 2026</strong><button className="icon-button"><ChevronRight size={16} /></button></div><div className="calendar-legend"><span><i className="legend-dot instagram-dot" /> Instagram</span><span><i className="legend-dot rednote-dot" /> RedNote</span><span><i className="legend-dot facebook-dot" /> Facebook</span></div></div>
      <div className="calendar-grid">
        {schedule.map((slot) => (
          <div key={slot.id} className={`calendar-day ${dragOver === slot.id ? "drag-over" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragOver(slot.id); }} onDragLeave={() => setDragOver(null)} onDrop={(event) => handleDrop(event, slot.id)}>
            <div className="calendar-day-head"><span>{slot.day}</span><strong>{slot.date}</strong></div>
            <div className="calendar-day-body">{slot.post ? <div className="calendar-post" style={{ background: slot.post.color }} draggable onDragStart={(event) => event.dataTransfer.setData("text/bloom-platform", slot.post?.platform ?? "instagram")}><div className="calendar-post-meta"><PlatformIcon platform={slot.post.platform} size={14} /><span>{platformMeta[slot.post.platform].label}</span><MoreHorizontal size={14} /></div><strong>{slot.post.title}</strong><span className="calendar-time"><Clock3 size={12} /> {slot.post.time}</span></div> : <button className="calendar-drop" onClick={() => onQuickAdd(slot.id)}><Plus size={18} /><span>Drop a post here</span><small>or click to add</small></button>}</div>
          </div>
        ))}
      </div>
      <div className="calendar-footer-note"><Sparkles size={15} /> Tip: drag any generated preview onto a day to replace or fill the slot.</div>
    </div>
  );
}

function LibraryView({ bouquets, selectedId, onSelect, onUpload }: { bouquets: Bouquet[]; selectedId: string; onSelect: (id: string) => void; onUpload: (event: ChangeEvent<HTMLInputElement>) => void }) {
  const uploadInput = useRef<HTMLInputElement>(null);
  return (
    <div className="page-content library-view">
      <div className="page-intro"><div><span className="eyebrow">06 stems on file</span><h1>Flowers worth<br /><em>writing about.</em></h1></div><div className="intro-aside"><span className="intro-mark"><Grid2X2 size={16} /></span><p>Each image is a starting point<br />for a new feeling.</p></div></div>
      <div className="library-toolbar"><div className="library-count"><strong>{bouquets.length}</strong> bouquet photos</div><button className="outline-button" onClick={() => uploadInput.current?.click()}><ImagePlus size={15} /> Add photo</button><input ref={uploadInput} type="file" accept="image/png,image/jpeg" onChange={onUpload} hidden /></div>
      <div className="library-grid">{bouquets.map((bouquet, index) => <button key={bouquet.id} className={`library-card ${selectedId === bouquet.id ? "selected" : ""}`} onClick={() => { onSelect(bouquet.id); toast.success(`${bouquet.name} is ready to compose with.`); }}><div className="library-image"><img src={bouquet.image} alt={bouquet.name} /><span className="library-index">0{index + 1}</span>{selectedId === bouquet.id && <span className="library-selected"><Check size={12} /> In use</span>}</div><div className="library-card-copy"><div><strong>{bouquet.name}</strong><span>{bouquet.detail}</span></div><ArrowUpRight size={15} /></div></button>)}</div>
    </div>
  );
}

function VoiceView() {
  return (
    <div className="page-content voice-view">
      <div className="page-intro"><div><span className="eyebrow">Bloom's point of view</span><h1>Say it with<br /><em>feeling.</em></h1></div><div className="intro-aside"><span className="intro-mark"><Leaf size={16} /></span><p>A few gentle rules<br />for every caption.</p></div></div>
      <div className="voice-grid"><div className="voice-card voice-card-pink"><span className="eyebrow">The feeling</span><h2>Warm, never loud.</h2><p>Bloom speaks like a thoughtful note tucked into a bouquet: specific, sincere, and always a little sensory.</p><span className="voice-quote">“A little more bloom in the week.”</span></div><div className="voice-card"><span className="eyebrow">The rhythm</span><h2>Short lines.<br />Soft landing.</h2><div className="voice-rule"><span>01</span><strong>Notice the detail</strong></div><div className="voice-rule"><span>02</span><strong>Name the feeling</strong></div><div className="voice-rule"><span>03</span><strong>Offer a small next step</strong></div></div><div className="voice-card voice-card-sage"><span className="eyebrow">Words to keep close</span><div className="word-cloud"><span>gathered</span><span>unhurried</span><span>fresh</span><span>thoughtful</span><span>softly</span><span>in season</span></div><div className="voice-avoid"><span>Leave behind</span><strong>“Don’t miss out!!!”</strong></div></div></div>
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewName>("create");
  const [bouquets, setBouquets] = useState<Bouquet[]>(initialBouquets);
  const [selectedId, setSelectedId] = useState("peony");
  const [holiday, setHoliday] = useState(holidays[0]);
  const [offer, setOffer] = useState(offers[0]);
  const [copy, setCopy] = useState<CopySet>(initialCopy);
  const [isGenerating, setIsGenerating] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(initialSchedule);

  const selectedBouquet = useMemo(() => bouquets.find((item) => item.id === selectedId) ?? bouquets[0], [bouquets, selectedId]);

  const handleGenerate = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      const name = selectedBouquet.name;
      setCopy({
        instagram: `${name}, gathered slowly.\n\nA soft reminder that the best days don't need much — just a little color, a handwritten note, and someone to think of.\n\n${offer} this week.\n\n#BloomWithUs #FlowersForTheFeeling #${holiday.replace(/[^a-zA-Z]/g, "")}`,
        rednote: `${holiday}送花灵感｜${name} 🌸\n\n把一束轻轻的春天交到她手里。每一支花都保留一点自然的呼吸感，适合送给那个让日子变柔软的人。\n\n本周下单，${offer}。\n\n#花束分享 #送花日常 #Bloom花店`,
        facebook: `Some feelings are best delivered in flowers.\n\nOur ${name} arrangement is made for ${holiday.toLowerCase()} — beautifully gathered, softly wrapped, and ready to carry your note.\n\n${offer}. Send a little feeling this week.`,
      });
      setIsGenerating(false);
      toast.success("Three fresh captions are ready to review.");
    }, 850);
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const newBouquet: Bouquet = {
      id: `upload-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, "").slice(0, 22),
      detail: "Your uploaded bouquet",
      image: URL.createObjectURL(file),
      color: "#f0d8d4",
      accent: "New photo",
    };
    setBouquets((current) => [...current, newBouquet]);
    setSelectedId(newBouquet.id);
    toast.success("Your bouquet photo was added to the library.");
  };

  const handleDropPost = (slotId: string, platform: Platform) => {
    const titles: Record<Platform, string> = { instagram: "A little more bloom", rednote: "A little spring, delivered", facebook: "Send a little feeling" };
    const colors: Record<Platform, string> = { instagram: "#f0d8d4", rednote: "#dce6d3", facebook: "#e4dfe6" };
    setSchedule((current) => current.map((slot) => slot.id === slotId ? { ...slot, post: { title: titles[platform], platform, time: slot.post?.time ?? "09:30", color: colors[platform] } } : slot));
    toast.success(`${platformMeta[platform].label} post scheduled for ${schedule.find((slot) => slot.id === slotId)?.day ?? "this day"}.`);
  };

  const handleQuickAdd = (slotId: string) => {
    handleDropPost(slotId, "instagram");
  };

  const handleNewCampaign = () => {
    setActiveView("create");
    setIsGenerating(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Ready for a new Bloom idea.");
  };

  return (
    <div className="bloom-app-shell">
      <Sidebar activeView={activeView} onChange={setActiveView} />
      <main className="studio-main">
        <TopBar activeView={activeView} onNewCampaign={handleNewCampaign} />
        {activeView === "create" && <CreateView bouquets={bouquets} selectedId={selectedId} onSelectBouquet={setSelectedId} onUpload={handleUpload} holiday={holiday} offer={offer} onHolidayChange={setHoliday} onOfferChange={setOffer} onGenerate={handleGenerate} isGenerating={isGenerating} copy={copy} schedule={schedule} onDropPost={handleDropPost} onOpenCalendar={() => setActiveView("calendar")} onQuickAdd={handleQuickAdd} />}
        {activeView === "calendar" && <CalendarView schedule={schedule} onDropPost={handleDropPost} onQuickAdd={handleQuickAdd} />}
        {activeView === "library" && <LibraryView bouquets={bouquets} selectedId={selectedId} onSelect={setSelectedId} onUpload={handleUpload} />}
        {activeView === "voice" && <VoiceView />}
      </main>
    </div>
  );
}
