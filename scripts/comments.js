const profileImg = document.querySelector('.user-info>img');
const userName = document.querySelector('#user-name');
const timeStamp = document.querySelector('#timestamp');
const comment = document.querySelector('#comment-text');
const form = document.querySelector('form');
const currentPost = localStorage.getItem('currentPost');
const currentPostUserId = localStorage.getItem('currentPostUserId');
const commentSection = document.querySelector('#comments');
const user = JSON.parse(localStorage.getItem('currentUser'));
const loader = document.querySelector('.loader-2');



loadComments();

function loadComments() {
    loader.style.display = 'block';
    db.collection('comments')
        .doc(currentPost)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                const doc = change.doc;
                if (change.type === 'added') {
                    addComments(doc.data());
                }
            });
            loader.style.display = 'none';
        });


}

function addComments(doc) {
    const div = document.createElement('div');
    const when = `${doc.timestamp.toDate().toLocaleDateString()}`;

    // dateFns.distanceInWordsToNow(
    //     doc.timestamp.toDate(),
    //     { addSuffix: true }
    // );
    const html = `
    <div class="header">
        <div class="user-info">
            <img src="${doc.avatarUrl}" alt="">
            <div class="text">
                <span id="comment-text">${doc.comment}</span>
                <span id="user-name">${doc.username}</span>
                <span id="timestamp">${when}</span>
            </div>
        </div>
    </div>
    `;

    div.innerHTML += html;
    commentSection.appendChild(div);

}


function submitComment(comment) {
    db.collection('comments')
        .doc(currentPost)
        .collection('comments')
        .add({
            avatarUrl: user.photoUrl,
            comment: comment,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
            userId: user.id,
            username: user.username,
        }).then(() => {
            console.log('comment added');
        }).catch(e => {
            consolo.log('Error: ', e);
        });

    db.collection('posts')
        .doc(currentPostUserId)
        .collection('userPosts')
        .doc(currentPost)
        .get()
        .then(documentSnapshot => {
            // ADD NOTIFICATION TO USERS FEED
            db.collection('feed')
                .doc(currentPostUserId)
                .collection('feedItems')
                .add({
                    isSeen: false,
                    ownerId: currentPostUserId,
                    timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
                    type: 'comment',
                    mediaUrl: documentSnapshot.data().mediaUrl,
                    commentData: comment,
                    userId: user.id,
                    postId: currentPost,
                    userProfileImage: user.photoUrl,
                    username: user.username,
                }).then(() => {
                    console.log('Added Feed!');
                }).catch(e => {
                    console.log('Error', e);
                });
        });


}


form.addEventListener('submit', e => {
    e.preventDefault();
    const commentText = form.comment.value.trim();
    submitComment(commentText);
    form.reset();
});