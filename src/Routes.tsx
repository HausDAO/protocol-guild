import { Routes as Router, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { LayoutContainer } from "./components/LayoutContainer";

import { NewMember } from "./pages/NewMember";
import { EditMember } from "./pages/EditMember";

import { ControllerConfig } from "./pages/ControllerConfig";
import { ReplicaConfig } from "./pages/ReplicaConfig";

export const Routes = () => {
  return (
    <Router>
      <Route path="/" element={<LayoutContainer />}>
        <Route index element={<Home />} />
        <Route path={`newmember`} element={<NewMember />} />
        <Route path={`editmember`} element={<EditMember />} />
        <Route path={`controller/`} element={<ControllerConfig />} />
        <Route path={`replicas/`} element={<ReplicaConfig />} />

      </Route>
    </Router>
  );
};
