// Elements
const signinForm = document.getElementById("signinForm");
const submitBtn = document.getElementById("submit");
const feedbackModal = document.getElementById("feedbackModal");
const feedbackMessage = document.getElementById("feedbackMessage");

// Close modal
function closeFeedbackModal() {
  feedbackModal.classList.add("hidden");
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

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Store token if backend returns one
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      showFeedback("Login successful! Redirecting to index...");
      signinForm.reset();

      // Redirect to index.html after 1.5 seconds
      setTimeout(() => {
        window.location.href = "./home.html";
      }, 1500);
    } else {
      // If login fails (wrong credentials or user not signed up)
      showFeedback(data.message || "Invalid email or password");
    }
  } catch (error) {
    showFeedback("Network error. Please try again.");
    console.error(error);
  }
});

// Show feedback modal
function showFeedback(message) {
  feedbackMessage.textContent = message;
  feedbackModal.classList.remove("hidden");
}