const request = require('supertest');
const axios = require('axios');
const createApp = require('./server');

// Mock axios to avoid actual ntfy calls during testing
jest.mock('axios');
const mockedAxios = axios;

// Create test configuration
const testConfig = {
  uiMessage: 'Test Emergency Message',
  ntfyUrl: 'https://ntfy.sh',
  ntfyUser: 'testuser',
  ntfyPassword: 'testpass',
  ntfyTopic: 'test-topic'
};

// Create app with mocked axios and test config
const app = createApp(mockedAxios, testConfig);

describe('Emergency Message App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should serve the index.html file', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Emergency Message');
    });
  });

  describe('GET /api/config', () => {
    it('should return the UI message configuration', async () => {
      const response = await request(app).get('/api/config');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        uiMessage: 'Test Emergency Message'
      });
    });
  });

  describe('POST /send-message', () => {
    it('should send a message successfully', async () => {
      mockedAxios.post.mockResolvedValue({ status: 200 });

      const response = await request(app)
        .post('/send-message')
        .send({
          name: 'Test User',
          message: 'Test emergency message'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Message sent successfully'
      });

      // Verify axios was called with correct parameters
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://ntfy.sh/test-topic',
        'From [Test User], message: Test emergency message',
        {
          auth: {
            username: 'testuser',
            password: 'testpass'
          },
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/send-message')
        .send({
          message: 'Test message'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Name and message are required'
      });
    });

    it('should return 400 when message is missing', async () => {
      const response = await request(app)
        .post('/send-message')
        .send({
          name: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Name and message are required'
      });
    });

    it('should handle ntfy API errors', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      const response = await request(app)
        .post('/send-message')
        .send({
          name: 'Test User',
          message: 'Test message'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error'
      });
    });

    it('should handle non-200 ntfy responses', async () => {
      mockedAxios.post.mockResolvedValue({ status: 500 });

      const response = await request(app)
        .post('/send-message')
        .send({
          name: 'Test User',
          message: 'Test message'
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Error sending message'
      });
    });
  });
});
