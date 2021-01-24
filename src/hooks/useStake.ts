import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import { Bank } from '../basis-cash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useStake = (bank: Bank) => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      const amountBn = parseUnits(amount, bank.depositToken.decimal);
      handleTransactionReceipt(
        basisCash.stake(bank.contract, amountBn),
        `质押 ${amount} ${bank.depositTokenName} 到 ${bank.contract}`,
      );
    },
    [bank, basisCash,handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStake;
