import { useState, useEffect, useRef } from "react";

const COLORS = {
  forest: "#1a2e1e",
  green: "#2d5a3d",
  mint: "#4a8c5c",
  lightMint: "#d4eddd",
  cream: "#f5f4f0",
  amber: "#7c4d0d",
  lightAmber: "#fdecc8",
  blue: "#1e40af",
  lightBlue: "#dbeafe",
  border: "#e5e3dc",
  muted: "#888",
  text: "#1a2e1e",
  subtext: "#555",
};

const INITIAL_POSTS = [
  {
    id: 1, type: "event", author: "Management", unit: "Maplewood Residences", initials: "M", avatarStyle: "mgmt",
    time: "Just now", tag: "official", title: "Rooftop Summer Kickoff 🎉",
    body: "Join us on the rooftop for our annual summer party! Food, music, and great company. RSVP so we can plan accordingly.",
    eventDate: "Jun 14", eventTime: "6:00 PM", eventLocation: "Rooftop Deck", rsvpCount: 18, rsvped: false, likes: 12, comments: [],
  },
  {
    id: 2, type: "hangout", author: "Tara K.", unit: "Unit 7A", initials: "TK", avatarStyle: "blue",
    time: "2h ago", tag: "hangout",
    body: "Anyone down for a Sunday morning hike at Ridgeline Park? Thinking 8am. 3–4 people max 🥾",
    likes: 5, liked: false, comments: [{ author: "Dev P.", text: "I'm in! What trail?" }, { author: "Sofia M.", text: "Count me in 🙌" }],
  },
  {
    id: 3, type: "favor", author: "Marco R.", unit: "Unit 2C", initials: "MR", avatarStyle: "amber",
    time: "5h ago", tag: "favor",
    body: "Can anyone water my plants June 20–25 while I'm traveling? Happy to return the favor! 🌿",
    likes: 2, liked: false, comments: [{ author: "Yuki S.", text: "I can do it! DM me 😊" }],
  },
  {
    id: 4, type: "hangout", author: "Sofia & Dev", unit: "Unit 9D", initials: "SD", avatarStyle: "green",
    time: "Yesterday", tag: "hangout",
    body: "Board Game Night this Saturday at 7pm at our place! Bring your favorite game, we'll provide snacks 🎲",
    likes: 9, liked: true, comments: [{ author: "Tara K.", text: "We'll be there!" }, { author: "Marco R.", text: "Bringing Catan 👀" }],
  },
];

const INITIAL_EVENTS = [
  { id: 1, title: "Rooftop Summer Kickoff", date: "Jun 14", time: "6:00 PM", location: "Rooftop Deck", host: "Management", rsvpCount: 18, rsvped: true, official: true, description: "Annual summer party with food, music, and neighbors." },
  { id: 2, title: "Board Game Night", date: "Jun 22", time: "7:00 PM", location: "Unit 9D", host: "Sofia & Dev", rsvpCount: 6, rsvped: false, official: false, description: "Bring your favorite game! Snacks provided." },
  { id: 3, title: "Courtyard Yoga", date: "Jun 28", time: "8:00 AM", location: "Courtyard", host: "Tara K.", rsvpCount: 4, rsvped: false, official: false, description: "All levels welcome! Mats provided." },
  { id: 4, title: "Pool Day", date: "Jul 4", time: "12:00 PM", location: "Pool Deck", host: "Management", rsvpCount: 31, rsvped: false, official: true, description: "Independence Day pool party. BBQ and drinks provided." },
];

const INITIAL_FAVORS = [
  { id: 1, icon: "🌿", title: "Water my plants", detail: "Jun 20–25 while I'm away", author: "Marco R.", unit: "Unit 2C", category: "Plants", fulfilled: false, helped: false },
  { id: 2, icon: "📦", title: "Grab my package from lobby", detail: "Today — fragile, please be careful!", author: "Yuki S.", unit: "Unit 5F", category: "Packages", fulfilled: false, helped: false },
  { id: 3, icon: "🐾", title: "Walk Biscuit Thursday evening", detail: "6–7pm, she's very friendly", author: "James & Lee", unit: "Unit 3B", category: "Pet care", fulfilled: false, helped: false },
  { id: 4, icon: "🔧", title: "Borrow a drill", detail: "Just for the afternoon", author: "Priya M.", unit: "Unit 8A", category: "Other", fulfilled: true, helped: true },
];


