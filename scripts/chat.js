const form = document.querySelector('form');
const user_result = document.querySelector('#result');
const loader = document.querySelector('.chat-loader');
const no_chat = document.querySelector('#no-chat');
const search_input = document.querySelector('#user');
let count;
let count_2;

search_input.addEventListener('keyup', e => {

    if (search_input.value.trim()) {
        count_2 = 0;
        user_result.innerHTML = '';
        no_chat.style.display = 'none';
        loader.style.display = 'block';
        db.collection('users')
            .where('username', '<=', search_input.value)
            .get()
            .then(querySnapshot => {
                user_result.innerHTML = '';
                querySnapshot.forEach(document => {
                    if (count_2 <= 5) {
                        addUser(document.data());
                        count_2++;
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
        .where('username', '<=', query)
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

function addUser(data) {
    const html = `
                <img src="${data.photoUrl}" alt="">
                <div class="search-user-info">
                    <span id="display-name">${data.displayName}</span>
                    <span id="user-name">${data.username}</span>
                </div>
    `;

    let a = document.createElement('div');
    a.id = 'user-result'
    a.className = 'card-search'
    a.innerHTML += html;

    user_result.appendChild(a);

}