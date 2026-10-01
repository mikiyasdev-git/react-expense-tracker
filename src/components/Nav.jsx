import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <NavLink to="/">Dashboard</NavLink>

          <NavLink to="/accounts">Accounts</NavLink>

          <NavLink to="/categories">Categories</NavLink>

          <NavLink to="/transactions">Transactions</NavLink>

          <NavLink to="/budgets">Budgets</NavLink>

          <NavLink to="/reports">Reports</NavLink>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>

          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  );
}

export default Nav;