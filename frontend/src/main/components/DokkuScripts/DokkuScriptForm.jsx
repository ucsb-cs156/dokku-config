import React from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";

const defaultCallback = (result) => {
  window.alert(`Form submitted: ${JSON.stringify(result)}`);
};

function DokkuScriptForm({ callback = defaultCallback }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const testId = "DokkuScriptForm";
  return (
    <Container className="py-5 DokkuScriptForm" data-testid={testId}>
      <Row className="justify-content-center">
        <Col md={12} lg={8}>
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
