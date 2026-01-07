import React from "react";

function DokkuScript({
  appname = "happycows",
  email = "phtcon@ucsb.edu",
  org = "ucsb-cs156",
  repo = "proj-happycows",
  google_client_id = "get-value-from-google",
  google_client_secret = "get-value-from-google",
}) {
  const content = `
      dokku apps:create ${appname}
      dokku git:set ${appname} keep-git-dir true
      dokku config:set --no-restart ${appname} PRODUCTION=true
      dokku config:set --no-restart ${appname} SOURCE_REPO=https://github.com/${org}/${repo}
      dokku postgres:create ${appname}-db
      dokku postgres:link ${appname}-db ${appname}
      dokku git:sync ${appname} https://github.com/${org}/${repo} main
      dokku ps:rebuild ${appname}
      dokku letsencrypt:set ${appname} email ${email}
      dokku letsencrypt:enable ${appname}
      dokku config:set ${appname} --no-restart GOOGLE_CLIENT_ID=${google_client_id}
      dokku config:set ${appname} --no-restart GOOGLE_CLIENT_SECRET=${google_client_secret}
`;

  return (
    <pre style={{ whiteSpace: "pre" }} data-testid="dokkuscript">
      {content}
    </pre>
  );
}

export default DokkuScript;
