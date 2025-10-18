const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

function createApp(axiosClient, config) {
    const app = express();
    const { uiMessage, ntfyUrl, ntfyUser, ntfyPassword, ntfyTopic } = config;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.get('/api/config', (req, res) => {
        res.json({
            uiMessage: uiMessage || 'Emergency Message'
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
            
            const requestOptions = {
                headers: {
                    'Content-Type': 'text/plain'
                }
            };
            
            if (ntfyUser && ntfyPassword) {
                requestOptions.auth = {
                    username: ntfyUser,
                    password: ntfyPassword
                };
            }
            
            const ntfyResponse = await axiosClient.post(`${ntfyUrl}/${ntfyTopic}`, fullMessage, requestOptions);
            
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

    return app;
}

// Export the createApp function for testing
module.exports = createApp;

// Only start server if this file is run directly (not imported)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    // Environment variables for ntfy configuration
    const NTFY_URL = process.env.NTFY_URL || 'https://ntfy.sh';
    const NTFY_USER = process.env.NTFY_USER;
    const NTFY_PASSWORD = process.env.NTFY_PASSWORD;
    const NTFY_TOPIC = process.env.NTFY_TOPIC;
    const UI_MESSAGE = process.env.UI_MESSAGE || 'Emergency Message';

    if (!NTFY_TOPIC) {
        console.error('Missing required environment variable: NTFY_TOPIC');
        process.exit(1);
    }

    // Create app with configuration
    const config = {
        uiMessage: UI_MESSAGE,
        ntfyUrl: NTFY_URL,
        ntfyUser: NTFY_USER,
        ntfyPassword: NTFY_PASSWORD,
        ntfyTopic: NTFY_TOPIC
    };
    
    const app = createApp(axios, config);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`ntfy URL: ${NTFY_URL}`);
        console.log(`ntfy Topic: ${NTFY_TOPIC}`);
    });
}
