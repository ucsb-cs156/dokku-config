import { render, screen } from "@testing-library/react";
import FrontiersAppPage from "main/pages/FrontiersAppPage.jsx";
import { MemoryRouter } from "react-router";

describe("FrontiersAppPage Page Tests", () => {
  test("page renders", () => {
    render(
      <MemoryRouter>
        <FrontiersAppPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Create Frontiers App")).toBeInTheDocument();
  });
});
