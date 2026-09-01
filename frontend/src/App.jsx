import { Routes, Route } from "react-router";
import HomePage from "main/pages/HomePage";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import FrontiersAppPage from "main/pages/FrontiersAppPage.jsx";
import FrontiersAppReturnDokku from "main/pages/FrontiersAppReturnDokku.jsx";
import FrontiersAppReturnLocalhost from "main/pages/FrontiersAppReturnLocalhost.jsx";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/frontiers" element={<FrontiersAppPage />} />
      <Route
        exact
        path="/frontiers/complete/dokku"
        element={<FrontiersAppReturnDokku />}
      />
      <Route
        exact
        path="/frontiers/complete/localhost"
        element={<FrontiersAppReturnLocalhost />}
      />
    </Routes>
  );
}

export default App;
