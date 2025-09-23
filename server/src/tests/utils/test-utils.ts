import { expect } from '@jest/globals';

/**
 * Custom matchers and utilities for senior-level testing
 */
export class TestUtils {
  /**
   * Asserts that an object matches the newsletter subscriber schema
   */
  static expectValidSubscriber(subscriber: any) {
    expect(subscriber).toMatchObject({
      id: expect.any(String),
      email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      name: expect.any(String),
      surname: expect.any(String),
      createdAt: expect.any(String),
    });
  }

  /**
   * Asserts that response has proper error structure
   */
  static expectErrorResponse(response: any, status: number, type?: string) {
    expect(response.status).toBe(status);
    expect(response.body).toMatchObject({
      type: expect.any(String),
    });

    if (type) {
      expect(response.body.type).toBe(type);
    }
  }

  /**
   * Asserts that validation error has proper structure
   */
  static expectValidationError(response: any, expectedErrors?: Array<{ code: string; message: string }>) {
    this.expectErrorResponse(response, 422, 'Validation failed');

    expect(response.body).toMatchObject({
      status: 422,
      errors: expect.any(Array),
    });

    if (expectedErrors) {
      expectedErrors.forEach((expectedError, index) => {
        expect(response.body.errors[index]).toMatchObject(expectedError);
      });
    }
  }

  /**
   * Asserts that response time is within acceptable limits
   */
  static expectPerformance(response: any, maxTimeMs: number = 100) {
    const responseTime = parseInt(response.headers['x-response-time'] || '0');
    expect(responseTime).toBeLessThan(maxTimeMs);
  }

  /**
   * Asserts that response has proper security headers
   */
  static expectSecurityHeaders(response: any) {
    expect(response.headers).toMatchObject({
      'x-frame-options': expect.any(String),
      'x-content-type-options': expect.any(String),
    });
  }

  /**
   * Creates a promise that resolves after specified time
   */
  static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generates random string for testing
   */
  static randomString(length: number = 10): string {
    return Math.random().toString(36).substring(2, length + 2);
  }

  /**
   * Tests for memory leaks by checking object references
   */
  static async testMemoryLeak(operation: () => Promise<void>, iterations: number = 10) {
    const initialMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < iterations; i++) {
      await operation();
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory should not increase significantly (threshold: 10MB)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  }

  /**
   * Measures execution time of async operations
   */
  static async measureTime<T>(operation: () => Promise<T>): Promise<{ result: T; timeMs: number }> {
    const start = performance.now();
    const result = await operation();
    const end = performance.now();

    return {
      result,
      timeMs: end - start,
    };
  }
}