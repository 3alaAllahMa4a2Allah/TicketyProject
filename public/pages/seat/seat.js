
async function fetchTicketDetails(ticketId) {
  try {
    const category = new URLSearchParams(window.location.search).get('category');
    const response = await fetch(`tickets/${category}/${ticketId}`);
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

async function refresh(){
  const ticketId = new URLSearchParams(window.location.search).get('ticket');

  if (ticketId) {
    try {
      // Fetch ticket details
      await fetchTicketDetails(ticketId);

      // Fetch the seats for the given ticket
      const category = new URLSearchParams(window.location.search).get('category');

      if(category == "cinema"){
        document.getElementById('cinemaSeats').innerHTML = `
         <div class="movie-container">
                <label> Select a type:</label>
                <select id="movie">
                  <option value="220" data-value="stander">Stander</option>
                  <option value="300" data-value="max">Max</option>
                  <option value="350" data-value="imax">IMax</option>
                  <option value="460" data-value="gold">Gold</option>
                </select>
              </div>
          
              <ul class="showcase">
                <li>
                  <div class="seat"></div>
                  <small>Available</small>
                </li>
                <li>
                  <div class="seat selected"></div>
                  <small>Selected</small>
                </li>
                <li>
                  <div class="seat sold"></div>
                  <small>Sold</small>
                </li>
              </ul>
              <div class="container">
                <div class="screen"></div>
                
                <div class="row">
                  <div class="seat" data-seat-number="A1"></div>
                  <div class="seat" data-seat-number="A2"></div>
                  <div class="seat" data-seat-number="A3"></div>
                  <div class="seat" data-seat-number="A4"></div>
                  <div class="seat" data-seat-number="A5"></div>
                  <div class="seat" data-seat-number="A6"></div>
                  <div class="seat" data-seat-number="A7"></div>
                  <div class="seat" data-seat-number="A8"></div>
                </div>
          
                <div class="row">
                  <div class="seat" data-seat-number="B1"></div>
                  <div class="seat" data-seat-number="B2"></div>
                  <div class="seat" data-seat-number="B3"></div>
                  <div class="seat" data-seat-number="B4"></div>
                  <div class="seat" data-seat-number="B5"></div>
                  <div class="seat" data-seat-number="B6"></div>
                  <div class="seat" data-seat-number="B7"></div>
                  <div class="seat" data-seat-number="B8"></div>
                </div>
                <div class="row">
                  <div class="seat" data-seat-number="C1"></div>
                  <div class="seat" data-seat-number="C2"></div>
                  <div class="seat" data-seat-number="C3"></div>
                  <div class="seat" data-seat-number="C4"></div>
                  <div class="seat" data-seat-number="C5"></div>
                  <div class="seat" data-seat-number="C6"></div>
                  <div class="seat" data-seat-number="C7"></div>
                  <div class="seat" data-seat-number="C8"></div>
                </div>
                <div class="row">
                  <div class="seat" data-seat-number="D1"></div>
                  <div class="seat" data-seat-number="D2"></div>
                  <div class="seat" data-seat-number="D3"></div>
                  <div class="seat" data-seat-number="D4"></div>
                  <div class="seat" data-seat-number="D5"></div>
                  <div class="seat" data-seat-number="D6"></div>
                  <div class="seat" data-seat-number="D7"></div>
                  <div class="seat" data-seat-number="D8"></div>
                </div>
                <div class="row">
                  <div class="seat" data-seat-number="E1"></div>
                  <div class="seat" data-seat-number="E2"></div>
                  <div class="seat" data-seat-number="E3"></div>
                  <div class="seat" data-seat-number="E4"></div>
                  <div class="seat" data-seat-number="E5"></div>
                  <div class="seat" data-seat-number="E6"></div>
                  <div class="seat" data-seat-number="E7"></div>
                  <div class="seat" data-seat-number="E8"></div>
                </div>
                <div class="row">
                  <div class="seat" data-seat-number="F1"></div>
                  <div class="seat" data-seat-number="F2"></div>
                  <div class="seat" data-seat-number="F3"></div>
                  <div class="seat" data-seat-number="F4"></div>
                  <div class="seat" data-seat-number="F5"></div>
                  <div class="seat" data-seat-number="F6"></div>
                  <div class="seat" data-seat-number="F7"></div>
                  <div class="seat" data-seat-number="F8"></div>
                </div>
              </div>
  
              <p class="text">
                You have selected <span id="count">0</span> seat for a price of RS.<span id="total">0</span>
              </p>
              <button class="ButtonLogin" id="book-button">Book</button>
        `;

        const container = document.querySelector(".container");
        const count = document.getElementById("count");
        const total = document.getElementById("total");
        let selected = [];
        const movieSelect = document.getElementById("movie");


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
        document.getElementById('book-button').addEventListener('click', async () => {
          const userId = localStorage.getItem('userId');
          if (!userId) {
            alert('User not logged in. Please log in.');
            return;
          }
        
          try {
            // Validate the user session
            const userResponse = await fetch(`/users/${userId}/findById`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
        
            if (!userResponse.ok) {
              const error = await userResponse.json();
              throw new Error(error.message || 'User validation failed.');
            }
        
            const user = await userResponse.json();
            if (!user || !user.findById) {
              alert('User not found. Please log in again.');
              return;
            }
        
            // Get the selected ticket type
            const selectedType = movieSelect.options[movieSelect.selectedIndex].getAttribute('data-value');
        
            // Get the category and ticketId from URL
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category'); // Extract the category
            const ticketId = urlParams.get('ticket');
        
            if (!category) {
              alert('Category not found in URL.');
              return;
            }
        
            if (!ticketId) {
              alert('Ticket ID not found in URL.');
              return;
            }
        
            if (selected.length === 0) {
              alert('Please select at least one seat.');
              return;
            }
        
            // Book the selected seats
            const seatDetails = selected.map(seatNumber => ({
              seatNumber,
              selectedType,
              ticketId,
              date: new Date(),
            }));
        
            await fetch(`tickets/${category}/save-seat`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ seatNumbers: selected, ticketId, selectedType }),
            });
        
            await fetch(`users/save-seat`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ seatDetails, userId }),
            });
        
            alert('Seats booked successfully!');
            refresh(); // Refresh seat availability
            count.innerHTML = 0;
            total.innerText = 0;
          } catch (error) {
            console.error('Error during booking:', error);
            alert('An error occurred during booking. Please try again.');
          }
        });
        const response = await fetch(`tickets/${category}/seats/${ticketId}`);
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
        // Update the total price
  if (selected.length > 0 && movieSelect.value) {
    const seatPrice = parseInt(movieSelect.value, 10);  // Ensure this is a number
    total.innerText = selected.length * seatPrice || 0;
  } else {
    count.innerHTML = 0;
    total.innerText = 0;
  }
      }
    } catch (error) {
      console.error('Error fetching seat data:', error);
    }
  } else {
    document.querySelector('#ticket-detail').innerHTML = '<p>Ticket ID not found.</p>';
  }


}

// Combine the two window.onload functions
window.onload = () => {
  refresh()
};
