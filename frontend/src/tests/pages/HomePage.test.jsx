import { render, screen } from "@testing-library/react";
import HomePage from "main/pages/HomePage";
import { MemoryRouter } from "react-router";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

describe("HomePage tests", async () => {
  const exampleParams = {
    appname: "foobar",
    email: "cgaucho@ucsb.edu",
    org: "ucsb-cs156-s26",
    repo: "team01",
    google_client_id: "google_client_id",
    google_client_secret: "google_client_secret",
  };

  test("renders without crashing", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    await screen.findByText(/Dokku Config/);
    expect(screen.getByText(/Dokku Config/)).toBeInTheDocument();
  });

  test("uses values from local storage when set", async () => {
    // Mock localStorage
    const mockSetItem = vi.fn();
    const mockGetItem = vi.fn((key) => {
      if (key === "HomePage.params") {
        return JSON.stringify(exampleParams);
      }
      return null;
    });
    Object.defineProperty(window, "localStorage", {
      value: {
        setItem: mockSetItem,
        getItem: mockGetItem,
      },
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const testId = "DokkuScriptForm";
    const appnameInput = screen.getByTestId(`${testId}-appname`);
    expect(appnameInput).toHaveValue("foobar");

    await userEvent.clear(appnameInput);
    await userEvent.type(appnameInput, "barfoo");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(mockSetItem).toHaveBeenCalledWith(
      "HomePage.params",
      JSON.stringify({ ...exampleParams, appname: "barfoo" }),
    );
  });
});
