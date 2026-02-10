const API_BASE = "http://localhost:5000/api";

/* ---------------- AUTH GUARD ---------------- */

// Expect token saved after login as: localStorage.setItem("token", token)
const token = localStorage.getItem("token");

if (!token) {
  alert("You must login first");
  window.location.href = "./html/admin-login.html";
}

/* ---------------- IMAGE PREVIEW + BASE64 ---------------- */

let heroImageBase64 = "";

const imageInput = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    heroImageBase64 = reader.result;
    previewImage.src = heroImageBase64;
  };
  reader.readAsDataURL(file);
});

/* ---------------- COLLECT DATA + POST ---------------- */

document.getElementById("publishBtn").addEventListener("click", createEvent);

async function createEvent() {
  const title = document.getElementById("title").value;
  const location = document.getElementById("location").value;
  const price = document.getElementById("price").value;
  const time = document.getElementById("time").value;
  const description = document.getElementById("description").value;

  const ticketCategory = document.getElementById("ticketCategory").value;
  const ticketPrice = document.getElementById("ticketPrice").value;
  const ticketBenefits = document.getElementById("ticketBenefits").value;

  const payload = {
    eventId: "evt_" + Date.now(),
    card: {
      title,
      location,
      date: new Date().toISOString().split("T")[0],
      time,
      image: heroImageBase64,
      peopleGoing: 0
    },
    details: {
      bannerImage: heroImageBase64,
      description,
      venue: location,
      prices: [
        {
          type: ticketCategory,
          amount: Number(ticketPrice),
          currency: "USD",
          benefits: ticketBenefits
        }
      ],
      cta: {
        label: "Register Now",
        action: "#"
      }
    }
  };

  try {
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create event");
      return;
    }

    alert("Event created successfully");
    window.location.href = "/admin-dashboard.html";
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}