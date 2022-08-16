import React from "react";
import "./sidebar.scss";
import { NavLink } from "react-router-dom";


const Sidebar = ({ menu, handleClick }) => {

  return (
    <>
      <div className="sidebar">
        {/* logo */}
        <div className="logo">
          <img
            src={process.env.PUBLIC_URL + "/assets/logo.jpg"}
            alt="logo"
            className="logo__image"
          />
          <h1 className="logo__title">Online Asset Management</h1>
        </div>
        {/* menu */}
        <div className="menu">
          {menu.map((item) => (
            <NavLink
              key={item.id}
              to={item.link}
              onClick={e => handleClick(e, item.id)}
              className={({ isActive }) =>
                isActive ? "menu__item--active menu-navlink" : "menu-navlink"
              }
            >
              {item.name}
            </NavLink>
          ))}          
        </div>
      </div>
    </>
  );
};

export default Sidebar;
