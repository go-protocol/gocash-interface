import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromBoardroom = () => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(basisCash.harvestCashFromBoardroom(), '从董事会收获GOC');
  }, [basisCash]);

  return { onReward: handleReward };
};

export default useHarvestFromBoardroom;
