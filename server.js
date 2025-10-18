const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const UI_MESSAGE = process.env.UI_MESSAGE || 'Emergency Message';

// Environment variables for ntfy configuration
const NTFY_URL = process.env.NTFY_URL;
const NTFY_USER = process.env.NTFY_USER;
const NTFY_PASSWORD = process.env.NTFY_PASSWORD;
const NTFY_TOPIC = process.env.NTFY_TOPIC;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

if (!NTFY_URL || !NTFY_USER || !NTFY_PASSWORD || !NTFY_TOPIC) {
    console.error('Missing required environment variables: NTFY_URL, NTFY_USER, NTFY_PASSWORD, NTFY_TOPIC');
    process.exit(1);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/config', (req, res) => {
    res.json({
        uiMessage: UI_MESSAGE || 'Emergency Message'
    });
});

app.post('/send-message', async (req, res) => {
    try {
        const { name, message } = req.body;
        
        if (!name || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name and message are required' 
            });
        }
        
        const fullMessage = `From [${name}], message: ${message}`;
        
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
    console.log(`ntfy URL: ${NTFY_URL}`);
    console.log(`ntfy Topic: ${NTFY_TOPIC}`);
});
