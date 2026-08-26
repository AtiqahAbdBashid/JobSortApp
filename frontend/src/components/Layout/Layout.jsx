import React, { useState } from 'react';
import {
    Box, AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem,
    Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Brightness4, Brightness7, AccountCircle, Dashboard, Work, Settings, Logout
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, darkMode, toggleDarkMode }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navigation = [
        { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
        { label: 'Applications', path: '/applications', icon: <Work /> },
        { label: 'Settings', path: '/settings', icon: <Settings /> },
    ];

    const isActive = (path) => window.location.pathname === path;

    // Mobile Drawer
    const drawer = (
        <Box sx={{ width: 250, bgcolor: darkMode ? '#1C1C1E' : '#FFFFFF', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${darkMode ? '#3A3A3C' : '#E5E5EA'}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="img" src="/logo.png" alt="JobSort" sx={{ width: 32, height: 32, borderRadius: '8px' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: darkMode ? '#F5F5F7' : '#1C1C1E' }}>
                        JobSort
                    </Typography>
                </Box>
            </Box>
            <List>
                {navigation.map((item) => (
                    <ListItem
                        key={item.path}
                        onClick={() => { navigate(item.path); setMobileOpen(false); }}
                        sx={{
                            mx: 1,
                            borderRadius: '8px',
                            bgcolor: isActive(item.path) ? (darkMode ? 'rgba(10, 132, 255, 0.15)' : 'rgba(10, 132, 255, 0.08)') : 'transparent',
                            '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }
                        }}
                    >
                        <ListItemIcon sx={{ color: isActive(item.path) ? '#0A84FF' : (darkMode ? '#98989D' : '#666') }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} sx={{ color: isActive(item.path) ? '#0A84FF' : (darkMode ? '#F5F5F7' : '#1C1C1E') }} />
                    </ListItem>
                ))}
                <ListItem onClick={handleLogout} sx={{ mx: 1, borderRadius: '8px', '&:hover': { bgcolor: 'rgba(255, 69, 58, 0.08)' } }}>
                    <ListItemIcon sx={{ color: '#FF453A' }}><Logout /></ListItemIcon>
                    <ListItemText primary="Sign Out" sx={{ color: '#FF453A' }} />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: darkMode ? '#1C1C1E' : '#F5F5F7' }}>
            {/* Mac-style Title Bar */}
            <AppBar position="static" elevation={0} sx={{
                bgcolor: darkMode ? '#2d2d2d' : '#e8e8e8',
                borderBottom: `1px solid ${darkMode ? '#3d3d3d' : '#d0d0d0'}`,
                height: '38px', minHeight: '38px',
                '& .MuiToolbar-root': { minHeight: '38px', height: '38px', padding: '0 12px' }
            }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton size="small" onClick={handleDrawerToggle} sx={{ color: darkMode ? '#e0e0e0' : '#333' }}>
                            <MenuIcon fontSize="small" />
                        </IconButton>
                    )}
                    <Box sx={{ display: 'flex', gap: '6px', mr: 2 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27c93f' }} />
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: darkMode ? '#e0e0e0' : '#333', fontSize: '13px', flex: 1, textAlign: 'center' }}>
                        JobSort
                    </Typography>
                    <IconButton size="small" onClick={toggleDarkMode} sx={{ color: darkMode ? '#e0e0e0' : '#666' }}>
                        {darkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
                    </IconButton>
                    <IconButton size="small" onClick={handleMenu} sx={{ color: darkMode ? '#e0e0e0' : '#666' }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: darkMode ? '#4a4a4a' : '#1976d2' }}>
                            {user.name?.[0] || 'U'}
                        </Avatar>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} PaperProps={{ sx: { bgcolor: darkMode ? '#2d2d2d' : '#ffffff' } }}>
                        <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}><Dashboard sx={{ mr: 1, fontSize: 20 }} /> Dashboard</MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate('/applications'); }}><Work sx={{ mr: 1, fontSize: 20 }} /> Applications</MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}><Settings sx={{ mr: 1, fontSize: 20 }} /> Settings</MenuItem>
                        <MenuItem onClick={handleLogout} sx={{ color: '#ff5f56' }}><Logout sx={{ mr: 1, fontSize: 20 }} /> Sign Out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
                {drawer}
            </Drawer>

            {/* Main Content */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Desktop Sidebar */}
                {!isMobile && (
                    <Box
                        sx={{
                            width: 220,
                            minWidth: 220,
                            bgcolor: darkMode ? '#242426' : '#EBEBED',
                            borderRight: `1px solid ${darkMode ? '#3A3A3C' : '#D1D1D6'}`,
                            px: 1.5,
                            py: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                    >
                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1, py: 1.5, mb: 1.5 }}>
                            <Box component="img" src="/logo.png" alt="JobSort" sx={{ width: 34, height: 34, borderRadius: '9px', objectFit: 'contain' }} />
                            <Box>
                                <Typography sx={{ fontSize: 14, fontWeight: 650, color: darkMode ? '#F5F5F7' : '#1C1C1E' }}>
                                    JobSort
                                </Typography>
                                <Typography sx={{ fontSize: 11, color: darkMode ? '#98989D' : '#6E6E73' }}>
                                    Career dashboard
                                </Typography>
                            </Box>
                        </Box>

                        {/* Navigation - NO SETTINGS HERE */}
                        <Typography sx={{ px: 1, mb: 0.75, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: darkMode ? '#98989D' : '#6E6E73' }}>
                            Workspace
                        </Typography>

                        {navigation
                            .filter(item => item.label !== 'Settings') // ← Hide Settings from main nav
                            .map((item) => (
                                <Box
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.25,
                                        px: 1.25,
                                        py: 1,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: isActive(item.path) ? '#0A84FF' : darkMode ? '#98989D' : '#6E6E73',
                                        bgcolor: isActive(item.path) ? (darkMode ? 'rgba(10, 132, 255, 0.14)' : 'rgba(10, 132, 255, 0.10)') : 'transparent',
                                        '&:hover': {
                                            bgcolor: isActive(item.path)
                                                ? undefined
                                                : darkMode
                                                    ? 'rgba(255,255,255,0.06)'
                                                    : 'rgba(0,0,0,0.05)',
                                            color: isActive(item.path) ? '#0A84FF' : darkMode ? '#F5F5F7' : '#1C1C1E',
                                        },
                                    }}
                                >
                                    {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                                    <Typography sx={{ fontSize: 13, fontWeight: isActive(item.path) ? 600 : 500 }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}

                        {/* ✅ Settings — ONLY HERE, AT THE BOTTOM */}
                        <Box sx={{ mt: 'auto' }}>
                            <Box
                                onClick={() => navigate('/settings')}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.25,
                                    px: 1.25,
                                    py: 1,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: isActive('/settings') ? '#0A84FF' : darkMode ? '#98989D' : '#6E6E73',
                                    '&:hover': {
                                        color: darkMode ? '#F5F5F7' : '#1C1C1E',
                                        bgcolor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                                    },
                                }}
                            >
                                <Settings sx={{ fontSize: 20 }} />
                                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Settings</Typography>
                            </Box>
                        </Box>
                    </Box>
                )}

                <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'auto', backgroundColor: darkMode ? '#1C1C1E' : '#F5F5F7', p: { xs: 2, md: 3 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;