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

const list = document.querySelector('.fa-list');
let data;

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
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    followers++;
                } else {
                    followers--;
                }
            });
            followersCount.textContent = followers.toString();
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
        .onSnapshot(snapshot => {
            if (snapshot.exists) {
                unfollowBtn.style.display = 'block';
                followBtn.style.display = 'none';
            } else {
                followBtn.style.display = 'block';
                unfollowBtn.style.display = 'none';
            }
        });
}


followBtn.addEventListener('click', e => {

    // ADD USER TO THE USERS FOLLOWERS LIST
    db.collection('followers')
        .doc(userId)
        .collection('userFollowers')
        .doc(user.id)
        .set({
            displayName: user.displayName,
            id: user.id,
            photoUrl: user.photoUrl,
            username: user.username
        }).then(() => {
            console.log('Followed Successfully!');
        }).catch(e => {
            console.log('Error: ', err);
        });

    checkFollowing();

    // ADD USER TO YOUR FOLLOWING LIST
    db.collection('following')
        .doc(user.id)
        .collection('userFollowing')
        .doc(userId)
        .set({
            displayName: data.displayName,
            id: userId,
            photoUrl: data.photoUrl,
            username: data.username
        }).then(() => {
            console.log('Added in Following list!');
        }).catch(e => {
            console.log('Error: ', err);
        });

});

unfollowBtn.addEventListener('click', e => {
    console.log('Unfollow');
    // REMOVE USER FROM THE USERS FOLLOWERS LIST
    db.collection('followers')
        .doc(userId)
        .collection('userFollowers')
        .doc(user.id)
        .delete()
        .then(() => {
            console.log('removed!');
        }).catch(e => {
            console.log('Error : ', e);
        });

    checkFollowing();

    // REMOVE USER FROM YOUR FOLLOWING LIST
    db.collection('following')
        .doc(user.id)
        .collection('userFollowing')
        .doc(userId)
        .delete()
        .then(() => {
            console.log('Removed');
        }).catch(e => {
            console.log('Error: ', e);
        });
});

list.addEventListener('click', e => {
    console.log('click');
});


userPosts.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
        const postId = e.target.getAttribute('doc-id');
        localStorage.setItem('currentPost', postId);
        window.location = '../screens/post.html';
    }
});
