const form = document.querySelector('form');
const user = JSON.parse(localStorage.getItem('currentUser'));
const receiverId = localStorage.getItem('current_profile');
const senderId = user.id;
let chatId = '';
let sender = false;
let receiver = false;
let getData = undefined;
let data = undefined;

// CHECK IF CHAT TILES EXISTS
checkIfSenderExisted(issender => {
    sender = issender;
    checkIfRecieverExisted(isReciver => {
        receiver = isReciver;
        getData = sender && receiver;
    });
});

// GET CHAT ID
getChatId();

// GET RECIEVRS DETAILS
getReciverDetails();

form.addEventListener('submit', e => {
    e.preventDefault();
    const message = form.chat.value.trim();
    if (message.length == 0) {
        return;
    }
    if (getData) {
        db.collection('messages')
            .doc(chatId)
            .collection('chats')
            .add({
                'text': message,
                'userId': senderId,
                'receiverId': receiverId,
                'isSeen': false,
                'time': firebase.firestore.Timestamp.fromDate(new Date())
            }).then(() => {
                console.log('message sent');
            }).catch(e => {
                console.log('Error: ', e);
            });
    } else {

        db.collection('chat_tiles')
            .doc(senderId)
            .collection('chat_users')
            .doc(receiverId)
            .set({
                'id': receiverId,
                'time': firebase.firestore.Timestamp.fromDate(new Date()),
                'photoUrl': data.photoUrl,
                'username': data.username,
            }).then(() => {
                console.log('receiver added');
            }).catch(e => {
                console.log('Error: ', e);
            });

        db.collection('chat_tiles')
            .doc(receiverId)
            .collection('chat_users')
            .doc(senderId)
            .set({
                'id': senderId,
                'time': firebase.firestore.Timestamp.fromDate(new Date()),
                'photoUrl': user.photoUrl,
                'username': user.username,
            }).then(() => {
                console.log('sender added');
            }).catch(e => {
                console.log('Error: ', e);
            });

        db.collection('messages')
            .doc(chatId)
            .collection('chats')
            .add({
                'text': message,
                'userId': senderId,
                'receiverId': receiverId,
                'isSeen': false,
                'time': firebase.firestore.Timestamp.fromDate(new Date()),
            }).then(() => {
                console.log('message sent');
            }).catch(e => {
                console.log('Error: ', e);
            });

        getData = true;

    }

    form.reset();

});

function checkIfSenderExisted(callback) {
    db.collection('chat_tiles')
        .doc(senderId)
        .get()
        .then(document => {
            callback(document.exists);
        }).catch(e => {
            console.log('Error: ', e);
        });
}

function checkIfRecieverExisted(callback) {
    db.collection('chat_tiles')
        .doc(receiverId)
        .get()
        .then(document => {
            callback(document.exists);
        }).catch(e => {
            console.log('Error: ', e);
        });
}

function getChatId() {
    // we are appending smaller to greater
    // -1 : first string is smaller
    //  1 : first string is greater and 2nd is smaller
    //  0 : both are equal
    if (senderId.localeCompare(receiverId) == -1) {
        chatId = senderId + receiverId;
    } else {
        chatId = receiverId + senderId;
    }
}

function getReciverDetails() {
    db.collection('users')
        .doc(receiverId)
        .get()
        .then(document => {
            data = document.data();
        }).catch(e => {
            console.log('Error: ', e);
        });
}