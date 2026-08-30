import DokkuScriptForm from "main/components/DokkuScripts/DokkuScriptForm";

export default {
  title: "components/DokkuScripts/DokkuScriptForm",
  component: DokkuScriptForm,
};

const Template = (args) => {
  return <DokkuScriptForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {};

export const WithUcsbApi = Template.bind({});

WithUcsbApi.args = {
  params: {
    appname: "courses",
    email: "cgaucho@ucsb.edu",
    org: "ucsb-cs156-s26",
    repo: "proj-courses-s26-01",
    google_client_id: "sample-client-id",
    google_client_secret: "sample-client-secret",
    ucsb_api: true,
    ucsb_api_key: "sample-ucsb-api-key",
  },
};
