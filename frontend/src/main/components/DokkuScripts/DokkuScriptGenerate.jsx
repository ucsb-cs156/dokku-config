import React from "react";

function DokkuScript({
  appname = "happycows",
  email = "phtcon@ucsb.edu",
  org = "ucsb-cs156",
  repo = "proj-happycows",
  google_client_id = "get-value-from-google",
  google_client_secret = "get-value-from-google",
  mongo = false,
  ucsb_api = false,
  ucsb_api_key = "get-value-from-ucsb-api",
}) {
  const configSet = (key, value) =>
    `dokku config:set --no-restart ${appname} ${key}=${value}`;

  const mongoInstructions = mongo
    ? `
      dokku mongo:create ${appname}-m
      dokku mongo:link ${appname}-m ${appname}`
    : "";

  const ucsbApiInstructions = ucsb_api
    ? `
      ${configSet("UCSB_API_KEY", ucsb_api_key)}`
    : "";

  const content = `
      dokku apps:create ${appname}
      dokku git:set ${appname} keep-git-dir true
      ${configSet("PRODUCTION", "true")}
      ${configSet("SOURCE_REPO", `https://github.com/${org}/${repo}`)}
      ${configSet("GOOGLE_CLIENT_ID", google_client_id)}
      ${configSet("GOOGLE_CLIENT_SECRET", google_client_secret)}${ucsbApiInstructions}
      dokku postgres:create ${appname}-db
      dokku postgres:link ${appname}-db ${appname}${mongoInstructions}
      dokku git:sync ${appname} https://github.com/${org}/${repo} main
      dokku ps:rebuild ${appname}
      dokku letsencrypt:set ${appname} email ${email}
      dokku letsencrypt:enable ${appname}
      dokku ps:restart ${appname}
`;

  return (
    <pre style={{ whiteSpace: "pre" }} data-testid="dokkuscript">
      {content}
    </pre>
  );
}

export default DokkuScript;
