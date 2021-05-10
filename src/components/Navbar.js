import React from "react";
import { NavLink } from "react-router-dom";

import "../styles/navbar.css";
import Logo from "../assets/logo.png";

function Navbar() {
  return (
    <div className="Navbar">
      <div className="Navbar-logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="links">
        <NavLink
          className="single-link"
          activeClassName="active-link"
          exact
          to="/"
        >
          <i className="fas fa-clock" /> Chronometer
        </NavLink>
        <NavLink
          className="single-link"
          activeClassName="active-link"
          exact
          to="/tasks"
        >
          <i className="fas fa-tasks" /> Tasks
        </NavLink>
        <NavLink
          className="single-link"
          activeClassName="active-link"
          exact
          to="/statistics"
        >
          <i className="fas fa-signal" /> Statistics
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;
