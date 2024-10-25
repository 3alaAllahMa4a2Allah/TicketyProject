const dropdown = document.getElementById('dropdown');

const dropdown_items = ['Bus', 'Train', 'Plane', 'Concert', 'Football', 'Planned Trips', 'Cinema']

function populateDropdown() {
    dropdown.innerHTML = dropdown_items.map((item, index) => `
        <a href="#">${item}</a>
        ${index < dropdown_items.length - 1 ? '<div class="divider"></div>' : ''}
    `).join('');
}

populateDropdown();
