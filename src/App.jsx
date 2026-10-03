import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="app">
      <Header appName="Finance Manager" />

      <Nav />

      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/accounts"
            element={<Accounts />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/transactions"
            element={<Transactions />}
          />
          <Route
            path="/budgets"
            element={<Budgets />}
          />
          <Route path="/reports" element={<Reports />} />
          {/* Catch-all: unknown URLs */}
        <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}

export default App;