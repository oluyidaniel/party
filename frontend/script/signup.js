// Elements
const signupForm = document.getElementById("signupForm");
const submitBtn = document.getElementById("submit");
const feedbackModal = document.getElementById("feedbackModal");
const feedbackMessage = document.getElementById("feedbackMessage");
const spinner = document.getElementById("spinner");

// Close modal function
function closeFeedbackModal() {
  feedbackModal.classList.remove("show");
  setTimeout(() => feedbackModal.classList.add("hidden"), 300);
}

// Show feedback modal dynamically
function showFeedback(message) {
  feedbackMessage.textContent = message;
  feedbackModal.classList.remove("hidden");
  feedbackModal.classList.add("show");

  // Auto hide after 2.5 seconds
  setTimeout(() => closeFeedbackModal(), 2500);
}

// Show spinner function
function showSpinner() {
  spinner.classList.remove("hidden");
}

// Hide spinner function
function hideSpinner() {
  spinner.classList.add("hidden");
}

// Signup handler
submitBtn.addEventListener("click", async () => {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showFeedback("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    showFeedback("Passwords do not match");
    return;
  }

  // Show spinner and disable button
  showSpinner();
  submitBtn.disabled = true;

  // Auto-hide spinner after 10s max
  const spinnerTimeout = setTimeout(() => {
    hideSpinner();
    submitBtn.disabled = false;
    showFeedback("Request timed out. Please try again.");
  }, 10000);

  try {
    const response = await fetch("https://party-backend-mj21.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
    });

    const data = await response.json();

    if (response.ok) {
      showFeedback("Signup successful! Redirecting...");
      signupForm.reset();

      setTimeout(() => {
        window.location.href = "./signin.html";
      }, 2000);
    } else {
      showFeedback(data.message || "Signup failed");
    }
  } catch (error) {
    showFeedback("Network error. Please try again.");
    console.error(error);
  } finally {
    // Hide spinner and clear timeout
    clearTimeout(spinnerTimeout);
    hideSpinner();
    submitBtn.disabled = false;
  }
});