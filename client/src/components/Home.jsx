// Home.jsx
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Board from "./Board";
import Analytics from "./Analytics";
import Settings from "./Settings";
import "../styles/Navbar.css";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="mainContent">
        <Routes>
          <Route path="board" element={<Board />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
