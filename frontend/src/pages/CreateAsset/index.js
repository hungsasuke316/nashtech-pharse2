import React, { useEffect, useState } from "react";
import "./style.scss";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import assetService from "../../api/assetService";
import { toast } from "react-toastify";
import categoryService from "../../api/categoryService";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const CreateAsset = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [categoryPrefix, setCategoryPrefix] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [listCategory, setListCategory] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [specification, setSpecification] = useState("");
  const [installedDate, setInstalledDate] = useState("");
  const [state, setState] = useState("");
  const [validateSpecification, setValidateSpecification] = useState("");
  const [validateName, setValidateName] = useState("");

  const loadCategory = () => {
    Loading.standard("Loading...");
    categoryService
      .getAllCategory()
      .then((res) => {
        setListCategory(res.data);
        Loading.remove();
      })
      .catch((error) => {
        Loading.remove();
        toast.error("ERROR SERVER");
      });
  };
  // get data Category
  useEffect(() => {
    loadCategory();
  }, []);

  const handleCreateNewCategory = () => {
    if (categoryName.length >= 64) {
      toast.info("Category name must have less than 64 character");
    } else {
      const payload = {
        id: categoryPrefix,
        name: categoryName,
      };

      categoryService
        .createCategory(payload)
        .then((res) => {
          if (res.status === 201) {
            toast.success("SUCCESSFULLY ADDED!!");
            loadCategory();
            setCategoryPrefix(res.data.id);
            setCategory(payload.id);
          }
        })
        .catch((error) => {
          if (error.response.data) {
            toast.error("ERROR: " + error.response.data.message);
          } else if (error) {
            toast.error("ADD NEW CATEGORY FAILED");
          }
        });
      setCategoryName(categoryName);
    }
    
  };

  const handleCreateNewAsset = () => {
    if (name && category && specification && installedDate && state) {
      const payload = {
        name,
        category,
        specification,
        installedDate,
        state,
      };

      Loading.pulse("Creating...");

      assetService
        .createAsset(payload)
        .then((res) => {
          if (res.status === 201) {
            toast.success("SUCCESSFULLY ADDED!!");
            localStorage.setItem("newAsset", res.data.id);
            navigate("/manage-asset");
          }
          Loading.remove();
        })
        .catch((error) => {
          Loading.remove();
          console.log(error);
          if (error.response.data) {
            toast.error("ERROR: " + error.response.data.message);
          } else if (error) {
            toast.error("CREATE NEW ASSET FAILED!!");
          }
        });
    } else {
      toast.error("ALL FIELDS ARE REQUIRED");
    }
  };

  const handleCancelAsset = () => {
    navigate("/manage-asset");
  };

  const handleCheckSpecification = () => {
    if (specification.length >= 255) {
      setValidateSpecification(
        "Specification should be less than 255 characters"
      );
    }
  };
  const handleCheckName = () => {
    if (name.length >= 128) {
      setValidateName(
        "Name should be less than 128 characters"
      );
    }
  };

  return (
    <>
      <div className="form-create-asset">
        <div className="form-create-asset__container">
          <h2 className="form-create-asset__title">Create New Asset</h2>

          <div className="form-create-asset__input-wrapper">
            <label htmlFor="name">Name</label>
            <div>
              <input
                type="text"
                id="name"
                className="form-create-asset__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleCheckName}
                onFocus={() => setValidateName(null)}
              ></input>
              {validateName && (
                <p className="text-danger fs-6">{validateName}</p>
              )}
            </div>

            <label htmlFor="category">Category</label>
            <div className="btn-group">
              <button
                className="btn border dropdown-toggle w-100"
                type="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                {categoryName}
              </button>

              <div className="dropdown-menu bg-light w-100">
                <ul id="drop-list-cate">
                  {listCategory.map((category) => (
                    <li>
                      <span
                        className="dropdown-item"
                        onClick={() => {
                          setCategoryName(category.name);
                          setCategoryPrefix(category.id);
                          setCategory(category.id);
                        }}
                      >
                        {category.name}
                      </span>
                    </li>
                  ))}
                </ul>
                {!isOpen ? (
                  <div>
                    <hr className="dropdown-divider" />
                    <li>
                      <span
                        id="add-new-category"
                        className="dropdown-item danger"
                        onClick={() => {
                          setIsOpen(true);
                        }}
                      >
                        Add new category
                      </span>
                    </li>
                  </div>
                ) : (
                  <>
                    <li>
                      <div className="input-group px-3">
                        <input
                          type="text"
                          className="form-control w-50"
                          placeholder="Bluetooth Mouse"
                          value={categoryName}
                          onChange={(e) => {
                            setCategoryName(e.target.value);
                          }}
                        />
                        <input
                          type="text"
                          className="form-control w-15"
                          placeholder="BM"
                          value={categoryPrefix}
                          onChange={(e) => setCategoryPrefix(e.target.value)}
                        />
                        <div style={{ padding: "5px", cursor: "pointer" }}>
                          <CheckIcon
                            sx={{ color: "red" }}
                            onClick={handleCreateNewCategory}
                          />
                          <CloseIcon
                            onClick={() => {
                              setIsOpen(false);
                              setCategoryName("");
                              setCategoryPrefix("");
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  </>
                )}
              </div>
            </div>

            <label htmlFor="specification">Specification</label>
            <div>
              <textarea
                type="text"
                id="specification"
                className="form-create-asset__input"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                onBlur={handleCheckSpecification}
                onFocus={() => setValidateSpecification(null)}
              ></textarea>
              {validateSpecification && (
                <p className="text-danger fs-6">{validateSpecification}</p>
              )}
            </div>

            <label htmlFor="installedDate">Installed Date</label>
            <div>
              <input
                type="date"
                id="installedDate"
                className="form-create-asset__input"
                value={installedDate}
                onChange={(e) => setInstalledDate(e.target.value)}
              ></input>
            </div>

            <label htmlFor="state">State</label>
            <div className="form-create-asset__input--item">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="available"
                  name="state"
                  onClick={() => setState("Available")}
                ></input>
                <label htmlFor="available">Available</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="notAvailable"
                  name="state"
                  onClick={() => setState("Not available")}
                ></input>
                <label htmlFor="notAvailable">Not available</label>
              </div>
            </div>
          </div>

          <div className="form-create-asset__button-wrapper">
            <button
              id="save"
              className="form-create-asset__button-item"
              onClick={handleCreateNewAsset}
              disabled={
                !(name && category && specification && installedDate && state)
              }
            >
              Save
            </button>
            <button
              id="cancel"
              className="form-create-asset__button-item"
              onClick={handleCancelAsset}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAsset;
