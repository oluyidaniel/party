const API_BASE = "http://localhost:5000/api";

const eventsContainer = document.getElementById("eventsContainer");
const totalEventsEl = document.getElementById("totalEvents");
const upcomingEventsEl = document.getElementById("upcomingEvents");
const pastEventsEl = document.getElementById("pastEvents");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const carousel = document.querySelector(".carousel");

/* ---------------- FETCH EVENTS ---------------- */

async function loadEvents() {
  try {
    const res = await fetch(`${API_BASE}/events`);
    const events = await res.json();

    renderEvents(events);
    updateAnalytics(events);
  } catch (err) {
    console.error("Failed loading events:", err);
  }
}

/* ---------------- RENDER EVENTS ---------------- */

function renderEvents(events) {
  eventsContainer.innerHTML = "";

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "card orange";

    const dateStr = formatDate(event.card?.date, event.card?.time);

    card.innerHTML = `
      <div class="top--love">
        <img src="${event.card?.image || './image/img card 1.svg'}" class="pix-1">
        <i class="fa-solid fa-heart love"></i>
      </div>

      <h6 class="text">Event</h6>

      <h4>${event.card?.title || "Untitled Event"}</h4>

      <div class="pad">
        <img src="./image/date 1.svg">
        <span>${dateStr}</span>
      </div>

      <br>

      <div class="pad">
        <img src="./image/location1.png">
        <span>${event.card?.location || "No location"}</span>
      </div>

      <div class="pad1">
        <img src="./image/group img.png">
        ${event.card?.peopleGoing || 0} people going
      </div>
    `;

    card.onclick = () => {
      localStorage.setItem("selectedEvent", JSON.stringify(event));
      window.location.href = "/App/html/single-event.html";
    };

    eventsContainer.appendChild(card);
  });
}

/* ---------------- ANALYTICS ---------------- */

function updateAnalytics(events) {
  const now = new Date();

  let upcoming = 0;
  let past = 0;

  events.forEach(e => {
    const eventDate = new Date(e.card?.date);
    if (eventDate >= now) upcoming++;
    else past++;
  });

  totalEventsEl.textContent = events.length;
  upcomingEventsEl.textContent = upcoming;
  pastEventsEl.textContent = past;
}

/* ---------------- CAROUSEL NAVIGATION ---------------- */

nextBtn.addEventListener("click", () => {
  carousel.scrollBy({ left: 300, behavior: "smooth" });
});

prevBtn.addEventListener("click", () => {
  carousel.scrollBy({ left: -300, behavior: "smooth" });
});

/* ---------------- CREATE EVENT BUTTON ---------------- */

document.querySelector(".create-btn").addEventListener("click", () => {
  window.location.href = "/App/html/create-event.html";
});

/* ---------------- UTIL ---------------- */

function formatDate(date, time) {
  if (!date) return "No date";
  const d = new Date(date);
  return `${d.toDateString()} ${time || ""}`;
}

/* ---------------- INIT ---------------- */

loadEvents();