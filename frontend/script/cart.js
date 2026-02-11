// ======================================
// GLOBAL CART STATE
// ======================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedTicket = null;
let currentEvent = null;

// ======================================
// SAVE CART TO LOCALSTORAGE
// ======================================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ======================================
// UPDATE CART COUNT (NAVBAR OR ANYWHERE)
// ======================================
function updateCartCount(navCountId = "cart-count") {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById(navCountId);
  if (el) el.textContent = count;
}

// ======================================
// RENDER CART IN MODAL OR CONTAINER
// ======================================
function renderCart(summaryId = "cart-summary", totalId = "cart-total") {
  const summary = document.getElementById(summaryId);
  const totalEl = document.getElementById(totalId);

  if (!summary || !totalEl) return;

  summary.innerHTML = "";

  if (cart.length === 0) {
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
// ADD TICKET TO CART
// ======================================
function addToCart(eventObj, ticket, quantity = 1) {
  if (!eventObj || !ticket) {
    alert("No ticket selected.");
    return;
  }

  const existingItem = cart.find(
    item => item.eventId === eventObj.id && item.type === ticket.type
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.total = existingItem.quantity * existingItem.amount;
  } else {
    cart.push({
      eventId: eventObj.id,
      title: eventObj.card.title,
      type: ticket.type,
      amount: ticket.amount,
      quantity: quantity,
      total: ticket.amount * quantity
    });
  }

  saveCart();
  alert("Ticket added to cart.");
}

// ======================================
// REMOVE ITEM FROM CART
// ======================================
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

// ======================================
// OPEN/CLOSE CART MODAL
// ======================================
function openCartModal(modalId = "cart-modal") {
  const modal = document.getElementById(modalId);
  if (modal) {
    renderCart(); // always refresh cart
    modal.classList.remove("hidden");
  }
}

function closeCartModal(modalId = "cart-modal") {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
}

// ======================================
// QUANTITY HELPER
// ======================================
function changeQuantity(inputId = "quantity", delta = 1) {
  const input = document.getElementById(inputId);
  if (!input) return;

  let value = parseInt(input.value) || 1;
  value += delta;
  if (value < 1) value = 1;
  input.value = value;
}

// ======================================
// INITIALIZE NAVBAR CART COUNT ON PAGE LOAD
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount("cart-count"); // default id
});