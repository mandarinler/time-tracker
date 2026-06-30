import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav className="main-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
        Tracker
      </NavLink>
      <NavLink to="/manage" className={({ isActive }) => (isActive ? "active" : "")}>
        Manage Activities
      </NavLink>
    </nav>
  );
}

export default Nav;