// ResumeIQ - Main Application Script

let groqAPI = null;
let currentAnalysis = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkAPIKey();
});

function initializeEventListeners() {
    // Settings Modal
    document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
    document.getElementById('closeModal').addEventListener('click', closeSettingsModal);
    document.getElementById('saveApiKey').addEventListener('click', saveApiKey);

    // Main Actions
    document.getElementById('analyzeBtn').addEventListener('click', analyzeResume);
    document.getElementById('clearBtn').addEventListener('click', clearForm);
    document.getElementById('exportBtn').addEventListener('click', exportReport);

    // Modal Close on Outside Click
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('settingsModal');
        if (event.target === modal) {
            closeSettingsModal();
        }
    });

    // Enter to analyze (Ctrl+Enter in textarea)
    document.getElementById('resumeText').addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            analyzeResume();
        }
    });
}

function checkAPIKey() {
    const apiKey = StorageManager.getApiKey();
    if (apiKey) {
        groqAPI = new GroqAPIManager(apiKey);
        updateAPIStatus(true);
    } else {
        updateAPIStatus(false);
    }
}

function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('show');
    
    // Pre-fill existing API key
    const existingKey = StorageManager.getApiKey();
    if (existingKey) {
        document.getElementById('apiKey').value = existingKey;
    }
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('show');
}

function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value.trim();

    if (!Validators.validateApiKey(apiKey)) {
        showAPIStatus('Please enter a valid API key', 'error');
        return;
    }

    // Save the API key
    StorageManager.setApiKey(apiKey);
    groqAPI = new GroqAPIManager(apiKey);

    // Test the API key
    testAPIKey(apiKey);
}

async function testAPIKey(apiKey) {
    try {
        const testAPI = new GroqAPIManager(apiKey);
        await testAPI.callAPI(
            [{ role: 'user', content: 'Say "API key works" in one word' }],
            0.1
        );
        
        showAPIStatus('✓ API key saved and verified successfully!', 'success');
        updateAPIStatus(true);
        
        setTimeout(() => {
            closeSettingsModal();
        }, 1500);
    } catch (error) {
        showAPIStatus('✗ API key verification failed: ' + error.message, 'error');
        StorageManager.clearApiKey();
        groqAPI = null;
        updateAPIStatus(false);
    }
}

function showAPIStatus(message, type) {
    const statusDiv = document.getElementById('apiStatus');
    statusDiv.textContent = message;
    statusDiv.className = `api-status ${type}`;
}

function updateAPIStatus(isValid) {
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (isValid) {
        analyzeBtn.disabled = false;
    } else {
        analyzeBtn.disabled = true;
    }
}

async function analyzeResume() {
    // Validate inputs
    const resume = document.getElementById('resumeText').value.trim();
    const jobDescription = document.getElementById('jobDescription').value.trim();

    if (!Validators.validateResume(resume)) {
        showError('Please paste a resume with at least 50 characters');
        return;
    }

    if (!groqAPI) {
        showError('Please configure your API key first (click Settings)');
        return;
    }

    // Show loading state
    hideError();
    DOMUtils.hideElement('resultsSection');
    DOMUtils.showElement('loading');
    
    const analyzeBtn = document.getElementById('analyzeBtn');
    const originalText = analyzeBtn.textContent;
    analyzeBtn.disabled = true;

    try {
        // Call Groq API for analysis
        currentAnalysis = await groqAPI.analyzeResume(
            resume,
            jobDescription || null
        );

        // Display results
        displayResults(currentAnalysis, jobDescription);

        // Enable export
        document.getElementById('exportBtn').disabled = false;

    } catch (error) {
        console.error('Analysis error:', error);
        showError(`Analysis failed: ${error.message}`);
    } finally {
        DOMUtils.hideElement('loading');
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = originalText;
    }
}

