import { render, screen } from "@testing-library/react";
import HomePage from "main/pages/HomePage";
import { MemoryRouter } from "react-router";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

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

  test("passed values from form to script", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const testId = "DokkuScriptForm";
    const appnameInput = screen.getByTestId(`${testId}-appname`);
    await userEvent.type(appnameInput, "team01");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    const preElement = await screen.findByTestId("dokkuscript");
    expect(preElement).toHaveTextContent("dokku apps:create team01");
  });

  test("uses values from local storage when set", async () => {
    // Mock localStorage
    const mockSetItem = vi.fn();
    const mockGetItem = vi.fn((key) => {
      if (key === "HomePage.params") {
        return JSON.stringify({ appname: "foobar" });
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
      JSON.stringify({ appname: "barfoo" }),
    );
  });
});
