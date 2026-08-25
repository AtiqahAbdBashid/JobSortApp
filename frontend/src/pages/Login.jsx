import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Typography, TextField, Button, Alert, Avatar, Divider, IconButton
} from '@mui/material';
import { Work as WorkIcon, Google as GoogleIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/register', { email, name });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5001/api/auth/google';
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: '#1C1C1E'
        }}>
            <Paper elevation={0} sx={{
                p: 4,
                width: '100%',
                maxWidth: 400,
                bgcolor: '#2C2C2E',
                borderRadius: '14px',
                border: '1px solid #3A3A3C'
            }}>

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <IconButton
                        onClick={() => {
                            window.location.href = '/';
                        }}
                        size="small"
                        sx={{
                            color: '#98989D',
                            '&:hover': { color: '#F5F5F7' }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar sx={{
                        width: 56,
                        height: 56,
                        bgcolor: '#0A84FF',
                        margin: '0 auto',
                        mb: 2
                    }}>
                        <WorkIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ color: '#F5F5F7', fontWeight: 700 }}>
                        JobSort
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#98989D', mt: 1 }}>
                        Track your job applications like a pro
                    </Typography>
                </Box>

                {/* Google Login Button */}
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    sx={{
                        py: 1.5,
                        mb: 2,
                        borderColor: '#3A3A3C',
                        color: '#F5F5F7',
                        '&:hover': {
                            borderColor: '#0A84FF',
                            backgroundColor: 'rgba(10, 132, 255, 0.08)'
                        }
                    }}
                >
                    Continue with Google
                </Button>

                <Divider sx={{ my: 2, color: '#666' }}>
                    <Typography variant="caption" color="text.secondary">
                        OR
                    </Typography>
                </Divider>

                {/* Regular Register Form */}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#1C1C1E'
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#1C1C1E'
                            }
                        }}
                    />

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            bgcolor: '#0A84FF',
                            '&:hover': { bgcolor: '#007AFF' }
                        }}
                    >
                        {loading ? 'Loading...' : 'Get Started'}
                    </Button>
                </form>

                <Typography variant="caption" sx={{
                    display: 'block',
                    textAlign: 'center',
                    mt: 2,
                    color: '#666'
                }}>
                    Secure & Free • No credit card required
                </Typography>
            </Paper>
        </Box>
    );
};

export default Login;