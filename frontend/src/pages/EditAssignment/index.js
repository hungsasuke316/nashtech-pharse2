import { Button, Modal } from "antd";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchIcon } from "../../components/icon";
import SelectAsset from "../CreateAssignment/SelectAsset";
import SelectUser from "../CreateAssignment/SelectUser";
import assignmentService from "./../../api/assignmentService";

const EditAssignment = () => {
  const navigate = useNavigate();
  const { assignmentCode } = useParams();

  const [assetName, setAssetName] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState("");
  const [assetCode, setAssetCode] = useState("");
  const [fullName, setFullName] = useState("");

  //modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleUser, setIsModalVisibleUser] = useState(false);

  //validate
  const [validateNote, setValidateNote] = useState("");

  const handleNote = () => {
    if (note.length > 255) {
      setValidateNote("Note must be less than 255 characters");
    } else {
      setValidateNote("");
    }
  };

  useEffect(() => {
    Loading.standard("Loading...");

    assignmentService
      .getAssignmentById(assignmentCode)
      .then((res) => {
        setFullName(res.data.fullName);
        setAssetName(res.data.assetName);
        setAssignedDate(res.data.assignedDate);
        setNote(res.data.note);
        setUserId(res.data.assignedToId);
        setAssetCode(res.data.assetCode);
        Loading.remove();
      })
      .catch((error) => {
        console.log(error);
        Loading.remove();
      });
  }, []);

  const handleEditAssignment = () => {
    if (userId && assetCode && assignedDate) {
      const payload = {
        asset: assetCode,
        user: userId,
        assignedDate,
        note,
      };

      Loading.hourglass("Editing assignment...");

      assignmentService
        .editAssignment(assignmentCode, payload)
        .then((res) => {
          if (res.status === 200) {
            toast.success("SUCCESSFULLY EDIT!!");
            localStorage.setItem("newAssignmentId", res.data.id);
            navigate("/manage-assignment");
            Loading.remove();
          }
        })
        .catch((error) => {
          console.log(error);
          Loading.remove();
          toast.error("EDIT FAILED!!");
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
          <h2 className="form-create-asset__title">Edit Assignment</h2>

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

            <label htmlFor="asset">Asset</label>
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
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
              ></input>
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
              onClick={handleEditAssignment}
              disabled={!(fullName && assetCode && assignedDate)}
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

export default EditAssignment;
