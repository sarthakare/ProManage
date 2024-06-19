import "../styles/Login_Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Art from "../assets/Art.png";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = data;
    // Check if passwords match
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    try {
      const { data } = await axios.post("/register", {
        name,
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success("Login Sucessfull.");
        navigate("/home/board");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  function goToLogin() {
    navigate("/");
  }
  return (
    <div className="register">
      <div className="webInfo">
        <img src={Art} alt="" />
        <h3 className="webInfoUpperText">Welcome aboard my friend</h3>
        <h5 className="webInfoLowerText">
          just a couple of clicks and we start
        </h5>
      </div>
      <form onSubmit={registerUser} className="userInfo">
        <h1 className="title">Register</h1>
        <div className="userInput">
          <input
            type="text"
            placeholder="Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>
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
        <div className="userInput">
          <input
            type="password"
            placeholder="Confirm Password"
            value={data.confirmPassword}
            onChange={(e) =>
              setData({ ...data, confirmPassword: e.target.value })
            }
          />
        </div>
        <button className="btn1" type="submit">
          Register
        </button>
        <h5 className="noAccountText">Have an account ?</h5>
        <button className="btn2" onClick={goToLogin}>
          Log in
        </button>
      </form>
    </div>
  );
}

export default Register;
