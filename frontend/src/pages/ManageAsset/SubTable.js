import React from "react";
import moment from "moment";

const tableHead = [
  {
    id: "date",
    name: "Date",
  },
  {
    id: "assignedTo",
    name: "Assigned To",
  },
  {
    id: "assignedBy",
    name: "Assigned By",
    isDropdown: true,
  },
  {
    id: "returnedDate",
    name: "Returned Date",
  },
];

const SubTable = ({ history }) => {
  return (
    <div className="table-user-list">
      <table>
        <thead>
          <tr>
            {tableHead.map((item) => (
              <th className="border-bottom border-3" key={item.id}>
                {item.name}
                <button
                  className="btn border-0"
                  id={`sortBy${item.name}`}
                  // onClick={() => sortByCol(item.id)}
                >
                  {/* {item.isDropdown ? <ArrowDropDownIcon /> : <></>} */}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(history || []).map((ele, index) => (
            <>
              <tr key={index}>
                <td className="border-bottom">
                  {moment(ele.assignedDate).format("L")}
                </td>
                <td className="border-bottom">{ele.requestBy}</td>
                <td className="border-bottom">{ele.acceptedBy}</td>
                <td className="border-bottom">
                  {moment(ele.returnedDate).format("L")}
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubTable;
