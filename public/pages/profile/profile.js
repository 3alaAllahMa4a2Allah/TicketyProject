document.addEventListener('DOMContentLoaded', function () {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const editButton = document.querySelector('.profile-edit-btn');
    const nameDisplay = document.getElementById('userName');
    const emailDisplay = document.getElementById('userEmail');
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');

    if (!userId) {
        alert('User not logged in. Please log in.');
        return;
    }

    // Fetch user data and display it
    fetch(`/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Include token for authentication
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(user => {
            nameDisplay.textContent = user.username;
            emailDisplay.textContent = user.email;
            nameInput.value = user.username;
            emailInput.value = user.email;
        })
        .catch(error => {
            alert('Error fetching user data. Please try again later.');
            console.error('Fetch error:', error);
        });

    // Toggle edit mode
    editButton.addEventListener('click', function () {
        const isEditing = editButton.textContent === 'Edit Profile';

        if (isEditing) {
            // Enable editing
            nameDisplay.style.display = 'none';
            emailDisplay.style.display = 'none';
            nameInput.style.display = 'block';
            emailInput.style.display = 'block';
            editButton.textContent = 'Save';
        } else {
            // Save changes
            const updatedUser = {
                username: nameInput.value.trim(),
                email: emailInput.value.trim(),
            };

            // Validate input
            if (!updatedUser.username || !updatedUser.email) {
                return alert('Both fields are required.');
            }

            fetch('/users/updateName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token for authentication
                },
                body: JSON.stringify(updatedUser),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Update failed: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Update UI with new data
                    nameDisplay.textContent = updatedUser.username;
                    emailDisplay.textContent = updatedUser.email;

                    localStorage.setItem('username', updatedUser.username);
                    localStorage.setItem('email', updatedUser.email);
                    
                    // Toggle back to display mode
                    nameDisplay.style.display = 'block';
                    emailDisplay.style.display = 'block';
                    nameInput.style.display = 'none';
                    emailInput.style.display = 'none';
                    editButton.textContent = 'Edit Profile';
                })
                .catch(error => {
                    alert('Error updating profile. Please try again.');
                    console.error('Update error:', error);
                });
        }
    });
});
