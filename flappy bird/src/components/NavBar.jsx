import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Github } from "lucide-react";

function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>Flappy Face</div>
      <div style={styles.links}>
        <Link
          style={{
            ...styles.link,
            ...(isActive("/") ? styles.activeLink : {}),
          }}
          to="/"
        >
          <span style={styles.linkLabel}>Home</span>
        </Link>
        <Link
          style={{
            ...styles.link,
            ...(isActive("/play") ? styles.activeLink : {}),
          }}
          to="/play"
        >
          <span style={styles.linkLabel}>Play</span>
        </Link>
        <a
          style={{ ...styles.link, ...styles.iconLink }}
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Open GitHub repository"
          title="GitHub"
        >
          <Github size={18} strokeWidth={2} />
          <span style={styles.linkLabel}>GitHub</span>
        </a>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "saturate(140%) blur(8px)",
    WebkitBackdropFilter: "saturate(140%) blur(8px)",
    color: "#0f172a",
    zIndex: 1000,
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(31,41,55,0.06)",
  },
  brand: {
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 0.3,
  },
  links: {
    display: "flex",
    gap: 8,
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#334155",
    textDecoration: "none",
    fontSize: 14,
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid transparent",
    transition:
      "color .15s ease, background-color .15s ease, border-color .15s ease, transform .15s ease",
  },
  activeLink: {
    color: "#ffffff",
    backgroundColor: "#fb923c",
    borderColor: "#fb923c",
    boxShadow: "0 4px 12px rgba(251, 146, 60, 0.3)",
  },
  iconLink: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  linkLabel: {
    lineHeight: 1,
  },
};

export default NavBar;
