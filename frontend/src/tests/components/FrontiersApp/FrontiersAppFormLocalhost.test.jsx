import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { GitHubAppManifestFixtures } from "fixtures/GitHubAppManifestFixtures.js";
import FrontiersAppFormLocalhost from "main/components/FrontiersApp/FrontiersAppFormLocalhost.jsx";

describe("FrontiersAppFormLocalhost component tests", () => {
  test("submit test", async () => {
    const submitSpy = vi
      .spyOn(HTMLFormElement.prototype, "submit")
      .mockImplementation(() => {});

    render(<FrontiersAppFormLocalhost />);

    const appName = screen.getByLabelText("App Name");
    fireEvent.change(appName, { target: { value: "TestApp" } });

    const submitButton = screen.getByText("Create Frontiers App");
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitSpy).toHaveBeenCalled());
    const formElement = screen.getByTestId("frontiers-app-form-localhost");
    expect(formElement).toHaveAttribute("method", "POST");
    expect(formElement).toHaveAttribute(
      "action",
      `https://github.com/settings/apps/new?manifest=${encodeURIComponent(JSON.stringify(GitHubAppManifestFixtures.TestAppLocalhost))}`,
    );
    expect(appName).not.toHaveClass("is-invalid");
  });

  test("Various existence assertions", async () => {
    render(<FrontiersAppFormLocalhost />);

    fireEvent.click(screen.getByText("Create Frontiers App"));
    expect(
      await screen.findByText("App Name is required."),
    ).toBeInTheDocument();
  });
});
