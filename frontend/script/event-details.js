// ======================================
// GLOBAL STATE
// ======================================
let cart = [];
try {
  const saved = JSON.parse(localStorage.getItem("cart"));
  if (Array.isArray(saved)) cart = saved;
} catch (err) {
  cart = [];
}

let currentEvent = null;
let selectedTicket = null;

// ======================================
// INITIALIZE PAGE
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  loadEvent();
  updateCartCount();
  renderCart();
});

// ======================================
// LOAD SINGLE EVENT
// ======================================
async function loadEvent() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");

  if (!eventId) {
    return showError("No event selected.");
  }

  try {
    // Adjust the path to where your event.json actually lives
    const res = await fetch("./script/event.json");
    const data = await res.json();

    if (!data.events || !Array.isArray(data.events)) {
      throw new Error("Invalid event data structure");
    }

    const event = data.events.find(e => e.id === eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    currentEvent = event;
    renderEvent(event);
    renderRelatedEvents(data.events, eventId);

  } catch (err) {
    console.error(err);
    showError("Failed to load event. Make sure event.json exists and path is correct.");
  }
}

// ======================================
// RENDER EVENT DETAILS
// ======================================
function renderEvent(event) {
  setBackground("banner", event.details.bannerImage);
  setText("title", event.card.title);
  setText("description", event.details.description);
  setText("venue", event.details.venue);
  setText("location", event.card.location);
  setText("time", event.card.time);
  setText("peopleGoing", `${event.card.peopleGoing} attending`);

  const date = new Date(event.card.date);
  setText(
    "date",
    `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`
  );

  const priceContainer = document.getElementById("price-container");
  priceContainer.innerHTML = "";

  event.details.prices.forEach(ticket => {
    const div = document.createElement("div");
    div.className = "single-ticket";

    div.innerHTML = `
      <h3>${ticket.type}</h3>
      <p>${ticket.currency} ${ticket.amount.toLocaleString()}</p>
      <button>Buy</button>
    `;

    div.querySelector("button").addEventListener("click", () => {
      openPaymentModal(ticket);
    });

    priceContainer.appendChild(div);
  });
}

// ======================================
// RELATED EVENTS
// ======================================
function renderRelatedEvents(events, currentId) {
  const container = document.getElementById("related-events");
  container.innerHTML = "";

  events
    .filter(e => e.id !== currentId)
    .slice(0, 4)
    .forEach(event => {
      const card = document.createElement("div");
      card.className = "card-pin";

      card.innerHTML = `
        <img src="${event.card.image}" alt="${event.card.title}">
        <a href="./single_event.html?id=${event.id}">
          <h4>${event.card.title}</h4>
        </a>
      `;

      container.appendChild(card);
    });
}

// ======================================
// PAYMENT MODAL
// ======================================
function openPaymentModal(ticket) {
  selectedTicket = ticket;

  setText("selected-ticket", ticket.type);
  setText(
    "selected-price",
    `${ticket.currency} ${ticket.amount.toLocaleString()}`
  );

  document.getElementById("quantity").value = 1;

  document.getElementById("payment-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("payment-modal").classList.add("hidden");
}

// ======================================
// ADD TO CART
// ======================================
function addToCart() {
  if (!currentEvent || !selectedTicket) {
    alert("No ticket selected.");
    return;
  }

  const qty = parseInt(document.getElementById("quantity").value);

  if (!qty || qty < 1) {
    alert("Invalid quantity.");
    return;
  }

  // Ensure cart is always an array
  if (!Array.isArray(cart)) cart = [];

  const existingItem = cart.find(item =>
    String(item.eventId) === String(currentEvent.id) &&
    item.type === selectedTicket.type
  );

  if (existingItem) {
    existingItem.quantity += qty;
    existingItem.total = existingItem.quantity * existingItem.amount;
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

  saveCart();
  closeModal();
  alert("Ticket added to cart.");
}

// ======================================
// REMOVE FROM CART
// ======================================
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

// ======================================
// SAVE CART STATE
// ======================================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ======================================
// UPDATE CART COUNT
// ======================================
function updateCartCount() {
  if (!Array.isArray(cart)) cart = [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

// ======================================
// RENDER CART
// ======================================
function renderCart() {
  const summary = document.getElementById("cart-summary");
  const totalEl = document.getElementById("cart-total");

  summary.innerHTML = "";

  if (!Array.isArray(cart) || cart.length === 0) {
    summary.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.total;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <p><strong>${item.title}</strong></p>
      <p>${item.type} × ${item.quantity}</p>
      <p>NGN ${item.total.toLocaleString()}</p>
      <button onclick="removeFromCart(${index})">Remove</button>
      <hr/>
    `;

    summary.appendChild(div);
  });

  totalEl.textContent = `Total: NGN ${total.toLocaleString()}`;
}

// ======================================
// CART MODAL
// ======================================
function openCartModal() {
  document.getElementById("cart-modal").classList.remove("hidden");
  renderCart();
}

function closeCartModal() {
  document.getElementById("cart-modal").classList.add("hidden");
}

// ======================================
// PAYSTACK PAYMENT
// ======================================
function payWithPaystack() {
  if (!Array.isArray(cart) || cart.length === 0) {
    alert("Cart is empty.");
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  const handler = PaystackPop.setup({
    key: "sk_test_31d1a128e7062e28e56a689d7e5a80a5d5777ca2", // Replace with your real key
    email: "kapayas090@gmail.com", // Replace with real user email
    amount: totalAmount * 100,
    currency: "NGN",
    ref: "EVT_" + Date.now(),

    callback: function (response) {
      alert("Payment successful! Ref: " + response.reference);

      cart = [];
      saveCart();
      closeCartModal();
    },

    onClose: function () {
      alert("Transaction cancelled.");
    }
  });

  handler.openIframe();
}

// ======================================
// HELPERS
// ======================================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setBackground(id, url) {
  const el = document.getElementById(id);
  if (el) el.style.backgroundImage = `url(${url})`;
}

function showError(message) {
  document.body.innerHTML = `
    <h2 style="color:red;text-align:center;margin-top:50px;">
      ${message}
    </h2>
  `;
}

function changeQuantity(delta) {
  const input = document.getElementById("quantity");
  let value = parseInt(input.value) || 1;
  value += delta;
  if (value < 1) value = 1;
  input.value = value;
}