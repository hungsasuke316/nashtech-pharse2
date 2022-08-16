import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./style.scss";
import assetService from "../../api/assetService";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const stateName = [
  "Available",
  "Not available",
  "Waiting for recycling",
  "Recycled",
];

const EditAsset = () => {
  const navigate = useNavigate();
  let { assetCode } = useParams();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [specification, setSpecification] = useState("");
  const [installedDate, setInstalledDate] = useState("");
  const [state, setState] = useState("");

  // get data
  useEffect(() => {
    Loading.standard("Loading...");

    assetService
      .getAssetById(assetCode)
      .then((res) => {
        setName(res.data.name);
        setCategory(res.data.category.id);
        setCategoryName(res.data.category.name);
        setSpecification(res.data.specification);
        setInstalledDate(res.data.installedDate);
        setState(res.data.state);

        Loading.remove();
      })
      .catch((error) => {
        Loading.remove();
        console.log(error);
      });
  }, []);

  const handleEditAsset = () => {
    if (name && specification && installedDate && state) {
      const payload = {
        name,
        specification,
        installedDate,
        state,
      };

      Loading.hourglass('Editing asset...');

      assetService
        .editAsset(assetCode, payload)
        .then((res) => {
          if (res.status === 200) {
            toast.success("SUCCESSFULLY EDIT!!");
            localStorage.setItem("newAsset", res.data.id);
            navigate("/manage-asset");
            Loading.remove();
          }
        })
        .catch((error) => {
          Loading.remove();
          toast.error("EDIT FAILED!!");
        });
    }
  };

  const handleCancel = () => {
    navigate("/manage-asset");
  };

  return (
    <>
      <div className="form-create-asset">
        <div className="form-create-asset__container">
          <h2 className="form-create-asset__title">Edit Asset</h2>

          <div className="form-create-asset__input-wrapper">
            <label htmlFor="name">Name</label>
            <div>
              <input
                type="text"
                id="name"
                className="form-create-asset__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>

            <label htmlFor="category">Category</label>
            <div className="btn-group">
              <button
                className="btn dropdown-toggle"
                id="disabled"
                aria-expanded="false"
              >
                {categoryName}
              </button>
            </div>

            <label htmlFor="specification">Specification</label>
            <div>
              <textarea
                type="text"
                id="specification"
                className="form-create-asset__input"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
              ></textarea>
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
                  checked={state === stateName[0]}
                  value={stateName[0]}
                  onClick={(e) => setState(e.target.value)}
                ></input>
                <label htmlFor="available">{stateName[0]}</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="notAvailable"
                  name="state"
                  checked={state === stateName[1]}
                  value={stateName[1]}
                  onClick={(e) => setState(e.target.value)}
                ></input>
                <label htmlFor="notAvailable">{stateName[1]}</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="notWaitingForRecycling"
                  name="state"
                  checked={state === stateName[2]}
                  value={stateName[2]}
                  onClick={(e) => setState(e.target.value)}
                ></input>
                <label htmlFor="notWaitingForRecycling">{stateName[2]}</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="notRecycled"
                  name="state"
                  checked={state === stateName[3]}
                  value={stateName[3]}
                  onClick={(e) => setState(e.target.value)}
                ></input>
                <label htmlFor="notRecycled">{stateName[3]}</label>
              </div>
            </div>
          </div>

          <div className="form-create-asset__button-wrapper">
            <button
              id="save"
              className="form-create-asset__button-item"
              onClick={handleEditAsset}
              disabled={
                !(name && category && specification && installedDate && state)
              }
            >
              Save
            </button>
            <button
              id="cancel"
              className="form-create-asset__button-item"
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

export default EditAsset;
