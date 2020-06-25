const profileImg = document.querySelector('.user-post-header>img');
const userName = document.querySelector('#user-name');
const userLocation = document.querySelector('#location');
const postImg = document.querySelector('.post-image>img');
const likeCounts = document.querySelector('.counts>span');
const userNameDesc = document.querySelector('#user-name-desc');
const caption = document.querySelector('#caption-desc');
const timeStamp = document.querySelector('#timestamp-desc');

const userId = localStorage.getItem('current_profile');
const currentPost = localStorage.getItem('currentPost');
const user = JSON.parse(localStorage.getItem('currentUser'));
const post_loader = document.querySelector('.post-loader > img');

const likeBtn = document.querySelector('.fa-heart');
const commentBtn = document.querySelector('.fa-comment-alt');
const currentUserId = user.id.toString();

const heartImage = document.querySelector('.heart');


let isLiked;

getPost();
updateLikes();
checkIfLiked();

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
        });
}



function updatePostUI(data) {
    postImg.setAttribute('src', data.mediaUrl);
    post_loader.style.display = 'none';
    userLocation.textContent = data.location;
    const when = dateFns.distanceInWordsToNow(
        data.timestamp.toDate(),
        { addSuffix: true }
    );
    timeStamp.textContent = when;
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

// HANDLE LIKES
postImg.addEventListener('dblclick', e => {
    handlLikes();
});

likeBtn.addEventListener('click', e => {

});

function checkIfLiked() {

    db.collection('posts')
        .doc(userId)
        .collection('userPosts')
        .doc(currentPost)
        .get()
        .then(documentSnapshot => {
            const likes = documentSnapshot.data().likes;
            console.log(likes);
            for (const [k, v] of Object.entries(likes)) {
                if (currentUserId.localeCompare(k) === 0) {
                    if (v === true) {
                        isLiked = true;
                    } else if (v === false) {
                        isLiked = false;
                    }
                }
            }

            if (isLiked) {
                likeBtn.style = 'font-weight: 600;';

            } else {
                likeBtn.style = 'font-weight: 0;';

            }

        }).catch(e => {
            console.log('Error: ', e);
        });
}


function handlLikes() {
    checkIfLiked();
    if (isLiked) {
        // UNLIKE POST
        unlikePost();

        likeBtn.style = 'font-weight: 0;';
    } else {
        // LiKE POST
        likePost();
        heartImage.style.display = 'block';
        setTimeout(() => {
            heartImage.style.display = 'none';
        }, 500);
        likeBtn.style = 'font-weight: 600;';
    }
};

function likePost() {

    db.collection('posts')
        .doc(userId)
        .collection('userPosts')
        .doc(currentPost)
        .update({
            [`likes.${currentUserId}`]: true

        }
        ).then(() => {
            updateLikes();
        }).catch(e => {
            console.log('Erro: ', e);
        });
}

function unlikePost() {
    db.collection('posts')
        .doc(userId)
        .collection('userPosts')
        .doc(currentPost)
        .update({
            [`likes.${currentUserId}`]: false

        }
        ).then(() => {
            updateLikes();
        }).catch(e => {
            console.log('Erro: ', e);
        });
}

function updateLikes() {
    let count = 0;
    db.collection('posts')
        .doc(userId)
        .collection('userPosts')
        .doc(currentPost)
        .get()
        .then(documentSnapshot => {
            const likes = documentSnapshot.data().likes;

            for (const [k, v] of Object.entries(likes)) {
                if (v == true) {
                    count++;
                }
            }
            console.log(count);
            likeCounts.textContent = `${count.toString()} Likes`
        });

}

// HANDLE COMMENTS
commentBtn.addEventListener('click', e => {

});
