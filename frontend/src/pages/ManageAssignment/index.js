import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  CloseIcon,
  EditIcon,
  FilterAltIcon,
  HighlightOffIcon,
  RestartAltSharpIcon,
  SearchIcon,
} from "../../components/icon";
import "./style.scss";
import assignmentService from "./../../api/assignmentService";
import { toast } from "react-toastify";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { DatePicker } from "antd";
import "react-datepicker/dist/react-datepicker.css";
import returningService from "../../api/returningService";
import Paging from "../../components/paging";

const state = ["All", "Accepted", "Waiting for acceptance", "Declined"];

const tableHead = [
  {
    id: "id",
    name: "No.",
    isDropdown: true,
  },
  {
    id: "assetCode",
    name: "Asset Code",
    isDropdown: true,
  },
  {
    id: "assetName",
    name: "Asset Name",
    isDropdown: true,
  },
  {
    id: "assignedTo",
    name: "Assigned To",
    isDropdown: true,
  },
  {
    id: "assignedBy",
    name: "Assigned By",
    isDropdown: true,
  },
  {
    id: "assignedDate",
    name: "Assigned Date",
    isDropdown: true,
  },
  {
    id: "state",
    name: "State",
    isDropdown: true,
  },
];

const ManageAssignment = () => {
  const navigate = useNavigate();
  const [currentCol, setCurrentCol] = useState("");
  const [isSortDown, setIsSortDown] = useState(true);

  const [assignmentList, setAssignmentList] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(0);
  const rowPerPage = 20;

  const [content, setContent] = useState("");
  const [filterByState, setFilterByState] = useState("All");
  const [filterByDate, setFilterByDate] = useState(null);

  const [disable, setDisable] = useState(null);
  const [createReturn, setCreateReturn] = useState();

  const loadData = () => {
    Loading.standard("Loading...");

    assignmentService
      .getAllAssignments()
      .then((res) => {
        const newAssignmentId = localStorage.getItem("newAssignmentId");
        const resData = res.data;
        if (resData.length === 0) {
          toast.error("No assignment founded");
        }

        let newAssignment = resData.filter(
          (assignment) => assignment.id == newAssignmentId
        );

        let _data = [];
        if (newAssignmentId) {
          _data = resData.filter(
            (assignment) => assignment.id != newAssignmentId
          );
        } else {
          _data = [...resData];
        }

        let sorted = _data.sort((a, b) => a.id - b.id);
        setData(resData); // get data to handle

        const finalList = [...newAssignment, ...sorted];
        setAssignmentList(finalList); // get data to display (have change)
        setNumPage(Math.ceil(finalList.length / rowPerPage)); // get number of page

        Loading.remove();
        localStorage.removeItem("newAssignmentId");
      })
      .catch((err) => {
        Loading.remove();
        console.log(err);
        toast.info("No Assignment Found");
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const isEqual = (date1, date2) => {
    const d1 = moment(date1).format("L");
    const d2 = moment(date2).format("L");
    return d1.localeCompare(d2) === 0;
  };

  const handleFilterByDate = (date) => {
    setFilterByDate(date);
    handleFilter(filterByState, date);
  };

  const handleFilterByState = (filter) => {
    setFilterByState(filter);
    handleFilter(filter, filterByDate);
  };

  const handleFilter = (_state, _date) => {
    let _data = [...data];

    if (_state !== "All") {
      _data = data.filter((item) => _state.localeCompare(item.state) === 0);
    }

    if (_date) {
      _data = _data.filter((item) => isEqual(_date, item.assignedDate));
    }

    if (_data.length === 0) {
      toast.info(`No Assignment Founded`);
    }
    setNumPage(Math.ceil(_data.length / 20));
    setAssignmentList(_data);
  };

  const sortByCol = (col) => {
    let _data = [...assignmentList];
    if (currentCol === col) {
      col !== "id"
        ? setAssignmentList(_data.sort((a, b) => a[col].localeCompare(b[col])))
        : setAssignmentList(_data.sort((a, b) => a[col] - b[col]));
      setCurrentCol("");
    } else {
      col !== "id"
        ? setAssignmentList(_data.sort((a, b) => b[col].localeCompare(a[col])))
        : setAssignmentList(_data.sort((a, b) => b[col] - a[col]));
      setCurrentCol(col);
    }
    setIsSortDown(!isSortDown);
  };

  const handleSearch = () => {
    if (!content) {
      loadData();
    } else {
      Loading.standard("Searching...");

      assignmentService
        .searchAssignment(content)
        .then((res) => {
          const resData = res.data;
          if (resData.length === 0) {
            toast.error(
              `No result match with ${content}. Try again with correct format`
            );
          }
          let sorted = resData.sort((a, b) => a.id - b.id);
          const finalList = [...sorted];
          setData(finalList); // get data to handle
          setAssignmentList(finalList); // get data to display (have change)
          setNumPage(Math.ceil(finalList.length / rowPerPage)); // get number of page

          Loading.remove();
        })
        .catch((err) => {
          Loading.remove();
          console.log(err);
           if (err.response.status === 401) {
             toast.error("You are not authorized to access this page");
           } else {
             toast.info("No Assignment Found");
           }
        });
    }
  };

  const editAssignment = (code) => {
    navigate(`/edit-assignment/${code}`);
  };

  //handle delete assignment
  const handleDelete = (code) => {
    setDisable(code);
  };

  const deleteAssignment = () => {
    assignmentService
      .deleteAssignment(disable)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Assignment Deleted");
          loadData();
          setDisable(null);
        }
      })
      .catch((err) => {
        console.log(err);
        setDisable(null);
        toast.error(err.response.data.message);
      });
  };

  const handleCreateReturning = () => {
    const assId = createReturn;

    returningService
      .createNewReturning(assId)
      .then((res) => {
        if (res.status === 201) {
          toast.success(
            "Request for return successfully!. Forward to request for returning tab to view."
          );
          setCreateReturn(null);
          loadData();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("cannot create request for returning. Try later");
      });
  };

  return (
    <>
      {/* Modal to show confirm  create new request for returning */}
      <div
        className={"modal fade " + (createReturn ? " show d-block" : " d-none")}
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
                Do you want to create a returning request for this asset?
              </div>
              <div className="button">
                <button
                  className="btn btn-danger"
                  id="disable-button"
                  onClick={handleCreateReturning}
                >
                  Yes
                </button>
                <button
                  className="btn btn-outline-secondary"
                  id="cancel-button"
                  onClick={() => setCreateReturn(null)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* start dialog */}
      <div
        className={
          "modal fade" +
          (disable && disable !== "Error" ? " show d-block" : " d-none")
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
                Do you want to delete this assignment?
              </div>
              <div className="button">
                <button
                  className="btn btn-danger"
                  id="disable-button"
                  onClick={deleteAssignment}
                >
                  Delete
                </button>
                <button
                  className="btn btn-outline-secondary"
                  id="cancel-button"
                  onClick={() => setDisable(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end dialog */}

      <div className="user-list">
        <div className="title">
          <h3>Assignment List</h3>
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
                  style={{ width: "14.8rem" }}
                >
                  State
                  <FilterAltIcon />
                </button>
                <ul
                  className="dropdown-menu form-check"
                  aria-labelledby="dropMenuFilterType"
                >
                  {state.map((type) => (
                    <li key={type}>
                      <div>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={type}
                          id={type}
                          checked={filterByState === type}
                          onChange={() => handleFilterByState(type)}
                        />
                        <label className="form-check-label" htmlFor={type}>
                          {type}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {/* end filter State*/}

              {/* start filter Assigned Date*/}
              <DatePicker
                selected={filterByDate}
                onChange={(date) => handleFilterByDate(date)}
                className="border border-secondary rounded text-secondary"
                suffixIcon={<DateRangeIcon />}
                placeholder="Assigned Date"
                format={moment.localeData().longDateFormat("L")}
              />
              {/* end filter Assigned Date*/}
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
                onClick={() => {
                  navigate("/create-assignment");
                }}
                id="btnCreate"
              >
                Create new assignment
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
                assignmentList.slice(
                  (page - 1) * rowPerPage,
                  page * rowPerPage
                ) || []
              ).map((ele, index) => {
                return (
                  <>
                    {ele.status && (
                      <>
                        <tr key={index}>
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
                            {ele.assetCode}
                          </td>
                          <td
                            className="border-bottom"
                            data-bs-toggle="modal"
                            data-bs-target={"#detailUserViewModal" + ele.id}
                          >
                            {ele.assetName}
                          </td>
                          <td
                            className="border-bottom"
                            data-bs-toggle="modal"
                            data-bs-target={"#detailUserViewModal" + ele.id}
                          >
                            {ele.assignedTo}
                          </td>
                          <td
                            className="border-bottom"
                            data-bs-toggle="modal"
                            data-bs-target={"#detailUserViewModal" + ele.id}
                          >
                            {ele.assignedBy}
                          </td>
                          <td
                            className="border-bottom"
                            data-bs-toggle="modal"
                            data-bs-target={"#detailUserViewModal" + ele.id}
                          >
                            {moment(ele.assignedDate).format("L")}
                          </td>
                          <td
                            className="border-bottom"
                            data-bs-toggle="modal"
                            data-bs-target={"#detailUserViewModal" + ele.id}
                          >
                            {ele.state}
                          </td>

                          <td style={{ width: "10rem" }}>
                            <>
                              <button
                                className="btn btn-outline-secondary border-0"
                                disabled={
                                  ele.state !== "Waiting for acceptance"
                                }
                                id="btnEdit"
                                onClick={() => editAssignment(ele.id)}
                              >
                                <EditIcon />
                              </button>
                              <button
                                className="btn btn-outline-danger border-0"
                                id="btnHighlight"
                                onClick={() => handleDelete(ele.id)}
                                disabled={
                                  !(
                                    ele.state === "Waiting for acceptance" ||
                                    ele.state === "Declined"
                                  )
                                }
                              >
                                <HighlightOffIcon />
                              </button>
                              <button
                                className="btn btn-outline-primary border-0"
                                disabled={
                                  ele.state !== "Accepted" || ele.hasReturning
                                }
                                id="btnRestart"
                              >
                                <RestartAltSharpIcon
                                  onClick={() => setCreateReturn(ele.id)}
                                />
                              </button>
                            </>
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
                                  Detailed Assignment Information
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
                                    <div className="value">{ele.assetCode}</div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="label">Asset Name</div>
                                    <div className="value">{ele.assetName}</div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="label">Specification</div>
                                    <div className="value">
                                      {ele.specification}
                                    </div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="label">Assigned to</div>
                                    <div className="value">
                                      {ele.assignedTo}
                                    </div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="label">Assigned by</div>
                                    <div className="value">
                                      {ele.assignedBy}
                                    </div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="label">Assigned Date</div>
                                    <div className="value">
                                      {moment(ele.assignedDate).format("L")}
                                    </div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="label">State</div>
                                    <div className="value">{ele.state}</div>
                                  </div>
                                  <div className="detail-item">
                                    <div className="label">Note</div>
                                    <div className="value">{ele.note} </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
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

export default ManageAssignment;
