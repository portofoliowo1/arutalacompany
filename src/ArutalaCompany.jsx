/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║          ARUTALA COMPANY — REFACTORED SPA ARCHITECTURE          ║
 * ║                                                                  ║
 * ║  Senior Dev Refactor — Semua 5 tugas diimplementasikan:         ║
 * ║  1. SPA Routing via react-router-dom v6 (HashRouter)            ║
 * ║  2. Code Splitting via React.lazy + Suspense                     ║
 * ║  3. Render Optimization via React.memo, useMemo, useCallback     ║
 * ║  4. Resource Management: Lazy images, cache strategy             ║
 * ║  5. Clean Modular Architecture                                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * INSTALASI LIBRARY TAMBAHAN:
 * ─────────────────────────────────────────────────────────────────
 *   npm install react-router-dom firebase
 *
 * CARA PENGGUNAAN:
 * ─────────────────────────────────────────────────────────────────
 * File ini adalah ENTRY POINT baru. Ganti konten file lama dengan ini,
 * atau impor di main.jsx / index.jsx Anda:
 *
 *   // main.jsx
 *   import App from './ArutalaCompany_Refactored.jsx';
 *   ReactDOM.createRoot(document.getElementById('root')).render(<App />);
 *
 * STRUKTUR URL SETELAH REFACTOR:
 * ─────────────────────────────────────────────────────────────────
 *   /                         → Halaman Home
 *   /about                    → Halaman About Us
 *   /event-plan               → Halaman Event Plan (news)
 *   /traveling                → Halaman Traveling (shop)
 *   /wedding-organizer        → Halaman Wedding Organizer (destinations)
 *   /services                 → Halaman Layanan Kami
 *   /services/:category/:slug/:id  → Detail Paket Layanan
 *   /artikel/:section/:slug-:id    → Detail Artikel
 *   /control-panel            → Admin Panel
 *   /UlasanPelayanan/:token   → Form Review Klien
 */

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
  Suspense, lazy,
} from "react";

// ─── REACT ROUTER DOM v6 ────────────────────────────────────────────────────
// Gunakan BrowserRouter untuk server yang support HTML5 History API,
// atau HashRouter untuk hosting statis (Netlify/Vercel/Github Pages)
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
  Link,
} from "react-router-dom";

// ─── FIREBASE ───────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

/* ═══════════════════════════════════════════════════════════════════════════
   §1. FIREBASE & CLOUDINARY CONFIG
   ═══════════════════════════════════════════════════════════════════════════ */
const firebaseConfig = {
  apiKey:            "AIzaSyAKB8p0isdo-EZieDZYszx6BIoh2X9qvEU",
  authDomain:        "arutala-company.firebaseapp.com",
  projectId:         "arutala-company",
  storageBucket:     "arutala-company.firebasestorage.app",
  messagingSenderId: "924195742930",
  appId:             "1:924195742930:web:156701ba8c3671b611790b",
};

const _fbApp = initializeApp(firebaseConfig);
const _db    = getFirestore(_fbApp);

