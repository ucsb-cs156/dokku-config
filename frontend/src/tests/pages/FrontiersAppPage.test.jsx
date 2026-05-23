import { render, screen, fireEvent } from "@testing-library/react";
import FrontiersAppPage from "main/pages/FrontiersAppPage.jsx";
import { MemoryRouter } from "react-router";

describe("FrontiersAppPage Page Tests", () => {
  test("page renders", async () => {
    render(
      <MemoryRouter>
        <FrontiersAppPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Create Frontiers App")).toBeInTheDocument();
    expect(screen.getByTestId("frontiers-app-form")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Localhost"));
    expect(
      await screen.findByTestId("frontiers-app-form-localhost"),
    ).toBeInTheDocument();
  });
});
