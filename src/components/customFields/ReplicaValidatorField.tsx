import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Buildable, WrappedInput, Field, SuccessMessage, ErrorMessage } from "@daohaus/ui";
import { EthAddress, ReactSetter, ZERO_ADDRESS } from "@daohaus/utils";

import { createViemClient } from "../../utils/createContract";
import { ValidNetwork } from "../../utils/keychain";
import { APP_ABIS } from "../../legos/abis";

enum SplitFetchStates {
  Idle = '',
  Loading = 'Loading 0xSplit Data...',
  Error = 'Error fetching 0xSplit data',
  Success = 'Replica has a Valid 0xSplit',
}

const fetchSplitControllerState = async ({
  chainId,
  replicaAddress,
  setFetchState,
  setNewPotentialController,
  shouldUpdate,
} : {
  chainId?: ValidNetwork,
  replicaAddress?: EthAddress,
  setFetchState: ReactSetter<SplitFetchStates>;
  setNewPotentialController: ReactSetter<string | undefined>,
  shouldUpdate: boolean,
}) => {
  setFetchState(SplitFetchStates.Loading);

  if (!chainId || !replicaAddress) return setFetchState(SplitFetchStates.Idle);
  if (replicaAddress?.length !== 42) return setFetchState(SplitFetchStates.Idle);
  try {
    const client = createViemClient({
      chainId,
    });
    const splitAddress = (await client.readContract({
      abi: APP_ABIS.NETWORK_REGISTRY,
      address: replicaAddress,
      functionName: 'split',
      args: [],
    })) as string;
    const splitMainAddress = (await client.readContract({
      abi: APP_ABIS.NETWORK_REGISTRY,
      address: replicaAddress,
      functionName: 'splitMain',
      args: [],
    })) as EthAddress;

    const newPotentialController = (await client.readContract({
      abi: APP_ABIS.ISPLIT_MAIN,
      address: splitMainAddress,
      functionName: 'getNewPotentialController',
      args: [splitAddress],
    })) as string;

    if (shouldUpdate) {
      setNewPotentialController(newPotentialController.toLocaleLowerCase());
      setFetchState(SplitFetchStates.Success);
    }

  } catch (error) {
    console.error(error);
    setFetchState(SplitFetchStates.Error);
  }
};

export const ReplicaValidatorField = (props: Buildable<Field>) => {
  const { watch } = useFormContext();
  const [fetchState, setFetchState] = useState<SplitFetchStates>(SplitFetchStates.Idle);
  const [newPotentialController, setNewPotentialController] = useState<string>();

  const [chainId, replicaAddress] = watch(["chainID", props.id]);

  useEffect(() => {
    let shouldUpdate = true;
    fetchSplitControllerState({
      chainId,
      replicaAddress,
      setFetchState,
      setNewPotentialController,
      shouldUpdate,
    });
    return () => {
      shouldUpdate = false;
    };
  }, [chainId, replicaAddress]);

  const successMsg = fetchState === SplitFetchStates.Success &&
    newPotentialController === replicaAddress?.toLocaleLowerCase()
    ? ({
      type: 'success',
      message: SplitFetchStates.Success,
    } as SuccessMessage)
    : undefined;

  const invalidControllerError = fetchState === SplitFetchStates.Success &&
    newPotentialController === ZERO_ADDRESS
    ? ({
      type: 'error',
      message: `Attached 0xSplit must transfer control to the replica before proceeding`,
    } as ErrorMessage)
    : undefined;

  const error = fetchState === SplitFetchStates.Error
    ? ({
      type: 'error',
      message: SplitFetchStates.Error,
    } as ErrorMessage)
    : undefined;

  return (
    <WrappedInput
      {...props}
      helperText={fetchState}
      success={successMsg}
      error={invalidControllerError || error}
    />
  );
};
