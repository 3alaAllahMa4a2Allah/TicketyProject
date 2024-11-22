document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('User not logged in. Please log in.');
        return;
    }

    // Fetch purchased tickets using query parameters
    fetch(`/users/${userId}/PurchasedTickets`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching tickets: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const ticketsContainer = document.getElementById('purchasedTickets');
            ticketsContainer.innerHTML = ''; // Clear existing content

            if (!data.tickets || data.tickets.length === 0) {
                ticketsContainer.innerHTML = '<p>No tickets purchased yet.</p>';
                return;
            }

            // Display tickets
            data.tickets.forEach(ticket => {
                const ticketDiv = document.createElement('div');
                ticketDiv.classList.add('ticket');
                ticketDiv.innerHTML = `
                    <h3>Ticket ID: ${ticket.ticketId}</h3>
                    <p>Date: ${ticket.date}</p>
                `;
                ticketsContainer.appendChild(ticketDiv);
            });
        })
        .catch(error => {
            console.error(error);
            alert('Failed to load purchased tickets. Please try again later.');
        });
});
