const API_BASE = "https://party-backend-mj21.onrender.com/api";

const inputs = {
  title: document.getElementById("title"),
  location: document.getElementById("location"),
  date: document.getElementById("date"),
  time: document.getElementById("time"),
  description: document.getElementById("description"),
  heroImage: document.getElementById("previewImage"),
  imageUpload: document.getElementById("imageUpload")
};

const ticketRows = document.getElementById("ticketRows");
const publishBtn = document.getElementById("publishBtn");

// Image preview
inputs.imageUpload?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => inputs.heroImage.src = reader.result;
  reader.readAsDataURL(file);
});

// Add/Remove tickets
ticketRows.addEventListener("click", e => {
  if (e.target.classList.contains("addTicketBtn")) {
    const row = document.createElement("div");
    row.className = "ticket-row";
    row.innerHTML = `
      <input type="text" class="ticketCategory" placeholder="Ticket type">
      <input type="number" class="ticketPrice" placeholder="Price">
      <input type="text" class="ticketBenefits" placeholder="Benefits">
      <button type="button" class="removeTicket">Remove</button>
    `;
    row.querySelector(".removeTicket").addEventListener("click", () => row.remove());
    ticketRows.appendChild(row);
  }
});

// Collect form data
function collectFormData() {
  const prices = [];
  document.querySelectorAll(".ticket-row").forEach(row => {
    const type = row.querySelector(".ticketCategory")?.value.trim();
    const amount = Number(row.querySelector(".ticketPrice")?.value);
    const benefits = row.querySelector(".ticketBenefits")?.value.trim();
    if (type && amount) prices.push({ type, amount, currency: "NGN", benefits });
  });

  return {
    card: {
      title: inputs.title?.value.trim(),
      location: inputs.location?.value.trim(),
      date: inputs.date?.value,
      time: inputs.time?.value.trim(),
      image: inputs.heroImage?.src,
      peopleGoing: 0
    },
    details: {
      bannerImage: inputs.heroImage?.src,
      description: inputs.description?.value.trim(),
      venue: inputs.location?.value.trim(),
      prices,
      cta: { label: "Buy Now", action: "#" }
    }
  };
}

// Validate
function validateEvent(data) {
  if (!data.card.title) return "Title is required";
  if (!data.card.location) return "Location is required";
  if (!data.card.date) return "Date is required";
  if (!data.card.time) return "Time is required";
  if (!data.details.description) return "Description is required";
  if (data.details.prices.length === 0) return "At least one ticket is required";
  return null;
}

// Submit Event
publishBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return window.location.href = "../html/admin-login.html";

  const data = collectFormData();
  const error = validateEvent(data);
  if (error) return alert(error);

  try {
    const res = await fetch(`${API_BASE}/admin/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to create event");

    alert("Event created successfully!");
    window.location.reload();
  } catch (err) {
    console.error("Submit Error:", err);
    alert(err.message);
  }
});