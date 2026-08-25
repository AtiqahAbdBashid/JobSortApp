import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Divider,
    Button,
    Alert,
    TextField,
    Switch,
    FormControlLabel,
    CircularProgress,
    Avatar,
    Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';  // ← ADD THIS
import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Notifications as NotificationsIcon,
    Security as SecurityIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SettingsPage = ({ darkMode, setDarkMode }) => {
    const theme = useTheme();  // ← ADD THIS
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [settings, setSettings] = useState({
        notifications: true,
        autoSync: false,
        darkMode: darkMode,
        syncStartDate: '',
    });

    const [profile, setProfile] = useState({
        name: user.name || '',
        email: user.email || '',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        setSettings(prev => ({ ...prev, darkMode: darkMode }));
    }, [darkMode]);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/settings');
            if (response.data) {
                setSettings(response.data);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDarkModeToggle = (checked) => {
        setSettings({ ...settings, darkMode: checked });
        if (setDarkMode) {
            setDarkMode(checked);
        }
        localStorage.setItem('darkMode', JSON.stringify(checked));
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await api.put('/users/settings', settings);
            setSuccess('Settings saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            try {
                await api.delete('/users/account');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } catch (err) {
                setError('Failed to delete account');
            }
        }
    };

    // Theme-based colors
    const isDark = darkMode;
    const bgColor = isDark ? '#2C2C2E' : '#FFFFFF';
    const borderColor = isDark ? '#3A3A3C' : '#E5E5EA';
    const textColor = isDark ? '#F5F5F7' : '#1C1C1E';
    const textSecondary = isDark ? '#98989D' : '#6E6E73';
    const inputBg = isDark ? '#1C1C1E' : '#F5F5F7';

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: textColor, mb: 1 }}>
                Settings
            </Typography>
            <Typography variant="body2" sx={{ color: textSecondary, mb: 4 }}>
                Manage your account and application preferences
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Profile Section */}
            <Paper sx={{
                p: 3,
                mb: 3,
                bgcolor: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: textColor, mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#0A84FF' }} />
                    Profile
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: '#0A84FF',
                            fontSize: 28,
                            fontWeight: 600,
                        }}
                    >
                        {user.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ color: textColor }}>
                            {user.name || 'User'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: textSecondary }}>
                            {user.email || 'user@email.com'}
                        </Typography>
                        <Chip
                            label="Active"
                            size="small"
                            sx={{
                                mt: 0.5,
                                bgcolor: 'rgba(48, 209, 88, 0.15)',
                                color: '#30D158',
                                fontSize: 11,
                            }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ borderColor: borderColor, mb: 2 }} />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        size="small"
                        sx={{
                            flex: 1,
                            minWidth: 200,
                            '& .MuiOutlinedInput-root': { bgcolor: inputBg },
                        }}
                    />
                    <TextField
                        label="Email"
                        value={profile.email}
                        disabled
                        size="small"
                        sx={{
                            flex: 1,
                            minWidth: 200,
                            '& .MuiOutlinedInput-root': { bgcolor: inputBg },
                        }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<SaveIcon />}
                        sx={{
                            borderColor: '#0A84FF',
                            color: '#0A84FF',
                            textTransform: 'none',
                        }}
                    >
                        Update Profile
                    </Button>
                </Box>
            </Paper>

            {/* Preferences Section */}
            <Paper sx={{
                p: 3,
                mb: 3,
                bgcolor: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: textColor, mb: 2 }}>
                    <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#0A84FF' }} />
                    Preferences
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.notifications}
                                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#0A84FF' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#0A84FF' },
                                }}
                            />
                        }
                        label={
                            <Box>
                                <Typography variant="body2" sx={{ color: textColor }}>
                                    Email Notifications
                                </Typography>
                                <Typography variant="caption" sx={{ color: textSecondary }}>
                                    Get notified about application updates and reminders
                                </Typography>
                            </Box>
                        }
                        sx={{ alignItems: 'flex-start', gap: 2 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.autoSync}
                                onChange={(e) => setSettings({ ...settings, autoSync: e.target.checked })}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#0A84FF' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#0A84FF' },
                                }}
                            />
                        }
                        label={
                            <Box>
                                <Typography variant="body2" sx={{ color: textColor }}>
                                    Auto-Sync Gmail
                                </Typography>
                                <Typography variant="caption" sx={{ color: textSecondary }}>
                                    Automatically sync new job applications from Gmail
                                </Typography>
                            </Box>
                        }
                        sx={{ alignItems: 'flex-start', gap: 2 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.darkMode}
                                onChange={(e) => handleDarkModeToggle(e.target.checked)}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#0A84FF' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#0A84FF' },
                                }}
                            />
                        }
                        label={
                            <Box>
                                <Typography variant="body2" sx={{ color: textColor }}>
                                    Dark Mode
                                </Typography>
                                <Typography variant="caption" sx={{ color: textSecondary }}>
                                    Switch between dark and light theme
                                </Typography>
                            </Box>
                        }
                        sx={{ alignItems: 'flex-start', gap: 2 }}
                    />
                </Box>

                <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSaveSettings}
                    disabled={saving}
                    sx={{
                        mt: 2,
                        bgcolor: '#0A84FF',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#007AFF' },
                    }}
                >
                    {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
            </Paper>

            {/* Account Section */}
            <Paper sx={{
                p: 3,
                mb: 3,
                bgcolor: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: textColor, mb: 2 }}>
                    <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#FF453A' }} />
                    Account
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="outlined"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{
                            borderColor: '#FF453A',
                            color: '#FF453A',
                            textTransform: 'none',
                            '&:hover': { borderColor: '#FF453A', bgcolor: 'rgba(255, 69, 58, 0.08)' },
                        }}
                    >
                        Sign Out
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteAccount}
                        sx={{
                            borderColor: '#FF453A',
                            color: '#FF453A',
                            textTransform: 'none',
                            '&:hover': { borderColor: '#FF453A', bgcolor: 'rgba(255, 69, 58, 0.15)' },
                        }}
                    >
                        Delete Account
                    </Button>
                </Box>

                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: textSecondary }}>
                    ⚠️ Deleting your account will permanently remove all your applications and data.
                </Typography>
            </Paper>

            {/* About Section */}
            <Paper sx={{
                p: 3,
                bgcolor: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: textColor, mb: 2 }}>
                    About JobSort
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ color: textSecondary }}>
                        <strong style={{ color: textColor }}>Version:</strong> 1.0.0
                    </Typography>
                    <Typography variant="body2" sx={{ color: textSecondary }}>
                        <strong style={{ color: textColor }}>Status:</strong>
                        <Chip
                            label="✓ Active"
                            size="small"
                            sx={{
                                ml: 1,
                                bgcolor: 'rgba(48, 209, 88, 0.15)',
                                color: '#30D158',
                                fontSize: 11,
                            }}
                        />
                    </Typography>
                    <Typography variant="body2" sx={{ color: textSecondary, mt: 1 }}>
                        <strong style={{ color: textColor }}>Features:</strong>
                        <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                            • AI-powered Gmail sync
                            <br />
                            • Application tracking with status history
                            <br />
                            • Smart analytics and insights
                            <br />
                            • Dark mode support
                        </Box>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default SettingsPage;