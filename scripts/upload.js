const form = document.querySelector('form');
const card = document.querySelector('.card-upload');
const inputFile = document.querySelector('#img-placeholder');
const img = document.querySelector('form>img');
const alert_danger = document.querySelector('.alert-danger');
const alert_success = document.querySelector('.alert-success');
const loader = document.querySelector('.loader');


let file;
const user = JSON.parse(localStorage.getItem('currentUser'));



form.addEventListener('submit', e => {
    e.preventDefault();

    if (file) {
        const caption = form.caption.value.trim();
        const location = form.location.value.trim();
        uploadPost(file, caption, location);
        alert_danger.style.display = 'none';
    } else {
        alert_danger.style.display = 'block';
        setTimeout(() => {
            alert_danger.style.display = 'none';
        }, 3000)
    }

});

function uploadPost(file, caption, location) {
    loader.style.display = 'block';

    const ref = firebase.storage().ref();
    const name = new Date() + '_' + file.name;

    const task = ref.child(`posts/${name}`).put(file);

    task.then(snapshot => {
        return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
        url = downloadURL;
        console.log(url);

        createPostInFirestore(url, caption, location);

    }).catch(err => {
        console.log('Error: ', err);
    });
}

function createPostInFirestore(url, caption, location) {
    const postId = new Date().getTime().toString();
    db.collection('posts')
        .doc(user.id)
        .collection('usersPosts')
        .doc(postId)
        .set({
            postId: postId,
            ownerId: user.id,
            username: user.username,
            mediaUrl: url,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            desc: caption,
            location: location,
            likes: {},
        }).then(() => {
            loader.style.display = 'none';

            form.reset();
            img.setAttribute('src', '../images/placeholder.png');
            img.style = 'width:550px; height:250px';
            card.style = 'height:85vh';


            alert_success.style.display = 'block';
            setTimeout(() => {
                alert_success.style.display = 'none';
            }, 3000);

        }).catch(err => {
            console.log('Error ', err);
        });
}

inputFile.addEventListener('change', e => {
    console.log(inputFile.files[0]);
    file = inputFile.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener('load', e => {
            img.style = "width:40%; height:40%;";
            card.style = "height:100vh";

            img.setAttribute('src', reader.result);
        });

        reader.readAsDataURL(file);
    }

});