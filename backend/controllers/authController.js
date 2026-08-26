const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');

// ============================================================
// REGULAR REGISTER (existing)
// ============================================================
exports.register = async (req, res) => {
    try {
        const { email, name } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = new User({
            email,
            name,
            googleId: `temp_${Date.now()}`
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// GET USER (existing)
// ============================================================
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-accessToken -refreshToken');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// GOOGLE OAUTH 
// ============================================================
exports.googleAuth = async (req, res) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        const scopes = [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            prompt: 'consent'
        });

        res.redirect(url);
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

exports.googleCallback = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ error: 'No authorization code provided' });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        const userInfo = await oauth2.userinfo.get();

        let user = await User.findOne({ googleId: userInfo.data.id });

        if (!user) {
            user = new User({
                googleId: userInfo.data.id,
                email: userInfo.data.email,
                name: userInfo.data.name,
                picture: userInfo.data.picture,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                tokenExpiry: tokens.expiry_date
            });
            await user.save();
            console.log('New user created:', user.email);
        } else {
            user.accessToken = tokens.access_token;
            user.refreshToken = tokens.refresh_token;
            user.tokenExpiry = tokens.expiry_date;
            await user.save();
            console.log('User updated:', user.email);
        }

        // GENERATE JWT
        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // REDIRECT TO FRONTEND WITH TOKEN
        res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${jwtToken}`);

    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
    }
};