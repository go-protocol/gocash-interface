import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToLpBoardroom = () => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        basisCash.stakeShareToLpBoardroom(amount),
        `Stake ${amount} BAS to the boardroom`,
      );
    },
    [basisCash],
  );
  return { onStake: handleStake };
};

export default useStakeToLpBoardroom;
