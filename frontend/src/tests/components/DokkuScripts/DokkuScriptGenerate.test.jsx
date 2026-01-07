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
      dokku postgres:create happycows-db
      dokku postgres:link happycows-db happycows
      dokku git:sync happycows https://github.com/ucsb-cs156/proj-happycows main
      dokku ps:rebuild happycows
      dokku letsencrypt:set happycows email phtcon@ucsb.edu
      dokku letsencrypt:enable happycows
      dokku config:set happycows --no-restart GOOGLE_CLIENT_ID=get-value-from-google
      dokku config:set happycows --no-restart GOOGLE_CLIENT_SECRET=get-value-from-google`;
    render(<DokkuScriptGenerate />);
    const dokkuscript = screen.getByTestId("dokkuscript");
    expect(dokkuscript).toHaveTextContent(expected, {
      normalizeWhitespace: false,
    });
  });
});
