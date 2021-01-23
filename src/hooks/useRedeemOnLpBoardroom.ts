import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnLpBoardroom = (description?: string) => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem BAS from Boardroom';
    handleTransactionReceipt(basisCash.exitFromLpBoardroom(), alertDesc);
  }, [basisCash]);
  return { onLpRedeem: handleRedeem };
};

export default useRedeemOnLpBoardroom;
