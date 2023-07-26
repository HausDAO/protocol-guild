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
} from "@daohaus/ui";

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

type RegistryMenuProps = {
  home: boolean;
  registryAddress: string;
};

export const RegistryMenu = ({ home, registryAddress }: RegistryMenuProps) => {
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
                <RegistryMenuLink to={`/upload`}>Membership</RegistryMenuLink>
              </DropdownItem>
              <DropdownItem key="dao" asChild>
                <RegistryMenuLink to={``}>DAO</RegistryMenuLink>
              </DropdownItem>
              <Divider />
            </>
          )}
          <DropdownItem key="split" asChild>
            <RegistryMenuLink to={``}>0xSplit</RegistryMenuLink>
          </DropdownItem>
          <DropdownItem key="control" asChild>
            <RegistryMenuLink to={`/replica`}>Controller</RegistryMenuLink>
          </DropdownItem>
        </>
      </DropdownContent>
    </DropdownMenu>
  );
};
