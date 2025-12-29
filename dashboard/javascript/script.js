const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

prevBtn.addEventListener('click', () => {
  carousel.scrollBy({ left: -320, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
  carousel.scrollBy({ left: 320, behavior: 'smooth' });
});


const uploadBox = document.getElementById("uploadLabel");
const fileInput = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");
const uploadText = document.getElementById("uploadText");  

uploadBox.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      previewImage.src = reader.result;
      previewImage.style.opacity = "1";
      uploadText.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});
