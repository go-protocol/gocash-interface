import { useCallback } from 'react';
import useBasisCash from './useBasisCash';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useAllocateSeigniorage = () => {
  const basisCash = useBasisCash();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleAllocateSeigniorage = useCallback(() => {
    handleTransactionReceipt(basisCash.allocateSeigniorage(), '分配铸币税');
  }, [basisCash,handleTransactionReceipt]);

  return { onAllocateSeigniorage: handleAllocateSeigniorage };
};

export default useAllocateSeigniorage;
