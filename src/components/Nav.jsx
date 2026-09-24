import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav className="nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nave-link")} >
          Dashboard
      </NavLink>
      <NavLink
        to="/expenses"
        className={({isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}>
          Expenses
      </NavLink>
    </nav>
  );
}

export default Nav;