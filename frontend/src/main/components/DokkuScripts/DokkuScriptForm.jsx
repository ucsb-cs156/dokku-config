import React from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";

const defaultCallback = (result) => {
  window.alert(`Form submitted: ${JSON.stringify(result)}`);
};

function DokkuScriptForm({ callback = defaultCallback, params = {} }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const testId = "DokkuScriptForm";
  return (
    <Container className="py-5 DokkuScriptForm" data-testid={testId}>
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Card className="shadow-sm p-4">
            <h3 className="mb-4 text-center">Specify your Dokku App</h3>
            <Form
              onSubmit={handleSubmit((data) => {
                callback(data);
              })}
            >
              <Form.Group as={Row} className="mb-3" controlId="appname">
                <Form.Label column sm={2}>
                  appname
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    data-testid={`${testId}-appname`}
                    type="text"
                    isInvalid={Boolean(errors.appname)}
                    defaultValue={params.appname || ""}
                    {...register("appname", {
                      required: "appname is required.",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.appname?.message}
                  </Form.Control.Feedback>
                </Col>
                <Col sm={4}>
                  <Form.Text
                    className="text-muted"
                    data-testid={`${testId}-appname-help`}
                  >
                    The name of your Dokku app, e.g. <code>team01</code>,{" "}
                    <code>team01-qa</code>, <code>courses-dev-cgaucho</code>,
                    etc.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="email">
                <Form.Label column sm={2}>
                  email
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    data-testid={`${testId}-email`}
                    type="email"
                    isInvalid={Boolean(errors.email)}
                    defaultValue={params.email || ""}
                    {...register("email", {
                      required: "email is required.",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Col>
                <Col sm={4}>
                  <Form.Text
                    className="text-muted"
                    data-testid={`${testId}-email-help`}
                  >
                    Your email address, e.g. <code>cgaucho@ucsb.edu</code>.
                    Messages about the expiration of the certificate will be
                    sent to this email.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="org">
                <Form.Label column sm={2}>
                  org
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    data-testid={`${testId}-org`}
                    type="text"
                    isInvalid={Boolean(errors.org)}
                    defaultValue={params.org || ""}
                    {...register("org", {
                      required: "org is required.",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.org?.message}
                  </Form.Control.Feedback>
                </Col>
                <Col sm={4}>
                  <Form.Text
                    className="text-muted"
                    data-testid={`${testId}-org-help`}
                  >
                    The name of your Github organization, e.g.{" "}
                    <code>ucsb-cs156-s26</code>.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="repo">
                <Form.Label column sm={2}>
                  repo
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    data-testid={`${testId}-repo`}
                    type="text"
                    isInvalid={Boolean(errors.repo)}
                    defaultValue={params.repo || ""}
                    {...register("repo", {
                      required: "repo is required.",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.repo?.message}
                  </Form.Control.Feedback>
                </Col>
                <Col sm={4}>
                  <Form.Text
                    className="text-muted"
                    data-testid={`${testId}-repo-help`}
                  >
                    The name of your repository, e.g. <code>team01</code>,{" "}
                    <code>proj-courses-s26-03</code>.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3"
                controlId="google_client_id"
              >
                <Form.Label column sm={2}>
                  Google Client ID
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    data-testid={`${testId}-google_client_id`}
                    type="text"
                    isInvalid={Boolean(errors.google_client_id)}
                    defaultValue={params.google_client_id || ""}
                    {...register("google_client_id", {
                      required: "Google Client ID is required.",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.google_client_id?.message}
                  </Form.Control.Feedback>
                </Col>
                <Col sm={4}>
                  <Form.Text
                    className="text-muted"
                    data-testid={`${testId}-google_client_id-help`}
                  >
                    Google Client Id for OAuth; see the project README for
                    instructions on obtaining this value.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group
                as={Row}
                className="mb-3"
                controlId="google_client_secret"
              >
                <Form.Label column sm={2}>
                  Google Client Secret
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    data-testid={`${testId}-google_client_secret`}
                    type="text"
                    isInvalid={Boolean(errors.google_client_secret)}
                    defaultValue={params.google_client_secret || ""}
                    {...register("google_client_secret", {
                      required: "Google Client Secret is required.",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.google_client_secret?.message}
                  </Form.Control.Feedback>
                </Col>
                <Col sm={4}>
                  <Form.Text
                    className="text-muted"
                    data-testid={`${testId}-google_client_secret-help`}
                  >
                    Google Client Secret for OAuth; see the project README for
                    instructions on obtaining this value.
                  </Form.Text>
                </Col>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DokkuScriptForm;
