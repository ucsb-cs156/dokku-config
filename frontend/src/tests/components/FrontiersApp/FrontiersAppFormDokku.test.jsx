import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import FrontiersAppFormDokku from "main/components/FrontiersApp/FrontiersAppFormDokku.jsx";
import { GitHubAppManifestFixtures } from "fixtures/GitHubAppManifestFixtures.js";

describe("FrontiersAppFormDokku component tests", () => {
  test("submit test", async () => {
    const submitSpy = vi
      .spyOn(HTMLFormElement.prototype, "submit")
      .mockImplementation(() => {});

    render(<FrontiersAppFormDokku />);

    const appName = screen.getByLabelText("App Name");
    fireEvent.change(appName, { target: { value: "test" } });
    const dokkuServer = screen.getByLabelText("Dokku Server");
    fireEvent.change(dokkuServer, { target: { value: "00" } });

    const submitButton = screen.getByText("Create Frontiers App");
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitSpy).toHaveBeenCalled());
    const formElement = screen.getByTestId("frontiers-app-form");
    expect(formElement).toHaveAttribute("method", "POST");
    expect(formElement).toHaveAttribute(
      "action",
      `https://github.com/settings/apps/new?manifest=${encodeURIComponent(JSON.stringify(GitHubAppManifestFixtures.TestAppDokku))}`,
    );
    expect(appName).not.toHaveClass("is-invalid");
    expect(dokkuServer).not.toHaveClass("is-invalid");
    expect(sessionStorage.getItem("frontiers-dokku-appname")).toBe("test");
    sessionStorage.clear();
  });

  test("Various existence assertions", async () => {
    render(<FrontiersAppFormDokku />);

    for (let i = 0; i < 10; i++) {
      expect(screen.getByText(`dokku-0${i}`)).toBeInTheDocument();
    }
    for (let i = 10; i < 17; i++) {
      expect(screen.getByText(`dokku-${i}`)).toBeInTheDocument();
    }

    fireEvent.click(screen.getByText("Create Frontiers App"));
    await screen.findByText("App Name is required.");
    expect(screen.getByText("Dokku Server is required.")).toBeInTheDocument();
  });
});
