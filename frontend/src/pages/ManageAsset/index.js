import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  CloseIcon,
  EditIcon,
  FilterAltIcon,
  HighlightOffIcon,
  SearchIcon,
} from "../../components/icon";
import "./index.scss";
import SubTable from "./SubTable";
import assetService from "./../../api/assetService";
import { toast } from "react-toastify";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import categoryService from "../../api/categoryService";
import Paging from "../../components/paging";
import { Tooltip } from "antd";

const filterState = [
  {
    id: "typeAll",
    value: "All",
    checked: "ALL",
  },
  {
    id: "typeAssigned",
    value: "Assigned",
    checked: "ASSIGNED",
  },
  {
    id: "typeAvailable",
    value: "Available",
    checked: "AVAILABLE",
  },
  {
    id: "typeNotAvailable",
    value: "Not available",
    checked: "NOT_AVAILABLE",
  },
  {
    id: "typeWaiting",
    value: "Waiting for recycling",
    checked: "WAITING",
  },
  {
    id: "typeRecycled",
    value: "Recycled",
    checked: "RECYCLED",
  },
];

const state = [
  "ALL",
  "Assigned",
  "Available",
  "Not available",
  "Waiting for recycling",
  "Recycled",
];

const tableHead = [
  {
    id: "id",
    name: "Asset Code",
    isDropdown: true,
  },
  {
    id: "name",
    name: "Asset Name",
    isDropdown: true,
  },
  {
    id: "category.name",
    name: "Category",
    isDropdown: true,
  },
  {
    id: "state",
    name: "State",
    isDropdown: true,
  },
];

