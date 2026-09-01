import { useForm } from "react-hook-form";
import React, { useRef } from "react";
import { BaseFrontiersManifest } from "main/utils/BaseFrontiersConfiguration.js";
import { Form, Container, Button } from "react-bootstrap";

function FrontiersAppFormLocalhost() {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();

  const formRef = useRef(null);
  const serverUrl = `http://localhost:8080`;

  const appManifest = {
    ...BaseFrontiersManifest,
    name: `${watch("appName")} on localhost`,
    url: serverUrl,
    redirect_url: `${window.location.origin}${window.location.pathname}/complete/localhost`,
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
        data-testid="frontiers-app-form-localhost"
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
        </Form.Group>
        <Form.Group className="pt-3">
          <Button type="submit">Create Frontiers App</Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default FrontiersAppFormLocalhost;
