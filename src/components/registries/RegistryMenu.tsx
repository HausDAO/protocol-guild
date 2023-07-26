import { useMemo } from "react";
import { RiMore2Fill } from "react-icons/ri/index.js";
import { Link as RouterLink } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import {
  DropdownMenu,
  DropdownItem,
  font,
  Theme,
  Button,
  DropdownIconTrigger,
  DropdownContent,
  DropdownLinkStyles,
  Divider,
  Link,
} from "@daohaus/ui";

import { TARGETS } from "../../targetDao";

export const RegistryMenuTrigger = styled(Button)`
  padding: 0 4px 0 4px;

  &[data-state="open"] {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  svg.icon-right {
    color: ${({ theme }: { theme: Theme }) => theme.primary.step9};
  }

  svg.icon-left {
    margin-right: 0;
    margin: 5rem;
  }
`;

// !Mark I believe this is supposed to be a RouterLink, but I'm not 100% sure
export const RegistryMenuLink = styled(RouterLink)`
  ${DropdownLinkStyles}
  font-weight: ${font.weight.bold};
`;

export const StyledExternalLink = styled(Link)`
  ${DropdownLinkStyles}
  font-weight: ${font.weight.bold};
`;

type RegistryMenuProps = {
  home: boolean;
  registryAddress: string;
  splitAddress: string;
  networkId: string;
};

export const RegistryMenu = ({ home, registryAddress, splitAddress, networkId }: RegistryMenuProps) => {
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
          {home && (
            <>
              <DropdownItem key="upload" asChild>
                <RegistryMenuLink to={`/upload`}>Manage Membership</RegistryMenuLink>
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
          <DropdownItem key="split" asChild>
            <StyledExternalLink
              href={`https://app.0xsplits.xyz/accounts/${
                splitAddress
              }/?chainId=${Number(networkId)}`}
            >
              Split
            </StyledExternalLink>
          </DropdownItem>
          <DropdownItem key="control" asChild>
            <RegistryMenuLink to={`/replica`}>Controller</RegistryMenuLink>
          </DropdownItem>
        </>
      </DropdownContent>
    </DropdownMenu>
  );
};
