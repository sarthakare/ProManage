import "../styles/Settings.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contex/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Settings() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
        // Clear sensitive data from state
        setOldPassword("");
        setNewPassword("");
        // Navigate after update
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

  return (
    <>
      <h2>Settings</h2>
      <form onSubmit={handleUpdate} className="userDetails">
        <div className="userInfoSettings">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="userInfoSettings">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="userInfoSettings">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="userInfoSettings">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="updateBtn">
          <button className="update" type="submit">
            Update
          </button>
        </div>
      </form>
    </>
  );
}

export default Settings;
