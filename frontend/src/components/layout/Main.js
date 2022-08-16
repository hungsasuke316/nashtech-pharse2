import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
const list = [
  {
    id: 1,
    name: "Home",
    link: "/",
    role: "STAFF",
  },
  {
    id: 1,
    name: "Home",
    link: "/",
    role: "ADMIN",
  },
  {
    id: 2,
    name: "Manage User",
    link: "/manage-user",
    role: "ADMIN",
  },
  {
    id: 3,
    name: "Manage Asset",
    link: "/manage-asset",
    role: "ADMIN",
  },
  {
    id: 4,
    name: "Manage Assignment",
    link: "/manage-assignment",
    role: "ADMIN",
  },
  {
    id: 5,
    name: "Request for Returning",
    link: "/manage-request",
    role: "ADMIN",
  },
  {
    id: 6,
    name: "Report",
    link: "/report",
    role: "ADMIN",
  },
];

//Page dùng chung cho các Route
const Main = () => {
  const [menu, setMenu] = useState([]);
  const [header, setHeader] = useState(list[0].name);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  // sidebar menu
  useEffect(() => {
    const checkUser = localStorage.getItem("userId");
    const checkRole = localStorage.getItem("role");
    if (!checkUser) {
      navigate("/login");
    }
    if (checkUser && checkRole === "ADMIN") {
      setMenu(list.filter((item) => item.role === "ADMIN"));
    } else {
      setMenu(list.filter((item) => item.role === "STAFF"));
    }
  }, []);

  const handleClick = (e, id) => {
    setHeader(list.find((item) => item.id === id).name);
  };

  return (
    <>
      <Header header={header}></Header>
      <div style={{ display: "flex" }}>
        <Sidebar menu={menu} handleClick={handleClick}></Sidebar>
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default Main;
