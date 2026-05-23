import { render, screen, fireEvent } from "@testing-library/react";
import FrontiersAppReturnDokku from "main/pages/FrontiersAppReturnDokku.jsx";
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
  useSearchParams,
} from "react-router";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { GitHubAppManifestFixtures } from "fixtures/GitHubAppManifestFixtures.js";
import forge from "node-forge";

describe("FrontiersAppReturnDokku Page Tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    vi.spyOn(forge.pki, "privateKeyFromPem").mockImplementation(
      (value) => value,
    );
    vi.spyOn(forge.pki, "privateKeyToAsn1").mockImplementation(
      (value) => value,
    );
    vi.spyOn(forge.pki, "wrapRsaPrivateKey").mockImplementation(
      (value) => value,
    );
    vi.spyOn(forge.pki, "privateKeyInfoToPem").mockImplementation(
      (value) => value,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  test("Happy Path", async () => {
    axiosMock
      .onPost("https://api.github.com/app-manifests/code/conversions")
      .reply(200, GitHubAppManifestFixtures.TestAppDokkuResponse);
    sessionStorage.setItem("frontiers-dokku-appname", "test-app");

    render(
      <MemoryRouter initialEntries={["/frontiers/complete/dokku?code=code"]}>
        <FrontiersAppReturnDokku />
      </MemoryRouter>,
    );

    await screen.findByText(/APP_PRIVATE_KEY="fake-private-key"/);
    expect(
      screen.getByText(/GITHUB_CLIENT_ID="test-client-id"/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/WEBHOOK_SECRET="test-webhook-secret"/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/GITHUB_CLIENT_SECRET="test-client-secret"/),
    ).toBeInTheDocument();
    expect(
      screen
        .getByText(/dokku config:set --no-restart test-app/)
        .textContent.match(/dokku config:set --no-restart test-app/g).length,
    ).toBe(3);
    expect(screen.getByText(/dokku config:set test-app/)).toBeInTheDocument();
    expect(forge.pki.privateKeyFromPem).toHaveBeenCalledWith(
      "fake-private-key",
    );
    expect(forge.pki.privateKeyToAsn1).toHaveBeenCalledWith("fake-private-key");
    expect(forge.pki.wrapRsaPrivateKey).toHaveBeenCalledWith(
      "fake-private-key",
    );
    expect(forge.pki.privateKeyInfoToPem).toHaveBeenCalledWith(
      "fake-private-key",
    );

    expect(axiosMock.history.post[0].url).toBe(
      "https://api.github.com/app-manifests/code/conversions",
    );
    sessionStorage.clear();
  });

  test("no code", async () => {
    axiosMock
      .onPost("https://api.github.com/app-manifests/code/conversions")
      .reply(200, GitHubAppManifestFixtures.TestAppDokkuResponse);

    render(
      <MemoryRouter initialEntries={["/frontiers/complete/dokku"]}>
        <FrontiersAppReturnDokku />
      </MemoryRouter>,
    );

    await screen.findByText(/Github did not provide an app creation code/);
    expect(
      screen.queryByText(/The app code could not be exchanged for credentials/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Run the following commands on dokku/),
    ).not.toBeInTheDocument();
    expect(axiosMock.history.post.length).toBe(0);
    expect(forge.pki.privateKeyFromPem).not.toHaveBeenCalled();
    expect(forge.pki.privateKeyToAsn1).not.toHaveBeenCalled();
    expect(forge.pki.wrapRsaPrivateKey).not.toHaveBeenCalled();
    expect(forge.pki.privateKeyInfoToPem).not.toHaveBeenCalled();
  });

  test("bad github response", async () => {
    axiosMock
      .onPost("https://api.github.com/app-manifests/bad/conversions")
      .reply(400, {
        message: "Invalid app manifest code",
      });
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/frontiers/complete/dokku?code=bad"]}>
        <FrontiersAppReturnDokku />
      </MemoryRouter>,
    );
    await screen.findByText(
      /The app code could not be exchanged for credentials/,
    );
    expect(
      screen.queryByText(/Github did not provide an app creation code/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Run the following commands on dokku/),
    ).not.toBeInTheDocument();
    expect(forge.pki.privateKeyFromPem).not.toHaveBeenCalled();
    expect(forge.pki.privateKeyToAsn1).not.toHaveBeenCalled();
    expect(forge.pki.wrapRsaPrivateKey).not.toHaveBeenCalled();
    expect(forge.pki.privateKeyInfoToPem).not.toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toContain(
      "failed to create app on GitHub:",
    );
  });

  test("hack to test useEffect dependency", async () => {
    const Wrapper = () => {
      const [_searchParams, setSearchParams] = useSearchParams();
      const change = () => setSearchParams({ code: "bad" });
      return (
        <>
          <FrontiersAppReturnDokku />
          <button onClick={change}>Change Code</button>
        </>
      );
    };
    const ProgrammaticMemoryRouter = createMemoryRouter(
      [
        {
          path: "/frontiers/complete/dokku",
          element: <Wrapper />,
        },
      ],
      {
        initialEntries: ["/frontiers/complete/dokku?code=good"],
      },
    );

    axiosMock
      .onPost("https://api.github.com/app-manifests/good/conversions")
      .reply(200, GitHubAppManifestFixtures.TestAppDokkuResponse);
    axiosMock
      .onPost("https://api.github.com/app-manifests/bad/conversions")
      .reply(403);

    render(<RouterProvider router={ProgrammaticMemoryRouter} />);

    await screen.findByText(/Run the following commands on dokku/);
    expect(
      screen.getByText(/dokku config:set --no-restart <appname>/),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Change Code/));
    expect(
      await screen.findByText(
        /The app code could not be exchanged for credentials/,
      ),
    ).toBeInTheDocument();
  });
});
