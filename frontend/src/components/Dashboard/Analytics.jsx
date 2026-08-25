import React, { useState, useEffect } from 'react';

import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Chip,
} from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    AreaChart,
    Area,
    ResponsiveContainer,
} from 'recharts';
import {
    Work as WorkIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const Analytics = ({ darkMode }) => {

    const [analyticsData, setAnalyticsData] = useState({
        statusDistribution: [],
        monthlyTrend: [],
        weeklyTrend: [],
        totalApplications: 0,
        interviewRate: { rate: 0, offerRate: 0 },
        responseTime: { avg: 0 },
        statusCounts: {
            Applied: 0,
            Screening: 0,
            Interview: 0,
            Offer: 0,
            Accepted: 0,
            Rejected: 0,
            Withdrawn: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/applications/analytics');
            setAnalyticsData(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#0A84FF', '#FF9F0A', '#30D158', '#077823ff', '#FF453A', '#5E5CE6', '#FF6B6B', '#8E8E93'];

    const getStatusColor = (status) => {
        const colors = {
            'Applied': '#0A84FF',      // Blue
            'Screening': '#5E5CE6',    // Purple
            'Interview': '#FF9F0A',    // Orange
            'Offer': '#30D158',        // Green
            'Accepted': '#077823ff',     // Green
            'Rejected': '#FF453A',     // Red
            'Withdrawn': '#8E8E93'     // Gray
        };
        return colors[status] || '#98989D';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Applied':
                return <WorkIcon sx={{ fontSize: 16 }} />;
            case 'Screening':
                return <ScheduleIcon sx={{ fontSize: 16 }} />;
            case 'Interview':
                return <ScheduleIcon sx={{ fontSize: 16 }} />;
            case 'Offer':
            case 'Accepted':
                return <CheckCircleIcon sx={{ fontSize: 16 }} />;
            case 'Rejected':
            case 'Withdrawn':
                return <CancelIcon sx={{ fontSize: 16 }} />;
            default:
                return <WorkIcon sx={{ fontSize: 16 }} />;
        }
    };

    // Theme-based colors
    const isDark = darkMode;
    const bgColor = isDark ? '#2C2C2E' : '#FFFFFF';
    const borderColor = isDark ? '#3A3A3C' : '#E5E5EA';
    const textColor = isDark ? '#F5F5F7' : '#1C1C1E';
    const textSecondary = isDark ? '#98989D' : '#6E6E73';
    const cardBg = isDark ? '#1C1C1E' : '#F5F5F7';
    const tooltipBg = isDark ? '#2C2C2E' : '#FFFFFF';
    const gridColor = isDark ? '#3A3A3C' : '#E5E5EA';
    const axisColor = isDark ? '#98989D' : '#666';
    const progressBg = isDark ? '#2C2C2E' : '#E5E5EA';

    if (loading) {
        return (
            <Box sx={{ py: 4 }}>
                <LinearProgress sx={{ bgcolor: progressBg }} />
                <Typography sx={{ mt: 2, textAlign: 'center', color: textSecondary }}>
                    Loading analytics...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: textColor }}>
                Smart Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: textSecondary, mb: 4 }}>
                Track your application status, interview rates, and response times.
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '12px' }}>
                        <CardContent>
                            <Typography variant="body2" sx={{ color: textSecondary }}>Total Applications</Typography>
                            <Typography variant="h4" sx={{ color: textColor, fontWeight: 700 }}>
                                {analyticsData.totalApplications || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '12px' }}>
                        <CardContent>
                            <Typography variant="body2" sx={{ color: textSecondary }}>Interview Rate</Typography>
                            <Typography variant="h4" sx={{ color: '#FF9F0A', fontWeight: 700 }}>
                                {analyticsData.interviewRate?.rate || 0}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: textSecondary }}>
                                {analyticsData.interviewRate?.rate > 50 ? '👍 Good rate!' : 'Keep going!'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '12px' }}>
                        <CardContent>
                            <Typography variant="body2" sx={{ color: textSecondary }}>Offer Rate</Typography>
                            <Typography variant="h4" sx={{ color: '#30D158', fontWeight: 700 }}>
                                {analyticsData.interviewRate?.offerRate || 0}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: textSecondary }}>
                                {analyticsData.interviewRate?.offerRate > 20 ? '🌟 Great results!' : 'Keep applying!'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '12px' }}>
                        <CardContent>
                            <Typography variant="body2" sx={{ color: textSecondary }}>Avg Response Time</Typography>
                            <Typography variant="h4" sx={{ color: '#0A84FF', fontWeight: 700 }}>
                                {analyticsData.responseTime?.avg || 0} days
                            </Typography>
                            <Typography variant="caption" sx={{ color: textSecondary }}>
                                {analyticsData.responseTime?.avg < 7 ? 'Fast responses!' : 'Be patient!'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Status Distribution Pie Chart */}
            <Paper sx={{ p: 3, bgcolor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '12px', mb: 3 }}>
                <Typography variant="h6" sx={{ color: textColor, fontWeight: 600, mb: 2 }}>
                    Status Distribution
                </Typography>
                <Box sx={{ height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={analyticsData.statusDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent, count }) =>
                                    `${name}: ${count} (${(percent * 100).toFixed(0)}%)`
                                }
                                outerRadius={120}
                                innerRadius={60}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {analyticsData.statusDistribution?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => (
                                    <span style={{ color: textColor }}>
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>

            {/* Monthly Trend - Area Chart */}
            <Paper sx={{ p: 3, bgcolor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '12px', mb: 3 }}>
                <Typography variant="h6" sx={{ color: textColor, fontWeight: 600, mb: 2 }}>
                    Monthly Application Trend
                </Typography>
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.monthlyTrend}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis
                                dataKey="month"
                                stroke={axisColor}
                                style={{ fontSize: 12 }}
                            />
                            <YAxis
                                stroke={axisColor}
                                style={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: '8px',
                                }}
                                labelStyle={{ color: textColor }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#0A84FF"
                                fill="url(#colorCount)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>

            {/* Weekly Trend - Bar Chart */}
            <Paper sx={{ p: 3, bgcolor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '12px', mb: 3 }}>
                <Typography variant="h6" sx={{ color: textColor, fontWeight: 600, mb: 2 }}>
                    Weekly Application Activity
                </Typography>
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.weeklyTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis
                                dataKey="week"
                                stroke={axisColor}
                                style={{ fontSize: 12 }}
                            />
                            <YAxis
                                stroke={axisColor}
                                style={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: '8px',
                                }}
                            />
                            <Bar dataKey="count" fill="#0A84FF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>

            {/* Status Breakdown with Icons */}
            <Paper sx={{ p: 3, bgcolor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '12px' }}>
                <Typography variant="h6" sx={{ color: textColor, fontWeight: 600, mb: 2 }}>
                    Status Breakdown
                </Typography>
                <Grid container spacing={2}>
                    {Object.entries(analyticsData.statusCounts || {}).map(([status, count]) => (
                        <Grid item xs={12} sm={6} md={4} key={status}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1.5,
                                    borderRadius: '8px',
                                    bgcolor: cardBg,
                                    border: `1px solid ${borderColor}`,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ color: getStatusColor(status) }}>
                                        {getStatusIcon(status)}
                                    </Box>
                                    <Typography variant="body2" sx={{ color: textColor }}>
                                        {status}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={count}
                                    size="small"
                                    sx={{
                                        bgcolor: getStatusColor(status),
                                        color: '#FFFFFF',
                                        fontWeight: 600,
                                        minWidth: 30,
                                    }}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default Analytics;