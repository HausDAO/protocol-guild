import { BsPlusLg } from "react-icons/bs";
import styled from "styled-components";

import { ProposalList } from "@daohaus/moloch-v3-macro-ui";
import {
  Button,
  // Dialog,
  // DialogContent,
  // DialogTrigger,
  SingleColumnLayout,
} from "@daohaus/ui";
// import { NewProposalList } from "../../components/dao/NewProposalList";
import { useCurrentRegistry } from "../../hooks/context/RegistryContext";
import { prepareProposals } from "../../utils/formHelpers";
// import {
//   BASIC_PROPOSAL_FORMS_APP,
//   ADVANCED_PROPOSAL_FORMS_APP,
// } from "../../legos/legoConfig";



const StyledLayout = styled.div`
  text-align: justify;
`;

export const Proposals = () => {
  const { daoChain, daoId } = useCurrentRegistry();
  // const basicProposals = prepareProposals(BASIC_PROPOSAL_FORMS_APP);
  // const advancedProposals = prepareProposals(ADVANCED_PROPOSAL_FORMS_APP);
  return (
    <StyledLayout>
      <SingleColumnLayout>
        <ProposalList
          allowLinks={true}
          rightActionEl={
            <Button
              href={`https://admin.daohaus.fun/#/molochv3/${daoChain}/${daoId}/proposals`}
              IconLeft={BsPlusLg}
            >
              New Proposal
            </Button>
            // <Dialog>
            //   <DialogTrigger asChild>
            //     <Button IconLeft={BsPlusLg}>New Proposal</Button>
            //   </DialogTrigger>
            //   <DialogContent title="Choose Proposal Type">
            //     <NewProposalList
            //       basicProposals={basicProposals}
            //       advancedProposals={advancedProposals}
            //     />
            //   </DialogContent>
            // </Dialog>
          }
        />
      </SingleColumnLayout>
    </StyledLayout>
  );
};
