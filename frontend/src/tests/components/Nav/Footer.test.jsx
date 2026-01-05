import { render, screen } from "@testing-library/react";
import Footer from "main/components/Nav/Footer";
import { afterEach, expect, beforeEach, vi, describe, test } from "vitest";

// Use doMock and resetModules for isolated mocks.
// The vi.doMock and vi.resetModules calls should be inside the describe blocks.

describe("Footer tests", () => {
  const expectedText = [
    `The purpose of this webapp is to assist students and course staff in CMPSC156 with configuring dokku deployments for full stack web apps for CMPSC 156, a course in Software Engineering at UC Santa Barbara.`,
    `This webapp is open source; the source code is available on GitHub.`,
    `This also serves as an example of a webapp that is "frontend only" (no backend) built using React with the CMPSC 156 toolchain and deployed on Github Pages.`,
    `Copyright © 2026 by the Regents of the University of California, All rights reserved.`,
  ];

  describe("<Footer />", () => {
    beforeEach(() => {
      // Clears the module cache to ensure each test suite starts fresh.
      vi.resetModules();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    test("renders text correctly", async () => {
      render(<Footer />);

      await screen.findByTestId("Footer");

      const actual = screen
        .getByTestId("Footer")
        .textContent.replace(/\s+/g, " ")
        .trim();

      const expectedNormalized = expectedText.map((s) =>
        s.replace(/\s+/g, " ").trim(),
      );

      expectedNormalized.forEach((s) => {
        expect(actual).toContain(s);
      });
    });
  });
});
