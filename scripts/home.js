const user = JSON.parse(localStorage.getItem('currentUser'));
const userPosts = document.querySelector('#user-posts');
const currentUserId = user.id;
let isLiked;
const loader = document.querySelector('#user-posts>img');


loader.style.display = 'block';

userPosts.addEventListener('click', e => {
    if (e.target.classList.contains('fa-heart')) {
        // HANDLE LIKES 
        const uid = e.target.getAttribute('uid');
        const pid = e.target.getAttribute('pid');
        handlLikes(uid, pid);
    }

    if (e.target.classList.contains('fa-comment-alt')) {
        // HANDLE COMMENTS
        const pid = e.target.previousElementSibling.getAttribute('pid');
        localStorage.setItem('currentPost', pid);
        window.location = '../screens/comments.html';
    }
});

userPosts.addEventListener('dblclick', e => {
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
        }).catch(e => {
            console.log('Erro: ', e);
        });
}


db.collection('timeline')
    .doc(user.id)
    .collection('timelinePosts')
    .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const doc = change.doc;
            const t = new Timeline(doc.data());
            t.createPost((post) => {
                const div = document.createElement('div');
                div.innerHTML = post.outerHTML;
                userPosts.appendChild(div);
            });
        });
        loader.style.display = 'none';
    });

// db.collection('timeline')
//     .doc(user.id)
//     .collection('timelinePosts')
//     .get()
//     .then(querySnapshot => {
//         querySnapshot.forEach(documentSnapshot => {
//             const t = new Timeline(documentSnapshot.data());
//             t.createPost(post => {
//                 const div = document.createElement('div');
//                 div.innerHTML = post.outerHTML;
//                 userPosts.appendChild(div);
//             });


//         });
//         loader.style.display = 'none';

//     });