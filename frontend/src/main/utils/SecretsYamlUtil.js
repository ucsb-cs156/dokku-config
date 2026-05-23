const exportSecretsYaml = (pkcs8) => {
  const yaml = `
app:
  private:
    key: "${pkcs8}"
`;

  return yaml;
};

export { exportSecretsYaml };
