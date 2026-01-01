const modal = document.getElementById("cartModal");
const eventTitle = document.getElementById("eventTitle");
const ticketType = document.getElementById("ticketType");
const ticketPrice = document.getElementById("ticketPrice");
const closeBtn = document.querySelector(".close-btn");

let prices = {};

document.querySelectorAll(".buy-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".event-card");

    eventTitle.textContent = card.dataset.title;

    prices = {
      regular: card.dataset.regular,
      vip: card.dataset.vip,
      vvip: card.dataset.vvip
    };

    ticketType.value = "regular";
    ticketPrice.textContent = prices.regular;

    modal.style.display = "flex";
  });
});

ticketType.addEventListener("change", () => {
  ticketPrice.textContent = prices[ticketType.value];
});

closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};
