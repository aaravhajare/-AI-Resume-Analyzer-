// Utility functions for ResumeIQ

// Local Storage Management
const StorageManager = {
    setApiKey(key) {
        localStorage.setItem('groq_api_key', key);
    },

    getApiKey() {
        return localStorage.getItem('groq_api_key');
    },

    clearApiKey() {
        localStorage.removeItem('groq_api_key');
    },

    hasApiKey() {
        return !!this.getApiKey();
    }
};

// Groq API Manager
class GroqAPIManager {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'openai/gpt-oss-120b';
    }

    async callAPI(messages, temperature = 0.7) {
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: temperature,
                    max_tokens: 2000,
                    top_p: 1
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            throw new Error(`Groq API Error: ${error.message}`);
        }
    }

    async analyzeResume(resume, jobDescription = null) {
        const systemPrompt = `You are an expert resume analyst and HR professional with deep knowledge of ATS (Applicant Tracking Systems), career development, and industry best practices. Provide detailed, actionable feedback.`;

        const analysisPrompt = `
Analyze the following resume and provide detailed feedback in the specified JSON format.

RESUME:
${resume}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}` : ''}

Provide your analysis as a JSON object with the following structure (ensure valid JSON):
{
  "atsScore": <number 0-100>,
  "atsAnalysis": "<detailed breakdown of ATS score>",
  "summary": "<2-3 sentence professional summary>",
  "strengths": [<list of 4-5 key strengths>],
  "weaknesses": [<list of 4-5 key weaknesses>],
  "missingKeywords": {
    "technical": [<list of technical keywords>],
    "tools": [<list of tools/platforms>],
    "soft": [<list of soft skills>]
  },
  "suggestions": [
    {
      "current": "<current text example>",
      "improved": "<improved version>"
    }
  ],
  "skills": {
    "technical": [<list>],
    "tools": [<list>],
    "soft": [<list>]
  },
  "professionalRewrite": "<complete professional rewrite of resume>",
  "jobMatchScore": ${jobDescription ? '<number 0-100>' : 'null'},
  "jobMatchAnalysis": {
    "matched": [<matched keywords/skills>],
    "missing": [<missing keywords/skills>],
    "recommendations": [<recommendations>]
  }
}

