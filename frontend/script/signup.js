// Elements
const signupForm = document.getElementById("signupForm");
const submitBtn = document.getElementById("submit");
const feedbackModal = document.getElementById("feedbackModal");
const feedbackMessage = document.getElementById("feedbackMessage");

// Close modal function
function closeFeedbackModal() {
  feedbackModal.classList.add("hidden");
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

  try {
    const response = await fetch("https://party-backend-mj21.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
    });

    const data = await response.json();

    if (response.ok) {
      // Show success message briefly
      showFeedback("Signup successful! Redirecting to login...");
      signupForm.reset();

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "./signin.html"; // <-- change to your signin page
      }, 2000);
    } else {
      showFeedback(data.message || "Signup failed");
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