import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app';


const originalPrisma = await import('../../shared/prisma/index');
const mockQueryRaw = jest.fn<any>();


Object.defineProperty(originalPrisma.default, '$queryRaw', {
  value: mockQueryRaw,
  writable: true,
});

  describe('Health Check Endpoint', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('GET /health', () => {
      it('should return 200 and healthy status when database is responsive', async () => {

        mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

        const response = await request(app)
          .get('/api/health')
          .expect(200);

        expect(response.body).toMatchObject({
          status: 'healthy',
          database: 'connected',
          version: '1.0.0'
        });
        expect(response.body.timestamp).toBeDefined();
        expect(response.body.uptime).toBeGreaterThan(0);
        expect(response.body.timeElapsed).toBeLessThan(5000);
      });

      it('should return 503 when database connection fails', async () => {

        const dbError = new Error('Database connection failed');
        mockQueryRaw.mockRejectedValueOnce(dbError);

        const response = await request(app)
          .get('/api/health')
          .expect(503);

        expect(response.body.status).toBe("unavailable");
      });

      it('should include all required health check fields', async () => {
        mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

        const response = await request(app)
          .get('/api/health')
          .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('version');
        expect(response.body).toHaveProperty('database');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('timeElapsed');
      });
      it('should return degraded for queries > 5s', async () => {
        mockQueryRaw.mockImplementation(async () => {
          await new Promise(resolve => setTimeout(resolve, 6000));
          return [{ '?column?': 1 }];
        });

        const response = await request(app)
          .get('/api/health')
          .expect(503);

        expect(response.body.status).toBe('degraded');
        expect(response.body.timeElapsed).toBeGreaterThan(5000);
      }, 10000);
    });
  });