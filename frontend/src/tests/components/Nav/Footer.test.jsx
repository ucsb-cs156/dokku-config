import { render, screen, waitFor } from "@testing-library/react";
import Footer from "main/components/Nav/Footer";
import { afterEach, expect, beforeEach, vi, describe, test } from "vitest";

// Use doMock and resetModules for isolated mocks.
// The vi.doMock and vi.resetModules calls should be inside the describe blocks.

describe("Footer tests", () => {
  describe("SystemInfo returns content", () => {
    beforeEach(() => {
      // Clears the module cache to ensure each test suite starts fresh.
      vi.resetModules();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    test("renders correctly with system info content", async () => {
      render(<Footer />);
      // Wait for the query to resolve and content to appear.
      await waitFor(() => {
        expect(screen.getByText(/This is a sample/)).toBeInTheDocument();
      });

      const expectedText = "This is a sample frontend only webapp.";

      expect(screen.getByTestId("Footer").textContent).toBe(expectedText);
    });
  });
});
