import React, { useState } from 'react';
import {
    Button,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import api from '../../services/api';

const GmailSyncButton = ({ onSyncComplete }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [open, setOpen] = useState(false);

    const handleSync = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await api.post('/applications/sync-gmail');

            console.log('Gmail sync response:', response.data);

            setMessage(
                response.data.message ||
                `Gmail sync completed. ${response.data.synced || 0} applications synced.`
            );

            setSeverity('success');
            setOpen(true);

            // Tell ApplicationGrid to refresh the applications
            if (onSyncComplete) {
                onSyncComplete(response.data);
            }
        } catch (error) {
            console.error('Gmail sync error:', error);

            const errorMessage =
                error.response?.data?.message ||
                'Unable to sync Gmail. Please try again.';

            setMessage(errorMessage);
            setSeverity('error');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={
                    loading ? (
                        <CircularProgress size={18} color="inherit" />
                    ) : (
                        <SyncIcon />
                    )
                }
                onClick={handleSync}
                disabled={loading}
                sx={{
                    height: 40,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2,

                    color: 'text.primary',
                    borderColor: 'divider',

                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover'
                    }
                }}
            >
                {loading ? 'Syncing...' : 'Sync with Gmail'}
            </Button>

            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default GmailSyncButton;