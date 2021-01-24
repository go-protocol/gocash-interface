import { useCallback, useState, useEffect } from 'react';
import useBasisCash from './useBasisCash';
// import { Bank } from '../basis-cash';
// import { useTransactionAdder } from '../state/transactions/hooks';
import { BigNumber } from 'ethers';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import config from '../config';

const useWithdrawFromLpBoardroom = () => {
  const [canWithdrawLp, setCanWithdraw] = useState<Boolean>();
  const [canWithdrawTime, setCanWithdrawTime] = useState(BigNumber.from(0));
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const getCanWithdraw = useCallback(async () => {
    setCanWithdraw(await basisCash.canWithdrawFromLpBoardroom());
    setCanWithdrawTime(await basisCash.canWithdrawTimeFromLpBoardroom());
  }, [basisCash?.isUnlocked]);


  useEffect(() => {
    if (basisCash?.isUnlocked) {
      getCanWithdraw().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(getCanWithdraw, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [basisCash?.isUnlocked, setCanWithdraw,setCanWithdrawTime]);
  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        basisCash.withdrawShareFromLpBoardroom(amount),
        `Withdraw ${amount} BAS from the boardroom`,
      );
    },
    [basisCash],
  );
  return { onWithdraw: handleWithdraw, canWithdrawLp,canWithdrawTime };
};

export default useWithdrawFromLpBoardroom;
