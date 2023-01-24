import { ParMd, ProfileAvatar } from '@daohaus/ui';
import { truncateAddress } from '@daohaus/utils';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useMemberProfile } from '../hooks/useMemberProfile';

const MemberBox = styled.div`
  display: flex;
  .avatar {
    margin-right: 1.25rem;
    transform: translateY(-0.2rem);
  }
`;

export const MemberProfile = ({
  address,
  className,
}: {
  address: string;
  className?: string;
}) => {
  const { profile } = useMemberProfile({ address });

  return (
    <MemberBox className={className}>
      <ProfileAvatar
        address={address}
        image={profile?.image}
        className="avatar"
      />
      <ParMd>{profile?.name || profile?.ens || truncateAddress(address)}</ParMd>
    </MemberBox>
  );
};