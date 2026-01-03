import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DokkuScript from "main/components/DokkuScripts/DokkuScript";
import DokkuScriptForm from "main/components/DokkuScripts/DokkuScriptForm";

import { useState } from "react";

export default function HomePage() {
  const [params, setParams] = useState();

  const callback = (params) => {
    setParams(params);
  };

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
        <DokkuScriptForm callback={callback} />
      </div>
      <div className="pt-2">
        <h2>Generated Dokku Script</h2>
        <DokkuScript {...params} />
      </div>
    </BasicLayout>
  );
}
