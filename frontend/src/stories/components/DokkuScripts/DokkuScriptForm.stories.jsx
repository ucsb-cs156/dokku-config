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
