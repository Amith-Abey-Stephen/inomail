import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add glass effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/80 backdrop-blur-lg border-b border-white/10 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black dash-gradient flex-shrink-0">
          InoMail
        </Link>

        {/* HAMBURGER (MOBILE) */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-50"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setOpen(false)} />

        {/* NAV LINKS (MOBILE DRAW PORT + DESKTOP CENTER) */}
        <nav
          className={`${
            open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          } fixed lg:static top-0 right-0 h-screen lg:h-auto w-full max-w-xs lg:max-w-none lg:flex-1 bg-slate-900 lg:bg-transparent p-8 lg:p-0 flex flex-col lg:flex-row items-start lg:items-center lg:justify-end transition-transform duration-300 shadow-2xl lg:shadow-none border-l border-white/5 lg:border-none z-40`}
        >
          {/* Mobile Only Header inside menu */}
          <div className="lg:hidden w-full flex justify-between items-center mb-10 pb-6 border-b border-white/5">
            <span className="text-xl font-bold dash-gradient">Menu</span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Desktop Centered Links */}
          <div className="flex flex-col lg:flex-row lg:mx-auto gap-6 lg:gap-10 items-start lg:items-center w-full lg:w-auto">
            <button onClick={() => scrollToSection("features")} className="text-slate-300 hover:text-white font-semibold transition-colors text-lg lg:text-sm tracking-wide">Features</button>
            <button onClick={() => scrollToSection("how")} className="text-slate-300 hover:text-white font-semibold transition-colors text-lg lg:text-sm tracking-wide">How It Works</button>
            <button onClick={() => scrollToSection("pricing")} className="text-slate-300 hover:text-white font-semibold transition-colors text-lg lg:text-sm tracking-wide">Pricing</button>
            <button onClick={() => scrollToSection("contact")} className="text-slate-300 hover:text-white font-semibold transition-colors text-lg lg:text-sm tracking-wide">Contact</button>
          </div>
          
          {/* Mobile Separator */}
          <div className="lg:hidden w-full h-[1px] bg-white/5 my-8" />

          {/* Right Auth Groups */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center w-full lg:w-auto mt-auto lg:mt-0">
            <Link to="/login" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white font-semibold transition-colors text-lg lg:text-sm w-full lg:w-auto text-left lg:text-center block lg:inline-block">
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="btn-primary w-full lg:w-auto text-center py-3 lg:py-2.5 px-6 lg:px-5 text-lg lg:text-sm"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* End of mobile nav */}
      </div>
    </header>
  );
}

export default Navbar;
