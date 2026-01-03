import { render, screen } from "@testing-library/react";
import DokkuScriptForm from "main/components/DokkuScripts/DokkuScriptForm";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

describe("DokkuScript tests", () => {
  const testId = "DokkuScriptForm";

  test("has expected attributes", async () => {
    render(<DokkuScriptForm />);
    const container = screen.getByTestId(testId);
    expect(container).toHaveAttribute(
      "class",
      "py-5 DokkuScriptForm container",
    );
  });

  test("has expected content", async () => {
    const expected =
      "The name of your Dokku app, e.g. team01, team01-qa, courses-dev-cgaucho, etc.";
    render(<DokkuScriptForm />);
    expect(screen.getByTestId(`${testId}-appname-help`)).toHaveTextContent(
      expected,
    );
  });

  test("when form is submitted", async () => {
    const mockCallback = vi.fn();
    render(<DokkuScriptForm callback={mockCallback} />);
    const appnameInput = screen.getByTestId(`${testId}-appname`);
    await userEvent.type(appnameInput, "team01");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(mockCallback).toHaveBeenCalledWith({
      appname: "team01",
    });
  });

  test("when form is submitted with default callback, window.alert is called", async () => {
    // Setup mock for window.alert
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<DokkuScriptForm />);
    const appnameInput = screen.getByTestId(`${testId}-appname`);
    await userEvent.type(appnameInput, "team01");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(alertMock).toHaveBeenCalledWith(
      'Form submitted: {"appname":"team01"}',
    );
  });

  test("when form is submitted without filling in required fields", async () => {
    const mockCallback = vi.fn();
    render(<DokkuScriptForm callback={mockCallback} />);
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    await screen.findByText(/appname is required/i);
    expect(mockCallback).not.toHaveBeenCalled();
    expect(screen.getByText(/appname is required/i)).toBeInTheDocument();
  });
});
