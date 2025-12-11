const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Firebase Imports (CommonJS স্টাইলে)
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, push, set } = require("firebase/database");

const app = express();
const PORT = process.env.PORT || 3000;
// এই অংশটি যোগ করুন
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

// আপনার দেওয়া Firebase কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyDWk-dK56ZDmIre3ny8v0n7109AiqfjWW0",
    authDomain: "poetic-visions-4ac1d.firebaseapp.com",
    databaseURL: "https://poetic-visions-4ac1d-default-rtdb.firebaseio.com",
    projectId: "poetic-visions-4ac1d",
    storageBucket: "poetic-visions-4ac1d.firebasestorage.app",
    messagingSenderId: "970780215745",
    appId: "1:970780215745:web:ff8067c048cbdec320c740",
    measurementId: "G-YT92YRRYMR"
};

// Firebase Initialize করা
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ১. সব পোস্ট নিয়ে আসা (Get all posts)
app.get('/api/posts', async (req, res) => {
    try {
        const postsRef = ref(db, 'posts');
        const snapshot = await get(postsRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            // Firebase অবজেক্ট রিটার্ন করে, তাই একে অ্যারে-তে কনভার্ট করা হচ্ছে
            const postsArray = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).reverse(); // নতুন পোস্ট আগে দেখানোর জন্য রিভার্স করা হলো

            res.json({ "message": "success", "data": postsArray });
        } else {
            res.json({ "message": "success", "data": [] });
        }
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// ২. নতুন পোস্ট তৈরি করা (Create a new post)
app.post('/api/posts', async (req, res) => {
    try {
        const { title, content, author_name, author_uid } = req.body;

        // posts ফোল্ডারে একটি নতুন রেফারেন্স তৈরি (অটোমেটিক ID সহ)
        const postsRef = ref(db, 'posts');
        const newPostRef = push(postsRef);

        const newPostData = {
            title,
            content,
            author_name,
            author_uid,
            created_at: new Date().toISOString()
        };

        // ডাটাবেসে সেভ করা
        await set(newPostRef, newPostData);

        res.json({
            "message": "success",
            "data": {
                id: newPostRef.key,
                ...newPostData
            }
        });
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// সার্ভার চালু করা
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
