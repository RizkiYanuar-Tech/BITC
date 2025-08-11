import 'regenerator-runtime';
import '../scripts/index.js';
import '../styles/style.css';
import '../scripts/components/contact-section';

console.log('Index.js is successfully loaded');

// Toggle Nav
const navbarDrawerElement = document.querySelector('#navigationDrawerId');
const navbarContainerElement = document.querySelector('#navbarContainerId');
const navbarElement = document.querySelector('#navbarId');

navbarDrawerElement.addEventListener('click', event => {
  navbarContainerElement.classList.toggle('open');
  event.stopPropagation();
});

window.addEventListener('scroll', () => {
  const scrollOnPage = window.pageYOffset;

  if (scrollOnPage > 0) {
    navbarElement.style.backgroundColor = '#3572EF';
    navbarElement.style.position = 'fixed';
  } else {
    navbarElement.style.backgroundColor = 'transparent';
    navbarElement.style.position = 'absolute';
  }
});

// iki
