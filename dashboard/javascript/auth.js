// script.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email && password) {
                alert('Login successful! (This is a demo)');
                // In a real app, handle login logic here
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (username && email && password && confirmPassword) {
                if (password === confirmPassword) {
                    alert('Sign up successful! (This is a demo)');
                    // In a real app, handle sign up logic here
                } else {
                    alert('Passwords do not match.');
                }
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
});