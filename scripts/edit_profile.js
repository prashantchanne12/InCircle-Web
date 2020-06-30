const img = document.querySelector('form>img');
const user = JSON.parse(localStorage.getItem('currentUser'));
const inputFile = document.querySelector('#img');
const form = document.querySelector('form');
const loader = document.querySelector('.loader');
const alert = document.querySelector('.alert');
const signoutBtn = document.querySelector('.sign-out');

img.setAttribute('src', user.photoUrl);
img.style = 'width:110px; height:135px; padding-top:1rem; display:inline-block;'

form.displayName.value = user.displayName;
form.username.value = user.username;

let file;

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

let displayName;

form.addEventListener('submit', e => {
    e.preventDefault();

    displayName = form.displayName.value.trim();

    if (displayName) {
        if (file) {
            loader.style.display = 'block';
            uploadImage(file);
        } else {
            loader.style.display = 'block';
            addDataInFirestore(user.photoUrl);
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
        displayName: displayName,
        photoUrl: url,
    }).then(() => {
        console.log('Updated Successfully!');

        // UPDATE LOCAL STORAGE DATA
        user.displayName = displayName;
        user.photoUrl = url;

        localStorage.setItem('currentUser', JSON.stringify(user));

        loader.style.display = 'none';
        alert.style.display = 'block';

        window.location.reload('../screens/edit_profile.html');

    }).catch(err => {
        console.log('Error: ', err);
    });
}

signoutBtn.addEventListener('click', e => {
    e.preventDefault();
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        window.location.replace('../index.html');
    }).catch(function (error) {
        // An error happened.
    });
});
