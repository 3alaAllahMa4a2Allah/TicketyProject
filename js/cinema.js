//js power

//indicator
// Selecting the marker and menu items
let marker = document.querySelector('.marker');
let items = document.querySelectorAll('nav ul li');

// Function to update the position and width of the marker
function indicator(e) {
  marker.style.left = e.offsetLeft + "px";
  marker.style.width = e.offsetWidth + "px";
}

// Adding click event listeners to each menu item
items.forEach(link => {
  link.addEventListener("click", (e) => {
    indicator(e.target);
  });
});

// Handling scroll events for navigation bar styling
let nav = document.querySelector('nav');

window.addEventListener("scroll", () => {
  if (window.pageYOffset >= 20) {
    nav.classList.add('nav');
  } else {
    nav.classList.remove('nav');
  }

  if (window.pageYOffset >= 700) {
    nav.classList.add('navBlack');
  } else {
    nav.classList.remove('navBlack');
  }
});

// Menu toggle functionality
let menu = document.querySelector('#menu');
let menuBx = document.querySelector('#menu-box');
let isMenuOpen = false; // Changed variable name for clarity

menu.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen; // Toggle the boolean state
  menuBx.style.display = isMenuOpen ? "block" : "none"; // Use ternary operator for cleaner code
  menu.classList.replace(isMenuOpen ? "fa-bars" : "fa-remove", isMenuOpen ? "fa-remove" : "fa-bars");
});

// Initialize the carousel using jQuery
$(".carousel").owlCarousel({
  margin: 20,
  loop: true,
  autoplay: true,
  autoplayTimeout: 5000,
  autoplayHoverPause: true,
  responsive: {
    0: {
      items: 3,
      nav: true
    },
    600: {
      items: 3,
      nav: true
    },
    1000: {
      items: 3,
      nav: true
    }
  }
});
