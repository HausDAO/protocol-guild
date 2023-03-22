import { BsArrowLeft, BsShareFill } from "react-icons/bs";
import styled from "styled-components";

import { useCurrentDao, useDaoMember } from "@daohaus/moloch-v3-hooks";
import { MemberProfileCard } from "@daohaus/moloch-v3-macro-ui";
import {
  Button,
  ParLg,
  SingleColumnLayout,
  Spinner,
  useBreakpoint,
  useToast,
  widthQuery,
} from "@daohaus/ui";

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 64rem;
  margin-bottom: 3rem;
  @media ${widthQuery.md} {
    max-width: 100%;
    min-width: 0;
  }
  @media ${widthQuery.sm} {
    flex-direction: column;
    button:first-child {
      margin-bottom: 1rem;
    }
  }
`;

const StyledArrowLeft = styled(BsArrowLeft)`
  height: 1.6rem;
  width: 1.6rem;
`;

export const Member = () => {
  const { isFetched, isFetching, member } = useDaoMember();
  const { daoChain, daoId } = useCurrentDao();
  const { successToast } = useToast();
  const isMobile = useBreakpoint(widthQuery.sm);

  const handleOnClick = () => {
    navigator.clipboard.writeText(`${window.location.href}`);
    successToast({
      title: "URL copied to clipboard",
    });
  };

  if (!daoChain || !daoId) return <ParLg>DAO Not Found</ParLg>;

  return (
    <SingleColumnLayout title="Member Profile">
      {!member && isFetching && <Spinner size="12rem" />}
      {!member && isFetched && <ParLg>Member Not Found</ParLg>}
      {member && (
        <>
          <ButtonsContainer>
            {/* <ButtonRouterLink
              to={`/molochv3/${daoChain}/${daoId}/members`}
              IconLeft={StyledArrowLeft}
              color="secondary"
              linkType="no-icon-external"
              variant="outline"
              fullWidth={isMobile}
              // was centerAlign={isMobile}
              // Default has always been center.
              // Not sure what is supposed to happen here?
              // justify={isMobile ? 'center' : 'flex-start'}
            >
              MEMBERS
            </ButtonRouterLink> */}
            <Button
              IconLeft={BsShareFill}
              onClick={handleOnClick}
              fullWidth={isMobile}
              // Same as above
              // centerAlign={isMobile}
            >
              SHARE PROFILE
            </Button>
          </ButtonsContainer>
          <MemberProfileCard
            daoChain={daoChain}
            daoId={daoId}
            member={member}
          />
        </>
      )}
    </SingleColumnLayout>
  );
};
