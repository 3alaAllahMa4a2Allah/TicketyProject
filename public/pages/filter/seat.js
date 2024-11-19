const container = document.querySelector(".container");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
let selected = [];

async function fetchTicketDetails(ticketId) {
  try {
    const response = await fetch(`http://localhost:3000/tickets/${ticketId}`);
    const ticket = await response.json();

    const ticketDetailWrapper = document.querySelector('#ticket-detail');
    ticketDetailWrapper.innerHTML = `
      <div class="ticket-info">
        <img src="${ticket.img}" alt="${ticket.name} photo">
        <div class="ticket-details">
          <h3>${ticket.name}</h3>
          <p class="price">Price: EGP ${ticket.price.toFixed(2)}</p>
          <p class="availability">${ticket.amount > 0 ? 'In Stock' : 'Out of Stock'}</p>
          <p class="description"><strong>Description:</strong> ${ticket.description}</p>
          <p class="location"><strong>Location:</strong> ${ticket.location}</p>
          <p class="type"><strong>Ticket Type:</strong> ${ticket.ticketType}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    ticketDetailWrapper.innerHTML = '<p>Error loading ticket details. Please try again later.</p>';
  }
}

// Handle seat selection
document.querySelectorAll('.seat').forEach(seat => {
  seat.addEventListener('click', (e) => {
    const seatElement = e.target;
    if (seatElement.classList.contains('sold')) return; // Skip if the seat is sold
    if (seatElement.classList.contains('selected')) {
      seatElement.classList.remove('selected');
      selected = selected.filter(item => item !== seatElement.dataset.seatNumber);
    } else {
      seatElement.classList.add('selected');
      selected.push(seatElement.dataset.seatNumber);
    }
    
    count.innerHTML = selected.length;
    total.innerText = selected.length * +movieSelect.value || 0;
  });
});

movieSelect.addEventListener('change', async (e) => {
  refresh();
});

// Handle booking when the button is clicked
document.getElementById('book-button').addEventListener('click', () => {
  const selectedType = movieSelect.options[movieSelect.selectedIndex].getAttribute('data-value');

  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('ticket');

  if (selected.length === 0) {
    alert("Please select at least one seat.");
    return; // Prevent booking if no seats are selected
  }

  // Send the selected seat data to the server
  fetch('http://localhost:3000/tickets/save-seat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ seatNumbers: selected, ticketId: ticketId, selectedType })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Seats saved:', data);
      // Optionally, display a success message or update the UI
    })
    .catch((error) => {
      console.error('Error saving seats:', error);
      // Optionally, display an error message
    });

    window.setTimeout(() => {
      refresh()
      count.innerHTML = 0;
      total.innerText = 0;
    }, 300); 
});

async function refresh(){
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('ticket');

  if (ticketId) {
    try {
      // Fetch ticket details
      await fetchTicketDetails(ticketId);

      // Fetch the seats for the given ticket
      const response = await fetch(`http://localhost:3000/tickets/seats/${ticketId}`);
      const data = await response.json();

      // Determine seat data category based on selected movie type
      const selectedType = movieSelect.options[movieSelect.selectedIndex].getAttribute('data-value');
      const selectedSeatData =
        selectedType === 'stander'
          ? data.seatData_stander
          : selectedType === 'max'
          ? data.seatData_max
          : selectedType === 'imax'
          ? data.seatData_imax
          : selectedType === 'gold'
          ? data.seatData_gold
          : [];

      // Remove the 'sold' class from all seats before updating them
      document.querySelectorAll('.row .seat.sold').forEach(seat => seat.classList.remove('sold'));
      document.querySelectorAll('.row .seat.selected').forEach(seat => seat.classList.remove('selected'));
      selected = [];

      // Update only seats that need changes
      selectedSeatData.forEach(seat => {
        const seatElement = document.querySelector(`[data-seat-number="${seat.seatNumber}"]`);
        if (seatElement) {
          if (seat.status === 'sold' && !seatElement.classList.contains('sold')) {
            seatElement.classList.add('sold');
          }
        } else {
          console.error(`Seat with number ${seat.seatNumber} not found in the DOM.`);
        }
      });
    } catch (error) {
      console.error('Error fetching seat data:', error);
    }
  } else {
    document.querySelector('#ticket-detail').innerHTML = '<p>Ticket ID not found.</p>';
  }

  // Update the total price
  if (selected.length > 0 && movieSelect.value) {
    const seatPrice = parseInt(movieSelect.value, 10);  // Ensure this is a number
    total.innerText = selected.length * seatPrice || 0;
  } else {
    count.innerHTML = 0;
    total.innerText = 0;
  }
}


// Combine the two window.onload functions
window.onload = () => {
  refresh()
};
