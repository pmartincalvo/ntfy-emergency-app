const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables for ntfy configuration
const NTFY_URL = process.env.NTFY_URL;
const NTFY_USER = process.env.NTFY_USER;
const NTFY_PASSWORD = process.env.NTFY_PASSWORD;
const NTFY_TOPIC = process.env.NTFY_TOPIC;
const UI_MESSAGE = process.env.UI_MESSAGE;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Validate environment variables
if (!NTFY_URL || !NTFY_USER || !NTFY_PASSWORD) {
    console.error('Missing required environment variables: NTFY_URL, NTFY_USER, NTFY_PASSWORD');
    process.exit(1);
}

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to get UI configuration
app.get('/api/config', (req, res) => {
    res.json({
        uiMessage: UI_MESSAGE || 'Emergency Message'
    });
});

// Route to handle message submission
app.post('/send-message', async (req, res) => {
    try {
        const { name, message } = req.body;
        
        // Validate input
        if (!name || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name and message are required' 
            });
        }
        
        // Concatenate name and message
        const fullMessage = `${name}: ${message}`;
        
        // Send to ntfy
        const ntfyResponse = await axios.post(`${NTFY_URL}/${NTFY_TOPIC}`, fullMessage, {
            auth: {
                username: NTFY_USER,
                password: NTFY_PASSWORD
            },
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        
        if (ntfyResponse.status === 200) {
            res.json({ success: true, message: 'Message sent successfully' });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Error sending message' 
            });
        }
        
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ntfy URL: ${NTFY_URL}`);
    console.log(`Ntfy Topic: ${NTFY_TOPIC}`);
});
