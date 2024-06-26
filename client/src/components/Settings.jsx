import "../styles/Settings.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contex/userContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CiUser, CiLock, CiMail } from "react-icons/ci";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

function Settings() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("/updateuser", {
        name,
        email,
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        setUser(response.data);
        toast.success("User information updated successfully");
        setOldPassword("");
        setNewPassword("");
        navigate("/login");
      } else {
        toast.error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      toast.error(
        error.response?.data?.error ||
          "An error occurred while updating user information"
      );
    }
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <form onSubmit={handleUpdate} className="userDetails">
        <div className="userInfoSettings">
          <CiUser className="icon" />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="userInfoSettings">
          <CiMail className="icon" />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="userInfoSettings">
          <CiLock className="icon" />
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          {showOldPassword ? (
            <IoEyeOffOutline
              className="eyeIcon"
              onClick={toggleOldPasswordVisibility}
            />
          ) : (
            <IoEyeOutline
              className="eyeIcon"
              onClick={toggleOldPasswordVisibility}
            />
          )}
        </div>
        <div className="userInfoSettings">
          <CiLock className="icon" />
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {showNewPassword ? (
            <IoEyeOffOutline
              className="eyeIcon"
              onClick={toggleNewPasswordVisibility}
            />
          ) : (
            <IoEyeOutline
              className="eyeIcon"
              onClick={toggleNewPasswordVisibility}
            />
          )}
        </div>
        <div className="updateBtn">
          <button className="update" type="submit">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
