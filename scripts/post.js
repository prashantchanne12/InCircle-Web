const profileImg = document.querySelector('.user-post-header>img');
const userName = document.querySelector('#user-name');
const userLocation = document.querySelector('#location');
const postImg = document.querySelector('.post-image>img');
const likeCounts = document.querySelector('counts>span');
const userNameDesc = document.querySelector('#user-name-desc');
const caption = document.querySelector('#caption-desc');
const timeStamp = document.querySelector('#timestamp-desc');

const userId = localStorage.getItem('current_profile');
const currentPost = localStorage.getItem('currentPost');

const post_loader = document.querySelector('.post-loader > img');



getPost();

function getPost() {
    post_loader.style.display = 'block';
    db.collection('posts')
        .doc(userId)
        .collection('userPosts')
        .doc(currentPost)
        .get()
        .then(documentSnapshot => {
            updatePostUI(documentSnapshot.data());
            getProfileImage(documentSnapshot.data());
            console.log(documentSnapshot.data());
        });
}

function updatePostUI(data) {
    postImg.setAttribute('src', data.mediaUrl);
    post_loader.style.display = 'none';
    userLocation.textContent = data.location;
    timeStamp.textContent = data.timeStamp;
    userName.textContent = data.username;
    userNameDesc.textContent = data.username;
    caption.textContent = data.desc;
}

function getProfileImage(data) {
    db.collection('users')
        .doc(data.ownerId)
        .get()
        .then(documentSnapshot => {
            profileImg.setAttribute('src', documentSnapshot.data().photoUrl);
        });
}