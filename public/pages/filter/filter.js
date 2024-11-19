const priceSlider = document.getElementById('priceSlider');
const minPriceValue = document.getElementById("minPriceValue");
const maxPriceValue = document.getElementById("maxPriceValue");
const minPriceInput = document.getElementById("minPriceInput");
const maxPriceInput = document.getElementById("maxPriceInput");
const ticketsWrapper = document.querySelector('.tickets-wrapper');
const locationDropdown = document.getElementById('locationDropdown');
const ticketTypeDropdown = document.getElementById('ticketTypeDropdown'); 

let allTickets = []; 
let uniqueLocations = []; 

// Initialize noUiSlider with the full range
noUiSlider.create(priceSlider, {
    start: [0, 500],
    connect: true,
    range: { 'min': 0, 'max': 500 },
    step: 1
});

// Update price values when the slider is moved
priceSlider.noUiSlider.on('update', function(values) {
    const minValue = Math.round(values[0]);
    const maxValue = Math.round(values[1]);
    minPriceValue.textContent = `EGP ${minValue}`;
    maxPriceValue.textContent = `EGP ${maxValue}`;
    minPriceInput.value = minValue;
    maxPriceInput.value = maxValue;

    filterTickets(minValue, maxValue);
});

// Function to update slider based on input
function updateSliderFromInput() {
    let minValue = parseFloat(minPriceInput.value);
    let maxValue = parseFloat(maxPriceInput.value);
    minValue = isNaN(minValue) ? 0 : Math.max(minValue, 0);
    maxValue = isNaN(maxValue) ? 500 : Math.min(maxValue, 500);

    if (minValue >= maxValue) {
        minValue = maxValue - 1;
    }

    priceSlider.noUiSlider.set([minValue, maxValue]);
    filterTickets(minValue, maxValue);
}

function filterTickets(minPrice, maxPrice) {
    ticketsWrapper.innerHTML = '';

    const inStockChecked = document.getElementById('inStockCheckbox').checked;
    const outOfStockChecked = document.getElementById('outOfStockCheckbox').checked;
    const selectedLocation = locationDropdown.value; 
    const selectedTicketType = ticketTypeDropdown.value; 

    const filteredTickets = allTickets.filter(ticket => {
        const isInPriceRange = ticket.price >= minPrice && ticket.price <= maxPrice;
        const isInStock = ticket.amount > 0;
        const isOutOfStock = ticket.amount === 0;
        const isLocationMatch = selectedLocation ? ticket.location === selectedLocation : true;
        const isTypeMatch = selectedTicketType ? ticket.ticketType === selectedTicketType : true;

        // Check if the ticket matches the price range and selected filters
        return isInPriceRange &&
            ((inStockChecked && isInStock) || (outOfStockChecked && isOutOfStock) || 
             (!inStockChecked && !outOfStockChecked)) && // Include tickets if neither checkbox is checked
            isLocationMatch &&
            isTypeMatch;
    });

    if (filteredTickets.length === 0) {
        ticketsWrapper.innerHTML = '<p>No tickets available with the selected filters.</p>';
    } else {
        filteredTickets.forEach(ticket => {
            const ticketDiv = document.createElement('div');
            ticketDiv.classList.add('ticket');

            ticketDiv.innerHTML = `
                <a href="/ticket_detail?ticket=${ticket._id}">
                    <img src="${ticket.img}" alt="${ticket.name} photo">
                    <h3>${ticket.name}</h3>
                    <p>Description: ${ticket.description}</p>
                    <p>Price: EGP ${ticket.price.toFixed(2)}</p>
                    <p>Amount: ${ticket.amount} (${ticket.amount > 0 ? 'In Stock' : 'Out of Stock'})</p>
                </a>
            `;
            ticketsWrapper.appendChild(ticketDiv);
        });
    }
}

minPriceInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') updateSliderFromInput();
});
maxPriceInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') updateSliderFromInput();
});
document.getElementById('inStockCheckbox').addEventListener('change', () => {
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
    filterTickets(minPrice, maxPrice);
});
document.getElementById('outOfStockCheckbox').addEventListener('change', () => {
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
    filterTickets(minPrice, maxPrice);
});
locationDropdown.addEventListener('change', () => {
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
    filterTickets(minPrice, maxPrice);
});
ticketTypeDropdown.addEventListener('change', () => {
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
    filterTickets(minPrice, maxPrice);
});

// Clear button functionality
document.querySelector('.clear-button').addEventListener('click', () => {
    minPriceInput.value = '';
    maxPriceInput.value = '';
    priceSlider.noUiSlider.set([0, 500]);
    minPriceValue.textContent = 'EGP 0';
    maxPriceValue.textContent = 'EGP 500';
    document.getElementById('inStockCheckbox').checked = false;
    document.getElementById('outOfStockCheckbox').checked = false;
    locationDropdown.selectedIndex = 0;
    ticketTypeDropdown.selectedIndex = 0;
    fetchTickets(); // Refetch all tickets to reset the view
});

async function fetchTickets() {
    try {
        const response = await fetch('http://localhost:3000/tickets/');
        allTickets = await response.json();

        uniqueLocations = [...new Set(allTickets.map(ticket => ticket.location))];
        locationDropdown.innerHTML = '<option value="">All Locations</option>';
        uniqueLocations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationDropdown.appendChild(option);
        });

        const uniqueTypes = [...new Set(allTickets.map(ticket => ticket.ticketType))];
        ticketTypeDropdown.innerHTML = '<option value="">All Types</option>';
        uniqueTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            ticketTypeDropdown.appendChild(option);
        });

        // Display all tickets initially
        const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
        filterTickets(minPrice, maxPrice);
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
}

window.onload = () => {
    // Get the page name from the URL
    const url = window.location.href;
    let namePage = url.substring(url.lastIndexOf('/') + 1);

    // Capitalize the first letter of each word
    namePage = decodeURIComponent(namePage)
        .replace(/[-_]/g, ' ','%20') // Replace dashes or underscores with spaces
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
        .join(' '); // Join words back with spaces

    // Display the formatted name
    document.getElementById('namePage').textContent = namePage;
    document.getElementById('namePage_2').textContent = namePage + ' Ticket Marketplace';


    fetchTickets()
  };