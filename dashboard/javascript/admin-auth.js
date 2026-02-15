// ===============================
// CONFIG
// ===============================
const AUTH_API = "https://party-backend-mj21.onrender.com/api/auth";

// ===============================
// ELEMENTS
// ===============================
const loginForm = document.getElementById("loginForm");
const feedbackModal = document.getElementById("feedbackModal");
const feedbackMessage = document.getElementById("feedbackMessage");

// ===============================
// UI HELPERS
// ===============================
function showFeedback(message) {
  feedbackMessage.textContent = message;
  feedbackModal.classList.remove("hidden");
}

function closeFeedbackModal() {
  feedbackModal.classList.add("hidden");
}

// ===============================
// ADMIN LOGIN
// ===============================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showFeedback("Email and password are required");
    return;
  }

  try {
    const response = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showFeedback(data.message || "Login failed");
      return;
    }

    if (!data.user.isAdmin) {
      showFeedback("This account is not an admin.");
      return;
    }

    // ✅ Store token
    localStorage.setItem("adminToken", data.token);

    // ✅ Store full user object
    localStorage.setItem("adminUser", JSON.stringify(data.user));

    // ✅ Store just the name (for header display)
    localStorage.setItem("adminName", data.user.name);

    showFeedback("Login successful! Redirecting...");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1200);

  } catch (error) {
    console.error(error);
    showFeedback("Server error. Please try again.");
  }
});