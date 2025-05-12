document.addEventListener('DOMContentLoaded', function() {
    initializeBlogPosts();

    setupSearchAndFilter();

    setupLoadMoreButton();
});

function setupSearchAndFilter() {
    const searchInput = document.getElementById('blogSearch');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderBlogPosts(true);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            renderBlogPosts(true);
        });
    }
}

function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const currentlyShown = document.querySelectorAll('.blog-post').length;
            renderBlogPosts(false, currentlyShown + 3);
        });
    }
}

function renderBlogPosts(reset = true, limit = 6) {
    const blogContainer = document.getElementById('blogPosts');
    if (!blogContainer) return;

    const searchTerm = document.getElementById('blogSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';

    let filteredPosts = blogPosts.filter(post => {
        const matchesSearch = searchTerm === '' ||
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm);

        const matchesCategory = categoryFilter === '' || post.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (reset) {
        blogContainer.innerHTML = '';
    }

    const currentPostCount = blogContainer.querySelectorAll('.blog-post').length;

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (filteredPosts.length > currentPostCount + limit) {
            loadMoreBtn.style.display = 'flex';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    const postsToShow = filteredPosts.slice(currentPostCount, currentPostCount + limit);

    if (filteredPosts.length === 0 && reset) {
        blogContainer.innerHTML = `
            <div class="no-posts-message">
                <i class="uil uil-file-question-alt"></i>
                <p>No posts found matching your criteria.</p>
                <button onclick="resetFilters()" class="btn primary-btn">Reset Filters</button>
            </div>
        `;
        return;
    }

    postsToShow.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-post';

        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        postElement.innerHTML = `
            <div class="post-image ${!post.image ? 'placeholder' : ''}">
                ${post.image ? `<img src="${post.image}" alt="${post.title}" onerror="this.parentNode.classList.add('placeholder'); this.style.display='none';">` : ''}
            </div>
            <div class="post-header">
                <h2>${post.title}</h2>
                <div class="post-meta">
                    <span class="post-date">${formattedDate}</span>
                    <span class="post-category">${post.category}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.excerpt}</p>
            </div>
            <div class="post-footer">
                <a href="#" class="read-more" data-id="${post.id}">Read More</a>
            </div>
        `;

        blogContainer.appendChild(postElement);
    });

    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = parseInt(this.getAttribute('data-id'));
            openBlogPost(postId);
        });
    });
}

function resetFilters() {
    const searchInput = document.getElementById('blogSearch');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';

    renderBlogPosts(true);
}
