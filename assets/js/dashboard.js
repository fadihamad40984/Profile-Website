let currentEditId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're editing an existing post
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');

    if (editId) {
        loadPostForEditing(parseInt(editId));
    }

    // Handle form submission
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const title = document.getElementById('postTitle').value;
            const category = document.getElementById('postCategory').value;
            const content = document.getElementById('postContent').value;
            const excerpt = document.getElementById('postExcerpt')?.value || '';
            const imageInput = document.getElementById('postImage');

            // Validate form
            if (!title || !content) {
                alert('Please fill in all required fields');
                return;
            }

            // Prepare post data
            const postData = {
                title,
                category,
                content,
                excerpt
            };

            // Handle image (in a real app, you would upload this to a server)
            if (imageInput.files.length > 0) {
                // For demo purposes, we'll use a data URL
                const file = imageInput.files[0];
                const reader = new FileReader();

                reader.onload = function(e) {
                    // Store the data URL in localStorage
                    postData.image = e.target.result;

                    // Complete the post save process
                    savePost(postData);
                };

                // Read the image file as a data URL
                reader.readAsDataURL(file);
                return; // Exit early, savePost will be called by the reader.onload callback
            }

            // If no image, continue with default image
            postData.image = null; // Will use placeholder in the UI

            // Save the post
            savePost(postData);
        });
    }

    // Function to save or update a post
    function savePost(postData) {
        if (currentEditId) {
            // Update existing post
            updateBlogPost(currentEditId, postData);
            alert('Post updated successfully!');
        } else {
            // Add new post
            addBlogPost(postData);
            alert('Post published successfully!');
        }

        // Reset form and redirect
        document.getElementById('postForm').reset();
        window.location.href = 'posts.html';
    }

    // Handle sidebar navigation
    setupSidebarNavigation();

    // Initialize dashboard
    initializeDashboard();
});

function setupSidebarNavigation() {
    // Make sidebar links work
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        // Skip links that already have href set
        if (link.getAttribute('href') !== '#') return;

        const text = link.textContent.trim();

        if (text.includes('Dashboard')) {
            link.setAttribute('href', 'dashboard.html');
        } else if (text.includes('New Post')) {
            link.setAttribute('href', 'dashboard.html');
        } else if (text.includes('All Posts')) {
            link.setAttribute('href', 'posts.html');
        }
    });

    // Toggle sidebar navigation on mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
}

function loadPostForEditing(postId) {
    // Get the post from localStorage
    const post = getBlogPost(postId);

    if (!post) {
        alert('Post not found!');
        return;
    }

    // Set current edit ID
    currentEditId = postId;

    // Update form title
    const contentHeader = document.querySelector('.content-header h1');
    if (contentHeader) {
        contentHeader.textContent = 'Edit Post';
    }

    // Update form button
    const submitButton = document.querySelector('.primary-btn[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Update Post';
    }

    // Fill form fields
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postContent').value = post.content;

    // Fill excerpt if it exists
    const excerptField = document.getElementById('postExcerpt');
    if (excerptField) {
        excerptField.value = post.excerpt;
    }
}

function initializeDashboard() {
    // Get posts count
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const postCount = posts.length;

    // Update post count if element exists
    const postCountElement = document.querySelector('.post-count');
    if (postCountElement) {
        postCountElement.textContent = postCount;
    }

    // Add excerpt field if it doesn't exist
    const contentField = document.getElementById('postContent');
    if (contentField) {
        const formGroup = contentField.closest('.form-group');
        const excerptField = document.getElementById('postExcerpt');

        if (!excerptField) {
            const excerptGroup = document.createElement('div');
            excerptGroup.className = 'form-group';
            excerptGroup.innerHTML = `
                <label for="postExcerpt">Excerpt (optional)</label>
                <textarea id="postExcerpt" rows="3" placeholder="Brief summary of your post..."></textarea>
                <small>If left empty, an excerpt will be generated from the content.</small>
            `;

            formGroup.parentNode.insertBefore(excerptGroup, formGroup.nextSibling);
        }
    }
}