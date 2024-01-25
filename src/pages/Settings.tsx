import styled from 'styled-components';

import {
  AddressDisplay,
  Card,
  H3,
  ParMd,
  ParSm,
  SingleColumnLayout,
  useBreakpoint,
  widthQuery,
} from '@daohaus/ui';
import { Keychain } from '@daohaus/keychain-utils';

import { useCurrentRegistry } from '../hooks/context/RegistryContext';

const SettingsContainer = styled(Card)`
  width: 110rem;
  padding: 3rem;
  border: none;
  margin-bottom: 3rem;
  @media ${widthQuery.lg} {
    max-width: 100%;
    min-width: 0;
  }
`;

const MetaCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const MetaContent = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 3.4rem;
`;

const ContractSettings = () => {
  const {
    daoChain,
    daoId,
    domainId,
    networkName,
    registryAddress,
    safeAddress,
    splitAddress,
  } = useCurrentRegistry();
  const isMobile = useBreakpoint(widthQuery.sm);
  const daoChainId = daoChain as keyof Keychain;
  return (
    <SettingsContainer>
      <MetaCardHeader>
        <H3>Main Registry</H3>
      </MetaCardHeader>
      <MetaContent>
        <div style={{width: '43%'}}>
          <ParSm>Network</ParSm>
          <ParMd>{networkName}</ParMd>
        </div>
        <div style={{width: '43%'}}>
          <ParSm>Connext Domain ID</ParSm>
          <ParMd>{domainId}</ParMd>
        </div>
        <div>
          <ParSm>DAO (Moloch v3)</ParSm>
          <AddressDisplay
            address={daoId}
            copy
            explorerNetworkId={daoChainId}
            truncate={isMobile}
          />
        </div>
        <div>
          <ParSm>DAO Vault (Safe)</ParSm>
          <AddressDisplay
            address={safeAddress}
            copy
            truncate={isMobile}
            explorerNetworkId={daoChainId}
          />
        </div>
        <div>
          <ParSm>0xSplit</ParSm>
          <AddressDisplay
            address={splitAddress}
            copy
            truncate={isMobile}
            explorerNetworkId={daoChainId}
          />
        </div>
        <div>
          <ParSm>NetworkRegistry</ParSm>
          <AddressDisplay
            address={registryAddress}
            copy
            truncate={isMobile}
            explorerNetworkId={daoChainId}
          />
        </div>
      </MetaContent>
    </SettingsContainer>
  )
};

export const Settings = () => {
  return (
    <SingleColumnLayout title="Settings">
      <ContractSettings />
    </SingleColumnLayout>
  )
};
