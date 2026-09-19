const CONFIG = {
  formspreeUrl: "https://formspree.io/f/xkjgowyo",
  sheetUrl: "",
  emailDest: "you@example.com",
  useFormSubmit: false,
  redirectUrl: "https://www.google.com",
};

const teams = [
  { name: "Mercedes", color: "#27f4d2", points: 425, drivers: ["George Russell", "Andrea Kimi Antonelli"] },
  { name: "Ferrari", color: "#e80020", points: 338, drivers: ["Lewis Hamilton", "Charles Leclerc"] },
  { name: "McLaren", color: "#ff8000", points: 263, drivers: ["Lando Norris", "Oscar Piastri"] },
  { name: "Red Bull", color: "#3671c6", points: 186, drivers: ["Max Verstappen", "Liam Lawson"] },
  { name: "Racing Bulls", color: "#6692ff", points: 66, drivers: ["Yuki Tsunoda", "Arvid Lindblad"] },
  { name: "Alpine", color: "#ff87bc", points: 63, drivers: ["Pierre Gasly", "Franco Colapinto"] },
  { name: "Haas", color: "#b6babb", points: 21, drivers: ["Esteban Ocon", "Oliver Bearman"] },
  { name: "Audi", color: "#f50537", points: 16, drivers: ["Nico Hulkenberg", "Gabriel Bortoleto"] },
  { name: "Williams", color: "#67c1e8", points: 11, drivers: ["Alexander Albon", "Carlos Sainz"] },
  { name: "Aston Martin", color: "#229971", points: 3, drivers: ["Fernando Alonso", "Lance Stroll"] },
  { name: "Cadillac", color: "#c9a05a", points: 0, drivers: ["Valtteri Bottas", "Sergio Perez"] },
];

const container = document.getElementById("team-container");
for (const team of teams) {
  const card = document.createElement("article");
  card.className = "team-card";
  card.style.setProperty("--color", team.color);
  const drivers = team.drivers
    .map((d) => {
      const badge = d.split(" ").map((w) => w[0]).join("").slice(0, 3);
      return `<div class="driver"><span class="driver-badge">${badge}</span><span>${d}</span></div>`;
    })
    .join("");
  card.innerHTML = `
    <div class="team-name">${team.name}</div>
    <div class="team-points">${team.points} pts</div>
    <div class="drivers">${drivers}</div>`;
  container.appendChild(card);
}

const statNumbers = document.querySelectorAll(".stat-number");
const statObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      statObserver.unobserve(el);
      const target = +el.dataset.target;
      const start = performance.now();
      const dur = 1400;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  },
  { threshold: 0.4 }
);
for (const el of statNumbers) statObserver.observe(el);

const fixedCar = document.querySelector(".fixed-car");
const track = document.querySelector(".race-track");
const flag = document.querySelector(".flag");
const chequered = document.querySelector(".chequered");
const finishMsg = document.getElementById("finish-message");

const trackTop = () => track.getBoundingClientRect().top + window.scrollY;
const trackHeight = () => track.offsetHeight;

function flagWave() {
  if (flag.classList.contains("wave")) return;
  flag.classList.add("wave");
  setTimeout(() => flag.classList.remove("wave"), 1100);
}

window.addEventListener("scroll", () => {
  const top = trackTop();
  const height = trackHeight();
  const scrollY = window.scrollY;
  const start = top - window.innerHeight * 0.3;
  const end = top + height - window.innerHeight;
  const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);
  fixedCar.style.transform = `translateY(${progress * (window.innerHeight - 120)}px)`;
  if (progress >= 1 && !finishMsg.classList.contains("show")) {
    finishMsg.classList.add("show");
    flagWave();
    confetti();
  }
});

