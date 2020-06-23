const profileImage = document.querySelector('#profile-image');
const username = document.querySelector('#username');
const displayName = document.querySelector('#display-name');
const userPosts = document.querySelector('.user-posts');
const user = JSON.parse(localStorage.getItem('currentUser'));
const noPost = document.querySelector('.no-posts');
const loader = document.querySelector('.loader-2');

profileImage.setAttribute('src', user.photoUrl);
displayName.textContent = user.displayName;
username.textContent = user.username;

// db.collection('posts')
//     .doc(user.id)
//     .collection('usersPosts')
//     .onSnapshot(snapshot => {
//         snapshot.docChanges().forEach(change => {
//             loader.style.display = 'block';
//             const doc = change.doc;
//             if (change.type === 'added') {
//                 addImage(doc.data());
//             }
//         });
//     });

loader.style.display = 'block';
let count = 0;
db.collection('posts')
    .doc(user.id)
    .collection('usersPosts')
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            addImage(doc.data());
            count++;
        });
        loader.style.display = 'none';
        if (count == 0) {
            noPost.style.display = 'block';
        } else {
            noPost.style.display = 'none';
        }

    }).catch(err => {
        console.log('Erro: ', err);
    });


function addImage(data) {

    const img = document.createElement('img');
    img.setAttribute('src', data.mediaUrl);
    userPosts.appendChild(img);

}