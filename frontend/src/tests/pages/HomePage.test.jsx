import { render, screen } from "@testing-library/react";
import HomePage from "main/pages/HomePage";
import { MemoryRouter } from "react-router";
import { expect } from "vitest";

describe("HomePage tests", () => {
  test("renders without crashing", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    await screen.findByText(/Dokku Config/);
    expect(screen.getByText(/Dokku Config/)).toBeInTheDocument();
  });
});