function confetti() {
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("div");
    c.style.cssText = `position:fixed;left:${Math.random() * 100}vw;top:-12px;width:8px;height:8px;background:${pick([
      "#e10600", "#ffd700", "#27f4d2", "#ffffff", "#ff8000",
    ])};border-radius:${Math.random() > 0.5 ? "50%" : "2px"};z-index:9999;pointer-events:none;`;
    document.body.appendChild(c);
    c.animate(
      [
        { transform: `translateY(0) rotate(0)`, opacity: 1 },
        { transform: `translateY(${window.innerHeight + 20}px) rotate(${360 + Math.random() * 500}deg)`, opacity: 0.9 },
      ],
      { duration: 1800 + Math.random() * 1200, easing: "cubic-bezier(0.2,0.8,0.4,1)" }
    );
    setTimeout(() => c.remove(), 3200);
  }
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const reviews = [
  { stars: 5, text: "Finally all 11 teams and every driver in one place. It loads fast and looks insane on my phone.", author: "Aisha M." },
  { stars: 5, text: "Scrolling the car down to the flag actually made me cheer out loud in my office. 10/10.", author: "Diego R." },
  { stars: 5, text: "The animations are so smooth. My whole karting crew uses this before every race weekend.", author: "Lena K." },
  { stars: 4, text: "Great site! I just wish I could favourite my driver. Seeing the grid at a glance is priceless.", author: "Tom H." },
  { stars: 5, text: "Perfect for newcomers — my dad finally learned who drives for who. Build one for every sport!", author: "Sara V." },
];

const carouselTrack = document.getElementById("carousel-track");
for (const review of reviews) {
  const slide = document.createElement("article");
  slide.className = "review";
  slide.innerHTML = `
    <div class="review-stars">${"&#9733;".repeat(review.stars)}</div>
    <p class="review-text">${review.text}</p>
    <div class="review-author">— ${review.author}</div>`;
  carouselTrack.appendChild(slide);
}

const dotsWrap = document.getElementById("carousel-dots");
let current = 0;
for (let i = 0; i < reviews.length; i++) {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Go to review ${i + 1}`);
  dot.addEventListener("click", () => go(i));
  dotsWrap.appendChild(dot);
}

function go(i) {
  current = (i + reviews.length) % reviews.length;
  carouselTrack.style.transform = `translateX(-${current * 100}%)`;
  document.querySelectorAll(".dot").forEach((d, idx) => d.classList.toggle("active", idx === current));
}

document.querySelector(".prev").addEventListener("click", () => go(current - 1));
document.querySelector(".next").addEventListener("click", () => go(current + 1));

setInterval(() => go(current + 1), 4500);

const form = document.getElementById("signup-form");
const emailInput = document.getElementById("email-input");
const formMsg = document.getElementById("form-message");

function storeEmails(email, valid) {
  try {
    const all = JSON.parse(localStorage.getItem("paddock_emails") || "[]");
    all.push({ email, valid, at: new Date().toISOString() });
    localStorage.setItem("paddock_emails", JSON.stringify(all));
  } catch (e) {}
}

function setMsg(text, type) {
  formMsg.textContent = text;
  formMsg.className = "form-message " + (type || "");
}

async function sendToSheet(email, valid) {
  const payload = {
    email,
    valid: !!valid,
    page: location.href,
    referrer: document.referrer || "direct",
    time: new Date().toISOString(),
  };

  if (CONFIG.formspreeUrl) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(CONFIG.formspreeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) return true;
      } catch (err) {
        if (attempt === 3) return false;
        await new Promise((r) => setTimeout(r, 700 * attempt));
      }
    }
    return false;
  }

  if (CONFIG.sheetUrl) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await fetch(CONFIG.sheetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
        return true;
      } catch (err) {
        if (attempt === 3) return false;
        await new Promise((r) => setTimeout(r, 700 * attempt));
      }
    }
  }

  if (CONFIG.useFormSubmit && CONFIG.emailDest !== "you@example.com") {
    try {
      await fetch(`https://formsubmit.co/ajax/${CONFIG.emailDest}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  return false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const valid = emailInput.validity.valid && email !== "";
  storeEmails(email, valid);

  if (!valid) {
    emailInput.classList.add("invalid");
    setMsg("Please enter a valid email address first.", "bad");
    setTimeout(() => emailInput.classList.remove("invalid"), 500);
    if (email) sendToSheet(email, false);
    return;
  }

  form.reset();
  setMsg("Redirecting...", "");
  const ok = await sendToSheet(email, true);
  if (!ok) {
    setMsg("Something went wrong. Please try again.", "bad");
    return;
  }
  setTimeout(() => {
    window.location.href = CONFIG.redirectUrl;
  }, 800);
});

const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15 }
);
for (const el of revealEls) revealObserver.observe(el);

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});