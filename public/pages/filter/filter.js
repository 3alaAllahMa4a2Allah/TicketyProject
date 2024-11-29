const priceSlider = document.getElementById('priceSlider');
const minPriceValue = document.getElementById("minPriceValue");
const maxPriceValue = document.getElementById("maxPriceValue");
const minPriceInput = document.getElementById("minPriceInput");
const maxPriceInput = document.getElementById("maxPriceInput");
const ticketsWrapper = document.querySelector('.tickets-wrapper');
const locationDropdownHeader = document.getElementById('locationDropdownHeader');
const locationDropdown = document.getElementById('locationDropdown');
const startLocationDropdown = document.getElementById('startLocationDropdown'); // New
const destinationDropdown = document.getElementById('destinationDropdown'); // New

let allTickets = [];
let uniqueLocations = [];
let uniqueStartLocations = []; // New
let uniqueDestinations = []; // New

// Initialize noUiSlider with the full range
noUiSlider.create(priceSlider, {
    start: [0, 500],
    connect: true,
    range: { 'min': 0, 'max': 500 },
    step: 1
});

// Update price values when the slider is moved
priceSlider.noUiSlider.on('update', function (values) {
    const minValue = Math.round(values[0]);
    const maxValue = Math.round(values[1]);
    minPriceValue.textContent = `EGP ${minValue}`;
    maxPriceValue.textContent = `EGP ${maxValue}`;
    minPriceInput.value = minValue;
    maxPriceInput.value = maxValue;

    filterTickets(minValue, maxValue);
});

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

// Adjust ticket filters dynamically
// Fetch tickets and apply filters
async function fetchTickets() {
    try {
        const category = window.location.pathname.split('/').pop(); // Extract category from the URL
        const response = await fetch(`/tickets/${category}`);
        allTickets = await response.json();

        // Check for categories where StartLocation and Destination should be hidden
        const hideStartDestCategories = ['cinema', 'football', 'concert'];
        if (hideStartDestCategories.includes(category)) {
            // Hide the startLocation and destination filters
            document.body.classList.add('hide-start-destination');
        } else {
            document.body.classList.remove('hide-start-destination');
        }

        // Populate location or start/destination dropdowns based on the category
        if (['bus', 'train', 'plane'].includes(category)) {
            // Populate start and destination dropdowns
            uniqueStartLocations = [...new Set(allTickets.map(ticket => ticket.startLocation))];
            uniqueDestinations = [...new Set(allTickets.map(ticket => ticket.destination))];

            startLocationDropdown.innerHTML = '<option value="">All Start Locations</option>';
            uniqueStartLocations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                startLocationDropdown.appendChild(option);
            });

            destinationDropdown.innerHTML = '<option value="">All Destinations</option>';
            uniqueDestinations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                destinationDropdown.appendChild(option);
            });

            // Show start/destination dropdowns and hide location dropdown
            startLocationDropdown.style.display = 'block';
            destinationDropdown.style.display = 'block';
            locationDropdown.style.display = 'none';
            locationDropdownHeader.style.display = 'none';
        } else {
            // Populate location dropdown for other categories
            uniqueLocations = [...new Set(allTickets.map(ticket => ticket.location))];
            locationDropdown.innerHTML = '<option value="">All Locations</option>';
            locationDropdownHeader.style.display = 'block';
            uniqueLocations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationDropdown.appendChild(option);
            });

            // Show location dropdown and hide start/destination dropdowns
            locationDropdown.style.display = 'block';
            startLocationDropdown.style.display = 'none';
            destinationDropdown.style.display = 'none';
        }

        // Display all tickets initially
        const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
        filterTickets(minPrice, maxPrice);
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
}


