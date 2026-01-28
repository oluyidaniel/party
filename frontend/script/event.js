fetch("./event.json")
  .then(res => res.json())
  .then(data => {
    if (document.getElementById("events-container")) {
      renderCards(data.events);
    }

    if (document.getElementById("event-details")) {
      renderEventDetails(data.events);
    }
  });

function renderCards(events) {
  const container = document.getElementById("events-container");

  events.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <img src="${event.card.image}" alt="${event.card.title}">
      <div class="card-body">
        <h3>${event.card.title}</h3>
        <p>${event.card.location}</p>
        <p>${event.card.date} • ${event.card.time}</p>
        <span>${event.card.peopleGoing} going</span>
      </div>
    `;

    card.onclick = () => {
      window.location.href = `event.html?id=${event.id}`;
    };

    container.appendChild(card);
  });
}

function renderEventDetails(events) {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const event = events.find(e => e.id === eventId);

  if (!event) return;

  const container = document.getElementById("event-details");
  container.innerHTML = `
    <img class="banner" src="${event.details.bannerImage}">
    <div class="details-content">
      <h1>${event.card.title}</h1>
      <p class="meta">
        ${event.card.location} • ${event.card.date} • ${event.card.time}
      </p>
      <p class="description">${event.details.description}</p>

      <h3>Tickets</h3>
      <div class="prices">
        ${event.details.prices.map(p => `
          <div class="price-card">
            <h4>${p.type}</h4>
            <p>₦${p.amount.toLocaleString()}</p>
            <button>Buy Now</button>
          </div>
        `).join("")}
      </div>
          <div> </div>
    </div>
  `;
}
