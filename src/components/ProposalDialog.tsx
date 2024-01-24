import React from "react";
import styled from "styled-components";
import { Dialog, DialogContent, DialogTrigger, ParLg, ParMd } from "@daohaus/ui";

import { Registry } from "../hooks/context/RegistryContext";

type ProposalDialogProps = {
  dialogTrigger: React.ReactNode;
  proposalDescription: string;
  proposalDetails: React.ReactNode;
  proposalAdditionalInfo: React.ReactNode;
  proposalSubmitTrigger: React.ReactNode;
  registry: Registry;
  success: boolean;
  successInfo?: React.ReactNode;
  title: string;
};

export const ContentParagraph = styled.div`
  margin-bottom: 2rem;
`;

export const DialogActions = styled.div`
  display: flex;
  justify-content: center;
`;

export const ProposalDialog = ({
  dialogTrigger,
  proposalDescription,
  proposalDetails,
  proposalAdditionalInfo,
  proposalSubmitTrigger,
  registry,
  success,
  successInfo,
  title,
} : ProposalDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {dialogTrigger}
      </DialogTrigger>

      <DialogContent title={title}>
        {!success ? (
          <>
            <ContentParagraph>
              <ParMd>{proposalDescription}</ParMd>
            </ContentParagraph>
            <ContentParagraph>
              {proposalDetails}
            </ContentParagraph>
            <ContentParagraph>
              <ParMd>
                Replica Registries: {`
                  ${registry.replicaRegistries.length
                    ? registry.replicaRegistries.reduce(
                        (prev, curr, idx) => `${prev}${idx > 0 && idx < registry.replicaRegistries.length ? ',' : ''} ${curr.NETWORK_NAME}`,
                        '')
                    : 'none'}
                `}
              </ParMd>
              {proposalAdditionalInfo}
            </ContentParagraph>

            <DialogActions>
              {proposalSubmitTrigger}
            </DialogActions>
          </>
        ) : (
          <>{successInfo || (<DialogActions style={{padding: "5rem 0"}}><ParLg>Success!</ParLg></DialogActions>)}</>
        )}
      </DialogContent>
    </Dialog>
  );
};
