import { useCallback, useState, useEffect } from 'react';
import useBasisCash from './useBasisCash';
// import { Bank } from '../basis-cash';
// import { useTransactionAdder } from '../state/transactions/hooks';
import { BigNumber } from 'ethers';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import config from '../config';

const useWithdrawFromBoardroom = () => {
  const [canWithdraw, setCanWithdraw] = useState<Boolean>();
  const [canWithdrawTime, setCanWithdrawTime] = useState(BigNumber.from(0));
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const getCanWithdraw = useCallback(async () => {
    setCanWithdraw(await basisCash.canWithdrawFromBoardroom());
    setCanWithdrawTime(await basisCash.canWithdrawTimeFromBoardroom());
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
        basisCash.withdrawShareFromBoardroom(amount),
        `从董事会取出 ${amount} GOS`,
      );
    },
    [basisCash],
  );
  return { onWithdraw: handleWithdraw, canWithdraw,canWithdrawTime };
};

export default useWithdrawFromBoardroom;
