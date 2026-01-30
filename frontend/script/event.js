fetch("./script/event.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("events-container");
    data.events.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
       <img 
    src="${event.card.image}" 
    alt="${event.card.title}" 
    width="250" 
    height="150" 
    style="object-fit: cover;"
  >
        <div class="event-card-body">
          <h3>${event.card.title}</h3>
          <p>📍 ${event.card.location}</p>
          <p>📅 ${event.card.date} • ${event.card.time}</p>
          <small>👥 ${event.card.peopleGoing} attending</small>
        </div>
      `;
      card.onclick = () => window.location.href = `event.html?id=${event.id}`;
      container.appendChild(card);
    });
  })
  .catch(err => console.error("Error loading events:", err));