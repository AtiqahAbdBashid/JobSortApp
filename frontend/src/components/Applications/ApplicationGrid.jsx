import React, { useEffect, useMemo, useState } from 'react';

import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    CircularProgress,
    Alert,
    Tooltip,
    Checkbox,
} from '@mui/material';

import {
    Add,
    Edit,
    Delete,
    Search,
    Refresh,
    Close,
    Sync as SyncIcon,
    DeleteSweep,
    Timeline as TimelineIcon,
} from '@mui/icons-material';

import api from '../../services/api';
import GmailSyncButton from '../GmailSync/GmailSyncButton';


const ApplicationGrid = ({ darkMode }) => {

    // =========================================================
    // STATE
    // =========================================================

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const [statusFilter, setStatusFilter] = useState('All');

    const [page, setPage] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });

    // Add/Edit modal
    const [modalOpen, setModalOpen] = useState(false);

    const [editingApplication, setEditingApplication] =
        useState(null);

    const [saving, setSaving] = useState(false);

    // Delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [applicationToDelete, setApplicationToDelete] =
        useState(null);

    // Bulk Delete
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Timeline
    const [timelineOpen, setTimelineOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [timelineData, setTimelineData] = useState([]);
    const [timelineLoading, setTimelineLoading] = useState(false);

    // Bulk Status Update
    const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false);
    const [bulkStatus, setBulkStatus] = useState('Applied');

    // Sync Gmail
    const [showSyncDialog, setShowSyncDialog] = useState(false);

    const [syncStartDate, setSyncStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
    });

    const [syncing, setSyncing] = useState(false);

    // =========================================================
    // SYNC PROGRESS STATE
    // =========================================================
    const [syncProgress, setSyncProgress] = useState({
        isSyncing: false,
        currentStep: '',
        processed: 0,
        total: 0,
        currentEmail: '',
        message: ''
    });

    const calmingMessages = [
        "Taking a deep breath...",
        "Brewing some coffee...",
        "Searching through the email jungle...",
        "Organizing your applications...",
        "AI is thinking hard...",
        "Almost there, hang tight!",
        "Your job applications are being sorted...",
        "Targeting the right emails...",
        "Crunching the data...",
        "Making your job search beautiful...",
        "Syncing with the universe...",
        "Checking your mailbox...",
        "Predicting your next interview...",
        "Your career journey is being updated...",
        "You're doing great! Keep going!",
        "Launching your career dashboard...",
        "Applying some magic...",
        "Working on your applications...",
        "This won't take long...",
        "Getting things ready for you...",
        "Almost finished...",
    ];

    // =========================================================
    // FETCH APPLICATIONS
    // =========================================================

    useEffect(() => {
        fetchApplications();
    }, []);


    const fetchApplications = async () => {

        try {

            setLoading(true);
            setError('');

            const response =
                await api.get('/applications');

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.applications || [];

            setApplications(data);
            setSelectedIds([]);

        } catch (err) {

            console.error(
                'Error fetching applications:',
                err
            );

            setError(
                err.response?.data?.message ||
                'Unable to load applications.'
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // FETCH TIMELINE
    // =========================================================

    const fetchTimeline = async (appId) => {
        setTimelineLoading(true);
        try {
            const response = await api.get(`/applications/${appId}/timeline`);
            setTimelineData(response.data.timeline || []);
        } catch (error) {
            console.error('Error fetching timeline:', error);
            setTimelineData([]);
        } finally {
            setTimelineLoading(false);
        }
    };

    const handleOpenTimeline = (application) => {
        setSelectedApplication(application);
        setTimelineOpen(true);
        fetchTimeline(application._id);
    };


    // =========================================================
    // SYNC GMAIL - WITH PROGRESS AND CALMING MESSAGES
    // =========================================================

    const handleSyncGmail = async () => {
        if (!syncStartDate) {
            alert('Please select a start date');
            return;
        }

        // Show progress dialog with initial message
        setSyncProgress({
            isSyncing: true,
            currentStep: 'Connecting to Gmail...',
            processed: 0,
            total: 100,
            currentEmail: '',
            message: 'Starting sync...'
        });

        setSyncing(true);
        setShowSyncDialog(false);

        // Simulate progress updates (slow and steady)
        let progressValue = 0;
        let messageIndex = 0;
        let lastMessageChange = Date.now();

        // Function to update progress
        const updateProgress = () => {
            // Slow progress: 1-2% per update
            const increment = Math.random() * 2 + 1;
            progressValue = Math.min(progressValue + increment, 90);

            // Update message every 3 seconds
            const now = Date.now();
            if (now - lastMessageChange > 3000) {
                messageIndex = (messageIndex + 1) % calmingMessages.length;
                lastMessageChange = now;

                setSyncProgress(prev => ({
                    ...prev,
                    processed: Math.round(progressValue),
                    currentStep: progressValue < 30 ? 'Scanning your Gmail...' :
                        progressValue < 60 ? 'AI is analyzing emails...' :
                            'Organizing your applications...',
                    message: calmingMessages[messageIndex]
                }));
            } else {
                setSyncProgress(prev => ({
                    ...prev,
                    processed: Math.round(progressValue)
                }));
            }
        };

        // Update every 800ms (smooth progress)
        const progressInterval = setInterval(updateProgress, 800);

        try {
            const response = await api.post('/applications/sync-gmail', {
                startDate: syncStartDate
            });

            clearInterval(progressInterval);

            // Show completion
            setSyncProgress({
                isSyncing: true,
                currentStep: 'Sync Complete!',
                processed: 100,
                total: 100,
                currentEmail: '',
                message: `Synced ${response.data.synced || 0} new applications, updated ${response.data.updated || 0} existing`
            });

            // Wait 2 seconds then close
            setTimeout(() => {
                setSyncProgress({ isSyncing: false, currentStep: '', processed: 0, total: 0, currentEmail: '', message: '' });
                alert(`Synced ${response.data.synced || 0} new applications from ${new Date(syncStartDate).toLocaleDateString()}`);
                fetchApplications();
            }, 2000);

        } catch (error) {
            console.error('Error syncing:', error);
            clearInterval(progressInterval);
            setSyncProgress({
                isSyncing: false,
                currentStep: 'Sync Failed',
                processed: 0,
                total: 0,
                currentEmail: '',
                message: 'Failed to sync emails. Please try again.'
            });
            alert('Failed to sync emails. Make sure Gmail is connected.');
        } finally {
            setSyncing(false);
            // Close dialog after 3 seconds if still open
            setTimeout(() => {
                setSyncProgress({ isSyncing: false, currentStep: '', processed: 0, total: 0, currentEmail: '', message: '' });
            }, 3000);
        }
    };


    // =========================================================
    // BULK STATUS UPDATE
    // =========================================================

    const handleBulkStatusUpdate = async () => {
        if (selectedIds.length === 0) return;
        setBulkDeleting(true);
        try {
            await api.post('/applications/bulk-status', {
                applicationIds: selectedIds,
                status: bulkStatus
            });
            setSelectedIds([]);
            setBulkStatusDialogOpen(false);
            fetchApplications();
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update applications.');
        } finally {
            setBulkDeleting(false);
        }
    };


    // =========================================================
    // SORTING
    // =========================================================

    const handleSort = (key) => {

        setSortConfig((current) => {

            if (current.key === key) {

                return {
                    key,
                    direction:
                        current.direction === 'asc'
                            ? 'desc'
                            : 'asc',
                };

            }

            return {
                key,
                direction: 'asc',
            };

        });

        setPage(0);
    };


    // =========================================================
    // FILTER + SORT
    // =========================================================

    const filteredApplications = useMemo(() => {

        let result = [...applications];

        // -------------------------
        // Search
        // -------------------------

        const search =
            searchTerm
                .toLowerCase()
                .trim();

        if (search) {

            result = result.filter((app) => {

                return (

                    app.company
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    app.position
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    app.location
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    app.status
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    app.jobType
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    app.source
                        ?.toLowerCase()
                        .includes(search)

                );

            });

        }


        // -------------------------
        // Status filter
        // -------------------------

        if (statusFilter !== 'All') {

            result = result.filter(
                (app) =>
                    app.status === statusFilter
            );

        }


        // -------------------------
        // Sorting
        // -------------------------

        if (sortConfig.key) {

            result.sort((a, b) => {

                let valueA =
                    a[sortConfig.key];

                let valueB =
                    b[sortConfig.key];


                // Dates
                if (
                    sortConfig.key ===
                    'appliedDate'
                ) {

                    valueA = valueA
                        ? new Date(valueA).getTime()
                        : 0;

                    valueB = valueB
                        ? new Date(valueB).getTime()
                        : 0;

                }

                // Strings
                else {

                    valueA = String(
                        valueA ?? ''
                    ).toLowerCase();

                    valueB = String(
                        valueB ?? ''
                    ).toLowerCase();

                }


                if (valueA < valueB) {

                    return sortConfig.direction ===
                        'asc'
                        ? -1
                        : 1;

                }


                if (valueA > valueB) {

                    return sortConfig.direction ===
                        'asc'
                        ? 1
                        : -1;

                }


                return 0;

            });

        }


        return result;

    }, [
        applications,
        searchTerm,
        statusFilter,
        sortConfig,
    ]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const paginatedApplications =
        filteredApplications.slice(
            page * rowsPerPage,
            page * rowsPerPage +
            rowsPerPage
        );


    const handleChangePage = (
        event,
        newPage
    ) => {

        setPage(newPage);

    };


    const handleChangeRowsPerPage = (
        event
    ) => {

        setRowsPerPage(
            parseInt(
                event.target.value,
                10
            )
        );

        setPage(0);

    };


    // =========================================================
    // SELECT / DESELECT ALL
    // =========================================================

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const currentIds = paginatedApplications.map(app => app._id);
            setSelectedIds(currentIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (event, id) => {
        if (event.target.checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    };

    const isAllSelected = () => {
        if (paginatedApplications.length === 0) return false;
        return paginatedApplications.every(app => selectedIds.includes(app._id));
    };

    const isSomeSelected = () => {
        return selectedIds.length > 0 && selectedIds.length < paginatedApplications.length;
    };


    // =========================================================
    // BULK DELETE
    // =========================================================

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setBulkDeleteDialogOpen(true);
    };

    const confirmBulkDelete = async () => {
        setBulkDeleting(true);
        try {
            for (const id of selectedIds) {
                await api.delete(`/applications/${id}`);
            }
            setSelectedIds([]);
            setBulkDeleteDialogOpen(false);
            fetchApplications();
        } catch (err) {
            console.error('Error during bulk delete:', err);
            setError('Failed to delete some applications. Please try again.');
        } finally {
            setBulkDeleting(false);
        }
    };


    // =========================================================
    // MODAL
    // =========================================================

    const handleOpenAdd = () => {

        setEditingApplication(null);

        setFormData({
            ...emptyForm,
            appliedDate:
                new Date()
                    .toISOString()
                    .split('T')[0],
        });

        setModalOpen(true);

    };


    const handleOpenEdit = (
        application
    ) => {

        setEditingApplication(
            application
        );

        setFormData({

            company:
                application.company || '',

            position:
                application.position || '',

            status:
                application.status ||
                'Applied',

            location:
                application.location || '',

            jobType:
                application.jobType ||
                'Full-time',

            source:
                application.source ||
                'Manual',

            appliedDate:
                application.appliedDate
                    ? new Date(
                        application.appliedDate
                    )
                        .toISOString()
                        .split('T')[0]
                    : '',

            notes:
                Array.isArray(
                    application.notes
                )
                    ? application.notes.join(
                        '\n'
                    )
                    : application.notes || '',

        });

        setModalOpen(true);

    };


    const handleCloseModal = () => {

        if (saving) return;

        setModalOpen(false);

        setEditingApplication(null);

        setFormData(emptyForm);

    };

    // Form
    const emptyForm = {
        company: '',
        position: '',
        status: 'Applied',
        location: '',
        jobType: 'Full-time',
        source: 'Manual',
        appliedDate: '',
        notes: '',
    };

    const [formData, setFormData] = useState(emptyForm);


    // =========================================================
    // FORM
    // =========================================================

    const handleFormChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setFormData(
            (current) => ({
                ...current,
                [name]: value,
            })
        );

    };


    // =========================================================
    // SAVE APPLICATION
    // =========================================================

    const handleSave = async () => {

        if (
            !formData.company.trim() ||
            !formData.position.trim()
        ) {

            setError(
                'Company and position are required.'
            );

            return;

        }


        try {

            setSaving(true);

            setError('');


            const payload = {

                company:
                    formData.company.trim(),

                position:
                    formData.position.trim(),

                status:
                    formData.status,

                location:
                    formData.location.trim(),

                jobType:
                    formData.jobType,

                source:
                    formData.source,

                appliedDate:
                    formData.appliedDate
                        ? new Date(
                            formData.appliedDate
                        ).toISOString()
                        : new Date().toISOString(),

                notes:
                    formData.notes
                        ? [
                            formData.notes.trim(),
                        ]
                        : [],

            };


            let response;


            // -------------------------
            // Edit
            // -------------------------

            if (editingApplication) {

                response =
                    await api.put(
                        `/applications/${editingApplication._id}`,
                        payload
                    );

            }


            // -------------------------
            // Add
            // -------------------------

            else {

                response =
                    await api.post(
                        '/applications',
                        payload
                    );

            }


            const savedApplication =
                response.data.application ||
                response.data;


            console.log(
                'Application saved:',
                savedApplication
            );


            // Update local state
            if (editingApplication) {

                setApplications(
                    (current) =>
                        current.map(
                            (app) =>
                                app._id ===
                                    editingApplication._id
                                    ? savedApplication
                                    : app
                        )
                );

            } else {

                setApplications(
                    (current) => [
                        savedApplication,
                        ...current,
                    ]
                );

            }


            handleCloseModal();

        } catch (err) {

            console.error(
                'Error saving application:',
                err
            );

            setError(
                err.response?.data?.message ||
                'Unable to save the application. Please try again.'
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleOpenDelete = (
        application
    ) => {

        setApplicationToDelete(
            application
        );

        setDeleteDialogOpen(true);

    };


    const handleCloseDelete = () => {

        setDeleteDialogOpen(false);

        setApplicationToDelete(null);

    };


    const handleDelete = async () => {

        if (!applicationToDelete)
            return;


        try {

            await api.delete(
                `/applications/${applicationToDelete._id}`
            );


            setApplications(
                (current) =>
                    current.filter(
                        (app) =>
                            app._id !==
                            applicationToDelete._id
                    )
            );


            handleCloseDelete();

        } catch (err) {

            console.error(
                'Error deleting application:',
                err
            );

            setError(
                err.response?.data?.message ||
                'Unable to delete the application.'
            );

        }

    };


    // =========================================================
    // STATUS COLORS
    // =========================================================

    const getStatusColor = (status) => {
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
                return 'success';      // Green (fixed!)
            case 'Rejected':
                return 'error';        // Red
            case 'Withdrawn':
                return 'error';        // Red
            default:
                return 'default';
        }
    };


    // =========================================================
    // DATE
    // =========================================================

    const formatDate = (
        date
    ) => {

        if (!date)
            return '—';

        return new Date(
            date
        ).toLocaleDateString(
            'en-MY',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }
        );

    };


    // =========================================================
    // SORTABLE HEADER
    // =========================================================

    const SortableHeader = ({
        label,
        sortKey,
    }) => {

        const isActive =
            sortConfig.key ===
            sortKey;


        const indicator =
            !isActive
                ? '↕'
                : sortConfig.direction ===
                    'asc'
                    ? '↑'
                    : '↓';


        return (

            <TableCell
                onClick={() =>
                    handleSort(
                        sortKey
                    )
                }
                sx={{
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontWeight: 700,
                    whiteSpace:
                        'nowrap',

                    color:
                        isActive
                            ? 'primary.main'
                            : 'text.primary',

                    '&:hover': {
                        backgroundColor:
                            darkMode
                                ? '#292929'
                                : '#f0f0f0',
                    },
                }}
            >

                <Box
                    sx={{
                        display:
                            'flex',
                        alignItems:
                            'center',
                        gap: 0.75,
                    }}
                >

                    <span>
                        {label}
                    </span>

                    <Box
                        component="span"
                        sx={{
                            fontSize:
                                '13px',

                            opacity:
                                isActive
                                    ? 1
                                    : 0.35,

                            fontWeight:
                                700,
                        }}
                    >
                        {indicator}
                    </Box>

                </Box>

            </TableCell>

        );

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Box
            sx={{
                width: '100%',
                height: '100%',
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
                    alignItems:
                        'center',
                    mb: 2,
                    gap: 2,
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            letterSpacing:
                                '-0.3px',
                        }}
                    >
                        Applications
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Manage and track
                        your job
                        applications.
                    </Typography>

                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {/* Bulk Actions */}
                    {selectedIds.length > 0 && (
                        <>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setBulkStatusDialogOpen(true)}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    borderColor: '#0A84FF',
                                    color: '#0A84FF',
                                }}
                            >
                                Update Status ({selectedIds.length})
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteSweep />}
                                onClick={handleBulkDelete}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                }}
                            >
                                Delete Selected ({selectedIds.length})
                            </Button>
                        </>
                    )}

                    <Button
                        variant="outlined"
                        startIcon={<SyncIcon />}
                        onClick={() => setShowSyncDialog(true)}
                        sx={{
                            color: '#4CAF50',
                            borderColor: '#4CAF50',
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: '#43A047',
                                backgroundColor: 'rgba(76, 175, 80, 0.08)'
                            }
                        }}
                    >
                        Sync Gmail
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={
                            handleOpenAdd
                        }
                        sx={{
                            textTransform:
                                'none',
                            fontWeight: 600,
                            borderRadius:
                                '8px',
                        }}
                    >
                        Add Application
                    </Button>
                </Box>

            </Box>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    onClose={() =>
                        setError('')
                    }
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <Paper
                sx={{
                    mb: 1,
                    p: 1.5,

                    borderRadius:
                        '10px',

                    border:
                        darkMode
                            ? '1px solid #303030'
                            : '1px solid #e2e2e2',

                    backgroundImage:
                        'none',
                }}
            >

                <Box
                    sx={{
                        display:
                            'flex',
                        alignItems:
                            'center',
                        gap: 1.5,
                        flexWrap:
                            'wrap',
                    }}
                >

                    {/* Selected count */}
                    {selectedIds.length > 0 && (
                        <Chip
                            label={`${selectedIds.length} selected`}
                            size="small"
                            color="primary"
                            onDelete={() => setSelectedIds([])}
                        />
                    )}

                    {/* Search */}

                    <TextField
                        size="small"
                        placeholder="Search applications..."
                        value={
                            searchTerm
                        }
                        onChange={(
                            event
                        ) => {

                            setSearchTerm(
                                event.target
                                    .value
                            );

                            setPage(0);

                        }}
                        InputProps={{
                            startAdornment:
                                <Search
                                    sx={{
                                        mr: 1,
                                        color:
                                            'text.secondary',
                                    }}
                                />,
                        }}
                        sx={{
                            minWidth:
                                260,

                            '& .MuiOutlinedInput-root':
                            {
                                borderRadius:
                                    '7px',
                            },
                        }}
                    />


                    {/* Status */}

                    <FormControl
                        size="small"
                        sx={{
                            minWidth:
                                150,
                        }}
                    >

                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select
                            value={
                                statusFilter
                            }
                            label="Status"
                            onChange={(
                                event
                            ) => {

                                setStatusFilter(
                                    event.target
                                        .value
                                );

                                setPage(0);

                            }}
                        >

                            <MenuItem value="All">
                                All
                            </MenuItem>

                            <MenuItem value="Applied">
                                Applied
                            </MenuItem>

                            <MenuItem value="Screening">
                                Screening
                            </MenuItem>

                            <MenuItem value="Interview">
                                Interview
                            </MenuItem>

                            <MenuItem value="Offer">
                                Offer
                            </MenuItem>

                            <MenuItem value="Rejected">
                                Rejected
                            </MenuItem>

                            <MenuItem value="Withdrawn">
                                Withdrawn
                            </MenuItem>

                        </Select>

                    </FormControl>


                    {/* Refresh */}

                    <Tooltip title="Refresh">

                        <IconButton
                            onClick={
                                fetchApplications
                            }
                            disabled={
                                loading
                            }
                        >

                            <Refresh />

                        </IconButton>

                    </Tooltip>


                    {/* Results */}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            ml: 'auto',
                        }}
                    >
                        {filteredApplications.length}{' '}
                        application
                        {filteredApplications.length !==
                            1
                            ? 's'
                            : ''}
                    </Typography>

                </Box>

            </Paper>


            {/* =================================================
                TABLE
            ================================================= */}

            <Paper
                sx={{
                    borderRadius:
                        '10px',
                    overflow:
                        'hidden',
                    border:
                        darkMode
                            ? '1px solid #303030'
                            : '1px solid #e2e2e2',
                    backgroundImage:
                        'none',
                }}
            >

                <TableContainer
                    sx={{
                        maxHeight:
                            'calc(100vh - 245px)',

                        overflowX:
                            'auto',
                    }}
                >

                    <Table
                        stickyHeader
                        size="small"
                        sx={{
                            minWidth:
                                1100,

                            '& .MuiTableCell-root':
                            {
                                borderColor:
                                    darkMode
                                        ? '#303030'
                                        : '#e5e5e5',
                            },
                        }}
                    >

                        {/* HEADER */}

                        <TableHead>

                            <TableRow>

                                {/* Checkbox Column */}
                                <TableCell
                                    padding="checkbox"
                                    sx={{
                                        bgcolor: darkMode ? '#2d2d2d' : '#f5f5f5',
                                    }}
                                >
                                    <Checkbox
                                        indeterminate={isSomeSelected()}
                                        checked={isAllSelected()}
                                        onChange={handleSelectAll}
                                        size="small"
                                        sx={{
                                            color: darkMode ? '#666' : '#999',
                                        }}
                                    />
                                </TableCell>

                                <SortableHeader
                                    label="Company"
                                    sortKey="company"
                                />

                                <SortableHeader
                                    label="Position"
                                    sortKey="position"
                                />

                                <SortableHeader
                                    label="Status"
                                    sortKey="status"
                                />

                                <SortableHeader
                                    label="Location"
                                    sortKey="location"
                                />

                                <SortableHeader
                                    label="Job Type"
                                    sortKey="jobType"
                                />

                                <SortableHeader
                                    label="Source"
                                    sortKey="source"
                                />

                                <SortableHeader
                                    label="Applied"
                                    sortKey="appliedDate"
                                />

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                        bgcolor: darkMode ? '#2d2d2d' : '#f5f5f5',
                                    }}
                                >
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        {/* BODY */}

                        <TableBody>

                            {loading ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={9}
                                        align="center"
                                        sx={{
                                            py: 8,
                                        }}
                                    >

                                        <CircularProgress />

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 2,
                                            }}
                                        >
                                            Loading
                                            applications...
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : paginatedApplications.length ===
                                0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={9}
                                        align="center"
                                        sx={{
                                            py: 8,
                                        }}
                                    >

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                mb: 1,
                                            }}
                                        >
                                            No applications
                                            found
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Try changing
                                            your search
                                            or filters.
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                paginatedApplications.map(
                                    (application) => (
                                        <TableRow
                                            key={application._id}
                                            hover
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor:
                                                        darkMode
                                                            ? '#252525 !important'
                                                            : '#fafafa !important',
                                                },
                                            }}
                                        >

                                            {/* Checkbox */}
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedIds.includes(application._id)}
                                                    onChange={(event) => handleSelectOne(event, application._id)}
                                                    size="small"
                                                    sx={{
                                                        color: darkMode ? '#666' : '#999',
                                                    }}
                                                />
                                            </TableCell>

                                            {/* Company */}

                                            <TableCell
                                                sx={{
                                                    fontWeight: 600,
                                                    minWidth: 150,
                                                }}
                                            >
                                                {application.company}
                                            </TableCell>


                                            {/* Position */}

                                            <TableCell
                                                sx={{
                                                    minWidth: 190,
                                                }}
                                            >
                                                {application.position}
                                            </TableCell>


                                            {/* Status */}

                                            <TableCell>

                                                <Chip
                                                    label={application.status || 'Unknown'}
                                                    color={getStatusColor(application.status)}
                                                    size="small"
                                                    variant={darkMode ? 'outlined' : 'filled'}
                                                />

                                            </TableCell>


                                            {/* Location */}

                                            <TableCell>
                                                {application.location || '—'}
                                            </TableCell>


                                            {/* Job Type */}

                                            <TableCell>
                                                {application.jobType || '—'}
                                            </TableCell>


                                            {/* Source */}

                                            <TableCell>
                                                {application.source || '—'}
                                            </TableCell>


                                            {/* Date */}

                                            <TableCell
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {formatDate(application.appliedDate || application.createdAt)}
                                            </TableCell>


                                            {/* Actions */}

                                            <TableCell>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                    }}
                                                >

                                                    {/* =========================================================
            ROW 1: TIMELINE (Separated, on top)
        ========================================================= */}

                                                    <Tooltip title="View Timeline">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenTimeline(application)}
                                                            sx={{
                                                                color: darkMode ? '#0A84FF' : '#0A84FF',
                                                                padding: '4px',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(10, 132, 255, 0.08)',
                                                                },
                                                            }}
                                                        >
                                                            <TimelineIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>


                                                    {/* =========================================================
            ROW 2: EDIT & DELETE (Grouped together)
        ========================================================= */}

                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            gap: 0.5,
                                                            alignItems: 'center',
                                                        }}
                                                    >

                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenEdit(application)}
                                                                sx={{
                                                                    color: darkMode ? '#aaa' : '#666',
                                                                    padding: '4px',
                                                                }}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleOpenDelete(application)}
                                                                sx={{ padding: '4px' }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>

                                                    </Box>

                                                </Box>

                                            </TableCell>

                                        </TableRow>
                                    )
                                )

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>


                {/* PAGINATION */}

                <TablePagination
                    component="div"
                    count={filteredApplications.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />

            </Paper>


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                fullWidth
                maxWidth="md"
            >

                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >

                    {editingApplication ? 'Edit Application' : 'Add Application'}

                    <IconButton
                        onClick={handleCloseModal}
                        disabled={saving}
                    >
                        <Close />
                    </IconButton>

                </DialogTitle>


                <DialogContent dividers>

                    <Grid container spacing={2} sx={{ pt: 1 }}>

                        {/* Company */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                label="Company"
                                name="company"
                                value={formData.company}
                                onChange={handleFormChange}
                            />

                        </Grid>


                        {/* Position */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                label="Position"
                                name="position"
                                value={formData.position}
                                onChange={handleFormChange}
                            />

                        </Grid>


                        {/* Status */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleFormChange}
                            >

                                <MenuItem value="Applied">Applied</MenuItem>
                                <MenuItem value="Screening">Screening</MenuItem>
                                <MenuItem value="Interview">Interview</MenuItem>
                                <MenuItem value="Offer">Offer</MenuItem>
                                <MenuItem value="Rejected">Rejected</MenuItem>
                                <MenuItem value="Withdrawn">Withdrawn</MenuItem>

                            </TextField>

                        </Grid>


                        {/* Location */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleFormChange}
                            />

                        </Grid>


                        {/* Job Type */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                select
                                label="Job Type"
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleFormChange}
                            >

                                <MenuItem value="Full-time">Full-time</MenuItem>
                                <MenuItem value="Part-time">Part-time</MenuItem>
                                <MenuItem value="Contract">Contract</MenuItem>
                                <MenuItem value="Internship">Internship</MenuItem>
                                <MenuItem value="Freelance">Freelance</MenuItem>

                            </TextField>

                        </Grid>


                        {/* Source */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                select
                                label="Source"
                                name="source"
                                value={formData.source}
                                onChange={handleFormChange}
                            >

                                <MenuItem value="Manual">Manual</MenuItem>
                                <MenuItem value="Email">Email</MenuItem>
                                <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                                <MenuItem value="Indeed">Indeed</MenuItem>
                                <MenuItem value="JobStreet">JobStreet</MenuItem>
                                <MenuItem value="Company Website">Company Website</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>

                            </TextField>

                        </Grid>


                        {/* Applied Date */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                type="date"
                                label="Applied Date"
                                name="appliedDate"
                                value={formData.appliedDate}
                                onChange={handleFormChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        </Grid>


                        {/* Notes */}

                        <Grid item xs={12}>

                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleFormChange}
                            />

                        </Grid>

                    </Grid>

                </DialogContent>


                <DialogActions sx={{ px: 3, py: 2 }}>

                    <Button
                        onClick={handleCloseModal}
                        disabled={saving}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        sx={{
                            textTransform: 'none',
                            minWidth: 120,
                        }}
                    >

                        {saving ? (
                            <CircularProgress size={22} color="inherit" />
                        ) : (
                            editingApplication ? 'Save Changes' : 'Add Application'
                        )}

                    </Button>

                </DialogActions>

            </Dialog>


            {/* =================================================
                SYNC GMAIL DIALOG
            ================================================= */}

            <Dialog
                open={showSyncDialog}
                onClose={() => setShowSyncDialog(false)}
                PaperProps={{
                    sx: {
                        bgcolor: darkMode ? '#2d2d2d' : '#ffffff',
                        color: darkMode ? '#e0e0e0' : '#333',
                        borderRadius: '12px',
                        minWidth: 450
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Sync Gmail
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 3, color: darkMode ? '#aaa' : '#666' }}>
                        Import job applications from your Gmail. Only emails after the selected date will be imported.
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Start Date
                        </Typography>
                        <TextField
                            fullWidth
                            type="date"
                            value={syncStartDate}
                            onChange={(e) => setSyncStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: darkMode ? '#1a1a1a' : '#f5f5f5'
                                }
                            }}
                        />
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: darkMode ? '#888' : '#999' }}>
                            Select the date you started your job search
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 2, p: 2, bgcolor: darkMode ? '#1a1a1a' : '#f5f5f5', borderRadius: '8px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            What will happen:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            • Scan your Gmail for job application emails
                            <br />
                            • Extract company name, position, and status
                            <br />
                            • Auto-create applications in your tracker
                            <br />
                            • Update existing applications if found
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={() => setShowSyncDialog(false)}
                        disabled={syncing}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSyncGmail}
                        disabled={syncing || !syncStartDate}
                        sx={{
                            bgcolor: '#4CAF50',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#43A047' }
                        }}
                    >
                        {syncing ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} color="inherit" />
                                Syncing...
                            </Box>
                        ) : (
                            'Start Sync'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>


            {/* =================================================
                SYNC PROGRESS DIALOG (Calming Messages)
            ================================================= */}

            <Dialog
                open={syncProgress.isSyncing}
                PaperProps={{
                    sx: {
                        bgcolor: darkMode ? '#2d2d2d' : '#ffffff',
                        color: darkMode ? '#e0e0e0' : '#333',
                        borderRadius: '16px',
                        minWidth: 450,
                        maxWidth: 500,
                        p: 3,
                    }
                }}
            >
                <DialogContent>
                    <Box sx={{ textAlign: 'center' }}>

                        {/* Spinner */}
                        <Box sx={{ mb: 3 }}>
                            <CircularProgress
                                size={60}
                                thickness={4}
                                sx={{
                                    color: '#4CAF50',
                                }}
                            />
                        </Box>

                        {/* Title */}
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            Syncing Your Gmail
                        </Typography>

                        {/* Subtitle - Current Step */}
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {syncProgress.currentStep || 'Connecting to Gmail...'}
                        </Typography>

                        {/* Progress Bar */}
                        <Box sx={{ width: '100%', mb: 3 }}>
                            <Box sx={{
                                width: '100%',
                                height: 6,
                                bgcolor: darkMode ? '#3a3a3a' : '#e0e0e0',
                                borderRadius: 3,
                                overflow: 'hidden'
                            }}>
                                <Box sx={{
                                    width: `${syncProgress.total > 0 ? (syncProgress.processed / syncProgress.total) * 100 : 0}%`,
                                    height: '100%',
                                    bgcolor: '#4CAF50',
                                    borderRadius: 3,
                                    transition: 'width 0.5s ease'
                                }} />
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 1,
                                fontSize: 12,
                                color: 'text.secondary'
                            }}>
                                <span>{syncProgress.processed} processed</span>
                                <span>{syncProgress.total} total</span>
                            </Box>
                        </Box>

                        {/* Calming Message */}
                        <Box sx={{
                            p: 2,
                            bgcolor: darkMode ? '#1a1a1a' : '#f5f5f5',
                            borderRadius: '8px',
                            mb: 2
                        }}>
                            <Typography variant="body2" sx={{
                                fontStyle: 'italic',
                                color: darkMode ? '#aaa' : '#666'
                            }}>
                                {syncProgress.message || 'Working on your applications...'}
                            </Typography>
                        </Box>

                        {/* Current Email (if available) */}
                        {syncProgress.currentEmail && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Processing: {syncProgress.currentEmail}
                            </Typography>
                        )}

                        {/* Cancel Button */}
                        {syncProgress.processed < 100 && (
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => {
                                    if (window.confirm('Stop syncing? This will cancel the current sync.')) {
                                        setSyncProgress({
                                            isSyncing: false,
                                            currentStep: '',
                                            processed: 0,
                                            total: 0,
                                            currentEmail: '',
                                            message: ''
                                        });
                                        setSyncing(false);
                                    }
                                }}
                                sx={{ mt: 2, textTransform: 'none' }}
                            >
                                Cancel Sync
                            </Button>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>


            {/* =================================================
                BULK STATUS UPDATE DIALOG
            ================================================= */}

            <Dialog
                open={bulkStatusDialogOpen}
                onClose={() => setBulkStatusDialogOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: darkMode ? '#2d2d2d' : '#ffffff',
                        color: darkMode ? '#e0e0e0' : '#333',
                        borderRadius: '12px',
                        minWidth: 400
                    }
                }}
            >
                <DialogTitle>
                    Update Status for {selectedIds.length} Applications
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: darkMode ? '#aaa' : '#666' }}>
                        Select the new status for all selected applications.
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={bulkStatus}
                            onChange={(e) => setBulkStatus(e.target.value)}
                            label="Status"
                            sx={{ bgcolor: darkMode ? '#1a1a1a' : '#f5f5f5' }}
                        >
                            <MenuItem value="Applied">Applied</MenuItem>
                            <MenuItem value="Screening">Screening</MenuItem>
                            <MenuItem value="Interview">Interview</MenuItem>
                            <MenuItem value="Offer">Offer</MenuItem>
                            <MenuItem value="Accepted">Accepted</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                            <MenuItem value="Withdrawn">Withdrawn</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBulkStatusDialogOpen(false)} disabled={bulkDeleting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleBulkStatusUpdate}
                        variant="contained"
                        disabled={bulkDeleting}
                        sx={{ bgcolor: '#0A84FF' }}
                    >
                        {bulkDeleting ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} color="inherit" />
                                Updating...
                            </Box>
                        ) : (
                            'Update Status'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>


            {/* =================================================
                TIMELINE DIALOG
            ================================================= */}

            <Dialog
                open={timelineOpen}
                onClose={() => setTimelineOpen(false)}
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
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: darkMode ? '#F5F5F7' : '#1C1C1E' }}>
                            Application Timeline
                        </Typography>
                        {selectedApplication && (
                            <Typography variant="body2" sx={{ color: '#98989D' }}>
                                {selectedApplication.company} - {selectedApplication.position}
                            </Typography>
                        )}
                    </Box>
                    <IconButton onClick={() => setTimelineOpen(false)}>
                        <Close sx={{ color: darkMode ? '#98989D' : '#666' }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {timelineLoading ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <CircularProgress />
                            <Typography sx={{ mt: 2, color: '#98989D' }}>
                                Loading timeline...
                            </Typography>
                        </Box>
                    ) : timelineData.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', py: 4, color: '#98989D' }}>
                            No timeline events yet.
                        </Typography>
                    ) : (
                        <Box>
                            {timelineData.map((event, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        py: 2,
                                        borderBottom: index < timelineData.length - 1 ? `1px solid ${darkMode ? '#3A3A3C' : '#E5E5EA'}` : 'none',
                                    }}
                                >
                                    <Box sx={{ minWidth: 120, mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: '#98989D' }}>
                                            {new Date(event.date).toLocaleDateString('en-MY', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        {event.type === 'status_change' ? (
                                            <>
                                                <Typography variant="body2" sx={{ color: darkMode ? '#F5F5F7' : '#1C1C1E', fontWeight: 500 }}>
                                                    Status changed to <Chip
                                                        label={event.status}
                                                        size="small"
                                                        color={getStatusColor(event.status)}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Typography>
                                                {event.note && (
                                                    <Typography variant="caption" sx={{ color: '#98989D', display: 'block', mt: 0.5 }}>
                                                        {event.note}
                                                    </Typography>
                                                )}
                                            </>
                                        ) : event.type === 'interview' ? (
                                            <>
                                                <Typography variant="body2" sx={{ color: darkMode ? '#F5F5F7' : '#1C1C1E', fontWeight: 500 }}>
                                                    Interview: {event.interviewType || 'General'}
                                                </Typography>
                                                {event.notes && (
                                                    <Typography variant="caption" sx={{ color: '#98989D', display: 'block', mt: 0.5 }}>
                                                        {event.notes}
                                                    </Typography>
                                                )}
                                                {event.outcome && (
                                                    <Chip
                                                        label={event.outcome}
                                                        size="small"
                                                        sx={{
                                                            mt: 1,
                                                            bgcolor: event.outcome === 'Passed' ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 69, 58, 0.2)',
                                                            color: event.outcome === 'Passed' ? '#30D158' : '#FF453A',
                                                        }}
                                                    />
                                                )}
                                            </>
                                        ) : null}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>


            {/* =================================================
                DELETE DIALOG (Single)
            ================================================= */}

            <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>

                <DialogTitle>
                    Delete Application?
                </DialogTitle>

                <DialogContent>

                    <Typography>
                        Are you sure you want to delete{' '}
                        <strong>
                            {applicationToDelete?.company}
                        </strong>{' '}
                        —{' '}
                        {applicationToDelete?.position}
                        ?
                    </Typography>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={handleCloseDelete}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        sx={{ textTransform: 'none' }}
                    >
                        Delete
                    </Button>

                </DialogActions>

            </Dialog>


            {/* =================================================
                BULK DELETE DIALOG
            ================================================= */}

            <Dialog
                open={bulkDeleteDialogOpen}
                onClose={() => setBulkDeleteDialogOpen(false)}
            >

                <DialogTitle>
                    Delete Selected Applications?
                </DialogTitle>

                <DialogContent>

                    <Typography>
                        Are you sure you want to delete <strong>{selectedIds.length}</strong> selected applications?
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This action cannot be undone.
                    </Typography>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() => setBulkDeleteDialogOpen(false)}
                        disabled={bulkDeleting}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmBulkDelete}
                        disabled={bulkDeleting}
                        sx={{ textTransform: 'none' }}
                    >
                        {bulkDeleting ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} color="inherit" />
                                Deleting...
                            </Box>
                        ) : (
                            `Delete ${selectedIds.length} Applications`
                        )}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    );

};

export default ApplicationGrid;