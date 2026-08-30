import { render, screen } from "@testing-library/react";
import DokkuScriptGenerate from "main/components/DokkuScripts/DokkuScriptGenerate";
import { expect } from "vitest";

describe("DokkuScript tests", () => {
  test("has expected attributes", async () => {
    render(<DokkuScriptGenerate />);
    const dokkuscript = screen.getByTestId("dokkuscript");
    expect(dokkuscript).toHaveAttribute("data-testid", "dokkuscript");
    expect(dokkuscript).toHaveAttribute("style", "white-space: pre;");
  });

  test("defaults", async () => {
    // prettier-ignore
    const expected = `
      dokku apps:create happycows
      dokku git:set happycows keep-git-dir true
      dokku config:set --no-restart happycows PRODUCTION=true
      dokku config:set --no-restart happycows SOURCE_REPO=https://github.com/ucsb-cs156/proj-happycows
      dokku config:set --no-restart happycows GOOGLE_CLIENT_ID=get-value-from-google
      dokku config:set --no-restart happycows GOOGLE_CLIENT_SECRET=get-value-from-google
      dokku postgres:create happycows-db
      dokku postgres:link happycows-db happycows
      dokku git:sync happycows https://github.com/ucsb-cs156/proj-happycows main
      dokku ps:rebuild happycows
      dokku letsencrypt:set happycows email phtcon@ucsb.edu
      dokku letsencrypt:enable happycows
      dokku ps:restart happycows
`;

    render(<DokkuScriptGenerate />);
    const dokkuscript = screen.getByTestId("dokkuscript");
    expect(dokkuscript).toHaveTextContent(expected, {
      normalizeWhitespace: false,
    });
  });

  test("includes mongo instructions when mongo is true", async () => {
    // prettier-ignore
    const expected = `
      dokku apps:create happycows
      dokku git:set happycows keep-git-dir true
      dokku config:set --no-restart happycows PRODUCTION=true
      dokku config:set --no-restart happycows SOURCE_REPO=https://github.com/ucsb-cs156/proj-happycows
      dokku config:set --no-restart happycows GOOGLE_CLIENT_ID=get-value-from-google
      dokku config:set --no-restart happycows GOOGLE_CLIENT_SECRET=get-value-from-google
      dokku postgres:create happycows-db
      dokku postgres:link happycows-db happycows
      dokku mongo:create happycows-m
      dokku mongo:link happycows-m happycows
      dokku git:sync happycows https://github.com/ucsb-cs156/proj-happycows main
      dokku ps:rebuild happycows
      dokku letsencrypt:set happycows email phtcon@ucsb.edu
      dokku letsencrypt:enable happycows
      dokku ps:restart happycows
`;

    render(<DokkuScriptGenerate mongo={true} />);
    const dokkuscript = screen.getByTestId("dokkuscript");
    expect(dokkuscript).toHaveTextContent(expected, {
      normalizeWhitespace: false,
    });
  });

  test("includes ucsb_api instructions when ucsb_api is true", async () => {
    // prettier-ignore
    const expected = `
      dokku apps:create happycows
      dokku git:set happycows keep-git-dir true
      dokku config:set --no-restart happycows PRODUCTION=true
      dokku config:set --no-restart happycows SOURCE_REPO=https://github.com/ucsb-cs156/proj-happycows
      dokku config:set --no-restart happycows GOOGLE_CLIENT_ID=get-value-from-google
      dokku config:set --no-restart happycows GOOGLE_CLIENT_SECRET=get-value-from-google
      dokku config:set --no-restart happycows UCSB_API_KEY=sample-key
      dokku postgres:create happycows-db
      dokku postgres:link happycows-db happycows
      dokku git:sync happycows https://github.com/ucsb-cs156/proj-happycows main
      dokku ps:rebuild happycows
      dokku letsencrypt:set happycows email phtcon@ucsb.edu
      dokku letsencrypt:enable happycows
      dokku ps:restart happycows
`;

    render(<DokkuScriptGenerate ucsb_api={true} ucsb_api_key="sample-key" />);
    const dokkuscript = screen.getByTestId("dokkuscript");
    expect(dokkuscript).toHaveTextContent(expected, {
      normalizeWhitespace: false,
    });
  });

  test("includes default ucsb_api_key when ucsb_api is true and ucsb_api_key is omitted", async () => {
    // prettier-ignore
    const expected = `
      dokku apps:create happycows
      dokku git:set happycows keep-git-dir true
      dokku config:set --no-restart happycows PRODUCTION=true
      dokku config:set --no-restart happycows SOURCE_REPO=https://github.com/ucsb-cs156/proj-happycows
      dokku config:set --no-restart happycows GOOGLE_CLIENT_ID=get-value-from-google
      dokku config:set --no-restart happycows GOOGLE_CLIENT_SECRET=get-value-from-google
      dokku config:set --no-restart happycows UCSB_API_KEY=get-value-from-ucsb-api
      dokku postgres:create happycows-db
      dokku postgres:link happycows-db happycows
      dokku git:sync happycows https://github.com/ucsb-cs156/proj-happycows main
      dokku ps:rebuild happycows
      dokku letsencrypt:set happycows email phtcon@ucsb.edu
      dokku letsencrypt:enable happycows
      dokku ps:restart happycows
`;

    render(<DokkuScriptGenerate ucsb_api={true} />);
    const dokkuscript = screen.getByTestId("dokkuscript");
    expect(dokkuscript).toHaveTextContent(expected, {
      normalizeWhitespace: false,
    });
  });
});
