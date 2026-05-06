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
                  color: dashTab === t.id ? "#1a2e42" : "#6b8999", background: dashTab === t.id ? "#fff" : "#fafcfd",
                  border: "none", borderBottom: dashTab === t.id ? "2px solid #1a2e42" : "2px solid transparent",
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
                    <p style={{ fontSize: "0.875rem", color: "#1a2e42", lineHeight: 1.6, marginBottom: 4 }}>
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
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a2e42" }}>Artikel Terbaru</span>
                <button onClick={() => { setAdminTab("cms"); setCmsEditPost("new"); }}
                  style={{ fontSize: "0.75rem", background: "#1a2e42", color: "#fff", border: "none", borderRadius: 16, padding: "5px 14px", fontWeight: 600, cursor: "pointer" }}>+ Baru</button>
              </div>
              {allPosts.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#6b8999" }}>Belum ada artikel.</p>
              ) : allPosts.slice(-5).reverse().map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f4f9fb" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                    <img src={p.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a2e42", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
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
                        <span style={{ fontSize: "0.8125rem", color: "#1a2e42", fontWeight: 600 }}>{SECTION_LABELS[s]}</span>
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
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1a2e42", marginBottom: 6 }}>❓ {faq.q}</p>
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
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.125rem", fontWeight: 800, color: "#1a2e42" }}>Top Kontributor</span>
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
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1a2e42,#2b7a9a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1a2e42" }}>{author}</div>
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
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1a2e42" }}>You ({user.username})</div>
                <div style={{ fontSize: "0.75rem", color: "#6b8999" }}>Artikel: {allPosts.filter(p => p.author === user.username && p.status === "published").length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Akses Cepat */}
        <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f4f9fb" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.125rem", fontWeight: 800, color: "#1a2e42" }}>Akses Cepat</span>
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
                style={{ textAlign: "left", padding: "9px 12px", background: "#f4f9fb", border: "none", borderRadius: 7, fontSize: "0.8125rem", color: "#1a2e42", fontWeight: 500, cursor: "pointer", transition: "background .15s" }}
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
      coverImage: "https://picsum.photos/seed/news1/800/500",
      excerpt: "Relax and rejuvenate at world-class spas along pristine coastlines.",
      content: [
        { type: "paragraph", value: "Bali has long been a haven for those seeking peace and wellness. The island's lush landscape, spiritual ambiance, and world-class hospitality make it one of the top spa destinations in the world." },
        { type: "paragraph", value: "From volcanic stone massages to traditional Balinese healing rituals, each treatment is carefully crafted to restore body and soul." },
        { type: "image", value: "https://picsum.photos/seed/news1b/800/450", caption: "Serene poolside at a Bali resort" },
        { type: "paragraph", value: "Whether you choose a clifftop retreat in Uluwatu or a rainforest sanctuary in Ubud, Bali delivers a spa experience unlike anywhere else on earth." },
      ],
      tags: ["spa", "bali", "wellness"],
    },
    {
      id: 2, section: "news", status: "published",
      title: "Beach Time: Discovering Hidden Coves",
      date: "2026-04-10", author: "writer1", category: "Beach",
      coverImage: "https://picsum.photos/seed/news2/800/500",
      excerpt: "Discover breathtaking beaches and hidden coves across the globe.",
      content: [
        { type: "paragraph", value: "The world's most stunning beaches are often the ones hardest to reach. Hidden behind jungle trails or accessible only by boat, these secret coves reward the adventurous traveler." },
        { type: "paragraph", value: "From the pink sand beaches of the Bahamas to the glittering black shores of Iceland, every coastline tells a story millions of years in the making." },
        { type: "image", value: "https://picsum.photos/seed/news2b/800/450", caption: "Crystal clear waters of a hidden cove" },
      ],
      tags: ["beach", "travel", "adventure"],
    },
    {
      id: 3, section: "news", status: "published",
      title: "Happy Times: Creating Unforgettable Memories",
      date: "2026-04-15", author: "writer1", category: "Experience",
      coverImage: "https://picsum.photos/seed/news3/800/500",
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
      coverImage: "https://picsum.photos/seed/shop1/800/500",
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
      coverImage: "https://picsum.photos/seed/shop2/800/500",
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
      coverImage: "https://picsum.photos/seed/dest1/800/500",
      excerpt: "Home to the legendary Komodo dragons and some of the world's best diving.",
      content: [
        { type: "paragraph", value: "Komodo National Park is one of Indonesia's most dramatic and diverse destinations. The rugged, volcanic landscape is home to the world's largest lizard — the Komodo dragon." },
        { type: "paragraph", value: "Beneath the surface, the waters around Komodo are equally spectacular. Divers encounter manta rays, sharks, and vibrant coral gardens." },
        { type: "image", value: "https://picsum.photos/seed/dest1b/800/450", caption: "Pink Beach, Komodo" },
        { type: "paragraph", value: "Best time to visit: April to December for calm seas. Liveaboard diving trips are highly recommended for the full experience." },
      ],
      tags: ["indonesia", "diving", "wildlife"],
    },
    {
      id: 21, section: "destinations", status: "published",
      title: "Swiss Alps: Winter Wonderland",
      date: "2026-02-20", author: "writer1", category: "Europe",
      coverImage: "https://picsum.photos/seed/dest2/800/500",
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
      "https://picsum.photos/seed/hero1/500/320",
      "https://picsum.photos/seed/hero2/500/320",
      "https://picsum.photos/seed/hero3/500/320",
      "https://picsum.photos/seed/hero4/500/320",
    ],
    adv: [
      "https://picsum.photos/seed/adv1/340/300",
      "https://picsum.photos/seed/adv2/420/400",
    ],
    gal: [
      "https://picsum.photos/seed/gal1/280/200",
      "https://picsum.photos/seed/gal2/280/200",
      "https://picsum.photos/seed/gal3/280/200",
      "https://picsum.photos/seed/gal4/280/200",
      "https://picsum.photos/seed/gal5/280/200",
      "https://picsum.photos/seed/gal6/280/200",
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
    aboutText: "Arutala Organizer telah menghubungkan impian dengan kenyataan sejak 2010. Kami percaya bahwa setiap momen spesial layak dirayakan dengan sempurna.",
    aboutHeroLabel: "About Us",
    aboutHeroTitle: "We Live for Adventure",
    aboutHeroSub: "Arutala Organizer telah menghubungkan impian dengan kenyataan sejak 2010. Kami percaya bahwa setiap momen spesial layak dirayakan dengan sempurna.",
    aboutWhyTitle: "Why Choose Us",
    aboutV1Icon: "🌍", aboutV1Title: "Global Network",    aboutV1Desc: "Partnerships with 200+ local guides in 60 countries.",
    aboutV2Icon: "🛡",  aboutV2Title: "Safe & Trusted",   aboutV2Desc: "Full insurance coverage and 24/7 emergency support.",
    aboutV3Icon: "🌱", aboutV3Title: "Sustainable Travel",aboutV3Desc: "We offset 100% of our trips' carbon footprint.",
    aboutV4Icon: "⭐", aboutV4Title: "Award Winning",     aboutV4Desc: "Best Travel Agency award 3 years running.",
    aboutContactTitle: "Get in Touch",
    aboutContactSub: "We'd love to help plan your next event.",
    email: "arutala@example.com",
    phone: "+1 265 013 7253",
    logoText: "ARUTALA\nORGANIZER",
    logoImage: "",
    loginBtnText: "LOGIN",
    nav1: "Home", nav2: "About", nav3: "Event Plan", nav4: "Traveling", nav5: "Wedding Organizer",
  },
  posts: DEFAULT_POSTS,
  cats: ["Experience Thailand", "Best Adventures", "Sea & Beach", "Hiking Tours", "Kayaking Tours", "Winter Destinations"],
  messages: [],
  users: HARDCODED_USERS.map((u, i) => ({ id: i + 1, ...u, email: `${u.username}@arutala.com`, active: true })),
};

