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
        title: 'Train',
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
        title: 'Train',
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
            <a href="${circle.title}.html">
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
