const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navButtons = document.getElementById('nav-buttons');
const openIcon = document.getElementById('open-menu');
const closeIcon = document.getElementById('close-menu');

menuToggle.addEventListener('click', () => {
    // 1. Toggle the 'show' class on your link and button containers
    navLinks.classList.toggle('show');
    navButtons.classList.toggle('show');

    // 2. Logic to swap the icons
    if (navLinks.classList.contains('show')) {
        openIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        openIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
});


function handleCardClick(destinationUrl) {
    // Look for the token saved during login
    const token = localStorage.getItem('userToken'); 

    if (token) {
        // Optional: You could add an API call here to verify if the token is still valid
        window.location.href = destinationUrl;
    } else {
        // No token found? Save the page they WANTED to go to so you can redirect them back later
        localStorage.setItem('redirectAfterLogin', destinationUrl);
        
        alert("Please login or register to view event details!");
        window.location.href = "./html/login.html"; 
    }
}