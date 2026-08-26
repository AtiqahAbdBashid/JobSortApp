const { google } = require('googleapis');
const User = require('../models/User');
const Application = require('../models/Application');
const aiCleaner = require('./aiCleanerService');

class GmailService {

    // ============================================================
    // GET GMAIL CLIENT
    // ============================================================
    async getGmailClient(user) {
        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        auth.setCredentials({
            access_token: user.accessToken,
            refresh_token: user.refreshToken,
            expiry_date: user.tokenExpiry
        });

        if (Date.now() >= user.tokenExpiry) {
            try {
                const { credentials } = await auth.refreshAccessToken();
                user.accessToken = credentials.access_token;
                user.tokenExpiry = credentials.expiry_date;
                await user.save();
                auth.setCredentials(credentials);
            } catch (error) {
                console.error('Failed to refresh access token:', error);
                throw error;
            }
        }

        return auth;
    }

    // ============================================================
    // FETCH JOB APPLICATIONS FROM GMAIL - WITH AI
    // ============================================================
    async fetchJobApplications(user, startDate = null, endDate = null, maxResults = 50) {
        try {
            const auth = await this.getGmailClient(user);
            const gmail = google.gmail({ version: 'v1', auth });

            // Build date filter
            let dateFilter = '';
            if (startDate) {
                const formattedStart = new Date(startDate).toISOString().split('T')[0];
                dateFilter = `after:${formattedStart}`;
            }
            if (endDate) {
                const formattedEnd = new Date(endDate).toISOString().split('T')[0];
                dateFilter += ` before:${formattedEnd}`;
            }

            console.log(`Date filter: ${dateFilter || 'No date filter'}`);

            const queries = [
                `"job application" ${dateFilter}`,
                `"application for" ${dateFilter}`,
                `"thank you for applying" ${dateFilter}`,
                `"thank you for your interest" ${dateFilter}`,
                `"your application" ${dateFilter}`,
                `"application received" ${dateFilter}`,
                `"application submitted" ${dateFilter}`,
                `"application status" ${dateFilter}`,
                `"your application has been" ${dateFilter}`,
                `"we have received your application" ${dateFilter}`,
                `"interview invitation" ${dateFilter}`,
                `"interview request" ${dateFilter}`,
                `"interview scheduled" ${dateFilter}`,
                `"invite you to interview" ${dateFilter}`,
                `"job offer" ${dateFilter}`,
                `"offer letter" ${dateFilter}`,
                `"you have been selected" ${dateFilter}`,
                `"congratulations on your offer" ${dateFilter}`,
                `"moving forward with other candidates" ${dateFilter}`,
                `"we regret to inform you" ${dateFilter}`,
                `"not moving forward" ${dateFilter}`,
                `"decided to move forward with another candidate" ${dateFilter}`,
                `"your application was not selected" ${dateFilter}`,
                `"unfortunately" ${dateFilter}`,
                `"at this time, we are moving forward" ${dateFilter}`,
                `"position at" ${dateFilter}`,
                `subject:(application) ${dateFilter}`,
                `subject:(applied) ${dateFilter}`,
                `subject:(position) ${dateFilter}`,
                `subject:(rejection) ${dateFilter}`,
                `from:(noreply@) ${dateFilter}`,
                `from:(careers@) ${dateFilter}`,
                `from:(talent@) ${dateFilter}`,
                `from:(jobs@) ${dateFilter}`,
                `from:(recruiter@) ${dateFilter}`,
                `from:(linkedin) ${dateFilter}`,
                `from:(indeed) ${dateFilter}`,
                `from:(workday) ${dateFilter}`,
            ];

            let allMessages = [];

            for (const query of queries) {
                try {
                    const response = await gmail.users.messages.list({
                        userId: 'me',
                        q: query,
                        maxResults: Math.floor(maxResults / queries.length)
                    });

                    if (response.data.messages) {
                        allMessages = [...allMessages, ...response.data.messages];
                    }
                } catch (error) {
                    console.error('Error fetching messages with query:', query, error);
                }
            }

            const uniqueMessages = Array.from(
                new Map(allMessages.map(msg => [msg.id, msg])).values()
            );

            console.log(`Found ${uniqueMessages.length} unique messages`);

            const applications = [];
            let nonAppCount = 0;
            let errorCount = 0;

            for (const message of uniqueMessages.slice(0, maxResults)) {
                try {
                    const msgData = await gmail.users.messages.get({
                        userId: 'me',
                        id: message.id,
                        format: 'full'
                    });

                    const parsedData = this.parseEmail(msgData.data);

                    if (!parsedData) {
                        errorCount++;
                        continue;
                    }

                    console.log(`\nProcessing: "${parsedData.subject}"`);

                    // =========================================================
                    // 🚀 USE AI TO CHECK AND EXTRACT
                    // =========================================================
                    const aiResult = await aiCleaner.processEmail(
                        parsedData.subject,
                        parsedData.body,
                        parsedData.from
                    );

                    // If AI says it's NOT an application, skip it
                    if (!aiResult) {
                        nonAppCount++;
                        console.log(`AI: Not a job application`);
                        continue;
                    }

                    // AI says it IS an application - use the extracted data
                    const emailData = {
                        company: aiResult.company,
                        position: aiResult.position,
                        status: aiResult.status,
                        emailType: aiResult.emailType || 'other',
                        isFollowUp: aiResult.isFollowUp || false,
                        previousStatus: aiResult.previousStatus || null,
                        subject: parsedData.subject,
                        from: parsedData.from,
                        date: parsedData.date,
                        body: parsedData.body,
                        emailId: message.id,
                        threadId: msgData.data.threadId
                    };

                    console.log(`AI: ${emailData.company} - ${emailData.position} (${emailData.status})`);

                    // ✅ CHECK BOTH START AND END DATE
                    const emailDate = new Date(parsedData.date);
                    if (startDate && emailDate < new Date(startDate)) {
                        console.log(`Skipping - Before start date (${startDate})`);
                        continue;
                    }
                    if (endDate && emailDate > new Date(endDate)) {
                        console.log(`Skipping - After end date (${endDate})`);
                        continue;
                    }

                    applications.push(emailData);

                } catch (error) {
                    console.error(`Error processing message:`, error);
                    errorCount++;
                }
            }

            console.log(`\nSUMMARY:`);
            console.log(`   Applications found: ${applications.length}`);
            console.log(`   Non-applications: ${nonAppCount}`);
            console.log(`   Errors: ${errorCount}`);

            return applications;
        } catch (error) {
            console.error('Error fetching Gmail messages:', error);
            throw error;
        }
    }

