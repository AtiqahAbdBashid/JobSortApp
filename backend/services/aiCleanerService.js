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
Determine if this email is a JOB APPLICATION related email.

Subject: "${subject}"
From: "${from}"
Body preview: "${bodyPreview}"

Answer with ONLY "YES" or "NO".

These are ALWAYS job applications:
- "Thank you for your interest" → YES
- "Thank you for applying" → YES
- "Application received" → YES
- "Application submitted" → YES
- "Your application" → YES
- "Job offer" → YES
- "Interview invitation" → YES
- "Rejection" → YES
- "Unfortunately" → YES (rejection)
- "We have received your application" → YES

These are NOT job applications:
- LinkedIn/Indeed job alerts (contains "job alert", "matching jobs", "recommended for you")
- Company newsletters or marketing emails
- Recruiter reaching out about a position (not an application)

IMPORTANT RULE: If you're not sure, say YES. It's better to include a non-application than to miss a real job application.

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
            console.log(`🔍 AI Application Check: ${result}`);

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

            console.log(`🤖 AI Extraction Result:`);
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