import { sandDark } from "@radix-ui/colors";
import styled from "styled-components";


export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
// background-color: ${({ theme }) => theme.secondary.step3};
export const TableHead = styled.thead`
  height: 6rem;
  background-color: ${sandDark.sand1};
`;

export const TableRow = styled.tr`
  height: 5rem;
  &:nth-child(odd) {
    background-color: ${sandDark.sand3};
  }

  &:nth-child(even) {
    background-color: ${sandDark.sand1};
  }
`;

export const TableData = styled.td`
  padding: 1rem;
  text-align: center;
  
`;
