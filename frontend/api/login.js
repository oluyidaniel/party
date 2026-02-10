document.getElementById('submit').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Login successful! Token: ' + data.token);
            // Store token in localStorage for future auth
            localStorage.setItem('token', data.token);
            // Redirect to home
            window.location.href = './home.html';
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        alert('Network error: ' + err.message);
    }
});