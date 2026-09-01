import { useForm } from "react-hook-form";
import React, { useRef } from "react";
import { BaseFrontiersManifest } from "main/utils/BaseFrontiersConfiguration.js";
import { Form, Container, Button } from "react-bootstrap";

function FrontiersAppFormDokku() {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();

  const formRef = useRef(null);

  const servers = Array.from({ length: 17 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`,
  );
  const serverUrl = `https://${watch("appName")}.dokku-${watch("dokkuServer")}.cs.ucsb.edu`;

  const appManifest = {
    ...BaseFrontiersManifest,
    name: `${watch("appName")}-dokku-${watch("dokkuServer")}`,
    url: serverUrl,
    hook_attributes: {
      url: `${serverUrl}/api/webhooks/github`,
    },
    default_events: ["organization"],
    redirect_url: `${window.location.origin}${window.location.pathname}/complete/dokku`,
    callback_urls: [
      `${serverUrl}/api/courses/link`,
      `${serverUrl}/login/oauth2/code/github`,
    ],
  };

  const onSubmit = () => {
    sessionStorage.setItem("frontiers-dokku-appname", watch("appName"));
    formRef.current.submit();
  };

  return (
    <Container>
      <Form
        ref={formRef}
        data-testid="frontiers-app-form"
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        action={`https://github.com/settings/apps/new?manifest=${encodeURIComponent(JSON.stringify(appManifest))}`}
      >
        <Form.Group>
          <Form.Label htmlFor="appName">App Name</Form.Label>
          <Form.Control
            type="text"
            id="appName"
            placeholder="Enter app name"
            isInvalid={!!errors.appName}
            {...register("appName", { required: true })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.appName && "App Name is required."}
          </Form.Control.Feedback>
          <Form.Label htmlFor="dokkuServer">Dokku Server</Form.Label>
          <Form.Control
            as="select"
            id="dokkuServer"
            isInvalid={!!errors.dokkuServer}
            {...register("dokkuServer", { required: true })}
          >
            <option value="">Select a Dokku Server</option>
            {servers.map((number) => (
              <option key={number} value={number}>
                dokku-{number}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.dokkuServer && "Dokku Server is required."}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="pt-3">
          <Button type="submit">Create Frontiers App</Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default FrontiersAppFormDokku;
