import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Analyse from "./pages/Analyse";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Analyse" element={<Analyse />} />
      </Routes>
    </>
  );
}

export default App;
