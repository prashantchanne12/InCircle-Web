const userId = localStorage.getItem('current_profile');
const user_list = document.querySelector('#count-list');
const followers = localStorage.getItem('followers');
const following = localStorage.getItem('following');
const loader = document.querySelector('#count-list>img');

loader.style.display = 'block';
db.collection(followers ? 'followers' : 'following')
    .doc(userId)
    .collection(followers ? 'userFollowers' : 'userFollowing')
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(document => {
            addUser(document.data());
        });
        loader.style.display = 'none';
    }).catch(e => {
        console.log('Error: ', e);
    });

function addUser(data) {
    const div = document.createElement('div');
    div.classList.add('user-card')
    const html = `
    <div class="user-info" uid="${data.id}">
        <img src="${data.photoUrl}" alt="" class="profile-img">
        <div class="user-details">
            <span class="display-name">${data.displayName}</span>
            <span class="username">${data.username}</span>
        </div>
    </div>
    `;

    div.innerHTML = html;

    user_list.appendChild(div);
}

let user_id;

user_list.addEventListener('click', e => {
    if (e.target.classList.contains('user-info')) {
        user_id = e.target.getAttribute('uid');
        getProfile(user_id);

    }

    if (e.target.classList.contains('username')) {
        user_id = e.target.parentElement.parentElement.getAttribute('uid');
        getProfile(user_id);

    }

    if (e.target.classList.contains('display-name')) {
        user_id = e.target.parentElement.parentElement.getAttribute('uid');
        getProfile(user_id);

    }

    if (e.target.classList.contains('profile-img')) {
        user_id = e.target.parentElement.getAttribute('uid');
        getProfile(user_id);

    }
});

function getProfile(user_id) {
    localStorage.setItem('current_profile', user_id);
    window.location = '../screens/user_profile.html';
}

