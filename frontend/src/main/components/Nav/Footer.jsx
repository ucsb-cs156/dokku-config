import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-light pt-3 pt-md-4 pb-4 pb-md-5" data-testid="Footer">
      <Container>
        <p>
          The purpose of this webapp is to assist students and course staff in
          CMPSC156 with configuring dokku deployments for full stack web apps
          for CMPSC 156, a course in Software Engineering at UC Santa Barbara.
        </p>
        <p>
          This webapp is open source; the source code is available on{" "}
          <a href="https://github.com/ucsb-cs156/dokku-config">GitHub</a>.
        </p>
        <p>
          This also serves as an example of a webapp that is "frontend only" (no
          backend) built using React with the CMPSC 156 toolchain and deployed
          on Github Pages.
        </p>
        <p>
          Copyright &copy; 2026 by the Regents of the University of California,
          All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
