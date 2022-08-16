import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userService from "../../api/userService";
import "./style.scss";
import { Loading } from "notiflix/build/notiflix-loading-aio";


const CreateUser = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState(null);
  const [joinedDate, setJoinedDate] = useState("");
  const [role, setRole] = useState("2");
  const [openLocation, setOpenLocation] = useState(false);
  const [location, setLocation] = useState("");

  const [validateDOB, setValidateDOB] = useState("");
  const [validateJD, setValidateJD] = useState("");
  const [validateFirstName, setvalidateFirstName] = useState("");
  const [validateLastName, setvalidateLastName] = useState("");

  // refactor code

  useEffect(() => {
    let _location = localStorage.getItem("location");
    setLocation(_location);
  }, []);

  const handleCreateNewUser = () => {
    if (firstName.length >= 128 || lastName >= 128) {
      toast.warning(
        "First name and last name must be smaller then 128 characters"
      );
    }

    if (firstName && lastName && dateOfBirth && joinedDate && role) {
      const payload = {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        joinedDate,
        role,
        location,
      };

      Loading.pulse("Creating...");

      userService
        .createUser(payload)
        .then((res) => {
          if (res.status === 201) {
            toast.success("Successfully added!!");
            localStorage.setItem("newUser", res.data.userId);
            navigate("/manage-user");
          }
          Loading.remove();
        })
        .catch((error) => {
          Loading.remove();
          toast.error("CREATE NEW USER FAILED!!");
        });
    } else {
      toast.error("ALL FIELDS ARE REQUIRE");
    }
  };

  function handleCancel() {
    navigate("/manage-user");
  }

  const handleRole = (e) => {
    const value = e.target.value;
    setRole(parseInt(value));
    if (value === "1") {
      setOpenLocation(true);
    } else if (value === "2") {
      setOpenLocation(false);
    }
  };

  const handleCheckFirstName = () => {
    let regex = /^[A-Za-z0-9 ]+$/;
    if (!firstName.match(regex)) {
      setvalidateFirstName("First name  not contain special symbols");
    }
    if (!firstName) {
      setvalidateFirstName("First Name is required");
    }
    if (firstName.length >= 128) {
      setvalidateFirstName("First name max length 128 character");
    }
  };

  const handleCheckLastName = () => {
    let regex = /^[A-Za-z0-9 ]+$/;
    if (!lastName.match(regex)) {
      setvalidateLastName("Last name not contain special symbols");
    }
    if (!lastName) {
      setvalidateLastName("Last name is required");
    }
    if (lastName.length >= 128) {
      setvalidateLastName("Last name max length 128 character");
    }
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
    else if (age >= 65) {
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

    if (joindate.getFullYear() - date.getFullYear() > 3){
      setValidateJD(
        "The year user joins is too far. Please select a different date"
      );
    }

  };

  return (
    <>
      <div className="form-create-user">
        <div className="form-create-user__container">
          <h2 className="form-create-user__title">Create New User</h2>
          <div className="form-create-user__input-wrapper">
            <label htmlFor="firstName">First Name</label>
            <div>
              <input
                type="text"
                id="firstName"
                className={
                  validateFirstName
                    ? "form-create-user__input-error"
                    : "form-create-user__input"
                }
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={handleCheckFirstName}
                onFocus={() => setvalidateFirstName(null)}
              ></input>
              {validateFirstName && (
                <p className="text-danger fs-6">{validateFirstName}</p>
              )}
            </div>

            <label htmlFor="lastName">Last Name</label>
            <div>
              <input
                type="text"
                id="lastName"
                className={
                  validateLastName
                    ? "form-create-user__input-error"
                    : "form-create-user__input"
                }
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={handleCheckLastName}
                onFocus={() => setvalidateLastName(null)}
              ></input>
              {validateLastName && (
                <p className="text-danger fs-6">{validateLastName}</p>
              )}
            </div>

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
            <div className="form-create-user__input--item">
              <div>
                <input
                  type="radio"
                  id="male"
                  name="fav_language"
                  onClick={() => setGender(true)}
                ></input>
                <label htmlFor="male">Male</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="female"
                  name="fav_language"
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
              className="form-create-user__input"
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

            {openLocation && (
              <>
                <label htmlFor="type">Location</label>
                <select
                  className="form-create-user__input"
                  name="cars"
                  id="cars"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value={"HCM"}>Ho Chi Minh</option>
                  <option value={"DN"}>Da Nang</option>
                  <option value={"HN"}>Ha Noi</option>
                </select>
              </>
            )}
          </div>

          <div className="form-create-user__button-wrapper">
            <button
              id="save"
              className="form-create-user__button-item"
              onClick={handleCreateNewUser}
              disabled={
                !(
                  firstName &&
                  lastName &&
                  dateOfBirth &&
                  joinedDate &&
                  gender !== null &&
                  !validateDOB &&
                  !validateJD &&
                  !validateFirstName &&
                  !validateLastName
                )
              }
            >
              Save
            </button>
            <button
              id="cancel"
              className="form-create-user__button-item"
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

export default CreateUser;
