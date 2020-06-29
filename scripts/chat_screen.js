const form = document.querySelector('form');
const user = JSON.parse(localStorage.getItem('currentUser'));
const receiverId = localStorage.getItem('current_profile');
const senderId = user.id;
const chatList = document.querySelector('#chat-msg-list');
const loader = document.querySelector('.chat-screen-loader');
let chatId = '';
let sender = false;
let receiver = false;
let getData = undefined;
let data = undefined;

loader.style.display = 'block';

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

// GET CHATS
getChats();

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

function getChats() {
    db.collection('messages')
        .doc(chatId)
        .collection('chats')
        .orderBy('time', 'desc')
        .onSnapshot(onSnapshot => {
            onSnapshot.docChanges().forEach(change => {
                const doc = change.doc;
                if (change.type === 'added') {
                    addMessageBubble(doc.data(), doc.id);

                    updateToSeen(doc.id);

                }
                if (change.type === 'modified') {
                    changeToSeen(doc.id);
                    deleteMsg(doc.id);
                }

                if (change.type === 'removed') {
                    removeMsg(doc.id);
                }
            });
            loader.style.display = 'none';

        });
}

function addMessageBubble(data, id) {
    const isMe = senderId === data.userId;
    const isSeen = data.isSeen;
    const div = document.createElement('div');
    div.classList.add('msg-row');
    div.classList.add(isMe ? 'you-msg' : 'other-msg');

    const html = `
    <div class="msg-text" doc="${id}">${data.text}</div>
    ${isMe ? `<i class="fas fa-check-circle ${isSeen ? "read" : "unread"} "></i>` : ""}
    `;

    div.innerHTML = html;

    chatList.appendChild(div);

}

function changeToSeen(id) {
    document.querySelectorAll('.unread').forEach(element => {
        if (element.previousElementSibling.getAttribute('doc') === id) {
            element.classList.remove('unread');
            element.classList.add('read');
        }
    });
}

function removeMsg(id) {
    document.querySelectorAll('.read').forEach(element => {
        if (element.previousElementSibling.getAttribute('doc') === id) {
            element.parentElement.remove();
        }
    });

    document.querySelectorAll('.other-msg').forEach(element => {
        if (element.firstElementChild.getAttribute('doc') === id) {
            element.remove();
        }
    });
}

function deleteMsg(id) {
    db.collection('messages')
        .doc(chatId)
        .collection('chats')
        .doc(id)
        .get()
        .then(document => {
            if (document.data().isSeen === true) {
                setTimeout(() => {
                    document.ref.delete();
                }, 15000);
            }
        });
}

function updateToSeen(id) {
    db.collection('messages')
        .doc(chatId)
        .collection('chats')
        .doc(id)
        .get()
        .then(document => {
            if (document.data().receiverId === senderId) {
                db.collection('messages')
                    .doc(chatId)
                    .collection('chats')
                    .doc(document.id)
                    .update({
                        isSeen: true,
                    }).then(() => {
                        console.log('udpated');
                    }).catch(e => {
                        console.log('Error: ', e);
                    });
            }
        }).catch(e => {
            console.log('Error: ', e);
        });

}