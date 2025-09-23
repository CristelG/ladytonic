import { NewsletterFactory } from '../factories/newsletter.factory';
import request from 'supertest';
import type { Application } from 'express';

/**
 * Builder pattern for creating complex test scenarios
 * Provides fluent API for test setup
 */
export class NewsletterTestBuilder {
  private app: Application;
  private requestData: any = {};
  private mockSetup: Array<() => void> = [];

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Sets up the request with valid data
   */
  withValidData() {
    this.requestData = NewsletterFactory.createRequest();
    return this;
  }

  /**
   * Sets up the request with specific data
   */
  withData(data: any) {
    this.requestData = { ...this.requestData, ...data };
    return this;
  }

  /**
   * Sets up the request with invalid email
   */
  withInvalidEmail() {
    this.requestData = NewsletterFactory.createInvalidRequest('email');
    return this;
  }

  /**
   * Sets up the request with edge case data
   */
  withEdgeCase(type: 'long' | 'special' | 'unicode') {
    this.requestData = NewsletterFactory.createEdgeCase(type);
    return this;
  }

  /**
   * Adds mock setup function
   */
  withMock(setupFn: () => void) {
    this.mockSetup.push(setupFn);
    return this;
  }

  /**
   * Executes the POST request and returns response
   */
  async post() {
    // Execute all mock setups
    this.mockSetup.forEach(setup => setup());

    return request(this.app)
      .post('/api/newsletter')
      .send(this.requestData);
  }

  /**
   * Executes the GET request and returns response
   */
  async get() {
    // Execute all mock setups
    this.mockSetup.forEach(setup => setup());

    return request(this.app)
      .get('/api/newsletter');
  }
}

/**
 * Factory function for creating test builders
 */
export function createNewsletterTest(app: Application): NewsletterTestBuilder {
  return new NewsletterTestBuilder(app);
}