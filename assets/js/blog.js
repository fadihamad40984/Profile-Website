// Array to store blog posts from Firebase
let blogPosts = [];

async function initializeBlogPosts() {
    try {
        // If we already have posts in memory, return them
        if (blogPosts.length > 0) {
            return blogPosts;
        }

        // Get posts from Firebase, ordered by creation date
        const snapshot = await postsCollection.orderBy('createdAt', 'desc').get();

        // Map the Firestore documents to our posts array
        blogPosts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return blogPosts;
    } catch (error) {
        console.error('Error initializing blog posts:', error);
        // Return empty array on error
        blogPosts = [];
        return blogPosts;
    }
}

async function renderBlogPosts() {
    const blogContainer = document.getElementById('blogPosts');
    if (!blogContainer) return;

    blogContainer.innerHTML = `
        <div class="loading-posts">
            <i class="uil uil-spinner"></i>
            <p>Loading posts...</p>
        </div>
    `;

    try {
        await initializeBlogPosts();

        blogContainer.innerHTML = '';

        if (blogPosts.length === 0) {
            blogContainer.innerHTML = `
                <div class="no-posts-message">
                    <i class="uil uil-file-question-alt"></i>
                    <p>No posts found. Check back later!</p>
                </div>
            `;
            return;
        }

        blogPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';

            const postDate = new Date(post.date);
            const formattedDate = postDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            postElement.innerHTML = `
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
                const postId = this.getAttribute('data-id');
                openBlogPost(postId);
            });
        });
    } catch (error) {
        console.error('Error rendering blog posts:', error);
        blogContainer.innerHTML = `
            <div class="error-message">
                <i class="uil uil-exclamation-triangle"></i>
                <p>There was an error loading the blog posts. Please try again later.</p>
            </div>
        `;
    }
}

async function openBlogPost(postId) {
    try {
        console.log('Opening post with ID:', postId);

        // Try to find post in memory first
        let post = blogPosts.find(p => p.id === postId);

        // If not found in memory, try to fetch from Firebase
        if (!post) {
            console.log('Post not found in memory, fetching from Firebase...');
            const doc = await postsCollection.doc(postId).get();

            if (!doc.exists) {
                console.error('Post not found in Firebase');
                alert('Sorry, this post could not be found.');
                return;
            }

            post = {
                id: doc.id,
                ...doc.data()
            };

            // Add to local cache
            blogPosts.push(post);
        }

        console.log('Post found:', post);

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'blog-post-modal';

        // Format date
        let formattedDate = 'No date';
        if (post.date) {
            try {
                const postDate = new Date(post.date);
                formattedDate = postDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (e) {
                console.warn('Invalid date format:', post.date);
            }
        }

        // Handle content safely
        const content = post.content ? post.content.replace(/\n/g, '<br>') : 'No content available';

        // Create modal HTML
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="post-full">
                    <h1 class="post-title">${post.title || 'Untitled Post'}</h1>
                    <div class="post-meta">
                        <span class="post-date">${formattedDate}</span>
                        <span class="post-category">${post.category || 'Uncategorized'}</span>
                    </div>
                    ${post.image ? `<div class="post-image"><img src="${post.image}" alt="${post.title}"></div>` : ''}
                    <div class="post-content-full">${content}</div>
                </div>
            </div>
        `;

        // Add modal to document
        document.body.appendChild(modal);

        // Prevent scrolling
        document.body.style.overflow = 'hidden';

        // Animate modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Close button event
        modal.querySelector('.modal-close').addEventListener('click', function() {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }, 300);
        });

        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    } catch (error) {
        console.error('Error opening blog post:', error);
        alert('There was an error opening this post. Please try again later.');
    }
}

async function addBlogPost(postData) {
    try {
        if (!firebase.auth().currentUser) {
            throw new Error('User must be logged in to add posts');
        }

        const newPost = {
            title: postData.title,
            date: new Date().toISOString(),
            category: postData.category,
            excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
            content: postData.content,
            image: postData.image || null,
            author: firebase.auth().currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await postsCollection.add(newPost);

        const doc = await docRef.get();
        const addedPost = {
            id: doc.id,
            ...doc.data()
        };

        blogPosts.unshift(addedPost);

        return addedPost;
    } catch (error) {
        console.error('Error adding blog post:', error);
        throw error;
    }
}

async function updateBlogPost(postId, postData) {
    try {
        if (!firebase.auth().currentUser) {
            throw new Error('User must be logged in to update posts');
        }

        const updateData = {
            title: postData.title,
            category: postData.category,
            excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
            content: postData.content,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (postData.image) {
            updateData.image = postData.image;
        }

        await postsCollection.doc(postId).update(updateData);

        const doc = await postsCollection.doc(postId).get();
        const updatedPost = {
            id: doc.id,
            ...doc.data()
        };

        const postIndex = blogPosts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
            blogPosts[postIndex] = updatedPost;
        }

        return updatedPost;
    } catch (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
}

async function deleteBlogPost(postId) {
    try {
        if (!firebase.auth().currentUser) {
            throw new Error('User must be logged in to delete posts');
        }

        await postsCollection.doc(postId).delete();

        blogPosts = blogPosts.filter(post => post.id !== postId);

        return true;
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}

async function getBlogPost(postId) {
    try {
        let post = blogPosts.find(p => p.id === postId);

        if (!post) {
            const doc = await postsCollection.doc(postId).get();

            if (!doc.exists) {
                return null;
            }

            post = {
                id: doc.id,
                ...doc.data()
            };

            blogPosts.push(post);
        }

        return post;
    } catch (error) {
        console.error('Error getting blog post:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase is not initialized. Make sure firebase-config.js is loaded.');
        return;
    }

    addUtilityStyles();

    firebase.auth().onAuthStateChanged(async function(user) {
        if (document.getElementById('blogPosts')) {
            renderBlogPosts();
        }

        if (document.querySelector('.dashboard-container') && !user) {
            window.location.href = 'login.html';
        }
    });

    function addUtilityStyles() {
        const utilityStyle = document.createElement('style');
        utilityStyle.textContent = `
            .loading-posts {
                text-align: center;
                padding: 50px 20px;
                color: var(--light-text-color);
            }

            .loading-posts i {
                font-size: 2rem;
                margin-bottom: 15px;
                display: inline-block;
                animation: spin 1s linear infinite;
            }

            .error-message {
                text-align: center;
                padding: 50px 20px;
                color: #e74c3c;
                background-color: rgba(231, 76, 60, 0.1);
                border-radius: 10px;
            }

            .error-message i {
                font-size: 2rem;
                margin-bottom: 15px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(utilityStyle);
    }

    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .blog-post-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .blog-post-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .blog-post-modal .modal-content {
            background-color: #fff;
            border-radius: 10px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            padding: 30px;
            position: relative;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }

        .blog-post-modal.active .modal-content {
            transform: translateY(0);
        }

        .blog-post-modal .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #767676;
        }

        .blog-post-modal .post-title {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .blog-post-modal .post-meta {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            color: #767676;
        }

        .blog-post-modal .post-category {
            color: #6e57e0;
            font-weight: 500;
        }

        .blog-post-modal .post-image {
            margin-bottom: 20px;
        }

        .blog-post-modal .post-image img {
            width: 100%;
            border-radius: 10px;
        }

        .blog-post-modal .post-content-full {
            line-height: 1.8;
        }
    `;
    document.head.appendChild(modalStyle);
});