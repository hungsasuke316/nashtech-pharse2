// import React, { useEffect, useState } from "react";
// import "./header.scss";
// import { useNavigate } from "react-router-dom";
// import authService from "../../api/authService";
// import IconEyeClose from "../../components/icon/IconEyeClose";
// import IconEyeOpen from './../../components/icon/IconEyeOpen';
// import { toast } from "react-toastify";

// const Header = ({ header }) => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("Username");
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [togglePasswordOld, setTogglePasswordOld] = useState(false);
//   const [togglePasswordNew, setTogglePasswordNew] = useState(false);
//   const [action, setAction] = useState(0);
//   const [error, setError] = useState("");
//   useEffect(() => {
//     let name = localStorage.getItem("username");
//     setUsername(name);
//   }, []);

//   const handleLogOut = () => {
//     authService
//       .logout()
//       .then(() => {
//         localStorage.clear();
//         toast.success("Logout successfully!");
//         navigate("/login");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const handleChangePassword = () => {
//     const userId = localStorage.getItem("userId");
//     const payload = {
//       userId,
//       newPassword,
//       oldPassword,
//     };
//     authService
//       .changePassword(payload)
//       .then(() => {
//         setAction(1);
//         setNewPassword("");
//         setOldPassword("");
//       })
//       .catch((err) => {
//         console.log(err);
//         if (err.response.data) {
//           setError("Password is incorrect");
//         }
//       });
//   };
//   const handleClose = () => {
//     setAction(0);
//     setNewPassword("");
//     setOldPassword("");
//     setError("");
//     setTogglePasswordNew(false);
//     setTogglePasswordOld(false);
//   };

//   return (
//     <>
//       {/* modal notify change password success */}
//       <div
//         className={action === 1 ? "modal show d-block" : " d-none"}
//         tabIndex="-1"
//         role="dialog"
//         id={"modalSuccess"}
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered modal-sm">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title text-danger">Change Password</h5>
//             </div>
//             <div className="modal-body">
//               <div className="text d-flex flex-column">
//                 <p>Your password has been changed successfully!</p>
//               </div>
//               <div className="w-100 text-end">
//                 <button
//                   type="button"
//                   id="close-modal"
//                   className="btn btn-outline-secondary ms-5 "
//                   data-bs-dismiss="modal"
//                   onClick={handleClose}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="header">
//         <div className="header__title">{header}</div>
//         <div className="header__username " id="user_header">
//           <div className="btn-group">
//             <button
//               type="button"
//               className="btn btn-error dropdown-toggle dropdown-toggle-split my-auto"
//               id="dropdownMenuReference"
//               data-bs-toggle="dropdown"
//               aria-expanded="false"
//               data-bs-reference="parent"
//             >
//               <span className="mx-2">{username}</span>
//             </button>
//             <ul
//               className="dropdown-menu"
//               aria-labelledby="dropdownMenuReference"
//             >
//               <li
//                 className="dropdown-item"
//                 data-bs-toggle="modal"
//                 data-bs-target="#logoutModal"
//               >
//                 Logout
//               </li>
//               <li
//                 className="dropdown-item"
//                 id="li-bottom"
//                 onClick={() => setAction(2)}
//               >
//                 Change password
//               </li>
//             </ul>
//           </div>

//           {/* <!-- Modal logout --> */}
//           <div
//             className="modal fade"
//             id="logoutModal"
//             tabIndex="-2"
//             aria-labelledby="ModalLabel"
//             aria-hidden="true"
//           >
//             <div className="modal-dialog modal-sm">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title" id="ModalLabel">
//                     Are you sure?
//                   </h5>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     id="btnLogout"
//                     onClick={handleLogOut}
//                     data-bs-dismiss="modal"
//                   >
//                     Logout
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     data-bs-dismiss="modal"
//                     id="btnCancel"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* <!-- Modal change password --> */}
//           <div
//             className={action === 2 ? " modal show d-block" : " modal d-none"}
//             id="changePasswordModal"
//             tabIndex="-1"
//             role="dialog"
//           >
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title" id="ModalLabel">
//                     Change password
//                   </h5>
//                 </div>