    // ============================================================
    // PARSE EMAIL - SIMPLIFIED
    // ============================================================
    parseEmail(emailData) {
        try {
            const headers = emailData.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || '';
            const from = headers.find(h => h.name === 'From')?.value || '';
            const date = headers.find(h => h.name === 'Date')?.value || '';

            let body = '';
            if (emailData.payload.parts) {
                for (const part of emailData.payload.parts) {
                    if (part.mimeType === 'text/plain' && part.body.data) {
                        body += Buffer.from(part.body.data, 'base64').toString('utf-8');
                    }
                }
            } else if (emailData.payload.body.data) {
                body = Buffer.from(emailData.payload.body.data, 'base64').toString('utf-8');
            }

            return {
                subject,
                from,
                date,
                body: body.substring(0, 2000)
            };
        } catch (error) {
            console.error('Error parsing email:', error);
            return null;
        }
    }

    // ============================================================
    // SYNC GMAIL - WITH ENHANCED TRACKING, DATE RANGE, AND OVERRIDE
    // ============================================================
    async syncEmails(userId, startDate = null, endDate = null, override = false) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            console.log(`\n👤 Syncing Gmail for: ${user.email}`);
            console.log(`Has access token: ${!!user.accessToken}`);
            console.log(`Has refresh token: ${!!user.refreshToken}`);
            onsole.log(`🔄 Override flag received: ${override}`);
            // Set default dates
            const startDateObj = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const endDateObj = endDate ? new Date(endDate) : new Date();