// Function to filter tickets based on selected criteria (price, date, location, type)
function filterTickets(minPrice, maxPrice) {
    ticketsWrapper.innerHTML = '';

    const category = window.location.pathname.split('/').pop();
    const inStockChecked = document.getElementById('inStockCheckbox').checked;
    const outOfStockChecked = document.getElementById('outOfStockCheckbox').checked;

    let selectedLocation = '';
    let selectedStartLocation = '';
    let selectedDestination = '';

    // Get the selected start and end dates
    const selectedStartDate = document.getElementById('startDate').value || '';
    const selectedEndDate = document.getElementById('endDate').value || '';

    if (['bus', 'train', 'plane'].includes(category)) {
        selectedStartLocation = startLocationDropdown.value;
        selectedDestination = destinationDropdown.value;
    } else {
        selectedLocation = locationDropdown.value;
    }

    // Filter tickets based on price, location, ticket type, and date range
    const filteredTickets = allTickets.filter(ticket => {
        const isInPriceRange = ticket.price >= minPrice && ticket.price <= maxPrice;
        const isInStock = ticket.amount > 0;
        const isOutOfStock = ticket.amount === 0;

        let isLocationMatch = true;
        if (['bus', 'train', 'plane'].includes(category)) {
            const matchesStart = selectedStartLocation ? ticket.startLocation === selectedStartLocation : true;
            const matchesDestination = selectedDestination ? ticket.destination === selectedDestination : true;
            isLocationMatch = matchesStart && matchesDestination;
        } else {
            isLocationMatch = selectedLocation ? ticket.location === selectedLocation : true;
        }

        // Handle date filtering if both start and end dates are selected
        let isDateMatch = true;
        if (selectedStartDate && selectedEndDate) {
            const ticketDate = new Date(ticket.date);
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);

            isDateMatch = ticketDate >= startDate && ticketDate <= endDate;
        }

        return isInPriceRange &&
            ((inStockChecked && isInStock) || (outOfStockChecked && isOutOfStock) || (!inStockChecked && !outOfStockChecked)) &&
            isLocationMatch &&
            isDateMatch;
    });

    // Display filtered tickets
    if (filteredTickets.length === 0) {
        ticketsWrapper.innerHTML = '<p>No tickets available with the selected filters.</p>';
    } else {
        filteredTickets.forEach(ticket => {
            const ticketDiv = document.createElement('div');
            ticketDiv.classList.add('ticket');

            // Apply the correct class based on category for layout
            if (['bus', 'train', 'plane'].includes(category)) {
                ticketDiv.classList.add(category); // Add class based on category
            }

            ticketDiv.innerHTML = `
            <a href="/ticket_detail?category=${category}&ticket=${ticket._id}">
                <div class="ticket-overlay"></div>
                <img src="${ticket.img}" alt="${ticket.name} photo">
                <h3>${ticket.name}</h3>
                <p>${truncateDescription(ticket.description, 7)}</p>  <!-- Truncate to 7 words -->
            </a>
        `;       
        ticketsWrapper.appendChild(ticketDiv);

        function truncateDescription(description, wordLimit) {
            const words = description.split(' ');
            if (words.length <= wordLimit) {
                return description; // No truncation needed
            }
            return words.slice(0, wordLimit).join(' ') + '...';  // Truncate and add ellipsis
        }
        });
    }
}

// Event listeners for dropdown changes and date filters
startLocationDropdown.addEventListener('change', () => {
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
    filterTickets(minPrice, maxPrice);
});
destinationDropdown.addEventListener('change', () => {
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
    filterTickets(minPrice, maxPrice);
});
locationDropdown.addEventListener('change', () => {
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
    filterTickets(minPrice, maxPrice);
});
document.getElementById('startDate').addEventListener('change', () => {
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
    filterTickets(minPrice, maxPrice);
});
document.getElementById('endDate').addEventListener('change', () => {
    const [minPrice, maxPrice] = priceSlider.noUiSlider.get().map(Number);
    filterTickets(minPrice, maxPrice);
});

document.querySelector('.clear-button').addEventListener('click', () => {
    minPriceInput.value = '';
    maxPriceInput.value = '';
    priceSlider.noUiSlider.set([0, 500]);
    minPriceValue.textContent = 'EGP 0';
    maxPriceValue.textContent = 'EGP 500';
    document.getElementById('inStockCheckbox').checked = false;
    document.getElementById('outOfStockCheckbox').checked = false;
    locationDropdown.selectedIndex = 0;
    startLocationDropdown.selectedIndex = 0;
    destinationDropdown.selectedIndex = 0;
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    fetchTickets();
});

window.onload = () => {
    // Custom code to update the category name in breadcrumb and title
    const url = window.location.href;
    let namePage = url.substring(url.lastIndexOf('/') + 1);  // Extract the category from URL

    // Capitalize the first letter of each word
    namePage = decodeURIComponent(namePage)
        .replace(/[-_]/g, ' ')  // Replace dashes or underscores with spaces
        .split(' ')  // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize the first letter of each word
        .join(' ');  // Join words back with spaces

    // Display the formatted name in the breadcrumb and page title
    document.getElementById('namePage').textContent = namePage;
    document.getElementById('namePage_2').textContent = `${namePage} Ticket Marketplace`;

    // Call fetchTickets to load ticket data
    fetchTickets();
};
