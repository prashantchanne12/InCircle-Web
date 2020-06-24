const profileImage = document.querySelector('#profile-image');
const username = document.querySelector('#username');
const displayName = document.querySelector('#display-name');
const userPosts = document.querySelector('.user-posts');
const user = JSON.parse(localStorage.getItem('currentUser'));
const noPost = document.querySelector('.no-posts');
const loader = document.querySelector('.loader-2');
const userId = localStorage.getItem('current_profile');

db.collection('users')
    .doc(userId)
    .get()
    .then(document => {
        data = document.data();

        profileImage.setAttribute('src', data.photoUrl);
        displayName.textContent = data.displayName;
        username.textContent = data.username;

        getPosts();

    });

function getPosts() {

    loader.style.display = 'block';
    let count = 0;

    db.collection('posts')
        .doc(userId)
        .collection('userPosts')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(document => {
                addImage(document.data(), document.id);
                count++;
            });
            loader.style.display = 'none';
            if (count == 0) {
                noPost.style.display = 'block';
            } else {
                noPost.style.display = 'none';
            }
        }).catch(err => {
            console.log('Error: ', err);
        });

}


function addImage(data, id) {

    const img = document.createElement('img');
    img.setAttribute('src', data.mediaUrl);
    img.setAttribute('doc-id', id);
    userPosts.appendChild(img);

}

// userPosts.addEventListener('click', e => {
//     if (e.target.tagName === 'IMG') {
//         localStorage.setItem('currentPost',)
//         // HANDLE POST VIEW
//         window.location = '../screens/post.html';
//     }
// });