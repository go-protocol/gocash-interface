import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromLpBoardroom = () => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(basisCash.harvestCashFromLpBoardroom(), '从董事会收获GOC');
  }, [basisCash,handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvestFromLpBoardroom;