const INITIAL_PERKS = [
  { id: 1, name: "Compass Rose", category: "Coffee", emoji: "☕", distance: "0.1 mi", deal: "15% off your order", code: "MAPLE15", description: "Cozy neighborhood coffee shop. Show this code at checkout for 15% off any order, any time.", hours: "7am–8pm daily", address: "1420 Shaw St NW" },
  { id: 2, name: "Taqueria Habanero", category: "Mexican", emoji: "🌮", distance: "0.2 mi", deal: "Free chips & guac", code: "MAPLE-GUAC", description: "Authentic DC Mexican spot. Show your code to get a free chips and guac with any entrée.", hours: "11am–10pm daily", address: "3710 14th St NW" },
  { id: 3, name: "The Board Room", category: "Bar", emoji: "🍺", distance: "0.3 mi", deal: "Happy hour until 8pm", code: "MAPLE-HR", description: "Board game bar with 30+ games. Residents get extended happy hour pricing until 8pm every night.", hours: "4pm–2am Mon–Fri, 12pm–2am Sat–Sun", address: "1737 Connecticut Ave NW" },
  { id: 4, name: "Roaming Rooster", category: "Chicken", emoji: "🍗", distance: "0.2 mi", deal: "10% off + free drink", code: "MAPLE10", description: "Nashville hot chicken, DC style. 10% off your whole order plus a free fountain drink.", hours: "11am–10pm daily", address: "1100 14th St NW" },
  { id: 5, name: "Swings Coffee", category: "Coffee", emoji: "☕", distance: "0.4 mi", deal: "Buy 4 get 1 free", code: "MAPLE-SWING", description: "Specialty coffee roaster. Your punch card starts at 1 automatically when you show this code.", hours: "7am–6pm Mon–Sat", address: "640 Rhode Island Ave NW" },
  { id: 6, name: "Timber Pizza Co.", category: "Pizza", emoji: "🍕", distance: "0.5 mi", deal: "Free appetizer", code: "MAPLE-PIZZA", description: "Wood-fired pizza. Show your code for a free arugula salad or meatballs with any pizza order.", hours: "5pm–10pm Tue–Sun", address: "809 Upshur St NW" },
  { id: 7, name: "Yoga District", category: "Fitness", emoji: "🧘", distance: "0.3 mi", deal: "First class free", code: "MAPLE-YOGA", description: "Drop-in yoga studio. Your first class is completely free — just show this code at the front desk.", hours: "6am–9pm daily", address: "1910 14th St NW" },
  { id: 8, name: "Call Your Mother", category: "Bagels", emoji: "🥯", distance: "0.6 mi", deal: "Free schmear upgrade", code: "MAPLE-CYM", description: "DC's favorite bagel shop. Get a free fancy schmear upgrade on any bagel order.", hours: "7am–3pm daily", address: "3301 Georgia Ave NW" },
];

const PERK_CATEGORIES = ["All", "Coffee", "Food", "Bar", "Fitness"];

