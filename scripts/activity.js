const user = JSON.parse(localStorage.getItem('currentUser'));
const activity = document.querySelector('#activity-posts');
const activity_loader = document.querySelector('.activity-loader>img');

activity_loader.style.display = 'block';

db.collection('feed')
    .doc(user.id)
    .collection('feedItems')
    .orderBy('timestamp', 'desc')
    .get()
    .then(querySnapshot => {

        querySnapshot.forEach(documentSnapshot => {
            addActivity(documentSnapshot.data());
        });
        activity_loader.style.display = 'none';

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

    const when = dateFns.distanceInWordsToNow(
        data.timestamp.toDate(),
        { addSuffix: true }
    );

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
            <span id="username">${data.username}</span>
            <span id="detail">${text}</span>
            <span id="timestamp">${when}</span>
        </div>
        <div class="info-image">
            <img src="${postUrl ? postUrl : ""}" alt="">
        </div>
    </div>`;

    activity.appendChild(div);
}

