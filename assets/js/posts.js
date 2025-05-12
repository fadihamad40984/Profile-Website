document.addEventListener('DOMContentLoaded', function() {
    displayPosts();

    setupEventListeners();
});

function setupEventListeners() {
    const searchInput = document.getElementById('postSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            displayPosts();
        });
    }

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            displayPosts();
        });
    }

    const sortSelect = document.getElementById('sortPosts');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            displayPosts();
        });
    }
}

function displayPosts() {
    const postsList = document.getElementById('postsList');
    const noPostsMessage = document.getElementById('noPostsMessage');
    const searchInput = document.getElementById('postSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortPosts');

    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

    if (searchInput && searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.toLowerCase().trim();
        posts = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm)
        );
    }

    if (categoryFilter && categoryFilter.value !== '') {
        posts = posts.filter(post => post.category === categoryFilter.value);
    }

    if (sortSelect) {
        switch(sortSelect.value) {
            case 'newest':
                posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                posts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'a-z':
                posts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'z-a':
                posts.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
    }

    postsList.innerHTML = '';

    if (posts.length === 0) {
        if (noPostsMessage) {
            postsList.appendChild(noPostsMessage);
            noPostsMessage.style.display = 'block';
        } else {
            postsList.innerHTML = `
                <div class="no-posts-message">
                    <i class="uil uil-file-question-alt"></i>
                    <p>No posts found. Create your first post!</p>
                    <a href="dashboard.html" class="btn primary-btn">Create Post</a>
                </div>
            `;
        }
        return;
    }

    if (noPostsMessage) {
        noPostsMessage.style.display = 'none';
    }

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';

        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        postCard.innerHTML = `
            <div class="post-card-image ${!post.image ? 'placeholder' : ''}">
                ${post.image ? `<img src="${post.image}" alt="${post.title}" onerror="this.parentNode.classList.add('placeholder'); this.style.display='none';">` : ''}
            </div>
            <div class="post-card-content">
                <h3 class="post-card-title">${post.title}</h3>
                <div class="post-card-meta">
                    <span class="post-card-date">${formattedDate}</span>
                    <span class="post-card-category">${post.category}</span>
                </div>
                <p class="post-card-excerpt">${post.excerpt}</p>
                <div class="post-card-actions">
                    <button class="edit-btn" data-id="${post.id}">
                        <i class="uil uil-edit"></i> Edit
                    </button>
                    <button class="delete-btn" data-id="${post.id}">
                        <i class="uil uil-trash-alt"></i> Delete
                    </button>
                </div>
            </div>
        `;

        postsList.appendChild(postCard);

        postCard.querySelector('.edit-btn').addEventListener('click', function() {
            editPost(post.id);
        });

        postCard.querySelector('.delete-btn').addEventListener('click', function() {
            deletePost(post.id);
        });
    });
}

function editPost(postId) {
    window.location.href = `dashboard.html?edit=${postId}`;
}

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

        posts = posts.filter(post => post.id !== postId);

        localStorage.setItem('blogPosts', JSON.stringify(posts));

        displayPosts();
    }
}
