import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../../components/icon";
import SelectAsset from "./SelectAsset";
import SelectUser from "./SelectUser";
import "./style.scss";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import assignmentService from "../../api/assignmentService";
import { toast } from "react-toastify";
import { Button, Modal } from "antd";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [assetName, setAssetName] = useState("");
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState("");

  const [assetCode, setAssetCode] = useState("");
  const [assignedDate, setAssignedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState("");

  //modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleUser, setIsModalVisibleUser] = useState(false);

  //validate
  const [validateAssignedDate, setValidateAssignedDate] = useState("");
  const [validateNote, setValidateNote] = useState("");

  const handleAssignedDate = () => {
    let minDate = new Date().toISOString().split("T")[0];
    if (assignedDate < minDate) {
      setValidateAssignedDate(
        "Assigned date must be greater or equal current date"
      );
    } else {
      setValidateAssignedDate("");
    }
  };
  const handleNote = () => {
    if (note.length > 255) {
      setValidateNote("Note must be less than 255 characters");
    } else {
      setValidateNote("");
    }
  };
  const handleCreateNewAssignment = () => {
    if (userId && assetCode && assignedDate) {
      const payload = {
        asset: assetCode,
        user: userId,
        assignedDate,
        note,
      };

      Loading.hourglass("Creating assignment...");
      assignmentService
        .createAssignment(payload)
        .then((res) => {
          if (res.status === 201) {
            toast.success("SUCCESSFULLY ADDED!!");
            localStorage.setItem("newAssignmentId", res.data.id);

            navigate("/manage-assignment");
          }
          Loading.remove();
        })
        .catch((error) => {
          Loading.remove();
          if (error.response.data) {
            toast.error(error.response.data);
          } else {
            toast.error("ERROR SERVER");
          }
        });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleCancelAssignment = () => {
    navigate("/manage-assignment");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const showModalUser = () => {
    setIsModalVisibleUser(true);
  };
  return (
    <>
      <div className="form-create-asset">
        <div className="form-create-asset__container">
          <h2 className="form-create-asset__title">Create New Assignment</h2>

          <div className="form-create-asset__input-wrapper">
            <label htmlFor="user">User</label>

            <>
              <Button
                type="text"
                className="btn border w-100 d-flex justify-content-between flex-row-reverse"
                icon={<SearchIcon />}
                onClick={showModalUser}
              >
                {fullName ? fullName : "Select User"}
              </Button>
              <Modal
                visible={isModalVisibleUser}
                closable={false}
                mask={false}
                width={700}
                closeIcon={false}
                centered
                footer={null}
              >
                <SelectUser
                  staffCode={userId}
                  setUserId={setUserId}
                  setFullName={setFullName}
                  setIsModalVisibleUser={setIsModalVisibleUser}
                />
              </Modal>
            </>

            <label htmlFor="user">Asset</label>
            <>
              <Button
                type="text"
                className="btn border w-100 d-flex justify-content-between flex-row-reverse"
                icon={<SearchIcon />}
                onClick={showModal}
              >
                {assetName ? assetName : "Select Asset"}
              </Button>
              <Modal
                visible={isModalVisible}
                closable={false}
                mask={false}
                width={700}
                closeIcon={false}
                centered
                footer={null}
              >
                <SelectAsset
                  setAssetCode={setAssetCode}
                  setAssetName={setAssetName}
                  setIsModalVisible={setIsModalVisible}
                  assetCode={assetCode}
                />
              </Modal>
            </>

            <label htmlFor="assignedDate">Assignment Date</label>
            <div>
              <input
                type="date"
                id="assignedDate"
                className="form-create-asset__input"
                min={new Date().toISOString().split("T")[0]}
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
                onBlur={handleAssignedDate}
                onFocus={() => setValidateAssignedDate(null)}
              ></input>
              {validateAssignedDate && (
                <p className="text-danger">{validateAssignedDate}</p>
              )}
            </div>

            <label htmlFor="note">Note</label>
            <div>
              <textarea
                type="text"
                id="note"
                className="form-create-asset__input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={handleNote}
                onFocus={() => setValidateNote(null)}
              ></textarea>
              {validateNote && <p className="text-danger">{validateNote}</p>}
            </div>
          </div>

          <div className="form-create-asset__button-wrapper">
            <button
              id="save"
              className="form-create-asset__button-item"
              onClick={handleCreateNewAssignment}
              disabled={!(userId && assetCode && assignedDate)}
            >
              Save
            </button>
            <button
              id="cancel"
              className="form-create-asset__button-item"
              onClick={handleCancelAssignment}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAssignment;
