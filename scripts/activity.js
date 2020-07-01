const user = JSON.parse(localStorage.getItem('currentUser'));
const activity = document.querySelector('#activity-posts');
const activity_loader = document.querySelector('.activity-loader>img');
const no_activity = document.querySelector('.no-activity');

let count = 0;

activity_loader.style.display = 'block';

db.collection('feed')
    .doc(user.id)
    .collection('feedItems')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {

        querySnapshot.forEach(documentSnapshot => {
            count++;
            addActivity(documentSnapshot.data());
        });
        activity_loader.style.display = 'none';
        if (count == 0) {
            no_activity.style.display = 'block';
        }

    }).catch(e => {
        console.log('Error', e);
    });

function addActivity(data) {
    let text;
    if (data.type === "follow") {
        text = "Started following you";
    } else if (data.type === "like") {
        text = "Liked your post";
    } else if (data.type === "comment") {
        text = "Commented on your post";
    }

    const when = `${data.timestamp.toDate().toLocaleDateString()}`;

    // dateFns.distanceInWordsToNow(
    //     data.timestamp.toDate(),
    //     { addSuffix: true }
    // );

    let postUrl;
    if (data.mediaUrl) {
        postUrl = data.mediaUrl;
    }

    const div = document.createElement('div');
    div.classList.add('activity');
    div.innerHTML = ` 
    <img src="${data.userProfileImage}" alt="" class="profile-img">
    <div class="info">
        <div class="user-info">
            <span id="username" class="username" uid="${data.userId}">${data.username}</span>
            <span id="detail" class="details">${text}</span>
            <span id="timestamp" class="timestamp">${when}</span>
        </div>
        <div class="info-image" pid="${data.postId}">
            <img src="${postUrl ? postUrl : ""}" alt="" class="post_img">
        </div>
    </div>`;

    activity.appendChild(div);
}

let user_id;
let post_id;

activity.addEventListener('click', e => {
    if (e.target.classList.contains('username')) {
        user_id = e.target.getAttribute('uid');
        getProfile(user_id);

    }
    if (e.target.classList.contains('details')) {
        user_id = e.target.previousElementSibling.getAttribute('uid');
        getProfile(user_id);

    }
    if (e.target.classList.contains('timestamp')) {
        user_id = e.target.previousElementSibling.previousElementSibling.getAttribute('uid');
        getProfile(user_id);

    }
    if (e.target.classList.contains('profile-img')) {
        user_id = e.target.nextElementSibling.firstElementChild.firstElementChild.getAttribute('uid');
        getProfile(user_id);
    }

    if (e.target.classList.contains('post_img')) {
        post_id = e.target.parentElement.getAttribute('pid');
        user_id = e.target.parentElement.previousElementSibling.firstElementChild.getAttribute('uid');

        getPost(user_id, post_id);
    }
});

function getProfile(user_id) {
    localStorage.setItem('current_profile', user_id);
    window.location = '../screens/user_profile.html';
}

function getPost(user_id, post_id) {
    localStorage.setItem('current_profile', user_id);
    localStorage.setItem('currentPost', post_id);

    window.location = '../screens/post.html';
}