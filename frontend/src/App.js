import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate
} from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import getTheme from './styles/theme';
import Layout from './components/Layout/Layout';
import Analytics from './components/Dashboard/Analytics';
import ApplicationGrid from './components/Applications/ApplicationGrid';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// ============================================================
// AUTH CALLBACK COMPONENT
// ============================================================
const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);

            fetch('https://jobsort-backend.onrender.com/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch user');
                    return res.json();
                })
                .then(user => {
                    localStorage.setItem('user', JSON.stringify(user));
                    // ✅ INSTANT REDIRECT - NO AUTO-SYNC!
                    navigate('/dashboard');
                })
                .catch((err) => {
                    console.error('❌ Error:', err);
                    // Still redirect to dashboard even if user fetch fails
                    navigate('/dashboard');
                });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: '#1C1C1E',
            p: 3,
        }}>
            <Box sx={{ textAlign: 'center' }}>
                <Box
                    component="img"
                    src="/logo.png"
                    alt="JobSort"
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '12px',
                        mb: 2,
                        objectFit: 'contain',
                    }}
                />
                <CircularProgress size={30} sx={{ color: '#0A84FF', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#98989D' }}>
                    Logging in...
                </Typography>
            </Box>
        </Box>
    );
};

// ============================================================
// AUTH GUARD - Redirects to login if not authenticated
// ============================================================
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// ============================================================
// PUBLIC ROUTE - Redirects to dashboard if already logged in
// ============================================================
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// ============================================================
// MAIN APP
// ============================================================
function App() {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const theme = React.useMemo(() => getTheme(darkMode), [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((current) => !current);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Landing Page - Public, redirects if logged in */}
                    <Route path="/" element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    } />

                    {/* Login - Public, redirects if logged in */}
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />

                    {/* Privacy Policy */}
                    <Route path="/privacy" element={<PrivacyPolicy />} />

                    {/* Terms of Service */}
                    <Route path="/terms" element={<TermsOfService />} />

                    {/* Auth Callback */}
                    <Route path="/auth-callback" element={<AuthCallback />} />

                    {/* Dashboard - Protected */}
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                                <Analytics darkMode={darkMode} />
                            </Layout>
                        </PrivateRoute>
                    } />

                    {/* Applications - Protected */}
                    <Route path="/applications" element={
                        <PrivateRoute>
                            <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                                <ApplicationGrid darkMode={darkMode} />
                            </Layout>
                        </PrivateRoute>
                    } />

                    {/* Settings - Protected - WITH DARK MODE PROPS */}
                    <Route path="/settings" element={
                        <PrivateRoute>
                            <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                                <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />
                            </Layout>
                        </PrivateRoute>
                    } />

                    {/* Catch all - redirect to landing */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;