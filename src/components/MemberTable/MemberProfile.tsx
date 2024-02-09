import { RiExternalLinkLine } from "react-icons/ri";
import styled, { useTheme } from "styled-components";

import { Link, ParMd, ProfileAvatar } from "@daohaus/ui";
import { truncateAddress } from "@daohaus/utils";

import { useMemberProfile } from "../../hooks/useMemberProfile";
import { useTargets } from "../../hooks/useTargets";

const MemberBox = styled.div`
  display: flex;
  align-items: center;
  .avatar {
    margin-right: 1.25rem;
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
  const target = useTargets();

  return (
    <MemberBox className={className}>
      <ProfileAvatar
        address={address}
        image={profile?.avatar}
        className="avatar"
      />
      <ParMd>{profile?.ens || truncateAddress(address)}</ParMd>
      <Link
        RightIcon={CustomRightIcon}
        href={`https://app.splits.org/accounts/${address}/?chainId=${Number(target.CHAIN_ID)}`}
        showExternalIcon={false}
      />
    </MemberBox>
  );
};

// TODO: how to avoid this using custom theme
const CustomRightIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const theme = useTheme();
  return (
    <RiExternalLinkLine {...props} color={theme.addressDisplay.icon.color} />
  );
}
