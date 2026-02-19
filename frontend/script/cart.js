// ======================================
// GLOBAL STATE
// ======================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentEvent = null;
let selectedTicket = null;

// ======================================
// INITIALIZE PAGE
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  // Attach navbar cart button (removed redundant top listener)
  const navCartBtn = document.getElementById("nav-buttons");
  if (navCartBtn) {
    navCartBtn.addEventListener("click", openCartModal);
  }

  // Attach pay button listener in cart modal
  const payBtn = document.getElementById("pay-now-btn");
  if (payBtn) {
    payBtn.addEventListener("click", payWithPaystack);
  }

  // Buy buttons listeners
  const buyButtons = document.querySelectorAll('.buy-btn');
  buyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.event-card');
      currentEvent = {
        eventId: card.dataset.eventId,  // Added this
        title: card.dataset.title,
        prices: {
          regular: parseInt(card.dataset.regular),
          vip: parseInt(card.dataset.vip),
          vvip: parseInt(card.dataset.vvip)
        }
      };
      document.getElementById('eventTitle').textContent = currentEvent.title;
      document.getElementById('ticketPrice').textContent = currentEvent.prices.regular;
      document.getElementById('ticketModal').style.display = 'block';  // Updated ID
      updatePrice(); // Initial price update
    });
  });

  // Close ticket modal button
  document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('ticketModal').style.display = 'none';  // Updated ID
  });

  // Ticket type change updates price
  document.getElementById('ticketType').addEventListener('change', updatePrice);

  // Add to cart button
  document.querySelector('.add-to-cart-btn').addEventListener('click', addToCart);
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

// ======================================
// CLOSE CART MODAL (removed duplicate)
// ======================================
function closeCartModal() {
  const modal = document.getElementById("cart-modal");
  if (!modal) return;
  modal.classList.add("hidden");
}

// ======================================
// UPDATE PRICE
// ======================================
function updatePrice() {
  const type = document.getElementById('ticketType').value;
  selectedTicket = { type, amount: currentEvent.prices[type] };
  document.getElementById('ticketPrice').textContent = selectedTicket.amount;
}

// ======================================
// ADD TO CART
// ======================================
function addToCart() {
  if (!currentEvent || !selectedTicket) {
    alert("No ticket selected.");
    return;
  }

  const qtyInput = document.getElementById("quantity");
  const qty = parseInt(qtyInput ? qtyInput.value : 0);
  if (!qty || qty < 1) {
    alert("Invalid quantity.");
    return;
  }

  const existingItem = cart.find(item =>
    item.eventId === currentEvent.eventId &&
    item.type === selectedTicket.type
  );

  if (existingItem) {
    existingItem.quantity += qty;
    existingItem.total = existingItem.quantity * existingItem.amount;
  } else {
    cart.push({
      eventId: currentEvent.eventId,
      title: currentEvent.title,  // Fixed: removed .card
      type: selectedTicket.type,
      amount: selectedTicket.amount,
      quantity: qty,
      total: qty * selectedTicket.amount
    });
  }

  saveCart();
  closeTicketModal();  // Added custom close for ticket modal
  alert("Ticket added to cart.");
}

function closeTicketModal() {
  document.getElementById('ticketModal').style.display = 'none';  // Custom for ticket modal
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
// PAYSTACK PAYMENT
// ======================================
function payWithPaystack() {
  if (!Array.isArray(cart) || cart.length === 0) {
    alert("Cart is empty.");
    return;
  }
  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
  const handler = PaystackPop.setup({
    key: "pk_test_2d5d40fcadf312c919d925e001af0131cb38b259", // Test key OK for dev
    email: "kapayas090@gmai.com",
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
// HELPERS (removed unused setText, setBackground, showError)
// ======================================
function changeQuantity(delta) {  // Removed duplicate
  const input = document.getElementById("quantity");
  if (!input) return;
  let value = parseInt(input.value) || 1;
  value += delta;
  if (value < 1) value = 1;
  input.value = value;
}