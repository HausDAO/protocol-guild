import { useMemo } from 'react';
import { RiExternalLinkLine, RiFileCopyLine } from 'react-icons/ri';
import { useTheme } from 'styled-components';

import { generateExplorerLink, ValidNetwork as ValidNetworkBase } from '@daohaus/keychain-utils';
import { Icon, Link, useCopyToClipboard } from '@daohaus/ui';
import { truncateAddress } from '@daohaus/utils';


import {
  AddressContainer,
  AddressCopyIcon,
  AddressDataSm,
} from './RegistryDisplay.styles';
import { useCurrentRegistry } from '../../../hooks/context/RegistryContext';
import { Keychain, MainnetKeyChains, TestnetKeyChains } from '../../../utils/keychain';

export type RegistryDisplayProps = {
  address: string;
  explorerNetworkId?: keyof Keychain;
  copy?: boolean;
  connextExplorer?: boolean;
  truncate?: boolean;
  txHash?: string;
  textOverride?: string;
  className?: string;
};

export const RegistryDisplay = ({
  address,
  explorerNetworkId,
  copy,
  connextExplorer,
  truncate,
  txHash,
  textOverride,
  className,
}: RegistryDisplayProps) => {
  const theme = useTheme();
  const copyToClipboard = useCopyToClipboard();
  const { registryAddress, replicaChains } = useCurrentRegistry();

  const explorerLink = useMemo(() => {
    if (!connextExplorer) {
      return generateExplorerLink({
        chainId: explorerNetworkId as ValidNetworkBase,
        address: txHash || address,
        type: txHash ? 'tx' : 'address',
      });
    }
    if (explorerNetworkId && txHash) {
      let explorerPrefix = '';
      if (TestnetKeyChains.includes(explorerNetworkId)) {
        explorerPrefix = 'testnet.';
      }
      return `https://${explorerPrefix}connextscan.io/tx/${txHash}`;
    }
  }, [address, txHash, explorerNetworkId]);

  const handleCopy = () => {
    copyToClipboard(
      txHash || address,
      `Success ${txHash ? 'Transaction Hash:' : 'Address:'}`
    );
  };

  const isReplica = registryAddress.toLocaleLowerCase() !== address.toLocaleLowerCase();
  const displayAddress = truncate ? truncateAddress(txHash || address) : (txHash || address);
  const displayLabel = !connextExplorer
    ? displayAddress
    : txHash
      ? displayAddress
      : isReplica
        ? `Replica @ ${replicaChains.find((r) => r.REGISTRY_ADDRESS?.toLocaleLowerCase() === address.toLocaleLowerCase())?.NETWORK_NAME}`
        : textOverride;

  return (
    <AddressContainer className={className}>
      <AddressDataSm>
        {displayLabel || displayAddress}
      </AddressDataSm>
      {copy && (
        <AddressCopyIcon>
          <Icon>
            <RiFileCopyLine
              size="1.5rem"
              color={theme.addressDisplay.icon.color}
              onClick={handleCopy}
            />
          </Icon>
        </AddressCopyIcon>
      )}
      {explorerLink && <Link RightIcon={CustomRightIcon} href={explorerLink} showExternalIcon={false}></Link>}
    </AddressContainer>
  );
};

// TODO: how to avoid this using custom theme
const CustomRightIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  return (
    <RiExternalLinkLine {...props} color={theme.addressDisplay.icon.color} />
  );
}
