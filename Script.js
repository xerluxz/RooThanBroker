const BROKERS = [
{
    id: "alphafx",
    name: "AlphaFX (Demo)",
    country: "Thailand",
    category: "forex",
    regulated: true,
    regulator: "SEC (Th)",
    audited: true,
    userReviews: 3.9,
    complaintCount: 12,
    feesTransparency: 0.9,
    kycStrictness: 0.8,
    publicFinancials: true,
    avgWithdrawTimeDays: 2,
},
{
    id: "quicktrade",
    name: "QuickTrade (Demo)",
    country: "Offshore",
    category: "crypto",
    regulated: false,
    regulator: null,
    audited: false,
    userReviews: 2.7,
    complaintCount: 68,
    feesTransparency: 0.4,
    kycStrictness: 0.3,
    publicFinancials: false,
    avgWithdrawTimeDays: 15,
},
{
    id: "secureinvest",
    name: "SecureInvest (Demo)",
    country: "Singapore",
    category: "stocks",
    regulated: true,
    regulator: "MAS",
    audited: true,
    userReviews: 4.3,
    complaintCount: 4,
    feesTransparency: 0.95,
    kycStrictness: 0.9,
    publicFinancials: true,
    avgWithdrawTimeDays: 1,
},
{
    id: "globaltrustfx",
    name: "GlobalTrustFX (Demo)",
    country: "Australia",
    category: "forex",
    regulated: true,
    regulator: "ASIC",
    audited: true,
    userReviews: 4.6,
    complaintCount: 2,
    feesTransparency: 0.92,
    kycStrictness: 0.88,
    publicFinancials: true,
avgWithdrawTimeDays: 1.5,
},

];

// Utility to compute trust score
function scoreBroker(b) {
  let s = 0;
  s += (b.regulated ? 1 : 0) * 25;
  s += ((b.audited ? 0.6 : 0) + (b.publicFinancials ? 0.4 : 0)) * 20;
  s += (Math.max(0, Math.min(5, b.userReviews)) / 5) * 20;
  const complaintsFactor = Math.max(0, 1 - Math.log10(1 + b.complaintCount) / 2);
  s += complaintsFactor * 15;
  s += ((b.feesTransparency + b.kycStrictness) / 2) * 10;
  const speedFactor = Math.max(0, 1 - Math.min(30, b.avgWithdrawTimeDays) / 30);
  s += speedFactor * 10;
  return Math.round(s);
}

function assessBroker(b) {
  const score = scoreBroker(b);
  let rec = "Neutral — ต้องตรวจสอบเพิ่มเติม";
  if (score >= 80) rec = "น่าเชื่อถือสูง — ใช้บริการได้";
  else if (score >= 60) rec = "ค่อนข้างน่าเชื่อถือ — มีข้อดีหลายอย่าง";
  else if (score >= 40) rec = "น่าสงสัย — ควรระวัง";
  else rec = "เสี่ยงสูง — หลีกเลี่ยง";
  return { score, rec };
}

// UI logic
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const brokerList = document.getElementById("brokerList");
const brokerDetail = document.getElementById("brokerDetail");

document.getElementById("searchBtn").addEventListener("click", renderList);

function renderList() {
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  let list = BROKERS.filter(b => (cat === "all" ? true : b.category === cat));
  if (q) list = list.filter(b => b.name.toLowerCase().includes(q));
  brokerList.innerHTML = "";

  list.forEach(b => {
    const { score } = assessBroker(b);
    const div = document.createElement("div");
    div.className = "broker-card";
    div.innerHTML = `
      <div class="broker-header">
        <div>
          <div class="name"><b>${b.name}</b></div>
          <div class="meta">${b.country} • ${b.category}</div>
        </div>
        <div class="broker-score">${score}</div>
      </div>
      <button class="viewBtn">Check</button>
    `;
    div.querySelector(".viewBtn").addEventListener("click", () => showDetail(b));
    brokerList.appendChild(div);
  });
}

function showDetail(b) {
  const { score, rec } = assessBroker(b);
  brokerDetail.classList.remove("hidden");
  brokerDetail.innerHTML = `
    <h3>${b.name}</h3>
    <p>${b.country} • ${b.category}</p>
    <p>Regulator: ${b.regulated ? b.regulator : "Unregulated"}</p>
    <p>คะแนนความน่าเชื่อถือ: ${score}</p>
    <p>${rec}</p>
  `;
}

// Chat demo
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

chatSend.addEventListener("click", sendChat);

function sendChat() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  appendChat("user", msg);
  chatInput.value = "";
  setTimeout(() => {
    appendChat("ai", `broker : “${msg}” — is ...`);
  }, 700);
}

function appendChat(role, text) {
  const div = document.createElement("div");
  div.className = `chat-message ${role}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Initialize list
renderList();


document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".fade-up");

  const appearOptions = {
    threshold: 0.2
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  fadeElements.forEach(el => {
    appearOnScroll.observe(el);
  });
});

document.querySelectorAll('.toggle-detail-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.broker-card');
    card.classList.toggle('show-detail');
  });
});
