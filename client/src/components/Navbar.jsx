import { useState } from "react";
import "../styles/Navbar.css";
import {
  NavLink,
  useNavigate,
  useMatch,
  useResolvedPath,
} from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../assets/codesandbox.png";
import { FiLayout } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { GoDatabase } from "react-icons/go";
import { TbLogout } from "react-icons/tb";

function Navbar() {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    navigate("/login");
    window.location.reload();
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  const CustomNavLink = ({ to, icon: Icon, label }) => {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });

    return (
      <NavLink to={to} className={`nav-link ${match ? "active-link" : ""}`}>
        <Icon className="nav-icon" /> {label}
      </NavLink>
    );
  };

  CustomNavLink.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
  };

  return (
    <div className="navbar">
      <div className="navbar-header">
        <h2>
          <img src={logo} alt="logo" />
          Pro Manage
        </h2>
      </div>
      <nav className="navbar-nav">
        <ul>
          <li>
            <CustomNavLink 
            to="/home/board" 
            icon={FiLayout} 
            label="Board" />
          </li>
          <li>
            <CustomNavLink
              to="/home/analytics"
              icon={GoDatabase}
              label="Analytics"
            />
          </li>
          <li>
            <CustomNavLink
              to="/home/settings"
              icon={IoSettingsOutline}
              label="Settings"
            />
          </li>
        </ul>
      </nav>
      <div className="navbar-logout">
        <h3 onClick={handleLogoutClick}>
          <TbLogout className="nav-icon" /> LOGOUT
        </h3>
      </div>
      {showLogoutDialog && (
        <div className="logout-dialog">
          <div className="logout-dialog-content">
            <h4>Are you sure you want to Logout?</h4>
            <button className="logoutBtn" onClick={handleLogoutConfirm}>
              Yes, Logout
            </button>
            <br />
            <button className="cancelBtn" onClick={handleLogoutCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
