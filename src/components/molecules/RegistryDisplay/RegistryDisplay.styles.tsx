import styled from 'styled-components';

import { DataSm } from '@daohaus/ui';

export const AddressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export const AddressDataSm = styled(DataSm)`
  color: ${({ theme }) => theme.addressDisplay.color};
`;

export const AddressCopyIcon = styled.div`
  cursor: pointer;
  margin-top: 0.5em;
`;
