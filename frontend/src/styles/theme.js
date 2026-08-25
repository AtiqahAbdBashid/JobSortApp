import { createTheme } from '@mui/material/styles';

const getTheme = (darkMode) =>
    createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',

            primary: {
                main: '#0A84FF',
            },

            secondary: {
                main: '#5E5CE6',
            },

            success: {
                main: '#30D158',
            },

            warning: {
                main: '#FF9F0A',
            },

            error: {
                main: '#FF453A',
            },

            background: {
                default: darkMode ? '#1C1C1E' : '#F5F5F7',
                paper: darkMode ? '#2C2C2E' : '#FFFFFF',
            },

            text: {
                primary: darkMode ? '#F5F5F7' : '#1D1D1F',
                secondary: darkMode ? '#98989D' : '#6E6E73',
            },

            divider: darkMode ? '#3A3A3C' : '#D1D1D6',
        },

        typography: {
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',

            h4: {
                fontWeight: 700,
                letterSpacing: '-0.5px',
            },

            h5: {
                fontWeight: 700,
                letterSpacing: '-0.3px',
            },

            h6: {
                fontWeight: 600,
            },

            button: {
                textTransform: 'none',
                fontWeight: 500,
            },
        },

        shape: {
            borderRadius: 10,
        },

        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: darkMode ? '#1C1C1E' : '#F5F5F7',
                        color: darkMode ? '#F5F5F7' : '#1D1D1F',
                    },
                },
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        boxShadow: darkMode
                            ? '0 8px 30px rgba(0, 0, 0, 0.18)'
                            : '0 4px 20px rgba(0, 0, 0, 0.06)',
                    },
                },
            },

            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        boxShadow: 'none',
                    },
                },
            },

            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '7px 14px',
                    },
                },
            },

            MuiIconButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                    },
                },
            },

            MuiTextField: {
                defaultProps: {
                    variant: 'outlined',
                },

                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 9,
                        },
                    },
                },
            },

            MuiSelect: {
                styleOverrides: {
                    select: {
                        borderRadius: 9,
                    },
                },
            },

            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 14,
                        backgroundImage: 'none',
                    },
                },
            },

            MuiMenu: {
                styleOverrides: {
                    paper: {
                        borderRadius: 10,
                        backgroundImage: 'none',
                    },
                },
            },

            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderColor: darkMode ? '#3A3A3C' : '#E5E5EA',
                    },

                    head: {
                        fontWeight: 600,
                    },
                },
            },
        },
    });

export default getTheme;