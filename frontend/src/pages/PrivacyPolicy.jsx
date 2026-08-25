import React from 'react';
import { Box, Container, Typography, Paper, useTheme } from '@mui/material';

const PrivacyPolicy = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        bgcolor: isDark ? '#2d2d2d' : '#ffffff',
                        borderRadius: '12px',
                        border: `1px solid ${isDark ? '#3d3d3d' : '#e0e0e0'}`,
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                        Privacy Policy for JobSort
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Section title="1. Information We Collect">
                            <Typography variant="body2" color="text.secondary">
                                JobSort collects the following information when you use our service:
                            </Typography>
                            <ul style={{ color: 'text.secondary', marginTop: 8 }}>
                                <li><strong>Email address</strong> – For account creation and identification</li>
                                <li><strong>Gmail access</strong> – To read job application emails (only with your explicit permission)</li>
                                <li><strong>Job application data</strong> – Company names, positions, statuses, and dates</li>
                            </ul>
                        </Section>

                        <Section title="2. How We Use Your Information">
                            <ul style={{ color: 'text.secondary', marginTop: 8 }}>
                                <li>To sync your job applications from Gmail</li>
                                <li>To organize and track your job search</li>
                                <li>To provide analytics and insights on your applications</li>
                                <li>To improve our service and user experience</li>
                            </ul>
                        </Section>

                        <Section title="3. Data Storage and Security">
                            <Typography variant="body2" color="text.secondary">
                                Your data is stored securely in MongoDB Atlas with encryption. We implement industry-standard security measures to protect your information. Your Gmail tokens are stored encrypted and used only for syncing job applications.
                            </Typography>
                        </Section>

                        <Section title="4. Data Sharing">
                            <Typography variant="body2" color="text.secondary">
                                We do not share your personal data with third parties. Your information is used solely to provide JobSort's services to you.
                            </Typography>
                        </Section>

                        <Section title="5. Your Rights">
                            <Typography variant="body2" color="text.secondary">
                                You have the right to:
                            </Typography>
                            <ul style={{ color: 'text.secondary', marginTop: 8 }}>
                                <li>Access your personal data at any time</li>
                                <li>Delete your account and all associated data</li>
                                <li>Withdraw your Gmail access consent</li>
                            </ul>
                        </Section>

                        <Section title="6. Contact">
                            <Typography variant="body2" color="text.secondary">
                                If you have any questions about this privacy policy, please contact us at:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                <strong>Email:</strong> atiqahabdbashid@gmail.com
                            </Typography>
                        </Section>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

// Helper component for sections
const Section = ({ title, children }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {title}
            </Typography>
            <Box sx={{ color: 'text.secondary' }}>{children}</Box>
        </Box>
    );
};

export default PrivacyPolicy;