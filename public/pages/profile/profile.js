document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    const editButton = document.querySelector('.profile-edit-btn');
    const nameDisplay = document.getElementById('userName');
    const emailDisplay = document.getElementById('userEmail');
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');

    // Fetch user data and display it
    fetch(`user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(user => {
            nameDisplay.textContent = user.username;
            emailDisplay.textContent = user.email;
            nameInput.value = user.username;
            emailInput.value = user.email;
        })
        .catch(error => console.error('Fetch error:', error));

    // Toggle edit mode
    editButton.addEventListener('click', function() {
        if (editButton.value === 'Edit Profile') {
            // Enable editing
            nameDisplay.style.display = 'none';
            emailDisplay.style.display = 'none';
            nameInput.style.display = 'block';
            emailInput.style.display = 'block';
            editButton.value = 'Save';
        } else {
            // Save changes
            const updatedUser = {
                username: nameInput.value,
                email: emailInput.value
            };

            // Validate input
            if (!updatedUser.username || !updatedUser.email) {
                return alert("Both fields are required.");
            }

            console.log('Updated User Data:', updatedUser);

            const token = localStorage.getItem('token'); // Retrieve token from local storage

            // Check if the token exists
            if (!token) {
                console.error('No token found. User is not authenticated.');
                return alert("You must be logged in to update your profile.");
            }

            fetch('/updateName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                },
                body: JSON.stringify(updatedUser)
            })
            .then(response => {
                if (!response.ok) {
                    console.error('Update failed with status:', response.status);
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update UI with new data
                nameDisplay.textContent = data.username;
                emailDisplay.textContent = data.email;

                // Hide the input fields again
                nameInput.style.display = 'none';
                emailInput.style.display = 'none';
                editButton.value = 'Edit Profile';
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            })
            .catch(error => console.error('Update error:', error));
        }
    });
});
