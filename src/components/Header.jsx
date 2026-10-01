function Header({ appName = "Finance Manager" }) {
  return (
    <header>
      <h1>{appName}</h1>

      <div>
        <span>Personal Finance</span>
      </div>
    </header>
  );
}

export default Header;