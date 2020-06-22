// PROFILE SET UP 
const form = document.querySelector('.profile');

const displayName = localStorage.getItem('displayName') ? localStorage.getItem('displayName') : 'HelloCutie11';
const profileUrl = localStorage.getItem('profileUrl') ? localStorage.getItem('profileUrl') : 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';

const img = document.querySelector('img');

img.setAttribute('src', profileUrl);
img.style = 'width:100px; padding-top:1rem;'
form.displayName.value = displayName;



form.addEventListener('submit', e => {
    e.preventDefault();

    console.log('submit');
});