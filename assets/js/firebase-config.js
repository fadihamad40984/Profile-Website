const firebaseConfig = {
  apiKey: "AIzaSyA2ZI8mcUIE0ax3sYsihi4BnDbYv5DFSLo",
  authDomain: "cefadihamad-blog.firebaseapp.com",
  projectId: "cefadihamad-blog",
  storageBucket: "cefadihamad-blog.firebasestorage.app",
  messagingSenderId: "1083744998201",
  appId: "1:1083744998201:web:1f912ec4f9bd98d0c64ee8",
  measurementId: "G-9EM3QY0XMX"
};

firebase.initializeApp(firebaseConfig);

if (firebase.analytics) {
  firebase.analytics();
}

const db = firebase.firestore();

const auth = firebase.auth();

const postsCollection = db.collection('blogPosts');

function isUserLoggedIn() {
  return auth.currentUser !== null;
}

function getCurrentUser() {
  return auth.currentUser;
}

function signIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

function signOut() {
  return auth.signOut();
}

async function addBlogPostToFirebase(postData) {
  try {
    if (!isUserLoggedIn()) {
      throw new Error('User must be logged in to add posts');
    }

    const docRef = await postsCollection.add({
      title: postData.title,
      date: new Date().toISOString(),
      category: postData.category,
      excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
      content: postData.content,
      image: postData.image || null,
      author: getCurrentUser().email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    return {
      id: docRef.id,
      ...postData,
      date: new Date().toISOString(),
      author: getCurrentUser().email
    };
  } catch (error) {
    console.error("Error adding post: ", error);
    throw error;
  }
}

async function getBlogPostsFromFirebase() {
  try {
    const snapshot = await postsCollection.orderBy('createdAt', 'desc').get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting posts: ", error);
    throw error;
  }
}

async function getBlogPostFromFirebase(postId) {
  try {
    const doc = await postsCollection.doc(postId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error("Error getting post: ", error);
    throw error;
  }
}

async function updateBlogPostInFirebase(postId, postData) {
  try {
    if (!isUserLoggedIn()) {
      throw new Error('User must be logged in to update posts');
    }

    await postsCollection.doc(postId).update({
      title: postData.title,
      category: postData.category,
      excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
      content: postData.content,
      image: postData.image || null,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    return {
      id: postId,
      ...postData,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error updating post: ", error);
    throw error;
  }
}

async function deleteBlogPostFromFirebase(postId) {
  try {
    if (!isUserLoggedIn()) {
      throw new Error('User must be logged in to delete posts');
    }

    await postsCollection.doc(postId).delete();

    return true;
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
}

async function migrateLocalPostsToFirebase() {
  try {
    if (!isUserLoggedIn()) {
      throw new Error('User must be logged in to migrate posts');
    }

    const localPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];

    const migrationPromises = localPosts.map(post => {
      return postsCollection.add({
        ...post,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        author: getCurrentUser().email
      });
    });

    await Promise.all(migrationPromises);

    return true;
  } catch (error) {
    console.error("Error migrating posts: ", error);
    throw error;
  }
}
