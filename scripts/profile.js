const profileImage = document.querySelector('#profile-image');
const username = document.querySelector('#username');
const displayName = document.querySelector('#display-name');
const userPosts = document.querySelector('.user-posts');
const user = JSON.parse(localStorage.getItem('currentUser'));
const noPost = document.querySelector('.no-posts');
const loader = document.querySelector('.loader-2');

const postCount = document.querySelector('#post-count');
const followersCount = document.querySelector('#followers-count');
const followingCount = document.querySelector('#following-count');

profileImage.setAttribute('src', user.photoUrl);
displayName.textContent = user.displayName;
username.textContent = user.username;



// db.collection('posts')
//     .doc(user.id)
//     .collection('usersPosts')
//     .onSnapshot(snapshot => {
//         snapshot.docChanges().forEach(change => {
//             loader.style.display = 'block';
//             const doc = change.doc;
//             if (change.type === 'added') {
//                 addImage(doc.data());
//             }
//         });
//     });

loader.style.display = 'block';
let count = 0;
db.collection('posts')
    .doc(user.id)
    .collection('userPosts')
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            addImage(doc.data(), doc.id);
            count++;
        });
        loader.style.display = 'none';
        if (count == 0) {
            noPost.style.display = 'block';
        } else {
            noPost.style.display = 'none';
        }

    }).catch(err => {
        console.log('Erro: ', err);
    });


function addImage(data, id) {

    const img = document.createElement('img');
    img.setAttribute('src', data.mediaUrl);
    img.setAttribute('doc-id', id);
    userPosts.appendChild(img);

}

countPosts()
countFollowers();
countFollowing();


userPosts.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
        const postId = e.target.getAttribute('doc-id');
        localStorage.setItem('currentPost', postId);
        localStorage.setItem('current_profile', user.id);
        window.location = '../screens/post.html';
    }
});


let following = 0;
let followers = 0;
let posts = 0;

function countFollowing() {
    db.collection('following')
        .doc(user.id)
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
        .doc(user.id)
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
        .doc(user.id)
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