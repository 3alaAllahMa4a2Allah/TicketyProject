const registrationForm = document.getElementById('registrationForm');
const errorMessage = document.getElementById('error-message');

registrationForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        errorMessage.textContent = 'Please fill in all fields.';
        return;
    }

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('User registered successfully!');
        registrationForm.reset();
        setTimeout(() => {
            window.location = "login.html";
        }, 300);        
    } else {
        errorMessage.textContent = data.message || 'Registration failed.';
    }
});