function displayResults(analysis, jobDescription) {
    // ATS Score
    const scoreColor = analysis.atsScore >= 70 ? '#10b981' : 
                      analysis.atsScore >= 50 ? '#f59e0b' : '#ef4444';
    document.getElementById('atsScore').textContent = analysis.atsScore;
    document.getElementById('atsScore').style.color = scoreColor;
    DOMUtils.setHTML('atsDetails', analysis.atsAnalysis);

    // Resume Summary
    DOMUtils.setHTML('resumeSummary', `<em>"${analysis.summary}"</em>`);

    // Strengths
    DOMUtils.renderList('strengthsList', analysis.strengths || []);

    // Weaknesses
    DOMUtils.renderList('weaknessesList', analysis.weaknesses || []);

    // Missing Keywords
    let missingKeywordsHTML = '';
    if (analysis.missingKeywords) {
        if (analysis.missingKeywords.technical?.length > 0) {
            missingKeywordsHTML += `<h4>Technical Keywords:</h4>
                <div class="skills-list">${analysis.missingKeywords.technical.map(k => 
                    `<span class="skill-tag">${DOMUtils.escapeHTML(k)}</span>`
                ).join('')}</div>`;
        }
        if (analysis.missingKeywords.tools?.length > 0) {
            missingKeywordsHTML += `<h4>Tools & Platforms:</h4>
                <div class="skills-list">${analysis.missingKeywords.tools.map(k => 
                    `<span class="skill-tag">${DOMUtils.escapeHTML(k)}</span>`
                ).join('')}</div>`;
        }
        if (analysis.missingKeywords.soft?.length > 0) {
            missingKeywordsHTML += `<h4>Soft Skills:</h4>
                <div class="skills-list">${analysis.missingKeywords.soft.map(k => 
                    `<span class="skill-tag">${DOMUtils.escapeHTML(k)}</span>`
                ).join('')}</div>`;
        }
    }
    DOMUtils.setHTML('missingKeywordsDiv', missingKeywordsHTML || '<p>No missing keywords identified.</p>');

    // Improvement Suggestions
    let suggestionsHTML = '';
    if (analysis.suggestions && analysis.suggestions.length > 0) {
        suggestionsHTML = '<div class="suggestions-div">' + 
            analysis.suggestions.map(s => `
                <div class="suggestion-item">
                    <div class="suggestion-current"><strong>Current:</strong> ${DOMUtils.escapeHTML(s.current)}</div>
                    <div class="suggestion-improved"><strong>Improved:</strong> ${DOMUtils.escapeHTML(s.improved)}</div>
                </div>
            `).join('') + 
            '</div>';
    }
    DOMUtils.setHTML('suggestionsDiv', suggestionsHTML || '<p>No specific suggestions at this time.</p>');

    // Skill Categorization
    let skillsHTML = '';
    if (analysis.skills) {
        if (analysis.skills.technical?.length > 0) {
            skillsHTML += `<div class="skills-category">
                <h4>💻 Technical Skills</h4>
                <div class="skills-list">${analysis.skills.technical.map(s => 
                    `<span class="skill-tag">${DOMUtils.escapeHTML(s)}</span>`
                ).join('')}</div>
            </div>`;
        }
        if (analysis.skills.tools?.length > 0) {
            skillsHTML += `<div class="skills-category">
                <h4>🛠️ Tools & Platforms</h4>
                <div class="skills-list">${analysis.skills.tools.map(s => 
                    `<span class="skill-tag">${DOMUtils.escapeHTML(s)}</span>`
                ).join('')}</div>
            </div>`;
        }
        if (analysis.skills.soft?.length > 0) {
            skillsHTML += `<div class="skills-category">
                <h4>💬 Soft Skills</h4>
                <div class="skills-list">${analysis.skills.soft.map(s => 
                    `<span class="skill-tag">${DOMUtils.escapeHTML(s)}</span>`
                ).join('')}</div>
            </div>`;
        }
    }
    DOMUtils.setHTML('skillsCategorization', skillsHTML || '<p>No skills identified.</p>');

    // Professional Rewrite
    const rewriteContent = analysis.professionalRewrite || 'Unable to generate professional rewrite.';
    DOMUtils.setHTML('professionalRewrite', 
        `<div class="rewrite-content">${DOMUtils.escapeHTML(rewriteContent)}</div>`);

    // Job Description Matching
    if (jobDescription && analysis.jobMatchScore !== null) {
        const matchCard = document.getElementById('matchingCard');
        matchCard.style.display = 'block';

        const matchScoreColor = analysis.jobMatchScore >= 70 ? '#10b981' : 
                               analysis.jobMatchScore >= 50 ? '#f59e0b' : '#ef4444';
        
        let matchHTML = `<div class="match-score" style="color: ${matchScoreColor};">${analysis.jobMatchScore}% Match</div>`;
        
        if (analysis.jobMatchAnalysis) {
            const { matched, missing, recommendations } = analysis.jobMatchAnalysis;
            
            matchHTML += '<div class="match-comparison">';
            
            if (matched && matched.length > 0) {
                matchHTML += `<div class="match-column">
                    <h4>✅ Matched</h4>
                    <div class="match-items">
                        ${matched.map(m => `<div class="match-item">✓ ${DOMUtils.escapeHTML(m)}</div>`).join('')}
                    </div>
                </div>`;
            }
            
            if (missing && missing.length > 0) {
                matchHTML += `<div class="match-column">
                    <h4>❌ Missing</h4>
                    <div class="match-items">
                        ${missing.map(m => `<div class="match-item">✗ ${DOMUtils.escapeHTML(m)}</div>`).join('')}
                    </div>
                </div>`;
            }
            
            matchHTML += '</div>';
            
            if (recommendations && recommendations.length > 0) {
                matchHTML += `<h4 style="margin-top: 15px;">📋 Recommendations:</h4>
                    <ul class="list-items">
                        ${recommendations.map(r => `<li>${DOMUtils.escapeHTML(r)}</li>`).join('')}
                    </ul>`;
            }
        }
        
        DOMUtils.setHTML('jobMatching', matchHTML);
    } else {
        document.getElementById('matchingCard').style.display = 'none';
    }

    // Show results section
    DOMUtils.showElement('resultsSection');
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function clearForm() {
    document.getElementById('resumeText').value = '';
    document.getElementById('jobDescription').value = '';
    DOMUtils.hideElement('resultsSection');
    hideError();
    currentAnalysis = null;
}

function exportReport() {
    if (!currentAnalysis) {
        showError('No analysis to export. Please analyze a resume first.');
        return;
    }

    const resume = document.getElementById('resumeText').value;
    const jobDescription = document.getElementById('jobDescription').value;
    
    ReportGenerator.downloadAsText(currentAnalysis);
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    DOMUtils.showElement('errorMessage');
}

function hideError() {
    DOMUtils.hideElement('errorMessage');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Shift + S for Settings
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        openSettingsModal();
    }
    // Ctrl/Cmd + Shift + C for Clear
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearForm();
    }
});
