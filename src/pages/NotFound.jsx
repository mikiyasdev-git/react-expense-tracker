import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page">
      <section className="card">
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">Go to dashboard</Link>
      </section>
    </div>
  );
}

export default NotFound;