import React from 'react';
import { Box, Container, Typography, Paper, useTheme } from '@mui/material';

const TermsOfService = () => {
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
                        Terms of Service for JobSort
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Section title="1. Acceptance of Terms">
                            <Typography variant="body2" color="text.secondary">
                                By using JobSort, you agree to these Terms of Service. If you do not agree, please do not use our service.
                            </Typography>
                        </Section>

                        <Section title="2. Description of Service">
                            <Typography variant="body2" color="text.secondary">
                                JobSort is a job application tracker that syncs with your Gmail to automatically organize and track your job applications. The service uses AI to parse email content and extract relevant information.
                            </Typography>
                        </Section>

                        <Section title="3. Gmail Integration">
                            <Typography variant="body2" color="text.secondary">
                                JobSort requires access to your Gmail to function. By using this service, you grant JobSort permission to read your emails for the sole purpose of identifying and tracking job applications. We only read emails that match job application keywords, and we do not store the full email content.
                            </Typography>
                        </Section>

                        <Section title="4. User Responsibilities">
                            <Typography variant="body2" color="text.secondary">
                                You are responsible for:
                            </Typography>
                            <ul style={{ color: 'text.secondary', marginTop: 8 }}>
                                <li>Maintaining the confidentiality of your account</li>
                                <li>Ensuring the accuracy of your application data</li>
                                <li>Complying with all applicable laws and regulations</li>
                            </ul>
                        </Section>

                        <Section title="5. Data Privacy">
                            <Typography variant="body2" color="text.secondary">
                                Your data privacy is important to us. Please refer to our Privacy Policy for detailed information on how we collect, use, and protect your data.
                            </Typography>
                        </Section>

                        <Section title="6. Termination">
                            <Typography variant="body2" color="text.secondary">
                                You may delete your account at any time. We reserve the right to terminate or suspend access to our service for any user who violates these terms.
                            </Typography>
                        </Section>

                        <Section title="7. Disclaimer of Warranties">
                            <Typography variant="body2" color="text.secondary">
                                JobSort is provided "as is" without warranties of any kind. We do not guarantee the accuracy of AI-parsed data or the availability of the service.
                            </Typography>
                        </Section>

                        <Section title="8. Limitation of Liability">
                            <Typography variant="body2" color="text.secondary">
                                In no event shall JobSort be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the service.
                            </Typography>
                        </Section>

                        <Section title="9. Contact">
                            <Typography variant="body2" color="text.secondary">
                                For questions about these terms, please contact us at:
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

export default TermsOfService;