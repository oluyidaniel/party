const API_URL = "http://localhost:5000/api/events";

// Get JWT token (stored after login)
const token = localStorage.getItem("adminToken");

document.getElementById("publishBtn").addEventListener("click", async () => {
  try {
    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const price = document.getElementById("price").value;
    const time = document.getElementById("time").value;
    const description = document.getElementById("description").value;

    if (!title || !location || !price) {
      alert("Please fill required fields");
      return;
    }

    const eventData = {
      card: {
        title,
        location,
        time,
        peopleGoing: 0
      },
      details: {
        description,
        prices: [
          {
            type: "Standard",
            amount: price,
            currency: "NGN"
          }
        ]
      }
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to create event");
      return;
    }

    alert("Event published successfully!");
    console.log(data);

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
});