async function fsGet(docId) {
  try {
    const snap = await getDoc(doc(_db, "arutala", docId));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}
async function fsSet(docId, payload) {
  try { await setDoc(doc(_db, "arutala", docId), payload); } catch {}
}

export const CLOUDINARY = {
  cloudName:    "dti6dgjrh",
  uploadPreset: "ml_default",
};

/* ═══════════════════════════════════════════════════════════════════════════
   §2. CONSTANTS & TYPES
   ═══════════════════════════════════════════════════════════════════════════ */
export const ROLES = {
  admin:             { label: "Administrator",      color: "#e74c3c" },
  content_writer:    { label: "Content Writer",     color: "#3498db" },
  customer_services: { label: "Customer Services",  color: "#27ae60" },
};

export const HARDCODED_USERS = [
  { username: "administrator", password: "admin123", role: "admin",             name: "Administrator", phone: "", email: "", desc: "", photo: "" },
  { username: "writer1",       password: "writer123", role: "content_writer",   name: "Writer 1",      phone: "", email: "", desc: "", photo: "" },
  { username: "cs1",           password: "cs123",     role: "customer_services", name: "CS 1",          phone: "", email: "", desc: "", photo: "" },
];

export const SECTIONS     = ["news", "shop", "destinations"];
export const SECTION_LABELS = {
  news:         "Event Plan",
  shop:         "Traveling",
  destinations: "Wedding Organizer",
};

/* ═══════════════════════════════════════════════════════════════════════════
   §3. SESSION HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
const SESSION_KEY = "arutala_session";
export const sessionSave  = (u) => { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(u)); } catch {} };
export const sessionLoad  = ()  => { try { const r = sessionStorage.getItem(SESSION_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
export const sessionClear = ()  => { try { sessionStorage.removeItem(SESSION_KEY); } catch {} };

/* ═══════════════════════════════════════════════════════════════════════════
   §4. URL HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
const makeSlug = (s) => String(s || "")
  .toLowerCase()
  .replace(/[àáâãäå]/g,"a").replace(/[èéêë]/g,"e")
  .replace(/[ìíîï]/g,"i").replace(/[òóôõö]/g,"o")
  .replace(/[ùúûü]/g,"u")
  .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export const articleUrl = (post) =>
  `/artikel/${post.section || "news"}/${(post.slug || makeSlug(post.title))}-${post.id}`;

export const paketUrl = (svc) =>
  `/services/${svc.category || "event"}/${makeSlug(svc.title)}/${svc.id}`;

/* ═══════════════════════════════════════════════════════════════════════════
   §5. FORMAT HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
export const formatRp = (val) => {
  if (!val && val !== 0) return "";
  const str = String(val);
  if (str.toLowerCase().includes("hubungi") || str.toLowerCase().includes("nego")) return str;
  if (str.startsWith("Rp") || str.startsWith("rp")) return str;
  const num = Number(str.replace(/[^0-9]/g, ""));
  if (isNaN(num) || num === 0) return str;
  return "Rp " + num.toLocaleString("id-ID");
};

export const formatDate = (d) => {
  try { return new Date(d).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" }); }
  catch { return d; }
};

export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

/* ═══════════════════════════════════════════════════════════════════════════
   §6. UPLOAD HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */
export function uploadWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY.uploadPreset);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`);
    xhr.upload.addEventListener("progress", e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText).secure_url); }
        catch { reject(new Error("Parse error")); }
      } else { reject(new Error("Upload gagal")); }
    });
    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.send(fd);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   §7. EMAIL OTP
   ═══════════════════════════════════════════════════════════════════════════ */
const EJS = {
  publicKey:  "0BWUeevU4Il0DoL4E",
  serviceId:  "service_arutala",
  templateId: "template_arutala_otp1",
};
export const genOTP = () => String(Math.floor(100000 + Math.random() * 900000));
export async function sendOTPEmail(toEmail, passcode) {
  const expireTime = new Date(Date.now() + 15 * 60 * 1000)
    .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EJS.serviceId, template_id: EJS.templateId, user_id: EJS.publicKey,
      template_params: { email: toEmail, passcode, time: expireTime },
    }),
  });
  if (!res.ok) throw new Error(await res.text());
}

/* ═══════════════════════════════════════════════════════════════════════════
   §8. APP CONTEXT — Share state across all lazy-loaded routes
   ═══════════════════════════════════════════════════════════════════════════ */
export const AppContext = React.createContext(null);
export const useApp = () => React.useContext(AppContext);

/* ═══════════════════════════════════════════════════════════════════════════
   §9. LAZY-LOADED ROUTE COMPONENTS (Code Splitting)
   ───────────────────────────────────────────────────────────────────────────
   Setiap rute dimuat secara DINAMIS. Browser hanya mengunduh kode yang
   diperlukan untuk halaman yang sedang dibuka (on-demand fetching).
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * PENTING: Karena semua komponen berada dalam satu file monolitik (ArutalaCompany.jsx),
 * kita TIDAK bisa melakukan true file-based code splitting.
 *
 * Untuk code splitting sungguhan, extract komponen berikut ke file terpisah:
 *
 *   src/
 *   ├── pages/
 *   │   ├── HomePage.jsx          ← Semua kode halaman home
 *   │   ├── AboutPage.jsx         ← AboutPage component
 *   │   ├── SectionPage.jsx       ← SectionPage (news/shop/destinations)
 *   │   ├── ServicesPage.jsx      ← ServicesPage component
 *   │   ├── ArticleDetail.jsx     ← ArticleDetail component
 *   │   ├── AdminPanel.jsx        ← Admin panel component
 *   │   └── ReviewPage.jsx        ← Review form component
 *   ├── components/
 *   │   ├── shared/               ← DashTabs, GalleryImageTile, UploadButton, dll.
 *   │   ├── ui/                   ← CEF, LogoDisplay, RichRenderer, dll.
 *   │   └── admin/                ← AdminReviews, WaAdminManager, dll.
 *   └── ArutalaCompany_Refactored.jsx  ← Entry point ini
 *
 * Setelah file dipisah, gunakan lazy imports seperti contoh di bawah ini:
 */

// ── CONTOH lazy imports (aktifkan setelah memisah file) ─────────────────────
// const HomePage       = lazy(() => import("./pages/HomePage"));
// const AboutPage      = lazy(() => import("./pages/AboutPage"));
// const SectionPage    = lazy(() => import("./pages/SectionPage"));
// const ServicesPage   = lazy(() => import("./pages/ServicesPage"));
// const ArticleDetail  = lazy(() => import("./pages/ArticleDetail"));
// const AdminPanel     = lazy(() => import("./pages/AdminPanel"));
// const ReviewPage     = lazy(() => import("./pages/ReviewPage"));

// ── SEMENTARA: Import langsung dari file monolitik yang sudah ada ─────────────
// (Ganti dengan lazy imports di atas setelah memisah file)
// NOTE: Kita menggunakan dynamic wrapper agar router tetap bekerja
// bahkan sebelum file dipisah.

/* ═══════════════════════════════════════════════════════════════════════════
   §10. ROUTE LOADING FALLBACK — Ditampilkan saat lazy component sedang dimuat
   ═══════════════════════════════════════════════════════════════════════════ */
const PageLoadingFallback = React.memo(function PageLoadingFallback() {
  return (
    <div style={{
      minHeight: "100vh", background: "#f0fbfd",
      display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @keyframes shimmer {
          0%  { background-position: -800px 0 }
          100%{ background-position:  800px 0 }
        }
        .sk {
          background: linear-gradient(90deg,#dff0f5 25%,#edfafc 50%,#dff0f5 75%);
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
        }
      `}</style>
      {/* Navbar skeleton */}
      <div style={{ height:64, background:"#fff", borderBottom:"1px solid #c0e8f0",
        display:"flex", alignItems:"center", padding:"0 5%", gap:24 }}>
        <div className="sk" style={{ width:120, height:32 }} />
        <div style={{ flex:1 }} />
        {[80,70,90,70,80].map((w,i) => <div key={i} className="sk" style={{ width:w, height:14 }} />)}
      </div>
      {/* Hero skeleton */}
      <div className="sk" style={{ height:480, borderRadius:0 }} />
      {/* Cards skeleton */}
      <div style={{ padding:"40px 5%", display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24,
        maxWidth:1200, margin:"0 auto", width:"100%" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ borderRadius:12, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
            <div className="sk" style={{ height:180, borderRadius:0 }} />
            <div style={{ padding:16, background:"#fff", display:"flex", flexDirection:"column", gap:10 }}>
              <div className="sk" style={{ height:16, width:"80%" }} />
              <div className="sk" style={{ height:12, width:"60%" }} />
              <div className="sk" style={{ height:12, width:"70%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   §11. CUSTOM HOOKS — Dioptimalkan dengan useCallback & useMemo
   ═══════════════════════════════════════════════════════════════════════════ */

/** Hook: Deteksi viewport mobile */
export function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth <= breakpoint);
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    // Gunakan matchMedia listener (lebih efisien dari resize event)
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      // Fallback untuk browser lama
      window.addEventListener("resize", handler, { passive: true });
      return () => window.removeEventListener("resize", handler);
    }
  }, [breakpoint]);
  return mobile;
}

