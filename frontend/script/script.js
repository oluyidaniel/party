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