document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("eventForm");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Collect form data
      const eventData = {
        title: document.getElementById("title").value,
        location: document.getElementById("location").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        price: document.getElementById("price").value,
        description: document.getElementById("description").value,
      };

      try {
        const response = await fetch("http://localhost:5000/api/admin/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Event created successfully ✅");
          form.reset();
        } else {
          alert(result.message || "Failed to create event ❌");
        }

      } catch (error) {
        console.error("Error:", error);
        alert("Server error. Make sure backend is running.");
      }
    });
  }
});