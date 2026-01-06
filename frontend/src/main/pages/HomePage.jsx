import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DokkuScriptGenerate from "main/components/DokkuScripts/DokkuScriptGenerate";
import DokkuScriptForm from "main/components/DokkuScripts/DokkuScriptForm";

import { useState } from "react";

export default function HomePage() {
  const [params, setParams] = useState();

  const testId = "HomePage";

  const callback = (params) => {
    setParams(params);
    localStorage.setItem(`${testId}.params`, JSON.stringify(params));
  };

  localStorage.getItem(`${testId}.params`) &&
    !params &&
    setParams(JSON.parse(localStorage.getItem(`${testId}.params`)));

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Dokku Config</h1>
        <p>
          This webapp will help you configure a Dokku deployment for CMPSC 156
          at UC Santa Barbara.
        </p>
      </div>
      <div>
        <h2>Specify Dokku App</h2>
        <DokkuScriptForm callback={callback} params={params} />
      </div>
      <div className="pt-2">
        <h2>Generated Dokku Script</h2>
        <DokkuScriptGenerate {...params} />
      </div>
    </BasicLayout>
  );
}
