import { NavLink } from "react-router-dom";
import "./Nav.css";
function Nav() {
  return (
    <nav className="main-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
        Tracker
      </NavLink>
      <NavLink to="/manage" className={({ isActive }) => (isActive ? "active" : "")}>
        Manage Activities
      </NavLink>
      <NavLink to="/stats" className={({ isActive }) => (isActive ? "active" : "")}>
        Stats
      </NavLink>
    </nav>
  );
}

export default Nav;