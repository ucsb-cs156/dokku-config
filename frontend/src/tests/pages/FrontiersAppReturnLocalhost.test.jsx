import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import forge from "node-forge";
import { GitHubAppManifestFixtures } from "fixtures/GitHubAppManifestFixtures.js";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
  useSearchParams,
} from "react-router";
import FrontiersAppReturnLocalhost from "main/pages/FrontiersAppReturnLocalhost.jsx";
import * as secretsYaml from "main/utils/SecretsYamlUtil.js";

describe("FrontiersAppReturnLocalhost page tests", () => {
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

    vi.spyOn(secretsYaml, "exportSecretsYaml").mockImplementation(
      (start) => start,
    );

    render(
      <MemoryRouter
        initialEntries={["/frontiers/complete/localhost?code=code"]}
      >
        <FrontiersAppReturnLocalhost />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/GITHUB_CLIENT_ID="test-client-id"/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/GITHUB_CLIENT_SECRET="test-client-secret"/),
    ).toBeInTheDocument();
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

    const linkElem = {
      click: vi.fn(),
      remove: vi.fn(),
    };

    URL.createObjectURL = vi.fn(() => "passthrough");
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(document, "createElement").mockImplementation(() => linkElem);
    vi.spyOn(document.body, "appendChild").mockImplementation(() => {});
    const blobMock = vi.fn();
    vi.stubGlobal("Blob", blobMock);

    fireEvent.click(screen.getByText("Download Private Key"));

    await waitFor(() => expect(linkElem.remove).toHaveBeenCalled());
    expect(blobMock).toHaveBeenCalledWith(["fake-private-key"], {
      type: "text/plain",
    });
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("passthrough");
    expect(linkElem.click).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(document.body.appendChild).toHaveBeenCalledWith(linkElem);
    expect(linkElem.href).toBe("passthrough");
    expect(linkElem.download).toBe("secrets.yaml");
  });

  test("no code", async () => {
    axiosMock
      .onPost("https://api.github.com/app-manifests/code/conversions")
      .reply(200, GitHubAppManifestFixtures.TestAppDokkuResponse);

    render(
      <MemoryRouter initialEntries={["/frontiers/complete/localhost"]}>
        <FrontiersAppReturnLocalhost />
      </MemoryRouter>,
    );

    await screen.findByText(/Github did not provide an app creation code/);
    expect(
      screen.queryByText(/The app code could not be exchanged for credentials/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Add the following lines to your \.env:/),
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
      <MemoryRouter initialEntries={["/frontiers/complete/localhost?code=bad"]}>
        <FrontiersAppReturnLocalhost />
      </MemoryRouter>,
    );
    await screen.findByText(
      /The app code could not be exchanged for credentials/,
    );
    expect(
      screen.queryByText(/Github did not provide an app creation code/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Add the following lines to your \\.env:/),
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
          <FrontiersAppReturnLocalhost />
          <button onClick={change}>Change Code</button>
        </>
      );
    };
    const ProgrammaticMemoryRouter = createMemoryRouter(
      [
        {
          path: "/frontiers/complete/localhost",
          element: <Wrapper />,
        },
      ],
      {
        initialEntries: ["/frontiers/complete/localhost?code=good"],
      },
    );

    axiosMock
      .onPost("https://api.github.com/app-manifests/good/conversions")
      .reply(200, GitHubAppManifestFixtures.TestAppDokkuResponse);
    axiosMock
      .onPost("https://api.github.com/app-manifests/bad/conversions")
      .reply(403);

    render(<RouterProvider router={ProgrammaticMemoryRouter} />);

    await screen.findByText(/Add the following lines to your \.env:/);
    fireEvent.click(screen.getByText(/Change Code/));
    expect(
      await screen.findByText(
        /The app code could not be exchanged for credentials/,
      ),
    ).toBeInTheDocument();
  });
});