const ManageAsset = () => {
  const navigate = useNavigate();

  const [listCategory, setListCategory] = useState([]);
  const [page, setPage] = useState(1);
  const [assetList, setAssetList] = useState([]);
  const [data, setData] = useState([]);
  const [numPage, setNumPage] = useState(0);
  const [currentCol, setCurrentCol] = useState("");
  const [content, setContent] = useState("");
  const [filterByState, setFilterByState] = useState([0, 1, 1, 1, 0, 0]);
  const [filterByCategory, setFilterByCategory] = useState("ALL");
  const [action, setAction] = useState(null);
  const [code, setCode] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyId, setHistoryId] = useState(null);
  const [isSortDown, setIsSortDown] = useState(true);

  const location = localStorage.getItem("location");
  const newAssetId = localStorage.getItem("newAsset");
  const rowPerPage = 20;

  const loadData = () => {
    Loading.standard("Loading...");

    assetService
      .getAllAssets()
      .then((res) => {
        const resData = res.data;
        if (resData.length === 0) {
          toast.error("No asset founded");
        }

        let newAsset = resData.filter((asset) => asset.id === newAssetId);
        let _data = [];
        if (newAssetId) {
          _data = resData.filter((asset) => asset.id !== newAssetId);
        } else {
          _data = [...resData];
        }
        const filterByDefault = _data.filter(isFilter);
        let sorted = filterByDefault.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setData(resData); // get data to handle

        const finalList = [...newAsset, ...sorted];
        setAssetList(finalList); // get data to display (have change)
        setNumPage(Math.ceil(finalList.length / rowPerPage)); // get number of page
        Loading.remove();
      })
      .catch((err) => {
        Loading.remove();
        console.log(err);
         if (err.response.status === 401) {
           toast.error("You are not authorized to access this page");
         } else {
           toast.info("No Asset Found");
         }
      });

    //category
    categoryService
      .getAllCategory()
      .then((res) => {
        setListCategory(res.data);
      })
      .catch((error) => {
        toast.error("ERROR SERVER");
      });
  };

  // get data from backend
  useEffect(() => {
    loadData();
    localStorage.removeItem("newAsset");
  }, []);

  const isFilter = (asset) => {
    if (state[1].localeCompare(asset.state) === 0) {
      return filterByState[1];
    } else if (state[2].localeCompare(asset.state) === 0) {
      return filterByState[2];
    } else if (state[3].localeCompare(asset.state) === 0) {
      return filterByState[3];
    } else if (state[4].localeCompare(asset.state) === 0) {
      return filterByState[4];
    } else if (state[5].localeCompare(asset.state) === 0) {
      return filterByState[5];
    }
    return false;
  };

  const handleFilterByState = (index) => {
    let temp = filterByState;
    let a = filterByState[index];
    temp[index] = a === 1 ? 0 : 1;
    setFilterByState([...temp]);
    setPage(1);

    const _data = data.filter(
      (asset) =>
        asset.category.id.localeCompare(filterByCategory) === 0 ||
        filterByCategory.localeCompare("ALL") === 0
    );

    if (filterByState[0]) {
      setAssetList(_data);
      setNumPage(Math.ceil(_data.length / rowPerPage));
      setFilterByState([1, 1, 1, 1, 1, 1]);
    } else {
      let filtered = _data.filter(isFilter);
      setNumPage(Math.ceil(filtered.length / rowPerPage));
      if (filtered.length === 0) {
        toast.info(
          `No asset in your location have state you choose. Choose another state.`
        );
      }
      setAssetList(filtered);
    }
  };

  const handleFilterByCategory = (type) => {
    setFilterByCategory(type);
    setPage(1);
    if (type === "ALL") {
      const _data = data.filter(isFilter);
      setNumPage(Math.ceil(_data.length / rowPerPage));
      setAssetList(_data);
    } else {
      let filtered = data.filter((asset) => asset.category.id === type);
      const filterState = filtered.filter(isFilter);
      if (filterState.length === 0) {
        toast.info(
          `No asset in your location have category you choose. Choose another category.`
        );
      }
      setAssetList(filterState);
      setNumPage(Math.ceil(filterState.length / rowPerPage));
    }
  };

  const sortByCol = (col) => {
    let _sorted = [...assetList];
    if (currentCol === col) {
      col !== "category.name"
        ? setAssetList(_sorted.sort((a, b) => a[col].localeCompare(b[col])))
        : setAssetList(
            _sorted.sort((a, b) => a.category.name.localeCompare(b.category.name))
          );
      setCurrentCol("");
    } else {
      col !== "category.name"
        ? setAssetList(_sorted.sort((a, b) => b[col].localeCompare(a[col])))
        : setAssetList(
            _sorted.sort((a, b) => b.category.name.localeCompare(a.category.name))
          );
      setCurrentCol(col);
    }
    setIsSortDown(!isSortDown);
  };

  const handleSearch = () => {
    setPage(1);
    if (!content) {
      loadData();
    } else {
      assetService
        .searchAsset(content)
        .then((res) => {
          const resData = res.data;
          if (resData.length === 0) {
            toast.error(
              `No result match with ${content}. Try again with correct format`
            );
          }

          let sorted = resData.sort((a, b) => a.name.localeCompare(b.name));

          const finalList = [...sorted];
          setNumPage(Math.ceil(finalList.length / rowPerPage));
          setData(finalList); // get data to handle
          setAssetList(finalList); // get data to display (have change)
        })
        .catch((err) => {
          console.log(err);
          toast.info(
            `No result match with ${content}. Try again with correct format`
          );
        });
    }
  };

  // handle edit asset here
  const editAsset = (_code) => {
    navigate(`/edit-asset/${_code}`);
  };
  // handle delete user here
  const checkAssetAvailableToDisable = (_code) => {
    setCode(_code);
    assetService
      .checkAssetHistory(_code)
      .then((res) => {
        if (res.data) {
          setAction("DELETE");
        } else {
          setAction("ERROR");
        }
      })
      .catch((err) => {
        console.log(err);
        setAction("ERROR");
      });
  };

  const disableAsset = () => {
    Loading.standard("Deleting...");
    assetService
      .deleteAsset(code)
      .then((res) => {
        if (res.status === 200) {
          setAction(null);
          loadData();
          toast.success("Asset Deleted");
        }
        Loading.remove();
      })
      .catch((err) => {
        Loading.remove();
        console.log(err);
        toast.error("Cannot delete asset");
      });
  };

  useEffect(() => {
    Loading.standard("Loading...");
    assetService
      .getAssetHistory(historyId)
      .then((res) => {
        setHistory(res.data);
        Loading.remove();
      })
      .catch((err) => {
        console.log(err);
        Loading.remove();
      });
  }, [historyId]);

  return (
    <>
      {/* start dialog */}
      <div
        className={
          "modal fade" + (action === "DELETE" ? " show d-block" : " d-none")
        }
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Are you sure?</h5>
            </div>
            <div className="modal-body confirm-disable">
              <div className="modal-subtitle">
                Do you want to delete this asset?
              </div>
              <div className="button">
                <button
                  className="btn btn-danger"
                  id="disable-button"
                  onClick={disableAsset}
                >
                  Delete
                </button>
                <button
                  className="btn btn-outline-secondary"
                  id="cancel-button"
                  onClick={() => setAction(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          "modal fade " + (action === "ERROR" ? " show d-block" : " d-none")
        }
        // className={"modal fade  show d-block"}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Cannot Delete Asset</h5>
              <button
                type="button"
                className="btn btn-outline-danger border-4"
                onClick={() => setAction(null)}
                id="btnClose"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body confirm-disable">
              <div className="modal-subtitle">
                Cannot delete the asset because it belongs to one or more
                historical assignments. <br />
                If the asset is not able to be used anymore, please update its
                state in{" "}
                <Link
                  to={`/edit-asset/${code}`}
                  className="text-primary"
                  onClick={() => setAction(null)}
                >
                  Edit Asset page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end dialog */}

      <div className="user-list">
        <div className="title">
          <h3>Asset List</h3>
        </div>

        {/* start Toolbar */}
        <div className="table-board">
          <div className="left-board">
            <div className="filter">
              {/* start filter State */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="dropMenuFilterType"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  State
                  <FilterAltIcon />
                </button>
                <ul
                  className="dropdown-menu form-check"
                  aria-labelledby="dropMenuFilterType"
                >
                  {filterState.map((type, index) => (
                    <li key={type.id}>
                      <div>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={type.value}
                          id={type.id}
                          checked={filterByState[index] === 1}
                          onChange={() => handleFilterByState(index)}
                        />
                        <label className="form-check-label" htmlFor={type.id}>
                          {type.value}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* end filter State*/}

              {/* start filter Category*/}
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="dropMenuFilterType"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Category
                  <FilterAltIcon />
                </button>
                <ul
                  className="dropdown-menu form-check w-100 text-break"
                  aria-labelledby="dropMenuFilterType"
                  style={{ maxHeight: "200px", overflowY: "scroll" }}
                >
                  <li>
                    <div>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="All"
                        id="typeAll"
                        checked={filterByCategory === "ALL"}
                        onClick={() => handleFilterByCategory("ALL")}
                      />
                      <label className="form-check-label" htmlFor="typeAll">
                        All
                      </label>
                    </div>
                  </li>
                  {listCategory.map((type) => (
                    <li key={type.id}>
                      <div>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={type.id}
                          id={type.id}
                          checked={filterByCategory === type.id}
                          onChange={() => handleFilterByCategory(type.id)}
                        />
                        <label className="form-check-label" htmlFor={type.id}>
                          {type.name}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* end filter Category*/}
            </div>
          </div>

          <div className="right-board">
            {/* start Search */}
            <div className="search">
              <div className="input">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div>
                <button
                  className="btn border-0"
                  id="btnSearch"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </button>
              </div>
            </div>
            {/* end Search */}

            {/* start Create */}
            <div className="button">
              <button
                type="button"
                className="btn btn-danger"
                id="btnCreateAsset"
                onClick={() => {
                  navigate("/create-asset");
                }}
              >
                Create new asset
              </button>
            </div>
            {/* end Create */}
          </div>
        </div>
        {/* end Toolbar */}

        {/* start Table list */}
        <div className="table-user-list">
          <table>
            <thead>
              <tr>
                {tableHead.map((item) => (
                  <th className="border-bottom border-3" key={item.id}>
                    {item.name}
                    {currentCol === item.id || currentCol === "" ? (
                      <button
                        className="btn border-0"
                        onClick={() => sortByCol(item.id)}
                        id={`sortBy${item.name}`}
                      >
                        {isSortDown ? (
                          <ArrowDropDownIcon />
                        ) : (
                          <ArrowDropUpIcon />
                        )}
                      </button>
                    ) : (
                      <button
                        className="btn border-0"
                        onClick={() => sortByCol(item.id)}
                        id={`sortBy${item.name}`}
                      >
                        <ArrowDropDownIcon />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                assetList.slice((page - 1) * rowPerPage, page * rowPerPage) ||
                []
              ).map((ele) => {
                return (
                  <>
                    <tr key={ele.id} onClick={() => setHistoryId(ele.id)}>
                      <td
                        className="border-bottom"
                        data-bs-toggle="modal"
                        data-bs-target={"#detailUserViewModal" + ele.id}
                      >
                        {ele.id}
                      </td>
                      <td
                        className="border-bottom"
                        data-bs-toggle="modal"
                        data-bs-target={"#detailUserViewModal" + ele.id}
                      >
                        {ele.name.length > 20 ? (
                          <Tooltip placement="top" title={ele.name}>
                            {ele.name.substring(0, 20) + "..."}
                          </Tooltip>
                        ) : (
                          ele.name
                        )}
                      </td>
                      <td
                        className="border-bottom"
                        data-bs-toggle="modal"
                        data-bs-target={"#detailUserViewModal" + ele.id}
                      >
                        {ele.category.name.length > 20 ? (
                          <Tooltip placement="top" title={ele.category.name}>
                            {ele.category.name.substring(0, 20) + "..."}
                          </Tooltip>
                        ) : (
                          ele.category.name
                        )}
                      </td>
                      <td
                        className="border-bottom"
                        data-bs-toggle="modal"
                        data-bs-target={"#detailUserViewModal" + ele.id}
                      >
                        {ele.state}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-secondary border-0"
                          id="btnEdit"
                          disabled={ele.state === "Assigned"}
                        >
                          <EditIcon onClick={() => editAsset(ele.id)} />
                        </button>
                        <button
                          className="btn btn-outline-danger border-0"
                          id="btnHighLight"
                          disabled={ele.state === "Assigned"}
                        >
                          <HighlightOffIcon
                            onClick={() => checkAssetAvailableToDisable(ele.id)}
                          />
                        </button>
                      </td>
                    </tr>

                    <div
                      className="modal fade"
                      id={"detailUserViewModal" + ele.id}
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content ">
                          <div className="modal-header">
                            <h5
                              className="modal-title text-danger"
                              id="exampleModalLabel"
                            >
                              Detailed Asset Information
                            </h5>
                            <button
                              type="button"
                              className="btn btn-outline-danger border-4"
                              data-bs-dismiss="modal"
                              id="btnClose"
                            >
                              <CloseIcon />
                            </button>
                          </div>
                          <div className="modal-body">
                            <div className="detail">
                              <div className="detail-item">
                                <div className="label">Asset Code</div>
                                <div className="value">{ele.id}</div>
                              </div>
                              <div className="detail-item">
                                <div className="label">Asset Name</div>
                                <div className="value">{ele.name}</div>
                              </div>
                              <div className="detail-item">
                                <div className="label">Category</div>
                                <div className="value">{ele.category.name}</div>
                              </div>
                              <div className="detail-item">
                                <div className="label">Installed Date</div>
                                <div className="value">
                                  {moment(ele.installedDate).format("L")}
                                </div>
                              </div>
                              <div className="detail-item">
                                <div className="label">State</div>
                                <div className="value">{ele.state}</div>
                              </div>
                              <div className="detail-item">
                                <div className="label">Location</div>
                                <div className="value">{location}</div>
                              </div>
                              <div className="detail-item">
                                <div className="label">Specification</div>
                                <div className="value">{ele.specification}</div>
                              </div>
                              <div className="detail-item">
                                <div className="label">History</div>
                                <div className="value">
                                  <SubTable history={history}></SubTable>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* end Table list */}

        <Paging numPage={numPage} setPage={setPage} page={page} />
      </div>
    </>
  );
};

export default ManageAsset;
