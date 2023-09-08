import { Button, Card, DropdownLinkStyles, Link, font, widthQuery } from "@daohaus/ui";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";

export const RegistryOverviewCard = styled(Card)`
  background-color: ${({ theme }) => theme.secondary.step3};
  border: 1px solid white;
  padding: 3rem;
  width: 100%;
`;

export const RegistryCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 3rem;

  .right-section {
    display: flex;
  }

  .safe-link {
    padding: 0.9rem;
    background-color: ${({ theme }) => theme.secondary.step5};
    border-radius: 4px;
  }
`;

export const DataGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-content: space-between;
  div {
    padding: 2rem 0;
    width: 25rem;

    @media ${widthQuery.sm} {
      min-width: 100%;
    }
  }
`;

export const TagSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.8rem;
`;

// MENU

export const RegistryMenuTrigger = styled(Button)`
  padding: 0 4px 0 4px;

  &[data-state="open"] {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  svg.icon-right {
    color: ${({ theme }) => theme.primary.step9};
  }

  svg.icon-left {
    margin-right: 0;
    margin: 5rem;
  }
`;

export const RegistryMenuLink = styled(RouterLink)`
  ${DropdownLinkStyles}
  font-weight: ${font.weight.bold};
`;

export const StyledExternalLink = styled(Link)`
  ${DropdownLinkStyles}
  font-weight: ${font.weight.bold};
`;
