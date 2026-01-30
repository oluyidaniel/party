const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

fetch("./script/events.json")
  .then(res => res.json())
  .then(data => {
    const event = data.events.find(e => e.id === eventId);
    if (!event) {
        document.body.innerHTML = "<h1>Event not found</h1><a href='index.html'>Go Back</a>";
        return;
    }

    document.getElementById("banner").src = event.details.bannerImage;
    document.getElementById("title").textContent = event.card.title;
    document.getElementById("description").textContent = event.details.description;
    document.getElementById("venue").textContent = "Venue: " + event.details.venue;

    const priceContainer = document.getElementById("price-container");
    event.details.prices.forEach(price => {
      const btn = document.createElement("div");
      btn.className = "price-tag";
      btn.innerHTML = `<h3>${price.type}</h3><p>${price.currency} ${price.amount.toLocaleString()}</p>`;
      btn.onclick = () => openModal(price);
      priceContainer.appendChild(btn);
    });
  });

function openModal(price) {
  document.getElementById("selected-ticket").textContent = `${price.type} Ticket`;
  document.getElementById("selected-price").textContent = `${price.currency} ${price.amount.toLocaleString()}`;
  document.getElementById("payment-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("payment-modal").style.display = "none";
}