import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import AppNavbar from "main/components/Nav/AppNavbar";
import { expect } from "vitest";

describe("AppNavbar tests", () => {

  test("renders correctly", async () => {
    render(
        <MemoryRouter>
          <AppNavbar />
        </MemoryRouter>
    );
    await screen.findByTestId("AppNavbar");
    expect(screen.getByTestId("AppNavbar")).toBeInTheDocument();
  });
});
