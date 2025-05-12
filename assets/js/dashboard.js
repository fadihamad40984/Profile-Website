let currentEditId = null;

document.addEventListener('DOMContentLoaded', async function() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase is not initialized. Make sure firebase-config.js is loaded.');
        return;
    }

    firebase.auth().onAuthStateChanged(async function(user) {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        initializeDashboard();

        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');

        if (editId) {
            await loadPostForEditing(editId);
        }

        setupFormSubmission();

        setupSidebarNavigation();
    });

    function setupFormSubmission() {
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const submitButton = postForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="uil uil-spinner"></i> Saving...';

                try {
                    const title = document.getElementById('postTitle').value;
                    const category = document.getElementById('postCategory').value;
                    const content = document.getElementById('postContent').value;
                    const excerpt = document.getElementById('postExcerpt')?.value || '';
                    const imageInput = document.getElementById('postImage');

                    if (!title || !content) {
                        alert('Please fill in all required fields');
                        return;
                    }

                    const postData = {
                        title,
                        category,
                        content,
                        excerpt
                    };

                    if (imageInput.files.length > 0) {
                        const file = imageInput.files[0];

                        if (file.size > 2 * 1024 * 1024) {
                            alert('Image size must be less than 2MB');
                            submitButton.disabled = false;
                            submitButton.textContent = originalButtonText;
                            return;
                        }

                        const dataUrl = await readFileAsDataURL(file);
                        postData.image = dataUrl;
                    }

                    await savePost(postData);

                    postForm.reset();
                    window.location.href = 'posts.html';
                } catch (error) {
                    console.error('Error saving post:', error);
                    alert('Error saving post: ' + error.message);

                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            });
        }
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(e) {
                resolve(e.target.result);
            };

            reader.onerror = function(e) {
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }

    async function savePost(postData) {
        try {
            if (currentEditId) {
                await updateBlogPost(currentEditId, postData);
                alert('Post updated successfully!');
            } else {
                await addBlogPost(postData);
                alert('Post published successfully!');
            }
            return true;
        } catch (error) {
            console.error('Error in savePost:', error);
            throw error;
        }
    }
});

function setupSidebarNavigation() {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
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

    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
}

async function loadPostForEditing(postId) {
    try {
        const contentHeader = document.querySelector('.content-header h1');
        if (contentHeader) {
            contentHeader.innerHTML = '<i class="uil uil-spinner"></i> Loading Post...';
        }

        const post = await getBlogPost(postId);

        if (!post) {
            alert('Post not found!');
            window.location.href = 'posts.html';
            return;
        }

        currentEditId = postId;

        if (contentHeader) {
            contentHeader.textContent = 'Edit Post';
        }

        const submitButton = document.querySelector('.primary-btn[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Update Post';
        }

        document.getElementById('postTitle').value = post.title;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postContent').value = post.content;

        const excerptField = document.getElementById('postExcerpt');
        if (excerptField && post.excerpt) {
            excerptField.value = post.excerpt;
        }

        return post;
    } catch (error) {
        console.error('Error loading post for editing:', error);
        alert('Error loading post: ' + error.message);
        window.location.href = 'posts.html';
    }
}

function initializeDashboard() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const postCount = posts.length;

    const postCountElement = document.querySelector('.post-count');
    if (postCountElement) {
        postCountElement.textContent = postCount;
    }

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