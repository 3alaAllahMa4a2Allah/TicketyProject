document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const editButton = document.querySelector('.profile-edit-btn');
    const displayFields = {
        name: document.getElementById('userName'),
        email: document.getElementById('userEmail'),
        phone: document.getElementById('userPhone'),
        age: document.getElementById('userAge'),
        role: document.getElementById('userRole'),
        nationalID: document.getElementById('userNationalID'),
    };
    const inputFields = {
        name: document.getElementById('editName'),
        email: document.getElementById('editEmail'),
        phone: document.getElementById('editPhone'),
        age: document.getElementById('editAge'),
        role: document.getElementById('editRole'),
        nationalID: document.getElementById('editNationalID'),
    };

    if (!userId) {
        alert('User not logged in. Please log in.');
        return;
    }

    // Fetch user data
    fetch(`/users/${userId}`)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch user data: ${response.statusText}`);
            return response.json();
        })
        .then(user => {
            displayFields.name.textContent = user.username;
            displayFields.email.textContent = user.email;
            displayFields.phone.textContent = user.phone || 'User Phone';
            displayFields.age.textContent = user.age || 'User Age';
            displayFields.role.textContent = user.role || 'User Role';
            displayFields.nationalID.textContent = user.nationalID || 'User National ID';

            inputFields.name.value = user.username;
            inputFields.email.value = user.email;
            inputFields.phone.value = user.phone || '';
            inputFields.age.value = user.age || '';
            inputFields.role.value = user.role || '';
            inputFields.nationalID.value = user.nationalID || '';
        })
        .catch(error => {
            alert('Error fetching user data. Please try again later.');
            console.error(error);
        });

    // Toggle between edit and save
    editButton.addEventListener('click', () => {
        const isEditing = editButton.textContent === 'Edit Profile';

        if (isEditing) {
            // Enable editing
            Object.values(displayFields).forEach(field => (field.style.display = 'none'));
            Object.values(inputFields).forEach(field => (field.style.display = 'block'));
            editButton.textContent = 'Save';
        } else {
            // Save changes
            const updatedUser = {
                username: inputFields.name.value.trim(),
                email: inputFields.email.value.trim(),
                phone: inputFields.phone.value.trim(),
                age: inputFields.age.value.trim(),
                role: inputFields.role.value.trim(),
                nationalID: inputFields.nationalID.value.trim(),
            };

            // Validate required fields
            if (!updatedUser.username || !updatedUser.email) {
                alert('Name and Email are required.');
                return;
            }

            fetch('/users/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUser),
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
                    return response.json();
                })
                .then(() => {
                    // Update UI
                    displayFields.name.textContent = updatedUser.username;
                    displayFields.email.textContent = updatedUser.email;
                    displayFields.phone.textContent = updatedUser.phone || 'User Phone';
                    displayFields.age.textContent = updatedUser.age || 'User Age';
                    displayFields.role.textContent = updatedUser.role || 'User Role';
                    displayFields.nationalID.textContent = updatedUser.nationalID || 'User National ID';

                    Object.values(displayFields).forEach(field => (field.style.display = 'block'));
                    Object.values(inputFields).forEach(field => (field.style.display = 'none'));

                    editButton.textContent = 'Edit Profile';
                })
                .catch(error => {
                    alert('Error updating profile. Please try again.');
                    console.error(error);
                });
        }
    });
});
