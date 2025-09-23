import { faker } from '@faker-js/faker';

interface NewsletterSubscriberData {
  id?: string;
  email?: string;
  name?: string;
  surname?: string;
  createdAt?: Date;
}

interface NewsletterRequestData {
  email?: string;
  name?: string;
  surname?: string;
}

/**
 * Factory for creating newsletter subscriber test data
 * Provides realistic, randomized data with optional overrides
 */
export class NewsletterFactory {
  /**
   * Creates a newsletter subscriber with realistic data
   */
  static createSubscriber(overrides: NewsletterSubscriberData = {}): NewsletterSubscriberData {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      createdAt: faker.date.recent(),
      ...overrides,
    };
  }

  /**
   * Creates a valid newsletter request payload
   */
  static createRequest(overrides: NewsletterRequestData = {}): NewsletterRequestData {
    return {
      email: faker.internet.email().toLowerCase(),
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      ...overrides,
    };
  }

  /**
   * Creates multiple subscribers for bulk testing
   */
  static createSubscribers(count: number, overrides: NewsletterSubscriberData = {}): NewsletterSubscriberData[] {
    return Array.from({ length: count }, () => this.createSubscriber(overrides));
  }

  /**
   * Creates invalid request data for error testing
   */
  static createInvalidRequest(type: 'email' | 'name' | 'surname' | 'missing'): Partial<NewsletterRequestData> {
    const base = this.createRequest();

    switch (type) {
      case 'email':
        return { ...base, email: 'invalid-email-format' };
      case 'name':
        return { ...base, name: '' };
      case 'surname':
        return { ...base, surname: '' };
      case 'missing':
        return { email: base.email! }; // Missing name and surname
      default:
        return base;
    }
  }

  /**
   * Creates edge case data for boundary testing
   */
  static createEdgeCase(type: 'long' | 'special' | 'unicode'): NewsletterRequestData {
    switch (type) {
      case 'long':
        return {
          email: 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com',
          name: 'N'.repeat(100),
          surname: 'S'.repeat(100),
        };
      case 'special':
        return {
          email: 'test+special@example.com',
          name: "O'Connor",
          surname: 'Van der Berg',
        };
      case 'unicode':
        return {
          email: 'test@münchen.de',
          name: 'José',
          surname: 'Müller',
        };
      default:
        return this.createRequest();
    }
  }
}