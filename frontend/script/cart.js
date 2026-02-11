// ======================================
// GLOBAL STATE
// ======================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentEvent = null;
let selectedTicket = null;

document.getElementById("nav-buttons").addEventListener("click", () => {
  document.getElementById("cart-modal").classList.remove("hidden");
});
function closeCartModal() {
  document.getElementById("cart-modal").classList.add("hidden");
}
// ======================================
// INITIALIZE PAGE
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  // Attach navbar cart button
  const navCartBtn = document.getElementById("nav-buttons");
  if (navCartBtn) {
    navCartBtn.addEventListener("click", openCartModal);
  }
});

// ======================================
// OPEN CART MODAL
// ======================================
function openCartModal() {
  const modal = document.getElementById("cart-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderCart();
}

function closeCartModal() {
  const modal = document.getElementById("cart-modal");
  if (!modal) return;
  modal.classList.add("hidden");
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

  const existingItem = cart.find(item =>
    item.eventId === currentEvent.id &&
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
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = count;
}

// ======================================
// RENDER CART
// ======================================
function renderCart() {
  const summary = document.getElementById("cart-summary");
  const totalEl = document.getElementById("cart-total");

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
// PAYMENT MODAL FUNCTIONS
// ======================================
function openPaymentModal(ticket) {
  selectedTicket = ticket;

  setText("selected-ticket", ticket.type);
  setText(
    "selected-price",
    `${ticket.currency} ${ticket.amount.toLocaleString()}`
  );

  const qtyInput = document.getElementById("quantity");
  if (qtyInput) qtyInput.value = 1;

  const modal = document.getElementById("payment-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("payment-modal");
  if (modal) modal.classList.add("hidden");
}

function changeQuantity(delta) {
  const input = document.getElementById("quantity");
  if (!input) return;
  let value = parseInt(input.value) || 1;
  value += delta;
  if (value < 1) value = 1;
  input.value = value;
}

// ======================================
// PAYSTACK PAYMENT
// ======================================
function payWithPaystack() {
  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  const handler = PaystackPop.setup({
    key: "YOUR_PUBLIC_KEY", // replace with real key
    email: "customer@email.com", // replace with real email
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
// HELPER FUNCTIONS
// ======================================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}