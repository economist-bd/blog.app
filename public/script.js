import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createPostForm');
    const postsContainer = document.getElementById('postsContainer');

    // Auth UI elements
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const postFormSection = document.getElementById('postFormSection');
    const loginPrompt = document.getElementById('loginPrompt');
    const loginLink = document.getElementById('loginLink');

    let currentUser = null;

    // Fetch and display posts
    fetchPosts();

    // Auth Event Listeners
    loginBtn.addEventListener('click', handleLogin);
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogin();
    });
    logoutBtn.addEventListener('click', handleLogout);

    // Monitor Auth State
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        updateUI(user);
    });

    async function handleLogin() {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed: " + error.message);
        }
    }

    async function handleLogout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed", error);
        }
    }

    function updateUI(user) {
        if (user) {
            // Logged in
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            userName.textContent = user.displayName;
            postFormSection.style.display = 'block';
            loginPrompt.style.display = 'none';
        } else {
            // Logged out
            loginBtn.style.display = 'block';
            userInfo.style.display = 'none';
            postFormSection.style.display = 'none';
            loginPrompt.style.display = 'block';
        }
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("You must be logged in to post.");
            return;
        }

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content,
                    author_name: currentUser.displayName,
                    author_uid: currentUser.uid
                })
            });

            if (response.ok) {
                // Clear form
                form.reset();
                // Refresh posts
                fetchPosts();
            } else {
                alert('Failed to create post. Please try again.');
                console.error('Error creating post:', await response.text());
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error occurred.');
        }
    });

    async function fetchPosts() {
        try {
            const response = await fetch('/api/posts');
            const result = await response.json();

            if (result.message === 'success') {
                renderPosts(result.data);
            } else {
                console.error('Failed to fetch posts:', result.error);
            }
        } catch (error) {
            console.error('Network error fetching posts:', error);
        }
    }

    function renderPosts(posts) {
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p style="text-align:center; color: #666;">No opinions yet. Be the first to share!</p>';
            return;
        }

        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'post-card';

            const date = new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const authorHtml = post.author_name ? `<div style="font-size: 0.9em; color: #555; margin-bottom: 5px;"><strong>${escapeHtml(post.author_name)}</strong> says:</div>` : '';

            card.innerHTML = `
        <h3>${escapeHtml(post.title)}</h3>
        ${authorHtml}
        <div class="post-date">${date}</div>
        <div class="post-content">${escapeHtml(post.content)}</div>
      `;

            postsContainer.appendChild(card);
        });
    }

    // Basic XSS prevention
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
