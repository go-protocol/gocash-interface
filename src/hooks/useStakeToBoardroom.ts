import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBoardroom = () => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        basisCash.stakeShareToBoardroom(amount),
        `质押 ${amount} GOS 到董事会`,
      );
    },
    [basisCash],
  );
  return { onStake: handleStake };
};

export default useStakeToBoardroom;
