const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// ============================================================
// ⚠️ IMPORTANT: STATIC ROUTES MUST COME BEFORE /:id
// ============================================================

// STATS & ANALYTICS
router.get('/analytics', applicationController.getAnalytics);
router.get('/stats', applicationController.getStats);

// BULK OPERATIONS
router.post('/bulk-status', applicationController.bulkUpdateStatus);

// GMAIL SYNC
router.post('/sync-gmail', applicationController.syncGmail);

// ============================================================
// APPLICATION CRUD (DYNAMIC ROUTES - COME LAST)
// ============================================================
router.get('/', applicationController.getApplications);
router.get('/:id', applicationController.getApplication);
router.post('/', applicationController.createApplication);
router.put('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

// NOTES & INTERVIEWS
router.post('/:id/notes', applicationController.addNote);
router.post('/:id/interviews', applicationController.addInterview);
router.put('/:id/interviews/:interviewId', applicationController.updateInterviewOutcome);

// ARCHIVE
router.put('/:id/archive', applicationController.archiveApplication);
router.put('/:id/unarchive', applicationController.unarchiveApplication);

// TIMELINE & HISTORY
router.get('/:id/history', applicationController.getStatusHistory);
router.get('/:id/timeline', applicationController.getTimeline);

module.exports = router;