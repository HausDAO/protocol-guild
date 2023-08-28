import { Routes as Router, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { LayoutContainer } from "./components/LayoutContainer";

import { NewMember } from "./pages/NewMember";
import { EditMember } from "./pages/EditMember";

import { ControllerConfig } from "./pages/ControllerConfig";
import { ReplicaConfig } from "./pages/ReplicaConfig";
import { CsvUpload } from "./pages/CsvUpload";
import { Registries } from "./pages/Registries";

export const Routes = () => {
  return (
    <Router>
      <Route path="/" element={<LayoutContainer />}>
        <Route index element={<Home />} />
        <Route path={`newmember`} element={<NewMember />} />
        <Route path={`editmember`} element={<EditMember />} />
        <Route path={`controller/:chainID`} element={<ControllerConfig />} />
        <Route path={`replica/:chainID`} element={<ReplicaConfig />} />       
         <Route path={`registries/`} element={<Registries />} />
        <Route path={`upload/`} element={<CsvUpload />} />
      </Route>
    </Router>
  );
};
