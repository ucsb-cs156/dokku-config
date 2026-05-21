export const GitHubAppManifestFixtures = {
  TestApp: {
    default_permissions: {
      administration: "write",
      contents: "write",
      workflows: "write",
      organization_administration: "write",
      members: "write",
    },
    request_oauth_on_install: true,
    public: true,
    name: `test-dokku-00`,
    url: "https://test.dokku-00.cs.ucsb.edu",
    hook_attributes: {
      url: `https://test.dokku-00.cs.ucsb.edu/api/webhooks/github`,
    },
    default_events: ["organization"],
    redirect_url: `${window.location.origin}${window.location.pathname}/complete`,
    callback_urls: [
      `https://test.dokku-00.cs.ucsb.edu/api/courses/link`,
      `https://test.dokku-00.cs.ucsb.edu/login/oauth2/code/github`,
    ],
  },
  TestAppResponse: {
    webhook_secret: "test-webhook-secret",
    pem: "fake-private-key",
    client_id: "test-client-id",
    client_secret: "test-client-secret",
  },
};
