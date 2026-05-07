import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────── DASHBOARD TABS SUB-COMPONENT ─────────────── */
function DashTabs({ user, allPosts, publishedCount, draftCount, data, canEdit, canCS, isAdmin, setAdminTab, setCmsEditPost, SECTION_LABELS, SECTIONS, formatDate }) {
  const [dashTab, setDashTab] = useState("notifications");
  const tabs = [
    { id: "notifications", label: "Notifikasi" },
    ...(canEdit ? [{ id: "articles", label: "Kelola Artikel" }] : []),
    { id: "stats", label: "Statistik" },
    { id: "guide", label: "Panduan & FAQ" },
  ];
  return (
    <div className="dash-grid">
      {/* Left column */}
      <div>
        <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.06)", marginBottom: 16 }}>
          <div style={{ display: "flex", borderBottom: "2px solid #f4f9fb" }} className="dash-tab-row">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setDashTab(t.id)}
                style={{ flex: 1, padding: "14px 8px", fontSize: "0.8125rem", fontWeight: dashTab === t.id ? 700 : 500,
                  color: dashTab === t.id ? "#2d2d2d" : "#6b8999", background: dashTab === t.id ? "#fff" : "#fafcfd",
                  border: "none", borderBottom: dashTab === t.id ? "2px solid #2d2d2d" : "2px solid transparent",
                  marginBottom: -2, cursor: "pointer", transition: "all .15s" }}>
                {t.label}
              </button>
            ))}
          </div>

          {dashTab === "notifications" && (
            <div style={{ padding: "8px 0" }}>
              {data.messages.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "#6b8999", fontSize: "0.875rem" }}>🔔 Belum ada notifikasi.</div>
              ) : data.messages.slice().reverse().slice(0, 5).map(m => (
                <div key={m.id} style={{ display: "flex", gap: 14, padding: "16px 20px", borderBottom: "1px solid #f4f9fb", alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: "#f4f9fb", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✉️</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.875rem", color: "#2d2d2d", lineHeight: 1.6, marginBottom: 4 }}>
                      Pesan baru dari <strong>{m.name}</strong> ({m.email}): <em style={{ color: "#4e6b80" }}>{m.message?.slice(0, 80)}{m.message?.length > 80 ? "…" : ""}</em>
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "#6b8999" }}>{m.date}</span>
                    {!m.read && <span style={{ marginLeft: 8, fontSize: "0.625rem", background: "#e74c3c", color: "#fff", borderRadius: 8, padding: "1px 7px", fontWeight: 700 }}>BARU</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {dashTab === "articles" && canEdit && (
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2d2d2d" }}>Artikel Terbaru</span>
                <button onClick={() => { setAdminTab("cms"); setCmsEditPost("new"); }}
                  style={{ fontSize: "0.75rem", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 16, padding: "5px 14px", fontWeight: 600, cursor: "pointer" }}>+ Baru</button>
              </div>
              {allPosts.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#6b8999" }}>Belum ada artikel.</p>
              ) : allPosts.slice(-5).reverse().map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f4f9fb" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                    <img src={p.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2d2d2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
                    <span style={{ fontSize: "0.75rem", color: "#6b8999" }}>{p.section} · {formatDate(p.date)}</span>
                  </div>
                  <span style={{ fontSize: "0.6875rem", padding: "2px 10px", borderRadius: 10, fontWeight: 600, background: p.status === "published" ? "#e8f8ef" : "#fff8e1", color: p.status === "published" ? "#27ae60" : "#f39c12" }}>
                    {p.status === "published" ? "Tayang" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {dashTab === "stats" && (
            <div style={{ padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Total Artikel", value: allPosts.length, icon: "📄", color: "#2b7a9a" },
                  { label: "Tayang", value: publishedCount, icon: "✅", color: "#27ae60" },
                  { label: "Draft", value: draftCount, icon: "📋", color: "#f39c12" },
                  { label: "Pesan Masuk", value: data.messages.length, icon: "✉️", color: "#8e44ad" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#f4f9fb", borderRadius: 10, padding: "16px 18px", borderLeft: `3px solid ${s.color}` }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: s.color, fontFamily: "'Playfair Display',serif" }}>{s.value}</div>
                    <div style={{ fontSize: "0.8125rem", color: "#6b8999", marginTop: 2 }}>{s.icon} {s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#f4f9fb", borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b8999", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>Distribusi per Seksi</div>
                {["news","shop","destinations"].map(s => {
                  const total = allPosts.length || 1;
                  const count = (data.posts?.[s] || []).length;
                  const pct = Math.round(count / total * 100);
                  return (
                    <div key={s} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.8125rem", color: "#2d2d2d", fontWeight: 600 }}>{SECTION_LABELS[s]}</span>
                        <span style={{ fontSize: "0.8125rem", color: "#6b8999" }}>{count}</span>
                      </div>
                      <div style={{ height: 6, background: "#ddeef5", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#2b7a9a", borderRadius: 3, transition: "width .5s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {dashTab === "guide" && (
            <div style={{ padding: "20px" }}>
              {[
                { q: "Bagaimana cara membuat artikel baru?", a: "Klik tombol '✏ Buat Artikel' di dashboard atau masuk ke menu Posts / CMS lalu klik '+ New Post'." },
                { q: "Bagaimana cara mengubah gambar hero?", a: "Masuk ke menu 'Images' di sidebar, lalu klik gambar yang ingin diganti dan masukkan URL baru." },
                { q: "Cara membalas pesan dari pengunjung?", a: "Masuk ke menu 'Messages', buka pesan, lalu klik tombol Reply untuk membalas." },
                { q: "Bagaimana cara mengganti teks di website?", a: "Masuk ke menu 'Site Content' (khusus admin) untuk mengedit semua teks halaman." },
                { q: "Apa perbedaan Draft dan Published?", a: "Draft hanya terlihat di admin panel. Published akan tampil di website untuk pengunjung umum." },
              ].map((faq, i) => (
                <div key={i} style={{ marginBottom: 14, padding: "14px 16px", background: "#f4f9fb", borderRadius: 8, borderLeft: "3px solid #2b7a9a" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d2d2d", marginBottom: 6 }}>❓ {faq.q}</p>
                  <p style={{ fontSize: "0.8125rem", color: "#4e6b80", lineHeight: 1.65 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Top Kontributor */}
        <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f4f9fb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.125rem", fontWeight: 800, color: "#2d2d2d" }}>Top Kontributor</span>
            <span style={{ fontSize: "0.6875rem", color: "#6b8999" }}>Artikel tayang</span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {(() => {
              const authorMap = {};
              allPosts.filter(p => p.status === "published").forEach(p => { authorMap[p.author] = (authorMap[p.author] || 0) + 1; });
              const sorted = Object.entries(authorMap).sort((a,b) => b[1]-a[1]).slice(0, 3);
              const medals = ["🥇","🥈","🥉"];
              if (!sorted.length) return <p style={{ padding: "16px 20px", fontSize: "0.8125rem", color: "#6b8999" }}>Belum ada artikel tayang.</p>;
              return sorted.map(([author, count], i) => (
                <div key={author} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderBottom: "1px solid #f4f9fb" }}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0, minWidth: 28 }}>{medals[i]}</span>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#2d2d2d,#2b7a9a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d2d2d" }}>{author}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b8999" }}>Artikel: {count}</div>
                  </div>
                  {author === user.username && <span style={{ fontSize: "0.625rem", background: "#e8f8ef", color: "#27ae60", borderRadius: 8, padding: "2px 7px", fontWeight: 700 }}>YOU</span>}
                </div>
              ));
            })()}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", background: "#f4f9fb" }}>
              <span style={{ fontSize: "1.25rem", minWidth: 28 }}>—</span>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#2b7a9a,#5bc4e0)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d2d2d" }}>You ({user.username})</div>
                <div style={{ fontSize: "0.75rem", color: "#6b8999" }}>Artikel: {allPosts.filter(p => p.author === user.username && p.status === "published").length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Akses Cepat */}
        <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f4f9fb" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.125rem", fontWeight: 800, color: "#2d2d2d" }}>Akses Cepat</span>
          </div>
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ...(canEdit ? [{ label: "✏ Buat Artikel Baru", action: () => { setAdminTab("cms"); setCmsEditPost("new"); } }] : []),
              ...(canCS ? [{ label: `✉ Pesan (${data.messages.length})`, action: () => setAdminTab("messages") }] : []),
              ...(isAdmin ? [{ label: "🖼 Kelola Gambar", action: () => setAdminTab("images") }] : []),
              ...(isAdmin ? [{ label: "🔤 Konten Website", action: () => setAdminTab("content") }] : []),
              ...(isAdmin ? [{ label: "⚙ Pengaturan", action: () => setAdminTab("settings") }] : []),
            ].map(item => (
              <button key={item.label} onClick={item.action}
                style={{ textAlign: "left", padding: "9px 12px", background: "#f4f9fb", border: "none", borderRadius: 7, fontSize: "0.8125rem", color: "#2d2d2d", fontWeight: 500, cursor: "pointer", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#ddeef5"}
                onMouseLeave={e => e.currentTarget.style.background = "#f4f9fb"}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── CONSTANTS ─────────────── */
const ROLES = {
  admin: { label: "Administrator", color: "#e74c3c" },
  content_writer: { label: "Content Writer", color: "#3498db" },
  customer_services: { label: "Customer Services", color: "#27ae60" },
};

const HARDCODED_USERS = [
  { username: "administrator", password: "admin123", role: "admin", name: "Administrator", phone: "", email: "", desc: "", photo: "" },
  { username: "writer1", password: "writer123", role: "content_writer", name: "Writer 1", phone: "", email: "", desc: "", photo: "" },
  { username: "cs1", password: "cs123", role: "customer_services", name: "CS 1", phone: "", email: "", desc: "", photo: "" },
];

/* ─── Firebase Config ─── */
// Install dulu: npm install firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

/* ── Firestore helpers ── */
async function fsGet(docId) {
  try {
    const snap = await getDoc(doc(_db, "arutala", docId));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}
async function fsSet(docId, payload) {
  try { await setDoc(doc(_db, "arutala", docId), payload); } catch {}
}

/* ─── Cloudinary Config ─── */
const CLOUDINARY = {
  cloudName:    "dti6dgjrh",
  uploadPreset: "ml_default",
};

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY.uploadPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`, {
    method: "POST", body: fd,
  });
  if (!res.ok) throw new Error("Upload gagal");
  const data = await res.json();
  return data.secure_url;
}

/* ─── EmailJS Config ─── */
const EJS = {
  publicKey:  "0BWUeevU4Il0DoL4E",
  serviceId:  "service_arutala",
  templateId: "template_arutala_otp1",
};

/* Generate 6-digit OTP */
const genOTP = () => String(Math.floor(100000 + Math.random() * 900000));

/* Send OTP via EmailJS REST (no SDK needed) */
async function sendOTPEmail(toEmail, passcode) {
  const expireTime = new Date(Date.now() + 15 * 60 * 1000)
    .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EJS.serviceId,
      template_id: EJS.templateId,
      user_id:     EJS.publicKey,
      template_params: {
        email:    toEmail,
        passcode,
        time:     expireTime,
      },
    }),
  });
  if (!res.ok) throw new Error(await res.text());
}

const SECTIONS = ["news", "shop", "destinations"];

const SECTION_LABELS = {
  news: "Event Plan",
  shop: "Traveling",
  destinations: "Wedding Organizer",
};

const DEFAULT_POSTS = {
  news: [
    {
      id: 1, section: "news", status: "published",
      title: "Spa Time at Bali's Hidden Resorts",
      date: "2026-04-03", author: "writer1", category: "Lifestyle",
      coverImage: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&h=900&fit=crop",
      excerpt: "Relax and rejuvenate at world-class spas along pristine coastlines.",
      content: [
        { type: "paragraph", value: "Bali has long been a haven for those seeking peace and wellness. The island's lush landscape, spiritual ambiance, and world-class hospitality make it one of the top spa destinations in the world." },
        { type: "paragraph", value: "From volcanic stone massages to traditional Balinese healing rituals, each treatment is carefully crafted to restore body and soul." },
        { type: "image", value: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&h=800&fit=crop", caption: "Serene poolside at a Bali resort" },
        { type: "paragraph", value: "Whether you choose a clifftop retreat in Uluwatu or a rainforest sanctuary in Ubud, Bali delivers a spa experience unlike anywhere else on earth." },
      ],
      tags: ["spa", "bali", "wellness"],
    },
    {
      id: 2, section: "news", status: "published",
      title: "Beach Time: Discovering Hidden Coves",
      date: "2026-04-10", author: "writer1", category: "Beach",
      coverImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&h=900&fit=crop",
      excerpt: "Discover breathtaking beaches and hidden coves across the globe.",
      content: [
        { type: "paragraph", value: "The world's most stunning beaches are often the ones hardest to reach. Hidden behind jungle trails or accessible only by boat, these secret coves reward the adventurous traveler." },
        { type: "paragraph", value: "From the pink sand beaches of the Bahamas to the glittering black shores of Iceland, every coastline tells a story millions of years in the making." },
        { type: "image", value: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=1600&h=800&fit=crop", caption: "Crystal clear waters of a hidden cove" },
      ],
      tags: ["beach", "travel", "adventure"],
    },
    {
      id: 3, section: "news", status: "published",
      title: "Happy Times: Creating Unforgettable Memories",
      date: "2026-04-15", author: "writer1", category: "Experience",
      coverImage: "https://images.unsplash.com/photo-1552641356-f51c88ca3e87?w=1600&h=900&fit=crop",
      excerpt: "Create unforgettable memories on your next great adventure.",
      content: [
        { type: "paragraph", value: "Travel is not just about the destination — it's about the moments that take your breath away. The surprise sunrise, the unexpected friendship, the meal that tastes like home even in a foreign land." },
        { type: "paragraph", value: "Every journey has the potential to become a story you tell for the rest of your life. All it takes is the courage to step outside your comfort zone." },
      ],
      tags: ["memories", "adventure", "travel"],
    },
  ],
  shop: [
    {
      id: 10, section: "shop", status: "published",
      title: "Premium Travel Backpack — Explorer Series",
      date: "2026-03-20", author: "writer1", category: "Gear",
      coverImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&h=900&fit=crop",
      excerpt: "The ultimate companion for every adventure — waterproof, lightweight, and stylish.",
      price: "$149", badge: "Best Seller",
      content: [
        { type: "paragraph", value: "Designed for the modern explorer, the Explorer Series backpack combines durability with sleek design. Available in three colors." },
        { type: "paragraph", value: "Features: 40L capacity, hidden laptop sleeve, TSA-approved lock compatibility, and 100% recycled materials." },
      ],
      tags: ["gear", "backpack", "travel"],
    },
    {
      id: 11, section: "shop", status: "published",
      title: "Adventure Camera Strap Pro",
      date: "2026-03-25", author: "writer1", category: "Photography",
      coverImage: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1600&h=900&fit=crop",
      excerpt: "Never miss a shot. Ergonomic, adjustable, built for every terrain.",
      price: "$49",
      content: [
        { type: "paragraph", value: "Built for adventurers and photographers who refuse to compromise. The Adventure Camera Strap Pro features military-grade nylon webbing and quick-release clips." },
      ],
      tags: ["photography", "camera", "gear"],
    },
  ],
  destinations: [
    {
      id: 20, section: "destinations", status: "published",
      title: "Komodo Island, Indonesia",
      date: "2026-02-10", author: "writer1", category: "Asia",
      coverImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&h=900&fit=crop",
      excerpt: "Home to the legendary Komodo dragons and some of the world's best diving.",
      content: [
        { type: "paragraph", value: "Komodo National Park is one of Indonesia's most dramatic and diverse destinations. The rugged, volcanic landscape is home to the world's largest lizard — the Komodo dragon." },
        { type: "paragraph", value: "Beneath the surface, the waters around Komodo are equally spectacular. Divers encounter manta rays, sharks, and vibrant coral gardens." },
        { type: "image", value: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&h=800&fit=crop", caption: "Pink Beach, Komodo" },
        { type: "paragraph", value: "Best time to visit: April to December for calm seas. Liveaboard diving trips are highly recommended for the full experience." },
      ],
      tags: ["indonesia", "diving", "wildlife"],
    },
    {
      id: 21, section: "destinations", status: "published",
      title: "Swiss Alps: Winter Wonderland",
      date: "2026-02-20", author: "writer1", category: "Europe",
      coverImage: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1600&h=900&fit=crop",
      excerpt: "Pristine slopes, charming villages, and world-class ski resorts await you.",
      content: [
        { type: "paragraph", value: "Few landscapes in the world rival the Swiss Alps in winter. Snow-dusted peaks, frozen lakes, and cozy mountain chalets create a fairy-tale setting for skiers, snowboarders, and mountain lovers." },
        { type: "paragraph", value: "Resorts like Zermatt, Verbier, and St. Moritz offer everything from family-friendly slopes to expert backcountry terrain." },
      ],
      tags: ["switzerland", "skiing", "winter"],
    },
  ],
};

const DEFAULT_DATA = {
  images: {
    hero: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552641356-f51c88ca3e87?w=1600&h=600&fit=crop",
    ],
    adv: [
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=1600&h=700&fit=crop",
    ],
    gal: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1552641356-f51c88ca3e87?w=1600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&h=400&fit=crop",
    ],
  },
  content: {
    heroTitle: "Travel & Relax",
    heroSub: "Discover breathtaking destinations, hidden gems, and unforgettable adventures around the world. Your next journey starts here.",
    advTitle: "Adventure for your Soul",
    advSub: "TRAVEL & OUTDOOR RECREATION",
    advQuote: '"We live in a wonderful world that is full of beauty, charm and adventure. There is no end to the adventures that we can have if only we seek them with our eyes open." — Jawaharlal Nehru',
    newAdvTitle: "Our New Adventures",
    newAdvSub: "Explore our latest destinations and travel packages. Available for a limited time.",
    bookTitle: "Book your next Adventure",
    bookSub: "Let us take care of every detail so you can focus on what matters — experiencing the world.",
    newsletterTitle: "Go on an adventure from your inbox",
    foundingYear: "2026",
    aboutText: "Arutala Organizer telah menghubungkan impian dengan kenyataan sejak 2026. Kami percaya bahwa setiap momen spesial layak dirayakan dengan sempurna.",
    contactText: "Hubungi kami untuk konsultasi gratis. Tim Arutala Organizer siap membantu mewujudkan event, pernikahan, dan perjalanan impian Anda — profesional, terpercaya, dan berkesan.",
    aboutHeroLabel: "About Us",
    aboutHeroTitle: "We Live for Adventure",
    aboutHeroSub: "Arutala Organizer telah menghubungkan impian dengan kenyataan sejak 2026. Kami percaya bahwa setiap momen spesial layak dirayakan dengan sempurna.",
    aboutWhyTitle: "Why Choose Us",
    aboutV1Icon: "🌍", aboutV1Title: "Global Network",    aboutV1Desc: "Partnerships with 200+ local guides in 60 countries.",
    aboutV2Icon: "🛡",  aboutV2Title: "Safe & Trusted",   aboutV2Desc: "Full insurance coverage and 24/7 emergency support.",
    aboutV3Icon: "🌱", aboutV3Title: "Sustainable Travel",aboutV3Desc: "We offset 100% of our trips' carbon footprint.",
    aboutV4Icon: "⭐", aboutV4Title: "Award Winning",     aboutV4Desc: "Best Travel Agency award 3 years running.",
    aboutContactTitle: "Get in Touch",
    aboutContactSub: "We'd love to help plan your next event.",
    email: "arutalaorganizer@gmail.com",
    phone: "+62 857 4557 1442",
    address: "Malang, Jawa Timur, Indonesia",
    hours: "Senin – Sabtu: 08.00 – 20.00 WIB",
    waLink: "https://wa.me/6285745571442",
    igLink: "https://instagram.com/arutalaorganizer",
    fbLink: "https://facebook.com/arutalaorganizer",
    logoText: "ARUTALA\nORGANIZER",
    logoImage: "",
    loginBtnText: "LOGIN",
    nav1: "Home", nav2: "About", nav3: "Event Plan", nav4: "Traveling", nav5: "Wedding Organizer", nav6: "Layanan Kami",
    servicesPageTitle: "Paket Layanan Kami",
    servicesPageSub: "Pilih paket yang sesuai dengan kebutuhan Anda. Setiap paket dirancang untuk memberikan pengalaman terbaik bersama Arutala Organizer.",
  },
  posts: DEFAULT_POSTS,
  cats: ["Experience Thailand", "Best Adventures", "Sea & Beach", "Hiking Tours", "Kayaking Tours", "Winter Destinations"],
  messages: [],
  reviews: [],
  reviewTokens: [],
  services: [
    {
      id: 1,
      category: "event",
      title: "Paket Event Plan Reguler",
      badge: "Populer",
      badgeColor: "#2b7a9a",
      price: "Rp 5.000.000",
      priceNote: "/ event",
      images: ["https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&h=700&fit=crop",
      description: "Paket perencanaan event lengkap untuk acara reguler seperti seminar, gathering, dan corporate event.",
      features: ["Konsultasi event 2x pertemuan", "Dekorasi standar", "Dokumentasi foto", "Koordinasi vendor", "Rundown acara", "MC profesional"],
      highlight: false,
    },
    {
      id: 2,
      category: "wedding",
      title: "Paket Wedding Premium",
      badge: "Best Seller",
      badgeColor: "#e67e22",
      price: "Rp 25.000.000",
      priceNote: "/ wedding",
      images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=700&fit=crop",
      description: "Paket pernikahan lengkap dengan sentuhan premium. Wujudkan pernikahan impian Anda bersama tim profesional kami.",
      features: ["Konsultasi tak terbatas", "Dekorasi premium", "Dokumentasi foto & video", "Koordinasi 10+ vendor", "Wedding planner dedicated", "Catering 300 pax", "Entertainment & MC", "Souvenir tamu"],
      highlight: true,
    },
    {
      id: 3,
      category: "traveling",
      title: "Paket Traveling Group",
      badge: "Hemat",
      badgeColor: "#27ae60",
      price: "Rp 3.500.000",
      priceNote: "/ orang",
      images: ["https://images.unsplash.com/photo-1552641356-f51c88ca3e87?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1552641356-f51c88ca3e87?w=1600&h=700&fit=crop",
      description: "Paket wisata group terjangkau dengan destinasi pilihan dalam dan luar negeri. Minimum 10 peserta.",
      features: ["Transportasi PP", "Akomodasi 3 malam", "Tour guide lokal", "Makan 3x sehari", "Asuransi perjalanan", "Dokumentasi trip"],
      highlight: false,
    },
    {
      id: 4,
      category: "traveling",
      title: "Paket Traveling Eksklusif",
      badge: "Luxury",
      badgeColor: "#8e44ad",
      price: "Rp 15.000.000",
      priceNote: "/ orang",
      images: ["https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&h=700&fit=crop",
      description: "Pengalaman perjalanan mewah ke destinasi premium dunia. Layanan VIP dari keberangkatan hingga kepulangan.",
      features: ["Tiket business class", "Hotel bintang 5", "Private tour guide", "Makan fine dining", "Airport transfer VIP", "Asuransi premium", "Itinerary custom", "Concierge 24 jam"],
      highlight: false,
    },
    {
      id: 5,
      category: "traveling",
      title: "Paket Honeymoon Bali",
      badge: "Romantis",
      badgeColor: "#e84393",
      price: "Rp 8.500.000",
      priceNote: "/ pasangan",
      images: ["https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1573790387438-4da905039392?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&h=700&fit=crop",
      description: "Rayakan awal kehidupan baru Anda dengan paket honeymoon eksklusif di Pulau Dewata. Vila private, spa couple, dan sunset dinner menjadi kenangan tak terlupakan.",
      features: ["Vila private dengan kolam renang", "Sarapan romantis setiap hari", "Spa couple 2 jam", "Sunset dinner di tepi pantai", "Dekorasi kamar mewah", "Airport transfer private", "Asuransi perjalanan", "Tour Ubud & Seminyak"],
      highlight: true,
    },
    {
      id: 6,
      category: "traveling",
      title: "Paket Wisata Edukasi Jogja",
      badge: "Keluarga",
      badgeColor: "#16a085",
      price: "Rp 1.800.000",
      priceNote: "/ orang",
      images: ["https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1600&h=700&fit=crop",
      description: "Paket wisata keluarga yang menggabungkan petualangan dan edukasi di Kota Budaya Yogyakarta. Cocok untuk liburan sekolah dan family gathering.",
      features: ["Bus pariwisata ber-AC", "Hotel bintang 3 (2 malam)", "Makan 3x sehari", "Kunjungan Prambanan & Borobudur", "Tour guide berpengalaman", "Asuransi perjalanan", "Souvenir khas Jogja"],
      highlight: false,
    },
    {
      id: 7,
      category: "event",
      title: "Paket Gala Dinner & Award Night",
      badge: "Premium",
      badgeColor: "#c0392b",
      price: "Rp 35.000.000",
      priceNote: "/ event",
      images: ["https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&h=700&fit=crop",
      description: "Selenggarakan malam penghargaan perusahaan Anda dengan nuansa mewah dan berkesan. Kami tangani dari dekorasi megah hingga entertainment eksklusif untuk 200–500 tamu.",
      features: ["Dekorasi ballroom premium", "Sound & lighting profesional", "MC bilingual", "Catering fine dining 300 pax", "Live music & entertainment", "Dokumentasi foto & video sinematik", "Red carpet & photo booth", "Koordinasi penuh hari H"],
      highlight: true,
    },
    {
      id: 8,
      category: "event",
      title: "Paket Team Building Outdoor",
      badge: "Korporat",
      badgeColor: "#2980b9",
      price: "Rp 750.000",
      priceNote: "/ orang",
      images: ["https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1600&h=700&fit=crop",
      description: "Perkuat solidaritas tim Anda dengan program team building outdoor yang seru dan berenergi. Dirancang oleh fasilitator bersertifikat dengan aktivitas yang menantang dan menyenangkan.",
      features: ["Fasilitator bersertifikat", "Games & outbound activities", "Makan siang & snack", "Dokumentasi kegiatan", "Sertifikat peserta", "Shuttle dari titik kumpul", "Evaluasi & debrief sesi", "Min. 30 peserta"],
      highlight: false,
    },
    {
      id: 9,
      category: "event",
      title: "Paket Seminar & Workshop",
      badge: "Edukatif",
      badgeColor: "#27ae60",
      price: "Rp 3.200.000",
      priceNote: "/ event",
      images: ["https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&h=700&fit=crop",
      description: "Paket penyelenggaraan seminar dan workshop profesional dengan fasilitas lengkap. Ideal untuk training karyawan, seminar publik, dan workshop kreatif hingga 150 peserta.",
      features: ["Venue kapasitas 150 orang", "Proyektor & sound system", "Backdrop & signage branding", "Coffee break 2x & makan siang", "Registrasi & perlengkapan peserta", "Dokumentasi foto", "Koordinator acara", "Sertifikat digital peserta"],
      highlight: false,
    },
    {
      id: 10,
      category: "wedding",
      title: "Paket Wedding Intimate Garden",
      badge: "Terlaris",
      badgeColor: "#e67e22",
      price: "Rp 18.000.000",
      priceNote: "/ wedding",
      images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=700&fit=crop",
      description: "Pernikahan intim nan hangat di taman dengan dekorasi bohemian elegan. Cocok untuk pernikahan kecil 50–100 tamu dengan nuansa natural yang tetap mewah dan berkesan.",
      features: ["Dekorasi garden bohemian", "Wedding planner dedicated", "Dokumentasi foto & video", "Catering 100 pax", "Pelaminan custom", "Bunga segar premium", "MC profesional", "Koordinasi vendor"],
      highlight: false,
    },
    {
      id: 11,
      category: "wedding",
      title: "Paket Wedding Syar'i Lengkap",
      badge: "Islami",
      badgeColor: "#1abc9c",
      price: "Rp 22.000.000",
      priceNote: "/ wedding",
      images: ["https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&h=700&fit=crop",
      description: "Wujudkan pernikahan Islami yang penuh berkah dengan konsep syar'i modern. Kami memastikan setiap detail prosesi sesuai nilai Islam dengan tampilan yang tetap elegan dan menawan.",
      features: ["Dekorasi Islami modern", "Pembatas tamu putra & putri", "Qori & sambutan religi", "Catering halal 200 pax", "Pelaminan syar'i", "Dokumentasi foto & video", "Wedding planner", "Buku tamu & souvenir"],
      highlight: false,
    },
    {
      id: 12,
      category: "wedding",
      title: "Paket Wedding Glamour Ballroom",
      badge: "Mewah",
      badgeColor: "#8e44ad",
      price: "Rp 55.000.000",
      priceNote: "/ wedding",
      images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&h=700&fit=crop", "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&h=700&fit=crop"],
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&h=700&fit=crop",
      description: "Pernikahan megah berkelas di ballroom bintang 5 dengan dekorasi mewah penuh chandelier dan bunga segar premium. Untuk 300–600 tamu dengan layanan all-inclusive terbaik.",
      features: ["Ballroom hotel bintang 5", "Dekorasi full flowers premium", "Bridal suite 2 malam", "Catering fine dining 400 pax", "Entertainment & live band", "Foto & video sinematik", "Wedding planner senior", "Makeup artist profesional", "Souvenir premium", "Pagar ayu & pager bagus"],
      highlight: true,
    },
  ],
  teamMembers: [
    { id: 1, name: "Budi Santoso", role: "CEO & Founder", quotes: "Setiap momen spesial layak dirayakan dengan sempurna.", photo: "https://ui-avatars.com/api/?name=Budi+Santoso&size=300&background=2d2d2d&color=fff&bold=true" },
    { id: 2, name: "Sari Dewi", role: "Wedding Coordinator", quotes: "Kami hadir untuk mewujudkan impian pernikahan Anda.", photo: "https://ui-avatars.com/api/?name=Sari+Dewi&size=300&background=2b7a9a&color=fff&bold=true" },
    { id: 3, name: "Raka Pratama", role: "Travel Manager", quotes: "Perjalanan terbaik dimulai dari perencanaan yang matang.", photo: "https://ui-avatars.com/api/?name=Raka+Pratama&size=300&background=c9aa71&color=fff&bold=true" },
    { id: 4, name: "Dini Rahayu", role: "Event Organizer", quotes: "Kreativitas adalah kunci event yang tak terlupakan.", photo: "https://ui-avatars.com/api/?name=Dini+Rahayu&size=300&background=27ae60&color=fff&bold=true" },
  ],
  users: HARDCODED_USERS.map((u, i) => ({ id: i + 1, ...u, email: `${u.username}@arutala.com`, active: true })),
};

/* ─────────────── GLOBAL STYLES ─────────────── */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
    body{font-family:'DM Sans',sans-serif;background:#f4f9fb;color:#2d2d2d;line-height:1.6;font-size:16px}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#b8d4e3;border-radius:10px}
    a{text-decoration:none;color:inherit}
    a:focus-visible,button:focus-visible{outline:2px solid #3d8fab;outline-offset:3px;border-radius:3px}
    img{max-width:100%;display:block;object-fit:cover}
    input,textarea,select,button{font-family:'DM Sans',sans-serif}
    button{cursor:pointer;border:none;background:none}
    .serif{font-family:'Cormorant Garamond',serif}
    .display{font-family:'Playfair Display',serif}
    .fade-in{animation:fadeIn .4s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

    h1,h2,h3,h4,h5{font-family:'Playfair Display',serif;color:#2d2d2d;line-height:1.15;font-weight:800;letter-spacing:-.01em}
    h1{font-size:clamp(2rem,5vw,3.5rem)}
    h2{font-size:clamp(1.6rem,3.5vw,2.6rem)}
    h3{font-size:clamp(1.2rem,2.5vw,1.6rem)}
    p{font-size:1rem;line-height:1.75;color:#334f65}
    small{font-size:.875rem;line-height:1.5}

    .nav-link{position:relative;padding-bottom:3px;font-size:.875rem;letter-spacing:.04em;font-weight:600;color:#334f65;transition:color .2s;text-shadow:0 1px 4px rgba(45,45,45,.18),0 0 12px rgba(43,122,154,.10)}
    .nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:#2b7a9a;transition:width .3s;border-radius:2px}
    .nav-link:hover{color:#2b7a9a;text-shadow:0 1px 6px rgba(43,122,154,.28),0 0 18px rgba(43,122,154,.18)}
    .nav-link:hover::after,.nav-link.active::after{width:100%}
    .nav-link.active{color:#2b7a9a!important;text-shadow:0 1px 8px rgba(43,122,154,.35),0 0 20px rgba(43,122,154,.20)}

    .hover-lift{transition:transform .3s,box-shadow .3s}
    .hover-lift:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(45,45,45,.12)}
    .img-zoom{overflow:hidden}
    .img-zoom img{transition:transform .6s cubic-bezier(.25,.46,.45,.94)}
    .img-zoom:hover img{transform:scale(1.07)}
    .cms-toolbar button:hover{background:rgba(43,122,154,.12)!important}
    .post-card:hover .post-card-title{color:#2b7a9a}

    /* DESKTOP-ONLY ANIMATIONS */
    @media(pointer:fine){
      .anim-fade-up{opacity:0;transform:translateY(32px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
      .anim-fade-up.visible{opacity:1;transform:translateY(0)}
      .anim-zoom{opacity:0;transform:scale(.94);transition:opacity .65s ease,transform .65s ease}
      .anim-zoom.visible{opacity:1;transform:scale(1)}
      .btn-magnetic{transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s}
      .btn-magnetic:hover{transform:scale(1.045) translateY(-2px);box-shadow:0 12px 32px rgba(45,45,45,.18)}
      .post-card{transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s;transform-style:preserve-3d}
      .post-card:hover{transform:translateY(-6px) rotate3d(1,1,0,.8deg);box-shadow:0 20px 48px rgba(45,45,45,.14)}
      @keyframes heroReveal{from{opacity:0;letter-spacing:-.05em;filter:blur(6px)}to{opacity:1;letter-spacing:-.01em;filter:blur(0)}}
      .hero-title-anim{animation:heroReveal .9s cubic-bezier(.22,1,.36,1) .15s both}
      @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      .hero-img-grid>div:nth-child(1){animation:floatA 5s ease-in-out infinite}
      .hero-img-grid>div:nth-child(2){animation:floatB 6s ease-in-out infinite .5s}
      .hero-img-grid>div:nth-child(3){animation:floatA 7s ease-in-out infinite 1s}
      .hero-img-grid>div:nth-child(4){animation:floatB 5.5s ease-in-out infinite .8s}
      #cursor-glow{pointer-events:none;position:fixed;width:24px;height:24px;border-radius:50%;background:rgba(43,122,154,.22);border:1.5px solid rgba(43,122,154,.45);transform:translate(-50%,-50%);transition:left .06s ease,top .06s ease,width .25s,height .25s,background .25s;z-index:99998;mix-blend-mode:multiply}
      #cursor-glow.expanded{width:48px;height:48px;background:rgba(43,122,154,.1)}
    }

    .logo-brand{font-family:'Playfair Display',serif;font-weight:900;font-size:1.3rem;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:#2d2d2d;text-shadow:0 1px 4px rgba(45,45,45,.22),0 2px 10px rgba(45,45,45,.13)}
    .logo-brand-footer{font-family:'Playfair Display',serif;font-weight:800;font-size:.95rem;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:#2d2d2d}
    .logo-brand-admin{font-family:'Playfair Display',serif;font-weight:800;font-size:.9rem;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.3)}
    .label-xs{font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600}
    .card-title{font-family:'Playfair Display',serif;font-weight:700;font-size:1.15rem;line-height:1.3;color:#2d2d2d}

    /* ── Visibility helpers ── */
    @media(max-width:900px){.hide-md{display:none!important}}
    @media(max-width:900px){.hide-sm{display:none!important}.show-sm{display:flex!important}}
    @media(min-width:901px){.show-sm{display:none!important}}

    /* ══════════════════════════════════════
       RESPONSIVE LAYOUT UTILITIES
    ══════════════════════════════════════ */

    /* Two-column grid → single column on mobile */
    .grid-2{display:grid;grid-template-columns:1.618fr 1fr;gap:64px;align-items:center}
    @media(max-width:768px){.grid-2{grid-template-columns:1fr!important;gap:32px!important}}

    /* Hero section */
    .hero-section{padding:70px 5% 80px}
    @media(max-width:768px){.hero-section{padding:48px 5% 52px}}

    /* Section padding */
    .section-lg{padding:90px 0;position:relative;overflow:hidden}
    .section-lg .section-inner{max-width:1340px;margin:0 auto;padding:0 72px}
    .section-md{padding:80px 5%}
    @media(max-width:768px){.section-lg{padding:52px 0}.section-lg .section-inner{padding:0 20px}.section-md{padding:44px 5%}}

    /* Hero images grid: hide on mobile to prioritize text */
    .hero-img-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    @media(max-width:768px){.hero-img-grid{display:none}}

    /* Adventure images: stack on mobile */
    .adv-img-row{display:flex;gap:14px;align-items:flex-end}
    @media(max-width:768px){.adv-img-row{display:none}}

    /* Magazine grid kanan */
    .mag-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:10px;position:relative}
    .mag-img-main{grid-column:1;grid-row:1/3;border-radius:6px;overflow:hidden;position:relative}
    .mag-img-main img{width:100%;height:100%;min-height:320px;object-fit:cover;display:block;transition:transform .6s ease}
    .mag-img-main:hover img{transform:scale(1.04)}
    .mag-img-main .foto-label{position:absolute;bottom:12px;left:12px;background:rgba(45,45,45,.82);color:#fff;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:3px;font-weight:600}
    .mag-img-sm1{grid-column:2;grid-row:1;border-radius:6px;overflow:hidden}
    .mag-img-sm1 img{width:100%;height:155px;object-fit:cover;display:block;transition:transform .6s ease}
    .mag-img-sm1:hover img{transform:scale(1.04)}
    .mag-card-text{grid-column:2;grid-row:2;background:#2d2d2d;border-radius:6px;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;min-height:155px}
    .adv-stats-row{display:flex;gap:32px;margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid #eef3f7}
    .adv-stat .num{font-family:'Playfair Display',serif;font-size:1.75rem;font-weight:900;color:#2d2d2d;line-height:1;margin-bottom:3px}
    .adv-stat .lbl{font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:#8aabbd;font-weight:600}
    .adv-eyebrow{display:flex;align-items:center;gap:14px;margin-bottom:22px}
    .adv-eyebrow .ey-line{width:36px;height:1.5px;background:#c9aa71;flex-shrink:0}
    .adv-quote{font-size:.9375rem;color:#4e6b80;line-height:1.9;font-style:italic;max-width:400px;margin-bottom:28px;padding-left:18px;border-left:2px solid #c9aa71;white-space:pre-line}

    /* Margin dekorasi kiri-kanan */
    .adv-margin-deco{position:absolute;top:0;bottom:0;width:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px 0}
    .adv-margin-deco.left{left:0;border-right:1px solid #e8eef2}
    .adv-margin-deco.right{right:0;border-left:1px solid #e8eef2}
    .adv-margin-deco .issue-text{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#c0cdd6;writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600}
    .adv-margin-deco .dot-col{display:flex;flex-direction:column;gap:6px;align-items:center}
    .adv-margin-deco .dot{width:4px;height:4px;border-radius:50%;background:#ddeef5}
    .adv-margin-deco .dot.on{background:#2d2d2d}
    .deco-corner-tr{position:absolute;top:20px;right:60px;width:70px;height:70px;border-top:1.5px solid #e8eef2;border-right:1.5px solid #e8eef2;pointer-events:none}
    .deco-corner-bl{position:absolute;bottom:20px;left:60px;width:50px;height:50px;border-bottom:1.5px solid #e8eef2;border-left:1.5px solid #e8eef2;pointer-events:none}
    @media(max-width:900px){.adv-margin-deco{display:none}.deco-corner-tr,.deco-corner-bl{display:none}.section-inner{padding:0 24px!important}}
    @media(max-width:768px){.mag-grid{display:none}.adv-stats-row{gap:20px}}

    /* ── Hero Intro Section (Title + Subtitle after slideshow) ── */
    .hero-intro{background:#fff;padding:56px 5% 48px;overflow:hidden;position:relative}
    .hero-intro-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
    .hero-intro-img{position:relative;border-radius:16px;overflow:hidden;box-shadow:0 24px 64px rgba(45,45,45,.14)}
    .hero-intro-img img{width:100%;height:380px;object-fit:cover;display:block;transition:transform .8s cubic-bezier(.25,.46,.45,.94)}
    .hero-intro-img:hover img{transform:scale(1.04)}
    /* Ornamen shape */
    .hero-intro-img::before{content:"";position:absolute;top:-18px;left:-18px;width:90px;height:90px;border-radius:50%;background:rgba(201,170,113,.18);z-index:0;pointer-events:none}
    .hero-intro-img::after{content:"";position:absolute;bottom:-14px;right:-14px;width:60px;height:60px;border:3px solid rgba(43,122,154,.25);border-radius:50%;z-index:0;pointer-events:none}
    .hero-intro-txt{position:relative;z-index:1}
    .hero-intro-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:18px}
    .hero-intro-eyebrow .line{width:36px;height:2px;background:linear-gradient(90deg,#c9aa71,rgba(201,170,113,0));border-radius:1px}
    .hero-intro-h1{font-family:"Playfair Display",serif;font-size:clamp(1.9rem,4.5vw,3.2rem);font-weight:900;color:#2d2d2d;line-height:1.08;margin-bottom:20px;letter-spacing:-.02em}
    .hero-intro-p{font-size:1rem;color:#4e6b80;line-height:1.85;margin-bottom:32px;max-width:400px}
    /* Deco blobs background */
    .hero-intro-blob1{position:absolute;top:-60px;right:-80px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(43,122,154,.07) 0%,rgba(43,122,154,0) 70%);pointer-events:none}
    .hero-intro-blob2{position:absolute;bottom:-40px;left:40%;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(201,170,113,.09) 0%,rgba(201,170,113,0) 70%);pointer-events:none}
    /* Ornamen dekoratif teks */
    .hero-intro-deco-line{position:absolute;top:0;right:0;width:1px;height:100%;background:linear-gradient(to bottom,rgba(45,45,45,0),rgba(45,45,45,.08),rgba(45,45,45,0));pointer-events:none}
    /* Animasi reveal */
    @keyframes introImgReveal{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:none}}
    @keyframes introTxtReveal{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
    @keyframes shapeFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(4deg)}}
    @keyframes blobPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.08);opacity:1}}
    .hero-intro-img{animation:introImgReveal .8s cubic-bezier(.22,1,.36,1) .1s both}
    .hero-intro-txt{animation:introTxtReveal .8s cubic-bezier(.22,1,.36,1) .25s both}
    .hero-intro-blob1{animation:blobPulse 6s ease-in-out infinite}
    .hero-intro-blob2{animation:blobPulse 8s ease-in-out infinite 2s}
    /* Mobile */
    @media(max-width:768px){
      .hero-intro{padding:36px 4% 32px}
      .hero-intro-inner{grid-template-columns:1fr;gap:28px}
      .hero-intro-img{order:1}
      .hero-intro-txt{order:2}
      .hero-intro-img img{height:220px;border-radius:12px}
      .hero-intro-h1{font-size:clamp(1.6rem,7vw,2.4rem)}
      .hero-intro-p{max-width:100%;font-size:.9375rem;margin-bottom:22px}
      .hero-intro-img::before,.hero-intro-img::after{display:none}
      .hero-intro-blob1,.hero-intro-blob2{display:none}
    }
    @media(max-width:480px){
      .hero-intro{padding:28px 4% 24px}
      .hero-intro-inner{gap:20px}
      .hero-intro-img img{height:190px}
    }

    /* ── Adventure Section — TEKS KIRI clean + PUZZLE IMG KANAN ── */
    .adv2-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;max-width:1100px;margin:0 auto}
    /* Teks kiri */
    .adv2-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:18px}
    .adv2-eyebrow .line{width:36px;height:1.5px;background:#c9aa71;flex-shrink:0}
    .adv2-eyebrow span{font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:#c9aa71;font-weight:700}
    .adv2-title{font-family:"Playfair Display",serif;font-size:clamp(1.8rem,3.8vw,2.8rem);font-weight:900;color:#fff;line-height:1.08;margin-bottom:14px}
    /* Quote slideshow */
    .adv2-quote-wrap{position:relative;min-height:56px;margin-bottom:28px;padding-left:16px;border-left:2px solid #c9aa71}
    .adv2-quote-item{position:absolute;top:0;left:16px;right:0;font-size:.9375rem;color:rgba(255,255,255,.75);line-height:1.85;font-style:italic;opacity:0;transition:opacity .6s ease;pointer-events:none}
    .adv2-quote-item.active{opacity:1;position:relative;left:0}
    .adv2-quote-dots{display:flex;gap:6px;margin-bottom:28px}
    .adv2-qdot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.25);border:none;cursor:pointer;transition:background .3s,width .3s}
    .adv2-qdot.on{width:18px;border-radius:3px;background:#c9aa71}
    .adv2-stats{display:flex;gap:28px;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,.12)}
    .adv2-stat .num{font-family:"Playfair Display",serif;font-size:1.75rem;font-weight:900;color:#c9aa71;line-height:1;margin-bottom:3px}
    .adv2-stat .lbl{font-size:.625rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.45);font-weight:600}
    .adv2-btns{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px}
    .adv2-btn-pill{padding:8px 16px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.15);border-radius:20px;font-size:.75rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
    .adv2-btn-pill:hover{background:rgba(255,255,255,.16);color:#fff}
    .adv2-cta{display:inline-flex;align-items:center;gap:10px;padding:12px 24px;background:linear-gradient(135deg,#c9aa71,#e8c97e);color:#2d2d2d;border:none;border-radius:6px;font-size:.8125rem;font-weight:800;cursor:pointer;letter-spacing:.06em;text-transform:uppercase;transition:opacity .2s,transform .2s;font-family:"Playfair Display",serif}
    .adv2-cta:hover{opacity:.9;transform:translateY(-1px)}
    /* Puzzle grid kanan */
    .adv2-puzzle{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:8px;height:480px}
    .adv2-puzzle-a{grid-column:1;grid-row:1/3;border-radius:12px;overflow:hidden}
    .adv2-puzzle-b{grid-column:2;grid-row:1;border-radius:12px;overflow:hidden}
    .adv2-puzzle-c{grid-column:2;grid-row:2;border-radius:12px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .adv2-puzzle-c-sm{border-radius:8px;overflow:hidden}
    .adv2-puzzle a,.adv2-puzzle-a,.adv2-puzzle-b,.adv2-puzzle-c-sm{transition:transform .35s;cursor:default}
    .adv2-puzzle-a:hover,.adv2-puzzle-b:hover,.adv2-puzzle-c-sm:hover{transform:scale(1.02)}
    .adv2-puzzle img{width:100%;height:100%;object-fit:cover;display:block}
    @media(max-width:900px){
      .adv2-grid{grid-template-columns:1fr;gap:36px}
      .adv2-puzzle{height:320px;order:-1}
      .adv2-puzzle-c{display:grid}
    }
    @media(max-width:480px){.adv2-puzzle{height:220px;gap:5px}}

    /* Book section images: hide on small screens */
    /* Book section images: hide on small screens */
    .book-img-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    @media(max-width:768px){.book-img-grid{display:none}}

    /* Contact grid */
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px}
    @media(max-width:768px){.contact-grid{grid-template-columns:1fr!important;gap:32px!important}}

    /* Globe section */
    .globe-inner{display:flex;align-items:center;gap:60px;flex-wrap:nowrap}
    .globe-visual{flex:0 0 auto;display:flex;align-items:center;justify-content:center}
    @media(max-width:768px){.globe-visual{display:none}}

    /* Footer grid */
    .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px}
    @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr;gap:32px}}
    @media(max-width:640px){.footer-grid{grid-template-columns:1fr;gap:28px}}

    /* About page */
    .about-hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
    .about-why-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
    @media(max-width:768px){.about-hero-grid{grid-template-columns:1fr;gap:32px}.about-why-grid{grid-template-columns:1fr;gap:16px}}

    /* Dashboard DashTabs grid */
    .dash-grid{display:grid;grid-template-columns:1fr 320px;gap:20px;align-items:start}
    @media(max-width:1024px){.dash-grid{grid-template-columns:1fr;gap:16px}}

    /* Admin panel: sidebar + main */
    .admin-body{display:flex;flex:1;overflow:hidden}
    .admin-sidebar{width:220px;background:#2d2d2d;flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column;transition:transform .25s}
    .admin-main{flex:1;overflow-y:auto;padding:32px}
    @media(max-width:768px){
      .admin-sidebar{position:fixed;top:58px;left:0;bottom:0;z-index:200;transform:translateX(-100%)}
      .admin-sidebar.open{transform:translateX(0)}
      .admin-main{padding:20px 16px}
    }

    /* Admin hamburger toggle — shown only on mobile */
    .admin-hamburger{display:none;background:none;border:none;color:rgba(255,255,255,.8);font-size:20px;padding:4px 8px;cursor:pointer;line-height:1}
    @media(max-width:768px){.admin-hamburger{display:flex;align-items:center}}

    /* Admin sidebar overlay on mobile */
    .sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:199}
    @media(max-width:768px){.sidebar-overlay.open{display:block}}

    /* CMS Editor: editor + sidebar */
    .cms-editor-grid{display:grid;grid-template-columns:1fr 300px;min-height:700px;max-height:calc(100vh - 120px);overflow:hidden}
    @media(max-width:900px){.cms-editor-grid{grid-template-columns:1fr;max-height:none;overflow:visible}}
    .cms-editor-left{padding:32px 40px;border-right:1px solid #eef4f8;overflow-y:auto;max-height:calc(100vh - 120px)}
    .cms-editor-right{padding:24px 20px;background:#fafcfd;display:flex;flex-direction:column;gap:20px;overflow-y:auto}
    @media(max-width:900px){
      .cms-editor-left{padding:20px 16px;max-height:none;border-right:none;border-bottom:1px solid #eef4f8}
      .cms-editor-right{padding:16px}
    }

    /* Dashboard profile header */
    .dash-profile-header{display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap}
    .dash-action-btns{display:flex;flex-direction:column;gap:10px;flex-shrink:0}
    @media(max-width:640px){
      .dash-profile-header{flex-direction:column;gap:16px}
      .dash-action-btns{flex-direction:row;flex-wrap:wrap;width:100%}
      .dash-action-btns button{flex:1;min-width:140px;justify-content:center}
    }

    /* Settings grid */
    .settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
    @media(max-width:640px){.settings-grid{grid-template-columns:1fr}}

    /* Profile grid */
    .profile-grid{display:grid;grid-template-columns:280px 1fr;gap:28px;align-items:start}
    @media(max-width:768px){.profile-grid{grid-template-columns:1fr}}

    /* Users table — horizontal scroll on mobile */
    .table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
    .table-wrap table{min-width:560px}

    /* Post section page */
    .section-header-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
    .section-filter-row{display:flex;gap:8px;flex-wrap:wrap}

    /* CMS top bar */
    .cms-topbar{background:#2d2d2d;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
    @media(max-width:640px){.cms-topbar{padding:12px 14px}.cms-topbar-btns{gap:6px}}

    /* Login modal */
    .login-modal{background:#fff;border-radius:8px;padding:48px 44px;width:90%;max-width:400px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.2)}
    @media(max-width:480px){.login-modal{padding:32px 22px}}

    /* Touch-friendly tap targets */
    @media(max-width:768px){
      button,a,[role=button]{min-height:40px}
      input,textarea,select{font-size:16px!important} /* prevent iOS zoom */
    }

    /* Reduced motion */
    @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}

    /* ══════════════════════════════════════════════
       MOBILE OPTIMISATION — COMPREHENSIVE OVERHAUL
    ══════════════════════════════════════════════ */

    /* 0. Base: box-sizing, no horizontal overflow */
    *,*::before,*::after{box-sizing:border-box}
    html,body{overflow-x:hidden;width:100%;-webkit-text-size-adjust:100%}
    img,video,iframe{max-width:100%;height:auto;display:block}

    /* 1. Navbar — compact on mobile, fully opaque */
    @media(max-width:640px){
      nav{background:#fafcfd!important;backdrop-filter:none!important;padding:0 4%!important}
      nav>div{height:60px!important;gap:10px!important}
    }

    /* 2. Hero Slideshow — readable height, no side gradients overflow */
    @media(max-width:640px){
      /* Side gradients: lebih tipis di mobile */
      .hero-side-grad{width:8%!important}
    }
    @media(max-width:380px){
      .hero-side-grad{display:none!important}
    }

    /* Map section mobile */
    @media(max-width:900px){
      .map-section-hide-mobile{display:none!important}
      .map-text-width{width:100%!important;padding:44px 5%!important}
    }

    /* 3. Adventure section — teks + stats selalu tampil, image grid tersembunyi */
    @media(max-width:768px){
      .mag-grid{display:none!important}
      .adv-quote{max-width:100%!important;white-space:normal!important}
      .adv-stats-row{flex-wrap:wrap!important;gap:16px!important}
      .adv-stat{min-width:80px}
      /* Tombol layanan wrap */
      div[style*="flexWrap: wrap"][style*="gap: 10"]{gap:8px!important}
    }
    @media(max-width:480px){
      .adv-stats-row{gap:12px!important}
      .adv-stat .num{font-size:1.4rem!important}
    }

    /* 4. Gallery grid — 2 kolom di mobile */
    @media(max-width:640px){
      .gal-grid{grid-template-columns:repeat(2,1fr)!important;gap:6px!important}
    }

    /* 5. Book section — full width satu kolom */
    @media(max-width:768px){
      .book-img-grid{display:none!important}
      /* Book section: single column */
      section[style*="#c5dde9"] > div.grid-2{display:block!important}
      section[style*="#c5dde9"] > div > div:last-child{padding-top:0!important}
    }

    /* 6. Contact / Globe section */
    @media(max-width:768px){
      .globe-visual{display:none!important}
      .globe-inner{flex-direction:column!important;gap:28px!important}
      /* Map search bar: wrap pada mobile */
      div[style*="rgba(255,255,255,.06)"]{font-size:14px!important}
    }
    @media(max-width:480px){
      /* Contact: stack input full width */
      .contact-grid input,.contact-grid textarea{font-size:16px!important}
    }

    /* 7. Section page (news/shop/destinations) */
    @media(max-width:768px){
      .section-page-grid{grid-template-columns:1fr!important;gap:24px!important}
      .section-page-grid aside{display:none!important}
    }

    /* 8. PostCard */
    @media(max-width:480px){
      .post-card-list{flex-direction:column!important}
      .post-card-list .post-thumb{width:100%!important;height:160px!important;border-radius:8px 8px 0 0!important}
    }

    /* 9. Services page */
    @media(max-width:640px){
      /* Category tabs: scrollable horizontal */
      div[style*="border-radius: 999px"][style*="overflow"]{overflow-x:auto!important;flex-wrap:nowrap!important;-webkit-overflow-scrolling:touch!important;padding-bottom:4px!important}
      /* Service cards: single column */
      div[style*="minmax(280px"]{grid-template-columns:1fr!important}
    }

    /* 10. About page */
    @media(max-width:768px){
      .about-hero-grid{grid-template-columns:1fr!important;gap:24px!important}
      .about-why-grid{grid-template-columns:1fr!important;gap:14px!important}
    }
    @media(max-width:640px){
      .about-hero-section{padding:36px 4%!important}
    }

    /* 11. Footer */
    @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important;gap:28px!important}}
    @media(max-width:640px){.footer-grid{grid-template-columns:1fr!important;gap:22px!important}}
    @media(max-width:480px){
      .footer-grid{gap:18px!important}
      /* Footer bottom bar: stack */
      div[style*="borderTop: \"1px solid #ddeef5\""] > div{flex-direction:column!important;gap:10px!important;align-items:flex-start!important}
    }

    /* 12. Navbar mobile menu — tidak tumpang tindih konten */
    @media(max-width:640px){
      /* Mobile menu dropdown: max-height + scroll kalau banyak item */
      nav > div + div{max-height:calc(100vh - 60px)!important;overflow-y:auto!important}
    }

    /* 13. WhatsApp button — jangan tutupi konten penting */
    @media(max-width:480px){
      a[title*="WhatsApp"]{bottom:16px!important;right:14px!important;width:50px!important;height:50px!important}
    }

    /* 14. Article detail */
    @media(max-width:640px){
      .article-body,.article-body *{max-width:100%!important;overflow-x:hidden!important}
      .article-body h1{font-size:clamp(1.4rem,7vw,2rem)!important}
      .article-back-bar{top:60px!important}
    }

    /* 15. Buttons: solid color, NO transparent background on mobile */
    @media(max-width:640px){
      /* About Us ghost button di hero → solid gelap */
      button.hero-cta-btn[style*="transparent"]{background:#2d2d2d!important;border-color:#2d2d2d!important;color:#fff!important}
      /* Explore All & Book Now ghost buttons → solid */
      button[style*='"transparent"']{background:#2d2d2d!important;color:#fff!important}
    }

    /* 16. Input: prevent iOS zoom, full width */
    @media(max-width:768px){
      input,textarea,select{font-size:16px!important;max-width:100%!important}
    }

    /* 17. Images: fluid & no overflow */
    img{max-width:100%;height:auto;object-fit:cover}

    /* 18. Pre-line text: wrap normal pada mobile (cegah overflow) */
    @media(max-width:640px){
      [style*="whiteSpace: \"pre-line\""]{white-space:normal!important;word-break:break-word!important}
    }

    /* 19. Grid-2 (golden ratio) → single col on mobile */
    @media(max-width:768px){
      .grid-2{grid-template-columns:1fr!important;gap:28px!important}
    }

    /* 20. Section spacing: tighter on mobile */
    @media(max-width:640px){
      .section-lg{padding:40px 0!important}
      .section-lg .section-inner{padding:0 16px!important}
      .section-md{padding:36px 4%!important}
      .hero-section{padding:32px 4% 36px!important}
    }

    /* 21. Dash-tab-row: scrollable horizontal */
    @media(max-width:480px){
      .dash-tab-row{overflow-x:auto!important;flex-wrap:nowrap!important;-webkit-overflow-scrolling:touch!important}
      .dash-tab-row button{flex-shrink:0!important;min-width:75px!important;font-size:.75rem!important;padding:11px 8px!important}
    }

    /* 22. Admin panel */
    @media(max-width:768px){
      .admin-main{padding:16px 14px!important}
    }
    @media(max-width:480px){
      .admin-main{padding:12px 10px!important}
    }

    /* 23. Table horizontal scroll */
    .table-wrap{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important}
    .table-wrap table{min-width:520px!important}

    /* 24. Login modal */
    @media(max-width:480px){.login-modal{padding:28px 18px!important;width:94%!important}}
    @media(max-width:360px){.login-modal{padding:22px 14px!important}}

    /* 25. Reduced-motion already set above */

    /* 26. Tap target minimum */
    @media(max-width:768px){
      button,a[href],[role=button]{min-height:42px;min-width:42px}
    }

    /* 27. Stats page/dash grid: single col on tablet */
    @media(max-width:1024px){.dash-grid{grid-template-columns:1fr!important;gap:16px!important}}

    /* 28. Hero slideshow CTA buttons — flex wrap, tidak tumpang tindih */
    @media(max-width:480px){
      .hero-cta-btn{flex:1!important;min-width:120px!important;text-align:center!important;padding:11px 16px!important;font-size:.75rem!important}
    }

    /* 29. Prevent any element from exceeding viewport */
    @media(max-width:640px){
      .page-wrap,main,[class*="section"]{max-width:100vw!important;overflow-x:hidden!important}
    }

    /* ══════════════════════════════════════
       MOBILE FIRST — GLOBAL FIXES
    ══════════════════════════════════════ */
    *{box-sizing:border-box}
    html{overflow-x:hidden}
    body{overflow-x:hidden;width:100%}

    /* Safe area for notch phones */
    @supports(padding:max(0px)){
      nav{padding-left:max(5%,env(safe-area-inset-left));padding-right:max(5%,env(safe-area-inset-right))}
    }

    /* Viewport meta helper — prevent horizontal overflow */
    .page-wrap{width:100%;max-width:100vw;overflow-x:hidden}

    /* ── Navbar mobile ── */
    @media(max-width:640px){
      nav{padding:0 4%!important}
      nav>div{height:64px!important}
      /* Mobile menu items: bigger tap targets */
      nav .mobile-nav-item{padding:12px 0;font-size:.9375rem}
    }

    /* ── Notification toast ── */
    @media(max-width:640px){
      .toast-notif{top:12px!important;right:12px!important;left:12px!important;max-width:none!important;font-size:13px}
    }

    /* ── Hero section mobile ── */
    @media(max-width:640px){
      .hero-section{padding:36px 4% 40px!important}
      .hero-section h1{font-size:clamp(1.75rem,8vw,2.5rem)!important;margin-bottom:14px!important}
      .hero-section p{font-size:.9375rem!important;margin-bottom:24px!important}
    }

    /* ── Section pages ── */
    @media(max-width:768px){
      /* Stack sidebar below posts on section pages */
      .section-page-grid{grid-template-columns:1fr!important;gap:28px!important}
      .section-page-grid aside{display:none} /* hide sidebar on mobile for clean view */
    }

    /* ── PostCard list view mobile ── */
    @media(max-width:480px){
      .post-card-list{flex-direction:column!important}
      .post-card-list .post-thumb{width:100%!important;height:160px!important}
    }

    /* ── Article Detail ── */
    @media(max-width:640px){
      .article-body{padding:28px 4% 60px!important}
      .article-body h1{font-size:clamp(1.5rem,7vw,2.25rem)!important}
      .article-back-bar{top:58px!important}
    }

    /* ── Contact grid mobile ── */
    @media(max-width:480px){
      .contact-grid{gap:24px!important}
    }

    /* ── Footer ── */
    @media(max-width:480px){
      .footer-grid{gap:20px!important}
    }

    /* ── About page ── */
    @media(max-width:640px){
      .about-hero-section{padding:40px 4%!important}
    }

    /* ── CMS Editor on mobile ── */
    @media(max-width:640px){
      .cms-editor-left{padding:16px 12px!important}
      .cms-editor-right{padding:12px!important}
    }

    /* ── Admin main padding on small phones ── */
    @media(max-width:480px){
      .admin-main{padding:14px 12px!important}
    }

    /* ── DashTabs: scrollable tab row on small screens ── */
    @media(max-width:480px){
      .dash-tab-row{overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;flex-wrap:nowrap!important}
      .dash-tab-row button{flex-shrink:0!important;min-width:80px!important;font-size:.75rem!important;padding:12px 10px!important}
    }

    /* ── Profile grid on phone ── */
    @media(max-width:480px){
      .profile-grid{gap:20px!important}
    }

    /* ── Fluid images ── */
    img{max-width:100%;height:auto}

    /* ── Gallery grid on mobile ── */
    @media(max-width:480px){
      .gal-grid{grid-template-columns:repeat(2,1fr)!important;gap:6px!important}
    }

    /* ── Tablet breakpoint 768-1024 ── */
    @media(min-width:641px) and (max-width:1024px){
      .hero-section{padding:52px 5% 60px}
      .section-lg{padding:60px 5%}
      .section-md{padding:52px 5%}
      /* Section page: narrower sidebar */
      .section-page-grid{grid-template-columns:1fr 260px!important;gap:28px!important}
    }

    /* ── Login modal ── */
    @media(max-width:360px){.login-modal{padding:24px 16px!important}}

    /* ── Globe section on tablet ── */
    @media(max-width:900px) and (min-width:641px){
      .globe-visual{width:200px!important}
    }

    /* ── General spacing utility on small phones ── */
    @media(max-width:360px){
      body{font-size:15px}
      h1{font-size:clamp(1.6rem,9vw,2.2rem)!important}
    }
  `}</style>
);

/* ─────────────── CEF: Content Edit Field (outside main to prevent remount) ─────────────── */
function CEF({ val, multiline, onChange, onSave }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", width: "100%" }}>
      {multiline
        ? <textarea value={val} onChange={onChange}
            style={{ flex: 1, padding: "8px 10px", border: "1px solid #b8d4e3", borderRadius: 6, fontSize: 14, resize: "vertical", minHeight: 80 }} />
        : <input value={val} onChange={onChange}
            style={{ flex: 1, padding: "8px 10px", border: "1px solid #b8d4e3", borderRadius: 6, fontSize: 14 }} />
      }
      <button onClick={onSave}
        style={{ padding: "8px 14px", background: "#3d8fab", color: "#fff", borderRadius: 6, fontSize: 12, border: "none" }}>Save</button>
    </div>
  );
}

/* ─────────────── LOGO DISPLAY ─────────────── */
function LogoDisplay({ content, size = "nav" }) {
  const lines = (content.logoText || "").split("\n");
  const iconSz = size === "nav" ? 72 : 34;
  if (content.logoImage) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={content.logoImage} alt={content.logoText}
          style={{ height: iconSz, maxWidth: size === "nav" ? 72 : 120, objectFit: "contain", display: "block" }} />
        <span className={size === "admin" ? "logo-brand-admin" : size === "footer" ? "logo-brand-footer" : "logo-brand"}>
          {lines.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
        </span>
      </div>
    );
  }
  /* Text-only: slot on left reserved for future logo image */
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* Logo placeholder slot — keeps layout stable when image is uploaded */}
      <div style={{
        width: iconSz, height: iconSz,
        borderRadius: size === "nav" ? 12 : 8,
        border: `1.5px dashed ${size === "admin" ? "rgba(255,255,255,.3)" : "#b8d4e3"}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        background: size === "admin" ? "rgba(255,255,255,.06)" : "rgba(61,143,171,.06)"
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={size === "admin" ? "rgba(255,255,255,.4)" : "#9bbfd0"} strokeWidth="1.5"
          width={size === "nav" ? 32 : 18} height={size === "nav" ? 32 : 18}>
          <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <span className={size === "admin" ? "logo-brand-admin" : size === "footer" ? "logo-brand-footer" : "logo-brand"}>
        {lines.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
      </span>
    </div>
  );
}


const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const formatDate = (d) => {
  try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
  catch { return d; }
};

/* ─────────────── RICH TEXT RENDERER ─────────────── */
function RichRenderer({ blocks }) {
  if (!blocks || !blocks.length) return <p style={{ color: "#6b8999", fontStyle: "italic" }}>No content yet.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {blocks.map((b, i) => {
        if (b.type === "paragraph") return (
          <div key={i} style={{ fontSize: "1rem", lineHeight: 1.85, color: "#334f65" }}
            dangerouslySetInnerHTML={{ __html: b.value }} />
        );
        if (b.type === "heading") return (
          <h2 key={i} className="display" style={{ fontSize: "1.625rem", fontWeight: 800, color: "#2d2d2d", marginTop: 12 }}>{b.value}</h2>
        );
        if (b.type === "image") return (
          <figure key={i} style={{ margin: "10px 0" }}>
            <img src={b.value} alt={b.caption || ""} style={{ width: "100%", maxHeight: 460, objectFit: "cover", borderRadius: 8 }} />
            {b.caption && <figcaption style={{ fontSize: "0.8125rem", color: "#4e6b80", textAlign: "center", marginTop: 10, fontStyle: "italic", lineHeight: 1.5 }}>{b.caption}</figcaption>}
          </figure>
        );
        if (b.type === "quote") return (
          <blockquote key={i} style={{ borderLeft: "3px solid #2b7a9a", paddingLeft: 22, margin: "10px 0" }}>
            <p style={{ fontSize: "1.125rem", fontStyle: "italic", color: "#334f65", lineHeight: 1.75, fontFamily: "'Cormorant Garamond',serif" }}>{b.value}</p>
          </blockquote>
        );
        if (b.type === "embed_instagram") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ background: "#f4f9fb", border: "1px solid #ddeef5", borderRadius: 8, padding: 16, fontSize: "0.8125rem", color: "#4e6b80" }}>
              📸 <strong>Instagram Embed:</strong> <a href={b.value} target="_blank" rel="noopener noreferrer" style={{ color: "#2b7a9a" }}>{b.value}</a>
              <blockquote className="instagram-media" data-instgrm-permalink={b.value} data-instgrm-version="14" style={{ border: "1px solid #d0e4ee", borderRadius: 6, padding: 10, marginTop: 8, background: "#fff" }}>
                <a href={b.value} target="_blank" rel="noopener noreferrer" style={{ color: "#2b7a9a", display: "block", marginTop: 6 }}>View on Instagram</a>
              </blockquote>
            </div>
          </div>
        );
        if (b.type === "embed_tiktok") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ background: "#f4f9fb", border: "1px solid #ddeef5", borderRadius: 8, padding: 16, fontSize: "0.8125rem", color: "#4e6b80" }}>
              🎵 <strong>TikTok Embed:</strong> <a href={b.value} target="_blank" rel="noopener noreferrer" style={{ color: "#2b7a9a" }}>{b.value}</a>
              <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #d0e4ee", padding: "12px 14px", marginTop: 8 }}>
                <blockquote className="tiktok-embed" cite={b.value} data-video-id={b.value.split("/video/")[1]?.split("?")[0] || ""}>
                  <section><a href={b.value} target="_blank" rel="noopener noreferrer" style={{ color: "#2b7a9a" }}>View on TikTok</a></section>
                </blockquote>
              </div>
            </div>
          </div>
        );
        if (b.type === "divider") return <hr key={i} style={{ border: "none", borderTop: "1px solid #ddeef5" }} />;
        return null;
      })}
    </div>
  );
}

/* ─────────────── RICH PARAGRAPH EDITOR ─────────────── */
function RichParagraphEditor({ value, onChange, placeholder = "Write your content here..." }) {
  const editorRef = useRef();
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [highlightMenuOpen, setHighlightMenuOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
      setIsEmpty(!value);
    }
  }, []); // only on mount

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(cmd, false, val);
    if (editorRef.current) { onChange(editorRef.current.innerHTML); setIsEmpty(!editorRef.current.textContent.trim()); }
  };

  const handleInput = () => {
    if (editorRef.current) { onChange(editorRef.current.innerHTML); setIsEmpty(!editorRef.current.textContent.trim()); }
  };

  useEffect(() => {
    const close = (e) => { if (!e.target.closest?.("[data-richpicker]")) { setColorMenuOpen(false); setHighlightMenuOpen(false); } };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const TB = ({ cmd, val = null, title, children, extraStyle = {} }) => (
    <button title={title} onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
      style={{ padding: "3px 7px", fontSize: 13, border: "1px solid #d0e4ee", borderRadius: 4, background: "#fff", color: "#4a6680", cursor: "pointer", lineHeight: 1.4, display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 26, ...extraStyle }}>
      {children}
    </button>
  );
  const SEP = () => <span style={{ width: 1, height: 20, background: "#d0e4ee", display: "inline-block", margin: "0 3px", verticalAlign: "middle" }} />;

  const textColors = ["#000000","#2d2d2d","#2b7a9a","#e74c3c","#27ae60","#f39c12","#8e44ad","#e67e22","#7f8c8d","#ffffff"];
  const hlColors  = ["#ffff00","#00ff7f","#ff9900","#ffcccc","#cce5ff","#e2ccff","transparent"];
  const fontSizeMap = {"8":1,"10":2,"12":3,"14":4,"18":5,"24":6,"36":7};

  return (
    <div style={{ border: "1.5px solid #d0e4ee", borderRadius: 8, overflow: "visible", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
      {/* ── Toolbar Row 1: Font, Size, Basic Formatting ── */}
      <div style={{ background: "#f4f9fb", borderBottom: "1px solid #ddeef5", padding: "6px 10px", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
        <select onChange={e => exec("fontName", e.target.value)}
          style={{ height: 26, fontSize: 12, padding: "1px 4px", border: "1px solid #d0e4ee", borderRadius: 4, background: "#fff", color: "#2d2d2d", maxWidth: 130, cursor: "pointer" }}>
          {["Calibri (Body)","Arial","Times New Roman","Georgia","Verdana","Courier New","Trebuchet MS"].map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select onChange={e => exec("fontSize", fontSizeMap[e.target.value] || 3)}
          style={{ height: 26, fontSize: 12, padding: "1px 4px", border: "1px solid #d0e4ee", borderRadius: 4, background: "#fff", color: "#2d2d2d", width: 52, cursor: "pointer" }}>
          {["8","10","11","12","14","16","18","20","24","28","32","36"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <SEP />
        <TB cmd="bold" title="Bold (Ctrl+B)"><strong style={{fontSize:13,fontWeight:900}}>B</strong></TB>
        <TB cmd="italic" title="Italic (Ctrl+I)"><em style={{fontSize:13}}>I</em></TB>
        <TB cmd="underline" title="Underline (Ctrl+U)"><span style={{textDecoration:"underline",fontSize:13}}>U</span></TB>
        <TB cmd="strikeThrough" title="Strikethrough"><span style={{textDecoration:"line-through",fontSize:13}}>S</span></TB>
        <SEP />
        {/* Text Color */}
        <div style={{position:"relative"}} data-richpicker="1">
          <button title="Font Color" onMouseDown={e=>{e.preventDefault();setColorMenuOpen(p=>!p);setHighlightMenuOpen(false);}}
            style={{padding:"2px 7px",border:"1px solid #d0e4ee",borderRadius:4,background:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,minHeight:26,lineHeight:1}}>
            <span style={{fontSize:13,fontWeight:900,color:"#2d2d2d",lineHeight:1}}>A</span>
            <span style={{width:14,height:3,background:"#e74c3c",borderRadius:1}}/>
          </button>
          {colorMenuOpen && (
            <div style={{position:"absolute",top:32,left:0,background:"#fff",border:"1px solid #d0e4ee",borderRadius:8,padding:8,zIndex:9999,display:"flex",gap:4,flexWrap:"wrap",width:132,boxShadow:"0 6px 20px rgba(0,0,0,.15)"}}>
              <div style={{width:"100%",fontSize:10,color:"#7a9db0",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",marginBottom:2}}>Warna Teks</div>
              {textColors.map(c=>(
                <button key={c} onMouseDown={e=>{e.preventDefault();exec("foreColor",c);setColorMenuOpen(false);}}
                  style={{width:22,height:22,borderRadius:4,background:c,border:"1.5px solid #d0e4ee",cursor:"pointer",outline:"none"}}/>
              ))}
            </div>
          )}
        </div>
        {/* Highlight */}
        <div style={{position:"relative"}} data-richpicker="1">
          <button title="Sorot Teks" onMouseDown={e=>{e.preventDefault();setHighlightMenuOpen(p=>!p);setColorMenuOpen(false);}}
            style={{padding:"2px 7px",border:"1px solid #d0e4ee",borderRadius:4,background:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,minHeight:26,lineHeight:1}}>
            <span style={{fontSize:11,color:"#333",lineHeight:1,fontWeight:600}}>ab</span>
            <span style={{width:14,height:3,background:"#ffff00",border:"1px solid #ccc",borderRadius:1}}/>
          </button>
          {highlightMenuOpen && (
            <div style={{position:"absolute",top:32,left:0,background:"#fff",border:"1px solid #d0e4ee",borderRadius:8,padding:8,zIndex:9999,display:"flex",gap:4,flexWrap:"wrap",width:110,boxShadow:"0 6px 20px rgba(0,0,0,.15)"}}>
              <div style={{width:"100%",fontSize:10,color:"#7a9db0",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",marginBottom:2}}>Sorotan</div>
              {hlColors.map(c=>(
                <button key={c} onMouseDown={e=>{e.preventDefault();exec("hiliteColor",c);setHighlightMenuOpen(false);}}
                  style={{width:22,height:22,borderRadius:4,background:c,border:"1.5px solid #d0e4ee",cursor:"pointer",outline:"none"}} title={c === "transparent" ? "Hapus Sorotan" : c}/>
              ))}
            </div>
          )}
        </div>
        <SEP />
        <TB cmd="undo" title="Undo (Ctrl+Z)">↶</TB>
        <TB cmd="redo" title="Redo (Ctrl+Y)">↷</TB>
      </div>

      {/* ── Toolbar Row 2: Lists, Indent, Paragraph, Alignment ── */}
      <div style={{ background: "#f4f9fb", borderBottom: "1px solid #ddeef5", padding: "5px 10px", display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
        <TB cmd="insertUnorderedList" title="Daftar Bullet">
          <span style={{display:"flex",flexDirection:"column",gap:2,alignItems:"flex-start"}}>
            <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:4,height:4,borderRadius:"50%",background:"currentColor"}}/>
            <span style={{width:12,height:1.5,background:"currentColor"}}/></span>
            <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:4,height:4,borderRadius:"50%",background:"currentColor"}}/>
            <span style={{width:9,height:1.5,background:"currentColor"}}/></span>
          </span>
        </TB>
        <TB cmd="insertOrderedList" title="Daftar Bernomor">
          <span style={{fontSize:11,fontWeight:600,lineHeight:1,letterSpacing:-1}}>1.≡</span>
        </TB>
        <SEP />
        <TB cmd="outdent" title="Kurangi Indent">
          <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><rect x="4" y="0" width="10" height="1.5" rx=".75"/><rect x="4" y="5" width="10" height="1.5" rx=".75"/><rect x="4" y="10" width="10" height="1.5" rx=".75"/><polygon points="3,6 0,4 0,8"/></svg>
        </TB>
        <TB cmd="indent" title="Tambah Indent">
          <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor"><rect x="4" y="0" width="10" height="1.5" rx=".75"/><rect x="4" y="5" width="10" height="1.5" rx=".75"/><rect x="4" y="10" width="10" height="1.5" rx=".75"/><polygon points="0,6 3,4 3,8"/></svg>
        </TB>
        <SEP />
        {/* Alignment */}
        <TB cmd="justifyLeft" title="Rata Kiri">
          <svg width="14" height="12" viewBox="0 0 14 12" stroke="currentColor" strokeWidth="1.5" fill="none"><line x1="0" y1="1" x2="14" y2="1"/><line x1="0" y1="5" x2="9" y2="5"/><line x1="0" y1="9" x2="14" y2="9"/><line x1="0" y1="11.5" x2="7" y2="11.5"/></svg>
        </TB>
        <TB cmd="justifyCenter" title="Tengah">
          <svg width="14" height="12" viewBox="0 0 14 12" stroke="currentColor" strokeWidth="1.5" fill="none"><line x1="0" y1="1" x2="14" y2="1"/><line x1="2.5" y1="5" x2="11.5" y2="5"/><line x1="0" y1="9" x2="14" y2="9"/><line x1="3.5" y1="11.5" x2="10.5" y2="11.5"/></svg>
        </TB>
        <TB cmd="justifyRight" title="Rata Kanan">
          <svg width="14" height="12" viewBox="0 0 14 12" stroke="currentColor" strokeWidth="1.5" fill="none"><line x1="0" y1="1" x2="14" y2="1"/><line x1="5" y1="5" x2="14" y2="5"/><line x1="0" y1="9" x2="14" y2="9"/><line x1="7" y1="11.5" x2="14" y2="11.5"/></svg>
        </TB>
        <TB cmd="justifyFull" title="Rata Kanan-Kiri (Justify)">
          <svg width="14" height="12" viewBox="0 0 14 12" stroke="currentColor" strokeWidth="1.5" fill="none"><line x1="0" y1="1" x2="14" y2="1"/><line x1="0" y1="5" x2="14" y2="5"/><line x1="0" y1="9" x2="14" y2="9"/><line x1="0" y1="11.5" x2="14" y2="11.5"/></svg>
        </TB>
        <SEP />
        {/* Line spacing quick insert */}
        <TB cmd="formatBlock" val="blockquote" title="Blockquote" extraStyle={{fontSize:11}}>❝</TB>
        <TB cmd="removeFormat" title="Hapus Format" extraStyle={{fontSize:11,color:"#e74c3c"}}>✕</TB>
      </div>

      {/* ── Editor Area ── */}
      <div style={{ position: "relative" }}>
        {isEmpty && (
          <div style={{ position:"absolute", top:16, left:18, color:"#b0c4d4", fontSize:14, fontStyle:"italic", pointerEvents:"none", userSelect:"none" }}>
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => setIsEmpty(false)}
          onBlur={() => setIsEmpty(!editorRef.current?.textContent?.trim())}
          style={{
            minHeight: 220, padding: "16px 18px", fontSize: 14, color: "#2d2d2d",
            lineHeight: 1.85, outline: "none", background: "#fff",
            fontFamily: "'Calibri', Arial, sans-serif",
            borderRadius: "0 0 6px 6px",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────── CMS EDITOR ─────────────── */
function CMSEditor({ post, onSave, onCancel, section, onSectionChange, user }) {
  const authorDefault = post?.author || user?.name || user?.username || "";
  const [form, setForm] = useState(post || {
    title: "", date: new Date().toISOString().slice(0, 10), author: authorDefault, category: "",
    coverImage: "", excerpt: "", content: [], tags: "", status: "draft", section,
  });
  const [blocks, setBlocks] = useState(post?.content || []);
  const [addType, setAddType] = useState("paragraph");
  const [addVal, setAddVal] = useState("");
  const [addCaption, setAddCaption] = useState("");
  const [imgUploadMode, setImgUploadMode] = useState("url");
  const [publishModal, setPublishModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(""); // "", "saving…", "tersimpan ✓"
  const fileRef = useRef();
  const autoSaveTimer = useRef();
  const draftKey = `cms-draft-${post?.id || "new"}`;

  /* ── Restore draft dari storage saat pertama kali buka (hanya post baru) ── */
  useEffect(() => {
    if (post?.id) return; // jangan timpa post yang sedang diedit
    (async () => {
      try {
        const r = await window.storage?.get(draftKey);
        if (r?.value) {
          const saved = JSON.parse(r.value);
          if (saved.title || (saved.content && saved.content.length > 0)) {
            setForm(f => ({ ...f, ...saved, author: saved.author || authorDefault }));
            setBlocks(saved.content || []);
            setAutoSaveStatus("↩ Draft dipulihkan");
            setTimeout(() => setAutoSaveStatus(""), 3000);
          }
        }
      } catch {}
    })();
  }, []);

  /* ── Auto-Save persisten: simpan ke window.storage agar bertahan meski halaman ditutup ── */
  useEffect(() => {
    if (!form.title && blocks.length === 0) return; // skip form kosong
    setAutoSaveStatus("Mengetik…");
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setAutoSaveStatus("Menyimpan…");
      const p = {
        ...form, content: blocks, status: "draft",
        id: form.id || Date.now(), section,
        tags: typeof form.tags === "string" ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : form.tags,
        _autoSaved: true,
      };
      // Simpan ke storage persisten (bertahan saat tab ditutup / perangkat mati)
      try { await window.storage?.set(draftKey, JSON.stringify({ ...form, content: blocks })); } catch {}
      onSave(p, true); // silent=true → tetap di editor, tidak keluar
      setAutoSaveStatus("✓ Tersimpan otomatis");
      setTimeout(() => setAutoSaveStatus(""), 3000);
    }, 3000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [form.title, form.excerpt, form.author, form.category, form.date, form.coverImage, form.tags, blocks]);

  const addBlock = () => {
    const val = (addType === "paragraph" ? addVal : addVal).trim?.() ?? addVal;
    if (addType !== "divider" && !val) return;
    const block = { type: addType, value: val };
    if (addCaption) block.caption = addCaption;
    setBlocks(p => [...p, block]);
    setAddVal(""); setAddCaption("");
  };

  const removeBlock = (i) => setBlocks(p => p.filter((_, idx) => idx !== i));
  const moveBlock = (i, dir) => {
    const b = [...blocks];
    const j = i + dir;
    if (j < 0 || j >= b.length) return;
    [b[i], b[j]] = [b[j], b[i]];
    setBlocks(b);
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      notify("⏳ Mengupload gambar...");
      const url = await uploadToCloudinary(file);
      setAddVal(url);
      notify("Gambar berhasil diupload!");
    } catch {
      notify("Gagal upload gambar. Coba lagi.", "error");
    }
  };

  const handleSave = async (status, targetSection = section) => {
    clearTimeout(autoSaveTimer.current);
    const p = {
      ...form,
      content: blocks,
      status,
      id: form.id || Date.now(),
      section: targetSection,
      tags: typeof form.tags === "string" ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : form.tags,
    };
    // Hapus draft persisten setelah publish / save manual
    try { await window.storage?.delete(draftKey); } catch {}
    onSave(p);
  };

  const blockLabels = {
    paragraph: "📝 Paragraph", heading: "📌 Heading", image: "🖼 Image",
    quote: "💬 Quote", embed_instagram: "📸 Instagram Embed", embed_tiktok: "🎵 TikTok Embed", divider: "⸻ Divider",
  };

  const needsValue = addType !== "divider";

  return (
    <div className="fade-in" style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.1)" }}>
      {/* ── Publish Destination Modal ── */}
      {publishModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,35,55,.55)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div className="fade-in" style={{ background: "#fff", borderRadius: 14, padding: "36px 40px", maxWidth: 440, width: "90%",
            boxShadow: "0 24px 60px rgba(0,0,0,.22)" }}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>🚀</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#2d2d2d", textAlign: "center", marginBottom: 6, fontFamily: "'Playfair Display',serif" }}>
              Pilih Tujuan Publish
            </h2>
            <p style={{ fontSize: 13, color: "#6b8999", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
              Artikel akan ditayangkan di seksi yang kamu pilih di bawah ini.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { key: "shop", icon: "✈", label: "Traveling", desc: "Paket perjalanan & tips wisata" },
                { key: "news", icon: "📅", label: "Event Plan", desc: "Berita & rencana acara terbaru" },
                { key: "destinations", icon: "💍", label: "Wedding Organizer", desc: "Venue & paket pernikahan" },
              ].map(opt => (
                <button key={opt.key} onClick={() => {
                  if (onSectionChange) onSectionChange(opt.key);
                  setPublishModal(false);
                  handleSave("published", opt.key);
                }} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
                  border: section === opt.key ? "2px solid #2d2d2d" : "1.5px solid #ddeef5",
                  borderRadius: 10, background: section === opt.key ? "#f0f5fa" : "#fff",
                  cursor: "pointer", textAlign: "left", transition: "all .15s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2b7a9a"; e.currentTarget.style.background = "#f4f9fb"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = section === opt.key ? "#2d2d2d" : "#ddeef5"; e.currentTarget.style.background = section === opt.key ? "#f0f5fa" : "#fff"; }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#2d2d2d" }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: "#6b8999", marginTop: 2 }}>{opt.desc}</div>
                  </div>
                  {section === opt.key && <span style={{ marginLeft: "auto", fontSize: 16, color: "#27ae60" }}>✓</span>}
                </button>
              ))}
            </div>
            <button onClick={() => setPublishModal(false)} style={{
              width: "100%", marginTop: 16, padding: "10px", border: "1px solid #d0e4ee",
              borderRadius: 8, fontSize: 13, color: "#6b8999", background: "#fafcfd", cursor: "pointer"
            }}>Batal</button>
          </div>
        </div>
      )}

      {/* CMS Top Bar */}
      <div style={{ background: "#2d2d2d", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
            {post?.id ? "Edit Post" : "Add New Post"} — <span style={{ color: "#7dc8de" }}>{SECTION_LABELS[section] || section}</span>
          </span>
          {autoSaveStatus && (
            <span style={{ fontSize: 11, color: autoSaveStatus.startsWith("✓") ? "#7dc8de" : "rgba(255,255,255,.5)", letterSpacing: ".3px" }}>
              {autoSaveStatus}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => handleSave("draft")} style={{
            padding: "7px 18px", border: "1px solid rgba(255,255,255,.3)", borderRadius: 6,
            color: "rgba(255,255,255,.85)", fontSize: 12, background: "none", letterSpacing: ".5px"
          }}>Save Draft</button>
          <button onClick={() => setPublishModal(true)} style={{
            padding: "7px 18px", background: "#27ae60", borderRadius: 6,
            color: "#fff", fontSize: 12, border: "none", fontWeight: 500, letterSpacing: ".5px"
          }}>🚀 Publish…</button>
          <button onClick={onCancel} style={{
            padding: "7px 14px", border: "none", borderRadius: 6,
            color: "rgba(255,255,255,.6)", fontSize: 12, background: "rgba(255,255,255,.08)"
          }}>✕</button>
        </div>
      </div>

      <div className="cms-editor-grid">
        {/* Left: Editor */}
        <div className="cms-editor-left">
          {/* Title */}
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Masukkan judul artikel di sini..."
            style={{ width: "100%", fontSize: 28, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600,
              color: "#2d2d2d", border: "none", outline: "none", borderBottom: "2px solid #eef4f8",
              paddingBottom: 14, marginBottom: 24, background: "transparent" }} />

          {/* Excerpt */}
          <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
            placeholder="Ringkasan singkat artikel..."
            rows={3}
            style={{ width: "100%", fontSize: 14, color: "#6b8999", border: "1px solid #eef4f8",
              borderRadius: 6, padding: "12px 14px", outline: "none", resize: "vertical",
              marginBottom: 28, lineHeight: 1.65, background: "#fafcfd" }} />

          {/* Blocks */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>Content Blocks</div>
            {blocks.length === 0 && (
              <div style={{ background: "#fafcfd", border: "2px dashed #d0e4ee", borderRadius: 8, padding: "32px", textAlign: "center", color: "#7a9db0", fontSize: 13 }}>
                No content yet. Add your first block below.
              </div>
            )}
            {blocks.map((b, i) => (
              <div key={i} style={{ background: "#fafcfd", border: "1px solid #eef4f8", borderRadius: 8, padding: "14px 16px", marginBottom: 10, position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, background: "#e8f4fd", color: "#3d8fab", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>{blockLabels[b.type] || b.type}</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                    <button onClick={() => moveBlock(i, -1)} style={{ padding: "3px 8px", fontSize: 11, border: "1px solid #d0e4ee", borderRadius: 4, color: "#7a9db0" }}>↑</button>
                    <button onClick={() => moveBlock(i, 1)} style={{ padding: "3px 8px", fontSize: 11, border: "1px solid #d0e4ee", borderRadius: 4, color: "#7a9db0" }}>↓</button>
                    <button onClick={() => removeBlock(i)} style={{ padding: "3px 8px", fontSize: 11, border: "none", background: "#fee", color: "#e74c3c", borderRadius: 4 }}>✕</button>
                  </div>
                </div>
                {b.type === "image" ? (
                  <div>
                    <img src={b.value} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }} onError={e => { e.target.style.display = "none"; }} />
                    {b.caption && <p style={{ fontSize: 11, color: "#7a9db0", marginTop: 4, fontStyle: "italic" }}>{b.caption}</p>}
                  </div>
                ) : b.type === "divider" ? (
                  <hr style={{ border: "none", borderTop: "2px solid #d0e4ee" }} />
                ) : b.type === "paragraph" ? (
                  <div style={{ fontSize: 13, color: "#4a6680", lineHeight: 1.6, wordBreak: "break-word" }}
                    dangerouslySetInnerHTML={{ __html: b.value?.length > 200 ? b.value.slice(0, 200) + "…" : b.value }} />
                ) : (
                  <p style={{ fontSize: 13, color: "#4a6680", lineHeight: 1.6, wordBreak: "break-word" }}>
                    {b.value.length > 160 ? b.value.slice(0, 160) + "…" : b.value}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Add Block Toolbar */}
          <div style={{ background: "#f4f9fb", border: "1px solid #ddeef5", borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>Add Block</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {Object.entries(blockLabels).map(([k, label]) => (
                <button key={k} onClick={() => setAddType(k)} style={{
                  padding: "5px 12px", fontSize: 12, borderRadius: 20,
                  border: addType === k ? "none" : "1px solid #d0e4ee",
                  background: addType === k ? "#3d8fab" : "#fff",
                  color: addType === k ? "#fff" : "#4a6680", fontWeight: addType === k ? 600 : 400,
                  transition: "all .15s"
                }}>{label}</button>
              ))}
            </div>

            {needsValue && (
              <>
                {addType === "image" && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    {["url", "upload"].map(m => (
                      <button key={m} onClick={() => setImgUploadMode(m)} style={{
                        padding: "4px 12px", fontSize: 11, borderRadius: 4,
                        border: imgUploadMode === m ? "none" : "1px solid #d0e4ee",
                        background: imgUploadMode === m ? "#2d2d2d" : "#fff",
                        color: imgUploadMode === m ? "#fff" : "#6b8999"
                      }}>{m === "url" ? "URL" : "Upload File"}</button>
                    ))}
                  </div>
                )}

                {addType === "image" && imgUploadMode === "upload" ? (
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageFile} style={{ display: "none" }} />
                    <button onClick={() => fileRef.current?.click()} style={{
                      padding: "10px 20px", border: "1.5px dashed #3d8fab", borderRadius: 8,
                      color: "#3d8fab", fontSize: 13, background: "#f0f9fc", width: "100%", marginBottom: 8
                    }}>📁 Click to Upload Image</button>
                    {addVal && <img src={addVal} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6, marginBottom: 8 }} />}
                  </div>
                ) : addType === "paragraph" ? (
                  <div style={{ marginBottom: 8 }}>
                    <RichParagraphEditor
                      value={addVal}
                      onChange={setAddVal}
                      placeholder="Tulis konten paragraf di sini. Gunakan toolbar di atas untuk format teks..."
                    />
                  </div>
                ) : addType === "quote" ? (
                  <textarea value={addVal} onChange={e => setAddVal(e.target.value)}
                    placeholder="Teks kutipan..."
                    rows={4}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0e4ee",
                      borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", marginBottom: 8, lineHeight: 1.6 }} />
                ) : (
                  <input value={addVal} onChange={e => setAddVal(e.target.value)}
                    placeholder={
                      addType === "heading" ? "Section heading..." :
                      addType === "image" ? "https://example.com/image.jpg" :
                      addType === "embed_instagram" ? "https://www.instagram.com/p/..." :
                      addType === "embed_tiktok" ? "https://www.tiktok.com/@user/video/..." : ""
                    }
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0e4ee",
                      borderRadius: 6, fontSize: 13, outline: "none", marginBottom: 8 }} />
                )}

                {addType === "image" && (
                  <input value={addCaption} onChange={e => setAddCaption(e.target.value)}
                    placeholder="Image caption (optional)"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #d0e4ee",
                      borderRadius: 6, fontSize: 12, outline: "none", marginBottom: 8 }} />
                )}
              </>
            )}

            <button onClick={addBlock} style={{
              padding: "9px 22px", background: "#2d2d2d", color: "#fff",
              borderRadius: 6, fontSize: 13, border: "none", fontWeight: 500
            }}>+ Add Block</button>
          </div>
        </div>

        {/* Right: Meta / Publish */}
        <div className="cms-editor-right">
          {/* Section Selector */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #eef4f8", overflow: "hidden" }}>
            <div style={{ background: "#f4f9fb", padding: "12px 16px", borderBottom: "1px solid #eef4f8" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2d2d2d", letterSpacing: ".5px" }}>PUBLISH TO</span>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(SECTION_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => onSectionChange && onSectionChange(key)} style={{
                  padding: "8px 12px", borderRadius: 6, fontSize: 12, fontWeight: section === key ? 600 : 400,
                  border: section === key ? "none" : "1px solid #d0e4ee",
                  background: section === key ? "#2d2d2d" : "#fff",
                  color: section === key ? "#fff" : "#4a6680",
                  textAlign: "left", transition: "all .15s"
                }}>{section === key ? "✓ " : ""}{label}</button>
              ))}
            </div>
          </div>

          {/* Publish Box */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #eef4f8", overflow: "hidden" }}>
            <div style={{ background: "#f4f9fb", padding: "12px 16px", borderBottom: "1px solid #eef4f8" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#2d2d2d", letterSpacing: ".5px" }}>PUBLISH</span>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#7a9db0" }}>Status:</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: form.status === "published" ? "#27ae60" : "#f39c12",
                  background: form.status === "published" ? "#eeffee" : "#fff9ee", padding: "2px 10px", borderRadius: 10 }}>
                  {form.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#7a9db0" }}>Visibility:</span>
                <span style={{ fontSize: 12, color: "#4a6680", fontWeight: 500 }}>Public</span>
              </div>
              <div style={{ borderTop: "1px solid #eef4f8", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => handleSave("draft")} style={{
                  padding: "8px 0", border: "1px solid #d0e4ee", borderRadius: 6,
                  fontSize: 12, color: "#4a6680", background: "#fff", fontWeight: 500
                }}>Save Draft</button>
                <button onClick={() => setPublishModal(true)} style={{
                  padding: "10px 0", background: "#2d2d2d", border: "none",
                  borderRadius: 6, fontSize: 12, color: "#fff", fontWeight: 600, letterSpacing: ".5px"
                }}>🚀 Publish…</button>
              </div>
            </div>
          </div>

          {/* Meta Fields */}
          {[
            { label: "Date", key: "date", type: "date" },
            { label: "Category", key: "category", placeholder: "e.g. Beach, Gear, Asia" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
              <input type={f.type || "text"} value={form[f.key] || ""} placeholder={f.placeholder || ""}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none" }} />
            </div>
          ))}

          {/* Author — auto dari akun yang login */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>
              Author <span style={{ fontSize: 10, color: "#27ae60", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>· otomatis</span>
            </label>
            <div style={{ position: "relative" }}>
              <input value={form.author || ""} readOnly
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", background: "#f4f9fb", color: "#2d2d2d", fontWeight: 600, cursor: "default" }} />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}>🔒</span>
            </div>
            <p style={{ fontSize: 11, color: "#7a9db0", marginTop: 4 }}>Diisi otomatis dari akun yang login</p>
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Tags</label>
            <input value={typeof form.tags === "string" ? form.tags : (form.tags || []).join(", ")}
              onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              placeholder="beach, travel, gear"
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none" }} />
            <p style={{ fontSize: 11, color: "#7a9db0", marginTop: 4 }}>Separate with commas</p>
          </div>

          {/* Cover Image */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Cover Image URL</label>
            <input value={form.coverImage || ""} onChange={e => setForm(p => ({ ...p, coverImage: e.target.value }))}
              placeholder="https://..."
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 12, outline: "none", marginBottom: 8 }} />
            {form.coverImage && (
              <img src={form.coverImage} alt="" style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6 }}
                onError={e => e.target.style.display = "none"} />
            )}
          </div>

          {/* Section badge */}
          <div style={{ fontSize: 11, color: "#7a9db0", fontStyle: "italic", textAlign: "center", paddingTop: 4 }}>
            Posting to: <strong style={{ color: "#3d8fab" }}>{SECTION_LABELS[section] || section}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── POST CARD ─────────────── */
function PostCard({ post, onClick, view = "grid" }) {
  if (view === "list") return (
    <article className="post-card hover-lift post-card-list" onClick={onClick}
      style={{ display: "flex", gap: 20, background: "#fff", borderRadius: 8, overflow: "hidden",
        cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,.06)", marginBottom: 16 }}>
      <div className="post-thumb" style={{ flexShrink: 0, width: 180, height: 130, overflow: "hidden" }}>
        <img src={post.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&h=400&fit=crop"; }} />
      </div>
      <div style={{ padding: "14px 16px 14px 0", flex: 1 }}>
        {post.category && <span className="label-xs" style={{ color: "#2b7a9a" }}>{post.category}</span>}
        <h3 className="post-card-title" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700,
          fontSize: "1.1rem", color: "#2d2d2d", margin: "6px 0 8px", lineHeight: 1.3, transition: "color .2s" }}>{post.title}</h3>
        <p style={{ fontSize: "0.875rem", color: "#4e6b80", lineHeight: 1.65, marginBottom: 10 }}>
          {post.excerpt?.length > 100 ? post.excerpt.slice(0, 100) + "…" : post.excerpt}
        </p>
        <span style={{ fontSize: "0.75rem", color: "#6b8999" }}>{formatDate(post.date)}</span>
      </div>
    </article>
  );

  return (
    <article className="post-card hover-lift" onClick={onClick}
      style={{ background: "#fff", borderRadius: 8, overflow: "hidden", cursor: "pointer",
        boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
      <div className="img-zoom" style={{ height: 200, overflow: "hidden" }}>
        <img src={post.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&h=400&fit=crop"; }} />
      </div>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          {post.category && <span className="label-xs" style={{ color: "#2b7a9a" }}>{post.category}</span>}
          {post.badge && <span style={{ fontSize: "0.6875rem", background: "#fff3cd", color: "#7a5c00", padding: "2px 9px", borderRadius: 10, fontWeight: 600, letterSpacing: ".03em" }}>{post.badge}</span>}
          <span style={{ fontSize: "0.75rem", color: "#6b8999" }}>{formatDate(post.date)}</span>
        </div>
        <h3 className="post-card-title" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700,
          fontSize: "1.15rem", color: "#2d2d2d", marginBottom: 10, lineHeight: 1.3, transition: "color .2s" }}>{post.title}</h3>
        <p style={{ fontSize: "0.875rem", color: "#4e6b80", lineHeight: 1.7 }}>
          {post.excerpt?.length > 110 ? post.excerpt.slice(0, 110) + "…" : post.excerpt}
        </p>
        {post.price && (
          <div style={{ marginTop: 12, fontSize: "1.25rem", fontWeight: 700, color: "#2d2d2d", fontFamily: "'Playfair Display',serif" }}>{post.price}</div>
        )}
        {post.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            {post.tags.slice(0, 3).map(t => (
              <span key={t} style={{ fontSize: "0.6875rem", padding: "3px 9px", background: "#f4f9fb", border: "1px solid #ddeef5", borderRadius: 10, color: "#4e6b80", fontWeight: 500 }}>#{t}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ─────────────── ARTICLE DETAIL VIEW ─────────────── */
function ArticleDetail({ post, onBack }) {
  return (
    <div className="fade-in" style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Back Bar */}
      <div className="article-back-bar" style={{ background: "rgba(250,252,253,.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid #ddeef5",
        padding: "12px 5%", position: "sticky", top: 96, zIndex: 90 }}>
        <button onClick={onBack} style={{ fontSize: 13, color: "#3d8fab", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
          ← Back
        </button>
      </div>

      {/* Cover */}
      {post.coverImage && (
        <div style={{ height: "clamp(240px, 45vw, 520px)", overflow: "hidden" }}>
          <img src={post.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {/* Article */}
      <div className="article-body" style={{ maxWidth: 760, margin: "0 auto", padding: "48px 5% 80px" }}>
        {post.category && (
          <div className="label-xs" style={{ color: "#2b7a9a", marginBottom: 16 }}>{post.category}</div>
        )}
        <h1 className="display" style={{ fontSize: "clamp(1.875rem, 5vw, 3.25rem)", fontWeight: 800, lineHeight: 1.12, color: "#2d2d2d", marginBottom: 20 }}>
          {post.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #ddeef5" }}>
          <span style={{ fontSize: "0.875rem", color: "#4e6b80", fontWeight: 500 }}>By {post.author}</span>
          <span style={{ fontSize: "0.875rem", color: "#b8d4e3" }}>·</span>
          <span style={{ fontSize: "0.875rem", color: "#4e6b80" }}>{formatDate(post.date)}</span>
          {post.price && <span style={{ fontSize: "1.375rem", fontWeight: 700, color: "#2d2d2d", fontFamily: "'Playfair Display',serif", marginLeft: "auto" }}>{post.price}</span>}
        </div>
        {post.excerpt && (
          <p style={{ fontSize: "1.125rem", color: "#334f65", lineHeight: 1.85, marginBottom: 32, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, whiteSpace: "pre-line" }}>
            {post.excerpt}
          </p>
        )}
        <RichRenderer blocks={post.content} />
        {post.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 40, paddingTop: 24, borderTop: "1px solid #ddeef5" }}>
            <span style={{ fontSize: "0.8125rem", color: "#4e6b80", fontWeight: 500 }}>Tags:</span>
            {post.tags.map(t => (
              <span key={t} style={{ fontSize: "0.8125rem", padding: "3px 12px", background: "#f4f9fb", border: "1px solid #ddeef5", borderRadius: 20, color: "#334f65", fontWeight: 500 }}>#{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── SECTION PAGE ─────────────── */
function SectionPage({ section, posts, onReadPost }) {
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const published = (posts[section] || []).filter(p => p.status === "published");
  const cats = ["All", ...new Set(published.map(p => p.category).filter(Boolean))];
  const filtered = filter === "All" ? published : published.filter(p => p.category === filter);
  const popular = [...published].sort((a, b) => b.id - a.id).slice(0, 8);

  const sectionMeta = {
    news: { title: "Event Plan", sub: "Latest event planning news, tips, and inspiring stories from around the world.", icon: "📅" },
    shop: { title: "Traveling", sub: "Curated travel packages, adventures, and essentials for every type of traveler.", icon: "✈" },
    destinations: { title: "Wedding Organizer", sub: "Explore our hand-picked wedding venues and organizer packages across every destination.", icon: "💍" },
  };
  const meta = sectionMeta[section] || { title: section, sub: "", icon: "◈" };

  return (
    <div className="fade-in" style={{ minHeight: "100vh", background: "#f4f9fb" }}>
      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, #2b7a9a 0%, #3d8fab 100%)", padding: "60px 5%", color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "#7dc8de", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
            {meta.icon} Arutala Organizer
          </div>
          <h1 className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.08, marginBottom: 16, color: "#fff" }}>
            {meta.title}
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,.75)", maxWidth: 460, lineHeight: 1.85 }}>{meta.sub}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 5%" }}>
        <div className="section-page-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 40, alignItems: "start" }}>
          {/* Main */}
          <div>
            {/* Filter + View Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {cats.map(c => (
                  <button key={c} onClick={() => setFilter(c)} style={{
                    padding: "6px 16px", fontSize: 12, borderRadius: 20,
                    border: filter === c ? "none" : "1px solid #d0e4ee",
                    background: filter === c ? "#2b7a9a" : "#fff",
                    color: filter === c ? "#fff" : "#4a6680", fontWeight: filter === c ? 500 : 400,
                    transition: "all .2s"
                  }}>{c}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["grid", "▦"], ["list", "☰"]].map(([mode, icon]) => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{
                    padding: "7px 12px", fontSize: 14,
                    border: `1px solid ${viewMode === mode ? "#3d8fab" : "#d0e4ee"}`,
                    borderRadius: 6, background: viewMode === mode ? "#e8f4fd" : "#fff",
                    color: viewMode === mode ? "#3d8fab" : "#7a9db0"
                  }}>{icon}</button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#7a9db0" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
                <p style={{ fontSize: 15 }}>No posts published yet.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                {filtered.map(p => <PostCard key={p.id} post={p} onClick={() => onReadPost(p)} view="grid" />)}
              </div>
            ) : (
              <div>{filtered.map(p => <PostCard key={p.id} post={p} onClick={() => onReadPost(p)} view="list" />)}</div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {/* Popular / Recent */}
            <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)", marginBottom: 24 }}>
              <div style={{ background: "#2d2d2d", padding: "14px 20px" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>Most Popular</span>
              </div>
              <div style={{ padding: "8px 0" }}>
                {popular.map((p, i) => (
                  <div key={p.id} onClick={() => onReadPost(p)}
                    style={{ display: "flex", gap: 12, padding: "10px 20px", cursor: "pointer", borderBottom: "1px solid #f4f9fb", transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f4f9fb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: i < 3 ? "#e74c3c" : "#b8d4e3", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1, minWidth: 24 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: "#2d2d2d", lineHeight: 1.5, fontWeight: 400 }}>{p.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              <div style={{ background: "#f4f9fb", padding: "14px 20px", borderBottom: "1px solid #eef4f8" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#2d2d2d", letterSpacing: "1px", textTransform: "uppercase" }}>Categories</span>
              </div>
              <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                {cats.filter(c => c !== "All").map(c => {
                  const count = published.filter(p => p.category === c).length;
                  return (
                    <button key={c} onClick={() => setFilter(c)}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "6px 0", borderBottom: "1px solid #f4f9fb", background: "none",
                        border: "none", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontSize: 13, color: "#3d8fab" }}>→ {c}</span>
                      <span style={{ fontSize: 11, background: "#f4f9fb", color: "#7a9db0", padding: "2px 8px", borderRadius: 10 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── SERVICES PAGE ─────────────── */
function ServicesPage({ content, services, navigateTo }) {
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  const CATEGORIES = [
    { key: "traveling", label: "✈️ Traveling", color: "#27ae60" },
    { key: "event",     label: "🎉 Event Plan", color: "#2b7a9a" },
    { key: "wedding",   label: "💍 Wedding Organizer", color: "#8e44ad" },
  ];

  const openDetail = (svc) => { setSelectedService(svc); setActiveImg(0); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const closeDetail = () => setSelectedService(null);

  const handleBook = (svc) => {
    const text = `Halo Arutala Organizer! 👋\n\nSaya tertarik dengan:\n*${svc.title}*\nHarga: ${svc.price} ${svc.priceNote}\n\nMohon informasi lebih lanjut.\n\nTerima kasih!`;
    window.open(`${content.waLink || "https://wa.me/6285745571442"}?text=${encodeURIComponent(text)}`, "_blank");
  };

  /* ── Service Detail Page — Magazine Aesthetic ── */
  if (selectedService) {
    const svc = selectedService;
    const imgs = (svc.images?.length ? svc.images : [svc.image]).filter(Boolean);
    const catInfo = CATEGORIES.find(c => c.key === svc.category) || {};
    const relatedSvcs = services.filter(s => s.id !== svc.id && s.category === svc.category);
    const facilityImgs = imgs.slice(1);

    return (
      <div style={{ minHeight: "100vh", background: "#f8f5f0", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          @keyframes mgFadeUp { from { opacity:0; transform:translateY(28px);} to { opacity:1; transform:none;} }
          .mg-fade { animation: mgFadeUp .55s cubic-bezier(.22,1,.36,1) both; }
          .mg-fade-2 { animation: mgFadeUp .55s .12s cubic-bezier(.22,1,.36,1) both; }
          .mg-fade-3 { animation: mgFadeUp .55s .22s cubic-bezier(.22,1,.36,1) both; }
          .mg-feat-row:hover { background: #ede8e1 !important; }
          .mg-related { transition: transform .2s, box-shadow .2s; }
          .mg-related:hover { transform: translateX(5px); }
          .mg-cta-wa:hover { background: #ffffff !important; }
          .mg-cta-tel:hover { background: #ede8e1 !important; }
          .mg-thumb { transition: all .2s; }
          .mg-thumb:hover { opacity: 1 !important; transform: scale(1.06); }
          @media(max-width:768px){
            .mg-hero-grid { grid-template-columns: 1fr !important; }
            .mg-body-grid { grid-template-columns: 1fr !important; }
            .mg-deco-shape { display: none !important; }
            .mg-feat-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* ── Back Bar ── */}
        <div style={{ background: "#2d2d2d", padding: "0 5%", position: "sticky", top: 96, zIndex: 90, borderBottom: "1px solid #ddeef5" }}>
          <button onClick={closeDetail} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#7ab8d0", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", padding: "13px 0", letterSpacing: ".04em", textTransform: "uppercase" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>←</span> Kembali ke Layanan
          </button>
        </div>

        {/* ── MAGAZINE HERO ── */}
        <div className="mg-fade" style={{ position: "relative", background: "#2d2d2d", overflow: "hidden" }}>
          {/* Deco grid lines */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0, rgba(255,255,255,.025) 1px, transparent 1px, transparent 80px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 32, left: "5%", width: 1, height: "calc(100% - 32px)", background: "rgba(255,255,255,.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 32, right: "5%", width: 1, height: "calc(100% - 32px)", background: "rgba(255,255,255,.08)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 5%" }}>
            <div className="mg-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 460px", gap: 0, minHeight: 480 }}>

              {/* Left: Title & Info */}
              <div style={{ padding: "56px 40px 48px 0", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid rgba(255,255,255,.09)" }}>
                {/* Category tag */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                  <div style={{ width: 28, height: 2, background: catInfo.color || "#2b7a9a" }} />
                  <span style={{ fontSize: "0.625rem", letterSpacing: "3px", color: catInfo.color || "#5bc4e0", fontWeight: 700, textTransform: "uppercase" }}>
                    {(catInfo.label || svc.category).replace(/[^\w\s]/g, "").trim()}
                  </span>
                </div>
                {/* Badge */}
                {svc.badge && (
                  <div style={{ display: "inline-flex", alignItems: "center", background: svc.badgeColor || "#2b7a9a", color: "#fff", borderRadius: 4, padding: "4px 14px", fontSize: "0.625rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 18, alignSelf: "flex-start", boxShadow: `0 4px 18px ${svc.badgeColor || "#2b7a9a"}55` }}>
                    ★ {svc.badge}
                  </div>
                )}
                {/* Title */}
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 22, letterSpacing: "-.01em" }}>{svc.title}</h1>
                {/* Ornamental divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
                  <div style={{ height: 1, width: 40, background: catInfo.color || "#5bc4e0", opacity: .8 }} />
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: catInfo.color || "#5bc4e0" }} />
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,.3)" }} />
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,.15)" }} />
                  <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,.12)" }} />
                </div>
                {/* Description */}
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.68)", lineHeight: 1.85, whiteSpace: "pre-wrap", marginBottom: 36 }}>{svc.description}</p>
                {/* Price inline */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "0.5625rem", letterSpacing: "2.5px", color: "rgba(255,255,255,.38)", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>Harga Mulai</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.4rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{svc.price}</span>
                      <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,.45)", fontWeight: 500 }}>{svc.priceNote}</span>
                    </div>
                  </div>
                  <div style={{ padding: "6px 14px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 20, fontSize: "0.75rem", color: "rgba(255,255,255,.55)", fontStyle: "italic", marginBottom: 4 }}>Nego &amp; Konsultasi</div>
                </div>
              </div>

              {/* Right: Main Hero Image */}
              <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "stretch" }}>
                {/* Deco corner frames */}
                <div className="mg-deco-shape" style={{ position: "absolute", top: 20, right: 20, width: 70, height: 70, border: `1.5px solid ${catInfo.color || "#5bc4e0"}`, borderRadius: 6, zIndex: 3, opacity: .55, pointerEvents: "none" }} />
                <div className="mg-deco-shape" style={{ position: "absolute", top: 30, right: 30, width: 70, height: 70, border: "1.5px solid rgba(255,255,255,.12)", borderRadius: 6, zIndex: 3, pointerEvents: "none" }} />
                <div className="mg-deco-shape" style={{ position: "absolute", bottom: 20, left: -8, width: 50, height: 50, border: "1.5px solid rgba(255,255,255,.15)", borderRadius: 4, zIndex: 3, pointerEvents: "none" }} />
                <div style={{ flex: 1, position: "relative", minHeight: 400 }}>
                  <img src={imgs[activeImg] || "https://images.unsplash.com/photo-1552641356-f51c88ca3e87?w=1600&h=900&fit=crop"} alt={svc.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity .4s" }}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1552641356-f51c88ca3e87?w=1600&h=900&fit=crop"; }} />
                  {/* Bottom fade */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to top, rgba(45,45,45,.65), transparent)", pointerEvents: "none" }} />
                  {imgs.length > 1 && (
                    <div style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", borderRadius: 20, padding: "4px 12px", fontSize: "0.75rem", color: "#fff", fontWeight: 600 }}>
                      {activeImg + 1} / {imgs.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── THUMBNAIL STRIP ── */}
        {imgs.length > 1 && (
          <div className="mg-fade-2" style={{ background: "#2d2d2d", borderTop: "1px solid rgba(255,255,255,.07)", padding: "12px 5%" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 10, overflowX: "auto", paddingBottom: 2 }}>
              {imgs.map((img, i) => (
                <div key={i} className="mg-thumb" onClick={() => setActiveImg(i)}
                  style={{ width: 80, height: 56, borderRadius: 6, overflow: "hidden", cursor: "pointer", flexShrink: 0, border: activeImg === i ? `2.5px solid ${catInfo.color || "#5bc4e0"}` : "2.5px solid rgba(255,255,255,.12)", opacity: activeImg === i ? 1 : 0.5 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.src = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&h=56&fit=crop"} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BODY ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 5% 80px" }}>
          <div className="mg-body-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>

            {/* ── LEFT COLUMN ── */}
            <div>

              {/* FACILITY GALLERY — only shown if images > 1 */}
              {facilityImgs.length > 0 && (
                <div className="mg-fade-2" style={{ marginBottom: 52 }}>
                  {/* Section heading with ornamental bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                    <div style={{ width: 4, height: 30, background: `linear-gradient(to bottom, ${catInfo.color || "#2b7a9a"}, transparent)`, borderRadius: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: "#a0b8c5", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Dokumentasi</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#2d2d2d", lineHeight: 1.1 }}>Fasilitas &amp; Suasana</div>
                    </div>
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #ddd5c8, transparent)" }} />
                    {/* Decorative dot cluster */}
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      {[1,2,3].map(d => <div key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: d === 1 ? (catInfo.color || "#2b7a9a") : "#ddd5c8" }} />)}
                    </div>
                  </div>
                  {/* Masonry grid */}
                  <div style={{ display: "grid", gridTemplateColumns: facilityImgs.length >= 3 ? "1.4fr 1fr 1fr" : facilityImgs.length === 2 ? "1fr 1fr" : "1fr", gap: 10, gridAutoRows: facilityImgs.length >= 3 ? "200px" : "260px" }}>
                    {facilityImgs.slice(0, 5).map((img, i) => (
                      <div key={i}
                        style={{ borderRadius: 10, overflow: "hidden", position: "relative", gridRow: i === 0 && facilityImgs.length >= 3 ? "span 2" : "auto", boxShadow: "0 4px 18px rgba(45,45,45,.1)", transition: "transform .25s, box-shadow .25s", cursor: "pointer" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.025)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(45,45,45,.2)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(45,45,45,.1)"; }}>
                        <img src={img} alt={`Fasilitas ${i + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          onError={e => e.target.src = `https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1600&h=700&fit=crop`} />
                        {/* Gradient overlay */}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(45,45,45,.45) 0%, transparent 50%)", pointerEvents: "none" }} />
                        {/* Number badge */}
                        <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,.48)", backdropFilter: "blur(6px)", borderRadius: 4, padding: "3px 9px", fontSize: "0.625rem", color: "#fff", fontWeight: 800, letterSpacing: ".1em" }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        {/* Bottom label for first image */}
                        {i === 0 && (
                          <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
                            <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,.6)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 2 }}>Foto Utama</div>
                            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,.5)" }}>{svc.title}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FEATURES — 2-col magazine checklist */}
              <div className="mg-fade-3" style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
                  <div style={{ width: 4, height: 30, background: `linear-gradient(to bottom, ${catInfo.color || "#2b7a9a"}, transparent)`, borderRadius: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: "#a0b8c5", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Sudah Termasuk</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#2d2d2d", lineHeight: 1.1 }}>Yang Anda Dapatkan</div>
                  </div>
                  <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #ddd5c8, transparent)" }} />
                </div>
                <div className="mg-feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {(svc.features || []).map((feat, i) => (
                    <div key={i} className="mg-feat-row" style={{ display: "flex", gap: 11, alignItems: "flex-start", background: "#fff", borderRadius: 10, padding: "13px 15px 13px 18px", border: "1px solid #e8e0d6", transition: "background .18s", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: catInfo.color || "#2b7a9a", borderRadius: "10px 0 0 10px" }} />
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: catInfo.color ? `${catInfo.color}15` : "#e4f2f8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ color: catInfo.color || "#2b7a9a", fontSize: "0.6875rem", fontWeight: 900 }}>✓</span>
                      </div>
                      <span style={{ fontSize: "0.85rem", color: "#3d8fab", lineHeight: 1.5, fontWeight: 500 }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RELATED PACKAGES */}
              {relatedSvcs.length > 0 && (
                <div className="mg-fade-3">
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                    <div style={{ width: 4, height: 30, background: "linear-gradient(to bottom, #9ab0bf, transparent)", borderRadius: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: "#a0b8c5", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Lihat Juga</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#2d2d2d", lineHeight: 1.1 }}>Paket Serupa</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {relatedSvcs.map(s => (
                      <div key={s.id} className="mg-related" onClick={() => openDetail(s)}
                        style={{ display: "flex", gap: 0, alignItems: "stretch", background: "#fff", borderRadius: 12, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 10px rgba(45,45,45,.07)", border: "1px solid #e8e0d6" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(45,45,45,.14)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(45,45,45,.07)"}>
                        <div style={{ width: 90, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                          <img src={s.images?.[0] || s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }}
                            onError={e => e.target.src = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&h=70&fit=crop"} />
                        </div>
                        <div style={{ width: 3, flexShrink: 0, background: `linear-gradient(to bottom, ${s.badgeColor || "#2b7a9a"}, transparent)` }} />
                        <div style={{ padding: "12px 14px", flex: 1 }}>
                          {s.badge && <div style={{ fontSize: "0.5625rem", color: s.badgeColor || "#2b7a9a", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>{s.badge}</div>}
                          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d2d2d", marginBottom: 4, lineHeight: 1.3 }}>{s.title}</div>
                          <div style={{ fontSize: "0.8125rem", color: s.badgeColor || "#2b7a9a", fontWeight: 800 }}>{s.price} <span style={{ color: "#a0b8c5", fontWeight: 400, fontSize: "0.75rem" }}>{s.priceNote}</span></div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", paddingRight: 14, color: "#c8c0b5", fontSize: "1.125rem" }}>›</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div style={{ position: "sticky", top: 128 }}>

              {/* Price Card */}
              <div className="mg-fade-2" style={{ background: svc.highlight ? "linear-gradient(145deg,#1a1a1a 0%,#2d2d2d 55%,#2b7a9a 100%)" : "#fff", borderRadius: 16, overflow: "hidden", boxShadow: svc.highlight ? "0 24px 64px rgba(12,26,40,.5)" : "0 8px 32px rgba(45,45,45,.11)", border: svc.highlight ? "none" : "1px solid #e8e0d6", marginBottom: 18 }}>
                {/* Top gradient bar */}
                <div style={{ height: 4, background: `linear-gradient(to right, ${catInfo.color || "#2b7a9a"}, ${svc.badgeColor || catInfo.color || "#2d2d2d"})` }} />
                {/* Deco border inner */}
                <div style={{ margin: "16px 16px 0", border: `1px solid ${svc.highlight ? "rgba(255,255,255,.07)" : "#f0e8df"}`, borderRadius: 10, padding: "20px 18px 24px", position: "relative", overflow: "hidden" }}>
                  {/* BG shape */}
                  <div style={{ position: "absolute", bottom: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: svc.highlight ? "rgba(255,255,255,.04)" : `${catInfo.color || "#2b7a9a"}08`, pointerEvents: "none" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: svc.highlight ? "rgba(255,255,255,.3)" : "#b8a898", textTransform: "uppercase", fontWeight: 700, marginBottom: 16, textAlign: "center" }}>— Penawaran Spesial —</div>
                    {/* Harga */}
                    <div style={{ textAlign: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: "0.5625rem", letterSpacing: "2.5px", color: svc.highlight ? "rgba(255,255,255,.38)" : "#a0b8c5", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Harga Mulai</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.6rem", fontWeight: 900, color: svc.highlight ? "#fff" : "#2d2d2d", lineHeight: 1, marginBottom: 4 }}>{svc.price}</div>
                      <div style={{ fontSize: "0.875rem", color: svc.highlight ? "rgba(255,255,255,.45)" : "#a0b8c5", fontWeight: 500 }}>{svc.priceNote}</div>
                    </div>
                    <div style={{ height: 1, background: svc.highlight ? "rgba(255,255,255,.08)" : "#f0e8df", margin: "18px 0" }} />
                    {/* Nego */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: svc.highlight ? "rgba(255,255,255,.05)" : "#faf7f4", borderRadius: 8, padding: "10px 12px", marginBottom: 20, border: `1px solid ${svc.highlight ? "rgba(255,255,255,.07)" : "#ede5da"}` }}>
                      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>💬</span>
                      <span style={{ fontSize: "0.8rem", color: svc.highlight ? "rgba(255,255,255,.6)" : "#7a8f99", fontStyle: "italic", lineHeight: 1.45 }}>Harga dapat disesuaikan dengan kebutuhan dan budget Anda</span>
                    </div>
                  </div>
                </div>
                {/* CTA Buttons */}
                <div style={{ padding: "16px" }}>
                  <button className="mg-cta-wa" onClick={() => handleBook(svc)}
                    style={{ width: "100%", padding: "15px 20px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10, transition: "background .2s", letterSpacing: ".01em" }}>
                    <span style={{ fontSize: "1.1rem" }}>💬</span> Pesan via WhatsApp
                  </button>
                  <a href={`tel:${content.phone}`} className="mg-cta-tel"
                    style={{ width: "100%", padding: "13px 20px", background: "#f5f1ec", color: "#2d2d2d", border: "1.5px solid #ddd5c8", borderRadius: 10, fontSize: "0.875rem", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background .2s" }}>
                    <span style={{ fontSize: "1rem" }}>📞</span> Hubungi Langsung
                  </a>
                </div>
              </div>

              {/* Why Us — dark card with deco border */}
              <div className="mg-fade-3" style={{ background: "#2d2d2d", borderRadius: 14, padding: "2px", overflow: "hidden", position: "relative" }}>
                {/* Gradient border effect */}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(145deg, ${catInfo.color || "#2b7a9a"}44, transparent, rgba(255,255,255,.06))`, borderRadius: 14, pointerEvents: "none" }} />
                <div style={{ background: "#2d2d2d", borderRadius: 12, padding: "22px 20px", position: "relative" }}>
                  {/* Inner deco frame */}
                  <div style={{ position: "absolute", top: 10, left: 10, right: 10, bottom: 10, border: "1px solid rgba(255,255,255,.05)", borderRadius: 8, pointerEvents: "none" }} />
                  {/* BG shapes */}
                  <div style={{ position: "absolute", bottom: -25, right: -25, width: 90, height: 90, borderRadius: "50%", background: `${catInfo.color || "#2b7a9a"}18`, pointerEvents: "none" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: catInfo.color || "#5bc4e0", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Keunggulan Kami</div>
                    <div style={{ width: 28, height: 2, background: catInfo.color || "#5bc4e0", borderRadius: 1, marginBottom: 18 }} />
                    {[
                      { icon: "🏆", label: "Tim Profesional", desc: "Berpengalaman di bidangnya" },
                      { icon: "🤝", label: "Konsultasi Gratis", desc: "Diskusi tanpa biaya apapun" },
                      { icon: "⭐", label: "Kepuasan Terjamin", desc: "Rating tinggi dari klien kami" },
                      { icon: "📋", label: "Paket Fleksibel", desc: "Disesuaikan kebutuhan Anda" },
                    ].map((item, i, arr) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < arr.length - 1 ? 14 : 0, paddingBottom: i < arr.length - 1 ? 14 : 0, borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
                        <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "rgba(255,255,255,.85)", marginBottom: 1 }}>{item.label}</div>
                          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,.45)", lineHeight: 1.4 }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Services List with Category Tabs ── */
  const filteredServices = activeCategory ? services.filter(s => s.category === activeCategory) : [];

  return (
    <div className="fade-in" style={{ minHeight: "100vh", background: "#f4f9fb" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#2d2d2d 0%,#2b7a9a 100%)", padding: "72px 5% 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "rgba(255,255,255,.6)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Apa yang Kami Tawarkan</div>
          <h1 className="display" style={{ fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 900, color: "#fff", lineHeight: 1.08, marginBottom: 18 }}>{content.servicesPageTitle || "Paket Layanan Kami"}</h1>
          <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,.75)", lineHeight: 1.8 }}>{content.servicesPageSub || "Pilih kategori layanan sesuai kebutuhan Anda."}</p>
        </div>
      </div>

      {/* Category Buttons */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ddeef5", padding: "0 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.key;
            const count = services.filter(s => s.category === cat.key).length;
            return (
              <button key={cat.key} onClick={() => setActiveCategory(isActive ? null : cat.key)}
                style={{ padding: "20px 28px", border: "none", background: "none", fontSize: "0.9375rem", fontWeight: isActive ? 700 : 500,
                  color: isActive ? cat.color : "#4e6b80", borderBottom: isActive ? `3px solid ${cat.color}` : "3px solid transparent",
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all .25s", display: "flex", alignItems: "center", gap: 8 }}>
                {cat.label}
                <span style={{ fontSize: "0.75rem", background: isActive ? cat.color : "#f4f9fb", color: isActive ? "#fff" : "#6b8999", borderRadius: 12, padding: "2px 8px", fontWeight: 700, transition: "all .25s" }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 5% 80px" }}>
        {/* Empty state */}
        {!activeCategory && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>👆</div>
            <h2 className="display" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 12 }}>Pilih Kategori Layanan</h2>
            <p style={{ fontSize: "1rem", color: "#6b8999" }}>Klik salah satu tab di atas untuk melihat paket layanan yang tersedia.</p>
          </div>
        )}

        {/* Cards Grid */}
        {activeCategory && (
          <div style={{ animation: "fadeIn .35s ease" }}>
            <div style={{ marginBottom: 32 }}>
              <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 6 }}>
                {CATEGORIES.find(c => c.key === activeCategory)?.label}
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "#6b8999" }}>{filteredServices.length} paket tersedia</p>
            </div>
            {filteredServices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#7a9db0" }}>Belum ada paket untuk kategori ini.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28 }}>
                {filteredServices.map(svc => (
                  <div key={svc.id}
                    onMouseEnter={() => setHoveredCard(svc.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: hoveredCard === svc.id ? "0 20px 48px rgba(45,45,45,.16)" : "0 4px 16px rgba(45,45,45,.08)", transform: hoveredCard === svc.id ? "translateY(-6px)" : "none", transition: "all .3s cubic-bezier(.22,1,.36,1)", border: svc.highlight ? "2px solid #2b7a9a" : "2px solid transparent", position: "relative" }}>
                    {svc.badge && (
                      <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2, background: svc.badgeColor || "#2b7a9a", color: "#fff", borderRadius: 20, padding: "4px 14px", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                        {svc.badge}
                      </div>
                    )}
                    {svc.highlight && (
                      <div style={{ position: "absolute", top: 14, right: 14, zIndex: 2, background: "#2d2d2d", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: "0.6875rem", fontWeight: 700 }}>⭐ Pilihan Utama</div>
                    )}
                    <div style={{ height: 200, overflow: "hidden" }}>
                      <img src={(svc.images?.[0] || svc.image)} alt={svc.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }}
                        onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                        onMouseLeave={e => e.target.style.transform = "scale(1)"}
                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1600&h=600&fit=crop"; }} />
                    </div>
                    <div style={{ padding: "22px 22px 20px" }}>
                      <h3 className="display" style={{ fontSize: "1.125rem", fontWeight: 800, color: "#2d2d2d", lineHeight: 1.25, marginBottom: 8 }}>{svc.title}</h3>
                      <p style={{ fontSize: "0.875rem", color: "#6b8999", lineHeight: 1.7, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{svc.description}</p>
                      <div style={{ marginBottom: 16 }}>
                        {(svc.features || []).slice(0, 3).map((feat, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                            <span style={{ color: "#27ae60", fontWeight: 700, fontSize: "0.875rem" }}>✓</span>
                            <span style={{ fontSize: "0.8125rem", color: "#4e6b80" }}>{feat}</span>
                          </div>
                        ))}
                        {(svc.features || []).length > 3 && (
                          <div style={{ fontSize: "0.75rem", color: "#2b7a9a", fontWeight: 600, marginTop: 4 }}>+{svc.features.length - 3} fitur lainnya</div>
                        )}
                      </div>
                      <div style={{ borderTop: "1px solid #f0f7fb", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: "0.65rem", color: "#7a9db0", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>Mulai Dari</div>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.375rem", fontWeight: 900, color: "#2d2d2d", lineHeight: 1 }}>{svc.price}</div>
                          <div style={{ fontSize: "0.6875rem", color: "#6b8999" }}>{svc.priceNote}</div>
                          <div style={{ fontSize: "0.6875rem", color: "#2b7a9a", fontWeight: 600, fontStyle: "italic", marginTop: 2 }}>Nego / Konsultasi dulu</div>
                        </div>
                        <button onClick={() => openDetail(svc)}
                          style={{ padding: "10px 18px", background: svc.highlight ? "linear-gradient(135deg,#2d2d2d,#2b7a9a)" : "#2d2d2d", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", transition: "opacity .2s", letterSpacing: ".03em", whiteSpace: "nowrap" }}
                          onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <section style={{ background: "linear-gradient(135deg,#2d2d2d,#2b7a9a)", padding: "72px 5%", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 900, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>Tidak Menemukan Paket yang Cocok?</h2>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: "1rem", marginBottom: 36, lineHeight: 1.7 }}>Kami siap membuat paket khusus sesuai kebutuhan dan budget Anda.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => window.open(content.waLink || "https://wa.me/6285745571442", "_blank")}
              style={{ padding: "14px 32px", background: "#fff", color: "#2d2d2d", border: "none", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", transition: "background .2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#c5dde9"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              💬 WhatsApp Kami
            </button>
            <button onClick={() => navigateTo("about")}
              style={{ padding: "14px 32px", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.3)", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", transition: "border-color .2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.8)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,.3)"}>
              📞 Kontak Kami
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────── SERVICES ADMIN PANEL ─────────────── */
function ServicesAdmin({ data, save, notify, uploadToCloudinary }) {
  const [editSvc, setEditSvc] = useState(null);
  const [svcForm, setSvcForm] = useState({});
  const svcs = data.services || [];

  const openNew = () => {
    setSvcForm({ id: Date.now(), category: "traveling", title: "", badge: "", badgeColor: "#2b7a9a", price: "", priceNote: "/ orang", images: [], image: "", description: "", features: [], highlight: false });
    setEditSvc("new");
  };
  const openEdit = (s) => { setSvcForm({ ...s, features: [...(s.features || [])], images: [...(s.images || (s.image ? [s.image] : []))] }); setEditSvc(s.id); };
  const cancelEdit = () => { setEditSvc(null); setSvcForm({}); };

  const saveSvc = () => {
    if (!svcForm.title?.trim()) return notify("Judul paket wajib diisi.", "error");
    const idx = svcs.findIndex(x => x.id === svcForm.id);
    const updated = idx >= 0 ? svcs.map((x, i) => i === idx ? svcForm : x) : [...svcs, svcForm];
    save({ ...data, services: updated });
    setEditSvc(null); setSvcForm({});
    notify("Paket layanan disimpan!");
  };
  const deleteSvc = (id) => {
    if (!window.confirm("Hapus paket ini?")) return;
    save({ ...data, services: svcs.filter(x => x.id !== id) });
    notify("Paket dihapus.");
  };
  const updateFeature = (i, val) => {
    const f = [...(svcForm.features || [])]; f[i] = val;
    setSvcForm(p => ({ ...p, features: f }));
  };
  const addFeature = () => setSvcForm(p => ({ ...p, features: [...(p.features || []), ""] }));
  const removeFeature = (i) => {
    const f = [...(svcForm.features || [])]; f.splice(i, 1);
    setSvcForm(p => ({ ...p, features: f }));
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d", marginBottom: 4 }}>Layanan / Paket</h1>
          <p style={{ fontSize: 12, color: "#7a9db0" }}>Kelola paket layanan yang tampil di halaman Layanan Kami.</p>
        </div>
        <button onClick={openNew}
          style={{ padding: "9px 20px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Tambah Paket
        </button>
      </div>

      {/* Form Tambah / Edit */}
      {editSvc !== null && (
        <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 28, boxShadow: "0 4px 16px rgba(0,0,0,.08)", borderTop: "4px solid #3d8fab" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#2d2d2d", marginBottom: 20 }}>
            {editSvc === "new" ? "➕ Tambah Paket Baru" : "✏ Edit Paket"}
          </h2>

          {/* Kategori */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Kategori *</label>
            <select value={svcForm.category || "traveling"} onChange={e => setSvcForm(p => ({ ...p, category: e.target.value }))}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", background: "#fff" }}>
              <option value="traveling">✈️ Traveling</option>
              <option value="event">🎉 Event Plan</option>
              <option value="wedding">💍 Wedding Organizer</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[
              { label: "Judul Paket *", key: "title", placeholder: "Paket Wedding Premium" },
              { label: "Harga (teks)", key: "price", placeholder: "Rp 25.000.000" },
              { label: "Keterangan Harga", key: "priceNote", placeholder: "/ wedding" },
              { label: "Badge (opsional)", key: "badge", placeholder: "Best Seller" },
              { label: "Warna Badge (hex)", key: "badgeColor", placeholder: "#e67e22" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
                <input value={svcForm[f.key] || ""} onChange={e => setSvcForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none" }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Deskripsi</label>
            <textarea value={svcForm.description || ""} onChange={e => setSvcForm(p => ({ ...p, description: e.target.value }))}
              rows={3} placeholder="Deskripsi singkat paket layanan..."
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6 }} />
          </div>

          {/* Multi-Image Upload */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Galeri Gambar ({(svcForm.images || []).length} foto)</label>
            {/* Preview thumbnails */}
            {(svcForm.images || []).length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {(svcForm.images || []).map((img, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={img} alt="" style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 6, border: i === 0 ? "2px solid #2b7a9a" : "2px solid #ddeef5" }} />
                    {i === 0 && <div style={{ position: "absolute", bottom: 2, left: 2, fontSize: 8, background: "#2b7a9a", color: "#fff", borderRadius: 3, padding: "1px 4px", fontWeight: 700 }}>COVER</div>}
                    <button onClick={() => setSvcForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i), image: i === 0 ? (p.images[1] || "") : p.image }))}
                      style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#e74c3c", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, lineHeight: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" accept="image/*" multiple onChange={async e => {
              const files = Array.from(e.target.files || []); if (!files.length) return;
              try {
                notify(`⏳ Mengupload ${files.length} gambar...`);
                const urls = await Promise.all(files.map(f => uploadToCloudinary(f)));
                setSvcForm(p => {
                  const newImgs = [...(p.images || []), ...urls];
                  return { ...p, images: newImgs, image: newImgs[0] || p.image };
                });
                notify(`${files.length} gambar berhasil diupload!`);
              } catch { notify("Gagal upload gambar.", "error"); }
            }} style={{ fontSize: 12, padding: "6px", border: "1.5px dashed #3d8fab", borderRadius: 6, background: "#f0f9fc", color: "#3d8fab", width: "100%" }} />
            <div style={{ fontSize: 11, color: "#7a9db0", marginTop: 4 }}>Bisa pilih beberapa foto sekaligus. Foto pertama = cover.</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase" }}>Fitur / Yang Termasuk</label>
              <button onClick={addFeature} style={{ fontSize: 12, padding: "4px 12px", background: "#e8f8ef", color: "#27ae60", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>+ Tambah</button>
            </div>
            {(svcForm.features || []).map((feat, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={feat} onChange={e => updateFeature(i, e.target.value)}
                  placeholder={`Fitur ${i + 1}...`}
                  style={{ flex: 1, padding: "8px 10px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none" }} />
                <button onClick={() => removeFeature(i)} style={{ padding: "8px 12px", background: "#fee", color: "#e74c3c", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <input type="checkbox" id="svc-highlight" checked={!!svcForm.highlight} onChange={e => setSvcForm(p => ({ ...p, highlight: e.target.checked }))} style={{ width: 16, height: 16, cursor: "pointer" }} />
            <label htmlFor="svc-highlight" style={{ fontSize: 13, color: "#2d2d2d", fontWeight: 600, cursor: "pointer" }}>Tandai sebagai Pilihan Utama (highlight)</label>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={saveSvc} style={{ padding: "10px 22px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>💾 Simpan Paket</button>
            <button onClick={cancelEdit} style={{ padding: "10px 18px", background: "#f4f9fb", color: "#6b8999", border: "1px solid #d0e4ee", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Batal</button>
          </div>
        </div>
      )}

      {/* Daftar Paket */}
      {svcs.length === 0 && editSvc === null ? (
        <div style={{ background: "#fff", borderRadius: 10, padding: "60px 20px", textAlign: "center", color: "#7a9db0", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛎</div>
          <p style={{ fontSize: 14 }}>Belum ada paket layanan. Klik "+ Tambah Paket" untuk memulai.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {svcs.map(svc => (
            <div key={svc.id} style={{ background: "#fff", borderRadius: 10, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", gap: 16, alignItems: "flex-start", borderLeft: svc.highlight ? "4px solid #3d8fab" : "4px solid #ddeef5" }}>
              {svc.image && (
                <img src={svc.image} alt={svc.title} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d" }}>{svc.title}</span>
                  {svc.badge && <span style={{ fontSize: 10, background: svc.badgeColor || "#2b7a9a", color: "#fff", borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>{svc.badge}</span>}
                  {svc.highlight && <span style={{ fontSize: 10, background: "#2d2d2d", color: "#fff", borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>⭐ Pilihan Utama</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#3d8fab" }}>{svc.price}<span style={{ color: "#7a9db0", fontWeight: 400 }}> {svc.priceNote}</span></div>
                <div style={{ fontSize: 12, color: "#7a9db0", marginTop: 4 }}>{(svc.features || []).length} fitur termasuk</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => openEdit(svc)} style={{ padding: "6px 14px", background: "#f4f9fb", color: "#2d2d2d", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✏ Edit</button>
                <button onClick={() => deleteSvc(svc.id)} style={{ padding: "6px 14px", background: "#fee", color: "#e74c3c", border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🗑 Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── ABOUT PAGE ─────────────── */
function AboutPage({ content, images, teamMembers }) {
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.message) return;
    const text = `Halo Arutala Organizer! 👋%0A%0ANama: ${contactForm.name}%0AEmail: ${contactForm.email}%0ANo. HP: ${contactForm.phone}%0AKeperluan: ${contactForm.subject}%0A%0APesan:%0A${contactForm.message}`;
    window.open(`${content.waLink || "https://wa.me/6285745571442"}?text=${text}`, "_blank");
    setContactSent(true);
    setTimeout(() => { setContactSent(false); setContactForm({ name: "", email: "", phone: "", subject: "", message: "" }); }, 4000);
  };

  const values = [
    { icon: "✈️", title: "Expert Travel Planning", desc: "Kami merencanakan setiap detail perjalanan Anda — dari tiket, akomodasi, hingga tur lokal — agar Anda bisa menikmati tanpa khawatir." },
    { icon: "💍", title: "Wedding Organizer", desc: "Wujudkan pernikahan impian Anda bersama tim profesional kami yang berpengalaman menangani ratusan momen spesial." },
    { icon: "🎉", title: "Event Organizer", desc: "Dari gathering kantor hingga pesta ulang tahun besar, kami siap menjadi mitra terpercaya untuk event tak terlupakan." },
    { icon: "🛡️", title: "Terpercaya & Aman", desc: "Kepercayaan klien adalah prioritas kami. Setiap layanan dirancang dengan standar keamanan dan profesionalisme tinggi." },
    { icon: "🌟", title: "Pengalaman Bertahun-tahun", desc: "Didukung tim berpengalaman yang telah melayani ratusan klien puas di seluruh Indonesia." },
    { icon: "💬", title: "Layanan 24/7", desc: "Tim customer service kami siap membantu kapan saja, memastikan setiap pertanyaan dan kebutuhan Anda terpenuhi." },
  ];

  const timeline = [
    { year: "2018", title: "Arutala Berdiri", desc: "Didirikan dengan visi memberikan layanan travel & event berkualitas di Malang." },
    { year: "2019", title: "Ekspansi Wedding", desc: "Membuka divisi Wedding Organizer dan langsung mendapat respons positif dari pasar." },
    { year: "2021", title: "100+ Klien", desc: "Mencapai 100+ klien puas meskipun pandemi, dengan inovasi layanan virtual event." },
    { year: "2023", title: "Platform Digital", desc: "Meluncurkan platform digital untuk memudahkan pemesanan dan komunikasi dengan klien." },
    { year: "2025", title: "Berkembang Pesat", desc: "Hadir di berbagai kota besar Indonesia dengan jaringan mitra lokal yang kuat." },
  ];

  const team = [
    { name: "Tim Kreatif", role: "Event & Dekorasi", icon: "🎨" },
    { name: "Tim Traveling", role: "Perencana Wisata", icon: "🗺️" },
    { name: "Tim Wedding", role: "Koordinator Pernikahan", icon: "💐" },
    { name: "Tim CS", role: "Layanan Pelanggan", icon: "🤝" },
  ];

  return (
    <div className="fade-in" style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg, #e8f4fb 0%, #d0eaf7 50%, #b8ddf0 100%)", padding: "80px 5% 90px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: "20%", width: 300, height: 300, borderRadius: "50%", background: "rgba(43,122,154,.1)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }} className="about-hero-grid">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(43,122,154,.15)", border: "1px solid rgba(43,122,154,.3)", borderRadius: 20, padding: "5px 16px", marginBottom: 24 }}>
              <span style={{ fontSize: 10, letterSpacing: "2px", color: "#2b7a9a", textTransform: "uppercase", fontWeight: 700 }}>Tentang Kami</span>
            </div>
            <h1 className="display" style={{ fontSize: "clamp(2.25rem,5vw,3.75rem)", fontWeight: 900, lineHeight: 1.06, color: "#2d2d2d", marginBottom: 24 }}>
              {content.aboutHeroTitle || "Arutala Travel & Organizer"}
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "#2d4f65", lineHeight: 1.9, maxWidth: 420, marginBottom: 32, whiteSpace: "pre-line" }}>
              {content.aboutHeroSub || content.aboutText || "Mitra terpercaya Anda untuk perjalanan wisata, pernikahan impian, dan event berkesan. Kami hadir untuk mewujudkan setiap momen menjadi kenangan tak terlupakan."}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href={content.waLink || "https://wa.me/6285745571442"} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "#2d2d2d", color: "#fff", borderRadius: 4, fontSize: "0.8125rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", textDecoration: "none", transition: "background .2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#2b7a9a"}
                onMouseLeave={e => e.currentTarget.style.background = "#2d2d2d"}>
                💬 Hubungi Kami
              </a>
              <a href={`tel:${content.phone}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "transparent", color: "#2d2d2d", border: "1.5px solid #2d2d2d", borderRadius: 4, fontSize: "0.8125rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", textDecoration: "none" }}>
                📞 {content.phone || "Telepon"}
              </a>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {images.hero.slice(0, 4).map((src, i) => (
              <div key={i} className="img-zoom" style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "4/3", boxShadow: "0 8px 24px rgba(45,45,45,.15)" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div style={{ background: "#2d2d2d", padding: "36px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
          {[
            { num: "500+", label: "Klien Puas" },
            { num: "7+", label: "Tahun Pengalaman" },
            { num: "100+", label: "Event Sukses" },
            { num: "24/7", label: "Layanan Support" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 900, color: "#5bc4e0", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,.65)", marginTop: 6, fontWeight: 500, letterSpacing: ".04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VISI MISI ── */}
      <div style={{ padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="grid-2">
          <div style={{ background: "linear-gradient(135deg, #2b7a9a 0%, #3d8fab 100%)", borderRadius: 12, padding: "40px 36px", color: "#fff" }}>
            <div style={{ fontSize: 36, marginBottom: 20 }}>🎯</div>
            <h3 style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, marginBottom: 16, color: "#fff" }}>Visi Kami</h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.85, color: "rgba(255,255,255,.8)" }}>
              Menjadi perusahaan travel dan organizer terkemuka di Indonesia yang dikenal atas pelayanan profesional, kreativitas, dan kemampuan mewujudkan momen-momen tak terlupakan bagi setiap klien.
            </p>
          </div>
          <div style={{ background: "#f4f9fb", borderRadius: 12, padding: "40px 36px", borderLeft: "4px solid #2b7a9a" }}>
            <div style={{ fontSize: 36, marginBottom: 20 }}>🚀</div>
            <h3 style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, marginBottom: 16, color: "#2d2d2d" }}>Misi Kami</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {["Memberikan layanan terbaik dengan standar profesional tinggi", "Memastikan kepuasan klien di setiap momen yang kami tangani", "Berinovasi dalam layanan travel & event secara berkelanjutan", "Membangun kepercayaan jangka panjang bersama klien dan mitra"].map(m => (
                <li key={m} style={{ display: "flex", gap: 10, fontSize: "0.9rem", color: "#4e6b80", lineHeight: 1.6 }}>
                  <span style={{ color: "#2b7a9a", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <div style={{ background: "#f4f9fb", padding: "80px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "#2b7a9a", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Keunggulan Kami</div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#2d2d2d" }}>{content.aboutWhyTitle || "Mengapa Memilih Arutala?"}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {values.map((v, i) => (
              <div key={v.title} className="hover-lift" style={{ background: "#fff", borderRadius: 12, padding: "32px 28px", boxShadow: "0 2px 12px rgba(45,45,45,.06)", borderTop: "3px solid #2b7a9a", transition: "all .3s" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontSize: "1.05rem", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: "#2d2d2d", marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#4e6b80", lineHeight: 1.75, whiteSpace: "pre-line" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SUSUNAN TIM ── */}
      <div style={{ padding: "80px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "#2b7a9a", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Orang-Orang di Balik Layanan</div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#2d2d2d" }}>Susunan Tim Kami</h2>
          </div>
          {(!teamMembers || teamMembers.length === 0) ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#7a9db0" }}>Susunan tim belum diisi. Hubungi administrator.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 28 }}>
              {teamMembers.map((member, i) => (
                <div key={member.id || i} className="hover-lift" style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 16px rgba(45,45,45,.08)", textAlign: "center", transition: "all .3s" }}>
                  {/* Photo */}
                  <div style={{ height: 220, overflow: "hidden", background: "linear-gradient(135deg,#2d2d2d,#2b7a9a)", position: "relative" }}>
                    {member.photo ? (
                      <img src={member.photo} alt={member.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", transition: "transform .4s ease" }}
                        onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                        onMouseLeave={e => e.target.style.transform = "scale(1)"}
                        onError={e => { e.target.style.display = "none"; e.target.parentNode.querySelector(".team-fallback").style.display = "flex"; }} />
                    ) : null}
                    <div className="team-fallback" style={{ position: "absolute", inset: 0, display: member.photo ? "none" : "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>👤</div>
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,.5)", letterSpacing: "1px", textTransform: "uppercase" }}>No Photo</span>
                    </div>
                    {/* Name overlay at bottom */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to top, rgba(45,45,45,.75), transparent)", pointerEvents: "none" }} />
                  </div>
                  <div style={{ padding: "20px 20px 24px" }}>
                    <h3 style={{ fontSize: "1rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, color: "#2d2d2d", marginBottom: 4 }}>{member.name}</h3>
                    <div style={{ fontSize: "0.8125rem", color: "#2b7a9a", fontWeight: 600, marginBottom: 12 }}>{member.role}</div>
                    {member.quotes && (
                      <p style={{ fontSize: "0.8125rem", color: "#6b8999", fontStyle: "italic", lineHeight: 1.65, whiteSpace: "pre-line" }}>"{member.quotes}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── LAYANAN KAMI ── */}
      <div style={{ padding: "80px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "#2b7a9a", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Apa yang Kami Tawarkan</div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#2d2d2d" }}>Layanan Lengkap Kami</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {[
              { icon: "✈️", title: "Travel & Wisata", color: "#2b7a9a", items: ["Paket Wisata Lokal & Mancanegara", "Tiket Pesawat & Hotel", "Tour Guide Profesional", "Itinerary Kustom", "Transportasi Pribadi"] },
              { icon: "💍", title: "Wedding Organizer", color: "#8e44ad", items: ["Konsultasi & Perencanaan", "Dekorasi & Venue", "Koordinasi Hari H", "Dokumentasi & Foto", "Catering & Entertainment"] },
              { icon: "🎉", title: "Event Organizer", color: "#e67e22", items: ["Corporate Event", "Birthday & Anniversary", "Gathering & Outbound", "Seminar & Conference", "Pesta Perpisahan & Reunian"] },
            ].map(s => (
              <div key={s.title} style={{ border: "1px solid #ddeef5", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ background: s.color, padding: "24px 28px", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 32 }}>{s.icon}</span>
                  <h3 style={{ fontSize: "1.125rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, color: "#fff" }}>{s.title}</h3>
                </div>
                <div style={{ padding: "20px 28px" }}>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {s.items.map(item => (
                      <li key={item} style={{ display: "flex", gap: 10, fontSize: "0.9rem", color: "#4e6b80" }}>
                        <span style={{ color: s.color, fontWeight: 700 }}>→</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTACT US ── */}
      <div style={{ background: "linear-gradient(135deg, #c5dde9 0%, #a8cfe0 100%)", padding: "80px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "#2b7a9a", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Hubungi Kami</div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#2d2d2d" }}>Contact Us</h2>
            <p style={{ fontSize: "1rem", color: "#4e6b80", marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>Siap membantu Anda merencanakan momen terbaik. Hubungi kami sekarang!</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48 }} className="contact-grid">
            {/* Info kontak */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: "📞", label: "Telepon / WhatsApp", value: content.phone, href: content.waLink || `https://wa.me/6285745571442`, type: "link" },
                { icon: "✉️", label: "Email", value: content.email, href: `mailto:${content.email}`, type: "link" },
                { icon: "📍", label: "Alamat", value: content.address || "Malang, Jawa Timur, Indonesia", type: "text" },
                { icon: "🕐", label: "Jam Operasional", value: content.hours || "Senin – Sabtu: 08.00 – 20.00 WIB", type: "text" },
              ].map(info => (
                <div key={info.label} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "rgba(255,255,255,.7)", borderRadius: 10, padding: "18px 20px", backdropFilter: "blur(8px)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "#2d2d2d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{info.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#7a9db0", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 4 }}>{info.label}</div>
                    {info.type === "link"
                      ? <a href={info.href} target={info.href.startsWith("https") ? "_blank" : "_self"} rel="noopener noreferrer" style={{ fontSize: "0.9375rem", color: "#2b7a9a", fontWeight: 600, textDecoration: "none" }}>{info.value}</a>
                      : <div style={{ fontSize: "0.9375rem", color: "#2d2d2d", fontWeight: 500 }}>{info.value}</div>
                    }
                  </div>
                </div>
              ))}

              {/* Social Media */}
              <div style={{ background: "rgba(255,255,255,.7)", borderRadius: 10, padding: "18px 20px", backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: "0.75rem", color: "#7a9db0", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 14 }}>Media Sosial</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    { label: "WhatsApp", icon: "💬", href: content.waLink || "https://wa.me/6285745571442", color: "#25d366" },
                    { label: "Instagram", icon: "📷", href: content.igLink || "https://instagram.com", color: "#e1306c" },
                    { label: "Facebook", icon: "📘", href: content.fbLink || "https://facebook.com", color: "#1877f2" },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: s.color, color: "#fff", borderRadius: 20, fontSize: "0.8125rem", fontWeight: 600, textDecoration: "none", transition: "opacity .2s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                      {s.icon} {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "36px 32px", boxShadow: "0 8px 40px rgba(45,45,45,.12)" }}>
              <h3 style={{ fontSize: "1.25rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, color: "#2d2d2d", marginBottom: 24 }}>Kirim Pesan</h3>
              {contactSent ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                  <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.25rem", color: "#27ae60", marginBottom: 8 }}>Pesan Terkirim!</h4>
                  <p style={{ color: "#4e6b80", fontSize: "0.9rem" }}>Kami akan segera menghubungi Anda melalui WhatsApp.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7a9db0", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Nama *</label>
                      <input value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Nama lengkap"
                        style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #d0e4ee", borderRadius: 8, fontSize: "0.9rem", outline: "none", transition: "border .2s" }}
                        onFocus={e => e.target.style.borderColor = "#2b7a9a"}
                        onBlur={e => e.target.style.borderColor = "#d0e4ee"} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7a9db0", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>No. HP</label>
                      <input value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="08xx-xxxx-xxxx"
                        style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #d0e4ee", borderRadius: 8, fontSize: "0.9rem", outline: "none", transition: "border .2s" }}
                        onFocus={e => e.target.style.borderColor = "#2b7a9a"}
                        onBlur={e => e.target.style.borderColor = "#d0e4ee"} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7a9db0", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Email</label>
                    <input value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="email@domain.com"
                      style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #d0e4ee", borderRadius: 8, fontSize: "0.9rem", outline: "none", transition: "border .2s" }}
                      onFocus={e => e.target.style.borderColor = "#2b7a9a"}
                      onBlur={e => e.target.style.borderColor = "#d0e4ee"} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7a9db0", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Keperluan</label>
                    <select value={contactForm.subject} onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))}
                      style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #d0e4ee", borderRadius: 8, fontSize: "0.9rem", outline: "none", background: "#fff", color: contactForm.subject ? "#2d2d2d" : "#9bb5c7" }}>
                      <option value="">-- Pilih keperluan --</option>
                      <option value="Travel & Wisata">✈️ Travel & Wisata</option>
                      <option value="Wedding Organizer">💍 Wedding Organizer</option>
                      <option value="Event Organizer">🎉 Event Organizer</option>
                      <option value="Konsultasi">💬 Konsultasi Umum</option>
                      <option value="Lainnya">📋 Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7a9db0", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Pesan *</label>
                    <textarea value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Ceritakan kebutuhan Anda..."
                      rows={4}
                      style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #d0e4ee", borderRadius: 8, fontSize: "0.9rem", outline: "none", resize: "vertical", lineHeight: 1.65, transition: "border .2s" }}
                      onFocus={e => e.target.style.borderColor = "#2b7a9a"}
                      onBlur={e => e.target.style.borderColor = "#d0e4ee"} />
                  </div>
                  <button onClick={handleContactSubmit}
                    style={{ padding: "13px 28px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer", transition: "background .2s", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#2b7a9a"}
                    onMouseLeave={e => e.currentTarget.style.background = "#2d2d2d"}>
                    💬 Kirim via WhatsApp
                  </button>
                  <p style={{ fontSize: "0.8rem", color: "#9bb5c7", textAlign: "center" }}>Pesan akan diteruskan ke WhatsApp kami untuk respons lebih cepat.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAP LOKASI ── */}
      <div style={{ padding: "0" }}>
        <iframe
          title="Lokasi Arutala Organizer"
          src="https://www.google.com/maps?q=Malang,Jawa+Timur,Indonesia&output=embed&z=12"
          width="100%" height="300"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
/* ─────────────── TEAM ADMIN ─────────────── */
function TeamAdmin({ data, save, notify, uploadToCloudinary }) {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const members = data.teamMembers || [];

  const openNew = () => { setForm({ id: Date.now(), name: "", role: "", quotes: "", photo: "" }); setEditId("new"); };
  const openEdit = (m) => { setForm({ ...m }); setEditId(m.id); };
  const cancelEdit = () => { setEditId(null); setForm({}); };

  const saveMember = () => {
    if (!form.name?.trim()) return notify("Nama anggota tim wajib diisi.", "error");
    const idx = members.findIndex(x => x.id === form.id);
    const updated = idx >= 0 ? members.map((x, i) => i === idx ? form : x) : [...members, form];
    save({ ...data, teamMembers: updated });
    cancelEdit();
    notify("Data tim berhasil disimpan!");
  };

  const deleteMember = (id) => {
    if (!window.confirm("Hapus anggota tim ini?")) return;
    save({ ...data, teamMembers: members.filter(x => x.id !== id) });
    notify("Anggota tim dihapus.");
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d" }}>👥 Susunan Tim</h1>
        {!editId && <button onClick={openNew} style={{ padding: "10px 20px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Tambah Anggota</button>}
      </div>

      {/* Form Edit */}
      {editId && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,.08)", marginBottom: 28, borderTop: "4px solid #3d8fab" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#2d2d2d", marginBottom: 20 }}>{editId === "new" ? "➕ Tambah Anggota Tim" : "✏ Edit Anggota Tim"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[
              { label: "Nama *", key: "name", placeholder: "Budi Santoso" },
              { label: "Jabatan", key: "role", placeholder: "Wedding Coordinator" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
                <input value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none" }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Quotes / Motto</label>
            <input value={form.quotes || ""} onChange={e => setForm(p => ({ ...p, quotes: e.target.value }))}
              placeholder="Setiap momen spesial layak dirayakan dengan sempurna."
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Foto</label>
            {form.photo && <img src={form.photo} alt="preview" style={{ height: 80, width: 80, objectFit: "cover", borderRadius: "50%", marginBottom: 10, border: "2px solid #ddeef5" }} />}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input type="file" accept="image/*" onChange={async e => {
                const file = e.target.files?.[0]; if (!file) return;
                try { notify("⏳ Mengupload foto..."); const url = await uploadToCloudinary(file); setForm(p => ({ ...p, photo: url })); notify("Foto berhasil diupload!"); }
                catch { notify("Gagal upload foto.", "error"); }
              }} style={{ fontSize: 12, padding: "6px", border: "1.5px dashed #3d8fab", borderRadius: 6, background: "#f0f9fc", color: "#3d8fab", width: "100%" }} />
              <div style={{ fontSize: 11, color: "#9ab0bf", textAlign: "center" }}>— atau paste URL foto —</div>
              <input type="url" value={form.photo || ""} onChange={e => setForm(p => ({ ...p, photo: e.target.value }))}
                placeholder="https://..." style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #d0e4ee", borderRadius: 6, fontSize: 12, outline: "none" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={saveMember} style={{ padding: "10px 22px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>💾 Simpan</button>
            <button onClick={cancelEdit} style={{ padding: "10px 18px", background: "#f4f9fb", color: "#6b8999", border: "1px solid #d0e4ee", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Batal</button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
        {members.map(m => (
          <div key={m.id} style={{ background: "#fff", borderRadius: 12, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", background: "#f4f9fb", border: "2px solid #ddeef5", flexShrink: 0 }}>
              {m.photo ? <img src={m.photo} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>👤</div>}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#2d2d2d", fontSize: 14 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "#2b7a9a", fontWeight: 600 }}>{m.role}</div>
              {m.quotes && <div style={{ fontSize: 11, color: "#7a9db0", fontStyle: "italic", marginTop: 6, lineHeight: 1.5, whiteSpace: "pre-line" }}>"{m.quotes}"</div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEdit(m)} style={{ padding: "6px 14px", background: "#f0f9fc", color: "#3d8fab", border: "1px solid #c5dde9", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✏ Edit</button>
              <button onClick={() => deleteMember(m.id)} style={{ padding: "6px 14px", background: "#fee", color: "#e74c3c", border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🗑 Hapus</button>
            </div>
          </div>
        ))}
        {members.length === 0 && !editId && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#7a9db0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <p>Belum ada anggota tim. Klik "+ Tambah Anggota" untuk mulai.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── ADV SECTION (puzzle + quote slideshow) ─────────────── */
function AdvSection({ data, navigateTo }) {
  const [advQ, setAdvQ] = useState(0);
  const quotes = (data.content.advQuote || "").split(/\n+/).filter(Boolean);
  const safeQuotes = quotes.length ? quotes : [data.content.advQuote || ""];
  useEffect(() => {
    if (safeQuotes.length < 2) return;
    const t = setInterval(() => setAdvQ(q => (q + 1) % safeQuotes.length), 4000);
    return () => clearInterval(t);
  }, [safeQuotes.length]);
  const puzzleImgs = [
    data.images.gal[0] || data.images.hero[0],
    data.images.gal[1] || data.images.hero[1],
    data.images.gal[2] || data.images.hero[2],
    data.images.gal[3] || data.images.hero[3],
  ];
  return (
    <section className="section-md" style={{ background: "#2d2d2d" }}>
      <div className="adv2-grid">
        {/* KIRI: Teks clean */}
        <div>
          <div className="adv2-eyebrow">
            <div className="line" />
            <span>{data.content.advSub || "TRAVEL & OUTDOOR RECREATION"}</span>
          </div>
          <h2 className="adv2-title">{data.content.advTitle}</h2>

          {/* Quote slideshow */}
          <div className="adv2-quote-wrap">
            <span className="adv2-quote-item active">{safeQuotes[advQ]}</span>
          </div>
          {safeQuotes.length > 1 && (
            <div className="adv2-quote-dots">
              {safeQuotes.map((_, i) => (
                <button key={i} className={`adv2-qdot${advQ === i ? " on" : ""}`} onClick={() => setAdvQ(i)} />
              ))}
            </div>
          )}

          <div className="adv2-stats">
            {[
              { num: "500+", lbl: "Event Sukses" },
              { num: "1200+", lbl: "Klien Puas" },
              { num: `${new Date().getFullYear() - parseInt(data.content.foundingYear || "2026") || 0}+`, lbl: "Tahun" },
            ].map(s => (
              <div key={s.lbl} className="adv2-stat">
                <div className="num">{s.num}</div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          <div className="adv2-btns">
            {[
              { label: "🎉 Event Plan", key: "destinations" },
              { label: "✈️ Traveling", key: "shop" },
              { label: "💍 Wedding", key: "news" },
            ].map(item => (
              <button key={item.key} className="adv2-btn-pill" onClick={() => navigateTo(item.key)}>
                {item.label}
              </button>
            ))}
          </div>

          <button className="adv2-cta" onClick={() => navigateTo("services")}>
            Layanan Kami
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* KANAN: Puzzle grid gambar */}
        <div className="adv2-puzzle">
          <div className="adv2-puzzle-a">
            <img src={puzzleImgs[0]} alt="Destinasi" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
          </div>
          <div className="adv2-puzzle-b">
            <img src={puzzleImgs[1]} alt="Destinasi" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
          </div>
          <div className="adv2-puzzle-c">
            <div className="adv2-puzzle-c-sm">
              <img src={puzzleImgs[2]} alt="Destinasi" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            </div>
            <div className="adv2-puzzle-c-sm">
              <img src={puzzleImgs[3]} alt="Destinasi" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── HERO SLIDESHOW ─────────────── */
function HeroSlideshow({ data, navigateTo }) {
  // Kumpulkan semua coverImage dari semua posts yang published
  const allSections = ["news", "shop", "destinations"];
  const slides = [];
  allSections.forEach(sec => {
    (data.posts?.[sec] || []).filter(p => p.status === "published" && p.coverImage).forEach(p => {
      slides.push({ src: p.coverImage, title: p.title, section: sec, excerpt: p.excerpt || "" });
    });
  });
  // Fallback: gunakan hero images jika belum ada post
  if (slides.length === 0) {
    (data.images?.hero || []).forEach((src, i) => {
      slides.push({ src, title: data.content.heroTitle, section: "home", excerpt: data.content.heroSub });
    });
  }

  const TRANSITIONS = ["fade", "slideLeft", "slideUp", "zoomIn", "zoomOut", "flipX"];
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [anim, setAnim] = useState("fade");
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (animating || slides.length < 2) return;
    const randomAnim = TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)];
    setAnim(randomAnim);
    setPrev(current);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setPrev(null);
      setAnimating(false);
    }, 700);
  }, [animating, current, slides.length]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  const SECTION_LABEL = { news: "Event Plan", shop: "Traveling", destinations: "Wedding Organizer", home: "Travel & Organizer" };

  const getEnterStyle = (a) => {
    const base = { position: "absolute", inset: 0, transition: "all 0.7s cubic-bezier(.77,0,.18,1)", zIndex: 2 };
    if (!animating) return { ...base, opacity: 1, transform: "none" };
    const map = {
      fade:      { opacity: 0, transform: "none" },
      slideLeft: { opacity: 0, transform: "translateX(80px)" },
      slideUp:   { opacity: 0, transform: "translateY(60px)" },
      zoomIn:    { opacity: 0, transform: "scale(1.12)" },
      zoomOut:   { opacity: 0, transform: "scale(0.88)" },
      flipX:     { opacity: 0, transform: "perspective(900px) rotateY(25deg)" },
    };
    return { ...base, ...(map[a] || map.fade) };
  };

  const getExitStyle = (a) => {
    const base = { position: "absolute", inset: 0, transition: "all 0.7s cubic-bezier(.77,0,.18,1)", zIndex: 1 };
    const map = {
      fade:      { opacity: 0 },
      slideLeft: { opacity: 0, transform: "translateX(-80px)" },
      slideUp:   { opacity: 0, transform: "translateY(-60px)" },
      zoomIn:    { opacity: 0, transform: "scale(0.88)" },
      zoomOut:   { opacity: 0, transform: "scale(1.12)" },
      flipX:     { opacity: 0, transform: "perspective(900px) rotateY(-25deg)" },
    };
    return { ...base, ...(map[a] || { opacity: 0 }) };
  };

  const sl = slides[current];
  const prevSl = prev !== null ? slides[prev] : null;

  return (
    <section style={{ position: "relative", width: "100%", height: "clamp(480px,80vh,700px)", overflow: "hidden", background: "#04080f" }}>
      <style>{`
        @keyframes heroTxtIn { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
        @keyframes heroDotPulse { 0%,100%{transform:scale(1);opacity:.8;} 50%{transform:scale(1.3);opacity:1;} }
        .hero-cta-btn { transition: all .22s !important; }
        .hero-cta-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(0,0,0,.35) !important; }
        .hero-dot { transition: all .3s; cursor: pointer; }
        .hero-dot:hover { transform: scale(1.3); }
        .hero-arrow { transition: all .2s; cursor: pointer; background: rgba(255,255,255,.12); border: 1.5px solid rgba(255,255,255,.25); color: #fff; border-radius: 50%; width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .hero-arrow:hover { background: rgba(255,255,255,.28); }
      `}</style>

      {/* SLIDES */}
      <div style={{ position: "absolute", inset: 0 }}>
        {/* Prev slide (exit) */}
        {animating && prevSl && (
          <div style={getExitStyle(anim)}>
            <img src={prevSl.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,20,35,.85) 0%, rgba(10,20,35,.5) 50%, rgba(10,20,35,.25) 100%)" }} />
          </div>
        )}
        {/* Current slide (enter) */}
        <div style={getEnterStyle(anim)}>
          <img src={sl.src} alt={sl.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,20,35,.88) 0%, rgba(10,20,35,.55) 55%, rgba(10,20,35,.2) 100%)" }} />
        </div>
      </div>

      {/* CONTENT OVERLAY */}
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", alignItems: "center", padding: "0 6%" }}>
        <div style={{ maxWidth: 580, animation: animating ? "none" : "heroTxtIn .6s ease both" }} key={current}>
          {/* Label */}
          <div style={{ display: "inline-block", background: "#e8a020", color: "#fff", fontSize: "0.6875rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 2, marginBottom: 18 }}>
            {SECTION_LABEL[sl.section] || "Arutala Organizer"}
          </div>
          {/* Title */}
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.9rem,5.5vw,3.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.08, marginBottom: 18, textShadow: "0 2px 16px rgba(0,0,0,.4)" }}>
            {sl.title}
          </h1>
          {/* Excerpt */}
          {sl.excerpt && (
            <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,.78)", lineHeight: 1.8, marginBottom: 32, maxWidth: 440, whiteSpace: "pre-line" }}>
              {sl.excerpt.length > 120 ? sl.excerpt.slice(0, 120) + "…" : sl.excerpt}
            </p>
          )}
          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%", maxWidth: 380 }}>
            <button className="hero-cta-btn" onClick={() => navigateTo("services")}
              style={{ padding: "13px 30px", background: "#e8a020", color: "#fff", border: "none", borderRadius: 3, fontSize: "0.8125rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }}>
              Read More →
            </button>
            <button className="hero-cta-btn" onClick={() => navigateTo("about")}
              style={{ padding: "13px 30px", background: "#2d2d2d", color: "#fff", border: "2px solid rgba(255,255,255,.55)", borderRadius: 3, fontSize: "0.8125rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }}>
              About Us →
            </button>
          </div>
        </div>
      </div>

      {/* Side gradient overlays — solid edge, fade to center */}
      <div className="hero-side-grad" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "18%", background: "linear-gradient(to right, rgba(4,8,15,.82) 0%, rgba(4,8,15,.45) 50%, rgba(4,8,15,0) 100%)", zIndex: 15, pointerEvents: "none" }} />
      <div className="hero-side-grad" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "18%", background: "linear-gradient(to left, rgba(4,8,15,.82) 0%, rgba(4,8,15,.45) 50%, rgba(4,8,15,0) 100%)", zIndex: 15, pointerEvents: "none" }} />

      {/* ARROWS */}
      <button className="hero-arrow" onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", zIndex: 20, background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.25)", color: "#fff", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", transition: "all .2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.28)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>‹</button>
      <button className="hero-arrow" onClick={() => goTo((current + 1) % slides.length)}
        style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", zIndex: 20, background: "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.25)", color: "#fff", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", transition: "all .2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.28)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>›</button>

      {/* DOTS */}
      <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", zIndex: 20, display: "flex", gap: 8, alignItems: "center" }}>
        {slides.map((_, i) => (
          <div key={i} className="hero-dot" onClick={() => goTo(i)}
            style={{ width: i === current ? 28 : 10, height: 10, borderRadius: 5, background: i === current ? "#e8a020" : "rgba(255,255,255,.45)", transition: "all .3s" }} />
        ))}
      </div>

      {/* Slide counter */}
      <div style={{ position: "absolute", bottom: 22, right: "5%", zIndex: 20, fontSize: "0.75rem", color: "rgba(255,255,255,.5)", fontWeight: 600, letterSpacing: ".06em" }}>
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}

/* ─────────────── REVIEW FORM (Public, One-Time Token) ─────────────── */
function ReviewForm({ token, onSubmitDone, data, save, notify }) {
  const [step, setStep] = useState("form"); // form | done | invalid
  const [form, setForm] = useState({ name: "", email: "", stars: 5, content: "", photo: "" });
  const [photoUploading, setPhotoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const tokenObj = (data.reviewTokens || []).find(t => t.token === token);

  if (!tokenObj) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f9fb" }}>
      <div style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: "48px 40px", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,.1)" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>❌</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: "#2d2d2d", marginBottom: 12 }}>Link Tidak Valid</h2>
        <p style={{ color: "#6b8999", fontSize: "0.9375rem", lineHeight: 1.7 }}>Link form ulasan ini tidak ditemukan atau sudah tidak berlaku.</p>
      </div>
    </div>
  );

  if (tokenObj.used) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f9fb" }}>
      <div style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: "48px 40px", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,.1)" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⏰</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: "#2d2d2d", marginBottom: 12 }}>Link Sudah Digunakan</h2>
        <p style={{ color: "#6b8999", fontSize: "0.9375rem", lineHeight: 1.7 }}>Form ulasan ini sudah pernah diisi. Setiap link hanya bisa digunakan satu kali.</p>
      </div>
    </div>
  );

  if (step === "done") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#f4f9fb,#e8f4fd)" }}>
      <div style={{ textAlign: "center", background: "#fff", borderRadius: 20, padding: "56px 48px", maxWidth: 440, boxShadow: "0 16px 56px rgba(45,45,45,.12)" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.875rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 14 }}>Terima Kasih!</h2>
        <p style={{ color: "#4e6b80", fontSize: "1rem", lineHeight: 1.8 }}>Ulasan Anda telah berhasil dikirim. Kami sangat menghargai kepercayaan Anda kepada Arutala Organizer.</p>
        <div style={{ width: 48, height: 3, background: "#2b7a9a", borderRadius: 2, margin: "28px auto 0" }} />
      </div>
    </div>
  );

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    setPhotoUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(p => ({ ...p, photo: url }));
    } catch { setErr("Gagal upload foto. Coba lagi."); }
    finally { setPhotoUploading(false); }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return setErr("Nama wajib diisi.");
    if (!form.email.trim() || !form.email.includes("@")) return setErr("Email tidak valid.");
    if (!form.content.trim()) return setErr("Isi ulasan wajib diisi.");
    setSubmitting(true);
    setErr("");
    try {
      const newReview = {
        id: Date.now().toString(),
        name: form.name.trim(),
        email: form.email.trim(),
        photo: form.photo,
        stars: form.stars,
        content: form.content.trim(),
        date: new Date().toISOString().slice(0, 10),
        tokenLabel: tokenObj.label || "",
      };
      const updatedTokens = (data.reviewTokens || []).map(t =>
        t.token === token ? { ...t, used: true } : t
      );
      await save({ ...data, reviews: [...(data.reviews || []), newReview], reviewTokens: updatedTokens });
      setStep("done");
    } catch { setErr("Gagal menyimpan ulasan. Coba lagi."); }
    finally { setSubmitting(false); }
  };

  const content_data = data.content;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f4f9fb 0%,#e8f0f8 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 5%" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "48px 44px", maxWidth: 520, width: "100%", boxShadow: "0 16px 56px rgba(45,45,45,.12)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#2d2d2d,#2b7a9a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>⭐</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.75rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 8 }}>Berikan Ulasan Anda</h1>
          <p style={{ color: "#6b8999", fontSize: "0.9375rem", lineHeight: 1.6 }}>Bagikan pengalaman Anda bersama {content_data.logoText?.replace("\n"," ") || "Arutala Organizer"}</p>
          {tokenObj.label && <div style={{ marginTop: 10, display: "inline-block", background: "#f0f9fc", border: "1px solid #b8d4e3", color: "#2b7a9a", fontSize: "0.75rem", fontWeight: 600, padding: "4px 14px", borderRadius: 20 }}>{tokenObj.label}</div>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Photo Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b8999", letterSpacing: ".08em", textTransform: "uppercase" }}>Foto Profil (Opsional)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: form.photo ? "transparent" : "linear-gradient(135deg,#ddeef5,#c5dde9)", border: "2px solid #ddeef5", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {form.photo ? <img src={form.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>👤</span>}
              </div>
              <div style={{ flex: 1 }}>
                <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e.target.files?.[0])}
                  style={{ fontSize: "0.8125rem", color: "#4e6b80", width: "100%" }} />
                {photoUploading && <span style={{ fontSize: "0.75rem", color: "#2b7a9a" }}>⏳ Mengupload...</span>}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b8999", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Nama Lengkap *</label>
            <input value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErr(""); }}
              placeholder="Masukkan nama Anda"
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #d0e4ee", borderRadius: 8, fontSize: "0.9375rem", outline: "none", transition: "border-color .2s" }}
              onFocus={e => e.target.style.borderColor = "#2b7a9a"} onBlur={e => e.target.style.borderColor = "#d0e4ee"} />
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b8999", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email *</label>
            <input type="email" value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErr(""); }}
              placeholder="email@contoh.com"
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #d0e4ee", borderRadius: 8, fontSize: "0.9375rem", outline: "none", transition: "border-color .2s" }}
              onFocus={e => e.target.style.borderColor = "#2b7a9a"} onBlur={e => e.target.style.borderColor = "#d0e4ee"} />
          </div>

          {/* Stars */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b8999", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Rating *</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setForm(p => ({ ...p, stars: s }))}
                  style={{ fontSize: 32, background: "none", border: "none", cursor: "pointer", transition: "transform .15s", filter: s <= form.stars ? "none" : "grayscale(1) opacity(.3)" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>⭐</button>
              ))}
              <span style={{ fontSize: "0.875rem", color: "#6b8999", alignSelf: "center", marginLeft: 6 }}>
                {["","Sangat Buruk","Buruk","Cukup","Bagus","Sangat Bagus"][form.stars]}
              </span>
            </div>
          </div>

          {/* Review Content */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b8999", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Isi Ulasan *</label>
            <textarea value={form.content} onChange={e => { setForm(p => ({ ...p, content: e.target.value })); setErr(""); }}
              placeholder="Ceritakan pengalaman Anda bersama kami..."
              rows={5}
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #d0e4ee", borderRadius: 8, fontSize: "0.9375rem", outline: "none", resize: "vertical", lineHeight: 1.7, transition: "border-color .2s" }}
              onFocus={e => e.target.style.borderColor = "#2b7a9a"} onBlur={e => e.target.style.borderColor = "#d0e4ee"} />
          </div>

          {err && <div style={{ background: "#fef0f0", border: "1px solid #f5c6c6", borderRadius: 8, padding: "10px 14px", color: "#c0392b", fontSize: "0.875rem" }}>{err}</div>}

          <button onClick={handleSubmit} disabled={submitting || photoUploading}
            style={{ padding: "14px", background: submitting ? "#7a9db0" : "linear-gradient(135deg,#2d2d2d,#2b7a9a)", color: "#fff", border: "none", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: ".05em", cursor: submitting ? "not-allowed" : "pointer", transition: "opacity .2s" }}>
            {submitting ? "⏳ Mengirim..." : "✨ Kirim Ulasan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── REVIEW SLIDESHOW (Home Page) ─────────────── */
function ReviewSlideshow({ reviews }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const total = reviews.length;

  useEffect(() => {
    if (total < 2 || isPaused) return;
    intervalRef.current = setInterval(() => {
      setCurrent(p => (p + 1) % total);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [total, isPaused]);

  if (total === 0) return null;

  // Build visible indices: 6 cards centered around current
  // [-2, -1, 0, 1, 2, 3] offsets from current — we show 6 cards
  // Cards at positions -2 and 3 are faded (gradient edges)
  const getOffset = (offset) => ((current + offset % total + total * 4) % total);

  const cardData = total === 1
    ? [{ review: reviews[0], pos: 0, opacity: 1, scale: 1, blur: 0, fade: false }]
    : total <= 3
    ? reviews.map((r, i) => {
        const dist = Math.min(Math.abs(i - current), total - Math.abs(i - current));
        return { review: r, pos: i - current, opacity: dist === 0 ? 1 : 0.6, scale: dist === 0 ? 1 : 0.93, blur: 0, fade: dist > 1 };
      }).filter(x => !x.fade)
    : (() => {
        // 6 positions: offsets -2,-1,0,1,2,3 but visual slots 0..5
        const slots = [-2, -1, 0, 1, 2, 3];
        return slots.map((offset, slotIdx) => {
          const ridx = getOffset(offset);
          const isFade = slotIdx === 0 || slotIdx === 5;
          const isEdge = slotIdx === 1 || slotIdx === 4;
          return {
            review: reviews[ridx],
            slotIdx,
            opacity: isFade ? 0.15 : isEdge ? 0.65 : 1,
            scale: isFade ? 0.88 : isEdge ? 0.94 : 1,
            fade: isFade,
          };
        });
      })();

  return (
    <section style={{ padding: "80px 0 72px", background: "linear-gradient(180deg,#f4f9fb 0%,#fff 100%)", overflow: "hidden" }}>
      <style>{`
        @keyframes reviewIn { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        .rev-card { transition: transform .5s cubic-bezier(.22,1,.36,1), opacity .5s ease, box-shadow .3s; }
        .rev-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 48px rgba(45,45,45,.14) !important; }
      `}</style>

      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: 52, padding: "0 5%" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 1.5, background: "#c9aa71" }} />
          <span style={{ fontSize: "0.6875rem", letterSpacing: "3px", color: "#2b7a9a", textTransform: "uppercase", fontWeight: 700 }}>Testimoni Klien</span>
          <div style={{ width: 32, height: 1.5, background: "#c9aa71" }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#2d2d2d", lineHeight: 1.1 }}>
          Apa Kata Mereka?
        </h2>
        <p style={{ fontSize: "1rem", color: "#6b8999", marginTop: 12, maxWidth: 440, margin: "12px auto 0", lineHeight: 1.7 }}>
          Kepuasan klien adalah prioritas utama kami di setiap layanan.
        </p>
      </div>

      {/* Stars rating summary */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        {(() => {
          const avg = reviews.reduce((s, r) => s + (r.stars || 5), 0) / reviews.length;
          return (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #ddeef5", borderRadius: 40, padding: "10px 24px", boxShadow: "0 4px 16px rgba(45,45,45,.06)" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 900, fontFamily: "'Playfair Display',serif", color: "#2d2d2d" }}>{avg.toFixed(1)}</span>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 16, filter: s <= Math.round(avg) ? "none" : "grayscale(1) opacity(.3)" }}>⭐</span>)}
              </div>
              <span style={{ fontSize: "0.8125rem", color: "#6b8999", fontWeight: 500 }}>{reviews.length} ulasan</span>
            </div>
          );
        })()}
      </div>

      {/* Cards Container */}
      <div style={{ position: "relative", width: "100%", overflow: "visible" }}
        onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>

        {/* 6-card row */}
        {total >= 4 ? (
          <div style={{ display: "flex", justifyContent: "center", gap: 16, padding: "20px 0", position: "relative" }}>
            {cardData.map(({ review, slotIdx, opacity, scale, fade }) => (
              <div key={`${slotIdx}-${review.id}`} className="rev-card"
                style={{
                  width: "calc(14% + 20px)", minWidth: 180, maxWidth: 240,
                  flexShrink: 0, opacity, transform: `scale(${scale})`,
                  pointerEvents: fade ? "none" : "auto",
                  position: "relative",
                }}>
                {/* Gradient mask for edge cards */}
                {fade && (
                  <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 16,
                    background: slotIdx === 0
                      ? "linear-gradient(to right, rgba(244,249,251,1) 0%, rgba(244,249,251,0) 100%)"
                      : "linear-gradient(to left, rgba(244,249,251,1) 0%, rgba(244,249,251,0) 100%)",
                    pointerEvents: "none" }} />
                )}
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        ) : (
          /* Fewer cards: centered layout */
          <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "20px 5%", flexWrap: "wrap" }}>
            {reviews.map((review, i) => (
              <div key={review.id} className="rev-card"
                style={{ width: 280, flexShrink: 0, opacity: i === current ? 1 : 0.6, transform: i === current ? "scale(1)" : "scale(0.95)" }}>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {total > 1 && (
          <>
            <button onClick={() => { setCurrent(p => (p - 1 + total) % total); }}
              style={{ position: "absolute", left: "2%", top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1.5px solid #ddeef5", boxShadow: "0 4px 16px rgba(45,45,45,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#2d2d2d", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2d2d2d"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#2d2d2d"; }}>‹</button>
            <button onClick={() => { setCurrent(p => (p + 1) % total); }}
              style={{ position: "absolute", right: "2%", top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1.5px solid #ddeef5", boxShadow: "0 4px 16px rgba(45,45,45,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#2d2d2d", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2d2d2d"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#2d2d2d"; }}>›</button>
          </>
        )}
      </div>

      {/* Dots */}
      {total > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? "#2d2d2d" : "#c9d9e3", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review }) {
  const stars = review.stars || 5;
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 4px 24px rgba(45,45,45,.08)", border: "1px solid #eef4f8", height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stars */}
      <div style={{ display: "flex", gap: 3 }}>
        {[1,2,3,4,5].map(s => (
          <span key={s} style={{ fontSize: 14, filter: s <= stars ? "none" : "grayscale(1) opacity(.25)" }}>⭐</span>
        ))}
      </div>
      {/* Quote */}
      <p style={{ fontSize: "0.9rem", color: "#334f65", lineHeight: 1.75, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", flex: 1, whiteSpace: "pre-line" }}>
        "{review.content?.length > 180 ? review.content.slice(0, 180) + "…" : review.content}"
      </p>
      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12, borderTop: "1px solid #f0f4f8" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg,#2d2d2d,#2b7a9a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {review.photo
            ? <img src={review.photo} alt={review.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>{review.name?.charAt(0)?.toUpperCase() || "?"}</span>
          }
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#2d2d2d", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{review.name}</div>
          <div style={{ fontSize: "0.75rem", color: "#6b8999" }}>{review.date}</div>
        </div>
        {review.tokenLabel && (
          <div style={{ marginLeft: "auto", fontSize: "0.625rem", background: "#f0f9fc", color: "#2b7a9a", padding: "2px 8px", borderRadius: 10, fontWeight: 600, flexShrink: 0, maxWidth: 80, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{review.tokenLabel}</div>
        )}
      </div>
    </div>
  );
}


/* ─────────────── ADMIN REVIEWS COMPONENT ─────────────── */
function AdminReviews({ data, save, notify }) {
  const reviews = data.reviews || [];
  const tokens = data.reviewTokens || [];
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewForm, setEditReviewForm] = useState({});
  const [newTokenLabel, setNewTokenLabel] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const generateToken = () => {
    const token = Math.random().toString(36).slice(2, 11) + Math.random().toString(36).slice(2, 11);
    const label = newTokenLabel.trim() || "Tamu";
    const newToken = { id: Date.now().toString(), token, label, used: false, createdAt: new Date().toISOString().slice(0,10) };
    save({ ...data, reviewTokens: [...tokens, newToken] });
    const link = `${window.location.origin}${window.location.pathname}?review=${token}`;
    setGeneratedLink(link);
    setNewTokenLabel("");
    notify("✅ Link ulasan berhasil dibuat!");
  };

  const deleteToken = (id) => {
    save({ ...data, reviewTokens: tokens.filter(t => t.id !== id) });
    notify("Token dihapus.");
  };

  const deleteReview = (id) => {
    save({ ...data, reviews: reviews.filter(r => r.id !== id) });
    notify("Ulasan dihapus.");
  };

  const startEditReview = (r) => {
    setEditReviewId(r.id);
    setEditReviewForm({ name: r.name, content: r.content, stars: r.stars });
  };

  const saveEditReview = () => {
    save({ ...data, reviews: reviews.map(r => r.id === editReviewId ? { ...r, ...editReviewForm } : r) });
    setEditReviewId(null);
    notify("Ulasan diperbarui.");
  };

  return (
  <div className="fade-in">
    <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d", marginBottom: 28 }}>⭐ Kelola Ulasan</h1>

    {/* Generate Review Link */}
    <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #c9aa71" }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#2d2d2d", marginBottom: 6 }}>🔗 Buat Link Form Ulasan</h3>
      <p style={{ fontSize: 12, color: "#7a9db0", marginBottom: 16, lineHeight: 1.6 }}>
        Buat link sekali pakai untuk dikirimkan ke klien. Link hanya bisa digunakan satu kali — setelah diisi, link akan hangus otomatis.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <input value={newTokenLabel} onChange={e => setNewTokenLabel(e.target.value)}
          placeholder="Label (misal: Klien Wedding Budi, opsional)"
          style={{ flex: 1, minWidth: 240, padding: "9px 12px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none" }} />
        <button onClick={generateToken}
          style={{ padding: "9px 18px", background: "#2d2d2d", color: "#fff", borderRadius: 6, fontSize: 13, border: "none", fontWeight: 600, whiteSpace: "nowrap" }}>
          + Buat Link
        </button>
      </div>
      {generatedLink && (
        <div style={{ background: "#f0f9fc", border: "1px solid #b8d4e3", borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2b7a9a", marginBottom: 4, letterSpacing: ".05em", textTransform: "uppercase" }}>Link Form Ulasan Terbaru</div>
            <code style={{ fontSize: 12, color: "#2d2d2d", wordBreak: "break-all", display: "block" }}>{generatedLink}</code>
          </div>
          <button onClick={() => { navigator.clipboard?.writeText(generatedLink); notify("Link disalin!"); }}
            style={{ padding: "7px 14px", background: "#2b7a9a", color: "#fff", borderRadius: 6, fontSize: 12, border: "none", fontWeight: 600, flexShrink: 0 }}>
            📋 Salin
          </button>
        </div>
      )}
    </div>

    {/* Active Tokens */}
    <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d", marginBottom: 14 }}>🔑 Token Aktif ({tokens.filter(t => !t.used).length})</h3>
      {tokens.length === 0 ? (
        <p style={{ fontSize: 13, color: "#7a9db0" }}>Belum ada token dibuat.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tokens.slice().reverse().map(tok => (
            <div key={tok.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: tok.used ? "#f9f9f9" : "#f0f9fc", borderRadius: 8, border: `1px solid ${tok.used ? "#e8e8e8" : "#b8d4e3"}` }}>
              <span style={{ fontSize: 16 }}>{tok.used ? "✅" : "🔑"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#2d2d2d" }}>{tok.label || "—"}</div>
                <div style={{ fontSize: 11, color: "#7a9db0", fontFamily: "monospace", wordBreak: "break-all" }}>{tok.token}</div>
                <div style={{ fontSize: 11, color: "#7a9db0" }}>Dibuat: {tok.createdAt} · {tok.used ? "Sudah digunakan" : "Belum digunakan"}</div>
              </div>
              {!tok.used && (
                <button onClick={() => { const l = `${window.location.origin}${window.location.pathname}?review=${tok.token}`; navigator.clipboard?.writeText(l); notify("Link disalin!"); }}
                  style={{ padding: "5px 10px", background: "#3d8fab", color: "#fff", borderRadius: 5, fontSize: 11, border: "none" }}>📋</button>
              )}
              <button onClick={() => deleteToken(tok.id)}
                style={{ padding: "5px 10px", background: "#fee", color: "#e74c3c", borderRadius: 5, fontSize: 11, border: "none" }}>Hapus</button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Reviews List */}
    <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d", marginBottom: 14 }}>💬 Ulasan Masuk ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px", color: "#7a9db0", fontSize: 13 }}>Belum ada ulasan masuk. Buat link dan kirimkan ke klien!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviews.slice().reverse().map(r => (
            <div key={r.id} style={{ border: "1px solid #eef4f8", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#2d2d2d,#2b7a9a)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>
                  {r.photo ? <img src={r.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : r.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d" }}>{r.name}</span>
                    <span style={{ fontSize: 12, color: "#7a9db0" }}>{r.email}</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "#7a9db0" }}>{r.date}</span>
                  </div>
                  <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 13, filter: s <= r.stars ? "none" : "grayscale(1) opacity(.3)" }}>⭐</span>)}
                  </div>
                  {editReviewId === r.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input value={editReviewForm.name} onChange={e => setEditReviewForm(p => ({ ...p, name: e.target.value }))}
                        style={{ padding: "7px 10px", border: "1px solid #d0e4ee", borderRadius: 5, fontSize: 13 }} placeholder="Nama" />
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setEditReviewForm(p => ({ ...p, stars: s }))}
                            style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer", filter: s <= editReviewForm.stars ? "none" : "grayscale(1) opacity(.3)" }}>⭐</button>
                        ))}
                      </div>
                      <textarea value={editReviewForm.content} onChange={e => setEditReviewForm(p => ({ ...p, content: e.target.value }))}
                        rows={3} style={{ padding: "7px 10px", border: "1px solid #d0e4ee", borderRadius: 5, fontSize: 13, resize: "vertical" }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={saveEditReview} style={{ padding: "6px 16px", background: "#27ae60", color: "#fff", borderRadius: 5, fontSize: 12, border: "none" }}>Simpan</button>
                        <button onClick={() => setEditReviewId(null)} style={{ padding: "6px 14px", background: "#f4f9fb", color: "#6b8999", borderRadius: 5, fontSize: 12, border: "1px solid #d0e4ee" }}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: "#334f65", lineHeight: 1.7, fontStyle: "italic", whiteSpace: "pre-line" }}>"{r.content}"</p>
                  )}
                  {r.tokenLabel && <div style={{ marginTop: 6, fontSize: 11, color: "#2b7a9a", fontWeight: 500 }}>🏷 {r.tokenLabel}</div>}
                </div>
              </div>
              {editReviewId !== r.id && (
                <div style={{ padding: "10px 20px", background: "#fafcfd", borderTop: "1px solid #f0f4f8", display: "flex", gap: 8 }}>
                  <button onClick={() => startEditReview(r)} style={{ padding: "5px 14px", background: "#e8f4fd", color: "#2b7a9a", borderRadius: 5, fontSize: 12, border: "none", fontWeight: 500 }}>✏ Edit</button>
                  <button onClick={() => { if (window.confirm("Hapus ulasan ini?")) deleteReview(r.id); }} style={{ padding: "5px 14px", background: "#fee", color: "#e74c3c", borderRadius: 5, fontSize: 12, border: "none" }}>🗑 Hapus</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
})()}
}

export default function BricksyTravel() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");   // home | about | news | shop | destinations | services
  const [readPost, setReadPost] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [comingSoon, setComingSoon] = useState(null); // null | "google" | "apple"
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [adminSection, setAdminSection] = useState("news");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginErr, setLoginErr] = useState("");
  // Forgot password flow: null | "input_user" | "input_email" | "input_otp" | "input_newpass"
  const [forgotStep, setForgotStep] = useState(null);
  const [forgotUser, setForgotUser] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOTP, setForgotOTP] = useState({ code: "", input: "", expiry: 0, sending: false });
  const [forgotNewPass, setForgotNewPass] = useState({ val: "", confirm: "" });
  const [forgotErr, setForgotErr] = useState("");
  const [notif, setNotif] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [editImg, setEditImg] = useState({ group: null, idx: null, url: "" });
  const [editContent, setEditContent] = useState({});
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [emailSub, setEmailSub] = useState("");
  const [cmsEditPost, setCmsEditPost] = useState(null); // null | "new" | post object
  const [cmsSection, setCmsSection] = useState("news");
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mapQuery, setMapQuery] = useState("");
  const [mapLocation, setMapLocation] = useState("Malang, Jawa Timur, Indonesia");
  const mapDebounceRef = useRef(null);
  // Profile editing state
  const [profileEdit, setProfileEdit] = useState({ name: "", phone: "", email: "", desc: "", photo: "", oldPass: "", newPass: "", confirmPass: "" });
  const [userMgmtForm, setUserMgmtForm] = useState({ username: "", password: "", role: "content_writer", email: "", name: "" });
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reviewTokenParam, setReviewTokenParam] = useState(() => {
    try { return new URLSearchParams(window.location.search).get("review") || ""; } catch { return ""; }
  });

  /* ── Desktop cursor glow + scroll-reveal (pointer:fine only) ── */
  useEffect(() => {
    const isDesktop = window.matchMedia("(pointer:fine)").matches;
    if (!isDesktop) return;

    // Cursor glow
    const dot = document.createElement("div");
    dot.id = "cursor-glow";
    document.body.appendChild(dot);
    const moveDot = (e) => { dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px"; };
    const enterLink = () => dot.classList.add("expanded");
    const leaveLink = () => dot.classList.remove("expanded");
    document.addEventListener("mousemove", moveDot);
    document.querySelectorAll("a,button").forEach(el => { el.addEventListener("mouseenter", enterLink); el.addEventListener("mouseleave", leaveLink); });

    // Scroll-reveal IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".anim-fade-up, .anim-zoom").forEach(el => observer.observe(el));

    return () => {
      document.removeEventListener("mousemove", moveDot);
      if (dot.parentNode) dot.parentNode.removeChild(dot);
      observer.disconnect();
    };
  }, []);

  /* ─── Deep-merge helper ──────────────────────────────────────────────────
     Menggabungkan data yang disimpan (saved) dengan DEFAULT_DATA sehingga:
     • Semua data lama (konten, gambar, post, pesan, user, dsb.) TETAP ada
     • Field BARU yang ditambahkan lewat git push (nav6, services, dsb.)
       otomatis muncul dengan nilai default — tidak perlu reset manual
     ─────────────────────────────────────────────────────────────────────── */
  const mergeWithDefaults = (saved, defaults) => {
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return saved ?? defaults;
    const result = { ...defaults };
    for (const key of Object.keys(saved)) {
      const sv = saved[key];
      const dv = defaults?.[key];
      if (sv !== null && typeof sv === "object" && !Array.isArray(sv) && dv !== null && typeof dv === "object" && !Array.isArray(dv)) {
        // Objek nested → merge rekursif
        result[key] = mergeWithDefaults(sv, dv);
      } else {
        // Primitif atau array → pakai nilai yang disimpan
        result[key] = sv;
      }
    }
    return result;
  };

  useEffect(() => {
    (async () => {
      try {
        // 1. Coba load dari Firestore (cloud, utama)
        const fsData = await fsGet("main");
        if (fsData?.payload) {
          const parsed = JSON.parse(fsData.payload);
          // Deep-merge: data lama + field baru dari DEFAULT_DATA
          setData(mergeWithDefaults(parsed, DEFAULT_DATA));
          return;
        }
        // 2. Fallback: window.storage (lokal backup)
        const r = await window.storage?.get("bricksy-v2");
        if (r?.value) {
          const parsed = JSON.parse(r.value);
          setData(mergeWithDefaults(parsed, DEFAULT_DATA));
        }
      } catch (e) {
        console.warn("[Arutala] Gagal load data, pakai default.", e);
        // Biarkan DEFAULT_DATA — jangan setData agar tidak overwrite state yg mungkin sudah ada
      }
    })();
  }, []);

  // Sync favicon with logo
  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']") || (() => {
      const l = document.createElement("link"); l.rel = "icon"; document.head.appendChild(l); return l;
    })();
    if (data.content.logoImage) {
      favicon.href = data.content.logoImage;
      favicon.type = "image/png";
    } else {
      favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✈</text></svg>";
    }
  }, [data.content.logoImage]);

  const save = async (d) => {
    // Selalu merge dengan DEFAULT_DATA sebelum simpan:
    // field baru yang ditambahkan di kode (lewat git push) tidak akan hilang
    const safeData = mergeWithDefaults(d, DEFAULT_DATA);
    setData(safeData);
    const payload = JSON.stringify(safeData);
    // Simpan ke Firestore (cloud) + window.storage (lokal backup)
    await fsSet("main", { payload, updatedAt: Date.now() });
    try { await window.storage?.set("bricksy-v2", payload); } catch {}
  };

  const notify = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3200);
  };

  const login = async () => {
    const u = HARDCODED_USERS.find(x => x.username === loginForm.username);
    if (!u) { setLoginErr("Invalid username or password."); return; }
    // Check for password override in storage
    let savedPass = u.password;
    let profile = { name: u.name, phone: u.phone, email: u.email, desc: u.desc, photo: u.photo };
    try {
      const r = await fsGet(`profile-${u.username}`);
      if (r) {
        if (r._password) savedPass = r._password;
        profile = { name: r.name ?? profile.name, phone: r.phone ?? profile.phone, email: r.email ?? profile.email, desc: r.desc ?? profile.desc, photo: r.photo ?? profile.photo };
      }
    } catch {}
    if (loginForm.password !== savedPass) { setLoginErr("Invalid username or password."); return; }
    setUser({ ...u, ...profile });
    setShowLogin(false); setLoginErr(""); setLoginForm({ username: "", password: "" });
    notify(`Welcome back, ${profile.name || u.username}!`);
  };

  /* ── Forgot Password: Step 1 — cari username ── */
  const forgotStep1 = () => {
    if (!forgotUser.trim()) { setForgotErr("Masukkan username."); return; }
    const u = HARDCODED_USERS.find(x => x.username === forgotUser.trim());
    if (!u) { setForgotErr("Username tidak ditemukan."); return; }
    setForgotErr("");
    setForgotStep("input_email");
  };

  /* ── Forgot Password: Step 2 — verifikasi email & kirim OTP ── */
  const forgotStep2 = async () => {
    setForgotErr("");
    const u = HARDCODED_USERS.find(x => x.username === forgotUser.trim());
    // Ambil email dari Firestore atau hardcoded
    let storedEmail = u?.email || "";
    try {
      const r = await fsGet(`profile-${u.username}`);
      if (r?.email) storedEmail = r.email;
    } catch {}
    if (!storedEmail) { setForgotErr("Akun ini belum memiliki email terdaftar. Hubungi administrator."); return; }
    if (forgotEmail.trim().toLowerCase() !== storedEmail.toLowerCase()) {
      setForgotErr("Email tidak cocok dengan data akun ini."); return;
    }
    setForgotOTP(p => ({ ...p, sending: true }));
    try {
      const code = genOTP();
      await sendOTPEmail(storedEmail, code);
      setForgotOTP({ code, input: "", expiry: Date.now() + 15 * 60 * 1000, sending: false });
      setForgotStep("input_otp");
    } catch (e) {
      setForgotErr("Gagal mengirim OTP: " + (e.message || "Error")); 
      setForgotOTP(p => ({ ...p, sending: false }));
    }
  };

  /* ── Forgot Password: Step 3 — verifikasi OTP ── */
  const forgotStep3 = () => {
    if (Date.now() > forgotOTP.expiry) { setForgotErr("OTP sudah kadaluarsa. Kirim ulang."); return; }
    if (forgotOTP.input.trim() !== forgotOTP.code) { setForgotErr("Kode OTP salah."); return; }
    setForgotErr("");
    setForgotStep("input_newpass");
  };

  /* ── Forgot Password: Step 4 — simpan password baru ── */
  const forgotStep4 = async () => {
    if (forgotNewPass.val.length < 6) { setForgotErr("Password minimal 6 karakter."); return; }
    if (forgotNewPass.val !== forgotNewPass.confirm) { setForgotErr("Konfirmasi password tidak cocok."); return; }
    try {
      const prev = await fsGet(`profile-${forgotUser}`) || {};
      await fsSet(`profile-${forgotUser}`, { ...prev, _password: forgotNewPass.val });
    } catch {}
    // Reset state
    setForgotStep(null); setForgotUser(""); setForgotEmail("");
    setForgotOTP({ code: "", input: "", expiry: 0, sending: false });
    setForgotNewPass({ val: "", confirm: "" }); setForgotErr("");
    notify("Password berhasil direset! Silakan login.");
  };

  const closeForgot = () => {
    setForgotStep(null); setForgotUser(""); setForgotEmail("");
    setForgotOTP({ code: "", input: "", expiry: 0, sending: false });
    setForgotNewPass({ val: "", confirm: "" }); setForgotErr("");
  };

  const logout = () => { setUser(null); setShowAdmin(false); notify("Logged out."); };

  const content = data.content; // shorthand alias
  const isAdmin = user?.role === "admin";
  const canEdit = user?.role === "admin" || user?.role === "content_writer";
  const canCS = user?.role === "admin" || user?.role === "customer_services";

  const navigateTo = (p) => {
    setPage(p); setReadPost(null); setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Post operations
  // silent=true → auto-save, tetap di editor, tanpa notif
  const savePost = (post, silent = false) => {
    const section = post.section;
    const existing = (data.posts[section] || []);
    const idx = existing.findIndex(p => p.id === post.id);
    const updated = idx >= 0
      ? existing.map((p, i) => i === idx ? post : p)
      : [...existing, post];
    const newPosts = { ...data.posts, [section]: updated };
    save({ ...data, posts: newPosts });
    if (!silent) {
      setCmsEditPost(null);
      notify(post.status === "published" ? "Post published!" : "Saved as draft.");
    }
  };

  const deletePost = (section, id) => {
    const newPosts = { ...data.posts, [section]: (data.posts[section] || []).filter(p => p.id !== id) };
    save({ ...data, posts: newPosts });
    notify("Post deleted.");
  };

  const allPosts = Object.values(data.posts || {}).flat();
  const publishedCount = allPosts.filter(p => p.status === "published").length;
  const draftCount = allPosts.filter(p => p.status === "draft").length;

  // Contacts
  const submitMsg = () => {
    if (!contact.name || !contact.email || !contact.message) return notify("Fill all fields.", "error");
    // Save locally
    const msg = { ...contact, id: Date.now(), date: new Date().toLocaleDateString("id-ID"), read: false, replies: [] };
    save({ ...data, messages: [...data.messages, msg] });
    // Redirect to WhatsApp
    const text = `Halo Arutala Organizer! 👋\n\nNama: ${contact.name}\nEmail: ${contact.email}\n\nPesan:\n${contact.message}\n\nSalam,\n${contact.name}`;
    window.open(`${content.waLink || "https://wa.me/6285745571442"}?text=${encodeURIComponent(text)}`, "_blank");
    setContact({ name: "", email: "", message: "" });
    notify("Mengarahkan ke WhatsApp...");
  };

  const replyMsg = (id) => {
    if (!replyText.trim()) return;
    const msgs = data.messages.map(m => m.id === id
      ? { ...m, replies: [...(m.replies || []), { text: replyText, date: new Date().toLocaleDateString("id-ID"), author: user.username }], read: true }
      : m);
    save({ ...data, messages: msgs });
    setReplyTo(null); setReplyText("");
    notify("Reply sent!");
  };

  const updateImg = () => {
    if (!editImg.url.trim()) return notify("Please enter image URL.", "error");
    const imgs = { ...data.images };
    const arr = [...imgs[editImg.group]];
    arr[editImg.idx] = editImg.url.trim();
    imgs[editImg.group] = arr;
    save({ ...data, images: imgs });
    setEditImg({ group: null, idx: null, url: "" });
    notify("Image updated!");
  };

  const saveContent = (key) => {
    if (editContent[key] !== undefined) {
      save({ ...data, content: { ...data.content, [key]: editContent[key] } });
      setEditContent(p => { const n = { ...p }; delete n[key]; return n; });
      notify("Content saved!");
    }
  };

  const getCEFVal = (cKey) => editContent[cKey] !== undefined ? editContent[cKey] : data.content[cKey];

  const navItems = [
    { key: "home", label: data.content.nav1 },
    { key: "about", label: data.content.nav2 },
    { key: "news", label: data.content.nav3 },
    { key: "shop", label: data.content.nav4 },
    { key: "destinations", label: data.content.nav5 },
    { key: "services", label: data.content.nav6 || "Layanan Kami" },
  ];

  /* ─── RENDER ─── */
  return (
    <div className="page-wrap" style={{ position: "relative", minHeight: "100vh" }}>
      <GS />

      {/* DESKTOP CURSOR GLOW + SCROLL ANIMATIONS */}
      {typeof window !== "undefined" && (() => {
        // Only on pointer:fine (mouse/desktop)
        const isDesktop = window.matchMedia && window.matchMedia("(pointer:fine)").matches;
        if (!isDesktop) return null;
        return null; // rendered via useEffect below
      })()}

      {/* NOTIFICATION */}
      {notif && (
        <div className="toast-notif" style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 22px",
          background: notif.type === "error" ? "#e74c3c" : "#27ae60", color: "#fff",
          borderRadius: 8, fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,.2)",
          animation: "fadeIn .3s ease", maxWidth: 320 }}>{notif.msg}</div>
      )}

      {/* DEV PROFILE POPUP */}
      {showDevProfile && (
        <div onClick={() => setShowDevProfile(false)}
          style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(10,20,30,.45)",
            backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 14, padding: "36px 40px", maxWidth: 360, width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,.2)", textAlign: "center", position: "relative" }}>
            {/* Close */}
            <button onClick={() => setShowDevProfile(false)}
              style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none",
                fontSize: 18, color: "#b8d4e3", cursor: "pointer", lineHeight: 1 }}>✕</button>
            {/* Power Icon */}
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0f9fc",
              border: "2px solid #ddeef5", display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#3d8fab" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
                <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" /><line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </div>
            <div style={{ fontSize: 10, letterSpacing: "2px", color: "#7a9db0", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Developer Profile</div>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, color: "#2d2d2d", marginBottom: 6, lineHeight: 1.2 }}>
              Mahfud Febry Styanto
            </h2>
            <div style={{ width: 32, height: 2, background: "#3d8fab", borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="https://wa.me/6282234651413" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                  background: "#f4f9fb", borderRadius: 8, textDecoration: "none",
                  transition: "background .2s", border: "1px solid #eef4f8" }}
                onMouseEnter={e => e.currentTarget.style.background = "#e8f4fd"}
                onMouseLeave={e => e.currentTarget.style.background = "#f4f9fb"}>
                <span style={{ fontSize: 18 }}>💬</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 10, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>WhatsApp</div>
                  <div style={{ fontSize: 14, color: "#2d2d2d", fontWeight: 500 }}>082234651413</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#3d8fab", fontWeight: 500 }}>Hubungi →</span>
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                background: "#f4f9fb", borderRadius: 8, border: "1px solid #eef4f8" }}>
                <span style={{ fontSize: 18 }}>✉️</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 10, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>Email</div>
                  <div style={{ fontSize: 13, color: "#2d2d2d" }}>mahfudfebrys@gmail.com</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#b8d4e3", marginTop: 20, fontStyle: "italic" }}>
              Website developed & designed by Mahfud Febry Styanto
            </p>
          </div>
        </div>
      )}

      {/* ══════ REVIEW FORM (token-based, public) ══════ */}
      {reviewTokenParam && (
        <ReviewForm token={reviewTokenParam} data={data} save={save} notify={notify} />
      )}

      {/* ══════ PUBLIC WEBSITE ══════ */}
      {!showAdmin && !reviewTokenParam && (
        <>
          {/* NAVBAR — Fixed floating always */}
          <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(250,252,253,.97)",
            backdropFilter: "blur(12px)", borderBottom: "1px solid #ddeef5", padding: "0 5%",
            isolation: "isolate" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 96, maxWidth: 1200, margin: "0 auto", gap: 20 }}>

              {/* ── LOGO — full multi-line height ── */}
              <button onClick={() => navigateTo("home")} style={{ border: "none", background: "none", padding: 0, flexShrink: 0, height: "100%", display: "flex", alignItems: "center" }}>
                <LogoDisplay content={data.content} size="nav" />
              </button>

              {/* ── 2-ROW NAV (desktop) ── */}
              <div className="hide-sm" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", gap: 14, paddingLeft: 8 }}>
                {/* Row 1 */}
                <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
                  {navItems.slice(0, 3).map(item => (
                    <button key={item.key} onClick={() => navigateTo(item.key)}
                      className={`nav-link${page === item.key ? " active" : ""}`}
                      style={{ border: "none", background: "none", cursor: "pointer" }}>
                      {item.label}
                    </button>
                  ))}
                </div>
                {/* Row 2 */}
                <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
                  {navItems.slice(3).map(item => (
                    <button key={item.key} onClick={() => navigateTo(item.key)}
                      className={`nav-link${page === item.key ? " active" : ""}`}
                      style={{ border: "none", background: "none", cursor: "pointer" }}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── LOGIN / USER (desktop) ── */}
              <div className="hide-sm" style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                {user
                  ? <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                      <span style={{ fontSize: "0.8125rem", color: "#2d2d2d", fontWeight: 700, lineHeight: 1.2 }}>
                        {user.name || user.username}
                      </span>
                      <button onClick={() => setShowAdmin(true)}
                        style={{ fontSize: "0.6875rem", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700,
                          color: "#2b7a9a", background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1.2,
                          transition: "color .15s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#2d2d2d"}
                        onMouseLeave={e => e.currentTarget.style.color = "#2b7a9a"}>
                        Control Panel →
                      </button>
                    </div>
                  : <button onClick={() => setShowLogin(true)}
                    className="login-collapse-btn"
                    style={{
                      display: "flex", alignItems: "center", gap: 0, overflow: "hidden",
                      width: 36, border: "1.5px solid #2d2d2d", borderRadius: 6,
                      fontSize: "0.75rem", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700,
                      background: "transparent", color: "#2d2d2d", padding: "7px 9px",
                      cursor: "pointer", transition: "width .28s cubic-bezier(.4,0,.2,1), padding .28s, background .18s, color .18s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => { const b = e.currentTarget; b.style.width = "90px"; b.style.paddingRight = "14px"; b.style.gap = "7px"; b.style.background = "#2d2d2d"; b.style.color = "#fff"; b.querySelector(".lcb-text").style.opacity = "1"; b.querySelector(".lcb-text").style.maxWidth = "80px"; }}
                    onMouseLeave={e => { const b = e.currentTarget; b.style.width = "36px"; b.style.paddingRight = "9px"; b.style.gap = "0"; b.style.background = "transparent"; b.style.color = "#2d2d2d"; b.querySelector(".lcb-text").style.opacity = "0"; b.querySelector(".lcb-text").style.maxWidth = "0"; }}>
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" style={{ flexShrink: 0 }}>
                      <rect y="0" width="16" height="2" rx="1" fill="currentColor"/>
                      <rect y="5" width="16" height="2" rx="1" fill="currentColor"/>
                      <rect y="10" width="16" height="2" rx="1" fill="currentColor"/>
                    </svg>
                    <span className="lcb-text" style={{ maxWidth: 0, opacity: 0, overflow: "hidden", transition: "max-width .28s cubic-bezier(.4,0,.2,1), opacity .2s", fontSize: "0.7rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>
                      {data.content.loginBtnText || "LOGIN"}
                    </span>
                  </button>
                }
              </div>
              <button className="show-sm" onClick={() => setMobileMenu(!mobileMenu)}
                style={{ fontSize: 22, color: "#2d2d2d" }} aria-label="Menu">☰</button>
            </div>
            {mobileMenu && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                background: "#ffffff",
                borderTop: "2px solid #2b7a9a", borderBottom: "1px solid #2b7a9a",
                boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
                display: "flex", flexDirection: "column", gap: 4,
                padding: "14px 5% 22px", zIndex: 1000
              }}>
                {navItems.map(item => (
                  <button key={item.key} onClick={() => navigateTo(item.key)}
                    className="mobile-nav-item"
                    style={{
                      fontSize: "1rem",
                      color: page === item.key ? "#2b7a9a" : "#334f65",
                      fontWeight: page === item.key ? 700 : 500,
                      textShadow: "none",
                      border: "none",
                      background: page === item.key ? "#2b7a9a" : "#f8fafc",
                      textAlign: "left", padding: "13px 16px", borderRadius: 8, width: "100%",
                      borderLeft: page === item.key ? "3px solid #5bc4e0" : "3px solid #ddeef5",
                      transition: "all .15s", cursor: "pointer"
                    }}
                    onMouseEnter={e => { if (page !== item.key) { e.currentTarget.style.background = "#e0f0f6"; e.currentTarget.style.color = "#1a5a6b"; e.currentTarget.style.borderLeft = "3px solid #2b7a9a"; e.currentTarget.style.textShadow = "none"; } }}
                    onMouseLeave={e => { if (page !== item.key) { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#334f65"; e.currentTarget.style.borderLeft = "3px solid #ddeef5"; e.currentTarget.style.textShadow = "none"; } }}>
                    {item.label}
                  </button>
                ))}
                {user && (
                  <div style={{ padding: "12px 4px 4px", borderTop: "1px solid #ddeef5", marginTop: 8 }}>
                    <div style={{ fontSize: ".8125rem", color: "#7a9db0", marginBottom: 10, padding: "0 12px" }}>Login sebagai <strong style={{ color: "#2d2d2d" }}>{user.name || user.username}</strong></div>
                    <button onClick={() => { setShowAdmin(true); setMobileMenu(false); }}
                      style={{ fontSize: ".875rem", color: "#fff", background: "#2b7a9a", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 600, width: "100%", marginBottom: 8, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      Admin Panel
                    </button>
                    <button onClick={() => { logout(); setMobileMenu(false); }}
                      style={{ fontSize: ".875rem", color: "#e74c3c", background: "#1e1010", border: "1px solid #e74c3c", borderRadius: 8, padding: "9px 16px", width: "100%",  }}>
                      Logout
                    </button>
                  </div>
                )}
                {!user && <button onClick={() => { setShowLogin(true); setMobileMenu(false); }}
                  style={{ padding: "13px 16px", border: "none", background: "#2b7a9a", borderRadius: 8, fontSize: "1rem", color: "#fff", textAlign: "center", fontWeight: 600, marginTop: 8, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Login</button>}
              </div>
            )}
          </nav>

          {/* Spacer to push content below fixed navbar */}
          <div style={{ height: "clamp(60px,10vw,96px)" }} />

          {/* ── WHATSAPP FLOATING BUTTON ── */}
          <a href={content.waLink || "https://wa.me/6285745571442"} target="_blank" rel="noopener noreferrer"
            title="Hubungi Kami via WhatsApp"
            style={{
              position: "fixed", bottom: 24, right: 20, zIndex: 9990,
              width: 58, height: 58, borderRadius: "50%",
              background: "#25d366",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(37,211,102,.5), 0 2px 8px rgba(0,0,0,.2)",
              textDecoration: "none", transition: "transform .2s, box-shadow .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(37,211,102,.65), 0 4px 12px rgba(0,0,0,.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,.5), 0 2px 8px rgba(0,0,0,.2)"; }}>
            {/* WhatsApp SVG Icon */}
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 3C8.82 3 3 8.82 3 16c0 2.38.65 4.61 1.78 6.53L3 29l6.64-1.74A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="#fff"/>
              <path d="M16 5.5c-5.79 0-10.5 4.71-10.5 10.5 0 2.03.58 3.93 1.59 5.54l.28.45-.97 3.54 3.65-.95.43.25A10.44 10.44 0 0 0 16 26.5c5.79 0 10.5-4.71 10.5-10.5S21.79 5.5 16 5.5zm5.32 14.57c-.22.62-1.28 1.18-1.76 1.23-.45.05-.87.22-2.93-.61-2.49-1-4.07-3.54-4.2-3.7-.12-.17-.99-1.32-.99-2.52 0-1.2.63-1.79.85-2.03.22-.25.49-.31.65-.31l.47.01c.15.01.36-.06.56.43.21.5.72 1.76.78 1.89.07.13.11.28.02.45-.08.17-.13.28-.25.43l-.38.44c-.12.13-.25.26-.11.51.14.25.63 1.04 1.35 1.68.93.83 1.71 1.09 1.96 1.21.25.12.39.1.54-.06.15-.16.62-.72.78-.97.16-.25.33-.21.55-.13.22.08 1.41.67 1.65.79.24.12.4.18.46.28.06.1.06.58-.16 1.2z" fill="#25d366"/>
            </svg>
            {/* Pulse ring animation */}
            <style>{`
              @keyframes waPulse {
                0% { transform: scale(1); opacity: .6; }
                100% { transform: scale(1.7); opacity: 0; }
              }
              .wa-float-ring {
                position: absolute; inset: 0; border-radius: 50%;
                border: 2px solid #25d366;
                animation: waPulse 2s ease-out infinite;
                pointer-events: none;
              }
              @media(max-width:768px){ .hero-arrow{ display:none !important; } }
            `}</style>
            <div className="wa-float-ring" />
          </a>

          {/* ── ARTICLE DETAIL ── */}
          {readPost && (
            <ArticleDetail post={readPost} onBack={() => { setReadPost(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          )}

          {/* ── PAGE CONTENT ── */}
          {!readPost && (
            <>
              {/* HOME */}
              {page === "home" && (
                <>
                  {/* Hero Slideshow */}
                  <HeroSlideshow data={data} navigateTo={navigateTo} />

                  {/* ── HERO INTRO: Title + Subtitle + Gambar ── */}
                  <section className="hero-intro">
                    {/* Blob background decorations */}
                    <div className="hero-intro-blob1" />
                    <div className="hero-intro-blob2" />
                    <div className="hero-intro-inner">
                      {/* KIRI: Gambar */}
                      <div className="hero-intro-img">
                        <img
                          src={data.images.adv[0] || data.images.hero?.[0]}
                          alt={data.content.heroTitle}
                        />
                        {/* Ornamen badge di atas gambar */}
                        <div style={{ position: "absolute", top: 18, left: 18, background: "#2d2d2d", color: "#c9aa71", fontSize: ".6rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 800, padding: "5px 12px", borderRadius: 2, zIndex: 2 }}>
                          Arutala Organizer
                        </div>
                        {/* Shadow overlay bawah */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(45,45,45,.5), rgba(45,45,45,0))", pointerEvents: "none", zIndex: 1 }} />
                      </div>

                      {/* KANAN: Teks */}
                      <div className="hero-intro-txt">
                        {/* Deco line */}
                        <div className="hero-intro-deco-line" />
                        <div className="hero-intro-eyebrow">
                          <div className="line" />
                          <span style={{ fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#c9aa71", fontWeight: 700 }}>
                            {data.content.advSub || "TRAVEL & OUTDOOR RECREATION"}
                          </span>
                        </div>

                        <h1 className="hero-intro-h1">
                          {data.content.heroTitle || "Arutala Organizer"}
                        </h1>

                        <p className="hero-intro-p">
                          {data.content.heroSub}
                        </p>

                        {/* Badge stats ringkas */}
                        <div style={{ display: "flex", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
                          {[
                            { num: "500+", lbl: "Event" },
                            { num: "1200+", lbl: "Klien" },
                            { num: "10+", lbl: "Kota" },
                          ].map(s => (
                            <div key={s.lbl} style={{ textAlign: "center" }}>
                              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 900, color: "#2d2d2d", lineHeight: 1 }}>{s.num}</div>
                              <div style={{ fontSize: ".6875rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#8aabbd", fontWeight: 600, marginTop: 3 }}>{s.lbl}</div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                          <button onClick={() => navigateTo("services")}
                            style={{ padding: "12px 26px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 6, fontSize: ".8125rem", fontWeight: 700, cursor: "pointer", letterSpacing: ".04em", transition: "opacity .2s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = ".82"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                            Layanan Kami →
                          </button>
                          <button onClick={() => navigateTo("about")}
                            style={{ padding: "12px 24px", background: "#f4f9fb", color: "#2d2d2d", border: "1.5px solid #ddeef5", borderRadius: 6, fontSize: ".8125rem", fontWeight: 600, cursor: "pointer", transition: "all .2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#ddeef5"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#f4f9fb"; }}>
                            Tentang Kami
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ── ADVENTURE — TEKS KIRI + PUZZLE IMG KANAN ── */}
                  <AdvSection data={data} navigateTo={navigateTo} />

                  {/* Gallery */}
                  <section className="section-md" style={{ background: "#f4f9fb" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
                      <div className="label-xs" style={{ color: "#6b8999", marginBottom: 14 }}>INTRODUCING</div>
                      <h2 className="display" style={{ fontSize: "clamp(1.75rem,4.5vw,3rem)", fontWeight: 900, color: "#2d2d2d", marginBottom: 16 }}>
                        {data.content.newAdvTitle}
                      </h2>
                      <p style={{ fontSize: "0.9375rem", color: "#4e6b80", lineHeight: 1.8, maxWidth: 440, margin: "0 auto 40px", whiteSpace: "pre-line" }}>{data.content.newAdvSub}</p>
                      <div className="gal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 40 }}>
                        {(() => {
                          const allSecs = ["news","shop","destinations"];
                          const publishedPosts = allSecs.flatMap(sec => (data.posts?.[sec] || []).filter(p => p.status === "published" && p.coverImage));
                          const galItems = publishedPosts.length > 0 ? publishedPosts.slice(0, 6) : data.images.gal.map(src => ({ coverImage: src, _static: true }));
                          return galItems.map((item, i) => (
                            <div key={i} className="img-zoom hover-lift"
                              onClick={() => { if (!item._static) { setReadPost(item); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
                              style={{ borderRadius: 4, overflow: "hidden", aspectRatio: "3/2", cursor: item._static ? "default" : "pointer" }}>
                              <img src={item.coverImage || item} alt={item.title || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ));
                        })()}
                      </div>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button onClick={() => setExploreOpen(v => !v)} className="btn-outline-solid"
                          style={{ padding: "12px 30px", border: "1.5px solid #2d2d2d", background: exploreOpen ? "#2d2d2d" : "#fff",
                          fontSize: "0.75rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700,
                          color: exploreOpen ? "#fff" : "#2d2d2d", transition: "all .2s", display: "flex", alignItems: "center", gap: 8 }}
                          onMouseEnter={e => { if (!exploreOpen) { e.currentTarget.style.background = "#2d2d2d"; e.currentTarget.style.color = "#fff"; } }}
                          onMouseLeave={e => { if (!exploreOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2d2d2d"; } }}>
                          Explore All <span style={{ fontSize: "0.6rem", transition: "transform .2s", display: "inline-block", transform: exploreOpen ? "rotate(180deg)" : "none" }}>▼</span>
                        </button>
                        {exploreOpen && (
                          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff",
                            border: "1.5px solid #2d2d2d", borderRadius: 4, minWidth: 200, zIndex: 50,
                            boxShadow: "0 8px 32px rgba(45,45,45,.15)", overflow: "hidden" }}>
                            {[
                              { label: "🎉 Event Plan", key: "destinations" },
                              { label: "✈️ Traveling", key: "shop" },
                              { label: "💍 Wedding Organizer", key: "news" },
                            ].map(item => (
                              <button key={item.key} onClick={() => { navigateTo(item.key); setExploreOpen(false); }}
                                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 20px",
                                  fontSize: "0.875rem", fontWeight: 500, color: "#2d2d2d", background: "none",
                                  border: "none", borderBottom: "1px solid #f4f9fb", cursor: "pointer", transition: "background .15s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#f4f9fb"}
                                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Book */}
                  <section className="section-md" style={{ background: "#c5dde9" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="grid-2">
                      <div className="book-img-grid">
                        <div className="img-zoom" style={{ gridColumn: "span 2", borderRadius: 4, overflow: "hidden" }}>
                          <img src={data.images.adv[1]} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} />
                        </div>
                        <div className="img-zoom" style={{ borderRadius: 4, overflow: "hidden" }}>
                          <img src={data.images.adv[0]} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} />
                        </div>
                        <div className="img-zoom" style={{ borderRadius: 4, overflow: "hidden" }}>
                          <img src={data.images.gal[2]} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} />
                        </div>
                      </div>
                      <div>
                        <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, lineHeight: 1.1, color: "#2d2d2d", marginBottom: 18 }}>
                          {data.content.bookTitle}
                        </h2>
                        <p style={{ fontSize: "0.9375rem", color: "#4e6b80", lineHeight: 1.85, marginBottom: 28, maxWidth: 340, whiteSpace: "pre-line" }}>{data.content.bookSub}</p>
                        <a href={content.waLink || "https://wa.me/6285745571442"} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-block", padding: "12px 30px", border: "1.5px solid #2d2d2d", background: "#fff",
                          fontSize: "0.75rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, color: "#2d2d2d", transition: "all .2s", textDecoration: "none" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#2d2d2d"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2d2d2d"; }}>
                          Book Now
                        </a>
                      </div>
                    </div>
                  </section>

                  {/* Latest News Preview */}
                  <section className="section-md" style={{ background: "#fff" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36 }}>
                        <h2 className="display" style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 900, color: "#2d2d2d" }}>Latest News</h2>
                        <button onClick={() => navigateTo("news")} style={{ fontSize: "0.875rem", color: "#2b7a9a", border: "none", background: "none", fontWeight: 600 }}>
                          View all →
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 28 }}>
                        {(data.posts?.news || []).filter(p => p.status === "published").slice(0, 3).map(post => (
                          <PostCard key={post.id} post={post} onClick={() => { setReadPost(post); window.scrollTo({ top: 0, behavior: "smooth" }); }} view="grid" />
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Globe / Maps Search Section */}
                  <section style={{ padding: "0", background: "#04080f", overflow: "hidden", position: "relative", minHeight: 420 }}>
                    {/* MAP — absolute full kiri, hidden mobile */}
                    <div className="map-section-hide-mobile" style={{ position: "absolute", top: 0, left: 0, width: "55%", height: "100%", zIndex: 1 }}>
                      <iframe
                        key={mapLocation}
                        title="Google Maps Preview"
                        style={{ border: 0, display: "block", width: "100%", height: "100%", minHeight: 420 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed&z=12`}
                      />
                    </div>
                    {/* Gradasi SOFT multi-layer kiri→kanan */}
                    <div className="map-section-hide-mobile" style={{ position: "absolute", top: 0, left: "20%", width: "45%", height: "100%", zIndex: 2, pointerEvents: "none",
                      background: "linear-gradient(to right, transparent 0%, rgba(4,8,15,.15) 20%, rgba(4,8,15,.45) 45%, rgba(4,8,15,.78) 70%, #04080f 100%)" }} />
                    {/* Stars overlay di kanan */}
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(1px 1px at 65% 15%, rgba(255,255,255,.7) 0%, transparent 100%), radial-gradient(1px 1px at 72% 40%, rgba(255,255,255,.5) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 80% 10%, rgba(255,255,255,.8) 0%, transparent 100%), radial-gradient(1px 1px at 88% 30%, rgba(255,255,255,.4) 0%, transparent 100%), radial-gradient(1px 1px at 92% 60%, rgba(255,255,255,.6) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 96% 20%, rgba(255,255,255,.9) 0%, transparent 100%), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,.3) 0%, transparent 100%), radial-gradient(1px 1px at 75% 85%, rgba(255,255,255,.4) 0%, transparent 100%)", zIndex: 3, pointerEvents: "none" }} />

                    {/* Teks & search — kanan */}
                    <div style={{ position: "relative", zIndex: 4, display: "flex", justifyContent: "flex-end" }}>
                      <div className="map-text-width" style={{ width: "50%", padding: "56px 6% 56px 0" }}>
                        <div className="label-xs" style={{ color: "#5bc4e0", marginBottom: 14 }}>✦ Jelajahi Dunia</div>
                        <h2 className="display" style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 900, color: "#fff", marginBottom: 10, lineHeight: 1.1 }}>
                          {data.content.newsletterTitle}
                        </h2>
                        <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,.55)", marginBottom: 28, lineHeight: 1.75 }}>
                          Ketik nama kota atau destinasi untuk menjelajahinya di peta interaktif — langsung di sini.
                        </p>
                        <div style={{ display: "flex", gap: 0, maxWidth: 400 }}>
                          <input
                            value={mapQuery}
                            onChange={e => {
                              setMapQuery(e.target.value);
                              clearTimeout(mapDebounceRef.current);
                              if (e.target.value.trim()) {
                                mapDebounceRef.current = setTimeout(() => {
                                  setMapLocation(e.target.value.trim());
                                }, 700);
                              }
                            }}
                            onKeyDown={e => {
                              if (e.key === "Enter" && mapQuery.trim()) {
                                clearTimeout(mapDebounceRef.current);
                                setMapLocation(mapQuery.trim());
                              }
                            }}
                            placeholder="Cari lokasi... (e.g. Bali, Raja Ampat)"
                            aria-label="Cari lokasi di Google Maps"
                            style={{ flex: 1, padding: "12px 18px", border: "1.5px solid rgba(91,196,224,.4)", borderRight: "none",
                              fontSize: "0.9375rem", background: "rgba(255,255,255,.12)", color: "#fff", outline: "none",
                              borderRadius: "4px 0 0 4px" }} />
                          <button
                            onClick={() => {
                              if (mapQuery.trim()) {
                                clearTimeout(mapDebounceRef.current);
                                setMapLocation(mapQuery.trim());
                              }
                            }}
                            style={{ padding: "12px 20px", background: "#2b7a9a", color: "#fff", border: "none",
                              fontSize: "0.75rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700,
                              borderRadius: "0 4px 4px 0", cursor: "pointer", transition: "background .2s", whiteSpace: "nowrap" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#3d8fab"}
                            onMouseLeave={e => e.currentTarget.style.background = "#2b7a9a"}>
                            🔍 Jelajahi
                          </button>
                        </div>
                        {mapQuery && mapQuery.trim() !== mapLocation && (
                          <p style={{ fontSize: "0.8125rem", color: "rgba(91,196,224,.8)", marginTop: 10 }}>
                            ⌛ Memuat peta untuk <strong style={{ color: "#5bc4e0" }}>{mapQuery}</strong>…
                          </p>
                        )}
                        {mapQuery.trim() && mapQuery.trim() === mapLocation && (
                          <p style={{ fontSize: "0.8125rem", color: "rgba(91,196,224,.8)", marginTop: 10 }}>
                            📍 Menampilkan: <strong style={{ color: "#5bc4e0" }}>{mapLocation}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Reviews Slideshow */}
                  {(data.reviews || []).length > 0 && (
                    <ReviewSlideshow reviews={data.reviews || []} />
                  )}

                  {/* Contact */}
                  <section className="section-md" style={{ background: "#fff" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="contact-grid">
                      <div>
                        <h2 className="display" style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 900, color: "#2d2d2d", marginBottom: 18 }}>Contact Us</h2>
                        <p style={{ fontSize: "0.9375rem", color: "#4e6b80", lineHeight: 1.85, marginBottom: 20, whiteSpace: "pre-line" }}>{data.content.contactText || data.content.aboutContactSub}</p>
                        <p style={{ fontSize: "0.9375rem", color: "#334f65", marginBottom: 8, fontWeight: 500 }}>✉ {data.content.email}</p>
                        <p style={{ fontSize: "0.9375rem", color: "#334f65", fontWeight: 500 }}>📞 {data.content.phone}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {["name", "email"].map(f => (
                          <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                            value={contact[f]} onChange={e => setContact(p => ({ ...p, [f]: e.target.value }))}
                            aria-label={f.charAt(0).toUpperCase() + f.slice(1)}
                            style={{ padding: "12px 14px", border: "1.5px solid #d0e4ee", fontSize: "0.9375rem", outline: "none", borderRadius: 4 }} />
                        ))}
                        <textarea placeholder="Message" rows={4} value={contact.message}
                          onChange={e => setContact(p => ({ ...p, message: e.target.value }))}
                          aria-label="Message"
                          style={{ padding: "12px 14px", border: "1.5px solid #d0e4ee", fontSize: "0.9375rem", outline: "none", borderRadius: 4, resize: "vertical", lineHeight: 1.65 }} />
                        <button onClick={submitMsg} style={{ padding: "12px 26px", background: "#2d2d2d", color: "#fff",
                          fontSize: "0.75rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700,
                          border: "none", borderRadius: 4, alignSelf: "flex-start", transition: "background .2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#2b7a9a"}
                          onMouseLeave={e => e.currentTarget.style.background = "#2d2d2d"}>
                          Send Message
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Footer */}
                  <footer style={{ background: "#fafcfd", borderTop: "1px solid #ddeef5", padding: "56px 5% 32px" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                      <div className="footer-grid" style={{ marginBottom: 40 }}>
                        <div>
                          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 14, color: "#2d2d2d", letterSpacing: ".06em", textTransform: "uppercase" }}>About Us</h3>
                          <p style={{ fontSize: "0.875rem", color: "#4e6b80", lineHeight: 1.8, marginBottom: 14, whiteSpace: "pre-line" }}>{data.content.aboutText}</p>
                          <p style={{ fontSize: "0.875rem", color: "#4e6b80" }}>email: <a href={`mailto:${data.content.email}`} style={{ color: "#2b7a9a", fontWeight: 500 }}>{data.content.email}</a></p>
                          <p style={{ fontSize: "0.875rem", color: "#4e6b80", marginTop: 4 }}>phone: {data.content.phone}</p>
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 14, color: "#2d2d2d", letterSpacing: ".06em", textTransform: "uppercase" }}>Our Gallery</h3>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                            {data.images.gal.slice(0, 6).map((src, i) => (
                              <div key={i} style={{ borderRadius: 4, overflow: "hidden" }}>
                                <img src={src} alt="" style={{ width: "100%", height: 56, objectFit: "cover" }} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 14, color: "#2d2d2d", letterSpacing: ".06em", textTransform: "uppercase" }}>Navigation</h3>
                          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                            {navItems.map(n => (
                              <li key={n.key}>
                                <button onClick={() => navigateTo(n.key)} style={{ fontSize: "0.875rem", color: "#2b7a9a", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontWeight: 500 }}>{n.label}</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div style={{ borderTop: "1px solid #ddeef5", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <button onClick={() => setShowDevProfile(true)} title="Developer Info"
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, color: "#7a9db0", fontSize: "0.75rem", fontWeight: 500, transition: "color .2s" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#2b7a9a"}
                            onMouseLeave={e => e.currentTarget.style.color = "#7a9db0"}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                              <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" /><line x1="12" y1="2" x2="12" y2="12" />
                            </svg>
                            Power Developer
                          </button>
                          <p style={{ fontSize: "0.8125rem", color: "#6b8999" }}>© 2026 Arutala All Rights Reserved</p>
                        </div>
                        <LogoDisplay content={data.content} size="footer" />
                      </div>
                    </div>
                  </footer>
                </>
              )}

              {/* ABOUT PAGE */}
              {page === "about" && <AboutPage content={data.content} images={data.images} teamMembers={data.teamMembers || []} />}

              {/* SERVICES PAGE */}
              {page === "services" && <ServicesPage content={data.content} services={data.services || []} navigateTo={navigateTo} />}

              {/* NEWS / SHOP / DESTINATIONS */}
              {["news", "shop", "destinations"].includes(page) && (
                <SectionPage
                  section={page}
                  posts={data.posts || {}}
                  onReadPost={(post) => { setReadPost(post); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                />
              )}
            </>
          )}
        </>
      )}

      {/* ══════ LOGIN MODAL ══════ */}
      {showLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(30,50,72,.6)", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div className="login-modal fade-in">
            <button onClick={() => { setShowLogin(false); setLoginErr(""); }}
              style={{ position: "absolute", top: 16, right: 20, fontSize: 20, color: "#7a9db0" }}>×</button>
            <h2 className="display" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 6 }}>Welcome Back</h2>
            <p style={{ fontSize: "0.875rem", color: "#6b8999", marginBottom: 28, letterSpacing: ".02em" }}>Sign in to your account</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input placeholder="Username" value={loginForm.username}
                onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && login()}
                style={{ padding: "12px 14px", border: "1px solid #d0e4ee", borderRadius: 4, fontSize: 14, outline: "none" }} />
              <input placeholder="Password" type="password" value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && login()}
                style={{ padding: "12px 14px", border: "1px solid #d0e4ee", borderRadius: 4, fontSize: 14, outline: "none" }} />
              {loginErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{loginErr}</p>}
              <button onClick={login} style={{ padding: "13px", background: "#2d2d2d", color: "#fff",
                border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>
                Sign In
              </button>
              <button onClick={() => { setShowLogin(false); setForgotStep("input_user"); }}
                style={{ background: "none", border: "none", color: "#3d8fab", fontSize: 13, cursor: "pointer", textAlign: "center", padding: "4px 0" }}>
                Lupa sandi? Reset via OTP
              </button>
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: "#e8eef4" }} />
                <span style={{ fontSize: 11, color: "#b8d4e3", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>atau masuk dengan</span>
                <div style={{ flex: 1, height: 1, background: "#e8eef4" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Google */}
                <button onClick={() => setComingSoon("google")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", padding: "11px 16px", background: "#fff", border: "1.5px solid #e0e6ed", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#4a4a4a", cursor: "pointer", transition: "all .18s", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f7fafd"; e.currentTarget.style.borderColor = "#c5d5e4"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,.09)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e0e6ed"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.06)"; }}>
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.8 0 5.35 1.056 7.3 2.787l5.657-5.657C33.204 7.378 28.8 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                    <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c2.8 0 5.35 1.056 7.3 2.787l5.657-5.657C33.204 7.378 28.8 5 24 5 16.318 5 9.656 9.337 6.306 14.691z" fill="#FF3D00"/>
                    <path d="M24 45c4.686 0 8.978-1.73 12.218-4.559l-5.64-4.777A11.96 11.96 0 0 1 24 37c-5.313 0-9.625-3.324-11.29-7.948l-6.525 5.026C9.505 40.556 16.227 45 24 45z" fill="#4CAF50"/>
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 5.64 4.777C36.476 39.146 44 34 44 25c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                  </svg>
                  Lanjutkan dengan Google
                </button>
                {/* Apple */}
                <button onClick={() => setComingSoon("apple")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", padding: "11px 16px", background: "#111", border: "1.5px solid #111", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", transition: "all .18s", boxShadow: "0 1px 4px rgba(0,0,0,.18)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#222"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,.28)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#111"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.18)"; }}>
                  <svg width="17" height="17" viewBox="0 0 814 1000" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.7-49 30.8 0 134.2 2.6 198.3 99zM549.1 141.3c20.1-23.1 33.5-54.8 33.5-86.5 0-4.5-.3-9-1-13.2-31.9 1.3-70.5 21.3-93.5 46.4-18.5 20.4-35.8 52.7-35.8 85 0 5.1.6 10.1 1 12.2 2 .3 4.5.6 7 .6 28.6 0 65.3-19.2 88.8-44.5z"/>
                  </svg>
                  Lanjutkan dengan Apple
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ COMING SOON POPUP ══════ */}
      {comingSoon && (
        <div onClick={() => setComingSoon(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(10,20,35,.65)", zIndex: 2500,
            display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}>
          <div onClick={e => e.stopPropagation()} className="fade-in"
            style={{ background: "#fff", borderRadius: 20, padding: "52px 44px", maxWidth: 380, width: "90%",
              textAlign: "center", boxShadow: "0 24px 72px rgba(0,0,0,.22)", position: "relative" }}>
            {/* Close */}
            <button onClick={() => setComingSoon(null)}
              style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none",
                fontSize: 20, color: "#b8d4e3", cursor: "pointer", lineHeight: 1 }}>✕</button>

            {/* Icon */}
            <div style={{ width: 72, height: 72, borderRadius: "50%",
              background: comingSoon === "google"
                ? "linear-gradient(135deg,#4285f4,#34a853,#fbbc04,#ea4335)"
                : "linear-gradient(135deg,#1c1c1e,#3a3a3c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 22px", boxShadow: "0 8px 28px rgba(0,0,0,.18)" }}>
              {comingSoon === "google" ? (
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                  <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.8 0 5.35 1.056 7.3 2.787l5.657-5.657C33.204 7.378 28.8 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#fff"/>
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 814 1000" fill="white">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.7-49 30.8 0 134.2 2.6 198.3 99zM549.1 141.3c20.1-23.1 33.5-54.8 33.5-86.5 0-4.5-.3-9-1-13.2-31.9 1.3-70.5 21.3-93.5 46.4-18.5 20.4-35.8 52.7-35.8 85 0 5.1.6 10.1 1 12.2 2 .3 4.5.6 7 .6 28.6 0 65.3-19.2 88.8-44.5z"/>
                </svg>
              )}
            </div>

            {/* Badge */}
            <div style={{ display: "inline-block", background: "#f0f9fc", border: "1px solid #b8d4e3",
              color: "#2b7a9a", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: ".12em",
              textTransform: "uppercase", padding: "5px 16px", borderRadius: 20, marginBottom: 18 }}>
              🚧 Coming Soon
            </div>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.625rem", fontWeight: 900,
              color: "#2d2d2d", marginBottom: 12, lineHeight: 1.15 }}>
              Login dengan {comingSoon === "google" ? "Google" : "Apple"}
            </h2>

            <p style={{ fontSize: "0.9375rem", color: "#6b8999", lineHeight: 1.75, marginBottom: 28, maxWidth: 280, margin: "0 auto 28px" }}>
              Fitur ini sedang dalam pengembangan dan akan segera hadir. Gunakan login manual untuk saat ini.
            </p>

            {/* Progress bar animation */}
            <div style={{ height: 4, background: "#f0f4f8", borderRadius: 10, overflow: "hidden", marginBottom: 28 }}>
              <style>{`@keyframes csProgress{0%{width:0%}100%{width:75%}}`}</style>
              <div style={{ height: "100%", background: "linear-gradient(to right,#2b7a9a,#5bc4e0)",
                borderRadius: 10, animation: "csProgress 2s ease-out forwards" }} />
            </div>

            <button onClick={() => setComingSoon(null)}
              style={{ width: "100%", padding: "12px", background: "#2d2d2d", color: "#fff",
                border: "none", borderRadius: 10, fontSize: "0.875rem", fontWeight: 700,
                letterSpacing: ".04em", cursor: "pointer", transition: "background .2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#2b7a9a"}
              onMouseLeave={e => e.currentTarget.style.background = "#2d2d2d"}>
              Kembali ke Login
            </button>
          </div>
        </div>
      )}

      {/* ══════ FORGOT PASSWORD MODAL ══════ */}
      {forgotStep && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(30,50,72,.6)", zIndex: 2100,
          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div className="login-modal fade-in" style={{ maxWidth: 420 }}>
            <button onClick={closeForgot}
              style={{ position: "absolute", top: 16, right: 20, fontSize: 20, color: "#7a9db0" }}>×</button>

            {/* Step indicator */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {[1,2,3,4].map(n => {
                const stepMap = { input_user:1, input_email:2, input_otp:3, input_newpass:4 };
                const cur = stepMap[forgotStep] || 1;
                return (
                  <div key={n} style={{ flex: 1, height: 3, borderRadius: 2,
                    background: n <= cur ? "#2b7a9a" : "#ddeef5", transition: "background .3s" }} />
                );
              })}
            </div>

            {/* STEP 1 — Username */}
            {forgotStep === "input_user" && (
              <>
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 6 }}>Lupa Sandi</h2>
                <p style={{ fontSize: "0.875rem", color: "#6b8999", marginBottom: 24 }}>Masukkan username akun Anda.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Username" value={forgotUser}
                    onChange={e => { setForgotUser(e.target.value); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep1()}
                    style={{ padding: "12px 14px", border: "1px solid #d0e4ee", borderRadius: 4, fontSize: 14, outline: "none" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep1}
                    style={{ padding: "13px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>
                    Lanjut
                  </button>
                  <button onClick={() => { closeForgot(); setShowLogin(true); }}
                    style={{ background: "none", border: "none", color: "#6b8999", fontSize: 12, cursor: "pointer" }}>← Kembali ke Login</button>
                </div>
              </>
            )}

            {/* STEP 2 — Verifikasi Email */}
            {forgotStep === "input_email" && (
              <>
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 6 }}>Verifikasi Email</h2>
                <p style={{ fontSize: "0.875rem", color: "#6b8999", marginBottom: 24 }}>
                  Masukkan email yang terdaftar untuk akun <strong style={{ color: "#2d2d2d" }}>{forgotUser}</strong>.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Email terdaftar" type="email" value={forgotEmail}
                    onChange={e => { setForgotEmail(e.target.value); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep2()}
                    style={{ padding: "12px 14px", border: "1px solid #d0e4ee", borderRadius: 4, fontSize: 14, outline: "none" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep2} disabled={forgotOTP.sending}
                    style={{ padding: "13px", background: forgotOTP.sending ? "#7a9db0" : "#2d2d2d", color: "#fff",
                      border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500, cursor: forgotOTP.sending ? "not-allowed" : "pointer" }}>
                    {forgotOTP.sending ? "⏳ Mengirim OTP..." : "Kirim OTP"}
                  </button>
                  <button onClick={() => { setForgotStep("input_user"); setForgotErr(""); }}
                    style={{ background: "none", border: "none", color: "#6b8999", fontSize: 12, cursor: "pointer" }}>← Kembali</button>
                </div>
              </>
            )}

            {/* STEP 3 — Input OTP */}
            {forgotStep === "input_otp" && (
              <>
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 6 }}>Masukkan Kode OTP</h2>
                <p style={{ fontSize: "0.875rem", color: "#6b8999", marginBottom: 8 }}>
                  Kode 6 digit telah dikirim ke <strong style={{ color: "#2d2d2d" }}>{forgotEmail}</strong>.
                </p>
                <p style={{ fontSize: "0.8125rem", color: "#f39c12", marginBottom: 20 }}>⏱ Berlaku 15 menit.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Kode OTP 6 digit" value={forgotOTP.input} maxLength={6}
                    onChange={e => { setForgotOTP(p => ({ ...p, input: e.target.value.replace(/\D/g, "") })); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep3()}
                    style={{ padding: "12px 14px", border: "1.5px solid #d0e4ee", borderRadius: 4, fontSize: 20,
                      letterSpacing: "8px", textAlign: "center", outline: "none", fontWeight: 700, color: "#2d2d2d" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep3}
                    style={{ padding: "13px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>
                    Verifikasi OTP
                  </button>
                  <button onClick={() => { setForgotStep("input_email"); setForgotOTP({ code:"",input:"",expiry:0,sending:false }); setForgotErr(""); }}
                    style={{ background: "none", border: "none", color: "#3d8fab", fontSize: 12, cursor: "pointer" }}>
                    ↺ Kirim ulang OTP
                  </button>
                </div>
              </>
            )}

            {/* STEP 4 — Password Baru */}
            {forgotStep === "input_newpass" && (
              <>
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 6 }}>Password Baru</h2>
                <p style={{ fontSize: "0.875rem", color: "#6b8999", marginBottom: 24 }}>
                  OTP terverifikasi ✅. Buat password baru untuk <strong style={{ color: "#2d2d2d" }}>{forgotUser}</strong>.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Password baru (min. 6 karakter)" type="password" value={forgotNewPass.val}
                    onChange={e => { setForgotNewPass(p => ({ ...p, val: e.target.value })); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep4()}
                    style={{ padding: "12px 14px", border: "1px solid #d0e4ee", borderRadius: 4, fontSize: 14, outline: "none" }} />
                  <input placeholder="Ulangi password baru" type="password" value={forgotNewPass.confirm}
                    onChange={e => { setForgotNewPass(p => ({ ...p, confirm: e.target.value })); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep4()}
                    style={{ padding: "12px 14px", border: "1px solid #d0e4ee", borderRadius: 4, fontSize: 14, outline: "none" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep4}
                    style={{ padding: "13px", background: "#27ae60", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>
                    Simpan Password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════ ADMIN PANEL ══════ */}
      {showAdmin && user && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1500, background: "#f4f9fb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Admin Nav */}
          <div style={{ background: "#2d2d2d", color: "#fff", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Hamburger – mobile only */}
              <button className="admin-hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle menu">
                {sidebarOpen ? "✕" : "☰"}
              </button>
              <span className="serif" style={{ fontSize: 18, fontWeight: 600 }}><LogoDisplay content={data.content} size="admin" /></span>
              <span style={{ fontSize: 11, background: "rgba(255,255,255,.15)", padding: "3px 10px", borderRadius: 12, letterSpacing: ".5px" }}>
                {ROLES[user.role]?.label}
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }} className="hide-sm">{user.username}</span>
              <button onClick={() => setShowAdmin(false)} style={{ padding: "6px 14px", border: "1px solid rgba(255,255,255,.3)", borderRadius: 4, color: "rgba(255,255,255,.8)", fontSize: 12, background: "none" }}>← Website</button>
            </div>
          </div>

          {/* Sidebar overlay – mobile tap to close */}
          <div className={`sidebar-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

          <div className="admin-body">
            {/* Sidebar */}
            <div className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
              <div style={{ padding: "24px 0", flex: 1 }}>
              {[
                { id: "dashboard", icon: "◈", label: "Dashboard", access: true },
                { id: "profile", icon: "👤", label: "Profil Saya", access: true },
                { id: "cms", icon: "✎", label: "Posts / CMS", access: canEdit },
                { id: "images", icon: "🖼", label: "Images", access: canEdit },
                { id: "about", icon: "🏢", label: "About Us", access: isAdmin },
                { id: "team", icon: "👥", label: "Susunan Tim", access: isAdmin },
                { id: "services", icon: "🛎", label: "Layanan / Paket", access: isAdmin },
                { id: "content", icon: "🔤", label: "Site Content", access: isAdmin },
                { id: "reviews", icon: "⭐", label: "Ulasan", access: isAdmin },
                { id: "messages", icon: "✉", label: "Messages", access: canCS },
                { id: "users", icon: "◎", label: "Users", access: isAdmin },
                { id: "settings", icon: "⚙", label: "Settings", access: isAdmin },
              ].filter(t => t.access).map(tab => (
                <button key={tab.id} onClick={() => { setAdminTab(tab.id); setCmsEditPost(null); setSidebarOpen(false); }} style={{
                  width: "100%", padding: "12px 24px", textAlign: "left", background: adminTab === tab.id ? "rgba(61,143,171,.25)" : "none",
                  color: adminTab === tab.id ? "#7dc8de" : "rgba(255,255,255,.6)", fontSize: 13,
                  borderLeft: adminTab === tab.id ? "3px solid #3d8fab" : "3px solid transparent",
                  transition: "all .15s", display: "flex", alignItems: "center", gap: 10, border: "none",
                }}>
                  <span style={{ fontSize: 14 }}>{tab.icon}</span> {tab.label}
                  {tab.id === "messages" && data.messages.filter(m => !m.read).length > 0 && (
                    <span style={{ marginLeft: "auto", background: "#e74c3c", borderRadius: 10, padding: "1px 7px", fontSize: 10, color: "#fff" }}>
                      {data.messages.filter(m => !m.read).length}
                    </span>
                  )}
                  {tab.id === "cms" && draftCount > 0 && (
                    <span style={{ marginLeft: "auto", background: "#f39c12", borderRadius: 10, padding: "1px 7px", fontSize: 10, color: "#fff" }}>{draftCount}</span>
                  )}
                </button>
              ))}
              </div>

              {/* Bottom: Power + Copyright */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", padding: "16px 20px" }}>
                <button onClick={logout}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
                    background: "rgba(231,76,60,.12)", border: "1px solid rgba(231,76,60,.25)", borderRadius: 8,
                    color: "rgba(231,76,60,.85)", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 10,
                    transition: "all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(231,76,60,.22)"; e.currentTarget.style.borderColor = "rgba(231,76,60,.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(231,76,60,.12)"; e.currentTarget.style.borderColor = "rgba(231,76,60,.25)"; }}>
                  {/* Power icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64"/><line x1="12" y1="2" x2="12" y2="12"/>
                  </svg>
                  Keluar / Logout
                </button>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.25)", textAlign: "center", letterSpacing: ".3px" }}>
                  © 2026 Arutala
                </div>
              </div>
            </div>

            {/* Main Panel */}
            <div className="admin-main">

              {/* DASHBOARD */}
              {adminTab === "dashboard" && (
                <div className="fade-in">
                  {/* Profile Header Card */}
                  <div style={{ background: "#fff", borderRadius: 12, padding: "28px 32px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", marginBottom: 20 }} className="dash-profile-header">
                    {/* Avatar */}
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#2d2d2d,#2b7a9a)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 700, fontFamily: "'Playfair Display',serif", border: "3px solid #ddeef5", overflow: "hidden", cursor: "pointer" }}
                      onClick={() => setAdminTab("profile")} title="Edit Profil">
                      {user.photo
                        ? <img src={user.photo} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : (user.name || user.username).charAt(0).toUpperCase()}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: "0.75rem", color: "#6b8999", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>
                        {ROLES[user.role]?.label}
                      </div>
                      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.75rem", fontWeight: 900, color: "#2d2d2d", marginBottom: 8, lineHeight: 1.1 }}>
                        {user.name || user.username}
                      </h2>
                      <div style={{ display: "flex", gap: 20, marginBottom: 14, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.8125rem", color: "#6b8999", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>📝</span> Published: <strong style={{ color: "#2d2d2d" }}>{publishedCount}</strong>
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "#6b8999", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>👁</span> Drafts: <strong style={{ color: "#2d2d2d" }}>{draftCount}</strong>
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "#6b8999", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>✉</span> Msgs: <strong style={{ color: "#2d2d2d" }}>{data.messages.length}</strong>
                        </span>
                      </div>
                      <p style={{ fontSize: "0.875rem", color: "#4e6b80", fontStyle: "italic", lineHeight: 1.7, maxWidth: 500, borderLeft: "3px solid #ddeef5", paddingLeft: 14 }}>
                        {user.desc ||
                          (user.role === "admin"
                            ? "Administrator Arutala Organizer. Kelola konten, pengguna, pesan, dan seluruh pengaturan website."
                            : user.role === "content_writer"
                            ? "Content writer Arutala Organizer. Buat dan kelola artikel, destinasi, dan konten event."
                            : "Customer Service Arutala Organizer. Tangani pesan dan pertanyaan dari pengunjung website.")}
                      </p>
                    </div>
                    {/* Action Buttons */}
                    <div className="dash-action-btns">
                      {canEdit && (
                        <button onClick={() => { setAdminTab("cms"); setCmsEditPost("new"); }}
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "#2d2d2d", color: "#fff", borderRadius: 24, fontSize: "0.8125rem", fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: ".03em", transition: "background .2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#2b7a9a"}
                          onMouseLeave={e => e.currentTarget.style.background = "#2d2d2d"}>
                          ✏ Buat Artikel
                        </button>
                      )}
                      <button onClick={() => setAdminTab("messages")}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "transparent", color: "#2d2d2d", borderRadius: 24, fontSize: "0.8125rem", fontWeight: 700, border: "2px solid #ddeef5", cursor: "pointer", letterSpacing: ".03em", transition: "all .2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d2d2d"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddeef5"; }}>
                        🔔 Pesan Masuk {data.messages.filter(m => !m.read).length > 0 && <span style={{ background: "#e74c3c", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: "0.6875rem", fontWeight: 700 }}>{data.messages.filter(m => !m.read).length}</span>}
                      </button>
                    </div>
                  </div>

                  {/* Tabs row */}
                  <DashTabs
                    user={user}
                    allPosts={allPosts}
                    publishedCount={publishedCount}
                    draftCount={draftCount}
                    data={data}
                    canEdit={canEdit}
                    canCS={canCS}
                    isAdmin={isAdmin}
                    setAdminTab={setAdminTab}
                    setCmsEditPost={setCmsEditPost}
                    SECTION_LABELS={SECTION_LABELS}
                    SECTIONS={SECTIONS}
                    formatDate={formatDate}
                  />
                </div>
              )}

              {/* PROFILE */}
              {adminTab === "profile" && (
                <div className="fade-in">
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d", marginBottom: 28 }}>Profil Saya</h1>
                  <div className="profile-grid">
                    {/* Photo Card */}
                    <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", textAlign: "center" }}>
                      <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,#2d2d2d,#2b7a9a)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff", fontWeight: 700, overflow: "hidden", border: "3px solid #ddeef5" }}>
                        {user.photo
                          ? <img src={user.photo} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : (user.name || user.username).charAt(0).toUpperCase()}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d", marginBottom: 2 }}>{user.name || user.username}</p>
                      <p style={{ fontSize: 11, color: "#7a9db0", marginBottom: 20, background: "#f4f9fb", display: "inline-block", padding: "3px 10px", borderRadius: 10 }}>{ROLES[user.role]?.label}</p>
                      {/* Upload Photo */}
                      <div style={{ marginTop: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Upload Foto Profil</label>
                        <input type="file" accept="image/*" onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            notify("⏳ Mengupload foto profil...");
                            const photo = await uploadToCloudinary(file);
                            const updated = { ...user, photo };
                            setUser(updated);
                            try { const prev = await fsGet(`profile-${user.username}`) || {}; await fsSet(`profile-${user.username}`, { ...prev, name: updated.name, phone: updated.phone, email: updated.email, desc: updated.desc, photo }); } catch {}
                            notify("Foto profil diperbarui!");
                          } catch {
                            notify("Gagal upload foto. Coba lagi.", "error");
                          }
                        }} style={{ fontSize: 11, border: "1.5px dashed #3d8fab", borderRadius: 6, padding: "6px", background: "#f0f9fc", color: "#3d8fab", width: "100%", boxSizing: "border-box" }} />
                        {user.photo && (
                          <button onClick={async () => {
                            const updated = { ...user, photo: "" };
                            setUser(updated);
                            try { const prev = await fsGet(`profile-${user.username}`) || {}; await fsSet(`profile-${user.username}`, { ...prev, photo: "" }); } catch {}
                            notify("Foto profil dihapus.");
                          }} style={{ marginTop: 8, fontSize: 11, padding: "4px 12px", background: "#fee", color: "#e74c3c", borderRadius: 6, border: "none", cursor: "pointer" }}>Hapus Foto</button>
                        )}
                      </div>
                    </div>

                    {/* Edit Form */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {/* Data Diri */}
                      <div style={{ background: "#fff", borderRadius: 12, padding: "28px 28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", borderTop: "4px solid #3d8fab" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#2d2d2d", marginBottom: 20 }}>✏ Edit Data Diri</h3>
                        {[
                          { label: "Nama Lengkap", key: "name", placeholder: "Masukkan nama lengkap", type: "text" },
                          { label: "Nomor HP / WhatsApp", key: "phone", placeholder: "08xxxxxxxxxx", type: "tel" },
                          { label: "Email", key: "email", placeholder: "nama@email.com", type: "email" },
                        ].map(f => (
                          <div key={f.key} style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
                            <input type={f.type} placeholder={f.placeholder}
                              value={profileEdit[f.key] !== undefined && profileEditMode ? profileEdit[f.key] : (user[f.key] || "")}
                              onChange={e => setProfileEdit(p => ({ ...p, [f.key]: e.target.value }))}
                              onFocus={() => { if (!profileEditMode) { setProfileEditMode(true); setProfileEdit({ name: user.name || "", phone: user.phone || "", email: user.email || "", desc: user.desc || "", newPass: "", confirmPass: "" }); } }}
                              style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                          </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Deskripsi Diri</label>
                          <textarea placeholder="Tuliskan deskripsi singkat tentang diri Anda..."
                            value={profileEditMode ? profileEdit.desc : (user.desc || "")}
                            onChange={e => setProfileEdit(p => ({ ...p, desc: e.target.value }))}
                            onFocus={() => { if (!profileEditMode) { setProfileEditMode(true); setProfileEdit({ name: user.name || "", phone: user.phone || "", email: user.email || "", desc: user.desc || "", newPass: "", confirmPass: "" }); } }}
                            rows={3}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                        </div>
                        {profileEditMode && (
                          <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={async () => {
                              const updated = { ...user, name: profileEdit.name, phone: profileEdit.phone, email: profileEdit.email, desc: profileEdit.desc };
                              setUser(updated);
                              try { const prev = await fsGet(`profile-${user.username}`) || {}; await fsSet(`profile-${user.username}`, { ...prev, name: profileEdit.name, phone: profileEdit.phone, email: profileEdit.email, desc: profileEdit.desc, photo: user.photo || "" }); } catch {}
                              setProfileEditMode(false);
                              notify("Data diri berhasil disimpan!");
                            }} style={{ padding: "10px 24px", background: "#2d2d2d", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Simpan Perubahan</button>
                            <button onClick={() => setProfileEditMode(false)}
                              style={{ padding: "10px 20px", background: "#f4f9fb", color: "#4a6680", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Batal</button>
                          </div>
                        )}
                      </div>

                      {/* Ganti Sandi */}
                      <div style={{ background: "#fff", borderRadius: 12, padding: "28px 28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", borderTop: "4px solid #e74c3c" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#2d2d2d", marginBottom: 4 }}>🔒 Ganti Password</h3>
                        <p style={{ fontSize: 12, color: "#7a9db0", marginBottom: 20, lineHeight: 1.6 }}>Masukkan password lama untuk verifikasi, lalu isi password baru.</p>
                        <div style={{ marginBottom: 14 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password Lama</label>
                          <input type="password" placeholder="Masukkan password saat ini"
                            value={profileEdit.oldPass}
                            onChange={e => setProfileEdit(p => ({ ...p, oldPass: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password Baru</label>
                          <input type="password" placeholder="Minimal 6 karakter"
                            value={profileEdit.newPass}
                            onChange={e => setProfileEdit(p => ({ ...p, newPass: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Konfirmasi Password</label>
                          <input type="password" placeholder="Ulangi password baru"
                            value={profileEdit.confirmPass}
                            onChange={e => setProfileEdit(p => ({ ...p, confirmPass: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                        </div>
                        <button onClick={async () => {
                          if (!profileEdit.oldPass) return notify("Masukkan password lama terlebih dahulu.", "error");
                          // Verify old password
                          let currentPass = HARDCODED_USERS.find(x => x.username === user.username)?.password || "";
                          try {
                            const r = await fsGet(`profile-${user.username}`);
                            if (r?._password) currentPass = r._password;
                          } catch {}
                          if (profileEdit.oldPass !== currentPass) return notify("Password lama tidak sesuai.", "error");
                          if (profileEdit.newPass.length < 6) return notify("Password baru minimal 6 karakter.", "error");
                          if (profileEdit.newPass !== profileEdit.confirmPass) return notify("Konfirmasi password tidak cocok.", "error");
                          try {
                            const prev = await fsGet(`profile-${user.username}`) || {};
                            await fsSet(`profile-${user.username}`, { ...prev, _password: profileEdit.newPass });
                          } catch {}
                          setProfileEdit(p => ({ ...p, oldPass: "", newPass: "", confirmPass: "" }));
                          notify("Password berhasil diubah!");
                        }} style={{ padding: "10px 24px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Ubah Password</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CMS / POSTS */}
              {adminTab === "cms" && canEdit && (
                <div className="fade-in">
                  {cmsEditPost ? (
                    <CMSEditor
                      post={cmsEditPost === "new" ? null : cmsEditPost}
                      section={adminSection}
                      onSave={savePost}
                      onCancel={() => setCmsEditPost(null)}
                      onSectionChange={(s) => setAdminSection(s)}
                      user={user}
                    />
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d" }}>Posts & CMS</h1>
                        <button onClick={() => setCmsEditPost("new")} style={{
                          padding: "9px 22px", background: "#27ae60", color: "#fff",
                          borderRadius: 6, fontSize: 13, border: "none", fontWeight: 500
                        }}>+ New Post</button>
                      </div>

                      {/* Section tabs */}
                      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                        {SECTIONS.map(s => {
                          const count = (data.posts?.[s] || []).length;
                          return (
                            <button key={s} onClick={() => setAdminSection(s)} style={{
                              padding: "8px 20px", fontSize: 13, borderRadius: 6,
                              border: adminSection === s ? "none" : "1px solid #d0e4ee",
                              background: adminSection === s ? "#2d2d2d" : "#fff",
                              color: adminSection === s ? "#fff" : "#4a6680", fontWeight: adminSection === s ? 500 : 400,
                              transition: "all .15s"
                            }}>{SECTION_LABELS[s]} <span style={{ opacity: .6 }}>({count})</span></button>
                          );
                        })}
                      </div>

                      {/* Post list */}
                      <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ background: "#f4f9fb" }}>
                              {["Title", "Category", "Author", "Date", "Status", "Actions"].map(h => (
                                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11,
                                  fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase",
                                  borderBottom: "1px solid #e8f2f8" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(data.posts?.[adminSection] || []).length === 0 ? (
                              <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#7a9db0", fontSize: 14 }}>
                                No posts yet. <button onClick={() => setCmsEditPost("new")} style={{ color: "#3d8fab", border: "none", background: "none", cursor: "pointer" }}>Create the first one →</button>
                              </td></tr>
                            ) : (data.posts?.[adminSection] || []).map(post => (
                              <tr key={post.id} style={{ borderBottom: "1px solid #eef4f8" }}>
                                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: "#2d2d2d", maxWidth: 240 }}>
                                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</div>
                                </td>
                                <td style={{ padding: "14px 16px", fontSize: 12, color: "#7a9db0" }}>{post.category || "—"}</td>
                                <td style={{ padding: "14px 16px", fontSize: 12, color: "#7a9db0" }}>{post.author}</td>
                                <td style={{ padding: "14px 16px", fontSize: 12, color: "#7a9db0" }}>{formatDate(post.date)}</td>
                                <td style={{ padding: "14px 16px" }}>
                                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10,
                                    background: post.status === "published" ? "#eeffee" : "#fff9ee",
                                    color: post.status === "published" ? "#27ae60" : "#f39c12", fontWeight: 500 }}>
                                    {post.status === "published" ? "Published" : "Draft"}
                                  </span>
                                </td>
                                <td style={{ padding: "14px 16px", display: "flex", gap: 6 }}>
                                  <button onClick={() => setCmsEditPost(post)} style={{
                                    fontSize: 12, padding: "5px 12px", borderRadius: 6,
                                    border: "1px solid #d0e4ee", background: "#f4f9fb", color: "#3d8fab" }}>Edit</button>
                                  <button onClick={() => {
                                    const np = { ...post, status: post.status === "published" ? "draft" : "published" };
                                    savePost(np);
                                  }} style={{
                                    fontSize: 12, padding: "5px 12px", borderRadius: 6,
                                    border: "none", background: post.status === "published" ? "#fff9ee" : "#eeffee",
                                    color: post.status === "published" ? "#f39c12" : "#27ae60" }}>
                                    {post.status === "published" ? "Unpublish" : "Publish"}
                                  </button>
                                  <button onClick={() => window.confirm("Delete this post?") && deletePost(adminSection, post.id)} style={{
                                    fontSize: 12, padding: "5px 12px", borderRadius: 6,
                                    border: "none", background: "#fee", color: "#e74c3c" }}>Del</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* IMAGES */}
              {adminTab === "images" && canEdit && (
                <div className="fade-in">
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d", marginBottom: 8 }}>Image Management</h1>
                  <p style={{ fontSize: 13, color: "#7a9db0", marginBottom: 8 }}>Update images via Cloudinary URL or direct URL</p>
                  <div style={{ fontSize: 12, background: "#e8f4fd", border: "1px solid #b8d4e3", borderRadius: 6, padding: "10px 14px", marginBottom: 28, color: "#3d8fab" }}>
                    💡 Upload to Cloudinary first, then paste the delivery URL here.
                  </div>
                  {editImg.group !== null && (
                    <div style={{ background: "#fff", borderRadius: 8, padding: "20px", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,.08)" }}>
                      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Update {editImg.group}[{editImg.idx}]</h3>
                      <div style={{ display: "flex", gap: 10 }}>
                        <input value={editImg.url} onChange={e => setEditImg(p => ({ ...p, url: e.target.value }))}
                          placeholder="https://..."
                          style={{ flex: 1, padding: "10px 14px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none" }} />
                        <button onClick={updateImg} style={{ padding: "10px 20px", background: "#27ae60", color: "#fff", borderRadius: 6, fontSize: 13, border: "none" }}>Update</button>
                        <button onClick={() => setEditImg({ group: null, idx: null, url: "" })}
                          style={{ padding: "10px 20px", background: "#eee", borderRadius: 6, fontSize: 13, border: "none" }}>Cancel</button>
                      </div>
                      {editImg.url && <img src={editImg.url} alt="" style={{ width: 200, height: 130, objectFit: "cover", borderRadius: 6, marginTop: 12 }} />}
                    </div>
                  )}
                  {[
                    { key: "hero", label: "Hero Images" },
                    { key: "adv", label: "Adventure Images" },
                    { key: "gal", label: "Gallery Images" },
                  ].map(group => (
                    <div key={group.key} style={{ background: "#fff", borderRadius: 8, padding: "20px 24px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 500, color: "#2d2d2d", marginBottom: 16 }}>{group.label}</h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {data.images[group.key].map((src, i) => (
                          <div key={i} style={{ position: "relative", width: 140 }}>
                            <img src={src} alt="" style={{ width: 140, height: 95, objectFit: "cover", borderRadius: 6, display: "block" }} />
                            <button onClick={() => setEditImg({ group: group.key, idx: i, url: src })} style={{
                              position: "absolute", bottom: 6, right: 6, background: "rgba(30,50,72,.8)", color: "#fff",
                              border: "none", borderRadius: 4, padding: "4px 8px", fontSize: 11 }}>Edit</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ABOUT US */}
              {adminTab === "about" && isAdmin && (
                <div className="fade-in">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                    <div>
                      <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d", marginBottom: 4 }}>Setting About Us</h1>
                      <p style={{ fontSize: 12, color: "#7a9db0" }}>Kelola semua konten halaman About Us yang tampil di website.</p>
                    </div>
                    <button onClick={() => { navigateTo("about"); setShowAdmin(false); }}
                      style={{ padding: "8px 16px", background: "#f4f9fb", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 12, color: "#3d8fab", cursor: "pointer", fontWeight: 600 }}>
                      👁 Lihat Halaman →
                    </button>
                  </div>

                  {/* HERO SECTION */}
                  <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #2b7a9a" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: "#e8f4fd", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#3d8fab" }}>Hero Section</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[
                        { label: "Label Kecil (di atas judul)", key: "aboutHeroLabel", placeholder: "About Us" },
                        { label: "Judul Utama Hero", key: "aboutHeroTitle", placeholder: "We Live for Adventure" },
                        { label: "Teks Deskripsi Hero", key: "aboutHeroSub", multiline: true, placeholder: "Deskripsi singkat perusahaan..." },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
                          <CEF
                            val={getCEFVal(f.key) ?? f.placeholder}
                            multiline={f.multiline}
                            onChange={e => setEditContent(p => ({ ...p, [f.key]: e.target.value }))}
                            onSave={() => saveContent(f.key)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WHY CHOOSE US */}
                  <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #27ae60" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: "#e8f8ef", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#27ae60" }}>Why Choose Us</span>
                    </h3>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Judul Seksi</label>
                      <CEF
                        val={getCEFVal("aboutWhyTitle") ?? "Why Choose Us"}
                        onChange={e => setEditContent(p => ({ ...p, aboutWhyTitle: e.target.value }))}
                        onSave={() => saveContent("aboutWhyTitle")}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{ background: "#f8fbfc", borderRadius: 8, padding: "16px 18px", border: "1px solid #e8f2f8" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#7a9db0", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 12 }}>Keunggulan #{n}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[
                              { label: "Ikon (emoji)", key: `aboutV${n}Icon`, placeholder: ["🌍","🛡","🌱","⭐"][n-1] },
                              { label: "Judul", key: `aboutV${n}Title`, placeholder: ["Global Network","Safe & Trusted","Sustainable Travel","Award Winning"][n-1] },
                              { label: "Deskripsi", key: `aboutV${n}Desc`, multiline: true, placeholder: "Deskripsi keunggulan..." },
                            ].map(f => (
                              <div key={f.key}>
                                <label style={{ fontSize: 10, fontWeight: 700, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{f.label}</label>
                                <CEF
                                  val={getCEFVal(f.key) ?? f.placeholder}
                                  multiline={f.multiline}
                                  onChange={e => setEditContent(p => ({ ...p, [f.key]: e.target.value }))}
                                  onSave={() => saveContent(f.key)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CONTACT SECTION */}
                  <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #8e44ad" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2d", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: "#f3e8fd", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#8e44ad" }}>Seksi Kontak</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[
                        { label: "Judul Kontak", key: "aboutContactTitle", placeholder: "Get in Touch" },
                        { label: "Teks Kontak", key: "aboutContactSub", multiline: true, placeholder: "We'd love to help plan your next event." },
                        { label: "Email", key: "email", placeholder: "email@domain.com" },
                        { label: "Nomor Telepon", key: "phone", placeholder: "+62 xxx xxxx xxxx" },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
                          <CEF
                            val={getCEFVal(f.key) ?? f.placeholder}
                            multiline={f.multiline}
                            onChange={e => setEditContent(p => ({ ...p, [f.key]: e.target.value }))}
                            onSave={() => saveContent(f.key)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PREVIEW CARD */}
                  <div style={{ background: "#f4f9fb", borderRadius: 10, padding: "20px 24px", border: "1px dashed #b8d4e3" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>Preview Ringkas</p>
                    <div style={{ background: "#c5dde9", borderRadius: 8, padding: "20px 24px", marginBottom: 12 }}>
                      <div style={{ fontSize: 10, letterSpacing: "2px", color: "#2b7a9a", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{data.content.aboutHeroLabel || "About Us"}</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#2d2d2d", marginBottom: 8 }}>{data.content.aboutHeroTitle || "We Live for Adventure"}</div>
                      <div style={{ fontSize: 13, color: "#4e6b80", lineHeight: 1.7 }}>{(data.content.aboutHeroSub || data.content.aboutText || "").slice(0, 100)}{(data.content.aboutHeroSub || data.content.aboutText || "").length > 100 ? "…" : ""}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{ background: "#fff", borderRadius: 8, padding: "12px", textAlign: "center", border: "1px solid #ddeef5" }}>
                          <div style={{ fontSize: 22, marginBottom: 6 }}>{data.content[`aboutV${n}Icon`] || ["🌍","🛡","🌱","⭐"][n-1]}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#2d2d2d" }}>{data.content[`aboutV${n}Title`] || ["Global Network","Safe & Trusted","Sustainable Travel","Award Winning"][n-1]}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "#daeaf3", borderRadius: 8, padding: "14px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#2d2d2d", marginBottom: 4 }}>{data.content.aboutContactTitle || "Get in Touch"}</div>
                      <div style={{ fontSize: 12, color: "#4e6b80" }}>{data.content.aboutContactSub || "We'd love to help plan your next event."}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* SITE CONTENT */}
              {adminTab === "content" && isAdmin && (
                <div className="fade-in">
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d", marginBottom: 6 }}>Site Content</h1>
                  <p style={{ fontSize: 13, color: "#7a9db0", marginBottom: 28 }}>Edit all text on the website</p>
                  {[
                    { label: "Logo / Brand Name", key: "logoText" },
                    { label: "Logo Image URL (kosongkan untuk teks)", key: "logoImage" },
                    { label: "Hero Title", key: "heroTitle" },
                    { label: "Hero Subtitle", key: "heroSub", multiline: true },
                    { label: "Adventure Title", key: "advTitle" },
                    { label: "Adventure Quote", key: "advQuote", multiline: true },
                    { label: "New Adventures Title", key: "newAdvTitle" },
                    { label: "Book Section Title", key: "bookTitle" },
                    { label: "Newsletter Title", key: "newsletterTitle" },
                    { label: "Deskripsi Contact Us", key: "contactText", multiline: true },
                    { label: "About Text", key: "aboutText", multiline: true },
                    { label: "📧 Email", key: "email" },
                    { label: "📞 Nomor HP / WhatsApp", key: "phone" },
                    { label: "📍 Alamat", key: "address", multiline: true },
                    { label: "🕐 Jam Operasional", key: "hours" },
                    { label: "💬 Link WhatsApp (https://wa.me/628xxx)", key: "waLink" },
                    { label: "📸 Link Instagram (https://instagram.com/xxx)", key: "igLink" },
                    { label: "📘 Link Facebook (https://facebook.com/xxx)", key: "fbLink" },
                    { label: "Login Button Text", key: "loginBtnText" },
                    { label: "Nav: Home", key: "nav1" },
                    { label: "Nav: About", key: "nav2" },
                    { label: "Nav: News", key: "nav3" },
                    { label: "Nav: Shop", key: "nav4" },
                    { label: "Nav: Destinations", key: "nav5" },
                    { label: "Nav: Layanan Kami", key: "nav6" },
                    { label: "Layanan — Judul Halaman", key: "servicesPageTitle" },
                    { label: "Layanan — Subjudul Halaman", key: "servicesPageSub", multiline: true },
                  ].map(f => (
                    <div key={f.key} style={{ background: "#fff", borderRadius: 8, padding: "18px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>{f.label}</label>
                      <CEF
                        key={f.key}
                        val={getCEFVal(f.key)}
                        multiline={f.multiline}
                        onChange={e => setEditContent(p => ({ ...p, [f.key]: e.target.value }))}
                        onSave={() => saveContent(f.key)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* SERVICES / PAKET LAYANAN */}
              {adminTab === "services" && isAdmin && (
                <ServicesAdmin
                  data={data}
                  save={save}
                  notify={notify}
                  uploadToCloudinary={uploadToCloudinary}
                />
              )}

              {/* SUSUNAN TIM */}
              {adminTab === "team" && isAdmin && (
                <TeamAdmin data={data} save={save} notify={notify} uploadToCloudinary={uploadToCloudinary} />
              )}

              {/* MESSAGES */}
              {adminTab === "messages" && canCS && (
                <div className="fade-in">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d" }}>Pesan Masuk</h1>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#7a9db0" }}>Total: {data.messages.length} pesan</span>
                      {data.messages.filter(m => !m.read).length > 0 && (
                        <span style={{ fontSize: 11, background: "#e74c3c", color: "#fff", borderRadius: 10, padding: "3px 10px", fontWeight: 600 }}>
                          {data.messages.filter(m => !m.read).length} belum dibaca
                        </span>
                      )}
                      {data.messages.some(m => !m.read) && (
                        <button onClick={() => {
                          const msgs = data.messages.map(m => ({ ...m, read: true }));
                          save({ ...data, messages: msgs }); notify("Semua pesan ditandai sudah dibaca.");
                        }} style={{ fontSize: 11, padding: "5px 12px", background: "#f4f9fb", border: "1px solid #d0e4ee", borderRadius: 6, color: "#4a6680", cursor: "pointer" }}>
                          Tandai Semua Dibaca
                        </button>
                      )}
                    </div>
                  </div>

                  {data.messages.length === 0
                    ? <div style={{ textAlign: "center", padding: "60px", color: "#7a9db0", background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
                        <p style={{ fontSize: 14 }}>Belum ada pesan masuk.</p>
                      </div>
                    : [...data.messages].reverse().map(m => (
                      <div key={m.id} style={{ background: "#fff", borderRadius: 10, marginBottom: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderLeft: m.read ? "3px solid #ddeef5" : "3px solid #e74c3c",
                        overflow: "hidden", opacity: m.deleted ? 0.5 : 1 }}>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 20px 12px", borderBottom: "1px solid #f4f9fb" }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#2d2d2d,#2b7a9a)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                              {m.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: "#2d2d2d", lineHeight: 1.3 }}>
                                {m.name}
                                {!m.read && <span style={{ marginLeft: 8, fontSize: 9, background: "#e74c3c", color: "#fff", borderRadius: 8, padding: "2px 7px", fontWeight: 700, letterSpacing: ".5px" }}>BARU</span>}
                              </div>
                              <div style={{ fontSize: 12, color: "#7a9db0", marginTop: 2 }}>{m.email}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: "#b8d4e3" }}>{m.date}</span>
                            {/* READ button */}
                            <button onClick={() => {
                              const msgs = data.messages.map(x => x.id === m.id ? { ...x, read: !x.read } : x);
                              save({ ...data, messages: msgs });
                            }} title={m.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                              style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "1px solid #d0e4ee",
                                background: m.read ? "#f4f9fb" : "#e8f8ef", color: m.read ? "#7a9db0" : "#27ae60", cursor: "pointer", fontWeight: 600 }}>
                              {m.read ? "✓ Dibaca" : "Tandai Dibaca"}
                            </button>
                            {/* REPLY button */}
                            <button onClick={() => setReplyTo(replyTo === m.id ? null : m.id)}
                              style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "1px solid #b8d4e3",
                                background: replyTo === m.id ? "#e8f4fd" : "none", color: "#3d8fab", cursor: "pointer", fontWeight: 600 }}>
                              ↩ Reply
                            </button>
                            {/* DELETE button */}
                            <button onClick={() => {
                              if (window.confirm(`Hapus pesan dari ${m.name}? Pesan tidak dapat dikembalikan.`)) {
                                const msgs = data.messages.filter(x => x.id !== m.id);
                                save({ ...data, messages: msgs }); notify("Pesan dihapus.");
                              }
                            }} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "1px solid #f5c6c6",
                              background: "#fff", color: "#e74c3c", cursor: "pointer", fontWeight: 600 }}>
                              🗑 Hapus
                            </button>
                          </div>
                        </div>
                        {/* Body */}
                        <div style={{ padding: "14px 20px 16px" }}>
                          <p style={{ fontSize: 14, color: "#334f65", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.message}</p>
                          {/* Reply history */}
                          {m.replies?.length > 0 && (
                            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase" }}>Riwayat Balasan</div>
                              {m.replies.map((r, i) => (
                                <div key={i} style={{ background: "#f4f9fb", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#3a5066", borderLeft: "2px solid #3d8fab" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <strong style={{ color: "#3d8fab", fontSize: 12 }}>↩ {r.author}</strong>
                                    <span style={{ fontSize: 11, color: "#b8d4e3" }}>{r.date}</span>
                                  </div>
                                  {r.text}
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Reply input */}
                          {replyTo === m.id && (
                            <div style={{ marginTop: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
                              <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                                placeholder="Tulis balasan..."
                                rows={3}
                                style={{ flex: 1, padding: "10px 12px", border: "1.5px solid #3d8fab", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical" }} />
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <button onClick={() => replyMsg(m.id)}
                                  style={{ padding: "9px 18px", background: "#27ae60", color: "#fff", borderRadius: 6, fontSize: 12, border: "none", fontWeight: 600, cursor: "pointer" }}>Kirim</button>
                                <button onClick={() => { setReplyTo(null); setReplyText(""); }}
                                  style={{ padding: "9px 14px", background: "#f4f9fb", borderRadius: 6, fontSize: 12, border: "1px solid #d0e4ee", cursor: "pointer" }}>Batal</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* USERS */}
              {adminTab === "users" && isAdmin && (
                <div className="fade-in">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d" }}>User Management</h1>
                    <button onClick={() => setUserMgmtOpen(v => !v)}
                      style={{ padding: "9px 20px", background: userMgmtOpen ? "#f4f9fb" : "#2d2d2d", color: userMgmtOpen ? "#4a6680" : "#fff",
                        border: userMgmtOpen ? "1px solid #d0e4ee" : "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      {userMgmtOpen ? "✕ Batal" : "+ Tambah User"}
                    </button>
                  </div>

                  {/* Add User Form */}
                  {userMgmtOpen && (
                    <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 24, boxShadow: "0 2px 10px rgba(0,0,0,.07)", borderTop: "4px solid #27ae60" }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#2d2d2d", marginBottom: 18 }}>➕ Tambah Akun Baru</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {[
                          { label: "Nama Lengkap", key: "name", placeholder: "Nama lengkap", type: "text" },
                          { label: "Username", key: "username", placeholder: "username (tanpa spasi)", type: "text" },
                          { label: "Password", key: "password", placeholder: "Min. 6 karakter", type: "password" },
                          { label: "Email", key: "email", placeholder: "email@domain.com", type: "email" },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={{ fontSize: 10, fontWeight: 700, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 5 }}>{f.label}</label>
                            <input type={f.type} placeholder={f.placeholder} value={userMgmtForm[f.key]}
                              onChange={e => setUserMgmtForm(p => ({ ...p, [f.key]: e.target.value }))}
                              style={{ width: "100%", padding: "9px 11px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                          </div>
                        ))}
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 700, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Role</label>
                          <select value={userMgmtForm.role} onChange={e => setUserMgmtForm(p => ({ ...p, role: e.target.value }))}
                            style={{ width: "100%", padding: "9px 11px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", background: "#fff" }}>
                            {Object.entries(ROLES).map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                        <button onClick={() => {
                          const { username, password, role, email, name } = userMgmtForm;
                          if (!username.trim() || !password.trim()) return notify("Username dan password wajib diisi.", "error");
                          if (password.length < 6) return notify("Password minimal 6 karakter.", "error");
                          if (data.users.find(u => u.username === username.trim())) return notify("Username sudah digunakan.", "error");
                          const newUser = { id: Date.now(), username: username.trim(), password, role, email, name: name || username, active: true };
                          save({ ...data, users: [...data.users, newUser] });
                          setUserMgmtForm({ username: "", password: "", role: "content_writer", email: "", name: "" });
                          setUserMgmtOpen(false);
                          notify(`User "${username}" berhasil ditambahkan.`);
                        }} style={{ padding: "10px 24px", background: "#27ae60", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          Simpan User
                        </button>
                        <button onClick={() => { setUserMgmtOpen(false); setUserMgmtForm({ username: "", password: "", role: "content_writer", email: "", name: "" }); }}
                          style={{ padding: "10px 18px", background: "#f4f9fb", color: "#4a6680", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
                          Batal
                        </button>
                      </div>
                    </div>
                  )}

                  {/* User Table */}
                  <div className="table-wrap" style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                      <thead>
                        <tr style={{ background: "#f4f9fb" }}>
                          {["#", "Nama / Username", "Role", "Email", "Status", "Aksi"].map(h => (
                            <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #e8f2f8" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.users.map((u, idx) => (
                          <tr key={u.id} style={{ borderBottom: "1px solid #eef4f8", background: idx % 2 === 0 ? "#fff" : "#fafcfd" }}>
                            <td style={{ padding: "13px 16px", fontSize: 12, color: "#b8d4e3" }}>{idx + 1}</td>
                            <td style={{ padding: "13px 16px" }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#2d2d2d" }}>{u.name || u.username}</div>
                              <div style={{ fontSize: 11, color: "#7a9db0", marginTop: 1 }}>@{u.username}</div>
                            </td>
                            <td style={{ padding: "13px 16px" }}>
                              {editRoleId === u.id ? (
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  <select defaultValue={u.role}
                                    id={`role-select-${u.id}`}
                                    style={{ padding: "5px 8px", border: "1px solid #d0e4ee", borderRadius: 5, fontSize: 12, outline: "none" }}>
                                    {Object.entries(ROLES).map(([k, v]) => (
                                      <option key={k} value={k}>{v.label}</option>
                                    ))}
                                  </select>
                                  <button onClick={() => {
                                    const sel = document.getElementById(`role-select-${u.id}`)?.value;
                                    if (sel) {
                                      const users = data.users.map(x => x.id === u.id ? { ...x, role: sel } : x);
                                      save({ ...data, users }); notify("Role diperbarui.");
                                    }
                                    setEditRoleId(null);
                                  }} style={{ fontSize: 11, padding: "4px 10px", background: "#27ae60", color: "#fff", borderRadius: 5, border: "none", cursor: "pointer" }}>✓</button>
                                  <button onClick={() => setEditRoleId(null)} style={{ fontSize: 11, padding: "4px 8px", background: "#f4f9fb", borderRadius: 5, border: "1px solid #d0e4ee", cursor: "pointer" }}>✕</button>
                                </div>
                              ) : (
                                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, fontWeight: 500,
                                  background: u.role === "admin" ? "#fef0f0" : u.role === "content_writer" ? "#e8f4fd" : "#e8f8ef",
                                  color: ROLES[u.role]?.color }}>
                                  {ROLES[u.role]?.label}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: "13px 16px", fontSize: 12, color: "#6b8999" }}>{u.email || "—"}</td>
                            <td style={{ padding: "13px 16px" }}>
                              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, fontWeight: 500,
                                background: u.active ? "#e8f8ef" : "#fef0f0", color: u.active ? "#27ae60" : "#e74c3c" }}>
                                {u.active ? "Aktif" : "Nonaktif"}
                              </span>
                            </td>
                            <td style={{ padding: "13px 16px" }}>
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {/* Ganti Role */}
                                {u.username !== "administrator" && editRoleId !== u.id && (
                                  <button onClick={() => setEditRoleId(u.id)}
                                    style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, background: "#e8f4fd", color: "#3d8fab", border: "none", cursor: "pointer", fontWeight: 500 }}>
                                    Ganti Role
                                  </button>
                                )}
                                {/* Toggle Aktif */}
                                {u.username !== "administrator" && (
                                  <button onClick={() => {
                                    const users = data.users.map(x => x.id === u.id ? { ...x, active: !x.active } : x);
                                    save({ ...data, users }); notify(`User ${u.active ? "dinonaktifkan" : "diaktifkan"}.`);
                                  }} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "none", cursor: "pointer", fontWeight: 500,
                                    background: u.active ? "#fff3f3" : "#e8f8ef", color: u.active ? "#e74c3c" : "#27ae60" }}>
                                    {u.active ? "Nonaktifkan" : "Aktifkan"}
                                  </button>
                                )}
                                {/* Hapus */}
                                {u.username !== "administrator" && (
                                  <button onClick={() => {
                                    if (window.confirm(`Hapus user "${u.username}"? Tindakan ini tidak dapat dibatalkan.`)) {
                                      const users = data.users.filter(x => x.id !== u.id);
                                      save({ ...data, users }); notify(`User "${u.username}" dihapus.`);
                                    }
                                  }} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, background: "#fff", border: "1px solid #f5c6c6", color: "#e74c3c", cursor: "pointer", fontWeight: 500 }}>
                                    🗑 Hapus
                                  </button>
                                )}
                                {u.username === "administrator" && (
                                  <span style={{ fontSize: 11, color: "#b8d4e3", fontStyle: "italic" }}>Protected</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {data.users.length === 0 && (
                      <div style={{ padding: "32px", textAlign: "center", color: "#7a9db0", fontSize: 13 }}>Belum ada user terdaftar.</div>
                    )}
                  </div>
                </div>
              )}

              {/* REVIEWS ADMIN */}
              {adminTab === "reviews" && isAdmin && <AdminReviews data={data} save={save} notify={notify} />}

              {/* SETTINGS */}
              {adminTab === "settings" && isAdmin && (
                <div className="fade-in">
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#2d2d2d", marginBottom: 28 }}>Settings</h1>

                  {/* Logo Upload */}
                  <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #3d8fab" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 500, color: "#2d2d2d", marginBottom: 6 }}>🖼 Logo Upload</h3>
                    <p style={{ fontSize: 12, color: "#7a9db0", marginBottom: 16, lineHeight: 1.6 }}>
                      Upload logo untuk ditampilkan di navbar, footer, admin panel, dan tab browser (favicon). Jika tidak diupload, nama brand teks akan digunakan.
                    </p>
                    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                      {data.content.logoImage && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                          <img src={data.content.logoImage} alt="Logo" style={{ height: 60, maxWidth: 180, objectFit: "contain", border: "1px solid #eef4f8", borderRadius: 6, padding: 8, background: "#f4f9fb" }} />
                          <button onClick={() => { save({ ...data, content: { ...data.content, logoImage: "" } }); notify("Logo removed."); }}
                            style={{ fontSize: 11, padding: "4px 12px", background: "#fee", color: "#e74c3c", borderRadius: 6, border: "none" }}>Remove Logo</button>
                        </div>
                      )}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 240 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase" }}>Upload File Logo</label>
                        <input type="file" accept="image/*" onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            notify("⏳ Mengupload logo...");
                            const url = await uploadToCloudinary(file);
                            save({ ...data, content: { ...data.content, logoImage: url } });
                            notify("Logo uploaded & applied to all sections!");
                          } catch {
                            notify("Gagal upload logo. Coba lagi.", "error");
                          }
                        }} style={{ padding: "8px", border: "1.5px dashed #3d8fab", borderRadius: 8, fontSize: 12, background: "#f0f9fc", color: "#3d8fab" }} />
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", marginTop: 4 }}>Atau URL Gambar</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input placeholder="https://..." defaultValue={data.content.logoImage}
                            id="logo-url-input"
                            style={{ flex: 1, padding: "8px 10px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 12, outline: "none" }} />
                          <button onClick={() => {
                            const url = document.getElementById("logo-url-input")?.value?.trim();
                            if (!url) return notify("Masukkan URL logo.", "error");
                            save({ ...data, content: { ...data.content, logoImage: url } });
                            notify("Logo URL applied!");
                          }} style={{ padding: "8px 14px", background: "#3d8fab", color: "#fff", borderRadius: 6, fontSize: 12, border: "none" }}>Apply</button>
                        </div>
                        <p style={{ fontSize: 11, color: "#7a9db0" }}>Disarankan: PNG transparan, min 200px lebar, rasio 3:1 atau 4:1</p>
                      </div>
                    </div>
                  </div>

                  {/* Founding Year */}
                  <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #c9aa71" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 500, color: "#2d2d2d", marginBottom: 6 }}>🗓 Tahun Berdiri Perusahaan</h3>
                    <p style={{ fontSize: 12, color: "#7a9db0", marginBottom: 16, lineHeight: 1.6 }}>
                      Tahun ini digunakan untuk teks "sejak [tahun]", statistik "X Tahun Pengalaman", dan label dekorasi halaman.
                    </p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        id="founding-year-input"
                        defaultValue={data.content.foundingYear || "2026"}
                        placeholder="cth: 2026"
                        maxLength={4}
                        style={{ width: 120, padding: "8px 12px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 14, outline: "none" }}
                      />
                      <button onClick={() => {
                        const yr = document.getElementById("founding-year-input")?.value?.trim();
                        if (!yr || !/^\d{4}$/.test(yr)) return notify("Masukkan tahun 4 digit (misal: 2026).", "error");
                        save({ ...data, content: { ...data.content, foundingYear: yr } });
                        notify(`✅ Tahun berdiri diperbarui ke ${yr}`);
                      }} style={{ padding: "8px 16px", background: "#2d2d2d", color: "#fff", borderRadius: 6, fontSize: 12, border: "none", fontWeight: 500 }}>
                        Simpan
                      </button>
                      <span style={{ fontSize: 12, color: "#7a9db0" }}>Saat ini: <strong style={{ color: "#2d2d2d" }}>{data.content.foundingYear || "2026"}</strong> · Pengalaman: <strong style={{ color: "#2b7a9a" }}>{new Date().getFullYear() - parseInt(data.content.foundingYear || "2026")} tahun</strong></span>
                    </div>
                  </div>

                  <div className="settings-grid">
                    {[
                      { title: "Firebase Config", desc: "Connect to Firestore for real-time data sync", btn: "Configure", color: "#f39c12" },
                      { title: "Cloudinary Config", desc: "Set up image hosting and transformation pipeline", btn: "Configure", color: "#3d8fab" },
                      { title: "Vercel Deploy", desc: "Deploy updates to production via Vercel CI/CD", btn: "Deploy", color: "#2d2d2d" },
                      { title: "SEO Settings", desc: "Manage meta tags, sitemap, and schema markup", btn: "Edit SEO", color: "#27ae60" },
                      { title: "Analytics", desc: "View traffic, user behavior and conversion data", btn: "View", color: "#8e44ad" },
                      {
                        title: "Export Data", desc: "Export site data as JSON backup", btn: "Export JSON", color: "#e74c3c",
                        action: () => {
                          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                          const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
                          a.download = "bricksy-data.json"; a.click(); notify("Data exported!");
                        }
                      },
                    ].map(s => (
                      <div key={s.title} style={{ background: "#fff", borderRadius: 8, padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: `4px solid ${s.color}` }}>
                        <h3 style={{ fontSize: 15, fontWeight: 500, color: "#2d2d2d", marginBottom: 8 }}>{s.title}</h3>
                        <p style={{ fontSize: 12, color: "#7a9db0", lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
                        <button onClick={s.action || (() => notify(`${s.title} — Configure in your deployment environment.`, "success"))}
                          style={{ padding: "8px 18px", background: s.color, color: "#fff", borderRadius: 6, fontSize: 12, border: "none" }}>{s.btn}</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#fff3cd", borderRadius: 8, padding: "16px 20px", marginTop: 20, border: "1px solid #ffc107" }}>
                    <h4 style={{ fontSize: 13, color: "#856404", marginBottom: 6 }}>⚠ Reset Site Data</h4>
                    <p style={{ fontSize: 12, color: "#856404", marginBottom: 12 }}>This will reset all content, images, and posts to defaults.</p>
                    <button onClick={async () => {
                      if (window.confirm("Reset all data to defaults?")) {
                        await save(DEFAULT_DATA);
                        setEditContent({});
                        notify("Data reset to defaults.");
                      }
                    }} style={{ padding: "8px 18px", background: "#e74c3c", color: "#fff", borderRadius: 6, fontSize: 12, border: "none" }}>
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
