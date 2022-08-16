import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "antd";
import moment from "moment";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import returningService from "../../api/returningService";
import { ArrowDropUpIcon } from "../../components/icon";
import Paging from "../../components/paging";
import "./index.scss";

const tableHeader = [
  {
    id: "id",
    name: "No.",
  },
  {
    id: "assetCode",
    name: "Asset Code",
  },
  {
    id: "assetName",
    name: "Asset Name",
  },
  {
    id: "requestBy",
    name: "Requested By",
  },
  {
    id: "assignedDate",
    name: "Assigned Date",
  },
  {
    id: "acceptedBy",
    name: "Accepted By",
  },
  {
    id: "returnDate",
    name: "Returned Date",
  },
  {
    id: "state",
    name: "State",
  },
];

const RequestPage = () => {
  const [filterByState, setFilterByState] = useState("ALL");
  const [filterByDate, setFilterByDate] = useState(null);
  const [searchContent, setSearchContent] = useState("");
  const [rawData, setRawData] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [currentCol, setCurrentCol] = useState("");
  const [isSortDown, setIsSortDown] = useState(true);

  const [id, setId] = useState(null);
  const [action, setAction] = useState(null);

  const initData = () => {
    Loading.standard("Loading...");
    returningService
      .getAllReturning()
      .then((res) => {
        const result = [...res.data];

        const filter = result.sort((a, b) => a.id - b.id);

        setRawData(filter);
        Loading.remove();
      })
      .catch((error) => {
        Loading.remove();
        console.log(error);
        if (error.response.status === 401) {
          toast.error("You are not authorized to access this page");
        } else {
          toast.info("No request found. Try later");
        }
        setRawData([]);
      });
  };

  useEffect(() => {
    initData();
  }, []);

  const handleSearch = () => {
    if (searchContent) {
      returningService
        .searchReturning(searchContent)
        .then((res) => {
          const result = [...res.data];
          if (result.length !== 0) {
            const filter = result.sort((a, b) => a.id - b.id);

            setRawData(filter);
            setRequestList(filter);
            setPage(1);
            setNumPage(Math.ceil(filter.length / 20));
          } else {
            toast.info(
              "Not found. Try again with other text(Asset code, Name, Request User)"
            );
          }
        })
        .catch((err) => {
          console.log(err);
          toast.info("No Request for returning found");
        });
    } else {
      initData();
    }
  };

  useEffect(() => {
    setPage(1);
    let list = [...rawData];
    if (filterByState !== "ALL" && filterByState !== null) {
      list = rawData.filter(
        (item) => item.state.localeCompare(filterByState) === 0
      );
    }

    if (filterByDate) {
      list = list.filter((item) => isEqual(filterByDate, item.returnDate));
      if (list.length === 0) {
        toast.info(`No request for returning found on ${filterByDate}`);
      }
    }

    setRequestList(list);
    setNumPage(Math.ceil(list.length / 20));
  }, [filterByState, filterByDate, rawData]);

  const isEqual = (date1, date2) => {
    const d1 = moment(date1).format("L");
    const d2 = moment(date2).format("L");
    return d1.localeCompare(d2) === 0;
  };

  const sortByCol = (col) => {
    let list = [...requestList];
    if (currentCol === col) {
      col !== "id"
        ? setRequestList(list.sort((a, b) => a[col]?.localeCompare(b[col])))
        : setRequestList(list.sort((a, b) => a[col] - b[col]));
      setCurrentCol("");
    } else {
      col !== "id"
        ? setRequestList(list.sort((a, b) => b[col]?.localeCompare(a[col])))
        : setRequestList(list.sort((a, b) => b[col] - a[col]));
      setCurrentCol(col);
    }
    setIsSortDown(!isSortDown);
  };

  const handleCompleteRequest = () => {
    const acceptUserId = localStorage.getItem("userId");
    returningService
      .completeRequest(id, acceptUserId)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Returning request marked 'Completed'");
          initData();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.warning(
          "Can not marked this returning request to 'Completed'. Try later. "
        );
      });
    setAction(null);
  };

  const handleCancelRequest = () => {
    returningService
      .deleteReturning(id)
      .then((res) => {
        toast.success("Cancel request successfully");
        initData();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 403) {
          toast.error("This request has been canceled");
        } else {
          toast.error("Cannot cancel this request. Try later");
        }
        initData();
      });
    setAction(null);
  };

  const handleAction = (_id, _action) => {
    setId(_id);
    setAction(_action);
  };

  return (
    <>
      <div
        className={action ? "modal show d-block" : " d-none"}
        tabIndex="-1"
        role="dialog"
        id={"modalConfirm"}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Are you sure?</h5>
            </div>
            <div className="modal-body">
              <div className="text d-flex flex-column">
                <p className="fs-6">
                  {action === "Complete"
                    ? "Do you want to mark this returning request as 'Completed'?"
                    : "Do you want to cancel this returning request?"}
                </p>
              </div>
              <div className="w-100 text-start">
                <button
                  type="button"
                  id="close-modal"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={
                    action === "Complete"
                      ? handleCompleteRequest
                      : handleCancelRequest
                  }
                >
                  Yes
                </button>
                <button
                  type="button"
                  id="close-modal"
                  className="btn btn-outline-secondary ms-3"
                  data-bs-dismiss="modal"
                  onClick={() => setAction(null)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="request-page">
        <div className="title">
          <h3 className="text-danger">Request List</h3>
        </div>

        <div className="board">
          <div className="board-left">
            <div className="filterByState">
              <div className="dropdown me-3">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="dropMenuFilterType"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Type
                  <FilterAltIcon />
                </button>
                <ul
                  className="dropdown-menu form-check"
                  aria-labelledby="dropMenuFilterType"
                >
                  <li>
                    <div>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="All"
                        id="typeAll"
                        checked={filterByState === "ALL"}
                        onClick={() => setFilterByState("ALL")}
                      />
                      <label className="form-check-label" htmlFor="typeAll">
                        All
                      </label>
                    </div>
                  </li>
                  <li>
                    <div>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="Completed"
                        id="typeAdmin"
                        checked={filterByState === "Completed"}
                        onClick={() => setFilterByState("Completed")}
                      />
                      <label className="form-check-label" htmlFor="typeAdmin">
                        Completed
                      </label>
                    </div>
                  </li>
                  <li>
                    <div>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="Waiting for returning"
                        id="typeStaff"
                        checked={filterByState === "Waiting for returning"}
                        onClick={() =>
                          setFilterByState("Waiting for returning")
                        }
                      />
                      <label className="form-check-label" htmlFor="typeStaff">
                        Waiting for returning
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
              <DatePicker
                selected={filterByDate}
                onChange={(date) => setFilterByDate(date)}
                className="border border-secondary rounded text-secondary"
                suffixIcon={<DateRangeIcon />}
                placeholder="Returned Date"
                format={moment.localeData().longDateFormat("L")}
              />
            </div>
          </div>

          <div className="board-right">
            <div className="search">
              <div className="input">
                <input
                  type="text"
                  value={searchContent}
                  onChange={(e) => setSearchContent(e.target.value)}
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
          </div>
        </div>

        <div className="show-return w-100">
          <table className="w-100 returningList">
            <thead>
              <tr>
                {tableHeader.map((item) => (
                  <th className="border-bottom border-3">
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

                <th></th>
              </tr>
            </thead>
            <tbody>
              {(requestList.slice((page - 1) * 20, page * 20) || []).map(
                (requestItem) => (
                  <>
                    <tr key={requestItem.id}>
                      <td className="border-bottom">{requestItem.id}</td>
                      <td className="border-bottom">{requestItem.assetCode}</td>
                      <td className="border-bottom">{requestItem.assetName}</td>
                      <td className="border-bottom">{requestItem.requestBy}</td>
                      <td className="border-bottom">
                        {moment(requestItem.assignedDate).format("L")}
                      </td>
                      <td className="border-bottom">
                        {requestItem.acceptedBy}
                      </td>
                      <td className="border-bottom">
                        {requestItem.returnDate
                          ? moment(requestItem.returnDate).format("L")
                          : ""}
                      </td>
                      <td className="border-bottom">{requestItem.state}</td>
                      <td>
                        <button
                          className="btn btn-outline-secondary border-0"
                          id="btnCheck"
                          disabled={requestItem.state === "Completed"}
                          onClick={() =>
                            handleAction(requestItem.id, "Complete")
                          }
                        >
                          <CheckIcon />
                        </button>
                        <button
                          className="btn btn-outline-danger border-0"
                          id="btnClose"
                          disabled={requestItem.state === "Completed"}
                          onClick={() => handleAction(requestItem.id, "Cancel")}
                        >
                          <CloseSharpIcon />
                        </button>{" "}
                      </td>
                    </tr>
                  </>
                )
              )}
            </tbody>
          </table>
        </div>

        <Paging numPage={numPage} setPage={setPage} page={page} />
      </div>
    </>
  );
};

export default RequestPage;
