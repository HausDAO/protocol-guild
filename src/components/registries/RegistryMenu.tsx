import { useMemo } from "react";
import { RiMore2Fill } from "react-icons/ri/index.js";
import { useTheme } from "styled-components";
import {
  DropdownMenu,
  DropdownItem,
  DropdownIconTrigger,
  DropdownContent,
  Divider,
} from "@daohaus/ui";

import { TARGETS, REGISTRY } from "../../targetDao";
import { ZERO_ADDRESS } from "@daohaus/utils";
import { RegistryMenuLink, StyledExternalLink } from "./RegistryOverview.styles";
import { log } from "console";


type RegistryMenuProps = {
  home: boolean;
  foreignRegistry: REGISTRY | undefined;
};

export const RegistryMenu = ({ home, foreignRegistry }: RegistryMenuProps) => {
  const theme = useTheme();

  const enableActions = useMemo(() => {
    return true;
  }, []);

  if (!enableActions) return null;
  
  console.log("foreignRegistry", foreignRegistry);

  return (
    <DropdownMenu>
      <DropdownIconTrigger Icon={RiMore2Fill} size="sm" variant="ghost" />
      <DropdownContent>
        <>
          {home && (
            <>
              <DropdownItem key="upload" asChild>
                <RegistryMenuLink to={`/upload`}>
                  Manage Membership
                </RegistryMenuLink>
              </DropdownItem>
              <DropdownItem key="dao" asChild>
                <StyledExternalLink
                  href={`https://admin.daohaus.fun/#/molochv3/${TARGETS.NETWORK_ID}/${TARGETS.DAO_ADDRESS}/proposals`}
                >
                  DAO
                </StyledExternalLink>
              </DropdownItem>
              <Divider />
            </>
          )}
          {!home && (!foreignRegistry?.REGISTRY_ADDRESS || foreignRegistry?.REGISTRY_ADDRESS == ZERO_ADDRESS) && (
            <>
              <DropdownItem key="replica" asChild>
                <RegistryMenuLink
                  to={`/replica/${foreignRegistry?.NETWORK_ID}`}
                >
                  Register
                </RegistryMenuLink>
              </DropdownItem>
            </>
          )}
          <DropdownItem key="split" asChild>
            <StyledExternalLink
              href={`https://app.0xsplits.xyz/accounts/${
                foreignRegistry?.SPLIT_ADDRESS || TARGETS.SPLIT_ADDRESS
              }/?chainId=${Number(foreignRegistry?.NETWORK_ID || TARGETS.NETWORK_ID)}`}
            >
              Split
            </StyledExternalLink>
          </DropdownItem>
          <DropdownItem key="control" asChild>
            <RegistryMenuLink to={`/controller`}>Manage Controller</RegistryMenuLink>
          </DropdownItem>
        </>
      </DropdownContent>
    </DropdownMenu>
  );
};
