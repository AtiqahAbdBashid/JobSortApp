import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Chip,
    CircularProgress,
} from '@mui/material';

import {
    Add,
    WorkOutline,
    Schedule,
    CheckCircleOutline,
    CancelOutlined,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = ({ darkMode }) => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            const response = await api.get('/applications');

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.applications || [];

            setApplications(data);
        } catch (error) {
            console.error(
                'Error fetching dashboard applications:',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: applications.length,

        applied: applications.filter(
            (app) => app.status === 'Applied'
        ).length,

        interview: applications.filter(
            (app) =>
                app.status === 'Interview' ||
                app.status === 'Interviewing'
        ).length,

        offer: applications.filter(
            (app) =>
                app.status === 'Offer' ||
                app.status === 'Accepted'
        ).length,

        rejected: applications.filter(
            (app) =>
                app.status === 'Rejected' ||
                app.status === 'Withdrawn'
        ).length,
    };

    const recentApplications = [...applications]
        .sort(
            (a, b) =>
                new Date(b.appliedDate || b.createdAt) -
                new Date(a.appliedDate || a.createdAt)
        )
        .slice(0, 5);

    const cardStyle = {
        backgroundColor: darkMode
            ? '#202020'
            : '#ffffff',

        border: `1px solid ${darkMode ? '#303030' : '#e5e5e5'
            }`,

        borderRadius: '12px',

        boxShadow: darkMode
            ? '0 4px 20px rgba(0,0,0,0.2)'
            : '0 4px 20px rgba(0,0,0,0.05)',
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Applied':
                return 'primary';      // Blue
            case 'Screening':
                return 'info';         // Light Blue
            case 'Interview':
            case 'Interviewing':
                return 'warning';      // Orange/Yellow
            case 'Offer':
                return 'success';      // Green
            case 'Accepted':
                return 'success';      // Green
            case 'Rejected':
            case 'Withdrawn':
                return 'error';        // Red
            default:
                return 'default';
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '1400px',
                margin: '0 auto',
            }}
        >

            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '-0.5px',
                        }}
                    >
                        Dashboard
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mt: 0.5,
                            color: 'text.secondary',
                        }}
                    >
                        Here's an overview of your job search.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() =>
                        navigate('/applications')
                    }
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2,
                    }}
                >
                    Add Application
                </Button>
            </Box>

            {/* Loading */}
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 10,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Statistics */}
                    <Grid
                        container
                        spacing={2}
                        sx={{ mb: 4 }}
                    >

                        <Grid item xs={12} sm={6} md={3}>
                            <Paper
                                sx={{
                                    ...cardStyle,
                                    p: 2.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Applications
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            sx={{
                                                mt: 1,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {stats.total}
                                        </Typography>
                                    </Box>

                                    <WorkOutline
                                        sx={{
                                            fontSize: 32,
                                            opacity: 0.6,
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Paper
                                sx={{
                                    ...cardStyle,
                                    p: 2.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Applied
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            sx={{
                                                mt: 1,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {stats.applied}
                                        </Typography>
                                    </Box>

                                    <Schedule
                                        sx={{
                                            fontSize: 32,
                                            opacity: 0.6,
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Paper
                                sx={{
                                    ...cardStyle,
                                    p: 2.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Interviews
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            sx={{
                                                mt: 1,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {stats.interview}
                                        </Typography>
                                    </Box>

                                    <CheckCircleOutline
                                        sx={{
                                            fontSize: 32,
                                            opacity: 0.6,
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Paper
                                sx={{
                                    ...cardStyle,
                                    p: 2.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent:
                                            'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Offers
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            sx={{
                                                mt: 1,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {stats.offer}
                                        </Typography>
                                    </Box>

                                    <CheckCircleOutline
                                        sx={{
                                            fontSize: 32,
                                            opacity: 0.6,
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Recent Applications */}
                    <Paper
                        sx={{
                            ...cardStyle,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                p: 2.5,
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                                alignItems: 'center',
                                borderBottom: `1px solid ${darkMode
                                    ? '#303030'
                                    : '#eeeeee'
                                    }`,
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                    }}
                                >
                                    Recent Applications
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Your latest job applications
                                </Typography>
                            </Box>

                            <Button
                                onClick={() =>
                                    navigate(
                                        '/applications'
                                    )
                                }
                                sx={{
                                    textTransform:
                                        'none',
                                }}
                            >
                                View all
                            </Button>
                        </Box>

                        {recentApplications.length === 0 ? (
                            <Box
                                sx={{
                                    p: 6,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography
                                    color="text.secondary"
                                >
                                    No applications yet.
                                </Typography>

                                <Button
                                    variant="outlined"
                                    sx={{
                                        mt: 2,
                                        textTransform:
                                            'none',
                                    }}
                                    onClick={() =>
                                        navigate(
                                            '/applications'
                                        )
                                    }
                                >
                                    Add your first application
                                </Button>
                            </Box>
                        ) : (
                            recentApplications.map(
                                (application) => (
                                    <Box
                                        key={
                                            application._id
                                        }
                                        sx={{
                                            display: 'flex',
                                            alignItems:
                                                'center',
                                            justifyContent:
                                                'space-between',
                                            px: 2.5,
                                            py: 2,
                                            borderBottom: `1px solid ${darkMode
                                                ? '#292929'
                                                : '#eeeeee'
                                                }`,
                                            '&:last-child': {
                                                borderBottom:
                                                    'none',
                                            },
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {
                                                    application.company
                                                }
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {
                                                    application.position
                                                }
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display:
                                                    'flex',
                                                alignItems:
                                                    'center',
                                                gap: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {application.location ||
                                                    '—'}
                                            </Typography>

                                            <Chip
                                                label={
                                                    application.status ||
                                                    'Unknown'
                                                }
                                                size="small"
                                                color={statusColor(
                                                    application.status
                                                )}
                                                variant={
                                                    darkMode
                                                        ? 'outlined'
                                                        : 'filled'
                                                }
                                            />
                                        </Box>
                                    </Box>
                                )
                            )
                        )}
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default Dashboard;