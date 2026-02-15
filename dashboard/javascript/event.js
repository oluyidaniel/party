const API_BASE = "https://party-backend-mj21.onrender.com/api";

// Container where cards will be rendered
const eventsContainer = document.getElementById("eventsContainer");

// Fetch events from backend
async function fetchEvents() {
  try {
    const res = await fetch(`${API_BASE}/events`); // public GET endpoint
    const data = await res.json();

    if (!data.success) throw new Error("Failed to fetch events");

    renderEventCards(data.events);
  } catch (err) {
    console.error("Error fetching events:", err);
    eventsContainer.innerHTML = "<p>Failed to load events</p>";
  }
}

// Render events as small cards
function renderEventCards(events) {
  eventsContainer.innerHTML = ""; // clear container

  events.forEach(event => {
    const { title, location, time, date, image } = event.card;

    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <img src="${image}" alt="${title}" class="event-img">
      <div class="event-info">
        <h3 class="event-title">${title}</h3>
        <p class="event-time">${date} | ${time}</p>
        <p class="event-location">${location}</p>
      </div>
    `;

    eventsContainer.appendChild(card);
  });
}

// Call fetch on page load
fetchEvents();