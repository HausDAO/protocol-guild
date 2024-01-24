import { useEffect } from "react";
import {
  Routes as Router,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";

import { ReactSetter } from "@daohaus/utils";

import { LayoutContainer } from "./components/layout/LayoutContainer";
import { useCurrentRegistry } from "./hooks/context/RegistryContext";
import { BulkUpload } from "./pages/BulkUpload";
import { ControllerConfig } from "./pages/ControllerConfig";
import { EditMember } from "./pages/EditMember";
import { Home } from "./pages/Home";
import { HistoryLogs } from "./pages/HistoryLogs";
import { NewMember } from "./pages/NewMember";
import { ReplicaConfig } from "./pages/ReplicaConfig";
import { Registries } from "./pages/Registries";
import { Settings } from "./pages/Settings";


export const Routes = ({
  setDaoChainId,
}: {
  setDaoChainId: ReactSetter<string | undefined>;
}) => {
  const location = useLocation();
  const pathMatch = matchPath("molochv3/:daochain/:daoid/*", location.pathname);
  const { daoChain, registryAddress } = useCurrentRegistry();
  useEffect(() => {
    if (daoChain) {
      setDaoChainId(daoChain);
    }
    if (pathMatch?.params?.daochain) {
      setDaoChainId(pathMatch?.params?.daochain);
    }
    if (!pathMatch?.params?.daochain) {
      setDaoChainId(undefined);
    }
  }, [pathMatch?.params?.daochain, setDaoChainId]);

  return (
    <Router>
      <Route path="/" element={<LayoutContainer />}>
        <Route index element={<Home />} />
        <Route path={`newmember`} element={<NewMember />} />
        <Route path={`editmember`} element={<EditMember />} />
        <Route path={`controller/:chainID`} element={<ControllerConfig />} />
        <Route path={`replica/:chainID`} element={<ReplicaConfig />} />       
        <Route path={`registries/`} element={<Registries />} />
        <Route path={`membership/`} element={<BulkUpload />} />
        <Route path={`settings/`} element={<Settings />} />
        <Route path={`history`} element={<HistoryLogs />} />
      </Route>
    </Router>
  );
};
