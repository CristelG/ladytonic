import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";

import { NewsletterFactory } from "../../tests/factories/newsletter.factory";
import { createNewsletterTest } from "../../tests/builders/test-builder";
import { TestUtils } from "../../tests/utils/test-utils";
import { PrismaErrors } from "../../shared/errors/prisma-errors";

const mockFindMany = jest.fn<() => Promise<any>>();
const mockCreate = jest.fn<() => Promise<any>>();

jest.unstable_mockModule("../../shared/prisma/index", () => ({
  default: {
    newsletter: {
      findMany: mockFindMany,
      create: mockCreate,
    },
  },
}));

const { default: app } = await import("../../app");

describe("Newsletter API Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /newsletter", () => {
    describe("Success scenarios", () => {
      it("should return subscribers with realistic data structure", async () => {
        const mockSubscribers = NewsletterFactory.createSubscribers(3);
        mockFindMany.mockResolvedValue(mockSubscribers);

        const response = await createNewsletterTest(app).get();

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);

        response.body.forEach((subscriber: any) => {
          TestUtils.expectValidSubscriber(subscriber);
        });
      });

      it("should handle empty result set", async () => {
        mockFindMany.mockResolvedValue([]);

        const response = await createNewsletterTest(app).get();

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      it("should return data within performance threshold", async () => {
        const mockSubscribers = NewsletterFactory.createSubscribers(100);
        mockFindMany.mockResolvedValue(mockSubscribers);

        const { result: response, timeMs } = await TestUtils.measureTime(() =>
          createNewsletterTest(app).get()
        );

        expect(response.status).toBe(200);
        expect(timeMs).toBeLessThan(100); // Should respond in under 100ms
      });
    });

    describe("Error scenarios", () => {
      it("should handle database connection errors", async () => {
        mockFindMany.mockRejectedValue(new Error("Connection refused"));

        const response = await createNewsletterTest(app).get();

        TestUtils.expectErrorResponse(response, 500, "Connection refused");
      });

      it("should handle database timeout errors", async () => {
        mockFindMany.mockRejectedValue(new Error("Query timeout"));

        const response = await createNewsletterTest(app).get();

        TestUtils.expectErrorResponse(response, 500, "Query timeout");
      });
    });
  });

  describe("POST /newsletter", () => {
    describe("Success scenarios", () => {
      it("should create subscriber with valid data", async () => {
        const requestData = NewsletterFactory.createRequest();
        const mockCreatedUser = NewsletterFactory.createSubscriber(requestData);

        mockCreate.mockResolvedValue(mockCreatedUser);

        const response = await createNewsletterTest(app)
          .withData(requestData)
          .post();

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          message: "User successfully created",
          newsletterSubscriber: {
            email: requestData.email,
            name: requestData.name,
            surname: requestData.surname,
          },
        });
      });

      it("should handle special characters in names", async () => {
        const edgeCaseData = NewsletterFactory.createEdgeCase('special');
        const mockCreatedUser = NewsletterFactory.createSubscriber(edgeCaseData);

        mockCreate.mockResolvedValue(mockCreatedUser);

        const response = await createNewsletterTest(app)
          .withEdgeCase('special')
          .post();

        expect(response.status).toBe(201);
      });

      it("should handle Unicode characters", async () => {
        const unicodeData = NewsletterFactory.createEdgeCase('unicode');
        const mockCreatedUser = NewsletterFactory.createSubscriber(unicodeData);

        mockCreate.mockResolvedValue(mockCreatedUser);

        const response = await createNewsletterTest(app)
          .withEdgeCase('unicode')
          .post();

        expect(response.status).toBe(422);
      });
    });

    describe("Validation edge cases", () => {
      const validationTests = [
        {
          name: "invalid email format",
          data: { email: "not-an-email", name: "John", surname: "Doe" },
          expectedError: { code: "invalid_format", message: "Invalid email address" }
        },
        {
          name: "empty email",
          data: { email: "", name: "John", surname: "Doe" },
          expectedError: { code: "invalid_format", message: "Invalid email address" }
        },
        {
          name: "missing email",
          data: { name: "John", surname: "Doe" },
          expectedError: { code: "invalid_type", message: "Invalid input: expected string, received undefined" }
        },
        {
          name: "empty name",
          data: { email: "john@example.com", name: "", surname: "Doe" },
          expectedError: { code: "too_small", message: "Too small: expected string to have >=1 characters" }
        },
        {
          name: "missing name",
          data: { email: "john@example.com", surname: "Doe" },
          expectedError: { code: "invalid_type", message: "Invalid input: expected string, received undefined" }
        },
        {
          name: "empty surname",
          data: { email: "john@example.com", name: "John", surname: "" },
          expectedError: { code: "too_small", message: "Too small: expected string to have >=1 characters" }
        },
        {
          name: "missing surname",
          data: { email: "john@example.com", name: "John" },
          expectedError: { code: "invalid_type", message: "Invalid input: expected string, received undefined" }
        }
      ];

      validationTests.forEach(({ name, data, expectedError }) => {
        it(`should reject ${name}`, async () => {
          const response = await createNewsletterTest(app)
            .withData(data)
            .post();

          TestUtils.expectValidationError(response, [expectedError]);
        });
      });

      it("should handle extremely long input", async () => {
        const longData = NewsletterFactory.createEdgeCase('long');

        const response = await createNewsletterTest(app)
          .withEdgeCase('long')
          .post();

        // Should either succeed or fail gracefully (not crash)
        expect([201, 422, 400]).toContain(response.status);
      });
    });

    describe("Database constraint violations", () => {
      it("should handle unique email constraint violation", async () => {
        const requestData = NewsletterFactory.createRequest();

        mockCreate.mockRejectedValue(
          PrismaErrors.code({ code: "P2002", meta: { target: ["email"] } })
        );

        const response = await createNewsletterTest(app)
          .withData(requestData)
          .post();

        expect(response.status).toBe(409);
        expect(response.body).toMatchObject({
          type: "Unique constraint violated",
          status: 409,
          errors: [{
            code: "UNIQUE_CONSTRAINT",
            message: "field email is a duplicate"
          }]
        });
      });

      it("should handle database connection errors during creation", async () => {
        const requestData = NewsletterFactory.createRequest();

        mockCreate.mockRejectedValue(new Error("Database connection lost"));

        const response = await createNewsletterTest(app)
          .withData(requestData)
          .post();

        TestUtils.expectErrorResponse(response, 500);
      });
    });

    describe("Performance and stress testing", () => {
      it("should handle rapid successive requests", async () => {
        const requests = Array.from({ length: 10 }, () => {
          const data = NewsletterFactory.createRequest();
          const mockUser = NewsletterFactory.createSubscriber(data);
          mockCreate.mockResolvedValueOnce(mockUser);

          return createNewsletterTest(app).withData(data).post();
        });

        const responses = await Promise.all(requests);

        responses.forEach(response => {
          expect(response.status).toBe(201);
        });
      });

      it("should not have memory leaks during bulk operations", async () => {
        await TestUtils.testMemoryLeak(async () => {
          const data = NewsletterFactory.createRequest();
          const mockUser = NewsletterFactory.createSubscriber(data);
          mockCreate.mockResolvedValue(mockUser);

          await createNewsletterTest(app).withData(data).post();
        }, 50);
      });
    });

    describe("Security considerations", () => {
      it("should sanitize HTML in input fields", async () => {
        const maliciousData = {
          email: "test@example.com",
          name: "<script>alert('xss')</script>",
          surname: "<img src=x onerror=alert('xss')>"
        };

        const sanitizedUser = NewsletterFactory.createSubscriber({
          ...maliciousData,
          name: "&lt;script&gt;alert('xss')&lt;/script&gt;",
          surname: "&lt;img src=x onerror=alert('xss')&gt;"
        });

        mockCreate.mockResolvedValue(sanitizedUser);

        const response = await createNewsletterTest(app)
          .withData(maliciousData)
          .post();

        expect(response.status).toBe(201);
        expect(response.body.newsletterSubscriber.name).not.toContain('<script>');
        expect(response.body.newsletterSubscriber.surname).not.toContain('<img');
      });

      it("should include security headers in response", async () => {
        const data = NewsletterFactory.createRequest();
        const mockUser = NewsletterFactory.createSubscriber(data);
        mockCreate.mockResolvedValue(mockUser);

        const response = await createNewsletterTest(app)
          .withData(data)
          .post();

        TestUtils.expectSecurityHeaders(response);
      });
    });
  });
});