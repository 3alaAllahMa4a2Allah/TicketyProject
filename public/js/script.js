// Data for circles and sections
const circlesData = [
    { title: 'Bus', image: '../images/busCat.jpg' },
    { title: 'Train', image: '../images/trainCat.jpg' },
    { title: 'Plane', image: '../images/planeCat.jpg' },
    { title: 'Concert', image: '../images/concertCat.jpg' },
    { title: 'Football', image: '../images/footballCat.jpg' },
    { title: 'Planned Trips', image: '../images/plannedTripsCat.jpg' },
    { title: 'Cinema', image: '../images/cinemaCat.jpg' }  
];

const sectionsData = [
    {
        title: 'Bus',
        items: [
            { name: 'Headset', img_path: '../images/headset.jpg' },
            { name: 'Keyboard', img_path: '../images/keyboard.jpg' }
        ]
    },
    {
        title: 'Train',
        items: [
            { name: 'Headset', img_path: '../images/headset.jpg' },
            { name: 'Keyboard', img_path: '../images/keyboard.jpg' }
        ]
    },
    {
        title: 'Plane',
        items: [
            { name: 'Headset', img_path: '../images/headset.jpg' },
            { name: 'Keyboard', img_path: '../images/keyboard.jpg' }
        ]
    },
    {
        title: 'Concert',
        items: [
            { name: 'Headset', img_path: '../images/headset.jpg' },
            { name: 'Keyboard', img_path: '../images/keyboard.jpg' }
        ]
    },
    {
        title: 'Football',
        items: [
            { name: 'Headset', img_path: '../images/headset.jpg' },
            { name: 'Keyboard', img_path: '../images/keyboard.jpg' }
        ]
    },
    {
        title: 'Planned Trips',
        items: [
            { name: 'Headset', img_path: '../images/headset.jpg' },
            { name: 'Keyboard', img_path: '../images/keyboard.jpg' }
        ]
    }
];

// Render circles independently
const section_Categories = document.getElementById('section-Categories');
function renderCircles() {
    section_Categories.innerHTML = circlesData.map(circle => `
        <div class="section-Category">
            <a href="#">
                <div class="circle" style="background-image: url(${circle.image});">
                    <div class="overlay">
                        <h5>${circle.title}</h5>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// Render sections independently
const sections = document.getElementById('sections');
function renderSections() {
    sections.innerHTML = sectionsData.map(section => `
        <div class="section">
            <h2>${section.title}</h2>
            <div class="items">
                ${section.items.map(item => `
                    <div class="item">
                        <img src="${item.img_path}" alt="${item.name}">
                        <p>${item.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Render circles independently with links to their respective pages
const sections_Categories = document.getElementById('section-Categories');
function renderCircles() {
    section_Categories.innerHTML = circlesData.map(circle => `
        <div class="section-Category">
            <a href="/${(circle.title).toLowerCase()}">
                <div class="circle" style="background-image: url(${circle.image});">
                    <div class="overlay">
                        <h5>${circle.title}</h5>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// Render sections independently
const section = document.getElementById('sections');
function renderSections() {
    sections.innerHTML = sectionsData.map(section => `
        <div class="section">
            <h2>${section.title}</h2>
            <div class="items">
                ${section.items.map(item => `
                    <div class="item">
                        <img src="${item.img_path}" alt="${item.name}">
                        <p>${item.name}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Call the render functions separately
renderCircles();
renderSections();

// Add event listener for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.logo-none');
    const usernameDisplay = document.getElementById('username-display');
    const userDropdown = document.getElementById('user-dropdown');
    const userName = document.getElementById('user-name');

    // Dropdown content with Profile and Logout links
    userDropdown.innerHTML = `
        <a href="/profile">Profile</a>
        <a href="" id="logout">Logout</a>
    `;

    // Check if user is logged in
    const username = localStorage.getItem('username');
    if (username) {
        loginButton.style.display = 'none';
        usernameDisplay.style.display = 'flex';
        userName.textContent = username;

        // Toggle dropdown visibility on username display click
        usernameDisplay.addEventListener('click', (event) => {
            event.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!userDropdown.contains(event.target) && event.target !== usernameDisplay) {
                userDropdown.classList.remove('show');
            }
        });

        // Logout functionality
        document.getElementById('logout').addEventListener('click', () => {
            localStorage.clear();
            window.location.reload();
        });
    } else {
        loginButton.style.display = 'block';
        usernameDisplay.style.display = 'none';
    }
});
