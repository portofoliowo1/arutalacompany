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
          <div style={{ display: "flex", borderBottom: "2px solid #edfafc" }} className="dash-tab-row">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setDashTab(t.id)}
                style={{ flex: 1, padding: "14px 8px", fontSize: "0.8125rem", fontWeight: dashTab === t.id ? 700 : 500,
                  color: dashTab === t.id ? "#0d3b66" : "#4a7f98", background: dashTab === t.id ? "#fff" : "#f5fdff",
                  border: "none", borderBottom: dashTab === t.id ? "2px solid #0d3b66" : "2px solid transparent",
                  marginBottom: -2, cursor: "pointer", transition: "all .15s" }}>
                {t.label}
              </button>
            ))}
          </div>

          {dashTab === "notifications" && (
            <div style={{ padding: "8px 0" }}>
              {data.messages.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "#4a7f98", fontSize: "0.875rem" }}>🔔 Belum ada notifikasi.</div>
              ) : data.messages.slice().reverse().slice(0, 5).map(m => (
                <div key={m.id} style={{ display: "flex", gap: 14, padding: "16px 20px", borderBottom: "1px solid #edfafc", alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: "#edfafc", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✉️</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.875rem", color: "#0d3b66", lineHeight: 1.6, marginBottom: 4 }}>
                      Pesan baru dari <strong>{m.name}</strong> ({m.email}): <em style={{ color: "#1a5a78" }}>{m.message?.slice(0, 80)}{m.message?.length > 80 ? "…" : ""}</em>
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "#4a7f98" }}>{m.date}</span>
                    {!m.read && <span style={{ marginLeft: 8, fontSize: "0.625rem", background: "#e74c3c", color: "#fff", borderRadius: 8, padding: "1px 7px", fontWeight: 700 }}>BARU</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {dashTab === "articles" && canEdit && (
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0d3b66" }}>Artikel Terbaru</span>
                <button onClick={() => { setAdminTab("cms"); setCmsEditPost("new"); }}
                  style={{ fontSize: "0.75rem", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 16, padding: "5px 14px", fontWeight: 600, cursor: "pointer" }}>+ Baru</button>
              </div>
              {allPosts.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#4a7f98" }}>Belum ada artikel.</p>
              ) : allPosts.slice(-5).reverse().map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #edfafc" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                    <img loading="lazy" src={p.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0d3b66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
                    <span style={{ fontSize: "0.75rem", color: "#4a7f98" }}>{p.section} · {formatDate(p.date)}</span>
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
                  { label: "Total Artikel", value: allPosts.length, icon: "📄", color: "#0891b2" },
                  { label: "Tayang", value: publishedCount, icon: "✅", color: "#27ae60" },
                  { label: "Draft", value: draftCount, icon: "📋", color: "#f39c12" },
                  { label: "Pesan Masuk", value: data.messages.length, icon: "✉️", color: "#8e44ad" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,.1)", borderRadius: 10, padding: "16px 18px", backdropFilter: "blur(6px)", borderLeft: `3px solid ${s.color}` }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: s.color, fontFamily: "'Playfair Display',serif" }}>{s.value}</div>
                    <div style={{ fontSize: "0.8125rem", color: "#4a7f98", marginTop: 2 }}>{s.icon} {s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#edfafc", borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4a7f98", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>Distribusi per Seksi</div>
                {["news","shop","destinations"].map(s => {
                  const total = allPosts.length || 1;
                  const count = (data.posts?.[s] || []).length;
                  const pct = Math.round(count / total * 100);
                  return (
                    <div key={s} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.8125rem", color: "#0d3b66", fontWeight: 600 }}>{SECTION_LABELS[s]}</span>
                        <span style={{ fontSize: "0.8125rem", color: "#4a7f98" }}>{count}</span>
                      </div>
                      <div style={{ height: 6, background: "#c0e8f0", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#0891b2", borderRadius: 3, transition: "width .5s" }} />
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
                <div key={i} style={{ marginBottom: 14, padding: "14px 16px", background: "#edfafc", borderRadius: 8, borderLeft: "3px solid #0891b2" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0d3b66", marginBottom: 6 }}>❓ {faq.q}</p>
                  <p style={{ fontSize: "0.8125rem", color: "#1a5a78", lineHeight: 1.65 }}>{faq.a}</p>
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
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #edfafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.125rem", fontWeight: 800, color: "#0d3b66" }}>Top Kontributor</span>
            <span style={{ fontSize: "0.6875rem", color: "#4a7f98" }}>Artikel tayang</span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {(() => {
              const authorMap = {};
              allPosts.filter(p => p.status === "published").forEach(p => { authorMap[p.author] = (authorMap[p.author] || 0) + 1; });
              const sorted = Object.entries(authorMap).sort((a,b) => b[1]-a[1]).slice(0, 3);
              const medals = ["🥇","🥈","🥉"];
              if (!sorted.length) return <p style={{ padding: "16px 20px", fontSize: "0.8125rem", color: "#4a7f98" }}>Belum ada artikel tayang.</p>;
              return sorted.map(([author, count], i) => (
                <div key={author} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderBottom: "1px solid #edfafc" }}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0, minWidth: 28 }}>{medals[i]}</span>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0d3b66" }}>{author}</div>
                    <div style={{ fontSize: "0.75rem", color: "#4a7f98" }}>Artikel: {count}</div>
                  </div>
                  {author === user.username && <span style={{ fontSize: "0.625rem", background: "#e8f8ef", color: "#27ae60", borderRadius: 8, padding: "2px 7px", fontWeight: 700 }}>YOU</span>}
                </div>
              ));
            })()}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", background: "#edfafc" }}>
              <span style={{ fontSize: "1.25rem", minWidth: 28 }}>—</span>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#0891b2,#22d3ee)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0d3b66" }}>You ({user.username})</div>
                <div style={{ fontSize: "0.75rem", color: "#4a7f98" }}>Artikel: {allPosts.filter(p => p.author === user.username && p.status === "published").length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Akses Cepat */}
        <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #edfafc" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.125rem", fontWeight: 800, color: "#0d3b66" }}>Akses Cepat</span>
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
                style={{ textAlign: "left", padding: "9px 12px", background: "#edfafc", border: "none", borderRadius: 7, fontSize: "0.8125rem", color: "#0d3b66", fontWeight: 500, cursor: "pointer", transition: "background .15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#c0e8f0"}
                onMouseLeave={e => e.currentTarget.style.background = "#edfafc"}>
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
      title: "Spa & Wellness di Ubud: Surga Tersembunyi Bali",
      date: "2026-04-03", author: "writer1", category: "Lifestyle",
      coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
      excerpt: "Rasakan ketenangan sejati di resort spa premium Ubud yang menyatu dengan alam Bali.",
      content: [
        { type: "paragraph", value: "Ubud, jantung seni dan budaya Bali, telah lama menjadi surga bagi mereka yang mencari kedamaian jiwa dan raga. Dikelilingi hamparan sawah terasering hijau dan hutan tropis yang rindang, Ubud menawarkan pengalaman spa yang benar-benar menyatu dengan alam." },
        { type: "paragraph", value: "Dari pijat batu vulkanik khas Bali hingga ritual penyembuhan tradisional Melukat, setiap treatment dirancang untuk memulihkan tubuh dan menenangkan pikiran setelah perjalanan panjang." },
        { type: "image", value: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Bali_Usaada_Bali_traditional_healing.jpg/1280px-Bali_Usaada_Bali_traditional_healing.jpg", caption: "Ritual penyembuhan tradisional Bali di Ubud" },
        { type: "paragraph", value: "Nikmati sesi yoga di tepi sawah saat fajar, atau manjakan diri dengan lulur beras Bali yang legendaris. Ubud adalah pengalaman yang tidak akan terlupakan." },
      ],
      tags: ["spa", "bali", "wellness", "ubud"],
    },
    {
      id: 2, section: "news", status: "published",
      title: "Pantai Tersembunyi di Raja Ampat yang Memukau",
      date: "2026-04-10", author: "writer1", category: "Beach",
      coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      excerpt: "Jelajahi pantai-pantai tersembunyi Raja Ampat dengan air sejernih kristal dan terumbu karang yang menakjubkan.",
      content: [
        { type: "paragraph", value: "Raja Ampat, permata tersembunyi di ujung timur Indonesia, menyimpan ribuan pulau kecil dengan pantai berpasir putih yang belum banyak terjamah. Perjalanan menuju pantai-pantai ini memang membutuhkan usaha ekstra, namun hasilnya sebanding dengan setiap tetes keringat." },
        { type: "paragraph", value: "Di bawah permukaan laut Raja Ampat, dunia yang sama mengagumkannya menanti. Keanekaragaman hayati laut di sini adalah yang tertinggi di dunia — ribuan spesies ikan, pari manta, dan terumbu karang warna-warni." },
        { type: "image", value: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg", caption: "Gugusan pulau Raja Ampat dari ketinggian" },
      ],
      tags: ["raja ampat", "pantai", "diving", "papua"],
    },
    {
      id: 3, section: "news", status: "published",
      title: "Kenangan Tak Terlupakan Bersama Arutala Organizer",
      date: "2026-04-15", author: "writer1", category: "Experience",
      coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      excerpt: "Setiap perjalanan bersama Arutala adalah cerita yang akan selalu dikenang.",
      content: [
        { type: "paragraph", value: "Perjalanan bukan sekadar soal destinasi — melainkan tentang momen yang membuat hati terasa penuh. Saat matahari terbenam di Pura Tanah Lot, saat pertama kali menginjakkan kaki di hamparan sawah Tegalalang, atau saat tawa riang di tengah petualangan bersama orang-orang tersayang." },
        { type: "paragraph", value: "Bersama Arutala Organizer, setiap detail perjalanan Anda direncanakan dengan penuh perhatian. Kami percaya bahwa kenangan terbaik lahir dari pengalaman yang dirancang dengan hati." },
      ],
      tags: ["kenangan", "arutala", "wisata", "bali"],
    },
  ],
  shop: [
    {
      id: 10, section: "shop", status: "published",
      title: "Paket Perlengkapan Wisata Nusantara — Seri Explorer",
      date: "2026-03-20", author: "writer1", category: "Perlengkapan",
      coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      excerpt: "Perlengkapan wisata terbaik untuk menjelajahi keindahan nusantara dari Bromo hingga Raja Ampat.",
      badge: "Terlaris",
      content: [
        { type: "paragraph", value: "Dirancang khusus untuk petualang nusantara, paket perlengkapan Seri Explorer menghadirkan kenyamanan dan ketahanan dalam satu bundel praktis. Cocok untuk perjalanan ke pegunungan Bromo, pantai Raja Ampat, maupun hutan Kalimantan." },
        { type: "paragraph", value: "Isi paket: tas ransel 40L waterproof, poncho hujan, sandal gunung, serta peta destinasi unggulan Indonesia. Semua dikemas dalam satu tas yang ringkas dan stylish." },
      ],
      tags: ["perlengkapan", "wisata", "nusantara", "hiking"],
    },
    {
      id: 11, section: "shop", status: "published",
      title: "Kamera Dokumentasi Perjalanan — Edisi Nusantara",
      date: "2026-03-25", author: "writer1", category: "Fotografi",
      coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Borobudur_Temple_Compounds-en.svg/1280px-Borobudur_Temple_Compounds-en.svg.png",
      excerpt: "Abadikan setiap momen perjalanan Anda dengan sempurna, dari puncak Rinjani hingga kedalaman laut Bunaken.",
      content: [
        { type: "paragraph", value: "Setiap sudut Indonesia layak diabadikan — dari kemegahan Candi Borobudur yang misterius hingga kecantikan bawah laut Bunaken yang tiada duanya. Dengan kamera yang tepat, setiap momen menjadi karya yang bisa dinikmati selamanya." },
      ],
      tags: ["fotografi", "kamera", "wisata", "nusantara"],
    },
  ],
  destinations: [
    {
      id: 20, section: "destinations", status: "published",
      title: "Taman Nasional Komodo — Warisan Dunia Indonesia",
      date: "2026-02-10", author: "writer1", category: "Alam",
      coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Komodo_dragon_%28Varanus_komodoensis%29_2.jpg/1280px-Komodo_dragon_%28Varanus_komodoensis%29_2.jpg",
      excerpt: "Rumah bagi komodo legendaris dan surga diving kelas dunia di jantung Nusa Tenggara Timur.",
      content: [
        { type: "paragraph", value: "Taman Nasional Komodo adalah salah satu destinasi paling dramatis di Indonesia. Lanskap vulkanik yang kasar menjadi rumah bagi kadal terbesar di dunia — Komodo (Varanus komodoensis) — yang hanya bisa ditemukan di sini." },
        { type: "paragraph", value: "Di bawah permukaannya, perairan Komodo tak kalah spektakuler. Para penyelam akan bertemu manta raya raksasa, hiu, dan taman karang warna-warni yang menjadi salah satu terbaik di dunia." },
        { type: "image", value: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pink_Beach_Komodo.jpg/1280px-Pink_Beach_Komodo.jpg", caption: "Pink Beach Komodo yang ikonik" },
        { type: "paragraph", value: "Waktu terbaik berkunjung: April–Desember saat laut tenang. Paket liveaboard diving sangat direkomendasikan untuk pengalaman penuh." },
      ],
      tags: ["komodo", "ntt", "diving", "alam"],
    },
    {
      id: 21, section: "destinations", status: "published",
      title: "Gunung Bromo — Negeri di Atas Awan Jawa Timur",
      date: "2026-02-20", author: "writer1", category: "Alam",
      coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      excerpt: "Saksikan keajaiban matahari terbit di Gunung Bromo — pengalaman paling ikonik di Jawa Timur.",
      content: [
        { type: "paragraph", value: "Tidak ada banyak pemandangan yang bisa menandingi keindahan matahari terbit di Gunung Bromo. Lautan pasir seluas 5.250 hektare, kepulan asap kawah, dan siluet Semeru di kejauhan menciptakan panorama yang terasa seperti dari planet lain." },
        { type: "paragraph", value: "Taman Nasional Bromo Tengger Semeru menawarkan berbagai aktivitas: jeep tour melintasi lautan pasir, trekking ke bibir kawah, hingga menyaksikan upacara Yadnya Kasada yang sakral dari suku Tengger." },
      ],
      tags: ["bromo", "jawa timur", "gunung", "alam"],
    },
  ],
};

const DEFAULT_DATA = {
  images: {
    hero: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
    ],
    adv: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pink_Beach_Komodo.jpg/1280px-Pink_Beach_Komodo.jpg",
    ],
    gal: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Komodo_dragon_%28Varanus_komodoensis%29_2.jpg/1280px-Komodo_dragon_%28Varanus_komodoensis%29_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pink_Beach_Komodo.jpg/1280px-Pink_Beach_Komodo.jpg",
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
    logoSingleLine: false,
    logoFont: "Playfair Display",
    logoColor: "#111111",
    logoShadow: "0 1px 6px rgba(0,0,0,.35), 0 2px 14px rgba(0,0,0,.18)",
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
    /* ── EVENT PLAN (3 paket) ── */
    {
      id: 1,
      category: "event",
      title: "Paket Event Starter",
      badge: "Terjangkau",
      badgeColor: "#27ae60",
      price: "Rp 3.500.000",
      priceNote: "/ event",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Seminar_Nasional_Indonesia.jpg/1280px-Seminar_Nasional_Indonesia.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gathering_event_Indonesia.jpg/1280px-Gathering_event_Indonesia.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Seminar_Nasional_Indonesia.jpg/1280px-Seminar_Nasional_Indonesia.jpg",
      description: "Paket event entry-level ideal untuk seminar, gathering kecil, atau peluncuran produk dengan kapasitas hingga 100 tamu. Semua kebutuhan dasar sudah tercakup.",
      features: [
        "Konsultasi event 1x pertemuan",
        "Dekorasi standar",
        "Dokumentasi foto (3 jam)",
        "Koordinasi 3 vendor",
        "Rundown & timeline acara",
        "MC profesional",
        "Kapasitas hingga 100 tamu",
      ],
      highlight: false,
    },
    {
      id: 2,
      category: "event",
      title: "Paket Event Profesional",
      badge: "Populer",
      badgeColor: "#0891b2",
      price: "Rp 12.500.000",
      priceNote: "/ event",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Konser_Indonesia.jpg/1280px-Konser_Indonesia.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Corporate_event_Indonesia.jpg/1280px-Corporate_event_Indonesia.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Konser_Indonesia.jpg/1280px-Konser_Indonesia.jpg",
      description: "Paket lengkap untuk corporate event, seminar nasional, team building, dan peluncuran brand. Cocok untuk 100–300 tamu dengan layanan penuh hari H.",
      features: [
        "Konsultasi event tak terbatas",
        "Dekorasi tematik custom",
        "Dokumentasi foto & video (full day)",
        "Koordinasi 8 vendor",
        "Sound system & lighting profesional",
        "MC bilingual",
        "Coffee break & makan siang",
        "Kapasitas 100–300 tamu",
      ],
      highlight: true,
    },
    {
      id: 3,
      category: "event",
      title: "Paket Gala Dinner & Award Night",
      badge: "Premium",
      badgeColor: "#c0392b",
      price: "Rp 35.000.000",
      priceNote: "/ event",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
      description: "Malam penghargaan perusahaan dengan nuansa ballroom mewah, red carpet, dan entertainment eksklusif. Dirancang untuk kesan tak terlupakan bagi 200–500 tamu undangan.",
      features: [
        "Dekorasi ballroom premium",
        "Sound & lighting sinematik",
        "MC bilingual & berpengalaman",
        "Catering fine dining 300 pax",
        "Live music & entertainment",
        "Dokumentasi foto & video sinematik",
        "Red carpet & photo booth",
        "Event manager penuh hari H",
      ],
      highlight: false,
    },

    /* ── TRAVELING (4 paket — Bali, Jogja, Solo, Custom) ── */
    {
      id: 4,
      category: "traveling",
      pkgId: "bali",
      title: "Paket Bali",
      tagline: "Surga Budaya & Alam Nusantara",
      badge: "PALING POPULER",
      badgeColor: "#e8a020",
      accent: "#e8a020",
      accentLight: "#fff8e6",
      duration: "4 Hari 3 Malam",
      minPeserta: "30",
      price: "520000",
      priceNote: "/ orang (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1200px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/800px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Garuda_Wisnu_Kencana_Cultural_Park_Bali.jpg/800px-Garuda_Wisnu_Kencana_Cultural_Park_Bali.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1200px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      description: "Paket karyawisata ke Bali — Tanah Lot, Ubud, GWK, Uluwatu & Bedugul. Hotel bintang 3–4, konsumsi 3x sehari, tour leader & dokumentasi profesional.",
      features: ["Hotel Bintang 3–4", "Konsumsi 3x Sehari", "Dokumentasi Foto", "Tour Leader", "Tiket Masuk Destinasi", "Asuransi Jiwa", "ID Card & Buku Panduan"],
      highlight: true,
      facilities: [
        { icon: "🏨", label: "Hotel Bintang 3–4", detail: "Kamar twin sharing ber-AC" },
        { icon: "🍽", label: "Konsumsi 3x Sehari", detail: "Sarapan, makan siang, makan malam" },
        { icon: "📸", label: "Dokumentasi Foto", detail: "Fotografer profesional sepanjang tour" },
        { icon: "👨‍💼", label: "Tour Leader", detail: "Pendamping berpengalaman" },
        { icon: "🎫", label: "Tiket Masuk", detail: "Semua destinasi dalam itinerary" },
        { icon: "💊", label: "P3K Lengkap", detail: "Kotak P3K di setiap kendaraan" },
        { icon: "🛡", label: "Asuransi Jiwa", detail: "Seluruh peserta tercover" },
        { icon: "💧", label: "Air Mineral", detail: "Gratis sepanjang perjalanan" },
      ],
      services: [
        "Koordinasi langsung dengan pihak sekolah",
        "Itinerary custom sesuai kurikulum sekolah",
        "Pemandu lokal bersertifikat di tiap destinasi",
        "ID card & buku panduan peserta",
        "Laporan perjalanan & absensi harian",
        "Snack 2x selama di kendaraan",
        "Free program tambahan (opsional)",
      ],
      destinations: [
        { no: "01", name: "Tanah Lot", sub: "Tabanan, Bali", tag: "Pura Hindu · Keindahan Alam", title: "Pura Megah di Atas Batu Karang Laut", desc: "Tanah Lot adalah ikon Bali yang paling terkenal. Pura Hindu ini berdiri kokoh di atas batu karang di tengah laut. Saat sunset, pemandangannya luar biasa indah dan menjadi momen yang tidak terlupakan.", points: ["Pura ikonik di atas batu karang", "Sunset paling populer di Bali", "Pertunjukan Tari Kecak (opsional)", "Pasar seni & kerajinan khas Bali"], duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/800px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg" },
        { no: "02", name: "Ubud & Tegalalang", sub: "Gianyar, Bali", tag: "Alam & Seni · Pusat Budaya Bali", title: "Jantung Seni dan Alam Bali", desc: "Ubud adalah jantung seni Bali — dari sawah terasering Tegalalang yang memukau hingga Monkey Forest yang seru. Siswa bisa belajar tentang ekosistem pertanian tradisional Bali.", points: ["Tegalalang Rice Terrace ikonik", "Sacred Monkey Forest Sanctuary", "Museum Puri Lukisan", "Belanja di Pasar Ubud & workshop ukiran"], duration: "3–4 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/800px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg" },
        { no: "03", name: "GWK & Pantai Kuta", sub: "Badung, Bali", tag: "Budaya Hindu · Pantai Ikonik", title: "Garuda Wisnu Kencana & Pasir Putih Kuta", desc: "Garuda Wisnu Kencana (GWK) adalah taman budaya megah dengan patung setinggi 121 meter. Dilanjutkan ke Pantai Kuta yang legendaris untuk kegiatan bebas dan foto bersama.", points: ["Patung GWK tertinggi di Indonesia", "Pertunjukan tari budaya Bali", "Pantai Kuta pasir putih ikonik", "Free time foto & bermain di tepi pantai"], duration: "3–4 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Garuda_Wisnu_Kencana_Cultural_Park_Bali.jpg/800px-Garuda_Wisnu_Kencana_Cultural_Park_Bali.jpg" },
        { no: "04", name: "Uluwatu", sub: "Badung, Bali", tag: "Spiritual · Tebing & Samudra", title: "Pura Tebing Karang Selatan Bali", desc: "Pura Luhur Uluwatu berdiri megah di tepi tebing karang setinggi 70 meter di atas Samudra Hindia. Salah satu pura sad kahyangan di Bali yang wajib dikunjungi.", points: ["Pura di tepi tebing 70 meter", "Pemandangan Samudra Hindia", "Kecak Fire Dance saat sunset", "Konservasi monyet ekor panjang"], duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Uluwatu_Temple_Bali_Indonesia.jpg/800px-Uluwatu_Temple_Bali_Indonesia.jpg" },
        { no: "05", name: "Bedugul & Danau Beratan", sub: "Tabanan, Bali", tag: "Alam Pegunungan · Danau Vulkanik", title: "Pura Ulun Danu di Tengah Danau", desc: "Bedugul menawarkan udara sejuk pegunungan dengan pemandangan Danau Beratan yang menakjubkan. Pura Ulun Danu Beratan yang mengapung di atas danau adalah ikon paling ikonik Bali.", points: ["Pura Ulun Danu Beratan ikonik", "Kebun Raya Bedugul 157 ha", "Strawberry farm & pasar buah lokal", "Udara sejuk 18–22°C, 1.239 mdpl"], duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ulun_Danu_Temple_Bedugul_Bali.jpg/800px-Ulun_Danu_Temple_Bedugul_Bali.jpg" },
      ],
      prices: [
        { vehicle: "Bus Executive", icon: "🚌", capacity: "35–60 org", price: "520.000", points: ["Full AC Double Blower","Sleeper / Reclining seat","TV LCD + Audio System","Toilet dalam bus","USB charging per kursi","Snack 2x perjalanan"] },
        { vehicle: "Elf / Hiace",   icon: "🚐", capacity: "12–20 org", price: "590.000", points: ["Full AC Split","Monitor + Speaker","Kursi empuk & nyaman","Power inverter 12V","Air mineral gratis","Bagasi atas & bawah"] },
        { vehicle: "Mobil Innova",  icon: "🚗", capacity: "5–7 org",   price: "720.000", points: ["AC Dual Zone","Captain seat","Bluetooth Audio","USB-A & USB-C","Air mineral gratis","GPS navigasi"] },
        { vehicle: "Pick Up",       icon: "🛻", capacity: "8–15 org",  price: "290.000", points: ["Terbuka / angin alami","Bangku kayu + pegangan","Terpal pelindung","Air mineral gratis","Rute lokal / pendek","Paling ekonomis"] },
      ],
    },
    {
      id: 5,
      category: "traveling",
      pkgId: "jogja",
      title: "Paket Yogyakarta",
      tagline: "Kota Budaya, Sejarah & Pendidikan",
      badge: "",
      badgeColor: "#0d9e8a",
      accent: "#0d9e8a",
      accentLight: "#e0f7f4",
      duration: "3 Hari 2 Malam",
      minPeserta: "25",
      price: "Rp 285.000",
      priceNote: "/ orang (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/1200px-Borobudur_ship.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Prambanan.jpg/800px-Prambanan.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Malioboro_yogyakarta.jpg/800px-Malioboro_yogyakarta.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/1200px-Borobudur_ship.jpg",
      description: "Paket karyawisata edukatif ke Yogyakarta — Borobudur, Prambanan, Malioboro & Keraton. Hotel bintang 2–3, konsumsi 3x, pemandu lokal bersertifikat.",
      features: ["Hotel Bintang 2–3", "Konsumsi 3x Sehari (incl. Gudeg)", "Dokumentasi Foto", "Tour Leader", "Tiket Masuk Destinasi", "Asuransi Jiwa", "Workshop Batik Opsional"],
      highlight: false,
      facilities: [
        { icon: "🏨", label: "Hotel Bintang 2–3", detail: "Kamar twin sharing ber-AC" },
        { icon: "🍽", label: "Konsumsi 3x Sehari", detail: "Termasuk gudeg khas Jogja" },
        { icon: "📸", label: "Dokumentasi Foto", detail: "Fotografer profesional" },
        { icon: "👨‍💼", label: "Tour Leader", detail: "Pendamping berpengalaman" },
        { icon: "🎫", label: "Tiket Masuk", detail: "Semua destinasi dalam itinerary" },
        { icon: "💊", label: "P3K Lengkap", detail: "Kotak P3K di kendaraan" },
        { icon: "🛡", label: "Asuransi Jiwa", detail: "Seluruh peserta tercover" },
        { icon: "💧", label: "Air Mineral", detail: "Gratis sepanjang perjalanan" },
      ],
      services: [
        "Koordinasi langsung dengan pihak sekolah",
        "Itinerary edukatif sesuai kurikulum",
        "Pemandu lokal bersertifikat",
        "ID card & buku panduan peserta",
        "Laporan perjalanan & absensi harian",
        "Snack 1x di kendaraan",
        "Workshop batik opsional",
      ],
      destinations: [
        { no: "01", name: "Candi Borobudur", sub: "Magelang, Jawa Tengah", tag: "Warisan Dunia UNESCO · Sejarah & Budaya", title: "Candi Buddha Terbesar di Dunia", desc: "Candi Borobudur merupakan monumen Buddha terbesar yang diakui UNESCO sebagai warisan dunia. Siswa dapat mempelajari arsitektur kuno, relief cerita Buddha, dan filosofi hidup dari ukiran batu yang menakjubkan.", points: ["Relief 2.672 panel bercerita Buddha", "Pemandangan matahari terbit spektakuler", "Museum interaktif di kompleks candi", "Sarung batik gratis untuk kunjungan"], duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/800px-Borobudur_ship.jpg" },
        { no: "02", name: "Candi Prambanan", sub: "Sleman, Yogyakarta", tag: "Warisan Dunia UNESCO · Hindu Kuno", title: "Kompleks Candi Hindu Termegah", desc: "Prambanan adalah kompleks candi Hindu terbesar di Indonesia. Arsitekturnya yang menjulang mencerminkan kejayaan Kerajaan Mataram Kuno. Cerita Ramayana terukir indah di setiap dindingnya.", points: ["Tiga candi utama: Siwa, Brahma & Wisnu", "Sendratari Ramayana (opsional malam)", "Area taman luas untuk diskusi", "Pemandu khusus pelajar bersertifikat"], duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Prambanan.jpg/800px-Prambanan.jpg" },
        { no: "03", name: "Malioboro & Keraton", sub: "Kota Yogyakarta", tag: "Budaya Lokal · Pusat Kota Jogja", title: "Jantung Budaya Yogyakarta", desc: "Jalan Malioboro adalah ikon paling terkenal Yogyakarta. Di sini siswa belajar tentang kerajinan batik, kuliner khas Jogja, dan sistem pemerintahan Kesultanan Ngayogyakarta Hadiningrat.", points: ["Kunjungan Keraton Ngayogyakarta", "Belanja oleh-oleh khas Jogja", "Naik andong & becak tradisional", "Workshop membatik bersama pengrajin"], duration: "3–4 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Malioboro_yogyakarta.jpg/800px-Malioboro_yogyakarta.jpg" },
      ],
      prices: [
        { vehicle: "Bus Executive", icon: "🚌", capacity: "35–60 org", price: "285.000", points: ["Full AC Double Blower","TV LCD + Audio System","Toilet dalam bus","Snack 1x perjalanan","USB charging per kursi","Reclining seat"] },
        { vehicle: "Elf / Hiace",   icon: "🚐", capacity: "12–20 org", price: "320.000", points: ["Full AC Split","Monitor + Speaker","Kursi empuk","Air mineral gratis","Power inverter 12V","Bagasi atas & bawah"] },
        { vehicle: "Mobil Innova",  icon: "🚗", capacity: "5–7 org",   price: "380.000", points: ["AC Dual Zone","Captain seat","Bluetooth Audio","USB-A & USB-C","Air mineral gratis","GPS navigasi"] },
        { vehicle: "Pick Up",       icon: "🛻", capacity: "8–15 org",  price: "145.000", points: ["Terbuka / angin alami","Bangku kayu + pegangan","Terpal pelindung","Air mineral gratis","Rute lokal / pendek","Paling ekonomis"] },
      ],
    },
    {
      id: 6,
      category: "traveling",
      pkgId: "solo",
      title: "Paket Solo",
      tagline: "Kota Batik, Tradisi & Kuliner Otentik",
      badge: "PAKET HEMAT",
      badgeColor: "#c0392b",
      accent: "#c0392b",
      accentLight: "#fdf0ef",
      duration: "2 Hari 1 Malam",
      minPeserta: "20",
      price: "Rp 195.000",
      priceNote: "/ orang (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Kraton_Surakarta.jpg/1200px-Kraton_Surakarta.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Batik_Laweyan_Solo.jpg/800px-Batik_Laweyan_Solo.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Pasar_Gede_Surakarta.jpg/800px-Pasar_Gede_Surakarta.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Kraton_Surakarta.jpg/1200px-Kraton_Surakarta.jpg",
      description: "Paket karyawisata ke Solo — Keraton Surakarta, Kampung Batik Laweyan, dan Pasar Gede. Paket paling terjangkau dengan nuansa seni & budaya Jawa.",
      features: ["Hotel Bintang 2", "Konsumsi 2x Sehari", "Dokumentasi Foto", "Tour Leader", "Tiket Masuk Destinasi", "Asuransi Jiwa", "Workshop Membatik"],
      highlight: false,
      facilities: [
        { icon: "🏨", label: "Hotel Bintang 2", detail: "Kamar twin sharing ber-AC" },
        { icon: "🍽", label: "Konsumsi 2x Sehari", detail: "Sarapan & makan siang" },
        { icon: "📸", label: "Dokumentasi Foto", detail: "Tim fotografer" },
        { icon: "👨‍💼", label: "Tour Leader", detail: "Pendamping berpengalaman" },
        { icon: "🎫", label: "Tiket Masuk", detail: "Semua destinasi paket" },
        { icon: "💊", label: "P3K Lengkap", detail: "Kotak P3K di kendaraan" },
        { icon: "🛡", label: "Asuransi Jiwa", detail: "Seluruh peserta" },
        { icon: "💧", label: "Air Mineral", detail: "Gratis di kendaraan" },
      ],
      services: [
        "Koordinasi langsung dengan guru pendamping",
        "Itinerary berbasis seni dan budaya Jawa",
        "Pemandu lokal berpengalaman",
        "ID card peserta",
        "Laporan perjalanan harian",
        "Snack 1x di kendaraan",
      ],
      destinations: [
        { no: "01", name: "Keraton Surakarta", sub: "Surakarta, Jawa Tengah", tag: "Sejarah & Budaya · Istana Kerajaan", title: "Pusat Kebudayaan Jawa di Solo", desc: "Keraton Surakarta Hadiningrat adalah istana resmi Kasunanan Surakarta. Siswa bisa melihat langsung koleksi pusaka, busana adat kerajaan, dan mempelajari sejarah Kerajaan Mataram yang kaya.", points: ["Koleksi pusaka benda bersejarah kerajaan", "Pemandu khusus sejarah Mataram", "Pertunjukan wayang dan gamelan", "Galeri batik keraton asli"], duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Kraton_Surakarta.jpg/800px-Kraton_Surakarta.jpg" },
        { no: "02", name: "Kampung Batik Laweyan", sub: "Laweyan, Surakarta", tag: "Industri Kreatif · Warisan Budaya", title: "Sentra Batik Tertua di Indonesia", desc: "Laweyan adalah kampung batik tertua di Indonesia yang sudah ada sejak abad ke-16. Siswa bisa belajar langsung proses membatik dari pengrajin berpengalaman dan membawa pulang karya mereka sendiri.", points: ["Workshop membatik langsung dengan pengrajin", "Galeri batik tulis asli", "Sejarah batik warisan UNESCO", "Oleh-oleh langsung dari pengrajin"], duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Batik_Laweyan_Solo.jpg/800px-Batik_Laweyan_Solo.jpg" },
        { no: "03", name: "Pasar Gede & Kuliner Solo", sub: "Pusat Kota Solo", tag: "Kuliner & Budaya Lokal", title: "Surga Kuliner Otentik Kota Solo", desc: "Pasar Gede adalah pasar tradisional terbesar dan tertua di Solo. Siswa bisa mencicipi kuliner khas Solo seperti nasi liwet, serabi, timlo, dan brambang asem.", points: ["Arsitektur pasar kolonial Belanda bersejarah", "Kuliner: nasi liwet, serabi, timlo", "Interaksi langsung dengan pedagang lokal", "Sistem jual-beli tradisional Jawa"], duration: "1–2 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Pasar_Gede_Surakarta.jpg/800px-Pasar_Gede_Surakarta.jpg" },
      ],
      prices: [
        { vehicle: "Bus Executive", icon: "🚌", capacity: "35–60 org", price: "195.000", points: ["Full AC Double Blower","TV LCD + Audio System","Reclining seat","Snack 1x perjalanan","USB charging per kursi","Toilet dalam bus"] },
        { vehicle: "Elf / Hiace",   icon: "🚐", capacity: "12–20 org", price: "235.000", points: ["Full AC Split","Monitor + Speaker","Kursi empuk","Air mineral gratis","Power inverter 12V","Bagasi atas & bawah"] },
        { vehicle: "Mobil Innova",  icon: "🚗", capacity: "5–7 org",   price: "295.000", points: ["AC Dual Zone","Captain seat","Bluetooth Audio","USB-A & USB-C","Air mineral gratis","GPS navigasi"] },
        { vehicle: "Pick Up",       icon: "🛻", capacity: "8–15 org",  price: "105.000", points: ["Terbuka / angin alami","Bangku kayu + pegangan","Terpal pelindung","Air mineral gratis","Rute lokal / pendek","Paling ekonomis"] },
      ],
    },
    {
      id: 7,
      category: "traveling",
      pkgId: "custom",
      title: "Paket Custom",
      tagline: "Desain Perjalanan Sesuai Impian Sekolah Anda",
      badge: "BISA CUSTOM",
      badgeColor: "#7c3aed",
      accent: "#7c3aed",
      accentLight: "#f0ebff",
      duration: "Fleksibel",
      minPeserta: "10",
      price: "Hubungi Kami",
      priceNote: "harga transparan",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      description: "Paket wisata sepenuhnya dikustomisasi — tujuan bebas, durasi fleksibel, anggaran transparan. Jogja, Bali, Solo, Lombok, Bromo, dan lainnya.",
      features: ["Tujuan Bebas Seluruh Indonesia", "Durasi 1 Hari – 2 Minggu", "Konsultasi Gratis", "Survey Lokasi", "Itinerary Custom bersama Tim Sekolah", "Support 24 Jam Selama Perjalanan"],
      highlight: false,
      facilities: [
        { icon: "🗺", label: "Tujuan Bebas", detail: "Seluruh Indonesia tersedia" },
        { icon: "📅", label: "Durasi Fleksibel", detail: "1 hari hingga 2 minggu" },
        { icon: "💬", label: "Konsultasi Gratis", detail: "Diskusi bersama tim kami" },
        { icon: "🔍", label: "Survey Lokasi", detail: "Tim survei terlebih dahulu" },
        { icon: "📋", label: "Itinerary Custom", detail: "Bersama tim sekolah" },
        { icon: "📞", label: "Support 24 Jam", detail: "Selama perjalanan berlangsung" },
        { icon: "🛡", label: "Asuransi Jiwa", detail: "Seluruh peserta tercover" },
        { icon: "💧", label: "Air Mineral", detail: "Gratis sepanjang perjalanan" },
      ],
      services: [
        "Tujuan bebas seluruh Indonesia",
        "Durasi 1 hari – 2 minggu fleksibel",
        "Konsultasi gratis bersama tim kami",
        "Survey lokasi sebelum keberangkatan",
        "Itinerary custom bersama tim sekolah",
        "Support 24 jam selama perjalanan",
        "Harga transparan tanpa biaya tersembunyi",
      ],
      destinations: [
        { no: "✈", name: "Bebas Pilih Destinasi", sub: "Seluruh Indonesia", tag: "Custom · Fleksibel", title: "Pilih Destinasi Sesuai Keinginan", desc: "Tidak ada batasan! Pilih dari ratusan destinasi wisata di seluruh Indonesia. Tim kami siap merancang perjalanan terbaik untuk sekolah Anda — dari Sabang sampai Merauke.", points: ["Bali, Jogja, Solo, Lombok, Bromo", "Labuan Bajo, Raja Ampat, Belitung", "Destinasi lokal & regional Jawa Timur", "Rute kombinasi multi-kota tersedia"], duration: "Fleksibel", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg" },
      ],
      prices: [
        { vehicle: "Bus Executive",  icon: "🚌", capacity: "Sesuai kebutuhan", price: "Hubungi kami", points: ["Armada premium besar","Full AC & fasilitas lengkap","Cocok untuk grup 35–60 org","Harga terbaik grup besar"] },
        { vehicle: "Elf / Hiace",    icon: "🚐", capacity: "Sesuai kebutuhan", price: "Hubungi kami", points: ["Fleksibel grup kecil","AC nyaman","Cocok 12–20 org","Mudah akses lokasi kecil"] },
        { vehicle: "Mobil Pribadi",  icon: "🚗", capacity: "Sesuai kebutuhan", price: "Hubungi kami", points: ["Untuk keluarga / grup kecil","AC & audio modern","Privat & nyaman","Bebas atur jadwal"] },
        { vehicle: "Pick Up",        icon: "🛻", capacity: "Sesuai kebutuhan", price: "Hubungi kami", points: ["Pilihan paling ekonomis","Cocok wisata alam terbuka","Terpal pelindung tersedia","Rute lokal & pendek"] },
      ],
    },

    /* ── TRAVELING TAMBAHAN: MALANG & BANDUNG ── */
    {
      id: 11,
      category: "traveling",
      pkgId: "malang",
      title: "Paket Kota Malang",
      tagline: "Kota Apel, Alam & Wisata Edukatif Jawa Timur",
      badge: "REKOMENDASI",
      badgeColor: "#16a34a",
      accent: "#16a34a",
      accentLight: "#f0fdf4",
      duration: "3 Hari 2 Malam",
      minPeserta: "20",
      price: "Rp 245.000",
      priceNote: "/ orang (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pink_Beach_Komodo.jpg/1280px-Pink_Beach_Komodo.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      description: "Paket wisata Kota Malang & sekitarnya — Coban Rondo, Batu Secret Zoo, Museum Angkut, Pantai Balekambang & Jatim Park. Hotel bintang 2–3, konsumsi 3x sehari, tour leader berpengalaman.",
      features: ["Hotel Bintang 2–3", "Konsumsi 3x Sehari", "Dokumentasi Foto", "Tour Leader", "Tiket Masuk Destinasi", "Asuransi Jiwa", "ID Card & Buku Panduan"],
      highlight: true,
      facilities: [
        { icon: "🏨", label: "Hotel Bintang 2–3", detail: "Kamar twin sharing ber-AC" },
        { icon: "🍽", label: "Konsumsi 3x Sehari", detail: "Sarapan, makan siang, makan malam" },
        { icon: "📸", label: "Dokumentasi Foto", detail: "Fotografer profesional sepanjang tour" },
        { icon: "👨‍💼", label: "Tour Leader", detail: "Pendamping berpengalaman" },
        { icon: "🎫", label: "Tiket Masuk", detail: "Semua destinasi dalam itinerary" },
        { icon: "💊", label: "P3K Lengkap", detail: "Kotak P3K di setiap kendaraan" },
        { icon: "🛡", label: "Asuransi Jiwa", detail: "Seluruh peserta tercover" },
        { icon: "💧", label: "Air Mineral", detail: "Gratis sepanjang perjalanan" },
      ],
      services: [
        "Koordinasi langsung dengan pihak sekolah / instansi",
        "Itinerary edukatif khas Malang Raya",
        "Pemandu lokal bersertifikat di tiap destinasi",
        "ID card & buku panduan peserta",
        "Laporan perjalanan & absensi harian",
        "Snack 2x selama di kendaraan",
        "Free program tambahan (opsional)",
      ],
      destinations: [
        {
          no: "01", name: "Jatim Park 1 & 2", sub: "Batu, Malang", tag: "Edukasi & Sains · Wisata Keluarga",
          title: "Taman Edukasi Terlengkap Jawa Timur",
          desc: "Jatim Park adalah kompleks wisata edukatif terbesar di Jawa Timur. Jatim Park 1 berfokus pada sains dan teknologi, sedangkan Jatim Park 2 menghadirkan Museum Satwa & Batu Secret Zoo bertaraf internasional.",
          points: ["Batu Secret Zoo (kebun binatang bertaraf internasional)", "Museum Satwa interaktif", "Wahana sains dan teknologi", "Area bermain outdoor seluas 22 hektare"],
          duration: "3–4 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/800px-Bromo_tengger_semeru_national_park.jpg"
        },
        {
          no: "02", name: "Museum Angkut", sub: "Batu, Malang", tag: "Transportasi & Sejarah · Unik & Instagramable",
          title: "Museum Transportasi Terbesar di Asia Tenggara",
          desc: "Museum Angkut menyimpan koleksi kendaraan bersejarah dari seluruh penjuru dunia mulai dari dokar hingga pesawat terbang. Setiap zona memiliki tema berbeda: Batavia, Hollywood, Broadway, dan masih banyak lagi.",
          points: ["Koleksi 300+ kendaraan bersejarah", "Zona tematik Batavia, Eropa & Amerika", "Wahana Flying Fox & Broadway Avenue", "Spot foto instagramable terbaik Malang"],
          duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pink_Beach_Komodo.jpg/800px-Pink_Beach_Komodo.jpg"
        },
        {
          no: "03", name: "Coban Rondo", sub: "Pujon, Malang", tag: "Alam & Air Terjun · Ekowisata",
          title: "Air Terjun Legendaris Malang",
          desc: "Coban Rondo adalah air terjun paling terkenal di Malang dengan ketinggian 84 meter. Dikelilingi hutan pinus yang sejuk, destinasi ini menawarkan pengalaman ekowisata yang menyegarkan dan penuh cerita rakyat lokal.",
          points: ["Air terjun setinggi 84 meter", "Hutan pinus sejuk & fotogenik", "Camping ground tersedia", "Jalur trekking ringan cocok semua usia"],
          duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/800px-Raja_Ampat_Islands.jpg"
        },
        {
          no: "04", name: "Pantai Balekambang", sub: "Bantur, Malang Selatan", tag: "Pantai & Pura · Keindahan Alam",
          title: "Bali-nya Malang Selatan",
          desc: "Pantai Balekambang dijuluki 'Tanah Lot-nya Jawa' karena keindahan pura Hindu yang berdiri di atas batu karang di tengah laut. Ombak selatan yang megah dan sunset dramatis menjadikannya destinasi favorit.",
          points: ["Pura Amerta Jati di atas batu karang", "Pantai pasir coklat ombak selatan", "Sunset spektakuler di pesisir selatan", "Taman wisata pantai bersih & terawat"],
          duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/800px-Bromo_tengger_semeru_national_park.jpg"
        },
        {
          no: "05", name: "Alun-alun Batu & Kota Wisata Batu", sub: "Batu, Malang", tag: "Kuliner & Belanja · Pusat Kota",
          title: "Jantung Kota Batu yang Meriah",
          desc: "Kota Batu adalah surganya wisata kuliner dan belanja oleh-oleh khas Malang. Alun-alun Kota Batu yang ramai menjadi tempat bersantai, menikmati jajanan khas, dan berbelanja buah apel langsung dari petani.",
          points: ["Taman alun-alun dengan bianglala ikonik", "Pasar apel dan agrowisata kebun apel", "Kuliner khas Malang (bakso, cimol, tempe)", "Toko oleh-oleh terbesar di Malang Raya"],
          duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pink_Beach_Komodo.jpg/800px-Pink_Beach_Komodo.jpg"
        },
      ],
      prices: [
        { vehicle: "Bus Executive", icon: "🚌", capacity: "35–60 org", price: "245.000", points: ["Full AC Double Blower","TV LCD + Audio System","Toilet dalam bus","Snack 2x perjalanan","USB charging per kursi","Reclining seat"] },
        { vehicle: "Elf / Hiace",   icon: "🚐", capacity: "12–20 org", price: "285.000", points: ["Full AC Split","Monitor + Speaker","Kursi empuk","Air mineral gratis","Power inverter 12V","Bagasi atas & bawah"] },
        { vehicle: "Mobil Innova",  icon: "🚗", capacity: "5–7 org",   price: "360.000", points: ["AC Dual Zone","Captain seat","Bluetooth Audio","USB-A & USB-C","Air mineral gratis","GPS navigasi"] },
        { vehicle: "Pick Up",       icon: "🛻", capacity: "8–15 org",  price: "125.000", points: ["Terbuka / angin alami","Bangku kayu + pegangan","Terpal pelindung","Air mineral gratis","Rute lokal / pendek","Paling ekonomis"] },
      ],
    },
    {
      id: 12,
      category: "traveling",
      pkgId: "bandung",
      title: "Paket Kota Bandung",
      tagline: "Paris van Java — Mode, Alam & Kuliner",
      badge: "TERBARU",
      badgeColor: "#7c3aed",
      accent: "#7c3aed",
      accentLight: "#f5f3ff",
      duration: "3 Hari 2 Malam",
      minPeserta: "25",
      price: "Rp 310.000",
      priceNote: "/ orang (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
      description: "Paket wisata Kota Bandung — Kawah Putih, Tangkuban Perahu, Dusun Bambu, Farm House, Saung Angklung Udjo & Factory Outlet. Hotel bintang 3, konsumsi 3x sehari, dan pemandu lokal profesional.",
      features: ["Hotel Bintang 3", "Konsumsi 3x Sehari", "Dokumentasi Foto", "Tour Leader", "Tiket Masuk Destinasi", "Asuransi Jiwa", "Workshop Angklung Opsional"],
      highlight: false,
      facilities: [
        { icon: "🏨", label: "Hotel Bintang 3", detail: "Kamar twin sharing ber-AC" },
        { icon: "🍽", label: "Konsumsi 3x Sehari", detail: "Sarapan, makan siang, makan malam" },
        { icon: "📸", label: "Dokumentasi Foto", detail: "Fotografer profesional" },
        { icon: "👨‍💼", label: "Tour Leader", detail: "Pendamping berpengalaman" },
        { icon: "🎫", label: "Tiket Masuk", detail: "Semua destinasi dalam itinerary" },
        { icon: "💊", label: "P3K Lengkap", detail: "Kotak P3K di setiap kendaraan" },
        { icon: "🛡", label: "Asuransi Jiwa", detail: "Seluruh peserta tercover" },
        { icon: "💧", label: "Air Mineral", detail: "Gratis sepanjang perjalanan" },
      ],
      services: [
        "Koordinasi langsung dengan pihak sekolah / instansi",
        "Itinerary seni-budaya & alam Jawa Barat",
        "Pemandu lokal bersertifikat di tiap destinasi",
        "ID card & buku panduan peserta",
        "Laporan perjalanan & absensi harian",
        "Snack 2x selama di kendaraan",
        "Workshop Angklung di Saung Udjo (opsional)",
      ],
      destinations: [
        {
          no: "01", name: "Kawah Putih", sub: "Ciwidey, Bandung Selatan", tag: "Geologi & Alam · Danau Vulkanik",
          title: "Danau Vulkanik Paling Ikonik di Jawa Barat",
          desc: "Kawah Putih adalah danau vulkanik berwarna toska kebiruan di ketinggian 2.430 mdpl. Bau belerang yang khas dan hamparan putih mineral membuat suasananya terasa mistis namun memukau — destinasi wajib di Bandung.",
          points: ["Danau vulkanik toska di 2.430 mdpl", "Hamparan pasir & mineral putih belerang", "Udara dingin 8–22°C sepanjang tahun", "Spot foto terbaik Jawa Barat"],
          duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/800px-Raja_Ampat_regency_cover.jpg"
        },
        {
          no: "02", name: "Tangkuban Perahu", sub: "Lembang, Bandung Barat", tag: "Gunung & Geologi · Legenda Sunda",
          title: "Gunung Berapi Aktif dengan Legenda Sangkuriang",
          desc: "Tangkuban Perahu adalah gunung berapi aktif berbentuk perahu terbalik yang menyimpan legenda Sangkuriang paling terkenal di tanah Sunda. Wisatawan bisa melihat kawah aktif dari jarak dekat dengan aman.",
          points: ["Kawah Ratu, Kawah Upas & Kawah Domas", "Legenda Sangkuriang yang terkenal", "Uap belerang & aktivitas vulkanik aman", "Pasar oleh-oleh khas di puncak gunung"],
          duration: "2–3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/800px-Bromo_tengger_semeru_national_park.jpg"
        },
        {
          no: "03", name: "Saung Angklung Udjo", sub: "Padasuka, Kota Bandung", tag: "Seni Budaya · Warisan UNESCO",
          title: "Pusat Angklung & Pertunjukan Budaya Sunda",
          desc: "Saung Angklung Udjo adalah pusat kebudayaan Sunda yang terkenal di seluruh dunia. Di sini peserta dapat belajar memainkan angklung — alat musik bambu warisan UNESCO — langsung dari para seniman Sunda berpengalaman.",
          points: ["Pertunjukan wayang golek & tari jaipong", "Workshop memainkan angklung bersama", "Angklung diakui UNESCO 2010", "Toko souvenir angklung asli Bandung"],
          duration: "2 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/800px-Raja_Ampat_Islands.jpg"
        },
        {
          no: "04", name: "Dusun Bambu & Farm House", sub: "Lembang, Bandung Barat", tag: "Agrowisata · Alam & Keluarga",
          title: "Wisata Agro Paling Instagramable di Bandung",
          desc: "Dusun Bambu menawarkan konsep ekowisata dengan rumah makan di atas kolam dan hutan bambu yang asri. Sementara Farm House Lembang menghadirkan suasana Eropa dengan kebun bunga berwarna-warni dan hewan ternak.",
          points: ["Rumah makan apung di tengah kolam", "Hutan bambu & taman bunga tropis", "Farm House bertema Eropa ala Swiss", "Interaksi langsung dengan hewan ternak"],
          duration: "3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/800px-Raja_Ampat_regency_cover.jpg"
        },
        {
          no: "05", name: "Factory Outlet & Cihampelas Walk", sub: "Kota Bandung", tag: "Belanja & Mode · Kuliner",
          title: "Surga Belanja & Kuliner Khas Bandung",
          desc: "Bandung adalah kota mode terbesar di Indonesia. Factory Outlet Jalan Riau dan Cihampelas menawarkan produk fashion berkualitas dengan harga terjangkau. Lengkapi perjalanan dengan kuliner khas Bandung seperti batagor, siomay, dan surabi.",
          points: ["Factory outlet harga grosir terbaik", "Cihampelas Walk mal outdoor ikonik", "Kuliner khas: batagor, siomay, surabi", "Oleh-oleh khas Bandung terlengkap"],
          duration: "3 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/800px-Raja_Ampat_Islands.jpg"
        },
      ],
      prices: [
        { vehicle: "Bus Executive", icon: "🚌", capacity: "35–60 org", price: "310.000", points: ["Full AC Double Blower","TV LCD + Audio System","Toilet dalam bus","Snack 2x perjalanan","USB charging per kursi","Reclining seat"] },
        { vehicle: "Elf / Hiace",   icon: "🚐", capacity: "12–20 org", price: "360.000", points: ["Full AC Split","Monitor + Speaker","Kursi empuk","Air mineral gratis","Power inverter 12V","Bagasi atas & bawah"] },
        { vehicle: "Mobil Innova",  icon: "🚗", capacity: "5–7 org",   price: "440.000", points: ["AC Dual Zone","Captain seat","Bluetooth Audio","USB-A & USB-C","Air mineral gratis","GPS navigasi"] },
        { vehicle: "Pick Up",       icon: "🛻", capacity: "8–15 org",  price: "165.000", points: ["Terbuka / angin alami","Bangku kayu + pegangan","Terpal pelindung","Air mineral gratis","Rute lokal / pendek","Paling ekonomis"] },
      ],
    },

    /* ── TRAVELING TAMBAHAN: OUTBOUND, STUDY BANDING, KUNJUNGAN INDUSTRI, KUNJUNGAN KAMPUS ── */
    {
      id: 30,
      category: "traveling",
      pkgId: "outbound",
      title: "Paket Outbound",
      tagline: "Team Building & Petualangan Alam Terbuka",
      badge: "SERU & MENANTANG",
      badgeColor: "#16a34a",
      accent: "#16a34a",
      accentLight: "#f0fdf4",
      duration: "1–2 Hari",
      minPeserta: "20",
      price: "Rp 175.000",
      priceNote: "/ orang (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      description: "Paket outbound seru untuk membangun kekompakan tim, jiwa kepemimpinan, dan semangat kerjasama. Cocok untuk pelajar, mahasiswa, karyawan, dan komunitas. Tersedia area hijau & wahana petualangan.",
      features: ["Fasilitator Outbound Berpengalaman", "Games & Simulasi Team Building", "Flying Fox & High Rope Course", "Konsumsi & Snack", "Dokumentasi Foto & Video", "Sertifikat Peserta", "P3K & Asuransi Kegiatan"],
      highlight: false,
      facilities: [
        { icon: "🎯", label: "Fasilitator Profesional", detail: "Tim fasilitator bersertifikat" },
        { icon: "🏕", label: "Area Outdoor Luas", detail: "Lapangan & alam terbuka" },
        { icon: "🍽", label: "Konsumsi & Snack", detail: "Makan siang + snack 2x" },
        { icon: "📸", label: "Dokumentasi", detail: "Foto & video kegiatan" },
        { icon: "🛡", label: "Asuransi Kegiatan", detail: "Seluruh peserta tercover" },
        { icon: "📋", label: "Sertifikat", detail: "Sertifikat peserta outbound" },
        { icon: "💊", label: "P3K Lengkap", detail: "Tim medis & kotak P3K" },
        { icon: "💧", label: "Air Mineral", detail: "Gratis sepanjang kegiatan" },
      ],
      services: [
        "Konsultasi & perancangan program outbound custom",
        "Pemilihan lokasi sesuai kebutuhan & anggaran",
        "Fasilitator & instruktur berpengalaman",
        "Perlengkapan outbound lengkap & safety",
        "Rundown kegiatan & ice breaking",
        "Laporan kegiatan & dokumentasi digital",
        "Free program tambahan (opsional)",
      ],
      destinations: [
        { no: "01", name: "Ice Breaking & Warming Up", sub: "Area Utama", tag: "Pembukaan · Energizer", title: "Sesi Pembuka & Penghangatan Tim", desc: "Dimulai dengan ice breaking kreatif untuk memecah kekakuan dan membangun suasana ceria. Berbagai permainan energizer dirancang agar seluruh peserta langsung aktif dan bersemangat sejak awal.", points: ["Permainan energizer kreatif", "Pembagian tim & yel-yel", "Orientasi area & safety briefing", "Foto bersama pembukaan"], duration: "60 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/800px-Bromo_tengger_semeru_national_park.jpg" },
        { no: "02", name: "Low Rope & Ground Games", sub: "Area Permainan", tag: "Team Building · Strategi", title: "Permainan Strategi & Kerjasama Tim", desc: "Sesi ini menguji kemampuan komunikasi, strategi, dan koordinasi tim melalui serangkaian permainan low rope dan ground games yang dirancang untuk meningkatkan sinergi antar anggota.", points: ["Spider Web & Trust Fall", "Tongkat Pipa & Bola Koordinasi", "Jembatan Bambu", "Blindfold Challenge"], duration: "90 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/800px-Raja_Ampat_Islands.jpg" },
        { no: "03", name: "High Rope & Flying Fox", sub: "Area Petualangan", tag: "Adrenalin · Keberanian", title: "Tantangan Ketinggian & Flying Fox", desc: "Puncak adrenalin di wahana high rope dan flying fox yang memacu keberanian peserta. Semua wahana dilengkapi harness dan safety equipment standar internasional, didampingi instruktur bersertifikat.", points: ["Flying fox 50–200 meter", "Jembatan gantung & panjat dinding", "Safety harness & helmet lengkap", "Instruktur bersertifikat"], duration: "90 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/800px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg" },
        { no: "04", name: "Refleksi & Penutupan", sub: "Area Aula / Terbuka", tag: "Evaluasi · Closing Ceremony", title: "Sesi Refleksi & Pemberian Award", desc: "Sesi penutup yang bermakna — setiap tim berbagi pembelajaran, dilanjutkan pemberian penghargaan untuk tim terbaik, foto bersama, dan penyerahan sertifikat peserta.", points: ["Sharing & refleksi kelompok", "Pemberian penghargaan tim terbaik", "Penyerahan sertifikat peserta", "Foto bersama penutupan"], duration: "60 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/800px-Raja_Ampat_regency_cover.jpg" },
      ],
      prices: [
        { vehicle: "Bus Executive", icon: "🚌", capacity: "35–60 org", price: "175.000", points: ["Full AC Double Blower","TV LCD + Audio System","Toilet dalam bus","Snack 2x perjalanan","USB charging per kursi","Reclining seat"] },
        { vehicle: "Elf / Hiace",   icon: "🚐", capacity: "12–20 org", price: "210.000", points: ["Full AC Split","Monitor + Speaker","Kursi empuk","Air mineral gratis","Power inverter 12V","Bagasi atas & bawah"] },
        { vehicle: "Mobil Innova",  icon: "🚗", capacity: "5–7 org",   price: "280.000", points: ["AC Dual Zone","Captain seat","Bluetooth Audio","USB-A & USB-C","Air mineral gratis","GPS navigasi"] },
        { vehicle: "Pick Up",       icon: "🛻", capacity: "8–15 org",  price: "120.000", points: ["Terbuka / angin alami","Bangku kayu + pegangan","Terpal pelindung","Air mineral gratis","Rute lokal / pendek","Paling ekonomis"] },
      ],
    },
    {
      id: 31,
      category: "traveling",
      pkgId: "study-banding",
      title: "Paket Study Banding",
      tagline: "Belajar Langsung dari Instansi Terbaik",
      badge: "EDUKATIF",
      badgeColor: "#0369a1",
      accent: "#0369a1",
      accentLight: "#e0f2fe",
      duration: "1–3 Hari",
      minPeserta: "20",
      price: "Rp 220.000",
      priceNote: "/ orang (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/1200px-Borobudur_ship.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Prambanan.jpg/800px-Prambanan.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Malioboro_yogyakarta.jpg/800px-Malioboro_yogyakarta.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/1200px-Borobudur_ship.jpg",
      description: "Paket study banding ke instansi, lembaga pemerintah, BUMN, perusahaan unggulan, atau sekolah/universitas terbaik. Dirancang untuk memperluas wawasan, benchmarking, dan adopsi praktik terbaik secara langsung.",
      features: ["Koordinasi dengan Instansi Tujuan", "Konsumsi 3x Sehari", "Dokumentasi Foto & Video", "Tour Leader Berpengalaman", "Laporan Kunjungan Resmi", "Sertifikat Peserta", "Asuransi Perjalanan"],
      highlight: false,
      facilities: [
        { icon: "🏛", label: "Koordinasi Instansi", detail: "Pengurusan izin & jadwal kunjungan" },
        { icon: "🍽", label: "Konsumsi 3x Sehari", detail: "Sarapan, makan siang, makan malam" },
        { icon: "📸", label: "Dokumentasi", detail: "Foto & video kunjungan resmi" },
        { icon: "👨‍💼", label: "Tour Leader", detail: "Pendamping & koordinator berpengalaman" },
        { icon: "📄", label: "Laporan Resmi", detail: "Laporan kunjungan tertulis lengkap" },
        { icon: "📋", label: "Sertifikat Peserta", detail: "Sertifikat study banding resmi" },
        { icon: "🛡", label: "Asuransi Perjalanan", detail: "Seluruh peserta tercover" },
        { icon: "💧", label: "Air Mineral", detail: "Gratis sepanjang perjalanan" },
      ],
      services: [
        "Koordinasi & pengurusan izin kunjungan ke instansi tujuan",
        "Pembuatan surat permohonan & administrasi resmi",
        "Penyusunan agenda & rundown kunjungan",
        "Fasilitasi sesi diskusi & tanya jawab",
        "Dokumentasi foto & video profesional",
        "Penyusunan laporan kunjungan lengkap",
        "Konsultasi pra-keberangkatan gratis",
      ],
      destinations: [
        { no: "01", name: "Briefing & Persiapan", sub: "Titik Kumpul", tag: "Pra-Keberangkatan · Administrasi", title: "Briefing Pra-Kunjungan & Pembagian Kelompok", desc: "Sebelum berangkat, seluruh peserta mendapat briefing lengkap — tujuan kunjungan, agenda, tata tertib, dan pembagian kelompok diskusi. Surat pengantar resmi dan ID card kunjungan dibagikan.", points: ["Pembagian ID card & name tag", "Briefing agenda & tata tertib", "Pembagian kelompok diskusi", "Penyiapan bahan pertanyaan"], duration: "30 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/800px-Borobudur_ship.jpg" },
        { no: "02", name: "Kunjungan Instansi Utama", sub: "Instansi / Lembaga Tujuan", tag: "Inti Kunjungan · Observasi", title: "Kunjungan & Observasi Langsung ke Instansi", desc: "Peserta berkunjung langsung ke instansi tujuan, mengikuti sesi presentasi dari tuan rumah, observasi lapangan/operasional, dan sesi diskusi interaktif. Semua sesi didokumentasikan secara profesional.", points: ["Sesi presentasi dari instansi tujuan", "Tour & observasi area kerja/produksi", "Sesi diskusi & tanya jawab", "Foto bersama dengan tim tuan rumah"], duration: "3–4 jam", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Prambanan.jpg/800px-Prambanan.jpg" },
        { no: "03", name: "FGD & Evaluasi", sub: "Ruang Diskusi", tag: "Analisis · Focus Group Discussion", title: "Focus Group Discussion & Analisis Hasil", desc: "Setelah kunjungan, setiap kelompok melakukan FGD untuk menganalisis temuan, membandingkan dengan kondisi di instansi asal, dan merumuskan rekomendasi yang dapat diterapkan.", points: ["Diskusi antar kelompok", "Analisis perbandingan (benchmarking)", "Perumusan rekomendasi", "Presentasi hasil tiap kelompok"], duration: "90 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Malioboro_yogyakarta.jpg/800px-Malioboro_yogyakarta.jpg" },
        { no: "04", name: "Penyusunan Laporan & Penutupan", sub: "Area Akomodasi / Hotel", tag: "Dokumentasi · Closing", title: "Penyusunan Laporan Kunjungan Resmi", desc: "Tim kami membantu penyusunan laporan kunjungan resmi yang komprehensif, siap digunakan untuk keperluan administrasi, pelaporan ke pimpinan, atau publikasi internal organisasi.", points: ["Draft laporan kunjungan tertulis", "Kompilasi dokumentasi foto & video", "Sertifikat peserta study banding", "Serah terima laporan digital & cetak"], duration: "60 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/800px-Raja_Ampat_Islands.jpg" },
      ],
      prices: [
        { vehicle: "Bus Executive", icon: "🚌", capacity: "35–60 org", price: "220.000", points: ["Full AC Double Blower","TV LCD + Audio System","Toilet dalam bus","Snack 2x perjalanan","USB charging per kursi","Reclining seat"] },
        { vehicle: "Elf / Hiace",   icon: "🚐", capacity: "12–20 org", price: "265.000", points: ["Full AC Split","Monitor + Speaker","Kursi empuk","Air mineral gratis","Power inverter 12V","Bagasi atas & bawah"] },
        { vehicle: "Mobil Innova",  icon: "🚗", capacity: "5–7 org",   price: "340.000", points: ["AC Dual Zone","Captain seat","Bluetooth Audio","USB-A & USB-C","Air mineral gratis","GPS navigasi"] },
        { vehicle: "Pick Up",       icon: "🛻", capacity: "8–15 org",  price: "140.000", points: ["Terbuka / angin alami","Bangku kayu + pegangan","Terpal pelindung","Air mineral gratis","Rute lokal / pendek","Paling ekonomis"] },
      ],
    },
    {
      id: 32,
      category: "traveling",
      pkgId: "kunjungan-industri",
      title: "Paket Kunjungan Industri",
      tagline: "Mengenal Dunia Industri Secara Nyata",
      badge: "VOKASI & SMK",
      badgeColor: "#b45309",
      accent: "#b45309",
      accentLight: "#fffbeb",
      duration: "1–2 Hari",
      minPeserta: "20",
      price: "Rp 195.000",
      priceNote: "/ orang (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/1200px-Borobudur_ship.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      description: "Paket kunjungan industri untuk siswa SMK, mahasiswa vokasi, dan instansi yang ingin mengenal proses produksi, manajemen operasional, dan dunia kerja nyata secara langsung di pabrik atau perusahaan terkemuka.",
      features: ["Koordinasi dengan Perusahaan Tujuan", "Konsumsi 2–3x Sehari", "Dokumentasi Foto & Video", "Tour Leader & Pemandu Industri", "Sertifikat Kunjungan Industri", "Laporan Kunjungan Resmi", "Asuransi Perjalanan"],
      highlight: false,
      facilities: [
        { icon: "🏭", label: "Koordinasi Pabrik/Industri", detail: "Pengurusan izin & jadwal kunjungan" },
        { icon: "🍽", label: "Konsumsi 2–3x Sehari", detail: "Makan siang wajib, sarapan & malam opsional" },
        { icon: "📸", label: "Dokumentasi", detail: "Foto & video area produksi (area yg diizinkan)" },
        { icon: "👨‍🏭", label: "Pemandu Industri", detail: "Staf ahli perusahaan sebagai pemandu" },
        { icon: "📋", label: "Sertifikat Kunjungan", detail: "Sertifikat kunjungan industri resmi" },
        { icon: "📄", label: "Laporan Resmi", detail: "Laporan kunjungan industri lengkap" },
        { icon: "🛡", label: "Asuransi Perjalanan", detail: "Seluruh peserta tercover" },
        { icon: "⛑", label: "APD Kunjungan", detail: "Helm & safety vest tersedia" },
      ],
      services: [
        "Koordinasi & pengurusan izin kunjungan ke perusahaan/pabrik",
        "Pembuatan surat permohonan resmi & administrasi",
        "Penyusunan rundown kunjungan bersama pihak industri",
        "Pemandu dari staf ahli perusahaan",
        "Sesi tanya jawab langsung dengan praktisi industri",
        "Dokumentasi foto & video (area yang diizinkan)",
        "Penyusunan laporan kunjungan industri lengkap",
      ],
      destinations: [
        { no: "01", name: "Penerimaan & Pengarahan", sub: "Aula / Ruang Meeting Perusahaan", tag: "Opening · Company Profile", title: "Sambutan & Presentasi Profil Perusahaan", desc: "Peserta diterima oleh tim perusahaan dan mendapatkan presentasi company profile — sejarah, visi misi, produk/layanan, skala bisnis, dan posisi perusahaan di industri nasional.", points: ["Sambutan resmi dari manajemen", "Presentasi company profile", "Sesi pengenalan produk & layanan", "Pembagian helm & APD kunjungan"], duration: "45 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/800px-Bromo_tengger_semeru_national_park.jpg" },
        { no: "02", name: "Tour Area Produksi", sub: "Lantai Produksi / Workshop", tag: "Observasi · Proses Industri", title: "Observasi Langsung Proses Produksi", desc: "Dipandu oleh staf ahli, peserta berkeliling area produksi dan menyaksikan langsung proses manufacturing, quality control, pergudangan, hingga distribusi. Pengalaman yang tidak bisa didapat dari buku.", points: ["Tour area produksi & gudang", "Penjelasan proses manufaktur langsung", "Melihat mesin & teknologi industri", "Observasi quality control"], duration: "90 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/800px-Raja_Ampat_regency_cover.jpg" },
        { no: "03", name: "Sesi Tanya Jawab Praktisi", sub: "Aula / Ruang Meeting", tag: "Interaktif · Career Talk", title: "Dialog Interaktif dengan Praktisi Industri", desc: "Sesi diskusi langsung dengan praktisi — manajer produksi, HRD, atau direktur operasional. Peserta bisa bertanya soal karier, tantangan industri, kebutuhan kompetensi, hingga peluang magang/kerja.", points: ["Sesi QnA dengan praktisi senior", "Career talk & tips memasuki dunia kerja", "Informasi peluang magang & rekrutmen", "Motivasi dari profesional industri"], duration: "60 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/800px-Borobudur_ship.jpg" },
        { no: "04", name: "Penutupan & Sertifikasi", sub: "Aula Perusahaan", tag: "Closing · Sertifikat Resmi", title: "Penyerahan Sertifikat & Foto Bersama", desc: "Sesi penutupan diakhiri dengan penyerahan sertifikat kunjungan industri resmi yang dapat digunakan untuk portofolio, laporan sekolah, atau persyaratan program studi.", points: ["Penyerahan sertifikat kunjungan industri", "Foto bersama dengan tim perusahaan", "Souvenir dari perusahaan (jika ada)", "Evaluasi & kesan-pesan peserta"], duration: "30 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/800px-Raja_Ampat_Islands.jpg" },
      ],
      prices: [
        { vehicle: "Bus Executive", icon: "🚌", capacity: "35–60 org", price: "195.000", points: ["Full AC Double Blower","TV LCD + Audio System","Toilet dalam bus","Snack 2x perjalanan","USB charging per kursi","Reclining seat"] },
        { vehicle: "Elf / Hiace",   icon: "🚐", capacity: "12–20 org", price: "240.000", points: ["Full AC Split","Monitor + Speaker","Kursi empuk","Air mineral gratis","Power inverter 12V","Bagasi atas & bawah"] },
        { vehicle: "Mobil Innova",  icon: "🚗", capacity: "5–7 org",   price: "310.000", points: ["AC Dual Zone","Captain seat","Bluetooth Audio","USB-A & USB-C","Air mineral gratis","GPS navigasi"] },
        { vehicle: "Pick Up",       icon: "🛻", capacity: "8–15 org",  price: "130.000", points: ["Terbuka / angin alami","Bangku kayu + pegangan","Terpal pelindung","Air mineral gratis","Rute lokal / pendek","Paling ekonomis"] },
      ],
    },
    {
      id: 33,
      category: "traveling",
      pkgId: "kunjungan-kampus",
      title: "Paket Kunjungan Kampus",
      tagline: "Inspirasi Masa Depan Dimulai di Sini",
      badge: "SMA / SMK",
      badgeColor: "#7c3aed",
      accent: "#7c3aed",
      accentLight: "#f5f3ff",
      duration: "1–2 Hari",
      minPeserta: "20",
      price: "Rp 185.000",
      priceNote: "/ orang (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/1200px-Borobudur_ship.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/1200px-Borobudur_ship.jpg",
      description: "Paket kunjungan kampus untuk siswa SMA/SMK yang ingin mengenal dunia perguruan tinggi secara langsung — fasilitas, jurusan, beasiswa, kehidupan mahasiswa, hingga prospek karir. Kunjungi universitas negeri & swasta terkemuka.",
      features: ["Koordinasi dengan Pihak Kampus", "Konsumsi 2–3x Sehari", "Dokumentasi Foto & Video", "Tour Leader Berpengalaman", "Campus Tour Terpandu", "Sertifikat Kunjungan", "Asuransi Perjalanan"],
      highlight: false,
      facilities: [
        { icon: "🎓", label: "Campus Tour Terpandu", detail: "Mahasiswa guide dari kampus tujuan" },
        { icon: "🍽", label: "Konsumsi 2–3x Sehari", detail: "Makan di kantin kampus / restoran" },
        { icon: "📸", label: "Dokumentasi", detail: "Foto & video selama kunjungan" },
        { icon: "👨‍💼", label: "Tour Leader", detail: "Pendamping & koordinator berpengalaman" },
        { icon: "📋", label: "Sertifikat Kunjungan", detail: "Sertifikat kunjungan kampus resmi" },
        { icon: "📚", label: "Brosur & Informasi", detail: "Materi jurusan & beasiswa kampus" },
        { icon: "🛡", label: "Asuransi Perjalanan", detail: "Seluruh peserta tercover" },
        { icon: "💧", label: "Air Mineral", detail: "Gratis sepanjang perjalanan" },
      ],
      services: [
        "Koordinasi dengan humas / biro penerimaan mahasiswa kampus tujuan",
        "Penyusunan agenda campus tour & jadwal sesi informasi",
        "Pemandu mahasiswa aktif dari kampus tujuan",
        "Sesi informasi jurusan, beasiswa & jalur masuk",
        "Campus tour: laboratorium, perpustakaan, fasilitas olahraga",
        "Sesi diskusi & tanya jawab dengan mahasiswa aktif",
        "Dokumentasi lengkap & sertifikat kunjungan resmi",
      ],
      destinations: [
        { no: "01", name: "Sambutan & Info Kampus", sub: "Aula / Auditorium Kampus", tag: "Opening · Informasi Umum", title: "Presentasi Kampus & Pengenalan Jurusan", desc: "Tim humas atau perwakilan rektorat menyambut rombongan dan mempresentasikan profil kampus secara menyeluruh — akreditasi, jurusan unggulan, prestasi, fasilitas, jalur masuk, dan program beasiswa.", points: ["Presentasi profil & akreditasi kampus", "Informasi jurusan & program studi", "Jalur masuk: SNBP, SNBT, Mandiri", "Program beasiswa tersedia"], duration: "60 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Borobudur_ship.jpg/800px-Borobudur_ship.jpg" },
        { no: "02", name: "Campus Tour Fasilitas", sub: "Seluruh Area Kampus", tag: "Observasi · Fasilitas Kampus", title: "Tur Fasilitas Kampus Bersama Mahasiswa Guide", desc: "Dipandu mahasiswa aktif, peserta berkeliling kampus — laboratorium, studio, perpustakaan, pusat olahraga, kantin, asrama, dan UKM. Melihat langsung suasana kehidupan kampus yang sesungguhnya.", points: ["Laboratorium & studio praktikum", "Perpustakaan & pusat riset", "Fasilitas olahraga & kesehatan", "Area UKM & organisasi mahasiswa"], duration: "90 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/800px-Bromo_tengger_semeru_national_park.jpg" },
        { no: "03", name: "Diskusi dengan Mahasiswa", sub: "Ruang Diskusi / Taman Kampus", tag: "Interaktif · Sharing Session", title: "Sesi Sharing & Tanya Jawab Mahasiswa Aktif", desc: "Peserta berdiskusi langsung dengan mahasiswa aktif berbagai jurusan. Sharing kehidupan kampus, tips lolos seleksi, cara adaptasi, manajemen waktu kuliah, hingga pengalaman magang dan organisasi.", points: ["Sharing pengalaman kuliah", "Tips lolos seleksi & adaptasi kampus", "Diskusi minat jurusan", "Motivasi dari kakak tingkat"], duration: "60 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/800px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg" },
        { no: "04", name: "Penutupan & Sertifikasi", sub: "Aula / Area Terbuka Kampus", tag: "Closing · Sertifikat", title: "Sertifikat & Foto Bersama di Kampus", desc: "Kunjungan ditutup dengan penyerahan sertifikat resmi, pembagian brosur jurusan & beasiswa, foto bersama di landmark kampus, dan sesi motivasi singkat dari dosen atau alumni berprestasi.", points: ["Penyerahan sertifikat kunjungan kampus", "Pembagian brosur jurusan & beasiswa", "Foto bersama di landmark kampus", "Motivasi dari dosen / alumni"], duration: "30 menit", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/800px-Raja_Ampat_Islands.jpg" },
      ],
      prices: [
        { vehicle: "Bus Executive", icon: "🚌", capacity: "35–60 org", price: "185.000", points: ["Full AC Double Blower","TV LCD + Audio System","Toilet dalam bus","Snack 2x perjalanan","USB charging per kursi","Reclining seat"] },
        { vehicle: "Elf / Hiace",   icon: "🚐", capacity: "12–20 org", price: "230.000", points: ["Full AC Split","Monitor + Speaker","Kursi empuk","Air mineral gratis","Power inverter 12V","Bagasi atas & bawah"] },
        { vehicle: "Mobil Innova",  icon: "🚗", capacity: "5–7 org",   price: "295.000", points: ["AC Dual Zone","Captain seat","Bluetooth Audio","USB-A & USB-C","Air mineral gratis","GPS navigasi"] },
        { vehicle: "Pick Up",       icon: "🛻", capacity: "8–15 org",  price: "125.000", points: ["Terbuka / angin alami","Bangku kayu + pegangan","Terpal pelindung","Air mineral gratis","Rute lokal / pendek","Paling ekonomis"] },
      ],
    },

    /* ── EVENT PLAN TAMBAHAN: TEDAK SINTEN, ANNIVERSARY, DIES NATALIS, UPACARA ADAT, REUNIAN ── */
    {
      id: 13,
      category: "event",
      title: "Paket Tedak Sinten",
      badge: "Tradisi Jawa",
      badgeColor: "#b45309",
      price: "Rp 4.500.000",
      priceNote: "/ acara",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      description: "Paket upacara Tedak Sinten (turun tanah) yang autentik dan penuh makna. Kami mengurus seluruh perlengkapan tradisi Jawa mulai dari jadah 7 warna, kurungan, tangga tebu, hingga dokumentasi profesional untuk kenangan tak ternilai.",
      features: [
        "Konsultasi prosesi adat Tedak Sinten",
        "Pengadaan perlengkapan tradisi lengkap (jadah 7 warna, kurungan, tangga tebu, pasir, dll.)",
        "Dekorasi tematik Jawa klasik",
        "MC / Pranata Acara berbahasa Jawa",
        "Dokumentasi foto & video (4 jam)",
        "Catering snack & minuman tamu (50 pax)",
        "Koordinasi sesepuh / dukun bayi (opsional)",
        "Souvenir kenangan (opsional)",
      ],
      highlight: false,
    },
    {
      id: 14,
      category: "event",
      title: "Paket Anniversary",
      badge: "Populer",
      badgeColor: "#db2777",
      price: "Rp 6.500.000",
      priceNote: "/ acara",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
      description: "Rayakan momen ulang tahun pernikahan, ulang tahun perusahaan, atau anniversary spesial dengan nuansa romantis dan elegan. Dekorasi premium, hiburan live, dan dokumentasi sinematik untuk kenangan abadi.",
      features: [
        "Konsultasi tema & konsep acara",
        "Dekorasi tematik romantis / elegan / custom",
        "Backdrop & floral arrangement premium",
        "MC profesional & entertainment (live music / band akustik)",
        "Dokumentasi foto & video sinematik (full day)",
        "Kue ulang tahun / anniversary custom",
        "Catering prasmanan (100 pax)",
        "Kapasitas 50–150 tamu",
      ],
      highlight: true,
    },
    {
      id: 15,
      category: "event",
      title: "Paket Dies Natalis",
      badge: "Instansi & Kampus",
      badgeColor: "#1d4ed8",
      price: "Rp 15.000.000",
      priceNote: "/ event",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pink_Beach_Komodo.jpg/1280px-Pink_Beach_Komodo.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      description: "Paket perayaan Dies Natalis kampus, sekolah, atau organisasi yang profesional dan berkesan. Kami menangani seluruh rangkaian acara dari malam puncak, seminar, pentas seni, hingga penghargaan alumni.",
      features: [
        "Konsultasi & perencanaan rangkaian acara Dies Natalis",
        "Dekorasi pentas & panggung instansi / kampus",
        "Sound system & lighting profesional",
        "MC bilingual (Indonesia / Jawa)",
        "Pentas seni & hiburan (modern & tradisional)",
        "Dokumentasi foto & video full event",
        "Koordinasi 10+ vendor",
        "Catering prasmanan 200 pax",
        "Kapasitas 200–500 tamu undangan",
      ],
      highlight: false,
    },
    {
      id: 16,
      category: "event",
      title: "Paket Upacara Adat",
      badge: "Budaya Nusantara",
      badgeColor: "#92400e",
      price: "Rp 8.000.000",
      priceNote: "/ acara",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      description: "Paket penyelenggaraan upacara adat Nusantara secara autentik dan khidmat. Meliputi berbagai adat Jawa, Sunda, Madura, Bali, dan adat daerah lainnya — ditangani oleh tim yang paham tradisi dan tata cara adat setempat.",
      features: [
        "Konsultasi prosesi & tata cara upacara adat",
        "Pengadaan perlengkapan & sesaji adat lengkap",
        "Dekorasi tradisional khas adat yang dipilih",
        "Pranata Acara / MC berbahasa daerah",
        "Koordinasi sesepuh / pemangku adat",
        "Dokumentasi foto & video (6 jam)",
        "Catering tradisional khas daerah (100 pax)",
        "Pendampingan hari H penuh",
      ],
      highlight: false,
    },
    {
      id: 17,
      category: "event",
      title: "Paket Reunian",
      badge: "Hangat & Berkesan",
      badgeColor: "#0891b2",
      price: "Rp 5.500.000",
      priceNote: "/ acara",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
      description: "Wujudkan momen reuni alumni, keluarga besar, atau komunitas yang hangat dan tak terlupakan. Kami siap mengurus venue, hiburan nostalgia, games seru, konsumsi, hingga souvenir kenangan untuk seluruh peserta.",
      features: [
        "Konsultasi tema & konsep reuni",
        "Dekorasi venue hangat & nostalgik",
        "MC interaktif & games seru peserta",
        "Slide show / video perjalanan kenangan",
        "Dokumentasi foto & video (full event)",
        "Catering prasmanan / buffet (100 pax)",
        "Souvenir kenangan peserta",
        "Kapasitas 50–200 orang",
      ],
      highlight: false,
    },

    /* ── WEDDING ORGANIZER (3 paket) ── */
    {
      id: 8,
      category: "wedding",
      title: "Paket Wedding Intimate Garden",
      badge: "Terlaris",
      badgeColor: "#e67e22",
      price: "Rp 18.000.000",
      priceNote: "/ wedding",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      description: "Pernikahan intim nan hangat di taman dengan dekorasi bohemian elegan. Ideal untuk 50–100 tamu dengan nuansa natural yang tetap mewah dan berkesan.",
      features: [
        "Dekorasi garden bohemian",
        "Wedding planner dedicated",
        "Dokumentasi foto & video",
        "Catering 100 pax",
        "Pelaminan custom",
        "Bunga segar premium",
        "MC profesional",
        "Koordinasi vendor",
      ],
      highlight: false,
    },
    {
      id: 9,
      category: "wedding",
      title: "Paket Wedding Syar'i Premium",
      badge: "Best Seller",
      badgeColor: "#1abc9c",
      price: "Rp 25.000.000",
      priceNote: "/ wedding",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
      description: "Wujudkan pernikahan Islami yang penuh berkah dan elegan. Setiap detail prosesi dirancang sesuai nilai-nilai Islam dengan tampilan modern yang tetap menawan untuk 150–250 tamu.",
      features: [
        "Dekorasi Islami modern",
        "Pembatas tamu putra & putri",
        "Qori & sambutan religi",
        "Catering halal 200 pax",
        "Pelaminan syar'i custom",
        "Dokumentasi foto & video",
        "Wedding planner dedicated",
        "Buku tamu & souvenir",
      ],
      highlight: true,
    },
    {
      id: 10,
      category: "wedding",
      title: "Paket Wedding Glamour Ballroom",
      badge: "Mewah",
      badgeColor: "#8e44ad",
      price: "Rp 55.000.000",
      priceNote: "/ wedding",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pink_Beach_Komodo.jpg/1280px-Pink_Beach_Komodo.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      description: "Pernikahan megah berkelas di ballroom hotel bintang 5 dengan dekorasi chandelier dan bunga segar premium. All-inclusive terbaik untuk 300–600 tamu undangan.",
      features: [
        "Ballroom hotel bintang 5",
        "Dekorasi full flowers premium",
        "Bridal suite 2 malam",
        "Catering fine dining 400 pax",
        "Entertainment & live band",
        "Foto & video sinematik",
        "Wedding planner senior",
        "Makeup artist profesional",
        "Souvenir premium tamu",
        "Pagar ayu & pager bagus",
      ],
      highlight: false,
    },

    /* ── EVENT PLAN TAMBAHAN: KONSER MUSIK & PEMERINTAH ── */
    {
      id: 20,
      category: "event",
      title: "Paket Konser Musik",
      badge: "Hiburan",
      badgeColor: "#dc2626",
      price: "Rp 25.000.000",
      priceNote: "/ event (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      description: "Paket penyelenggaraan konser musik profesional dari skala intimate hingga open-air besar. Kami menangani seluruh produksi — panggung, sound system, lighting, artist management, keamanan, tiket, hingga dokumentasi — agar konser berjalan lancar dan berkesan.",
      features: [
        "Konsultasi konsep & rundown konser",
        "Desain & pemasangan panggung profesional",
        "Sound system line array & FOH engineer",
        "Lighting show full rig (moving head, laser, LED)",
        "Artist management & rider teknis",
        "Manajemen tiket & registrasi tamu",
        "Keamanan & crowd management",
        "Dokumentasi foto & video sinematik",
        "Publikasi & promosi event (media sosial, poster)",
        "Kapasitas 500 – 10.000 penonton",
      ],
      highlight: true,
    },
    {
      id: 21,
      category: "event",
      title: "Paket Pemerintah Kota / Kabupaten",
      badge: "Resmi & Protokol",
      badgeColor: "#1d4ed8",
      price: "Rp 20.000.000",
      priceNote: "/ event (mulai)",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
      description: "Paket penyelenggaraan event resmi instansi pemerintah daerah — Kota maupun Kabupaten — yang memenuhi standar protokoler kenegaraan. Meliputi hari jadi kota, upacara kenegaraan, festival daerah, musrenbang, pelantikan pejabat, hingga expo potensi daerah.",
      features: [
        "Konsultasi konsep & protokol acara pemerintah",
        "Dekorasi resmi bernuansa merah-putih & lambang daerah",
        "Panggung, podium, & backdrop resmi instansi",
        "Sound system & tata suara gedung / outdoor",
        "MC protokoler berbahasa Indonesia formal",
        "Koordinasi paspampres / keamanan setempat",
        "Dokumentasi foto & video resmi berita",
        "Perlengkapan administrasi & atribut acara",
        "Live streaming & siaran pers (opsional)",
        "Kapasitas 200 – 5.000 tamu undangan",
      ],
      highlight: false,
    },

    /* ── EVENT PLAN CUSTOM ── */
    {
      id: 18,
      category: "event",
      pkgId: "custom",
      title: "Paket Event Custom",
      tagline: "Rancang Event Sesuai Visi & Kebutuhan Anda",
      badge: "BISA CUSTOM",
      badgeColor: "#7c3aed",
      price: "Hubungi Kami",
      priceNote: "harga transparan & negosiasi",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Raja_Ampat_regency_cover.jpg/1280px-Raja_Ampat_regency_cover.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Raja_Ampat_Islands.jpg/1280px-Raja_Ampat_Islands.jpg",
      description: "Tidak menemukan paket yang cocok? Kami merancang event 100% sesuai kebutuhan Anda — dari konsep, tema, vendor, hingga hari H. Seminar, gathering, launching produk, pameran, konser mini, atau apapun yang Anda bayangkan, kami wujudkan.",
      features: [
        "Konsultasi tema & konsep event gratis",
        "Skala acara bebas: 20 – 5.000 tamu",
        "Pilihan venue indoor & outdoor",
        "Koordinasi vendor sesuai budget",
        "Rundown & timeline custom",
        "Dekorasi & branding event penuh",
        "Dokumentasi foto & video profesional",
        "Support penuh hari H on-site",
      ],
      highlight: false,
    },

    /* ── WEDDING ORGANIZER CUSTOM ── */
    {
      id: 19,
      category: "wedding",
      pkgId: "custom",
      title: "Paket Wedding Custom",
      tagline: "Wujudkan Pernikahan Impian Tanpa Batas",
      badge: "BISA CUSTOM",
      badgeColor: "#7c3aed",
      price: "Hubungi Kami",
      priceNote: "konsultasi gratis, harga transparan",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg/1280px-Tanah_Lot_Bali_Indonesia_Pura-Tanah-Lot-01.jpg",
      ],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg/1280px-Ubud_Monkey_Forest%2C_Bali%2C_Indonesia.jpg",
      description: "Pernikahan adalah momen seumur hidup. Kami merancang setiap detailnya bersama Anda — dari akad hingga resepsi, dari dekorasi hingga catering, dari dokumentasi hingga hiburan. Tidak ada paket yang terlalu besar atau terlalu kecil bagi kami.",
      features: [
        "Konsultasi pernikahan gratis & tanpa batas",
        "Pilihan tema bebas: modern, tradisional, outdoor, ballroom, garden, dll.",
        "Wedding planner dedicated full-time",
        "Koordinasi semua vendor (foto, video, katering, dekorasi, make-up, dll.)",
        "Pelaminan & dekorasi 100% custom",
        "Gladi resik & pendampingan hari H penuh",
        "Kapasitas fleksibel: 30 – 1.000+ tamu",
        "Harga transparan, cicilan tersedia",
      ],
      highlight: false,
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
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@700;900&family=Montserrat:wght@700;800;900&family=Raleway:wght@700;800;900&family=Oswald:wght@600;700&family=Bebas+Neue&family=Lora:wght@700&family=Josefin+Sans:wght@700&family=Inter:wght@700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
    body{font-family:'DM Sans',sans-serif;background:#063d5c;color:#0d3b66;line-height:1.6;font-size:16px}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(56,197,216,.5);border-radius:10px}
    a{text-decoration:none;color:inherit}
    a:focus-visible,button:focus-visible{outline:2px solid #0ea5c5;outline-offset:3px;border-radius:3px}
    img{max-width:100%;display:block;object-fit:cover}
    input,textarea,select,button{font-family:'DM Sans',sans-serif}
    button{cursor:pointer;border:none;background:none}
    .serif{font-family:'Cormorant Garamond',serif}
    .display{font-family:'Playfair Display',serif}
    .fade-in{animation:fadeIn .4s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes galScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}

    /* Gallery ticker — desktop only */
    .gal-ticker{overflow:hidden;margin-bottom:40px;mask-image:linear-gradient(to right,transparent 0%,#000 6%,#000 94%,transparent 100%);-webkit-mask-image:linear-gradient(to right,transparent 0%,#000 6%,#000 94%,transparent 100%)}
    .gal-ticker-track{display:flex;gap:10px;width:max-content;animation:galScroll 22s linear infinite}
    .gal-ticker-track:hover{animation-play-state:paused}
    .gal-ticker-item{width:220px;height:148px;border-radius:6px;overflow:hidden;flex-shrink:0}
    .gal-ticker-item img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease}
    .gal-ticker-item:hover img{transform:scale(1.06)}
    @media(max-width:900px){
      .gal-ticker{mask-image:none;-webkit-mask-image:none}
      .gal-ticker-track{animation:none;flex-wrap:wrap;justify-content:center;width:100%}
      .gal-ticker-item{width:calc(50% - 6px);height:120px}
    }

    h1,h2,h3,h4,h5{font-family:'Playfair Display',serif;color:#fff;line-height:1.15;font-weight:800;letter-spacing:-.01em}
    h1{font-size:clamp(2rem,5vw,3.5rem)}
    h2{font-size:clamp(1.6rem,3.5vw,2.6rem)}
    h3{font-size:clamp(1.2rem,2.5vw,1.6rem)}
    p{font-size:1rem;line-height:1.75;color:rgba(255,255,255,.8)}
    small{font-size:.875rem;line-height:1.5}

    .nav-link{position:relative;padding-bottom:3px;font-size:.875rem;letter-spacing:.04em;font-weight:700;color:#fff;transition:color .2s;text-shadow:0 1px 4px rgba(0,80,120,.35),0 0 10px rgba(8,145,178,.18)}
    .nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:linear-gradient(90deg,#fff,rgba(255,255,255,.4));transition:width .3s;border-radius:2px}
    .nav-link:hover{color:rgba(255,255,255,.85);text-shadow:0 1px 6px rgba(0,80,120,.4),0 0 18px rgba(255,255,255,.25)}
    .nav-link:hover::after,.nav-link.active::after{width:100%}
    .nav-link.active{color:#fff!important;text-shadow:0 1px 8px rgba(0,80,120,.45),0 0 20px rgba(255,255,255,.30)}

    .hover-lift{transition:transform .3s,box-shadow .3s}
    .hover-lift:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(13,59,102,.12)}
    .img-zoom{overflow:hidden}
    .img-zoom img{transition:transform .6s cubic-bezier(.25,.46,.45,.94)}
    .img-zoom:hover img{transform:scale(1.07)}
    .cms-toolbar button:hover{background:rgba(8,145,178,.12)!important}
    .post-card:hover .post-card-title{color:#38c5d8}

    /* DESKTOP-ONLY ANIMATIONS */
    @media(pointer:fine){
      .anim-fade-up{opacity:0;transform:translateY(32px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
      .anim-fade-up.visible{opacity:1;transform:translateY(0)}
      .anim-zoom{opacity:0;transform:scale(.94);transition:opacity .65s ease,transform .65s ease}
      .anim-zoom.visible{opacity:1;transform:scale(1)}
      .btn-magnetic{transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s}
      .btn-magnetic:hover{transform:scale(1.045) translateY(-2px);box-shadow:0 12px 32px rgba(13,59,102,.18)}
      .post-card{transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s;transform-style:preserve-3d}
      .post-card:hover{transform:translateY(-6px) rotate3d(1,1,0,.8deg);box-shadow:0 20px 48px rgba(13,59,102,.14)}
      @keyframes heroReveal{from{opacity:0;letter-spacing:-.05em;filter:blur(6px)}to{opacity:1;letter-spacing:-.01em;filter:blur(0)}}
      @keyframes flareShift{0%,100%{transform:scale(1) translate(0,0);opacity:.7}50%{transform:scale(1.15) translate(5px,-5px);opacity:1}}
      .hero-title-anim{animation:heroReveal .9s cubic-bezier(.22,1,.36,1) .15s both}
      @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      .hero-img-grid>div:nth-child(1){animation:floatA 5s ease-in-out infinite}
      .hero-img-grid>div:nth-child(2){animation:floatB 6s ease-in-out infinite .5s}
      .hero-img-grid>div:nth-child(3){animation:floatA 7s ease-in-out infinite 1s}
      .hero-img-grid>div:nth-child(4){animation:floatB 5.5s ease-in-out infinite .8s}
      #cursor-glow{pointer-events:none;position:fixed;width:24px;height:24px;border-radius:50%;background:rgba(14,165,197,.28);border:1.5px solid rgba(14,165,197,.55);transform:translate(-50%,-50%);transition:left .06s ease,top .06s ease,width .25s,height .25s,background .25s;z-index:99998;mix-blend-mode:multiply}
      #cursor-glow.expanded{width:48px;height:48px;background:rgba(8,145,178,.1)}
    }

    .logo-brand{font-family:'Playfair Display',serif;font-weight:900;font-size:1.3rem;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:#111;text-shadow:0 1px 6px rgba(0,0,0,.35),0 2px 14px rgba(0,0,0,.18)}
    .logo-brand-footer{font-family:'Playfair Display',serif;font-weight:900;font-size:1.15rem;line-height:1.15;letter-spacing:.06em;text-transform:uppercase;color:#111;text-shadow:0 1px 3px rgba(0,0,0,.12)}
    .logo-brand-admin{font-family:'Playfair Display',serif;font-weight:800;font-size:.9rem;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.3)}
    .label-xs{font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:rgba(255,255,255,.65)}
    .card-title{font-family:'Playfair Display',serif;font-weight:700;font-size:1.15rem;line-height:1.3;color:#0d3b66}

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
    .mag-img-main .foto-label{position:absolute;bottom:12px;left:12px;background:rgba(13,59,102,.82);color:#fff;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:3px;font-weight:600}
    .mag-img-sm1{grid-column:2;grid-row:1;border-radius:6px;overflow:hidden}
    .mag-img-sm1 img{width:100%;height:155px;object-fit:cover;display:block;transition:transform .6s ease}
    .mag-img-sm1:hover img{transform:scale(1.04)}
    .mag-card-text{grid-column:2;grid-row:2;background:linear-gradient(135deg,#063d5c,#0875a8);border-radius:6px;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;min-height:155px}
    .adv-stats-row{display:flex;gap:32px;margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid #eef3f7}
    .adv-stat .num{font-family:'Playfair Display',serif;font-size:1.75rem;font-weight:900;color:#38c5d8;line-height:1;margin-bottom:3px}
    .adv-stat .lbl{font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:#6aaec8;font-weight:600}
    .adv-eyebrow{display:flex;align-items:center;gap:14px;margin-bottom:22px}
    .adv-eyebrow .ey-line{width:36px;height:1.5px;background:#38c5d8;flex-shrink:0}
    .adv-quote{font-size:.9375rem;color:#1a5a78;line-height:1.9;font-style:italic;max-width:400px;margin-bottom:28px;padding-left:18px;border-left:2px solid #38c5d8;white-space:pre-line}

    /* Margin dekorasi kiri-kanan */
    .adv-margin-deco{position:absolute;top:0;bottom:0;width:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px 0}
    .adv-margin-deco.left{left:0;border-right:1px solid #daf0f5}
    .adv-margin-deco.right{right:0;border-left:1px solid #daf0f5}
    .adv-margin-deco .issue-text{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#9ed4e0;writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600}
    .adv-margin-deco .dot-col{display:flex;flex-direction:column;gap:6px;align-items:center}
    .adv-margin-deco .dot{width:4px;height:4px;border-radius:50%;background:#c0e8f0}
    .adv-margin-deco .dot.on{background:#0d3b66}
    .deco-corner-tr{position:absolute;top:20px;right:60px;width:70px;height:70px;border-top:1.5px solid #daf0f5;border-right:1.5px solid #daf0f5;pointer-events:none}
    .deco-corner-bl{position:absolute;bottom:20px;left:60px;width:50px;height:50px;border-bottom:1.5px solid #daf0f5;border-left:1.5px solid #daf0f5;pointer-events:none}
    @media(max-width:900px){.adv-margin-deco{display:none}.deco-corner-tr,.deco-corner-bl{display:none}.section-inner{padding:0 24px!important}}
    @media(max-width:768px){.mag-grid{display:none}.adv-stats-row{gap:20px}}

    /* ── Hero Intro Section (Title + Subtitle after slideshow) ── */
    .hero-intro{background:#ffffff;padding:56px 5% 48px;overflow:hidden;position:relative;border-bottom:1px solid #e8f5f8}
    .hero-intro-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
    .hero-intro-img{position:relative;border-radius:16px;overflow:hidden;box-shadow:0 24px 64px rgba(13,59,102,.14)}
    .hero-intro-img img{width:100%;height:380px;object-fit:cover;display:block;transition:transform .8s cubic-bezier(.25,.46,.45,.94)}
    .hero-intro-img:hover img{transform:scale(1.04)}
    /* Ornamen shape */
    .hero-intro-img::before{content:"";position:absolute;top:-18px;left:-18px;width:90px;height:90px;border-radius:50%;background:rgba(56,197,216,.18);z-index:0;pointer-events:none}
    .hero-intro-img::after{content:"";position:absolute;bottom:-14px;right:-14px;width:60px;height:60px;border:3px solid rgba(8,145,178,.25);border-radius:50%;z-index:0;pointer-events:none}
    .hero-intro-txt{position:relative;z-index:1}
    .hero-intro-eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:18px}
    .hero-intro-eyebrow .line{width:36px;height:2px;background:linear-gradient(90deg,#0891b2,rgba(8,145,178,0));border-radius:1px}
    .hero-intro-h1{font-family:"Playfair Display",serif;font-size:clamp(1.9rem,4.5vw,3.2rem);font-weight:900;color:#0d3b66;line-height:1.08;margin-bottom:20px;letter-spacing:-.02em}
    .hero-intro-p{font-size:1rem;color:#4a7f98;line-height:1.85;margin-bottom:32px;max-width:400px}
    /* Deco blobs background */
    .hero-intro-blob1{position:absolute;top:-60px;right:-80px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(8,145,178,.1) 0%,rgba(8,145,178,0) 70%);pointer-events:none}
    .hero-intro-blob2{position:absolute;bottom:-40px;left:40%;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(56,197,216,.09) 0%,rgba(56,197,216,0) 70%);pointer-events:none}
    /* Ornamen dekoratif teks */
    .hero-intro-deco-line{position:absolute;top:0;right:0;width:1px;height:100%;background:linear-gradient(to bottom,rgba(13,59,102,0),rgba(13,59,102,.08),rgba(13,59,102,0));pointer-events:none}
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
    .adv2-eyebrow .line{width:36px;height:1.5px;background:#38c5d8;flex-shrink:0}
    .adv2-eyebrow span{font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;color:#38c5d8;font-weight:700}
    .adv2-title{font-family:"Playfair Display",serif;font-size:clamp(1.8rem,3.8vw,2.8rem);font-weight:900;color:#fff;line-height:1.08;margin-bottom:14px}
    /* Quote slideshow */
    .adv2-quote-wrap{position:relative;min-height:56px;margin-bottom:28px;padding-left:16px;border-left:2px solid #38c5d8}
    .adv2-quote-item{position:absolute;top:0;left:16px;right:0;font-size:.9375rem;color:rgba(255,255,255,.75);line-height:1.85;font-style:italic;opacity:0;transition:opacity .6s ease;pointer-events:none}
    .adv2-quote-item.active{opacity:1;position:relative;left:0}
    .adv2-quote-dots{display:flex;gap:6px;margin-bottom:28px}
    .adv2-qdot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.25);border:none;cursor:pointer;transition:background .3s,width .3s}
    .adv2-qdot.on{width:18px;border-radius:3px;background:#38c5d8}
    .adv2-stats{display:flex;gap:28px;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,.12)}
    .adv2-stat .num{font-family:"Playfair Display",serif;font-size:1.75rem;font-weight:900;color:#38c5d8;line-height:1;margin-bottom:3px}
    .adv2-stat .lbl{font-size:.625rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.72);font-weight:600}
    .adv2-btns{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px}
    .adv2-btn-pill{padding:8px 16px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.15);border-radius:20px;font-size:.75rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
    .adv2-btn-pill:hover{background:rgba(255,255,255,.16);color:#fff}
    .adv2-cta{display:inline-flex;align-items:center;gap:10px;padding:12px 24px;background:linear-gradient(135deg,#0ea5c5,#22d3ee);color:#063d5c;border:none;border-radius:6px;font-size:.8125rem;font-weight:800;cursor:pointer;letter-spacing:.06em;text-transform:uppercase;transition:opacity .2s,transform .2s;font-family:"Playfair Display",serif}
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
    .admin-sidebar{width:220px;background:#0d3b66;flex-shrink:0;overflow-y:auto;display:flex;flex-direction:column;transition:transform .25s}
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
    .cms-editor-left{padding:32px 40px;border-right:1px solid #e0f7fa;overflow-y:auto;max-height:calc(100vh - 120px)}
    .cms-editor-right{padding:24px 20px;background:#f5fdff;display:flex;flex-direction:column;gap:20px;overflow-y:auto}
    @media(max-width:900px){
      .cms-editor-left{padding:20px 16px;max-height:none;border-right:none;border-bottom:1px solid #e0f7fa}
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
    .cms-topbar{background:#0d3b66;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
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
      nav{background:linear-gradient(105deg,#ffffff 0%,#e8f9fb 30%,#a8dde8 62%,#0aa8bf 100%)!important;backdrop-filter:none!important;padding:0 4%!important;overflow:visible!important}
      nav>div:not(.mobile-dropdown){height:60px!important;gap:10px!important}
      /* Fix 10: logo lebih kecil di mobile */
      nav img{height:42px!important;max-width:86px!important;width:auto!important}
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
      div[style*="borderTop: \"1px solid #c0e8f0\""] > div{flex-direction:column!important;gap:10px!important;align-items:flex-start!important}
    }

    /* 12. Navbar mobile menu — tidak tumpang tindih konten */
    @media(max-width:640px){
      /* Mobile menu dropdown: posisi absolute ikut bawah nav, scroll kalau banyak item */
      nav .mobile-dropdown{position:absolute!important;top:100%!important;left:0!important;right:0!important;max-height:calc(100vh - 64px)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;display:flex!important;flex-direction:column!important}
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
      button.hero-cta-btn[style*="transparent"]{background:#0d3b66!important;border-color:#0d3b66!important;color:#fff!important}
      /* Explore All & Book Now ghost buttons → solid */
      button[style*='"transparent"']{background:#0d3b66!important;color:#fff!important}
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
      nav>div:not(.mobile-dropdown){height:64px!important}
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
            style={{ flex: 1, padding: "8px 10px", border: "1px solid #86cad8", borderRadius: 6, fontSize: 14, resize: "vertical", minHeight: 80 }} />
        : <input value={val} onChange={onChange}
            style={{ flex: 1, padding: "8px 10px", border: "1px solid #86cad8", borderRadius: 6, fontSize: 14 }} />
      }
      <button onClick={onSave}
        style={{ padding: "8px 14px", background: "#0ea5c5", color: "#fff", borderRadius: 6, fontSize: 12, border: "none" }}>Save</button>
    </div>
  );
}

/* ─────────────── LOGO DISPLAY ─────────────── */
function LogoDisplay({ content, size = "nav" }) {
  const rawText = content.logoText || "";
  const singleLine = content.logoSingleLine;
  const lines = singleLine ? [rawText.replace(/\n/g, " ")] : rawText.split("\n");
  const iconSz = size === "nav" ? 72 : size === "footer" ? 52 : 34;

  // Styling dinamis — hanya berlaku di nav (bukan footer/admin)
  const isNav = size === "nav";
  const dynStyle = isNav ? {
    fontFamily: `'${content.logoFont || "Playfair Display"}', serif`,
    color: content.logoColor || "#111111",
    textShadow: content.logoShadow || "0 1px 6px rgba(0,0,0,.35), 0 2px 14px rgba(0,0,0,.18)",
  } : {};

  const brandClass = size === "admin" ? "logo-brand-admin" : size === "footer" ? "logo-brand-footer" : "logo-brand";

  if (content.logoImage) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={content.logoImage} alt={content.logoText}
          style={{ height: size === "nav" ? 88 : size === "footer" ? 64 : iconSz, maxWidth: size === "nav" ? 180 : size === "footer" ? 140 : 120, objectFit: "contain", display: "block" }} />
        <span className={brandClass} style={dynStyle}>
          {lines.map((line, i) => <span key={i} style={{ display: singleLine ? "inline" : "block" }}>{line}</span>)}
        </span>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: iconSz, height: iconSz,
        borderRadius: size === "nav" ? 12 : 8,
        border: `1.5px dashed ${size === "admin" ? "rgba(255,255,255,.3)" : "#86cad8"}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        background: size === "admin" ? "rgba(255,255,255,.06)" : "rgba(61,143,171,.06)"
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={size === "admin" ? "rgba(255,255,255,.4)" : "#7bd3e4"} strokeWidth="1.5"
          width={size === "nav" ? 32 : 18} height={size === "nav" ? 32 : 18}>
          <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <span className={brandClass} style={dynStyle}>
        {lines.map((line, i) => <span key={i} style={{ display: singleLine ? "inline" : "block" }}>{i > 0 && singleLine ? " " + line : line}</span>)}
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
  if (!blocks || !blocks.length) return <p style={{ color: "#4a7f98", fontStyle: "italic" }}>No content yet.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {blocks.map((b, i) => {
        if (b.type === "paragraph") return (
          <div key={i} style={{ fontSize: "1rem", lineHeight: 1.85, color: "#1a4a72" }}
            dangerouslySetInnerHTML={{ __html: b.value }} />
        );
        if (b.type === "heading") return (
          <h2 key={i} className="display" style={{ fontSize: "1.625rem", fontWeight: 800, color: "#0d3b66", marginTop: 12 }}>{b.value}</h2>
        );
        if (b.type === "image") return (
          <figure key={i} style={{ margin: "10px 0" }}>
            <img loading="lazy" src={b.value} alt={b.caption || ""} style={{ width: "100%", maxHeight: 460, objectFit: "cover", borderRadius: 8 }} />
            {b.caption && <figcaption style={{ fontSize: "0.8125rem", color: "#1a5a78", textAlign: "center", marginTop: 10, fontStyle: "italic", lineHeight: 1.5 }}>{b.caption}</figcaption>}
          </figure>
        );
        if (b.type === "quote") return (
          <blockquote key={i} style={{ borderLeft: "3px solid #0891b2", paddingLeft: 22, margin: "10px 0" }}>
            <p style={{ fontSize: "1.125rem", fontStyle: "italic", color: "#1a4a72", lineHeight: 1.75, fontFamily: "'Cormorant Garamond',serif" }}>{b.value}</p>
          </blockquote>
        );
        if (b.type === "embed_instagram") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ background: "#edfafc", border: "1px solid #c0e8f0", borderRadius: 8, padding: 16, fontSize: "0.8125rem", color: "#1a5a78" }}>
              📸 <strong>Instagram Embed:</strong> <a href={b.value} target="_blank" rel="noopener noreferrer" style={{ color: "#0891b2" }}>{b.value}</a>
              <blockquote className="instagram-media" data-instgrm-permalink={b.value} data-instgrm-version="14" style={{ border: "1px solid #b0dce8", borderRadius: 6, padding: 10, marginTop: 8, background: "#fff" }}>
                <a href={b.value} target="_blank" rel="noopener noreferrer" style={{ color: "#0891b2", display: "block", marginTop: 6 }}>View on Instagram</a>
              </blockquote>
            </div>
          </div>
        );
        if (b.type === "embed_tiktok") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ background: "#edfafc", border: "1px solid #c0e8f0", borderRadius: 8, padding: 16, fontSize: "0.8125rem", color: "#1a5a78" }}>
              🎵 <strong>TikTok Embed:</strong> <a href={b.value} target="_blank" rel="noopener noreferrer" style={{ color: "#0891b2" }}>{b.value}</a>
              <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #b0dce8", padding: "12px 14px", marginTop: 8 }}>
                <blockquote className="tiktok-embed" cite={b.value} data-video-id={b.value.split("/video/")[1]?.split("?")[0] || ""}>
                  <section><a href={b.value} target="_blank" rel="noopener noreferrer" style={{ color: "#0891b2" }}>View on TikTok</a></section>
                </blockquote>
              </div>
            </div>
          </div>
        );
        if (b.type === "divider") return <hr key={i} style={{ border: "none", borderTop: "1px solid #c0e8f0" }} />;
        if (b.type === "baca_juga") return (
          <div key={i} style={{ borderLeft: "4px solid #0891b2", background: "linear-gradient(90deg,#edfafc 0%,#f8fdff 100%)", borderRadius: "0 10px 10px 0", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 18 }}>📖</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#0891b2", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Baca Juga</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0d3b66", lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</div>
            </div>
            {b.coverImage && <img loading="lazy" src={b.coverImage} alt="" style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />}
          </div>
        );
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

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      // Insert non-breaking spaces as indent (2em = ~4 chars)
      document.execCommand("insertHTML", false, "\u00a0\u00a0\u00a0\u00a0");
      if (editorRef.current) { onChange(editorRef.current.innerHTML); }
    }
  };

  useEffect(() => {
    const close = (e) => { if (!e.target.closest?.("[data-richpicker]")) { setColorMenuOpen(false); setHighlightMenuOpen(false); } };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const TB = ({ cmd, val = null, title, children, extraStyle = {} }) => (
    <button title={title} onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
      style={{ padding: "3px 7px", fontSize: 13, border: "1px solid #b0dce8", borderRadius: 4, background: "#fff", color: "#4a6680", cursor: "pointer", lineHeight: 1.4, display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 26, ...extraStyle }}>
      {children}
    </button>
  );
  const SEP = () => <span style={{ width: 1, height: 20, background: "#b0dce8", display: "inline-block", margin: "0 3px", verticalAlign: "middle" }} />;

  const textColors = ["#000000","#0d3b66","#0891b2","#e74c3c","#27ae60","#f39c12","#8e44ad","#e67e22","#7f8c8d","#ffffff"];
  const hlColors  = ["#ffff00","#00ff7f","#ff9900","#ffcccc","#cce5ff","#e2ccff","transparent"];
  const fontSizeMap = {"8":1,"10":2,"12":3,"14":4,"18":5,"24":6,"36":7};

  return (
    <div style={{ border: "1.5px solid #b0dce8", borderRadius: 8, overflow: "visible", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
      {/* ── Toolbar Row 1: Font, Size, Basic Formatting ── */}
      <div style={{ background: "#edfafc", borderBottom: "1px solid #c0e8f0", padding: "6px 10px", display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
        <select onChange={e => exec("fontName", e.target.value)}
          style={{ height: 26, fontSize: 12, padding: "1px 4px", border: "1px solid #b0dce8", borderRadius: 4, background: "#fff", color: "#0d3b66", maxWidth: 130, cursor: "pointer" }}>
          {["Calibri (Body)","Arial","Times New Roman","Georgia","Verdana","Courier New","Trebuchet MS"].map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select onChange={e => exec("fontSize", fontSizeMap[e.target.value] || 3)}
          style={{ height: 26, fontSize: 12, padding: "1px 4px", border: "1px solid #b0dce8", borderRadius: 4, background: "#fff", color: "#0d3b66", width: 52, cursor: "pointer" }}>
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
            style={{padding:"2px 7px",border:"1px solid #b0dce8",borderRadius:4,background:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,minHeight:26,lineHeight:1}}>
            <span style={{fontSize:13,fontWeight:900,color:"#0d3b66",lineHeight:1}}>A</span>
            <span style={{width:14,height:3,background:"#e74c3c",borderRadius:1}}/>
          </button>
          {colorMenuOpen && (
            <div style={{position:"absolute",top:32,left:0,background:"#fff",border:"1px solid #b0dce8",borderRadius:8,padding:8,zIndex:9999,display:"flex",gap:4,flexWrap:"wrap",width:132,boxShadow:"0 6px 20px rgba(0,0,0,.15)"}}>
              <div style={{width:"100%",fontSize:10,color:"#5090aa",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",marginBottom:2}}>Warna Teks</div>
              {textColors.map(c=>(
                <button key={c} onMouseDown={e=>{e.preventDefault();exec("foreColor",c);setColorMenuOpen(false);}}
                  style={{width:22,height:22,borderRadius:4,background:c,border:"1.5px solid #b0dce8",cursor:"pointer",outline:"none"}}/>
              ))}
            </div>
          )}
        </div>
        {/* Highlight */}
        <div style={{position:"relative"}} data-richpicker="1">
          <button title="Sorot Teks" onMouseDown={e=>{e.preventDefault();setHighlightMenuOpen(p=>!p);setColorMenuOpen(false);}}
            style={{padding:"2px 7px",border:"1px solid #b0dce8",borderRadius:4,background:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,minHeight:26,lineHeight:1}}>
            <span style={{fontSize:11,color:"#333",lineHeight:1,fontWeight:600}}>ab</span>
            <span style={{width:14,height:3,background:"#ffff00",border:"1px solid #ccc",borderRadius:1}}/>
          </button>
          {highlightMenuOpen && (
            <div style={{position:"absolute",top:32,left:0,background:"#fff",border:"1px solid #b0dce8",borderRadius:8,padding:8,zIndex:9999,display:"flex",gap:4,flexWrap:"wrap",width:110,boxShadow:"0 6px 20px rgba(0,0,0,.15)"}}>
              <div style={{width:"100%",fontSize:10,color:"#5090aa",fontWeight:600,letterSpacing:".5px",textTransform:"uppercase",marginBottom:2}}>Sorotan</div>
              {hlColors.map(c=>(
                <button key={c} onMouseDown={e=>{e.preventDefault();exec("hiliteColor",c);setHighlightMenuOpen(false);}}
                  style={{width:22,height:22,borderRadius:4,background:c,border:"1.5px solid #b0dce8",cursor:"pointer",outline:"none"}} title={c === "transparent" ? "Hapus Sorotan" : c}/>
              ))}
            </div>
          )}
        </div>
        <SEP />
        <TB cmd="undo" title="Undo (Ctrl+Z)">↶</TB>
        <TB cmd="redo" title="Redo (Ctrl+Y)">↷</TB>
      </div>

      {/* ── Toolbar Row 2: Lists, Indent, Paragraph, Alignment ── */}
      <div style={{ background: "#edfafc", borderBottom: "1px solid #c0e8f0", padding: "5px 10px", display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
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
          onKeyDown={handleKeyDown}
          onFocus={() => setIsEmpty(false)}
          onBlur={() => setIsEmpty(!editorRef.current?.textContent?.trim())}
          style={{
            minHeight: 220, padding: "16px 18px", fontSize: 14, color: "#0d3b66",
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
function CMSEditor({ post, onSave, onCancel, section, onSectionChange, user, notify: notifyFn, allPosts = [] }) {
  const notify = typeof notifyFn === "function" ? notifyFn : (msg) => alert(msg);
  const authorDefault = post?.author || user?.name || user?.username || "";
  const [form, setForm] = useState(post || {
    title: "", date: new Date().toISOString().slice(0, 10), author: authorDefault, category: "",
    coverImage: "", excerpt: "", content: [], tags: "", status: "draft", section,
  });
  const [blocks, setBlocks] = useState(post?.content || []);
  const [addType, setAddType] = useState("paragraph");
  const [addVal, setAddVal] = useState("");
  const [addCaption, setAddCaption] = useState("");
  const [editBlockIdx, setEditBlockIdx] = useState(null);
  const [editBlockVal, setEditBlockVal] = useState("");
  const [imgUploadMode, setImgUploadMode] = useState("url");
  const [coverUploadMode, setCoverUploadMode] = useState("url");
  const [coverUploading, setCoverUploading] = useState(false);
  const [publishModal, setPublishModal] = useState(false);
  const [bacaJugaSearch, setBacaJugaSearch] = useState("");
  const [bacaJugaSelected, setBacaJugaSelected] = useState(null); // { id, title, coverImage, section }
  const coverFileRef = useRef();
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
    if (addType === "baca_juga") {
      if (!bacaJugaSelected) return;
      setBlocks(p => [...p, { type: "baca_juga", postId: bacaJugaSelected.id, title: bacaJugaSelected.title, coverImage: bacaJugaSelected.coverImage || "", section: bacaJugaSelected.section || "" }]);
      setBacaJugaSelected(null); setBacaJugaSearch("");
      return;
    }
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

  const saveEditBlock = (i) => {
    const stripped = editBlockVal.replace(/<[^>]*>/g, "").trim();
    if (!stripped && editBlockVal.trim() === "") return;
    setBlocks(p => p.map((b, idx) => idx === i ? { ...b, value: editBlockVal } : b));
    setEditBlockIdx(null); setEditBlockVal("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      notify("⏳ Mengupload gambar...");
      const url = await uploadToCloudinary(file);
      setAddVal(url);
      notify("✅ Gambar berhasil diupload!");
    } catch (err) {
      notify("❌ Gagal upload gambar. Periksa koneksi & Cloudinary preset.", "error");
    }
    // reset input agar bisa upload file sama lagi
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      notify("⏳ Mengupload cover image...");
      const url = await uploadToCloudinary(file);
      setForm(p => ({ ...p, coverImage: url }));
      notify("✅ Cover image berhasil diupload!");
    } catch {
      notify("❌ Gagal upload cover. Periksa koneksi & Cloudinary preset.", "error");
    } finally {
      setCoverUploading(false);
      if (coverFileRef.current) coverFileRef.current.value = "";
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
    baca_juga: "🔗 Baca Juga",
  };

  const needsValue = addType !== "divider" && addType !== "baca_juga";

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
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0d3b66", textAlign: "center", marginBottom: 6, fontFamily: "'Playfair Display',serif" }}>
              Pilih Tujuan Publish
            </h2>
            <p style={{ fontSize: 13, color: "#4a7f98", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
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
                  border: section === opt.key ? "2px solid #0d3b66" : "1.5px solid #c0e8f0",
                  borderRadius: 10, background: section === opt.key ? "#f0f5fa" : "#fff",
                  cursor: "pointer", textAlign: "left", transition: "all .15s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#0891b2"; e.currentTarget.style.background = "#edfafc"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = section === opt.key ? "#0d3b66" : "#c0e8f0"; e.currentTarget.style.background = section === opt.key ? "#f0f5fa" : "#fff"; }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0d3b66" }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: "#4a7f98", marginTop: 2 }}>{opt.desc}</div>
                  </div>
                  {section === opt.key && <span style={{ marginLeft: "auto", fontSize: 16, color: "#27ae60" }}>✓</span>}
                </button>
              ))}
            </div>
            <button onClick={() => setPublishModal(false)} style={{
              width: "100%", marginTop: 16, padding: "10px", border: "1px solid #b0dce8",
              borderRadius: 8, fontSize: 13, color: "#4a7f98", background: "#f5fdff", cursor: "pointer"
            }}>Batal</button>
          </div>
        </div>
      )}

      {/* CMS Top Bar */}
      <div style={{ background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
              color: "#0d3b66", border: "none", outline: "none", borderBottom: "2px solid #e0f7fa",
              paddingBottom: 14, marginBottom: 24, background: "transparent" }} />

          {/* Excerpt */}
          <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
            placeholder="Ringkasan singkat artikel..."
            rows={3}
            style={{ width: "100%", fontSize: 14, color: "#4a7f98", border: "1px solid #e0f7fa",
              borderRadius: 6, padding: "12px 14px", outline: "none", resize: "vertical",
              marginBottom: 28, lineHeight: 1.65, background: "#f5fdff" }} />

          {/* Blocks */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>Content Blocks</div>
            {blocks.length === 0 && (
              <div style={{ background: "#f5fdff", border: "2px dashed #b0dce8", borderRadius: 8, padding: "32px", textAlign: "center", color: "#5090aa", fontSize: 13 }}>
                No content yet. Add your first block below.
              </div>
            )}
            {blocks.map((b, i) => (
              <div key={i} style={{ background: "#f5fdff", border: `1px solid ${editBlockIdx === i ? "#0ea5c5" : "#e0f7fa"}`, borderRadius: 8, padding: "14px 16px", marginBottom: 10, position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, background: "#e8f4fd", color: "#0ea5c5", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>{blockLabels[b.type] || b.type}</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                    <button onClick={() => moveBlock(i, -1)} title="Naik" style={{ padding: "3px 8px", fontSize: 11, border: "1px solid #b0dce8", borderRadius: 4, color: "#5090aa", background: "#fff" }}>↑</button>
                    <button onClick={() => moveBlock(i, 1)} title="Turun" style={{ padding: "3px 8px", fontSize: 11, border: "1px solid #b0dce8", borderRadius: 4, color: "#5090aa", background: "#fff" }}>↓</button>
                    {b.type !== "divider" && b.type !== "image" && b.type !== "baca_juga" && (
                      <button onClick={() => { setEditBlockIdx(i); setEditBlockVal(b.value || ""); }} title="Edit" style={{ padding: "3px 8px", fontSize: 11, border: "1px solid #0ea5c5", background: "#e8f9fc", color: "#0ea5c5", borderRadius: 4 }}>✏</button>
                    )}
                    <button onClick={() => { if (editBlockIdx === i) { setEditBlockIdx(null); setEditBlockVal(""); } removeBlock(i); }} title="Hapus" style={{ padding: "3px 8px", fontSize: 11, border: "none", background: "#fee", color: "#e74c3c", borderRadius: 4 }}>✕</button>
                  </div>
                </div>
                {/* Inline edit mode */}
                {editBlockIdx === i ? (
                  <div>
                    {b.type === "paragraph" ? (
                      <RichParagraphEditor
                        value={editBlockVal}
                        onChange={setEditBlockVal}
                        placeholder="Tulis konten paragraf di sini..."
                      />
                    ) : (
                      <input value={editBlockVal} onChange={e => setEditBlockVal(e.target.value)}
                        autoFocus
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #0ea5c5", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button onClick={() => saveEditBlock(i)} style={{ padding: "6px 16px", background: "#27ae60", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✓ Simpan</button>
                      <button onClick={() => { setEditBlockIdx(null); setEditBlockVal(""); }} style={{ padding: "6px 12px", background: "#eee", color: "#5090aa", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Batal</button>
                    </div>
                  </div>
                ) : b.type === "image" ? (
                  <div>
                    <img loading="lazy" src={b.value} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }} onError={e => { e.target.style.display = "none"; }} />
                    {b.caption && <p style={{ fontSize: 11, color: "#5090aa", marginTop: 4, fontStyle: "italic" }}>{b.caption}</p>}
                  </div>
                ) : b.type === "divider" ? (
                  <hr style={{ border: "none", borderTop: "2px solid #b0dce8" }} />
                ) : b.type === "baca_juga" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#edfafc", borderLeft: "3px solid #0891b2", borderRadius: "0 6px 6px 0", padding: "8px 12px" }}>
                    <span style={{ fontSize: 15 }}>📖</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: ".06em" }}>Baca Juga</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#0d3b66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</div>
                    </div>
                    {b.coverImage && <img loading="lazy" src={b.coverImage} alt="" style={{ width: 40, height: 30, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />}
                  </div>
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
          <div style={{ background: "#edfafc", border: "1px solid #c0e8f0", borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>Add Block</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {Object.entries(blockLabels).map(([k, label]) => (
                <button key={k} onClick={() => setAddType(k)} style={{
                  padding: "5px 12px", fontSize: 12, borderRadius: 20,
                  border: addType === k ? "none" : "1px solid #b0dce8",
                  background: addType === k ? "#0ea5c5" : "#fff",
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
                        border: imgUploadMode === m ? "none" : "1px solid #b0dce8",
                        background: imgUploadMode === m ? "#0d3b66" : "#fff",
                        color: imgUploadMode === m ? "#fff" : "#4a7f98"
                      }}>{m === "url" ? "URL" : "Upload File"}</button>
                    ))}
                  </div>
                )}

                {addType === "image" && imgUploadMode === "upload" ? (
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                    <button onClick={() => fileRef.current?.click()} style={{
                      padding: "10px 20px", border: "1.5px dashed #0ea5c5", borderRadius: 8,
                      color: "#0ea5c5", fontSize: 13, background: "#e8f9fc", width: "100%", marginBottom: 8
                    }}>📁 Click to Upload Image</button>
                    {addVal && <img loading="lazy" src={addVal} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6, marginBottom: 8 }} />}
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
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #b0dce8",
                      borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", marginBottom: 8, lineHeight: 1.6 }} />
                ) : (
                  <input value={addVal} onChange={e => setAddVal(e.target.value)}
                    placeholder={
                      addType === "heading" ? "Section heading..." :
                      addType === "image" ? "https://example.com/image.jpg" :
                      addType === "embed_instagram" ? "https://www.instagram.com/p/..." :
                      addType === "embed_tiktok" ? "https://www.tiktok.com/@user/video/..." : ""
                    }
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #b0dce8",
                      borderRadius: 6, fontSize: 13, outline: "none", marginBottom: 8 }} />
                )}

                {addType === "image" && (
                  <input value={addCaption} onChange={e => setAddCaption(e.target.value)}
                    placeholder="Image caption (optional)"
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #b0dce8",
                      borderRadius: 6, fontSize: 12, outline: "none", marginBottom: 8 }} />
                )}
              </>
            )}

            {addType === "baca_juga" && (() => {
              const otherPosts = allPosts.filter(p => p.id !== post?.id && p.status === "published");
              const filtered = bacaJugaSearch.trim()
                ? otherPosts.filter(p => p.title?.toLowerCase().includes(bacaJugaSearch.toLowerCase()))
                : otherPosts;
              return (
                <div style={{ marginBottom: 8 }}>
                  <input
                    value={bacaJugaSearch}
                    onChange={e => { setBacaJugaSearch(e.target.value); setBacaJugaSelected(null); }}
                    placeholder="🔍 Cari judul artikel..."
                    style={{ width: "100%", padding: "9px 12px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", marginBottom: 8, boxSizing: "border-box" }}
                  />
                  {bacaJugaSelected ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#e8f9fc", borderRadius: 8, border: "1.5px solid #0ea5c5" }}>
                      {bacaJugaSelected.coverImage && <img loading="lazy" src={bacaJugaSelected.coverImage} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />}
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0d3b66", flex: 1 }}>{bacaJugaSelected.title}</span>
                      <button onClick={() => setBacaJugaSelected(null)} style={{ fontSize: 11, color: "#e74c3c", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ maxHeight: 180, overflowY: "auto", border: "1px solid #c0e8f0", borderRadius: 8, background: "#fff" }}>
                      {filtered.length === 0 ? (
                        <div style={{ padding: "14px 12px", fontSize: 12, color: "#4a7f98", textAlign: "center" }}>
                          {otherPosts.length === 0 ? "Belum ada artikel published lain." : "Artikel tidak ditemukan."}
                        </div>
                      ) : filtered.map(p => (
                        <div key={p.id} onClick={() => { setBacaJugaSelected(p); setBacaJugaSearch(""); }}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", cursor: "pointer", borderBottom: "1px solid #edfafc", transition: "background .12s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#edfafc"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          {p.coverImage && <img loading="lazy" src={p.coverImage} alt="" style={{ width: 40, height: 30, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#0d3b66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                            <div style={{ fontSize: 11, color: "#4a7f98" }}>{p.section}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <button onClick={addBlock} style={{
              padding: "9px 22px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff",
              borderRadius: 6, fontSize: 13, border: "none", fontWeight: 500
            }}>+ Add Block</button>
          </div>
        </div>

        {/* Right: Meta / Publish */}
        <div className="cms-editor-right">
          {/* Section Selector */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e0f7fa", overflow: "hidden" }}>
            <div style={{ background: "#edfafc", padding: "12px 16px", borderBottom: "1px solid #e0f7fa" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0d3b66", letterSpacing: ".5px" }}>PUBLISH TO</span>
            </div>
            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(SECTION_LABELS).map(([key, label]) => (
                <button key={key} onClick={() => onSectionChange && onSectionChange(key)} style={{
                  padding: "8px 12px", borderRadius: 6, fontSize: 12, fontWeight: section === key ? 600 : 400,
                  border: section === key ? "none" : "1px solid #b0dce8",
                  background: section === key ? "#0d3b66" : "#fff",
                  color: section === key ? "#fff" : "#4a6680",
                  textAlign: "left", transition: "all .15s"
                }}>{section === key ? "✓ " : ""}{label}</button>
              ))}
            </div>
          </div>

          {/* Publish Box */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e0f7fa", overflow: "hidden" }}>
            <div style={{ background: "#edfafc", padding: "12px 16px", borderBottom: "1px solid #e0f7fa" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0d3b66", letterSpacing: ".5px" }}>PUBLISH</span>
            </div>
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#5090aa" }}>Status:</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: form.status === "published" ? "#27ae60" : "#f39c12",
                  background: form.status === "published" ? "#eeffee" : "#fff9ee", padding: "2px 10px", borderRadius: 10 }}>
                  {form.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#5090aa" }}>Visibility:</span>
                <span style={{ fontSize: 12, color: "#4a6680", fontWeight: 500 }}>Public</span>
              </div>
              <div style={{ borderTop: "1px solid #e0f7fa", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => handleSave("draft")} style={{
                  padding: "8px 0", border: "1px solid #b0dce8", borderRadius: 6,
                  fontSize: 12, color: "#4a6680", background: "#fff", fontWeight: 500
                }}>Save Draft</button>
                <button onClick={() => setPublishModal(true)} style={{
                  padding: "10px 0", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", border: "none",
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
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
              <input type={f.type || "text"} value={form[f.key] || ""} placeholder={f.placeholder || ""}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none" }} />
            </div>
          ))}

          {/* Author — auto dari akun yang login */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>
              Author <span style={{ fontSize: 10, color: "#27ae60", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>· otomatis</span>
            </label>
            <div style={{ position: "relative" }}>
              <input value={form.author || ""} readOnly
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", background: "#edfafc", color: "#0d3b66", fontWeight: 600, cursor: "default" }} />
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12 }}>🔒</span>
            </div>
            <p style={{ fontSize: 11, color: "#5090aa", marginTop: 4 }}>Diisi otomatis dari akun yang login</p>
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Tags</label>
            <input value={typeof form.tags === "string" ? form.tags : (form.tags || []).join(", ")}
              onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              placeholder="beach, travel, gear"
              style={{ width: "100%", padding: "8px 10px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none" }} />
            <p style={{ fontSize: 11, color: "#5090aa", marginTop: 4 }}>Separate with commas</p>
          </div>

          {/* Cover Image */}
          <div style={{ background: "#fff", border: "1px solid #e0f7fa", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ background: "#edfafc", padding: "12px 16px", borderBottom: "1px solid #e0f7fa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#0d3b66", letterSpacing: ".5px" }}>COVER IMAGE</span>
              <div style={{ display: "flex", gap: 4 }}>
                {["url", "upload"].map(m => (
                  <button key={m} onClick={() => setCoverUploadMode(m)} style={{ padding: "2px 10px", fontSize: 10, borderRadius: 4, border: "none",
                    background: coverUploadMode === m ? "#0d3b66" : "#d0eef5", color: coverUploadMode === m ? "#fff" : "#4a7f98", fontWeight: 600, cursor: "pointer" }}>
                    {m === "url" ? "URL" : "⬆ Upload"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: "12px 14px" }}>
              {coverUploadMode === "upload" ? (
                <div>
                  <input ref={coverFileRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: "none" }} />
                  <button onClick={() => coverFileRef.current?.click()} disabled={coverUploading}
                    style={{ width: "100%", padding: "10px", border: "1.5px dashed #0ea5c5", borderRadius: 8,
                      color: coverUploading ? "#aaa" : "#0ea5c5", fontSize: 12, background: "#e8f9fc",
                      cursor: coverUploading ? "not-allowed" : "pointer", fontWeight: 600 }}>
                    {coverUploading ? "⏳ Mengupload..." : "📁 Pilih File Gambar"}
                  </button>
                  <p style={{ fontSize: 10, color: "#5090aa", marginTop: 6 }}>JPG/PNG/WEBP · Maks 10MB · Otomatis ke Cloudinary</p>
                </div>
              ) : (
                <input value={form.coverImage || ""} onChange={e => setForm(p => ({ ...p, coverImage: e.target.value }))}
                  placeholder="https://..."
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
              )}
              {form.coverImage && (
                <div style={{ marginTop: 10, position: "relative" }}>
                  <img loading="lazy" src={form.coverImage} alt="" style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 6, display: "block" }}
                    onError={e => { e.target.style.display = "none"; }} />
                  <button onClick={() => setForm(p => ({ ...p, coverImage: "" }))}
                    style={{ position: "absolute", top: 6, right: 6, background: "rgba(231,76,60,.85)", color: "#fff", border: "none", borderRadius: 4, fontSize: 10, padding: "3px 7px", cursor: "pointer", fontWeight: 700 }}>✕ Hapus</button>
                </div>
              )}
            </div>
          </div>

          {/* Section badge */}
          <div style={{ fontSize: 11, color: "#5090aa", fontStyle: "italic", textAlign: "center", paddingTop: 4 }}>
            Posting to: <strong style={{ color: "#0ea5c5" }}>{SECTION_LABELS[section] || section}</strong>
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
        <img loading="lazy" src={post.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1600&h=400&fit=crop"; }} />
      </div>
      <div style={{ padding: "14px 16px 14px 0", flex: 1 }}>
        {post.category && <span className="label-xs" style={{ color: "#0891b2" }}>{post.category}</span>}
        <h3 className="post-card-title" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700,
          fontSize: "1.1rem", color: "#0d3b66", margin: "6px 0 8px", lineHeight: 1.3, transition: "color .2s" }}>{post.title}</h3>
        <p style={{ fontSize: "0.875rem", color: "#1a5a78", lineHeight: 1.65, marginBottom: 10 }}>
          {post.excerpt?.length > 100 ? post.excerpt.slice(0, 100) + "…" : post.excerpt}
        </p>
        <span style={{ fontSize: "0.75rem", color: "#4a7f98" }}>{formatDate(post.date)}</span>
      </div>
    </article>
  );

  return (
    <article className="post-card hover-lift" onClick={onClick}
      style={{ background: "#fff", borderRadius: 8, overflow: "hidden", cursor: "pointer",
        boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
      <div className="img-zoom" style={{ height: 200, overflow: "hidden" }}>
        <img loading="lazy" src={post.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1600&h=400&fit=crop"; }} />
      </div>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          {post.category && <span className="label-xs" style={{ color: "#0891b2" }}>{post.category}</span>}
          {post.badge && <span style={{ fontSize: "0.6875rem", background: "#fff3cd", color: "#7a5c00", padding: "2px 9px", borderRadius: 10, fontWeight: 600, letterSpacing: ".03em" }}>{post.badge}</span>}
          <span style={{ fontSize: "0.75rem", color: "#4a7f98" }}>{formatDate(post.date)}</span>
        </div>
        <h3 className="post-card-title" style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700,
          fontSize: "1.15rem", color: "#0d3b66", marginBottom: 10, lineHeight: 1.3, transition: "color .2s" }}>{post.title}</h3>
        <p style={{ fontSize: "0.875rem", color: "#1a5a78", lineHeight: 1.7 }}>
          {post.excerpt?.length > 110 ? post.excerpt.slice(0, 110) + "…" : post.excerpt}
        </p>
        {post.price && (
          <div style={{ marginTop: 12, fontSize: "1.25rem", fontWeight: 700, color: "#0891b2", fontFamily: "'Playfair Display',serif" }}>{post.price}</div>
        )}
        {post.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            {post.tags.slice(0, 3).map(t => (
              <span key={t} style={{ fontSize: "0.6875rem", padding: "3px 9px", background: "#edfafc", border: "1px solid #c0e8f0", borderRadius: 10, color: "#1a5a78", fontWeight: 500 }}>#{t}</span>
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
      <div className="article-back-bar" style={{ background: "rgba(250,252,253,.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid #c0e8f0",
        padding: "12px 5%", position: "sticky", top: 96, zIndex: 90 }}>
        <button onClick={onBack} style={{ fontSize: 13, color: "#0ea5c5", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
          ← Back
        </button>
      </div>

      {/* Cover */}
      {post.coverImage && (
        <div style={{ height: "clamp(240px, 45vw, 520px)", overflow: "hidden" }}>
          <img loading="lazy" src={post.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {/* Article */}
      <div className="article-body" style={{ maxWidth: 760, margin: "0 auto", padding: "48px 5% 80px" }}>
        {post.category && (
          <div className="label-xs" style={{ color: "#0891b2", marginBottom: 16 }}>{post.category}</div>
        )}
        <h1 className="display" style={{ fontSize: "clamp(1.875rem, 5vw, 3.25rem)", fontWeight: 800, lineHeight: 1.12, color: "#0d3b66", marginBottom: 20 }}>
          {post.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #c0e8f0" }}>
          <span style={{ fontSize: "0.875rem", color: "#1a5a78", fontWeight: 500 }}>By {post.author}</span>
          <span style={{ fontSize: "0.875rem", color: "#86cad8" }}>·</span>
          <span style={{ fontSize: "0.875rem", color: "#1a5a78" }}>{formatDate(post.date)}</span>
          {post.price && <span style={{ fontSize: "1.375rem", fontWeight: 700, color: "#0891b2", fontFamily: "'Playfair Display',serif", marginLeft: "auto" }}>{post.price}</span>}
        </div>
        {post.excerpt && (
          <p style={{ fontSize: "1.125rem", color: "#1a4a72", lineHeight: 1.85, marginBottom: 32, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, whiteSpace: "pre-line" }}>
            {post.excerpt}
          </p>
        )}
        <RichRenderer blocks={post.content} />
        {post.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 40, paddingTop: 24, borderTop: "1px solid #c0e8f0" }}>
            <span style={{ fontSize: "0.8125rem", color: "#1a5a78", fontWeight: 500 }}>Tags:</span>
            {post.tags.map(t => (
              <span key={t} style={{ fontSize: "0.8125rem", padding: "3px 12px", background: "#edfafc", border: "1px solid #c0e8f0", borderRadius: 20, color: "#1a4a72", fontWeight: 500 }}>#{t}</span>
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
    <div className="fade-in" style={{ minHeight: "100vh", background: "#edfafc" }}>
      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, #0891b2 0%, #0ea5c5 100%)", padding: "60px 5%", color: "#fff" }}>
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
                    border: filter === c ? "none" : "1px solid #b0dce8",
                    background: filter === c ? "#0891b2" : "#fff",
                    color: filter === c ? "#fff" : "#4a6680", fontWeight: filter === c ? 500 : 400,
                    transition: "all .2s"
                  }}>{c}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["grid", "▦"], ["list", "☰"]].map(([mode, icon]) => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{
                    padding: "7px 12px", fontSize: 14,
                    border: `1px solid ${viewMode === mode ? "#0ea5c5" : "#b0dce8"}`,
                    borderRadius: 6, background: viewMode === mode ? "#e8f4fd" : "#fff",
                    color: viewMode === mode ? "#0ea5c5" : "#5090aa"
                  }}>{icon}</button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#5090aa" }}>
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
              <div style={{ background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", padding: "14px 20px" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: "1px", textTransform: "uppercase" }}>Most Popular</span>
              </div>
              <div style={{ padding: "8px 0" }}>
                {popular.map((p, i) => (
                  <div key={p.id} onClick={() => onReadPost(p)}
                    style={{ display: "flex", gap: 12, padding: "10px 20px", cursor: "pointer", borderBottom: "1px solid #edfafc", transition: "background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#edfafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: i < 3 ? "#e74c3c" : "#86cad8", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1, minWidth: 24 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: "#0d3b66", lineHeight: 1.5, fontWeight: 400 }}>{p.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              <div style={{ background: "#edfafc", padding: "14px 20px", borderBottom: "1px solid #e0f7fa" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0d3b66", letterSpacing: "1px", textTransform: "uppercase" }}>Categories</span>
              </div>
              <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                {cats.filter(c => c !== "All").map(c => {
                  const count = published.filter(p => p.category === c).length;
                  return (
                    <button key={c} onClick={() => setFilter(c)}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "6px 0", borderBottom: "1px solid #edfafc", background: "none",
                        border: "none", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontSize: 13, color: "#0ea5c5" }}>→ {c}</span>
                      <span style={{ fontSize: 11, background: "#edfafc", color: "#5090aa", padding: "2px 8px", borderRadius: 10 }}>{count}</span>
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

/* ─────────────── TRAVEL PACKAGE CARD (accordion price) ─────────────── */

/* Shared hook: returns true when viewport width ≤ 640px */
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 640);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

/* ── WIDE CARD for Custom Event / Wedding Package — full width horizontal layout ── */
function EventWeddingCustomCardWide({ svc, onDetail, waLink }) {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const ac = svc.badgeColor || "#7c3aed";
  const isWedding = svc.category === "wedding";
  const gradientBg = isWedding
    ? `linear-gradient(135deg, #2d1b4e 0%, #5b2d8e 50%, ${ac} 100%)`
    : `linear-gradient(135deg, #0a2e52 0%, #1a5a78 50%, ${ac} 100%)`;
  const icon = isWedding ? "💍" : "🎉";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18,
        boxShadow: hovered ? "0 24px 64px rgba(13,59,102,.22)" : "0 6px 28px rgba(13,59,102,.13)",
        border: `2px solid ${hovered ? ac : ac + "60"}`,
        transition: "all .3s cubic-bezier(.22,1,.36,1)",
        transform: hovered ? "translateY(-4px)" : "none",
        background: gradientBg,
        display: "flex", flexDirection: isMobile ? "column" : "row",
        minHeight: isMobile ? "auto" : 280,
        fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden",
      }}>
      <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 100, bottom: -80, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />
      {/* Image */}
      <div style={{ position: "relative", width: isMobile ? "100%" : 320, height: isMobile ? 200 : "auto", flexShrink: 0, overflow: "hidden", borderRadius: isMobile ? "16px 16px 0 0" : "16px 0 0 16px" }}>
        <img loading="lazy" src={svc.images?.[0] || svc.image} alt={svc.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s", transform: hovered ? "scale(1.07)" : "scale(1)", opacity: 0.75 }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800"; }} />
        <div style={{ position: "absolute", inset: 0, background: isMobile ? "linear-gradient(180deg,transparent 40%,rgba(0,0,0,.5) 100%)" : "linear-gradient(90deg,transparent 50%, rgba(0,0,0,.4) 100%)" }} />
        <div style={{ position: "absolute", top: 16, left: 16, background: ac, color: "#fff", borderRadius: 20, padding: "4px 14px", fontSize: "0.625rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>{svc.badge}</div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: isMobile ? "22px 20px 24px" : "32px 40px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>{icon}</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: isMobile ? "1.4rem" : "clamp(1.4rem,2.5vw,2rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 6 }}>{svc.title}</h2>
        {svc.tagline && <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,.65)", fontWeight: 600, letterSpacing: ".04em", marginBottom: 14, fontStyle: "italic" }}>{svc.tagline}</div>}
        <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,.80)", lineHeight: 1.75, marginBottom: 20 }}>{svc.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {(svc.features || []).map((feat, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", background: "rgba(255,255,255,.12)", borderRadius: 8, padding: "5px 12px", backdropFilter: "blur(4px)" }}>
              <span style={{ color: "#4ade80", fontWeight: 700, fontSize: "0.875rem" }}>&#10003;</span>
              <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,.9)", fontWeight: 500 }}>{feat}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: isMobile ? "stretch" : "center", gap: 12, flexDirection: isMobile ? "column" : "row", flexWrap: "wrap" }}>
          <div style={{ marginBottom: isMobile ? 4 : 0 }}>
            <div style={{ fontSize: "0.625rem", color: "rgba(255,255,255,.55)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>Harga</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 900, color: "#fff" }}>{svc.price}</div>
            <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,.6)", fontStyle: "italic" }}>{svc.priceNote}</div>
          </div>
          <button onClick={onDetail}
            style={{ padding: "12px 28px", background: "#fff", color: ac, border: "none", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 800, cursor: "pointer", letterSpacing: ".02em", transition: "all .2s", boxShadow: "0 4px 16px rgba(0,0,0,.25)", width: isMobile ? "100%" : "auto" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = ".9"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}>
            Lihat Detail &amp; Konsultasi
          </button>
          <a href={waLink || "https://wa.me/6285745571442"} target="_blank" rel="noreferrer"
            style={{ padding: "12px 24px", background: "#25d366", color: "#fff", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", transition: "opacity .2s", width: isMobile ? "100%" : "auto" }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            &#128172; WhatsApp Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── WIDE CARD for Custom Package — full width horizontal layout ── */
/* ─────────────── EVENT / WEDDING PACKAGE CARD (Traveling-style) ─────────────── */
function EventWeddingPackageCard({ svc, onDetail, waLink }) {
  const [hovered, setHovered] = useState(false);
  const ac = svc.accent || (svc.category === "wedding" ? "#db2777" : "#0891b2");
  const al = svc.accentLight || (svc.category === "wedding" ? "#fff0f7" : "#edfafc");

  /* image gallery — pakai images[] jika ada, fallback image */
  const imgs = (svc.images && svc.images.length > 0) ? svc.images : [svc.image].filter(Boolean);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "#fff", borderRadius: 16, overflow: "visible",
        boxShadow: hovered ? "0 16px 48px rgba(13,59,102,.18)" : "0 4px 20px rgba(13,59,102,.09)",
        border: `2px solid ${hovered ? ac : svc.highlight ? ac + "80" : "transparent"}`,
        fontFamily: "'DM Sans',sans-serif", transition: "all .3s cubic-bezier(.22,1,.36,1)",
        transform: hovered ? "translateY(-5px)" : "none", position: "relative" }}>

      {/* Hero image with overlay title */}
      <div style={{ position: "relative", height: 190, overflow: "hidden", borderRadius: "14px 14px 0 0" }}>
        <img loading="lazy" src={imgs[imgIdx] || imgs[0]} alt={svc.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s", transform: hovered ? "scale(1.06)" : "scale(1)" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"; }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 35%,rgba(0,0,0,.65) 100%)" }} />
        {svc.badge && (
          <div style={{ position: "absolute", top: 12, left: 12, background: svc.badgeColor || ac, color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: "0.625rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
            {svc.badge}
          </div>
        )}
        {svc.highlight && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "linear-gradient(130deg,#063d5c,#0891b2)", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: "0.625rem", fontWeight: 700 }}>⭐ Pilihan Utama</div>
        )}
        {/* Image thumbnails nav (if multiple) */}
        {imgs.length > 1 && (
          <div style={{ position: "absolute", bottom: 42, right: 10, display: "flex", gap: 4 }}>
            {imgs.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                style={{ width: i === imgIdx ? 18 : 6, height: 6, borderRadius: 3, border: "none", background: i === imgIdx ? "#fff" : "rgba(255,255,255,.5)", cursor: "pointer", padding: 0, transition: "all .2s" }} />
            ))}
          </div>
        )}
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.0625rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 2, textShadow: "0 2px 12px rgba(0,0,0,.8), 0 1px 4px rgba(0,0,0,.6)" }}>{svc.title}</h3>
        </div>
      </div>

      {/* Info row: foto kegiatan count + category label */}
      <div style={{ padding: "10px 14px 0", display: "flex", gap: 14, flexWrap: "wrap" }}>
        {imgs.length > 1 && <span style={{ fontSize: "0.75rem", color: "#4a7f98" }}>🖼 {imgs.length} Foto Kegiatan</span>}
        <span style={{ fontSize: "0.75rem", color: "#4a7f98", textTransform: "capitalize" }}>
          {svc.category === "wedding" ? "💍 Wedding Organizer" : "📅 Event Organizer"}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: "0.8125rem", color: "#4a7f98", lineHeight: 1.6, padding: "8px 14px 10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{svc.description}</p>

      {/* Top features */}
      {(svc.features || []).length > 0 && (
        <div style={{ padding: "0 14px 12px" }}>
          {(svc.features || []).slice(0, 3).map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 5 }}>
              <span style={{ color: "#27ae60", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: "0.75rem", color: "#1a5a78", fontWeight: 500, lineHeight: 1.45 }}>{f}</span>
            </div>
          ))}
          {(svc.features || []).length > 3 && (
            <div style={{ fontSize: "0.6875rem", color: "#0891b2", fontWeight: 600, marginTop: 2 }}>+{svc.features.length - 3} fitur lainnya</div>
          )}
        </div>
      )}

      {/* Price block */}
      <div style={{
        background: `linear-gradient(135deg,#0d3b66 0%,#1a5a78 55%,${ac} 100%)`,
        padding: "14px 14px 16px", overflow: "hidden", position: "relative",
        borderTop: "3px solid rgba(255,255,255,.15)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.18)",
      }}>
        <div style={{ position: "absolute", right: -16, top: -16, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.05)" }} />
        <p style={{ color: "rgba(255,255,255,.65)", fontSize: "0.5625rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 3 }}>Mulai Dari</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 900, color: "#fff", lineHeight: 1, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>{svc.price}</span>
          <span style={{ color: "rgba(255,255,255,.65)", fontSize: "0.75rem" }}>{svc.priceNote}</span>
        </div>
        <p style={{ color: "rgba(255,255,255,.5)", fontSize: "0.6rem", marginTop: 4, fontStyle: "italic" }}>Nego / Konsultasi dulu</p>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: "10px 12px 12px", background: al, borderLeft: `1px solid ${ac}25`, borderRight: `1px solid ${ac}25`, borderBottom: `1px solid ${ac}25`, borderRadius: "0 0 14px 14px", display: "flex", gap: 8 }}>
        <button
          onClick={() => window.open(`${waLink || "https://wa.me/6285745571442"}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${svc.title}`)}`, "_blank")}
          style={{ flex: 1, padding: "10px 0", background: "#25D366", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          💬 WA
        </button>
        <button onClick={onDetail}
          style={{ flex: 3, padding: "10px 0", background: `linear-gradient(135deg,#0d3b66,${ac})`, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", transition: "opacity .2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          Lihat Detail →
        </button>
      </div>
    </div>
  );
}

function TravelPackageCardWide({ svc, onDetail, waLink }) {
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const ac = svc.accent || "#7c3aed";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 18,
        overflow: "hidden",
        boxShadow: hovered ? "0 20px 60px rgba(13,59,102,.18)" : "0 4px 24px rgba(13,59,102,.10)",
        border: `2px solid ${hovered ? ac : ac + "50"}`,
        transition: "all .3s cubic-bezier(.22,1,.36,1)",
        transform: hovered ? "translateY(-4px)" : "none",
        display: "flex", flexDirection: isMobile ? "column" : "row",
        minHeight: isMobile ? "auto" : 260,
        fontFamily: "'DM Sans',sans-serif",
      }}>
      {/* Image */}
      <div style={{ position: "relative", width: isMobile ? "100%" : 340, height: isMobile ? 210 : "auto", flexShrink: 0, overflow: "hidden" }}>
        <img loading="lazy" src={svc.images?.[0] || svc.image} alt={svc.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s", transform: hovered ? "scale(1.07)" : "scale(1)" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800"; }} />
        <div style={{ position: "absolute", inset: 0, background: isMobile ? "linear-gradient(180deg,transparent 40%,rgba(0,0,0,.4) 100%)" : "linear-gradient(90deg,transparent 60%,rgba(0,0,0,.35) 100%)" }} />
        {svc.badge && (
          <div style={{ position: "absolute", top: 14, left: 14, background: svc.badgeColor || ac, color: "#fff", borderRadius: 20, padding: "4px 14px", fontSize: "0.625rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
            {svc.badge}
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: isMobile ? "20px 18px 24px" : "28px 36px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
        <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 6 : 14, marginBottom: 10 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: isMobile ? "1.4rem" : "1.75rem", fontWeight: 900, color: "#0d3b66", lineHeight: 1.1, margin: 0 }}>{svc.title}</h2>
          <span style={{ fontSize: "0.75rem", background: ac + "18", color: ac, borderRadius: 20, padding: "4px 14px", fontWeight: 700, letterSpacing: ".05em" }}>{svc.tagline}</span>
        </div>
        <p style={{ fontSize: "0.9375rem", color: "#4a7f98", lineHeight: 1.75, marginBottom: 18 }}>{svc.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {(svc.features || []).map((feat, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", background: "#f0f7fb", borderRadius: 8, padding: "5px 12px" }}>
              <span style={{ color: "#27ae60", fontWeight: 700, fontSize: "0.875rem" }}>✓</span>
              <span style={{ fontSize: "0.8125rem", color: "#1a5a78", fontWeight: 500 }}>{feat}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: isMobile ? "stretch" : "center", flexDirection: isMobile ? "column" : "row", gap: 12, flexWrap: "wrap" }}>
          <div style={{ marginBottom: isMobile ? 4 : 0 }}>
            <div style={{ fontSize: "0.625rem", color: "#5090aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 2 }}>Harga</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 900, color: "#0d3b66" }}>{svc.price}</div>
            <div style={{ fontSize: "0.6875rem", color: "#4a7f98", fontStyle: "italic" }}>{svc.priceNote}</div>
          </div>
          <button onClick={onDetail}
            style={{ padding: "12px 28px", background: `linear-gradient(135deg,${ac},#0891b2)`, color: "#fff", border: "none", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", letterSpacing: ".03em", transition: "opacity .2s", width: isMobile ? "100%" : "auto" }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Lihat Detail &amp; Konsultasi
          </button>
          <a href={svc.waLink || "https://wa.me/6285745571442"} target="_blank" rel="noreferrer"
            style={{ padding: "12px 24px", background: "#25d366", color: "#fff", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", transition: "opacity .2s", width: isMobile ? "100%" : "auto" }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            💬 WhatsApp Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}

function TravelPackageCard({ svc, onDetail, waLink }) {
  const [openIdx, setOpenIdx] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const ac = svc.accent || "#e8a020";
  const al = svc.accentLight || "#fff8e6";
  const fmt = n => {
    if (!n || isNaN(String(n).replace(/\./g, ""))) return n;
    return Number(String(n).replace(/\./g, "")).toLocaleString("id-ID");
  };
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "#fff", borderRadius: 16, overflow: "visible", boxShadow: hovered ? "0 16px 48px rgba(13,59,102,.18)" : "0 4px 20px rgba(13,59,102,.09)", border: `2px solid ${hovered ? ac : svc.highlight ? ac + "80" : "transparent"}`, fontFamily: "'DM Sans',sans-serif", transition: "all .3s cubic-bezier(.22,1,.36,1)", transform: hovered ? "translateY(-5px)" : "none", position: "relative" }}>

      {/* Hero image */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", borderRadius: "14px 14px 0 0" }}>
        <img loading="lazy" src={svc.images?.[0] || svc.image} alt={svc.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s", transform: hovered ? "scale(1.06)" : "scale(1)" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800"; }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 40%,rgba(0,0,0,.55) 100%)" }} />
        {svc.badge && (
          <div style={{ position: "absolute", top: 12, left: 12, background: svc.badgeColor || ac, color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: "0.625rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
            {svc.badge}
          </div>
        )}
        {svc.highlight && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "linear-gradient(130deg,#063d5c,#0891b2)", color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: "0.625rem", fontWeight: 700 }}>⭐ Pilihan Utama</div>
        )}
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.125rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 2, textShadow: "0 2px 12px rgba(0,0,0,.8), 0 1px 4px rgba(0,0,0,.6)" }}>{svc.title}</h3>
          {svc.tagline && <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,.9)", lineHeight: 1.4, textShadow: "0 1px 8px rgba(0,0,0,.75)" }}>{svc.tagline}</p>}
        </div>
      </div>

      {/* Info row */}
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[`⏱ ${svc.duration}`, `👥 Min. ${svc.minPeserta} peserta`, ...(svc.destinations?.length ? [`🗺 ${svc.destinations.length} Destinasi`] : [])].map(m => (
          <span key={m} style={{ fontSize: "0.75rem", color: "#4a7f98" }}>{m}</span>
        ))}
      </div>

      {/* Description */}
      <p style={{ fontSize: "0.8125rem", color: "#4a7f98", lineHeight: 1.6, padding: "8px 16px 10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{svc.description}</p>

      {/* Top facilities with icons */}
      {(svc.facilities || []).length > 0 && (
        <div style={{ padding: "0 16px 12px" }}>
          {(svc.facilities || []).slice(0, 3).map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontSize: 13 }}>{f.icon}</span>
              <span style={{ fontSize: "0.75rem", color: "#1a5a78", fontWeight: 500 }}>{f.label}</span>
            </div>
          ))}
          {(svc.facilities || []).length > 3 && (
            <div style={{ fontSize: "0.6875rem", color: "#0891b2", fontWeight: 600, marginTop: 2 }}>+{svc.facilities.length - 3} fasilitas lainnya</div>
          )}
        </div>
      )}

      {/* Price header block — clickable 3D button */}
      <div
        onClick={() => setPriceOpen(o => !o)}
        style={{
          position: "relative",
          background: priceOpen
            ? `linear-gradient(135deg,#0a2e52 0%,#1a5a78 50%,${ac} 100%)`
            : `linear-gradient(135deg,#0d3b66 0%,#1a5a78 50%,${ac} 100%)`,
          padding: "16px 16px 20px",
          margin: "0",
          overflow: "hidden",
          cursor: "pointer",
          borderTop: "3px solid rgba(255,255,255,.18)",
          borderLeft: "1.5px solid rgba(255,255,255,.10)",
          boxShadow: priceOpen
            ? "inset 0 4px 16px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.08)"
            : "0 6px 18px rgba(0,0,0,.35), 0 2px 4px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.22)",
          transform: priceOpen ? "translateY(1px)" : "translateY(0)",
          transition: "all .18s cubic-bezier(.22,1,.36,1)",
          userSelect: "none",
        }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
        <div style={{ position: "absolute", right: 40, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
        {/* shimmer top edge */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)", borderRadius: "2px 2px 0 0" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: "0.5625rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 3 }}>Harga Mulai Dari</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              {(() => {
                const rawPrice = svc.prices?.[0]?.price ?? svc.price;
                const isContact = String(rawPrice).toLowerCase().includes("hubungi");
                return isContact ? (
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.35rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>Hubungi Kami</span>
                ) : (
                  <>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.8125rem", color: "rgba(255,255,255,.7)" }}>Rp</span>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.75rem", fontWeight: 700, color: "#fff", lineHeight: 1, textShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
                      {fmt(rawPrice)}
                    </span>
                    <span style={{ color: "rgba(255,255,255,.65)", fontSize: "0.75rem" }}>/ orang</span>
                  </>
                );
              })()}
            </div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,.15)",
            border: "1.5px solid rgba(255,255,255,.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", color: "#fff", fontWeight: 700,
            transform: priceOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .3s ease",
            flexShrink: 0,
          }}>▼</div>
        </div>
        <p style={{ color: "rgba(255,255,255,.45)", fontSize: "0.6rem", marginTop: 5, letterSpacing: ".04em" }}>
          {priceOpen ? "Klik untuk tutup harga kendaraan" : "Klik untuk lihat harga per kendaraan"}
        </p>
      </div>

      {/* Price cards accordion — hidden until priceOpen */}
      <div style={{ maxHeight: priceOpen ? "600px" : "0", overflow: "hidden", transition: "max-height .4s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ background: al, padding: "16px 12px 12px", borderLeft: `1px solid ${ac}25`, borderRight: `1px solid ${ac}25` }}>
          <p style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: ac, marginBottom: 8, paddingLeft: 4 }}>Harga per Kendaraan</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            {(svc.prices || []).map((p, i) => {
              const isOpen = openIdx === i;
              return (
                <div key={i} style={{ background: "#fff", borderRadius: 9, border: `1px solid ${isOpen ? ac : ac + "20"}`, overflow: "hidden", transition: "border-color .2s, box-shadow .2s", boxShadow: isOpen ? `0 3px 12px ${ac}25` : "none" }}>
                  <div onClick={e => { e.stopPropagation(); setOpenIdx(isOpen ? null : i); }}
                    style={{ padding: "9px 10px", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 15 }}>{p.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: "0.75rem", color: "#0d3b66", flex: 1 }}>{p.vehicle}</span>
                      <span style={{ fontSize: "0.5625rem", color: ac, fontWeight: 700, display: "inline-block", transition: "transform .25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                    </div>
                    <div style={{ fontSize: "0.625rem", color: "#888", margin: "2px 0" }}>{p.capacity}</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.9375rem", fontWeight: 700, color: ac }}>
                      {p.price === "Hubungi kami" ? p.price : `Rp ${fmt(p.price)}`}
                    </div>
                  </div>
                  <div style={{ maxHeight: isOpen ? "300px" : "0", overflow: "hidden", transition: "max-height .35s ease" }}>
                    <ul style={{ listStyle: "none", padding: "0 10px 9px", display: "flex", flexDirection: "column", gap: 3, borderTop: `1px solid ${ac}15` }}>
                      {(p.points || []).map((pt, pi) => (
                        <li key={pi} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.6875rem", color: "#3a5266", marginTop: pi === 0 ? 6 : 0 }}>
                          <span style={{ width: 4, height: 4, borderRadius: "50%", background: ac, flexShrink: 0, display: "inline-block" }} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: "12px 14px 14px", background: al, borderLeft: `1px solid ${ac}25`, borderRight: `1px solid ${ac}25`, borderBottom: `1px solid ${ac}25`, borderRadius: "0 0 14px 14px", display: "flex", gap: 8 }}>
        <button
          onClick={() => window.open(`${waLink || "https://wa.me/6285745571442"}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${svc.title}`)}`, "_blank")}
          style={{ flex: 1, padding: "9px 0", background: "#25D366", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          💬 WA
        </button>
        <button onClick={onDetail}
          style={{ flex: 3, padding: "9px 0", background: `linear-gradient(135deg,#0d3b66,${ac})`, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", transition: "opacity .2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          Lihat Detail →
        </button>
      </div>
    </div>
  );
}

/* ─────────────── TRAVEL DETAIL PRICE BLOCK (for service detail page) ─────────────── */
function TravelDetailPriceBlock({ svc }) {
  const [openIdx, setOpenIdx] = useState(null);
  const ac = svc.accent || "#e8a020";
  const al = svc.accentLight || "#fff8e6";
  const fmt = n => {
    if (!n || isNaN(String(n).replace(/\./g, ""))) return n;
    return Number(String(n).replace(/\./g, "")).toLocaleString("id-ID");
  };
  return (
    <div style={{ background: al, borderRadius: 14, padding: "20px 18px", border: `1px solid ${ac}30` }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
        {(svc.prices || []).map((p, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} style={{ background: "#fff", borderRadius: 10, border: `1px solid ${isOpen ? ac : ac + "25"}`, overflow: "hidden", transition: "border-color .2s, box-shadow .2s", boxShadow: isOpen ? `0 4px 16px ${ac}30` : "none" }}>
              <div onClick={() => setOpenIdx(isOpen ? null : i)} style={{ padding: "12px 14px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#0d3b66", flex: 1 }}>{p.vehicle}</span>
                  <span style={{ fontSize: "0.625rem", color: ac, fontWeight: 700, display: "inline-block", transition: "transform .25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                </div>
                <div style={{ fontSize: "0.6875rem", color: "#888", margin: "3px 0 5px" }}>{p.capacity}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.125rem", fontWeight: 700, color: ac }}>
                  {p.price === "Hubungi kami" ? p.price : `Rp ${fmt(p.price)}`}
                </div>
              </div>
              <div style={{ maxHeight: isOpen ? "300px" : "0", overflow: "hidden", transition: "max-height .35s ease" }}>
                <ul style={{ listStyle: "none", padding: "0 14px 12px", display: "flex", flexDirection: "column", gap: 5, borderTop: `1px solid ${ac}15` }}>
                  {(p.points || []).map((pt, pi) => (
                    <li key={pi} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.8125rem", color: "#3a5266", marginTop: pi === 0 ? 8 : 0 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: ac, flexShrink: 0, display: "inline-block" }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────── TRAVEL PACKAGE DETAIL MODAL ─────────────── */
function TravelPackageDetailModal({ svc, onClose, waLink }) {
  const [priceIdx, setPriceIdx] = useState(null);
  const [destIdx, setDestIdx] = useState(0);
  const ac = svc.accent || "#e8a020";
  const al = svc.accentLight || "#fff8e6";
  const fmtP = n => { if (!n || isNaN(String(n).replace(/\./g, ""))) return n; return Number(String(n).replace(/\./g, "")).toLocaleString("id-ID"); };
  const dest = (svc.destinations || [])[destIdx];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", handleKey); };
  }, [onClose]);

  const SectionHead = ({ label, title }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 4, height: 26, background: `linear-gradient(to bottom,${ac},transparent)`, borderRadius: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: ac, fontWeight: 700, textTransform: "uppercase", marginBottom: 1 }}>{label}</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.0625rem", fontWeight: 800, color: "#0d3b66" }}>{title}</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,20,40,.72)", backdropFilter: "blur(5px)", animation: "tdFadeIn .2s ease" }} onClick={onClose} />

      {/* Modal Sheet */}
      <div style={{
        position: "relative", width: "100%", maxWidth: 900, maxHeight: "93vh",
        background: "#f4fbfd", borderRadius: "20px 20px 0 0",
        boxShadow: "0 -16px 80px rgba(6,20,40,.35)",
        display: "flex", flexDirection: "column",
        animation: "tdSlideUp .35s cubic-bezier(.22,1,.36,1)",
        overflow: "hidden",
      }}>

        {/* ── Header with hero image ── */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ height: 200, position: "relative", overflow: "hidden" }}>
            <img loading="lazy" src={svc.images?.[0] || svc.image} alt={svc.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: .5 }}
              onError={e => { e.target.style.opacity = 0; }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,#0d3b66ee,${ac}bb)` }} />

            {/* Close */}
            <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.3)", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", zIndex: 2 }}>✕</button>

            {svc.badge && <div style={{ position: "absolute", top: 14, left: 14, background: svc.badgeColor || ac, color: "#fff", borderRadius: 20, padding: "4px 14px", fontSize: "0.5625rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>★ {svc.badge}</div>}

            {/* Thumb strip */}
            {(svc.images?.length > 1) && (
              <div style={{ position: "absolute", bottom: 12, left: 20, display: "flex", gap: 6 }}>
                {svc.images.slice(0, 4).map((img, i) => (
                  <div key={i} style={{ width: 44, height: 32, borderRadius: 5, overflow: "hidden", border: `2px solid rgba(255,255,255,.4)`, flexShrink: 0, opacity: .85 }}>
                    <img loading="lazy" src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                  </div>
                ))}
              </div>
            )}

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 24px 18px" }}>
              {svc.tagline && <div style={{ fontSize: "0.5625rem", color: "rgba(255,255,255,.72)", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4 }}>{svc.tagline}</div>}
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.3rem,3vw,1.875rem)", fontWeight: 900, color: "#fff", marginBottom: 8, lineHeight: 1.1 }}>{svc.title}</h2>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                {[`⏱ ${svc.duration}`, `👥 Min. ${svc.minPeserta} peserta`, svc.destinations?.length && `🗺 ${svc.destinations.length} Destinasi`, `💰 Mulai ${svc.price}`].filter(Boolean).map(m => (
                  <span key={m} style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,.85)", fontWeight: 500 }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "26px 24px 40px" }}>
          <p style={{ fontSize: "0.875rem", color: "#2a4a5e", lineHeight: 1.75, marginBottom: 28 }}>{svc.description}</p>

          {/* ─ Destinations ─ */}
          {(svc.destinations || []).length > 0 && (
            <section style={{ marginBottom: 30 }}>
              <SectionHead label="Destinasi Wisata" title="Itinerary Perjalanan" />

              {svc.destinations.length > 1 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {svc.destinations.map((d, i) => (
                    <button key={i} onClick={() => setDestIdx(i)}
                      style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${i === destIdx ? ac : ac + "30"}`, background: i === destIdx ? ac : "#fff", color: i === destIdx ? "#fff" : ac, fontSize: "0.6875rem", fontWeight: 600, cursor: "pointer", transition: "all .2s", fontFamily: "'DM Sans',sans-serif" }}>
                      {d.no}. {d.name}
                    </button>
                  ))}
                </div>
              )}

              {dest && (
                <div style={{ background: "#fff", borderRadius: 13, overflow: "hidden", border: `1px solid ${ac}22`, boxShadow: `0 3px 16px ${ac}12` }}>
                  <div style={{ display: "flex", flexWrap: "wrap", minHeight: 200 }}>
                    <div style={{ width: "clamp(130px,34%,220px)", flexShrink: 0, position: "relative", overflow: "hidden", background: `linear-gradient(135deg,${ac}55,#c5e8f0)`, alignSelf: "stretch", minHeight: 200 }}>
                      <img loading="lazy" src={dest.img} alt={dest.name}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onLoad={e => { e.target.style.opacity = "1"; }}
                        onError={e => { e.target.style.opacity = "0"; }} />
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${ac}44,transparent)`, pointerEvents: "none" }} />
                      <div style={{ position: "absolute", top: 10, left: 10, background: ac, color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5625rem", fontWeight: 800, zIndex: 2 }}>{dest.no}</div>
                    </div>
                    <div style={{ flex: 1, padding: "16px 18px", minWidth: 180 }}>
                      <div style={{ fontSize: "0.5625rem", color: ac, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>{dest.tag}</div>
                      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.9375rem", fontWeight: 800, color: "#0d3b66", marginBottom: 4, lineHeight: 1.3 }}>{dest.title}</h3>
                      <div style={{ fontSize: "0.6875rem", color: "#4a7f98", marginBottom: 7 }}>📍 {dest.sub} &nbsp;·&nbsp; ⏱ {dest.duration}</div>
                      <p style={{ fontSize: "0.78125rem", color: "#3a5266", lineHeight: 1.65, marginBottom: 9 }}>{dest.desc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
                        {(dest.points || []).map((pt, pi) => (
                          <div key={pi} style={{ display: "flex", gap: 5, alignItems: "center", fontSize: "0.6875rem", color: "#2a4a5e" }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: ac, flexShrink: 0, display: "inline-block" }} />
                            {pt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ─ Facilities ─ */}
          {(svc.facilities || []).length > 0 && (
            <section style={{ marginBottom: 30 }}>
              <SectionHead label="Yang Sudah Termasuk" title="Fasilitas Paket" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 9 }}>
                {(svc.facilities || []).map((f, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "13px 15px", border: `1px solid ${ac}18`, display: "flex", gap: 9, alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: ac, borderRadius: "10px 0 0 10px" }} />
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#0d3b66", marginBottom: 1 }}>{f.label}</div>
                      <div style={{ fontSize: "0.625rem", color: "#5090aa", lineHeight: 1.4 }}>{f.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─ Services ─ */}
          {(svc.services || []).length > 0 && (
            <section style={{ marginBottom: 30 }}>
              <SectionHead label="Sudah Termasuk" title="Layanan Kami" />
              <div style={{ background: al, borderRadius: 12, padding: "16px 18px", border: `1px solid ${ac}18` }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "7px 18px" }}>
                  {(svc.services || []).map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: "0.78125rem", color: "#1a3a50" }}>
                      <span style={{ color: "#27ae60", fontWeight: 800, fontSize: "0.875rem", flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ─ Vehicle Prices ─ */}
          {(svc.prices || []).length > 0 && (
            <section style={{ marginBottom: 30 }}>
              <SectionHead label="Pilihan Armada" title="Harga per Kendaraan" />

              {/* Price banner */}
              <div style={{ position: "relative", background: `linear-gradient(135deg,#0d3b66,#1a5a78 45%,${ac})`, borderRadius: 14, padding: "20px 24px 16px", marginBottom: 12, overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -24, top: -24, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
                <p style={{ color: "rgba(255,255,255,.6)", fontSize: "0.5625rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>Harga Mulai Dari</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  {svc.prices[0]?.price !== "Hubungi kami" && <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.8125rem", color: "rgba(255,255,255,.7)" }}>Rp</span>}
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.25rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                    {svc.prices[0]?.price === "Hubungi kami" ? "Hubungi Kami" : fmtP(svc.prices[0]?.price)}
                  </span>
                  {svc.prices[0]?.price !== "Hubungi kami" && <span style={{ color: "rgba(255,255,255,.6)", fontSize: "0.75rem" }}>/ orang</span>}
                </div>
                <p style={{ color: "rgba(255,255,255,.55)", fontSize: "0.6875rem", marginTop: 3 }}>⏱ {svc.duration} &nbsp;·&nbsp; 👥 Min. {svc.minPeserta} peserta &nbsp;·&nbsp; 💬 Harga dapat disesuaikan</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(svc.prices || []).map((p, i) => {
                  const isOpen = priceIdx === i;
                  return (
                    <div key={i} style={{ background: "#fff", borderRadius: 10, border: `1.5px solid ${isOpen ? ac : ac + "22"}`, overflow: "hidden", transition: "border-color .2s, box-shadow .2s", boxShadow: isOpen ? `0 4px 16px ${ac}22` : "none" }}>
                      <button onClick={() => setPriceIdx(isOpen ? null : i)}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}>
                        <span style={{ fontSize: 22 }}>{p.icon}</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0d3b66", display: "block" }}>{p.vehicle}</span>
                          <span style={{ fontSize: "0.6875rem", color: "#888" }}>{p.capacity}</span>
                        </div>
                        <div style={{ textAlign: "right", marginRight: 8 }}>
                          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.0625rem", fontWeight: 700, color: ac }}>
                            {p.price === "Hubungi kami" ? p.price : `Rp ${fmtP(p.price)}`}
                          </span>
                          {p.price !== "Hubungi kami" && <span style={{ display: "block", fontSize: "0.625rem", color: "#888" }}>/ orang</span>}
                        </div>
                        <span style={{ fontSize: "0.5625rem", color: ac, fontWeight: 700, display: "inline-block", transition: "transform .25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>▼</span>
                      </button>
                      <div style={{ maxHeight: isOpen ? "260px" : "0", overflow: "hidden", transition: "max-height .35s ease" }}>
                        <div style={{ borderTop: `1px solid ${ac}15`, padding: "11px 18px 13px", background: al }}>
                          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 14px" }}>
                            {(p.points || []).map((pt, pi) => (
                              <li key={pi} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "#3a5266" }}>
                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: ac, flexShrink: 0, display: "inline-block" }} />
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─ CTA ─ */}
          <div style={{ background: `linear-gradient(135deg,#0d3b66,#1a5a78 40%,${ac})`, borderRadius: 14, padding: "22px 24px", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,.8)", fontSize: "0.875rem", marginBottom: 16, lineHeight: 1.65 }}>Tertarik dengan paket ini? Hubungi kami untuk konsultasi gratis dan penawaran terbaik!</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => window.open(`${waLink || "https://wa.me/6285745571442"}?text=${encodeURIComponent(`Halo Arutala Organizer! 👋\n\nSaya tertarik dengan:\n*${svc.title}*\nHarga: ${svc.price} ${svc.priceNote}\n\nMohon informasi lebih lanjut. Terima kasih!`)}`, "_blank")}
                style={{ padding: "11px 28px", background: "#25D366", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                💬 WhatsApp Sekarang
              </button>
              <button onClick={onClose}
                style={{ padding: "11px 22px", background: "rgba(255,255,255,.14)", color: "#fff", border: "1.5px solid rgba(255,255,255,.3)", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tdFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tdSlideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </div>
  );
}

/* ─────────────── DESTINATIONS SECTION (full-page detail) ─────────────── */
function DestinationsSection({ svc, catInfo }) {
  const [destIdx, setDestIdx] = useState(0);
  const ac = svc.accent || "#e8a020";
  const dest = (svc.destinations || [])[destIdx];
  if (!dest) return null;
  return (
    <div className="mg-fade-3" style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{ width: 4, height: 30, background: `linear-gradient(to bottom, ${ac}, transparent)`, borderRadius: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: ac, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Itinerary</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#0d3b66", lineHeight: 1.1 }}>Destinasi Wisata</div>
        </div>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #c0e8f0, transparent)" }} />
      </div>

      {/* Tab selector */}
      {svc.destinations.length > 1 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {svc.destinations.map((d, i) => (
            <button key={i} onClick={() => setDestIdx(i)}
              style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${i === destIdx ? ac : ac + "30"}`, background: i === destIdx ? ac : "#fff", color: i === destIdx ? "#fff" : ac, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all .2s", fontFamily: "'DM Sans',sans-serif" }}>
              {d.no}. {d.name}
            </button>
          ))}
        </div>
      )}

      {/* Destination card */}
      <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: `1px solid ${ac}22`, boxShadow: `0 4px 20px ${ac}12` }}>
        <style>{`.dest-card-inner{display:flex;flex-wrap:wrap;min-height:220px} @media(max-width:768px){.dest-card-inner{flex-direction:column!important}} .dest-card-img{width:clamp(140px,36%,260px);flex-shrink:0;position:relative;overflow:hidden;background:linear-gradient(135deg,${ac}55,#c5e8f0);align-self:stretch;min-height:200px} @media(max-width:768px){.dest-card-img{width:100%!important;height:220px!important;min-height:220px!important}}`}</style>
        <div className="dest-card-inner">
          {/* Image */}
          <div className="dest-card-img">
            <img loading="lazy" src={dest.img} alt={dest.name}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onLoad={e => { e.target.style.opacity = "1"; }}
              onError={e => { e.target.style.opacity = "0"; }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${ac}44,transparent)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 12, left: 12, background: ac, color: "#fff", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", fontWeight: 800, zIndex: 2 }}>{dest.no}</div>
          </div>
          {/* Content */}
          <div style={{ flex: 1, padding: "20px 22px", minWidth: 200 }}>
            <div style={{ fontSize: "0.5625rem", color: ac, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>{dest.tag}</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.0625rem", fontWeight: 800, color: "#0d3b66", marginBottom: 5, lineHeight: 1.3 }}>{dest.title}</h3>
            <div style={{ fontSize: "0.75rem", color: "#4a7f98", marginBottom: 10 }}>📍 {dest.sub} &nbsp;·&nbsp; ⏱ {dest.duration}</div>
            <p style={{ fontSize: "0.8125rem", color: "#3a5266", lineHeight: 1.7, marginBottom: 12 }}>{dest.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 16px" }}>
              {(dest.points || []).map((pt, pi) => (
                <div key={pi} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: "0.75rem", color: "#1a5a78" }}>
                  <span style={{ color: ac, fontWeight: 700, fontSize: "0.875rem" }}>✓</span> {pt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── SERVICE HERO SLIDESHOW (panel kanan di atas) ─────────────── */
function ServiceHeroSlideshow({ slides, catColor }) {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(() => setCur(c => (c + 1) % slides.length), [slides.length]);
  const back = useCallback(() => setCur(c => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(next, 3500);
    return () => clearInterval(timerRef.current);
  }, [paused, next, slides.length]);

  if (!slides.length) return null;
  const slide = slides[cur];

  return (
    <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "stretch" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <style>{`
        @keyframes heroFadeIn { from { opacity:0; transform:scale(1.04); } to { opacity:1; transform:scale(1); } }
      `}</style>
      {/* Deco corner frames */}
      <div className="mg-deco-shape" style={{ position: "absolute", top: 20, right: 20, width: 70, height: 70, border: `1.5px solid ${catColor}`, borderRadius: 6, zIndex: 3, opacity: .55, pointerEvents: "none" }} />
      <div className="mg-deco-shape" style={{ position: "absolute", top: 30, right: 30, width: 70, height: 70, border: "1.5px solid rgba(255,255,255,.12)", borderRadius: 6, zIndex: 3, pointerEvents: "none" }} />
      <div className="mg-deco-shape" style={{ position: "absolute", bottom: 20, left: -8, width: 50, height: 50, border: "1.5px solid rgba(255,255,255,.15)", borderRadius: 4, zIndex: 3, pointerEvents: "none" }} />

      <div style={{ flex: 1, position: "relative", minHeight: 400 }}>
        {/* Slide image */}
        <img key={cur} loading="lazy" src={slide.img} alt={slide.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0, animation: "heroFadeIn .6s ease both" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&h=500&fit=crop"; }} />

        {/* Bottom gradient */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 130, background: "linear-gradient(to top, rgba(5,20,45,.85), transparent)", pointerEvents: "none", zIndex: 2 }} />

        {/* Info overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3, padding: "14px 18px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,.5)", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 3 }}>
                {slide.no} / {String(slides.length).padStart(2,"0")}
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.6)", lineHeight: 1.25 }}>{slide.title || slide.name}</div>
            </div>
            {/* Prev / Next */}
            {slides.length > 1 && (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={e => { e.stopPropagation(); back(); }}
                  style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.15)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                <button onClick={e => { e.stopPropagation(); next(); }}
                  style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.15)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
              </div>
            )}
          </div>
          {/* Dot indicator */}
          {slides.length > 1 && (
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              {slides.map((_, i) => (
                <div key={i} onClick={() => setCur(i)}
                  style={{ height: 3, borderRadius: 2, background: i === cur ? catColor : "rgba(255,255,255,.3)", width: i === cur ? 20 : 6, transition: "all .3s ease", cursor: "pointer" }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── DESTINATION GALLERY SLIDESHOW ─────────────── */
function DestGallerySlideshow({ slides, catColor, svcTitle }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState(1); // 1=next, -1=prev
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx, direction) => {
    setPrev(cur);
    setDir(direction);
    setCur(idx);
  }, [cur]);

  const next = useCallback(() => goTo((cur + 1) % slides.length, 1), [cur, slides.length, goTo]);
  const back = useCallback(() => goTo((cur - 1 + slides.length) % slides.length, -1), [cur, slides.length, goTo]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [paused, next, slides.length]);

  const slide = slides[cur];

  return (
    <div className="mg-fade-2" style={{ marginBottom: 52 }}>
      {/* Heading */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{ width: 4, height: 30, background: `linear-gradient(to bottom, ${catColor}, transparent)`, borderRadius: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: "#7ab5cc", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Dokumentasi</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#0d3b66", lineHeight: 1.1 }}>Fasilitas &amp; Suasana</div>
        </div>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #c0e8f0, transparent)" }} />
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => goTo(i, i > cur ? 1 : -1)}
              style={{ width: i === cur ? 18 : 6, height: 6, borderRadius: 3, background: i === cur ? catColor : "#c0e8f0", cursor: "pointer", transition: "all .35s ease" }} />
          ))}
        </div>
      </div>

      {/* Slideshow frame */}
      <div
        style={{ position: "relative", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 36px rgba(13,59,102,.16)", height: 420, background: "#0d3b66", cursor: "pointer" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Current slide */}
        <img key={`cur-${cur}`} loading="lazy" src={slide.img} alt={slide.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block",
            animation: `slideIn${dir > 0 ? "R" : "L"} .55s cubic-bezier(.22,1,.36,1) both` }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1200&h=420&fit=crop"; }} />

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,30,60,.72) 0%, rgba(10,30,60,.15) 55%, transparent 100%)", pointerEvents: "none" }} />

        {/* Bottom info */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "0.5625rem", color: "rgba(255,255,255,.55)", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 4 }}>
                Destinasi {slide.no} / {String(slides.length).padStart(2,"0")}
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,.5)", lineHeight: 1.2 }}>{slide.title || slide.name}</div>
              {slide.name && slide.title && slide.name !== slide.title && (
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,.6)", marginTop: 3 }}>📍 {slide.name}</div>
              )}
            </div>
            {/* Nav buttons */}
            {slides.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={e => { e.stopPropagation(); back(); }}
                  style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,.25)", color: "#fff", fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.15)"}>‹</button>
                <button onClick={e => { e.stopPropagation(); next(); }}
                  style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,.25)", color: "#fff", fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.15)"}>›</button>
              </div>
            )}
          </div>
        </div>

        {/* Pause indicator */}
        {paused && slides.length > 1 && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.4)", backdropFilter: "blur(6px)", borderRadius: 20, padding: "3px 10px", fontSize: "0.625rem", color: "rgba(255,255,255,.7)", fontWeight: 600, letterSpacing: ".08em" }}>⏸ PAUSE</div>
        )}

        {/* Slide animation keyframes */}
        <style>{`
          @keyframes slideInR { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:none; } }
          @keyframes slideInL { from { opacity:0; transform:translateX(-60px); } to { opacity:1; transform:none; } }
        `}</style>
      </div>

      {/* Thumbnail strip */}
      {slides.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 2 }}>
          {slides.map((s, i) => (
            <div key={i} onClick={() => goTo(i, i > cur ? 1 : -1)}
              style={{ flexShrink: 0, width: 72, height: 50, borderRadius: 7, overflow: "hidden", cursor: "pointer",
                border: i === cur ? `2.5px solid ${catColor}` : "2.5px solid transparent",
                opacity: i === cur ? 1 : 0.55, transition: "all .25s", boxShadow: i === cur ? `0 0 0 1px ${catColor}55` : "none" }}>
              <img loading="lazy" src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={e => e.target.src = "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=72&h=50&fit=crop"} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── SERVICES PAGE ─────────────── */
function ServicesPage({ content, services, navigateTo }) {
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [activeCategory, setActiveCategory] = useState("traveling"); // Default: tab Traveling langsung aktif
  const [activeImg, setActiveImg] = useState(0);

  const CATEGORIES = [
    { key: "traveling", label: "✈️ Traveling", color: "#27ae60" },
    { key: "event",     label: "🎉 Event Plan", color: "#0891b2" },
    { key: "wedding",   label: "💍 Wedding Organizer", color: "#8e44ad" },
  ];

  const openDetail = (svc) => {
    setSelectedService(svc); setActiveImg(0); window.scrollTo({ top: 0, behavior: "smooth" });
  };
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
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#e8f7fc 0%,#f0fbfd 100%)", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          @keyframes mgFadeUp { from { opacity:0; transform:translateY(28px);} to { opacity:1; transform:none;} }
          .mg-fade { animation: mgFadeUp .55s cubic-bezier(.22,1,.36,1) both; }
          .mg-fade-2 { animation: mgFadeUp .55s .12s cubic-bezier(.22,1,.36,1) both; }
          .mg-fade-3 { animation: mgFadeUp .55s .22s cubic-bezier(.22,1,.36,1) both; }
          .mg-feat-row:hover { background: #d6f1f6 !important; }
          .mg-related { transition: transform .2s, box-shadow .2s; }
          .mg-related:hover { transform: translateX(5px); }
          .mg-cta-wa:hover { background: #ffffff !important; }
          .mg-cta-tel:hover { background: #d6f1f6 !important; }
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
        <div style={{ background: "linear-gradient(90deg,#063d5c,#0891b2)", padding: "0 5%", position: "sticky", top: 96, zIndex: 90, borderBottom: "1px solid #c0e8f0" }}>
          <button onClick={closeDetail} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#7ab8d0", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", padding: "13px 0", letterSpacing: ".04em", textTransform: "uppercase" }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>←</span> Kembali ke Layanan
          </button>
        </div>

        {/* ── MAGAZINE HERO ── */}
        <div className="mg-fade" style={{ position: "relative", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", overflow: "hidden" }}>
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
                  <div style={{ width: 28, height: 2, background: catInfo.color || "#0891b2" }} />
                  <span style={{ fontSize: "0.625rem", letterSpacing: "3px", color: catInfo.color || "#22d3ee", fontWeight: 700, textTransform: "uppercase" }}>
                    {(catInfo.label || svc.category).replace(/[^\w\s]/g, "").trim()}
                  </span>
                </div>
                {/* Badge */}
                {svc.badge && (
                  <div style={{ display: "inline-flex", alignItems: "center", background: svc.badgeColor || "#0891b2", color: "#fff", borderRadius: 4, padding: "4px 14px", fontSize: "0.625rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 18, alignSelf: "flex-start", boxShadow: `0 4px 18px ${svc.badgeColor || "#0891b2"}55` }}>
                    ★ {svc.badge}
                  </div>
                )}
                {/* Title */}
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 22, letterSpacing: "-.01em" }}>{svc.title}</h1>
                {/* Ornamental divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
                  <div style={{ height: 1, width: 40, background: catInfo.color || "#22d3ee", opacity: .8 }} />
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: catInfo.color || "#22d3ee" }} />
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,.3)" }} />
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,.15)" }} />
                  <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,.12)" }} />
                </div>
                {/* Description */}
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.68)", lineHeight: 1.85, whiteSpace: "pre-wrap", marginBottom: 36 }}>{svc.description}</p>
                {/* Price inline */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "0.5625rem", letterSpacing: "2.5px", color: "rgba(255,255,255,.65)", fontWeight: 700, textTransform: "uppercase", marginBottom: 5 }}>Harga Mulai</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.4rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{svc.price}</span>
                      <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,.68)", fontWeight: 500 }}>{svc.priceNote}</span>
                    </div>
                  </div>
                  <div style={{ padding: "6px 14px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 20, fontSize: "0.75rem", color: "rgba(255,255,255,.72)", fontStyle: "italic", marginBottom: 4 }}>Nego &amp; Konsultasi</div>
                </div>
              </div>

              {/* Right: Hero Slideshow dari destinasi */}
              {(() => {
                const heroSlides = (svc.destinations || []).filter(d => d.img);
                const fallbackSlides = imgs.filter(Boolean);
                const allSlides = heroSlides.length > 0
                  ? heroSlides
                  : fallbackSlides.map((img, i) => ({ img, name: svc.title, no: String(i+1).padStart(2,"0"), title: svc.title }));
                return <ServiceHeroSlideshow key={svc.id} slides={allSlides} catColor={catInfo.color || "#22d3ee"} />;
              })()}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 5% 80px" }}>
          <div className="mg-body-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>

            {/* ── LEFT COLUMN ── */}
            <div>

              {/* FACILITY GALLERY — slideshow dari gambar destinasi */}
              {(() => {
                const destImgs = (svc.destinations || [])
                  .filter(d => d.img)
                  .map(d => ({ img: d.img, name: d.name, no: d.no, title: d.title }));
                const slideImgs = destImgs.length > 0 ? destImgs : (facilityImgs.length > 0 ? facilityImgs.map((img, i) => ({ img, name: `Foto ${i+1}`, no: String(i+1).padStart(2,"0"), title: svc.title })) : []);
                if (slideImgs.length === 0) return null;
                return (
                  <DestGallerySlideshow
                    key={svc.id}
                    slides={slideImgs}
                    catColor={catInfo.color || "#0891b2"}
                    svcTitle={svc.title}
                  />
                );
              })()}

              {/* FEATURES — 2-col magazine checklist */}
              <div className="mg-fade-3" style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
                  <div style={{ width: 4, height: 30, background: `linear-gradient(to bottom, ${catInfo.color || "#0891b2"}, transparent)`, borderRadius: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: "#7ab5cc", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Sudah Termasuk</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#0d3b66", lineHeight: 1.1 }}>Yang Anda Dapatkan</div>
                  </div>
                  <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #c0e8f0, transparent)" }} />
                </div>
                <div className="mg-feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {(svc.features || []).map((feat, i) => (
                    <div key={i} className="mg-feat-row" style={{ display: "flex", gap: 11, alignItems: "flex-start", background: "#fff", borderRadius: 10, padding: "13px 15px 13px 18px", border: "1px solid #c8eaf2", transition: "background .18s", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: catInfo.color || "#0891b2", borderRadius: "10px 0 0 10px" }} />
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: catInfo.color ? `${catInfo.color}15` : "#e4f2f8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ color: catInfo.color || "#0891b2", fontSize: "0.6875rem", fontWeight: 900 }}>✓</span>
                      </div>
                      <span style={{ fontSize: "0.85rem", color: "#0ea5c5", lineHeight: 1.5, fontWeight: 500 }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DESTINATIONS — itinerary tabs, hanya untuk traveling */}
              {svc.category === "traveling" && (svc.destinations || []).length > 0 && (
                <DestinationsSection svc={svc} catInfo={catInfo} />
              )}

              {/* FACILITIES — hanya untuk traveling */}
              {svc.category === "traveling" && (svc.facilities || []).length > 0 && (
                <div className="mg-fade-3" style={{ marginBottom: 48 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 4, height: 30, background: `linear-gradient(to bottom, ${svc.accent || "#e8a020"}, transparent)`, borderRadius: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: svc.accent || "#e8a020", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Yang Sudah Termasuk</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#0d3b66", lineHeight: 1.1 }}>Fasilitas Perjalanan</div>
                    </div>
                    <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, #c0e8f0, transparent)" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                    {(svc.facilities || []).map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", borderRadius: 10, padding: "13px 15px", border: "1px solid #c8eaf2", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: svc.accent || "#e8a020", borderRadius: "10px 0 0 10px" }} />
                        <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
                        <div>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0d3b66", marginBottom: 2 }}>{f.label}</div>
                          {f.detail && <div style={{ fontSize: "0.75rem", color: "#4a7f98", lineHeight: 1.5 }}>{f.detail}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRICE ACCORDION — only for traveling packages */}
              {svc.category === "traveling" && svc.prices?.length > 0 && (
                <div className="mg-fade-3" style={{ marginBottom: 48 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 4, height: 30, background: `linear-gradient(to bottom, ${svc.accent || "#e8a020"}, transparent)`, borderRadius: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: svc.accent || "#e8a020", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Pilihan Armada</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#0d3b66", lineHeight: 1.1 }}>Harga per Kendaraan</div>
                    </div>
                  </div>
                  <TravelDetailPriceBlock svc={svc} />
                </div>
              )}

            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div style={{ position: "sticky", top: 128 }}>

              {/* Price Card */}
              <div className="mg-fade-2" style={{ background: svc.highlight ? "linear-gradient(145deg,#1a1a1a 0%,#0d3b66 55%,#0891b2 100%)" : "#fff", borderRadius: 16, overflow: "hidden", boxShadow: svc.highlight ? "0 24px 64px rgba(12,26,40,.5)" : "0 8px 32px rgba(13,59,102,.11)", border: svc.highlight ? "none" : "1px solid #c8eaf2", marginBottom: 18 }}>
                {/* Top gradient bar */}
                <div style={{ height: 4, background: `linear-gradient(to right, ${catInfo.color || "#0891b2"}, ${svc.badgeColor || catInfo.color || "#0d3b66"})` }} />
                {/* Deco border inner */}
                <div style={{ margin: "16px 16px 0", border: `1px solid ${svc.highlight ? "rgba(255,255,255,.07)" : "#f0e8df"}`, borderRadius: 10, padding: "20px 18px 24px", position: "relative", overflow: "hidden" }}>
                  {/* BG shape */}
                  <div style={{ position: "absolute", bottom: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: svc.highlight ? "rgba(255,255,255,.04)" : `${catInfo.color || "#0891b2"}08`, pointerEvents: "none" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: svc.highlight ? "rgba(255,255,255,.3)" : "#b8a898", textTransform: "uppercase", fontWeight: 700, marginBottom: 16, textAlign: "center" }}>— Penawaran Spesial —</div>
                    {/* Harga */}
                    <div style={{ textAlign: "center", marginBottom: 10 }}>
                      <div style={{ fontSize: "0.5625rem", letterSpacing: "2.5px", color: svc.highlight ? "rgba(255,255,255,.38)" : "#7ab5cc", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Harga Mulai</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.6rem", fontWeight: 900, color: svc.highlight ? "#fff" : "#0d3b66", lineHeight: 1, marginBottom: 4 }}>{svc.price}</div>
                      <div style={{ fontSize: "0.875rem", color: svc.highlight ? "rgba(255,255,255,.45)" : "#7ab5cc", fontWeight: 500 }}>{svc.priceNote}</div>
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
                    style={{ width: "100%", padding: "15px 20px", background: "linear-gradient(135deg,#0891b2,#0ea5c5)", color: "#fff", border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10, transition: "background .2s", letterSpacing: ".01em" }}>
                    <span style={{ fontSize: "1.1rem" }}>💬</span> Pesan via WhatsApp
                  </button>
                  <a href={`tel:${content.phone}`} className="mg-cta-tel"
                    style={{ width: "100%", padding: "13px 20px", background: "#edf8fb", color: "#0d3b66", border: "1.5px solid #c0e8f0", borderRadius: 10, fontSize: "0.875rem", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background .2s" }}>
                    <span style={{ fontSize: "1rem" }}>📞</span> Hubungi Langsung
                  </a>
                </div>
              </div>

              {/* Why Us — dark card with deco border */}
              <div className="mg-fade-3" style={{ background: "linear-gradient(135deg,#063d5c,#0875a8)", borderRadius: 14, padding: "2px", overflow: "hidden", position: "relative" }}>
                {/* Gradient border effect */}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(145deg, ${catInfo.color || "#0891b2"}44, transparent, rgba(255,255,255,.06))`, borderRadius: 14, pointerEvents: "none" }} />
                <div style={{ background: "linear-gradient(135deg,#063d5c,#0875a8)", borderRadius: 12, padding: "22px 20px", position: "relative" }}>
                  {/* Inner deco frame */}
                  <div style={{ position: "absolute", top: 10, left: 10, right: 10, bottom: 10, border: "1px solid rgba(255,255,255,.05)", borderRadius: 8, pointerEvents: "none" }} />
                  {/* BG shapes */}
                  <div style={{ position: "absolute", bottom: -25, right: -25, width: 90, height: 90, borderRadius: "50%", background: `${catInfo.color || "#0891b2"}18`, pointerEvents: "none" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: catInfo.color || "#22d3ee", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Keunggulan Kami</div>
                    <div style={{ width: 28, height: 2, background: catInfo.color || "#22d3ee", borderRadius: 1, marginBottom: 18 }} />
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

          {/* RELATED PACKAGES — selalu di bawah, mobile friendly */}
          {relatedSvcs.length > 0 && (
            <div className="mg-fade-3" style={{ marginTop: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{ width: 4, height: 30, background: "linear-gradient(to bottom, #7ab5cc, transparent)", borderRadius: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.5625rem", letterSpacing: "3px", color: "#7ab5cc", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Lihat Juga</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 800, color: "#0d3b66", lineHeight: 1.1 }}>Paket Serupa</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                {relatedSvcs.map(s => (
                  <div key={s.id} className="mg-related" onClick={() => openDetail(s)}
                    style={{ display: "flex", gap: 0, alignItems: "stretch", background: "#fff", borderRadius: 12, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 10px rgba(13,59,102,.07)", border: "1px solid #c8eaf2" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(13,59,102,.14)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(13,59,102,.07)"}>
                    <div style={{ width: 90, flexShrink: 0, overflow: "hidden" }}>
                      <img loading="lazy" src={s.images?.[0] || s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }}
                        onError={e => e.target.src = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=120&fit=crop"} />
                    </div>
                    <div style={{ width: 3, flexShrink: 0, background: `linear-gradient(to bottom, ${s.badgeColor || "#0891b2"}, transparent)` }} />
                    <div style={{ padding: "12px 14px", flex: 1, minWidth: 0 }}>
                      {s.badge && <div style={{ fontSize: "0.5625rem", color: s.badgeColor || "#0891b2", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>{s.badge}</div>}
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0d3b66", marginBottom: 4, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                      <div style={{ fontSize: "0.8125rem", color: s.badgeColor || "#0891b2", fontWeight: 800 }}>{s.price} <span style={{ color: "#7ab5cc", fontWeight: 400, fontSize: "0.75rem" }}>{s.priceNote}</span></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", paddingRight: 14, color: "#9ed4e0", fontSize: "1.125rem", flexShrink: 0 }}>›</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Services List with Category Tabs ── */
  const filteredServices = activeCategory ? services.filter(s => s.category === activeCategory) : [];

  return (
    <div className="fade-in" style={{ minHeight: "100vh", background: "#edfafc" }}>
      {/* Header — gradient + radial flare like reference */}
      <div style={{ background: "linear-gradient(120deg,#063d5c 0%,#0875a8 40%,#0aa8bf 72%,#1ed8e8 100%)", padding: "72px 5% 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Flare glow center-right */}
        <div style={{ position: "absolute", top: "50%", right: "18%", transform: "translateY(-50%)", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,216,232,.38) 0%, rgba(10,168,191,.18) 40%, transparent 70%)", pointerEvents: "none", filter: "blur(12px)" }} />
        {/* Flare glow left */}
        <div style={{ position: "absolute", top: "60%", left: "8%", transform: "translateY(-50%)", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,197,.28) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(20px)" }} />
        {/* Grid pattern overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.07) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: "0.6875rem", letterSpacing: "3px", color: "rgba(255,255,255,.7)", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Apa yang Kami Tawarkan</div>
          <h1 className="display" style={{ fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 900, color: "#fff", lineHeight: 1.08, marginBottom: 18, textShadow: "0 2px 24px rgba(0,0,0,.22)" }}>{content.servicesPageTitle || "Paket Layanan Kami"}</h1>
          <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,.82)", lineHeight: 1.8 }}>{content.servicesPageSub || "Pilih kategori layanan sesuai kebutuhan Anda."}</p>
        </div>
      </div>

      {/* Category Buttons */}
      <div style={{ background: "#fff", borderBottom: "1px solid #c0e8f0", padding: "0 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.key;
            const count = services.filter(s => s.category === cat.key).length;
            return (
              <button key={cat.key} onClick={() => setActiveCategory(isActive ? null : cat.key)}
                style={{ padding: "20px 28px", border: "none", background: "none", fontSize: "0.9375rem", fontWeight: isActive ? 700 : 500,
                  color: isActive ? cat.color : "#1a5a78", borderBottom: isActive ? `3px solid ${cat.color}` : "3px solid transparent",
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all .25s", display: "flex", alignItems: "center", gap: 8 }}>
                {cat.label}
                <span style={{ fontSize: "0.75rem", background: isActive ? cat.color : "#edfafc", color: isActive ? "#fff" : "#4a7f98", borderRadius: 12, padding: "2px 8px", fontWeight: 700, transition: "all .25s" }}>{count}</span>
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
            <h2 className="display" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0d3b66", marginBottom: 12 }}>Pilih Kategori Layanan</h2>
            <p style={{ fontSize: "1rem", color: "#4a7f98" }}>Klik salah satu tab di atas untuk melihat paket layanan yang tersedia.</p>
          </div>
        )}

        {/* Cards Grid */}
        {activeCategory && (
          <div style={{ animation: "fadeIn .35s ease" }}>
            <div style={{ marginBottom: 32 }}>
              <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0d3b66", marginBottom: 6 }}>
                {CATEGORIES.find(c => c.key === activeCategory)?.label}
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "#4a7f98" }}>{filteredServices.length} paket tersedia</p>
            </div>
            {filteredServices.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#5090aa" }}>Belum ada paket untuk kategori ini.</div>
            ) : activeCategory === "traveling" ? (
              /* ── TRAVELING: 2-col grid with price accordion cards ── */
              (() => {
                const customPkg = filteredServices.find(s => s.pkgId === "custom");
                const regularPkgs = filteredServices.filter(s => s.pkgId !== "custom");
                return (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 28 }}>
                      {regularPkgs.map(svc => (
                        <TravelPackageCard key={svc.id} svc={svc} onDetail={() => openDetail(svc)} waLink={content.waLink} />
                      ))}
                    </div>
                    {customPkg && (
                      <div style={{ marginTop: 28 }}>
                        <TravelPackageCardWide svc={customPkg} onDetail={() => openDetail(customPkg)} waLink={content.waLink} />
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              /* ── EVENT / WEDDING: Traveling-style cards ── */
              (() => {
                const customPkg = filteredServices.find(s => s.pkgId === "custom");
                const regularSvcs = filteredServices.filter(s => s.pkgId !== "custom");
                return (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                      {regularSvcs.map(svc => (
                        <EventWeddingPackageCard key={svc.id} svc={svc} onDetail={() => openDetail(svc)} waLink={content.waLink} />
                      ))}
                    </div>
                    {customPkg && (
                      <div style={{ marginTop: 28 }}>
                        <EventWeddingCustomCardWide svc={customPkg} onDetail={() => openDetail(customPkg)} waLink={content.waLink} />
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <section style={{ background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", padding: "72px 5%", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 900, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>Tidak Menemukan Paket yang Cocok?</h2>
          <p style={{ color: "rgba(255,255,255,.75)", fontSize: "1rem", marginBottom: 36, lineHeight: 1.7 }}>Kami siap membuat paket khusus sesuai kebutuhan dan budget Anda.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => window.open(content.waLink || "https://wa.me/6285745571442", "_blank")}
              style={{ padding: "14px 32px", background: "#fff", color: "#0d3b66", border: "none", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", transition: "background .2s" }}
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
    setSvcForm({ id: Date.now(), category: "traveling", title: "", badge: "", badgeColor: "#0891b2", accent: "#e8a020", accentLight: "#fff8e6", duration: "3 Hari 2 Malam", minPeserta: "20", price: "", priceNote: "/ orang", images: [], image: "", description: "", features: [], highlight: false, prices: [{vehicle:"Bus Executive",icon:"🚌",capacity:"35–60 org",price:"0",points:["Keterangan 1","Keterangan 2"]}] });
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
          <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66", marginBottom: 4 }}>Layanan / Paket</h1>
          <p style={{ fontSize: 12, color: "#5090aa" }}>Kelola paket layanan yang tampil di halaman Layanan Kami.</p>
        </div>
        <button onClick={openNew}
          style={{ padding: "9px 20px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          + Tambah Paket
        </button>
      </div>

      {/* Form Tambah / Edit */}
      {editSvc !== null && (
        <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 28, boxShadow: "0 4px 16px rgba(0,0,0,.08)", borderTop: "4px solid #0ea5c5" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0d3b66", marginBottom: 20 }}>
            {editSvc === "new" ? "➕ Tambah Paket Baru" : "✏ Edit Paket"}
          </h2>

          {/* Kategori */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Kategori *</label>
            <select value={svcForm.category || "traveling"} onChange={e => setSvcForm(p => ({ ...p, category: e.target.value }))}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", background: "#fff" }}>
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
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
                <input value={svcForm[f.key] || ""} onChange={e => setSvcForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none" }} />
              </div>
            ))}

            {/* Warna Badge — color picker ramah pemula */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Warna Badge</label>
              {/* Palet warna cepat */}
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 8 }}>
                {["#0891b2","#27ae60","#e67e22","#c0392b","#8e44ad","#e84393","#1abc9c","#f39c12","#0d3b66","#2c3e50"].map(c => (
                  <button key={c} onClick={() => setSvcForm(p => ({ ...p, badgeColor: c }))}
                    title={c}
                    style={{
                      width: 26, height: 26, borderRadius: "50%", background: c, border: "none", cursor: "pointer",
                      boxShadow: svcForm.badgeColor === c ? `0 0 0 3px #fff, 0 0 0 5px ${c}` : "0 1px 3px rgba(0,0,0,.2)",
                      transform: svcForm.badgeColor === c ? "scale(1.15)" : "scale(1)",
                      transition: "all .15s", flexShrink: 0
                    }} />
                ))}
              </div>
              {/* Input hex + native color picker */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={svcForm.badgeColor || "#0891b2"}
                  onChange={e => setSvcForm(p => ({ ...p, badgeColor: e.target.value }))}
                  style={{ width: 36, height: 36, border: "none", background: "none", cursor: "pointer", padding: 0, flexShrink: 0 }} />
                <input value={svcForm.badgeColor || "#0891b2"}
                  onChange={e => setSvcForm(p => ({ ...p, badgeColor: e.target.value }))}
                  placeholder="#0891b2" maxLength={7}
                  style={{ flex: 1, padding: "8px 10px", border: "1.5px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", fontFamily: "monospace" }} />
                {/* Live preview badge */}
                {svcForm.badge && (
                  <span style={{ background: svcForm.badgeColor || "#0891b2", color: "#fff", borderRadius: 4, padding: "4px 10px", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {svcForm.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Deskripsi</label>
            <textarea value={svcForm.description || ""} onChange={e => setSvcForm(p => ({ ...p, description: e.target.value }))}
              rows={3} placeholder="Deskripsi singkat paket layanan..."
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.6 }} />
          </div>

          {/* Multi-Image Upload */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Galeri Gambar ({(svcForm.images || []).length} foto)</label>
            {/* Preview thumbnails */}
            {(svcForm.images || []).length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {(svcForm.images || []).map((img, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img loading="lazy" src={img} alt="" style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 6, border: i === 0 ? "2px solid #0891b2" : "2px solid #c0e8f0" }} />
                    {i === 0 && <div style={{ position: "absolute", bottom: 2, left: 2, fontSize: 8, background: "#0891b2", color: "#fff", borderRadius: 3, padding: "1px 4px", fontWeight: 700 }}>COVER</div>}
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
            }} style={{ fontSize: 12, padding: "6px", border: "1.5px dashed #0ea5c5", borderRadius: 6, background: "#e8f9fc", color: "#0ea5c5", width: "100%" }} />
            <div style={{ fontSize: 11, color: "#5090aa", marginTop: 4 }}>Bisa pilih beberapa foto sekaligus. Foto pertama = cover.</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase" }}>Fitur / Yang Termasuk</label>
              <button onClick={addFeature} style={{ fontSize: 12, padding: "4px 12px", background: "#e8f8ef", color: "#27ae60", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>+ Tambah</button>
            </div>
            {(svcForm.features || []).map((feat, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={feat} onChange={e => updateFeature(i, e.target.value)}
                  placeholder={`Fitur ${i + 1}...`}
                  style={{ flex: 1, padding: "8px 10px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none" }} />
                <button onClick={() => removeFeature(i)} style={{ padding: "8px 12px", background: "#fee", color: "#e74c3c", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <input type="checkbox" id="svc-highlight" checked={!!svcForm.highlight} onChange={e => setSvcForm(p => ({ ...p, highlight: e.target.checked }))} style={{ width: 16, height: 16, cursor: "pointer" }} />
            <label htmlFor="svc-highlight" style={{ fontSize: 13, color: "#0d3b66", fontWeight: 600, cursor: "pointer" }}>Tandai sebagai Pilihan Utama (highlight)</label>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={saveSvc} style={{ padding: "10px 22px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>💾 Simpan Paket</button>
            <button onClick={cancelEdit} style={{ padding: "10px 18px", background: "#edfafc", color: "#4a7f98", border: "1px solid #b0dce8", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Batal</button>
          </div>
        </div>
      )}

      {/* Daftar Paket */}
      {svcs.length === 0 && editSvc === null ? (
        <div style={{ background: "#fff", borderRadius: 10, padding: "60px 20px", textAlign: "center", color: "#5090aa", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛎</div>
          <p style={{ fontSize: 14 }}>Belum ada paket layanan. Klik "+ Tambah Paket" untuk memulai.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {svcs.map(svc => (
            <div key={svc.id} style={{ background: "#fff", borderRadius: 10, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", gap: 16, alignItems: "flex-start", borderLeft: svc.highlight ? "4px solid #0ea5c5" : "4px solid #c0e8f0" }}>
              {svc.image && (
                <img loading="lazy" src={svc.image} alt={svc.title} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0d3b66" }}>{svc.title}</span>
                  {svc.badge && <span style={{ fontSize: 10, background: svc.badgeColor || "#0891b2", color: "#fff", borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>{svc.badge}</span>}
                  {svc.highlight && <span style={{ fontSize: 10, background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>⭐ Pilihan Utama</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0ea5c5" }}>{svc.price}<span style={{ color: "#5090aa", fontWeight: 400 }}> {svc.priceNote}</span></div>
                <div style={{ fontSize: 12, color: "#5090aa", marginTop: 4 }}>{(svc.features || []).length} fitur termasuk</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => openEdit(svc)} style={{ padding: "6px 14px", background: "#edfafc", color: "#0d3b66", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✏ Edit</button>
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
    const lines = [
      "Halo Arutala Organizer! 👋",
      "",
      "Nama: " + contactForm.name,
      "Email: " + (contactForm.email || "-"),
      "No. HP: " + (contactForm.phone || "-"),
      "Keperluan: " + (contactForm.subject || "-"),
      "",
      "Pesan:",
      contactForm.message,
    ].join("\n");
    window.open((content.waLink || "https://wa.me/6285745571442") + "?text=" + encodeURIComponent(lines), "_blank");
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
      <div style={{ background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", padding: "80px 5% 90px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: "20%", width: 300, height: 300, borderRadius: "50%", background: "rgba(8,145,178,.1)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto" }} className="about-hero-grid">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(8,145,178,.15)", border: "1px solid rgba(8,145,178,.3)", borderRadius: 20, padding: "5px 16px", marginBottom: 24 }}>
              <span style={{ fontSize: 10, letterSpacing: "2px", color: "rgba(255,255,255,.80)", textTransform: "uppercase", fontWeight: 700 }}>Tentang Kami</span>
            </div>
            <h1 className="display" style={{ fontSize: "clamp(2.25rem,5vw,3.75rem)", fontWeight: 900, lineHeight: 1.06, color: "#fff", marginBottom: 24 }}>
              {content.aboutHeroTitle || "Arutala Travel & Organizer"}
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,.85)", lineHeight: 1.9, maxWidth: 420, marginBottom: 32, whiteSpace: "pre-line" }}>
              {content.aboutHeroSub || content.aboutText || "Mitra terpercaya Anda untuk perjalanan wisata, pernikahan impian, dan event berkesan. Kami hadir untuk mewujudkan setiap momen menjadi kenangan tak terlupakan."}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href={content.waLink || "https://wa.me/6285745571442"} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", borderRadius: 4, fontSize: "0.8125rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", textDecoration: "none", transition: "background .2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#0891b2"}
                onMouseLeave={e => e.currentTarget.style.background = "#0d3b66"}>
                💬 Hubungi Kami
              </a>
              <a href={`tel:${content.phone}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.55)", borderRadius: 4, fontSize: "0.8125rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", textDecoration: "none" }}>
                📞 {content.phone || "Telepon"}
              </a>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {images.hero.slice(0, 4).map((src, i) => (
              <div key={i} className="img-zoom" style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "4/3", boxShadow: "0 8px 24px rgba(13,59,102,.15)" }}>
                <img loading="lazy" src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div style={{ background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", padding: "36px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
          {[
            { num: "500+", label: "Klien Puas" },
            { num: "7+", label: "Tahun Pengalaman" },
            { num: "100+", label: "Event Sukses" },
            { num: "24/7", label: "Layanan Support" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 900, color: "#22d3ee", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,.65)", marginTop: 6, fontWeight: 500, letterSpacing: ".04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VISI MISI ── */}
      <div style={{ padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="grid-2">
          <div style={{ background: "linear-gradient(135deg, #0891b2 0%, #0ea5c5 100%)", borderRadius: 12, padding: "40px 36px", color: "#fff" }}>
            <div style={{ fontSize: 36, marginBottom: 20 }}>🎯</div>
            <h3 style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, marginBottom: 16, color: "#fff" }}>Visi Kami</h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.85, color: "rgba(255,255,255,.8)" }}>
              Menjadi perusahaan travel dan organizer terkemuka di Indonesia yang dikenal atas pelayanan profesional, kreativitas, dan kemampuan mewujudkan momen-momen tak terlupakan bagi setiap klien.
            </p>
          </div>
          <div style={{ background: "#edfafc", borderRadius: 12, padding: "40px 36px", borderLeft: "4px solid #0891b2" }}>
            <div style={{ fontSize: 36, marginBottom: 20 }}>🚀</div>
            <h3 style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, marginBottom: 16, color: "#0d3b66" }}>Misi Kami</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {["Memberikan layanan terbaik dengan standar profesional tinggi", "Memastikan kepuasan klien di setiap momen yang kami tangani", "Berinovasi dalam layanan travel & event secara berkelanjutan", "Membangun kepercayaan jangka panjang bersama klien dan mitra"].map(m => (
                <li key={m} style={{ display: "flex", gap: 10, fontSize: "0.9rem", color: "#1a5a78", lineHeight: 1.6 }}>
                  <span style={{ color: "#0891b2", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <div style={{ background: "linear-gradient(130deg,#084060 0%,#0a6ea0 50%,#0cb5cc 100%)", padding: "80px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "rgba(255,255,255,.75)", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Keunggulan Kami</div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#fff" }}>{content.aboutWhyTitle || "Mengapa Memilih Arutala?"}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {values.map((v, i) => (
              <div key={v.title} className="hover-lift" style={{ background: "#fff", borderRadius: 12, padding: "32px 28px", boxShadow: "0 2px 12px rgba(13,59,102,.06)", borderTop: "3px solid #0891b2", transition: "all .3s" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontSize: "1.05rem", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: "#0d3b66", marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#1a5a78", lineHeight: 1.75, whiteSpace: "pre-line" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SUSUNAN TIM ── */}
      <div style={{ padding: "80px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "#0891b2", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Orang-Orang di Balik Layanan</div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#0d3b66" }}>Susunan Tim Kami</h2>
          </div>
          {(!teamMembers || teamMembers.length === 0) ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#5090aa" }}>Susunan tim belum diisi. Hubungi administrator.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 28 }}>
              {teamMembers.map((member, i) => (
                <div key={member.id || i} className="hover-lift" style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 16px rgba(13,59,102,.08)", textAlign: "center", transition: "all .3s" }}>
                  {/* Photo */}
                  <div style={{ height: 220, overflow: "hidden", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", position: "relative" }}>
                    {member.photo ? (
                      <img loading="lazy" src={member.photo} alt={member.name}
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
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to top, rgba(13,59,102,.75), transparent)", pointerEvents: "none" }} />
                  </div>
                  <div style={{ padding: "20px 20px 24px" }}>
                    <h3 style={{ fontSize: "1rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, color: "#0d3b66", marginBottom: 4 }}>{member.name}</h3>
                    <div style={{ fontSize: "0.8125rem", color: "#0891b2", fontWeight: 600, marginBottom: 12 }}>{member.role}</div>
                    {member.quotes && (
                      <p style={{ fontSize: "0.8125rem", color: "#4a7f98", fontStyle: "italic", lineHeight: 1.65, whiteSpace: "pre-line" }}>"{member.quotes}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── LAYANAN KAMI ── */}
      <div style={{ padding: "80px 5%", background: "linear-gradient(130deg,#0a5c88 0%,#0d95b8 55%,#12c8dc 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "#0891b2", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Apa yang Kami Tawarkan</div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#0d3b66" }}>Layanan Lengkap Kami</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {[
              { icon: "✈️", title: "Travel & Wisata", color: "#0891b2", items: ["Paket Wisata Lokal & Mancanegara", "Tiket Pesawat & Hotel", "Tour Guide Profesional", "Itinerary Kustom", "Transportasi Pribadi"] },
              { icon: "💍", title: "Wedding Organizer", color: "#8e44ad", items: ["Konsultasi & Perencanaan", "Dekorasi & Venue", "Koordinasi Hari H", "Dokumentasi & Foto", "Catering & Entertainment"] },
              { icon: "🎉", title: "Event Organizer", color: "#e67e22", items: ["Corporate Event", "Birthday & Anniversary", "Gathering & Outbound", "Seminar & Conference", "Pesta Perpisahan & Reunian"] },
            ].map(s => (
              <div key={s.title} style={{ border: "1px solid rgba(255,255,255,.25)", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.12)" }}>
                <div style={{ background: s.color, padding: "24px 28px", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 32 }}>{s.icon}</span>
                  <h3 style={{ fontSize: "1.125rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, color: "#fff" }}>{s.title}</h3>
                </div>
                <div style={{ padding: "20px 28px", background: "#fff" }}>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {s.items.map(item => (
                      <li key={item} style={{ display: "flex", gap: 10, fontSize: "0.9rem", color: "#0d3b66", fontWeight: 500 }}>
                        <span style={{ color: s.color, fontWeight: 700, flexShrink: 0 }}>→</span> {item}
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
      <div style={{ background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", padding: "80px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: "0.6875rem", letterSpacing: "2px", color: "#0891b2", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Hubungi Kami</div>
            <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#0d3b66" }}>Contact Us</h2>
            <p style={{ fontSize: "1rem", color: "#1a5a78", marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>Siap membantu Anda merencanakan momen terbaik. Hubungi kami sekarang!</p>
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
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{info.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#5090aa", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 4 }}>{info.label}</div>
                    {info.type === "link"
                      ? <a href={info.href} target={info.href.startsWith("https") ? "_blank" : "_self"} rel="noopener noreferrer" style={{ fontSize: "0.9375rem", color: "#0891b2", fontWeight: 600, textDecoration: "none" }}>{info.value}</a>
                      : <div style={{ fontSize: "0.9375rem", color: "#0d3b66", fontWeight: 500 }}>{info.value}</div>
                    }
                  </div>
                </div>
              ))}

              {/* Social Media */}
              <div style={{ background: "rgba(255,255,255,.7)", borderRadius: 10, padding: "18px 20px", backdropFilter: "blur(8px)" }}>
                <div style={{ fontSize: "0.75rem", color: "#5090aa", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 14 }}>Media Sosial</div>
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
            <div style={{ background: "#fff", borderRadius: 14, padding: "36px 32px", boxShadow: "0 8px 40px rgba(13,59,102,.12)" }}>
              <h3 style={{ fontSize: "1.25rem", fontFamily: "'Playfair Display',serif", fontWeight: 800, color: "#0d3b66", marginBottom: 24 }}>Kirim Pesan</h3>
              {contactSent ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                  <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.25rem", color: "#27ae60", marginBottom: 8 }}>Pesan Terkirim!</h4>
                  <p style={{ color: "#1a5a78", fontSize: "0.9rem" }}>Kami akan segera menghubungi Anda melalui WhatsApp.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5090aa", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Nama *</label>
                      <input value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Nama lengkap"
                        style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #b0dce8", borderRadius: 8, fontSize: "0.9rem", outline: "none", transition: "border .2s" }}
                        onFocus={e => e.target.style.borderColor = "#0891b2"}
                        onBlur={e => e.target.style.borderColor = "#b0dce8"} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5090aa", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>No. HP</label>
                      <input value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="08xx-xxxx-xxxx"
                        style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #b0dce8", borderRadius: 8, fontSize: "0.9rem", outline: "none", transition: "border .2s" }}
                        onFocus={e => e.target.style.borderColor = "#0891b2"}
                        onBlur={e => e.target.style.borderColor = "#b0dce8"} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5090aa", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Email</label>
                    <input value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="email@domain.com"
                      style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #b0dce8", borderRadius: 8, fontSize: "0.9rem", outline: "none", transition: "border .2s" }}
                      onFocus={e => e.target.style.borderColor = "#0891b2"}
                      onBlur={e => e.target.style.borderColor = "#b0dce8"} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5090aa", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Keperluan</label>
                    <select value={contactForm.subject} onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))}
                      style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #b0dce8", borderRadius: 8, fontSize: "0.9rem", outline: "none", background: "#fff", color: contactForm.subject ? "#0d3b66" : "#7ab5cc" }}>
                      <option value="">-- Pilih keperluan --</option>
                      <option value="Travel & Wisata">✈️ Travel & Wisata</option>
                      <option value="Wedding Organizer">💍 Wedding Organizer</option>
                      <option value="Event Organizer">🎉 Event Organizer</option>
                      <option value="Konsultasi">💬 Konsultasi Umum</option>
                      <option value="Lainnya">📋 Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5090aa", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 6 }}>Pesan *</label>
                    <textarea value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Ceritakan kebutuhan Anda..."
                      rows={4}
                      style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #b0dce8", borderRadius: 8, fontSize: "0.9rem", outline: "none", resize: "vertical", lineHeight: 1.65, transition: "border .2s" }}
                      onFocus={e => e.target.style.borderColor = "#0891b2"}
                      onBlur={e => e.target.style.borderColor = "#b0dce8"} />
                  </div>
                  <button onClick={handleContactSubmit}
                    style={{ padding: "13px 28px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.875rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer", transition: "background .2s", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0891b2"}
                    onMouseLeave={e => e.currentTarget.style.background = "#0d3b66"}>
                    💬 Kirim via WhatsApp
                  </button>
                  <p style={{ fontSize: "0.8rem", color: "#7ab5cc", textAlign: "center" }}>Pesan akan diteruskan ke WhatsApp kami untuk respons lebih cepat.</p>
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
        <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66" }}>👥 Susunan Tim</h1>
        {!editId && <button onClick={openNew} style={{ padding: "10px 20px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Tambah Anggota</button>}
      </div>

      {/* Form Edit */}
      {editId && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,.08)", marginBottom: 28, borderTop: "4px solid #0ea5c5" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0d3b66", marginBottom: 20 }}>{editId === "new" ? "➕ Tambah Anggota Tim" : "✏ Edit Anggota Tim"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[
              { label: "Nama *", key: "name", placeholder: "Budi Santoso" },
              { label: "Jabatan", key: "role", placeholder: "Wedding Coordinator" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</label>
                <input value={form[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none" }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Quotes / Motto</label>
            <input value={form.quotes || ""} onChange={e => setForm(p => ({ ...p, quotes: e.target.value }))}
              placeholder="Setiap momen spesial layak dirayakan dengan sempurna."
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Foto</label>
            {form.photo && <img loading="lazy" src={form.photo} alt="preview" style={{ height: 80, width: 80, objectFit: "cover", borderRadius: "50%", marginBottom: 10, border: "2px solid #c0e8f0" }} />}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input type="file" accept="image/*" onChange={async e => {
                const file = e.target.files?.[0]; if (!file) return;
                try { notify("⏳ Mengupload foto..."); const url = await uploadToCloudinary(file); setForm(p => ({ ...p, photo: url })); notify("Foto berhasil diupload!"); }
                catch { notify("Gagal upload foto.", "error"); }
              }} style={{ fontSize: 12, padding: "6px", border: "1.5px dashed #0ea5c5", borderRadius: 6, background: "#e8f9fc", color: "#0ea5c5", width: "100%" }} />
              <div style={{ fontSize: 11, color: "#7ab5cc", textAlign: "center" }}>— atau paste URL foto —</div>
              <input type="url" value={form.photo || ""} onChange={e => setForm(p => ({ ...p, photo: e.target.value }))}
                placeholder="https://..." style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #b0dce8", borderRadius: 6, fontSize: 12, outline: "none" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={saveMember} style={{ padding: "10px 22px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>💾 Simpan</button>
            <button onClick={cancelEdit} style={{ padding: "10px 18px", background: "#edfafc", color: "#4a7f98", border: "1px solid #b0dce8", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Batal</button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
        {members.map(m => (
          <div key={m.id} style={{ background: "#fff", borderRadius: 12, padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,.06)", display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", background: "#edfafc", border: "2px solid #c0e8f0", flexShrink: 0 }}>
              {m.photo ? <img loading="lazy" src={m.photo} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>👤</div>}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#0d3b66", fontSize: 14 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "#0891b2", fontWeight: 600 }}>{m.role}</div>
              {m.quotes && <div style={{ fontSize: 11, color: "#5090aa", fontStyle: "italic", marginTop: 6, lineHeight: 1.5, whiteSpace: "pre-line" }}>"{m.quotes}"</div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openEdit(m)} style={{ padding: "6px 14px", background: "#e8f9fc", color: "#0ea5c5", border: "1px solid #c5dde9", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>✏ Edit</button>
              <button onClick={() => deleteMember(m.id)} style={{ padding: "6px 14px", background: "#fee", color: "#e74c3c", border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🗑 Hapus</button>
            </div>
          </div>
        ))}
        {members.length === 0 && !editId && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#5090aa" }}>
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
    <section className="section-md" style={{ background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", position: "relative", overflow: "hidden" }}>
      {/* Flare effects */}
      <div style={{ position: "absolute", top: "30%", right: "15%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,216,232,.32) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(16px)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,197,.25) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(20px)" }} />
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
            <img loading="lazy" src={puzzleImgs[0]} alt="Destinasi" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
          </div>
          <div className="adv2-puzzle-b">
            <img loading="lazy" src={puzzleImgs[1]} alt="Destinasi" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
          </div>
          <div className="adv2-puzzle-c">
            <div className="adv2-puzzle-c-sm">
              <img loading="lazy" src={puzzleImgs[2]} alt="Destinasi" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            </div>
            <div className="adv2-puzzle-c-sm">
              <img loading="lazy" src={puzzleImgs[3]} alt="Destinasi" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── HOME INTRO SLIDESHOW (panel kiri beranda) ─────────────── */
function HomeIntroSlideshow({ data }) {
  // Kumpulkan SEMUA foto dari seluruh sumber di website
  const seen = new Set();
  const allImgs = [];
  const add = (src, label = "") => {
    if (src && typeof src === "string" && src.startsWith("http") && !seen.has(src)) {
      seen.add(src);
      allImgs.push({ src, label });
    }
  };

  // 1. Hero images (galeri utama)
  (data.images?.hero || []).forEach(src => add(src, "Hero"));

  // 2. Gallery images lainnya
  Object.entries(data.images || {}).forEach(([key, val]) => {
    if (key !== "hero" && Array.isArray(val)) val.forEach(src => add(src, key));
    else if (key !== "hero" && typeof val === "string") add(val, key);
  });

  // 3. Semua postingan (news, shop, destinations) — coverImage
  ["news", "shop", "destinations"].forEach(sec => {
    (data.posts?.[sec] || []).forEach(p => add(p.coverImage, p.title));
  });

  // 4. Semua paket layanan — images[] dan image
  (data.services || []).forEach(svc => {
    (svc.images || []).forEach(src => add(src, svc.title));
    add(svc.image, svc.title);
    // 5. Foto destinasi dalam tiap paket
    (svc.destinations || []).forEach(d => add(d.img, d.name));
  });

  // Fallback
  if (allImgs.length === 0) {
    add("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bromo_tengger_semeru_national_park.jpg/1280px-Bromo_tengger_semeru_national_park.jpg", "");
  }

  const [cur, setCur] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (allImgs.length <= 1) return;
    timerRef.current = setInterval(() => setCur(c => (c + 1) % allImgs.length), 3500);
    return () => clearInterval(timerRef.current);
  }, [allImgs.length]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 380, overflow: "hidden", background: "#0d3b66" }}>
      <style>{`@keyframes introImgSlide { from { opacity:0; transform:scale(1.05); } to { opacity:1; transform:scale(1); } }`}</style>
      {allImgs.map((img, i) => (
        i === cur ? (
          <img key={i} src={img.src} alt={img.label}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "introImgSlide .7s cubic-bezier(.22,1,.36,1) both", zIndex: 1 }}
            onError={e => { e.target.style.opacity = "0"; }} />
        ) : null
      ))}
      {/* Counter */}
      <div style={{ position: "absolute", top: 12, right: 16, zIndex: 4, background: "rgba(0,0,0,.38)", backdropFilter: "blur(6px)", borderRadius: 20, padding: "3px 10px", fontSize: "0.625rem", color: "rgba(255,255,255,.8)", fontWeight: 600, letterSpacing: ".06em" }}>
        {String(cur + 1).padStart(2,"0")} / {String(allImgs.length).padStart(2,"0")}
      </div>
      {/* Dot indicators */}
      {allImgs.length > 1 && (
        <div style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 3, flexWrap: "wrap", justifyContent: "center", maxWidth: "80%" }}>
          {allImgs.slice(0, 12).map((_, i) => (
            <div key={i} onClick={() => setCur(i)}
              style={{ width: i === cur ? 16 : 5, height: 5, borderRadius: 3, background: i === cur ? "#10d0e0" : "rgba(255,255,255,.4)", cursor: "pointer", transition: "all .3s ease" }} />
          ))}
        </div>
      )}
    </div>
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
        @keyframes vertigoZoom { 0%{transform:scale(1.0);} 100%{transform:scale(1.08);} }
        @keyframes vertigoZoomOut { 0%{transform:scale(1.08);} 100%{transform:scale(1.0);} }
        .hero-slide-img-idle { animation: vertigoZoom 5s ease-in-out infinite alternate; transform-origin: center center; }
        .hero-slide-img-exit { animation: vertigoZoomOut 0.7s cubic-bezier(.77,0,.18,1) forwards; }
        .hero-slide-img-enter { animation: vertigoZoom 5s ease-in-out infinite alternate; }
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
            <img loading="lazy" src={prevSl.src} alt="" className="hero-slide-img-exit" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,20,35,.5) 0%, rgba(10,20,35,.75) 100%)" }} />
          </div>
        )}
        {/* Current slide (enter) */}
        <div style={getEnterStyle(anim)}>
          <img loading="lazy" src={sl.src} alt={sl.title} className="hero-slide-img-idle" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,20,35,.35) 0%, rgba(10,20,35,.78) 100%)" }} />
        </div>
      </div>

      {/* CONTENT OVERLAY — rata tengah */}
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6%", textAlign: "center" }}>
        <div style={{ maxWidth: 640, animation: animating ? "none" : "heroTxtIn .6s ease both" }} key={current}>
          {/* Label */}
          <div style={{ display: "inline-block", background: "#e8a020", color: "#fff", fontSize: "0.6875rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 2, marginBottom: 18 }}>
            {SECTION_LABEL[sl.section] || "Arutala Organizer"}
          </div>
          {/* Title */}
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.9rem,5.5vw,3.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.08, marginBottom: 18, textShadow: "0 2px 16px rgba(0,0,0,.5)" }}>
            {sl.title}
          </h1>
          {/* Excerpt */}
          {sl.excerpt && (
            <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,.82)", lineHeight: 1.8, marginBottom: 32, whiteSpace: "pre-line" }}>
              {sl.excerpt.length > 120 ? sl.excerpt.slice(0, 120) + "…" : sl.excerpt}
            </p>
          )}
          {/* CTA Buttons — centered */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="hero-cta-btn" onClick={() => navigateTo("services")}
              style={{ padding: "13px 30px", background: "#e8a020", color: "#fff", border: "none", borderRadius: 3, fontSize: "0.8125rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }}>
              Read More →
            </button>
            <button className="hero-cta-btn" onClick={() => navigateTo("about")}
              style={{ padding: "13px 30px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "2px solid rgba(255,255,255,.55)", borderRadius: 3, fontSize: "0.8125rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }}>
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#edfafc" }}>
      <div style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: "48px 40px", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,.1)" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>❌</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: "#0d3b66", marginBottom: 12 }}>Link Tidak Valid</h2>
        <p style={{ color: "#4a7f98", fontSize: "0.9375rem", lineHeight: 1.7 }}>Link form ulasan ini tidak ditemukan atau sudah tidak berlaku.</p>
      </div>
    </div>
  );

  if (tokenObj.used) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#edfafc" }}>
      <div style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: "48px 40px", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,.1)" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⏰</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", color: "#0d3b66", marginBottom: 12 }}>Link Sudah Digunakan</h2>
        <p style={{ color: "#4a7f98", fontSize: "0.9375rem", lineHeight: 1.7 }}>Form ulasan ini sudah pernah diisi. Setiap link hanya bisa digunakan satu kali.</p>
      </div>
    </div>
  );

  if (step === "done") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#edfafc,#e8f4fd)" }}>
      <div style={{ textAlign: "center", background: "#fff", borderRadius: 20, padding: "56px 48px", maxWidth: 440, boxShadow: "0 16px 56px rgba(13,59,102,.12)" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.875rem", fontWeight: 900, color: "#0d3b66", marginBottom: 14 }}>Terima Kasih!</h2>
        <p style={{ color: "#1a5a78", fontSize: "1rem", lineHeight: 1.8 }}>Ulasan Anda telah berhasil dikirim. Kami sangat menghargai kepercayaan Anda kepada Arutala Organizer.</p>
        <div style={{ width: 48, height: 3, background: "#0891b2", borderRadius: 2, margin: "28px auto 0" }} />
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
        approved: false,
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#edfafc 0%,#e8f0f8 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 5%" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "48px 44px", maxWidth: 520, width: "100%", boxShadow: "0 16px 56px rgba(13,59,102,.12)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>⭐</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.75rem", fontWeight: 900, color: "#0d3b66", marginBottom: 8 }}>Berikan Ulasan Anda</h1>
          <p style={{ color: "#4a7f98", fontSize: "0.9375rem", lineHeight: 1.6 }}>Bagikan pengalaman Anda bersama {content_data.logoText?.replace("\n"," ") || "Arutala Organizer"}</p>
          {tokenObj.label && <div style={{ marginTop: 10, display: "inline-block", background: "#e8f9fc", border: "1px solid #86cad8", color: "#0891b2", fontSize: "0.75rem", fontWeight: 600, padding: "4px 14px", borderRadius: 20 }}>{tokenObj.label}</div>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Photo Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4a7f98", letterSpacing: ".08em", textTransform: "uppercase" }}>Foto Profil (Opsional)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: form.photo ? "transparent" : "linear-gradient(135deg,#c0e8f0,#c5dde9)", border: "2px solid #c0e8f0", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {form.photo ? <img loading="lazy" src={form.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>👤</span>}
              </div>
              <div style={{ flex: 1 }}>
                <input type="file" accept="image/*" onChange={e => handlePhotoUpload(e.target.files?.[0])}
                  style={{ fontSize: "0.8125rem", color: "#1a5a78", width: "100%" }} />
                {photoUploading && <span style={{ fontSize: "0.75rem", color: "#0891b2" }}>⏳ Mengupload...</span>}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4a7f98", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Nama Lengkap *</label>
            <input value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErr(""); }}
              placeholder="Masukkan nama Anda"
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #b0dce8", borderRadius: 8, fontSize: "0.9375rem", outline: "none", transition: "border-color .2s" }}
              onFocus={e => e.target.style.borderColor = "#0891b2"} onBlur={e => e.target.style.borderColor = "#b0dce8"} />
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4a7f98", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email *</label>
            <input type="email" value={form.email} onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErr(""); }}
              placeholder="email@contoh.com"
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #b0dce8", borderRadius: 8, fontSize: "0.9375rem", outline: "none", transition: "border-color .2s" }}
              onFocus={e => e.target.style.borderColor = "#0891b2"} onBlur={e => e.target.style.borderColor = "#b0dce8"} />
          </div>

          {/* Stars */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4a7f98", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Rating *</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setForm(p => ({ ...p, stars: s }))}
                  style={{ fontSize: 32, background: "none", border: "none", cursor: "pointer", transition: "transform .15s", filter: s <= form.stars ? "none" : "grayscale(1) opacity(.3)" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>⭐</button>
              ))}
              <span style={{ fontSize: "0.875rem", color: "#4a7f98", alignSelf: "center", marginLeft: 6 }}>
                {["","Sangat Buruk","Buruk","Cukup","Bagus","Sangat Bagus"][form.stars]}
              </span>
            </div>
          </div>

          {/* Review Content */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4a7f98", letterSpacing: ".08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Isi Ulasan *</label>
            <textarea value={form.content} onChange={e => { setForm(p => ({ ...p, content: e.target.value })); setErr(""); }}
              placeholder="Ceritakan pengalaman Anda bersama kami..."
              rows={5}
              style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #b0dce8", borderRadius: 8, fontSize: "0.9375rem", outline: "none", resize: "vertical", lineHeight: 1.7, transition: "border-color .2s" }}
              onFocus={e => e.target.style.borderColor = "#0891b2"} onBlur={e => e.target.style.borderColor = "#b0dce8"} />
          </div>

          {err && <div style={{ background: "#fef0f0", border: "1px solid #f5c6c6", borderRadius: 8, padding: "10px 14px", color: "#c0392b", fontSize: "0.875rem" }}>{err}</div>}

          <button onClick={handleSubmit} disabled={submitting || photoUploading}
            style={{ padding: "14px", background: submitting ? "#5090aa" : "linear-gradient(135deg,#0d3b66,#0891b2)", color: "#fff", border: "none", borderRadius: 10, fontSize: "0.9375rem", fontWeight: 700, letterSpacing: ".05em", cursor: submitting ? "not-allowed" : "pointer", transition: "opacity .2s" }}>
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
    <section style={{ padding: "80px 0 72px", background: "linear-gradient(130deg,#084060 0%,#0a6ea0 50%,#0cb5cc 100%)", overflow: "hidden" }}>
      <style>{`
        @keyframes reviewIn { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        .rev-card { transition: transform .5s cubic-bezier(.22,1,.36,1), opacity .5s ease, box-shadow .3s; }
        .rev-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 48px rgba(13,59,102,.14) !important; }
      `}</style>

      {/* Section Header */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", right: "8%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,216,232,.28) 0%, transparent 65%)", filter: "blur(22px)" }} />
        <div style={{ position: "absolute", top: "50%", left: "3%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,197,.2) 0%, transparent 65%)", filter: "blur(26px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 52, padding: "0 5%", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 1.5, background: "#38c5d8" }} />
          <span style={{ fontSize: "0.6875rem", letterSpacing: "3px", color: "rgba(255,255,255,.7)", textTransform: "uppercase", fontWeight: 700 }}>Testimoni Klien</span>
          <div style={{ width: 32, height: 1.5, background: "#38c5d8" }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
          Apa Kata Mereka?
        </h2>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.72)", marginTop: 12, maxWidth: 440, margin: "12px auto 0", lineHeight: 1.7 }}>
          Kepuasan klien adalah prioritas utama kami di setiap layanan.
        </p>
      </div>

      {/* Stars rating summary */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        {(() => {
          const avg = reviews.reduce((s, r) => s + (r.stars || 5), 0) / reviews.length;
          return (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 40, padding: "10px 24px", backdropFilter: "blur(8px)", boxShadow: "0 4px 16px rgba(0,0,0,.2)" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 900, fontFamily: "'Playfair Display',serif", color: "#fff" }}>{avg.toFixed(1)}</span>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 16, filter: s <= Math.round(avg) ? "none" : "grayscale(1) opacity(.3)" }}>⭐</span>)}
              </div>
              <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{reviews.length} ulasan</span>
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
              style={{ position: "absolute", left: "2%", top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1.5px solid #c0e8f0", boxShadow: "0 4px 16px rgba(13,59,102,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#0d3b66", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0d3b66"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0d3b66"; }}>‹</button>
            <button onClick={() => { setCurrent(p => (p + 1) % total); }}
              style={{ position: "absolute", right: "2%", top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1.5px solid #c0e8f0", boxShadow: "0 4px 16px rgba(13,59,102,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#0d3b66", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0d3b66"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#0d3b66"; }}>›</button>
          </>
        )}
      </div>

      {/* Dots */}
      {total > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? "#38c5d8" : "rgba(255,255,255,.3)", border: "none", cursor: "pointer", transition: "all .3s", padding: 0 }} />
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review }) {
  const stars = review.stars || 5;
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 4px 24px rgba(13,59,102,.08)", border: "1px solid #e0f7fa", height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stars */}
      <div style={{ display: "flex", gap: 3 }}>
        {[1,2,3,4,5].map(s => (
          <span key={s} style={{ fontSize: 14, filter: s <= stars ? "none" : "grayscale(1) opacity(.25)" }}>⭐</span>
        ))}
      </div>
      {/* Quote */}
      <p style={{ fontSize: "0.9rem", color: "#1a4a72", lineHeight: 1.75, fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", flex: 1, whiteSpace: "pre-line" }}>
        "{review.content?.length > 180 ? review.content.slice(0, 180) + "…" : review.content}"
      </p>
      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12, borderTop: "1px solid #f0f4f8" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {review.photo
            ? <img loading="lazy" src={review.photo} alt={review.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>{review.name?.charAt(0)?.toUpperCase() || "?"}</span>
          }
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0d3b66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{review.name}</div>
          <div style={{ fontSize: "0.75rem", color: "#4a7f98" }}>{review.date}</div>
        </div>
        {review.tokenLabel && (
          <div style={{ marginLeft: "auto", fontSize: "0.625rem", background: "#e8f9fc", color: "#0891b2", padding: "2px 8px", borderRadius: 10, fontWeight: 600, flexShrink: 0, maxWidth: 80, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{review.tokenLabel}</div>
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

  const approveReview = (id) => {
    save({ ...data, reviews: reviews.map(r => r.id === id ? { ...r, approved: true } : r) });
    notify("✅ Ulasan disetujui dan ditampilkan ke publik.");
  };

  const rejectReview = (id) => {
    save({ ...data, reviews: reviews.map(r => r.id === id ? { ...r, approved: false } : r) });
    notify("Ulasan disembunyikan dari publik.");
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
    <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66", marginBottom: 28 }}>⭐ Kelola Ulasan</h1>

    {/* Generate Review Link */}
    <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #38c5d8" }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0d3b66", marginBottom: 6 }}>🔗 Buat Link Form Ulasan</h3>
      <p style={{ fontSize: 12, color: "#5090aa", marginBottom: 16, lineHeight: 1.6 }}>
        Buat link sekali pakai untuk dikirimkan ke klien. Link hanya bisa digunakan satu kali — setelah diisi, link akan hangus otomatis.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <input value={newTokenLabel} onChange={e => setNewTokenLabel(e.target.value)}
          placeholder="Label (misal: Klien Wedding Budi, opsional)"
          style={{ flex: 1, minWidth: 240, padding: "9px 12px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none" }} />
        <button onClick={generateToken}
          style={{ padding: "9px 18px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", borderRadius: 6, fontSize: 13, border: "none", fontWeight: 600, whiteSpace: "nowrap" }}>
          + Buat Link
        </button>
      </div>
      {generatedLink && (
        <div style={{ background: "#e8f9fc", border: "1px solid #86cad8", borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", marginBottom: 4, letterSpacing: ".05em", textTransform: "uppercase" }}>Link Form Ulasan Terbaru</div>
            <code style={{ fontSize: 12, color: "#0d3b66", wordBreak: "break-all", display: "block" }}>{generatedLink}</code>
          </div>
          <button onClick={() => { navigator.clipboard?.writeText(generatedLink); notify("Link disalin!"); }}
            style={{ padding: "7px 14px", background: "#0891b2", color: "#fff", borderRadius: 6, fontSize: 12, border: "none", fontWeight: 600, flexShrink: 0 }}>
            📋 Salin
          </button>
        </div>
      )}
    </div>

    {/* Active Tokens */}
    <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0d3b66", marginBottom: 14 }}>🔑 Token Aktif ({tokens.filter(t => !t.used).length})</h3>
      {tokens.length === 0 ? (
        <p style={{ fontSize: 13, color: "#5090aa" }}>Belum ada token dibuat.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tokens.slice().reverse().map(tok => (
            <div key={tok.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: tok.used ? "#f9f9f9" : "#e8f9fc", borderRadius: 8, border: `1px solid ${tok.used ? "#e8e8e8" : "#86cad8"}` }}>
              <span style={{ fontSize: 16 }}>{tok.used ? "✅" : "🔑"}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0d3b66" }}>{tok.label || "—"}</div>
                <div style={{ fontSize: 11, color: "#5090aa", fontFamily: "monospace", wordBreak: "break-all" }}>{tok.token}</div>
                <div style={{ fontSize: 11, color: "#5090aa" }}>Dibuat: {tok.createdAt} · {tok.used ? "Sudah digunakan" : "Belum digunakan"}</div>
              </div>
              {!tok.used && (
                <button onClick={() => { const l = `${window.location.origin}${window.location.pathname}?review=${tok.token}`; navigator.clipboard?.writeText(l); notify("Link disalin!"); }}
                  style={{ padding: "5px 10px", background: "#0ea5c5", color: "#fff", borderRadius: 5, fontSize: 11, border: "none" }}>📋</button>
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
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0d3b66", marginBottom: 14 }}>
        💬 Ulasan Masuk ({reviews.length})
        {reviews.filter(r => !r.approved).length > 0 && (
          <span style={{ marginLeft: 8, background: "#e74c3c", color: "#fff", borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
            {reviews.filter(r => !r.approved).length} pending
          </span>
        )}
      </h3>
      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px", color: "#5090aa", fontSize: 13 }}>Belum ada ulasan masuk. Buat link dan kirimkan ke klien!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviews.slice().reverse().map(r => (
            <div key={r.id} style={{ border: "1px solid #e0f7fa", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>
                  {r.photo ? <img loading="lazy" src={r.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : r.name?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0d3b66" }}>{r.name}</span>
                    <span style={{ fontSize: 12, color: "#5090aa" }}>{r.email}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                      background: r.approved ? "#e8f8ef" : "#fff8e1",
                      color: r.approved ? "#27ae60" : "#f39c12",
                      border: `1px solid ${r.approved ? "#27ae60" : "#f39c12"}40`
                    }}>
                      {r.approved ? "✓ Tayang" : "⏳ Pending"}
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "#5090aa" }}>{r.date}</span>
                  </div>
                  <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 13, filter: s <= r.stars ? "none" : "grayscale(1) opacity(.3)" }}>⭐</span>)}
                  </div>
                  {editReviewId === r.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input value={editReviewForm.name} onChange={e => setEditReviewForm(p => ({ ...p, name: e.target.value }))}
                        style={{ padding: "7px 10px", border: "1px solid #b0dce8", borderRadius: 5, fontSize: 13 }} placeholder="Nama" />
                      <div style={{ display: "flex", gap: 4 }}>
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setEditReviewForm(p => ({ ...p, stars: s }))}
                            style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer", filter: s <= editReviewForm.stars ? "none" : "grayscale(1) opacity(.3)" }}>⭐</button>
                        ))}
                      </div>
                      <textarea value={editReviewForm.content} onChange={e => setEditReviewForm(p => ({ ...p, content: e.target.value }))}
                        rows={3} style={{ padding: "7px 10px", border: "1px solid #b0dce8", borderRadius: 5, fontSize: 13, resize: "vertical" }} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={saveEditReview} style={{ padding: "6px 16px", background: "#27ae60", color: "#fff", borderRadius: 5, fontSize: 12, border: "none" }}>Simpan</button>
                        <button onClick={() => setEditReviewId(null)} style={{ padding: "6px 14px", background: "#edfafc", color: "#4a7f98", borderRadius: 5, fontSize: 12, border: "1px solid #b0dce8" }}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: "#1a4a72", lineHeight: 1.7, fontStyle: "italic", whiteSpace: "pre-line" }}>"{r.content}"</p>
                  )}
                  {r.tokenLabel && <div style={{ marginTop: 6, fontSize: 11, color: "#0891b2", fontWeight: 500 }}>🏷 {r.tokenLabel}</div>}
                </div>
              </div>
              {editReviewId !== r.id && (
                <div style={{ padding: "10px 20px", background: "#f5fdff", borderTop: "1px solid #f0f4f8", display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {r.approved ? (
                    <button onClick={() => rejectReview(r.id)} style={{ padding: "5px 14px", background: "#fff8e1", color: "#f39c12", borderRadius: 5, fontSize: 12, border: "1px solid #f39c1240", fontWeight: 500 }}>👁 Sembunyikan</button>
                  ) : (
                    <button onClick={() => approveReview(r.id)} style={{ padding: "5px 14px", background: "#e8f8ef", color: "#27ae60", borderRadius: 5, fontSize: 12, border: "1px solid #27ae6040", fontWeight: 600 }}>✅ Setujui & Tayangkan</button>
                  )}
                  <button onClick={() => startEditReview(r)} style={{ padding: "5px 14px", background: "#e8f4fd", color: "#0891b2", borderRadius: 5, fontSize: 12, border: "none", fontWeight: 500 }}>✏ Edit</button>
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
}

export default function BricksyTravel() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");   // home | about | news | shop | destinations | services
  const [historyStack, setHistoryStack] = useState(["home"]); // SPA history
  const [historyIdx, setHistoryIdx] = useState(0);            // current position in stack
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
      } else if (key === "services" && Array.isArray(sv) && Array.isArray(dv)) {
        // Array services: gabungkan data Firebase + item DEFAULT yang id-nya belum ada.
        // JUGA: merge field baru (facilities, destinations, services) ke tiap item lama
        // yang tersimpan di Firebase namun belum punya field tersebut.
        if (sv.length === 0) {
          result[key] = dv; // Firebase kosong → seed penuh dari DEFAULT
        } else {
          const defaultById = Object.fromEntries(dv.map(s => [s.id, s]));
          const merged = sv.map(savedItem => {
            const def = defaultById[savedItem.id];
            if (!def) return savedItem; // item custom user, tidak ada di DEFAULT → biarkan
            // Inject field baru dari DEFAULT jika belum ada di item tersimpan
            const patched = { ...savedItem };
            // Untuk paket traveling: PAKSA sync field kritis dari DEFAULT
            // (pastikan filter category==="traveling" & pkgId selalu benar)
            if (def.category === "traveling") {
              patched.category  = def.category;  // WAJIB: agar lolos filter Traveling
              patched.pkgId     = def.pkgId;      // WAJIB: agar tidak salah bucket
              patched.highlight = def.highlight;
              if (def.destinations) patched.destinations = def.destinations;
              if (def.facilities)   patched.facilities   = def.facilities;
              if (def.prices)       patched.prices       = def.prices;
              if (def.services)     patched.services     = def.services;
            }
            for (const field of ["facilities", "destinations", "services", "images", "prices", "pkgId", "tagline", "accent", "accentLight", "duration", "minPeserta", "description", "features", "highlight", "badge", "badgeColor", "priceNote", "category"]) {
              if (patched[field] === undefined || patched[field] === null || patched[field] === "") {
                if (def[field] !== undefined) patched[field] = def[field];
              }
            }
            return patched;
          });
          const existingIds = new Set(sv.map(s => s.id));
          const missing = dv.filter(s => !existingIds.has(s.id));
          result[key] = [...merged, ...missing];
        }
      } else {
        // Primitif atau array lain → pakai nilai yang disimpan
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
      } finally {
        setIsLoading(false);
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
    setHistoryStack(prev => {
      const trimmed = prev.slice(0, historyIdx + 1); // buang forward history
      return [...trimmed, p];
    });
    setHistoryIdx(prev => prev + 1);
  };

  const spaBack = () => {
    if (historyIdx <= 0) return;
    const newIdx = historyIdx - 1;
    setHistoryIdx(newIdx);
    const target = historyStack[newIdx];
    setPage(target); setReadPost(null); setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const spaForward = () => {
    if (historyIdx >= historyStack.length - 1) return;
    const newIdx = historyIdx + 1;
    setHistoryIdx(newIdx);
    const target = historyStack[newIdx];
    setPage(target); setReadPost(null); setMobileMenu(false);
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
    { key: "services", label: data.content.nav4 }, // Traveling → langsung ke halaman paket
    { key: "destinations", label: data.content.nav5 },
    { key: "services", label: data.content.nav6 || "Layanan Kami" },
  ];

  /* ─── RENDER ─── */
  return (
    <div className="page-wrap" style={{ position: "relative", minHeight: "100vh" }}>
      <GS />

      {/* ── LOADING SKELETON ── */}
      {isLoading && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9990, background: "#f0fbfd", display: "flex", flexDirection: "column" }}>
          <style>{`
            @keyframes shimmer { 0%{background-position:-800px 0} 100%{background-position:800px 0} }
            .sk { background: linear-gradient(90deg,#dff0f5 25%,#edfafc 50%,#dff0f5 75%); background-size:800px 100%; animation: shimmer 1.5s infinite; border-radius:6px; }
          `}</style>
          {/* Navbar skeleton */}
          <div style={{ height: 64, background: "#fff", borderBottom: "1px solid #c0e8f0", display: "flex", alignItems: "center", padding: "0 5%", gap: 24 }}>
            <div className="sk" style={{ width: 120, height: 32 }} />
            <div style={{ flex: 1 }} />
            {[80,70,90,70,80].map((w,i) => <div key={i} className="sk" style={{ width: w, height: 14 }} />)}
          </div>
          {/* Hero skeleton */}
          <div className="sk" style={{ height: 480, margin: "0", borderRadius: 0 }} />
          {/* Cards skeleton */}
          <div style={{ padding: "40px 5%", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 24, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <div className="sk" style={{ height: 180, borderRadius: 0 }} />
                <div style={{ padding: 16, background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="sk" style={{ height: 16, width: "80%" }} />
                  <div className="sk" style={{ height: 12, width: "60%" }} />
                  <div className="sk" style={{ height: 12, width: "70%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                fontSize: 18, color: "#86cad8", cursor: "pointer", lineHeight: 1 }}>✕</button>
            {/* Power Icon */}
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#e8f9fc",
              border: "2px solid #c0e8f0", display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#0ea5c5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
                <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" /><line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </div>
            <div style={{ fontSize: 10, letterSpacing: "2px", color: "#5090aa", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Developer Profile</div>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, color: "#0d3b66", marginBottom: 6, lineHeight: 1.2 }}>
              Mahfud Febry Styanto
            </h2>
            <div style={{ width: 32, height: 2, background: "#0ea5c5", borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="https://wa.me/6282234651413" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                  background: "#edfafc", borderRadius: 8, textDecoration: "none",
                  transition: "background .2s", border: "1px solid #e0f7fa" }}
                onMouseEnter={e => e.currentTarget.style.background = "#e8f4fd"}
                onMouseLeave={e => e.currentTarget.style.background = "#edfafc"}>
                <span style={{ fontSize: 18 }}>💬</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 10, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>WhatsApp</div>
                  <div style={{ fontSize: 14, color: "#0d3b66", fontWeight: 500 }}>082234651413</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#0ea5c5", fontWeight: 500 }}>Hubungi →</span>
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                background: "#edfafc", borderRadius: 8, border: "1px solid #e0f7fa" }}>
                <span style={{ fontSize: 18 }}>✉️</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 10, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600 }}>Email</div>
                  <div style={{ fontSize: 13, color: "#0d3b66" }}>mahfudfebrys@gmail.com</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#86cad8", marginTop: 20, fontStyle: "italic" }}>
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
          <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            background: "linear-gradient(105deg, #ffffff 0%, #f0fafa 28%, rgba(180,230,238,.55) 52%, rgba(8,145,178,.18) 68%, rgba(10,168,191,.55) 84%, #0aa8bf 100%)",
            backdropFilter: "blur(14px) saturate(1.4)",
            borderBottom: "1px solid rgba(10,168,191,.22)",
            boxShadow: "0 2px 24px rgba(8,145,178,.10), 0 1px 0 rgba(255,255,255,.7) inset",
            padding: "0 5%", overflow: "visible",
            /* Smoke flare overlay via pseudo — dipasang via wrapper div di bawah */ }}>
            {/* ── Smoke & flare layer — persimpangan putih↔teal ── */}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
              {/* Smoke kiri — putih lembut */}
              <div style={{ position: "absolute", left: "22%", top: "-30%", width: 180, height: "170%",
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.52) 0%, rgba(240,250,252,.18) 55%, transparent 100%)",
                filter: "blur(18px)", transform: "rotate(-12deg)" }} />
              {/* Flare titik persimpangan — cyan hangat */}
              <div style={{ position: "absolute", left: "calc(28% - 40px)", top: "50%", transform: "translateY(-50%)",
                width: 90, height: 90,
                background: "radial-gradient(circle, rgba(34,211,238,.55) 0%, rgba(10,168,191,.22) 45%, transparent 80%)",
                filter: "blur(10px)", mixBlendMode: "screen" }} />
              {/* Smoke tengah-kanan — teal asap */}
              <div style={{ position: "absolute", left: "55%", top: "-20%", width: 220, height: "140%",
                background: "radial-gradient(ellipse at 40% 60%, rgba(10,168,191,.20) 0%, rgba(8,145,178,.08) 55%, transparent 100%)",
                filter: "blur(22px)", transform: "rotate(8deg)" }} />
              {/* Flare kecil kanan — highlight */}
              <div style={{ position: "absolute", right: "18%", top: "15%",
                width: 60, height: 60,
                background: "radial-gradient(circle, rgba(255,255,255,.70) 0%, rgba(34,211,238,.25) 60%, transparent 100%)",
                filter: "blur(8px)" }} />
            </div>
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", height: 96, maxWidth: 1200, margin: "0 auto", gap: 20 }}>

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
                  ? <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* Avatar dengan organic border shape */}
                      <div style={{
                        width: 38, height: 38, flexShrink: 0,
                        background: user.photo ? "transparent" : "linear-gradient(135deg,#0891b2,#22d3ee)",
                        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                        border: "2.5px solid rgba(255,255,255,.75)",
                        boxShadow: "0 0 0 3px rgba(8,145,178,.4), 0 4px 14px rgba(0,0,0,.22)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden", transition: "border-radius .4s ease, box-shadow .3s"
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderRadius = "50%"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(34,211,238,.6), 0 6px 20px rgba(0,0,0,.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderRadius = "30% 70% 70% 30% / 30% 30% 70% 70%"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(8,145,178,.4), 0 4px 14px rgba(0,0,0,.22)"; }}>
                        {user.photo
                          ? <img loading="lazy" src={user.photo} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ color: "#fff", fontWeight: 800, fontSize: "1rem" }}>{(user.name || user.username || "?")[0].toUpperCase()}</span>
                        }
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 }}>
                        <span style={{ fontSize: "0.8125rem", color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
                          {user.name || user.username}
                        </span>
                        {/* CP button dengan border shape asimetris */}
                        <button onClick={() => setShowAdmin(true)}
                          style={{
                            fontSize: "0.6rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 800,
                            color: "#fff",
                            background: "linear-gradient(130deg,rgba(8,145,178,.65),rgba(10,168,191,.45))",
                            border: "1px solid rgba(255,255,255,.6)",
                            cursor: "pointer", lineHeight: 1.3,
                            padding: "2px 10px",
                            borderRadius: "14px 4px 14px 4px",
                            boxShadow: "0 2px 8px rgba(0,0,0,.18)",
                            transition: "all .25s"
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.28)"; e.currentTarget.style.borderRadius = "4px 14px 4px 14px"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,.28)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(130deg,rgba(8,145,178,.65),rgba(10,168,191,.45))"; e.currentTarget.style.borderRadius = "14px 4px 14px 4px"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.18)"; }}>
                          ⚙ Control Panel
                        </button>
                      </div>
                    </div>
                  : <button onClick={() => setShowLogin(true)}
                    className="login-collapse-btn"
                    style={{
                      display: "flex", alignItems: "center", gap: 0, overflow: "hidden",
                      width: 36, border: "1.5px solid rgba(255,255,255,.7)", borderRadius: 6,
                      fontSize: "0.75rem", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700,
                      background: "transparent", color: "#fff", padding: "7px 9px",
                      cursor: "pointer", transition: "width .28s cubic-bezier(.4,0,.2,1), padding .28s, background .18s, color .18s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => { const b = e.currentTarget; b.style.width = "90px"; b.style.paddingRight = "14px"; b.style.gap = "7px"; b.style.background = "rgba(255,255,255,.25)"; b.style.color = "#fff"; b.querySelector(".lcb-text").style.opacity = "1"; b.querySelector(".lcb-text").style.maxWidth = "80px"; }}
                    onMouseLeave={e => { const b = e.currentTarget; b.style.width = "36px"; b.style.paddingRight = "9px"; b.style.gap = "0"; b.style.background = "transparent"; b.style.color = "#fff"; b.querySelector(".lcb-text").style.opacity = "0"; b.querySelector(".lcb-text").style.maxWidth = "0"; }}>
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
                style={{ 
                  fontSize: 22, 
                  color: "#fff", 
                  background: "rgba(255,255,255,.18)",
                  border: "1.5px solid rgba(255,255,255,.35)",
                  borderRadius: 8,
                  width: 40, height: 40,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  transition: "background .2s"
                }} 
                aria-label="Menu">
                {mobileMenu ? "✕" : "☰"}
              </button>
            </div>
            {mobileMenu && (
              <div className="mobile-dropdown" style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                background: "linear-gradient(160deg, #063d5c 0%, #0875a8 70%, #0aa8bf 100%)",
                borderTop: "1px solid rgba(56,197,216,.3)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)",
                display: "flex", flexDirection: "column", gap: 6,
                padding: "16px 5% 24px", zIndex: 9999,
                animation: "fadeIn .25s ease",
                maxHeight: "calc(100vh - 96px)",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch"
              }}>
                {/* Dot grid overlay */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none", borderRadius: "0 0 8px 8px", zIndex: 0 }} />
                {navItems.map(item => (
                  <button key={item.key} onClick={() => { navigateTo(item.key); setMobileMenu(false); }}
                    className="mobile-nav-item"
                    style={{
                      fontSize: "1rem",
                      color: page === item.key ? "#fff" : "rgba(255,255,255,.82)",
                      fontWeight: page === item.key ? 700 : 500,
                      border: "none",
                      background: page === item.key 
                        ? "rgba(56,197,216,.25)" 
                        : "rgba(255,255,255,.06)",
                      backdropFilter: "blur(4px)",
                      textAlign: "left", padding: "13px 18px", borderRadius: 10, width: "100%",
                      borderLeft: page === item.key ? "3px solid #38c5d8" : "3px solid rgba(255,255,255,.12)",
                      transition: "all .15s", cursor: "pointer",
                      position: "relative", zIndex: 1
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(56,197,216,.18)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderLeft = "3px solid #38c5d8"; }}
                    onMouseLeave={e => { 
                      e.currentTarget.style.background = page === item.key ? "rgba(56,197,216,.25)" : "rgba(255,255,255,.06)"; 
                      e.currentTarget.style.color = page === item.key ? "#fff" : "rgba(255,255,255,.82)"; 
                      e.currentTarget.style.borderLeft = page === item.key ? "3px solid #38c5d8" : "3px solid rgba(255,255,255,.12)";
                    }}>
                    {item.label}
                  </button>
                ))}
                {user && (
                  <div style={{ padding: "12px 4px 4px", borderTop: "1px solid rgba(56,197,216,.2)", marginTop: 8, position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: ".8125rem", color: "rgba(255,255,255,.6)", marginBottom: 10, padding: "0 12px" }}>
                      Login sebagai <strong style={{ color: "#38c5d8" }}>{user.name || user.username}</strong>
                    </div>
                    <button onClick={() => { setShowAdmin(true); setMobileMenu(false); }}
                      style={{ fontSize: ".875rem", color: "#fff", background: "linear-gradient(135deg,#0891b2,#22d3ee)", border: "none", borderRadius: 10, padding: "11px 16px", fontWeight: 700, width: "100%", marginBottom: 8 }}>
                      🛠 Admin Panel
                    </button>
                    <button onClick={() => { logout(); setMobileMenu(false); }}
                      style={{ fontSize: ".875rem", color: "rgba(255,100,100,.9)", background: "rgba(231,76,60,.12)", border: "1px solid rgba(231,76,60,.3)", borderRadius: 10, padding: "10px 16px", width: "100%" }}>
                      Logout
                    </button>
                  </div>
                )}
                {!user && (
                  <button onClick={() => { setShowLogin(true); setMobileMenu(false); }}
                    style={{ padding: "13px 16px", border: "none", background: "linear-gradient(135deg,#0891b2,#22d3ee)", borderRadius: 10, fontSize: "1rem", color: "#fff", textAlign: "center", fontWeight: 700, marginTop: 4, position: "relative", zIndex: 1 }}>
                    🔑 Login
                  </button>
                )}
              </div>
            )}
          </nav>

          {/* Spacer to push content below fixed navbar */}
          <div style={{ height: "clamp(60px,10vw,96px)" }} />

          {/* ── NAVIGASI MAJU / MUNDUR ── */}
          {(() => {
            const isMobileNav = window.innerWidth <= 768;
            const canBack = historyIdx > 0;
            const canFwd = historyIdx < historyStack.length - 1;
            const PAGE_LABELS = { home: "Beranda", about: "Tentang Kami", services: "Layanan", destinations: "Destinasi", news: "Berita", shop: "Toko" };
            const currentLabel = PAGE_LABELS[historyStack[historyIdx]] || historyStack[historyIdx] || "Halaman";
            if (isMobileNav) {
              /* ── MOBILE: bold rectangle pill di kiri bawah ── */
              return (
                <div style={{
                  position: "fixed", bottom: 20, left: 12, zIndex: 9989,
                  display: "flex", alignItems: "center",
                  background: "#0d3b66",
                  borderRadius: 10, overflow: "hidden",
                  boxShadow: "0 4px 18px rgba(13,59,102,.45), 0 2px 6px rgba(0,0,0,.2)",
                  border: "2px solid rgba(255,255,255,.15)",
                }}>
                  {/* Tombol Mundur */}
                  <button onClick={spaBack} disabled={!canBack} aria-label="Halaman sebelumnya"
                    style={{
                      width: 52, height: 48, border: "none",
                      background: canBack ? "transparent" : "rgba(255,255,255,.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: canBack ? "pointer" : "default",
                      opacity: canBack ? 1 : 0.35,
                      WebkitTapHighlightColor: "transparent",
                      transition: "background .15s",
                    }}
                    onPointerDown={e => { if (canBack) e.currentTarget.style.background = "rgba(255,255,255,.15)"; }}
                    onPointerUp={e => { e.currentTarget.style.background = "transparent"; }}
                    onPointerLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  {/* Label halaman aktif */}
                  <div style={{
                    padding: "0 10px", fontSize: "0.6875rem", fontWeight: 800,
                    color: "#fff", letterSpacing: ".04em", whiteSpace: "nowrap",
                    maxWidth: 88, overflow: "hidden", textOverflow: "ellipsis",
                    fontFamily: "'DM Sans',sans-serif", lineHeight: 1,
                    borderLeft: "1px solid rgba(255,255,255,.2)", borderRight: "1px solid rgba(255,255,255,.2)",
                    height: 48, display: "flex", alignItems: "center",
                    textTransform: "uppercase", letterSpacing: ".05em",
                  }}>
                    {currentLabel}
                  </div>
                  {/* Tombol Maju */}
                  <button onClick={spaForward} disabled={!canFwd} aria-label="Halaman berikutnya"
                    style={{
                      width: 52, height: 48, border: "none",
                      background: canFwd ? "transparent" : "rgba(255,255,255,.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: canFwd ? "pointer" : "default",
                      opacity: canFwd ? 1 : 0.35,
                      WebkitTapHighlightColor: "transparent",
                      transition: "background .15s",
                    }}
                    onPointerDown={e => { if (canFwd) e.currentTarget.style.background = "rgba(255,255,255,.15)"; }}
                    onPointerUp={e => { e.currentTarget.style.background = "transparent"; }}
                    onPointerLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              );
            }
            /* ── DESKTOP: dua tombol persegi panjang bold vertikal di kanan ── */
            return (
              <div style={{ position: "fixed", bottom: 100, right: 20, zIndex: 9989, display: "flex", flexDirection: "column", gap: 6 }}>
                <button onClick={spaForward} disabled={!canFwd} title="Maju"
                  style={{
                    width: 52, height: 44, borderRadius: 8, border: "none",
                    background: canFwd ? "linear-gradient(135deg,#0d3b66,#0891b2)" : "rgba(200,210,220,.55)",
                    boxShadow: canFwd ? "0 4px 14px rgba(13,59,102,.40)" : "0 2px 6px rgba(0,0,0,.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: canFwd ? "pointer" : "default", opacity: canFwd ? 1 : 0.45,
                    transition: "transform .18s, box-shadow .18s, opacity .18s",
                  }}
                  onMouseEnter={e => { if (canFwd) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(13,59,102,.5)"; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = canFwd ? "0 4px 14px rgba(13,59,102,.40)" : "0 2px 6px rgba(0,0,0,.12)"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <button onClick={spaBack} disabled={!canBack} title="Mundur"
                  style={{
                    width: 52, height: 44, borderRadius: 8, border: "none",
                    background: canBack ? "linear-gradient(135deg,#0d3b66,#0891b2)" : "rgba(200,210,220,.55)",
                    boxShadow: canBack ? "0 4px 14px rgba(13,59,102,.40)" : "0 2px 6px rgba(0,0,0,.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: canBack ? "pointer" : "default", opacity: canBack ? 1 : 0.45,
                    transition: "transform .18s, box-shadow .18s, opacity .18s",
                  }}
                  onMouseEnter={e => { if (canBack) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(13,59,102,.5)"; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = canBack ? "0 4px 14px rgba(13,59,102,.40)" : "0 2px 6px rgba(0,0,0,.12)"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              </div>
            );
          })()}

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
                    {/* Light decorative blobs for white bg */}
                    <div className="hero-intro-blob1" style={{ background: "radial-gradient(circle,rgba(8,145,178,.08) 0%,rgba(8,145,178,0) 70%)" }} />
                    <div className="hero-intro-blob2" style={{ background: "radial-gradient(circle,rgba(56,197,216,.07) 0%,rgba(56,197,216,0) 70%)" }} />
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "15%", right: "5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(8,145,178,.06) 0%, transparent 65%)", filter: "blur(20px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "35%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,197,.05) 0%, transparent 65%)", filter: "blur(24px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(8,145,178,.04) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      </div>
      <div className="hero-intro-inner">
                      {/* KIRI: Slideshow Destinasi */}
                      <div className="hero-intro-img" style={{ overflow: "hidden", position: "relative" }}>
                        <HomeIntroSlideshow data={data} />
                        {/* Badge */}
                        <div style={{ position: "absolute", top: 18, left: 18, background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", fontSize: ".6rem", letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 800, padding: "5px 12px", borderRadius: 2, zIndex: 2 }}>
                          Arutala Organizer
                        </div>
                        {/* Shadow overlay bawah */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(to top, rgba(6,61,92,.45), rgba(6,61,92,0))", pointerEvents: "none", zIndex: 1 }} />
                      </div>

                      {/* KANAN: Teks */}
                      <div className="hero-intro-txt">
                        {/* Deco line */}
                        <div className="hero-intro-deco-line" />
                        <div className="hero-intro-eyebrow">
                          <div className="line" />
                          <span style={{ fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#0891b2", fontWeight: 700 }}>
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
                              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 900, color: "#0891b2", lineHeight: 1 }}>{s.num}</div>
                              <div style={{ fontSize: ".6875rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#4a7f98", fontWeight: 600, marginTop: 3 }}>{s.lbl}</div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                          <button onClick={() => navigateTo("services")}
                            style={{ padding: "12px 26px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 6, fontSize: ".8125rem", fontWeight: 700, cursor: "pointer", letterSpacing: ".04em", transition: "opacity .2s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                            Layanan Kami →
                          </button>
                          <button onClick={() => navigateTo("about")}
                            style={{ padding: "12px 24px", background: "#fff", color: "#0d3b66", border: "1.5px solid #b0dce8", borderRadius: 6, fontSize: ".8125rem", fontWeight: 600, cursor: "pointer", transition: "all .2s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#edfafc"; e.currentTarget.style.borderColor = "#0891b2"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#b0dce8"; }}>
                            Tentang Kami
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ── ADVENTURE — TEKS KIRI + PUZZLE IMG KANAN ── */}
                  <AdvSection data={data} navigateTo={navigateTo} />

                  {/* Gallery */}
                  <section className="section-md" style={{ background: "#ffffff", position: "relative", overflow: "visible", borderBottom: "1px solid #e8f5f8" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
                      <div className="label-xs" style={{ color: "#0891b2", marginBottom: 14 }}>INTRODUCING</div>
                      <h2 className="display" style={{ fontSize: "clamp(1.75rem,4.5vw,3rem)", fontWeight: 900, color: "#0d3b66", marginBottom: 16 }}>
                        {data.content.newAdvTitle}
                      </h2>
                      <p style={{ fontSize: "0.9375rem", color: "#4a7f98", lineHeight: 1.8, maxWidth: 440, margin: "0 auto 40px", whiteSpace: "pre-line" }}>{data.content.newAdvSub}</p>

                      {/* Gallery Ticker — scroll kiri di desktop, grid di mobile */}
                      {(() => {
                        const allSecs = ["news","shop","destinations"];
                        const publishedPosts = allSecs.flatMap(sec => (data.posts?.[sec] || []).filter(p => p.status === "published" && p.coverImage));
                        const galItems = publishedPosts.length > 0 ? publishedPosts.slice(0, 6) : data.images.gal.map(src => ({ coverImage: src, _static: true }));
                        const doubled = [...galItems, ...galItems];
                        return (
                          <div className="gal-ticker">
                            <div className="gal-ticker-track">
                              {doubled.map((item, i) => (
                                <div key={i} className="gal-ticker-item hover-lift"
                                  onClick={() => { if (!item._static) { setReadPost(item); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
                                  style={{ cursor: item._static ? "default" : "pointer" }}>
                                  <img loading="lazy" src={item.coverImage || item} alt={item.title || ""} />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button onClick={() => setExploreOpen(v => !v)} className="btn-outline-solid"
                          style={{ padding: "12px 30px", border: "1.5px solid #0d3b66", background: exploreOpen ? "#0d3b66" : "#fff",
                          fontSize: "0.75rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700,
                          color: exploreOpen ? "#fff" : "#0d3b66", transition: "all .2s", display: "flex", alignItems: "center", gap: 8 }}
                          onMouseEnter={e => { if (!exploreOpen) { e.currentTarget.style.background = "#0d3b66"; e.currentTarget.style.color = "#fff"; } }}
                          onMouseLeave={e => { if (!exploreOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0d3b66"; } }}>
                          Explore All <span style={{ fontSize: "0.6rem", transition: "transform .2s", display: "inline-block", transform: exploreOpen ? "rotate(180deg)" : "none" }}>▼</span>
                        </button>
                        {exploreOpen && (
                          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#fff",
                            border: "1.5px solid #0d3b66", borderRadius: 4, minWidth: 200, zIndex: 200,
                            boxShadow: "0 8px 32px rgba(13,59,102,.15)", overflow: "hidden" }}>
                            {[
                              { label: "🎉 Event Plan", key: "destinations" },
                              { label: "✈️ Traveling", key: "shop" },
                              { label: "💍 Wedding Organizer", key: "news" },
                            ].map(item => (
                              <button key={item.key} onClick={() => { navigateTo(item.key); setExploreOpen(false); }}
                                style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 20px",
                                  fontSize: "0.875rem", fontWeight: 500, color: "#0d3b66", background: "none",
                                  border: "none", borderBottom: "1px solid #edfafc", cursor: "pointer", transition: "background .15s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#edfafc"}
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
                  <section className="section-md" style={{ background: "#ffffff", borderBottom: "1px solid #e8f5f8" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="grid-2">
                      <div className="book-img-grid">
                        <div className="img-zoom" style={{ gridColumn: "span 2", borderRadius: 4, overflow: "hidden" }}>
                          <img loading="lazy" src={data.images.adv[1]} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} />
                        </div>
                        <div className="img-zoom" style={{ borderRadius: 4, overflow: "hidden" }}>
                          <img loading="lazy" src={data.images.adv[0]} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} />
                        </div>
                        <div className="img-zoom" style={{ borderRadius: 4, overflow: "hidden" }}>
                          <img loading="lazy" src={data.images.gal[2]} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} />
                        </div>
                      </div>
                      <div>
                        <h2 className="display" style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, lineHeight: 1.1, color: "#0d3b66", marginBottom: 18 }}>
                          {data.content.bookTitle}
                        </h2>
                        <p style={{ fontSize: "0.9375rem", color: "#4a7f98", lineHeight: 1.85, marginBottom: 28, maxWidth: 340, whiteSpace: "pre-line" }}>{data.content.bookSub}</p>
                        <a href={content.waLink || "https://wa.me/6285745571442"} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-block", padding: "12px 30px", border: "1.5px solid #0d3b66", background: "#0d3b66",
                          fontSize: "0.75rem", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 700, color: "#fff", transition: "all .2s", textDecoration: "none", borderRadius: 4 }}
                          onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(130deg,#063d5c,#0891b2)"; e.currentTarget.style.borderColor = "#0891b2"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#0d3b66"; e.currentTarget.style.borderColor = "#0d3b66"; }}>
                          Book Now
                        </a>
                      </div>
                    </div>
                  </section>

                  {/* Latest News Preview */}
                  <section className="section-md" style={{ background: "#fff" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36 }}>
                        <h2 className="display" style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 900, color: "#0d3b66" }}>Latest News</h2>
                        <button onClick={() => navigateTo("news")} style={{ fontSize: "0.875rem", color: "#0891b2", border: "none", background: "none", fontWeight: 600 }}>
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
                        <div className="label-xs" style={{ color: "#22d3ee", marginBottom: 14 }}>✦ Jelajahi Dunia</div>
                        <h2 className="display" style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)", fontWeight: 900, color: "#fff", marginBottom: 10, lineHeight: 1.1 }}>
                          {data.content.newsletterTitle}
                        </h2>
                        <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,.72)", marginBottom: 28, lineHeight: 1.75 }}>
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
                            style={{ padding: "12px 20px", background: "#0891b2", color: "#fff", border: "none",
                              fontSize: "0.75rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700,
                              borderRadius: "0 4px 4px 0", cursor: "pointer", transition: "background .2s", whiteSpace: "nowrap" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#0ea5c5"}
                            onMouseLeave={e => e.currentTarget.style.background = "#0891b2"}>
                            🔍 Jelajahi
                          </button>
                        </div>
                        {mapQuery && mapQuery.trim() !== mapLocation && (
                          <p style={{ fontSize: "0.8125rem", color: "rgba(91,196,224,.8)", marginTop: 10 }}>
                            ⌛ Memuat peta untuk <strong style={{ color: "#22d3ee" }}>{mapQuery}</strong>…
                          </p>
                        )}
                        {mapQuery.trim() && mapQuery.trim() === mapLocation && (
                          <p style={{ fontSize: "0.8125rem", color: "rgba(91,196,224,.8)", marginTop: 10 }}>
                            📍 Menampilkan: <strong style={{ color: "#22d3ee" }}>{mapLocation}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Reviews Slideshow */}
                  {(data.reviews || []).filter(r => r.approved).length > 0 && (
                    <ReviewSlideshow reviews={(data.reviews || []).filter(r => r.approved)} />
                  )}

                  {/* Contact */}
                  <section className="section-md" style={{ background: "#fff" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="contact-grid">
                      <div>
                        <h2 className="display" style={{ fontSize: "clamp(1.5rem,3.5vw,2.25rem)", fontWeight: 900, color: "#0d3b66", marginBottom: 18 }}>Contact Us</h2>
                        <p style={{ fontSize: "0.9375rem", color: "#1a5a78", lineHeight: 1.85, marginBottom: 20, whiteSpace: "pre-line" }}>{data.content.contactText || data.content.aboutContactSub}</p>
                        <p style={{ fontSize: "0.9375rem", color: "#1a4a72", marginBottom: 8, fontWeight: 500 }}>✉ {data.content.email}</p>
                        <p style={{ fontSize: "0.9375rem", color: "#1a4a72", fontWeight: 500 }}>📞 {data.content.phone}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {["name", "email"].map(f => (
                          <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                            value={contact[f]} onChange={e => setContact(p => ({ ...p, [f]: e.target.value }))}
                            aria-label={f.charAt(0).toUpperCase() + f.slice(1)}
                            style={{ padding: "12px 14px", border: "1.5px solid #b0dce8", fontSize: "0.9375rem", outline: "none", borderRadius: 4 }} />
                        ))}
                        <textarea placeholder="Message" rows={4} value={contact.message}
                          onChange={e => setContact(p => ({ ...p, message: e.target.value }))}
                          aria-label="Message"
                          style={{ padding: "12px 14px", border: "1.5px solid #b0dce8", fontSize: "0.9375rem", outline: "none", borderRadius: 4, resize: "vertical", lineHeight: 1.65 }} />
                        <button onClick={submitMsg} style={{ padding: "12px 26px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff",
                          fontSize: "0.75rem", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700,
                          border: "none", borderRadius: 4, alignSelf: "flex-start", transition: "background .2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#0891b2"}
                          onMouseLeave={e => e.currentTarget.style.background = "#0d3b66"}>
                          Send Message
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Footer */}
                  <footer style={{ background: "#f5fdff", borderTop: "1px solid #c0e8f0", padding: "56px 5% 32px" }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                      <div className="footer-grid" style={{ marginBottom: 40 }}>
                        <div>
                          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 14, color: "#0d3b66", letterSpacing: ".06em", textTransform: "uppercase" }}>About Us</h3>
                          <p style={{ fontSize: "0.875rem", color: "#1a5a78", lineHeight: 1.8, marginBottom: 14, whiteSpace: "pre-line" }}>{data.content.aboutText}</p>
                          <p style={{ fontSize: "0.875rem", color: "#1a5a78" }}>email: <a href={`mailto:${data.content.email}`} style={{ color: "#0891b2", fontWeight: 500 }}>{data.content.email}</a></p>
                          <p style={{ fontSize: "0.875rem", color: "#1a5a78", marginTop: 4 }}>phone: {data.content.phone}</p>
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 14, color: "#0d3b66", letterSpacing: ".06em", textTransform: "uppercase" }}>Our Gallery</h3>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                            {data.images.gal.slice(0, 6).map((src, i) => (
                              <div key={i} style={{ borderRadius: 4, overflow: "hidden" }}>
                                <img loading="lazy" src={src} alt="" style={{ width: "100%", height: 56, objectFit: "cover" }} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 14, color: "#0d3b66", letterSpacing: ".06em", textTransform: "uppercase" }}>Navigation</h3>
                          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                            {navItems.map(n => (
                              <li key={n.key}>
                                <button onClick={() => navigateTo(n.key)} style={{ fontSize: "0.875rem", color: "#0891b2", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontWeight: 500 }}>{n.label}</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div style={{ borderTop: "1px solid #c0e8f0", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <button onClick={() => setShowDevProfile(true)} title="Developer Info"
                            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, color: "#5090aa", fontSize: "0.75rem", fontWeight: 500, transition: "color .2s" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#0891b2"}
                            onMouseLeave={e => e.currentTarget.style.color = "#5090aa"}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                              <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" /><line x1="12" y1="2" x2="12" y2="12" />
                            </svg>
                            Power Developer
                          </button>
                          <p style={{ fontSize: "0.8125rem", color: "#5090aa" }}>© 2026 Arutala All Rights Reserved</p>
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
              style={{ position: "absolute", top: 16, right: 20, fontSize: 20, color: "#5090aa" }}>×</button>
            <h2 className="display" style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0d3b66", marginBottom: 6 }}>Welcome Back</h2>
            <p style={{ fontSize: "0.875rem", color: "#4a7f98", marginBottom: 28, letterSpacing: ".02em" }}>Sign in to your account</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input placeholder="Username" value={loginForm.username}
                onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && login()}
                style={{ padding: "12px 14px", border: "1px solid #b0dce8", borderRadius: 4, fontSize: 14, outline: "none" }} />
              <input placeholder="Password" type="password" value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && login()}
                style={{ padding: "12px 14px", border: "1px solid #b0dce8", borderRadius: 4, fontSize: 14, outline: "none" }} />
              {loginErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{loginErr}</p>}
              <button onClick={login} style={{ padding: "13px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff",
                border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>
                Sign In
              </button>
              <button onClick={() => { setShowLogin(false); setForgotStep("input_user"); }}
                style={{ background: "none", border: "none", color: "#0ea5c5", fontSize: 13, cursor: "pointer", textAlign: "center", padding: "4px 0" }}>
                Lupa sandi? Reset via OTP
              </button>
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: "#e8eef4" }} />
                <span style={{ fontSize: 11, color: "#86cad8", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>atau masuk dengan</span>
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
                fontSize: 20, color: "#86cad8", cursor: "pointer", lineHeight: 1 }}>✕</button>

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
            <div style={{ display: "inline-block", background: "#e8f9fc", border: "1px solid #86cad8",
              color: "#0891b2", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: ".12em",
              textTransform: "uppercase", padding: "5px 16px", borderRadius: 20, marginBottom: 18 }}>
              🚧 Coming Soon
            </div>

            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.625rem", fontWeight: 900,
              color: "#0d3b66", marginBottom: 12, lineHeight: 1.15 }}>
              Login dengan {comingSoon === "google" ? "Google" : "Apple"}
            </h2>

            <p style={{ fontSize: "0.9375rem", color: "#4a7f98", lineHeight: 1.75, marginBottom: 28, maxWidth: 280, margin: "0 auto 28px" }}>
              Fitur ini sedang dalam pengembangan dan akan segera hadir. Gunakan login manual untuk saat ini.
            </p>

            {/* Progress bar animation */}
            <div style={{ height: 4, background: "#f0f4f8", borderRadius: 10, overflow: "hidden", marginBottom: 28 }}>
              <style>{`@keyframes csProgress{0%{width:0%}100%{width:75%}}`}</style>
              <div style={{ height: "100%", background: "linear-gradient(to right,#0891b2,#22d3ee)",
                borderRadius: 10, animation: "csProgress 2s ease-out forwards" }} />
            </div>

            <button onClick={() => setComingSoon(null)}
              style={{ width: "100%", padding: "12px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff",
                border: "none", borderRadius: 10, fontSize: "0.875rem", fontWeight: 700,
                letterSpacing: ".04em", cursor: "pointer", transition: "background .2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#0891b2"}
              onMouseLeave={e => e.currentTarget.style.background = "#0d3b66"}>
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
              style={{ position: "absolute", top: 16, right: 20, fontSize: 20, color: "#5090aa" }}>×</button>

            {/* Step indicator */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {[1,2,3,4].map(n => {
                const stepMap = { input_user:1, input_email:2, input_otp:3, input_newpass:4 };
                const cur = stepMap[forgotStep] || 1;
                return (
                  <div key={n} style={{ flex: 1, height: 3, borderRadius: 2,
                    background: n <= cur ? "#0891b2" : "#c0e8f0", transition: "background .3s" }} />
                );
              })}
            </div>

            {/* STEP 1 — Username */}
            {forgotStep === "input_user" && (
              <>
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0d3b66", marginBottom: 6 }}>Lupa Sandi</h2>
                <p style={{ fontSize: "0.875rem", color: "#4a7f98", marginBottom: 24 }}>Masukkan username akun Anda.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Username" value={forgotUser}
                    onChange={e => { setForgotUser(e.target.value); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep1()}
                    style={{ padding: "12px 14px", border: "1px solid #b0dce8", borderRadius: 4, fontSize: 14, outline: "none" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep1}
                    style={{ padding: "13px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>
                    Lanjut
                  </button>
                  <button onClick={() => { closeForgot(); setShowLogin(true); }}
                    style={{ background: "none", border: "none", color: "#4a7f98", fontSize: 12, cursor: "pointer" }}>← Kembali ke Login</button>
                </div>
              </>
            )}

            {/* STEP 2 — Verifikasi Email */}
            {forgotStep === "input_email" && (
              <>
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0d3b66", marginBottom: 6 }}>Verifikasi Email</h2>
                <p style={{ fontSize: "0.875rem", color: "#4a7f98", marginBottom: 24 }}>
                  Masukkan email yang terdaftar untuk akun <strong style={{ color: "#0d3b66" }}>{forgotUser}</strong>.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Email terdaftar" type="email" value={forgotEmail}
                    onChange={e => { setForgotEmail(e.target.value); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep2()}
                    style={{ padding: "12px 14px", border: "1px solid #b0dce8", borderRadius: 4, fontSize: 14, outline: "none" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep2} disabled={forgotOTP.sending}
                    style={{ padding: "13px", background: forgotOTP.sending ? "#5090aa" : "#0d3b66", color: "#fff",
                      border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500, cursor: forgotOTP.sending ? "not-allowed" : "pointer" }}>
                    {forgotOTP.sending ? "⏳ Mengirim OTP..." : "Kirim OTP"}
                  </button>
                  <button onClick={() => { setForgotStep("input_user"); setForgotErr(""); }}
                    style={{ background: "none", border: "none", color: "#4a7f98", fontSize: 12, cursor: "pointer" }}>← Kembali</button>
                </div>
              </>
            )}

            {/* STEP 3 — Input OTP */}
            {forgotStep === "input_otp" && (
              <>
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0d3b66", marginBottom: 6 }}>Masukkan Kode OTP</h2>
                <p style={{ fontSize: "0.875rem", color: "#4a7f98", marginBottom: 8 }}>
                  Kode 6 digit telah dikirim ke <strong style={{ color: "#0d3b66" }}>{forgotEmail}</strong>.
                </p>
                <p style={{ fontSize: "0.8125rem", color: "#f39c12", marginBottom: 20 }}>⏱ Berlaku 15 menit.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Kode OTP 6 digit" value={forgotOTP.input} maxLength={6}
                    onChange={e => { setForgotOTP(p => ({ ...p, input: e.target.value.replace(/\D/g, "") })); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep3()}
                    style={{ padding: "12px 14px", border: "1.5px solid #b0dce8", borderRadius: 4, fontSize: 20,
                      letterSpacing: "8px", textAlign: "center", outline: "none", fontWeight: 700, color: "#0d3b66" }} />
                  {forgotErr && <p style={{ fontSize: 12, color: "#e74c3c" }}>{forgotErr}</p>}
                  <button onClick={forgotStep3}
                    style={{ padding: "13px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>
                    Verifikasi OTP
                  </button>
                  <button onClick={() => { setForgotStep("input_email"); setForgotOTP({ code:"",input:"",expiry:0,sending:false }); setForgotErr(""); }}
                    style={{ background: "none", border: "none", color: "#0ea5c5", fontSize: 12, cursor: "pointer" }}>
                    ↺ Kirim ulang OTP
                  </button>
                </div>
              </>
            )}

            {/* STEP 4 — Password Baru */}
            {forgotStep === "input_newpass" && (
              <>
                <h2 className="display" style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0d3b66", marginBottom: 6 }}>Password Baru</h2>
                <p style={{ fontSize: "0.875rem", color: "#4a7f98", marginBottom: 24 }}>
                  OTP terverifikasi ✅. Buat password baru untuk <strong style={{ color: "#0d3b66" }}>{forgotUser}</strong>.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input placeholder="Password baru (min. 6 karakter)" type="password" value={forgotNewPass.val}
                    onChange={e => { setForgotNewPass(p => ({ ...p, val: e.target.value })); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep4()}
                    style={{ padding: "12px 14px", border: "1px solid #b0dce8", borderRadius: 4, fontSize: 14, outline: "none" }} />
                  <input placeholder="Ulangi password baru" type="password" value={forgotNewPass.confirm}
                    onChange={e => { setForgotNewPass(p => ({ ...p, confirm: e.target.value })); setForgotErr(""); }}
                    onKeyDown={e => e.key === "Enter" && forgotStep4()}
                    style={{ padding: "12px 14px", border: "1px solid #b0dce8", borderRadius: 4, fontSize: 14, outline: "none" }} />
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
        <div style={{ position: "fixed", inset: 0, zIndex: 1500, background: "#edfafc", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Admin Nav */}
          <div style={{ background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58, flexShrink: 0 }}>
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
                  borderLeft: adminTab === tab.id ? "3px solid #0ea5c5" : "3px solid transparent",
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
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 700, fontFamily: "'Playfair Display',serif", border: "3px solid #c0e8f0", overflow: "hidden", cursor: "pointer" }}
                      onClick={() => setAdminTab("profile")} title="Edit Profil">
                      {user.photo
                        ? <img loading="lazy" src={user.photo} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : (user.name || user.username).charAt(0).toUpperCase()}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: "0.75rem", color: "#4a7f98", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 4 }}>
                        {ROLES[user.role]?.label}
                      </div>
                      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.75rem", fontWeight: 900, color: "#0d3b66", marginBottom: 8, lineHeight: 1.1 }}>
                        {user.name || user.username}
                      </h2>
                      <div style={{ display: "flex", gap: 20, marginBottom: 14, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.8125rem", color: "#4a7f98", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>📝</span> Published: <strong style={{ color: "#0d3b66" }}>{publishedCount}</strong>
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "#4a7f98", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>👁</span> Drafts: <strong style={{ color: "#0d3b66" }}>{draftCount}</strong>
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "#4a7f98", display: "flex", alignItems: "center", gap: 5 }}>
                          <span>✉</span> Msgs: <strong style={{ color: "#0d3b66" }}>{data.messages.length}</strong>
                        </span>
                      </div>
                      <p style={{ fontSize: "0.875rem", color: "#1a5a78", fontStyle: "italic", lineHeight: 1.7, maxWidth: 500, borderLeft: "3px solid #c0e8f0", paddingLeft: 14 }}>
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
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", borderRadius: 24, fontSize: "0.8125rem", fontWeight: 700, border: "none", cursor: "pointer", letterSpacing: ".03em", transition: "background .2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#0891b2"}
                          onMouseLeave={e => e.currentTarget.style.background = "#0d3b66"}>
                          ✏ Buat Artikel
                        </button>
                      )}
                      <button onClick={() => setAdminTab("messages")}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "transparent", color: "#0d3b66", borderRadius: 24, fontSize: "0.8125rem", fontWeight: 700, border: "2px solid #c0e8f0", cursor: "pointer", letterSpacing: ".03em", transition: "all .2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#0d3b66"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#c0e8f0"; }}>
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
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66", marginBottom: 28 }}>Profil Saya</h1>
                  <div className="profile-grid">
                    {/* Photo Card */}
                    <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", textAlign: "center" }}>
                      <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff", fontWeight: 700, overflow: "hidden", border: "3px solid #c0e8f0" }}>
                        {user.photo
                          ? <img loading="lazy" src={user.photo} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : (user.name || user.username).charAt(0).toUpperCase()}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0d3b66", marginBottom: 2 }}>{user.name || user.username}</p>
                      <p style={{ fontSize: 11, color: "#5090aa", marginBottom: 20, background: "#edfafc", display: "inline-block", padding: "3px 10px", borderRadius: 10 }}>{ROLES[user.role]?.label}</p>
                      {/* Upload Photo */}
                      <div style={{ marginTop: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Upload Foto Profil</label>
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
                        }} style={{ fontSize: 11, border: "1.5px dashed #0ea5c5", borderRadius: 6, padding: "6px", background: "#e8f9fc", color: "#0ea5c5", width: "100%", boxSizing: "border-box" }} />
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
                      <div style={{ background: "#fff", borderRadius: 12, padding: "28px 28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", borderTop: "4px solid #0ea5c5" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0d3b66", marginBottom: 20 }}>✏ Edit Data Diri</h3>
                        {[
                          { label: "Nama Lengkap", key: "name", placeholder: "Masukkan nama lengkap", type: "text" },
                          { label: "Nomor HP / WhatsApp", key: "phone", placeholder: "08xxxxxxxxxx", type: "tel" },
                          { label: "Email", key: "email", placeholder: "nama@email.com", type: "email" },
                        ].map(f => (
                          <div key={f.key} style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
                            <input type={f.type} placeholder={f.placeholder}
                              value={profileEdit[f.key] !== undefined && profileEditMode ? profileEdit[f.key] : (user[f.key] || "")}
                              onChange={e => setProfileEdit(p => ({ ...p, [f.key]: e.target.value }))}
                              onFocus={() => { if (!profileEditMode) { setProfileEditMode(true); setProfileEdit({ name: user.name || "", phone: user.phone || "", email: user.email || "", desc: user.desc || "", newPass: "", confirmPass: "" }); } }}
                              style={{ width: "100%", padding: "10px 12px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                          </div>
                        ))}
                        <div style={{ marginBottom: 20 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Deskripsi Diri</label>
                          <textarea placeholder="Tuliskan deskripsi singkat tentang diri Anda..."
                            value={profileEditMode ? profileEdit.desc : (user.desc || "")}
                            onChange={e => setProfileEdit(p => ({ ...p, desc: e.target.value }))}
                            onFocus={() => { if (!profileEditMode) { setProfileEditMode(true); setProfileEdit({ name: user.name || "", phone: user.phone || "", email: user.email || "", desc: user.desc || "", newPass: "", confirmPass: "" }); } }}
                            rows={3}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                        </div>
                        {profileEditMode && (
                          <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={async () => {
                              const updated = { ...user, name: profileEdit.name, phone: profileEdit.phone, email: profileEdit.email, desc: profileEdit.desc };
                              setUser(updated);
                              try { const prev = await fsGet(`profile-${user.username}`) || {}; await fsSet(`profile-${user.username}`, { ...prev, name: profileEdit.name, phone: profileEdit.phone, email: profileEdit.email, desc: profileEdit.desc, photo: user.photo || "" }); } catch {}
                              setProfileEditMode(false);
                              notify("Data diri berhasil disimpan!");
                            }} style={{ padding: "10px 24px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Simpan Perubahan</button>
                            <button onClick={() => setProfileEditMode(false)}
                              style={{ padding: "10px 20px", background: "#edfafc", color: "#4a6680", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Batal</button>
                          </div>
                        )}
                      </div>

                      {/* Ganti Sandi */}
                      <div style={{ background: "#fff", borderRadius: 12, padding: "28px 28px", boxShadow: "0 2px 12px rgba(0,0,0,.07)", borderTop: "4px solid #e74c3c" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0d3b66", marginBottom: 4 }}>🔒 Ganti Password</h3>
                        <p style={{ fontSize: 12, color: "#5090aa", marginBottom: 20, lineHeight: 1.6 }}>Masukkan password lama untuk verifikasi, lalu isi password baru.</p>
                        <div style={{ marginBottom: 14 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password Lama</label>
                          <input type="password" placeholder="Masukkan password saat ini"
                            value={profileEdit.oldPass}
                            onChange={e => setProfileEdit(p => ({ ...p, oldPass: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Password Baru</label>
                          <input type="password" placeholder="Minimal 6 karakter"
                            value={profileEdit.newPass}
                            onChange={e => setProfileEdit(p => ({ ...p, newPass: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Konfirmasi Password</label>
                          <input type="password" placeholder="Ulangi password baru"
                            value={profileEdit.confirmPass}
                            onChange={e => setProfileEdit(p => ({ ...p, confirmPass: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
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
                      notify={notify}
                      allPosts={allPosts}
                    />
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66" }}>Posts & CMS</h1>
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
                              border: adminSection === s ? "none" : "1px solid #b0dce8",
                              background: adminSection === s ? "#0d3b66" : "#fff",
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
                            <tr style={{ background: "#edfafc" }}>
                              {["Title", "Category", "Author", "Date", "Status", "Actions"].map(h => (
                                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11,
                                  fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase",
                                  borderBottom: "1px solid #e8f2f8" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(data.posts?.[adminSection] || []).length === 0 ? (
                              <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#5090aa", fontSize: 14 }}>
                                No posts yet. <button onClick={() => setCmsEditPost("new")} style={{ color: "#0ea5c5", border: "none", background: "none", cursor: "pointer" }}>Create the first one →</button>
                              </td></tr>
                            ) : (data.posts?.[adminSection] || []).map(post => (
                              <tr key={post.id} style={{ borderBottom: "1px solid #e0f7fa" }}>
                                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: "#0d3b66", maxWidth: 240 }}>
                                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</div>
                                </td>
                                <td style={{ padding: "14px 16px", fontSize: 12, color: "#5090aa" }}>{post.category || "—"}</td>
                                <td style={{ padding: "14px 16px", fontSize: 12, color: "#5090aa" }}>{post.author}</td>
                                <td style={{ padding: "14px 16px", fontSize: 12, color: "#5090aa" }}>{formatDate(post.date)}</td>
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
                                    border: "1px solid #b0dce8", background: "#edfafc", color: "#0ea5c5" }}>Edit</button>
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
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66", marginBottom: 8 }}>Image Management</h1>
                  <p style={{ fontSize: 13, color: "#5090aa", marginBottom: 8 }}>Upload langsung ke Cloudinary atau tempel URL gambar</p>
                  <div style={{ fontSize: 12, background: "#e8f4fd", border: "1px solid #86cad8", borderRadius: 6, padding: "10px 14px", marginBottom: 28, color: "#0ea5c5" }}>
                    💡 Klik <strong>⬆ Upload</strong> untuk ganti via file lokal, atau <strong>🔗 URL</strong> untuk ganti via link langsung.
                  </div>
                  {editImg.group !== null && (
                    <div style={{ background: "#fff", borderRadius: 8, padding: "20px", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,.08)" }}>
                      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Update {editImg.group}[{editImg.idx}] — via URL</h3>
                      <div style={{ display: "flex", gap: 10 }}>
                        <input value={editImg.url} onChange={e => setEditImg(p => ({ ...p, url: e.target.value }))}
                          placeholder="https://..."
                          style={{ flex: 1, padding: "10px 14px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none" }} />
                        <button onClick={updateImg} style={{ padding: "10px 20px", background: "#27ae60", color: "#fff", borderRadius: 6, fontSize: 13, border: "none" }}>Update</button>
                        <button onClick={() => setEditImg({ group: null, idx: null, url: "" })}
                          style={{ padding: "10px 20px", background: "#eee", borderRadius: 6, fontSize: 13, border: "none" }}>Cancel</button>
                      </div>
                      {editImg.url && <img loading="lazy" src={editImg.url} alt="" style={{ width: 200, height: 130, objectFit: "cover", borderRadius: 6, marginTop: 12 }} />}
                    </div>
                  )}
                  {[
                    { key: "hero", label: "Hero Images" },
                    { key: "adv", label: "Adventure Images" },
                    { key: "gal", label: "Gallery Images" },
                  ].map(group => (
                    <div key={group.key} style={{ background: "#fff", borderRadius: 8, padding: "20px 24px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 500, color: "#0d3b66", marginBottom: 16 }}>{group.label}</h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        {data.images[group.key].map((src, i) => (
                          <div key={i} style={{ width: 140 }}>
                            <img loading="lazy" src={src} alt="" style={{ width: 140, height: 95, objectFit: "cover", borderRadius: 6, display: "block" }} />
                            <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
                              <button onClick={() => setEditImg({ group: group.key, idx: i, url: src })} style={{
                                flex: 1, background: "#edfafc", color: "#0ea5c5",
                                border: "1px solid #b0dce8", borderRadius: 4, padding: "4px 0", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>🔗 URL</button>
                              <label style={{
                                flex: 1, background: "#eeffee", color: "#27ae60",
                                border: "1px solid #b0dce8", borderRadius: 4, padding: "4px 0", fontSize: 10, fontWeight: 600, cursor: "pointer", textAlign: "center", display: "block" }}>
                                ⬆ Upload
                                <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    notify("⏳ Mengupload gambar...");
                                    const url = await uploadToCloudinary(file);
                                    const newImages = { ...data.images };
                                    const arr = [...newImages[group.key]];
                                    arr[i] = url;
                                    newImages[group.key] = arr;
                                    save({ ...data, images: newImages });
                                    notify("✅ Gambar berhasil diperbarui!");
                                  } catch {
                                    notify("❌ Gagal upload. Coba lagi.", "error");
                                  }
                                  e.target.value = "";
                                }} />
                              </label>
                            </div>
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
                      <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66", marginBottom: 4 }}>Setting About Us</h1>
                      <p style={{ fontSize: 12, color: "#5090aa" }}>Kelola semua konten halaman About Us yang tampil di website.</p>
                    </div>
                    <button onClick={() => { navigateTo("about"); setShowAdmin(false); }}
                      style={{ padding: "8px 16px", background: "#edfafc", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 12, color: "#0ea5c5", cursor: "pointer", fontWeight: 600 }}>
                      👁 Lihat Halaman →
                    </button>
                  </div>

                  {/* HERO SECTION */}
                  <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #0891b2" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0d3b66", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: "#e8f4fd", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#0ea5c5" }}>Hero Section</span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {[
                        { label: "Label Kecil (di atas judul)", key: "aboutHeroLabel", placeholder: "About Us" },
                        { label: "Judul Utama Hero", key: "aboutHeroTitle", placeholder: "We Live for Adventure" },
                        { label: "Teks Deskripsi Hero", key: "aboutHeroSub", multiline: true, placeholder: "Deskripsi singkat perusahaan..." },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
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
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0d3b66", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: "#e8f8ef", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#27ae60" }}>Why Choose Us</span>
                    </h3>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Judul Seksi</label>
                      <CEF
                        val={getCEFVal("aboutWhyTitle") ?? "Why Choose Us"}
                        onChange={e => setEditContent(p => ({ ...p, aboutWhyTitle: e.target.value }))}
                        onSave={() => saveContent("aboutWhyTitle")}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{ background: "#f8fbfc", borderRadius: 8, padding: "16px 18px", border: "1px solid #e8f2f8" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#5090aa", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 12 }}>Keunggulan #{n}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[
                              { label: "Ikon (emoji)", key: `aboutV${n}Icon`, placeholder: ["🌍","🛡","🌱","⭐"][n-1] },
                              { label: "Judul", key: `aboutV${n}Title`, placeholder: ["Global Network","Safe & Trusted","Sustainable Travel","Award Winning"][n-1] },
                              { label: "Deskripsi", key: `aboutV${n}Desc`, multiline: true, placeholder: "Deskripsi keunggulan..." },
                            ].map(f => (
                              <div key={f.key}>
                                <label style={{ fontSize: 10, fontWeight: 700, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{f.label}</label>
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
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0d3b66", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
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
                          <label style={{ fontSize: 11, fontWeight: 700, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
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
                  <div style={{ background: "#edfafc", borderRadius: 10, padding: "20px 24px", border: "1px dashed #86cad8" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>Preview Ringkas</p>
                    <div style={{ background: "#c5dde9", borderRadius: 8, padding: "20px 24px", marginBottom: 12 }}>
                      <div style={{ fontSize: 10, letterSpacing: "2px", color: "#0891b2", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>{data.content.aboutHeroLabel || "About Us"}</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#0d3b66", marginBottom: 8 }}>{data.content.aboutHeroTitle || "We Live for Adventure"}</div>
                      <div style={{ fontSize: 13, color: "#1a5a78", lineHeight: 1.7 }}>{(data.content.aboutHeroSub || data.content.aboutText || "").slice(0, 100)}{(data.content.aboutHeroSub || data.content.aboutText || "").length > 100 ? "…" : ""}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{ background: "#fff", borderRadius: 8, padding: "12px", textAlign: "center", border: "1px solid #c0e8f0" }}>
                          <div style={{ fontSize: 22, marginBottom: 6 }}>{data.content[`aboutV${n}Icon`] || ["🌍","🛡","🌱","⭐"][n-1]}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#0d3b66" }}>{data.content[`aboutV${n}Title`] || ["Global Network","Safe & Trusted","Sustainable Travel","Award Winning"][n-1]}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "#daeaf3", borderRadius: 8, padding: "14px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0d3b66", marginBottom: 4 }}>{data.content.aboutContactTitle || "Get in Touch"}</div>
                      <div style={{ fontSize: 12, color: "#1a5a78" }}>{data.content.aboutContactSub || "We'd love to help plan your next event."}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* SITE CONTENT */}
              {adminTab === "content" && isAdmin && (
                <div className="fade-in">
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66", marginBottom: 6 }}>Site Content</h1>
                  <p style={{ fontSize: 13, color: "#5090aa", marginBottom: 28 }}>Edit all text on the website</p>

                  {/* ── LOGO STYLING PANEL ── */}
                  <div style={{ background: "#fff", borderRadius: 10, padding: "20px 24px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #0891b2" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0d3b66", marginBottom: 4 }}>🔤 Nama Perusahaan — Tampilan</h3>
                    <p style={{ fontSize: 12, color: "#5090aa", marginBottom: 18, lineHeight: 1.6 }}>Atur teks nama, layout, font, warna, dan shadow di navbar.</p>

                    {/* Teks nama */}
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Teks Nama (Enter = baris baru)</label>
                    <textarea
                      defaultValue={data.content.logoText}
                      id="logo-text-input"
                      rows={3}
                      style={{ width: "100%", padding: "8px 10px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, fontFamily: "monospace", resize: "vertical", outline: "none", marginBottom: 14, boxSizing: "border-box" }}
                    />

                    {/* Single line toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#0d3b66" }}>Layout:</span>
                      {[
                        { val: false, label: "📋 Multi Line" },
                        { val: true,  label: "➖ Satu Baris" },
                      ].map(opt => (
                        <button key={String(opt.val)}
                          onClick={() => save({ ...data, content: { ...data.content, logoSingleLine: opt.val } })}
                          style={{
                            padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid",
                            background: (!!data.content.logoSingleLine) === opt.val ? "#0891b2" : "#f5fdff",
                            color: (!!data.content.logoSingleLine) === opt.val ? "#fff" : "#0891b2",
                            borderColor: "#0891b2", transition: "all .15s"
                          }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {/* Font picker */}
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Font</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                      {[
                        { name: "Playfair Display", label: "Playfair" },
                        { name: "Cinzel",            label: "Cinzel" },
                        { name: "Montserrat",        label: "Montserrat" },
                        { name: "Raleway",           label: "Raleway" },
                        { name: "Oswald",            label: "Oswald" },
                        { name: "Cormorant Garamond",label: "Cormorant" },
                        { name: "Bebas Neue",        label: "Bebas" },
                        { name: "Lora",              label: "Lora" },
                        { name: "Josefin Sans",      label: "Josefin" },
                        { name: "Inter",             label: "Inter" },
                      ].map(f => (
                        <button key={f.name}
                          onClick={() => save({ ...data, content: { ...data.content, logoFont: f.name } })}
                          style={{
                            padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", border: "1.5px solid",
                            background: data.content.logoFont === f.name ? "#0d3b66" : "#f5fdff",
                            color: data.content.logoFont === f.name ? "#fff" : "#0d3b66",
                            borderColor: data.content.logoFont === f.name ? "#0d3b66" : "#b0dce8",
                            fontFamily: `'${f.name}', serif`, fontWeight: 700, transition: "all .15s"
                          }}>
                          {f.label}
                        </button>
                      ))}
                    </div>

                    {/* Warna teks */}
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Warna Teks</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                      {[
                        { val: "#111111", label: "Hitam" },
                        { val: "#ffffff", label: "Putih" },
                        { val: "#0d3b66", label: "Navy" },
                        { val: "#0891b2", label: "Teal" },
                        { val: "#e8a020", label: "Gold" },
                        { val: "#4a4a4a", label: "Abu" },
                        { val: "#c8a96e", label: "Bronze" },
                      ].map(c => (
                        <button key={c.val}
                          onClick={() => save({ ...data, content: { ...data.content, logoColor: c.val } })}
                          style={{
                            padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
                            background: c.val,
                            color: ["#111111","#0d3b66","#4a4a4a","#c8a96e","#ffffff"].includes(c.val) ? (c.val === "#ffffff" ? "#111" : "#fff") : "#111",
                            border: `2px solid ${data.content.logoColor === c.val ? "#0891b2" : "rgba(0,0,0,.12)"}`,
                            boxShadow: data.content.logoColor === c.val ? "0 0 0 2px #0891b2" : "0 1px 3px rgba(0,0,0,.15)",
                            transition: "all .15s"
                          }}>
                          {c.label}
                        </button>
                      ))}
                      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#0d3b66", border: "1.5px solid #b0dce8", borderRadius: 20, padding: "5px 12px", background: "#f5fdff" }}>
                        🎨 Custom
                        <input type="color" defaultValue={data.content.logoColor || "#111111"}
                          onChange={e => save({ ...data, content: { ...data.content, logoColor: e.target.value } })}
                          style={{ width: 22, height: 22, border: "none", background: "none", cursor: "pointer", padding: 0 }} />
                      </label>
                    </div>

                    {/* Shadow preset */}
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Shadow Teks</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                      {[
                        { label: "Tanpa Shadow",  val: "none" },
                        { label: "Tipis",         val: "0 1px 3px rgba(0,0,0,.25)" },
                        { label: "Sedang ✓",      val: "0 1px 6px rgba(0,0,0,.35), 0 2px 14px rgba(0,0,0,.18)" },
                        { label: "Tebal",         val: "0 2px 8px rgba(0,0,0,.55), 0 4px 20px rgba(0,0,0,.30)" },
                        { label: "Glow Putih",    val: "0 0 8px rgba(255,255,255,.9), 0 0 20px rgba(255,255,255,.6)" },
                        { label: "Glow Teal",     val: "0 0 10px rgba(8,145,178,.8), 0 0 24px rgba(8,145,178,.4)" },
                        { label: "Glow Gold",     val: "0 0 10px rgba(232,160,32,.8), 0 0 24px rgba(232,160,32,.4)" },
                      ].map(s => (
                        <button key={s.val}
                          onClick={() => save({ ...data, content: { ...data.content, logoShadow: s.val } })}
                          style={{
                            padding: "6px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer", border: "1.5px solid",
                            background: data.content.logoShadow === s.val ? "#0d3b66" : "#f5fdff",
                            color: data.content.logoShadow === s.val ? "#fff" : "#0d3b66",
                            borderColor: data.content.logoShadow === s.val ? "#0d3b66" : "#b0dce8",
                            fontWeight: 600, transition: "all .15s"
                          }}>
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {/* Preview strip */}
                    <div style={{ background: "linear-gradient(105deg,#fff 0%,#e8f9fb 40%,#a8dde8 75%,#0aa8bf 100%)", borderRadius: 8, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 16, minHeight: 64 }}>
                      <div style={{ fontSize: 11, color: "#5090aa", fontWeight: 600, flexShrink: 0 }}>Preview:</div>
                      <LogoDisplay content={data.content} size="nav" />
                    </div>

                    {/* Simpan teks */}
                    <button onClick={() => {
                      const txt = document.getElementById("logo-text-input")?.value ?? "";
                      save({ ...data, content: { ...data.content, logoText: txt } });
                      notify("✅ Nama perusahaan disimpan!");
                    }} style={{ padding: "9px 22px", background: "linear-gradient(130deg,#063d5c,#0891b2)", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      💾 Simpan Nama
                    </button>
                  </div>

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
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>{f.label}</label>
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
                    <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66" }}>Pesan Masuk</h1>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#5090aa" }}>Total: {data.messages.length} pesan</span>
                      {data.messages.filter(m => !m.read).length > 0 && (
                        <span style={{ fontSize: 11, background: "#e74c3c", color: "#fff", borderRadius: 10, padding: "3px 10px", fontWeight: 600 }}>
                          {data.messages.filter(m => !m.read).length} belum dibaca
                        </span>
                      )}
                      {data.messages.some(m => !m.read) && (
                        <button onClick={() => {
                          const msgs = data.messages.map(m => ({ ...m, read: true }));
                          save({ ...data, messages: msgs }); notify("Semua pesan ditandai sudah dibaca.");
                        }} style={{ fontSize: 11, padding: "5px 12px", background: "#edfafc", border: "1px solid #b0dce8", borderRadius: 6, color: "#4a6680", cursor: "pointer" }}>
                          Tandai Semua Dibaca
                        </button>
                      )}
                    </div>
                  </div>

                  {data.messages.length === 0
                    ? <div style={{ textAlign: "center", padding: "60px", color: "#5090aa", background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
                        <p style={{ fontSize: 14 }}>Belum ada pesan masuk.</p>
                      </div>
                    : [...data.messages].reverse().map(m => (
                      <div key={m.id} style={{ background: "#fff", borderRadius: 10, marginBottom: 16,
                        boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderLeft: m.read ? "3px solid #c0e8f0" : "3px solid #e74c3c",
                        overflow: "hidden", opacity: m.deleted ? 0.5 : 1 }}>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 20px 12px", borderBottom: "1px solid #edfafc" }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 50%,#0aa8bf 100%)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                              {m.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: "#0d3b66", lineHeight: 1.3 }}>
                                {m.name}
                                {!m.read && <span style={{ marginLeft: 8, fontSize: 9, background: "#e74c3c", color: "#fff", borderRadius: 8, padding: "2px 7px", fontWeight: 700, letterSpacing: ".5px" }}>BARU</span>}
                              </div>
                              <div style={{ fontSize: 12, color: "#5090aa", marginTop: 2 }}>{m.email}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: "#86cad8" }}>{m.date}</span>
                            {/* READ button */}
                            <button onClick={() => {
                              const msgs = data.messages.map(x => x.id === m.id ? { ...x, read: !x.read } : x);
                              save({ ...data, messages: msgs });
                            }} title={m.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                              style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "1px solid #b0dce8",
                                background: m.read ? "#edfafc" : "#e8f8ef", color: m.read ? "#5090aa" : "#27ae60", cursor: "pointer", fontWeight: 600 }}>
                              {m.read ? "✓ Dibaca" : "Tandai Dibaca"}
                            </button>
                            {/* REPLY button */}
                            <button onClick={() => setReplyTo(replyTo === m.id ? null : m.id)}
                              style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "1px solid #86cad8",
                                background: replyTo === m.id ? "#e8f4fd" : "none", color: "#0ea5c5", cursor: "pointer", fontWeight: 600 }}>
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
                          <p style={{ fontSize: 14, color: "#1a4a72", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{m.message}</p>
                          {/* Reply history */}
                          {m.replies?.length > 0 && (
                            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase" }}>Riwayat Balasan</div>
                              {m.replies.map((r, i) => (
                                <div key={i} style={{ background: "#edfafc", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#3a5066", borderLeft: "2px solid #0ea5c5" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <strong style={{ color: "#0ea5c5", fontSize: 12 }}>↩ {r.author}</strong>
                                    <span style={{ fontSize: 11, color: "#86cad8" }}>{r.date}</span>
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
                                style={{ flex: 1, padding: "10px 12px", border: "1.5px solid #0ea5c5", borderRadius: 6, fontSize: 13, outline: "none", resize: "vertical" }} />
                              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <button onClick={() => replyMsg(m.id)}
                                  style={{ padding: "9px 18px", background: "#27ae60", color: "#fff", borderRadius: 6, fontSize: 12, border: "none", fontWeight: 600, cursor: "pointer" }}>Kirim</button>
                                <button onClick={() => { setReplyTo(null); setReplyText(""); }}
                                  style={{ padding: "9px 14px", background: "#edfafc", borderRadius: 6, fontSize: 12, border: "1px solid #b0dce8", cursor: "pointer" }}>Batal</button>
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
                    <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66" }}>User Management</h1>
                    <button onClick={() => setUserMgmtOpen(v => !v)}
                      style={{ padding: "9px 20px", background: userMgmtOpen ? "#edfafc" : "#0d3b66", color: userMgmtOpen ? "#4a6680" : "#fff",
                        border: userMgmtOpen ? "1px solid #b0dce8" : "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      {userMgmtOpen ? "✕ Batal" : "+ Tambah User"}
                    </button>
                  </div>

                  {/* Add User Form */}
                  {userMgmtOpen && (
                    <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", marginBottom: 24, boxShadow: "0 2px 10px rgba(0,0,0,.07)", borderTop: "4px solid #27ae60" }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, color: "#0d3b66", marginBottom: 18 }}>➕ Tambah Akun Baru</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {[
                          { label: "Nama Lengkap", key: "name", placeholder: "Nama lengkap", type: "text" },
                          { label: "Username", key: "username", placeholder: "username (tanpa spasi)", type: "text" },
                          { label: "Password", key: "password", placeholder: "Min. 6 karakter", type: "password" },
                          { label: "Email", key: "email", placeholder: "email@domain.com", type: "email" },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={{ fontSize: 10, fontWeight: 700, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 5 }}>{f.label}</label>
                            <input type={f.type} placeholder={f.placeholder} value={userMgmtForm[f.key]}
                              onChange={e => setUserMgmtForm(p => ({ ...p, [f.key]: e.target.value }))}
                              style={{ width: "100%", padding: "9px 11px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                          </div>
                        ))}
                        <div>
                          <label style={{ fontSize: 10, fontWeight: 700, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: 5 }}>Role</label>
                          <select value={userMgmtForm.role} onChange={e => setUserMgmtForm(p => ({ ...p, role: e.target.value }))}
                            style={{ width: "100%", padding: "9px 11px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, outline: "none", background: "#fff" }}>
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
                          style={{ padding: "10px 18px", background: "#edfafc", color: "#4a6680", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>
                          Batal
                        </button>
                      </div>
                    </div>
                  )}

                  {/* User Table */}
                  <div className="table-wrap" style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                      <thead>
                        <tr style={{ background: "#edfafc" }}>
                          {["#", "Nama / Username", "Role", "Email", "Status", "Aksi"].map(h => (
                            <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #e8f2f8" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.users.map((u, idx) => (
                          <tr key={u.id} style={{ borderBottom: "1px solid #e0f7fa", background: idx % 2 === 0 ? "#fff" : "#f5fdff" }}>
                            <td style={{ padding: "13px 16px", fontSize: 12, color: "#86cad8" }}>{idx + 1}</td>
                            <td style={{ padding: "13px 16px" }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#0d3b66" }}>{u.name || u.username}</div>
                              <div style={{ fontSize: 11, color: "#5090aa", marginTop: 1 }}>@{u.username}</div>
                            </td>
                            <td style={{ padding: "13px 16px" }}>
                              {editRoleId === u.id ? (
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  <select defaultValue={u.role}
                                    id={`role-select-${u.id}`}
                                    style={{ padding: "5px 8px", border: "1px solid #b0dce8", borderRadius: 5, fontSize: 12, outline: "none" }}>
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
                                  <button onClick={() => setEditRoleId(null)} style={{ fontSize: 11, padding: "4px 8px", background: "#edfafc", borderRadius: 5, border: "1px solid #b0dce8", cursor: "pointer" }}>✕</button>
                                </div>
                              ) : (
                                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 10, fontWeight: 500,
                                  background: u.role === "admin" ? "#fef0f0" : u.role === "content_writer" ? "#e8f4fd" : "#e8f8ef",
                                  color: ROLES[u.role]?.color }}>
                                  {ROLES[u.role]?.label}
                                </span>
                              )}
                            </td>
                            <td style={{ padding: "13px 16px", fontSize: 12, color: "#4a7f98" }}>{u.email || "—"}</td>
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
                                    style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, background: "#e8f4fd", color: "#0ea5c5", border: "none", cursor: "pointer", fontWeight: 500 }}>
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
                                  <span style={{ fontSize: 11, color: "#86cad8", fontStyle: "italic" }}>Protected</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {data.users.length === 0 && (
                      <div style={{ padding: "32px", textAlign: "center", color: "#5090aa", fontSize: 13 }}>Belum ada user terdaftar.</div>
                    )}
                  </div>
                </div>
              )}

              {/* REVIEWS ADMIN */}
              {adminTab === "reviews" && isAdmin && <AdminReviews data={data} save={save} notify={notify} />}

              {/* SETTINGS */}
              {adminTab === "settings" && isAdmin && (
                <div className="fade-in">
                  <h1 style={{ fontSize: 24, fontWeight: 500, color: "#0d3b66", marginBottom: 28 }}>Settings</h1>

                  {/* Logo Upload */}
                  <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #0ea5c5" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 500, color: "#0d3b66", marginBottom: 6 }}>🖼 Logo Upload</h3>
                    <p style={{ fontSize: 12, color: "#5090aa", marginBottom: 16, lineHeight: 1.6 }}>
                      Upload logo untuk ditampilkan di navbar, footer, admin panel, dan tab browser (favicon). Jika tidak diupload, nama brand teks akan digunakan.
                    </p>
                    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                      {data.content.logoImage && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                          <img src={data.content.logoImage} alt="Logo" style={{ height: 60, maxWidth: 180, objectFit: "contain", border: "1px solid #e0f7fa", borderRadius: 6, padding: 8, background: "#edfafc" }} />
                          <button onClick={() => { save({ ...data, content: { ...data.content, logoImage: "" } }); notify("Logo removed."); }}
                            style={{ fontSize: 11, padding: "4px 12px", background: "#fee", color: "#e74c3c", borderRadius: 6, border: "none" }}>Remove Logo</button>
                        </div>
                      )}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 240 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase" }}>Upload File Logo</label>
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
                        }} style={{ padding: "8px", border: "1.5px dashed #0ea5c5", borderRadius: 8, fontSize: 12, background: "#e8f9fc", color: "#0ea5c5" }} />
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#5090aa", letterSpacing: "1px", textTransform: "uppercase", marginTop: 4 }}>Atau URL Gambar</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input placeholder="https://..." defaultValue={data.content.logoImage}
                            id="logo-url-input"
                            style={{ flex: 1, padding: "8px 10px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 12, outline: "none" }} />
                          <button onClick={() => {
                            const url = document.getElementById("logo-url-input")?.value?.trim();
                            if (!url) return notify("Masukkan URL logo.", "error");
                            save({ ...data, content: { ...data.content, logoImage: url } });
                            notify("Logo URL applied!");
                          }} style={{ padding: "8px 14px", background: "#0ea5c5", color: "#fff", borderRadius: 6, fontSize: 12, border: "none" }}>Apply</button>
                        </div>
                        <p style={{ fontSize: 11, color: "#5090aa" }}>Disarankan: PNG transparan, min 200px lebar, rasio 3:1 atau 4:1</p>
                      </div>
                    </div>
                  </div>

                  {/* Founding Year */}
                  <div style={{ background: "#fff", borderRadius: 8, padding: "22px 24px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)", borderTop: "4px solid #38c5d8" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 500, color: "#0d3b66", marginBottom: 6 }}>🗓 Tahun Berdiri Perusahaan</h3>
                    <p style={{ fontSize: 12, color: "#5090aa", marginBottom: 16, lineHeight: 1.6 }}>
                      Tahun ini digunakan untuk teks "sejak [tahun]", statistik "X Tahun Pengalaman", dan label dekorasi halaman.
                    </p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        id="founding-year-input"
                        defaultValue={data.content.foundingYear || "2026"}
                        placeholder="cth: 2026"
                        maxLength={4}
                        style={{ width: 120, padding: "8px 12px", border: "1px solid #b0dce8", borderRadius: 6, fontSize: 14, outline: "none" }}
                      />
                      <button onClick={() => {
                        const yr = document.getElementById("founding-year-input")?.value?.trim();
                        if (!yr || !/^\d{4}$/.test(yr)) return notify("Masukkan tahun 4 digit (misal: 2026).", "error");
                        save({ ...data, content: { ...data.content, foundingYear: yr } });
                        notify(`✅ Tahun berdiri diperbarui ke ${yr}`);
                      }} style={{ padding: "8px 16px", background: "linear-gradient(130deg,#063d5c 0%,#0875a8 45%,#0aa8bf 78%,#10d0e0 100%)", color: "#fff", borderRadius: 6, fontSize: 12, border: "none", fontWeight: 500 }}>
                        Simpan
                      </button>
                      <span style={{ fontSize: 12, color: "#5090aa" }}>Saat ini: <strong style={{ color: "#0d3b66" }}>{data.content.foundingYear || "2026"}</strong> · Pengalaman: <strong style={{ color: "#0891b2" }}>{new Date().getFullYear() - parseInt(data.content.foundingYear || "2026")} tahun</strong></span>
                    </div>
                  </div>

                  <div className="settings-grid">
                    {[
                      { title: "Firebase Config", desc: "Connect to Firestore for real-time data sync", btn: "Configure", color: "#f39c12" },
                      { title: "Cloudinary Config", desc: "Set up image hosting and transformation pipeline", btn: "Configure", color: "#0ea5c5" },
                      { title: "Vercel Deploy", desc: "Deploy updates to production via Vercel CI/CD", btn: "Deploy", color: "#0d3b66" },
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
                        <h3 style={{ fontSize: 15, fontWeight: 500, color: "#0d3b66", marginBottom: 8 }}>{s.title}</h3>
                        <p style={{ fontSize: 12, color: "#5090aa", lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
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
