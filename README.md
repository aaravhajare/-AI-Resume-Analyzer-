# ResumeIQ – AI Resume Analyzer

An intelligent, AI-powered resume analyzer that provides comprehensive feedback on your resume using the Groq API. Get actionable insights to optimize your resume for ATS systems and land your dream job.

## 🎯 Features

### Core Analysis Features

1. **📊 ATS Score (0-100)**
   - Evaluates resume compatibility with Applicant Tracking Systems
   - Checks: Keywords, Formatting, Skills, Experience, Education
   - Provides detailed breakdown of score components

2. **📝 Resume Summary**
   - Generates professional, concise summary of your qualifications
   - Highlights key strengths and expertise

3. **✨ Strengths**
   - Identifies 4-5 key strengths in your resume
   - Highlights what's working well

4. **⚠️ Weaknesses**
   - Pinpoints 4-5 areas for improvement
   - Actionable feedback on gaps

5. **🔍 Missing Keywords**
   - Identifies missing technical keywords
   - Lists missing tools and platforms
   - Highlights missing soft skills

6. **💡 Improvement Suggestions**
   - Provides before/after examples
   - Shows how to rewrite weak sections
   - Includes specific, actionable improvements

7. **🛠️ Skill Categorization**
   - Technical Skills (languages, frameworks, databases)
   - Tools & Platforms (Git, Docker, AWS, etc.)
   - Soft Skills (communication, leadership, etc.)

8. **✏️ Professional Rewrite**
   - AI-generated professional version of your resume
   - Ready to copy and use

### Advanced Features

9. **🎯 Job Description Matching (Optional)**
   - Compare resume against target job description
   - Match Score showing compatibility
   - Shows matched and missing keywords
   - Provides tailored recommendations

10. **📥 Export Report**
    - Download analysis as text report
    - Save for future reference

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Modern semantic markup
- **CSS3**: Beautiful, responsive styling with dark theme
- **Vanilla JavaScript**: No frameworks needed

### AI & Backend
- **Groq API**: Fast, reliable LLM API
  - Model: Mixtral-8x7b-32768
  - Free tier available
  - High token limits
- **Local Storage**: Save API keys securely in browser

### Features
- ✅ Fully client-side (no backend server required)
- ✅ User API key configuration
- ✅ Dark mode UI with modern design
- ✅ Real-time analysis
- ✅ Responsive design (mobile, tablet, desktop)

## 📋 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Free Groq API key

### Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd -AI-Resume-Analyzer-
   ```

2. **Get Your Groq API Key**
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up for free
   - Create an API key from the dashboard
   - Keep it secure (never commit to version control)

3. **Open the Application**
   - Open `index.html` in your web browser
   - Or serve locally using a Python server:
     ```bash
     python -m http.server 8000
     ```
   - Visit `http://localhost:8000`

4. **Configure API Key**
   - Click the ⚙️ **Settings** button
   - Paste your Groq API key
   - Click "Save API Key"
   - The app will verify the key automatically

5. **Start Analyzing**
   - Paste your resume in the input field
   - (Optional) Paste target job description for job matching
   - Click "Analyze Resume"
   - View comprehensive analysis results

## 💻 Usage Guide

### Basic Analysis

```
1. Paste your resume
2. Click "Analyze Resume"
3. Review all 8 analysis categories
4. Download report if needed
```

### With Job Description

```
1. Paste your resume
2. Paste target job description
3. Click "Analyze Resume"
4. View job matching percentage and recommendations
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+S` / `Cmd+Shift+S` | Open Settings |
| `Ctrl+Shift+C` / `Cmd+Shift+C` | Clear Form |
| `Ctrl+Enter` / `Cmd+Enter` | Analyze Resume |

## 📊 ATS Score Breakdown

The ATS score (0-100) is calculated based on:

| Factor | Points | Details |
|--------|--------|---------|
| Keywords Presence | 20 | Technical & soft skills found |
| Formatting | 10 | Proper line structure & sections |
| Sections | 15 | Experience, Education, Skills, etc. |
| Contact Info | 6 | Email, phone presence |
| Measurable Results | 5 | Numbers, percentages, metrics |
| Base Score | 50 | Starting points |

