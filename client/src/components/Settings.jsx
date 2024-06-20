import "../styles/Settings.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contex/userContext";

function Settings() {
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  return (
    <>
      <h2>Settings</h2>
      <div className="userDetails">
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
          <input type="password" placeholder="Old Password" />
        </div>
        <div className="userInfoSettings">
          <input type="password" placeholder="New Password" />
        </div>
        <div className="updateBtn">
          <button className="update">Update</button>
        </div>
      </div>
    </>
  );
}

export default Settings;
