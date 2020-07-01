const profileImage = document.querySelector('#profile-image');
const username = document.querySelector('#username');
const displayName = document.querySelector('#display-name');
const userPosts = document.querySelector('.user-posts');
const user = JSON.parse(localStorage.getItem('currentUser'));
const noPost = document.querySelector('.no-posts');
const loader = document.querySelector('.loader-2');
const edit_profile = document.querySelector('.btn');

const grid = document.querySelector('.fa-border-all');
const list = document.querySelector('.fa-list');
const user_post_list = document.querySelector('#user-posts-list');
const loader_2 = document.querySelector('#user-posts-list>img');

const postCount = document.querySelector('#post-count');
const followersCount = document.querySelector('#followers-count');
const followingCount = document.querySelector('#following-count');

profileImage.setAttribute('src', user.photoUrl);
displayName.textContent = user.displayName;
username.textContent = user.username;

const currentUserId = user.id;
let isLiked;


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

followersCount.addEventListener('click', e => {
    localStorage.setItem('current_profile', currentUserId);
    localStorage.setItem('followers', true);
    localStorage.setItem('following', false);
    window.location = '../screens/counts.html';
});

followingCount.addEventListener('click', e => {
    localStorage.setItem('current_profile', currentUserId);
    localStorage.setItem('following', true);
    localStorage.setItem('followers', false);
    window.location = '../screens/counts.html';
});

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

edit_profile.addEventListener('click', e => {
    window.location = '../screens/edit_profile.html';
});

grid.addEventListener('click', e => {
    user_post_list.style.display = 'none';
    userPosts.style.display = 'grid';
    list.classList.remove('current');
    grid.classList.add('current');
});

list.addEventListener('click', e => {

    list.classList.add('current');
    grid.classList.remove('current');
    userPosts.style.display = 'none';
    user_post_list.style.display = 'block';
    user_post_list.style = 'padding-top:2rem';
    loader_2.style = 'display:block; margin: 0 auto;';

    db.collection('posts')
        .doc(user.id)
        .collection('userPosts')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                count++;
                const t = new Timeline(documentSnapshot.data());
                t.createPost(post => {
                    const div = document.createElement('div');
                    div.innerHTML = post.outerHTML;
                    user_post_list.appendChild(div);
                });

            });
            loader_2.style.display = 'none';
            if (count === 0) {
                noPost.style.display = 'block';
            } else {
                noPost.style.display = 'none';
            }
        });
});

user_post_list.addEventListener('click', e => {
    if (e.target.classList.contains('fa-heart')) {
        // HANDLE LIKES 
        const uid = e.target.getAttribute('uid');
        const pid = e.target.getAttribute('pid');
        handlLikes(uid, pid);
    }

    if (e.target.classList.contains('fa-comment-alt')) {
        // HANDLE COMMENTS
        const pid = e.target.previousElementSibling.getAttribute('pid');
        const uid = e.target.previousElementSibling.getAttribute('uid');
        localStorage.setItem('currentPost', pid);
        localStorage.setItem('currentPostUserId', uid);
        window.location = '../screens/comments.html';
    }

    if (e.target.classList.contains('profileImg')) {
        user_id = e.target.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.getAttribute('uid');

        getProfile(user_id);

    }

    if (e.target.classList.contains('username')) {
        user_id = e.target.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.firstElementChild.getAttribute('uid');

        getProfile(user_id);
    }
});

function getProfile(user_id) {
    localStorage.setItem('current_profile', user_id);
    window.location = '../screens/user_profile.html';
}

user_post_list.addEventListener('dblclick', e => {
    if (e.target.parentElement.classList.contains('post-image')) {
        // HANDLE LIKES 
        const uid = e.target.parentElement.nextElementSibling.firstElementChild.firstElementChild.getAttribute('uid');
        const pid = e.target.parentElement.nextElementSibling.firstElementChild.firstElementChild.getAttribute('pid');
        handlLikes(uid, pid);
    }
});

function checkIfLiked(uid, pid) {

    db.collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(pid)
        .get()
        .then(documentSnapshot => {
            const likes = documentSnapshot.data().likes;
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
                // UNLIKE POST
                Array.from(document.querySelectorAll('.fa-heart')).forEach(element => {
                    if (element.getAttribute('pid') === pid) {
                        element.style = 'font-weight: 0';
                        element.parentElement.nextElementSibling.firstElementChild.textContent = `${parseInt(element.parentElement.nextElementSibling.firstElementChild.textContent) - 1} Likes`;
                        return;
                    }
                });
                unlikePost(uid, pid);

            } else {
                // LIKE POST
                Array.from(document.querySelectorAll('.fa-heart')).forEach(element => {
                    if (element.getAttribute('pid') === pid) {
                        element.style = 'font-weight: 600';
                        element.parentElement.parentElement.previousElementSibling.lastElementChild.style.display = 'block';
                        setTimeout(() => {
                            element.parentElement.parentElement.previousElementSibling.lastElementChild.style.display = 'none';
                        }, 500);
                        element.parentElement.nextElementSibling.firstElementChild.textContent = `${parseInt(element.parentElement.nextElementSibling.firstElementChild.textContent) + 1} Likes`;

                    }
                });
                likePost(uid, pid);
            }

        }).catch(e => {
            console.log('Error: ', e);
        });
}

function handlLikes(uid, pid) {
    checkIfLiked(uid, pid);
};

function updateLikes(uid, pid) {
    let count = 0;
    db.collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(pid)
        .get()
        .then(documentSnapshot => {
            const likes = documentSnapshot.data().likes;

            for (const [k, v] of Object.entries(likes)) {
                if (v == true) {
                    count++;
                }
            }
            likeCounts.textContent = `${count.toString()} Likes`;
        });

}

function likePost(uid, pid) {

    db.collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(pid)
        .update({
            [`likes.${currentUserId}`]: true

        }
        ).then(() => {
            console.log('post liked');

        }).catch(e => {
            console.log('Erro: ', e);
        });

}

function unlikePost(uid, pid) {
    db.collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(pid)
        .update({
            [`likes.${currentUserId}`]: false
        }
        ).then(() => {
            console.log('post unliked');
            // REMOVE NOTIFICATION FROM USERS FEED
            db.collection('feed')
                .doc(uid)
                .collection('feedItems')
                .where('postId', '==', pid)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(documentSnapshot => {
                        documentSnapshot.ref.delete();
                    });
                    console.log('feed deleted');
                });
        }).catch(e => {
            console.log('Erro: ', e);
        });
}
