document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createPostForm');
    const postsContainer = document.getElementById('postsContainer');

    // Fetch and display posts
    fetchPosts();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
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

            card.innerHTML = `
        <h3>${escapeHtml(post.title)}</h3>
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
