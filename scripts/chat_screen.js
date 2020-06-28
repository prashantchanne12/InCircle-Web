const form = document.querySelector('form');
const user = JSON.parse(localStorage.getItem('currentUser'));
let user1 = false;
let user2 = false;

form.addEventListener('submit', e => {
    e.preventDefault();

    // CHECK IF CHAT TILES EXISTS
    checkChatTilesExists();

    console.log('send');
});

function addshit() {
    db.collection('chat_tiles')
        .doc('shit')
        .set({
            hello: 123,
        }).then(() => {

        }).catch(e => {
            console.log('error');
        });
}

function checkChatTilesExists() {
    db.collection('chat_tiles')
        .doc()
        .get()
        .then(document => {
            console.log(document);
            console.log(document.exists);
        }).catch(e => {
            console.log('Error: ', e)
        });
}