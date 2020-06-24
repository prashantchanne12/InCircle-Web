const profileImage = document.querySelector('#profile-image');
const username = document.querySelector('#username');
const displayName = document.querySelector('#display-name');
const userPosts = document.querySelector('.user-posts');
const user = JSON.parse(localStorage.getItem('currentUser'));
const noPost = document.querySelector('.no-posts');
const loader = document.querySelector('.loader-2');
const userId = localStorage.getItem('current_profile');
const followBtn = document.querySelector('.btn-follow');
const unfollowBtn = document.querySelector('.btn-unfollow');
const postCount = document.querySelector('#post-count');
const followersCount = document.querySelector('#followers-count');
const followingCount = document.querySelector('#following-count');

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



checkFollowing();
countPosts()
countFollowers();
countFollowing();


// userPosts.addEventListener('click', e => {
//     if (e.target.tagName === 'IMG') {
//         localStorage.setItem('currentPost',)
//         // HANDLE POST VIEW
//         window.location = '../screens/post.html';
//     }
// });
let following = 0;
let followers = 0;
let posts = 0;

function countFollowing() {
    db.collection('following')
        .doc(userId)
        .collection('userFollowing')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(document => {
                following++;
            });
            followingCount.textContent = following.toString();

        }).catch(err => {
            console.log('Error: ', err);
        });
}

function countFollowers() {
    db.collection('followers')
        .doc(userId)
        .collection('userFollowers')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(document => {
                followers++;
            });
            followersCount.textContent = followers.toString();

        }).catch(err => {
            console.log(err);
        });
}

function countPosts() {
    db.collection('posts')
        .doc(userId)
        .collection('userPosts')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(document => {
                posts++;
            });
            postCount.textContent = posts.toString();
        }).catch(err => {
            console.log(err);
        });
}

function checkFollowing() {
    db.collection('followers')
        .doc(userId)
        .collection('userFollowers')
        .doc(user.id)
        .get()
        .then(documentSnapshot => {
            if (documentSnapshot.exists) {
                unfollowBtn.style.display = 'block';

            } else {
                followBtn.style.display = 'block';
            }
        });
}

followBtn.addEventListener('click', e => {
    console.log('follow');
    // ADD USER TO THE USERS FOLLOWERS LIST

    // ADD USER TO YOUR FOLLOWING LIST
});

unfollowBtn.addEventListener('click', e => {
    console.log('Unfollow');
    // ADD USER TO THE USERS FOLLOWERS LIST

    // ADD USER TO YOUR FOLLOWING LIST
});

