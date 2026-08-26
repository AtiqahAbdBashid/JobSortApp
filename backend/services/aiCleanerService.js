const OpenAI = require('openai');

class AICleanerService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    // ============================================================
    // STEP 1: CHECK IF IT'S A JOB APPLICATION - LESS STRICT
    // ============================================================
    async isJobApplication(subject, body, from) {
        try {
            const bodyPreview = body.substring(0, 1000);

            const prompt = `
Determine whether this email is directly related to a JOB APPLICATION that the user has submitted.

Subject: "${subject}"
From: "${from}"
Body preview: "${bodyPreview}"

Return ONLY "YES" or "NO".

DEFINITION:
Answer YES only if the email is about an actual job application submitted by the user, or a direct follow-up/outcome of that application.

Answer NO if the email is simply advertising, recommending, or notifying the user about a job opportunity that they have NOT applied for.

YES — JOB APPLICATION EMAILS:
- Confirmation that an application was received
- Confirmation that an application was submitted
- "Thank you for applying"
- "Thank you for your application"
- "We have received your application"
- "Your application for [position]"
- Interview invitation for a position the user applied for
- Assessment/test invitation related to an application
- Request for additional information/documents for an application
- Application status/update
- Rejection of an application
- Job offer resulting from an application
- "Unfortunately, we have decided not to proceed with your application"
- Any email clearly indicating that the user's submitted application was reviewed or processed

NO — NOT A JOB APPLICATION:
- LinkedIn job alerts
- Indeed job alerts
- Job alerts from any job board
- "New jobs matching your preferences"
- "Jobs you may be interested in"
- "Recommended jobs for you"
- "You might be a good fit for this job"
- "New opportunity available"
- Job recommendations
- Search result notifications
- Company newsletters
- Recruitment marketing emails
- Promotional emails about careers or hiring
- General company hiring announcements
- Recruiters contacting the user about a position BEFORE the user has applied
- Cold outreach about a job opportunity
- Emails containing job vacancies or job descriptions without evidence that the user applied
- Career fairs, hiring events, or talent-pool invitations

IMPORTANT DISTINCTION:
"Job opportunity" ≠ "Job application".

For example:
- "New job alert: Software Engineer at Company X" → NO
- "We think you'd be a great fit for Software Engineer at Company X" → NO
- "A recruiter would like to discuss a Software Engineer position" → NO
- "Thank you for applying for Software Engineer at Company X" → YES
- "We received your application for Software Engineer" → YES
- "Your application for Software Engineer has been rejected" → YES
- "You have been invited to interview for Software Engineer" → YES

IMPORTANT RULE:
Do NOT classify an email as YES merely because it mentions:
- a job
- a position
- hiring
- recruitment
- career opportunities
- "Unfortunately"
- "application" when it refers to something other than a submitted job application

If the email is ambiguous and there is NO clear indication that the user submitted an application, answer NO.
An email from myfuturejobs.com is likely a job alert, not an application confirmation.

Return ONLY "YES" or "NO".

            `;

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Determine if an email is a job application. Be generous - say YES when in doubt. Return only YES or NO." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 5
            });

            const result = response.choices[0].message.content.trim().toUpperCase();
            console.log(`🔍 AI Application Check: ${result} `);

            return result === 'YES';
        } catch (error) {
            console.error('❌ AI check failed:', error.message);
            // Default to YES when AI fails (better to include than miss)
            return true;
        }
    }

    // ============================================================
    // STEP 2: EXTRACT DATA
    // ============================================================
    async extractApplicationData(subject, body, from) {
        try {
            const bodyPreview = body.substring(0, 1500);

            const prompt = `
Extract job application information from this email.

                Subject: "${subject}"
            From: "${from}"
            Body: "${bodyPreview}"

Return ONLY valid JSON with these fields:
            {
                "company": "the company name",
                    "position": "the job title/position",
                        "status": "one of: Applied, Screening, Interview, Offer, Accepted, Rejected, Withdrawn"
            }

            Rules:
            1. If it's a rejection, status = "Rejected"
            2. If it's an interview invitation, status = "Interview"
            3. If it's an offer, status = "Offer"
            4. If it's "Thank you for applying", status = "Applied"
            5. If it's "Thank you for your interest", status = "Rejected" (if it's a rejection email) or "Applied"
            6. If you can't find the company, use the email domain
            7. If you can't find the position, use "Unknown"
            8. Keep company and position clean - no extra text

Return ONLY the JSON, no other text.
`;

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You extract job application data from emails. Return only valid JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 200,
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(response.choices[0].message.content);

            console.log(`🤖 AI Extraction Result: `);
            console.log(`   Company: "${result.company}"`);
            console.log(`   Position: "${result.position}"`);
            console.log(`   Status: "${result.status}"`);

            return {
                company: result.company || 'Unknown Company',
                position: result.position || 'Unknown Position',
                status: result.status || 'Applied'
            };
        } catch (error) {
            console.error('❌ AI extraction failed:', error.message);
            return this.fallbackExtract(subject, body, from);
        }
    }

    // ============================================================
    // MAIN: Check + Extract
    // ============================================================
    async processEmail(subject, body, from) {
        const isApp = await this.isJobApplication(subject, body, from);

        if (!isApp) {
            console.log(`⏭️ AI says: NOT a job application`);
            return null;
        }

        console.log(`✅ AI says: IS a job application - extracting data...`);
        const data = await this.extractApplicationData(subject, body, from);
        return data;
    }

    // ============================================================
    // FALLBACK METHODS
    // ============================================================

    fallbackIsApplication(subject, body) {
        const content = (subject + ' ' + body).toLowerCase();

        const appPhrases = [
            'thank you for applying',
            'thank you for your application',
            'thank you for your interest',
            'application received',
            'application submitted',
            'your application has been',
            'we have received your application',
            'interview invitation',
            'job offer',
            'rejection',
            'unfortunately',
            'regret to inform',
            'not moving forward'
        ];

        for (const phrase of appPhrases) {
            if (content.includes(phrase)) {
                return true;
            }
        }

        return false;
    }

    fallbackExtract(subject, body, from) {
        const company = this.extractCompanyFromEmail(from);
        const position = this.extractPositionFromSubject(subject);
        const status = this.determineStatusFallback(subject, body);
        return { company, position, status };
    }

    extractCompanyFromEmail(from) {
        const match = from.match(/@([a-zA-Z0-9-]+)\./);
        if (match) {
            const domain = match[1];
            const skip = ['gmail', 'yahoo', 'outlook', 'hotmail', 'linkedin', 'indeed', 'glassdoor', 'jobstreet'];
            if (!skip.includes(domain.toLowerCase())) {
                return domain.charAt(0).toUpperCase() + domain.slice(1);
            }
        }
        return 'Unknown Company';
    }

    extractPositionFromSubject(subject) {
        const clean = subject.replace(/^(Re:|Fwd:|FW:|Application|Job|Position|Role):\s*/i, '').trim();
        const atIndex = clean.toLowerCase().indexOf(' at ');
        if (atIndex > 0) {
            return clean.substring(0, atIndex).trim();
        }
        return clean.length > 5 ? clean : 'Unknown Position';
    }

    determineStatusFallback(subject, body) {
        const content = (subject + ' ' + body).toLowerCase();
        if (content.includes('rejected') || content.includes('unfortunately') || content.includes('regret to inform')) {
            return 'Rejected';
        } else if (content.includes('interview') || content.includes('invite you to interview')) {
            return 'Interview';
        } else if (content.includes('offer') || content.includes('congratulations')) {
            return 'Offer';
        } else if (content.includes('thank you for applying') || content.includes('application received')) {
            return 'Applied';
        }
        return 'Applied';
    }
}

module.exports = new AICleanerService();