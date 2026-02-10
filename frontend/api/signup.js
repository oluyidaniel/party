document.getElementById('submit').addEventListener('click', async () => {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, confirmPassword })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Signup successful! Token: ' + data.token);
            // Redirect or store token in localStorage indirect to the backend 
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        alert('Network error: ' + err.message);
    }
});