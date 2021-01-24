import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnBoardroom = (description?: string) => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || '从董事会赎回GOS';
    handleTransactionReceipt(basisCash.exitFromBoardroom(), alertDesc);
  }, [basisCash,description,handleTransactionReceipt]);
  return { onRedeem: handleRedeem,handleTransactionReceipt };
};

export default useRedeemOnBoardroom;
