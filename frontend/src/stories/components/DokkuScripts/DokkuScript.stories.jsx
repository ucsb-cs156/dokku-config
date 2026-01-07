import DokkuScript from "main/components/DokkuScripts/DokkuScriptGenerate";

export default {
  title: "components/DokkuScripts/DokkuScript",
  component: DokkuScript,
};

const Template = (args) => {
  return <DokkuScript {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

export const Dining = Template.bind({});

Dining.args = {
  appname: "dining",
  email: "cgaucho@ucsb.edu",
  org: "ucsb-cs156-f25",
  repo: "proj-dining-f25-01",
  google_client_id: "sample-client-id",
  google_client_secret: "sample-client-secret",
};
