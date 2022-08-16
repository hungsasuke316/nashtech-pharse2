import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import userService from "../../api/userService";
import "./style.scss";
import { Loading } from "notiflix/build/notiflix-loading-aio";


const EditUser = () => {
  const navigate = useNavigate();
  let { staffCode } = useParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  const [validateDOB, setValidateDOB] = useState("");
  const [validateJD, setValidateJD] = useState("");

  // refactor code

  useEffect(() => {
    let _location = localStorage.getItem("location");
    setLocation(_location);
  }, []);

  // get data
  useEffect(() => {
    Loading.standard("Loading...");

    userService
      .getUserByStaffCode(staffCode)
      .then((res) => {
        const [data] = [...res.data];
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setDateOfBirth(data.dateOfBirth);
        setGender(data.gender === "Male" ? true : false);
        setJoinedDate(data.joinedDate);
        setRole(data.role === "ADMIN" ? 1 : 2);
        setLocation(data.location);

        Loading.remove();
      })
      .catch((error) => {
        Loading.remove();
        console.log(error);
      });
  }, []);

  const handleEditUser = () => {
    if (dateOfBirth && joinedDate && role) {
      const payload = {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        joinedDate,
        role,
        location,
      };

      Loading.hourglass("Editing user...");

      userService
        .editUser(staffCode, payload)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Successfully edit!!");
            localStorage.setItem("newUser", res.data.userId);
            navigate("/manage-user");
            Loading.remove();
          }
        })
        .catch((error) => {
          Loading.remove();
          console.log(error);
          if (error.response.status === 403) {
            toast.error(error.response.data.message);
            navigate("/manage-user");
          } else {
            toast.error("EDIT FAILED!!");
          }
        });
    }
  };

  function handleCancel() {
    navigate("/manage-user");
  }

  const handleRole = (e) => {
    const value = e.target.value;
    setRole(parseInt(value));
  };

  const calculateAge = (date, dob) => {
    let today = new Date(date);
    let dOB = new Date(dob);
    let age = today.getFullYear() - dOB.getFullYear();
    let m = today.getMonth() - dOB.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dOB.getDate())) {
      age = age - 1;
    }
    return age;
  };

  const handleCheckAgeUser = () => {
    const age = calculateAge(new Date(), dateOfBirth);
    if (age < 18) {
      setValidateDOB("User is under 18. Please select a different date");
    }
    if (age >= 65) {
      setValidateDOB("The user has reached the retirement age.");
    }
  };

  const handleCheckJoinedDateUser = () => {
    let joindate = new Date(joinedDate);
    let dob = new Date(dateOfBirth);
    let date = new Date();
    if (joindate.getDay() === 6 || joindate.getDay() === 0) {
      setValidateJD(
        "Joined date is Saturday or Sunday. Please select a different date"
      );
    }

    if (joindate <= dob)
      setValidateJD(
        "Joined date is not later than Date of Birth. Please select a different date"
      );
    else if (calculateAge(joinedDate, dateOfBirth) < 16)
      setValidateJD(
        "User joins when under 16 years old. Please select a different date"
      );

    if (joindate.getFullYear() - date.getFullYear() > 3) {
      setValidateJD(
        "The year user joins is too far. Please select a different date"
      );
    }

  };

  return (
    <>
      <div className="form-edit-user-information">
        <div className="form-edit-user-information__container">
          <h2 className="form-edit-user-information__title">Edit User</h2>
          <div className="form-edit-user-information__input-wrapper">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              className="form-edit-user-information__input"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled
            ></input>

            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="form-edit-user-information__input"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled
            ></input>

            <label htmlFor="dateOfBirth">Date Of Birth</label>
            <div>
              <input
                type="date"
                id="dateOfBirth"
                className={
                  validateDOB
                    ? "form-create-user__input-error"
                    : "form-create-user__input"
                }
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                onBlur={handleCheckAgeUser}
                onFocus={() => setValidateDOB(null)}
              ></input>
              {validateDOB && <p className="text-danger fs-6">{validateDOB}</p>}
            </div>

            <label htmlFor="gender">Gender</label>
            <div className="form-edit-user-information__input--item">
              <div>
                <input
                  type="radio"
                  id="male"
                  name="fav_language"
                  checked={gender}
                  onClick={() => setGender(true)}
                ></input>
                <label htmlFor="male">Male</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="female"
                  name="fav_language"
                  checked={!gender}
                  onClick={() => setGender(false)}
                ></input>
                <label htmlFor="female">Female</label>
              </div>
            </div>

            <label htmlFor="joinedDate">Joined Date</label>
            <div>
              <input
                type="date"
                id="joinedDate"
                className={
                  validateJD
                    ? "form-create-user__input-error"
                    : "form-create-user__input"
                }
                value={joinedDate}
                onChange={(e) => setJoinedDate(e.target.value)}
                onBlur={handleCheckJoinedDateUser}
                onFocus={() => setValidateJD(null)}
              ></input>
              {validateJD && <p className="text-danger fs-6">{validateJD}</p>}
            </div>

            <label htmlFor="type">Type</label>
            <select
              className="form-edit-user-information__input"
              name="cars"
              id="cars"
              value={role}
              onChange={handleRole}
            >
              <option value={1} selected={role === 1}>
                ADMIN
              </option>
              <option value={2} selected={role === 2}>
                STAFF
              </option>
            </select>
          </div>

          <div className="form-edit-user-information__button-wrapper">
            <button
              id="save"
              className="form-edit-user-information__button-item"
              onClick={handleEditUser}
              disabled={
                !(
                  dateOfBirth &&
                  joinedDate &&
                  gender !== null &&
                  !validateDOB &&
                  !validateJD
                )
              }
            >
              Save
            </button>

            <button
              id="cancel"
              className="form-edit-user-information__button-item"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;
