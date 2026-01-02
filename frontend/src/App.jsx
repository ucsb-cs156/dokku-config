import { Routes, Route } from "react-router";
import HomePage from "main/pages/HomePage";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
