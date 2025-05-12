let blogPosts = [];

const samplePosts = [
    {
        title: "Getting Started with React Hooks",
        date: "2023-01-15T12:00:00",
        category: "React",
        excerpt: "React Hooks have revolutionized how we write React components. Learn how to use useState, useEffect, and more in this comprehensive guide.",
        content: "React Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class component. They allow you to 'hook into' React state and lifecycle features from function components.\n\nThe most commonly used hooks are:\n\n- useState: For managing state in functional components\n- useEffect: For handling side effects like data fetching\n- useContext: For consuming context in a more elegant way\n- useReducer: For managing more complex state logic\n- useRef: For persisting values across renders without causing re-renders\n\nHooks make your code more reusable and easier to test. They also help in organizing your logic better than the lifecycle methods in class components.",
        image: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    },
    {
        title: "Building RESTful APIs with Node.js and Express",
        date: "2023-02-03T14:30:00",
        category: "Node.js",
        excerpt: "Learn how to create robust and scalable RESTful APIs using Node.js and Express framework with best practices for authentication and error handling.",
        content: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It's the most popular framework for building APIs with Node.js.\n\nHere's a basic structure for creating a RESTful API with Express:\n\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/api/items', (req, res) => {\n  // Get all items\n});\n\napp.get('/api/items/:id', (req, res) => {\n  // Get item by ID\n});\n\napp.post('/api/items', (req, res) => {\n  // Create new item\n});\n\napp.put('/api/items/:id', (req, res) => {\n  // Update item\n});\n\napp.delete('/api/items/:id', (req, res) => {\n  // Delete item\n});\n\napp.listen(3000, () => console.log('Server running on port 3000'));\n```\n\nFor authentication, you can use packages like Passport.js or JWT (JSON Web Tokens). For error handling, middleware functions are your best friend in Express.",
        image: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    },
    {
        title: "CSS Grid vs Flexbox: When to Use Each",
        date: "2023-03-20T09:15:00",
        category: "CSS",
        excerpt: "Understand the key differences between CSS Grid and Flexbox, and learn when to use each layout system for optimal web design.",
        content: "CSS Grid and Flexbox are two powerful layout systems in CSS, each with their own strengths and ideal use cases.\n\n**Flexbox** is designed for one-dimensional layouts - either a row or a column. It's perfect for:\n- Navigation menus\n- Card layouts with equal height but different content\n- Centering elements vertically and horizontally\n- Distributing space between items in a container\n\n**CSS Grid** is designed for two-dimensional layouts - rows and columns together. It's ideal for:\n- Overall page layouts\n- Complex grid-based designs\n- Placing elements in exact positions\n- Creating layouts where items span multiple rows and columns\n\nIn practice, you'll often use both: Grid for the overall layout, and Flexbox for the components within that layout. They work beautifully together!",
        image: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }
];

async function initializeBlogPosts() {
    try {
        if (blogPosts.length > 0) {
            return blogPosts;
        }

        const snapshot = await postsCollection.orderBy('createdAt', 'desc').get();

        if (snapshot.empty) {
            console.log('No posts found, adding sample posts...');

            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                const addPromises = samplePosts.map(post => postsCollection.add(post));
                await Promise.all(addPromises);

                const newSnapshot = await postsCollection.orderBy('createdAt', 'desc').get();
                blogPosts = newSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } else {
                blogPosts = samplePosts.map((post, index) => ({
                    id: `sample-${index + 1}`,
                    ...post
                }));
            }
        } else {
            blogPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }

        return blogPosts;
    } catch (error) {
        console.error('Error initializing blog posts:', error);

        blogPosts = samplePosts.map((post, index) => ({
            id: `sample-${index + 1}`,
            ...post
        }));

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

function openBlogPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.createElement('div');
    modal.className = 'blog-post-modal';

    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="post-full">
                <h1 class="post-title">${post.title}</h1>
                <div class="post-meta">
                    <span class="post-date">${formattedDate}</span>
                    <span class="post-category">${post.category}</span>
                </div>
                ${post.image ? `<div class="post-image"><img src="${post.image}" alt="${post.title}"></div>` : ''}
                <div class="post-content-full">${post.content.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }, 300);
        }
    });
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