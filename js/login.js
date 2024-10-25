const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value; // using 'email'
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
        errorMessage.textContent = 'Please fill in all fields.';
    } else if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters.';
    } else {
        errorMessage.textContent = '';
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // sending 'email'
            });

            const data = await response.json();
            if (response.ok) {
                alert('Login successful!');
                setTimeout(() => {
                    window.location = "index.html";
                }, 300);        
                // You can redirect the user to the homepage here
            } else {
                errorMessage.textContent = data.message || 'Login failed.';
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again later.';
        }
    }
});