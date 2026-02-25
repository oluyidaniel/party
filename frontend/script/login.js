// Elements
const signinForm = document.getElementById("signinForm");
const submitBtn = document.getElementById("submit");
const feedbackModal = document.getElementById("feedbackModal");
const feedbackMessage = document.getElementById("feedbackMessage");
const spinner = document.getElementById("spinner");

// Close modal function
function closeFeedbackModal() {
  feedbackModal.classList.remove("show");
  setTimeout(() => feedbackModal.classList.add("hidden"), 300);
}

// Show feedback modal
function showFeedback(message) {
  feedbackMessage.textContent = message;
  feedbackModal.classList.remove("hidden");
  feedbackModal.classList.add("show");

  // Auto hide after 2.5s
  setTimeout(() => closeFeedbackModal(), 2500);
}

// Show spinner
function showSpinner() {
  spinner.classList.remove("hidden");
  submitBtn.disabled = true;
}

// Hide spinner
function hideSpinner() {
  spinner.classList.add("hidden");
  submitBtn.disabled = false;
}

// Login handler
submitBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Basic validation
  if (!email || !password) {
    showFeedback("Email and password are required");
    return;
  }

  // Show spinner
  showSpinner();

  // Auto-hide spinner after 10s max
  const spinnerTimeout = setTimeout(() => {
    hideSpinner();
    showFeedback("Request timed out. Please try again.");
  }, 10000);

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) localStorage.setItem("token", data.token);

      showFeedback("Login successful! Redirecting...");
      signinForm.reset();

      setTimeout(() => {
        window.location.href = "./home.html";
      }, 1500);
    } else {
      showFeedback(data.message || "Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    showFeedback("Network error. Please try again.");
  } finally {
    clearTimeout(spinnerTimeout);
    hideSpinner();
  }
});