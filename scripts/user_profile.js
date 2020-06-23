const profileImage = document.querySelector('#profile-image');
const username = document.querySelector('#username');
const displayName = document.querySelector('#display-name');

const user = JSON.parse(localStorage.getItem('currentUser'));

profileImage.setAttribute('src', user.photoUrl);
displayName.textContent = user.displayName;
username.textContent = user.username;
