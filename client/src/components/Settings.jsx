import "../styles/Settings.css";

function settings() {
  return (
    <>
      <h2>Settings</h2>
      <div className="userDetails">
        <div className="userInfoSettings">
          <input type="text" placeholder="Name" />
        </div>
        <div className="userInfoSettings">
          <input type="text" placeholder="Email" />
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

export default settings