**Score Interpretation:**
- 🟢 **70-100**: Excellent - Strong ATS compatibility
- 🟡 **50-69**: Good - Some improvements recommended
- 🔴 **Below 50**: Needs Work - Follow improvement suggestions

## 🔐 Security & Privacy

- **No data collection**: Your resume is never stored on any server
- **Local storage only**: API key is stored securely in your browser's local storage
- **Direct API calls**: Your resume is only sent to Groq API for analysis
- **HTTPS recommended**: Use over HTTPS connection
- **Never commit API keys**: Add `.env` to `.gitignore`

## 📁 Project Structure

```
-AI-Resume-Analyzer-/
├── index.html          # Main HTML interface
├── styles.css          # Styling and responsive design
├── script.js           # Main application logic
├── utils.js            # Utility functions and API handlers
└── README.md           # This file
```

## 🔧 API Configuration

### Environment Variables (Optional for Backend)

Create a `.env` file if deploying with backend:

```env
GROQ_API_KEY=your_api_key_here
GROQ_MODEL=mixtral-8x7b-32768
```

### API Limits

Groq Free Tier:
- **Rate Limit**: 30 requests per minute
- **Max Tokens**: 2,000 per request
- **Models Available**: Mixtral, LLaMA 2, etc.

## 🚀 Deployment

### Deploy to GitHub Pages

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Then enable GitHub Pages in repository settings.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy
```

### Self-Hosted (Node.js Server)

```bash
npm install http-server -g
http-server
```

## 🐛 Troubleshooting

### "API Key verification failed"
- Check API key is correct at [console.groq.com](https://console.groq.com)
- Ensure you're connected to internet
- Try regenerating API key

### "Analysis failed: Rate limit exceeded"
- Wait a minute before trying again
- Groq free tier: 30 requests/minute

### Resume Analysis Takes Long
- Groq API may be processing
- Network connection issues
- Try smaller resume or simpler format

### Results Not Showing
- Check browser console (F12) for errors
- Ensure API key is configured
- Try refreshing the page

## 📝 Example Resume

```
John Doe
Email: john@example.com | Phone: (555) 123-4567
GitHub: github.com/johndoe | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years building scalable web applications using React, Node.js, and AWS. Strong problem solver with proven track record delivering 15+ projects improving user engagement by 30%.

TECHNICAL SKILLS
Languages: JavaScript, Python, Java, TypeScript
Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express, Django, MongoDB, PostgreSQL
Tools: Git, Docker, AWS, GitHub, VS Code

EXPERIENCE
Senior Developer - Tech Corp (2021-Present)
- Developed 20+ responsive web applications improving page load time by 40%
- Led team of 5 developers, mentored 3 junior developers
- Implemented CI/CD pipeline reducing deployment time by 60%

PROJECTS
Portfolio Website | React, Firebase, Tailwind CSS
- Built personal portfolio with 1000+ monthly visitors
- Implemented blog functionality using Firebase

EDUCATION
B.S. Computer Science - State University (2019)
```

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## ⭐ Support

If you find this useful, please star the repository! 

## 📧 Contact

For questions or feedback:
- Open an issue on GitHub
- Create a discussion thread

## 🎓 Learning Resources

- [Groq API Documentation](https://console.groq.com/docs)
- [Resume Writing Best Practices](https://www.indeed.com/career-advice/resumes)
- [ATS Optimization Guide](https://www.indeed.com/career-advice/resumes/how-to-optimize-your-resume-for-ats)

## 🗺️ Roadmap

- [ ] Multiple resume format support (PDF parsing)
- [ ] Resume templates
- [ ] Comparison with competitor resumes
- [ ] Custom role profiles
- [ ] History tracking
- [ ] Firebase backend integration
- [ ] User accounts and cloud sync
- [ ] Batch resume analysis
- [ ] LinkedIn profile integration
- [ ] Cover letter generator

---

**Made with ❤️ by AI Resume Analyzer Team**

Last Updated: 2024
