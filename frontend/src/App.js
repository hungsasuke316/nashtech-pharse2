import "./App.css";
import { Fragment, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./components/layout/Main";

import {
  ManageUser,
  HomePage,
  Login,
  ManageAsset,
  EditUser,
  CreateUser,
  EditAsset,
  CreateAsset,
  RequestPage,
  ManageAssignment,
  CreateAssignment,
  EditAssignment,
  Report,
} from "./pages";

function App() {
  return (
    <Fragment>
      <Suspense fallback={<></>}>
        <Routes>
          <Route element={<Main></Main>}>
            <Route path="/" element={<HomePage></HomePage>} />
            <Route path="/manage-user" element={<ManageUser></ManageUser>} />
            <Route path="/manage-asset" element={<ManageAsset></ManageAsset>} />
            <Route
              path="/manage-assignment"
              element={<ManageAssignment></ManageAssignment>}
            />
            <Route
              path="/manage-request"
              element={<RequestPage></RequestPage>}
            />
            <Route path="/report" element={<Report></Report>} />
            <Route path="/create-user" element={<CreateUser></CreateUser>} />
            <Route
              path="/edit-user/:staffCode"
              element={<EditUser></EditUser>}
            />
            <Route path="/create-asset" element={<CreateAsset></CreateAsset>} />
            <Route
              path="/edit-asset/:assetCode"
              element={<EditAsset></EditAsset>}
            />
            <Route
              path="/create-assignment"
              element={<CreateAssignment></CreateAssignment>}
            />
            <Route
              path="/edit-assignment/:assignmentCode"
              element={<EditAssignment></EditAssignment>}
            />
          </Route>
          <Route path="/login" element={<Login></Login>} />
        </Routes>
      </Suspense>
    </Fragment>
  );
}

export default App;
