const loginBtn = document.querySelector('.login');
let user;
loginBtn.addEventListener('click', e => {
    siginWithGoogle();
});


function siginWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        user = result.user;
        createUserInFirestore(user);
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log('error');
        console.log(errorCode)
        console.log(errorMessage)
        console.log(email)
        // ...
    });
}

// ADD USER IN FIRESTORE
function createUserInFirestore(userData) {
    console.log(userData);
    const user = {
        id: userData.uid,
        displayName: userData.displayName,
        photoUrl: userData.photoURL,
        email: userData.email,
        username: '',
    }

    db.collection('users').doc(userData.uid).set(user)
        .then(() => {
            console.log(`${userData.displayName} Added`);

            // ADDING CURRENT USER TO LOCAL STORAG
            localStorage.setItem('currentUser', JSON.stringify(user));

            window.location.replace('./screens/set_up_profile.html');

        })
        .catch(err => {
            console.log('Error: ', err);
        });
}

