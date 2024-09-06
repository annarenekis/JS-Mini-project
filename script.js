function fetchUsers() {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => displayUsers(users))
        .catch(error => console.error('Error fetching users:', error));
}

function displayUsers(users) {
    const usersContainer = document.getElementById('usersContainer');
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `<p>ID: ${user.id}</p><p>Name: ${user.name}</p>`;

        const userLink = document.createElement('a');
        userLink.href = `user-details.html?id=${user.id}`;
        userLink.textContent = 'View Details';

        userDiv.appendChild(userLink);
        usersContainer.appendChild(userDiv);
    });
}

function fetchUserDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        console.error('No user ID found in URL.');
        return;
    }

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(response => response.json())
        .then(user => displayUserDetails(user))
        .catch(error => console.error('Error fetching user details:', error));
}

function displayUserDetails(user) {
    const userDetailsDiv = document.getElementById('userDetails');
    userDetailsDiv.innerHTML = `
        <h2>${user.name} (${user.username})</h2>
        <p>Email: ${user.email}</p>
        <p>Phone: ${user.phone}</p>
        <p>Website: ${user.website}</p>
        <p>Company: ${user.company.name}</p>
        <p>Address: ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
    `;

    const showPostsButton = document.getElementById('showPosts');
    showPostsButton.addEventListener('click', () => fetchUserPosts(user.id));
}

function fetchUserPosts(userId) {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
        .then(response => response.json())
        .then(posts => displayUserPosts(posts))
        .catch(error => console.error('Error fetching user posts:', error));
}

function displayUserPosts(posts) {
    const userPostsDiv = document.getElementById('userPosts');
    userPostsDiv.innerHTML = ''; // Очищуємо попередні пости

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.innerHTML = `<h3>${post.title}</h3>`;

        const postLink = document.createElement('a');
        postLink.href = `post-details.html?postId=${post.id}`;
        postLink.textContent = 'View Post';

        postDiv.appendChild(postLink);
        userPostsDiv.appendChild(postDiv);
    });
}

function fetchPostDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    if (!postId) {
        console.error('No post ID found in URL.');
        return;
    }

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            displayPostDetails(post);
            return fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        })
        .then(response => response.json())
        .then(comments => displayPostComments(comments))
        .catch(error => console.error('Error fetching post details or comments:', error));
}

function displayPostDetails(post) {
    const postDetailsDiv = document.getElementById('postDetails');
    postDetailsDiv.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
    `;
}

function displayPostComments(comments) {
    const postCommentsDiv = document.getElementById('postComments');

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.innerHTML = `
            <h4>${comment.name}</h4>
            <p>${comment.body}</p>
            <p><strong>Email:</strong> ${comment.email}</p>
        `;
        postCommentsDiv.appendChild(commentDiv);
    });
}

if (document.getElementById('usersContainer')) {
    fetchUsers();
} else if (document.getElementById('userDetails')) {
    fetchUserDetails();
} else if (document.getElementById('postDetails')) {
    fetchPostDetails();
}
