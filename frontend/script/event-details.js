// ===============================
// GLOBAL STATE
// ===============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentEvent = null;
let selectedTicket = null;

// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadSingleEvent();
  updateCartCount();
  renderCart();
});

// ===============================
// LOAD SINGLE EVENT
// ===============================
async function loadSingleEvent() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    showError("No event selected");
    return;
  }

  try {
    const response = await fetch("./script/event.json");
    if (!response.ok) throw new Error("Failed to load event.json");

    const data = await response.json();
    if (!data.events || !Array.isArray(data.events)) throw new Error("Invalid event data structure");

    const event = data.events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");

    currentEvent = event;
    renderEvent(event);
    renderRelatedEvents(data.events, eventId);

  } catch (error) {
    console.error(error);
    showError(error.message);
  }
}

// ===============================
// RENDER EVENT
// ===============================
function renderEvent(event) {
  setBackground("banner", event.details.bannerImage);
  setText("title", event.card.title);
  setText("description", event.details.description);
  setText("venue", event.details.venue);
  setText("location", event.card.location);
  setText("time", event.card.time);
  setText("peopleGoing", `${event.card.peopleGoing} attending`);

  const date = new Date(event.card.date);
  setText("date", `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`);

  const priceBox = document.getElementById("price-container");
  if (!priceBox) return;
  priceBox.innerHTML = "";

  event.details.prices.forEach((price, index) => {
    const div = document.createElement("div");
    div.className = "single-ticket";

    div.innerHTML = `
      <h3>${price.type}</h3>
      <p>${price.currency} ${price.amount.toLocaleString()}</p>
      <button type="button">Buy</button>
    `;

    div.querySelector("button").addEventListener("click", () => openModal(price));
    priceBox.appendChild(div);
  });
}

// ===============================
// RELATED EVENTS
// ===============================
function renderRelatedEvents(events, currentId) {
  const box = document.getElementById("related-events");
  if (!box) return;
  box.innerHTML = "";

  events.filter(e => e.id !== currentId).slice(0, 4).forEach(event => {
    const card = document.createElement("div");
    card.className = "card-pin";
    card.innerHTML = `
      <img src="${event.card.image}" alt="${event.card.title}">
      <a href="./single_event.html?id=${event.id}">
        <h4>${event.card.title}</h4>
      </a>
    `;
    box.appendChild(card);
  });
}

// ===============================
// MODAL
// ===============================
function openModal(ticket) {
  selectedTicket = ticket;

  setText("selected-ticket", ticket.type);
  setText("selected-price", `${ticket.currency} ${ticket.amount.toLocaleString()}`);

  const qtyInput = document.getElementById("quantity");
  if (qtyInput) qtyInput.value = 1;

  const modal = document.getElementById("payment-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("payment-modal");
  if (modal) modal.classList.add("hidden");
}

// ===============================
// CART FUNCTIONS
// ===============================
function addToCart() {
  if (!currentEvent || !selectedTicket) {
    alert("No ticket selected");
    return;
  }

  const qty = Number(document.getElementById("quantity").value) || 1;

  const existing = cart.find(i => i.eventId === currentEvent.id && i.type === selectedTicket.type);
  if (existing) {
    existing.quantity += qty;
    existing.total = existing.amount * existing.quantity;
  } else {
    cart.push({
      eventId: currentEvent.id,
      title: currentEvent.card.title,
      type: selectedTicket.type,
      amount: selectedTicket.amount,
      quantity: qty,
      total: qty * selectedTicket.amount
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
  closeModal();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

function renderCart() {
  const summary = document.getElementById("cart-summary");
  const totalEl = document.getElementById("cart-total");
  if (!summary || !totalEl) return;

  summary.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    summary.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "";
    return;
  }

  cart.forEach((item, i) => {
    total += item.total;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <p>${item.title} - ${item.type} x ${item.quantity} = NGN ${item.total.toLocaleString()}</p>
      <button type="button" onclick="removeFromCart(${i})">Remove</button>
    `;
    summary.appendChild(div);
  });

  totalEl.textContent = `Total: NGN ${total.toLocaleString()}`;
}

function openCartModal() {
  const modal = document.getElementById("cart-modal");
  if (modal) modal.classList.remove("hidden");
  renderCart();
}

function closeCartModal() {
  const modal = document.getElementById("cart-modal");
  if (modal) modal.classList.add("hidden");
}

// ===============================
// PAYSTACK PAYMENT
// ===============================
function payWithPaystack() {
  if (cart.length === 0) return alert("Cart is empty!");

  const total = cart.reduce((sum, item) => sum + item.total, 0) * 100; // kobo

  const handler = PaystackPop.setup({
    key: "YOUR_PUBLIC_KEY", // replace with your key
    email: "customer@example.com", // replace with user email
    amount: total,
    currency: "NGN",
    onClose: function () {
      alert("Transaction was not completed.");
    },
    callback: function (response) {
      alert("Payment successful! Ref: " + response.reference);
      cart = [];
      localStorage.removeItem("cart");
      updateCartCount();
      renderCart();
      closeCartModal();
    },
  });

  handler.openIframe();
}

// ===============================
// HELPER FUNCTIONS
// ===============================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setBackground(id, url) {
  const el = document.getElementById(id);
  if (el) el.style.backgroundImage = `url(${url})`;
}

function showError(msg) {
  document.body.innerHTML = `<h2 style="color:red;text-align:center;margin-top:50px;">${msg}</h2>`;
}

function changeQuantity(delta) {
  const qtyInput = document.getElementById("quantity");
  if (!qtyInput) return;
  let qty = Number(qtyInput.value) || 1;
  qty += delta;
  if (qty < 1) qty = 1;
  qtyInput.value = qty;
}