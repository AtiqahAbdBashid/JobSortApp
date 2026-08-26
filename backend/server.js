require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const userRoutes = require('./routes/users');

const app = express();

// ============================================================
// CORS - ALLOW FRONTEND ORIGINS
// ============================================================
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'https://jobsortapp.online',
        'https://jobsortapp.vercel.app',
        'https://jobsort-backend.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const cron = require('node-cron');

// Sync every 6 hours for all users
cron.schedule('0 */6 * * *', async () => {
    console.log('Auto-syncing all users...');
    try {
        const users = await User.find({});
        for (const user of users) {
            if (user.accessToken) {
                await gmailService.syncEmails(user._id);
                console.log(`Synced for: ${user.email}`);
            }
        }
    } catch (error) {
        console.error('Auto-sync error:', error);
    }
});