            console.log(`Syncing emails from ${startDateObj.toISOString().split('T')[0]} to ${endDateObj.toISOString().split('T')[0]}`);

            // ✅ If override is true, DELETE ALL existing applications for this user
            if (override) {
                const deleted = await Application.deleteMany({ userId });
                console.log(`🗑️ Deleted ${deleted.deletedCount} existing applications`);
            }

            const emails = await this.fetchJobApplications(user, startDateObj, endDateObj);

            let synced = 0;
            let updated = 0;
            let followUpsProcessed = 0;

            for (const email of emails) {
                // Check if application already exists (only if NOT overriding)
                let existing = null;
                if (!override) {
                    existing = await Application.findOne({
                        userId,
                        company: email.company,
                        position: email.position
                    });
                }

                if (existing) {
                    // ============================================================
                    // ✅ UPDATE EXISTING APPLICATION WITH ENHANCED TRACKING
                    // ============================================================

                    // Add to status history
                    existing.statusHistory.push({
                        status: email.status,
                        date: new Date(email.date),
                        source: 'Email',
                        note: `Email: ${email.subject}`
                    });

                    // Add to follow-up emails
                    existing.followUpEmails.push({
                        subject: email.subject,
                        status: email.status,
                        date: new Date(email.date),
                        from: email.from,
                        emailId: email.emailId
                    });

                    // Update the main status
                    existing.status = email.status;
                    existing.lastUpdated = new Date();
                    existing.lastEmailDate = new Date(email.date);

                    // If email thread ID doesn't match, update it
                    if (!existing.emailThreadId) {
                        existing.emailThreadId = email.threadId;
                    }

                    await existing.save();
                    updated++;
                    followUpsProcessed++;

                    console.log(`🔄 Updated: ${email.company} - ${email.position} → ${email.status} (${existing.statusHistory.length} status changes)`);

                } else {
                    // ============================================================
                    // ✅ CREATE NEW APPLICATION WITH ENHANCED TRACKING
                    // ============================================================

                    const application = new Application({
                        userId,
                        company: email.company,
                        position: email.position,
                        status: email.status,
                        appliedDate: new Date(email.date),
                        lastUpdated: new Date(),
                        lastEmailDate: new Date(email.date),
                        source: 'Email',
                        emailThreadId: email.threadId,

                        // Initialize status history
                        statusHistory: [{
                            status: email.status,
                            date: new Date(email.date),
                            source: 'Email',
                            note: `Initial email: ${email.subject}`
                        }],

                        // Initialize follow-up emails
                        followUpEmails: [{
                            subject: email.subject,
                            status: email.status,
                            date: new Date(email.date),
                            from: email.from,
                            emailId: email.emailId
                        }]
                    });

                    await application.save();
                    synced++;

                    console.log(`Created: ${email.company} - ${email.position} (${email.status})`);
                }
            }

            console.log(`\nSync complete:`);
            console.log(`   New applications: ${synced}`);
            console.log(`   Updated applications: ${updated}`);
            console.log(`   Follow-ups processed: ${followUpsProcessed}`);
            console.log(`   Total emails: ${emails.length}`);

            return {
                success: true,
                message: override
                    ? `Replaced all data with ${synced} new applications`
                    : `Synced ${synced} new applications, updated ${updated} existing, ${followUpsProcessed} follow-ups processed`,
                synced,
                updated,
                followUpsProcessed,
                total: emails.length,
                startDate: startDateObj,
                endDate: endDateObj,
                override: override
            };
        } catch (error) {
            console.error('Error syncing emails:', error);
            throw error;
        }
    }
}

module.exports = new GmailService();