/* ─────────────── GLOBAL STYLES ─────────────── */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
    body{font-family:'DM Sans',sans-serif;background:#f4f9fb;color:#1a2e42;line-height:1.6;font-size:16px}
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

    h1,h2,h3,h4,h5{font-family:'Playfair Display',serif;color:#1a2e42;line-height:1.15;font-weight:800;letter-spacing:-.01em}
    h1{font-size:clamp(2rem,5vw,3.5rem)}
    h2{font-size:clamp(1.6rem,3.5vw,2.6rem)}
    h3{font-size:clamp(1.2rem,2.5vw,1.6rem)}
    p{font-size:1rem;line-height:1.75;color:#334f65}
    small{font-size:.875rem;line-height:1.5}

    .nav-link{position:relative;padding-bottom:3px;font-size:.875rem;letter-spacing:.04em;font-weight:500;color:#334f65;transition:color .2s}
    .nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:#2b7a9a;transition:width .3s;border-radius:2px}
    .nav-link:hover{color:#2b7a9a}
    .nav-link:hover::after,.nav-link.active::after{width:100%}
    .nav-link.active{color:#2b7a9a!important}

    .hover-lift{transition:transform .3s,box-shadow .3s}
    .hover-lift:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(26,46,66,.12)}
    .img-zoom{overflow:hidden}
    .img-zoom img{transition:transform .6s cubic-bezier(.25,.46,.45,.94)}
    .img-zoom:hover img{transform:scale(1.07)}
    .cms-toolbar button:hover{background:rgba(43,122,154,.12)!important}
    .post-card:hover .post-card-title{color:#2b7a9a}

    .logo-brand{font-family:'Playfair Display',serif;font-weight:900;font-size:1.05rem;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:#1a2e42;text-shadow:0 1px 3px rgba(26,46,66,.18),0 2px 8px rgba(26,46,66,.10)}
    .logo-brand-footer{font-family:'Playfair Display',serif;font-weight:800;font-size:.95rem;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:#1a2e42}
    .logo-brand-admin{font-family:'Playfair Display',serif;font-weight:800;font-size:.9rem;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.3)}
    .label-xs{font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600}
    .card-title{font-family:'Playfair Display',serif;font-weight:700;font-size:1.15rem;line-height:1.3;color:#1a2e42}

    /* ── Visibility helpers ── */
    @media(max-width:900px){.hide-md{display:none!important}}
    @media(max-width:640px){.hide-sm{display:none!important}.show-sm{display:flex!important}}
    @media(min-width:641px){.show-sm{display:none!important}}

    /* ══════════════════════════════════════
       RESPONSIVE LAYOUT UTILITIES
    ══════════════════════════════════════ */

    /* Two-column grid → single column on mobile */
    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
    @media(max-width:768px){.grid-2{grid-template-columns:1fr!important;gap:32px!important}}

    /* Hero section */
    .hero-section{padding:70px 5% 80px}
    @media(max-width:768px){.hero-section{padding:48px 5% 52px}}

    /* Section padding */
    .section-lg{padding:90px 5%}
    .section-md{padding:80px 5%}
    @media(max-width:768px){.section-lg{padding:52px 5%}.section-md{padding:44px 5%}}

    /* Hero images grid: hide on mobile to prioritize text */
    .hero-img-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    @media(max-width:768px){.hero-img-grid{display:none}}

    /* Adventure images: stack on mobile */
    .adv-img-row{display:flex;gap:14px;align-items:flex-end}
    @media(max-width:768px){.adv-img-row{display:none}}

    /* Book section images: hide on small screens */
    .book-img-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    @media(max-width:768px){.book-img-grid{display:none}}

    /* Contact grid */
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px}
    @media(max-width:768px){.contact-grid{grid-template-columns:1fr!important;gap:32px!important}}

    /* Globe section */
    .globe-inner{display:flex;align-items:center;gap:60px;flex-wrap:wrap}
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
    .admin-sidebar{width:220px;background:#162538;flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column;transition:transform .25s}
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
    .cms-topbar{background:#1e3248;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
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
      nav>div{height:58px!important}
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
  if (content.logoImage) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={content.logoImage} alt={content.logoText}
          style={{ height: size === "nav" ? 40 : 34, objectFit: "contain", display: "block" }} />
        <span className={size === "admin" ? "logo-brand-admin" : size === "footer" ? "logo-brand-footer" : "logo-brand"}>
          {lines.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
        </span>
      </div>
    );
  }
  /* Text-only: slot on left reserved for future logo image */
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Logo placeholder slot — keeps layout stable when image is uploaded */}
      <div style={{
        width: size === "nav" ? 40 : 34, height: size === "nav" ? 40 : 34,
        borderRadius: 8, border: `1.5px dashed ${size === "admin" ? "rgba(255,255,255,.3)" : "#b8d4e3"}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        background: size === "admin" ? "rgba(255,255,255,.06)" : "rgba(61,143,171,.06)"
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={size === "admin" ? "rgba(255,255,255,.4)" : "#9bbfd0"} strokeWidth="1.5" width="18" height="18">
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
          <h2 key={i} className="display" style={{ fontSize: "1.625rem", fontWeight: 800, color: "#1a2e42", marginTop: 12 }}>{b.value}</h2>
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

  const textColors = ["#000000","#1a2e42","#2b7a9a","#e74c3c","#27ae60","#f39c12","#8e44ad","#e67e22","#7f8c8d","#ffffff"];
  const hlColors  = ["#ffff00","#00ff7f","#ff9900","#ffcccc","#cce5ff","#e2ccff","transparent"];
  const fontSizeMap = {"8":1,"10":2,"12":3,"14":4,"18":5,"24":6,"36":7};

  return (
    <div style={{ border: "1.5px solid #d0e4ee", borderRadius: 8, overflow: "visible", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
      {/* ── Toolbar Row 1: Font, Size, Basic Formatting ── */}
      <div style={{ background: "#f4f9fb", borderBottom: "1px solid #ddeef5", padding: "6px 10px", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
        <select onChange={e => exec("fontName", e.target.value)}
          style={{ height: 26, fontSize: 12, padding: "1px 4px", border: "1px solid #d0e4ee", borderRadius: 4, background: "#fff", color: "#1a2e42", maxWidth: 130, cursor: "pointer" }}>
          {["Calibri (Body)","Arial","Times New Roman","Georgia","Verdana","Courier New","Trebuchet MS"].map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select onChange={e => exec("fontSize", fontSizeMap[e.target.value] || 3)}
          style={{ height: 26, fontSize: 12, padding: "1px 4px", border: "1px solid #d0e4ee", borderRadius: 4, background: "#fff", color: "#1a2e42", width: 52, cursor: "pointer" }}>
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
            <span style={{fontSize:13,fontWeight:900,color:"#1a2e42",lineHeight:1}}>A</span>
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
            minHeight: 220, padding: "16px 18px", fontSize: 14, color: "#1a2e42",
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

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAddVal(reader.result);
    reader.readAsDataURL(file);
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
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a2e42", textAlign: "center", marginBottom: 6, fontFamily: "'Playfair Display',serif" }}>
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
                  border: section === opt.key ? "2px solid #1a2e42" : "1.5px solid #ddeef5",
                  borderRadius: 10, background: section === opt.key ? "#f0f5fa" : "#fff",
                  cursor: "pointer", textAlign: "left", transition: "all .15s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2b7a9a"; e.currentTarget.style.background = "#f4f9fb"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = section === opt.key ? "#1a2e42" : "#ddeef5"; e.currentTarget.style.background = section === opt.key ? "#f0f5fa" : "#fff"; }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2e42" }}>{opt.label}</div>
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
      <div style={{ background: "#1e3248", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
              color: "#1e3248", border: "none", outline: "none", borderBottom: "2px solid #eef4f8",
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
                        background: imgUploadMode === m ? "#1e3248" : "#fff",
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
              padding: "9px 22px", background: "#1e3248", color: "#fff",
              borderRadius: 6, fontSize: 13, border: "none", fontWeight: 500
            }}>+ Add Block</button>
          </div>
        </div>

        {/* Right: Meta / Publish */}
        <div className="cms-editor-right">
          {/* Section Selector */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #eef4f8", overflow: "hidden" }}>
            <div style={{ background: "#f4f9fb", padding: "12px 16px", borderBottom: "1px solid #eef4f8" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1e3248", letterSpacing: ".5px" }}>PUBLISH TO</span>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(SECTION_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => onSectionChange && onSectionChange(key)} style={{
                  padding: "8px 12px", borderRadius: 6, fontSize: 12, fontWeight: section === key ? 600 : 400,
                  border: section === key ? "none" : "1px solid #d0e4ee",
                  background: section === key ? "#1e3248" : "#fff",
                  color: section === key ? "#fff" : "#4a6680",
                  textAlign: "left", transition: "all .15s"
                }}>{section === key ? "✓ " : ""}{label}</button>
              ))}
            </div>
          </div>

          {/* Publish Box */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #eef4f8", overflow: "hidden" }}>
            <div style={{ background: "#f4f9fb", padding: "12px 16px", borderBottom: "1px solid #eef4f8" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1e3248", letterSpacing: ".5px" }}>PUBLISH</span>
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
                  padding: "10px 0", background: "#1e3248", border: "none",
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
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, outline: "none", background: "#f4f9fb", color: "#1a2e42", fontWeight: 600, cursor: "default" }} />
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
          onError={e => { e.target.src = "https://picsum.photos/seed/fallback/400/200"; }} />
      </div>
      <div style={{ padding: "14px 16px 14px 0", flex: 1 }}>
        {post.category && <span className="label-xs" style={{ color: "#2b7a9a" }}>{post.category}</span>}
        <h3 className="post-card-title" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700,
          fontSize: "1.1rem", color: "#1a2e42", margin: "6px 0 8px", lineHeight: 1.3, transition: "color .2s" }}>{post.title}</h3>
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
          onError={e => { e.target.src = "https://picsum.photos/seed/fallback2/400/200"; }} />
      </div>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          {post.category && <span className="label-xs" style={{ color: "#2b7a9a" }}>{post.category}</span>}
          {post.badge && <span style={{ fontSize: "0.6875rem", background: "#fff3cd", color: "#7a5c00", padding: "2px 9px", borderRadius: 10, fontWeight: 600, letterSpacing: ".03em" }}>{post.badge}</span>}
          <span style={{ fontSize: "0.75rem", color: "#6b8999" }}>{formatDate(post.date)}</span>
        </div>
        <h3 className="post-card-title" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700,
          fontSize: "1.15rem", color: "#1a2e42", marginBottom: 10, lineHeight: 1.3, transition: "color .2s" }}>{post.title}</h3>
        <p style={{ fontSize: "0.875rem", color: "#4e6b80", lineHeight: 1.7 }}>
          {post.excerpt?.length > 110 ? post.excerpt.slice(0, 110) + "…" : post.excerpt}
        </p>
        {post.price && (
          <div style={{ marginTop: 12, fontSize: "1.25rem", fontWeight: 700, color: "#1a2e42", fontFamily: "'Playfair Display',serif" }}>{post.price}</div>
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
        padding: "12px 5%", position: "sticky", top: 64, zIndex: 90 }}>
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
        <h1 className="display" style={{ fontSize: "clamp(1.875rem, 5vw, 3.25rem)", fontWeight: 800, lineHeight: 1.12, color: "#1a2e42", marginBottom: 20 }}>
          {post.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #ddeef5" }}>
          <span style={{ fontSize: "0.875rem", color: "#4e6b80", fontWeight: 500 }}>By {post.author}</span>
          <span style={{ fontSize: "0.875rem", color: "#b8d4e3" }}>·</span>
          <span style={{ fontSize: "0.875rem", color: "#4e6b80" }}>{formatDate(post.date)}</span>
          {post.price && <span style={{ fontSize: "1.375rem", fontWeight: 700, color: "#1a2e42", fontFamily: "'Playfair Display',serif", marginLeft: "auto" }}>{post.price}</span>}
        </div>
        {post.excerpt && (
          <p style={{ fontSize: "1.125rem", color: "#334f65", lineHeight: 1.85, marginBottom: 32, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 400 }}>
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
      <div style={{ background: "linear-gradient(135deg, #1e3248 0%, #2d5a7a 100%)", padding: "60px 5%", color: "#fff" }}>
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
                    background: filter === c ? "#1e3248" : "#fff",
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
              <div style={{ background: "#1e3248", padding: "14px 20px" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>Most Popular</span>
              </div>
              <div style={{ padding: "8px 0" }}>
                {popular.map((p, i) => (
                  <div key={p.id} onClick={() => onReadPost(p)}
                    style={{ display: "flex", gap: 12, padding: "10px 20px", cursor: "pointer", borderBottom: "1px solid #f4f9fb", transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f4f9fb"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: i < 3 ? "#e74c3c" : "#b8d4e3", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1, minWidth: 24 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: "#1e3248", lineHeight: 1.5, fontWeight: 400 }}>{p.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              <div style={{ background: "#f4f9fb", padding: "14px 20px", borderBottom: "1px solid #eef4f8" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1e3248", letterSpacing: "1px", textTransform: "uppercase" }}>Categories</span>
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

/* ─────────────── ABOUT PAGE ─────────────── */
function AboutPage({ content, images }) {
  const values = [
    { icon: content.aboutV1Icon || "🌍", title: content.aboutV1Title || "Global Network",    desc: content.aboutV1Desc || "Partnerships with 200+ local guides in 60 countries." },
    { icon: content.aboutV2Icon || "🛡",  title: content.aboutV2Title || "Safe & Trusted",   desc: content.aboutV2Desc || "Full insurance coverage and 24/7 emergency support." },
    { icon: content.aboutV3Icon || "🌱", title: content.aboutV3Title || "Sustainable Travel",desc: content.aboutV3Desc || "We offset 100% of our trips' carbon footprint." },
    { icon: content.aboutV4Icon || "⭐", title: content.aboutV4Title || "Award Winning",     desc: content.aboutV4Desc || "Best Travel Agency award 3 years running." },
  ];
  return (
    <div className="fade-in" style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Hero */}
      <div style={{ background: "#c5dde9", padding: "80px 5%", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }} className="about-hero-grid">
          <div>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "#2b7a9a", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>{content.aboutHeroLabel || "About Us"}</div>
            <h1 className="display" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.06, color: "#1a2e42", marginBottom: 20 }}>
              {content.aboutHeroTitle || "We Live for Adventure"}
            </h1>
            <p style={{ fontSize: "1rem", color: "#4e6b80", lineHeight: 1.9, maxWidth: 400 }}>{content.aboutHeroSub || content.aboutText}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {images.hero.slice(0, 4).map((src, i) => (
              <div key={i} className="img-zoom" style={{ borderRadius: 6, overflow: "hidden", aspectRatio: "4/3" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#1a2e42", marginBottom: 48, textAlign: "center" }}>{content.aboutWhyTitle || "Why Choose Us"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
          {values.map(v => (
            <div key={v.title} style={{ textAlign: "center", padding: "32px 24px", background: "#f4f9fb", borderRadius: 10 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{v.icon}</div>
              <h3 style={{ fontSize: "1.125rem", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: "#1a2e42", marginBottom: 10 }}>{v.title}</h3>
              <p style={{ fontSize: "0.9375rem", color: "#4e6b80", lineHeight: 1.75 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={{ background: "#daeaf3", padding: "70px 5%" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 className="display" style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 900, color: "#1a2e42", marginBottom: 16 }}>{content.aboutContactTitle || "Get in Touch"}</h2>
          <p style={{ fontSize: "0.9375rem", color: "#4e6b80", marginBottom: 24, lineHeight: 1.8 }}>{content.aboutContactSub || "We'd love to help plan your next event."}</p>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`mailto:${content.email}`} style={{ fontSize: 14, color: "#3d8fab", display: "flex", alignItems: "center", gap: 6 }}>✉ {content.email}</a>
            <a href={`tel:${content.phone}`} style={{ fontSize: 14, color: "#3d8fab", display: "flex", alignItems: "center", gap: 6 }}>📞 {content.phone}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function BricksyTravel() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");   // home | about | news | shop | destinations
  const [readPost, setReadPost] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
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
  // Profile editing state
  const [profileEdit, setProfileEdit] = useState({ name: "", phone: "", email: "", desc: "", photo: "", oldPass: "", newPass: "", confirmPass: "" });
  const [userMgmtForm, setUserMgmtForm] = useState({ username: "", password: "", role: "content_writer", email: "", name: "" });
  const [userMgmtOpen, setUserMgmtOpen] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage?.get("bricksy-v2");
        if (r?.value) setData(JSON.parse(r.value));
      } catch {}
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
    setData(d);
    try { await window.storage?.set("bricksy-v2", JSON.stringify(d)); } catch {}
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
      const r = await window.storage?.get(`profile-${u.username}`);
      if (r?.value) {
        const p = JSON.parse(r.value);
        if (p._password) savedPass = p._password;
        profile = { name: p.name ?? profile.name, phone: p.phone ?? profile.phone, email: p.email ?? profile.email, desc: p.desc ?? profile.desc, photo: p.photo ?? profile.photo };
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
    // Ambil email dari profile storage atau hardcoded
    let storedEmail = u?.email || "";
    try {
      const r = await window.storage?.get(`profile-${u.username}`);
      if (r?.value) { const p = JSON.parse(r.value); if (p.email) storedEmail = p.email; }
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
      const r = await window.storage?.get(`profile-${forgotUser}`);
      const prev = r?.value ? JSON.parse(r.value) : {};
      await window.storage?.set(`profile-${forgotUser}`, JSON.stringify({ ...prev, _password: forgotNewPass.val }));
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
    window.open(`https://wa.me/6285745571442?text=${encodeURIComponent(text)}`, "_blank");
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
  ];

  /* ─── RENDER ─── */
  return (
    <div className="page-wrap" style={{ position: "relative", minHeight: "100vh" }}>
      <GS />

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
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, color: "#1e3248", marginBottom: 6, lineHeight: 1.2 }}>
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
                  <div style={{ fontSize: 14, color: "#1e3248", fontWeight: 500 }}>082234651413</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#3d8fab", fontWeight: 500 }}>Hubungi →</span>
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                background: "#f4f9fb", borderRadius: 8, border: "1px solid #eef4f8" }}>
                <span style={{ fontSize: 18 }}>✉️</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 10, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>Email</div>
                  <div style={{ fontSize: 13, color: "#1e3248" }}>mahfudfebrys@gmail.com</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#b8d4e3", marginTop: 20, fontStyle: "italic" }}>
              Website developed & designed by Mahfud Febry Styanto
            </p>
          </div>
        </div>
      )}

      {/* ══════ PUBLIC WEBSITE ══════ */}
      {!showAdmin && (
        <>
          {/* NAVBAR */}
          <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,252,253,.97)",
            backdropFilter: "blur(12px)", borderBottom: "1px solid #ddeef5", padding: "0 5%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, maxWidth: 1200, margin: "0 auto" }}>
              <button onClick={() => navigateTo("home")} style={{ border: "none", background: "none", padding: 0 }}>
                <LogoDisplay content={data.content} size="nav" />
              </button>
              <div className="hide-sm" style={{ display: "flex", gap: 28, alignItems: "center" }}>
                {navItems.map(item => (
                  <button key={item.key} onClick={() => navigateTo(item.key)}
                    className={`nav-link${page === item.key ? " active" : ""}`}
                    style={{ border: "none", background: "none", cursor: "pointer" }}>
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="hide-sm" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {user
                  ? <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                      <span style={{ fontSize: "0.8125rem", color: "#1a2e42", fontWeight: 700, lineHeight: 1.2 }}>
                        {user.name || user.username}
                      </span>
                      <button onClick={() => setShowAdmin(true)}
                        style={{ fontSize: "0.6875rem", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700,
                          color: "#2b7a9a", background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1.2,
                          transition: "color .15s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#1a2e42"}
                        onMouseLeave={e => e.currentTarget.style.color = "#2b7a9a"}>
                        Control Panel →
                      </button>
                    </div>
                  : <button onClick={() => setShowLogin(true)} style={{
                      padding: "8px 22px", border: "1.5px solid #1a2e42", borderRadius: 3,
                      fontSize: "0.75rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700,
                      background: "transparent", color: "#1a2e42", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#1a2e42"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a2e42"; }}>
                    {data.content.loginBtnText}
                  </button>
                }
              </div>
              <button className="show-sm" onClick={() => setMobileMenu(!mobileMenu)}
                style={{ fontSize: 22, color: "#1a2e42" }} aria-label="Menu">☰</button>
            </div>
            {mobileMenu && (
              <div style={{ padding: "16px 0 20px", borderTop: "1px solid #ddeef5", display: "flex", flexDirection: "column", gap: 4 }}>
                {navItems.map(item => (
                  <button key={item.key} onClick={() => navigateTo(item.key)}
                    className="mobile-nav-item"
                    style={{ fontSize: "1rem", color: page === item.key ? "#2b7a9a" : "#334f65", fontWeight: page === item.key ? 600 : 400, border: "none", background: page === item.key ? "#f0f7fa" : "none", textAlign: "left", padding: "12px 8px", borderRadius: 6, width: "100%" }}>
                    {item.label}
                  </button>
                ))}
                {user && (
                  <div style={{ padding: "10px 8px", borderTop: "1px solid #ddeef5", marginTop: 8 }}>
                    <div style={{ fontSize: ".8125rem", color: "#6b8999", marginBottom: 8 }}>Login sebagai <strong style={{ color: "#1a2e42" }}>{user.name || user.username}</strong></div>
                    <button onClick={() => { setShowAdmin(true); setMobileMenu(false); }}
                      style={{ fontSize: ".875rem", color: "#fff", background: "#1a2e42", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 600, width: "100%", marginBottom: 6 }}>
                      Admin Panel
                    </button>
                    <button onClick={() => { logout(); setMobileMenu(false); }}
                      style={{ fontSize: ".875rem", color: "#e74c3c", background: "none", border: "1px solid #e74c3c", borderRadius: 6, padding: "7px 16px", width: "100%" }}>
                      Logout
                    </button>
                  </div>
                )}
                {!user && <button onClick={() => { setShowLogin(true); setMobileMenu(false); }}
                  style={{ padding: "12px 8px", border: "none", background: "none", fontSize: "1rem", color: "#2b7a9a", textAlign: "left", fontWeight: 600 }}>Login</button>}
              </div>
            )}
          </nav>

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
                  {/* Hero */}
                  <section className="hero-section" style={{ background: "#c5dde9" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="grid-2">
                      <div className="fade-in">
                        <h1 className="display" style={{ fontSize: "clamp(2.4rem,6vw,4rem)", fontWeight: 900, lineHeight: 1.06, color: "#1a2e42", marginBottom: 20 }}>
                          {data.content.heroTitle}
                        </h1>
                        <p style={{ fontSize: "1rem", color: "#334f65", lineHeight: 1.85, maxWidth: 360, marginBottom: 32 }}>
                          {data.content.heroSub}
                        </p>
                        <button onClick={() => navigateTo("about")}
                          style={{ padding: "12px 30px", border: "1.5px solid #1a2e42", background: "transparent",
                          fontSize: "0.75rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, color: "#1a2e42", transition: "all .2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#1a2e42"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a2e42"; }}>
                          Get Started
                        </button>
                      </div>
                      <div className="hero-img-grid">
                        {data.images.hero.map((src, i) => (
                          <div key={i} className="img-zoom hover-lift" style={{ borderRadius: 6, overflow: "hidden", aspectRatio: "4/3" }}>
                            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Adventure */}
                  <section className="section-lg" style={{ background: "#fff" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="grid-2">
                      <div>
                        <div className="label-xs" style={{ color: "#6b8999", marginBottom: 16 }}>{data.content.advSub}</div>
                        <h2 className="display" style={{ fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 900, lineHeight: 1.08, color: "#1a2e42", marginBottom: 28 }}>
                          {data.content.advTitle}
                        </h2>
                        <p style={{ fontSize: "0.9375rem", color: "#4e6b80", lineHeight: 1.9, fontStyle: "italic", maxWidth: 340, marginBottom: 24 }}>
                          {data.content.advQuote}
                        </p>
                        <p className="display" style={{ fontSize: "1.75rem", fontStyle: "italic", color: "#2b7a9a", fontWeight: 700 }}>freedom</p>
                      </div>
                      <div className="adv-img-row">
                        <div className="img-zoom" style={{ flex: 1, borderRadius: 6, overflow: "hidden" }}>
                          <img src={data.images.adv[0]} alt="" style={{ width: "100%", height: 280, objectFit: "cover" }} />
                        </div>
                        <div className="img-zoom" style={{ flex: 1.2, borderRadius: 6, overflow: "hidden" }}>
                          <img src={data.images.adv[1]} alt="" style={{ width: "100%", height: 340, objectFit: "cover" }} />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Gallery */}
                  <section className="section-md" style={{ background: "#f4f9fb" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
                      <div className="label-xs" style={{ color: "#6b8999", marginBottom: 14 }}>INTRODUCING</div>
                      <h2 className="display" style={{ fontSize: "clamp(1.75rem,4.5vw,3rem)", fontWeight: 900, color: "#1a2e42", marginBottom: 16 }}>
                        {data.content.newAdvTitle}
                      </h2>
                      <p style={{ fontSize: "0.9375rem", color: "#4e6b80", lineHeight: 1.8, maxWidth: 440, margin: "0 auto 40px" }}>{data.content.newAdvSub}</p>
                      <div className="gal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 40 }}>
                        {data.images.gal.map((src, i) => (
                          <div key={i} className="img-zoom hover-lift" style={{ borderRadius: 4, overflow: "hidden", aspectRatio: "3/2" }}>
                            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        ))}
                      </div>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button onClick={() => setExploreOpen(v => !v)}
                          style={{ padding: "12px 30px", border: "1.5px solid #1a2e42", background: exploreOpen ? "#1a2e42" : "transparent",
                          fontSize: "0.75rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700,
                          color: exploreOpen ? "#fff" : "#1a2e42", transition: "all .2s", display: "flex", alignItems: "center", gap: 8 }}
                          onMouseEnter={e => { if (!exploreOpen) { e.currentTarget.style.background = "#1a2e42"; e.currentTarget.style.color = "#fff"; } }}
                          onMouseLeave={e => { if (!exploreOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a2e42"; } }}>
                          Explore All <span style={{ fontSize: "0.6rem", transition: "transform .2s", display: "inline-block", transform: exploreOpen ? "rotate(180deg)" : "none" }}>▼</span>
                        </button>
                        {exploreOpen && (
                          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff",
                            border: "1.5px solid #1a2e42", borderRadius: 4, minWidth: 200, zIndex: 50,
                            boxShadow: "0 8px 32px rgba(26,46,66,.15)", overflow: "hidden" }}>
                            {[
                              { label: "🎉 Event Plan", key: "destinations" },
                              { label: "✈️ Traveling", key: "shop" },
                              { label: "💍 Wedding Organizer", key: "news" },
                            ].map(item => (
                              <button key={item.key} onClick={() => { navigateTo(item.key); setExploreOpen(false); }}
                                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 20px",
                                  fontSize: "0.875rem", fontWeight: 500, color: "#1a2e42", background: "none",
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
                        <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, lineHeight: 1.1, color: "#1a2e42", marginBottom: 18 }}>
                          {data.content.bookTitle}
                        </h2>
                        <p style={{ fontSize: "0.9375rem", color: "#4e6b80", lineHeight: 1.85, marginBottom: 28, maxWidth: 340 }}>{data.content.bookSub}</p>
                        <a href="https://wa.me/6285745571442" target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-block", padding: "12px 30px", border: "1.5px solid #1a2e42", background: "transparent",
                          fontSize: "0.75rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, color: "#1a2e42", transition: "all .2s", textDecoration: "none" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#1a2e42"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a2e42"; }}>
                          Book Now
                        </a>
                      </div>
                    </div>
                  </section>

                  {/* Latest News Preview */}
                  <section className="section-md" style={{ background: "#fff" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36 }}>
                        <h2 className="display" style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 900, color: "#1a2e42" }}>Latest News</h2>
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
                  <section style={{ padding: "0", background: "#04080f", overflow: "hidden", position: "relative", minHeight: 340 }}>
                    {/* Galaxy background stars */}
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, #0d1f3c 0%, #04080f 70%)", zIndex: 0 }} />
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,.7) 0%, transparent 100%), radial-gradient(1px 1px at 25% 40%, rgba(255,255,255,.5) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 45% 10%, rgba(255,255,255,.8) 0%, transparent 100%), radial-gradient(1px 1px at 60% 30%, rgba(255,255,255,.4) 0%, transparent 100%), radial-gradient(1px 1px at 75% 60%, rgba(255,255,255,.6) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 85% 20%, rgba(255,255,255,.9) 0%, transparent 100%), radial-gradient(1px 1px at 90% 70%, rgba(255,255,255,.5) 0%, transparent 100%), radial-gradient(1px 1px at 15% 75%, rgba(255,255,255,.4) 0%, transparent 100%), radial-gradient(2px 2px at 50% 85%, rgba(255,255,255,.3) 0%, transparent 100%), radial-gradient(1px 1px at 30% 90%, rgba(255,255,255,.6) 0%, transparent 100%), radial-gradient(1px 1px at 70% 5%, rgba(255,255,255,.7) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 5% 50%, rgba(255,255,255,.5) 0%, transparent 100%)", zIndex: 1 }} />

                    <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "60px 5%" }} className="globe-inner">
                      {/* Left: text + search */}
                      <div style={{ flex: "1 1 340px" }}>
                        <div className="label-xs" style={{ color: "#5bc4e0", marginBottom: 14 }}>✦ Jelajahi Dunia</div>
                        <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#fff", marginBottom: 10, lineHeight: 1.1 }}>
                          {data.content.newsletterTitle}
                        </h2>
                        <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,.55)", marginBottom: 28, lineHeight: 1.75 }}>
                          Ketik nama kota atau destinasi untuk menjelajahinya di peta interaktif.
                        </p>
                        <div style={{ display: "flex", gap: 0, maxWidth: 420 }}>
                          <input
                            value={mapQuery}
                            onChange={e => setMapQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter" && mapQuery.trim()) { window.open(`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`, "_blank"); } }}
                            placeholder="Cari lokasi... (e.g. Bali, Raja Ampat)"
                            aria-label="Cari lokasi di Google Maps"
                            style={{ flex: 1, padding: "12px 18px", border: "1.5px solid rgba(91,196,224,.4)", borderRight: "none",
                              fontSize: "0.9375rem", background: "rgba(255,255,255,.06)", color: "#fff", outline: "none",
                              borderRadius: "4px 0 0 4px", backdropFilter: "blur(8px)" }} />
                          <button
                            onClick={() => { if (mapQuery.trim()) window.open(`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`, "_blank"); }}
                            style={{ padding: "12px 20px", background: "#2b7a9a", color: "#fff", border: "none",
                              fontSize: "0.75rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700,
                              borderRadius: "0 4px 4px 0", cursor: "pointer", transition: "background .2s", whiteSpace: "nowrap" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#3d8fab"}
                            onMouseLeave={e => e.currentTarget.style.background = "#2b7a9a"}>
                            🔍 Jelajahi
                          </button>
                        </div>
                        {mapQuery && (
                          <p style={{ fontSize: "0.8125rem", color: "rgba(91,196,224,.8)", marginTop: 10 }}>
                            Tekan Enter atau klik Jelajahi untuk membuka di Google Maps ↗
                          </p>
                        )}
                      </div>

                      {/* Right: Globe visual */}
                      <div className="globe-visual">
                        {mapQuery.trim() ? (
                          /* When searching: show embedded map iframe */
                          <div style={{ width: 280, height: 280, borderRadius: "50%", overflow: "hidden",
                            border: "3px solid rgba(91,196,224,.3)", boxShadow: "0 0 40px rgba(43,122,154,.4), 0 0 80px rgba(43,122,154,.15)" }}>
                            <iframe
                              title="Google Maps Preview"
                              width="280" height="280"
                              style={{ border: 0, pointerEvents: "none", transform: "scale(1.1)", transformOrigin: "center" }}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=10`}
                            />
                          </div>
                        ) : (
                          /* Default: animated galaxy globe */
                          <div style={{ position: "relative", width: 260, height: 260 }}>
                            <style>{`
                              @keyframes globeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                              @keyframes globePulse { 0%,100% { box-shadow: 0 0 40px rgba(91,196,224,.35), 0 0 80px rgba(43,122,154,.2), inset 0 0 60px rgba(0,0,0,.4); } 50% { box-shadow: 0 0 60px rgba(91,196,224,.55), 0 0 120px rgba(43,122,154,.3), inset 0 0 60px rgba(0,0,0,.4); } }
                              @keyframes ringOrbit { from { transform: rotateX(75deg) rotate(0deg); } to { transform: rotateX(75deg) rotate(360deg); } }
                            `}</style>
                            {/* Outer glow ring */}
                            <div style={{ position: "absolute", inset: -20, borderRadius: "50%",
                              background: "radial-gradient(circle, transparent 50%, rgba(91,196,224,.06) 70%, transparent 80%)",
                              animation: "globePulse 4s ease-in-out infinite" }} />
                            {/* Globe */}
                            <div style={{ width: 260, height: 260, borderRadius: "50%",
                              background: "radial-gradient(circle at 35% 35%, #1a5f8a 0%, #0d3558 30%, #07203a 60%, #030e1a 100%)",
                              animation: "globePulse 4s ease-in-out infinite",
                              position: "relative", overflow: "hidden" }}>
                              {/* Continents suggestion */}
                              <div style={{ position: "absolute", top: "22%", left: "15%", width: "35%", height: "28%",
                                background: "rgba(45,180,100,.35)", borderRadius: "40% 60% 50% 40%", filter: "blur(2px)" }} />
                              <div style={{ position: "absolute", top: "30%", left: "55%", width: "30%", height: "22%",
                                background: "rgba(45,180,100,.3)", borderRadius: "50% 40% 60% 50%", filter: "blur(2px)" }} />
                              <div style={{ position: "absolute", top: "55%", left: "25%", width: "20%", height: "18%",
                                background: "rgba(45,180,100,.28)", borderRadius: "50%", filter: "blur(2px)" }} />
                              <div style={{ position: "absolute", top: "60%", left: "55%", width: "28%", height: "20%",
                                background: "rgba(45,180,100,.25)", borderRadius: "40% 60% 50% 40%", filter: "blur(2px)" }} />
                              {/* Latitude lines */}
                              {[30,50,70].map(t => (
                                <div key={t} style={{ position: "absolute", left: 0, right: 0, top: `${t}%`,
                                  height: "1px", background: "rgba(91,196,224,.12)" }} />
                              ))}
                              {/* Shine */}
                              <div style={{ position: "absolute", top: "10%", left: "15%", width: "40%", height: "30%",
                                background: "radial-gradient(circle, rgba(255,255,255,.18) 0%, transparent 70%)",
                                borderRadius: "50%", filter: "blur(4px)" }} />
                              {/* Spinning overlay longitude lines */}
                              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
                                animation: "globeSpin 20s linear infinite", opacity: .25 }}>
                                {[0,30,60,90,120,150].map(d => (
                                  <div key={d} style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px",
                                    background: "rgba(91,196,224,.6)", transform: `rotate(${d}deg)`, transformOrigin: "50% 50%" }} />
                                ))}
                              </div>
                            </div>
                            {/* Orbiting dot */}
                            <div style={{ position: "absolute", inset: -10, borderRadius: "50%",
                              animation: "ringOrbit 6s linear infinite" }}>
                              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                                width: 10, height: 10, borderRadius: "50%", background: "#5bc4e0",
                                boxShadow: "0 0 10px #5bc4e0, 0 0 20px rgba(91,196,224,.6)" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Contact */}
                  <section className="section-md" style={{ background: "#fff" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="contact-grid">
                      <div>
                        <h2 className="display" style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 900, color: "#1a2e42", marginBottom: 18 }}>Contact Us</h2>
                        <p style={{ fontSize: "0.9375rem", color: "#4e6b80", lineHeight: 1.85, marginBottom: 20 }}>{data.content.aboutText}</p>
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
                        <button onClick={submitMsg} style={{ padding: "12px 26px", background: "#1a2e42", color: "#fff",
                          fontSize: "0.75rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700,
                          border: "none", borderRadius: 4, alignSelf: "flex-start", transition: "background .2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#2b7a9a"}
                          onMouseLeave={e => e.currentTarget.style.background = "#1a2e42"}>
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
                          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 14, color: "#1a2e42", letterSpacing: ".06em", textTransform: "uppercase" }}>About Us</h3>
                          <p style={{ fontSize: "0.875rem", color: "#4e6b80", lineHeight: 1.8, marginBottom: 14 }}>{data.content.aboutText}</p>
                          <p style={{ fontSize: "0.875rem", color: "#4e6b80" }}>email: <a href={`mailto:${data.content.email}`} style={{ color: "#2b7a9a", fontWeight: 500 }}>{data.content.email}</a></p>
                          <p style={{ fontSize: "0.875rem", color: "#4e6b80", marginTop: 4 }}>phone: {data.content.phone}</p>
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 14, color: "#1a2e42", letterSpacing: ".06em", textTransform: "uppercase" }}>Our Gallery</h3>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                            {data.images.gal.slice(0, 6).map((src, i) => (
                              <div key={i} style={{ borderRadius: 4, overflow: "hidden" }}>
                                <img src={src} alt="" style={{ width: "100%", height: 56, objectFit: "cover" }} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 14, color: "#1a2e42", letterSpacing: ".06em", textTransform: "uppercase" }}>Navigation</h3>
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
              {page === "about" && <AboutPage content={data.content} images={data.images} />}

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
            <h2 className="display" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1a2e42", marginBottom: 6 }}>Welcome Back</h2>
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
              <button onClick={login} style={{ padding: "13px", background: "#1e3248", color: "#fff",
                border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>
                Sign In
              </button>
              <button onClick={() => { setShowLogin(false); setForgotStep("input_user"); }}
                style={{ background: "none", border: "none", color: "#3d8fab", fontSize: 13, cursor: "pointer", textAlign: "center", padding: "4px 0" }}>
                Lupa sandi? Reset via OTP
              </button>
            </div>
            <div style={{ marginTop: 24, padding: "14px", background: "#f4f9fb", borderRadius: 6, fontSize: 11, color: "#7a9db0", lineHeight: 1.8 }}>
              <strong style={{ display: "block", marginBottom: 4, color: "#4a6680" }}>Demo Credentials:</strong>
              admin: administrator / admin123<br />writer: writer1 / writer123<br />cs: cs1 / cs123
            </div>
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
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2e42", marginBottom: 6 }}>Lupa Sandi</h2>
                <p style={{ fontSize: "0.875rem", color: "#6b8999", marginBottom: 24 }}>Masukkan username akun Anda.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Username" value={forgotUser}
                    onChange={e => { setForgotUser(e.target.value); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep1()}
                    style={{ padding: "12px 14px", border: "1px solid #d0e4ee", borderRadius: 4, fontSize: 14, outline: "none" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep1}
                    style={{ padding: "13px", background: "#1e3248", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>
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
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2e42", marginBottom: 6 }}>Verifikasi Email</h2>
                <p style={{ fontSize: "0.875rem", color: "#6b8999", marginBottom: 24 }}>
                  Masukkan email yang terdaftar untuk akun <strong style={{ color: "#1a2e42" }}>{forgotUser}</strong>.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Email terdaftar" type="email" value={forgotEmail}
                    onChange={e => { setForgotEmail(e.target.value); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep2()}
                    style={{ padding: "12px 14px", border: "1px solid #d0e4ee", borderRadius: 4, fontSize: 14, outline: "none" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep2} disabled={forgotOTP.sending}
                    style={{ padding: "13px", background: forgotOTP.sending ? "#7a9db0" : "#1e3248", color: "#fff",
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
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2e42", marginBottom: 6 }}>Masukkan Kode OTP</h2>
                <p style={{ fontSize: "0.875rem", color: "#6b8999", marginBottom: 8 }}>
                  Kode 6 digit telah dikirim ke <strong style={{ color: "#1a2e42" }}>{forgotEmail}</strong>.
                </p>
                <p style={{ fontSize: "0.8125rem", color: "#f39c12", marginBottom: 20 }}>⏱ Berlaku 15 menit.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Kode OTP 6 digit" value={forgotOTP.input} maxLength={6}
                    onChange={e => { setForgotOTP(p => ({ ...p, input: e.target.value.replace(/\D/g, "") })); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep3()}
                    style={{ padding: "12px 14px", border: "1.5px solid #d0e4ee", borderRadius: 4, fontSize: 20,
                      letterSpacing: "8px", textAlign: "center", outline: "none", fontWeight: 700, color: "#1a2e42" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep3}
                    style={{ padding: "13px", background: "#1e3248", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>
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
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#1a2e42", marginBottom: 6 }}>Password Baru</h2>
                <p style={{ fontSize: "0.875rem", color: "#6b8999", marginBottom: 24 }}>
                  OTP terverifikasi ✅. Buat password baru untuk <strong style={{ color: "#1a2e42" }}>{forgotUser}</strong>.
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
          <div style={{ background: "#1e3248", color: "#fff", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, flexShrink: 0 }}>
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
                { id: "content", icon: "🔤", label: "Site Content", access: isAdmin },
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
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#1a2e42,#2b7a9a)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 700, fontFamily: "'Playfair Display',serif", border: "3px solid #ddeef5", overflow: "hidden", cursor: "pointer" }}
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
                      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.75rem", fontWeight: 900, color: "#1a2e42", marginBottom: 8, lineHeight: 1.1 }}>
                        {user.name || user.username}
                      </h2>
                      <div style={{ display: "flex", gap: 20, marginBottom: 14, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.8125rem", color: "#6b8999", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>📝</span> Published: <strong style={{ color: "#1a2e42" }}>{publishedCount}</strong>
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "#6b8999", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>👁</span> Drafts: <strong style={{ color: "#1a2e42" }}>{draftCount}</strong>
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "#6b8999", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>✉</span> Msgs: <strong style={{ color: "#1a2e42" }}>{data.messages.length}</strong>
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
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "#1a2e42", color: "#fff", borderRadius: 24, fontSize: "0.8125rem", fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: ".03em", transition: "background .2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#2b7a9a"}
                          onMouseLeave={e => e.currentTarget.style.background = "#1a2e42"}>
                          ✏ Buat Artikel
                        </button>
                      )}
                      <button onClick={() => setAdminTab("messages")}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "transparent", color: "#1a2e42", borderRadius: 24, fontSize: "0.8125rem", fontWeight: 700, border: "2px solid #ddeef5", cursor: "pointer", letterSpacing: ".03em", transition: "all .2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#1a2e42"; }}
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
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#1e3248", marginBottom: 28 }}>Profil Saya</h1>
                  <div className="profile-grid">
                    {/* Photo Card */}
                    <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", textAlign: "center" }}>
                      <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,#1a2e42,#2b7a9a)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff", fontWeight: 700, overflow: "hidden", border: "3px solid #ddeef5" }}>
                        {user.photo
                          ? <img src={user.photo} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : (user.name || user.username).charAt(0).toUpperCase()}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1a2e42", marginBottom: 2 }}>{user.name || user.username}</p>
                      <p style={{ fontSize: 11, color: "#7a9db0", marginBottom: 20, background: "#f4f9fb", display: "inline-block", padding: "3px 10px", borderRadius: 10 }}>{ROLES[user.role]?.label}</p>
                      {/* Upload Photo */}
                      <div style={{ marginTop: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#7a9db0", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Upload Foto Profil</label>
                        <input type="file" accept="image/*" onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = async () => {
                            const photo = reader.result;
                            const updated = { ...user, photo };
                            setUser(updated);
                            try { await window.storage?.set(`profile-${user.username}`, JSON.stringify({ name: updated.name, phone: updated.phone, email: updated.email, desc: updated.desc, photo })); } catch {}
                            notify("Foto profil diperbarui!");
                          };
                          reader.readAsDataURL(file);
                        }} style={{ fontSize: 11, border: "1.5px dashed #3d8fab", borderRadius: 6, padding: "6px", background: "#f0f9fc", color: "#3d8fab", width: "100%", boxSizing: "border-box" }} />
                        {user.photo && (
                          <button onClick={async () => {
                            const updated = { ...user, photo: "" };
                            setUser(updated);
                            try { await window.storage?.set(`profile-${user.username}`, JSON.stringify({ name: updated.name, phone: updated.phone, email: updated.email, desc: updated.desc, photo: "" })); } catch {}
                            notify("Foto profil dihapus.");
                          }} style={{ marginTop: 8, fontSize: 11, padding: "4px 12px", background: "#fee", color: "#e74c3c", borderRadius: 6, border: "none", cursor: "pointer" }}>Hapus Foto</button>
                        )}
                      </div>
                    </div>

                    {/* Edit Form */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {/* Data Diri */}
                      <div style={{ background: "#fff", borderRadius: 12, padding: "28px 28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", borderTop: "4px solid #3d8fab" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e3248", marginBottom: 20 }}>✏ Edit Data Diri</h3>
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
                              try { await window.storage?.set(`profile-${user.username}`, JSON.stringify({ name: profileEdit.name, phone: profileEdit.phone, email: profileEdit.email, desc: profileEdit.desc, photo: user.photo || "" })); } catch {}
                              setProfileEditMode(false);
                              notify("Data diri berhasil disimpan!");
                            }} style={{ padding: "10px 24px", background: "#1a2e42", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Simpan Perubahan</button>
                            <button onClick={() => setProfileEditMode(false)}
                              style={{ padding: "10px 20px", background: "#f4f9fb", color: "#4a6680", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Batal</button>
                          </div>
                        )}
                      </div>

                      {/* Ganti Sandi */}
                      <div style={{ background: "#fff", borderRadius: 12, padding: "28px 28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", borderTop: "4px solid #e74c3c" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e3248", marginBottom: 4 }}>🔒 Ganti Password</h3>
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
                            const r = await window.storage?.get(`profile-${user.username}`);
                            if (r?.value) { const p = JSON.parse(r.value); if (p._password) currentPass = p._password; }
                          } catch {}
                          if (profileEdit.oldPass !== currentPass) return notify("Password lama tidak sesuai.", "error");
                          if (profileEdit.newPass.length < 6) return notify("Password baru minimal 6 karakter.", "error");
                          if (profileEdit.newPass !== profileEdit.confirmPass) return notify("Konfirmasi password tidak cocok.", "error");
                          try {
                            const existing = await window.storage?.get(`profile-${user.username}`);
                            const prev = existing?.value ? JSON.parse(existing.value) : {};
                            await window.storage?.set(`profile-${user.username}`, JSON.stringify({ ...prev, _password: profileEdit.newPass }));
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
                        <h1 style={{ fontSize: 24, fontWeight: 500, color: "#1e3248" }}>Posts & CMS</h1>
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
                              background: adminSection === s ? "#1e3248" : "#fff",
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
                                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: "#1e3248", maxWidth: 240 }}>
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
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#1e3248", marginBottom: 8 }}>Image Management</h1>
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
                      <h3 style={{ fontSize: 15, fontWeight: 500, color: "#1e3248", marginBottom: 16 }}>{group.label}</h3>
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
                      <h1 style={{ fontSize: 24, fontWeight: 500, color: "#1e3248", marginBottom: 4 }}>Setting About Us</h1>
                      <p style={{ fontSize: 12, color: "#7a9db0" }}>Kelola semua konten halaman About Us yang tampil di website.</p>
                    </div>
                    <button onClick={() => { navigateTo("about"); setShowAdmin(false); }}
                      style={{ padding: "8px 16px", background: "#f4f9fb", border: "1px solid #d0e4ee", borderRadius: 6, fontSize: 12, color: "#3d8fab", cursor: "pointer", fontWeight: 600 }}>
                      👁 Lihat Halaman →
                    </button>
                  </div>

                  {/* HERO SECTION */}
                  <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #2b7a9a" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e3248", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
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
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e3248", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
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
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e3248", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
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
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#1a2e42", marginBottom: 8 }}>{data.content.aboutHeroTitle || "We Live for Adventure"}</div>
                      <div style={{ fontSize: 13, color: "#4e6b80", lineHeight: 1.7 }}>{(data.content.aboutHeroSub || data.content.aboutText || "").slice(0, 100)}{(data.content.aboutHeroSub || data.content.aboutText || "").length > 100 ? "…" : ""}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{ background: "#fff", borderRadius: 8, padding: "12px", textAlign: "center", border: "1px solid #ddeef5" }}>
                          <div style={{ fontSize: 22, marginBottom: 6 }}>{data.content[`aboutV${n}Icon`] || ["🌍","🛡","🌱","⭐"][n-1]}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#1a2e42" }}>{data.content[`aboutV${n}Title`] || ["Global Network","Safe & Trusted","Sustainable Travel","Award Winning"][n-1]}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "#daeaf3", borderRadius: 8, padding: "14px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1a2e42", marginBottom: 4 }}>{data.content.aboutContactTitle || "Get in Touch"}</div>
                      <div style={{ fontSize: 12, color: "#4e6b80" }}>{data.content.aboutContactSub || "We'd love to help plan your next event."}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* SITE CONTENT */}
              {adminTab === "content" && isAdmin && (
                <div className="fade-in">
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#1e3248", marginBottom: 6 }}>Site Content</h1>
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
                    { label: "About Text", key: "aboutText", multiline: true },
                    { label: "Email", key: "email" },
                    { label: "Phone", key: "phone" },
                    { label: "Login Button Text", key: "loginBtnText" },
                    { label: "Nav: Home", key: "nav1" },
                    { label: "Nav: About", key: "nav2" },
                    { label: "Nav: News", key: "nav3" },
                    { label: "Nav: Shop", key: "nav4" },
                    { label: "Nav: Destinations", key: "nav5" },
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

              {/* MESSAGES */}
              {adminTab === "messages" && canCS && (
                <div className="fade-in">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 500, color: "#1e3248" }}>Pesan Masuk</h1>
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
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#1a2e42,#2b7a9a)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                              {m.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3248", lineHeight: 1.3 }}>
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
                    <h1 style={{ fontSize: 24, fontWeight: 500, color: "#1e3248" }}>User Management</h1>
                    <button onClick={() => setUserMgmtOpen(v => !v)}
                      style={{ padding: "9px 20px", background: userMgmtOpen ? "#f4f9fb" : "#1a2e42", color: userMgmtOpen ? "#4a6680" : "#fff",
                        border: userMgmtOpen ? "1px solid #d0e4ee" : "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      {userMgmtOpen ? "✕ Batal" : "+ Tambah User"}
                    </button>
                  </div>

                  {/* Add User Form */}
                  {userMgmtOpen && (
                    <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 24, boxShadow: "0 2px 10px rgba(0,0,0,.07)", borderTop: "4px solid #27ae60" }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1e3248", marginBottom: 18 }}>➕ Tambah Akun Baru</h3>
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
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#1e3248" }}>{u.name || u.username}</div>
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

              {/* SETTINGS */}
              {adminTab === "settings" && isAdmin && (
                <div className="fade-in">
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#1e3248", marginBottom: 28 }}>Settings</h1>

                  {/* Logo Upload */}
                  <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #3d8fab" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 500, color: "#1e3248", marginBottom: 6 }}>🖼 Logo Upload</h3>
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
                        <input type="file" accept="image/*" onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            save({ ...data, content: { ...data.content, logoImage: reader.result } });
                            notify("Logo uploaded & applied to all sections!");
                          };
                          reader.readAsDataURL(file);
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

                  <div className="settings-grid">
                    {[
                      { title: "Firebase Config", desc: "Connect to Firestore for real-time data sync", btn: "Configure", color: "#f39c12" },
                      { title: "Cloudinary Config", desc: "Set up image hosting and transformation pipeline", btn: "Configure", color: "#3d8fab" },
                      { title: "Vercel Deploy", desc: "Deploy updates to production via Vercel CI/CD", btn: "Deploy", color: "#1e3248" },
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
                        <h3 style={{ fontSize: 15, fontWeight: 500, color: "#1e3248", marginBottom: 8 }}>{s.title}</h3>
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
