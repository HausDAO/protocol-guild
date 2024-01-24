import { useMemo } from "react";
import { RiMore2Fill } from "react-icons/ri";
import { useTheme } from "styled-components";

import {
  DropdownMenu,
  DropdownItem,
  DropdownIconTrigger,
  DropdownContent,
  Divider,
} from "@daohaus/ui";
import { ZERO_ADDRESS } from "@daohaus/utils";

import { RegistryMenuLink, StyledExternalLink } from "./RegistryOverview.styles";
import { Registry } from "../../hooks/context/RegistryContext";
import { REGISTRY } from "../../targetDao";

type RegistryMenuProps = {
  homeRegistry?: Registry;
  foreignRegistry?: REGISTRY;
};

export const RegistryMenu = ({ homeRegistry, foreignRegistry }: RegistryMenuProps) => {
  const theme = useTheme();

  const enableActions = useMemo(() => {
    return true;
  }, []);

  if (!enableActions) return null;

  return (
    <DropdownMenu>
      <DropdownIconTrigger Icon={RiMore2Fill} size="sm" variant="ghost" />
      <DropdownContent>
        <>
          {homeRegistry?.daoChain && (
            <>
              <DropdownItem key="upload" asChild>
                <RegistryMenuLink to={`/membership`}>
                  Manage Membership
                </RegistryMenuLink>
              </DropdownItem>
              <DropdownItem key="control" asChild>
                <RegistryMenuLink to={`/controller/${homeRegistry.daoChain}`}>Manage 0xSplit Control</RegistryMenuLink>
              </DropdownItem>
            </>
          )}
          {!homeRegistry && (
              <>
                {(!foreignRegistry?.REGISTRY_ADDRESS || foreignRegistry?.REGISTRY_ADDRESS == ZERO_ADDRESS) ? (
                  <DropdownItem key="replica" asChild>
                    <RegistryMenuLink
                      to={`/replica/${foreignRegistry?.NETWORK_ID}`}
                    >
                      Register Replica
                    </RegistryMenuLink>
                  </DropdownItem>
                ) : (
                  <DropdownItem key="control" asChild>
                    <RegistryMenuLink to={`/controller/${foreignRegistry?.NETWORK_ID}`}>Manage 0xSplit Control</RegistryMenuLink>
                  </DropdownItem>
                )}
              </>
          )}

          <Divider />

          {homeRegistry?.daoChain && (
            <DropdownItem key="dao" asChild>
              <StyledExternalLink
                href={`https://admin.daohaus.fun/#/molochv3/${homeRegistry.daoChain}/${homeRegistry.daoId}/proposals`}
              >
                DAO
              </StyledExternalLink>
            </DropdownItem>
          )}
          {(foreignRegistry?.SPLIT_ADDRESS !== ZERO_ADDRESS || homeRegistry?.daoChain) && (
            <DropdownItem key="split" asChild>
              <StyledExternalLink
                href={`https://app.0xsplits.xyz/accounts/${
                  foreignRegistry?.SPLIT_ADDRESS || homeRegistry?.splitAddress
                }/?chainId=${Number(foreignRegistry?.NETWORK_ID || homeRegistry?.daoChain)}`}
              >
                0xSplit
              </StyledExternalLink>
            </DropdownItem>
          )}
        </>
      </DropdownContent>
    </DropdownMenu>
  );
};
