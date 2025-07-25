import axios, { AxiosResponse } from 'axios';

// Mock axios completely
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create mock Http instance with proper typing
const mockHttp = {
  get: jest.fn(),
  post: jest.fn()
} as any;

// Mock axios.create to return our mock instance
mockedAxios.create = jest.fn(() => mockHttp as any);

// Import after mocking
const { getLocaleJson, sendMessage } = require('./Service');

describe('Service Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLocaleJson', () => {
    test('should fetch locale data successfully', async () => {
      const mockData = { common: { hello: 'Hello' } };
      const mockResponse = { data: mockData, status: 200 };
      
      mockHttp.get.mockResolvedValue(mockResponse);

      const result = await getLocaleJson('/locale/en.json');

      expect(mockHttp.get).toHaveBeenCalledWith('/locale/en.json');
      expect(result).toEqual({
        data: mockData,
        status: 200
      });
    });

    test('should handle API errors', async () => {
      const error = new Error('Network Error');
      mockHttp.get.mockRejectedValue(error);

      await expect(getLocaleJson('/locale/en.json')).rejects.toThrow('Network Error');
    });
  });

  describe('sendMessage', () => {
    test('should send contact message successfully', async () => {
      const mockResponse = { data: 'Message sent successfully' };
      mockHttp.post.mockResolvedValue(mockResponse);

      const result = await sendMessage('test@example.com', 'Test message');

      expect(mockHttp.post).toHaveBeenCalledWith('/contact', {
        email: 'test@example.com',
        message: 'Test message'
      });
      expect(result).toBe('Message sent successfully');
    });

    test('should handle send message errors', async () => {
      const error = new Error('Failed to send message');
      mockHttp.post.mockRejectedValue(error);

      await expect(sendMessage('test@example.com', 'Test message')).rejects.toThrow('Failed to send message');
    });

    test('should handle empty email', async () => {
      const mockResponse = { data: 'Invalid email' };
      mockHttp.post.mockResolvedValue(mockResponse);

      const result = await sendMessage('', 'Test message');

      expect(mockHttp.post).toHaveBeenCalledWith('/contact', {
        email: '',
        message: 'Test message'
      });
      expect(result).toBe('Invalid email');
    });

    test('should handle empty message', async () => {
      const mockResponse = { data: 'Invalid message' };
      mockHttp.post.mockResolvedValue(mockResponse);

      const result = await sendMessage('test@example.com', '');

      expect(mockHttp.post).toHaveBeenCalledWith('/contact', {
        email: 'test@example.com',
        message: ''
      });
      expect(result).toBe('Invalid message');
    });
  });
});