Ensure the response is valid JSON only, no additional text.`;

        try {
            const response = await this.callAPI(
                [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: analysisPrompt }
                ],
                0.5
            );

            // Extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Could not parse JSON response from API');
            }

            const analysisData = JSON.parse(jsonMatch[0]);
            return analysisData;
        } catch (error) {
            throw new Error(`Resume analysis failed: ${error.message}`);
        }
    }
}

// Text Processing Utilities
const TextUtils = {
    extractKeywords(text) {
        // Common technical keywords
        const technicalKeywords = [
            'javascript', 'python', 'java', 'c\\+\\+', 'c#', 'ruby', 'php', 'swift',
            'html', 'css', 'react', 'angular', 'vue', 'nodejs', 'express',
            'mongodb', 'sql', 'postgresql', 'mysql', 'firebase',
            'git', 'github', 'gitlab', 'docker', 'kubernetes',
            'aws', 'azure', 'gcp', 'heroku', 'netlify',
            'rest', 'graphql', 'api', 'json', 'xml',
            'agile', 'scrum', 'devops', 'ci/cd', 'testing',
            'machine learning', 'ai', 'nlp', 'deep learning',
            'typescript', 'kotlin', 'go', 'rust', 'scala'
        ];

        const softKeywords = [
            'communication', 'leadership', 'teamwork', 'collaboration',
            'problem solving', 'critical thinking', 'time management',
            'project management', 'public speaking', 'mentoring',
            'negotiation', 'emotional intelligence', 'adaptability'
        ];

        const textLower = text.toLowerCase();
        const found = {
            technical: [],
            soft: []
        };

        technicalKeywords.forEach(keyword => {
            if (new RegExp(`\\b${keyword}\\b`).test(textLower)) {
                found.technical.push(keyword);
            }
        });

        softKeywords.forEach(keyword => {
            if (new RegExp(`\\b${keyword}\\b`).test(textLower)) {
                found.soft.push(keyword);
            }
        });

        return found;
    },

    calculateATSScore(resume, keywords) {
        let score = 50; // Base score

        // Check formatting
        const lines = resume.split('\n').length;
        if (lines > 5 && lines < 100) score += 10;

        // Check keyword presence
        const foundKeywords = keywords.technical.length + keywords.soft.length;
        score += Math.min(foundKeywords * 2, 20);

        // Check for sections
        const sections = ['experience', 'education', 'skills', 'project', 'achievement', 'summary'];
        const hasSections = sections.filter(section => 
            new RegExp(`\\b${section}\\b`, 'i').test(resume)
        ).length;
        score += Math.min(hasSections * 3, 15);

        // Check for contact info
        if (/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i.test(resume)) score += 3;
        if (/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(resume)) score += 3;

        // Check for measurable results
        if (/\b\d+%|\d+\+?x|improved|increased|reduced|decreased\b/i.test(resume)) score += 5;

        return Math.min(Math.max(score, 20), 100);
    },

    generateSummary(strengths, skills) {
        const techSkills = skills.technical.slice(0, 3).join(', ');
        const experience = 'your professional experience';
        
        return `Experienced professional with strong expertise in ${techSkills}. Demonstrates solid technical foundation and proven track record of delivering quality work. Shows commitment to continuous learning and professional growth.`;
    }
};

// DOM Utilities
const DOMUtils = {
    showElement(id) {
        const element = document.getElementById(id);
        if (element) element.classList.add('show');
    },

    hideElement(id) {
        const element = document.getElementById(id);
        if (element) element.classList.remove('show');
    },

    setTextContent(id, content) {
        const element = document.getElementById(id);
        if (element) element.textContent = content;
    },

    setHTML(id, content) {
        const element = document.getElementById(id);
        if (element) element.innerHTML = content;
    },

    renderList(id, items) {
        const element = document.getElementById(id);
        if (!element) return;

        element.innerHTML = items.map(item => `<li>${this.escapeHTML(item)}</li>`).join('');
    },

    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    formatSkillsList(skills) {
        if (!skills || skills.length === 0) return 'No skills identified.';
        
        return skills.map(skill => `<span class="skill-tag">${this.escapeHTML(skill)}</span>`).join('');
    }
};

// Report Generation
const ReportGenerator = {
    generateHTML(analysisData, resume, jobDescription) {
        const { atsScore, summary, strengths, weaknesses, skills, professionalRewrite, jobMatchScore, jobMatchAnalysis } = analysisData;

        let html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        h1 { color: #6366f1; }
        h2 { color: #8b5cf6; margin-top: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
        .section { margin-bottom: 30px; page-break-inside: avoid; }
        .score { font-size: 36px; font-weight: bold; color: #10b981; }
        ul { margin-left: 20px; }
        li { margin-bottom: 8px; }
        .strength { color: #10b981; }
        .weakness { color: #f59e0b; }
        .match-score { font-size: 24px; color: #6366f1; font-weight: bold; }
        @media print { page-break-after: always; }
    </style>
</head>
<body>
    <h1>ResumeIQ - Resume Analysis Report</h1>
    <p>Generated on: ${new Date().toLocaleString()}</p>
    
    <div class="section">
        <h2>📊 ATS Score</h2>
        <div class="score">${atsScore}/100</div>
    </div>

    <div class="section">
        <h2>📝 Summary</h2>
        <p>${this.escapeHTML(summary)}</p>
    </div>

    <div class="section">
        <h2>✨ Strengths</h2>
        <ul>
            ${strengths.map(s => `<li class="strength">✓ ${this.escapeHTML(s)}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <h2>⚠️ Weaknesses</h2>
        <ul>
            ${weaknesses.map(w => `<li class="weakness">✗ ${this.escapeHTML(w)}</li>`).join('')}
        </ul>
    </div>

    <div class="section">
        <h2>🛠️ Identified Skills</h2>
        <h3>Technical Skills:</h3>
        <p>${skills.technical.join(', ') || 'None identified'}</p>
        <h3>Tools & Platforms:</h3>
        <p>${skills.tools.join(', ') || 'None identified'}</p>
        <h3>Soft Skills:</h3>
        <p>${skills.soft.join(', ') || 'None identified'}</p>
    </div>

    ${jobMatchScore ? `
    <div class="section">
        <h2>🎯 Job Description Match</h2>
        <div class="match-score">${jobMatchScore}% Match</div>
        <h3>Matched Skills/Keywords:</h3>
        <ul>
            ${jobMatchAnalysis.matched.map(m => `<li>✓ ${this.escapeHTML(m)}</li>`).join('')}
        </ul>
        <h3>Missing Keywords:</h3>
        <ul>
            ${jobMatchAnalysis.missing.map(m => `<li>✗ ${this.escapeHTML(m)}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

</body>
</html>`;
        return html;
    },

    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    },

    downloadAsText(analysisData) {

    if (!window.jspdf) {
        alert("jsPDF not loaded");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // your existing report generation code

    doc.save("ResumeIQ_Report.pdf");
},

downloadResumePDF(analysisData) {

    if (!window.jspdf) {
        alert("jsPDF not loaded");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.text("Professional Resume", 20, y);

    y += 20;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");

    const resumeText =
        analysisData.professionalRewrite ||
        "No rewritten resume available.";

    const lines = doc.splitTextToSize(
        resumeText,
        170
    );

    doc.text(lines, 20, y);

    doc.save("Professional_Resume.pdf");
},

    _downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};

// Validation
const Validators = {
    validateApiKey(key) {
        return key && key.trim().length > 0;
    },

    validateResume(text) {
        const trimmed = text.trim();
        return trimmed.length > 50; // At least 50 characters
    }
};

const PDFUtils = {
    async extractText(file) {
        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer
        }).promise;

        let fullText = "";

        for (let page = 1; page <= pdf.numPages; page++) {

            const pdfPage = await pdf.getPage(page);

            const textContent =
                await pdfPage.getTextContent();

            const pageText = textContent.items
                .map(item => item.str)
                .join(" ");

            fullText += pageText + "\n\n";
        }

        return fullText;
    }
};
