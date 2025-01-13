// public/js/header.js

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.getElementById('hamburger-button');
    const menu = document.getElementById('menu'); // Add an element with this ID for the menu
  
    if (hamburgerButton && menu) {
      hamburgerButton.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });
    }
  });
  