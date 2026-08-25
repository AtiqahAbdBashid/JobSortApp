const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// ============================================================
// GET USER SETTINGS
// ============================================================
router.get('/settings', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return settings with defaults
        res.json({
            notifications: user.preferences?.notifications ?? true,
            autoSync: user.preferences?.autoSync ?? false,
            darkMode: user.preferences?.darkMode ?? true,
            syncStartDate: user.preferences?.syncStartDate || '',
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// UPDATE USER SETTINGS
// ============================================================
router.put('/settings', authMiddleware, async (req, res) => {
    try {
        const { notifications, autoSync, darkMode, syncStartDate } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize preferences if it doesn't exist
        if (!user.preferences) {
            user.preferences = {};
        }

        // Update preferences
        user.preferences.notifications = notifications ?? user.preferences.notifications ?? true;
        user.preferences.autoSync = autoSync ?? user.preferences.autoSync ?? false;
        user.preferences.darkMode = darkMode ?? user.preferences.darkMode ?? true;
        user.preferences.syncStartDate = syncStartDate || user.preferences.syncStartDate || '';

        await user.save();

        res.json({
            success: true,
            message: 'Settings saved successfully',
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// DELETE USER ACCOUNT
// ============================================================
router.delete('/account', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;