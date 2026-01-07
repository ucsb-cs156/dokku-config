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

  test("has expected help content", async () => {
    const expectedHelpContent = {
      appname:
        "The name of your Dokku app, e.g. team01, team01-qa, courses-dev-cgaucho, etc.",
      email:
        "Your email address, e.g. cgaucho@ucsb.edu. Messages about the expiration of the certificate will be sent to this email.",
      org: "The name of your Github organization, e.g. ucsb-cs156-s26.",
      repo: "The name of your repository, e.g. team01, proj-courses-s26-03.",
      google_client_id:
        "Google Client Id for OAuth; see the project README for instructions on obtaining this value.",
      google_client_secret:
        "Google Client Secret for OAuth; see the project README for instructions on obtaining this value.",
    };

    render(<DokkuScriptForm />);

    // iterate over keys in expectedHelpContent
    for (const key of Object.keys(expectedHelpContent)) {
      const expected = expectedHelpContent[key];
      expect(screen.getByTestId(`${testId}-${key}-help`)).toHaveTextContent(
        expected,
      );
    }
  });

  test("when form is submitted", async () => {
    const mockCallback = vi.fn();
    render(<DokkuScriptForm callback={mockCallback} />);
    const appnameInput = screen.getByTestId(`${testId}-appname`);
    await userEvent.type(appnameInput, "team01");
    const emailInput = screen.getByTestId(`${testId}-email`);
    await userEvent.type(emailInput, "cgaucho@ucsb.edu");
    const orgInput = screen.getByTestId(`${testId}-org`);
    await userEvent.type(orgInput, "ucsb-cs156-f25");
    const repoInput = screen.getByTestId(`${testId}-repo`);
    await userEvent.type(repoInput, "proj-dining-f25-01");
    const googleClientIdInput = screen.getByTestId(
      `${testId}-google_client_id`,
    );
    await userEvent.type(googleClientIdInput, "sample-client-id");
    const googleClientSecretInput = screen.getByTestId(
      `${testId}-google_client_secret`,
    );
    await userEvent.type(googleClientSecretInput, "sample-client-secret");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(mockCallback).toHaveBeenCalledWith({
      appname: "team01",
      email: "cgaucho@ucsb.edu",
      org: "ucsb-cs156-f25",
      repo: "proj-dining-f25-01",
      google_client_id: "sample-client-id",
      google_client_secret: "sample-client-secret",
    });
  });

  test("when form is submitted with default callback, window.alert is called", async () => {
    // Setup mock for window.alert
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<DokkuScriptForm />);
    const appnameInput = screen.getByTestId(`${testId}-appname`);
    await userEvent.type(appnameInput, "team01");
    const emailInput = screen.getByTestId(`${testId}-email`);
    await userEvent.type(emailInput, "cgaucho@ucsb.edu");
    const orgInput = screen.getByTestId(`${testId}-org`);
    await userEvent.type(orgInput, "ucsb-cs156-f25");
    const repoInput = screen.getByTestId(`${testId}-repo`);
    await userEvent.type(repoInput, "proj-dining-f25-01");
    const googleClientIdInput = screen.getByTestId(
      `${testId}-google_client_id`,
    );
    await userEvent.type(googleClientIdInput, "sample-client-id");
    const googleClientSecretInput = screen.getByTestId(
      `${testId}-google_client_secret`,
    );
    await userEvent.type(googleClientSecretInput, "sample-client-secret");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(alertMock).toHaveBeenCalledWith(
      'Form submitted: {"appname":"team01","email":"cgaucho@ucsb.edu","org":"ucsb-cs156-f25","repo":"proj-dining-f25-01","google_client_id":"sample-client-id","google_client_secret":"sample-client-secret"}',
    );
  });

  test("when form is submitted without filling in required fields", async () => {
    const mockCallback = vi.fn();
    render(<DokkuScriptForm callback={mockCallback} />);
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    await screen.findByText(/appname is required/i);
    expect(mockCallback).not.toHaveBeenCalled();
    expect(screen.getByText(/appname is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/org is required/i)).toBeInTheDocument();
    expect(screen.getByText(/repo is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Google Client Id is required/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Google Client Secret is required/i),
    ).toBeInTheDocument();
  });
});
