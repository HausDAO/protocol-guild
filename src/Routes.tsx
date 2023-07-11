import { Routes as Router, Route } from "react-router-dom";
import { FormTest } from "./pages/FormTest";
import { Home } from "./pages/Home";
import { LayoutContainer } from "./components/LayoutContainer";
import Dao from "./pages/Dao";
import { Safes } from "./pages/Safes";
import { Settings } from "./pages/Settings";
import { Proposals } from "./pages/Proposals";
import { Proposal } from "./pages/Proposal";
import { Members } from "./pages/Members";
import { Member } from "./pages/Member";
import { NewMember } from "./pages/NewMember";
import { EditMember } from "./pages/EditMember";
import { TARGETS, TARGET_DAO } from "./targetDao";
import RageQuit from "./pages/RageQuit";
import { ControllerConfig } from "./pages/ControllerConfig";

const routePath = `molochv3/${
  TARGETS.DEFAULT_CHAIN
}/${TARGETS.DAO_ADDRESS}`;

export const Routes = () => {
  return (
    <Router>
      <Route path="/" element={<LayoutContainer />}>
        <Route index element={<Home />} />
        <Route path={`${routePath}/newmember`} element={<NewMember />} />
        <Route path={`${routePath}/editmember`} element={<EditMember />} />
        <Route path={`${routePath}/formtest`} element={<FormTest />} />
        <Route path={`${routePath}/dao`} element={<Dao />} />
        <Route path={`${routePath}/safes`} element={<Safes />} />
        <Route path={`${routePath}/settings`} element={<Settings />} />
        <Route path={`${routePath}/proposals/`} element={<Proposals />} />
        <Route path={`${routePath}/controller/`} element={<ControllerConfig />} />
        <Route
          path={`${routePath}/proposal/:proposalId`}
          element={<Proposal />}
        />
        <Route path={`${routePath}/members/`} element={<Members />} />
        <Route
          path={`${routePath}/member/:memberAddress`}
          element={<Member />}
        />
        <Route path={`${routePath}/members/ragequit`} element={<RageQuit />} />
      </Route>
    </Router>
  );
};