function PerksTab() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const categoryMap = {
    "Food": ["Mexican", "Chicken", "Pizza", "Bagels"],
    "Coffee": ["Coffee"],
    "Bar": ["Bar"],
    "Fitness": ["Fitness"],
  };

  const filtered = filter === "All" ? INITIAL_PERKS : INITIAL_PERKS.filter(p =>
    categoryMap[filter]?.includes(p.category)
  );

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ padding: "16px 16px 10px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Perks</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>Exclusive deals for Maplewood residents</div>
          </div>
          <div style={{ background: COLORS.lightAmber, borderRadius: 10, padding: "6px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.amber, lineHeight: 1 }}>{INITIAL_PERKS.length}</div>
            <div style={{ fontSize: 9, color: COLORS.amber, fontWeight: 500 }}>deals</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          {PERK_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500,
              cursor: "pointer", border: "none",
              background: filter === cat ? COLORS.forest : COLORS.cream,
              color: filter === cat ? "#fff" : COLORS.subtext,
            }}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "10px 12px 80px" }}>
        <div style={{ background: `linear-gradient(135deg, ${COLORS.forest}, ${COLORS.green})`, borderRadius: 14, padding: "14px 16px", marginBottom: 14, color: "#fff" }}>
          <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Your resident code</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>MAPLEWOOD</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>Show this at any partner business for your discount</div>
        </div>

        {filtered.map((perk, i) => (
          <div key={perk.id} onClick={() => setSelected(perk)} style={{
            background: "#fff", border: `0.5px solid ${COLORS.border}`,
            borderRadius: 14, marginBottom: 10, overflow: "hidden", cursor: "pointer",
            animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
          }}>
            <div style={{ padding: "12px 14px", display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{perk.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{perk.name}</div>
                  <div style={{ fontSize: 10, color: COLORS.muted, flexShrink: 0, marginLeft: 8 }}>📍 {perk.distance}</div>
                </div>
                <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 5 }}>{perk.category} · {perk.address}</div>
                <div style={{ display: "inline-block", background: COLORS.lightMint, color: COLORS.green, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{perk.deal}</div>
              </div>
              <span style={{ fontSize: 16, color: COLORS.muted, flexShrink: 0 }}>›</span>
            </div>
          </div>
        ))}

        <div style={{ background: COLORS.cream, borderRadius: 14, padding: "14px 16px", marginTop: 4, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>Know a great local spot?</div>
          <button style={{ background: COLORS.forest, color: "#fff", border: "none", padding: "8px 18px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Suggest a business →</button>
        </div>
      </div>

      {selected && (
        <Modal onClose={() => { setSelected(null); setCopied(false); }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{selected.emoji}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>{selected.category} · {selected.distance} away</div>
            </div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.forest}, ${COLORS.green})`, borderRadius: 14, padding: "16px", marginBottom: 14, color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Your exclusive deal</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{selected.deal}</div>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 2 }}>Promo code</div>
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>{selected.code}</div>
              </div>
              <button onClick={() => copyCode(selected.code)} style={{ background: copied ? COLORS.mint : "#fff", color: copied ? "#fff" : COLORS.forest, border: "none", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          </div>
          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.6, marginBottom: 12 }}>{selected.description}</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, background: COLORS.cream, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 2 }}>Hours</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.text }}>{selected.hours}</div>
            </div>
            <div style={{ flex: 1, background: COLORS.cream, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 2 }}>Address</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.text }}>{selected.address}</div>
            </div>
          </div>
          <button style={{ width: "100%", padding: "12px 0", background: COLORS.forest, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Get directions →</button>
        </Modal>
      )}
    </div>
  );
}

const NEIGHBORS = [
  { name: "Tara K.", unit: "7A", initials: "TK", style: "blue", since: "2022", pets: "1 dog", bio: "Avid hiker, yoga teacher" },
  { name: "Marco R.", unit: "2C", initials: "MR", style: "amber", since: "2021", pets: "2 cats", bio: "Chef, loves to cook for neighbors" },
  { name: "Sofia & Dev", unit: "9D", initials: "SD", style: "green", since: "2020", pets: "No pets", bio: "Board game enthusiasts" },
  { name: "Yuki S.", unit: "5F", initials: "YS", style: "purple", since: "2023", pets: "1 cat", bio: "Remote designer, coffee lover" },
  { name: "James & Lee", unit: "3B", initials: "JL2", style: "coral", since: "2019", pets: "1 dog (Biscuit)", bio: "Dog parents, love the outdoors" },
  { name: "Priya M.", unit: "8A", initials: "PM", style: "teal", since: "2022", pets: "No pets", bio: "Engineer, handy around the building" },
];

const avatarColors = {
  mgmt: { bg: COLORS.forest, text: "#fff" },
  blue: { bg: COLORS.lightBlue, text: COLORS.blue },
  amber: { bg: COLORS.lightAmber, text: COLORS.amber },
  green: { bg: COLORS.lightMint, text: COLORS.green },
  purple: { bg: "#ede9fe", text: "#5b21b6" },
  coral: { bg: "#ffe4e6", text: "#9f1239" },
  teal: { bg: "#ccfbf1", text: "#0f766e" },
};

const tagStyles = {
  official: { bg: COLORS.forest, text: "#fff" },
  hangout: { bg: COLORS.lightBlue, text: COLORS.blue },
  favor: { bg: COLORS.lightAmber, text: COLORS.amber },
  event: { bg: COLORS.lightMint, text: COLORS.green },
};

function Avatar({ initials, style = "green", size = 36, square = false }) {
  const colors = avatarColors[style] || avatarColors.green;
  return (
    <div style={{
      width: size, height: size, borderRadius: square ? 8 : "50%",
      background: colors.bg, color: colors.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 600, flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>{initials}</div>
  );
}

function Tag({ type }) {
  const labels = { official: "Official", hangout: "Hangout", favor: "Favor", event: "Event" };
  const s = tagStyles[type] || tagStyles.event;
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 600,
      padding: "2px 8px", borderRadius: 20, marginBottom: 6,
      background: s.bg, color: s.text, letterSpacing: 0.3,
    }}>{labels[type]}</span>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      zIndex: 1000, animation: "fadeIn 0.15s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "20px 20px 0 0",
        width: "100%", maxWidth: 480, padding: "20px 20px 36px",
        animation: "slideUp 0.2s ease",
      }}>
        <div style={{ width: 36, height: 4, background: "#ddd", borderRadius: 2, margin: "0 auto 20px" }} />
        {children}
      </div>
    </div>
  );
}

function FeedTab({ posts, setPosts }) {
  const [showCompose, setShowCompose] = useState(false);
  const [newPost, setNewPost] = useState({ body: "", tag: "hangout" });
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const toggleLike = (id) => {
    setPosts(ps => ps.map(p => p.id === id
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p));
  };

  const submitComment = (id) => {
    const text = commentInputs[id]?.trim();
    if (!text) return;
    setPosts(ps => ps.map(p => p.id === id
      ? { ...p, comments: [...(p.comments || []), { author: "You (4B)", text }] }
      : p));
    setCommentInputs(c => ({ ...c, [id]: "" }));
  };

  const submitPost = () => {
    if (!newPost.body.trim()) return;
    setPosts(ps => [{
      id: Date.now(), type: newPost.tag, author: "You", unit: "Unit 4B",
      initials: "JL", avatarStyle: "teal", time: "Just now",
      tag: newPost.tag, body: newPost.body, likes: 0, liked: false, comments: [],
    }, ...ps]);
    setNewPost({ body: "", tag: "hangout" });
    setShowCompose(false);
  };

  return (
    <div>
      <div style={{ padding: "16px 16px 10px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.forest, letterSpacing: -1, fontFamily: "'DM Serif Display', serif" }}>
              neigh<span style={{ color: COLORS.mint }}>bors</span>
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 1 }}>Maplewood Residences · Unit 4B</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <span style={{ fontSize: 22 }}>🔔</span>
              <div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, background: "#e74c3c", borderRadius: "50%", border: "1.5px solid #fff" }} />
            </div>
            <Avatar initials="JL" style="teal" size={32} />
          </div>
        </div>
      </div>

      <div style={{ padding: "10px 12px" }}>
        <div onClick={() => setShowCompose(true)} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: COLORS.cream, borderRadius: 24, padding: "9px 14px", cursor: "pointer",
        }}>
          <Avatar initials="JL" style="teal" size={28} />
          <span style={{ flex: 1, fontSize: 13, color: "#aaa" }}>Share something with neighbors…</span>
          <div style={{ width: 28, height: 28, background: COLORS.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>+</div>
        </div>
      </div>

      <div style={{ padding: "0 12px", paddingBottom: 80 }}>
        {posts.map((post, i) => (
          <div key={post.id} style={{
            background: "#fff", border: `0.5px solid ${COLORS.border}`,
            borderRadius: 14, marginBottom: 10, overflow: "hidden",
            animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
          }}>
            {post.tag === "official" ? (
              <div style={{ background: COLORS.forest, padding: "14px 14px 12px", color: "#fff", position: "relative" }}>
                <div style={{ position: "absolute", top: 12, right: 12, background: COLORS.mint, borderRadius: 8, padding: "4px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{post.eventDate?.split(" ")[1]}</div>
                  <div style={{ fontSize: 9, opacity: 0.8, textTransform: "uppercase", letterSpacing: 0.5 }}>{post.eventDate?.split(" ")[0]}</div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.8, opacity: 0.6, textTransform: "uppercase", marginBottom: 4 }}>Management · Official</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, paddingRight: 56 }}>{post.title}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>⏰ {post.eventTime} · 📍 {post.eventLocation}</div>
                <button style={{ background: COLORS.mint, border: "none", color: "#fff", fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 20, cursor: "pointer" }}>
                  RSVP · {post.rsvpCount} going
                </button>
              </div>
            ) : (
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Avatar initials={post.initials} style={post.avatarStyle} size={28} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.text }}>{post.author}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted }}>{post.unit}</div>
                  </div>
                  <span style={{ fontSize: 10, color: COLORS.muted, marginLeft: "auto" }}>{post.time}</span>
                </div>
                <Tag type={post.tag} />
                <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>{post.body}</div>
              </div>
            )}
            <div style={{ display: "flex", gap: 16, padding: "8px 14px", borderTop: `0.5px solid ${COLORS.border}`, alignItems: "center" }}>
              <button onClick={() => toggleLike(post.id)} style={{
                background: "none", border: "none", cursor: "pointer", fontSize: 12,
                color: post.liked ? COLORS.green : COLORS.muted,
                display: "flex", alignItems: "center", gap: 4, padding: 0,
                fontWeight: post.liked ? 600 : 400,
              }}>
                {post.liked ? "❤️" : "🤍"} {post.likes}
              </button>
              <button onClick={() => setExpandedComments(c => ({ ...c, [post.id]: !c[post.id] }))}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: COLORS.muted, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                💬 {(post.comments || []).length} {(post.comments || []).length === 1 ? "reply" : "replies"}
              </button>
              {post.tag === "favor" && (
                <button style={{ marginLeft: "auto", background: COLORS.lightMint, border: "none", color: COLORS.green, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, cursor: "pointer" }}>
                  Help out →
                </button>
              )}
              {post.tag === "hangout" && (
                <button style={{ marginLeft: "auto", background: COLORS.lightBlue, border: "none", color: COLORS.blue, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, cursor: "pointer" }}>
                  I'm in ✓
                </button>
              )}
            </div>
            {expandedComments[post.id] && (
              <div style={{ padding: "0 14px 12px", borderTop: `0.5px solid ${COLORS.border}` }}>
                {(post.comments || []).map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, color: COLORS.muted, flexShrink: 0 }}>
                      {c.author[0]}
                    </div>
                    <div style={{ background: COLORS.cream, borderRadius: 10, padding: "6px 10px", flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{c.author}</div>
                      <div style={{ fontSize: 12, color: "#333" }}>{c.text}</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Avatar initials="JL" style="teal" size={24} />
                  <input
                    placeholder="Reply…"
                    value={commentInputs[post.id] || ""}
                    onChange={e => setCommentInputs(c => ({ ...c, [post.id]: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && submitComment(post.id)}
                    style={{ flex: 1, border: `0.5px solid ${COLORS.border}`, borderRadius: 20, padding: "5px 12px", fontSize: 12, outline: "none", background: COLORS.cream }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showCompose && (
        <Modal onClose={() => setShowCompose(false)}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Share with neighbors</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {["hangout", "favor", "event"].map(t => (
              <button key={t} onClick={() => setNewPost(n => ({ ...n, tag: t }))} style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
                border: `1.5px solid ${newPost.tag === t ? COLORS.green : COLORS.border}`,
                background: newPost.tag === t ? COLORS.lightMint : "#fff",
                color: newPost.tag === t ? COLORS.green : COLORS.muted,
              }}>
                {t === "hangout" ? "🏃 Hangout" : t === "favor" ? "🤝 Favor" : "📅 Event"}
              </button>
            ))}
          </div>
          <textarea
            placeholder={newPost.tag === "hangout" ? "Who's up for a hike Sunday morning?" : newPost.tag === "favor" ? "Can someone help me with…" : "I'm planning a…"}
            value={newPost.body}
            onChange={e => setNewPost(n => ({ ...n, body: e.target.value }))}
            style={{
              width: "100%", minHeight: 100, border: `0.5px solid ${COLORS.border}`,
              borderRadius: 12, padding: "10px 12px", fontSize: 14, resize: "none",
              outline: "none", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
            }}
          />
          <button onClick={submitPost} style={{
            width: "100%", marginTop: 12, padding: "12px 0",
            background: COLORS.forest, color: "#fff", border: "none",
            borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>Post to building</button>
        </Modal>
      )}
    </div>
  );
}

function EventsTab({ events, setEvents }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", location: "", description: "" });
  const [selected, setSelected] = useState(null);

  const toggleRSVP = (id) => {
    setEvents(es => es.map(e => e.id === id
      ? { ...e, rsvped: !e.rsvped, rsvpCount: e.rsvped ? e.rsvpCount - 1 : e.rsvpCount + 1 }
      : e));
  };

  const submitEvent = () => {
    if (!newEvent.title.trim()) return;
    setEvents(es => [...es, {
      id: Date.now(), ...newEvent, host: "You (Unit 4B)",
      rsvpCount: 1, rsvped: true, official: false,
    }]);
    setNewEvent({ title: "", date: "", time: "", location: "", description: "" });
    setShowCreate(false);
  };

  return (
    <div>
      <div style={{ padding: "16px 16px 10px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Events</div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>Upcoming at Maplewood</div>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          background: COLORS.lightMint, color: COLORS.green, border: "none",
          padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>+ Plan hangout</button>
      </div>

      <div style={{ padding: "10px 12px 80px" }}>
        {events.map((ev, i) => (
          <div key={ev.id} onClick={() => setSelected(ev)} style={{
            marginBottom: 10, cursor: "pointer", animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
          }}>
            {ev.official ? (
              <div style={{ background: COLORS.forest, borderRadius: 14, padding: "14px 14px 12px", color: "#fff", position: "relative" }}>
                <div style={{ position: "absolute", top: 12, right: 12, background: COLORS.mint, borderRadius: 8, padding: "4px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{ev.date.split(" ")[1]}</div>
                  <div style={{ fontSize: 9, opacity: 0.8, textTransform: "uppercase" }}>{ev.date.split(" ")[0]}</div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.8, opacity: 0.6, textTransform: "uppercase", marginBottom: 4 }}>Management</div>
                <div style={{ fontSize: 15, fontWeight: 600, paddingRight: 56, marginBottom: 4 }}>{ev.title}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>⏰ {ev.time} · 📍 {ev.location} · {ev.rsvpCount} going</div>
                <button onClick={e => { e.stopPropagation(); toggleRSVP(ev.id); }} style={{
                  background: ev.rsvped ? "#fff" : COLORS.mint, border: "none",
                  color: ev.rsvped ? COLORS.green : "#fff", fontSize: 12, fontWeight: 500,
                  padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                }}>
                  {ev.rsvped ? "✓ Going" : "RSVP"}
                </button>
              </div>
            ) : (
              <div style={{ background: "#fff", border: `0.5px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ background: COLORS.lightBlue, color: COLORS.blue, borderRadius: 10, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
                    {ev.date.split(" ")[1]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{ev.date} · {ev.time} · {ev.location}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Hosted by {ev.host} · {ev.rsvpCount} going</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleRSVP(ev.id); }} style={{
                    background: ev.rsvped ? COLORS.lightMint : COLORS.cream,
                    border: "none", color: ev.rsvped ? COLORS.green : COLORS.muted,
                    fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20, cursor: "pointer", flexShrink: 0,
                  }}>
                    {ev.rsvped ? "✓ Going" : "RSVP"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>📅 {selected.date} · {selected.time}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{selected.title}</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>📍 {selected.location} · Hosted by {selected.host}</div>
          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.6, marginBottom: 16 }}>{selected.description}</div>
          <div style={{ background: COLORS.cream, borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: COLORS.text }}>{selected.rsvpCount} neighbors going</span>
            <span style={{ fontSize: 13, color: COLORS.muted }}>Be the {selected.rsvpCount + 1}th!</span>
          </div>
          <button onClick={() => { toggleRSVP(selected.id); setSelected(null); }} style={{
            width: "100%", padding: "12px 0", background: selected.rsvped ? COLORS.cream : COLORS.forest,
            color: selected.rsvped ? COLORS.text : "#fff", border: "none", borderRadius: 12,
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            {selected.rsvped ? "Cancel RSVP" : "RSVP — I'm going!"}
          </button>
        </Modal>
      )}

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Plan a hangout</div>
          {["title", "date", "time", "location"].map(field => (
            <input key={field}
              placeholder={{ title: "What's the plan?", date: "Date (e.g. Jun 22)", time: "Time (e.g. 7:00 PM)", location: "Where?" }[field]}
              value={newEvent[field]}
              onChange={e => setNewEvent(n => ({ ...n, [field]: e.target.value }))}
              style={{ width: "100%", marginBottom: 10, border: `0.5px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none" }}
            />
          ))}
          <textarea placeholder="Tell neighbors more about it…" value={newEvent.description}
            onChange={e => setNewEvent(n => ({ ...n, description: e.target.value }))}
            style={{ width: "100%", minHeight: 80, border: `0.5px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 13, resize: "none", outline: "none", fontFamily: "inherit" }}
          />
          <button onClick={submitEvent} style={{
            width: "100%", marginTop: 12, padding: "12px 0",
            background: COLORS.forest, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>Post event</button>
        </Modal>
      )}
    </div>
  );
}

function FavorsTab({ favors, setFavors }) {
  const [filter, setFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [newFavor, setNewFavor] = useState({ title: "", detail: "", category: "Other", icon: "🤝" });
  const categories = ["All", "Pet care", "Packages", "Plants", "Other"];
  const myFavors = favors.filter(f => f.helped && f.fulfilled).length + 1;

  const help = (id) => {
    setFavors(fs => fs.map(f => f.id === id ? { ...f, helped: true, fulfilled: true } : f));
  };

  const filtered = filter === "All" ? favors : favors.filter(f => f.category === filter);

  const submitFavor = () => {
    if (!newFavor.title.trim()) return;
    setFavors(fs => [...fs, { id: Date.now(), ...newFavor, author: "You", unit: "Unit 4B", fulfilled: false, helped: false }]);
    setNewFavor({ title: "", detail: "", category: "Other", icon: "🤝" });
    setShowCreate(false);
  };

  return (
    <div>
      <div style={{ padding: "16px 16px 10px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Favor board</div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>Help a neighbor, earn good karma ✨</div>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          background: COLORS.lightAmber, color: COLORS.amber, border: "none",
          padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>+ Ask</button>
      </div>

      <div style={{ padding: "10px 12px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer",
            border: "none", background: filter === cat ? COLORS.forest : COLORS.cream,
            color: filter === cat ? "#fff" : COLORS.subtext,
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ padding: "10px 12px 80px" }}>
        {filtered.map((favor, i) => (
          <div key={favor.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 14px", background: favor.fulfilled ? COLORS.cream : "#fffdf7",
            border: `0.5px solid ${favor.fulfilled ? COLORS.border : "#f0e5b0"}`,
            borderRadius: 12, marginBottom: 8, opacity: favor.fulfilled ? 0.6 : 1,
            animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
          }}>
            <div style={{ width: 36, height: 36, background: COLORS.lightAmber, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {favor.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{favor.title}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>{favor.detail}</div>
              <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>{favor.author} · {favor.unit}</div>
            </div>
            {favor.fulfilled
              ? <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600 }}>Fulfilled ✓</span>
              : <button onClick={() => help(favor.id)} style={{
                background: COLORS.lightMint, border: "none", color: COLORS.green,
                fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20, cursor: "pointer",
              }}>Help</button>
            }
          </div>
        ))}

        <div style={{ background: COLORS.cream, borderRadius: 14, padding: "16px", textAlign: "center", marginTop: 6 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.green, lineHeight: 1 }}>{myFavors}</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>favors you've done</div>
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>You're a great neighbor 🌿</div>
        </div>
      </div>

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Ask a favor</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {["🌿", "📦", "🐾", "🔧", "🚗", "🛒", "🤝"].map(icon => (
              <button key={icon} onClick={() => setNewFavor(n => ({ ...n, icon }))} style={{
                fontSize: 20, width: 36, height: 36, borderRadius: 8, cursor: "pointer",
                border: `1.5px solid ${newFavor.icon === icon ? COLORS.green : COLORS.border}`,
                background: newFavor.icon === icon ? COLORS.lightMint : "#fff",
              }}>{icon}</button>
            ))}
          </div>
          <input placeholder="What do you need?" value={newFavor.title}
            onChange={e => setNewFavor(n => ({ ...n, title: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, border: `0.5px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none" }}
          />
          <input placeholder="Details (dates, specifics…)" value={newFavor.detail}
            onChange={e => setNewFavor(n => ({ ...n, detail: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, border: `0.5px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none" }}
          />
          <select value={newFavor.category} onChange={e => setNewFavor(n => ({ ...n, category: e.target.value }))}
            style={{ width: "100%", marginBottom: 12, border: `0.5px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", background: "#fff" }}>
            {["Pet care", "Packages", "Plants", "Other"].map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={submitFavor} style={{
            width: "100%", padding: "12px 0", background: COLORS.forest,
            color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>Post to favor board</button>
        </Modal>
      )}
    </div>
  );
}

function NeighborsTab() {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <div style={{ padding: "16px 16px 10px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Neighbors</div>
        <div style={{ fontSize: 12, color: COLORS.muted }}>23 residents · Maplewood</div>
      </div>
      <div style={{ padding: "10px 12px 80px" }}>
        <div style={{ background: COLORS.forest, borderRadius: 14, padding: "14px 16px", marginBottom: 14, color: "#fff" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Your profile</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <Avatar initials="JL" style="teal" size={44} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Jamie L.</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Unit 4B · Since 2022</div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>Tap to edit profile</div>
            </div>
          </div>
        </div>
        {NEIGHBORS.map((n, i) => (
          <div key={n.name} onClick={() => setSelected(n)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
            background: "#fff", border: `0.5px solid ${COLORS.border}`, borderRadius: 12,
            marginBottom: 8, cursor: "pointer", animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
          }}>
            <Avatar initials={n.initials} style={n.style} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{n.name}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>Unit {n.unit} · {n.bio}</div>
            </div>
            <span style={{ fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
            <Avatar initials={selected.initials} style={selected.style} size={56} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>{selected.name}</div>
              <div style={{ fontSize: 13, color: COLORS.muted }}>Unit {selected.unit} · Since {selected.since}</div>
            </div>
          </div>
          <div style={{ background: COLORS.cream, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>{selected.bio}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>🐾 {selected.pets}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "10px 0", background: COLORS.lightMint, color: COLORS.green, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              👋 Say hi
            </button>
            <button style={{ flex: 1, padding: "10px 0", background: COLORS.cream, color: COLORS.text, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              🤝 Offer favor
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("feed");
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [favors, setFavors] = useState(INITIAL_FAVORS);

  const tabs = [
    { id: "feed", icon: "🏠", label: "Feed" },
    { id: "events", icon: "📅", label: "Events" },
    { id: "favors", icon: "🤝", label: "Favors" },
    { id: "perks", icon: "🎁", label: "Perks" },
  ];

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      minHeight: "100vh", background: "#e8e6e0", padding: "24px 16px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: #bbb; }
      `}</style>

      <div style={{
        width: 375, background: "#fff", borderRadius: 40,
        boxShadow: "0 24px 80px rgba(0,0,0,0.25), 0 0 0 6px #1a1a1a, 0 0 0 7px #333",
        overflow: "hidden", position: "relative",
      }}>
        <div style={{ background: "#1a1a1a", height: 28, borderRadius: "0 0 18px 18px", width: 120, margin: "0 auto", position: "relative", zIndex: 10 }} />
        <div style={{ background: "#fff", display: "flex", justifyContent: "space-between", padding: "4px 18px", fontSize: 11, color: "#888" }}>
          <span>9:41</span><span style={{ letterSpacing: 1 }}>●●●</span>
        </div>

        <div style={{ height: "calc(100vh - 120px)", maxHeight: 680, overflowY: "auto", position: "relative" }}>
          {tab === "feed" && <FeedTab posts={posts} setPosts={setPosts} />}
          {tab === "events" && <EventsTab events={events} setEvents={setEvents} />}
          {tab === "favors" && <FavorsTab favors={favors} setFavors={setFavors} />}
          {tab === "perks" && <PerksTab />}

        </div>

        <div style={{
          display: "flex", background: "#fff", borderTop: `0.5px solid ${COLORS.border}`,
          padding: "8px 0 4px", position: "sticky", bottom: 0,
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              fontSize: 9, color: tab === t.id ? COLORS.green : "#bbb",
              background: "none", border: "none", cursor: "pointer", padding: "4px 0",
              fontFamily: "'DM Sans', sans-serif", fontWeight: tab === t.id ? 600 : 400,
              transition: "color 0.15s",
            }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
