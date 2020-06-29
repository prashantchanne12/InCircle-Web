const form = document.querySelector('form');
const user_result = document.querySelector('#result');
const loader = document.querySelector('.chat-loader');
const no_chat = document.querySelector('#no-chat');
const screen_loader = document.querySelector('.screen-loader');
const search_input = document.querySelector('#user');
const user = JSON.parse(localStorage.getItem('currentUser'));
const chats = document.querySelector('#chats');
let count;
let count_2;
let tile_counts = 0;

no_chat.style.display = 'none';
screen_loader.style.display = 'block';

getChatTiles(counts => {
    if (counts > 0) {
        no_chat.style.display = 'none';
        screen_loader.style.display = 'none';

    } else {
        no_chat.style.display = 'block';
        screen_loader.style.display = 'none';

    }
});

search_input.addEventListener('keyup', e => {

    if (search_input.value.trim()) {
        count_2 = 0;
        user_result.innerHTML = '';
        no_chat.style.display = 'none';
        chats.style.display = 'none';
        loader.style.display = 'block';
        db.collection('users')
            .where('displayName', '<=', search_input.value)
            .get()
            .then(querySnapshot => {
                user_result.innerHTML = '';
                querySnapshot.forEach(document => {
                    if (count_2 <= 10) {
                        if (document.id !== user.id) {
                            addUser(document.data(), document.id);
                            count_2++;
                        }
                    }
                });
                loader.style.display = 'none';
            }).catch(e => {
                loader.style.display = 'none';
                console.log('Error ', e);
            });
    } else {
        user_result.innerHTML = '';
        no_chat.style.display = 'block';
        chats.style.display = 'block';

    }
});



form.addEventListener('submit', e => {
    e.preventDefault();
    no_chat.style.display = 'none';
    user_result.innerHTML = '';
    count = 0;

    const query = form.user.value.trim();
    loader.style.display = 'block';
    db.collection('users')
        .where('displayName', '<=', query)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(document => {
                if (count <= 5) {
                    addUser(document.data());
                    count++;
                }
            });
            loader.style.display = 'none';
        }).catch(e => {
            loader.style.display = 'none';
            console.log('Error ', e);
        });
});

function addUser(data, id) {
    const html = `
                <img src="${data.photoUrl}" alt="">
                <div class="search-user-info">
                    <span id="display-name">${data.displayName}</span>
                    <span id="user-name">${data.username}</span>
                </div>
                <button type="button" class="btn btn-link user-click" doc-id="${id}">view</button>

    `;

    let a = document.createElement('div');
    a.id = 'user-result'
    a.docId = id;
    a.className = 'card-search'
    a.innerHTML += html;

    user_result.appendChild(a);

}

user_result.addEventListener('click', e => {
    if (e.target.classList.contains('user-click')) {
        user_id = e.target.getAttribute('doc-id');
        localStorage.setItem('current_profile', user_id);
        window.location = '../screens/user_profile.html';
    }
});


function getChatTiles(callback) {
    db.collection('chat_tiles')
        .doc(user.id)
        .collection('chat_users')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(document => {
                tile_counts++;
                addChatTiles(document.data());
            });
            callback(tile_counts);
        }).catch(e => {
            console.log('Error: ', e);
        });
}

function addChatTiles(data) {
    const div = document.createElement('div');
    div.classList.add('chat-tiles')
    const html = `  
    <img src="${data.photoUrl}" alt="" id="${data.id}">
    <div class="user-info">
        <span id="user-name">${data.username}</span>
        <span id="message-count">5 new message</span>
    </div>
    `;
    div.innerHTML = html;
    chats.appendChild(div);

}

chats.addEventListener('click', e => {
    if (e.target.classList.contains('chat-tiles')) {
        const id = e.target.firstElementChild.getAttribute('id');
        localStorage.setItem('current_profile', id);
        window.location = '../screens/chat_screen.html';
    }

    if (e.target.id === 'message-count') {
        const id = e.target.parentElement.previousElementSibling.getAttribute('id');
        localStorage.setItem('current_profile', id);
        window.location = '../screens/chat_screen.html';

    }

    if (e.target.id === 'user-name') {
        const id = e.target.parentElement.previousElementSibling.getAttribute('id');
        localStorage.setItem('current_profile', id);
        window.location = '../screens/chat_screen.html';
    }

    if (e.target.tagName === 'IMG') {
        const id = e.target.getAttribute('id');
        localStorage.setItem('current_profile', id);
        window.location = '../screens/chat_screen.html';
    }
});


