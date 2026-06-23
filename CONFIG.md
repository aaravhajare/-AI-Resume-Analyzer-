# Configuration Examples

## Groq API Configuration

### Getting Started with Groq

Groq provides free access to powerful open-source models through their API.

**Free Tier Benefits:**
- 30 requests per minute
- 2,000 tokens per request limit
- Multiple model options
- No credit card required (initially)

### Models Available

```javascript
// Available models in Groq API:
- mixtral-8x7b-32768  (recommended - balanced)
- llama2-70b-4096     (good for longer analysis)
- llama2-70b-chat
- gemma-7b-it
- mixtral-8x7b
```

### Current Configuration

**In `utils.js`:**
```javascript
this.model = 'mixtral-8x7b-32768';
this.baseURL = 'https://api.groq.com/openai/v1/chat/completions';
```

### Custom Configuration

To change the model:

1. Open `utils.js`
2. Find `class GroqAPIManager`
3. Modify the `this.model` property:

```javascript
// Change from:
this.model = 'mixtral-8x7b-32768';

// To:
this.model = 'llama2-70b-4096';
```

### API Key Storage

**Location:** Browser's localStorage
**Key Name:** `groq_api_key`
**Security:** Client-side only, never transmitted to unauthorized servers

### Storage Management

```javascript
// Save API key
StorageManager.setApiKey('your_key_here');

// Get API key
const key = StorageManager.getApiKey();

// Check if API key exists
if (StorageManager.hasApiKey()) { /* ... */ }

// Clear API key
StorageManager.clearApiKey();
```

### API Request Format

```javascript
// Request structure sent to Groq:
{
  "model": "mixtral-8x7b-32768",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert resume analyst..."
    },
    {
      "role": "user",
      "content": "Analyze this resume: ..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000,
  "top_p": 1
}
```

### Response Format

```javascript
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "{ JSON analysis response }"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 500,
    "completion_tokens": 1200
  }
}
```

## Environment Variables (Optional Backend)

If you decide to add a backend server:

```bash
# .env file
GROQ_API_KEY=your_key_here
GROQ_MODEL=mixtral-8x7b-32768
CORS_ORIGIN=http://localhost:3000
```

## Temperature Settings

The `temperature` parameter controls randomness:

```
0.0  = Deterministic (always same output)
0.5  = Balanced (current default for analysis)
1.0  = Creative (varied outputs)
```

**Recommendation:**
- Analysis: temperature = 0.5 (consistent results)
- Rewrite: temperature = 0.7 (varied suggestions)

## Rate Limiting

```
Free Tier: 30 requests per minute
Premium Tiers: Higher limits available
```

If you hit the limit:
```
Error: "rate_limit_exceeded"
Solution: Wait 60 seconds before retrying
```

## Deploying with API Key

### GitHub Pages (Static)
```html
<!-- The app doesn't need a backend -->
<!-- Users provide their own API key -->
<!-- No sensitive data stored -->
```

### With Backend Server (Optional)

If adding Node.js backend:

```javascript
// server.js (example)
const express = require('express');
const app = express();

app.post('/api/analyze', async (req, res) => {
  const { resume, jobDescription } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  
  // Call Groq API with protected key
  // Return results to frontend
});
```

### With Firebase (Future)

```javascript
// Planned integration
// Store analysis history
// User authentication
// Cloud functions for processing
```

## Testing Your Setup

### Step 1: Test API Key
```javascript
// Browser console:
const testAPI = new GroqAPIManager('your_api_key');
await testAPI.callAPI([{role: 'user', content: 'Say hi'}]);
```

### Step 2: Test Resume Analysis
```
1. Paste test resume
2. Click Analyze
3. Check browser console (F12) for errors
```

### Step 3: Monitor API Usage
- Visit [console.groq.com/keys](https://console.groq.com/keys)
- Check "Usage" tab
- See current month's requests

## API Error Codes

```
401 Unauthorized - Invalid API key
429 Too Many Requests - Rate limit exceeded
400 Bad Request - Invalid JSON or parameters
500 Internal Server Error - Groq API issue
```

## Troubleshooting

### API Key Issues
```
Problem: "401 Unauthorized"
Solution: Check API key at console.groq.com

Problem: "Invalid request"
Solution: Ensure resume has at least 50 characters
```

### Performance Issues
```
Problem: "Analysis takes >30 seconds"
Solution: 
- Try shorter resume (Groq processes slower with large inputs)
- Check internet connection
- Check Groq status page
```

### Local Development

```bash
# Serve locally
python -m http.server 8000

# Open in browser
http://localhost:8000

# Check API calls in Network tab
```

## Security Best Practices

✅ **DO:**
- Keep API key confidential
- Use HTTPS when possible
- Regenerate key if compromised
- Clear browser data after use

❌ **DON'T:**
- Commit API key to repository
- Share API key publicly
- Use in production without backend
- Store multiple keys in localStorage

## Future Enhancements

```javascript
// Planned features:
- Multiple API provider support
- OpenAI, Anthropic, HuggingFace
- Firebase integration
- Analysis history storage
- Batch resume processing
- Webhook support
```

---

**For support:** Check Groq's [documentation](https://console.groq.com/docs)
