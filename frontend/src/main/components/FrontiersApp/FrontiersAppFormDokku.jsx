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
    redirect_url: `${window.location.href}/complete`,
    callback_urls: [
      `${serverUrl}/api/courses/link`,
      `${serverUrl}/login/oauth2/code/github`,
    ],
  };

  const onSubmit = () => {
    formRef.current.submit();
  };

  return (
    <Container>
      <Form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        action={`https://github.com/settings/apps/new?manifest=${JSON.stringify(appManifest)}`}
      >
        <Form.Group>
          <Form.Label>App Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter app name"
            {...register("appName", { required: true })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.appName && "App Name is required."}
          </Form.Control.Feedback>
          <Form.Label>Dokku Server</Form.Label>
          <Form.Control
            as="select"
            id="dokkuServer"
            {...register("dokkuServer", { required: true })}
          >
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
        <Form.Group>
          <Button type="submit">Create Frontiers App</Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default FrontiersAppFormDokku;
