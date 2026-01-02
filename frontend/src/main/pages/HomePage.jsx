import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function HomePage() {
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Dokku Config</h1>
        <p>
          This webapp will help you configure a Dokku deployment for CMPSC 156
          at UC Santa Barbara.
        </p>
      </div>
    </BasicLayout>
  );
}
