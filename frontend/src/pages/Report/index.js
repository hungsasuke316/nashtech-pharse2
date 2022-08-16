import React, { useEffect, useState } from "react";
import { ArrowDropDownIcon, ArrowDropUpIcon } from "../../components/icon";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import reportService from "../../api/reportService";
import { toast } from "react-toastify";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Paging from "../../components/paging";
import { Tooltip } from "antd";

const tableHead = [
  {
    id: "name",
    name: "Category",
    isDropdown: true,
  },
  {
    id: "total",
    name: "Total",
    isDropdown: true,
  },
  {
    id: "assigned",
    name: "Assigned",
    isDropdown: true,
  },

  {
    id: "available",
    name: "Available",
    isDropdown: true,
  },
  {
    id: "notAvailable",
    name: "Not Available",
    isDropdown: true,
  },
  {
    id: "waitingForRecycling",
    name: "Waiting for recycling",
    isDropdown: true,
  },
  {
    id: "recycled",
    name: "Recycled",
    isDropdown: true,
  },
];

const Report = () => {
  const [isSortDown, setIsSortDown] = useState(true);
  const [currentCol, setCurrentCol] = useState("");
  const [reportList, setReportList] = useState([]);

  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(0);
  const rowPerPage = 20;

  const loadReportList = () => {
    Loading.standard("Loading...");
    reportService
      .getReportList()
      .then((res) => {
        const resData = res.data;
        setReportList(resData);
        setNumPage(Math.ceil(resData.length / rowPerPage)); // get number of page
        Loading.remove();
      })
      .catch((error) => {
        toast.error("ERROR SERVER");
        Loading.remove();
      });
  };

  const exportToXLSX = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const date = new Date();
    const fileName = `Report_AssetsByCategoryAndState-${date.toUTCString()}`;
    const ws = XLSX.utils.json_to_sheet(reportList);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  useEffect(() => {
    loadReportList();
  }, []);

const sortByCol = (col) => {
  let _data = [...reportList];
  if (currentCol === col) {
    col === "name"
      ? setReportList(_data.sort((a, b) => a[col].localeCompare(b[col])))
      : setReportList(_data.sort((a, b) => a[col] - b[col]));
    setCurrentCol("");
  } else {
    col === "name"
      ? setReportList(_data.sort((a, b) => b[col].localeCompare(a[col])))
      : setReportList(_data.sort((a, b) => b[col] - a[col]));
    setCurrentCol(col);
  }
  setIsSortDown(!isSortDown);
};

  return (
    <div className="user-list">
      <div className="title">
        <h3>Report</h3>
      </div>

      <div className="button d-flex justify-content-end mb-4">
        <button
          type="button"
          className="btn btn-danger"
          id="btnExport"
          onClick={exportToXLSX}
        >
          Export
        </button>
      </div>

      {/* start Table list */}
      <div className="table-user-list">
        <table>
          <thead>
            <tr>
              {tableHead.map((item, index) => (
                <th className="border-bottom border-3" key={item.id}>
                  {item.name}
                  {currentCol === item.id || currentCol === "" ? (
                    <button
                      className="btn border-0"
                      onClick={() => sortByCol(item.id)}
                      id={`sortBy${item.name}`}
                    >
                      {isSortDown ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
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
              reportList.slice((page - 1) * rowPerPage, page * rowPerPage) || []
            ).map((ele) => {
              return (
                <>
                  <tr key={ele.index}>
                    <td className="border-bottom">
                      {ele.name.length > 20 ? (
                        <Tooltip placement="top" title={ele.name}>
                          {ele.name.substring(0, 20) + "..."}
                        </Tooltip>
                      ) : (
                        ele.name
                      )}
                    </td>
                    <td className="border-bottom">{ele.total}</td>
                    <td className="border-bottom">{ele.assigned}</td>
                    <td className="border-bottom">{ele.available}</td>
                    <td className="border-bottom">{ele.notAvailable}</td>
                    <td className="border-bottom">{ele.waitingForRecycling}</td>
                    <td className="border-bottom">{ele.recycled}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* end Table list */}

      <Paging numPage={numPage} setPage={setPage} page={page} />
    </div>
  );
};

export default Report;
