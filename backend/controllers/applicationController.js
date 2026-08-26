const Application = require('../models/Application');
const gmailService = require('../services/gmailService');

// ============================================================
// GET ALL APPLICATIONS
// ============================================================
exports.getApplications = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const query = { userId: req.userId, isArchived: false };

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { company: { $regex: search, $options: 'i' } },
                { position: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const applications = await Application.find(query)
            .sort({ appliedDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Application.countDocuments(query);

        res.json({
            applications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// GET SINGLE APPLICATION
// ============================================================
exports.getApplication = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// CREATE APPLICATION
// ============================================================
exports.createApplication = async (req, res) => {
    try {
        const applicationData = {
            ...req.body,
            userId: req.userId
        };

        const application = new Application(applicationData);
        await application.save();

        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ============================================================
// UPDATE APPLICATION
// ============================================================
exports.updateApplication = async (req, res) => {
    try {
        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { ...req.body, lastUpdated: new Date() },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ============================================================
// DELETE APPLICATION
// ============================================================
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// ADD NOTE
// ============================================================
exports.addNote = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Note content is required' });
        }

        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        application.notes.push({ content });
        application.lastUpdated = new Date();
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ============================================================
// ADD INTERVIEW
// ============================================================
exports.addInterview = async (req, res) => {
    try {
        const { date, type, notes, interviewer } = req.body;

        if (!date || !type) {
            return res.status(400).json({ error: 'Date and type are required' });
        }

        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        application.interviews.push({
            date: new Date(date),
            type,
            notes,
            interviewer,
            outcome: 'Scheduled'
        });

        application.status = 'Interview';
        application.lastUpdated = new Date();
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ============================================================
// UPDATE INTERVIEW OUTCOME
// ============================================================
exports.updateInterviewOutcome = async (req, res) => {
    try {
        const { interviewId, outcome } = req.body;

        if (!interviewId || !outcome) {
            return res.status(400).json({ error: 'Interview ID and outcome are required' });
        }

        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        const interview = application.interviews.id(interviewId);
        if (!interview) {
            return res.status(404).json({ error: 'Interview not found' });
        }

        interview.outcome = outcome;

        // If interview was successful, update status
        if (outcome === 'Accepted' || outcome === 'Offer') {
            application.status = 'Offer';
        } else if (outcome === 'Rejected') {
            application.status = 'Rejected';
        }

        application.lastUpdated = new Date();
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ============================================================
// GET APPLICATION STATS
// ============================================================
exports.getStats = async (req, res) => {
    try {
        const stats = await Application.aggregate([
            { $match: { userId: req.userId, isArchived: false } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await Application.countDocuments({
            userId: req.userId,
            isArchived: false
        });

        const recent = await Application.find({
            userId: req.userId,
            isArchived: false
        })
            .sort({ appliedDate: -1 })
            .limit(5);

        const statsObject = stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.json({
            stats: statsObject,
            total,
            recent
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// SYNC GMAIL
// ============================================================
exports.syncGmail = async (req, res) => {
    try {
        const userId = req.userId;
        const { startDate, override } = req.body;  // ← Get override flag

        console.log(`Syncing Gmail for user: ${userId}`);
        console.log(`Start date: ${startDate || '30 days ago'}`);
        console.log(`Override: ${override || false}`);

        const User = require('../models/User');
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.accessToken) {
            return res.status(400).json({
                success: false,
                message: 'User does not have Gmail access. Please login with Google again.'
            });
        }

        // ✅ Pass the override flag to gmailService
        const result = await gmailService.syncEmails(userId, startDate, override);

        console.log(`✅ Gmail sync completed:`, result);

        res.json({
            success: true,
            message: result.message || 'Gmail sync completed',
            synced: result.synced || 0,
            updated: result.updated || 0,
            total: result.total || 0,
            startDate: result.startDate || null,
            override: result.override || false
        });

    } catch (error) {
        console.error('❌ Gmail sync error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to sync Gmail',
            error: error.message
        });
    }
};

// ============================================================
// BULK UPDATE STATUS
// ============================================================
exports.bulkUpdateStatus = async (req, res) => {
    try {
        const { applicationIds, status } = req.body;

        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({ error: 'Application IDs are required' });
        }

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const result = await Application.updateMany(
            {
                _id: { $in: applicationIds },
                userId: req.userId
            },
            {
                status,
                lastUpdated: new Date()
            }
        );

        res.json({
            message: `${result.modifiedCount} applications updated`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ============================================================
// ARCHIVE APPLICATION
// ============================================================
exports.archiveApplication = async (req, res) => {
    try {
        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { isArchived: true, lastUpdated: new Date() },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json({
            message: 'Application archived successfully',
            application
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// UNARCHIVE APPLICATION
// ============================================================
exports.unarchiveApplication = async (req, res) => {
    try {
        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { isArchived: false, lastUpdated: new Date() },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json({
            message: 'Application unarchived successfully',
            application
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// GET APPLICATION STATUS HISTORY
// ============================================================
exports.getStatusHistory = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json({
            statusHistory: application.statusHistory || [],
            followUpEmails: application.followUpEmails || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// GET APPLICATION TIMELINE
// ============================================================
exports.getTimeline = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Combine status history and interviews into a timeline
        const timeline = [];

        // Add status changes
        if (application.statusHistory && application.statusHistory.length > 0) {
            for (const entry of application.statusHistory) {
                timeline.push({
                    type: 'status_change',
                    date: entry.date,
                    status: entry.status,
                    source: entry.source || 'Manual',
                    note: entry.note || ''
                });
            }
        }

        // Add interviews
        if (application.interviews && application.interviews.length > 0) {
            for (const interview of application.interviews) {
                timeline.push({
                    type: 'interview',
                    date: interview.date,
                    interviewType: interview.type || 'General',
                    notes: interview.notes || '',
                    outcome: interview.outcome || 'Scheduled'
                });
            }
        }

        // Sort by date (newest first)
        timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ timeline });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// GET ANALYTICS DATA - SIMPLE & WORKING
// ============================================================
exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.userId;

        console.log(`📊 Analytics requested for user: ${userId}`);

        // Get ALL applications for this user
        const applications = await Application.find({
            userId: userId,
            isArchived: false
        });

        console.log(`📊 Found ${applications.length} applications`);

        // =========================================================
        // BUILD STATUS COUNTS
        // =========================================================
        const statusCounts = {
            Applied: 0,
            Screening: 0,
            Interview: 0,
            Offer: 0,
            Accepted: 0,
            Rejected: 0,
            Withdrawn: 0
        };

        applications.forEach(app => {
            const status = app.status || 'Applied';
            if (statusCounts.hasOwnProperty(status)) {
                statusCounts[status]++;
            } else {
                // Handle unknown statuses
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            }
        });

        // =========================================================
        // STATUS DISTRIBUTION (for pie chart)
        // =========================================================
        const statusDistribution = Object.keys(statusCounts)
            .filter(key => statusCounts[key] > 0)
            .map(key => ({
                name: key,
                count: statusCounts[key]
            }));

        // =========================================================
        // MONTHLY TREND (Last 6 months)
        // =========================================================
        const months = {};
        const now = new Date();
        for (let i = 0; i < 6; i++) {
            const d = new Date(now);
            d.setMonth(d.getMonth() - i);
            const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
            months[key] = 0;
        }

        applications.forEach(app => {
            if (app.appliedDate) {
                const date = new Date(app.appliedDate);
                const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                if (months[key] !== undefined) {
                    months[key]++;
                }
            }
        });

        const monthlyTrend = Object.keys(months).reverse().map(key => ({
            month: key,
            count: months[key]
        }));

        // =========================================================
        // WEEKLY TREND (Last 8 weeks)
        // =========================================================
        const weeks = {};
        const now2 = new Date();
        for (let i = 0; i < 8; i++) {
            const d = new Date(now2);
            d.setDate(d.getDate() - (i * 7));
            const weekStart = new Date(d);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const key = weekStart.toLocaleDateString('default', { month: 'short', day: 'numeric' });
            weeks[key] = 0;
        }

        applications.forEach(app => {
            if (app.appliedDate) {
                const date = new Date(app.appliedDate);
                const weekStart = new Date(date);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const key = weekStart.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                if (weeks[key] !== undefined) {
                    weeks[key]++;
                }
            }
        });

        const weeklyTrend = Object.keys(weeks).reverse().map(key => ({
            week: key,
            count: weeks[key]
        }));

        // =========================================================
        // CALCULATE RATES
        // =========================================================
        const total = applications.length;
        const interviews = applications.filter(app =>
            app.status === 'Interview' ||
            app.status === 'Offer' ||
            app.status === 'Accepted'
        ).length;
        const offers = applications.filter(app =>
            app.status === 'Offer' ||
            app.status === 'Accepted'
        ).length;
        const rejected = applications.filter(app =>
            app.status === 'Rejected' ||
            app.status === 'Withdrawn'
        ).length;

        // =========================================================
        // RESPONSE TIME
        // =========================================================
        let totalResponseTime = 0;
        let responseCount = 0;

        applications.forEach(app => {
            if (app.appliedDate && app.lastEmailDate) {
                try {
                    const diff = Math.abs(new Date(app.lastEmailDate) - new Date(app.appliedDate));
                    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                    if (days > 0 && days < 365) {
                        totalResponseTime += days;
                        responseCount++;
                    }
                } catch (e) {
                    // Skip if date parsing fails
                }
            }
        });

        const avgResponseTime = responseCount > 0 ? Math.round(totalResponseTime / responseCount) : 0;

        // =========================================================
        // BUILD RESPONSE
        // =========================================================
        const responseData = {
            statusDistribution: statusDistribution.length > 0 ? statusDistribution : [
                { name: 'No Data', count: 1 }
            ],
            monthlyTrend: monthlyTrend.length > 0 ? monthlyTrend : [
                { month: 'No Data', count: 0 }
            ],
            weeklyTrend: weeklyTrend.length > 0 ? weeklyTrend : [
                { week: 'No Data', count: 0 }
            ],
            totalApplications: total,
            interviewRate: {
                rate: total > 0 ? Math.round((interviews / total) * 100) : 0,
                offerRate: total > 0 ? Math.round((offers / total) * 100) : 0,
                rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0,
            },
            responseTime: {
                avg: avgResponseTime,
                hasData: responseCount > 0
            },
            statusCounts: statusCounts
        };

        console.log(`✅ Analytics response:`, {
            totalApplications: responseData.totalApplications,
            statusCounts: responseData.statusCounts
        });

        res.json(responseData);

    } catch (error) {
        console.error('❌ Analytics error:', error);
        // Send a safe fallback response instead of crashing
        res.status(200).json({
            statusDistribution: [{ name: 'No Data', count: 0 }],
            monthlyTrend: [{ month: 'No Data', count: 0 }],
            weeklyTrend: [{ week: 'No Data', count: 0 }],
            totalApplications: 0,
            interviewRate: { rate: 0, offerRate: 0, rejectionRate: 0 },
            responseTime: { avg: 0, hasData: false },
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
    }
};