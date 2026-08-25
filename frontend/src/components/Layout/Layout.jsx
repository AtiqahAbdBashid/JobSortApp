import React from 'react';

import {
    Box,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Tooltip,
} from '@mui/material';

import {
    DashboardOutlined,
    WorkOutline,
    SettingsOutlined,
    Logout,
    Brightness4,
    Brightness7,
    AccountCircle,
} from '@mui/icons-material';

import {
    useLocation,
    useNavigate,
} from 'react-router-dom';


const Layout = ({
    children,
    darkMode,
    toggleDarkMode,
}) => {

    const [anchorEl, setAnchorEl] =
        React.useState(null);

    const navigate = useNavigate();

    const location = useLocation();


    /* =====================================================
       USER
       ===================================================== */

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    );


    /* =====================================================
       MENU
       ===================================================== */

    const menuOpen = Boolean(anchorEl);


    const handleMenu = (event) => {

        setAnchorEl(event.currentTarget);

    };


    const handleClose = () => {

        setAnchorEl(null);

    };


    /* =====================================================
       LOGOUT
       ===================================================== */

    const handleLogout = () => {

        localStorage.removeItem('token');

        localStorage.removeItem('user');

        navigate('/login');

    };


    /* =====================================================
       NAVIGATION
       ===================================================== */

    const navigation = [

        {
            label: 'Dashboard',
            path: '/',
            icon: <DashboardOutlined />,
        },

        {
            label: 'Applications',
            path: '/applications',
            icon: <WorkOutline />,
        },

    ];


    /* =====================================================
       ACTIVE ROUTE
       ===================================================== */

    const isActive = (path) => {

        if (path === '/') {

            return location.pathname === '/';

        }

        return location.pathname.startsWith(path);

    };


    /* =====================================================
       NAVIGATION ITEM
       ===================================================== */

    const NavigationItem = ({
        label,
        path,
        icon,
    }) => {

        const active = isActive(path);

        return (

            <Box
                onClick={() => navigate(path)}

                sx={{
                    display: 'flex',

                    alignItems: 'center',

                    gap: 1.25,

                    px: 1.25,

                    py: 1,

                    borderRadius: '8px',

                    cursor: 'pointer',

                    color: active
                        ? 'primary.main'
                        : 'text.secondary',

                    backgroundColor: active
                        ? darkMode
                            ? 'rgba(10, 132, 255, 0.14)'
                            : 'rgba(10, 132, 255, 0.10)'
                        : 'transparent',

                    transition:
                        'background-color 120ms ease, color 120ms ease',

                    '&:hover': {

                        backgroundColor: active
                            ? undefined
                            : darkMode
                                ? 'rgba(255,255,255,0.06)'
                                : 'rgba(0,0,0,0.05)',

                        color: active
                            ? 'primary.main'
                            : 'text.primary',

                    },
                }}
            >

                {React.cloneElement(
                    icon,
                    {
                        sx: {
                            fontSize: 20,
                        },
                    }
                )}

                <Typography
                    sx={{
                        fontSize: 13,

                        fontWeight: active
                            ? 600
                            : 500,
                    }}
                >
                    {label}
                </Typography>

            </Box>

        );

    };


    /* =====================================================
       LAYOUT
       ===================================================== */

    return (

        <Box
            sx={{
                width: '100%',

                height: '100vh',

                display: 'flex',

                flexDirection: 'column',

                overflow: 'hidden',

                bgcolor: 'background.default',

                color: 'text.primary',
            }}
        >

            {/* =================================================
                MACOS TITLE BAR
                ================================================= */}

            <Box
                sx={{
                    height: 40,

                    minHeight: 40,

                    width: '100%',

                    display: 'flex',

                    alignItems: 'center',

                    px: 1.5,

                    position: 'relative',

                    backgroundColor: darkMode
                        ? '#242426'
                        : '#EBEBED',

                    borderBottom: '1px solid',

                    borderColor: 'divider',
                }}
            >

                {/* -----------------------------------------
                    TRAFFIC LIGHTS
                    ----------------------------------------- */}

                <Box
                    sx={{
                        display: 'flex',

                        alignItems: 'center',

                        gap: 0.75,

                        width: 80,
                    }}
                >

                    <Box
                        sx={{
                            width: 12,

                            height: 12,

                            borderRadius: '50%',

                            backgroundColor: '#FF5F57',
                        }}
                    />

                    <Box
                        sx={{
                            width: 12,

                            height: 12,

                            borderRadius: '50%',

                            backgroundColor: '#FEBC2E',
                        }}
                    />

                    <Box
                        sx={{
                            width: 12,

                            height: 12,

                            borderRadius: '50%',

                            backgroundColor: '#28C840',
                        }}
                    />

                </Box>


                {/* -----------------------------------------
                    WINDOW TITLE
                    ----------------------------------------- */}

                <Typography
                    sx={{
                        position: 'absolute',

                        left: '50%',

                        transform:
                            'translateX(-50%)',

                        fontSize: 13,

                        fontWeight: 600,

                        color: 'text.secondary',

                        userSelect: 'none',
                    }}
                >
                    Job Tracker
                </Typography>


                {/* -----------------------------------------
                    WINDOW CONTROLS
                    ----------------------------------------- */}

                <Box
                    sx={{
                        ml: 'auto',

                        display: 'flex',

                        alignItems: 'center',

                        gap: 0.5,
                    }}
                >

                    {/* Dark Mode */}

                    <Tooltip
                        title={
                            darkMode
                                ? 'Light mode'
                                : 'Dark mode'
                        }
                    >

                        <IconButton
                            size="small"

                            onClick={toggleDarkMode}

                            sx={{
                                color:
                                    'text.secondary',

                                '&:hover': {
                                    backgroundColor:
                                        darkMode
                                            ? '#3A3A3C'
                                            : '#D8D8DC',
                                },
                            }}
                        >

                            {darkMode
                                ? (
                                    <Brightness7
                                        fontSize="small"
                                    />
                                )
                                : (
                                    <Brightness4
                                        fontSize="small"
                                    />
                                )
                            }

                        </IconButton>

                    </Tooltip>


                    {/* User */}

                    <IconButton
                        size="small"

                        onClick={handleMenu}

                        sx={{
                            ml: 0.5,

                            p: 0.25,
                        }}
                    >

                        <Avatar
                            sx={{
                                width: 25,

                                height: 25,

                                fontSize: 12,

                                backgroundColor:
                                    darkMode
                                        ? '#636366'
                                        : '#0A84FF',
                            }}
                        >

                            {user.name
                                ?.charAt(0)
                                ?.toUpperCase() || 'U'}

                        </Avatar>

                    </IconButton>


                    {/* User Menu */}

                    <Menu
                        anchorEl={anchorEl}

                        open={menuOpen}

                        onClose={handleClose}

                        anchorOrigin={{
                            vertical: 'bottom',

                            horizontal: 'right',
                        }}

                        transformOrigin={{
                            vertical: 'top',

                            horizontal: 'right',
                        }}

                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,

                                    minWidth: 210,
                                },
                            },
                        }}
                    >

                        <MenuItem disabled>

                            <AccountCircle
                                sx={{
                                    mr: 1.5,

                                    fontSize: 20,
                                }}
                            />

                            {user.name || 'User'}

                        </MenuItem>


                        <Divider />


                        <MenuItem
                            onClick={() => {

                                handleClose();

                                navigate('/settings');

                            }}
                        >

                            <SettingsOutlined
                                sx={{
                                    mr: 1.5,

                                    fontSize: 20,
                                }}
                            />

                            Settings

                        </MenuItem>


                        <MenuItem
                            onClick={handleLogout}

                            sx={{
                                color: 'error.main',
                            }}
                        >

                            <Logout
                                sx={{
                                    mr: 1.5,

                                    fontSize: 20,
                                }}
                            />

                            Sign Out

                        </MenuItem>

                    </Menu>

                </Box>

            </Box>


            {/* =================================================
                APPLICATION AREA
                ================================================= */}

            <Box
                sx={{
                    flex: 1,

                    minHeight: 0,

                    display: 'flex',

                    overflow: 'hidden',
                }}
            >


                {/* =================================================
                    SIDEBAR
                    ================================================= */}

                <Box
                    sx={{
                        width: 220,

                        minWidth: 220,

                        display: 'flex',

                        flexDirection: 'column',

                        px: 1.5,

                        py: 1.5,

                        backgroundColor:
                            darkMode
                                ? '#242426'
                                : '#EBEBED',

                        borderRight: '1px solid',

                        borderColor: 'divider',
                    }}
                >


                    {/* -----------------------------------------
                        APP IDENTITY
                        ----------------------------------------- */}

                    <Box
                        sx={{
                            display: 'flex',

                            alignItems: 'center',

                            gap: 1.25,

                            px: 1,

                            py: 1.5,

                            mb: 1.5,
                        }}
                    >

                        <Box
                            component="img"
                            src="/logo.png"  // ← Your logo file in public folder
                            alt="JobSort"
                            sx={{
                                width: 34,
                                height: 34,
                                minWidth: 34,
                                borderRadius: '9px',
                                objectFit: 'contain',
                            }}
                        />

                        <Box>

                            <Typography
                                sx={{
                                    fontSize: 14,

                                    fontWeight: 650,

                                    lineHeight: 1.2,
                                }}
                            >
                                JobSort
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,

                                    color:
                                        'text.secondary',

                                    mt: 0.25,
                                }}
                            >
                                Career dashboard
                            </Typography>

                        </Box>

                    </Box>


                    {/* -----------------------------------------
                        SECTION TITLE
                        ----------------------------------------- */}

                    <Typography
                        sx={{
                            px: 1,

                            mb: 0.75,

                            fontSize: 10,

                            fontWeight: 700,

                            letterSpacing: '0.08em',

                            textTransform:
                                'uppercase',

                            color:
                                'text.secondary',
                        }}
                    >
                        Workspace
                    </Typography>


                    {/* -----------------------------------------
                        NAVIGATION
                        ----------------------------------------- */}

                    <Box
                        sx={{
                            display: 'flex',

                            flexDirection:
                                'column',

                            gap: 0.5,
                        }}
                    >

                        {navigation.map(
                            (item) => (

                                <NavigationItem
                                    key={
                                        item.path
                                    }

                                    label={
                                        item.label
                                    }

                                    path={
                                        item.path
                                    }

                                    icon={
                                        item.icon
                                    }
                                />

                            )
                        )}

                    </Box>


                    {/* -----------------------------------------
                        BOTTOM SETTINGS
                        ----------------------------------------- */}

                    <Box
                        sx={{
                            mt: 'auto',
                        }}
                    >

                        <NavigationItem
                            label="Settings"

                            path="/settings"

                            icon={
                                <SettingsOutlined />
                            }
                        />

                    </Box>

                </Box>


                {/* =================================================
                    MAIN CONTENT
                    ================================================= */}

                <Box
                    component="main"

                    sx={{
                        flex: 1,

                        minWidth: 0,

                        minHeight: 0,

                        overflow: 'auto',

                        backgroundColor:
                            'background.default',

                        p: {
                            xs: 2,

                            md: 3,
                        },
                    }}
                >

                    {children}

                </Box>

            </Box>

        </Box>

    );
};

export default Layout;