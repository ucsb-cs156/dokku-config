import { exportSecretsYaml } from "main/utils/SecretsYamlUtil.js";

test("simple secretsYamlUtil test", () => {
  expect(exportSecretsYaml("key")).toBe(`
app:
  private:
    key: "key"
`);
});
