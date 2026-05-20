import { Routes, Route } from "react-router";
import HomePage from "main/pages/HomePage";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import FrontiersAppPage from "main/pages/FrontiersAppPage.jsx";
import FrontiersAppReturn from "main/pages/FrontiersAppReturn.jsx";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/frontiers" element={<FrontiersAppPage />} />
      <Route
        exact
        path="/frontiers/complete"
        element={<FrontiersAppReturn />}
      />
    </Routes>
  );
}

export default App;