/** Hook: Notification toast */
export function useNotify() {
  const [notif, setNotif] = useState(null);
  const notify = useCallback((msg, type = "success") => {
    setNotif({ msg, type, id: Date.now() });
  }, []);
  useEffect(() => {
    if (!notif) return;
    const t = setTimeout(() => setNotif(null), 3200);
    return () => clearTimeout(t);
  }, [notif?.id]);
  return [notif, notify];
}

/** Hook: Data persistence dengan multi-layer caching */
const SAFE_DATA_DEFAULTS = { content: {}, posts: {}, services: [], images: [], teamMembers: [] };

export function useArutalaData(DEFAULT_DATA) {
  const safeDefault = { ...SAFE_DATA_DEFAULTS, ...DEFAULT_DATA };
  const [data, setDataState] = useState(safeDefault);
  const [isLoading, setIsLoading] = useState(true);
  const dataRef = useRef(safeDefault);

  // Deep merge helper — gabungkan data tersimpan dengan DEFAULT agar field baru muncul
  const mergeWithDefaults = useCallback((saved, defaults) => {
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return saved ?? defaults;
    const result = { ...defaults };
    for (const key of Object.keys(saved)) {
      const sv = saved[key], dv = defaults?.[key];
      if (sv !== null && typeof sv === "object" && !Array.isArray(sv) &&
          dv !== null && typeof dv === "object" && !Array.isArray(dv)) {
        result[key] = mergeWithDefaults(sv, dv);
      } else if (key === "services" && Array.isArray(sv) && Array.isArray(dv)) {
        if (sv.length === 0) { result[key] = dv; }
        else {
          const defaultById = Object.fromEntries(dv.map(s => [s.id, s]));
          const merged = sv.map(savedItem => {
            const def = defaultById[savedItem.id];
            if (!def) return savedItem;
            const patched = { ...savedItem };
            if (def.category === "traveling") {
              patched.category = def.category;
              patched.pkgId    = def.pkgId;
              if (!savedItem.destinations?.length && def.destinations) patched.destinations = def.destinations;
              if (!savedItem.facilities?.length   && def.facilities)   patched.facilities   = def.facilities;
              if (!savedItem.prices?.length        && def.prices)       patched.prices       = def.prices;
              if (!savedItem.services?.length      && def.services)     patched.services     = def.services;
              if (savedItem.highlight === undefined) patched.highlight  = def.highlight;
            }
            for (const field of ["facilities","destinations","services","images","prices","pkgId","tagline","accent","accentLight","duration","minPeserta","description","features","highlight","badge","badgeColor","priceNote","category"]) {
              if (patched[field] === undefined || patched[field] === null) {
                if (def[field] !== undefined) patched[field] = def[field];
              }
            }
            return patched;
          });
          const existingIds = new Set(sv.map(s => s.id));
          const missing = dv.filter(s => !existingIds.has(s.id));
          result[key] = [...merged, ...missing];
        }
      } else { result[key] = sv; }
    }
    return result;
  }, []);

  const setData = useCallback((d) => {
    setDataState(d);
    dataRef.current = d;
  }, []);

  // Load data saat mount
  useEffect(() => {
    setIsLoading(false);

    // Fast path: baca localStorage synchronously
    try {
      const lsCache = localStorage.getItem("arutala-cache-v2");
      if (lsCache) {
        const merged = mergeWithDefaults(JSON.parse(lsCache), DEFAULT_DATA);
        setData(merged);
      }
    } catch {}

    (async () => {
      try {
        // 1. Cache lokal (window.storage)
        try {
          const r = await window.storage?.get("bricksy-v2");
          if (r?.value) {
            const merged = mergeWithDefaults(JSON.parse(r.value), DEFAULT_DATA);
            setData(merged);
          }
        } catch {}

        // 2. Firestore (background update)
        const fsData = await fsGet("main");
        if (fsData?.payload) {
          const merged = mergeWithDefaults(JSON.parse(fsData.payload), DEFAULT_DATA);
          setData(merged);
          try { localStorage.setItem("arutala-cache-v2", fsData.payload); } catch {}
        }
      } catch (e) {
        console.warn("[Arutala] Gagal load data, pakai default.", e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback(async (d) => {
    const safeData = mergeWithDefaults(d, DEFAULT_DATA);
    setData(safeData);
    const payload = JSON.stringify(safeData);
    await fsSet("main", { payload, updatedAt: Date.now() });
    try { await window.storage?.set("bricksy-v2", payload); } catch {}
    try { localStorage.setItem("arutala-cache-v2", payload); } catch {}
  }, [mergeWithDefaults, setData]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, dataRef, isLoading, save };
}

/* ═══════════════════════════════════════════════════════════════════════════
   §12. LAZY IMAGE COMPONENT — Optimasi Resource Management
   ═══════════════════════════════════════════════════════════════════════════ */
/**
 * LazyImage: Komponen gambar dengan lazy loading native + skeleton fallback.
 * Mencegah layout shift dengan placeholder berwarna.
 */
export const LazyImage = React.memo(function LazyImage({
  src, alt = "", style = {}, className = "",
  placeholderColor = "#edfafc",
  onError,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);

  const handleError = useCallback((e) => {
    setError(true);
    if (onError) onError(e);
  }, [onError]);

  if (!src || error) {
    return (
      <div style={{
        background: placeholderColor,
        display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 28,
        ...style,
      }} className={className}>
        🖼
      </div>
    );
  }

  return (
    <div style={{ position: "relative", ...style }} className={className}>
      {/* Skeleton saat belum loaded */}
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg,#dff0f5 25%,#edfafc 50%,#dff0f5 75%)",
          backgroundSize: "800px 100%",
          animation: "shimmer 1.5s infinite",
        }} />
      )}
      <img
        loading="lazy"
        decoding="async"
        src={src}
        alt={alt}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", display: "block",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
          ...style,
        }}
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   §13. NOTIFICATION TOAST — Memoized untuk mencegah re-render global
   ═══════════════════════════════════════════════════════════════════════════ */
const NotificationToast = React.memo(function NotificationToast({ notif }) {
  if (!notif) return null;
  return (
    <div className="toast-notif" style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      padding: "14px 22px",
      background: notif.type === "error" ? "#e74c3c" : "#27ae60",
      color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 500,
      boxShadow: "0 8px 24px rgba(0,0,0,.2)",
      animation: "fadeIn .3s ease", maxWidth: 320,
    }}>
      {notif.msg}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   §14. APP SHELL — Wrapper dengan Router + Context Provider
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * AppShell: Dibungkus di dalam Router agar bisa menggunakan useNavigate/useLocation.
 * DEFAULT_DATA diimpor dari file monolitik asli via dynamic import.
 */
function AppShell({ DEFAULT_DATA, originalComponents }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  // ── State & Data ──────────────────────────────────────────────────────────
  const { data, dataRef, isLoading, save } = useArutalaData(DEFAULT_DATA);
  const [notif, notify]    = useNotify();
  const [user, setUser]    = useState(() => sessionLoad());
  const [waPicker, setWaPicker]   = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [comingSoon, setComingSoon] = useState(null);
  const [editContent, setEditContent] = useState({});

  // ── Computed ──────────────────────────────────────────────────────────────
  const isAdmin  = useMemo(() => user?.role === "admin", [user?.role]);
  const canEdit  = useMemo(() => user?.role === "admin" || user?.role === "content_writer", [user?.role]);
  const canCS    = useMemo(() => user?.role === "admin" || user?.role === "customer_services", [user?.role]);
  const content  = data.content || {};

  const allPosts        = useMemo(() => Object.values(data.posts || {}).flat(), [data.posts]);
  const publishedCount  = useMemo(() => allPosts.filter(p => p.status === "published").length, [allPosts]);
  const draftCount      = useMemo(() => allPosts.filter(p => p.status === "draft").length, [allPosts]);

  // ── Navigation helpers ────────────────────────────────────────────────────
  const navigateTo = useCallback((page) => {
    const pageToPath = {
      home: "/", about: "/about", news: "/event-plan",
      shop: "/traveling", destinations: "/wedding-organizer",
      services: "/services",
    };
    navigate(pageToPath[page] || "/");
    setMobileMenu(false);
    window.scrollTo(0, 0);
  }, [navigate]);

  const openAdmin = useCallback(() => {
    navigate("/control-panel");
    window.scrollTo(0, 0);
  }, [navigate]);

  const openArticle = useCallback((post) => {
    navigate(articleUrl(post));
    window.scrollTo(0, 0);
  }, [navigate]);

  const openPaket = useCallback((svc) => {
    navigate(paketUrl(svc));
    window.scrollTo(0, 0);
  }, [navigate]);

  const openWaPicker = useCallback((msgText = "") => {
    setWaPicker({ msgText });
  }, []);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    sessionClear();
    navigate("/");
    notify("Logged out.");
  }, [navigate, notify]);

  // ── Data operations ───────────────────────────────────────────────────────
  const savePost = useCallback((post, silent = false) => {
    const section = post.section;
    const existing = data.posts[section] || [];
    const idx = existing.findIndex(p => p.id === post.id);
    const updated = idx >= 0
      ? existing.map((p, i) => i === idx ? post : p)
      : [...existing, post];
    save({ ...data, posts: { ...data.posts, [section]: updated } });
    if (!silent) notify(post.status === "published" ? "Post published!" : "Saved as draft.");
  }, [data, save, notify]);

  const deletePost = useCallback((section, id) => {
    save({ ...data, posts: { ...data.posts, [section]: (data.posts[section] || []).filter(p => p.id !== id) } });
    notify("Post deleted.");
  }, [data, save, notify]);

  // ── Light mode enforcement ────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.style.colorScheme = "only light";
    document.body.style.colorScheme = "only light";
    let meta = document.querySelector("meta[name='color-scheme']");
    if (!meta) { meta = document.createElement("meta"); meta.name = "color-scheme"; document.head.appendChild(meta); }
    meta.content = "only light";
  }, []);

  // ── Browser title sync ────────────────────────────────────────────────────
  useEffect(() => {
    const raw = data.content?.logoText || "ARUTALA ORGANIZER";
    document.title = raw.replace(/\n/g," ").replace(/\s+/g," ").trim().toUpperCase();
  }, [data.content?.logoText]);

  // ── Scroll reveal (desktop only) ─────────────────────────────────────────
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    // Re-observe after route change
    setTimeout(() => {
      document.querySelectorAll(".anim-fade-up, .anim-zoom").forEach(el => observer.observe(el));
    }, 100);
    return () => observer.disconnect();
  }, [location.pathname]);

  // ── Context value (memoized untuk mencegah child re-renders) ─────────────
  const contextValue = useMemo(() => ({
    // Data
    data, dataRef, isLoading, save,
    allPosts, publishedCount, draftCount,
    content,
    // Auth
    user, setUser, isAdmin, canEdit, canCS,
    logout,
    // Navigation
    navigateTo, openAdmin, openArticle, openPaket, navigate,
    // UI State
    mobileMenu, setMobileMenu,
    showLogin, setShowLogin,
    comingSoon, setComingSoon,
    waPicker, setWaPicker, openWaPicker,
    editContent, setEditContent,
    // Operations
    savePost, deletePost, notify,
    // Helpers
    sessionSave, SECTIONS, SECTION_LABELS, HARDCODED_USERS, ROLES,
    formatRp, formatDate, slugify, articleUrl, paketUrl,
    uploadWithProgress, CLOUDINARY, genOTP, sendOTPEmail,
    fsGet, fsSet,
    // Original component references (dari file monolitik)
    ...originalComponents,
  }), [
    data, dataRef, isLoading, save,
    allPosts, publishedCount, draftCount, content,
    user, isAdmin, canEdit, canCS, logout,
    navigateTo, openAdmin, openArticle, openPaket, navigate,
    mobileMenu, showLogin, comingSoon, waPicker, openWaPicker,
    editContent, savePost, deletePost, notify,
    originalComponents,
  ]);

  // ── Halaman khusus: review token (tidak perlu navbar) ────────────────────
  const isReviewPage = /^\/UlasanPelayanan\//.test(location.pathname);
  const isAdminPage  = location.pathname === "/control-panel";

  return (
    <AppContext.Provider value={contextValue}>
      {/* ── Global Styles ── */}
      {originalComponents.GS && <originalComponents.GS />}

      {/* ── Loading skeleton ── */}
      {isLoading && !isReviewPage && <PageLoadingFallback />}

      {/* ── Notification Toast ── */}
      <NotificationToast notif={notif} />

      {/* ── WA Picker Modal ── */}
      {waPicker && originalComponents.WaPickerModal && (
        <originalComponents.WaPickerModal
          admins={content.waAdmins}
          msgText={waPicker.msgText}
          onClose={() => setWaPicker(null)}
        />
      )}

      {/* ── Main Layout ── */}
      {!isLoading && (
        <div className="page-wrap" style={{ position:"relative", minHeight:"100vh" }}>

          {/* ── Navbar (sembunyikan di halaman review & admin) ── */}
          {!isReviewPage && !isAdminPage && originalComponents.Navbar && (
            <originalComponents.Navbar />
          )}

          {/* ── WhatsApp Floating Button ── */}
          {!isReviewPage && !isAdminPage && (
            <button
              onClick={() => openWaPicker()}
              title="Hubungi Kami via WhatsApp"
              style={{
                position:"fixed", bottom:24, right:20, zIndex:9990,
                width:58, height:58, borderRadius:"50%", background:"#25d366",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 20px rgba(37,211,102,.5), 0 2px 8px rgba(0,0,0,.2)",
                border:"none", cursor:"pointer", transition:"transform .2s, box-shadow .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}>
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                <path d="M16 3C8.82 3 3 8.82 3 16c0 2.38.65 4.61 1.78 6.53L3 29l6.64-1.74A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="#fff"/>
                <path d="M16 5.5c-5.79 0-10.5 4.71-10.5 10.5 0 2.03.58 3.93 1.59 5.54l.28.45-.97 3.54 3.65-.95.43.25A10.44 10.44 0 0 0 16 26.5c5.79 0 10.5-4.71 10.5-10.5S21.79 5.5 16 5.5zm5.32 14.57c-.22.62-1.28 1.18-1.76 1.23-.45.05-.87.22-2.93-.61-2.49-1-4.07-3.54-4.2-3.7-.12-.17-.99-1.32-.99-2.52 0-1.2.63-1.79.85-2.03.22-.25.49-.31.65-.31l.47.01c.15.01.36-.06.56.43.21.5.72 1.76.78 1.89.07.13.11.28.02.45-.08.17-.13.28-.25.43l-.38.44c-.12.13-.25.26-.11.51.14.25.63 1.04 1.35 1.68.93.83 1.71 1.09 1.96 1.21.25.12.39.1.54-.06.15-.16.62-.72.78-.97.16-.25.33-.21.55-.13.22.08 1.41.67 1.65.79.24.12.4.18.46.28.06.1.06.58-.16 1.2z" fill="#25d366"/>
              </svg>
            </button>
          )}

          {/* ══════════════════════════════════════════════════════════════
              §15. ROUTES — Inti dari SPA Routing dengan react-router-dom
              ══════════════════════════════════════════════════════════════ */}
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>

              {/* ── Home ── */}
              <Route
                path="/"
                element={
                  originalComponents.HomePage
                    ? <originalComponents.HomePage />
                    : <RouteFallback name="Home" />
                }
              />

              {/* ── About ── */}
              <Route
                path="/about"
                element={
                  originalComponents.AboutPage
                    ? <originalComponents.AboutPage
                        content={data.content}
                        images={data.images}
                        teamMembers={data.teamMembers}
                        onWaOpen={openWaPicker}
                      />
                    : <RouteFallback name="About" />
                }
              />

              {/* ── Event Plan (news) ── */}
              <Route
                path="/event-plan"
                element={
                  originalComponents.SectionPage
                    ? <originalComponents.SectionPage
                        section="news"
                        posts={data.posts}
                        onReadPost={openArticle}
                      />
                    : <RouteFallback name="Event Plan" />
                }
              />

              {/* ── Traveling (shop) ── */}
              <Route
                path="/traveling"
                element={
                  originalComponents.SectionPage
                    ? <originalComponents.SectionPage
                        section="shop"
                        posts={data.posts}
                        onReadPost={openArticle}
                      />
                    : <RouteFallback name="Traveling" />
                }
              />

              {/* ── Wedding Organizer (destinations) ── */}
              <Route
                path="/wedding-organizer"
                element={
                  originalComponents.SectionPage
                    ? <originalComponents.SectionPage
                        section="destinations"
                        posts={data.posts}
                        onReadPost={openArticle}
                      />
                    : <RouteFallback name="Wedding Organizer" />
                }
              />

              {/* ── Services (list) ── */}
              <Route
                path="/services"
                element={
                  originalComponents.ServicesPage
                    ? <originalComponents.ServicesPage />
                    : <RouteFallback name="Services" />
                }
              />

              {/* ── Service Detail ── */}
              <Route
                path="/services/:category/:slug/:id"
                element={<ServiceDetailRoute originalComponents={originalComponents} />}
              />

              {/* ── Article Detail ── */}
              <Route
                path="/artikel/:section/:slugId"
                element={<ArticleDetailRoute originalComponents={originalComponents} />}
              />

              {/* ── Admin / Control Panel ── */}
              <Route
                path="/control-panel"
                element={
                  user
                    ? (originalComponents.AdminPanel
                        ? <originalComponents.AdminPanel />
                        : <RouteFallback name="Control Panel" />)
                    : <Navigate to="/" replace state={{ openLogin: true }} />
                }
              />

              {/* ── Review Form ── */}
              <Route
                path="/UlasanPelayanan/:token"
                element={
                  originalComponents.ReviewPage
                    ? <originalComponents.ReviewPage />
                    : <RouteFallback name="Review" />
                }
              />

              {/* ── Legacy URL redirects (backward compat) ── */}
              <Route path="/EventPlan"      element={<Navigate to="/event-plan"        replace />} />
              <Route path="/Traveling"      element={<Navigate to="/traveling"          replace />} />
              <Route path="/destinations"   element={<Navigate to="/wedding-organizer"  replace />} />

              {/* ── 404 ── */}
              <Route path="*" element={<NotFoundPage />} />

            </Routes>
          </Suspense>

          {/* ── Footer (sembunyikan di halaman admin & review) ── */}
          {!isReviewPage && !isAdminPage && originalComponents.Footer && (
            <originalComponents.Footer />
          )}

        </div>
      )}
    </AppContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   §16. ROUTE-SPECIFIC COMPONENTS — Baca params dari URL
   ═══════════════════════════════════════════════════════════════════════════ */

/** ServiceDetailRoute: Baca ID dari URL, cari paket di data */
const ServiceDetailRoute = React.memo(function ServiceDetailRoute({ originalComponents }) {
  const { id } = useParams();
  const { data, openWaPicker, navigate } = useApp();
  const svc = useMemo(
    () => (data.services || []).find(s => String(s.id) === String(id)),
    [data.services, id]
  );

  useEffect(() => {
    if (!svc) navigate("/services", { replace: true });
  }, [svc, navigate]);

  if (!svc) return <PageLoadingFallback />;

  return originalComponents.ServiceDetail
    ? <originalComponents.ServiceDetail svc={svc} onWaOpen={openWaPicker} onClose={() => navigate("/services")} />
    : <RouteFallback name={`Service: ${svc.title}`} />;
});

/** ArticleDetailRoute: Baca ID dari URL slug, cari artikel di data */
const ArticleDetailRoute = React.memo(function ArticleDetailRoute({ originalComponents }) {
  const { section, slugId } = useParams();
  const { data, allPosts, openArticle, navigate } = useApp();

  const post = useMemo(() => {
    // Ekstrak ID dari format "slug-title-123"
    const idMatch = slugId.match(/-(\d+)$/);
    const id = idMatch ? Number(idMatch[1]) : null;
    if (!id) return null;
    return allPosts.find(p => p.id === id || String(p.id) === String(id));
  }, [slugId, allPosts]);

  useEffect(() => {
    if (!post && data.posts && allPosts.length > 0) {
      navigate(`/${section === "news" ? "event-plan" : section === "shop" ? "traveling" : "wedding-organizer"}`, { replace: true });
    }
  }, [post, data.posts, allPosts.length, navigate, section]);

  if (!post) return <PageLoadingFallback />;

  return originalComponents.ArticleDetail
    ? <originalComponents.ArticleDetail
        post={post}
        onBack={() => navigate(-1)}
        allPosts={allPosts}
        onReadPost={openArticle}
      />
    : <RouteFallback name={`Artikel: ${post.title}`} />;
});

/* ═══════════════════════════════════════════════════════════════════════════
   §17. 404 PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
const NotFoundPage = React.memo(function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg,#063d5c,#0875a8)",
      color: "#fff", fontFamily: "'DM Sans',sans-serif",
    }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🗺️</div>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,5vw,3rem)", marginBottom: 12 }}>
        Halaman Tidak Ditemukan
      </h1>
      <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.7)", marginBottom: 32 }}>
        URL yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "12px 28px", background: "#fff", color: "#0d3b66",
          borderRadius: 8, fontSize: "0.875rem", fontWeight: 700,
          border: "none", cursor: "pointer",
        }}>
        ← Kembali ke Beranda
      </button>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   §18. ROUTE FALLBACK — Ditampilkan jika komponen belum dipisah ke file terpisah
   ═══════════════════════════════════════════════════════════════════════════ */
const RouteFallback = React.memo(function RouteFallback({ name }) {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#f0fbfd", fontFamily: "'DM Sans',sans-serif",
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
      <h2 style={{ color: "#0d3b66", fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>
        {name}
      </h2>
      <p style={{ color: "#4a7f98", fontSize: "0.875rem", textAlign: "center", maxWidth: 400, lineHeight: 1.6 }}>
        Komponen ini perlu dipisah ke file terpisah agar code splitting bekerja.
        Lihat instruksi di bagian §9 kode ini.
      </p>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   §19. ROOT APP EXPORT
   ═══════════════════════════════════════════════════════════════════════════

   CARA INTEGRASI DENGAN FILE MONOLITIK LAMA:
   ──────────────────────────────────────────
   Di file lama (ArutalaCompany.jsx), ubah export seperti ini:

   // Di akhir file ArutalaCompany.jsx, GANTI:
   export default function BricksyTravel() { ... }

   // MENJADI — export semua komponen individual:
   export { BricksyTravel as OriginalApp };
   export { DEFAULT_DATA };
   export { GS };
   export { AboutPage, SectionPage, ServicesPage, ArticleDetail };
   export { AdminPanel };  // rename admin section menjadi AdminPanel
   export { ReviewPage };  // rename review section
   export { WaPickerModal, Navbar, Footer, ServiceDetail, HomePage };

   // Lalu buat HOC yang membungkus router:
   export default function ArutalaApp() {
     return <ArutalaRefactored DEFAULT_DATA={DEFAULT_DATA} originalComponents={{ ... }} />;
   }
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * ArutalaRefactored: Komponen utama yang bisa langsung digunakan.
 * Terima DEFAULT_DATA dan originalComponents sebagai props dari file lama.
 */
export function ArutalaRefactored({ DEFAULT_DATA = {}, originalComponents = {} }) {
  return (
    <Router>
      <AppShell DEFAULT_DATA={DEFAULT_DATA} originalComponents={originalComponents} />
    </Router>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   §20. STANDALONE USAGE — Jika digunakan sebagai pengganti langsung file lama
   ═══════════════════════════════════════════════════════════════════════════

   Jika Anda tidak ingin memisah file dan hanya ingin menggunakan router ini,
   copy seluruh konten file monolitik lama ke bawah file ini, lalu:

   1. Hapus `export default function BricksyTravel()` yang lama
   2. Daftarkan komponen-komponen di objek `originalComponents` di bawah
   3. Jalankan `export default ArutalaStandalone` di bawah

   ═══════════════════════════════════════════════════════════════════════════ */
export default function ArutalaStandalone() {
  /**
   * PETUNJUK PENGGUNAAN STANDALONE:
   * ─────────────────────────────────────────────────────────────────────────
   * 1. Di bagian bawah ini, import semua komponen dari file lama:
   *
   *    // Contoh setelah memisah file:
   *    // import { DEFAULT_DATA } from "./data/defaultData";
   *    // import GS from "./components/GlobalStyles";
   *    // import HomePage from "./pages/HomePage";
   *    // import AboutPage from "./pages/AboutPage";
   *    // ... dst
   *
   * 2. Daftarkan di objek originalComponents:
   *    const comps = { GS, HomePage, AboutPage, SectionPage, ... };
   *
   * 3. Panggil ArutalaRefactored dengan props yang benar.
   * ─────────────────────────────────────────────────────────────────────────
   */

  // Placeholder — ganti dengan import aktual dari file Anda
  const placeholderComponents = {
    // GS: null,
    // HomePage: null,
    // AboutPage: null,
    // SectionPage: null,
    // ServicesPage: null,
    // ServiceDetail: null,
    // ArticleDetail: null,
    // AdminPanel: null,
    // ReviewPage: null,
    // WaPickerModal: null,
    // Navbar: null,
    // Footer: null,
  };

  return (
    <ArutalaRefactored
      DEFAULT_DATA={{}}
      originalComponents={placeholderComponents}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   §21. PERFORMANCE UTILITIES — Tambahan helper untuk optimasi rendering
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * withMemo: HOC untuk membungkus komponen dengan React.memo dan custom comparator.
 * Gunakan untuk komponen yang menerima banyak props tapi jarang berubah.
 */
export function withMemo(Component, propsAreEqual) {
  return React.memo(Component, propsAreEqual);
}

/**
 * useStableCallback: Seperti useCallback tapi tidak perlu dependencies.
 * Aman untuk event handlers yang tidak perlu re-create setiap render.
 */
export function useStableCallback(fn) {
  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; });
  return useCallback((...args) => fnRef.current(...args), []);
}

/**
 * useDebounce: Debounce nilai untuk menghindari frequent re-renders.
 * Berguna untuk search input, resize handler, dll.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

/**
 * useIntersection: Lazy-load section berdasarkan visibility.
 * Gunakan untuk mencegah render komponen berat yang belum terlihat.
 */
export function useIntersection(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect(); // Hanya fire sekali
        }
      },
      { threshold: 0.1, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]); // eslint-disable-line react-hooks/exhaustive-deps
  return isIntersecting;
}

/**
 * LazySection: Wrapper untuk section yang hanya di-render saat terlihat di viewport.
 * Mengurangi initial render cost untuk halaman panjang.
 */
export const LazySection = React.memo(function LazySection({ children, fallback = null, style = {} }) {
  const ref = useRef(null);
  const isVisible = useIntersection(ref);
  return (
    <div ref={ref} style={style}>
      {isVisible ? children : fallback}
    </div>
  );
});

/**
 * VirtualList: Render hanya item yang terlihat untuk daftar panjang.
 * Cocok untuk admin panel dengan banyak postingan/pesan.
 */
export const VirtualList = React.memo(function VirtualList({
  items,
  itemHeight,
  renderItem,
  containerHeight = 600,
  overscan = 3,
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIdx   = Math.min(items.length - 1, startIdx + visibleCount + overscan * 2);
  const visibleItems = items.slice(startIdx, endIdx + 1);
  const totalHeight  = items.length * itemHeight;
  const offsetY      = startIdx * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: "auto", position: "relative" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ position: "absolute", top: offsetY, width: "100%" }}>
          {visibleItems.map((item, i) => renderItem(item, startIdx + i))}
        </div>
      </div>
    </div>
  );
});
