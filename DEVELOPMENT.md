# Development Guide - ResumeIQ

## 🔧 Local Development Setup

### Prerequisites
- Git
- Text editor (VS Code recommended)
- Python 3 or Node.js (for serving files)
- Modern web browser

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/aaravhajare/-AI-Resume-Analyzer-.git
   cd -AI-Resume-Analyzer-
   ```

2. **Start Local Server**
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (if installed)
   npm install -g http-server
   http-server -p 8000

   # Using Python 2
   python -m SimpleHTTPServer 8000
   ```

3. **Open in Browser**
   ```
   http://localhost:8000
   ```

4. **Open Developer Tools**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Press `Cmd+Option+I` (Mac)

## 📁 Project Architecture

### File Structure
```
index.html          → Main UI (HTML structure)
styles.css          → Styling (CSS rules)
script.js           → Main logic (DOM events, state management)
utils.js            → Utility functions (API calls, helpers)
```

### Data Flow
```
User Input (Resume)
    ↓
script.js (analyzeResume function)
    ↓
utils.js (GroqAPIManager)
    ↓
Groq API
    ↓
JSON Response
    ↓
script.js (displayResults function)
    ↓
UI Update (HTML render)
```

## 🧩 Key Components

### 1. GroqAPIManager (utils.js)

Handles all API communication with Groq.

```javascript
class GroqAPIManager {
  constructor(apiKey)      // Initialize with API key
  async callAPI()          // Generic API call
  async analyzeResume()    // Main analysis function
}
```

**Methods:**
- `callAPI(messages, temperature)` - Generic Groq API call
- `analyzeResume(resume, jobDescription)` - Analyzes resume and returns structured data

**Usage:**
```javascript
const groqAPI = new GroqAPIManager(apiKey);
const analysis = await groqAPI.analyzeResume(resume, jobDescription);
```

### 2. StorageManager (utils.js)

Manages browser's localStorage for API keys.

```javascript
StorageManager.setApiKey(key)     // Save API key
StorageManager.getApiKey()        // Retrieve API key
StorageManager.hasApiKey()        // Check if key exists
StorageManager.clearApiKey()      // Remove API key
```

### 3. DOMUtils (utils.js)

Helper functions for DOM manipulation.

```javascript
DOMUtils.showElement(id)          // Show element
DOMUtils.hideElement(id)          // Hide element
DOMUtils.setTextContent(id, text) // Set text
DOMUtils.setHTML(id, html)        // Set HTML
DOMUtils.renderList(id, items)    // Render list
DOMUtils.formatSkillsList(skills) // Format skills
```

### 4. Main Script (script.js)

Orchestrates the application flow.

**Key Functions:**
- `initializeEventListeners()` - Setup all event handlers
- `analyzeResume()` - Trigger analysis
- `displayResults(analysis)` - Show results
- `clearForm()` - Reset inputs
- `exportReport()` - Download report

## 🔄 Data Structure

### Analysis Response (from Groq)
```javascript
{
  atsScore: number (0-100),
  atsAnalysis: string,
  summary: string,
  strengths: string[],
  weaknesses: string[],
  missingKeywords: {
    technical: string[],
    tools: string[],
    soft: string[]
  },
  suggestions: [{
    current: string,
    improved: string
  }],
  skills: {
    technical: string[],
    tools: string[],
    soft: string[]
  },
  professionalRewrite: string,
  jobMatchScore: number | null,
  jobMatchAnalysis: {
    matched: string[],
    missing: string[],
    recommendations: string[]
  }
}
```

## 🎨 CSS Organization

### Color Scheme (CSS Variables)
```css
--primary-color: #6366f1      (Indigo)
--secondary-color: #8b5cf6    (Purple)
--success-color: #10b981      (Green)
--warning-color: #f59e0b      (Amber)
--danger-color: #ef4444       (Red)
--bg-primary: #0f172a         (Dark Blue)
--bg-secondary: #1e293b       (Slate)
--text-primary: #f1f5f9       (Light)
```

### Responsive Breakpoints
```css
Mobile: < 480px
Tablet: 480px - 768px
Desktop: 768px - 1024px
Large: > 1024px
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Settings modal opens/closes
- [ ] API key saves correctly
- [ ] API key verification works
- [ ] Resume analysis starts
- [ ] Results display correctly
- [ ] Job matching works (when JD provided)
- [ ] Export functionality works
- [ ] Clear button resets form
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive works

### Browser Console Testing

```javascript
// Test API Manager
const api = new GroqAPIManager('your_key');
const result = await api.analyzeResume('Your resume text');