//                 <div className="modal-body">
//                   <div className="mx-0 mx-md-3 mx-lg-5 my-2">
//                     <div className="old-password w-100 d-flex justify-content-between ">
//                       <label htmlFor="old-pass" className="">
//                         Old Password
//                       </label>
//                       <div className="d-flex flex-column">
//                         <input
//                           type={togglePasswordOld ? "text" : "password"}
//                           id="old-pass"
//                           value={oldPassword}
//                           className={
//                             error
//                               ? "border border-danger rounded"
//                               : "border rounded"
//                           }
//                           onChange={(e) => setOldPassword(e.target.value)}
//                           onFocus={() => setError("")}
//                         />
//                         {!togglePasswordOld ? (
//                           <IconEyeClose
//                             className="icon-eye"
//                             onClick={() => setTogglePasswordOld(true)}
//                           ></IconEyeClose>
//                         ) : (
//                           <IconEyeOpen
//                             className="icon-eye"
//                             onClick={() => setTogglePasswordOld(false)}
//                           ></IconEyeOpen>
//                         )}
//                         {error && <p className="text-danger fs-6">{error}</p>}
//                       </div>
//                     </div>

//                     <div className="new-password  w-100 d-flex justify-content-between mt-3">
//                       <label htmlFor="new-pass" className="pe-3">
//                         New Password
//                       </label>
//                       <input
//                         type={togglePasswordNew ? "text" : "password"}
//                         id="new-pass"
//                         className="border rounded"
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                         onFocus={() => setError("")}
//                       />
//                       {!togglePasswordNew ? (
//                         <IconEyeClose
//                           className="icon-eye"
//                           onClick={() => setTogglePasswordNew(true)}
//                         ></IconEyeClose>
//                       ) : (
//                         <IconEyeOpen
//                           className="icon-eye"
//                           onClick={() => setTogglePasswordNew(false)}
//                         ></IconEyeOpen>
//                       )}
//                     </div>
//                     <br />
//                     <div className="btn-group-footer d-flex justify-content-end">
//                       <button
//                         id="btnSave"
//                         type="button "
//                         className="btn btn-danger"
//                         onClick={handleChangePassword}
//                         disabled={!(oldPassword && newPassword)}
//                       >
//                         Save
//                       </button>
//                       <button
//                         type="button "
//                         className="btn btn-primary ms-2"
//                         data-bs-dismiss="modal"
//                         id="btnCancel"
//                         onClick={handleClose}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import "./header.scss";
import { useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import IconEyeClose from "../../components/icon/IconEyeClose";
import IconEyeOpen from "./../../components/icon/IconEyeOpen";
import { toast } from "react-toastify";

const Header = ({ header }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Username");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [togglePasswordOld, setTogglePasswordOld] = useState(false);
  const [togglePasswordNew, setTogglePasswordNew] = useState(false);
  const [action, setAction] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    let name = localStorage.getItem("username");
    setUsername(name);
  }, []);

  const handleLogOut = () => {
    authService
      .logout()
      .then(() => {
        localStorage.clear();
        toast.success("Logout successfully!");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangePassword = () => {
    const userId = localStorage.getItem("userId");
    const payload = {
      userId,
      newPassword,
      oldPassword,
    };
    authService
      .changePassword(payload)
      .then(() => {
        setAction(1);
        setNewPassword("");
        setOldPassword("");
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data) {
          setError("Password is incorrect");
        }
      });
  };
  const handleClose = () => {
    setAction(0);
    setNewPassword("");
    setOldPassword("");
    setError("");
    setTogglePasswordNew(false);
    setTogglePasswordOld(false);
  };

  return (
    <>
      {/* modal notify change password success */}
      <div
        className={action === 1 ? "modal show d-block" : " d-none"}
        tabIndex="-1"
        role="dialog"
        id={"modalSuccess"}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Change Password</h5>
            </div>
            <div className="modal-body">
              <div className="text d-flex flex-column">
                <p>Your password has been changed successfully!</p>
              </div>
              <div className="w-100 text-end">
                <button
                  type="button"
                  id="close-modal"
                  className="btn btn-outline-secondary ms-5 "
                  data-bs-dismiss="modal"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="header">
        <div className="header__title">{header}</div>
        <div className="header__username " id="user_header">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-error dropdown-toggle dropdown-toggle-split my-auto"
              id="dropdownMenuReference"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-bs-reference="parent"
            >
              <span className="mx-2">{username}</span>
            </button>
            <ul
              className="dropdown-menu"
              aria-labelledby="dropdownMenuReference"
            >
              <li
                className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target="#logoutModal"
              >
                Logout
              </li>
              <li
                className="dropdown-item"
                id="li-bottom"
                onClick={() => setAction(2)}
              >
                Change password
              </li>
            </ul>
          </div>

          {/* <!-- Modal logout --> */}
          <div
            className="modal fade"
            id="logoutModal"
            tabIndex="-2"
            aria-labelledby="ModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="ModalLabel">
                    Are you sure?
                  </h5>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    id="btnLogout"
                    onClick={handleLogOut}
                    data-bs-dismiss="modal"
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    id="btnCancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Modal change password --> */}
          <div
            className={action === 2 ? " modal show d-block" : " modal d-none"}
            id="changePasswordModal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="ModalLabel">
                    Change password
                  </h5>
                </div>

                <div className="modal-body">
                  <div className="mx-0 mx-md-3 mx-lg-5 my-2">
                    <div className="old-password w-100 d-flex justify-content-between ">
                      <label htmlFor="old-pass" className="">
                        Old Password
                      </label>
                      <div className="d-flex flex-column">
                        <input
                          type={togglePasswordOld ? "text" : "password"}
                          id="old-pass"
                          value={oldPassword}
                          className={
                            error
                              ? "border border-danger rounded"
                              : "border rounded"
                          }
                          onChange={(e) => setOldPassword(e.target.value)}
                          onFocus={() => setError("")}
                        />
                        {!togglePasswordOld ? (
                          <IconEyeClose
                            className="icon-eye"
                            onClick={() => setTogglePasswordOld(true)}
                          ></IconEyeClose>
                        ) : (
                          <IconEyeOpen
                            className="icon-eye"
                            onClick={() => setTogglePasswordOld(false)}
                          ></IconEyeOpen>
                        )}
                        {error && <p className="text-danger fs-6">{error}</p>}
                      </div>
                    </div>

                    <div className="new-password  w-100 d-flex justify-content-between mt-3">
                      <label htmlFor="new-pass" className="pe-3">
                        New Password
                      </label>
                      <input
                        type={togglePasswordNew ? "text" : "password"}
                        id="new-pass"
                        className="border rounded"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setError("")}
                      />
                      {!togglePasswordNew ? (
                        <IconEyeClose
                          className="icon-eye"
                          onClick={() => setTogglePasswordNew(true)}
                        ></IconEyeClose>
                      ) : (
                        <IconEyeOpen
                          className="icon-eye"
                          onClick={() => setTogglePasswordNew(false)}
                        ></IconEyeOpen>
                      )}
                    </div>
                    <br />
                    <div className="btn-group-footer d-flex justify-content-end">
                      <button
                        id="btnSave"
                        type="button "
                        className="btn btn-danger"
                        onClick={handleChangePassword}
                        disabled={!(oldPassword && newPassword)}
                      >
                        Save
                      </button>
                      <button
                        type="button "
                        className="btn btn-primary ms-2"
                        data-bs-dismiss="modal"
                        id="btnCancel"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
