import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const scrollToSection = (id) => {
    setOpen(false);

    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        
        {/* LOGO */}
        <Link to="/" className="logo">
          InoMail
        </Link>

        {/* HAMBURGER (MOBILE) */}
        <button
          className={`hamburger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAV LINKS */}
        <nav className={`nav-links ${open ? "open" : ""}`}>
          <button onClick={() => scrollToSection("features")}>
            Features
          </button>

          <button onClick={() => scrollToSection("pricing")}>
            Pricing
          </button>

          <button onClick={() => scrollToSection("contact")}>
            Contact
          </button>

          <Link to="/login" onClick={() => setOpen(false)}>
            Login
          </Link>

          <Link
            to="/register"
            className="nav-cta"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;