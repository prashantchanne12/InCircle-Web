// PROFILE SET UP 
const form = document.querySelector('.profile');
const inputFile = document.querySelector('#img');
const img = document.querySelector('img');
let file;

const user = JSON.parse(localStorage.getItem('currentUser'));
const loader = document.querySelector('.loader');


let displayName = user.displayName ? user.displayName : 'HelloCutie11';
const profileUrl = user.photoUrl ? user.photoUrl : 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png';


img.setAttribute('src', profileUrl);
img.style = 'width:110px; height:135px; padding-top:1rem;'
form.displayName.value = displayName;

inputFile.addEventListener('change', e => {
    console.log(inputFile.files[0]);
    file = inputFile.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener('load', e => {
            img.setAttribute('src', reader.result);
        });

        reader.readAsDataURL(file);
    }

});

let username;

form.addEventListener('submit', e => {
    e.preventDefault();

    username = form.username.value.trim();
    displayName = form.displayName.value.trim();

    if (username) {
        if (username.length >= 3 && username.length <= 8) {
            form.username.classList.remove('is-invalid');
            form.username.classList.add('is-valid');

            if (file) {
                loader.style.display = 'block';
                uploadImage(file);
            } else {
                loader.style.display = 'block';
                addDataInFirestore(user.photoUrl);
            }
        } else {
            loader.style.display = 'none';
            form.username.classList.remove('is-valid');
            form.username.classList.add('is-invalid');
        }
    }



});

function uploadImage() {

    const ref = firebase.storage().ref();
    const name = new Date() + '_' + file.name;

    const task = ref.child(`profile/${name}`).put(file);

    task.then(snapshot => {
        return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
        url = downloadURL;
        console.log(url);

        addDataInFirestore(url);

    }).catch(err => {
        console.log('Error: ', err);
    });
}

function addDataInFirestore(url) {

    db.collection('users').doc(user.id).update({
        username: username,
        displayName: displayName,
        photoUrl: url,
    }).then(() => {
        console.log('Updated Successfully!');

        // UPDATE LOCAL STORAGE DATA
        user.username = username;
        user.displayName = displayName;
        user.photoUrl = url;

        localStorage.setItem('currentUser', JSON.stringify(user));

        loader.style.display = 'none';

        window.location.replace('../screens/home.html');

    }).catch(err => {
        console.log('Error: ', err);
    });
}