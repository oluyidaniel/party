// ===============================
// CONFIG
// ===============================
const API_BASE = "https://party-backend-mj21.onrender.com/api";

/* ---------------- AUTH GUARD ---------------- */

function requireUserAuth() {
  const token = localStorage.getItem("userToken"); // must match what you store at login

  if (!token) {
    alert("Please login to continue.");
    window.location.href = "../html/admin-login.html";
    return false;
  }

  return true;
}

if (!requireUserAuth()) {
  throw new Error("User not authenticated");
}

// ===============================
// DISPLAY ADMIN NAME
// ===============================
function displayAdminName() {
  const name = localStorage.getItem("adminName");
  const welcomeText = document.getElementById("welcomeText");

  if (name && welcomeText) {
    welcomeText.textContent = `Welcome ${name}`;
  }
}

displayAdminName();

// ===============================
// ELEMENTS
// ===============================
const inputs = {
  title: document.getElementById("title"),
  location: document.getElementById("location"),
  price: document.getElementById("price"),
  time: document.getElementById("time"),
  description: document.getElementById("description"),
  heroImage: document.getElementById("previewImage"),
  imageUpload: document.getElementById("imageUpload")
};

const publishBtn = document.getElementById("publishBtn");
const previewBtn = document.querySelector(".spe");
const ticketContainer = document.querySelector(".ticket-input");
const addTicketBtn = document.getElementById("add");

// ===============================
// IMAGE PREVIEW
// ===============================
if (inputs.imageUpload) {
  inputs.imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      inputs.heroImage.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ===============================
// ADD TICKET
// ===============================
function createTicketForm() {
  const wrapper = document.createElement("div");
  wrapper.className = "form-set";

  wrapper.innerHTML = `
    <div class="row">
      <input class="ticketCategory" type="text" placeholder="Ticket category">
      <input class="ticketPrice" type="number" placeholder="Ticket price">
    </div>
    <input class="ticketBenefits" type="text" placeholder="Benefits">
    <button type="button" class="removeTicket">Remove</button>
  `;

  wrapper.querySelector(".removeTicket").addEventListener("click", () => {
    wrapper.remove();
  });

  return wrapper;
}

if (addTicketBtn) {
  addTicketBtn.addEventListener("click", (e) => {
    e.preventDefault();
    ticketContainer.appendChild(createTicketForm());
  });
}

// ===============================
// COLLECT DATA
// ===============================
function collectFormData() {
  const tickets = [];

  document.querySelectorAll(".form-set").forEach((form) => {
    const category = form.querySelector(".ticketCategory")?.value.trim();
    const price = form.querySelector(".ticketPrice")?.value.trim();
    const benefits = form.querySelector(".ticketBenefits")?.value.trim() || "";

    if (category && price) {
      tickets.push({
        category,
        price: Number(price),
        benefits
      });
    }
  });

  return {
    title: inputs.title?.value.trim(),
    location: inputs.location?.value.trim(),
    price: Number(inputs.price?.value),
    time: inputs.time?.value.trim(),
    description: inputs.description?.value.trim(),
    heroImage: inputs.heroImage?.src,
    tickets
  };
}

// ===============================
// VALIDATION
// ===============================
function validateEvent(data) {
  if (!data.title) return "Title is required";
  if (!data.location) return "Location is required";
  if (!data.price) return "Price is required";
  if (!data.time) return "Time is required";
  if (!data.description) return "Description is required";
  return null;
}

// ===============================
// PREVIEW
// ===============================
if (previewBtn) {
  previewBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Preview:", collectFormData());
    alert("Check console for preview data.");
  });
}

// ===============================
// PUBLISH EVENT
// ===============================
if (publishBtn) {
  publishBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "../html/admin-login.html";
      return;
    }

    const eventData = collectFormData();
    const error = validateEvent(eventData);

    if (error) {
      alert(error);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create event");
      }

      alert("Event created successfully!");
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}