import { Loading } from "notiflix/build/notiflix-loading-aio";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowDropDownIcon,
  ArrowDropUpIcon,
  SearchIcon,
} from "../../components/icon";
import userService from "./../../api/userService";
import { Tooltip } from "antd";
import Paging from "../../components/paging";
import assignmentService from "./../../api/assignmentService";

const tableHead = [
  {
    id: "no",
    name: "",
    isDropdown: false,
  },
  {
    id: "staffCode",
    name: "Staff Code",
    isDropdown: true,
  },
  {
    id: "fullName",
    name: "Full Name",
    isDropdown: true,
  },
  {
    id: "role",
    name: "Type",
    isDropdown: true,
  },
];

const SelectUser = (props) => {
  const [userList, setUserList] = useState([]);
  const [numPage, setNumPage] = useState(0);
  const [page, setPage] = useState(1);
  const rowPerPage = 10;
  const [currentCol, setCurrentCol] = useState("");
  const [isSortDown, setIsSortDown] = useState(true);
  const [content, setContent] = useState("");
  const [selectUser, setSelectUser] = useState(props.staffCode);

  const loadData = () => {
    Loading.standard("Loading...");
    assignmentService
      .getAllUsersByAvailable()
      .then((res) => {
        const resData = res.data;
        if (resData.length === 0) {
          toast.error("No user founded");
        }

        let sorted = resData.sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        );

        const finalList = [...sorted];
        setUserList(finalList);
        setNumPage(Math.ceil(finalList.length / rowPerPage));
        Loading.remove();
      })
      .catch((err) => {
        Loading.remove();
        console.log(err);
        toast.info("No User Found");
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = () => {
    if (!content) {
      loadData();
    } else {
      Loading.standard("Searching...");
      assignmentService
        .searchUserByAvailable(content)
        .then((res) => {
          console.log(res);
          if (res.data.length === 0) {
            toast.error("No user founded");
          }
          const _data = res.data;
          let sorted = _data.sort((a, b) =>
            a.fullName.localeCompare(b.fullName)
          );

          setNumPage(Math.ceil(sorted.length / rowPerPage));
          setUserList(sorted);

          Loading.remove();
        })
        .catch((err) => {
          Loading.remove();
          toast.info(
            `No user match with "${content}". Try again with correct format.`
          );
        });
    }
  };

  const sortByCol = (col) => {
    let _sorted = [...userList];
    if (currentCol === col) {
      setUserList(_sorted.sort((a, b) => a[col].localeCompare(b[col])));
      setCurrentCol("");
    } else {
      setUserList(_sorted.sort((a, b) => b[col].localeCompare(a[col])));
      setCurrentCol(col);
    }
    setIsSortDown(!isSortDown);
  };

  const handleSave = () => {
    props.setUserId(selectUser);
    props.setFullName(
      userList.find((item) => item.staffCode === selectUser).fullName
    );
    props.setIsModalVisibleUser(false);
  };

  const handleCancel = () => {
    props.setUserId(props.staffCode);
    setSelectUser(props.staffCode);
    props.setIsModalVisibleUser(false);
  };

  return (
    <>
      {/* <div className="container dropdown-menu p-3 border border-dark"> */}
      <div className="d-flex justify-content-between">
        <h4 className="form-create-asset__title">Select User</h4>
        <div className="search">
          <div className="input">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button
            className="btn border-dark border-start border-bottom-0 border-end-0 border-top-0 rounded-0 me-1"
            onClick={handleSearch}
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* start Table list */}
      <div>
        <table className="w-100 table table-hover">
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
                      {item.isDropdown &&
                        (isSortDown ? (
                          <ArrowDropDownIcon />
                        ) : (
                          <ArrowDropUpIcon />
                        ))}
                    </button>
                  ) : (
                    <button
                      className="btn border-0"
                      onClick={() => sortByCol(item.id)}
                      id={`sortBy${item.name}`}
                    >
                      {item.isDropdown && <ArrowDropDownIcon />}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              userList.slice((page - 1) * rowPerPage, page * rowPerPage) || []
            ).map((ele) => {
              return (
                <>
                  <tr
                    key={ele.staffCode}
                    onClick={() => setSelectUser(ele.staffCode)}
                  >
                    <td>
                      <input
                        className="form-check-input"
                        type="radio"
                        id={ele.staffCode}
                        name="state"
                        checked={ele.staffCode === selectUser}
                      ></input>
                    </td>
                    <td className="border-bottom">{ele.staffCode}</td>
                    <td className="border-bottom">
                      {ele.fullName.length > 20 ? (
                        <Tooltip placement="top" title={ele.fullName}>
                          {ele.fullName.substring(0, 20) + "..."}
                        </Tooltip>
                      ) : (
                        ele.fullName
                      )}
                    </td>
                    <td className="border-bottom">{ele.role}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>

        <Paging numPage={numPage} setPage={setPage} page={page} />

        <div className="d-flex justify-content-end gap-4">
          <button
            className={`form-create-asset__button-item btn btn-danger ${
              selectUser ? "" : "disabled"
            }`}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="form-create-asset__button-item btn btn-light border-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
      {/* end Table list */}
      {/* </div> */}
    </>
  );
};

export default SelectUser;