// Test Storage
StorageManager.setApiKey('test_key');
StorageManager.getApiKey(); // 'test_key'

// Test DOMUtils
DOMUtils.setTextContent('atsScore', '85');
DOMUtils.showElement('resultsSection');
```

## 🔐 Security Considerations

### Current Implementation
- ✅ API key stored in localStorage
- ✅ No server communication except to Groq API
- ✅ Resume never stored permanently
- ✅ HTTPS recommended for deployment

### Future Improvements
- [ ] Encrypt API key in localStorage
- [ ] Session-based API key (not stored)
- [ ] Backend server for key management
- [ ] User authentication system

## 🚀 Performance Optimization

### Current Performance
- Page Load: < 1s
- Analysis Time: 5-10s (Groq API)
- UI Response: < 100ms

### Optimization Opportunities
- [ ] Lazy load stylesheets
- [ ] Minify CSS/JS for production
- [ ] Cache frequently used API responses
- [ ] Implement request debouncing
- [ ] Add caching headers

## 🐛 Debugging Guide

### Enable Debug Mode
```javascript
// Add to script.js
const DEBUG = true;

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data);
  }
}
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| API key not saving | Check localStorage in DevTools → Application |
| Analysis timeout | Increase API call timeout in utils.js |
| Results not displaying | Check browser console for JS errors |
| Styling issues | Clear browser cache (Ctrl+Shift+Del) |
| API fails silently | Check Groq API key and rate limits |

### Browser DevTools

```
F12 → Console: Check for JS errors
F12 → Network: Monitor API calls
F12 → Application: View localStorage
F12 → Lighthouse: Performance audit
```

## ✨ Adding New Features

### Example: Add Certifications Analysis

1. **Update Prompt in utils.js**
```javascript
const analysisPrompt = `
...
Add this to JSON response:
"certifications": [
  {
    "name": "AWS Solutions Architect",
    "value": "positive"
  }
]
...`
```

2. **Update Data Structure**
```javascript
// In displayResults function
const certsHTML = analysis.certifications
  .map(c => `<li>${c.name}</li>`)
  .join('');
DOMUtils.setHTML('certificationsList', certsHTML);
```

3. **Add HTML Element**
```html
<!-- In index.html -->
<div class="result-card">
  <h3>🎓 Certifications</h3>
  <ul id="certificationsList"></ul>
</div>
```

## 🔄 Integration Points

### Adding Alternative API Provider (e.g., OpenAI)

1. Create new manager class
```javascript
class OpenAIManager {
  async analyzeResume(resume) { /* ... */ }
}
```

2. Update script.js
```javascript
const apiProvider = useOpenAI ? new OpenAIManager() : new GroqAPIManager();
```

3. Add provider selector to UI

## 📚 Learning Resources

### Documentation
- [Groq API Docs](https://console.groq.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Info](https://javascript.info/)

### Code Patterns
- [Async/Await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 🤝 Contributing

### Before Contributing
1. Fork repository
2. Create feature branch (`git checkout -b feature/your-feature`)
3. Make changes
4. Test thoroughly
5. Commit with clear messages
6. Push and create Pull Request

### Code Style Guidelines
- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing indentation (2 spaces)
- Keep functions small and focused
- Add error handling

### Commit Message Format
```
[Feature] Add new analysis feature
[Fix] Fix API timeout issue
[Docs] Update README
[Style] Improve CSS responsive design
```

## 📊 Analytics & Monitoring (Future)

```javascript
// Placeholder for future analytics
function trackEvent(eventName, eventData) {
  // Track feature usage
  // Monitor errors
  // Analyze user behavior
}
```

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic resume analysis
- ✅ Job description matching
- ✅ Groq API integration

### Phase 2 (Next)
- [ ] Firebase backend
- [ ] User authentication
- [ ] Analysis history
- [ ] Multiple file format support

### Phase 3 (Future)
- [ ] Resume templates
- [ ] LinkedIn integration
- [ ] Cover letter generator
- [ ] Batch analysis

## 📝 Documentation Standards

### Adding New Functions
```javascript
/**
 * Description of what the function does
 * @param {type} paramName - Description
 * @return {type} Description of return value
 */
function functionName(paramName) {
  // Implementation
}
```

### Updating README
- Keep it concise and clear
- Add examples for new features
- Update Table of Contents if needed
- Include warnings for breaking changes

## 🆘 Getting Help

- Open GitHub issue with detailed description
- Include browser console errors
- Provide steps to reproduce
- Share relevant code snippets

---

**Happy coding! 🚀**
