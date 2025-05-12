let blogPosts = [];

const samplePosts = [
    {
        id: 1,
        title: "Getting Started with React Hooks",
        date: "2023-01-15T12:00:00",
        category: "React",
        excerpt: "React Hooks have revolutionized how we write React components. Learn how to use useState, useEffect, and more in this comprehensive guide.",
        content: "React Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class component. They allow you to 'hook into' React state and lifecycle features from function components.\n\nThe most commonly used hooks are:\n\n- useState: For managing state in functional components\n- useEffect: For handling side effects like data fetching\n- useContext: For consuming context in a more elegant way\n- useReducer: For managing more complex state logic\n- useRef: For persisting values across renders without causing re-renders\n\nHooks make your code more reusable and easier to test. They also help in organizing your logic better than the lifecycle methods in class components.",
        image: "./assets/images/blog-placeholder.jpg"
    },
    {
        id: 2,
        title: "Building RESTful APIs with Node.js and Express",
        date: "2023-02-03T14:30:00",
        category: "Node.js",
        excerpt: "Learn how to create robust and scalable RESTful APIs using Node.js and Express framework with best practices for authentication and error handling.",
        content: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It's the most popular framework for building APIs with Node.js.\n\nHere's a basic structure for creating a RESTful API with Express:\n\n```javascript\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/api/items', (req, res) => {\n  // Get all items\n});\n\napp.get('/api/items/:id', (req, res) => {\n  // Get item by ID\n});\n\napp.post('/api/items', (req, res) => {\n  // Create new item\n});\n\napp.put('/api/items/:id', (req, res) => {\n  // Update item\n});\n\napp.delete('/api/items/:id', (req, res) => {\n  // Delete item\n});\n\napp.listen(3000, () => console.log('Server running on port 3000'));\n```\n\nFor authentication, you can use packages like Passport.js or JWT (JSON Web Tokens). For error handling, middleware functions are your best friend in Express.",
        image: "./assets/images/blog-placeholder.jpg"
    },
    {
        id: 3,
        title: "CSS Grid vs Flexbox: When to Use Each",
        date: "2023-03-20T09:15:00",
        category: "CSS",
        excerpt: "Understand the key differences between CSS Grid and Flexbox, and learn when to use each layout system for optimal web design.",
        content: "CSS Grid and Flexbox are two powerful layout systems in CSS, each with their own strengths and ideal use cases.\n\n**Flexbox** is designed for one-dimensional layouts - either a row or a column. It's perfect for:\n- Navigation menus\n- Card layouts with equal height but different content\n- Centering elements vertically and horizontally\n- Distributing space between items in a container\n\n**CSS Grid** is designed for two-dimensional layouts - rows and columns together. It's ideal for:\n- Overall page layouts\n- Complex grid-based designs\n- Placing elements in exact positions\n- Creating layouts where items span multiple rows and columns\n\nIn practice, you'll often use both: Grid for the overall layout, and Flexbox for the components within that layout. They work beautifully together!",
        image: "./assets/images/blog-placeholder.jpg"
    }
];

function initializeBlogPosts() {
    const storedPosts = localStorage.getItem('blogPosts');

    if (storedPosts) {
        blogPosts = JSON.parse(storedPosts);
    } else {
        blogPosts = samplePosts;
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    }

    return blogPosts;
}

function renderBlogPosts() {
    const blogContainer = document.getElementById('blogPosts');
    if (!blogContainer) return;

    initializeBlogPosts();

    blogContainer.innerHTML = '';

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
            const postId = parseInt(this.getAttribute('data-id'));
            openBlogPost(postId);
        });
    });
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

function addBlogPost(postData) {
    initializeBlogPosts();

    const newId = blogPosts.length > 0
        ? Math.max(...blogPosts.map(post => post.id)) + 1
        : 1;

    const newPost = {
        id: newId,
        title: postData.title,
        date: new Date().toISOString(),
        category: postData.category,
        excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
        content: postData.content,
        image: postData.image || './assets/images/blog-placeholder.jpg'
    };

    blogPosts.push(newPost);

    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

    return newPost;
}

function updateBlogPost(postId, postData) {
    initializeBlogPosts();

    const postIndex = blogPosts.findIndex(post => post.id === postId);

    if (postIndex === -1) return null;

    blogPosts[postIndex] = {
        ...blogPosts[postIndex],
        title: postData.title,
        category: postData.category,
        excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
        content: postData.content,
        image: postData.image || blogPosts[postIndex].image
    };

    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

    return blogPosts[postIndex];
}

function deleteBlogPost(postId) {
    initializeBlogPosts();

    blogPosts = blogPosts.filter(post => post.id !== postId);

    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

    return true;
}

function getBlogPost(postId) {
    initializeBlogPosts();

    return blogPosts.find(post => post.id === postId) || null;
}

document.addEventListener('DOMContentLoaded', function() {
    initializeBlogPosts();

    if (document.getElementById('blogPosts')) {
        renderBlogPosts();
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