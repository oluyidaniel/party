document.getElementById("publishBtn").addEventListener("click", async () => {
  const data = {
    eventId: `evt_${Date.now()}`, // auto-generate ID

    card: {
      title: document.getElementById("title").value,
      location: document.getElementById("location").value,
      date: new Date().toISOString().split("T")[0], // or add input later
      time: document.getElementById("time").value,
      image: "/images/events/default.jpg", // replace later
      peopleGoing: 0
    },

    details: {
      bannerImage: "/images/events/banner.jpg",
      description: document.getElementById("description").value,
      venue: document.getElementById("location").value,
      prices: [
        {
          type: document.getElementById("ticketType").value,
          amount: Number(document.getElementById("ticketPrice").value),
          currency: "NGN"
        }
      ],
      cta: {
        label: "Buy Now",
        action: "checkout"
      }
    }
  };

  try {
    const res = await fetch("http://localhost:5000/api/admin/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert("Event Published Successfully");
    console.log(result);

  } catch (error) {
    console.error(error);
    alert("Failed to publish event");
  }
});