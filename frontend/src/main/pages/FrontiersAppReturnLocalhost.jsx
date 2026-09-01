import { useSearchParams } from "react-router";
import axios from "axios";
import { useState, useEffect } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout.jsx";
import forge from "node-forge";
import { Button, Row, Col } from "react-bootstrap";
import { exportSecretsYaml } from "main/utils/SecretsYamlUtil.js";

export default function FrontiersAppReturnLocalhost() {
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

  const downloadableCallback = () => {
    const blob = new Blob([exportSecretsYaml(resultData.pkcs8)], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "secrets.yaml";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <BasicLayout>
      <div>
        <h2>Localhost Configuration</h2>
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
            <Row>
              <p>Add the following lines to your .env:</p>
              <code>
                {/*prettier-ignore*/}
                <pre>
                GITHUB_CLIENT_ID="{resultData.client_id}" <br />
                GITHUB_CLIENT_SECRET="{resultData.client_secret}" <br />
                </pre>
              </code>
            </Row>
            <Row className="pb-2">
              <Col>
                <p>Download your private key:</p>
                <Button onClick={downloadableCallback}>
                  Download Private Key
                </Button>
              </Col>
            </Row>
          </>
        )}
      </div>
    </BasicLayout>
  );
}
