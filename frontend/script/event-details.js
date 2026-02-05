// ==============================
// Carousel
// ==============================
function scrollCarousel(amount) {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;
  carousel.scrollBy({ left: amount, behavior: "smooth" });
}

// ==============================
// Global State
// ==============================
let cart = [];
let currentEvent = null;
let currentSelection = null;

// ==============================
// DOM Ready
// ==============================
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    document.body.innerHTML = "<h2>No event selected</h2>";
    return;
  }

  try {
    const res = await fetch("./script/event.json");
    if (!res.ok) throw new Error("Failed to load JSON");

    const data = await res.json();
    const event = data.events.find(e => e.id === eventId);

    if (!event) {
      document.body.innerHTML = "<h2>Event not found</h2>";
      return;
    }

    currentEvent = event;
    populateEvent(event);
    renderRelated(data.events, eventId);

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartCount();
    }

  } catch (err) {
    console.error(err);
    document.body.innerHTML = "<h2>Error loading event</h2>";
  }
});

// ==============================
// Populate Event
// ==============================
function populateEvent(event) {
  document.getElementById("banner").style.backgroundImage =
    `linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)), url(${event.details.bannerImage})`;

  document.getElementById("title").textContent = event.card.title;
  document.getElementById("description").textContent = event.details.description;
  document.getElementById("venue").textContent = `Venue: ${event.details.venue}`;
  document.getElementById("location").textContent = event.card.location;
  document.getElementById("time").textContent = event.card.time;
  document.getElementById("peopleGoing").textContent = `${event.card.peopleGoing} Going`;

  const date = new Date(event.card.date);
  document.getElementById("date").textContent =
    `${date.getDate()}\n${date.toLocaleString("default", { month: "short" }).toUpperCase()}`;

  const priceContainer = document.getElementById("price-container");
  priceContainer.innerHTML = "";

  event.details.prices.forEach(price => {
    const div = document.createElement("div");
    div.className = "single-ticket";
    div.innerHTML = `
      <h3>${price.type}</h3>
      <p>${price.currency} ${price.amount.toLocaleString()}</p>
      <button onclick='openModal(${JSON.stringify(price)})'>Buy Now</button>
    `;
    priceContainer.appendChild(div);
  });
}

// ==============================
// Related Events
// ==============================
function renderRelated(events, currentId) {
  const container = document.getElementById("related-events");
  container.innerHTML = "";

  events.filter(e => e.id !== currentId).slice(0, 4).forEach(e => {
    const card = document.createElement("div");
    card.className = "card-pin";
    card.innerHTML = `
      <img src="${e.card.image}">
      <a href="event-details.html?id=${e.id}">
        <h3>${e.card.title}</h3>
      </a>
      <p>${e.card.location}</p>
    `;
    container.appendChild(card);
  });
}

// ==============================
// Modal
// ==============================
function openModal(price) {
  currentSelection = price;
  document.getElementById("selected-ticket").textContent = price.type;
  document.getElementById("selected-price").textContent =
    `${price.currency} ${price.amount.toLocaleString()}`;
  document.getElementById("quantity").value = 1;
  document.getElementById("payment-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("payment-modal").classList.add("hidden");
}

// ==============================
// Cart
// ==============================
function changeQuantity(delta) {
  const input = document.getElementById("quantity");
  input.value = Math.max(1, Number(input.value) + delta);
}

function addToCart() {
  const qty = Number(document.getElementById("quantity").value);

  const item = {
    eventId: currentEvent.id,
    title: currentEvent.card.title,
    type: currentSelection.type,
    amount: currentSelection.amount,
    currency: currentSelection.currency,
    quantity: qty,
    total: qty * currentSelection.amount
  };

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  closeModal();
}

function updateCartCount() {
  document.getElementById("cart-count").textContent =
    cart.reduce((sum, i) => sum + i.quantity, 0);
}

function openCartModal() {
  renderCart();
  document.getElementById("cart-modal").classList.remove("hidden");
}

function closeCartModal() {
  document.getElementById("cart-modal").classList.add("hidden");
}

function renderCart() {
  const summary = document.getElementById("cart-summary");
  summary.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.total;
    summary.innerHTML += `
      <div>
        ${item.quantity} x ${item.type} — ${item.currency} ${item.total}
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
  });

  document.getElementById("cart-total").textContent =
    `Total: NGN ${total.toLocaleString()}`;
}

function removeFromCart(i) {
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}
