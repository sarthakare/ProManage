import "../styles/Login_Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-hot-toast";
import Art from "../assets/Art.png"

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async(e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success("Login Sucessful.");
        navigate("/home/board");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  function goToRegister() {
    navigate("/Register");
  }
  return (
    <div className="login">
      <div className="webInfo">
        <img src={Art} alt="Website Sticker" />
        <h3 className="webInfoUpperText">Welcome aboard my friend</h3>
        <h5 className="webInfoLowerText">
          just a couple of clicks and we start
        </h5>
      </div>
      <form onSubmit={loginUser} className="userInfo">
        <h1 className="title">Login</h1>
        <div className="userInput">
          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div className="userInput">
          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
        <button className="btn1" type="submit">
          Log in
        </button>
        <h5 className="noAccountText">Have no account yet?</h5>
        <button className="btn2" onClick={goToRegister}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Login;
