class Timeline {
    constructor(data) {
        this.data = data;
    }

    getProfileImg(callback) {
        db.collection('users')
            .doc(this.data.ownerId)
            .get()
            .then(documentSnapshot => {
                callback(documentSnapshot.data().photoUrl);
            });
    }

    getTimeStamp() {
        const when = dateFns.distanceInWordsToNow(
            this.data.timestamp.toDate(),
            { addSuffix: true }
        );
        return when;
    }

    getLikes() {
        let count = 0;

        for (const [k, v] of Object.entries(this.data.likes)) {
            if (v == true) {
                count++;
            }
        }
        return count.toString();
    }

    async checkIfLiked(callback) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const currentUserId = user.id;

        await db.collection('posts')
            .doc(this.data.ownerId)
            .collection('userPosts')
            .doc(this.data.postId)
            .get()
            .then(documentSnapshot => {
                const likes = documentSnapshot.data().likes;
                for (const [k, v] of Object.entries(likes)) {
                    if (currentUserId.localeCompare(k) === 0) {
                        if (v === true) {
                            callback(true);
                        } else if (v === false) {
                            callback(false);
                        }
                    }
                }

            }).catch(e => {
                console.log('Error: ', e);
            });
    }


    createPost(callback) {
        this.checkIfLiked((isliked) => {
            const isLiked = isliked;
            this.getProfileImg((photoUrl) => {

                const post = document.createElement('section');
                post.id = 'user-post';
                post.innerHTML = `
            <div class="user-post-header">
                    <img src="${photoUrl}" alt="">
                    <div class="data-info">
                        <span id="user-name">${this.data.username}</span>
                        <span id="location">${this.data.location}</span>
                    </div>
                </div>
                <div class="post-image">
                    <img src="${this.data.mediaUrl}" alt="" style="width: 100%;">
                    <img src="../images/heart.png" alt="" class="heart" pid="${this.data.postId}">
                </div>
                <div class="user-post-footer">
                    <div class="icons">
                        <i class="far fa-heart" uid="${this.data.ownerId}" pid="${this.data.postId}" style="${isLiked ? "font-weight: 600;" : "font-weight: 0;"}"></i>
                        <i class="far fa-comment-alt"></i>
                    </div>
                    <div class="counts">
                        <span>${this.getLikes()} Likes</span>
                    </div>
                    <div class="desc">
                        <span id="user-name-desc">${this.data.username}</span>
                        <span id="caption-desc">${this.data.desc}</span>
                        <span id="timestamp-desc">${this.getTimeStamp()}</span>
                    </div>
                </div>
                <div class="post-loader">
                    <img src="../images/loader.gif" alt="" style="display:block; z-index:-1";>
                </div>
            </div>
    
            `;
                callback(post);
            });
        });


    }
}