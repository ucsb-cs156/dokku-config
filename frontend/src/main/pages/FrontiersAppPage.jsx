import FrontiersAppFormDokku from "main/components/FrontiersApp/FrontiersAppFormDokku.jsx";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout.jsx";
import { useForm } from "react-hook-form";
import { Col, Row, Form } from "react-bootstrap";
import FrontiersAppFormLocalhost from "main/components/FrontiersApp/FrontiersAppFormLocalhost.jsx";

export default function FrontiersAppPage() {
  const { watch, register } = useForm();

  const localhostOrDokku = watch("dokkuOrLocalhost");
  return (
    <BasicLayout>
      <Row>
        <Col xs={2}>
          <Form.Label>Dokku or Localhost</Form.Label>
          <Form.Check
            inline
            defaultChecked={true}
            type="radio"
            label="Dokku"
            value="dokku"
            id="dokku-radio"
            {...register("dokkuOrLocalhost")}
          />
          <Form.Check
            inline
            type="radio"
            label="Localhost"
            value="localhost"
            id="localhost-radio"
            {...register("dokkuOrLocalhost")}
          />
        </Col>
      </Row>
      <Row>
        {localhostOrDokku === "dokku" ? (
          <FrontiersAppFormDokku />
        ) : (
          <FrontiersAppFormLocalhost />
        )}
      </Row>
    </BasicLayout>
  );
}
