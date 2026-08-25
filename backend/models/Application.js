const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn'],
        default: 'Applied'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    location: String,
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Freelance'],
        default: 'Full-time'
    },
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    jobDescription: String,
    companyWebsite: String,
    contactPerson: {
        name: String,
        email: String,
        phone: String,
        position: String
    },
    notes: [{
        content: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    interviews: [{
        date: Date,
        type: {
            type: String,
            enum: ['Phone', 'Video', 'On-site', 'Technical', 'HR', 'Final']
        },
        notes: String,
        interviewer: String,
        outcome: {
            type: String,
            enum: ['Pending', 'Passed', 'Failed', 'Scheduled', 'Cancelled']
        }
    }],
    documents: [{
        name: String,
        type: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    source: {
        type: String,
        enum: ['Email', 'LinkedIn', 'Indeed', 'Company Website', 'Referral', 'JobStreet', 'Manual', 'Other'],
        default: 'Manual'
    },
    emailThreadId: String,
    lastEmailDate: Date,

    // ============================================================
    // ✅ ENHANCEMENT: Status History
    // ============================================================
    statusHistory: [{
        status: {
            type: String,
            enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn']
        },
        date: {
            type: Date,
            default: Date.now
        },
        source: {
            type: String,
            enum: ['Email', 'Manual', 'AI', 'System'],
            default: 'Manual'
        },
        note: String
    }],

    // ============================================================
    // ✅ ENHANCEMENT: Follow-up Emails
    // ============================================================
    followUpEmails: [{
        subject: String,
        status: {
            type: String,
            enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn']
        },
        date: Date,
        from: String,
        emailId: String
    }],

    tags: [String],
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better performance
ApplicationSchema.index({ userId: 1, status: 1 });
ApplicationSchema.index({ userId: 1, company: 1 });
ApplicationSchema.index({ userId: 1, appliedDate: -1 });
ApplicationSchema.index({ userId: 1, emailThreadId: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);