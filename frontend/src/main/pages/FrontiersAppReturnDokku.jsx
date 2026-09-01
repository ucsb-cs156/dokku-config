import { useSearchParams } from "react-router";
import axios from "axios";
import { useState, useEffect } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout.jsx";
import forge from "node-forge";

export default function FrontiersAppReturnDokku() {
  const [searchParams, _setSearchParams] = useSearchParams("code");
  const [resultData, setResultData] = useState(null);
  const [resultError, setResultError] = useState(false);
  useEffect(() => {
    if (searchParams.get("code") !== "") {
      axios
        .post(
          `https://api.github.com/app-manifests/${searchParams.get("code")}/conversions`,
        )
        .then((response) => {
          const pem = forge.pki.privateKeyFromPem(response.data.pem);

          const rsaPrivateKey = forge.pki.privateKeyToAsn1(pem);

          const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);

          response.data.pkcs8 = forge.pki.privateKeyInfoToPem(privateKeyInfo);

          setResultData(response.data);
        })
        .catch((error) => {
          setResultError(true);
          console.error("failed to create app on GitHub: " + error);
        });
    }
  }, [searchParams]);

  const appName =
    sessionStorage.getItem("frontiers-dokku-appname") || "<appname>";

  return (
    <BasicLayout>
      <div>
        <h2>Dokku Commands</h2>
        {!searchParams.get("code") && (
          <>
            <p>
              Something went wrong; Github did not provide an app creation code.
            </p>
          </>
        )}
        {resultError && (
          <>
            <p>
              Something went wrong; The app code could not be exchanged for
              credentials.
            </p>
          </>
        )}
        {resultData && (
          <>
            <p>Run the following commands on dokku:</p>
            <code>
              {/*prettier-ignore*/}
              <pre>
                dokku config:set --no-restart {appName} APP_PRIVATE_KEY="{resultData.pkcs8}" <br />
                dokku config:set --no-restart {appName} GITHUB_CLIENT_ID="{resultData.client_id}" <br />
                dokku config:set --no-restart {appName} GITHUB_CLIENT_SECRET="{resultData.client_secret}" <br />
                dokku config:set {appName} WEBHOOK_SECRET="{resultData.webhook_secret}"
              </pre>
            </code>
          </>
        )}
      </div>
    </BasicLayout>
  );
}
