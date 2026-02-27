// ===============================
// ELEMENTS
// ===============================
const loginForm = document.getElementById("loginForm");
const feedbackModal = document.getElementById("feedbackModal");
const feedbackMessage = document.getElementById("feedbackMessage");
const spinner = document.getElementById("spinner");

// ===============================
// UI HELPERS
// ===============================
function showFeedback(message) {
  feedbackMessage.textContent = message;
  feedbackModal.classList.remove("hidden");
  feedbackModal.classList.add("show");
  setTimeout(() => closeFeedbackModal(), 2500);
}

function closeFeedbackModal() {
  feedbackModal.classList.remove("show");
  setTimeout(() => feedbackModal.classList.add("hidden"), 300);
}

function showSpinner() {
  spinner.classList.remove("hidden");
}

function hideSpinner() {
  spinner.classList.add("hidden");
}

// ===============================
// ADMIN LOGIN
// ===============================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent page reload

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showFeedback("Email and password are required");
    return;
  }

  showSpinner();

  // Max spinner timeout 10s
  const spinnerTimeout = setTimeout(() => {
    hideSpinner();
    showFeedback("Request timed out. Please try again.");
  }, 10000);

  try {
    const response = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "admin123" })
    });

    const data = await response.json();

    if (!response.ok) {
      showFeedback(data.message || "Login failed");
      return;
    }

    // Save token and admin info
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminUser", JSON.stringify(data.user));
    // localStorage.setItem("adminName", data.user.email);

    showFeedback("Login successful! Redirecting...");

    setTimeout(() => {
      window.location.href = "../html/event-upload.html";
    }, 1200);

  } catch (error) {
    console.error(error);
    showFeedback("Network error. Please try again.");
  } finally {
    clearTimeout(spinnerTimeout);
    hideSpinner();
  }
});