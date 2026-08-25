import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    useTheme,
    IconButton,
} from '@mui/material';
import {
    Work as WorkIcon,
    Search as SearchIcon,
    Timeline as TimelineIcon,
    Analytics as AnalyticsIcon,
    Gavel as GavelIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Email as EmailIcon,
} from '@mui/icons-material';

const LandingPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const features = [
        {
            icon: <SearchIcon sx={{ fontSize: 36 }} />,
            title: 'Auto-Sync Gmail',
            description: 'Automatically import job applications from your Gmail. No manual entry needed.',
        },
        {
            icon: <AnalyticsIcon sx={{ fontSize: 36 }} />,
            title: 'Smart Analytics',
            description: 'Track your application status, interview rates, and response times.',
        },
        {
            icon: <TimelineIcon sx={{ fontSize: 36 }} />,
            title: 'Application Timeline',
            description: 'See the complete journey of each application from submission to outcome.',
        },
        {
            icon: <GavelIcon sx={{ fontSize: 36 }} />,
            title: 'Bulk Management',
            description: 'Select, filter, sort, and delete applications in bulk with ease.',
        },
        {
            icon: <EmailIcon sx={{ fontSize: 36 }} />,
            title: 'Email Intelligence',
            description: 'AI-powered email parsing extracts company, position, and status automatically.',
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: 36 }} />,
            title: 'Career Insights',
            description: 'Visualize your job search progress with beautiful charts and stats.',
        },
    ];

    const steps = [
        {
            step: '1',
            title: 'Connect Gmail',
            description: 'Sign in with your Google account and grant access to your Gmail.',
        },
        {
            step: '2',
            title: 'Set Start Date',
            description: 'Choose when your job search began. Only emails after that date will be imported.',
        },
        {
            step: '3',
            title: 'Auto-Sync',
            description: 'JobSort automatically finds and organizes your job applications.',
        },
        {
            step: '4',
            title: 'Track & Manage',
            description: 'View, filter, sort, and update your applications in one place.',
        },
    ];

    const stats = [
        { number: '100+', label: 'Applications Tracked', icon: <WorkIcon /> },
        { number: '95%', label: 'Auto-Detection Accuracy', icon: <CheckCircleIcon /> },
        { number: '10+', label: 'Active Users', icon: <PeopleIcon /> },
        { number: '1K+', label: 'Emails Processed', icon: <EmailIcon /> },
    ];

    return (
        <Box>
            {/* =========================================================
                NAVBAR
            ========================================================= */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    bgcolor: 'rgba(28, 28, 30, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    px: { xs: 2, md: 4 },
                    py: 1.5,
                }}
            >
                <Box
                    sx={{
                        maxWidth: 1200,
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            component="img"
                            src="/logo.png"
                            alt="JobSort"
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '10px',
                                objectFit: 'contain',
                            }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: '#F5F5F7',
                                letterSpacing: '-0.3px',
                            }}
                        >
                            JobSort
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="text"
                            onClick={() => navigate('/login')}
                            sx={{
                                color: '#98989D',
                                textTransform: 'none',
                                fontWeight: 500,
                                '&:hover': { color: '#F5F5F7' },
                            }}
                        >
                            Log In
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{
                                bgcolor: '#0A84FF',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                borderRadius: '10px',
                                '&:hover': { bgcolor: '#007AFF' },
                            }}
                        >
                            Get Started
                            <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* =========================================================
                HERO SECTION
            ========================================================= */}
            <Box
                sx={{
                    pt: { xs: 12, md: 16 },
                    pb: { xs: 6, md: 10 },
                    bgcolor: '#1C1C1E',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        bgcolor: 'rgba(10, 132, 255, 0.12)',
                                        px: 2,
                                        py: 0.75,
                                        borderRadius: '20px',
                                        mb: 3,
                                    }}
                                >
                                    <CheckCircleIcon sx={{ color: '#0A84FF', fontSize: 16 }} />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: '#0A84FF',
                                            fontWeight: 500,
                                            fontSize: 12,
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        AI-POWERED JOB TRACKER
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: 36, md: 52 },
                                        fontWeight: 800,
                                        color: '#F5F5F7',
                                        lineHeight: 1.1,
                                        letterSpacing: '-0.02em',
                                        mb: 2,
                                    }}
                                >
                                    Track Your Job
                                    <br />
                                    Applications Like
                                    <br />
                                    <span style={{ color: '#0A84FF' }}>Never Before</span>
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#98989D',
                                        fontSize: { xs: 16, md: 18 },
                                        maxWidth: 500,
                                        mb: 4,
                                        lineHeight: 1.7,
                                    }}
                                >
                                    Automatically sync your Gmail, organize applications,
                                    track status updates, and get insights into your job search.
                                    All in one beautiful dashboard.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            bgcolor: '#0A84FF',
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: 16,
                                            '&:hover': { bgcolor: '#007AFF' },
                                        }}
                                    >
                                        Get Started Free
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => {
                                            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        sx={{
                                            borderColor: '#3A3A3C',
                                            color: '#F5F5F7',
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            fontSize: 16,
                                            '&:hover': {
                                                borderColor: '#0A84FF',
                                                bgcolor: 'rgba(10, 132, 255, 0.06)',
                                            },
                                        }}
                                    >
                                        Learn More
                                    </Button>
                                </Box>

                                {/* Stats */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 4,
                                        mt: 5,
                                        pt: 4,
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    {stats.map((stat, index) => (
                                        <Box key={index} sx={{ textAlign: 'center' }}>
                                            <Typography
                                                sx={{
                                                    fontSize: 24,
                                                    fontWeight: 700,
                                                    color: '#F5F5F7',
                                                }}
                                            >
                                                {stat.number}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: '#666', display: 'block', mt: 0.5 }}
                                            >
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: 520,
                                        aspectRatio: '1/0.85',
                                        bgcolor: '#1C1C1E',
                                        borderRadius: '16px',
                                        border: '1px solid #3A3A3C',
                                        p: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {/* =========================================================
                MAC TITLE BAR
            ========================================================= */}
                                    <Box
                                        sx={{
                                            height: 36,
                                            minHeight: 36,
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            px: 1.5,
                                            backgroundColor: '#242426',
                                            borderBottom: '1px solid #3A3A3C',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {/* Traffic Lights */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: 80 }}>
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF5F57' }} />
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FEBC2E' }} />
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#28C840' }} />
                                        </Box>

                                        {/* Title */}
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: '#98989D',
                                                userSelect: 'none',
                                            }}
                                        >
                                            JobSort
                                        </Typography>
                                    </Box>

                                    {/* =========================================================
                SIDEBAR + CONTENT
            ========================================================= */}
                                    <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
                                        {/* Sidebar */}
                                        <Box
                                            sx={{
                                                width: 50,
                                                minWidth: 50,
                                                backgroundColor: '#242426',
                                                borderRight: '1px solid #3A3A3C',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                py: 1.5,
                                                gap: 0.5,
                                            }}
                                        >
                                            {/* Logo */}
                                            <Box
                                                component="img"
                                                src="/logo.png"
                                                alt="JobSort"
                                                sx={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '6px',
                                                    objectFit: 'contain',
                                                    mb: 1,
                                                }}
                                            />
                                            {/* Navigation Icons */}
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '8px',
                                                    bgcolor: 'rgba(10, 132, 255, 0.15)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#0A84FF',
                                                    fontSize: 18,
                                                    mb: 0.5,
                                                }}
                                            >
                                                .
                                            </Box>
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#666',
                                                    fontSize: 18,
                                                }}
                                            >
                                                .
                                            </Box>
                                        </Box>

                                        {/* Main Content */}
                                        <Box
                                            sx={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                p: 1.5,
                                                gap: 1,
                                                backgroundColor: '#1C1C1E',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {/* Header */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                <Box>
                                                    <Typography sx={{ color: '#F5F5F7', fontSize: 14, fontWeight: 700 }}>
                                                        Applications
                                                    </Typography>
                                                    <Typography sx={{ color: '#666', fontSize: 10 }}>
                                                        Manage and track your job applications
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Box
                                                        sx={{
                                                            px: 1.5,
                                                            py: 0.5,
                                                            borderRadius: '6px',
                                                            bgcolor: 'rgba(76, 175, 80, 0.15)',
                                                            border: '1px solid rgba(76, 175, 80, 0.2)',
                                                            color: '#4CAF50',
                                                            fontSize: 9,
                                                            fontWeight: 600,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        Sync
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            px: 1.5,
                                                            py: 0.5,
                                                            borderRadius: '6px',
                                                            bgcolor: '#0A84FF',
                                                            color: '#FFFFFF',
                                                            fontSize: 9,
                                                            fontWeight: 600,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        + Add
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* Search Bar */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    bgcolor: '#2C2C2E',
                                                    borderRadius: '8px',
                                                    px: 1.5,
                                                    py: 0.75,
                                                    border: '1px solid #3A3A3C',
                                                }}
                                            >
                                                <Typography sx={{ color: '#666', fontSize: 12 }}>🔍</Typography>
                                                <Typography sx={{ color: '#666', fontSize: 11 }}>
                                                    Search applications...
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        ml: 'auto',
                                                        px: 1,
                                                        py: 0.25,
                                                        borderRadius: '4px',
                                                        bgcolor: '#3A3A3C',
                                                        color: '#98989D',
                                                        fontSize: 9,
                                                    }}
                                                >
                                                    Filter ▼
                                                </Box>
                                            </Box>

                                            {/* Table Headers */}
                                            <Box
                                                sx={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '30px 1fr 1fr 80px 80px 70px',
                                                    gap: 0.5,
                                                    px: 1,
                                                    py: 0.75,
                                                    bgcolor: '#242426',
                                                    borderRadius: '6px',
                                                    fontSize: 10,
                                                    fontWeight: 600,
                                                    color: '#98989D',
                                                    borderBottom: '1px solid #3A3A3C',
                                                }}
                                            >
                                                <Box>☐</Box>
                                                <Box>Company</Box>
                                                <Box>Position</Box>
                                                <Box sx={{ textAlign: 'center' }}>Status</Box>
                                                <Box sx={{ textAlign: 'center' }}>Date</Box>
                                                <Box sx={{ textAlign: 'center' }}>Actions</Box>
                                            </Box>

                                            {/* Table Rows */}
                                            {[
                                                { company: 'Google', position: 'Software Engineer', status: 'Interview', date: '25 Aug' },
                                                { company: 'Microsoft', position: 'Product Manager', status: 'Applied', date: '24 Aug' },
                                                { company: 'Apple', position: 'UI/UX Designer', status: 'Rejected', date: '23 Aug' },
                                                { company: 'Amazon', position: 'Data Scientist', status: 'Offer', date: '22 Aug' },
                                            ].map((app, i) => {
                                                const statusColors = {
                                                    Interview: { bg: 'rgba(255, 159, 10, 0.2)', color: '#FF9F0A' },
                                                    Applied: { bg: 'rgba(10, 132, 255, 0.2)', color: '#0A84FF' },
                                                    Rejected: { bg: 'rgba(255, 69, 58, 0.2)', color: '#FF453A' },
                                                    Offer: { bg: 'rgba(48, 209, 88, 0.2)', color: '#30D158' },
                                                };
                                                const colors = statusColors[app.status] || statusColors.Applied;

                                                return (
                                                    <Box
                                                        key={i}
                                                        sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: '30px 1fr 1fr 80px 80px 70px',
                                                            gap: 0.5,
                                                            alignItems: 'center',
                                                            px: 1,
                                                            py: 0.75,
                                                            borderRadius: '4px',
                                                            bgcolor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                                                        }}
                                                    >
                                                        <Typography sx={{ color: '#666', fontSize: 12 }}>☐</Typography>
                                                        <Typography sx={{ color: '#F5F5F7', fontSize: 12, fontWeight: 500 }}>
                                                            {app.company}
                                                        </Typography>
                                                        <Typography sx={{ color: '#F5F5F7', fontSize: 12 }}>
                                                            {app.position}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                justifySelf: 'center',
                                                                px: 1.5,
                                                                py: 0.25,
                                                                borderRadius: '12px',
                                                                bgcolor: colors.bg,
                                                                color: colors.color,
                                                                fontSize: 9,
                                                                fontWeight: 600,
                                                                textAlign: 'center',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            {app.status}
                                                        </Box>
                                                        <Typography
                                                            sx={{
                                                                justifySelf: 'center',
                                                                color: '#666',
                                                                fontSize: 11,
                                                            }}
                                                        >
                                                            {app.date}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                justifySelf: 'center',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: 22,
                                                                    height: 22,
                                                                    borderRadius: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: '#0A84FF',
                                                                    fontSize: 12,
                                                                    bgcolor: 'rgba(10, 132, 255, 0.1)',
                                                                }}
                                                            >
                                                                .
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    width: 22,
                                                                    height: 22,
                                                                    borderRadius: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: '#666',
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                ✏️
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    width: 22,
                                                                    height: 22,
                                                                    borderRadius: '4px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: '#FF453A',
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                🗑️
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}

                                            {/* AI Powered Badge */}
                                            <Box
                                                sx={{
                                                    mt: 'auto',
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    pt: 1,
                                                    borderTop: '1px solid rgba(255,255,255,0.04)',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        bgcolor: 'rgba(10, 132, 255, 0.12)',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: '20px',
                                                        border: '1px solid rgba(10, 132, 255, 0.15)',
                                                    }}
                                                >
                                                    <Typography sx={{ color: '#0A84FF', fontSize: 10, fontWeight: 500 }}>
                                                        🤖 AI-Powered
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* =========================================================
                FEATURES SECTION
            ========================================================= */}
            <Box
                id="features"
                sx={{
                    py: { xs: 6, md: 10 },
                    bgcolor: '#1C1C1E',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#0A84FF',
                                fontWeight: 600,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Features
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: '#F5F5F7',
                                fontSize: { xs: 28, md: 38 },
                                mt: 1,
                                mb: 2,
                            }}
                        >
                            Everything You Need to
                            <br />
                            <span style={{ color: '#0A84FF' }}>Master Your Job Search</span>
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#98989D',
                                maxWidth: 600,
                                margin: '0 auto',
                                fontSize: 16,
                            }}
                        >
                            JobSort combines powerful automation with beautiful design
                            to help you stay on top of your applications.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    sx={{
                                        bgcolor: '#2C2C2E',
                                        borderRadius: '14px',
                                        border: '1px solid #3A3A3C',
                                        p: 3,
                                        height: '100%',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            borderColor: '#0A84FF',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(10, 132, 255, 0.12)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            color: '#0A84FF',
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#F5F5F7',
                                            fontWeight: 600,
                                            mb: 1,
                                            fontSize: 18,
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#98989D',
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* =========================================================
                HOW IT WORKS SECTION
            ========================================================= */}
            <Box
                sx={{
                    py: { xs: 6, md: 10 },
                    bgcolor: '#1C1C1E',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#0A84FF',
                                fontWeight: 600,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                            }}
                        >
                            How It Works
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: '#F5F5F7',
                                fontSize: { xs: 28, md: 38 },
                                mt: 1,
                            }}
                        >
                            Get Started in{' '}
                            <span style={{ color: '#0A84FF' }}>4 Simple Steps</span>
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(10, 132, 255, 0.12)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            mb: 2,
                                            border: '2px solid rgba(10, 132, 255, 0.2)',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 24,
                                                fontWeight: 700,
                                                color: '#0A84FF',
                                            }}
                                        >
                                            {step.step}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#F5F5F7',
                                            fontWeight: 600,
                                            mb: 1,
                                        }}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#98989D',
                                            lineHeight: 1.7,
                                            maxWidth: 250,
                                            margin: '0 auto',
                                        }}
                                    >
                                        {step.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* =========================================================
                CTA SECTION
            ========================================================= */}
            <Box
                sx={{
                    py: { xs: 6, md: 10 },
                    bgcolor: '#0A84FF',
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: '#FFFFFF',
                                fontSize: { xs: 28, md: 38 },
                                mb: 2,
                            }}
                        >
                            Ready to Take Control of
                            <br />
                            Your Job Search?
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: 16,
                                mb: 4,
                            }}
                        >
                            Join thousands of job seekers who use JobSort to
                            track and manage their applications effortlessly.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                                bgcolor: '#FFFFFF',
                                color: '#0A84FF',
                                px: 5,
                                py: 1.8,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: 18,
                                '&:hover': {
                                    bgcolor: '#F0F0F0',
                                },
                            }}
                        >
                            Get Started Free
                            <ArrowForwardIcon sx={{ ml: 1.5 }} />
                        </Button>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                mt: 2,
                                color: 'rgba(255,255,255,0.6)',
                            }}
                        >
                            A working prototype by Atiqah Bashid. Not affiliated with Google, Microsoft, or Apple.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* =========================================================
                FOOTER
            ========================================================= */}
            <Box
                sx={{
                    py: 4,
                    bgcolor: '#1C1C1E',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '8px',
                                    bgcolor: '#0A84FF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    fontWeight: 700,
                                    fontSize: 12,
                                }}
                            >
                                JS
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#666',
                                    fontWeight: 500,
                                }}
                            >
                                © {new Date().getFullYear()} JobSort. All rights reserved.
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#666',
                                    cursor: 'pointer',
                                    '&:hover': { color: '#F5F5F7' },
                                }}
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#666',
                                    cursor: 'pointer',
                                    '&:hover': { color: '#F5F5F7' },
                                }}
                            >
                                Privacy
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#666',
                                    cursor: 'pointer',
                                    '&:hover': { color: '#F5F5F7' },
                                }}
                            >
                                Terms
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;