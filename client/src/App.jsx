import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ViewTask from "./components/ViewTask";
import axios from "axios";
import {Toaster} from "react-hot-toast";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/viewtask/:taskId" element={<ViewTask />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
