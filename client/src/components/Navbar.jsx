// Navbar.jsx

import "../styles/Navbar.css";
import {
  NavLink,
  useNavigate,
  useMatch,
  useResolvedPath,
} from "react-router-dom";
import PropTypes from "prop-types";
import logo from "../assets/codesandbox.png";
import layout from "../assets/layout.png";
import database from "../assets/database.png";
import settings from "../assets/settings.png";
import logout from "../assets/Logout.png";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const CustomNavLink = ({ to, icon, label }) => {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });

    return (
      <NavLink to={to} className={`nav-link ${match ? "active-link" : ""}`}>
        <img src={icon} alt={`${label} icon`} /> {label}
      </NavLink>
    );
  };

  CustomNavLink.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
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
            icon={layout} 
            label="Board" />
          </li>
          <li>
            <CustomNavLink
              to="/home/analytics"
              icon={database}
              label="Analytics"
            />
          </li>
          <li>
            <CustomNavLink
              to="/home/settings"
              icon={settings}
              label="Settings"
            />
          </li>
        </ul>
      </nav>
      <div className="navbar-logout">
        <h3 onClick={handleLogout}>
          <img src={logout} alt="logout icon" /> LOGOUT
        </h3>
      </div>
    </div>
  );
}

export default Navbar;
