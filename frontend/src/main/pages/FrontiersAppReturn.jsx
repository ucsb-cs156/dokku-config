import { useSearchParams } from "react-router";
import axios from "axios";
import { useState, useEffect } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout.jsx";
import forge from "node-forge";

export default function FrontiersAppReturn() {
  const [searchParams, _setSearchParams] = useSearchParams("code");
  const [resultData, setResultData] = useState(null);
  useEffect(() => {
    if (searchParams.get("code") !== null) {
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
        });
    }
  }, [searchParams]);

  return (
    <BasicLayout>
      <div>
        <p>Frontiers App Return Page</p>
        {resultData && (
          <>
            <p>Run the following commands on dokku:</p>
            <code>
              dokku config:set --no-restart {"<appname>"} APP_PRIVATE_KEY="
              {resultData.pkcs8}" <br />
              dokku config:set --no-restart {"<appname>"} GITHUB_CLIENT_ID="
              {resultData.client_id}" <br />
              dokku config:set --no-restart {"<appname>"} GITHUB_CLIENT_SECRET="
              {resultData.client_secret}" <br />
              dokku config:set {"<appname>"} WEBHOOK_SECRET="
              {resultData.webhook_secret}"
            </code>
          </>
        )}
      </div>
    </BasicLayout>
  );
}
