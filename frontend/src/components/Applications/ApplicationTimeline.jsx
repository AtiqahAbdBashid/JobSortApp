import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Timeline, TimelineItem, TimelineSeparator,
    TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent,
    Chip, IconButton, Dialog, DialogTitle, DialogContent, Button
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import api from '../../services/api';

const ApplicationTimeline = ({ applicationId, open, onClose, darkMode }) => {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) {
            fetchTimeline();
        }
    }, [open]);

    const fetchTimeline = async () => {
        try {
            const response = await api.get(`/applications/${applicationId}/timeline`);
            setTimeline(response.data.timeline || []);
        } catch (error) {
            console.error('Error fetching timeline:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Applied': '#0A84FF',
            'Screening': '#5E5CE6',
            'Interview': '#FF9F0A',
            'Offer': '#30D158',
            'Accepted': '#30D158',
            'Rejected': '#FF453A',
            'Withdrawn': '#FF6B6B',
            'Scheduled': '#0A84FF',
            'Passed': '#30D158',
            'Failed': '#FF453A'
        };
        return colors[status] || '#98989D';
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    bgcolor: darkMode ? '#1C1C1E' : '#FFFFFF',
                    borderRadius: '16px',
                    p: 0,
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${darkMode ? '#3A3A3C' : '#E5E5EA'}`,
                p: 3
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: darkMode ? '#F5F5F7' : '#1C1C1E' }}>
                    Application Timeline
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon sx={{ color: darkMode ? '#98989D' : '#666' }} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {loading ? (
                    <Typography sx={{ textAlign: 'center', color: '#98989D', py: 4 }}>
                        Loading timeline...
                    </Typography>
                ) : timeline.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', color: '#98989D', py: 4 }}>
                        No timeline events yet.
                    </Typography>
                ) : (
                    <Timeline position="right">
                        {timeline.map((event, index) => (
                            <TimelineItem key={index}>
                                <TimelineOppositeContent
                                    sx={{ m: 'auto 0', color: '#98989D', fontSize: 12 }}
                                >
                                    {new Date(event.date).toLocaleDateString('en-MY', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot
                                        sx={{
                                            bgcolor: event.type === 'status_change'
                                                ? getStatusColor(event.status)
                                                : '#0A84FF'
                                        }}
                                    />
                                    {index < timeline.length - 1 && <TimelineConnector sx={{ bgcolor: '#3A3A3C' }} />}
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: '12px', px: 2 }}>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, color: darkMode ? '#F5F5F7' : '#1C1C1E' }}>
                                            {event.type === 'status_change'
                                                ? `Status changed to ${event.status}`
                                                : `Interview: ${event.interviewType || 'General'}`}
                                        </Typography>
                                        {event.note && (
                                            <Typography variant="body2" sx={{ color: '#98989D', mt: 0.5 }}>
                                                {event.note}
                                            </Typography>
                                        )}
                                        {event.outcome && (
                                            <Chip
                                                label={event.outcome}
                                                size="small"
                                                sx={{
                                                    mt: 1,
                                                    bgcolor: getStatusColor(event.outcome) + '20',
                                                    color: getStatusColor(event.outcome),
                                                    border: `1px solid ${getStatusColor(event.outcome)}40`,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationTimeline;